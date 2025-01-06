import request from '@/config/axios'
// import type { TableData } from './types'
//获取
export const getLogListApi = (params: any): Promise<IResponse> => {
  return request.get({ url: '/system/post/list', params })
}
//删除
export const delPost = (ids: string[] | number[]): Promise<IResponse> => {
  return request.delete({ url: '/system/post/' + ids })
}
// 新增
export const addPost = (data: any): Promise<IResponse> => {
  return request.post({ url: '/system/post/add', data })
}
// 详情
export const getPost = (ids: string[] | number[]): Promise<IResponse> => {
  return request.get({ url: '/system/post/' + ids })
}
//修改
export const updatePost = (data: any): Promise<IResponse> => {
  return request.post({ url: '/system/post/edit', data })
}
//修改状态
export const onOff = (data?: any): Promise<IResponse> => {
  return request.post({ url: '/system/post/changeStatus', data})
}