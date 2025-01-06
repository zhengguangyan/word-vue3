<template>
  <el-dialog v-model="visibleFlag" title="修改工单号" width="500px" :close-on-press-escape="false" :close-on-click-modal="false" destroy-on-close @close="onClose">
    <el-form ref="formRef" :model="form" label-width="120px" :rules="rules">
      <el-form-item label="工单号" prop="workNumber">
        <el-input v-model="form.workNumber" placeholder="请输入工单号" />
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
import { updateEndInfo } from '@/api/serviceStaffAPP'
import { resetQueryForm } from '@/utils'

const emits = defineEmits(['reload'])

const visibleFlag = ref(false)

const loading = ref(false)

function show(data) {
  form.id = data.id
  form.workNumber = data.workNumber
  visibleFlag.value = true
}

function onClose() {
  visibleFlag.value = false
  resetQueryForm(form, {})
}

const formDefault = reactive({})

const rules = reactive<FormRules>({
  workNumber: [{ required: true, message: '请输入工单号', trigger: 'blur' }]
})

let form = reactive<any>({ ...formDefault })

const formRef = ref()

const onSubmit = async () => {
  loading.value = true
  if (form.status === 7) {
    save()
    return
  }
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
    await updateEndInfo(form)
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
</style>
