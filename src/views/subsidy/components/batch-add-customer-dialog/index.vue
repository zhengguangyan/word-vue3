<template>
  <el-dialog destroy-on-close v-model="visibleFlag" title="批量添加客户" width="500px" @close="onClose" :close-on-press-escape="false" :close-on-click-modal="false">
    <p style="margin-bottom: 5px; font-size: 14px; color: #999"> 请输入身份证号码（每行1个身份证号，单次最多500个） </p>
    <el-form ref="formRef" :model="form" label-width="0px">
      <el-form-item prop="remark">
        <el-input v-model="form.remark" :rows="10" type="textarea" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="onClose">取消</el-button>
        <el-button type="primary" :disabled="!form.remark" :loading="loading" @click="onSubmit">确认</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { getCustomerList } from '@/api/customer'

const emits = defineEmits(['add-customer'])

// const props = defineProps({
//   id: {
//     type: Number,
//     default: null
//   }
// })

const visibleFlag = ref(false)

const loading = ref(false)

const show = async (rowData) => {
  if (rowData.subsidyCustomers) {
    form.excludeCustomers = rowData.subsidyCustomers.map((item) => item.id)
  }
  if (rowData.customerList) {
    form.excludeCustomers = rowData.customerList.map((item) => item.customerId)
  }
  visibleFlag.value = true
}

function onClose() {
  Object.assign(form, formDefault)
  visibleFlag.value = false
}

const formDefault = reactive({
  remark: '',
  excludeCustomers: []
})

let form = reactive({ ...formDefault })

const formRef = ref()

const onSubmit = async () => {
  try {
    await formRef.value.validate()
    save()
  } catch (err) {
    ElMessage.error('参数验证错误，请仔细填写表单数据!')
  }
}

const save = async () => {
  try {
    loading.value = true
    const { data } = await getCustomerList({
      excludeCustomers: form.excludeCustomers,
      idCards: form.remark.split('\n').filter((item) => item)
    })
    loading.value = false
    if (data.length) {
      const newArr = data.map((item) => {
        return {
          ...item,
          usingStatus: '1',
          disableOrNot: false
        }
      })
      emits('add-customer', newArr)
      onClose()
      ElMessage.success(`批量添加 ${data.length} 位客户成功`)
    } else {
      ElMessage.error('无新客户')
    }
  } catch (error) {
    loading.value = false
  }
}

defineExpose({
  show
})
</script>
<style lang="less" scoped>
:deep(.el-dialog__body) {
  padding-top: 10px !important;
}
</style>
