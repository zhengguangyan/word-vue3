import request from '@/config/axios'

// 获取服务包分页
export const servePacketPage = (data): Promise<IResponse> => {
  return request.post({ url: '/srv/web/servePacketName/page', data })
}

// 获取服务包列表
export const servePacketList = (data?): Promise<IResponse> => {
  return request.post({ url: '/srv/web/servePacketName/list', data })
}

// 获取服务包详情
export const servePacketDetail = (id: any): Promise<IResponse> => {
  const params = new URLSearchParams()
  params.append('id', id)
  return request.post({
    url: '/srv/web/servePacketName/detail',
    params,
    headersType: 'application/x-www-form-urlencoded'
  })
}

// 开放式服务包保存
export const saveOpenPacket = (data): Promise<IResponse> => {
  return request.post({ url: '/srv/web/servePacketName/saveOpen', data })
}

// 开放式服务包修改
export const updateOpenPacket = (data): Promise<IResponse> => {
  return request.post({ url: '/srv/web/servePacketName/updateOpen', data })
}

// 其他服务包保存
export const saveOtherPacket = (data): Promise<IResponse> => {
  return request.post({ url: '/srv/web/servePacketName/save', data })
}

// 其他服务包修改
export const updateOtherPacket = (data): Promise<IResponse> => {
  return request.post({ url: '/srv/web/servePacketName/update', data })
}

// 删除服务包
export const removeServePacket = (id: any): Promise<IResponse> => {
  const params = new URLSearchParams()
  params.append('id', id)
  return request.post({
    url: '/srv/web/servePacketName/remove',
    params,
    headersType: 'application/x-www-form-urlencoded'
  })
}

// 获取服务包操作记录列表
export const servePacketRecordList = (data): Promise<IResponse> => {
  return request.post({ url: '/srv/web/servePacketRecord/list', data })
}

// 服务包历史记录查看详情
export const servePacketRecordDetail = (id: any): Promise<IResponse> => {
  const params = new URLSearchParams()
  params.append('id', id)
  return request.post({
    url: '/srv/web/servePacketRecord/detailRecord',
    params,
    headersType: 'application/x-www-form-urlencoded'
  })
}

// 服务包补贴批量充值
export const servePacketBatchRecharge = (data): Promise<IResponse> => {
  return request.post({ url: '/srv/web/servePacketCustomer/batchRecharge', data })
}

/***************** 服务包客户管理 ******************/

// 获取客户服务包分页
export const servePacketCustomerPage = (data): Promise<IResponse> => {
  return request.post({ url: '/srv/web/servePacketCustomer/page', data })
}

// 获取客户服务包列表
export const servePacketCustomerList = (data): Promise<IResponse> => {
  return request.post({ url: '/srv/web/servePacketCustomer/list', data })
}

// 获取客户服务包信息详情
export const servePacketCustomerDetail = (id: any): Promise<IResponse> => {
  const params = new URLSearchParams()
  params.append('id', id)
  return request.post({
    url: '/srv/web/servePacketCustomer/detail',
    params,
    headersType: 'application/x-www-form-urlencoded'
  })
}

// 获取服务包余额账户列表
export const serveServePacketAccountList = (data): Promise<IResponse> => {
  return request.post({ url: '/srv/web/servePacketAccount/list', data })
}
