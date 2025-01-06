import { onMounted, ref } from 'vue'
import { getBelongItemlabelList } from '@/api/filiale'

export default function useBelong() {
  const belongItemList = ref([])

  const getBelongList = async () => {
    const { data } = await getBelongItemlabelList({
      labelType: 'serviceObject',
      deleted: false
    })
    belongItemList.value = data.map((item) => {
      return {
        value: item.id.toString(),
        label: item.name
      }
    })
  }

  const belongList = (key: any) => {
    if (!key) {
      return
    }
    return belongItemList.value
      .filter((item: any) => key.includes(item.value))
      .map((item: any) => item?.label)
      .join('，')
  }

  onMounted(() => {
    getBelongList()
  })

  return {
    belongList
  }
}
