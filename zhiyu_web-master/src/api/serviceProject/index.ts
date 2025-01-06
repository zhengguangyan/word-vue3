import request from '@/config/axios'

// 获取服务综合统计
export const getComprehensive = (data): Promise<IResponse> => {
  return request.post({ url: '/srv/web/serveInfo/comprehensive', data })
}

// 获取服务项目列表
export const getServeInfoList = (data): Promise<IResponse> => {
  return request.post({ url: '/srv/web/serveInfo/list', data })
}

// 获取服务项目分页
export const getServeInfoPage = (data): Promise<IResponse> => {
  return request.post({ url: '/srv/web/serveInfo/page', data })
}

// 获取服务项目信息详情
export const getServeInfoDetail = (id: any): Promise<IResponse> => {
  const params = new URLSearchParams()
  params.append('id', id)
  return request.post({
    url: '/srv/web/serveInfo/detail',
    params,
    headersType: 'application/x-www-form-urlencoded'
  })
}

// 服务项目信息上下架
export const updateIsGroundById = (data): Promise<IResponse> => {
  const params = new URLSearchParams()
  params.append('id', data.id)
  params.append('isGround', data.isGround)
  return request.post({
    url: '/srv/web/serveInfo/updateIsGroundById',
    params,
    headersType: 'application/x-www-form-urlencoded'
  })
}

// 获取服务项目类别树
export const getCategoryTree = (): Promise<IResponse> => {
  return request.post({ url: '/srv/web/serveCategory/treeList' })
}

// 服务项目信息保存
export const addProject = (data): Promise<IResponse> => {
  return request.post({ url: '/srv/web/serveInfo/save', data })
}

// 服务项目信息修改
export const updateProject = (data): Promise<IResponse> => {
  return request.post({ url: '/srv/web/serveInfo/update', data })
}

// 验证删除服务项目
export const verifyDeleteServe = (ids: any): Promise<IResponse> => {
  const params = new URLSearchParams()
  params.append('ids', ids)
  return request.post({
    url: '/srv/web/serveInfo/verifyDelete',
    params,
    headersType: 'application/x-www-form-urlencoded'
  })
}

// 删除服务项目
export const deleteServe = (ids: any): Promise<IResponse> => {
  const params = new URLSearchParams()
  params.append('ids', ids)
  return request.post({
    url: '/srv/web/serveInfo/remove',
    params,
    headersType: 'application/x-www-form-urlencoded'
  })
}

// 通过ID获取上传图片url
export const getUrl = (ids: any): Promise<IResponse> => {
  const params = new URLSearchParams()
  params.append('id', ids)
  return request.post({
    url: '/minio/endpoint/getRelativeUrl',
    params,
    headersType: 'application/x-www-form-urlencoded'
  })
}

/**
 * 服务商与服务项目中间表
 */

// 获取服务商与服务项目中间表分页
export const getServeWithSellerPage = (data): Promise<IResponse> => {
  return request.post({ url: '/srv/web/serveWithSeller/page', data })
}

// 获取新增服务商
export const getServeWithSellerSellerPage = (data): Promise<IResponse> => {
  return request.post({ url: '/srv/web/serveWithSeller/sellerPage', data })
}

// 服务商保存
export const saveYlSrvSeller = (data): Promise<IResponse> => {
  return request.post({ url: '/srv/web/serveWithSeller/saveYlSrvSeller', data })
}

// 删除服务商与服务项目中间表列表
export const removeServeWithSeller = (ids: any): Promise<IResponse> => {
  const params = new URLSearchParams()
  params.append('ids', ids)
  return request.post({
    url: '/srv/web/serveWithSeller/remove',
    params,
    headersType: 'application/x-www-form-urlencoded'
  })
}

/**
 * 服务子项
 */

//获取服务子项分页
export const getOptionPage = (data): Promise<IResponse> => {
  return request.post({ url: '/srv/web/option/page', data })
}

// 获取服务子项列表
export const getOptionList = (data): Promise<IResponse> => {
  return request.post({ url: '/srv/web/option/list', data })
}

// 服务子项上下架
export const updateOptionIsGroundById = (data): Promise<IResponse> => {
  const params = new URLSearchParams()
  params.append('id', data.id)
  params.append('isGround', data.isGround)
  return request.post({
    url: '/srv/web/option/updateIsGroundById',
    params,
    headersType: 'application/x-www-form-urlencoded'
  })
}

// 服务子项信息保存
export const addOption = (data): Promise<IResponse> => {
  return request.post({ url: '/srv/web/option/save', data })
}

// 服务子项信息更新
export const updateOption = (data): Promise<IResponse> => {
  return request.post({ url: '/srv/web/option/update', data })
}

// 验证删除服务子项
export const verifyDeleteOption = (ids: any): Promise<IResponse> => {
  const params = new URLSearchParams()
  params.append('ids', ids)
  return request.post({
    url: '/srv/web/option/verifyDelete',
    params,
    headersType: 'application/x-www-form-urlencoded'
  })
}

// 删除服务子项
export const deleteOption = (ids: any): Promise<IResponse> => {
  const params = new URLSearchParams()
  params.append('ids', ids)
  return request.post({
    url: '/srv/web/option/remove',
    params,
    headersType: 'application/x-www-form-urlencoded'
  })
}

// 获取服务子项信息详情
export const getOptionDetail = (id: any): Promise<IResponse> => {
  const params = new URLSearchParams()
  params.append('id', id)
  return request.post({
    url: '/srv/web/option/detail',
    params,
    headersType: 'application/x-www-form-urlencoded'
  })
}
