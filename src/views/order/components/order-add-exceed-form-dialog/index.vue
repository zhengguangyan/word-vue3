<template>
  <el-dialog v-model="visibleFlag" title="添加超出下单信息" width="600px" :close-on-press-escape="false" :close-on-click-modal="false" destroy-on-close @close="onClose">
    <el-form ref="formRef" :model="form" label-width="100px" :rules="rules">
      <div>
        <el-form-item label="数量" prop="beyondOrderNumber">
          <el-input-number class="numberInput" :controls="false" :precision="1" :min="0" :step="0.5" v-model="form.beyondOrderNumber" placeholder="仅保留小数点后一位" />
        </el-form-item>
        <el-form-item label="金额" prop="payBeyondPrice">
          <el-input-number class="numberInput" :controls="false" :precision="2" v-model="form.payBeyondPrice" placeholder="仅保留2位小数" />
          <div class="el-form-item__error r-m-t-3" style="color: #ccc; font-size: 12px"> 金额为负时，支付方式默认为订单支付方式，不支持修改 </div>
        </el-form-item>
        <el-form-item label="支付方式" prop="onlinePay">
          <el-radio-group v-model="form.onlinePay">
            <el-radio value="2">线下支付</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="最终确认数量">
          {{ calValueObj.calFinalNum }}
        </el-form-item>
        <el-form-item label="最终确认金额">
          <span>￥{{ calValueObj.calFinalPrice }} 元</span>
          <span style="color: #999693">（平台收款{{ calValueObj.platformReceipts }}元，服务商收款 {{ calValueObj.serviceProviderReceipts }} 元）</span>
        </el-form-item>
      </div>
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
import { ref, reactive, computed } from 'vue'
import { ElMessage, FormRules } from 'element-plus'
import { resetQueryForm } from '@/utils'
import { saveExceedAmount } from '@/api/order'
import Decimal from 'decimal.js'
const emits = defineEmits(['reload-list'])

const visibleFlag = ref(false)

const loading = ref(false)

const orderInfo = ref<any>({})

function show(info) {
  form.id = info.id
  orderInfo.value = info
  visibleFlag.value = true
}

function onClose() {
  visibleFlag.value = false
  resetQueryForm(form, { onlinePay: '2', beyondOrderNumber: undefined, payBeyondPrice: undefined })
}

const formDefault = reactive({ onlinePay: '2' })
//校验数量
const checkServeCount = (_rule: any, value: any, callback: any) => {
  if (value && value % 0.5 !== 0) {
    return callback(new Error('输入值必须是0.5的整数倍'))
  }
  callback()
}
const rules = reactive<FormRules>({
  onlinePay: [{ required: true, message: '请选择支付方式', trigger: 'change' }],
  beyondOrderNumber: [
    { required: true, message: '请输入数量', trigger: 'change' },
    { validator: checkServeCount, trigger: 'blur' }
  ],
  payBeyondPrice: [{ required: true, message: '请输入金额', trigger: 'change' }]
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
    await saveExceedAmount(form)
    ElMessage.success('操作成功')
    emits('reload-list')
    onClose()
  } finally {
    loading.value = false
  }
}

const calValueObj = computed(() => {
  const serveCount = new Decimal(orderInfo.value.serveCount)
  const beyondOrderNumber = new Decimal(form.beyondOrderNumber || 0)
  const payBeyondPrice = new Decimal(form.payBeyondPrice || 0)
  const finalPrice = new Decimal(orderInfo.value.finalPrice)
  const platformReceipts = new Decimal(orderInfo.value.platformReceipts)
  const sellerReceipts = new Decimal(orderInfo.value.sellerReceipts)
  return {
    calFinalNum: serveCount.plus(beyondOrderNumber).toNumber(),
    calFinalPrice: payBeyondPrice.plus(finalPrice).toNumber(),
    platformReceipts: form.onlinePay !== '2' ? payBeyondPrice.plus(platformReceipts).toNumber() : orderInfo.value.platformReceipts,
    serviceProviderReceipts: form.onlinePay === '2' ? payBeyondPrice.plus(sellerReceipts).toNumber() : orderInfo.value.sellerReceipts
  }
})
defineExpose({
  show
})
</script>
<style scoped>
.tip {
  color: #e96848;
  line-height: 16px;
  margin-bottom: 15px;
}
.tip a {
  text-decoration: underline;
  color: #ff9500;
}
.title {
  font-size: 16px;
  font-weight: 600;
  color: var(--main-text-color);
  margin-bottom: 20px;
}
.title::before {
  display: none !important;
}
.numberInput {
  width: 100%;
}
:deep(.el-input-number .el-input__inner) {
  text-align: left;
}
</style>
