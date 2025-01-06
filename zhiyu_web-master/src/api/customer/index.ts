import request from '@/config/axios'

export const saveCustomerInfo = (data: any): Promise<IResponse> => {
  return request.post({ url: '/customer/web/info/save', data: data })
}

export const getCustomerPage = (data: any): Promise<IResponse> => {
  return request.post({ url: '/customer/web/info/page', data: data })
}

export const getCustomerMsg = (): Promise<IResponse> => {
  return request.post({ url: '/customer/web/info/customerMsg' })
}

export const getCustomerPage2 = (data: any): Promise<IResponse> => {
  return request.post({ url: '/customer/web/info/selectPage', data: data })
}

// 获取客户列表
export const getCustomerList = (data: any): Promise<IResponse> => {
  return request.post({ url: '/customer/web/info/list', data: data })
}

// 通过手机号获取客户信息
export const getCustomerInfoByPhone = (phone: any): Promise<IResponse> => {
  return request.post({ url: '/customer/web/info/servelist', data: { mobilephone: phone } })
}

// 通过客户 ID 获取基础信息
export const getCustomerBaseDetailById = (id: any): Promise<IResponse> => {
  const params = new URLSearchParams()
  params.append('id', id)
  return request.post({
    url: '/customer/web/info/baseDetail',
    params: params,
    headersType: 'application/x-www-form-urlencoded'
  })
}

// 客户基本信息保存或修改
export const saveCustomerBaseInfo = (data: any): Promise<IResponse> => {
  return request.post({ url: '/customer/web/info/save', data: data })
}

// 客户基本信息修改
export const updateCustomerBaseInfo = (data: any): Promise<IResponse> => {
  return request.post({ url: '/customer/web/info/update', data: data })
}

// 通过客户ID获取联系方式
export const getContactListById = (id: any): Promise<IResponse> => {
  return request.post({ url: '/customer/web/contact/list', data: { customerId: id } })
}

//客户联系方式信息保存或修改
export const saveContact = (data: any): Promise<IResponse> => {
  return request.post({ url: '/customer/web/contact/save', data })
}

//客户联系方式信息修改
export const updateContact = (data: any): Promise<IResponse> => {
  return request.post({ url: '/customer/web/contact/update', data })
}

//删除客户联系方式
export const deleteContactById = (id: any): Promise<IResponse> => {
  const params = new URLSearchParams()
  params.append('ids', id)
  return request.post({
    url: '/customer/web/contact/remove',
    params: params,
    headersType: 'application/x-www-form-urlencoded'
  })
}

// 验证手机号码
export const getMobilephone = (data: any): Promise<IResponse> => {
  // const params = new URLSearchParams()
  // if (data.id) {
  //   params.append('id', data.id)
  // }
  // params.append('mobilephone', data.phoneNumber)
  return request.post({ url: '/customer/web/info/servePage', data })
}

// 通过客户 ID 获取需求信息
export const getRequirementDetailById = (id: any): Promise<IResponse> => {
  const params = new URLSearchParams()
  params.append('customerId', id)
  return request.post({
    url: '/customer/web/oldman/detailBycustomerId',
    params: params,
    headersType: 'application/x-www-form-urlencoded'
  })
}

// 需求信息保存或修改
export const saveRequirement = (data: any): Promise<IResponse> => {
  return request.post({ url: '/customer/web/oldman/save', data: data })
}

// 需求信息修改
export const updateRequirement = (data: any): Promise<IResponse> => {
  return request.post({ url: '/customer/web/oldman/update', data: data })
}

// 获取客户服务列表
export const getServelist = (data: any): Promise<IResponse> => {
  return request.post({ url: '/customer/web/info/servelist', data: data })
}

// 通过客户 ID 获取延伸信息
export const getExtendDetailById = (id: any): Promise<IResponse> => {
  const params = new URLSearchParams()
  params.append('customerId', id)
  return request.post({
    url: '/customer/web/extend/detailByCustomerId',
    params: params,
    headersType: 'application/x-www-form-urlencoded'
  })
}

