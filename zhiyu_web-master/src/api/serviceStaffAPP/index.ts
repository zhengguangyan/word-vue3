import request from '@/config/axios'

// 获取自建订单详情
export const getStaffInfoDetail = (id: any): Promise<IResponse> => {
  const params = new URLSearchParams()
  params.append('id', id)
  return request.post({
    url: '/srv/web/staffInfo/detail',
    params,
    headersType: 'application/x-www-form-urlencoded'
  })
}

// 获取自建订单状态统计
export const getStaffInfoStatusStat = (data): Promise<IResponse> => {
  return request.post({ url: '/srv/web/staffInfo/getStatusStat', data })
}

// 获取自建订单分页
export const getStaffInfoPage = (data): Promise<IResponse> => {
  return request.post({ url: '/srv/web/staffInfo/page', data })
}

// 取消订单
export const cancelOrder = (ids: any): Promise<IResponse> => {
  const params = new URLSearchParams()
  params.append('ids', ids)
  return request.post({
    url: '/srv/web/staffInfo/cancelOrder',
    params,
    headersType: 'application/x-www-form-urlencoded'
  })
}

// 确认支付
export const confirmPayment = (data): Promise<IResponse> => {
  return request.post({ url: '/srv/web/staffInfo/confirmPayment', data })
}

// 导出
export const exportStaffInfo = (param: any): Promise<any> => {
  return request.post({
    url: '/srv/web/staffInfo/export',
    data: param,
    responseType: 'blob',
    timeout: 1000000000 // 设置超时时间
  })
}

// 选择养老卡补贴账户分页
export const getSubsidyAccountPage = (data): Promise<IResponse> => {
  return request.post({ url: '/srv/web/staffInfo/getSubsidyAccountPage', data })
}

// 选择养老卡补贴
export const getSubsidyByCustomerId = (data): Promise<IResponse> => {
  return request.post({ url: '/srv/web/staffInfo/getSubsidyByCustomerId', data })
}

// 发起视频通话
export const initiateVideoCall = (data): Promise<IResponse> => {
  return request.post({ url: '/srv/web/staffInfo/initiateVideoCall', data })
}

// 取消订单
export const staffInfoRemove = (ids: any): Promise<IResponse> => {
  const params = new URLSearchParams()
  params.append('ids', ids)
  return request.post({
    url: '/srv/web/staffInfo/remove',
    params,
    headersType: 'application/x-www-form-urlencoded'
  })
}

// 退回订单
export const returnOrder = (ids: any): Promise<IResponse> => {
  const params = new URLSearchParams()
  params.append('ids', ids)
  return request.post({
    url: '/srv/web/staffInfo/returnOrder',
    params,
    headersType: 'application/x-www-form-urlencoded'
  })
}

// 修改基础信息
export const updateBasicInfo = (data): Promise<IResponse> => {
  return request.post({ url: '/srv/web/staffInfo/updateBasicInfo', data })
}

// 修改完结信息
export const updateEndInfo = (data): Promise<IResponse> => {
  return request.post({ url: '/srv/web/staffInfo/updateEndInfo', data })
}

// 添加修改评价
export const updateEvaluate = (data): Promise<IResponse> => {
  return request.post({ url: '/srv/web/staffInfo/updateEvaluate', data })
}

// 修改完成服务
export const updateFinishService = (data): Promise<IResponse> => {
  return request.post({ url: '/srv/web/staffInfo/updateFinishService', data })
}

// 修改服务项目信息
export const updateServeItem = (data): Promise<IResponse> => {
  return request.post({ url: '/srv/web/staffInfo/updateServeItem', data })
}

// 修改开始服务
export const updateStartService = (data): Promise<IResponse> => {
  return request.post({ url: '/srv/web/staffInfo/updateStartService', data })
}

// 订单审核
export const updateStatus = (data): Promise<IResponse> => {
  return request.post({ url: '/srv/web/staffInfo/updateStatus', data })
}

// 校验取消订单
export const verifyCancelOrder = (ids: any): Promise<IResponse> => {
  const params = new URLSearchParams()
  params.append('ids', ids)
  return request.post({
    url: '/srv/web/staffInfo/verifyCancel',
    params,
    headersType: 'application/x-www-form-urlencoded'
  })
}

// 校验删除
export const verifyDeleteOrder = (ids: any): Promise<IResponse> => {
  const params = new URLSearchParams()
  params.append('ids', ids)
  return request.post({
    url: '/srv/web/staffInfo/verifyDelete',
    params,
    headersType: 'application/x-www-form-urlencoded'
  })
}

// 校验退回订单
export const verifyReturn = (ids: any): Promise<IResponse> => {
  const params = new URLSearchParams()
  params.append('ids', ids)
  return request.post({
    url: '/srv/web/staffInfo/verifyReturn',
    params,
    headersType: 'application/x-www-form-urlencoded'
  })
}

// 选择服务项目分页
export const serveInfoPage = (data): Promise<IResponse> => {
  return request.post({ url: '/srv/web/staffInfo/serveInfoPage', data })
}


// 选择共同服务人员
export const getCommonUsers = (data): Promise<IResponse> => {
  return request.post({ url: '/srv/web/staffInfo/getCommonUsers', data })
}

// 选择服务项目分页
export const commonUsersPage = (data): Promise<IResponse> => {
  return request.post({ url: '/srv/web/staffInfo/commonUsersPage', data })
}
