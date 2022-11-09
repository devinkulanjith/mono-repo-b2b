export const VTEX_SESSION = 'vtex_session'

export function getSessionTokenFromCookie(cookies: Context['cookies']) {
  return cookies.get(VTEX_SESSION)
}
