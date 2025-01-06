import request from '@/config/axios'
import type { TableData } from './types'

//查询字典类型列表
export const listType = (params: any): Promise<IResponse> => {
    return request.get({ url: '/system/dict/type/list', params })
}

//查询字典类型详细
export const getType = (dictId?): Promise<IResponse> => {
    return request.get({ url: '/system/dict/type/' + dictId })
}

// 获取所有数据字典
export const getAllDictData = (): Promise<IResponse> => {
  return request.post({ url: '/system/dict/type/listAll' })
}

//通过字典类型查询详情
export const getDictData = (dictType: string): Promise<IResponse> => {
  const params = new URLSearchParams();
  params.append('dictType', dictType);
  return request.post({
    url: '/system/dict/type/dateList',
    params: params,
    headersType: 'application/x-www-form-urlencoded' 
  })
}

//新增字典类型
export const addType = (data: Partial<TableData>): Promise<IResponse> => {
    return request.post({ url: '/system/dict/type/add', data })
}

//  修改字典类型
export const updateType = (data: Partial<TableData>): Promise<IResponse> => {
    return request.post({ url: '/system/dict/type/edit', data })
}

// 删除字典类型
export const delType = (dictId?): Promise<IResponse> => {
    return request.delete({ url: '/system/dict/type/' + dictId, })
}

//获取字典选择框列表
export const optionselect = (): Promise<IResponse> => {
    return request.get({ url: '/system/dict/type/optionselect' })
}

//刷新字典缓存
export const refreshCache = (): Promise<IResponse<TableData>> => {
    return request.delete({ url: '/system/dict/type/refreshCache' })
}

//导出
export function exportList() {
    return request.post({ url:'/system/dict/type/export',  })
}
  
//修改状态
export const onOff = (data?: any): Promise<IResponse> => {
    return request.post({ url: '/system/dict/type/changeStatus', data })
}

