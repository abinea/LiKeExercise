import service from './index'
import type { User } from '@/types/store'
import type { LoginForm, MessageResponse } from '@/types/request'

export function login(data: LoginForm): Promise<MessageResponse | { token: string }> {
  return service({
    method: 'POST',
    url: '/login',
    data,
  })
}

export function register(data: any) {
  return service({
    method: 'POST',
    url: '/register',
    data,
  })
}

export function userInfo(): Promise<User.userInfo> {
  return service({
    method: 'GET',
    url: '/user/info',
  })
}

export function resetCaptcha(params: { email: string }): Promise<MessageResponse> {
  return service({
    method: 'GET',
    url: '/resetPasswd',
    params,
  })
}

export function resetValid(data: { email: string, captcha: string }): Promise<MessageResponse> {
  return service({
    method: 'POST',
    url: '/resetPasswd',
    data,
  })
}

export function resetPassword(data: { email: string, newPasswd: string }): Promise<MessageResponse> {
  return service({
    method: 'PUT',
    url: '/resetPasswd',
    data,
  })
}
