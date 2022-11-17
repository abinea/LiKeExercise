/**
 *
 * @param key localStorage的键
 * @param value localStorage的值
 */
export function setStorage(key: string, value: any) {
  localStorage.setItem(key, JSON.stringify(value))
}

/**
 * @param key localStorage的键
 * @returns localStorage的值,如果不存在则返回null
 */
export function getStorage(key: string) {
  return JSON.parse(localStorage.getItem(key)) || ""
}

/**
 * @param key 移除的localStorage的键名
 */
export function removeStorage(key: string) {
  localStorage.removeItem(key)
}
