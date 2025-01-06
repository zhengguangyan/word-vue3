import request from '@/config/axios'

// 获取服务人员详情
export const getOperatorDetail = (id: any): Promise<IResponse> => {
  const params = new URLSearchParams()
  params.append('id', id)
  return request.post({
    url: '/opr/web/staff/detail',
    params,
    headersType: 'application/x-www-form-urlencoded'
  })
}

// 获取服务人员分页
export const getOperatorPage = (data): Promise<IResponse> => {
  return request.post({ url: '/opr/web/staff/page', data })
}

// 获取推荐服务人员分页
export const getRecommendPage = (data): Promise<IResponse> => {
  return request.post({ url: '/opr/web/staff/recommendPage', data })
}

// 修改服务人员基础信息
export const updateOperatorPerson = (data): Promise<IResponse> => {
  return request.post({ url: '/opr/web/staff/updatePerson', data })
}

// 修改服务人员服务信息
export const updateOperatorService = (data): Promise<IResponse> => {
  return request.post({ url: '/opr/web/staff/updateServiceStaff', data })
}

// 获取二维码记录分页
export const getQrRecordPage = (data): Promise<IResponse> => {
  return request.post({ url: '/opr/web/qrRecord/page', data })
}
