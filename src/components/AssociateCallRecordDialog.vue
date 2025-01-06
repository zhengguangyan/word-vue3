<!-- 关联通话录音弹窗 -->
<template>
  <el-dialog v-model="visible" title="关联通话录音" width="500px" :close-on-press-escape="false" :close-on-click-modal="false" destroy-on-close @close="onClose">
    <div class="r-p-b-20">
      <el-form ref="formRef" :model="ruleForm" label-width="100px" :rules="rules">
        <el-form-item label="通话流水号" prop="agentRecordLogCallId">
          <el-input v-model="ruleForm.agentRecordLogCallId" placeholder="请输入通话流水号" clearable></el-input>
        </el-form-item>
      </el-form>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="onClose">取消</el-button>
        <el-button type="primary" @click="onSubmit" :loading="loading">确认</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script lang="ts" setup>
import {} from '@/api'
import { ref, reactive } from 'vue'
import { ElMessage, FormRules } from 'element-plus'
const props = defineProps({
  requestFun: {
    type: Function,
    default: () => {}
  }
})
const emits = defineEmits(['reload-data'])
const visible = ref(false)
const formDefault = reactive({
  id: undefined,
  agentRecordLogCallId: ''
})
let ruleForm = reactive<any>({ ...formDefault })

const rules = reactive<FormRules>({
  agentRecordLogCallId: [{ required: true, message: '请输入通话流水号', trigger: 'blur' }]
})
/* 取消 保存操作 */
const loading = ref(false)
const formRef = ref()
function onClose() {
  visible.value = false
  Object.assign(ruleForm, formDefault)
}
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
    await props.requestFun(ruleForm)
    ElMessage.success('操作成功')
    emits('reload-data')
    onClose()
  } finally {
    loading.value = false
  }
}

function show(data) {
  ruleForm.id = data.id
  ruleForm.agentRecordLogCallId = data.agentRecordLogCallId
  visible.value = true
}

defineExpose({
  show
})
</script>
