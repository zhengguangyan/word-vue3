<template>
  <el-dialog v-model="visibleFlag" title="取消订单" width="500px" :close-on-press-escape="false" :close-on-click-modal="false" destroy-on-close @close="onClose">
    <p v-if="orderInfo.paytypeId === '1'" class="tip">订单取消后，从服务包扣除的金额、服务将返还。</p>
    <el-form ref="formRef" :model="form" label-width="95px" :rules="rules" class="r-p-b-20">
      <el-form-item label="取消原因：" prop="cancelReason">
        <el-input v-model="form.cancelReason" placeholder="请输入原因：" :rows="3" type="textarea" />
      </el-form-item>

      <!-- 1:服务包 2：货到付款 -->
      <template v-if="['1', '2'].includes(orderInfo.paytypeId) && +orderInfo.statusCode >= 6">
        <el-form-item label="其他费用：" prop="otherType">
          <div class="flex" style="width: 100%">
            <el-select v-model="form.otherType" placeholder="请选择其他费用" :style="{ width: form.otherType !== '0' ? 'calc(100% - 50px)' : '100%' }" @change="otherTypeChange">
              <el-option v-for="item in otherTypeDic" :key="item.type" :label="item.label" :value="item.value"></el-option>
            </el-select>
            <template v-if="form.otherType !== '0'">
              <el-input-number style="width: 80px" class="numberInput r-m-l-10" v-model="form.otherCost" placeholder="保留两位小数" :controls="false" :precision="2" />
              <span class="r-m-l-5">元</span>
            </template>
          </div>
        </el-form-item>
        <el-form-item v-if="form.otherType !== '0'" label="支付方式：" prop="otherPayType" :rules="[{ required: true, message: '请选择支付方式', trigger: 'change' }]">
          <el-radio-group v-model="form.otherPayType">
            <el-radio :value="2" size="normal">线下支付</el-radio>
            <template v-if="orderInfo.paytypeId === '1'">
              <el-radio v-for="item in servePacketList.filter((item) => item.value === String(orderInfo.payRemarkId))" :key="item.value" :value="item.value">{{ item.label }}</el-radio>
            </template>
          </el-radio-group>
        </el-form-item>
        <div class="loss" v-if="orderInfo.paytypeId === '2'">请与接单的服务人员确认后,再取消订单</div>
      </template>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="onSubmit" :loading="loading">确认取消</el-button>
        <el-button @click="onSubmitReorder" :loading="loadingReorder">取消并重新下单</el-button>
        <el-button type="primary" @click="onClose">返回</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { ElMessage, FormRules } from 'element-plus'
import { cancelStatus } from '@/api/order'
import { resetQueryForm } from '@/utils'
import { useRouter } from 'vue-router'
import { servePacketCustomerList } from '@/api/servePacket'
const emits = defineEmits(['reload-list'])

const { push } = useRouter()

const visibleFlag = ref(false)

const loading = ref(false)

const loadingReorder = ref(false)

const orderInfo = ref<any>({})
const otherTypeDic = ref<any[]>([])

function show(data, listDic) {
  // 支付方式为货到付款(2)，且订单状态是服务开始(6)之后，取消订单要有其他费用字段
  if (data.paytypeId === '2' && +data.statusCode >= 6) {
    form.otherPayType = 2
  }
  form.serveorderId = data.id
  orderInfo.value = data
  // 获取服务包数据
  if (data.paytypeId === '1' && +data.statusCode >= 6) {
    // form.otherPayType = String(data.payRemarkId)
    getServePacketList()
  }
  otherTypeDic.value = listDic
  visibleFlag.value = true
}
function otherTypeChange(val) {
  if (val === '0') {
    form.otherCost = undefined
    form.otherPayType = undefined
  }
}
function onClose() {
  visibleFlag.value = false
  resetQueryForm(form, {})
}

const formDefault = reactive({
  cancelReason: '',
  otherType: '0',
  otherCost: undefined,
  otherPayType: undefined
})

const rules = reactive<FormRules>({
  cancelReason: [{ required: true, message: '请填写原因', trigger: 'change' }]
})

let form = reactive<any>({ ...formDefault })

// 服务包数据
const servePacketList = ref<any>([])
const getServePacketList = async () => {
  const { data } = await servePacketCustomerList({
    customerId: orderInfo.value.memberId,
    // servePacketFinishStatusList: ['1', '2'],
    usingStatusList: ['1', '2']
  })
  servePacketList.value = data.map((item) => {
    return {
      value: item.id,
      label: item.servePacketName
    }
  })
}

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
    await cancelStatus(form)
    ElMessage.success('操作成功')
    emits('reload-list')
    onClose()
  } finally {
    loading.value = false
  }
}

const onSubmitReorder = async () => {
  loadingReorder.value = true
  await formRef.value.validate((valid) => {
    if (valid) {
      saveReorder()
    } else {
      ElMessage.error('请确认必填参数填写正确')
      loadingReorder.value = false
    }
  })
}

const saveReorder = async () => {
  try {
    await cancelStatus(form)
    ElMessage.success('操作成功')
    emits('reload-list')
    onClose()
    reorder()
  } finally {
    loadingReorder.value = false
  }
}

const reorder = () => {
  push({
    path: `/service/add`,
    query: {
      serviceType: 'order',
      id: orderInfo.value.memberId,
      phone: orderInfo.value.memberMobilephone
    }
  })
  localStorage.setItem('orderData', JSON.stringify(orderInfo.value))
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
