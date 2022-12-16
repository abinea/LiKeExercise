import { defineStore } from "pinia"
import user from "@/api/user"
import { LoginForm, RegisterForm } from "@/types/request"

export default defineStore("user", {
  state: () => ({
    userInfo: {
      email: "", // 邮箱
      password: "", // 密码
      username: "", // 实名
      schoolId: 0, // 学号/教工号
      role: 0,
      avatar: "", // 头像路径，有默认头像
    },
  }),
  actions: {
    setUserInfo(userInfo: any) {
      this.userInfo = { ...this.userInfo, ...userInfo }
    },
  },
})
