<template>
  <el-dialog v-model="visibleFlag" :title="`导出${props.title}`" width="500px" :close-on-press-escape="false" :close-on-click-modal="false">
    <el-form ref="formRef" :model="form" element-loading-text="正在导出需要的数据，请稍等...">
      <el-form-item label="导出数据">
        <el-select v-model="form.exportWay" style="width: 100%" :disabled="loading">
          <el-option label="导出所选数据" value="1"></el-option>
          <el-option label="导出筛选结果" value="2"></el-option>
          <el-option label="导出全部数据" value="3"></el-option>
        </el-select>
        <p class="tip">一次性导出不能超过6.5W条数据</p>
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
import { ElMessage } from 'element-plus'
import { exportStaffInfo } from '@/api/serviceStaffAPP/index'
import download from '@/utils/download'

const props = defineProps({
  multipleSelection: {
    type: Array,
    default: undefined
  },
  queryForm: {
    type: Object,
    default: null
  },
  title: {
    type: String,
    default: '数据'
  }
})
const visibleFlag = ref(false)
const loading = ref(false)

function show() {
  visibleFlag.value = true
}

function onClose() {
  visibleFlag.value = false
}
const queryFormDefault = {
  exportWay: '1'
}
const form = reactive({ ...queryFormDefault })

const exportForm = ref<any>({ exportWay: '1' })

const emits = defineEmits(['export-submit'])

async function onSubmit() {
  if (form.exportWay == '1' && props.multipleSelection?.length == 0) {
    ElMessage.error('未选择数据')
    return
  }
  if (form.exportWay == '1') {
    exportForm.value.idList = props.multipleSelection?.map((obj: any) => {
      return obj.id
    })
  }
  if (form.exportWay == '2') {
    exportForm.value = { ...props.queryForm }
    exportForm.value.pageSize = undefined
    exportForm.value.pageNum = undefined
    exportForm.value.exportWay = form.exportWay
  }
  if (form.exportWay == '3') {
    exportForm.value = { exportWay: form.exportWay }
  }
  loading.value = true
  try {
    const data = await exportStaffInfo(exportForm.value)
    download.excel(data.data, '自建订单列表.xlsx')
    ElMessage.success('导出成功')
    loading.value = false
  } finally {
    loading.value = false
  }
}

defineExpose({
  show
})
</script>
