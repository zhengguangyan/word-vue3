import request from '@/config/axios'

//菜单列表
export function listDept(params?) {
  return request.get({ url: '/system/dept/list', params })
}

// 查询部门列表（排除节点）
export function listDeptExcludeChild(id) {
  return request.get({ url: '/system/dept/list/exclude/' + id })
}

// 查询部门详细
export function getDept(id) {
  return request.get({ url: '/system/dept/' + id })
}

// 新增部门
export function addDept(data?) {
  return request.post({ url: '/system/dept/add', data })
}

// 修改部门
export function updateDept(data?) {
  return request.post({ url: '/system/dept/edit', data })
}

// 删除部门

export function delDept(id) {
  return request.delete({ url: '/system/dept/' + id })
}

// 删除验证
export function checkDeptExistUser(id) {
  return request.get({ url: '/system/dept/deleteCheck/' + id })
}

//  开启关闭部门状态
export function onOff(data?) {
  return request.post({
    url: '/system/dept/updateStatus/?deptId=' + data.deptId + '&status=' + data.status
  })
}
