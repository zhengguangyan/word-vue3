import request from '@/config/axios'

// 获取养老卡分页
export const subsidyCardPage = (data): Promise<IResponse> => {
  return request.post({ url: '/srv/web/subsidyCard/page', data })
}

// 养老卡保存
export const saveSubsidyCard = (data): Promise<IResponse> => {
  return request.post({ url: '/srv/web/subsidyCard/save', data })
}

// 养老卡修改
export const updateSubsidyCard = (data): Promise<IResponse> => {
  return request.post({ url: '/srv/web/subsidyCard/update', data })
}

// 养老卡历史记录
export const subsidyCardRecordPage = (data): Promise<IResponse> => {
  return request.post({ url: '/srv/web/subsidyCardRecord/page', data })
}

// 删除养老卡
export const removeSubsidyCard = (ids: any): Promise<IResponse> => {
  const params = new URLSearchParams()
  params.append('ids', ids)
  return request.post({
    url: '/srv/web/subsidyCard/remove',
    params,
    headersType: 'application/x-www-form-urlencoded'
  })
}


// 获取养老卡详情
export const subsidyCardDetail = (ids: any): Promise<IResponse> => {
  const params = new URLSearchParams()
  params.append('id', ids)
  return request.post({
    url: '/srv/web/subsidyCard/detail',
    params,
    headersType: 'application/x-www-form-urlencoded'
  })
}

// 作废养老卡
export const validSubsidyCard = (ids: any): Promise<IResponse> => {
  const params = new URLSearchParams()
  params.append('id', ids)
  return request.post({
    url: '/srv/web/subsidyCard/valid',
    params,
    headersType: 'application/x-www-form-urlencoded'
  })
}

// 验证删除养老卡
export const verifyDeleteSubsidyCard = (ids: any): Promise<IResponse> => {
  const params = new URLSearchParams()
  params.append('ids', ids)
  return request.post({
    url: '/srv/web/subsidyCard/verifyDelete',
    params,
    headersType: 'application/x-www-form-urlencoded'
  })
}

// 获取补贴数据分页
export const subsidyInfoPage = (data): Promise<IResponse> => {
  return request.post({ url: '/srv/web/subsidyInfo/page', data })
}

// 获取补贴数据分页
export const subsidyCustomerPage = (data): Promise<IResponse> => {
  return request.post({ url: '/srv/web/subsidyCustomer/allPage', data })
}

// 获取补贴数据列表
export const subsidyInfoList = (data?): Promise<IResponse> => {
  return request.post({ url: '/srv/web/subsidyInfo/list', data })
}

// 获取补贴历史记录分页
export const subsidyHistoryRecordList = (data): Promise<IResponse> => {
  return request.post({ url: '/srv/web/subsidyRecord/list', data })
}

// 补贴数据详情
export const getSubsidyInfo = (ids: any): Promise<IResponse> => {
  const params = new URLSearchParams()
  params.append('id', ids)
  return request.post({
    url: '/srv/web/subsidyInfo/detail',
    params,
    headersType: 'application/x-www-form-urlencoded'
  })
}

// 批量绑定养老卡
export const subsidyCardBatchBind = (data): Promise<IResponse> => {
  return request.post({ url: '/srv/web/subsidyInfo/subsidyCardBatchBind', data })
}

// 补贴数据保存
export const saveSubsidyInfo = (data): Promise<IResponse> => {
  return request.post({ url: '/srv/web/subsidyInfo/save', data })
}

// 补贴数据修改
export const updateSubsidyInfo = (data): Promise<IResponse> => {
  return request.post({ url: '/srv/web/subsidyInfo/update', data })
}

// 补贴批量充值
export const batchRecharge = (data): Promise<IResponse> => {
  return request.post({ url: '/srv/web/subsidyInfo/batchRecharge', data })
}

// 补贴批量冲减
export const batchOffset = (data): Promise<IResponse> => {
  return request.post({ url: '/srv/web/subsidyInfo/batchOffset', data })
}

// 补贴人员详情
export const getSubsidyUserDetail = (ids: any): Promise<IResponse> => {
  const params = new URLSearchParams()
  params.append('subsidyCustomerId', ids)
  return request.post({
    url: '/srv/web/subsidyCard/subsidyDetail',
    params,
    headersType: 'application/x-www-form-urlencoded'
  })
}

// 删除补贴数据
export const removeSubsidyInfo = (ids: any): Promise<IResponse> => {
  const params = new URLSearchParams()
  params.append('ids', ids)
  return request.post({
    url: '/srv/web/subsidyInfo/remove',
    params,
    headersType: 'application/x-www-form-urlencoded'
  })
}

// 验证删除补贴数据
export const verifyDeleteSubsidyInfo = (ids: any): Promise<IResponse> => {
  const params = new URLSearchParams()
  params.append('ids', ids)
  return request.post({
    url: '/srv/web/subsidyInfo/verifyDelete',
    params,
    headersType: 'application/x-www-form-urlencoded'
  })
}

// 获取补贴统计数据分页
export const subsidyStatPage = (data?): Promise<IResponse> => {
  return request.post({ url: '/srv/web/subsidyStat/page', data })
}

// 导出补贴统计数据
export const subsidyStatExport = (data: any): Promise<any> => {
  return request.post({
    url: '/srv/web/subsidyStat/export',
    data,
    responseType: 'blob',
    timeout: 1000000000 // 设置超时时间
  })
}

// 添加绑定养老卡
export const subsidyBindCard = (data): Promise<IResponse> => {
  return request.post({ url: '/srv/web/subsidyCard/bindCard', data })
}

// 挂失-解除绑定养老卡
export const lossOrRemoveCard = (data): Promise<IResponse> => {
  return request.post({ url: '/srv/web/subsidyCard/lossOrRemoveCard', data })
}

// 更换养老卡
export const changeCard = (data): Promise<IResponse> => {
  return request.post({ url: '/srv/web/subsidyCard/changeCard', data })
}

// 补贴人员历史记录分页
export const subsidyRecordPage = (data): Promise<IResponse> => {
  return request.post({ url: '/srv/web/subsidyRecord/page', data })
}

// 养老卡图片设置
export const subsidyPhotoSet = (data): Promise<IResponse> => {
  return request.post({ url: '/srv/web/subsidyCard/photoSet', data })
}