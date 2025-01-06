import request from '@/config/axios'

// 获取关怀管理分页
export const getCareinfoPage = (data: any): Promise<IResponse> => {
  return request.post({ url: '/care/web/info/page', data })
}

// 获取关怀管理列表
export const getCareinfoList = (data: any): Promise<IResponse> => {
  return request.post({ url: '/care/web/info/list', data })
}

// 关怀管理信息保存
export const saveCareinfo = (data: any): Promise<IResponse> => {
  return request.post({ url: '/care/web/info/save', data })
}

// 关怀管理信息修改
export const updateCareinfo = (data: any): Promise<IResponse> => {
  return request.post({ url: '/care/web/info/update', data })
}

// 获取关怀管理信息详情
export const getCareinfoDetailById = (id: any): Promise<IResponse> => {
  const params = new URLSearchParams()
  params.append('id', id)
  return request.post({
    url: '/care/web/info/detail',
    params,
    headersType: 'application/x-www-form-urlencoded'
  })
}

// 删除关怀
export const deleteCareinfo = (ids: any): Promise<IResponse> => {
  const params = new URLSearchParams()
  params.append('ids', ids)
  return request.post({
    url: '/care/web/info/remove',
    params,
    headersType: 'application/x-www-form-urlencoded'
  })
}

// 关怀导入公共代办
export const savePublicAgency = (data: any): Promise<IResponse> => {
  return request.post({ url: `/care/web/info/publicAgency?ids=${data}` })
}

// 关怀管理分配客服
export const allocateUser = (data: any): Promise<IResponse> => {
  const params = new URLSearchParams()
  params.append('id', data.id)
  params.append('userId', data.userId)
  return request.post({
    url: '/care/web/info/allocation',
    params,
    headersType: 'application/x-www-form-urlencoded'
  })
}
// 关联通话录音
export const saveRecord = (data): Promise<IResponse> => {
  return request.post({ url: '/care/web/info/updateAgentRecordLogById', params: data })
}
