<template>
  <el-page-header title="" @back="onBack">
    <template #content>
      <div class="title-name">
        客户服务包详情：{{ detail.customerName }} - {{ detail.servePacketName }} (<span :class="usingStatusObj[detail.usingStatus]">{{
          renderDict(detail.usingStatus, 'serve_packet_using_status')
        }}</span
        >)
      </div>
    </template>
    <template #extra>
      <el-button @click="handleAdd">新增服务</el-button>
    </template>
  </el-page-header>
  <el-divider style="margin: 11px 0 20px" />
  <div class="detail-top-gray-info">
    <span class="mr-5">编号：{{ detail.id }}</span>
    <span class="mr-5" v-if="detail.creatorName"> 创建：{{ detail.creatorName }} {{ detail.createTime }} </span>
    <span class="mr-5" v-if="detail.updaterName"> 最近更新：{{ detail.updaterName }} {{ detail.updateTime }} </span>
  </div>
  <el-scrollbar class="subsidy-add-out">
    <el-scrollbar class="subsidy-add-main">
      <h4 class="title">客户信息</h4>
      <div class="info-list">
        <div class="detail-info-item item-33">
          <span class="detail-info-item-label">客户信息</span>
          <span class="detail-info-item-content">
            {{ detail.customerName }}
            ({{ renderDict(detail.sex, 'vols_sex') }})
            <el-button link type="primary" @click="customerDetail"> 查看 </el-button>
          </span>
        </div>
        <div class="detail-info-item item-33">
          <span class="detail-info-item-label">年龄</span>
          <span class="detail-info-item-content">{{ detail.age }}</span>
        </div>
        <div class="detail-info-item item-33">
          <span class="detail-info-item-label">联系电话</span>
          <span class="detail-info-item-content">
            {{ detail.mobilephone }}
          </span>
        </div>
        <div class="detail-info-item item-33">
          <span class="detail-info-item-label">证件号码</span>
          <span class="detail-info-item-content">{{ detail.idcard }}</span>
        </div>
        <div class="detail-info-item item-33">
          <span class="detail-info-item-label">当月余额</span>
          <span class="detail-info-item-content">
            {{ detail.balance || 0 }}
          </span>
        </div>
        <!-- <div class="detail-info-item item-33">
          <span class="detail-info-item-label">次月余额(预估)</span>
          <span class="detail-info-item-content"> {{ detail.rechargeMoney }} </span>
        </div> -->
      </div>

      <h4 class="title">服务包信息</h4>
      <div class="info-list">
        <div class="detail-info-item item-33">
          <span class="detail-info-item-label">服务包名称</span>
          <span class="detail-info-item-content">
            <span class="mr-10px">{{ detail.servePacketName }}</span>
            <span :class="usingStatusObj[detail.usingStatus]">{{ renderDict(detail.usingStatus, 'serve_packet_using_status') }}</span>
          </span>
        </div>
        <div class="detail-info-item item-33">
          <span class="detail-info-item-label">所属项目</span>
          <span class="detail-info-item-content">
            {{ detail.areaName }}
          </span>
        </div>
        <div class="detail-info-item item-33">
          <span class="detail-info-item-label">合同起止日期</span>
          <span class="detail-info-item-content">
            {{ detail.startDate + ' - ' + detail.endDate }}
          </span>
        </div>
        <div class="detail-info-item item-33">
          <span class="detail-info-item-label">业务负责人</span>
          <span class="detail-info-item-content">
            {{ detail.manager }}
          </span>
        </div>
      </div>

      <h4 class="title">服务信息</h4>
      <div class="info-list">
        <div class="detail-info-item item-100">
          <span class="detail-info-item-label">服务描述</span>
          <span class="detail-info-item-content">
            {{ detail.serveDesc }}
          </span>
        </div>
        <div class="detail-info-item item-33">
          <span class="detail-info-item-label">自动扣费规则</span>
          <span class="detail-info-item-content"> 无 </span>
        </div>
        <div class="detail-info-item item-33">
          <span class="detail-info-item-label">系统充值方式</span>
          <span class="detail-info-item-content">
            {{ renderDict(detail.rechargeMode, 'serve_packet_recharge_mode') }}
            每人充值 {{ detail.rechargeMoney || 0 }} 元
          </span>
        </div>
        <!-- <div class="detail-info-item item-33">
          <span class="detail-info-item-label">每人充值</span>
          <span class="detail-info-item-content"> {{ detail.rechargeMoney }}元 </span>
        </div> -->
        <div class="detail-info-item item-33">
          <span class="detail-info-item-label">余额计算周期</span>
          <span class="detail-info-item-content">
            {{ renderDict(detail.balanceMode, 'serve_packet_reset_type') }}
          </span>
        </div>
        <div class="detail-info-item item-33">
          <span class="detail-info-item-label">客户过世方式</span>
          <span class="detail-info-item-content"> {{ renderDict(detail.stopType, 'subsidy_stop_type') }} </span>
        </div>
      </div>

      <h4 class="title">历史余额情况</h4>
      <el-table
        :data="accountList"
        header-row-class-name="table-header"
        :style="{
          width: 'calc(100vw - 340px)',
          border: '1px solid #f5f3f0',
          borderRadius: '8px',
          marginBottom: '40px'
        }"
        max-height="200"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="index" width="40" />
        <el-table-column show-overflow-tooltip prop="month" min-width="170" label="时间" />
        <el-table-column show-overflow-tooltip prop="rechargeMoney" min-width="160" label="充值" />
        <el-table-column show-overflow-tooltip prop="lastMonthMoney" min-width="160" label="本月可用上月余额" />
        <el-table-column show-overflow-tooltip prop="consumeMoney" min-width="160" label="消费" />
        <el-table-column show-overflow-tooltip prop="backMoney" min-width="160" label="返款" />
        <el-table-column show-overflow-tooltip prop="balance" min-width="160" label="余额" />
      </el-table>

      <h4 class="title">服务包客户历史记录</h4>
      <el-table
        :data="servePacketRecordData"
        header-row-class-name="table-header"
        :style="{
          width: 'calc(100vw - 340px)',
          border: '1px solid #f5f3f0',
          borderRadius: '4px',
          marginBottom: '40px'
        }"
        max-height="200"
      >
        <el-table-column type="index" width="60" />
        <el-table-column label="操作" width="100">
          <template #default="{ row }">
            <!-- v-if="row.act === '添加客户' || row.act === '移除客户'" -->
            <el-button v-if="row.orderId" link type="primary" size="small" @click="showServePacketRecordDetail(row.orderId)"> 查看 </el-button>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="createTime" min-width="170" label="时间" />
        <el-table-column show-overflow-tooltip prop="creatorName" min-width="160" label="人员" />
        <el-table-column show-overflow-tooltip prop="act" min-width="160" label="操作" />
        <el-table-column show-overflow-tooltip prop="addMoney" min-width="160" label="余额" />
        <el-table-column show-overflow-tooltip prop="month" min-width="160" label="账单月份" />
        <el-table-column prop="remark" label="备注" min-width="160" show-overflow-tooltip />
      </el-table>
    </el-scrollbar>
  </el-scrollbar>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { servePacketCustomerDetail, serveServePacketAccountList } from '@/api/servePacket'
