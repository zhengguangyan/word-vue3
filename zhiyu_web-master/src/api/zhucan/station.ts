/** 助餐站点管理 */
import request from '@/config/axios'

// 详情
export const siteDetail = (id): Promise<IResponse> => {
  const params = new URLSearchParams()
  params.append('id', id)
  return request.post({
    url: '/opr/web/diningStation/detail',
    params,
    headersType: 'application/x-www-form-urlencoded'
  })
}

// 编辑二维码菜单
export const editQrMenu = (data): Promise<IResponse> => {
  return request.post({ url: '/opr/web/diningStation/editQrMenu', data })
}

// 列表
export const siteList = (data): Promise<IResponse> => {
  return request.post({ url: '/opr/web/diningStation/list', data })
}

// 配置菜单列表
export const menuList = (data): Promise<IResponse> => {
  return request.post({ url: '/opr/web/diningStation/menusList', data })
}

// 配置菜单分页
export const menusPage = (data): Promise<IResponse> => {
  return request.post({ url: '/opr/web/diningStation/menusPage', data })
}

// 分页
export const sitePage = (data): Promise<IResponse> => {
  return request.post({ url: '/opr/web/diningStation/page', data })
}

// 批量删除
export const siteRemove = (ids): Promise<IResponse> => {
  const params = new URLSearchParams()
  params.append('ids', ids)
  return request.post({
    url: '/opr/web/diningStation/remove',
    params,
    headersType: 'application/x-www-form-urlencoded'
  })
}

// 配置站点菜单移除
export const menuRemove = (data): Promise<IResponse> => {
  return request.post({ url: '/opr/web/diningStation/removeMenu', data })
}

// 保存
export const siteSave = (data): Promise<IResponse> => {
  return request.post({ url: '/opr/web/diningStation/save', data })
}

// 配置站点菜单保存
export const menuSave = (data): Promise<IResponse> => {
  return request.post({ url: '/opr/web/diningStation/saveMenu', data })
}

// 选择站点人员列表
export const siteUserList = (data): Promise<IResponse> => {
  return request.post({ url: '/opr/web/diningStation/userByRoleList', data })
}

// 选择站点人员分页
export const siteUserPage = (data): Promise<IResponse> => {
  return request.post({ url: '/opr/web/diningStation/userByRolePage', data })
}

// 校验删除
export const verifyDelete = (ids): Promise<IResponse> => {
  const params = new URLSearchParams()
  params.append('ids', ids)
  return request.post({
    url: '/opr/web/diningStation/verifyDelete',
    params,
    headersType: 'application/x-www-form-urlencoded'
  })
}