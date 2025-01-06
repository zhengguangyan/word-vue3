/** 拜访标签相关接口 */
import request from '@/config/axios'

// 分页获取拜访标签列表
export const tagPage = (data): Promise<IResponse> => {
  return request.post({ url: '/customer/web/visitLabel/page', data })
}

// 新增拜访标签
export const addTag = (data): Promise<IResponse> => {
  return request.post({ url: '/customer/web/visitLabel/save', data })
}

// 启用或禁用标签
export const setTagStatus = (data): Promise<IResponse> => {
  return request.post({ url: '/customer/web/visitLabel/setStatus', data })
}

// 标签排序
export const tagSort = (data): Promise<IResponse> => {
  return request.post({ url: '/customer/web/visitLabel/sort', data })
}

// 分页获取拜访标签统计列表
export const tagStatPage = (data): Promise<IResponse> => {
  return request.post({ url: '/customer/web/visitLabel/staticsPage', data })
}
