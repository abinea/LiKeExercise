/**
 * @summary 验证字段是不是邮箱
 * @param {string} str
 * @returns {Boolean}
 */
export const isEmail = (str: string) => {
  const reg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/
  return reg.test(str)
}