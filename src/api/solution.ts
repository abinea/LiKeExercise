import service from './index'
import type { MessageResponse } from '@/types/request'
import type { Solution } from '@/types/store'

export function solutionAll(
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

export function solutionCreate(
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

export function solutionDetail(
  problemId: number,
  solutionId: number,
): Promise<Solution.solution> {
  return service({
    method: 'GET',
    url: `/v1/problem/${problemId}/solution/${solutionId}`,
  })
}

export function solutionDetele(
  problemId: number,
  solutionId: number,
): Promise<MessageResponse> {
  return service({
    method: 'DELETE',
    url: `/v1/problem/${problemId}/solution/${solutionId}`,
  })
}

export function commentCreate(
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

export function commentDelete(
  problemId: number,
  solutionId: number,
  commentId: number,
): Promise<MessageResponse> {
  return service({
    method: 'DELETE',
    url: `/v1/problem/${problemId}/solution/${solutionId}/comment/${commentId}`,
  })
}

export function commentUser(schoolId: number): Promise<Solution.CommentUser> {
  return service({
    method: 'GET',
    url: `/user/${schoolId}`,
  })
}

export function solutionUpdate(problemId: number, solutionId: number, data: {
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
