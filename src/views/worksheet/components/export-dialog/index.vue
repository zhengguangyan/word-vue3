<template>
  <el-dialog v-model="visibleFlag" title="导出工单列表" width="500px" :close-on-press-escape="false" :close-on-click-modal="false">
    <el-form ref="formRef" :model="form" element-loading-text="正在导出需要的数据，请稍等..." label-width="100px">
      <el-form-item label="导出数据">
        <el-select v-model="form.data" style="width: 100%" :disabled="loading">
          <el-option label="导出所选" value="1" key="1" />
          <el-option label="导出筛选结果" value="2" key="2" />
          <el-option label="导出全部数据" value="3" key="3" />
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
import { ElMessage } from 'element-plus'
import { exportWorksheet } from '@/api/worksheet/index'
import download from '@/utils/download'

const props = defineProps({
  multipleSelection: {
    type: Array,
    default: undefined
  },
  queryForm: {
    type: Object,
    default: null
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
  data: '1'
}
const form = reactive({ ...queryFormDefault })

const exportForm = ref<any>({})

async function onSubmit() {
  if (form.data == '1' && props.multipleSelection?.length == 0) {
    ElMessage.error('未选择数据')
    return
  }
  if (form.data == '1') {
    exportForm.value.idList = props.multipleSelection?.map((obj: any) => {
      return obj.id
    })
  }
  if (form.data == '2') {
    exportForm.value = { ...props.queryForm }
    exportForm.value.pageSize = undefined
    exportForm.value.pageNum = undefined
  }
  if (form.data == '3') {
    exportForm.value = {}
  }
  loading.value = true
  const data = await exportWorksheet(exportForm.value)
  download.excel(data.data, '工单列表.xlsx')
  loading.value = false
}
defineExpose({
  show
})
</script>
