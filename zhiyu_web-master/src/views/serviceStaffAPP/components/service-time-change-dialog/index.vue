<template>
  <el-dialog v-model="visibleFlag" title="修改服务时间" width="500px" :close-on-press-escape="false" :close-on-click-modal="false" destroy-on-close @close="onClose">
    <el-form ref="formRef" :model="form" label-width="120px" :rules="rules">
      <el-form-item label="计划服务时间" prop="serveTime">
        <el-date-picker v-model="form.serveTime" type="datetime" placeholder="请选择计划服务时间" value-format="YYYY-MM-DD HH:mm" format="YYYY-MM-DD HH:mm" :clearable="false" />
      </el-form-item>
      <el-form-item v-if="form.startOrderTime" label="开始时间" prop="startOrderTime" :rules="{ required: true, message: '请选择开始时间', trigger: 'change' }">
        <el-date-picker v-model="form.startOrderTime" type="datetime" placeholder="请选择开始时间" value-format="YYYY-MM-DD HH:mm" format="YYYY-MM-DD HH:mm" :clearable="false" />
      </el-form-item>
      <el-form-item v-if="form.finishOrderTime" label="完成时间" prop="finishOrderTime" :rules="{ required: true, message: '请选择完成时间', trigger: 'change' }">
        <el-date-picker v-model="form.finishOrderTime" type="datetime" placeholder="请选择完成时间" value-format="YYYY-MM-DD HH:mm" format="YYYY-MM-DD HH:mm" :clearable="false" />
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
import { updateBasicInfo } from '@/api/serviceStaffAPP'
import { resetQueryForm } from '@/utils'

const emits = defineEmits(['reload'])

const visibleFlag = ref(false)

const loading = ref(false)

function show(data) {
  form.id = data.id
  form.serveTime = data.serveTime
  form.startOrderTime = data.startOrderTime
  form.finishOrderTime = data.finishOrderTime
  form.belongProject = data.belongProject
  form.secondBelongProject = data.secondBelongProject
  visibleFlag.value = true
}

function onClose() {
  visibleFlag.value = false
  resetQueryForm(form, {})
}

const formDefault = reactive({})

const rules = reactive<FormRules>({
  serveTime: [{ required: true, message: '请选择计划服务时间', trigger: 'change' }]
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
    await updateBasicInfo(form)
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
