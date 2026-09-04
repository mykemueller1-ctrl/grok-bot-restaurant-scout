/**
 * In-memory sliding-window rate limiter for auth endpoints.
 * Keyed by IP + venue to blunt credential stuffing without Redis for local/demo.
 */
export function createRateLimiter({
  windowMs = 60_000,
  max = 10,
} = {}) {
  const hits = new Map();

  function prune(now) {
    for (const [k, arr] of hits) {
      const next = arr.filter((t) => now - t < windowMs);
      if (next.length) hits.set(k, next);
      else hits.delete(k);
    }
  }

  return {
    check(key) {
      const now = Date.now();
      if (hits.size > 5000) prune(now);
      const arr = (hits.get(key) || []).filter((t) => now - t < windowMs);
      if (arr.length >= max) {
        return { ok: false, retryAfterSec: Math.ceil((windowMs - (now - arr[0])) / 1000) };
      }
      arr.push(now);
      hits.set(key, arr);
      return { ok: true, remaining: max - arr.length };
    },
    reset() {
      hits.clear();
    },
  };
}
