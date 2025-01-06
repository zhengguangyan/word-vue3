<template>
  <el-page-header @back="onBack" class="common-page-header">
    <template #content>
      <div class="title-name">
        服务包详情：{{ servePacketInfo.name }} ({{ renderDict(servePacketInfo.usingStatus, 'serve_packet_using_status') }}
        |
        <span :class="servePacketInfo.finishStatus === '3' ? 'color-close' : 'color-unclose'">{{ renderDict(servePacketInfo.finishStatus, 'serve_packet_finish_status') }}</span
        >)
      </div>
    </template>
  </el-page-header>
  <el-scrollbar height="calc(100vh - 205px)">
    <div class="detail-top-gray-info">
      <span class="mr-5">服务包ID：{{ servePacketInfo.id }}</span>
      <span class="mr-5" v-if="servePacketInfo.creatorName"> 创建：{{ servePacketInfo.creatorName }} {{ servePacketInfo.createTime }} </span>
      <span class="mr-5" v-if="servePacketInfo.updaterName"> 最近更新：{{ servePacketInfo.updaterName }} {{ servePacketInfo.updateTime }} </span>
    </div>
    <h4 class="title" style="margin: 0 0 16px; font-weight: 600">基础信息</h4>
    <div class="info-box">
      <div class="info-item">
        <span class="item-label">服务包名称</span>
        <span class="item-content">{{ servePacketInfo.name }}</span>
      </div>
      <div class="info-item">
        <span class="item-label">排序码</span>
        <span class="item-content">{{ servePacketInfo.sortKey }}</span>
      </div>
      <div class="info-item">
        <span class="item-label">所属项目</span>
        <span class="item-content">
          {{ servePacketInfo.areaName }}
        </span>
      </div>
      <div class="info-item">
        <span class="item-label">所属合同</span>
        <span class="item-content"> 所属合同 </span>
      </div>
      <div class="info-item">
        <span class="item-label">合同起止时间</span>
        <span class="item-content">
          {{ servePacketInfo.startDate + ' - ' + servePacketInfo.endDate }}
        </span>
      </div>
      <div class="info-item">
        <span class="item-label">业务负责人</span>
        <span class="item-content">
          {{ servePacketInfo.manager }}
        </span>
      </div>
      <div class="info-item info-item-100">
        <span class="item-label">服务包简介</span>
        <span class="item-content">{{ servePacketInfo.brief }}</span>
      </div>
      <div class="info-item info-item-100">
        <span class="item-label">备注</span>
        <span class="item-content">{{ servePacketInfo.remark }}</span>
      </div>
      <div class="info-item">
        <span class="item-label">是否暂停使用</span>
        <span class="item-content">
          {{ renderDict(servePacketInfo.usingStatus, 'serve_packet_using_status') }}
        </span>
      </div>
      <div class="info-item">
        <span class="item-label">结案状态</span>
        <span class="item-content">
          {{ renderDict(servePacketInfo.finishStatus, 'serve_packet_finish_status') }}
        </span>
      </div>
    </div>

    <h4 class="title" style="margin-bottom: 20px; font-weight: 600">服务信息</h4>
    <div class="info-box">
      <div class="info-item info-item-100">
        <span class="item-label">服务描述</span>
        <span class="item-content">
          {{ servePacketInfo.serveDesc }}
        </span>
      </div>
      <div class="info-item">
        <span class="item-label">自动扣费规则</span>
        <span class="item-content"> 无 </span>
      </div>
      <div class="info-item">
        <span class="item-label">系统充值方式</span>
        <span class="item-content">
          {{ renderDict(servePacketInfo.rechargeMode, 'serve_packet_recharge_mode') }}
          每人充值 {{ servePacketInfo.rechargeMoney || 0 }} 元
        </span>
      </div>
      <!-- <div class="info-item">
        <span class="item-label">每人充值</span>
        <span class="item-content"> {{ servePacketInfo.rechargeMoney }}元 </span>
      </div> -->
      <div class="info-item">
        <span class="item-label">余额计算周期</span>
        <span class="item-content">
          {{ renderDict(servePacketInfo.balanceMode, 'serve_packet_reset_type') }}
        </span>
      </div>
      <div class="info-item">
        <span class="item-label">客户过世方式</span>
        <span class="item-content">
          {{ renderDict(servePacketInfo.stopType, 'subsidy_stop_type') }}
        </span>
      </div>
    </div>

    <h4 class="title" style="margin-bottom: 20px; font-weight: 600">
      客户信息
      <span class="customer-title"
        >（共{{ servePacketInfo.customerList.length || 0 }}人， 使用中{{ userListNumber('2') || 0 }}人， 未使用{{ userListNumber('1') || 0 }}人， 停止使用{{ userListNumber('3') || 0 }}人）</span
      >
    </h4>

    <el-space wrap :size="12" style="margin-bottom: 10px">
      <!-- 3:结案，结案状态不显示按钮 1:未结案 状态禁用 -->
      <el-button type="primary" v-if="servePacketInfo.finishStatus !== '3'" :disabled="servePacketInfo.usingStatus === '3' && servePacketInfo.finishStatus !== '3'" @click="openTopUp">
        批量充值
      </el-button>
      <DictSelect width="100%" v-model="queryForm.usingStatus" :distList="filterDict('serve_packet_using_status')" placeholder="请选择状态" />
      <el-input v-model="queryForm.keyword" placeholder="精确搜索姓名/证件号/联系电话/ID" style="width: 350px">
        <template #suffix>
          <el-icon><search /></el-icon>
        </template>
      </el-input>
    </el-space>
    <el-table
      :data="userList"
      header-row-class-name="table-header"
      :style="{
        width: '98%',
        border: '1px solid #f5f3f0',
        borderRadius: '8px'
      }"
      class="table-without-border"
      max-height="200"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="40" v-if="servePacketInfo.finishStatus !== '3'" />
      <el-table-column type="index" label="序号" width="60" />
      <el-table-column label="操作" width="100">
        <template #default="{ row }">
          <el-button link type="primary" size="small" @click="customerDetail(row.id)"> 查看 </el-button>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip prop="usingStatus" min-width="170" label="状态">
        <template #default="{ row }">
          <span class="not-bound" v-if="row.usingStatus === '1'">未使用</span>
          <span class="bound" v-else-if="row.usingStatus === '2'">使用中</span>
          <span class="void" v-else-if="row.usingStatus === '3'">停止使用</span>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip prop="customerName" min-width="160" label="姓名" />
      <el-table-column show-overflow-tooltip prop="sex" min-width="160" label="性别">
        <template #default="{ row }">
          {{ renderDict(row.sex, 'vols_sex') }}
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip prop="mobilephone" min-width="160" label="电话" />
      <el-table-column show-overflow-tooltip prop="idcard" min-width="160" label="证件号码" />
      <el-table-column show-overflow-tooltip prop="deathFlag" min-width="160" label="是否健在">
        <template #default="{ row }">
          {{ renderDict(row.deathFlag, 'yes_no') }}
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip prop="rechargeMoney" min-width="160" label="当月余额">
        <template #default="{ row }">
          {{ row.rechargeMoney || 0 }}
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip prop="lastMonthMoney" min-width="160" label="次月余额(预估)">
        <template #default="{ row }">
          {{ row.lastMonthMoney || 0 }}
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip prop="remark" min-width="200" label="备注" />
    </el-table>
    <div class="tips">
      <p>注意：</p>
      <p>
        1.补贴信息保存成功，<span class="tip">合同起止日期内</span>，累统将按选择的充值/清零方式，<span class="tip">在次月/次季度1号00:00/固定日期</span>充值至客户补贴账户中，<span class="tip"
          >并将上月/上季度/上年度余额清零</span
        >
      </p>
      <p>2. 过世、暂停使用的客户，不支持系统自动充值</p>
      <p> 3. 修改客户为过世状态（注意不是指过世时间，是指将是否健在修改为否的时间），该客户服务包立即停止使用 </p>
      <p>4. 合同到期当月，余额可继续使用，次月起不支持使用</p>
    </div>

    <h4 class="title" style="margin-bottom: 20px; font-weight: 600">服务包历史记录</h4>
    <el-table
      :data="servePacketRecordData"
      header-row-class-name="table-header"
      :style="{
        width: '98%',
        border: '1px solid #f5f3f0',
        borderRadius: '8px'
      }"
      class="table-without-border"
      max-height="200"
    >
      <el-table-column type="index" label="序号" width="60" />
      <el-table-column label="操作" width="100">
        <template #default="{ row }">
          <el-button link type="primary" size="small" @click="showServePacketRecordDetail(row.id, row.remark)" v-if="row.act === '添加客户' || row.act === '移除客户'"> 查看 </el-button>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip prop="createTime" min-width="160" label="时间" />
      <el-table-column show-overflow-tooltip prop="creatorName" min-width="160" label="人员" />
      <el-table-column show-overflow-tooltip prop="act" min-width="100" label="操作" />
      <el-table-column show-overflow-tooltip prop="remark" label="备注" min-width="250" />
    </el-table>
  </el-scrollbar>
  <ServePacketRecordDetailDialog ref="servePacketRecordDetailDialog" />
  <BatchTopUpDialog ref="BatchTopUpRef" @reload-list="reload" />
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter, useRoute } from 'vue-router'
import { servePacketDetail, servePacketRecordList } from '@/api/servePacket'
import ServePacketRecordDetailDialog from './components/serve-packet-record-detail-dialog/index.vue'
import { Search } from '@element-plus/icons-vue'
import DictSelect from '@/components/DictSelect/index.vue'
import { computed } from 'vue'
import BatchTopUpDialog from './components/batch-top-up-dialog/index.vue'
import { filterDict, renderDict } from '@/hooks/web/useDict'
// @ts-ignore
defineOptions({
  // eslint-disable-next-line vue/component-definition-name-casing
  name: 'ServePacketDetail'
})

