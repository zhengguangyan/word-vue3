import axios, {
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosRequestHeaders,
  AxiosResponse,
  AxiosError
} from 'axios'

import qs from 'qs'
import { useTagsViewStore } from '@/store/modules/tagsView'
import { resetRouter } from '@/router'
import router from '../../router'
import { useCache } from '@/hooks/web/useCache'
import { config } from './config'
import Cookies from 'js-cookie'
import { ElMessage, ElMessageBox } from 'element-plus'
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
// const { replace } = useRouter()
// const getToken = "eyJhbGciOiJIUzUxMiJ9.eyJsb2dpbl91c2VyX2tleSI6IjRiYWZlN2UzLTcxYjgtNDJjOC05ZTdjLWUwNzYwNGU0Njk0ZCJ9.q1Yo_AMwEjvjiTyS0RXd9ruhhonrRROeHTKnnS5EdLV_9AA-l6IQXb4203uH9qIZ5oeBt0-ra_viZHX_oHaNpg"
const { result_code, base_url } = config
const { wsCache } = useCache()
const tagsViewStore = useTagsViewStore()
export const PATH_URL = base_url[import.meta.env.VITE_API_BASEPATH]

// 创建axios实例
const service: AxiosInstance = axios.create({
  baseURL: PATH_URL, // api 的 base_url
  timeout: config.request_timeout // 请求超时时间
})
// axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8'
// request拦截器
service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (
      config.method === 'post' &&
      (config.headers as AxiosRequestHeaders)['Content-Type'] ===
        'application/x-www-form-urlencoded'
    ) {
      config.data = qs.stringify(config.data)
    }
    // const isToken = (config.headers || {}).isToken === false
    // 是否需要防止数据重复提交
    // if (getToken) {
    //   config.headers['Authorization'] = 'Bearer ' + getToken // 让每个请求携带自定义token 请根据实际情况自行修改
    // }
    ;(config.headers as AxiosRequestHeaders)['Authorization'] = Cookies.get('TokenKey')
    // get参数编码
    if (config.method === 'get' && config.params) {
      let url = config.url as string
      url += '?'
      const keys = Object.keys(config.params)
      for (const key of keys) {
        if (config.params[key] !== void 0 && config.params[key] !== null) {
          url += `${key}=${encodeURIComponent(config.params[key])}&`
        }
      }
      url = url.substring(0, url.length - 1)
      config.params = {}
      config.url = url
    }
    return config
  },
  (error: AxiosError) => {
    // Do something with request error
    Promise.reject(error)
  }
)
let object401 = false
// response 拦截器
service.interceptors.response.use(
  (response: AxiosResponse<any>) => {
    if (response.config.responseType === 'blob') {
      // 如果是文件流，直接过
      return response
    } else if (response.data.code == result_code) {
      object401 = false
      return response.data
    } else if (response.data.code == 401) {
      if(object401)return
      object401 = true
      ElMessageBox.alert(response.data.msg, '系统提示', {
        confirmButtonText: '确定',
        callback: () => {
          wsCache.clear()
          tagsViewStore.delAllViews()
          resetRouter() // 重置静态路由表
          router.replace('/login')
          location.reload()
        },
      })


      // wsCache.clear()
      // tagsViewStore.delAllViews()
      // resetRouter() // 重置静态路由表
      // router.replace('/login')


      // ElMessageBox.confirm('登录状态已过期，您可以继续留在该页面，或者重新登录', '系统提示', {
      //   confirmButtonText: '重新登录',
      //   cancelButtonText: '取消',
      //   type: 'warning'
      // })
      //   .then(async () => {
      //     // ElMessage.error('身份已经失效,请重新登录')
      //     wsCache.clear()
      //     tagsViewStore.delAllViews()
      //     resetRouter()
      //     location.reload()
      //     // replace('/login') // 重置静态路由表
      //   })
      //   .catch(() => {
      //     // isRelogin.show = false;
      //   })

      // replace('/login')
    } else if (response.data.code == 400) {
      // ElMessageBox.confirm(response.data.msg, '系统提示', {
      //   confirmButtonText: '确定',
      //   cancelButtonText: '取消',
      //   type: 'error'
      // })
      ElMessage.error(response.data.msg)
   
    } else if (response.data.code == 501) {
      ElMessage.error(response.data.msg)
      closeNow()
    } else {
      ElMessage.error(response.data.msg)
    }
    return Promise.reject(response.data.msg)
  },
  (error: AxiosError) => {
    // ElMessage.error(error.message)
    if (error.response?.status === 404) {
      ElMessage.error('请求的资源不存在')
    }
    return Promise.reject(error)
  }
)



// 关闭当前标签
const visitedViews = computed(() => tagsViewStore.getVisitedViews)
const closeNow = () => {
  const obj = visitedViews.value.find(
    (item) => item.fullPath === '/customer/addressChangeStatistics'
  )
  if (obj) {
    tagsViewStore.delView(obj)
    router.push('/dashboard/analysis')
  }
}

export { service }
