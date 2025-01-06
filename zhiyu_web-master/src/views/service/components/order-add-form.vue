<template>
  <el-form ref="formRef" :model="order" label-width="102px" :rules="rules" :validate-on-rule-change="false">
    <el-form-item label="联系人信息">
      <el-select v-model="order.addressId" placeholder="请选择" style="width: 100%">
        <template v-for="item in linkmanList" :key="item.value">
          <div class="flex row-between hover-box">
            <el-option class="option-item" :label="item.label" :value="item.id" :disabled="item.disabled">
              <el-space>
                <el-tag v-if="item.acquiescent" type="warning" class="default-tip">默认</el-tag>
                <span>{{ item.label }}</span>
              </el-space>
            </el-option>
            <el-space class="hover-item" v-if="!item.disabled">
              <el-button v-if="!item.acquiescent" link type="primary" @click="setDefaultButton(item)">设为默认</el-button>
              <el-button link type="primary" @click="editAddress(item)">修改</el-button>
              <el-popconfirm title="是否删除该数据？" @confirm="delAddress(item.id)" :width="180">
                <template #reference>
                  <el-button link type="primary">删除</el-button>
                </template>
              </el-popconfirm>
            </el-space>
          </div>
        </template>
        <template #footer>
          <div class="flex row-center">
            <el-button link type="primary" :icon="Plus" @click="addAddress">新增地址</el-button>
          </div>
        </template>
      </el-select>
    </el-form-item>
    <el-row :gutter="24">
      <el-col :span="8">
        <el-form-item prop="categoryId" label="服务类别" label-class-name="required-item">
          <DictSelect v-model="order.categoryId" :distList="typeList" placeholder="请选择服务类别" style="width: 100%" :clearable="true" @change="changeCategoryId" />
        </el-form-item>
      </el-col>
      <el-col :span="7" class="flex">
        <DictSelect v-model="order.serveId" :distList="serveList" placeholder="请选择服务项目" style="width: 100%" :clearable="true" @change="changeServeId" v-if="serveList.length" />
        <span class="business-time-range-tip" v-if="businessTimeRange.length">营业时间范围：{{ businessTimeRange[0] }}-{{ businessTimeRange[1] }}</span>
      </el-col>
      <el-col :span="7">
        <DictSelect
          v-model="order.serveOptionId"
          :distList="serveOptionList"
          placeholder="请选择服务子项目"
          style="width: 100%"
          :clearable="true"
          @change="changeServeOptionId"
          v-if="serveOptionList.length"
        />
      </el-col>
    </el-row>
    <div class="price-info" v-if="order.minPrice || order.centerPrice">
      <p>
        服务单价：服务最低价 {{ order.minCountPrice }}，服务单价(中心价)
        {{ order.centerPrice }}
      </p>
      <p>优惠信息：无</p>
    </div>
    <el-row :gutter="24">
      <el-col :span="8">
        <el-form-item label="订单性质" prop="orderNature">
          <DictSelect width="100%" v-model="order.orderNature" :distList="filterDict('order_nature')" placeholder="订单性质" style="width: 100%" :clearable="true" />
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="购买数量" prop="serveCount">
          <el-input-number
            :placeholder="order.serveId ? '购买数量' : '请先选择服务类别和服务项目'"
            style="width: 100%"
            v-model="order.serveCount"
            :controls="false"
            :min="minCount"
            :max="maxCount"
            :precision="1"
            :step="0.5"
            :disabled="!minCount"
            @change="serveCountChange"
          />
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="订单价格">
          <el-space v-if="order.memberPrice">
            现价
            <span v-if="!orderPriceEditFlag">￥{{ price }}</span>
            <span v-else>
              <el-input-number class="numberInput" v-model="price" :controls="false" :precision="2" :step="0.1" @blur="memberPriceChange" />
            </span>
            <el-button link type="primary" @click="orderPriceEditFlag = true" v-if="!orderPriceEditFlag" :disabled="!order.paytypeId"> 修改 </el-button>
            <el-button link type="primary" @click="orderPriceEditFlag = false" v-else>取消</el-button>
            <el-tooltip effect="dark" placement="right-start">
              <template #content>
                365会员（欢孝APP上购买血压仪等设备成为会员）<br />
                订单价格=365最低价格 + 365价格 *（N-最小数量）（N>=最小数量）<br />
                普通客户<br />
                订单价格=服务最低价格 + 服务单价（中心价） *（N-最小数量）（N>=最小数量）<br />
                备注：N代表购买数量<br />
              </template>
              <img src="@/assets/icon/price-tag.png" style="width: 20px; height: 20px" />
            </el-tooltip>
          </el-space>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="24">
      <el-col :span="8">
        <el-form-item label="支付方式" prop="paytypeId">
          <DictSelect v-model="order.paytypeId" :distList="filterDict('order_pay_type')" placeholder="支付方式" style="width: 100%" :clearable="true" @change="changePaytypeId" />
        </el-form-item>
      </el-col>
      <el-col :span="8" v-if="servePacketList.length">
        <DictSelect v-model="order.payRemarkId" :distList="servePacketList" placeholder="请选择服务包" style="width: 100%" :clearable="true" />
      </el-col>
      <el-col :span="8" v-if="order.payRemarkId">
        <span class="order-type-tip">{{ balanceInfo.text }}</span>
        <span v-if="balanceInfo.text && balanceInfo.balance < price" class="low-balance-tip loss">余额不足</span>
      </el-col>
    </el-row>
    <el-row :gutter="24">
      <el-col :span="8">
        <el-form-item label="订单类型" prop="orderType">
          <DictSelect width="100%" v-model="order.orderType" :distList="filterDict('order_replacement')" placeholder="订单类型" style="width: 100%" :clearable="true" @change="orderTypeChange" />
        </el-form-item>
      </el-col>
      <!-- 服务包才出现提示 -->
      <el-col :span="16" v-if="order.paytypeId === '1'">
        <p class="order-type-tip" v-if="order.orderType === '1'">从当月余额扣除</p>
        <p class="order-type-tip" v-if="order.orderType === '3'"> 请慎重选择，补单将重新计算周期内客户余额信息，可能导致补单月之后月份余额出现负数 </p>
      </el-col>
    </el-row>

    <el-row :gutter="24">
      <el-col :span="8" v-if="order.orderType === '3'">
        <el-form-item label="下单时间" prop="orderTime">
          <el-date-picker
            v-model="order.orderTime"
            type="datetime"
            placeholder="下单时间"
            value-format="YYYY-MM-DD HH:mm"
            format="YYYY-MM-DD HH:mm"
            time-format="HH:mm"
            clearable
            style="width: 100%"
          />
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="服务时间" prop="serveTime">
          <el-date-picker
            v-model="order.serveTime"
            type="datetime"
            placeholder="服务时间"
            value-format="YYYY-MM-DD HH:mm"
            format="YYYY-MM-DD HH:mm"
            time-format="HH:mm"
            clearable
            style="width: 100%"
            @change="serveTimeChange"
          />
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="服务工单号" prop="serveNo">
          <el-input v-model="order.serveNo" placeholder="请输入服务工单号" style="width: 100%" :maxlength="20" />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="24">
      <el-col :span="8">
        <el-form-item label="是否需要发票" prop="offerInvoice">
          <el-radio-group v-model="order.offerInvoice">
            <el-radio value="1">是</el-radio>
            <el-radio value="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-col>
      <el-col :span="8" v-if="order.offerInvoice == 1">
        <el-form-item label="发票形式" prop="invoiceType">
          <DictSelect width="100%" v-model="order.invoiceType" :distList="filterDict('invoice_type')" placeholder="发票形式" style="width: 100%" :clearable="true" />
        </el-form-item>
      </el-col>
      <el-col :span="8" v-if="order.offerInvoice == 1">
        <el-form-item label="发票抬头" prop="invoiceHead">
          <el-input v-model="order.invoiceHead" />
        </el-form-item>
      </el-col>
    </el-row>
    <el-form-item label="备注一">
      <el-input v-model="order.remark" placeholder="APP可见" type="textarea" style="width: 100%" maxlength="300" show-word-limit />
    </el-form-item>
    <el-form-item label="备注二">
      <el-input v-model="order.remark2" placeholder="APP不可见" type="textarea" style="width: 100%" maxlength="300" show-word-limit />
    </el-form-item>
    <el-form-item label="上门回访时间" prop="shangmenTime">
      <el-space>
        <el-date-picker v-model="order.shangmenTime" type="datetime" value-format="YYYY-MM-DD HH:mm" format="YYYY-MM-DD HH:mm" time-format="HH:mm" placeholder="上门回访时间" />
        <el-checkbox v-model="order.isShangMen" label="由我访问" />
      </el-space>
    </el-form-item>
    <el-form-item label="满意度回访日期" prop="manyiduTime">
      <el-space>
        <el-date-picker v-model="order.manyiduTime" type="datetime" value-format="YYYY-MM-DD HH:mm" format="YYYY-MM-DD HH:mm" time-format="HH:mm" placeholder="满意度回访日期" />
        <el-checkbox v-model="order.isManYiDu" label="由我访问" />
      </el-space>
    </el-form-item>
    <el-row :gutter="24">
      <el-col :span="8">
        <el-form-item label="是否为代替单" prop="replaceOrder">
          <el-radio-group v-model="order.replaceOrder">
            <el-radio value="1">是</el-radio>
            <el-radio value="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="是否为售后单" prop="afterSaleOrder">
          <el-radio-group v-model="order.afterSaleOrder">
            <el-radio value="1">是</el-radio>
            <el-radio value="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-col>
    </el-row>
    <h4 class="title" style="margin: 24px 0 16px; font-weight: 600">历史订单</h4>
    <el-table
      :data="historyOrderList"
      header-row-class-name="table-header"
      :style="{
        width: 'calc(100vw - 255px)',
        border: '1px solid #f5f3f0',
        borderRadius: '8px'
      }"
      max-height="200"
    >
      <el-table-column type="index" />
      <el-table-column label="操作" width="100">
        <template #default="{ row }">
          <el-button link type="primary" size="small" @click="detail(row)"> 查看 </el-button>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip prop="serveNo" min-width="160" label="服务工单号" />
      <el-table-column show-overflow-tooltip prop="id" min-width="160" label="订单编号" />
      <el-table-column show-overflow-tooltip prop="orderTime" min-width="170" label="受理日期" />
      <el-table-column show-overflow-tooltip prop="creatorName" min-width="160" label="受理坐席" />
      <el-table-column show-overflow-tooltip prop="isClosed" min-width="100" label="是否结案">
        <template #default="{ row }">
          {{ row.isClosed == null ? '' : row.isClosed == 1 ? '是' : '否' }}
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip prop="categoryName" min-width="160" label="服务类别" />
      <el-table-column show-overflow-tooltip prop="serveName" min-width="160" label="服务项目" />
      <el-table-column show-overflow-tooltip prop="serveOptionName" min-width="160" label="服务子项" />
      <el-table-column show-overflow-tooltip prop="money" min-width="160" label="订单价格" />
      <el-table-column show-overflow-tooltip prop="shangmenTime" min-width="160" label="上门回访时间" />
      <el-table-column show-overflow-tooltip prop="shangmenUserName" min-width="160" label="上门回访坐席" />
      <el-table-column show-overflow-tooltip prop="manyiduTime" min-width="160" label="满意度回访时间" />
      <el-table-column show-overflow-tooltip prop="manyiduUserName" min-width="160" label="满意度回访坐席" />
    </el-table>
  </el-form>
  <div class="button-box">
    <el-button type="primary" @click="submit" :loading="saving">保存</el-button>
    <el-button @click="onBack">取消</el-button>
    <span class="tips">
      <Icon icon="mdi:about-circle-outline" style="vertical-align: middle" />
      若要自动关联通话录音，请在通话挂断后再点击添加（录音在通话挂断后才会生成），通话挂断前点击添加，关联的录音将不正确！
    </span>
  </div>

  <OrderAddress ref="orderAddressRef" @reload-list="getAddressList" :memberid="props.customerId" />
