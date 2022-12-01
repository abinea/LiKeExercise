import { number } from "echarts"
import { type } from "os"

export namespace User {
  interface userInfo {
    name: string // 实名
    schoolID: string // 学号/教工号
    password: string // 密码
    email: string // 邮箱
    avatar: string // 头像路径，有默认头像
    // major?: string // 专业，老师没有专业
    // college: string // 学院
    role: -1 | 0 | 1 | 2 // -1默认值，0为管理员，1为学生，2为老师
    isAdmin: boolean
    token?: string // token
  }
}

export namespace Problem {
  type Tag = {
    tagName: string
  }

  type Order = {
    orderBy: string
    sortOrder: "DESC" | "ASC" | ""
  }

  interface problem {
    // TODO: 具体命名id
    id: UUID // 题目id
    title: string // 题目标题
    question: string // 题目内容
    courseName: string // 课程
    category: "选择" | "填空" | "大题" | "代码" | "" // 题目类型
    difficulty: 0 | 1 | 2 | 3 // 难度，0-用于筛选全部，1-简单，2-中等，3-困难
    tags: Tag[] | [] // 题目标签
    Cnt: number // 通过人数
    favour: boolean // 是否收藏
    pass: boolean // 是否做过
    schoolId: number // 出题人id
    deletedAt?: Date
  }

  interface filters {
    category?: string // 题目类型
    courseName?: string // 课程
    searcherKeyWords?: string | number // 题目 或 题目id
    orders?: Order[] | []
    tag?: string // 标签
    difficulty?: number
    offset: number // 偏移，首页为0
    limit: number // 分页大小
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
