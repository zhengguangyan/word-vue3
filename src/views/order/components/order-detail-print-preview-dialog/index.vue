<template>
  <el-dialog v-model="visibleFlag" :title="'订单详情：' + orderInfo.memberName + '(' + isClosed + ')'" width="1400px" @close="onClose" :close-on-press-escape="false" :close-on-click-modal="false">
    <div class="detail-top-gray-info">
      <span class="mr-5">订单编号：{{ orderInfo.orderNo }}</span>
      <span class="mr-5" v-if="orderInfo.creatorName"> 创建：{{ orderInfo.creatorName }} {{ orderInfo.createTime }} </span>
      <span class="mr-5">来源：{{ renderDict(orderInfo.source, 'order_source') }}</span>
      <span class="mr-5" v-if="orderInfo.updaterName"> 最近更新：{{ orderInfo.updaterName }} {{ orderInfo.updateTime }} </span>
    </div>
    <h4 class="title" style="margin: 0 0 16px; font-weight: 600">联系人信息</h4>
    <div class="info-box">
      <div class="info-item info-item-100">
        <span class="item-label">下单会员</span>
        <span class="item-content">
          {{ orderInfo.memberName }}
        </span>
      </div>
      <div class="info-item info-item-100">
        <span class="item-label">默认联系人信息</span>
        <span class="item-content"> {{ orderInfo.memberName }} {{ orderInfo.mobilephone }} {{ orderInfo.address }} </span>
      </div>
    </div>
    <h4 class="title" style="margin-bottom: 20px; font-weight: 600">订单信息</h4>
    <div class="info-box">
      <div class="info-item">
        <span class="item-label">服务类别</span>
        <span class="item-content">
          {{ orderInfo.categoryName }}
        </span>
      </div>
      <div class="info-item">
        <span class="item-label">服务项目</span>
        <span class="item-content">
          {{ orderInfo.serveName }}
        </span>
      </div>
      <div class="info-item">
        <span class="item-label">服务子项</span>
        <span class="item-content">
          {{ orderInfo.serveOptionName }}
        </span>
      </div>
      <div class="info-item">
        <span class="item-label">单价</span>
        <span class="item-content">
          {{ orderInfo.centerPrice }}
        </span>
      </div>
      <div class="info-item">
        <span class="item-label">购买数量</span>
        <span class="item-content">
          {{ orderInfo.serveCount }}
        </span>
      </div>
      <div class="info-item">
        <span class="item-label">服务时间</span>
        <span class="item-content">
          {{ orderInfo.startOrderService }}
        </span>
      </div>
      <div class="info-item">
        <span class="item-label">服务商</span>
        <span class="item-content"> {{ orderInfo.seller }} </span>
      </div>
      <div class="info-item">
        <span class="item-label">服务商结算方式</span>
        <span class="item-content"> {{ renderDict(orderInfo.paymentType, 'checkout_mode') }} </span>
      </div>
      <div class="info-item">
        <span class="item-label">支付方式</span>
        <span class="item-content">
          {{ renderDict(orderInfo.paytypeId, 'order_pay_type') }}
        </span>
      </div>
      <div class="info-item">
        <span class="item-label">优惠信息</span>
        <span class="item-content"> {{ orderInfo.discount }} </span>
      </div>
      <div class="info-item">
        <span class="item-label">订单价格</span>
        <span class="item-content"> {{ orderInfo.money }} </span>
      </div>
      <div class="info-item">
        <span class="item-label">部分月结金额</span>
        <span class="item-content"> {{ orderInfo.partMoney }} </span>
      </div>
      <div class="info-item">
        <span class="item-label">最终确定金额</span>
        <span class="item-content">
          {{ orderInfo.finalPrice }}
        </span>
      </div>
      <div class="info-item">
        <span class="item-label">是否需要发票</span>
        <span class="item-content">
          {{ orderInfo.offerInvoice == '1' ? '是' : '否' }}
        </span>
      </div>
      <div class="info-item info-item-100">
        <span class="item-label">备注</span>
        <span class="item-content"> {{ orderInfo.remark }} </span>
      </div>
      <br />
      <br />
      <div class="info-item">
        <span class="item-label">上门回访时间</span>
        <span class="item-content"> {{ orderInfo.shangmenTime }} </span>
      </div>
      <div class="info-item info-item-66">
        <span class="item-label">上门回访坐席</span>
        <span class="item-content"> {{ orderInfo.shangmenUserName }} </span>
      </div>
      <div class="info-item">
        <span class="item-label">满意度回访时间</span>
        <span class="item-content"> {{ orderInfo.manyiduTime }} </span>
      </div>
      <div class="info-item info-item-66">
        <span class="item-label">满意度回访坐席</span>
        <span class="item-content"> {{ orderInfo.manyiduUserName }} </span>
      </div>
      <div class="info-item info-item-100">
        <span class="item-label">是否结案</span>
        <span class="item-content">
          {{ orderInfo.isClosed == '1' ? '是' : '否' }}
        </span>
      </div>
      <div class="info-item info-item-100" v-if="orderInfo.waiterPunctualArrive">
        <span class="item-label">客户回访评价</span>
        <span class="item-content">
          <el-rate v-model="orderInfo.punctualArrive" disabled show-score score-template="准时送达" />
          <el-rate v-model="orderInfo.satisfaction" disabled show-score score-template="满意度" />
          <el-rate v-model="orderInfo.serveAttitude" disabled show-score score-template="服务态度" />
          <el-rate v-model="orderInfo.serveQuality" disabled show-score score-template="服务质量" />
        </span>
      </div>
      <div class="info-item info-item-100" v-if="orderInfo.waiterPunctualArrive">
        <span class="item-label">客户在线评价</span>
        <span class="item-content">
          <el-rate v-model="orderInfo.waiterPunctualArrive" disabled show-score score-template="准时送达" />
          <el-rate v-model="orderInfo.waiterSatisfaction" disabled show-score score-template="满意度" />
          <el-rate v-model="orderInfo.waiterServeAttitude" disabled show-score score-template="服务态度" />
          <el-rate v-model="orderInfo.waiterServeQuality" disabled show-score score-template="服务质量" />
        </span>
      </div>
      <div class="info-item info-item-100">
        <span class="item-label">评价内容</span>
        <span class="item-content"> {{ orderInfo.content }} </span>
      </div>
    </div>

    <h4 class="title" style="margin-bottom: 20px; font-weight: 600">跟踪信息</h4>
    <el-table
      :data="servePacketRecordData"
      header-row-class-name="table-header"
      :style="{
        width: 'calc(100vw - 255px)',
        border: '1px solid #f5f3f0',
        borderRadius: '8px'
      }"
      max-height="200"
    >
      <el-table-column type="index" width="60" />
      <el-table-column show-overflow-tooltip prop="createTime" min-width="170" label="操作时间" />
      <el-table-column show-overflow-tooltip prop="callMode" min-width="100" label="方式">
        <template #default="{ row }">
          {{ row.callMode === '1' ? '呼入' : '呼出' }}
        </template>
      </el-table-column>
      <el-table-column prop="detailContent" min-width="200" label="详细内容" show-overflow-tooltip />
      <el-table-column show-overflow-tooltip prop="startTime" min-width="350" label="受理起止时间">
        <template #default="{ row }">
          <span v-if="row.startTime">{{ row.startTime + ' 至 ' + row.endTime }}</span>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip prop="talkMinute" min-width="170" label="通话时长（分钟）" />
      <el-table-column show-overflow-tooltip prop="userName" min-width="160" label="客服" />
    </el-table>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { getRecordPage } from '@/api/worksheet'

