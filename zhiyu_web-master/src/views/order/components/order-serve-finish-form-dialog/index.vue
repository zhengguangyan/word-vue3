<template>
  <el-dialog v-model="visibleFlag" title="修改状态为服务完成" width="600px" :close-on-press-escape="false" :close-on-click-modal="false" destroy-on-close @close="onClose">
    <el-form ref="formRef" :model="form" label-width="105px" :rules="rules">
      <!-- 补录历史订单才有 -->
      <el-form-item v-if="orderInfo.orderType === '3'" label="服务结束时间" prop="finishOrderTime">
        <el-date-picker v-model="form.finishOrderTime" type="datetime" placeholder="请选择服务结束时间" value-format="YYYY-MM-DD HH:mm" format="YYYY-MM-DD HH:mm" style="width: 100%" />
      </el-form-item>
      <el-form-item label="内容">
        <el-input v-model="form.serveContent" placeholder="请输入" :rows="3" type="textarea" />
      </el-form-item>
      <p class="tip">
        是否确定修改状态？如有超出下单金额部分，请先点击
        <a href="javascript:void(0)" @click="changeExtra"> 记录超出下单金额 </a>
      </p>
      <div v-if="extraVisibleFlag">
        <h2 class="title">超出下单金额信息</h2>
        <el-form-item label="数量" prop="beyondOrderNumber">
          <el-input-number class="numberInput" :controls="false" :precision="1" :step="0.5" :min="0" v-model="form.beyondOrderNumber" placeholder="仅保留小数点后一位" />
        </el-form-item>
        <el-form-item label="金额" prop="payBeyondPrice">
          <el-input-number class="numberInput" :controls="false" :precision="2" v-model="form.payBeyondPrice" placeholder="仅保留2位小数" />
          <div class="el-form-item__error r-m-t-3" style="color: #ccc; font-size: 12px"> 金额为负时，支付方式默认为订单支付方式，不支持修改 </div>
        </el-form-item>
        <el-form-item label="支付方式" prop="onlinePay">
          <el-radio-group v-model="form.onlinePay">
            <el-radio value="2">线下支付</el-radio>
            <template v-if="orderInfo.paytypeId === '1'">
              <el-radio v-for="item in servePacketList" :key="item.value" :value="item.value">{{ item.label }}</el-radio>
            </template>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="最终确认数量"> {{ calValueObj.calFinalNum }} </el-form-item>
        <el-form-item label="最终确认金额">
          <span>￥{{ calValueObj.calFinalPrice }} 元</span>
          <span style="color: #999693">（平台收款{{ calValueObj.platformReceipts }}元，服务商收款 {{ calValueObj.serviceProviderReceipts }} 元）</span>
        </el-form-item>
      </div>
      <el-form-item v-if="orderInfo.source === '4'" label="完成确认签名" prop="finishServePhotos" :rules="[{ required: orderInfo.source === '4', message: '请上传完成确认签名', trigger: 'change' }]">
        <!--           :on-exceed="handleExceed"
          :before-upload="beforeUpload" -->
        <el-upload
          style="width: 100%"
          :headers="header"
          v-model:file-list="fileList"
          action="/api/minio/endpoint/uploadToSysAttach"
          :on-success="successUpload"
          :on-remove="onRemove"
          :on-preview="downloadList"
          :limit="1"
        >
          <el-button type="primary">上传附件</el-button>
        </el-upload>
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
import { ref, reactive, computed } from 'vue'
import { ElMessage, FormRules } from 'element-plus'
import { resetQueryForm } from '@/utils'
import { setServeorderstatus } from '@/api/order'
import { servePacketCustomerList } from '@/api/servePacket'
import { getSystemTime } from '@/api'
import { formatTime } from '@/utils'
import Decimal from 'decimal.js'
import Cookies from 'js-cookie'
const emits = defineEmits(['reload-list'])

const visibleFlag = ref(false)

const extraVisibleFlag = ref(false)

const loading = ref(false)
const header = ref({
  Authorization: Cookies.get('TokenKey')
})
const fileList = ref([])
const orderInfo = ref<any>({
  finalPrice: 0,
  platformReceipts: 0,
  sellerReceipts: 0
})
function successUpload(response: any, uploadFile: any, uploadFiles: any) {
  if (response.code === 200) {
    form.finishServePhotos = String(response.data.id)
  }
}
function onRemove() {
  form.finishServePhotos = ''
}

