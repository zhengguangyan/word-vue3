<template>
  <el-dialog v-model="visibleFlag" title="撤销超出下单信息" width="500px" :close-on-press-escape="false" :close-on-click-modal="false" destroy-on-close @close="onClose">
    <p class="main-text-color r-m-b-12">超出订单信息撤销后，从服务包扣除的金额、服务将返还。</p>
    <el-form ref="formRef" :model="form" label-width="100px" :rules="rules">
      <el-form-item label="撤销原因" prop="content">
        <el-input v-model="form.content" placeholder="请输入撤销原因" :rows="4" type="textarea" maxlength="300" show-word-limit />
      </el-form-item>
    </el-form>
    <p class="main-text-color r-m-b-20">是否确认要撤销超出下单信息?</p>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="onClose">取消</el-button>
        <el-button type="primary" @click="onSubmit" :loading="loading">确认撤销</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { ElMessage, FormRules } from 'element-plus'
import { cancelExceedAmount } from '@/api/order'

const emits = defineEmits(['reload-list'])

const visibleFlag = ref(false)

const loading = ref(false)

function show(data) {
  form.id = data.id
  visibleFlag.value = true
}

function onClose() {
  visibleFlag.value = false
  Object.assign(form, formDefault)
}

const formDefault = reactive({
  id: undefined,
  content: undefined
})

const rules = reactive<FormRules>({
  content: [{ required: true, message: '请填写撤销原因', trigger: 'change' }]
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
    await cancelExceedAmount(form)
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
