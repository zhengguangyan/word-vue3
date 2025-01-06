export const phoneRegexp = /^1[0-9]{10}$/
export const telRegexp = /^([0-9]{3,4}[-| ])?[0-9]{7,8}$/ // 固定电话正则
export const emailRegexp = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((.[a-zA-Z0-9_-]{2,3}){1,2})$/ // 邮箱正则
export const intRegexp = /^[1-9]\d*$/ // 正整数(不包含0)
export const int0Regexp = /^([1-9]\d*|[0]{1,1})$/ // 0+正整数
export const idCardRegexp = /^(\d{15}$|^\d{18}$|^\d{17}(\d|X|x))$/ // 身份证号正则
export const priceRegexp = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/ // 金额验证(小数点后保留两位小数)

class Validate {
  static validate: Validate = new Validate()
  // 判断是否为空
  validateNull (val: any): boolean {
    if (typeof val === 'boolean') {
      return false
    }
    if (typeof val === 'number') {
      return false
    }
    if (val instanceof Array) {
      if (val.length === 0) return true
    } else if (val instanceof Object) {
      if (JSON.stringify(val) === '{}') return true
    } else {
      if (val === 'null' || val === null || val === 'undefined' || val === undefined || val === '') return true
      return false
    }
    return false
  }
  validatePhone (required = true, name?: string) {
    return function (rule: any, value: any, callback: any) {
      if (required) {
        if (!value) return callback(new Error(`请输入${name || '手机号码'}`))
      } else {
        if (!value) return callback()
      }
      if (!phoneRegexp.test(value)) {
        return callback(new Error(`${name || '手机号码'}格式不正确`))
      }
      callback()
    }
  }
  validatePhoneOrTel (required = true, name?: string) {
    return function (rule: any, value: any, callback: any) {
      if (required) {
        if (!value) return callback(new Error(`请输入${name || '联系电话'}`))
      } else {
        if (!value) return callback()
      }
      if (!(phoneRegexp.test(value) || telRegexp.test(value))) {
        return callback(new Error(`${name}格式不正确` || '联系电话格式不正确'))
      }
      callback()
    }
  }
  validateEmail (required = true, name?: string) {
    return function (rule: any, value: any, callback: any) {
      if (required) {
        if (!value) return callback(new Error(`请输入${name || '电子邮箱'}`))
      } else {
        if (!value) return callback()
      }
      if (!emailRegexp.test(value)) {
        return callback(new Error(`${name || '电子邮箱'}格式不正确`))
      }
      callback()
    }
  }
  validateUrl (required = true, name?: string) {
    return function (rule: any, value: any, callback: any) {
      if (required) {
        if (!value) return callback(new Error(`请输入${name || '链接地址'}`))
      } else {
        if (!value) return callback()
      }
      try {
        new URL(value)
      } catch {
        return callback(new Error(`请输入合法的${name || '链接地址'}(如http,https,ftp)`))
      }
      callback()
    }
  }
  validateIdCard (required = true, name?: string) {
    return function (rule: any, value: any, callback: any) {
      if (required) {
        if (!value) return callback(new Error(`请输入${name || '身份证号码'}`))
      } else {
        if (!value) return callback()
      }
      if (!idCardRegexp.test(value)) {
        return callback(new Error(`${name || '身份证号码'}输入不正确`))
      }
      callback()
    }
  }
  validatePassword (required = true, name?: string) {
    return function (rule: any, value: string, callback: any) {
      if (required) {
        if (!value) return callback(new Error(`请输入${name || '密码'}`))
      } else {
        if (!value) return callback()
      }
      if (!(value.length >= 8 && value.length <= 20)) return callback(new Error('密码长度必须在8-20位之间'))
      const letters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
      const numbers = '0123456789'
      const symbols = '!@#$%^&*()-=_+[]{}|;:,.<>?'
      const obj: { [key: string]: boolean } = {
        letters: false,
        numbers: false,
        symbols: false
      }
      for (let i = 0; i < value.length; i++) {
        if (letters.includes(value.charAt(i))) {
          obj.letters = true
        }
        if (numbers.includes(value.charAt(i))) {
          obj.numbers = true
        }
        if (symbols.includes(value.charAt(i))) {
          obj.symbols = true
        }
      }
      let count = 0
      for (const key in obj) {
        if (obj[key]) count++
      }
      if (count < 2) return callback(new Error('密码必须包含数字、字母、常用符号中的两项及以上'))
      callback()
    }
  }
}

export default Validate.validate
