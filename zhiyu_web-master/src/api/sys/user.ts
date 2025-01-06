import request from '@/config/axios'

// 区域选择
export const area = (data: any): Promise<IResponse> => {
  return request.post({ url: '/system/area/chooseArea', data },)
}

// 去除项目缓存
export const removeArea = (): Promise<IResponse> => {
  return request.post({ url: '/system/area/removeArea' },)
}

export const getTableListApi = (params: any): Promise<IResponse> => {
  return request.get({ url: '/system/user/list', params })
}
// 分页获取用户列表-下拉
export const getUserSelectList = (data: any): Promise<IResponse> => {
  return request.post({ url: '/system/user/listVO', data })
}

export const delTableListApi = (ids: string[] | number[]): Promise<IResponse> => {
  return request.delete({ url: '/system/user/' + ids, })
}
export const getUser = (id: any | null): Promise<IResponse> => {
  return request.get({ url: '/system/user/' + id, })
}
export const deptTreeSelect = (params: any | null): Promise<IResponse> => {
  return request.get({ url: '/system/user/deptTree', params })
}
export const addUser = (data: any): Promise<IResponse> => {
  return request.post({ url: '/system/user/add', data },)
}
export const updateUser = (data: any): Promise<IResponse> => {
  return request.post({ url: '/system/user/edit', data },)
}

export const resetUserPwd = (data: any): Promise<IResponse> => {
  return request.post({ url: '/system/user/resetPwd', data })
}

// 查询授权角色
export function getAuthRole(userId) {
  return request.get({ url: '/system/user/authRole/' + userId, })
}


// 保存授权角色
export function updateAuthRole(data) {
  return request.post({ url: '/system/user/authRole', data })

}
// 保存授权角色
export function getRoles(params: any) {
  return request.get({ url: '/system/role/optionselectBykeyword', params })

}
// 导出
export const exportWeekly = (params: any): Promise<IResponse> => {
  return request.post({ url: '/system/user/export', params, responseType: "blob", })
}

// 用户来源字典
export function dictType(userId) {
  return request.get({ url: '/system/dict/data/type/' + userId, })

}

export function changeUserStatus(data: any) {
  return request.post({ url: '/system/user/changeStatus', data })

}