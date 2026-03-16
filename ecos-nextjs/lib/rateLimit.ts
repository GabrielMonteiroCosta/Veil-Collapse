import { LRUCache } from 'lru-cache'

type Options = {
  uniqueTokenPerInterval?: number // max IPs tracked simultaneously
  interval?: number               // window in ms
}

export function rateLimit(opts: Options = {}) {
  const tokenCache = new LRUCache<string, number[]>({
    max: opts.uniqueTokenPerInterval ?? 500,
    ttl: opts.interval ?? 60_000,
  })

  return {
    check(limit: number, token: string): { success: boolean; remaining: number } {
      const now = Date.now()
      const windowStart = now - (opts.interval ?? 60_000)

      const timestamps = (tokenCache.get(token) ?? []).filter(t => t > windowStart)
      const remaining = Math.max(0, limit - timestamps.length)

      if (timestamps.length >= limit) {
        return { success: false, remaining: 0 }
      }

      timestamps.push(now)
      tokenCache.set(token, timestamps)
      return { success: true, remaining: remaining - 1 }
    },
  }
}
