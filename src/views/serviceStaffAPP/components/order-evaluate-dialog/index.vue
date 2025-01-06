<template>
  <el-dialog v-model="visibleFlag" title="订单评价：客户回访评价" width="500px" :close-on-press-escape="false" :close-on-click-modal="false" destroy-on-close @close="onClose">
    <el-form ref="formRef" :model="form" label-width="80px" :rules="rules">
      <el-form-item label="服务质量" prop="serveQuality">
        <el-rate v-model="form.serveQuality" :texts="rateText" show-text />
      </el-form-item>
      <el-form-item label="服务态度" prop="serveAttitude">
        <el-rate v-model="form.serveAttitude" :texts="rateText" show-text />
      </el-form-item>
      <el-form-item label="满意度" prop="satisfaction">
        <el-rate v-model="form.satisfaction" :texts="rateText" show-text />
      </el-form-item>
      <el-form-item label="准时送达" prop="punctualArrive">
        <el-rate v-model="form.punctualArrive" :texts="rateText" show-text />
      </el-form-item>
      <el-form-item label="评价内容" prop="content">
        <el-input v-model="form.content" placeholder="请输入" :rows="3" type="textarea" show-word-limit maxlength="300" />
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
import { resetQueryForm } from '@/utils'
import { updateEvaluate } from '@/api/serviceStaffAPP'

const emits = defineEmits(['reload'])

const visibleFlag = ref(false)

const loading = ref(false)

const rateText = ref(['非常不满意', '不满意', '一般', '满意', '非常满意'])

function show(data) {
  form.id = data.id
  form.serveQuality = data.serveQuality
  form.serveAttitude = data.serveAttitude
  form.satisfaction = data.satisfaction
  form.punctualArrive = data.punctualArrive
  form.content = data.content
  visibleFlag.value = true
}

function onClose() {
  visibleFlag.value = false
  resetQueryForm(form, {})
}

const formDefault = reactive({})

const rules = reactive<FormRules>({
  content: [{ required: true, message: '请填写评价内容', trigger: 'change' }],
  serveQuality: [{ required: true, pattern: /^[1-9]\d*$/, message: '请选择服务质量', trigger: 'change' }],
  serveAttitude: [{ required: true, pattern: /^[1-9]\d*$/, message: '请选择服务态度', trigger: 'change' }],
  satisfaction: [{ required: true, pattern: /^[1-9]\d*$/, message: '请选择满意度', trigger: 'change' }],
  punctualArrive: [{ required: true, pattern: /^[1-9]\d*$/, message: '请选择准时送达', trigger: 'change' }]
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
    await updateEvaluate(form)
    ElMessage.success('操作成功')
    emits('reload')
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
:deep(.el-rate__text) {
  font-size: 14px;
  font-weight: 400;
  color: #666462;
}
</style>
