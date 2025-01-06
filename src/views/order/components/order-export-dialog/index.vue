<template>
  <el-dialog v-model="visibleFlag" title="导出订单" width="500px" :close-on-press-escape="false" :close-on-click-modal="false">
    <el-form ref="formRef" :model="form" label-width="100px">
      <el-form-item label="导出数据">
        <el-select v-model="form.data" style="width: 100%">
          <el-option label="导出所选" value="1" key="1" />
          <el-option label="导出筛选结果" value="2" key="2" />
          <el-option label="导出全部数据" value="3" key="3" />
        </el-select>
        <p class="tips">一次性导出不可超过6.5万条</p>
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
import { exportExcelInOne } from '@/api/order/index'
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
  data: '2',
  visitDate: undefined
}
const form = reactive({ ...queryFormDefault })

const exportForm = ref<any>({})

async function onSubmit() {
  exportForm.value.pageSize = undefined
  exportForm.value.pageNum = undefined
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
  loading.value = true
  const data = await exportExcelInOne(exportForm.value)
  download.excel(data.data, '订单信息列表.xlsx')
  loading.value = false
}

defineExpose({
  show
})
</script>
<style scoped lang="less">
.tips {
  color: red;
  font-size: 12px;
}
</style>
