import request from '@/config/axios'
import requestFile from '@/config/axios'

// 用户信息
export const getUserProfile = (): Promise<IResponse> => {
  return request.get({ url: '/system/user/profile', method: 'get' })
}

export const getInfo = (): Promise<IResponse> => {
  return request.get({ url: '/getInfo' })
}

export const updateUserInfo = (data: any): Promise<IResponse> => {
  return request.post({ url: '/system/user/profile/updateProfile', data })
}

// 获取/修改头像
export const uploadAvatar = (dataImg) => {
  return requestFile.postFile({ url: '/system/user/profile/avatar', data: dataImg })
}

// 修改密码
export function updateUserPwd(oldPassword, newPassword) {
  const data = { oldPassword, newPassword }
  return request.post({ url: '/system/user/profile/updatePwd', data })
}
