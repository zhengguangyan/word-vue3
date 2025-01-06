<template>
  <el-dialog v-model="visibleFlag" title="结案" width="500px" :close-on-press-escape="false" :close-on-click-modal="false" destroy-on-close @close="onClose">
    <p class="tip">确定将订单“结案”？结案后不再支持修改订单信息！</p>
    <el-form ref="formRef" :model="form" label-width="100px" :rules="rules">
      <el-form-item label="结案内容" prop="content">
        <el-input v-model="form.content" placeholder="请输入" :rows="3" type="textarea" />
      </el-form-item>
    </el-form>
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
import { setServeorderstatus } from '@/api/order'

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
  content: [{ required: true, message: '请填写结案内容', trigger: 'change' }]
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
    await setServeorderstatus(form)
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
<style scoped>
.tip {
  color: var(--main-text-color);
  line-height: 16px;
  margin-bottom: 15px;
}
</style>
