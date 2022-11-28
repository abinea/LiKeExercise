import { Problem } from "@/types/store"
import service from "./service"

function problemList(data: any): Promise<Problem.problem[]> {
  return service({
    method: "POST",
    url: "/v1/problem/allWithTag",
    data,
  })
}

function problemTags() {
  return service({
    method: "GET",
    url: "/v1/problem/tag",
  })
}

function problemCreate(data: any) {
  return service({
    method: "POST",
    url: "/v1/problem/create",
    data,
  })
}

function problemFavour(problemId: number) {
  return service({
    method: "GET",
    url: "/v1/problem/collection",
    params: {
      problemId,
    },
  })
}

function problemCancelFavour(problemId: number) {
  return service({
    method: "DELETE",
    url: "/v1/problem/collection",
    params: {
      problemId,
    },
  })
}

function problemDelete(problemId: number) {
  return service({
    method: "DELETE",
    url: `/v1/problem/${problemId}`,
  })
}
/**
 * 获取具体题目详情
 */
function problemDetail(title: string) {
  return service({
    method: "GET",
    url: `/v1/problem/${title}`,
  })
}

export default {
  problemList,
  problemCreate,
  problemTags,
  problemFavour,
  problemCancelFavour,
  problemDelete,
  problemDetail,
}
