/**
 * Client-side visitor tracking
 * Fire-and-forget implementation - never blocks or shows errors
 */

export function trackVisit(token: string, action = 'visit', path?: string) {
  // Skip if SSR or bot
  if (typeof window === 'undefined') return;
  if (navigator.userAgent.includes('bot')) return;
  
  // Fire-and-forget
  fetch('http://localhost:3000/api/visitor/track', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      key: token,
      action,
      path: path || window.location.pathname
    }),
    signal: AbortSignal.timeout(3000)
  }).catch(() => {}); // Silent fail
}
