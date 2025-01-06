import request from '@/config/axios'
import { useCache } from '@/hooks/web/useCache'
const { wsCache } = useCache()

//菜单列表

export function areaList(params?) {
  return request.get({ url: '/system/area/list', params })
}

//新增
export function addArea(data?) {
  return request.post({ url: '/system/area/add', data })
}

// 详情
export function areaEdi(id) {
  return request.get({ url: '/system/area/' + id })
}

// 修改
export function updateArea(data?) {
  return request.post({ url: '/system/area/edit', data })
}

// 查看下拉树状解构
export const treeList = (params?: any) => {
  return request.get({ url: '/system/area/treeList', params })
}

// 查看下拉树状结构--新增编辑使用
export const treeListForEdit = (params?: any) => {
  return request.get({ url: '/system/area/treeListForEdit', params })
}

//  删除
export function areaDelete(ids) {
  return request.delete({ url: '/system/area/' + ids })
}

//
// 省份数据
export const sleProvinces = (params: any) => {
  return request.get({ url: '/system/region/provinces', params }) //搜索name
}
// 城市数据
export const sleCitys = (params: any) => {
  return request.get({ url: '/system/region/citys', params }) //联动provinceCode,搜索name
}
// 区数据
export const sleCountys = (params: any) => {
  return request.get({ url: '/system/region/countys', params }) //联动cityCode,搜索name
}
// 区数据
export const sleSearch = async (params: any) => {
  let res = wsCache.get(JSON.stringify(params))
  if (!res) {
    res = await request.get({ url: '/system/region/search', params })
    wsCache.set(JSON.stringify(params), res)
  }
  return res
}

export const searchAreaCode = async (params: any) => {
  let res = wsCache.get(JSON.stringify(params))
  if (!res) {
    res = await request.get({ url: '/system/region/searchAreaCode', params })
    wsCache.set(JSON.stringify(params), res)
  }
  return res
}

//  删除校验
export function areaDeleteut(ids) {
  return request.get({ url: '/system/area/deleteCheck/' + ids })
}

//  开启关闭项目
export function onOff(data?) {
  return request.post({ url: '/system/area/onOff', data })
}

//  项目下的区域list数据
export function getAreaByProjectCode(params?) {
  return request.get({ url: '/system/region/getAreaCode', params })
}