</template>

<script lang="ts" setup>
import DictSelect from '@/components/DictSelect/index.vue'
import OrderAddress from './order-address-form.vue'
import { getCustomerBaseDetailById } from '@/api/customer/index'
import { onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { reactive } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { getMemberAddressList, removeMemberAddress, updateMemberAddress } from '@/api/order'
import { getSystemTime } from '@/api'
import { getServeTypeList } from '@/api/serviceProvider'
import { getOptionList, getServeInfoList } from '@/api/serviceProject'
import { saveOrder, getOrderList } from '@/api/order'
import { servePacketCustomerList } from '@/api/servePacket'
import { computed } from 'vue'
import { filterDict } from '@/hooks/web/useDict'
import { formatTime } from '@/utils'
import Decimal from 'decimal.js'
const props = defineProps({
  customerId: {
    type: Number,
    default: null
  },
  serviceType: {
    type: String,
    default: 'consult'
  },
  memberLevel: {
    type: String,
    default: '1'
  }
})

const { back, push } = useRouter()

function onBack() {
  onClear()
  back()
}

const onClear = () => {
  order.value = { memberId: props.customerId }
  formRef.value?.resetFields()
  serveList.value = []
  serveOptionList.value = []
  getAddressList()
}

function detail(row) {
  push(`/order/orderDetail?id=${row.id}`)
}

const orderPriceEditFlag = ref(false)

const saving = ref(false)

const order = ref<any>({})

const formRef = ref()

const minCount = ref(0)

const maxCount = ref(0)
const businessTimeRange = ref<string[]>([]) // 营业时间范围

const price = ref(0) //现价

// 订单类型变化的回调
const orderTypeChange = (e) => {
  if (e !== '3') {
    order.value.orderTime = ''
  }
}
//校验数量
const checkServeCount = (_rule: any, value: any, callback: any) => {
  if (value && value % 0.5 !== 0) {
    return callback(new Error('输入值必须是0.5的整数倍'))
  }
  callback()
}

//校验服务包
const checkPaytypeId = (_rule: any, value: any, callback: any) => {
  // 选择的是服务包的情况下
  if (value === '1' && !order.value.serveTime) {
    return callback(new Error('请选择服务时间！'))
  }
  callback()
}

//校验下单时间
const checkOrderTime = (_rule: any, value: any, callback: any) => {
  // 下单时间和服务时间都有
  if (order.value.orderType === '3' && value && order.value.serveTime && new Date(value).getTime() >= new Date(order.value.serveTime).getTime()) {
    return callback(new Error('补录历史订单，下单时间应早于服务时间'))
  }
  callback()
}
const checkServeTime = async (_rule: any, value: any, callback: any) => {
  //order.orderType === '3' 补录历史订单
  if (value && order.value.orderType === '3') {
    // 返回时间戳
    const { data } = await getSystemTime()
    if (new Date(value).getTime() >= data) {
      return callback(new Error('补录历史订单，服务时间需早于当前时间'))
    }
  }

  // 有下单时间
  if (order.value.orderTime) {
    //下单时间大于等于服务时间
    if (value && order.value.orderType === '3' && new Date(order.value.orderTime).getTime() >= new Date(value).getTime()) {
      return callback(new Error('补录历史订单，服务时间不能早于下单时间'))
    }

    if (value && businessTimeRange.value.length) {
      const hourMinute = value.split(' ')[1]
      if (isTimeInRange(hourMinute, businessTimeRange.value[0], businessTimeRange.value[1])) {
        return callback()
      }
      return callback(new Error('服务时间需在营业时间范围内'))
    } else if (value && !businessTimeRange.value.length) {
      return callback()
    }
    return callback(new Error('请选择服务时间'))
  }

  // 无下单时间
  if (value && businessTimeRange.value.length) {
    const hourMinute = value.split(' ')[1]
    if (isTimeInRange(hourMinute, businessTimeRange.value[0], businessTimeRange.value[1])) {
      return callback()
    }
    return callback(new Error('服务时间需在营业时间范围内'))
  } else if (value && !businessTimeRange.value.length) {
    return callback()
  }
  callback(new Error('请选择服务时间'))
}
//校验服务工单号
const checkServeNo = (_rule: any, value: any, callback: any) => {
  const reg = /^[a-zA-Z0-9]{1,20}$/
  if (!value || reg.test(value)) {
    return callback()
  }
  callback(new Error('服务工单号必须是由数字字母组成'))
}

function isTimeInRange(time: string, start: string, end: string) {
  // 将时间字符串转换为分钟数
  const [hours, minutes] = time.split(':').map(Number)
  const timeInMinutes = hours * 60 + minutes

  const [startHours, startMinutes] = start.split(':').map(Number)
  const startInMinutes = startHours * 60 + startMinutes

  const [endHours, endMinutes] = end.split(':').map(Number)
  const endInMinutes = endHours * 60 + endMinutes

  // 判断是否在范围内
  return timeInMinutes >= startInMinutes && timeInMinutes <= endInMinutes
}

// 服务时间的回调
const serveTimeChange = (date) => {
  formRef.value.validateField('paytypeId')
  if (order.value.paytypeId === '1') {
    getServePacketList()
  }
  const dateStamp = new Date(date).getTime()
  order.value.shangmenTime = formatTime(dateStamp + 86400000, 'yyyy-MM-dd HH:mm')
  order.value.manyiduTime = formatTime(dateStamp + 86400000 * 2, 'yyyy-MM-dd HH:mm')
}

const rules = reactive<any>({
  phone: [
    {
      required: true,
      pattern: /^(1[3-9]\d{9}|0\d{2,3}-\d{7,8}|0\d{2,3}\d{7,8})$/,
      message: '请填写正确联系电话',
      trigger: 'blur'
    }
  ],
  categoryId: [{ required: true, message: '请选择服务项', trigger: 'change' }],
  orderNature: [{ required: true, message: '请选择订单性质', trigger: 'change' }],
  serveCount: [
    { required: true, message: '请填写购买数量', trigger: 'change' },
    { validator: checkServeCount, trigger: 'blur' }
  ],
  paytypeId: [
    { required: true, message: '请选择支付方式', trigger: 'change' },
    { validator: checkPaytypeId, trigger: 'change' }
  ],
  orderType: [{ required: true, message: '请选择订单类型', trigger: 'change' }],
  orderTime: [
    { required: true, message: '请选择下单时间', trigger: 'change' },
    { validator: checkOrderTime, trigger: 'change' }
  ],
  serveTime: [
    { required: true, message: '请选择服务时间', trigger: 'change' },
    { validator: checkServeTime, trigger: 'change' }
  ],
  serveNo: [{ validator: checkServeNo, trigger: 'blur' }],
  shangmenTime: [{ required: true, message: '请选择上门回访时间', trigger: 'change' }],
  manyiduTime: [{ required: true, message: '请选择满意度回访日期', trigger: 'change' }]
})

// 支付方式选择服务包时，显示服务包余额和月份
const balanceInfo = computed(() => {
  if (!order.value.payRemarkId)
    return {
      text: '',
      balance: 0
    }
  const obj = servePacketList.value.find((item) => Number(item.value) === Number(order.value.payRemarkId))
  if (!obj)
    return {
      text: '',
      balance: 0
    }
  return {
    text: `${obj.month || ''} ${obj.balance || 0}元`,
    balance: obj.balance || 0
  }
})

const historyOrderList = ref([])

const submit = async () => {
  await formRef.value.validate((valid) => {
    if (valid) {
      save()
    } else {
      ElMessage.error('请确认必填参数填写正确')
    }
  })
}

const save = async () => {
  saving.value = true
  try {
    await saveOrder({ ...order.value, source: '3', originalPrice: price.value })
    ElMessage.success('新增成功')
    onClear()
    getHistoryOrderList()
  } finally {
    saving.value = false
  }
}

async function getHistoryOrderList() {
  const result: any = await getOrderList({ memberId: props.customerId })
  historyOrderList.value = result.data
}

const customer = ref<any>({})
// 获取基础信息
async function getCustomerBaseInfo() {
  const res = await getCustomerBaseDetailById(props.customerId)
  if (res) {
    customer.value = res.data
  }
}

const linkmanList = ref<any>([])

async function getAddressList(selectedId = '') {
  const { data } = await getMemberAddressList({ memberid: props.customerId, selectedId })
  data.forEach((item) => {
    item.label = `${item.contactman} ${item.mobilephone} ${item.address} ${item.disabled ? '（已删除）' : ''}`
  })

  linkmanList.value = data
  if (data && data.length && !order.value.addressId) {
    order.value.addressId = data[0].id
  }
}

const orderAddressRef = ref()

const addAddress = () => {
  orderAddressRef.value.show()
}

const editAddress = (data) => {
  orderAddressRef.value.show(data)
}

const setDefaultButton = (form) => {
  ElMessageBox.confirm('确认设置为默认地址？')
    .then(() => {
      setDefault(form)
    })
    .catch(() => {})
}
// 设为默认
const setDefault = async (form) => {
  const res: any = await updateMemberAddress({
    ...form,
    acquiescent: true,
    addressList: [form.province, form.city, form.county, form.street, form.community]
  })
  if (res.code === 200) {
    ElMessage.success('设置成功')
    getAddressList()
  }
}

// 删除订单
async function delAddress(ids) {
  const res: any = await removeMemberAddress(ids)
  if (res.code === 200) {
    ElMessage.success('删除成功')
    getAddressList()
    if (order.value.addressId === ids) {
      order.value.addressId = linkmanList.value[0].id
    }
  }
}

// 服务类别
const typeList = ref<any>([])
const getTypeList = async () => {
  const res = await getServeTypeList()
  typeList.value = res.data.map((item) => {
    return {
      value: item.id,
      label: item.name
    }
  })
}

// 服务项目下拉数据
const serveList = ref<any>([])

const getServeList = async () => {
  if (!order.value.categoryId) return
  const res = await getServeInfoList({ categoryId: order.value.categoryId, isGround: '1' })
  serveList.value = res.data.map((item) => {
    return {
      value: item.id,
      label: item.name,
      minCountPrice: item.minCountPrice,
      minPrice: item.minPrice,
      centerPrice: item.centerPrice,
      memberPrice: item.price,
      maxCount: item.maxCount,
      minCount: item.minCount,
      businessStartTime: item.businessStartTime,
      businessEndTime: item.businessEndTime
    }
  })
}

// 服务子项下拉数据
const serveOptionList = ref<any>([])

const getServeOptionList = async () => {
  if (!order.value.serveId) return
  const { data } = await getOptionList({ serveId: order.value.serveId })
  serveOptionList.value = data.map((item) => {
    return {
      value: item.id,
      label: item.name,
      minCountPrice: item.minCountPrice,
      minPrice: item.minOptionPrice,
      centerPrice: item.price,
      memberPrice: item.price,
      maxCount: item.maxCount,
      minCount: item.minCount
    }
  })
  if (!data.length) {
    let i = serveList.value.find((item) => item.value === order.value.serveId)
    order.value.minCountPrice = i.minCountPrice
    order.value.minPrice = i.minPrice
    order.value.centerPrice = i.centerPrice
    order.value.memberPrice = i.memberPrice
    minCount.value = i.minCount
    maxCount.value = i.maxCount
    order.value.serveCount = i.minCount

    price.value = computedPrice() //计算现价
  }
}

// 服务包下拉数据
const servePacketList = ref<any>([])
const getServePacketList = async () => {
  const { data } = await servePacketCustomerList({
    customerId: order.value.memberId,
    // servePacketFinishStatusList: ['1', '2'],
    usingStatusList: ['1', '2'],
    month: formatTime(order.value.serveTime, 'yyyy-MM')
  })

  servePacketList.value = data.map((item) => {
    return {
      value: item.id,
      label: item.servePacketName,
      month: item.month,
      balance: item.balance
    }
  })
  if (!data.length) {
    ElMessage.error('暂无服务包可选，请选择其他支付方式')
    order.value.paytypeId = undefined
  }
}

// 支付方式改变的回调
const changePaytypeId = () => {
  if (order.value.paytypeId === '1' && order.value.serveTime) {
    getServePacketList()
  } else {
    servePacketList.value = []
    order.value.payRemarkId = undefined
  }
}

// 选择类别
const changeCategoryId = () => {
  order.value.serveId = undefined
  order.value.serveOptionId = undefined
  serveList.value = []
  serveOptionList.value = []
  minCount.value = 0
  maxCount.value = 0
  order.value.minPrice = undefined
  order.value.centerPrice = undefined
  order.value.memberPrice = undefined
  order.value.serveCount = undefined
  getServeList()
}

// 选择服务项
const changeServeId = (e) => {
  order.value.serveOptionId = undefined
  serveOptionList.value = []
  minCount.value = 0
  maxCount.value = 0
  order.value.minPrice = undefined
  order.value.centerPrice = undefined
  order.value.memberPrice = undefined
  order.value.serveCount = undefined
  //营业时间范围
  if (e) {
    let selectItem = serveList.value.find((item) => item.value === e)
    if (selectItem?.businessStartTime) {
      businessTimeRange.value = [selectItem.businessStartTime, selectItem.businessEndTime]
    }
  } else {
    businessTimeRange.value = []
  }

  formRef.value?.validateField('serveTime')
  getServeOptionList()
}

// 选择服务子项
const changeServeOptionId = () => {
  if (!order.value.serveOptionId) {
    minCount.value = 0
    maxCount.value = 0
    order.value.minPrice = undefined
    order.value.centerPrice = undefined
    order.value.memberPrice = undefined
    order.value.serveCount = undefined
    return
  }
  let i = serveOptionList.value.find((item) => item.value === order.value.serveOptionId)
  order.value.minCountPrice = i.minCountPrice
  order.value.minPrice = i.minPrice
  order.value.centerPrice = i.centerPrice
  order.value.memberPrice = i.memberPrice
  minCount.value = i.minCount
  maxCount.value = i.maxCount
  order.value.serveCount = i.minCount
  price.value = computedPrice() //计算现价
}

//计算价格
const computedPrice = () => {
  const minCountPriceNum = new Decimal(order.value.minCountPrice)
  const centerPriceNum = new Decimal(order.value.centerPrice)
  const serveCountNum = new Decimal(order.value.serveCount)
  const minPriceNum = new Decimal(order.value.minPrice)
  const memberPriceNum = new Decimal(order.value.memberPrice)
  const minCountNum = new Decimal(minCount.value)
  if (props.memberLevel === '1') {
    return minCountPriceNum.plus(centerPriceNum.times(serveCountNum.minus(minCountNum))).toNumber()
    // return +order.value.minCountPrice + +order.value.centerPrice * (+order.value.serveCount - +minCount.value)
  }
  return minPriceNum.plus(memberPriceNum.times(serveCountNum.minus(minCountNum))).toNumber()
  // return +order.value.minPrice + +order.value.memberPrice * (+order.value.serveCount - +minCount.value)
}
//购买数量变化的回调
const serveCountChange = () => {
  price.value = computedPrice()
}

// 手动修改现价的回调
const memberPriceChange = () => {
  orderPriceEditFlag.value = false
}

watch(
  () => [{ ...props }],
  () => {
    order.value.memberId = props.customerId
    getHistoryOrderList()
    // getAddressList()
  },
  { immediate: true }
)

onMounted(async () => {
  getCustomerBaseInfo()
  getTypeList()
  if (localStorage.getItem('orderData')) {
    order.value = JSON.parse(localStorage.getItem('orderData') as string)
    getAddressList(order.value.addressId)
    setTimeout(() => {
      localStorage.removeItem('orderData')
    }, 10)
    getServeList()
    getServeOptionList()
    if (order.value.serveOptionId) {
      setTimeout(() => {
        changeServeOptionId()
      }, 1000)
    }
    if (order.value.paytypeId === '1') {
      getServePacketList()
    }
  } else {
    getAddressList()
  }
  // 服务时间：默认当前时间； 上门回访时间：默认当前后一天； 满意度回访日期：默认当前后两天
  const { data } = await getSystemTime()
  order.value.serveTime = formatTime(data, 'yyyy-MM-dd HH:mm')

  order.value.shangmenTime = formatTime(data + 86400000, 'yyyy-MM-dd HH:mm')

  order.value.manyiduTime = formatTime(data + 86400000 * 2, 'yyyy-MM-dd HH:mm')
})
</script>

<style scoped lang="less">
.price-info {
  width: 100%;
  font-size: 12px;
  font-weight: 400;
  text-align: LEFT;
  color: #666462;
  line-height: 24px;
  padding-left: 110px;
  margin: -10px 0 5px;
}
.price-tip {
  color: #ff9500;
}
.tips {
  margin-left: 40px;
  color: #e96848;
  font-size: 14px;
}
.business-time-range-tip {
  // margin-left: 40px;
  color: #666462;
  font-size: 12px;
}
.button-box {
  margin: 20px 0;
  display: flex;
  align-items: center;
}
:deep(.el-form-item--default .el-form-item__label) {
  white-space: nowrap;
}
.default-tip {
  font-weight: normal;
  color: #ff9500;
}
.option-item {
  width: 100%;
}
.hover-box {
  &:hover {
    background-color: #f6f7fb;
  }
}
.hover-item {
  padding: 0 32px 0 20px;
}

:deep(.el-select-dropdown__item.is-hovering + .hover-item) {
  display: flex;
  background-color: #f6f7fb;
  height: 34px;
}
:deep(.el-popper.el-select__popper) {
  max-width: 100% !important;
}
.numberInput {
  width: 100%;
}
:deep(.el-input-number .el-input__inner) {
  text-align: left;
}
.order-type-tip {
  font-size: 14px;
  color: #999693;
  line-height: 32px;
}
.low-balance-tip {
  font-size: 14px;
  line-height: 32px;
}
:deep(.el-input__wrapper) {
  min-width: 150px !important;
}
:deep(.el-select__wrapper) {
  min-width: 150px !important;
}
</style>
