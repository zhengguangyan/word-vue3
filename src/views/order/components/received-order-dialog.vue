<template>
  <el-dialog v-model="visible" :title="code === '3' ? '提示' : '服务确认'" width="500px" :close-on-press-escape="false" :close-on-click-modal="false" destroy-on-close @close="onClose">
    <div class="r-p-b-20">
      <!-- 补录历史订单才有 -->
      <el-form v-if="orderType === '3'" ref="formRef" :model="ruleForm" :rules="rules" :label-width="code === '5' ? '75px' : '105px'">
        <el-form-item v-if="code === '5'" label="接单时间" prop="acceptOrderTime">
          <el-date-picker v-model="ruleForm.acceptOrderTime" type="datetime" placeholder="请选择接单时间" value-format="YYYY-MM-DD HH:mm" format="YYYY-MM-DD HH:mm" style="width: 100%" />
        </el-form-item>
        <el-form-item v-if="code === '8'" label="服务确认时间" prop="confirmOrderTime">
          <el-date-picker v-model="ruleForm.confirmOrderTime" type="datetime" placeholder="请选择服务确认时间" value-format="YYYY-MM-DD HH:mm" format="YYYY-MM-DD HH:mm" style="width: 100%" />
        </el-form-item>
      </el-form>
      <div>{{ code === '3' ? '是否确认帮助服务人员"接单"？' : '是否确认修改状态？' }}</div>
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
import { ElMessage, FormRules } from 'element-plus'
import { setServeorderstatus } from '@/api/order'
import { getSystemTime } from '@/api'
import { formatTime } from '@/utils'
const emits = defineEmits(['reload-list'])
const visible = ref(false)
const serveTime = ref() // 服务时间
const sendOrderTime = ref() // 派单时间
const finishOrderTime = ref() //服务结束时间
const orderType = ref()
const formDefault = reactive({
  id: undefined,
  acceptOrderTime: ''
})
let ruleForm = reactive<any>({ ...formDefault })

const validateAcceptOrderTime = (_rule: any, value: any, callback: any) => {
  validateAcceptOrderTimeFun(value, callback)
}
const validateAcceptOrderTimeFun = async (value: any, callback: any) => {
  // 早于服务时间 晚于派单时间
  const { data: systemTime } = await getSystemTime()
  if (new Date(value).getTime() >= systemTime) {
    return callback(new Error('接单时间应早于当前时间！'))
  }
  if (new Date(value).getTime() <= new Date(sendOrderTime.value).getTime()) {
    return callback(new Error(`接单时间应晚于派单时间${sendOrderTime.value}！`))
  }
  if (new Date(value).getTime() >= new Date(serveTime.value).getTime()) {
    return callback(new Error(`接单时间应早于预约服务时间${serveTime.value}！`))
  }
  callback()
}

const validateConfirmOrderTime = (_rule: any, value: any, callback: any) => {
  validateConfirmOrderTimeFun(value, callback)
}
const validateConfirmOrderTimeFun = async (value: any, callback: any) => {
  // 早于服务时间 晚于派单时间
  const { data: systemTime } = await getSystemTime()
  if (new Date(value).getTime() >= systemTime) {
    return callback(new Error('服务确认时间应早于当前时间！'))
  }
  if (new Date(value).getTime() <= new Date(finishOrderTime.value).getTime()) {
    return callback(new Error(`服务确认时间应晚于服务结束时间${finishOrderTime.value}！`))
  }
  callback()
}
const code = ref()

const rules = reactive<FormRules>({
  acceptOrderTime: [
    { required: code.value === '5', message: '请选择接单时间', trigger: 'change' },
    { validator: validateAcceptOrderTime, trigger: 'change' }
  ],
  confirmOrderTime: [
    { required: code.value === '8', message: '请选择服务确认时间', trigger: 'change' },
    { validator: validateConfirmOrderTime, trigger: 'change' }
  ]
})

// 平台接单
const changeStaff = async (ruleForm) => {
  const res: any = await setServeorderstatus(ruleForm)
  if (res.code == 200) {
    ElMessage.success('操作成功')
    loading.value = false
    visible.value = false
    emits('reload-list')
  } else {
    ElMessage.error(res.msg)
    loading.value = false
  }
}

/* 取消 保存操作 */
const loading = ref(false)
const formRef = ref()
const onClose = () => {
  visible.value = false
  Object.assign(ruleForm, formDefault)
}
const onSubmit = async () => {
  loading.value = true
  if (orderType.value === '3') {
    await formRef.value.validate((valid) => {
      if (valid) {
        changeStaff(ruleForm)
      } else {
        ElMessage.error('请确认必填参数填写正确')
        loading.value = false
      }
    })
    return
  }
  changeStaff(ruleForm)
}

async function show(data, orderInfo) {
  code.value = data.code
  ruleForm.id = data.id
  orderType.value = orderInfo.orderType
  visible.value = true
  // 补录历史订单才有
  if (orderInfo.orderType === '3') {
    const { data: systemTime } = await getSystemTime()
    if (data.code === '5') {
      ruleForm.acceptOrderTime = formatTime(systemTime, 'yyyy-MM-dd HH:mm')
      serveTime.value = orderInfo.serveTime
      sendOrderTime.value = orderInfo.sendOrder
    }
    if (data.code === '8') {
      ruleForm.confirmOrderTime = formatTime(systemTime, 'yyyy-MM-dd HH:mm')
      finishOrderTime.value = orderInfo.finishOrderTime
    }
  }
}
defineExpose({
  show
})
</script>
