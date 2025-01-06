import request from '@/config/axios'
// 获取系统时间戳
export const getSystemTime = (): Promise<IResponse> => {
  return request.get({ url: '/system/user/getTimestamp' })
}