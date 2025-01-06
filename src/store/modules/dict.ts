import { defineStore } from 'pinia'
import { store } from '../index'
import { getAllDictData } from '@/api/sys/Dictionary'

export interface DictState {
  isSetDict: boolean
  dictObj: Recordable
  dictMap: DictMap[]
}

export const useDictStore = defineStore('dict', {
  state: (): DictState => ({
    isSetDict: false,
    dictObj: {},
    dictMap: []
  }),
  getters: {
    getDictObj(): Recordable {
      return this.dictObj
    },
    getIsSetDict(): boolean {
      return this.isSetDict
    }
  },
  actions: {
    setDictObj(dictObj: Recordable) {
      this.dictObj = dictObj
    },
    setIsSetDict(isSetDict: boolean) {
      this.isSetDict = isSetDict
    },
    // 获取全部数据字典
    async getAllDictData () {
      const dictRes = await getAllDictData()
      this.dictMap = dictRes.data
    }
  }
})

export const useDictStoreWithOut = () => {
  return useDictStore(store)
}
