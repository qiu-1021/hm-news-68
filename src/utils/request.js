// 发送axios请求
import Vue from 'vue'
import router from '../router'
import axios from 'axios'
import { Toast } from 'vant'

// 把axios挂载到vue的原型
Vue.prototype.$axios = axios
// 给axios配置默认的baseURL ,基准地址
const URL = 'http://localhost:3000'
axios.defaults.baseURL = '/abc'
Vue.prototype.$base = URL
// 给axios配置拦截器
axios.interceptors.request.use(function (config) {
  // config指的是请求的配置信息
  // console.log('拦截到了请求', config)
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = token
  }
  return config
})
axios.interceptors.response.use(function (response) {
  // console.log('拦截到了响应', response)
  const { statusCode, message } = response.data
  if (statusCode === 401 && message === '用户验证信息失败') {
    // console.log('token失效')
    // 跳转登陆页面
    router.push('/login')
    // 清除失败信息
    localStorage.removeItem('token')
    localStorage.removeItem('userId')
    // 给提示 用户验证失败
    Toast.fail('登陆信息失败')
  }
  return response
})
Vue.prototype.$url = function (url) {
  if (url.startsWith('http')) {
    // 网络图片
    return url
  } else {
    return URL + url
  }
}