const downloadList = (val) => {
  if (val.url) {
    window.open(val.url)
  } else {
    const url = URL.createObjectURL(new Blob([val.raw]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', val.name)
    link.setAttribute('target', '_blank')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
}
const handleExceed = () => {
  ElMessage.error('最多上传10份附件')
}

const beforeUpload = (file) => {
  const isLt2M = file.size / 1024 / 1024 < 2

  if (['application/zip', 'application/x-zip-compressed'].includes(file.type)) {
    if (!isLt2M) {
      ElMessage.error('上传的压缩包大小不能超过 2MB!')
      return false
    }
  } else if (file.type.startsWith('video/')) {
    return new Promise<void>((resolve, reject) => {
      // 创建视频对象用于加载文件
      const video = document.createElement('video')
      video.preload = 'metadata'
      video.onloadedmetadata = function () {
        window.URL.revokeObjectURL(video.src)
        const duration = video.duration
        if (duration > 60) {
          ElMessage.error('上传的视频时长不能超过 1分钟!')
          reject()
        } else {
          resolve()
        }
      }
      video.onerror = function () {
        ElMessage.error('读取视频文件失败！')
        reject()
      }
      video.src = URL.createObjectURL(file)
    })
  } else {
    return true
  }
}
// 服务包数据
const servePacketList = ref<any>([])
const formDefault = reactive({
  payBeyondPrice: 0,
  onlinePay: '',
  beyondOrderNumber: 0
})
let form = reactive<any>({ ...formDefault })
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

// 初始加载数据
async function show(data, info) {
  form.id = data.id
  orderInfo.value = info
  visibleFlag.value = true

  // 补录历史订单才有
  if (info.orderType === '3') {
    const { data: systemTime } = await getSystemTime()
    form.finishOrderTime = formatTime(systemTime, 'yyyy-MM-dd HH:mm')
  }

  // 市平台订单 才有
  if (info.source === '4') {
    form.finishServePhotos = ''
  }

  // 获取服务包数据
  if (orderInfo.value.paytypeId === '1') {
    getServePacketList()
  }
}

function onClose() {
  visibleFlag.value = false
  resetQueryForm(form, { beyondOrderNumber: 0, payBeyondPrice: 0 })
  changeExtra()
  extraVisibleFlag.value = false
}

const changeExtra = () => {
  extraVisibleFlag.value = !extraVisibleFlag.value
  if (extraVisibleFlag.value) {
    form.onlinePay = '2'
  } else {
    form.onlinePay = ''
  }
  form.payBeyondPrice = 0
  form.beyondOrderNumber = 0
}
//校验数量
const checkServeCount = (_rule: any, value: any, callback: any) => {
  if (value && value % 0.5 !== 0) {
    return callback(new Error('输入值必须是0.5的整数倍'))
  }
  callback()
}

const validateFinishOrderTime = (_rule: any, value: any, callback: any) => {
  validateFinishOrderTimeFun(value, callback)
}
const validateFinishOrderTimeFun = async (value: any, callback: any) => {
  // 早于服务时间 晚于订单开始时间
  const { data: systemTime } = await getSystemTime()
  if (new Date(value).getTime() >= systemTime) {
    return callback(new Error('服务结束时间应早于当前时间！'))
  }
  if (new Date(value).getTime() <= new Date(orderInfo.value.startOrderServiceTime).getTime()) {
    return callback(new Error(`服务结束时间应晚于服务开始时间${orderInfo.value.startOrderServiceTime}！`))
  }
  callback()
}

const rules = reactive<FormRules>({
  finishOrderTime: [
    { required: true, message: '请选择服务结束时间', trigger: 'change' },
    { validator: validateFinishOrderTime, trigger: 'change' }
  ],
  onlinePay: [{ required: true, message: '请选择支付方式', trigger: 'change' }],
  beyondOrderNumber: [
    { required: true, message: '请输入数量', trigger: 'change' },
    { validator: checkServeCount, trigger: 'blur' }
  ],
  payBeyondPrice: [{ required: true, message: '请输入金额', trigger: 'change' }]
})

const formRef = ref()

const onSubmit = async () => {
  loading.value = true
  if (extraVisibleFlag.value) {
    await formRef.value.validate((valid) => {
      if (valid) {
        save()
      } else {
        ElMessage.error('请确认必填参数填写正确')
        loading.value = false
      }
    })
  } else {
    save()
  }
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
