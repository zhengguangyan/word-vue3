import request from '@/config/axios'

// 工单管理信息保存
export const saveWorksheet = (data?: any): Promise<IResponse> => {
  return request.post({ url: '/worksheet/web/info/save', data })
}

// 工单管理信息修改
export const updateWorksheet = (data?: any): Promise<IResponse> => {
  return request.post({ url: '/worksheet/web/info/update', data })
}

// 获取工单管理列表
export const getWorksheetList = (data: any): Promise<IResponse> => {
  return request.post({ url: '/worksheet/web/info/list', data })
}

export const getWorksheetTypeDetail = (id: any): Promise<IResponse> => {
  const params = new URLSearchParams()
  params.append('id', id)
  return request.post({
    url: '/worksheetType/web/info/detail',
    params,
    headersType: 'application/x-www-form-urlencoded'
  })
}

export const getWorksheetPage = (data: any): Promise<IResponse> => {
  return request.post({ url: '/worksheet/web/info/page', data })
}

// 工单类型信息保存
export const saveWorksheetType = (data: any): Promise<IResponse> => {
  return request.post({ url: '/worksheetType/web/info/save', data })
}

// 工单类型信息修改
export const updateWorksheetType = (data: any): Promise<IResponse> => {
  return request.post({ url: '/worksheetType/web/info/update', data })
}

// 获取工单类型列表
export const getAllWorksheetTypeList = (data: any): Promise<IResponse> => {
  return request.post({ url: '/worksheetType/web/info/list', data })
}

// 获取工单类型树
export const getWorksheetTree = (): Promise<IResponse> => {
  return request.post({ url: '/worksheetType/web/info/treeList' })
}

// 删除工单
export const deleteWorksheetType = (ids: any): Promise<IResponse> => {
  const params = new URLSearchParams()
  params.append('ids', ids)
  return request.post({
    url: '/worksheetType/web/info/remove',
    params,
    headersType: 'application/x-www-form-urlencoded'
  })
}

// 获取工单管理信息详情
export const getWorksheetInfoById = (id: any): Promise<IResponse> => {
  const params = new URLSearchParams()
  params.append('id', id)
  return request.post({
    url: '/worksheet/web/info/detail',
    params,
    headersType: 'application/x-www-form-urlencoded'
  })
}

// 删除工单
export const deleteWorksheet = (ids: any): Promise<IResponse> => {
  const params = new URLSearchParams()
  params.append('ids', ids)
  return request.post({
    url: '/worksheet/web/info/remove',
    params,
    headersType: 'application/x-www-form-urlencoded'
  })
}

// 分页查询客户跟踪信息
export const getRecordPage = (data: any): Promise<IResponse> => {
  return request.post({ url: '/worksheet/web/record/page', data })
}

// 查询详情客户跟踪信息
export const getRecordDetail = (id: any): Promise<IResponse> => {
  const params = new URLSearchParams()
  params.append('id', id)
  return request.post({
    url: '/worksheet/web/record/detail',
    params,
    headersType: 'application/x-www-form-urlencoded'
  })
}

// 新增客户跟踪信息
export const saveRecord = (data: any): Promise<IResponse> => {
  return request.post({ url: '/worksheet/web/record/save', data })
}

// 修改客户跟踪信息
export const updateRecord = (data: any): Promise<IResponse> => {
  return request.post({ url: '/worksheet/web/record/update', data })
}

// 批量删除客户跟踪信息
export const deleteRecord = (ids: any): Promise<IResponse> => {
  const params = new URLSearchParams()
  params.append('ids', ids)
  return request.post({
    url: '/worksheet/web/record/remove',
    params,
    headersType: 'application/x-www-form-urlencoded'
  })
}
// 全部记录同个excel导出工单
export const exportWorksheet = (data: any): Promise<any> => {
  return request.post({
    url: '/worksheet/web/info/export',
    data,
    responseType: 'blob',
    timeout: 1000000000 // 设置超时时间
  })
}
// 全部记录同个excel导出关怀
export const exportCare = (data: any): Promise<any> => {
  return request.post({
    url: '/care/web/info/export',
    data,
    responseType: 'blob',
    timeout: 1000000000 // 设置超时时间
  })
}
// 全部记录同个excel导出关怀
export const exportCareLink = (data: any): Promise<any> => {
  return request.post({
    url: '/care/web/linkage/export',
    data,
    responseType: 'blob',
    timeout: 1000000000 // 设置超时时间
  })
}

// 工单导入公共代办
export const savePublicAgency = (data: any): Promise<IResponse> => {
  return request.post({ url: `/worksheet/web/info/publicAgency?ids=${data}` })
}

// 工单管理分配客服
export const allocateUser = (data: any): Promise<IResponse> => {
  const params = new URLSearchParams()
  params.append('id', data.id)
  params.append('userId', data.userId)
  return request.post({
    url: '/worksheet/web/info/allocation',
    params,
    headersType: 'application/x-www-form-urlencoded'
  })
}
// 关联通话录音
export const saveCallRecord = (data): Promise<IResponse> => {
  return request.post({ url: '/worksheet/web/info/updateAgentRecordLogById', params: data })
}
