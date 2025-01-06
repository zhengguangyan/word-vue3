<template>
  <el-dialog v-model="visibleFlag" title="修改跟踪信息" width="500px" :close-on-press-escape="false" :close-on-click-modal="false" destroy-on-close @close="onClose">
    <el-form ref="formRef" :model="form" label-width="80px" :rules="rules">
      <el-form-item label="状态" prop="callRecordComment">
        <span>{{ form.callRecordComment }}</span>
      </el-form-item>
      <el-form-item label="方式" prop="callMode">
        <el-radio-group v-model="form.callMode">
          <el-radio value="3">APP</el-radio>
          <el-radio value="4">平台</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="内容" prop="detailContent">
        <el-input v-model="form.detailContent" placeholder="请输入" :rows="3" type="textarea" show-word-limit maxlength="300" />
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
import { updateRecord } from '@/api/worksheet'
import { resetQueryForm } from '@/utils'

const emits = defineEmits(['reload'])

const visibleFlag = ref(false)

const loading = ref(false)

function show(data) {
  Object.assign(form, data)
  visibleFlag.value = true
}

function onClose() {
  visibleFlag.value = false
  resetQueryForm(form, {})
}

const formDefault = reactive({})

const rules = reactive<FormRules>({
  callMode: [{ required: true, message: '请选择方式', trigger: 'change' }]
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
    await updateRecord(form)
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
