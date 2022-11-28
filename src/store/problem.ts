import { defineStore } from "pinia"
import problemApi from "@/api/problem"
import { Problem } from "@/types/store"

export const difficultyArr = ["简单", "中等", "困难"]

const filterFunc = (property: any, value: any, arr: any[]) =>
  arr.filter((item) => item[property] === value)

export const problemStore = defineStore("problem", {
  state: () => ({}),
  actions: {
    async list(
      data = {
        offset: 0, // 偏移
        limit: 20, // 分页大小
      }
    ) {
      console.log("筛选参数 ", data)
      const res = await problemApi.problemList(data)
      setStorage("problem", res)
      return res
    },
    async tags() {
      console.log("problem tag ")
      const res = await problemApi.problemTags()
      setStorage("tags", res)
      return res
    },
    async create(data: any) {
      console.log("problem create", data)
      const res: any = await problemApi.problemCreate(data)
      return res
    },
    async filter(difficulty: any) {
      let problemList = getStorage("problem")
      if (difficulty !== "") {
        problemList = problemList.filter(
          (item: any) => item["difficulty"] === difficulty
        )
      }
      return problemList
    },
    async favour(problemId: number) {
      const res = await problemApi.problemFavour(problemId)
      console.log(res)
    },
    async cancelFavour(problemId: number) {
      const res = await problemApi.problemCancelFavour(problemId)
      console.log(res)
    },
    async delete(problemId: number) {
      const res = await problemApi.problemDelete(problemId)
      console.log(res)
    },
    async detail(title: string) {
      const res = await problemApi.problemDetail(title)
      console.log(res)
    },
  },

  // async Oldfilter(data: any) {
  //     console.log("problem filter", data)
  //     // const res: any = await problem.problemFilter(data)
  //     const { title, category, difficulty, courseName, tags } = data
  //     let problemList = getStorage("problem")
  //     if (problemList) {
  //         if (category !== "") {
  //             problemList = filterFunc("category", category, problemList)
  //         }
  //         if (title) {
  //             problemList = problemList.filter((item: any) =>
  //                 item.title.includes(title)
  //             )
  //         }
  //         if (courseName) {
  //             problemList = filterFunc(
  //                 "courseName",
  //                 courseName,
  //                 problemList
  //             )
  //         }
  //         if (difficulty) {
  //             problemList = filterFunc(
  //                 "difficulty",
  //                 difficulty,
  //                 problemList
  //             )
  //         }
  //         if (tags.length > 0) {
  //             const tagName = tags[0]["tagName"]
  //             console.log(tags, tagName)
  //             if (tagName !== "")
  //                 problemList = problemList.filter((item: any) => {
  //                     console.log(item.tags)
  //                     return item.tags.some(
  //                         (tag: any) => tag["tagName"] == tagName
  //                     )
  //                 })
  //         }
  //     }
  //     return problemList
  // },
})
