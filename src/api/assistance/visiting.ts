/** 拜访信息相关接口 */
import request from '@/config/axios'

export const visitingPage = (data): Promise<IResponse> => {
  return request.post({ url: '/customer/web/visitInfo/page', data })
}

export const visitingDetail = (id: string): Promise<IResponse> => {
  return request.get({ url: `/customer/web/visitInfo/detail?id=${id}` })
}

export const visitingRemove = (ids: string): Promise<IResponse> => {
  const params = new URLSearchParams()
  params.append('ids', ids)
  return request.post({
    url: '/customer/web/visitInfo/remove',
    params,
    headersType: 'application/x-www-form-urlencoded'
  })
}

export const visitingSave = (data): Promise<IResponse> => {
  return request.post({ url: '/customer/web/visitInfo/save', data })
}

export const visitingUpdate = (data): Promise<IResponse> => {
  return request.post({ url: '/customer/web/visitInfo/update', data })
}

// 拜访信息导出
export const visitingExport = (data): Promise<IResponse> => {
  return request.post({ url: '/customer/web/visitInfo/excelExport', data, responseType: 'blob', timeout: 1000000000 })
}

// 拜访信息导出截图
export const visitingExportImg = (data): Promise<IResponse> => {
  return request.post({ url: '/customer/web/visitInfo/exportDetailPictures', data, responseType: 'blob', timeout: 1000000000 })
}

// 客户拜访统计-导出
export const visitingStatExport = (data): Promise<IResponse> => {
  return request.post({ url: '/customer/web/visitInfo/visitStatExport', data, responseType: 'blob' })
}

// 分页获取拜访统计列表
export const visitingStatPage = (data): Promise<IResponse> => {
  return request.post({ url: '/customer/web/visitInfo/visitStatPage', data })
}

// 拜访统计-总计
export const visitingStatTotal = (data): Promise<IResponse> => {
  return request.post({ url: '/customer/web/visitInfo/visitTotalStat', data })
}