// 保存延伸信息
export const verifyDeathFlag = (data: any): Promise<IResponse> => {
  return request.post({ url: '/customer/web/info/verifyDeathFlag', params: data })
}

// 保存延伸信息
export const saveExtend = (data: any): Promise<IResponse> => {
  return request.post({ url: '/customer/web/extend/save', data: data })
}

// 更新延伸信息
export const updateExtend = (data: any): Promise<IResponse> => {
  return request.post({ url: '/customer/web/extend/update', data: data })
}

// 保存健康信息
export const saveHealth = (data: any): Promise<IResponse> => {
  return request.post({ url: '/customer/web/health/save', data: data })
}

// 更新健康信息
export const updateHealth = (data: any): Promise<IResponse> => {
  return request.post({ url: '/customer/web/health/update', data: data })
}

// 获取住院历史
export const getHospital = (data: any): Promise<IResponse> => {
  return request.post({ url: '/customer/web/hospital/page', data: data })
}
// 保存住院历史
export const saveHospital = (data: any): Promise<IResponse> => {
  return request.post({ url: '/customer/web/hospital/save', data: data })
}
// 更新住院历史
export const updateHospital = (data: any): Promise<IResponse> => {
  return request.post({ url: '/customer/web/hospital/update', data: data })
}
// 通过ID删除住院历史
export const delHospitalById = (id: any): Promise<IResponse> => {
  const params = new URLSearchParams()
  params.append('ids', id)
  return request.post({
    url: '/customer/web/hospital/remove',
    params: params,
    headersType: 'application/x-www-form-urlencoded'
  })
}
// 获取用药情况
export const getMedication = (data: any): Promise<IResponse> => {
  return request.post({ url: '/customer/web/medication/page', data: data })
}
// 保存用药情况
export const saveMedication = (data: any): Promise<IResponse> => {
  return request.post({ url: '/customer/web/medication/save', data: data })
}
// 更新用药情况
export const updateMedication = (data: any): Promise<IResponse> => {
  return request.post({ url: '/customer/web/medication/update', data: data })
}
// 通过ID删除用药情况
export const delMedicationById = (id: any): Promise<IResponse> => {
  const params = new URLSearchParams()
  params.append('ids', id)
  return request.post({
    url: '/customer/web/medication/remove',
    params: params,
    headersType: 'application/x-www-form-urlencoded'
  })
}
// 通过客户 ID 获取健康信息
export const getHealthDetailById = (id: any): Promise<IResponse> => {
  const params = new URLSearchParams()
  params.append('customerId', id)
  return request.post({
    url: '/customer/web/health/detailByCustomerId',
    params: params,
    headersType: 'application/x-www-form-urlencoded'
  })
}

// 通过客户 ID 获取用药信息
export const getHospitalById = (id: any): Promise<IResponse> => {
  const params = new URLSearchParams()
  params.append('id', id)
  return request.post({
    url: '/customer/web/hospital/detail',
    params: params,
    headersType: 'application/x-www-form-urlencoded'
  })
}

// 通过客户 ID 获取住院信息
export const getMedicationById = (id: any): Promise<IResponse> => {
  const params = new URLSearchParams()
  params.append('id', id)
  return request.post({
    url: '/customer/web/medication/detail',
    params: params,
    headersType: 'application/x-www-form-urlencoded'
  })
}

// 通过成员ID获取家庭信息
export const getFamilyDetailById = (id: any): Promise<IResponse> => {
  const params = new URLSearchParams()
  params.append('id', id)
  return request.post({
    url: '/customer/web/family/detail',
    params: params,
    headersType: 'application/x-www-form-urlencoded'
  })
}

// 家庭信息列表
export const getFamilyList = (data: any): Promise<IResponse> => {
  return request.post({ url: '/customer/web/family/list', data: data })
}

// 通过成员ID删除家庭信息
export const delFamilyDetailById = (id: any): Promise<IResponse> => {
  const params = new URLSearchParams()
  params.append('ids', id)
  return request.post({
    url: '/customer/web/family/remove',
    params: params,
    headersType: 'application/x-www-form-urlencoded'
  })
}

