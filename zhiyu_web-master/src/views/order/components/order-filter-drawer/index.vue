<template>
  <div
    class="filter-box"
    :class="{
      'show-filter': !visibleFlag,
      'all-filter': activeIndex == '2' || activeIndex == '3'
    }"
  >
    <div class="customer-filter">
      <div class="filter-row" style="width: 50%">
        <span class="row-head">联系人所在区域</span>
        <Cascader class="" :check="true" placeholder="请选择联系人所在区域" v-model="form.contactAddressList" style="width: 100%" />
      </div>
      <div class="filter-row" style="width: 25%">
        <span class="row-head">联系人所在小区</span>
        <el-input style="width: 100%" v-model="form.village" placeholder="联系人所在小区" />
      </div>
      <div class="filter-row" style="width: 25%"></div>
      <div class="filter-row">
        <span>订单来源</span>
        <DictSelect width="100%" v-model="form.source" :distList="filterDict('order_source')" placeholder="订单来源" :clearable="true" />
      </div>
      <div class="filter-row">
        <span>订单状态</span>
        <DictSelect width="100%" v-model="form.statusCode" :distList="filterDict('order_status')" placeholder="订单状态" :clearable="true" />
      </div>
      <div class="filter-row">
        <span>是否结案</span>
        <DictSelect width="100%" v-model="form.isClosed" :distList="filterDict('yes_no')" placeholder="是否结案" :clearable="true" />
      </div>
      <div class="filter-row">
        <span>服务类别</span>
        <DictSelect width="100%" v-model="form.categoryId" :distList="typeList" placeholder="服务类别" :clearable="true" @change="changeCategoryId" />
      </div>
      <div class="filter-row">
        <span>服务项目</span>
        <DictSelect width="100%" v-model="form.serveId" :distList="serveList" placeholder="服务项目" :clearable="true" :disabled="!serveList.length" @change="changeServeId" />
      </div>
      <div class="filter-row">
        <span>服务子项</span>
        <DictSelect width="100%" v-model="form.serveOptionId" :distList="serveOptionList" placeholder="服务子项" :clearable="true" :disabled="!serveOptionList.length" />
      </div>
      <div class="filter-row">
        <span>支付方式</span>
        <DictSelect width="100%" v-model="form.paytypeId" :distList="filterDict('order_pay_type')" placeholder="支付方式" :clearable="true" />
      </div>
      <div class="filter-row">
        <span>创建时间</span>
        <el-date-picker v-model="form.createTime" type="daterange" range-separator="-" start-placeholder="创建时间开始" end-placeholder="创建时间结束" value-format="YYYY-MM-DD" clearable />
      </div>
      <div class="filter-row">
        <span>订单类型</span>
        <DictSelect width="100%" v-model="form.orderType" :distList="filterDict('order_replacement')" placeholder="订单类型" :clearable="true" />
      </div>
      <div class="filter-row">
        <span>派单方式</span>
        <DictSelect width="100%" v-model="form.dispatchType" :distList="filterDict('dispatchType')" placeholder="派单方式" :clearable="true" />
      </div>
      <div class="filter-row">
        <span>服务商</span>
        <DictSelect width="100%" v-model="form.sellerId" :distList="sellerList" placeholder="服务商(多选)" :multiple="true" :tags="1" :clearable="true" />
      </div>
      <div class="filter-row">
        <span>下单时间</span>
        <el-date-picker v-model="form.orderTime" type="daterange" range-separator="-" start-placeholder="下单时间开始" end-placeholder="下单时间结束" value-format="YYYY-MM-DD" clearable />
      </div>
      <div class="filter-row">
        <span>服务时间</span>
        <el-date-picker v-model="form.serveTime" type="daterange" range-separator="-" start-placeholder="服务时间开始" end-placeholder="服务时间结束" value-format="YYYY-MM-DD" clearable />
      </div>
      <div class="filter-row">
        <span>服务人员性质</span>
        <DictSelect width="100%" v-model="form.operatorNature" :distList="filterDict('operatorNature')" placeholder="服务人员性质" :clearable="true" />
      </div>
      <div class="filter-row">
        <span>支付备注</span>
        <DictSelect width="100%" v-model="form.payRemark" :distList="packetList" placeholder="支付备注(多选)" :multiple="true" :tags="1" :clearable="true" />
      </div>
      <div class="filter-row">
        <span>是否为替代单</span>
        <DictSelect width="100%" v-model="form.replaceOrder" :distList="filterDict('yes_no')" placeholder="是否为替代单" :clearable="true" />
      </div>
      <div class="filter-row">
        <span>是否为售后单</span>
        <DictSelect width="100%" v-model="form.afterSaleOrder" :distList="filterDict('yes_no')" placeholder="是否为售后单" :clearable="true" />
      </div>
      <div class="filter-row">
        <span>超出下单金额支付方式</span>
        <DictSelect width="100%" v-model="form.onlinePay" :distList="filterDict('online_pay')" placeholder="超出下单金额支付方式" :clearable="true" />
      </div>
      <div class="filter-row">
        <span>政府补助标准</span>
        <DictSelect width="100%" v-model="form.subsidyStandard" :distList="filterDict('subsidy_standard')" placeholder="政府补助标准(多选)" :multiple="true" :tags="1" :clearable="true" />
      </div>
      <!-- <div class="filter-row">
        <span>推送状态</span>
        <DictSelect
          width="100%"
          v-model="form.pushStatus"
          :distList="[]"
          placeholder="推送状态"
          :clearable="true"
        />
      </div> -->
      <div class="filter-row">
        <span>创建人</span>
        <el-input v-model="form.creatorName" placeholder="创建人" />
      </div>
      <div class="filter-row">
        <span>是否为市场化平台</span>
        <DictSelect width="100%" v-model="form.ifMarket" :distList="filterDict('yes_no')" placeholder="是否为市场化平台" :clearable="true" />
      </div>
      <div class="filter-row">
        <span>其他费用</span>
        <DictSelect width="100%" v-model="form.otherType" :distList="filterDict('other_type')" placeholder="其他费用" :clearable="true" />
      </div>
      <!-- <div class="filter-row">
        <span>是否有抽成</span>
        <DictSelect
          width="100%"
          v-model="form.isPercent"
          :distList="filterDict('yes_no')"
          placeholder="是否有抽成"
          :clearable="true"
        />
      </div> -->

      <el-space style="width: 100%" :size="12">
        <el-button type="primary" @click="onSubmit">查询</el-button>
        <el-button @click="reset">重置</el-button>
        <el-button @click="closeFlag">收起</el-button>
      </el-space>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import DictSelect from '/@/components/DictSelect/index.vue'
