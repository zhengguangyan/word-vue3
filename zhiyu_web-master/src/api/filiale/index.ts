import request from '@/config/axios'

// 获取自建订单一级归属项目列表
export const getBelongProjectList = (data): Promise<IResponse> => {
  return request.post({ url: '/opr/web/belongItemlabel/belongProjectList', data })
}

// 获取自建订单二级归属项目列表分页
export const getBelongItemlabel = (data): Promise<IResponse> => {
  return request.post({ url: '/opr/web/belongItemlabel/page', data })
}

// 获取自建订单二级归属项目列表
export const getBelongItemlabelList = (data): Promise<IResponse> => {
  return request.post({ url: '/opr/web/belongItemlabel/list', data })
}

// 自定义标签信息保存
export const saveBelongItemlabel = (data): Promise<IResponse> => {
  return request.post({ url: '/opr/web/belongItemlabel/save', data })
}

// 自定义标签信息修改
export const updateBelongItemlabel = (data): Promise<IResponse> => {
  return request.post({ url: '/opr/web/belongItemlabel/updateRemark', data })
}

// 禁用或者启用
export const operateBelongItemlabel = (data: any): Promise<IResponse> => {
  const params = new URLSearchParams()
  params.append('id', data.id)
  params.append('deleted', data.deleted)
  return request.post({
    url: '/opr/web/belongItemlabel/operate',
    params,
    headersType: 'application/x-www-form-urlencoded'
  })
}

// 订单归属项目(二级)
export const belongItemlabelList = (data): Promise<IResponse> => {
  return request.post({ url: '/opr/web/belongItemlabel/list', data })
}
