<template>
  <el-select v-model="selectValue" :style="`width: ${width}`" :placeholder="props.placeholder" :clearable="clearable" :size="size" :multiple="multiple" :collapse-tags="multiple" :collapse-tags-tooltip="multiple" :max-collapse-tags="tags" @change="onChange" :disabled="disabled">
    <el-option v-for="item in distList" :key="(item as any).value" :value="(item as any).value" :label="(item as any).label" />
  </el-select>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'

const props = defineProps({
  value: [Array, String],
  distList: [Array],
  multiple: {
    type: Boolean,
    default: false
  },
  width: {
    type: String,
    default: '200px'
  },
  placeholder: {
    type: String,
    default: '请选择'
  },
  size: {
    type: String,
    default: 'default'
  },
  disabled: {
    type: Boolean,
    default: false
  },
  clearable: {
    type: Boolean,
    default: true
  },
  zero: {
    type: Boolean,
    default: false
  },
  tags: {
    type: Number,
    default: 1
  }
})

const selectValue = ref(props.value)
watch(
  () => props.value,
  (value) => {
    selectValue.value = value
  }
)

const emit = defineEmits(['update:modelValue', 'change'])
function onChange(value) {
  let selected = undefined
  if (!value) {
    emit('update:modelValue', selected)
    emit('change', selected)
    return selected
  }
  if (props.zero && props.multiple && value.includes('0')) {
    emit('update:modelValue', ['0'])
    emit('change', ['0'])
    return
  }
  emit('update:modelValue', value)
  emit('change', value)
}
</script>
