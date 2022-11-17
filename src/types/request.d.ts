interface ResponseData<T> {
  code: 1 | 0 // 执行结果，1为成功，0为失败
  msg: string // 结果说明
  data: T | null // 数据
}

export interface LoginForm {
  account: string // 邮箱, 学号/教工号
  password: string // 密码
}

export interface RegisterForm {
  email: string // 邮箱
  sid: string // 学号
  password: string // 密码
  checkPass: string
  username: string // 实名
  college: string // 学院
  role: -1 | 0 | 1 | 2 // 角色, -1为未选择，0为管理员，1为学生，2为教师
  avatar?: "" // 头像，有默认
}

export interface Proplem { }
