<template>
  <el-cascader
    :style="`width: ${width}`"
    :placeholder="placeholder"
    :props="cascader"
    :show-all-levels="showAllLevels"
    @change="onChange"
    clearable
    :disabled="disabled"
    :model-value="modelValue"
    ref="cascaderRef"
    filterable
  />
</template>

<script lang="ts" setup>
import { ref, PropType, watch } from 'vue'
import { CascaderProps, ElCascader } from 'element-plus'
import { sleSearch } from '@/api/sys/Project'

import { useCache } from '@/hooks/web/useCache'
const { wsCache } = useCache()
const areaInfo = ref(wsCache.get('areaInfo'))

const props = defineProps({
  modelValue: {
    type: Array as PropType<string[] | undefined>,
    default: undefined
  },
  check: {
    type: Boolean,
    default: false
  },
  multiple: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  showAllLevels: {
    type: Boolean,
    default: true
  },
  width: {
    type: String,
    default: '450px'
  },
  placeholder: {
    type: String,
    default: '请选择'
  },
  // 是否需要根据所属项目地区来联动
  needProject: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'change-default', 'get-selected-text'])
const cascaderRef = ref<InstanceType<typeof ElCascader>>()
function onChange(value) {
  emit('update:modelValue', value)
  emit('change-default')
}

watch(
  () => props.modelValue,
  (val) => {
    if (val && val.length) {
      const nodes = cascaderRef.value?.getCheckedNodes(false)
      if (nodes && nodes.length) {
        emit('get-selected-text', nodes[0].text.replaceAll(' ', '')) // 获取到的是“xx省/xx市/xx区/xx街道/xx社区”
      } else {
        emit('get-selected-text', '')
      }
    }
  }
)

// 获取选择器的文字
const getCascaderLabel = () => {
  const nodes = cascaderRef.value?.getCheckedNodes(false)
  if (nodes && nodes.length) return nodes[0].text.replaceAll(' ', '') // “xx省/xx市/xx区/xx街道/xx社区”
  return ''
}

defineExpose({ getCascaderLabel })

const cascader = ref<CascaderProps>({
  lazy: true,
  checkStrictly: props.check,
  multiple: props.multiple,
  value: 'code',
  label: 'name',
  async lazyLoad(node, resolve) {
    const { level } = node
    const params = props.needProject ? { parentCode: node?.data?.code ? node.data.code : Number(areaInfo.value.regionCode) } : { parentCode: node?.data?.code && node.data.code }
    const { list } = await sleSearch(params)
    const nodes = list.map((item) => ({
      ...item,
      // leaf: level >= 4
      leaf: props.needProject ? level >= Number(areaInfo.value.areaRegionLevel) : level >= 4
    }))
    resolve(nodes)
  }
})
</script>
