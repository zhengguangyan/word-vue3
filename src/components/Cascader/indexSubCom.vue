<template>
  <el-cascader
    :style="`width: ${width}`"
    :placeholder="placeholder"
    :props="cascader"
    :options="options"
    @change="onChange"
    clearable
    :disabled="disabled"
    v-model="selectValue"
    filterable
  />
</template>

<script lang="ts" setup>
import { ref, watch, onMounted } from 'vue'
import { CascaderProps } from 'element-plus'
import { searchAreaCode } from '@/api/sys/Project'
import { useCache } from '@/hooks/web/useCache'
const { wsCache } = useCache()

const areaCode = wsCache.get('areaCode')
const options = ref<any>([])

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

const loadData = async () => {
  const data = await searchAreaCode({ areaCode })
  options.value = data.list
}

onMounted(() => {
  loadData()
})

const cascader = ref<CascaderProps>({
  checkStrictly: props.check,
  multiple: props.multiple,
  value: 'code',
  label: 'name',
  children: 'childrens'
})
</script>