import { servePacketRecordList } from '@/api/servePacket'
import { renderDict } from '@/hooks/web/useDict'
// @ts-ignore
// defineOptions({
//   // eslint-disable-next-line vue/component-definition-name-casing
//   name: 'ServePacketCustomerDetail'
// })
const usingStatusObj = ref({
  1: 'unused',
  2: 'using',
  3: 'stop-using'
})
const { back, push } = useRouter()

const route = useRoute()

function onBack() {
  back()
}

function customerDetail() {
  push(`/customer/detail?id=${detail.value.customerId}&customerUpdate=true`)
}

// const multipleDict = (key: any, dict: any) => {
//   if (!key.length && !key) {
//     return
//   }
//   return filterDict(dict)
//     ?.filter((item: any) => key.includes(item.value))
//     .map((item: any) => item?.label)
//     .join('，')
// }

const multipleSelection = ref<any>([])
const handleSelectionChange = (val: any) => {
  multipleSelection.value = val
}

const detail = ref<any>({})
const getDetail = async () => {
  const res = await servePacketCustomerDetail(route.query.id)
  detail.value = res.data
  getAccountList()
  getServePacketRecordList()
}

// 历史余额情况
const accountList = ref([])
const getAccountList = async () => {
  const { data } = await serveServePacketAccountList({
    customerId: detail.value.customerId,
    servePacketId: detail.value.servePacketId
  })
  accountList.value = data
}

// 服务包客户历史记录
const servePacketRecordData = ref<any>([])

const showServePacketRecordDetail = async (orderId) => {
  push(`/order/orderDetail?id=${orderId}`)
}

const handleAdd = () => {
  push(`/service/add?serviceType=order&phone=${detail.value.mobilephone}&id=${detail.value.customerId}`)
}

const getServePacketRecordList = async () => {
  const res = await servePacketRecordList({
    customerId: detail.value.customerId,
    servePacketId: detail.value.servePacketId,
    type: 'customer'
  })
  servePacketRecordData.value = res.data
}
onMounted(() => {
  getDetail()
})
</script>
<style scoped lang="less">
.inline-form-item {
  display: inline-flex;
  vertical-align: middle;
  margin-right: 32px;
}
.title {
  display: flex;
  align-items: center;
  position: relative;
  margin-bottom: 16px;
  font-weight: bold;
}
.title-name {
  font-weight: 700;
}
.title .customer-edit {
  position: absolute;
  right: 0;
}

.using {
  color: #5cd7a8;
}
.unused {
  color: #ff9e4d;
}
.stop-using {
  color: #999693;
}

.numberInput {
  width: 100%;
}
.tips {
  margin: 10px 0;
  font-size: 12px;
  color: #999;
}
.tips p {
  margin: 3px 0;
}
.button-box {
  margin-top: 10px;
}
:deep(.el-input-number .el-input__inner) {
  text-align: left;
}
:deep(.el-checkbox:last-of-type) {
  margin-right: 30px;
}
.subsidy-add-out {
  width: calc(100vw - 300px);
  padding: 0 15px 15px 0;
}
.subsidy-add-main {
  height: calc(100vh - 250px); /* 设置容器的高度 */
  min-width: 950px; /* 设置容器的高度 */
  overflow: auto; /* 当内容超出容器高度时显示滚动条 */
}
.ruleSpan {
  margin-right: 10px;
}
.info-box {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 24px;
}
.info-item {
  width: 33.33%;
  line-height: 23px;
  font-size: 14px;
  margin-bottom: 16px;
  display: flex;
  .item-label {
    text-align: left;
    // color: var(--el-text-color-regular);
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
.customer-title {
  color: #666462;
  font-size: 14px;
  font-weight: 400;
}
</style>