import Cascader from '/@/components/Cascader/index.vue'
import { getServeTypeList } from '@/api/serviceProvider'
import { onMounted } from 'vue'
import { getServeInfoList, getOptionList } from '@/api/serviceProject'
import { getProviderList } from '@/api/serviceProvider'
import { servePacketList } from '@/api/servePacket'

const props = defineProps({
  dict: {
    type: Array,
    default: null
  },
  activeIndex: {
    type: String,
    default: '1'
  }
})

const emits = defineEmits(['reload-list', 'change-accurate', 'reset-list'])

const filterDict = (key: any) => {
  return (props.dict.find((item: any) => item.type == key) as any)?.list
}

const visibleFlag = ref(false)

function show() {
  visibleFlag.value = !visibleFlag.value
}

const form = ref<any>({
  secondServiceClass: undefined,
  sex: null,
  appAcount: null,
  pageNum: 1,
  pageSize: 20
})

function onSubmit() {
  // visibleFlag.value = false
  if (form.value.createTime) {
    form.value.createBeginTime = form.value.createTime[0]
    form.value.createEndTime = form.value.createTime[1]
  } else {
    form.value.createBeginTime = undefined
    form.value.createEndTime = undefined
  }
  if (form.value.orderTime) {
    form.value.orderBeginTime = form.value.orderTime[0]
    form.value.orderEndTime = form.value.orderTime[1]
  } else {
    form.value.orderBeginTime = undefined
    form.value.orderEndTime = undefined
  }
  if (form.value.serveTime) {
    form.value.serveBeginTime = form.value.serveTime[0]
    form.value.serveEndTime = form.value.serveTime[1]
  } else {
    form.value.serveBeginTime = undefined
    form.value.serveEndTime = undefined
  }

  emits('reload-list', form.value)
}

const reset = () => {
  form.value = {}
  emits('reset-list')
}

const resetValue = () => {
  form.value = {}
  // visibleFlag.value = false
}

const closeFlag = () => {
  visibleFlag.value = false
  emits('change-accurate')
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
  if (!form.value.categoryId) return
  const res = await getServeInfoList({ categoryId: form.value.categoryId })
  serveList.value = res.data.map((item) => {
    return {
      value: item.id,
      label: item.name
    }
  })
}

// 服务子项下拉数据
const serveOptionList = ref<any>([])

const getServeOptionList = async () => {
  if (!form.value.serveId) return
  const res = await getOptionList({ serveId: form.value.serveId })
  serveOptionList.value = res.data.map((item) => {
    return {
      value: item.id,
      label: item.name
    }
  })
}

// 服务商下拉数据
const sellerList = ref<any>([])

const getSellerList = async () => {
  const res = await getProviderList()
  sellerList.value = res.data.map((item) => {
    return {
      value: item.id,
      label: item.name
    }
  })
  sellerList.value.push({
    value: 'other',
    label: '其他'
  })
}

// 支付备注（服务包）下拉数据
const packetList = ref<any>([])

const getPacketList = async () => {
  const res = await servePacketList()
  packetList.value = res.data.map((item) => {
    return {
      value: item.id,
      label: item.name
    }
  })
}

const changeCategoryId = () => {
  form.value.serveId = undefined
  form.value.serveOptionId = undefined
  serveList.value = []
  serveOptionList.value = []
  getServeList()
}

const changeServeId = () => {
  form.value.serveOptionId = undefined
  serveOptionList.value = []
  getServeOptionList()
}

onMounted(() => {
  getTypeList()
  getSellerList()
  getPacketList()
})

const setStatus = (data) => {
  form.value.statusCode = data
}

defineExpose({
  show,
  resetValue,
  setStatus
})
</script>
<style scoped lang="less">
.filter-box {
  height: 410px;
  overflow: hidden;
  transition: height 0.5s ease-in-out;
}
.all-filter {
  height: 1150px;
}
.show-filter {
  height: 0;
}
:deep(.el-form-item--default) {
  margin-bottom: 16px;
}
:deep(.el-divider--horizontal) {
  margin: 16px 0;
}

:deep(.el-input__wrapper) {
  min-width: auto !important;
}

.filter-foot {
  background-color: #fff;
  width: 100%;
  position: fixed;
  bottom: 0;
  padding: 15px 0;
}

:deep(.el-radio-group) {
  flex-wrap: nowrap;
}
:deep(.el-divider--horizontal) {
  margin-top: 0;
}
</style>
