/** 助餐订单 */
import request from '@/config/axios'

// 导出
export const orderExport = (data): Promise<IResponse> => {
  return request.post({ url: '/srv/web/diningOrder/export', data, responseType: 'blob' })
}

// 作废订单
export const orderInvalid = (ids): Promise<IResponse> => {
  const params = new URLSearchParams()
  params.append('ids', ids)
  return request.post({
    url: '/srv/web/diningOrder/invalidOrder',
    params,
    headersType: 'application/x-www-form-urlencoded'
  })
}

// 列表
export const orderList = (data): Promise<IResponse> => {
  return request.post({ url: '/srv/web/diningOrder/list', data })
}

// 分页
export const orderPage = (data): Promise<IResponse> => {
  return request.post({ url: '/srv/web/diningOrder/page', data })
}

// 校验作废订单
export const verifyInvalid = (ids): Promise<IResponse> => {
  const params = new URLSearchParams()
  params.append('ids', ids)
  return request.post({
    url: '/srv/web/diningOrder/verifyInvalid',
    params,
    headersType: 'application/x-www-form-urlencoded'
  })
}

// 统计
export const orderStat = (data): Promise<IResponse> => {
  return request.post({ url: '/srv/web/diningOrderStat/getStat', data })
}
