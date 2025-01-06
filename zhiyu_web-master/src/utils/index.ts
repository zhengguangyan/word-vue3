// import type { Plugin } from 'vue'

/**
 *
 * @param component 需要注册的组件
 * @param alias 组件别名
 * @returns any
 */
export const withInstall = <T>(component: T, alias?: string) => {
  const comp = component as any
  comp.install = (app: any) => {
    app.component(comp.name || comp.displayName, component)
    if (alias) {
      app.config.globalProperties[alias] = component
    }
  }
  return component as T & Plugin
}

/**
 * @param str 需要转下划线的驼峰字符串 elColorPrimary转为el-color-primary elColorPrimaryLight3转为el-color-primary-light-3
 * @returns 字符串下划线
 */
export const humpToUnderline = (str: string): string => {
  return str
    .replace(/([A-Z])/g, '-$1')
    .replace(/([0-9])/g, '-$1')
    .toLowerCase()
}

export const changeColor = (color: string, value: 2 | 3 | 5 | 7 | 8 | 9) => {
  if (color[0] === '#') {
    color = color.slice(1)
  }
  // 将十六进制字符串转换为 RGB
  let r = parseInt(color.substring(0, 2), 16)
  let g = parseInt(color.substring(2, 4), 16)
  let b = parseInt(color.substring(4, 6), 16)
  if (value === 2) { // 对应el-color-primary-dark-2
    r -= 46
    g -= 27
  } else if (value === 3) { // 对应el-color-primary-light-3
    g += 19
    b += 46
  } else if (value === 5) {
    g += 38
    b += 92
  } else if (value === 7) {
    g += 57
    b += 138
  } else if (value === 8) {
    g += 76
    b += 184
  } else if (value === 9) {
    g += 100
    b += 240
  }
  // 调整颜色值
  r = Math.min(255, Math.max(0, r))
  g = Math.min(255, Math.max(0, g))
  b = Math.min(255, Math.max(0, b))
  // 转换回十六进制格式
  const newHex = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`
  return newHex
}

/**
 * @param str 需要转驼峰的下划线字符串
 * @returns 字符串驼峰
 */
export const underlineToHump = (str: string): string => {
  if (!str) return ''
  return str.replace(/\-(\w)/g, (_, letter: string) => {
    return letter.toUpperCase()
  })
}

export const setCssVar = (prop: string, val: any, dom = document.documentElement) => {
  dom.style.setProperty(prop, val)
}

/**
 * 查找数组对象的某个下标
 * @param {Array} ary 查找的数组
 * @param {Functon} fn 判断的方法
 */
// eslint-disable-next-line
export const findIndex = <T = Recordable>(ary: Array<T>, fn: Fn): number => {
  if (ary.findIndex) {
    return ary.findIndex(fn)
  }
  let index = -1
  ary.some((item: T, i: number, ary: Array<T>) => {
    const ret: T = fn(item, i, ary)
    if (ret) {
      index = i
      return ret
    }
  })
  return index
}

export const trim = (str: string) => {
  return str.replace(/(^\s*)|(\s*$)/g, '')
}

/**
 * @param {Date | number | string} time 需要转换的时间
 * @param {String} fmt 需要转换的格式 如 yyyy-MM-dd、yyyy-MM-dd HH:mm:ss
 */
export function formatTime(time: Date | number | string, fmt: string) {
  if (!time) return ''
  else {
    const date = new Date(time)
    const o = {
      'M+': date.getMonth() + 1,
      'd+': date.getDate(),
      'H+': date.getHours(),
      'm+': date.getMinutes(),
      's+': date.getSeconds(),
      'q+': Math.floor((date.getMonth() + 3) / 3),
      S: date.getMilliseconds()
    }
    if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
    }
    for (const k in o) {
      if (new RegExp('(' + k + ')').test(fmt)) {
        fmt = fmt.replace(
          RegExp.$1,
          RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length)
        )
      }
    }
    return fmt
  }
}

/**
 * 生成随机字符串
 */
export function toAnyString() {
  const str: string = 'xxxxx-xxxxx-4xxxx-yxxxx-xxxxx'.replace(/[xy]/g, (c: string) => {
    const r: number = (Math.random() * 16) | 0
    const v: number = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString()
  })
  return str
}

// 日期格式处理
export const timeFormat = (data: any) => {
  if (!data) return ''
  const date = new Date(data)
  const year = date.getFullYear()
  const month = `${date.getMonth() + 1}`.padStart(2, '0')
  const day = `${date.getDate()}`.padStart(2, '0')
  const hours = `${date.getHours()}`.padStart(2, '0')
  const minutes = `${date.getMinutes()}`.padStart(2, '0')
  const seconds = `${date.getSeconds()}`.padStart(2, '0')
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

type DateFormat = 'YYYY-MM-DD HH:mm:ss' | 'YYYY-MM-DD HH:mm' | 'YYYY-MM-DD' | 'YYYY-MM' | 'HH:mm'
// 日期格式处理
export const formatDateString = (data: Date | number | string, format?: DateFormat): string => {
  if (!data) return ''
  const date = new Date(data)
  const year = date.getFullYear().toString()
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  const seconds = date.getSeconds().toString().padStart(2, '0')
  if (!format) {
    format = 'YYYY-MM-DD HH:mm:ss'
  }
  let value: string = format
  value = value.replace('YYYY', year)
  value = value.replace('MM', month)
  value = value.replace('DD', day)
  value = value.replace('HH', hours)
  value = value.replace('mm', minutes)
  value = value.replace('ss', seconds)
  return value
}

export const calculateTimeDifference = (startTime, endTime) => {
  const start = new Date(startTime).valueOf()
  const end = new Date(endTime).valueOf()

  const differenceInMilliseconds = end - start

  const differenceInMinutes = differenceInMilliseconds / 60000

  return differenceInMinutes
}

export function checkIdcard(idcard) {
  if (!idcard) {
    return true
  }
  const reg = new RegExp(
    /^[1-9]\d{5}(?:18|19|20)\d{2}(?:0[1-9]|10|11|12)(?:0[1-9]|[1-2]\d|30|31)\d{3}[\dXx]$/
  )
  const flag = reg.test(idcard)
  return !flag
}

export function calculateAgeFromIdNumber(idNumber) {
  const birthday = idNumber.substring(6, 14) // 假设身份证号码中生日的位置是固定的，可以根据实际情况调整
  const year = parseInt(birthday.substring(0, 4), 10)
  const month = parseInt(birthday.substring(4, 6), 10) - 1 // 月份从0开始索引
  const day = parseInt(birthday.substring(6, 8), 10)

  const today = new Date()
  const birthDate = new Date(year, month, day)

  let age = today.getFullYear() - birthDate.getFullYear()

  if (
    today.getMonth() < birthDate.getMonth() ||
    (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate())
  ) {
    age--
  }

  return age
}

// 通过生日计算年龄
export function ageByBirthday(birthday) {
  const birthDate = new Date(birthday)
  const currentDate = new Date()

  const age = currentDate.getFullYear() - birthDate.getFullYear()

  // Check if the birthday has not occurred yet this year
  if (
    currentDate.getMonth() < birthDate.getMonth() ||
    (currentDate.getMonth() === birthDate.getMonth() && currentDate.getDate() < birthDate.getDate())
  ) {
    return age - 1
  } else {
    return age
  }
}

// 判断每个字段是否为 null 或空数组
export function isFieldsEmptyOrNull(obj) {
  const skipKey = ['id', 'customerId', 'areaProjectCode']
  for (const key in obj) {
    if (skipKey.includes(key)) {
      continue
    }
    if (obj.hasOwnProperty(key)) {
      const value = obj[key]
      if (value !== null && !(Array.isArray(value) && value.length === 0)) {
        return false
      }
    }
  }
  return true
}

export function maskPhoneNumber(phoneNumber) {
  if (!phoneNumber) {
    return
  }
  if (phoneNumber.length > 10) {
    return `${phoneNumber.substring(0, 3)}****${phoneNumber.substring(phoneNumber.length - 3)}`
  }
  return `${phoneNumber.substring(0, 3)}****`
}

// 根据字段类型，重置字段值
const resetFieldValue = (data: any) => {
  const type = Object.prototype.toString.call(data)
  switch (type) {
    case '[object Undefined]':
      return undefined
    case '[object Null]':
      return null
    case '[object String]':
      return ''
    case '[object Array]':
      return []
    case '[object Object]':
      return {}
    case '[object Number]':
      return ''
    default:
      return ''
  }
}
/**
 *
 * @param params 需要重置的参数对象
 * @param special 需要特殊处理的参数（并非所有的字段都需要重置，或者，有些字段需要重置为特殊的值）eg: special: { pageSize: 20 }
 * @param fn 重置之后需要执行的函数，可选
 * @param arg 执行函数fn需要的可变参数列表
 */
export const resetQueryForm = <T extends (...args: any[]) => any>(
  params: object,
  special: object | null,
  fn?: T,
  ...arg
) => {
  for (const key in params) {
    if (special && special.hasOwnProperty(key)) {
      params[key] = special[key]
    } else {
      params[key] = resetFieldValue(params[key])
    }
  }
  if (fn) {
    fn(...arg)
  }
}

export function compareAndAssign(objA, objB) {
  for (const key in objA) {
    if (objB.hasOwnProperty(key)) {
      objA[key] = objB[key]
    }
  }
  return objA
}
