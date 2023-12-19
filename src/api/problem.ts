import service from './index'
import type { MessageResponse } from '@/types/request'
import type { Problem } from '@/types/store'

export function problemList(
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

export function problemTags(): Promise<Problem.Tag[]> {
  return service({
    method: 'GET',
    url: '/v1/problem/tag',
  })
}

export function problemCreate(data: any): Promise<MessageResponse> {
  return service({
    method: 'POST',
    url: '/v1/problem/create',
    data,
  })
}

export function problemFavour(problemId: number): Promise<MessageResponse> {
  return service({
    method: 'GET',
    url: '/v1/problem/collection',
    params: {
      problemId,
    },
  })
}

export function problemCancelFavour(problemId: number): Promise<MessageResponse> {
  return service({
    method: 'DELETE',
    url: '/v1/problem/collection',
    params: {
      problemId,
    },
  })
}

export function problemDelete(problemId: number): Promise<MessageResponse> {
  return service({
    method: 'DELETE',
    url: `/v1/problem/${problemId}`,
  })
}

/**
 * 获取具体题目详情
 */
export function problemDetail(problemId: number): Promise<Problem.problem> {
  return service({
    method: 'GET',
    url: `/v1/problem/${problemId}`,
  })
}

export function problemModify(problemId: number, data: any): Promise<Problem.problem> {
  return service({
    method: 'PUT',
    url: `/v1/problem/${problemId}`,
    data,
  })
}

export function problemCommit(problemId: number): Promise<MessageResponse> {
  return service({
    method: 'GET',
    url: '/v1/problem/commit',
    params: {
      problemId,
    },
  })
}
