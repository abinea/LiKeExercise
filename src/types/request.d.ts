export interface MessageResponse {
  code: number // 执行结果，1为成功，0为失败
  message: string // 结果说明
}

export interface LoginForm {
  account: string // 邮箱, 学号/教工号
  password: string // 密码
}

export interface LoginResponse {
  token: string
}

export interface RegisterForm {
  email: string // 邮箱
  sid: string // 学号
  password: string // 密码
  checkPass: string
  username: string // 实名
  role: -1 | 0 | 1 | 2 // 角色, -1为未选择，0为管理员，1为学生，2为教师
  avatar?: "" // 头像，有默认
}