// 通过客户ID获取家庭信息
export const getFamilyDetail = (data: any): Promise<IResponse> => {
  return request.post({ url: '/customer/web/family/page', data: data })
}

// 新增或修改家庭信息
export const saveFamilyDetail = (data: any): Promise<IResponse> => {
  return request.post({ url: '/customer/web/family/save', data: data })
}

// 修改家庭信息
export const updateFamilyDetail = (data: any): Promise<IResponse> => {
  return request.post({ url: '/customer/web/family/update', data: data })
}

// export const updateCustomerInfo = (data: any): Promise<IResponse> => {
//   return request.post({ url: '/customer/web/info/saveBase', data: data })
// }

// 分页查询客户跟踪信息
export const getRecordPage = (data: any): Promise<IResponse> => {
  return request.post({ url: '/customer/web/record/page', data })
}

// 新增或修改客户跟踪信息
export const saveRecord = (data: any): Promise<IResponse> => {
  return request.post({ url: '/customer/web/record/save', data })
}

// 修改客户跟踪信息
export const updateRecord = (data: any): Promise<IResponse> => {
  return request.post({ url: '/customer/web/record/update', data })
}

// 分页查询客户血压信息
export const getBpDataPage = (data: any): Promise<IResponse> => {
  return request.post({ url: '/customer/web/bpData/page', data })
}

// 新增或修改老人血压信息
export const saveBpData = (data: any): Promise<IResponse> => {
  return request.post({ url: '/customer/web/bpData/save', data })
}

// 修改老人血压信息
export const updateBpData = (data: any): Promise<IResponse> => {
  return request.post({ url: '/customer/web/bpData/update', data })
}

// 批量删除老人血压信息
export const delBpDataById = (id: any): Promise<IResponse> => {
  const params = new URLSearchParams()
  params.append('ids', id)
  return request.post({
    url: '/customer/web/bpData/remove',
    params: params,
    headersType: 'application/x-www-form-urlencoded'
  })
}

// 分页查询客户血糖信息
export const getBsDataPage = (data: any): Promise<IResponse> => {
  return request.post({ url: '/customer/web/bsdata/page', data })
}

// 新增或修改老人血糖信息
export const saveBsData = (data: any): Promise<IResponse> => {
  return request.post({ url: '/customer/web/bsdata/save', data })
}

// 修改老人血糖信息
export const updateBsData = (data: any): Promise<IResponse> => {
  return request.post({ url: '/customer/web/bsdata/update', data })
}

// 批量删除老人血糖信息
export const delBsDataById = (id: any): Promise<IResponse> => {
  const params = new URLSearchParams()
  params.append('ids', id)
  return request.post({
    url: '/customer/web/bsdata/remove',
    params: params,
    headersType: 'application/x-www-form-urlencoded'
  })
}

// 户籍现居总人数模块统计
export const getCurrentAndDomicileVO = (id: any): Promise<IResponse> => {
  const params = new URLSearchParams()
  params.append('queryAreaCode', id)
  return request.post({
    url: '/customer/web/statistics/getCurrentAndDomicileVO',
    params: params,
    headersType: 'application/x-www-form-urlencoded'
  })
}

// 现居人数模块统计
export const getCurrentVO = (data: any): Promise<IResponse> => {
  const params = new URLSearchParams()
  params.append('queryAreaCode', data.areaCode)
  params.append('type', data.type)
  return request.post({
    url: '/customer/web/statistics/getCurrentVO',
    params: params,
    headersType: 'application/x-www-form-urlencoded'
  })
}

// 户籍人数模块统计
export const getDomicileVO = (data: any): Promise<IResponse> => {
  const params = new URLSearchParams()
  params.append('queryAreaCode', data.areaCode)
  params.append('type', data.type)
  return request.post({
    url: '/customer/web/statistics/getDomicileVO',
    params: params,
    headersType: 'application/x-www-form-urlencoded'
  })
}

