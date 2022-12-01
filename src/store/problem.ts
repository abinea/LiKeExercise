import { defineStore } from "pinia"
import { Problem } from "@/types/store"


interface ProblemState {
  problemList: Problem.problem[],
  tags: Problem.Tag[]
  courses: string[]
  difficultyArr: string[]
  categoryArr: string[]
}

export default defineStore("problem", {
  state: (): ProblemState => ({
    problemList: [],
    tags: [],
    courses: ["软件工程", "数据结构", "程序设计"],
    difficultyArr: ["全部", "简单", "中等", "困难"],
    categoryArr: ["全部", "选择", "填空", "大题", "代码"]
  }),
  actions: {
    setProblemList(problemList: Problem.problem[]) {
      this.problemList = problemList
      console.log(problemList);
    },
    setTags(tags: Problem.Tag[]) {
      this.tags = tags
    },
    setCourses(courses: string[]) {
      this.courses = courses
    },
  },
})
