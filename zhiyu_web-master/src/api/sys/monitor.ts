import request from '@/config/axios'


// 查询定时任务列表
export function jobList(params?) {
  return request.get({ url: '/monitor/job/list', params })
}

// 修改定时任务
export function updateJob(data?) {
  return request.post({ url: '/monitor/job/edit', data })
}

// 新增定时任务
export function addJob(data?) {
  return request.post({ url: '/monitor/job/add', data })
}

// 定时任务详细
export function jobDetail(jobId) {
  return request.get({ url: '/monitor/job' + jobId })
}

// 删除定时任务
export function jobDelete(jobId) {
  return request.delete({ url: '/monitor/job' + jobId })
}

// 定时任务修改状态
export const jobChangeStatus = (data?: any): Promise<IResponse> => {
  return request.post({ url: '/monitor/job/changeStatus', data })
}

// 定时任务立即执行一次
export const jobRunOne = (data?: any): Promise<IResponse> => {
  return request.post({ url: '/monitor/job/run', data })
}