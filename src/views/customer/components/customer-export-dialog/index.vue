<template>
  <el-dialog v-model="visibleFlag" title="导出客户信息" width="500px" :close-on-press-escape="false" :close-on-click-modal="false">
    <el-form ref="formRef" :model="form" label-width="100px">
      <el-form-item label="导出格式">
        <el-select v-model="form.fileType" style="width: 100%">
          <el-option label="Excel (所有客户一个文档)" value="1" key="1" />
          <el-option label="Excel (一个客户一个文档)" value="2" key="2" />
          <el-option label="Word (一个客户一个文档)" value="3" key="3" />
        </el-select>
      </el-form-item>
      <el-form-item label="导出数据">
        <el-select v-model="form.data" style="width: 100%">
          <el-option label="导出所选" value="1" key="1" />
          <el-option label="导出筛选结果" value="2" key="2" />
          <el-option label="导出全部数据" value="3" key="3" />
        </el-select>
      </el-form-item>
    </el-form>
    <p v-if="unExcel" class="tips">一次性导出不可超过6.5万条</p>
    <p v-if="unWord" class="tips">一次性导出不可超过500条</p>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="onClose">取消</el-button>
        <el-button type="primary" :disabled="unWord || unExcel" @click="onSubmit" :loading="loading">导出</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { exportWord, exportExcelInOne, exportExcel } from '@/api/customer/index'
import download from '@/utils/download'
import { computed } from 'vue'

const props = defineProps({
  multipleSelection: {
    type: Array,
    default: undefined
  },
  queryForm: {
    type: Object,
    default: null
  },
  total: {
    type: Number,
    default: 0
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
  fileType: '1',
  data: '2',
  deathFlag: '1',
  type: '1',
  visitDate: undefined
}
const form = reactive({ ...queryFormDefault })

const exportForm = ref<any>({})

async function onSubmit() {
  if (form.data == '1' && props.multipleSelection?.length == 0) {
    ElMessage.error('未选择客户')
    return
  }
  if (form.data == '1') {
    exportForm.value.idList = props.multipleSelection?.map((obj: any) => {
      return obj.id
    })
  }
  if (form.data == '2') {
    exportForm.value = { ...props.queryForm }
  }
  if (form.data == '3') {
    exportForm.value = {}
  }
  exportForm.value.pageSize = undefined
  exportForm.value.pageNum = undefined
  exportForm.value.deathFlag = props.queryForm?.deathFlag
  exportForm.value.type = props.queryForm?.type
  exportForm.value.isMarkerCustomer = props.queryForm?.isMarkerCustomer || undefined
  loading.value = true
  if (form.fileType == '1') {
    const data = await exportExcelInOne(exportForm.value)
    download.excel(data.data, '客户信息列表.xlsx')
  }
  if (form.fileType == '2') {
    const data = await exportExcel(exportForm.value)
    download.excel(data.data, '客户信息列表.zip')
  }
  if (form.fileType == '3') {
    const data = await exportWord(exportForm.value)
    download.zip(data.data, '客户信息列表.zip')
  }
  loading.value = false
}

const unExcel = computed(() => {
  if (form.fileType != '3' && form.data == '3' && props.total > 65000) {
    return true
  }
  return false
})

const unWord = computed(() => {
  if (form.fileType == '3' && form.data == '3' && props.total > 500) {
    return true
  }
  return false
})

defineExpose({
  show
})
</script>
<style scoped lang="less">
.tips {
  color: red;
  font-size: 12px;
  padding-left: 70px;
}
</style>
