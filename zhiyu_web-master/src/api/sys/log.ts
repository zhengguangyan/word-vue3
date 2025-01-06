import request from '@/config/axios'
import type { TableData } from './types'

export const getLogListApi = (params: any): Promise<IResponse> => {
  return request.get({ url: '/monitor/log/list', params })
}
export const delTableListApi = (ids: string[] | number[]): Promise<IResponse> => {
  return request.delete({ url: '/monitor/log/' + ids })
}

export const cleanTableListApi = (): Promise<IResponse> => {
  return request.delete({ url: '/monitor/log/clean/' })
}

