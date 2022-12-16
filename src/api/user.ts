import { User } from "@/types/store"
import { LoginForm, MessageResponse } from "@/types/request"
import service from "./service"

function login(data: LoginForm): Promise<MessageResponse | { token: string }> {
  return service({
    method: "POST",
    url: "/login",
    data,
  })
}

function register(data: any) {
  return service({
    method: "POST",
    url: "/register",
    data,
  })
}

function info(): Promise<User.userInfo> {
  return service({
    method: "GET",
    url: "/user/info",
  })
}

function resetCaptcha(params: { email: string }): Promise<MessageResponse> {
  return service({
    method: "GET",
    url: "/resetPasswd",
    params,
  })
}

function resetValid(data: { email: string; captcha: string }): Promise<MessageResponse> {
  return service({
    method: "POST",
    url: "/resetPasswd",
    data,
  })
}

function resetPassword(data: { email: string; newPasswd: string }): Promise<MessageResponse> {
  return service({
    method: "PUT",
    url: "/resetPasswd",
    data,
  })
}

const userApi = {
  login,
  register,
  info,
  resetCaptcha,
  resetValid,
  resetPassword,
}

export default userApi
