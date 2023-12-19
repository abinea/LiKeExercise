import service from './index'
import type { MessageResponse } from '@/types/request'
import type { Problem } from '@/types/store'

export function getProblemList(
  data: Problem.filters = {
    offset: 0,
    limit: 10,
  },
): Promise<{ problems: Problem.problem[], problemsNumber: number }> {
  return service({
    method: 'POST',
    url: '/v1/problem/allWithTag',
    data,
  })
}

export function getProblemTags(): Promise<Problem.Tag[]> {
  return service({
    method: 'GET',
    url: '/v1/problem/tag',
  })
}

export function createProblem(data: any): Promise<MessageResponse> {
  return service({
    method: 'POST',
    url: '/v1/problem/create',
    data,
  })
}

export function favourProblem(problemId: number): Promise<MessageResponse> {
  return service({
    method: 'GET',
    url: '/v1/problem/collection',
    params: {
      problemId,
    },
  })
}

export function cancelFavourProblem(problemId: number): Promise<MessageResponse> {
  return service({
    method: 'DELETE',
    url: '/v1/problem/collection',
    params: {
      problemId,
    },
  })
}

export function deleteProblem(problemId: number): Promise<MessageResponse> {
  return service({
    method: 'DELETE',
    url: `/v1/problem/${problemId}`,
  })
}

/**
 * 获取具体题目详情
 */
export function getProblemDetail(problemId: number): Promise<Problem.problem> {
  return service({
    method: 'GET',
    url: `/v1/problem/${problemId}`,
  })
}

export function updateProblem(problemId: number, data: any): Promise<Problem.problem> {
  return service({
    method: 'PUT',
    url: `/v1/problem/${problemId}`,
    data,
  })
}

export function commitProblem(problemId: number): Promise<MessageResponse> {
  return service({
    method: 'GET',
    url: '/v1/problem/commit',
    params: {
      problemId,
    },
  })
}
