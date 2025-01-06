<!-- 流程评价和详情里回访评价共用 -->
<template>
  <el-dialog v-model="visibleFlag" title="订单评价：客户回访评价" width="500px" :close-on-press-escape="false" :close-on-click-modal="false" destroy-on-close @close="onClose">
    <el-form ref="formRef" :model="form" :label-width="orderInfo.orderType === '3' ? '105px' : '80px'" :rules="rules">
      <el-form-item v-if="orderInfo.orderType === '3'" label="服务评价时间" prop="evaluateOrderTime">
        <el-date-picker v-model="form.evaluateOrderTime" type="datetime" placeholder="请选择服务评价时间" value-format="YYYY-MM-DD HH:mm" format="YYYY-MM-DD HH:mm" style="width: 100%" />
      </el-form-item>

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
import { setServeorderstatus, updateEvaluateById } from '@/api/order'
import { getSystemTime } from '@/api'
import { formatTime } from '@/utils'
const emits = defineEmits(['reload-list'])

const visibleFlag = ref(false)

const loading = ref(false)

const rateText = ref(['非常不满意', '不满意', '一般', '满意', '非常满意'])

const orderInfo = ref<any>()

async function show(data, info) {
  // data 里面有评价值字段的时候是 订单详情里对 回访评价的编辑，这时候info是空对象{}
  if (data.detailEdit) {
    form.serveorderId = data.serveorderId
    form.serveQuality = data.serveQuality
    form.serveAttitude = data.serveAttitude
    form.satisfaction = data.satisfaction
    form.punctualArrive = data.punctualArrive
    form.content = data.content
  }
  orderInfo.value = info
  form.id = data.id
  visibleFlag.value = true
  // 补录历史订单才有
  if (info.orderType === '3') {
    const { data: systemTime } = await getSystemTime()
    form.evaluateOrderTime = formatTime(systemTime, 'yyyy-MM-dd HH:mm')
  }
}

function onClose() {
  visibleFlag.value = false
  resetQueryForm(form, {})
}
const formDefault = reactive({})

const validateEvaluateOrderTime = (_rule: any, value: any, callback: any) => {
  validateEvaluateOrderTimeFun(value, callback)
}
const validateEvaluateOrderTimeFun = async (value: any, callback: any) => {
  // 早于服务时间 晚于派单时间
  const { data: systemTime } = await getSystemTime()
  if (new Date(value).getTime() >= systemTime) {
    return callback(new Error('服务评价时间应早于当前时间！'))
  }
  if (new Date(value).getTime() <= new Date(orderInfo.value.confirmOrderTime).getTime()) {
    return callback(new Error(`服务评价时间应晚于服务结束时间${orderInfo.value.confirmOrderTime}！`))
  }
  callback()
}
const rules = reactive<FormRules>({
  evaluateOrderTime: [
    { required: true, message: '请选择接单时间', trigger: 'change' },
    { validator: validateEvaluateOrderTime, trigger: 'change' }
  ],
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
    if (form.serveorderId) {
      //订单详情 编辑回访评价
      await updateEvaluateById(form)
    } else {
      await setServeorderstatus(form)
    }
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
</style>
