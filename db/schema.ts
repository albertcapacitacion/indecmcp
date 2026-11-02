import { sqliteTable, text, integer, primaryKey, index } from "drizzle-orm/sqlite-core";
export const responseCache = sqliteTable("response_cache", {
  cacheKey: text("cache_key").primaryKey(), payload: text("payload").notNull(), expires: integer("expires").notNull()
}, table => [index("response_cache_expires").on(table.expires)]);
export const usageLimits = sqliteTable("usage_limits", {
  bucket: text("bucket").notNull(), window: integer("window").notNull(), hits: integer("hits").notNull(), expires: integer("expires").notNull()
}, table => [primaryKey({ columns: [table.bucket, table.window] }), index("usage_limits_expires").on(table.expires)]);
