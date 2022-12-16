import { MessageResponse } from "@/types/request"
import { Problem, Solution } from "@/types/store"
import service from "./service"

function solutionAll(
  problemId: number,
  data = {
    offset: 0,
    limit: 6,
  }
): Promise<{ solutions: Solution.solution[]; solutionsNumber: number }> {
  return service({
    method: "POST",
    url: `/v1/problem/${problemId}/solution/all`,
    data,
  })
}

function solutionCreate(
  problemId: number,
  data: {
    title: string
    content: string
  }
) {
  return service({
    method: "POST",
    url: `/v1/problem/${problemId}/solution`,
    data,
  })
}

function solutionDetail(
  problemId: number,
  solutionId: number
): Promise<Solution.solution> {
  return service({
    method: "GET",
    url: `/v1/problem/${problemId}/solution/${solutionId}`,
  })
}

function solutionDetele(
  problemId: number,
  solutionId: number
): Promise<MessageResponse> {
  return service({
    method: "DELETE",
    url: `/v1/problem/${problemId}/solution/${solutionId}`,
  })
}

function commentCreate(
  problemId: number,
  solutionId: number,
  comment: string
): Promise<MessageResponse> {
  return service({
    method: "POST",
    url: `/v1/problem/${problemId}/solution/${solutionId}/comment`,
    data: {
      content: comment,
    },
  })
}

function commentDelete(
  problemId: number,
  solutionId: number,
  commentId: number
): Promise<MessageResponse> {
  return service({
    method: "DELETE",
    url: `/v1/problem/${problemId}/solution/${solutionId}/comment/${commentId}`,
  })
}

function commentUser(schoolId: number): Promise<Solution.CommentUser> {
  return service({
    method: "GET",
    url: `/user/${schoolId}`,
  })
}

function solutionUpdate( problemId: number, solutionId: number, data: {
  title: string
  content: string,
  schoolId: number
}){
  return service({
    method: "PUT",
    url: `/v1/problem/${problemId}/solution/${solutionId}`,
    data
  })
}


const solutionApi = {
  solutionAll,
  solutionDetail,
  solutionCreate,
  solutionUpdate,
  solutionDetele,
  commentCreate,
  commentDelete,
  commentUser,
}

export default solutionApi
