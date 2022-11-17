import { message } from "ant-design-vue"
import "ant-design-vue/lib/message/style/css"
import axios from "axios"

const service = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API,
  timeout: 5000,
})

const token = getCookie("token")

service.interceptors.request.use(
  (req) => {
    console.log(req.headers,token)
    if (req.headers && token) {
      req.headers["Authorization"] ='Bearer '+ token
    }
    return req
  },
  (error) => {
    console.error("request",error)
    return Promise.reject(error)
  }
)

service.interceptors.response.use(
  (res) => {
    const body = res.data
    console.log(body)
    if (body.code) {
      message.error(body.message || "请求失败，请检查数据是否正确", 2)
      return Promise.reject(new Error(body.message))
    } else {
      message.success("请求成功", 2)
      return body
    }
  },
  (error) => {
    console.error(error)
    message.error(error.message, 2)
  }
)

export default service