const visibleFlag = ref(false)
function onClose() {
  visibleFlag.value = false
}

const props = defineProps({
  dict: {
    type: Array,
    default: null
  }
})

const orderInfo = ref<any>({})
const isClosed = ref('未结案')
function show(data) {
  orderInfo.value = data
  isClosed.value = orderInfo.value.isClosed == '1' ? '已结案' : '未结案'
  getServePacketRecordList()
  visibleFlag.value = true
}

const filterDict = (key: any) => {
  return (props.dict.find((item: any) => item.type == key) as any)?.list
}

const renderDict = (key: any, dict: any) => {
  if (!key) {
    return
  }
  return filterDict(dict)
    ?.filter((item: any) => key == item.value)
    .map((item: any) => item?.label)
    .join('，')
}

const servePacketRecordData = ref([])
const getServePacketRecordList = async () => {
  const res = await getRecordPage({
    pageNum: 1,
    pageSize: 100,
    customerId: orderInfo.value.memberId,
    infoId: orderInfo.value.id
  })
  servePacketRecordData.value = res.data.list
}

defineExpose({
  show
})
</script>
<style scoped lang="less">
.tips {
  color: red;
  font-size: 12px;
  padding-left: 70px;
}
:deep(.el-dialog__body) {
  padding: 0 !important;
}
.base-info {
  background: #f5f3f0;
  border-radius: 4px;
  color: #666462;
  font-size: 14px;
  height: 40px;
}
.title {
  display: flex;

  align-items: center;
  position: relative;
  font-size: 16px;
}
.info-box {
  display: flex;
  flex-wrap: wrap;
}
.info-item {
  width: 33.33%;
  line-height: 23px;
  font-size: 14px;
  margin-bottom: 16px;
  display: flex;
  .item-label {
    text-align: left;
    color: var(--el-text-color-regular);
    margin-right: 10px;
    white-space: nowrap;
  }
  .item-content {
    width: calc(100% - 100px);
    word-wrap: break-word;
  }
}
.info-item-100 {
  width: 100% !important;
}
.info-item-66 {
  width: 66.66% !important;
}
:deep(.el-icon.el-rate__icon) {
  display: none;
}
:deep(.el-icon.el-rate__icon.is-active) {
  display: inline-block;
}
:deep(.el-rate) {
  width: 216px;
  height: auto !important;
}
:deep(.el-rate__text) {
  margin-right: 10px;
  order: -1;
}
</style>
