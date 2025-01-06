/** 自定义项目相关接口 */
import request from '@/config/axios'

// 自定义项目统计分页
export const customStatPage = (data): Promise<IResponse> => {
  return request.post({ url: '/opr/web/customServe/statPage', data })
}

// 自定义项目列表
export const customServeList = (data): Promise<IResponse> => {
  return request.post({ url: '/opr/web/customServe/list', data })
}

// 自定义项目列表分页
export const customServePage = (data): Promise<IResponse> => {
  return request.post({ url: '/opr/web/customServe/page', data })
}

// 新增拜访标签
export const customServeSave = (data): Promise<IResponse> => {
  return request.post({ url: '/opr/web/customServe/save', data })
}

// 新增拜访标签
export const customServeSort = (data): Promise<IResponse> => {
  return request.post({ url: '/opr/web/customServe/sort', data })
}