const { back, push } = useRouter()

const route = useRoute()

function onBack() {
  back()
}

const customerDetail = (id) => {
  push(`/order/servePacketCustomerDetail?id=${id}`)
}

const servePacketRecordDetailDialog = ref()
const showServePacketRecordDetail = (id, subTitle) => {
  servePacketRecordDetailDialog.value.show(id, subTitle)
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

const queryForm = ref({
  keyword: undefined,
  usingStatus: undefined
})

const userListNumber = (type) => {
  return servePacketInfo.value.customerList.filter((item) => item.usingStatus === type).length
}

const userList = computed(() => {
  if (queryForm.value.usingStatus) {
    return servePacketInfo.value.customerList.filter((item) => item.usingStatus === queryForm.value.usingStatus)
  }
  if (queryForm.value.keyword) {
    return servePacketInfo.value.customerList.filter(
      (item) => item.customerName === queryForm.value.keyword || item.mobilephone === queryForm.value.keyword || item.idcard === queryForm.value.keyword || item.customerId === queryForm.value.keyword
    )
  }
  return servePacketInfo.value.customerList
})

const multipleSelection = ref<any>([])
const handleSelectionChange = (val: any) => {
  multipleSelection.value = val
}
// 批量充值
const BatchTopUpRef = ref()

const openTopUp = () => {
  if (!multipleSelection.value.length) {
    return ElMessage.error('请至少选择一位用户')
  }
  const isStop = multipleSelection.value.filter((item) => item.usingStatus === '3')
  if (isStop.length) {
    ElMessage.error('所选客户存在状态为停止使用,不支持充值')
    return
  }
  BatchTopUpRef.value.show(multipleSelection.value, route.query.id)
}

const servePacketInfo = ref<any>({ customerList: [] })
const getDetail = async () => {
  const res = await servePacketDetail(route.query.id)
  servePacketInfo.value = res.data
}

const servePacketRecordData = ref([])
const getServePacketRecordList = async () => {
  const res = await servePacketRecordList({
    servePacketId: route.query.id,
    type: 'servePacket'
  })
  servePacketRecordData.value = res.data
}

const reload = () => {
  getDetail()
  getServePacketRecordList()
}

onMounted(() => {
  getDetail()
  getServePacketRecordList()
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
}
.title-name {
  font-weight: 700;
}
.title .customer-edit {
  position: absolute;
  right: 0;
}

.numberInput {
  width: 100%;
}
.tips {
  margin: 10px 0 30px;
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
:deep(.el-input__wrapper) {
  min-width: 150px !important;
}
:deep(.el-select__wrapper) {
  min-width: 150px !important;
}
</style>
