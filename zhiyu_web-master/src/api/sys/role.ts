import request from '@/config/axios'
import type { TableData } from './types'

export const getRoleListApi = (params: any): Promise<IResponse> => {
  return request.get({ url: '/system/role/list', params })
}

export const saveTableApi = (data: Partial<TableData>): Promise<IResponse> => {
  return request.post({ url: '/system/role/edit', data })
}
export const saveAddTableApi = (data: Partial<TableData>): Promise<IResponse> => {
  return request.post({ url: '/system/role/add', data })
}

export const getTableDetApi = (id: string): Promise<IResponse<TableData>> => {
  return request.get({ url: '/example/detail', params: { id } })
}

export const delTableListApi = (ids: string[] | number[]): Promise<IResponse> => {
  return request.delete({ url: '/system/role/' + ids })
}

export const getRoleMenuTreeselect = (id: string[] | number[]): Promise<IResponse> => {
  return request.get({ url: '/system/menu/roleMenuTreeselect/' + id, })
}

export const getRoleMenuTree = (type: string, id: string[] | number[]): Promise<IResponse> => {
  return request.get({ url: '/system/menu/roleMenuTree/' + type + '/' + id, })
}

export const treeselect = (): Promise<IResponse> => {
  return request.get({ url: '/system/menu/treeselect' })
}

//查询用户授权列表数据
export const allocatedUserList = (params: any): Promise<IResponse> => {
  return request.get({ url: '/system/role/authUser/allocatedList', params })
}
//查询角色用户未授权列表数据
export const unallocatedUserList = (params: any): Promise<IResponse> => {
  return request.get({ url: '/system/role/authUser/unallocatedList', params })
}
//取消用户授权角色
export const authUserCancel = (data: any): Promise<IResponse> => {
  return request.post({ url: '/system/role/authUser/cancel', data })
}

//取消用户授权角色
export const authUserCancelAll = (params: any): Promise<IResponse> => {
  return request.post({ url: '/system/role/authUser/cancelAll', params })
}

//授权用户选择
export const authUserSelectAll = (params: any): Promise<IResponse> => {
  return request.post({ url: '/system/role/authUser/selectAll', params })
}

//获取树
export const deptTreeSelect = (id: string[] | number[]): Promise<IResponse> => {
  return request.get({ url: '/system/role/deptTree/' + id })
}
// 查询角色详细
export const getRole = (roleId: string | number): Promise<IResponse> => {
  return request.get({ url: '/system/role/' + roleId })
}

//权限保存
export const dataScope = (roleId: string | number, data: any): Promise<IResponse> => {
  return request.post({ url: '/system/dataPower/update/' + roleId, data })
}
//权限保存
export const checkDeletedRole = (roleId: any,): Promise<IResponse> => {
  return request.get({ url: '/system/role/checkDeletedRole/' + roleId, })
}

export function changeRoleStatus(data: any) {
  return request.post({ url: '/system/role/changeStatus', data })

}