// 分页获取迁入迁出
export const getAddressChangeRecordPage = (data: any): Promise<IResponse> => {
  return request.post({ url: '/customer/web/address/page', data })
}
// 分页获取健在变更
export const getAliveFlagChangeRecordPage = (data: any): Promise<IResponse> => {
  return request.post({ url: '/customer/web/aliveflag/page', data })
}

// 数据分析
export const getAnalysisData = (data: any): Promise<IResponse> => {
  // const params = new URLSearchParams()
  // params.append('queryAreaCode', data.areaCode)
  // params.append('fieldName', data.fieldName)
  return request.post({
    url: '/customer/web/dataAnalysis/getCustomerDataAnalysis',
    data: data,
    // headersType: 'application/x-www-form-urlencoded'
  })
}

// 饱和度计算
export const getSaturationStatistics = (data: any): Promise<IResponse> => {
  // const params = new URLSearchParams()
  // params.append('queryAreaCode', data.areaCode)
  return request.post({ url: '/customer/web/info/saturationStatistics', data })
}

// 饱和度更新
export const updateSaturationStatistics = (id: any): Promise<IResponse> => {
  const params = new URLSearchParams()
  params.append('customerId', id)
  return request.post({
    url: '/customer/web/info/saturationByCustomerId',
    params: params,
    headersType: 'application/x-www-form-urlencoded'
  })
}

// 导入word
export const exportWord = (param: any): Promise<any> => {
  return request.post({
    url: '/customer/web/info/wordExport',
    data: param,
    responseType: 'blob'
  })
}

// 全部记录同个excel导出
export const exportExcelInOne = (param: any): Promise<any> => {
  return request.post({
    url: '/customer/web/info/export',
    data: param,
    responseType: 'blob',
    timeout: 1000000000 // 设置超时时间
  })
}

//迁入迁出 导出
export const moveInOutExport = (param: any): Promise<any> => {
  return request.post({
    url: '/customer/web/address/export',
    data: param,
    responseType: 'blob',
    timeout: 1000000000 // 设置超时时间
  })
}
//是否健在 导出
export const aliveOrNotExport = (param: any): Promise<any> => {
  return request.post({
    url: '/customer/web/aliveflag/export',
    data: param,
    responseType: 'blob',
    timeout: 1000000000 // 设置超时时间
  })
}

// excel单个导出
export const exportExcel = (param: any): Promise<any> => {
  return request.post({
    url: '/customer/web/info/excelExport',
    data: param,
    responseType: 'blob',
    timeout: 1000000000 // 设置超时时间
  })
}

// excel单个导出
export const exportToZipExcel = (param: any): Promise<any> => {
  return request.post({
    url: '/customer/web/info/exportToZip',
    data: param,
    responseType: 'blob',
    timeout: 1000000000 // 设置超时时间
  })
}

// 全部记录同个excel导出
export const importTemplate = (): Promise<any> => {
  return request.post({
    url: '/bulkImport/web/importTemplate',
    responseType: 'blob',
    timeout: 1000000000 // 设置超时时间
  })
}

// 分页获取批量列表
export const getBulkImportPage = (data: any): Promise<IResponse> => {
  return request.post({ url: '/bulkImport/web/page', data })
}

// 下载导入结果文件
export const downloadAndDelete = (data: any): Promise<IResponse> => {
  // return request.post({ url: '/common/downloadAndDelete', data })
  return request.post({ url: `/common/download?fileName=${data}`, responseType: 'blob' })
}

// 批量导入
export const importData = (data: any): Promise<any> => {
  return request.post({
    url: '/bulkImport/web/importData',
    data,
    responseType: 'blob'
  })
}

// 修改是否孤寡状态
export const updateByIdAndIsLonely = (data: any): Promise<IResponse> => {
  return request.post({ url: '/customer/web/info/updateByIdAndIsLonely', data })
}

// 分页查询客户更新信息
export const getUpdateCustomerPage = (data: any): Promise<IResponse> => {
  return request.post({ url: '/customer/web/update/page', data })
}
