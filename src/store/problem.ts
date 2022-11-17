import { defineStore } from "pinia"
import problem from "@/api/problem"

export const difficultyMap = {
  'EASY': '简单',
  'MEDIUM': '中等',
  'HARD': '困难'
}

const filterFunc = (property: any, value: any, arr: any[]) => arr.filter(item => item[property] === value)


export const problemStore = defineStore("problem", {
  state: () => ({}),
  actions: {
    async all() {
      console.log("problem all ")
      const res = await problem.problemAll()
      setStorage("problem", res)
      return res
    },
    async tags() {
      console.log("problem tag ")
      const res = await problem.problemTags()
      setStorage("tags", res)
      return res
    },
    async create(data: any) {
      console.log("problem create", data);
      const res: any = await problem.problemCreate(data)
      return res
    },
    async filter(data: any) {
      console.log('problem filter', data);
      // const res: any = await problem.problemFilter(data)
      const { title, category, difficulty, courseName, tags } = data
      let problemList = getStorage('problem')
      if (problemList) {
        if (category !== "") {
          problemList = filterFunc("category", category, problemList)
        }
        if (title) {
          console.log("======");
          problemList = problemList.filter((item: any) => item.title.includes(title))
        }
        if (courseName) {
          problemList = filterFunc("courseName", courseName, problemList)
        }
        if (difficulty) {
          problemList = filterFunc("difficulty", difficulty, problemList)
        }
        if (tags.length > 0) {
          const tagName = tags[0]['tagName']
          console.log(tags, tagName);
          if (tagName !== '')
            problemList = problemList.filter((item: any) => {
              console.log(item.tags);
              return item.tags.some((tag: any) => tag['tagName'] == tagName)
            })
        }
      }
      return problemList
    }
  },
})
