import { message } from 'ant-design-vue'
import 'ant-design-vue/lib/message/style/css'
import axios from 'axios'
import Cookies from 'js-cookie'

const service = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API,
  timeout: 5000,
})

service.interceptors.request.use(
  (req) => {
    const token = Cookies.get('token')
    if (req.headers && token)
      req.headers.Authorization = `Bearer ${token}`

    return req
  },
  (error) => {
    console.error('request', error)
    message.error('请求失败')
    return Promise.reject(error)
  },
)

service.interceptors.response.use(
  (res) => {
    const body = res.data
    if (body.code) {
      message.error(body.message || '请求失败，请检查数据是否正确', 2)
      return Promise.reject(new Error(body.message))
    }
    else {
      return body
    }
  },
  (error) => {
    console.error(error)
    message.error(error.message, 2)
  },
)

export default service
