import request from '@/config/axios'
import type { TableData } from './types'

export const getTableListApi = (params: any): Promise<IResponse> => {
  return request.get({ url: '/system/user/list', params })
}

export const getRoleListApi = (params: any): Promise<IResponse> => {
  return request.get({ url: '/system/role/list', params })
}

export const saveTableApi = (data: Partial<TableData>): Promise<IResponse> => {
  return request.post({ url: '/example/save', data })
}

export const getTableDetApi = (id: string): Promise<IResponse<TableData>> => {
  return request.get({ url: '/example/detail', params: { id } })
}

export const delTableListApi = (ids: string[] | number[]): Promise<IResponse> => {
  return request.post({ url: '/example/delete', data: { ids } })
}
