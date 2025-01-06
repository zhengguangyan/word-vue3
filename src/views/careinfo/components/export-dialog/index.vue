<template>
  <el-dialog v-model="visibleFlag" :title="`导出${props.title}`" width="500px" :close-on-press-escape="false" :close-on-click-modal="false">
    <el-form ref="formRef" :model="form" element-loading-text="正在导出需要的数据，请稍等...">
      <el-form-item label="导出数据">
        <el-select v-model="form.data" style="width: 100%" :disabled="loading">
          <el-option label="导出所选" value="select" />
          <el-option label="导出筛选结果" value="filter" />
          <el-option label="导出全部数据" value="all" />
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
// import { ElMessage } from 'element-plus'
// import { exportCare } from '@/api/worksheet/index'
// import download from '@/utils/download'

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
  },
  loading: {
    type: Boolean,
    default: false
  }
})
const visibleFlag = ref(false)

function show() {
  visibleFlag.value = true
}

function onClose() {
  visibleFlag.value = false
}
const queryFormDefault = {
  data: 'select'
}
const form = reactive({ ...queryFormDefault })

const emits = defineEmits(['export-submit'])

// async function onSubmit() {
//   if (form.data == '1' && props.multipleSelection?.length == 0) {
//     ElMessage.error('未选择数据')
//     return
//   }
//   if (form.data == '1') {
//     exportForm.value.idList = props.multipleSelection?.map((obj: any) => {
//       return obj.id
//     })
//   }
//   if (form.data == '2') {
//     exportForm.value = { ...props.queryForm }
//     exportForm.value.pageSize = undefined
//     exportForm.value.pageNum = undefined
//   }
//   if (form.data == '3') {
//     exportForm.value = {}
//   }
//   loading.value = true
//   try {
//     const data = await exportCare(exportForm.value)
//     download.excel(data.data, '关怀列表.xlsx')
//     ElMessage.success('导出成功')
//     loading.value = false
//   } finally {
//     loading.value = false
//   }
// }

function onSubmit() {
  emits('export-submit', form)
}
defineExpose({
  show
})
</script>
