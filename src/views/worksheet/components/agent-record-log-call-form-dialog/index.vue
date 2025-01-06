<template>
  <el-dialog
    v-model="visibleFlag"
    title="关联通话录音"
    width="500px"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
  >
    <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
      <el-form-item label="通话流水号" prop="agentRecordLogCallId">
        <el-input v-model="form.agentRecordLogCallId" />
      </el-form-item>
      <el-form-item>
        <el-button @click="onClose">取消</el-button>
        <el-button type="primary" @click="onSubmit">确认</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<script lang="ts" setup>
import { ref, reactive } from 'vue'

const emits = defineEmits(['reload-list'])

const visibleFlag = ref(false)

function show(rowData) {
  if (rowData) {
    form.worksheetId = rowData.id
  }
  visibleFlag.value = true
}

function onClose() {
  Object.assign(form, formDefault)
  visibleFlag.value = false
}

const formDefault = reactive({
  id: undefined,
  worksheetId: undefined,
  agentRecordLogCallId: undefined
})

let form = reactive({ ...formDefault })

const rules = reactive({
  agentRecordLogCallId: [{ required: true, message: '请填写录音流水号', trigger: 'blur' }]
})
const formRef = ref()

const onSubmit = () => {}

// const onSubmit = async () => {
//   try {
//     await formRef.value.validate()
//     save()
//   } catch (err) {
//     ElMessage.error('参数验证错误，请仔细填写表单数据!')
//   }
// }

// const save = async () => {
//   try {
//     let result: any = await saveOrUpdateWorksheetType(form)
//     if (result.code === 200) {
//       ElMessage.success('操作成功')
//       onClose()
//     }
//   } catch (err: any) {
//     ElMessage.error(err.message)
//   }
// }
defineExpose({
  show
})
</script>
