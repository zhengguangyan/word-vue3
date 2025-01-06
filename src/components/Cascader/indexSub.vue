<template>
  <el-cascader :style="`width: ${width}`" :placeholder="placeholder" :props="cascader" @change="onChange" clearable :disabled="disabled" v-model="selectValue" filterable />
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import { CascaderProps } from 'element-plus'
import { sleSearch } from '@/api/sys/Project'
import { useCache } from '@/hooks/web/useCache'
const { wsCache } = useCache()

const areaInfo = ref(wsCache.get('areaInfo'))

const props = defineProps({
  value: [Array, String],
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

const selectValue = ref(props.value)
watch(
  () => props.value,
  (value) => {
    selectValue.value = value
  }
)

const emit = defineEmits(['update:modelValue', 'change-default'])
function onChange(value) {
  let selected = undefined
  if (!value) {
    emit('update:modelValue', selected)
    return selected
  }
  emit('update:modelValue', value)
  emit('change-default')
}

const cascader = ref<CascaderProps>({
  lazy: true,
  checkStrictly: props.check,
  multiple: props.multiple,
  value: 'code',
  label: 'name',
  async lazyLoad(node, resolve) {
    // const nodes = []
    const { level } = node
    const params = props.needProject ? { parentCode: node?.data?.code ? node.data.code : Number(areaInfo.value.regionCode) } : { parentCode: node?.data?.code && node.data.code }
    const { list } = await sleSearch(params)
    const nodes = list.map((item) => ({
      ...item,
      leaf: props.needProject ? level >= Number(areaInfo.value.areaRegionLevel) : level >= 4
    }))
    resolve(nodes)
  }
})
</script>
