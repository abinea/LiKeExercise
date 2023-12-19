/**
 * @param key cookie的键
 * @param value cookie的值
 * @param expires cookie的过期时间（天数），不传则关闭会话后失效，传参为负数则清除该cookie
 * @param path cookie生效路径范围，默认"/"全局生效
 */
export function setCookie(
  key: string,
  value: string | number,
  expires: number = 0,
  path: string = '/',
) {
  let cookie = `${key}=${encodeURIComponent(value)};path=${path};`
  if (expires !== 0) {
    const date = new Date()
    date.setDate(date.getDate() + expires)
    cookie += `expires=${date.toUTCString()}`
  }
  document.cookie = cookie
}

/**
 * @param key cookie的键
 * @returns cookie的值
 */
export function getCookie(key: string) {
  const reg = new RegExp(`(^| )${encodeURIComponent(key)}=([^;]+)`)
  const match = document.cookie.match(reg)
  return match ? decodeURIComponent(match[2]) : ''
}

/**
 *
 * @param key 移除的cookie的键名
 */
export function removeCookie(key: string) {
  setCookie(key, '', -1)
}
