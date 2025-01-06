// 通用下载方法
import { service } from '@/config/axios/service'
import { ElLoading, ElMessage } from 'element-plus'
import { useCache } from '@/hooks/web/useCache'
import { useAppStoreWithOut } from '@/store/modules/app'
import { saveAs } from 'file-saver'
const { wsCache } = useCache()
const appStores = useAppStoreWithOut()
const permissions = wsCache.get(appStores.getUserInfo).permissions
// 验证是否为blob格式
export function blobValidate(data) {
  return data.type != 'application/json'
}
let downloadLoadingInstance
export function tansParams(params) {
  let result = ''
  for (const propName of Object.keys(params)) {
    const value = params[propName]
    var part = encodeURIComponent(propName) + '='
    if (value != null && value != '' && typeof value != 'undefined') {
      if (typeof value == 'object') {
        for (const key of Object.keys(value)) {
          if (value[key] != null && value[key] != '' && typeof value[key] != 'undefined') {
            let params = propName + '[' + key + ']'
            var subPart = encodeURIComponent(params) + '='
            result += subPart + encodeURIComponent(value[key]) + '&'
          }
        }
      } else {
        result += part + encodeURIComponent(value) + '&'
      }
    }
  }
  return result
}
export function download(url, params, filename, config) {
  downloadLoadingInstance = ElLoading.service({
    text: '正在下载数据，请稍候',
    background: 'rgba(0, 0, 0, 0.7)'
  })
  return service
    .post(url, params, {
      transformRequest: [
        (params) => {
          return params
        }
      ],
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      responseType: 'blob',
      ...config
    })
    .then(async (res) => {
      const isBlob = blobValidate(res.data)
      if (isBlob) {
        let blob = new Blob([res.data], { type: 'text/plain;charset=utf-8' })
        saveAs(blob, filename)
      } else {
        const resText = await res.data.text()
        const rspObj = JSON.parse(resText)
        const errMsg = errorCode[rspObj.code] || rspObj.msg || errorCode['default']
        ElMessage.error(errMsg)
      }
      downloadLoadingInstance.close()
    })
    .catch((r) => {
      console.error(r)
      ElMessage.error('下载文件出现错误，请联系管理员！')
      downloadLoadingInstance.close()
    })
}

//根据权限配置判断按钮状态是否可点击。true不可点击，false可点击
export function getAuth(auth) {
  if (permissions?.includes(auth) || permissions?.includes('*:*:*')) {
    return false
  } else {
    return true
  }
}
