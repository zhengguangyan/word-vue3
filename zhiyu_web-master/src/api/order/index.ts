import request from '@/config/axios'

// 获取订单分页
export const getOrderPage = (data): Promise<IResponse> => {
  return request.post({ url: '/srv/web/order/page', data })
}

// 获取当前订单分页的总金额
export const orderGetAllmoney = (data): Promise<IResponse> => {
  return request.post({ url: '/srv/web/order/getAllmoney', data })
}

// 获取订单列表
export const getOrderList = (data): Promise<IResponse> => {
  return request.post({ url: '/srv/web/order/list', data })
}

// 获取订单统计
export const getStatusCount = (data?): Promise<IResponse> => {
  return request.post({ url: '/srv/web/order/statusCount', data })
}

// 全部记录同个excel导出
export const exportExcelInOne = (param: any): Promise<any> => {
  return request.post({
    url: '/srv/web/order/export',
    data: param,
    responseType: 'blob',
    timeout: 1000000000 // 设置超时时间
  })
}

// 平台订单信息保存
export const saveOrder = (data?): Promise<IResponse> => {
  return request.post({ url: '/srv/web/order/save', data })
}

// 平台订单信息修改
export const updateOrder = (data?): Promise<IResponse> => {
  return request.post({ url: '/srv/web/order/update', data })
}

// 平台订单地址信息修改
export const updateAddressOrder = (data?): Promise<IResponse> => {
  return request.post({ url: '/srv/web/order/updateAddress', data })
}

// 获取订单详情
export const getOrderDetail = (id: any): Promise<IResponse> => {
  const params = new URLSearchParams()
  params.append('id', id)
  return request.post({
    url: '/srv/web/order/detail',
    params,
    headersType: 'application/x-www-form-urlencoded'
  })
}

// 批量删除订单
export const removeOrder = (ids: any): Promise<IResponse> => {
  const params = new URLSearchParams()
  params.append('ids', ids)
  return request.post({
    url: '/srv/web/order/removeAll',
    params,
    headersType: 'application/x-www-form-urlencoded'
  })
}

// 验证删除订单
export const verifyDeleteOrder = (ids: any): Promise<IResponse> => {
  const params = new URLSearchParams()
  params.append('ids', ids)
  return request.post({
    url: '/srv/web/order/verifyDelete',
    params,
    headersType: 'application/x-www-form-urlencoded'
  })
}

// 获取会员联系地址信息列表
export const getMemberAddressList = (data): Promise<IResponse> => {
  return request.post({ url: '/mc/web/memberAddress/list', data })
}

// 会员联系地址信息保存
export const saveMemberAddress = (data): Promise<IResponse> => {
  return request.post({ url: '/mc/web/memberAddress/save', data })
}

// 会员联系地址信息修改
export const updateMemberAddress = (data): Promise<IResponse> => {
  return request.post({ url: '/mc/web/memberAddress/update', data })
}

// 删除会员联系地址信息
export const removeMemberAddress = (ids: any): Promise<IResponse> => {
  const params = new URLSearchParams()
  params.append('id', ids)
  return request.post({
    url: '/mc/web/memberAddress/remove',
    params,
    headersType: 'application/x-www-form-urlencoded'
  })
}

// 删除评论
export const removeContentApi = (ids: any): Promise<IResponse> => {
  const params = new URLSearchParams()
  params.append('id', ids)
  return request.post({
    url: '/srv/web/order/removeContent',
    params,
    headersType: 'application/x-www-form-urlencoded'
  })
}

// 上传照片
export const uploadImages = (data): Promise<IResponse> => {
  return request.post({ url: '/srv/web/order/saveFile', data })
}

// 订单状态数据
export const serveOrderStatusList = (data): Promise<IResponse> => {
  return request.post({ url: '/opr/web/serveorderstatus/list', data })
}

// 状态流程操作（常规）
export const setServeorderstatus = (data): Promise<IResponse> => {
  return request.post({ url: '/opr/web/serveorderstatus/operate', data })
}

// 状态流程操作（退款相关）
export const drawbackStatus = (data): Promise<IResponse> => {
  return request.post({ url: '/opr/web/serveorderstatus/drawback', data })
}

// 状态流程操作（取消相关）
export const cancelStatus = (data): Promise<IResponse> => {
  return request.post({ url: '/opr/web/serveorderstatus/cancel', data })
}

// 状态流程操作（作废相关）
export const invalidateStatus = (data): Promise<IResponse> => {
  return request.post({ url: '/opr/web/serveorderstatus/invalidate', data })
}

// 撤销平台订单超出金额
export const cancelExceedAmount = (data): Promise<IResponse> => {
  return request.post({ url: '/srv/web/order/cancelExceedAmount', data })
}

// 撤销平台订单超出金额
export const saveExceedAmount = (data): Promise<IResponse> => {
  return request.post({ url: '/srv/web/order/saveExceedAmount', data })
}

// 关联通话录音
export const saveRecord = (data): Promise<IResponse> => {
  return request.post({ url: '/srv/web/order/updateAgentRecordLogById', params: data })
}

// 修改服务工单号
export const editServeNo = (data): Promise<IResponse> => {
  return request.post({ url: '/srv/web/order/updateServeNo', params: data })
}

// 倒计时结束后需要调用的接口
export const automaticOperat = (data): Promise<IResponse> => {
  return request.post({ url: '/opr/web/serveorderstatus/automaticOperat', params: data })
}

// 订单详情 编辑回访评价的接口
export const updateEvaluateById = (data): Promise<IResponse> => {
  return request.post({ url: '/srv/web/order/updateEvaluateById', data })
}

// 订单详情 无法执行的接口
export const notExecute = (data): Promise<IResponse> => {
  return request.post({ url: '/srv/web/order/notExecute', params: data  })
}
