/** 活动信息相关接口 */
import request from '@/config/axios'
import { service } from '@/config/axios/service'

// 客户活动统计导出
export const activityStatExport = (data): Promise<IResponse> => {
  return request.post({ url: '/customer/web/activity/activityStatExport', data, responseType: 'blob' })
}

// 分页获取活动统计列表
export const activityStatPage = (data): Promise<IResponse> => {
  return request.post({ url: '/customer/web/activity/activityStatPage', data })
}

// 活动统计-总计
export const activityStatTotal = (data): Promise<IResponse> => {
  return request.post({ url: '/customer/web/activity/activityTotalStat', data })
}

// 活动信息详情
export const activityDetail = (id: string): Promise<IResponse> => {
  return request.get({ url: `/customer/web/activity/detail?id=${id}` })
}

// 活动信息导出
export const activityExport = (data): Promise<IResponse> => {
  return request.post({ url: '/customer/web/activity/excelExport', data, responseType: 'blob' })
}

// 活动详情页面，老人列表导出
export const activityOldManExport = (data): Promise<IResponse> => {
  return request.post({ url: '/customer/web/activity/exportCustomer', data, responseType: 'blob' })
}

// 活动重复率统计
export const repeatDetail = (data): Promise<IResponse> => {
  return request.post({ url: '/customer/web/activity/repeatStat', data })
}

// 分页获取活动信息列表
export const activityPage = (data): Promise<IResponse> => {
  return request.post({ url: '/customer/web/activity/page', data })
}

// 删除活动信息
export const activityRemove = (ids: string): Promise<IResponse> => {
  const params = new URLSearchParams()
  params.append('ids', ids)
  return request.post({
    url: '/customer/web/activity/remove',
    params,
    headersType: 'application/x-www-form-urlencoded'
  })
}

export const activitySave = (data): Promise<IResponse> => {
  return request.post({ url: '/customer/web/activity/save', data })
}

export const activityUpdate = (data): Promise<IResponse> => {
  return request.post({ url: '/customer/web/activity/update', data })
}

// 获取邀约老人列表
export const getOldManList = (data): Promise<IResponse> => {
  return request.post({ url: '/customer/web/activity/getActivityCustomer', data })
}

export const getOrgUsers = (data): Promise<IResponse> => {
  return request.post({ url: '/srv/web/staffInfo/getCommonUsers', data })
}

// 老人名单导入模板
export const getTemplate = (): Promise<IResponse> => {
  return request.post({ url: '/customer/web/activity/importTemplate', responseType: 'blob' })
}

// 老人名单批量导入
export const importData = (data): Promise<IResponse> => {
  return service({
    url: '/customer/web/activity/importCustomer',
    data,
    method: 'POST'
  })
}
