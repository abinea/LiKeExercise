import service from "./service"

function problemAll(data = {
  offset: 0,
  limit: 20
}) {
  return service({
    method: "POST",
    url: "/v1/problem/all",
    data
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

function problemFilter(data: any) {
  return service({
    method: "POST",
    url: '/v1/problem/all',
    data
  })
}

export default {
  problemAll,
  problemCreate,
  problemTags,
  problemFilter,
}
