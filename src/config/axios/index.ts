import { service } from './service'

import { config } from './config'

import { useCache } from '@/hooks/web/useCache'
const { wsCache } = useCache()

const { default_headers } = config

const { default_headers_form } = config

const request = (option: any) => {
  const { url, method, params, data, headersType, responseType } = option
  let areaCode = wsCache.get('areaCode')
  let areaProjectCode = wsCache.get('areaProjectCode')
  if (data?.areaCode) {
    areaCode = data.areaCode
  }
  if (data?.areaProjectCode) {
    areaProjectCode = data.areaProjectCode
  }
  return service({
    url: url,
    method,
    params,
    data: { ...data, areaCode, areaProjectCode },
    responseType: responseType,
    headers: {
      'Content-Type': headersType || default_headers
    }
  })
}

const requestFile = (option: any) => {
  const { url, method, params, data, headersType, responseType } = option
  return service({
    url: url,
    method,
    params,
    data,
    responseType: responseType,
    headers: {
      'Content-Type': headersType || default_headers_form
    }
  })
}

export default {
  get: <T = any>(option: any) => {
    return request({ method: 'get', ...option }) as unknown as T
  },
  post: <T = any>(option: any) => {
    return request({ method: 'post', ...option }) as unknown as T
  },
  delete: <T = any>(option: any) => {
    return request({ method: 'delete', ...option }) as unknown as T
  },
  put: <T = any>(option: any) => {
    return request({ method: 'put', ...option }) as unknown as T
  },
  postFile: <T = any>(option: any) => {
    return requestFile({ method: 'post', ...option }) as unknown as T
  }
}
