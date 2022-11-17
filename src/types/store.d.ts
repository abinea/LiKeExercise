export namespace User {
  interface userInfo {
    name: string // 实名
    schoolID: string // 学号/教工号
    password: string // 密码
    email: string // 邮箱
    avatar: string // 头像路径，有默认头像
    // major?: string // 专业，老师没有专业
    // college: string // 学院
    role: "student" | "teacher"
    isAdmin: boolean
    token?: string // token
  }
}

export namespace Question {
  interface question {
    title: string // 题目搜索
    subject: string // 学科
    id: UUID // id
    count: number // 做过人数
    content: string // 内容
    status: boolean // 做过？
  }
}

export namespace Favor {
  interface favorite {
    id: UUID // id
    title: string // 题目搜索
    subject: string // 学科
    count: number // 做过人数
    content: string // 内容
    isDone: boolean // 做过？
  }

  interface favorSet {
    data: favorite[]
  }
}
