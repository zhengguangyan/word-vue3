import request from '@/config/axios'
// 查询字典数据列表
export function listData(query?) {
  return request.get({ url: `/system/dict/data/type/${query}`})
}

// 查询字典数据详细
export function getData(dictCode?) {
  return request.get({ url: '/system/dict/data/' + dictCode })
}

// 根据字典类型查询字典数据信息
export function getDicts(dictType?) {
  return request.get({ url: '/system/dict/data/type/' + dictType, })
}

// 新增字典数据
export function addData(data?) {
  return request.post({ url: '/system/dict/data/add', data })
}

// 修改字典数据
export function updateData(data) {
  return request.post({ url: '/system/dict/data/edit', data })
}



// 删除字典数据
export function delData(dictCode) {
  return request.delete({ url: '/system/dict/data/' + dictCode, })
}
