import request from '@/config/axios'
import type { TableData } from './types'

export const getLoginLogListApi = (params: any): Promise<IResponse> => {
  return request.get({ url: '/monitor/loginInfo/list', params })
}
export const delTableListApi = (ids: string[] | number[]): Promise<IResponse> => {
  return request.delete({ url: '/monitor/loginInfo/' + ids })
}

export const cleanTableListApi = (): Promise<IResponse> => {
  return request.delete({ url: '/monitor/loginInfo/clean/' })
}
export const unlockTableListApi = (nane: string[] | number[]): Promise<IResponse> => {
  return request.get({ url: '/monitor/loginInfo/unlock/' + nane })
}

