import { LoginForm, RegisterForm, ResponseData } from "../types/request"
import service from "./service"

function login(data: LoginForm) {
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

function info() {
  return service({
    method: "GET",
    url: "/info",
  })
}

function resetCaptcha(params: { email: string }) {
  return service({
    method: "GET",
    url: "/resetPasswd",
    params,
  })
}

function resetValid(data: { email: string; captcha: string }) {
  return service({
    method: "POST",
    url: "/resetPasswd",
    data,
  })
}

function resetPassword(data: { email: string; newPasswd: string }) {
  return service({
    method: "PUT",
    url: "/resetPasswd",
    data,
  })
}

const user = {
  login,
  register,
  info,
  resetCaptcha,
  resetValid,
  resetPassword,
}

export default user
