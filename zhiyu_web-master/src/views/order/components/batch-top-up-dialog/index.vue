<template>
  <el-dialog
    destroy-on-close
    v-model="visibleFlag"
    title="批量充值"
    width="500px"
    @close="onClose"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
  >
    <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
      <el-form-item label="当前共选择">
        <span>{{ customers.length }} 人</span>
      </el-form-item>
      <el-form-item label="充值名称">
        <span>{{ time }}</span>
      </el-form-item>
      <el-form-item label="充值金额" prop="rechargeMoney">
        <el-input type="number" v-model="form.rechargeMoney">
          <template #append>元</template>
        </el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="onClose">取消</el-button>
        <el-button type="primary" :loading="loading" @click="onSubmit">确认</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { ElMessage, FormRules } from 'element-plus'
import { servePacketBatchRecharge } from '@/api/servePacket'

const emits = defineEmits(['reload-list'])

const visibleFlag = ref(false)

const loading = ref(false)

const show = async (data, subsidyId) => {
  visibleFlag.value = true
  customers.value = data.map((item) => item.customerId)
  form.servePacketId = subsidyId
  getTime()
}

const rules = reactive<FormRules>({
  rechargeMoney: [{ required: true, message: '请输入充值金额', trigger: 'change' }]
})

const customers = ref([])

function onClose() {
  Object.assign(form, formDefault)
  visibleFlag.value = false
}

const formDefault = reactive({
  servePacketId: undefined,
  rechargeMoney: undefined
})

let form = reactive({ ...formDefault })

const formRef = ref()

const time = ref('')

const getTime = () => {
  const today = new Date()
  const year = today.getFullYear()
  const month = (today.getMonth() + 1).toString().padStart(2, '0')
  time.value = `手动充值 ${year}.${month}`
}

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
    await servePacketBatchRecharge({
      ...form,
      customerList: customers.value
    })
    ElMessage.success('充值成功')
    emits('reload-list')
    onClose()
  } finally {
    loading.value = false
  }
}

defineExpose({
  show
})
</script>
<style scoped lang="less">
:deep(.el-dialog__body) {
  padding-top: 10px !important;
}
:deep(.el-input-group__prepend) {
  background: none !important;
  border: 0 !important;
  box-shadow: none !important;
  padding: 0 40px 0 0 !important;
  color: #666462;
}
</style>
