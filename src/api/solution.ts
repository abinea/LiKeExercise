import service from './index'
import type { MessageResponse } from '@/types/request'
import type { Solution } from '@/types/store'

export function getAllSolution(
  problemId: number,
  data = {
    offset: 0,
    limit: 6,
  },
): Promise<{ solutions: Solution.solution[], solutionsNumber: number }> {
  return service({
    method: 'POST',
    url: `/v1/problem/${problemId}/solution/all`,
    data,
  })
}

export function createSolution(
  problemId: number,
  data: {
    title: string
    content: string
  },
): Promise<MessageResponse> {
  return service({
    method: 'POST',
    url: `/v1/problem/${problemId}/solution`,
    data,
  })
}

export function getSolutionDetail(
  problemId: number,
  solutionId: number,
): Promise<Solution.solution> {
  return service({
    method: 'GET',
    url: `/v1/problem/${problemId}/solution/${solutionId}`,
  })
}

export function deleteSolution(
  problemId: number,
  solutionId: number,
): Promise<MessageResponse> {
  return service({
    method: 'DELETE',
    url: `/v1/problem/${problemId}/solution/${solutionId}`,
  })
}

export function createComment(
  problemId: number,
  solutionId: number,
  comment: string,
): Promise<MessageResponse> {
  return service({
    method: 'POST',
    url: `/v1/problem/${problemId}/solution/${solutionId}/comment`,
    data: {
      content: comment,
    },
  })
}

export function deleteComment(
  problemId: number,
  solutionId: number,
  commentId: number,
): Promise<MessageResponse> {
  return service({
    method: 'DELETE',
    url: `/v1/problem/${problemId}/solution/${solutionId}/comment/${commentId}`,
  })
}

export function getCommenter(schoolId: number): Promise<Solution.CommentUser> {
  return service({
    method: 'GET',
    url: `/user/${schoolId}`,
  })
}

export function updateSolution(problemId: number, solutionId: number, data: {
  title: string
  content: string
  schoolId: number
}): Promise<MessageResponse> {
  return service({
    method: 'PUT',
    url: `/v1/problem/${problemId}/solution/${solutionId}`,
    data,
  })
}
