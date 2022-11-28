import { defineStore } from "pinia"
import user from "@/api/user"
import { LoginForm, RegisterForm } from "@/types/request"

enum roleMap {
  "管理员",
  "学生",
  "老师",
}

export const userStore = defineStore("user", {
  state: () => ({
    userInfo: {
      email: "", // 邮箱
      password: "", // 密码
      username: "", // 实名
      schoolId: 0, // 学号/教工号
      role: 0,
      gender: "", // 性别
      avatar: "", // 头像路径，有默认头像
    },
    token: "",
  }),
  actions: {
    setUserInfo(userInfo: any) {
      this.userInfo = { ...this.userInfo, ...userInfo }
    },
    async login(data: LoginForm) {
      console.log("login ", data)
      const res: any = await user.login(data)
      setCookie("token", res.token)
      this.token = res.token
    },
    logout() {
      removeCookie("token")
    },
    async register(data: RegisterForm) {
      console.log("register ", data)
      const registerData: any = toRaw(data)
      registerData.schoolId = Number(data.sid)
      const res: any = await user.register(registerData)
      console.log(res, data)
      res.password = data.password
      this.setUserInfo(res)
    },
    async resetCaptcha(data: { email: string }) {
      return await user.resetCaptcha(data)
    },
    async resetValid(data: { email: string; captcha: string }) {
      const res = await user.resetValid(data)
      console.log(res)
    },
    async resetPassword(data: { email: string; newPasswd: string }) {
      const res = await user.resetPassword(data)
      console.log(res)
    },
  },
})
