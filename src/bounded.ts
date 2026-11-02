import { ServiceError } from "./errors.js";

export async function readBoundedJson(stream: ReadableStream<Uint8Array> | null, maxBytes: number, signal?: AbortSignal): Promise<unknown> {
  if (!stream) throw new ServiceError("INVALID_RESPONSE", "A JSON body is required.");
  const reader = stream.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  const cancel = () => { void reader.cancel().catch(() => undefined); };
  signal?.addEventListener("abort", cancel, { once: true });
  try {
    while (true) {
      signal?.throwIfAborted();
      const chunk = await reader.read();
      signal?.throwIfAborted();
      if (chunk.done) break;
      size += chunk.value.byteLength;
      if (size > maxBytes) throw new ServiceError("BODY_TOO_LARGE", "The response exceeds the configured byte limit.");
      chunks.push(chunk.value);
    }
    const bytes = new Uint8Array(size);
    let offset = 0;
    for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.length; }
    try { return JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(bytes)); }
    catch { throw new ServiceError("INVALID_RESPONSE", "The response is not valid JSON."); }
  } finally {
    signal?.removeEventListener("abort", cancel);
    await reader.cancel().catch(() => undefined);
    reader.releaseLock();
  }
}
