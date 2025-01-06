import request from '@/config/axios'

// 分页查询联动信息
export const getLinkagePage = (data: any): Promise<IResponse> => {
  return request.post({ url: '/care/web/linkage/page', data })
}

// 查询详情联动信息
export const getLinkageDetailById = (id: any): Promise<IResponse> => {
  const params = new URLSearchParams()
  params.append('id', id)
  return request.post({
    url: '/care/web/linkage/detail',
    params,
    headersType: 'application/x-www-form-urlencoded'
  })
}

// 新增联动信息
export const saveLinkage = (data: any): Promise<IResponse> => {
  return request.post({ url: '/care/web/linkage/save', data })
}

// 修改联动信息
export const updateLinkage = (data: any): Promise<IResponse> => {
  return request.post({ url: '/care/web/linkage/update', data })
}

// 批量删除联动信息
export const deleteLinkage = (ids: any): Promise<IResponse> => {
  const params = new URLSearchParams()
  params.append('ids', ids)
  return request.post({
    url: '/care/web/linkage/remove',
    params,
    headersType: 'application/x-www-form-urlencoded'
  })
}

// 分页查询联动号码信息
export const getLinkagePhonePage = (data: any): Promise<IResponse> => {
  return request.post({ url: '/care/web/linkagephone/page', data })
}

// 新增联动号码信息
export const saveLinkagePhone = (data: any): Promise<IResponse> => {
  return request.post({ url: '/care/web/linkagephone/save', data })
}

// 修改联动号码信息
export const updateLinkagePhone = (data: any): Promise<IResponse> => {
  return request.post({ url: '/care/web/linkagephone/update', data })
}

// 批量删除联动号码信息
export const deleteLinkagePhone = (ids: any): Promise<IResponse> => {
  const params = new URLSearchParams()
  params.append('ids', ids)
  return request.post({
    url: '/care/web/linkagephone/remove',
    params,
    headersType: 'application/x-www-form-urlencoded'
  })
}
// 关联通话录音
export const saveRecord = (data): Promise<IResponse> => {
  return request.post({ url: '/care/web/linkage/updateAgentRecordLogById', params: data })
}