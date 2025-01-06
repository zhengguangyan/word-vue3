import request from '@/config/axios'
import type { TableData } from './types'

export const getConfigListApi = (params: any): Promise<IResponse> => {
  return request.get({ url: '/system/config/list', params })
}

export const getConfig = (configId: any): Promise<IResponse> => {
  return request.get({ url: '/system/config/', configId })
}

export const getConfigKey = (configKey: any): Promise<IResponse> => {
  return request.get({ url: '/system/config/configKey/', configKey })
}

export const addConfigApi = (data: Partial<TableData>): Promise<IResponse> => {
  return request.post({ url: '/system/config/add', data })
}

export const editConfigApi = (data: Partial<TableData>): Promise<IResponse> => {
  return request.post({ url: '/system/config/edit', data })
}

export const refreshCache = (): Promise<IResponse<TableData>> => {
  return request.delete({ url: '/system/config/refreshCache' })
}

export const delTableListApi = (ids: string[] | number[]): Promise<IResponse> => {
  return request.delete({ url: '/system/config/' + ids, })
}
