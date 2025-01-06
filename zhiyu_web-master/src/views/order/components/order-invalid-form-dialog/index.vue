<template>
  <el-dialog v-model="visibleFlag" title="作废订单" width="500px" :close-on-press-escape="false" :close-on-click-modal="false" destroy-on-close @close="onClose">
    <p class="main-text-color r-m-b-12">订单作废后，从服务包扣除的金额、服务将返还。</p>
    <el-form ref="formRef" :model="form" label-width="100px" :rules="rules">
      <el-form-item label="作废原因" prop="revokePartmoneyContent">
        <el-input v-model="form.revokePartmoneyContent" placeholder="请输入原因" :rows="3" type="textarea" />
      </el-form-item>
    </el-form>
    <p class="main-text-color r-m-b-20">是否确定修改状态？</p>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="onClose">取消</el-button>
        <el-button type="primary" @click="onSubmit" :loading="loading">确认</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { ElMessage, FormRules } from 'element-plus'
import { invalidateStatus } from '@/api/order'

const emits = defineEmits(['reload-list'])

const visibleFlag = ref(false)

const loading = ref(false)

function show(data) {
  form.serveorderId = data.id
  visibleFlag.value = true
}

function onClose() {
  visibleFlag.value = false
  Object.assign(form, formDefault)
}

const formDefault = reactive({
  areaProjectCode: undefined,
  serveorderId: undefined,
  revokePartmoneyContent: undefined
})

const rules = reactive<FormRules>({
  revokePartmoneyContent: [{ required: true, message: '请填写原因', trigger: 'change' }]
})

let form = reactive<any>({ ...formDefault })

const formRef = ref()

const onSubmit = async () => {
  loading.value = true
  await formRef.value.validate((valid) => {
    if (valid) {
      save()
    } else {
      ElMessage.error('请确认必填参数填写正确')
      loading.value = false
    }
  })
}

const save = async () => {
  try {
    await invalidateStatus(form)
    ElMessage.success('操作成功')
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
