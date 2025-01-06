const imgUrl = import.meta.env.VITE_IMAGE_URL

const config: {
  base_url: {
    base: string
    dev: string
    pro: string
    test: string
  }
  result_code: number | string
  default_headers: AxiosHeaders
  default_headers_form: AxiosHeaders
  request_timeout: number
  base_img: {
    dev: string
    pro: string
  }
} = {
  /**
   * api请求基础路径
   */
  base_url: {
    // 开发环境接口前缀
    base: 'api',
    // 打包开发环境接口前缀
    dev: 'api',

    // 打包生产环境接口前缀
    pro: 'api',

    // 打包测试环境接口前缀
    test: 'api'
  },
  base_img:{
    dev: `${imgUrl}/zhiyu-file`,
    // dev: 'http://192.168.20.174:8061/zhiyu-file',
    pro: `${import.meta.env.VITE_IMAGE_URL}/zhiyu-file`
  },

  /**
   * 接口成功返回状态码
   */
  result_code: '200',

  /**
   * 接口请求超时时间
   */
  request_timeout: 60000,

  /**
   * 默认接口请求类型
   * 可选值：application/x-www-form-urlencoded multipart/form-data
   */
  default_headers: 'application/json',

  default_headers_form: 'multipart/form-data'
}

export { config }
