import request from '@/config/axios'

// 获取APP基础信息类别分页
export const appInfoCategoryPage = (data): Promise<IResponse> => {
  return request.post({ url: '/opr/web/infoCategory/page', data })
}

// 获取APP基础信息类别列表
export const appInfoCategoryList = (data?): Promise<IResponse> => {
  return request.post({ url: '/opr/web/infoCategory/list', data })
}

// APP基础信息类别保存
export const saveAppInfoCategory = (data): Promise<IResponse> => {
  return request.post({ url: '/opr/web/infoCategory/save', data })
}

// APP基础信息类别修改
export const updateAppInfoCategory = (data): Promise<IResponse> => {
  return request.post({ url: '/opr/web/infoCategory/update', data })
}

// 删除APP基础信息类别
export const removeAppInfoCategory = (ids: any): Promise<IResponse> => {
  const params = new URLSearchParams()
  params.append('id', ids)
  return request.post({
    url: '/opr/web/infoCategory/remove',
    params,
    headersType: 'application/x-www-form-urlencoded'
  })
}

// 获取APP基础信息分页
export const appInfoPage = (data): Promise<IResponse> => {
  return request.post({ url: '/opr/web/info/page', data })
}

// APP基础信息保存
export const saveAppInfo = (data): Promise<IResponse> => {
  return request.post({ url: '/opr/web/info/save', data })
}

// APP基础信息修改
export const updateAppInfo = (data): Promise<IResponse> => {
  return request.post({ url: '/opr/web/info/update', data })
}

// 删除APP基础信息
export const removeAppInfo = (ids: any): Promise<IResponse> => {
  const params = new URLSearchParams()
  params.append('id', ids)
  return request.post({
    url: '/opr/web/info/remove',
    params,
    headersType: 'application/x-www-form-urlencoded'
  })
}

// 发布APP基础信息
export const updateEnabledAppInfo = (ids: any): Promise<IResponse> => {
  const params = new URLSearchParams()
  params.append('id', ids)
  return request.post({
    url: '/opr/web/info/updateEnabled',
    params,
    headersType: 'application/x-www-form-urlencoded'
  })
}

// 获取APP版本信息分页
export const appVersionPage = (data): Promise<IResponse> => {
  return request.post({ url: '/mm/web/appVersion/page', data })
}

// APP版本信息保存
export const saveAppVersion = (data): Promise<IResponse> => {
  return request.post({ url: '/mm/web/appVersion/save', data })
}

// APP版本信息修改
export const updateAppVersion = (data): Promise<IResponse> => {
  return request.post({ url: '/mm/web/appVersion/update', data })
}

// 删除APP版本信息
export const removeAppVersion = (ids: any): Promise<IResponse> => {
  const params = new URLSearchParams()
  params.append('id', ids)
  return request.post({
    url: '/mm/web/appVersion/remove',
    params,
    headersType: 'application/x-www-form-urlencoded'
  })
}

// 查询项目列表数据
export const getAreaList = (): Promise<IResponse> => {
  return request.get({ url: '/system/area/list?level=3' })
}
