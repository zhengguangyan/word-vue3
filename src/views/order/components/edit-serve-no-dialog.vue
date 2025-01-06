<template>
  <el-dialog v-model="visible" title="修改服务工单号" width="500px" :close-on-press-escape="false" :close-on-click-modal="false" destroy-on-close @close="onClose">
    <div class="r-p-b-20">
      <el-form ref="formRef" :model="ruleForm" label-width="100px">
        <el-form-item label="服务工单号" prop="serveNo">
          <el-input v-model="ruleForm.serveNo" placeholder="请输入服务工单号" clearable maxlength="25"></el-input>
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
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { editServeNo } from '@/api/order'
const emits = defineEmits(['reload-list'])
const visible = ref(false)
const formDefault = reactive({
  id: undefined,
  serveNo: ''
})
let ruleForm = reactive<any>({ ...formDefault })
/* 取消 保存操作 */
const loading = ref(false)
const formRef = ref()
const onClose = () => {
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
    await editServeNo(ruleForm)
    ElMessage.success('操作成功')
    emits('reload-list')
    onClose()
  } finally {
    loading.value = false
  }
}
function show(data) {
  ruleForm.id = data.id
  ruleForm.serveNo = data.serveNo
  visible.value = true
}
defineExpose({
  show
})
</script>
