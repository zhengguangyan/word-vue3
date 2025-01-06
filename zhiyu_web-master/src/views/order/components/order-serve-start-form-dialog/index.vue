<template>
  <el-dialog v-model="visibleFlag" title="修改状态为服务开始" width="500px" :close-on-press-escape="false" :close-on-click-modal="false" destroy-on-close @close="onClose">
    <el-form ref="formRef" :model="form" label-width="100px" :rules="rules">
      <el-form-item label="服务开始时间" prop="startOrderServiceTime">
        <el-date-picker
          v-model="form.startOrderServiceTime"
          type="datetime"
          placeholder="服务开始时间"
          value-format="YYYY-MM-DD HH:mm"
          format="YYYY-MM-DD HH:mm"
          time-format="HH:mm"
          clearable
          style="width: 100%"
        />
      </el-form-item>
      <el-form-item label="内容">
        <el-input v-model="form.remark" placeholder="请输入" :rows="3" type="textarea" />
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
import { formatDateString } from '@/utils'
import { setServeorderstatus } from '@/api/order'
import { getSystemTime } from '@/api'
import { formatTime } from '@/utils'
const emits = defineEmits(['reload-list'])

const visibleFlag = ref(false)

const loading = ref(false)
const serveTime = ref() //服务时间
function show(data, time) {
  serveTime.value = time
  if (data) {
    form.id = data.id
  }
  form.startOrderServiceTime = formatDateString(new Date(), 'YYYY-MM-DD HH:mm')
  visibleFlag.value = true
}

function onClose() {
  visibleFlag.value = false
  Object.assign(form, formDefault)
}

const formDefault = reactive({
  startOrderServiceTime: undefined,
  id: undefined,
  remark: undefined
})
const validateStartOrderServiceTime = (rule: any, value: any, callback: any) => {
  // const { data: nowTime } = await getSystemTime()
  // if (new Date(value).getTime() >= nowTime) {
  //   return callback(new Error('服务开始时间应早于当前时间!'))
  // }
  // if (formatTime(value, 'yyyy-MM-dd') !== serveTime.value.split(' ')[0]) {
  //   return callback(new Error(`服务开始日期需与预约服务日${serveTime.value.split(' ')[0]}一致`))
  // }
  // return callback()
  validateStartOrderServiceTimeFun(value, callback)
}
const validateStartOrderServiceTimeFun = async (value, callback) => {
  const { data: nowTime } = await getSystemTime()
  if (new Date(value).getTime() >= nowTime) {
    return callback(new Error('服务开始时间应早于当前时间!'))
  }
  if (formatTime(value, 'yyyy-MM-dd') !== serveTime.value.split(' ')[0]) {
    return callback(new Error(`服务开始日期需与预约服务日${serveTime.value.split(' ')[0]}一致`))
  }
  return callback()
}

const rules = reactive<FormRules>({
  startOrderServiceTime: [
    { required: true, message: '请选择服务开始时间', trigger: 'change' },
    { validator: validateStartOrderServiceTime, trigger: 'change' }
  ]
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
:deep(.el-rate__text) {
  font-size: 14px;
  font-weight: 400;
  color: #666462;
}
:deep(.el-form-item__label) {
  white-space: nowrap;
}
</style>
