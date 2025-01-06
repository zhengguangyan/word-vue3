import request from '@/config/axios'


//菜单列表

export function menuList(params?) {
  return request.get({ url: '/system/menu/list', params })
}

// 查看下拉树状解构
export const treeseLect = () => {
  return request.get({ url: '/system/menu/treeselect' })
}

//新增
export function addMenu(data?) {
  return request.post({ url: '/system/menu/add', data })
}

// 根据角色ID查询菜单下拉树结构
export const roleMenuTreeselect = (roleId: any): Promise<IResponse> => {
  return request.get({ url: '/system/menu/treeselect' + roleId })
}

// 详细
export function menuDetail(menuId) {
  return request.get({ url: '/system/menu/' + menuId })
}

// 修改
export function updateMenu(data?) {
  return request.post({ url: '/system/menu/edit', data })
}

//  删除
export function menuDelete(menuId) {
  return request.delete({ url: '/system/menu/' + menuId })
}

//获取菜单权限数据
export function getMenuAuth(menuId) {
  return request.get({ url: '/system/dataPower/getMenuPowerInfo/' + menuId })
}


//获取菜单权限数据
export const getRoleMenuTree = (type: string): Promise<IResponse> => {
  return request.get({ url: '/system/menu/roleMenuTree/' + type, })
}

//修改状态
export const onOff = (data?: any): Promise<IResponse> => {
  return request.post({ url: '/system/menu/onOff', data })
}