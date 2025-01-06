import { useDictStore } from '@/store/modules/dict'
import { computed } from 'vue'
const dictStore = useDictStore()

export const dictMap = computed(() => dictStore.dictMap)

export const filterDict = (keyName: string) => {
  const obj = dictMap.value.find(item => item.type === keyName)
  if (!obj) return []
  return obj.list
}

// 字典回显
export const renderDict = (keyValue: number | string | string[], keyName: string) => {
  if (!keyValue || !keyName) return ''
  if (typeof keyValue === 'number') {
    keyValue = keyValue.toString()
  }
  if (typeof keyValue === 'string') { // 单选字典
    const data = filterDict(keyName).find(item => item.value === keyValue)
    return data ? data.label : ''
  }
  const data = filterDict(keyName).filter(item => keyValue.includes(item.value))
  return data.map(item => item.label).join('，')
}
