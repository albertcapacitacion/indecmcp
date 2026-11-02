import { ServiceError } from "./errors.js";

export interface CacheEntry { payload: string; expires: number; }
export interface State {
  cached(key: string): Promise<string | null>;
  cache(key: string, payload: string, expires: number): Promise<void>;
  consume(key: string, limit: number, windowSeconds: number): Promise<void>;
}
export interface Database {
  prepare(sql: string): {
    bind(...values: (string | number | null)[]): {
      first<T>(): Promise<T | null>;
      run(): Promise<unknown>;
    };
  };
}

export class D1State implements State {
  constructor(private readonly db: Database, private readonly now = () => Date.now()) {}
  async cached(key: string) {
    const row = await this.db.prepare("SELECT payload FROM response_cache WHERE cache_key = ? AND expires > ?")
      .bind(key, this.now()).first<{ payload: string }>();
    return row?.payload ?? null;
  }
  async cache(key: string, payload: string, expires: number) {
    await this.db.prepare("INSERT INTO response_cache (cache_key, payload, expires) VALUES (?, ?, ?) ON CONFLICT(cache_key) DO UPDATE SET payload = excluded.payload, expires = excluded.expires")
      .bind(key, payload, expires).run();
  }
  async consume(key: string, limit: number, windowSeconds: number) {
    const now = this.now(); const window = Math.floor(now / (windowSeconds * 1000));
    const row = await this.db.prepare("INSERT INTO usage_limits (bucket, window, hits, expires) VALUES (?, ?, 1, ?) ON CONFLICT(bucket, window) DO UPDATE SET hits = hits + 1 WHERE hits < ? RETURNING hits")
      .bind(key, window, (window + 1) * windowSeconds * 1000, limit).first<{ hits: number }>();
    if (!row) throw new ServiceError("RATE_LIMITED", "The service usage limit has been reached. Retry after the current window.", true);
    // Bound retained operational state; this never deletes statistical observations.
    await this.db.prepare("DELETE FROM usage_limits WHERE rowid IN (SELECT rowid FROM usage_limits WHERE expires < ? LIMIT 100)").bind(now - 86_400_000).run();
    await this.db.prepare("DELETE FROM response_cache WHERE cache_key IN (SELECT cache_key FROM response_cache WHERE expires < ? LIMIT 100)").bind(now).run();
  }
}

/** Local development/testing only. Never selected by the production Worker. */
export class MemoryState implements State {
  private readonly entries = new Map<string, CacheEntry>();
  private readonly counts = new Map<string, { hits: number; expires: number }>();
  constructor(private readonly now = () => Date.now()) {}
  async cached(key: string) { const entry = this.entries.get(key); return entry && entry.expires > this.now() ? entry.payload : null; }
  async cache(key: string, payload: string, expires: number) { this.entries.set(key, { payload, expires }); }
  async consume(key: string, limit: number, seconds: number) {
    const now = this.now(); const expires = (Math.floor(now / (seconds * 1000)) + 1) * seconds * 1000;
    const entry = this.counts.get(key);
    const hits = entry && entry.expires > now ? entry.hits + 1 : 1;
    if (hits > limit) throw new ServiceError("RATE_LIMITED", "The service usage limit has been reached. Retry after the current window.", true);
    this.counts.set(key, { hits, expires });
    for (const [key, value] of this.counts) if (value.expires <= now) this.counts.delete(key);
    for (const [key, value] of this.entries) if (value.expires <= now) this.entries.delete(key);
  }
}
