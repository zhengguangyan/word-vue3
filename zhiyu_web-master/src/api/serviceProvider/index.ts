import request from '@/config/axios'
import { useCache } from '@/hooks/web/useCache'
const { wsCache } = useCache()

// 获取服务商详情
export const getProviderDetail = (id: any): Promise<IResponse> => {
  const params = new URLSearchParams()
  params.append('id', id)
  return request.post({
    url: '/sc/web/seller/detail',
    params,
    headersType: 'application/x-www-form-urlencoded'
  })
}

// 获取服务商分页
export const getProviderPage = (data): Promise<IResponse> => {
  return request.post({ url: '/sc/web/seller/page', data })
}

// 获取服务商列表
export const getProviderList = (data?): Promise<IResponse> => {
  return request.post({ url: '/sc/web/seller/list', data })
}

// 新增服务商
export const addProvider = (data): Promise<IResponse> => {
  return request.post({ url: '/sc/web/seller/save', data })
}

// 修改服务商
export const updateProvider = (data): Promise<IResponse> => {
  return request.post({ url: '/sc/web/seller/update', data })
}

// 服务商数据分析
export const getDataAnalysis = (): Promise<IResponse> => {
  const params = new URLSearchParams()
  params.append('queryAreaCode', wsCache.get('areaCode'))
  return request.post({
    url: '/sc/web/seller/getDataAnalysis',
    params,
    headersType: 'application/x-www-form-urlencoded'
  })
}

// 验证删除服务商
export const verifyDeleteSeller = (ids: any): Promise<IResponse> => {
  const params = new URLSearchParams()
  params.append('ids', ids)
  return request.post({
    url: '/sc/web/seller/verifyDelete',
    params,
    headersType: 'application/x-www-form-urlencoded'
  })
}

// 删除服务商
export const deleteSeller = (ids: any): Promise<IResponse> => {
  const params = new URLSearchParams()
  params.append('ids', ids)
  return request.post({
    url: '/sc/web/seller/remove',
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

// 获取服务商类型列表
export const getProviderTypeList = (): Promise<IResponse> => {
  return request.post({ url: '/sc/web/sellerCategory/list' })
}

// 获取服务商类型树
export const getProviderTypeTree = (): Promise<IResponse> => {
  return request.post({ url: '/sc/web/sellerCategory/treeList' })
}

// 新增服务商类型
export const saveProviderType = (data): Promise<IResponse> => {
  return request.post({ url: '/sc/web/sellerCategory/save', data })
}

// 修改服务商类型
export const updateProviderType = (data): Promise<IResponse> => {
  return request.post({ url: '/sc/web/sellerCategory/update', data })
}

// 删除服务商类型
export const deleteProviderType = (ids: any): Promise<IResponse> => {
  const params = new URLSearchParams()
  params.append('ids', ids)
  return request.post({
    url: '/sc/web/sellerCategory/remove',
    params,
    headersType: 'application/x-www-form-urlencoded'
  })
}

// 验证删除服务商类型
export const verifyDeleteProviderType = (ids: any): Promise<IResponse> => {
  const params = new URLSearchParams()
  params.append('ids', ids)
  return request.post({
    url: '/sc/web/sellerCategory/verifyDelete',
    params,
    headersType: 'application/x-www-form-urlencoded'
  })
}

/* 服务项目相关 */

// 获取服务类型树
export const getServeTypeTree = (): Promise<IResponse> => {
  return request.post({ url: '/srv/web/serveCategory/treeList' })
}

// 获取服务类型列表
export const getServeTypeList = (): Promise<IResponse> => {
  return request.post({ url: '/srv/web/serveCategory/list' })
}

// 新增服务类型
export const saveServeType = (data): Promise<IResponse> => {
  return request.post({ url: '/srv/web/serveCategory/save', data })
}

// 修改服务类型
export const updateServeType = (data): Promise<IResponse> => {
  return request.post({ url: '/srv/web/serveCategory/update', data })
}

// 获取服务类型详情
export const getServeTypeDetail = (ids: any): Promise<IResponse> => {
  const params = new URLSearchParams()
  params.append('id', ids)
  return request.post({
    url: '/srv/web/serveCategory/detail',
    params,
    headersType: 'application/x-www-form-urlencoded'
  })
}

// 删除服务类型
export const deleteServeType = (ids: any): Promise<IResponse> => {
  const params = new URLSearchParams()
  params.append('ids', ids)
  return request.post({
    url: '/srv/web/serveCategory/remove',
    params,
    headersType: 'application/x-www-form-urlencoded'
  })
}

// 验证删除服务商类型
export const verifyDeleteServeType = (ids: any): Promise<IResponse> => {
  const params = new URLSearchParams()
  params.append('ids', ids)
  return request.post({
    url: '/srv/web/serveCategory/verifyDelete',
    params,
    headersType: 'application/x-www-form-urlencoded'
  })
}

// 获取服务商与服务项目中间表分页
export const getServeWithSeller = (data): Promise<IResponse> => {
  return request.post({ url: '/srv/web/serveWithSeller/page', data })
}
// 获取服务商与服务项目中间表列表
export const getServeWithSellerList = (data): Promise<IResponse> => {
  return request.post({ url: '/srv/web/serveWithSeller/list', data })
}

// 通过服务条件以及服务商名称查询服务商
export const getSellerInServePage = (data): Promise<IResponse> => {
  return request.post({ url: '/srv/web/serveWithSeller/sellerInServePage', data })
}

// 获取新增服务项目
export const getServeWithSellerServePage = (data): Promise<IResponse> => {
  return request.post({ url: '/srv/web/serveWithSeller/servePage', data })
}

// 服务项目保存
export const saveYlSrvServe = (data): Promise<IResponse> => {
  return request.post({ url: '/srv/web/serveWithSeller/saveYlSrvServe', data })
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
