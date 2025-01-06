<template>
  <el-dialog v-model="visibleFlag" :title="props.title" width="500px" :close-on-press-escape="false" :close-on-click-modal="false">
    <el-form ref="formRef" :model="form" element-loading-text="正在导出需要的数据，请稍等..." label-width="100px">
      <el-form-item v-if="needShowFormat" label="导出格式">
        <el-select v-model="form.type" style="width: 100%" :disabled="loading">
          <el-option label="Excel (所有客户一个文档)" value="1" key="1" />
          <el-option label="Excel (一个客户一个文档)" value="2" key="2" />
          <el-option label="Word (一个客户一个文档)" value="3" key="3" />
        </el-select>
      </el-form-item>
      <el-form-item label="导出数据">
        <el-select v-model="form.data" style="width: 100%" :disabled="loading">
          <el-option label="导出所选" value="select" />
          <el-option label="导出筛选结果" value="filter" />
          <el-option label="导出全部数据" value="all" />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="onClose">取消</el-button>
        <el-button type="primary" @click="onSubmit" :loading="loading">导出</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'

const props = defineProps({
  title: {
    type: String,
    default: '导出'
  },
  loading: {
    type: Boolean,
    default: false
  },
  needShowFormat: {
    type: Boolean,
    default: false
  }
})

const emits = defineEmits(['export-submit', 'export-close'])

const visibleFlag = ref(false)

function show() {
  visibleFlag.value = true
}

function onClose() {
  visibleFlag.value = false
  emits('export-close')
}
const form = reactive({
  data: 'select',
  type: '1'
})

function onSubmit() {
  emits('export-submit', form)
}
defineExpose({
  show
})
</script>
