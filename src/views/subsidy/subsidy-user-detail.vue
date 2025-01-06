<template>
  <el-page-header title="" @back="onBack">
    <template #content>
      <div class="title-name"> 补贴人员详情：{{ form.customerName }} - {{ form.name }} ( {{ renderDict(form.subsidyCustomerUsingStatus, 'subsidy_using_status') }} ) </div>
    </template>
    <div class="detail-top-gray-info">
      <span class="mr-5">编号：{{ form.id }}</span>
      <span class="mr-5">创建：{{ form.creatorName }} {{ form.createTime }} </span>
      <span class="mr-5">最近更新：{{ form.updateTime ? form.updaterName + ' ' + form.updateTime : form.creatorName + ' ' + form.createTime }}</span>
    </div>
  </el-page-header>
  <el-scrollbar>
    <el-scrollbar class="subsidy-add-main">
      <h4 class="title" style="margin: 0 0 16px; font-weight: 600">客户信息</h4>
      <div class="info-box">
        <div class="info-item">
          <span class="item-label">客户姓名</span>
          <span class="item-content">
            <el-button link type="primary" @click="toDetail(form.customerId)">{{ form.customerName }}</el-button>
            <span class="void" v-if="form.customerSex">({{ renderDict(form.customerSex, 'vols_sex') }})</span>
          </span>
        </div>
        <div class="info-item">
          <span class="item-label">年龄</span>
          <span class="item-content">{{ form.customerAge }}</span>
        </div>
        <div class="info-item">
          <span class="item-label">联系电话</span>
          <span class="item-content">
            {{ form.customerMobilePhone }}
          </span>
        </div>
        <div class="info-item">
          <span class="item-label">证件号码</span>
          <span class="item-content">
            {{ form.customerIdCard }}
          </span>
        </div>
        <div class="info-item">
          <span class="item-label">当月余额</span>
          <span class="item-content">
            {{ form.balance }}
          </span>
        </div>
        <div class="info-item">
          <span class="item-label">次月余额（预估）</span>
          <span class="item-content">
            {{ form.balance }}
          </span>
        </div>
      </div>

      <h4 class="title" style="margin: 0 0 16px; font-weight: 600">补贴信息</h4>
      <div class="info-box">
        <div class="info-item">
          <span class="item-label">补贴名称</span>
          <span class="item-content">
            <el-button class="r-m-r-8" link type="primary" @click="toSubsidyDetail(form.id)">{{ form.name }}</el-button>
            <span class="r-tag warning" v-if="form.usingStatus === '1'">未使用</span>
            <span class="r-tag success" v-if="form.usingStatus === '2'">使用中</span>
            <span class="r-tag info" v-if="form.usingStatus === '3'">停止使用</span>
          </span>
        </div>
        <div class="info-item">
          <span class="item-label">所属项目</span>
          <span class="item-content">
            {{ areaList.find((item) => item.value == form.areaCode)?.label }}
          </span>
        </div>
        <div class="info-item">
          <span class="item-label">合同起止日期</span>
          <span class="item-content">
            {{ form.startDate + ' - ' + form.endDate }}
          </span>
        </div>
        <div class="info-item">
          <span class="item-label">业务负责人</span>
          <span class="item-content">
            {{ form.manager }}
          </span>
        </div>
      </div>

      <h4 class="title" style="margin-bottom: 20px; font-weight: 600">服务信息</h4>
      <div class="info-box">
        <div class="info-item info-item-100">
          <span class="item-label">服务描述</span>
          <span class="item-content">
            {{ form.serveDesc }}
          </span>
        </div>
        <div class="info-item">
          <span class="item-label">系统充值方式</span>
          <span class="item-content">
            {{ renderDict(form.rechargeMode, 'subsidy_recharge_type') }}
            每人充值 {{ form.rechargeMoney }} 元
          </span>
        </div>
        <div class="info-item">
          <span class="item-label">余额计算周期</span>
          <span class="item-content">
            {{ renderDict(form.balanceMode, 'subsidy_reset_type') }}
          </span>
        </div>
        <div class="info-item">
          <span class="item-label">客户过世方式</span>
          <span class="item-content">
            {{ renderDict(form.stopType, 'subsidy_stop_type') }}
          </span>
        </div>
      </div>

      <h4 class="title" style="margin-bottom: 20px; font-weight: 600">卡信息</h4>
      <div class="info-box">
        <div class="info-item info-item-100">
          <span class="item-label">卡号</span>
          <span class="item-content">
            <el-button class="r-m-r-8" link type="primary" v-if="!form.cardId" @click="openAddCord">添加绑定</el-button>
            <span class="r-m-r-8">{{ form.code }}</span>
            <span class="r-tag success r-m-r-8" v-if="form.cardId && form.status == '2'">{{ renderDict(form.status, 'subsidy_card_using_status') }}</span>
            <span class="r-tag info r-m-r-8" v-if="form.status == '1' || form.status == '3' || form.status == '4'">{{ renderDict(form.status, 'subsidy_card_using_status') }}</span>
            <el-button link type="primary" v-if="form.cardId" @click="openLossCord">挂失/解除绑定</el-button>
            <el-button link type="primary" v-if="form.cardId" @click="openChangeCord">换卡</el-button>
          </span>
        </div>
        <div class="info-item info-item-100" v-if="form.cardId">
          <span class="item-label">图片</span>
          <span class="item-content">
            <el-image v-for="(item, index) in imgList" :key="index" :src="item" :initial-index="index" :preview-src-list="imgList" fit="fill" class="img-size"></el-image>
          </span>
        </div>
      </div>

      <h4 class="title" style="margin-bottom: 20px; font-weight: 600">历史余额情况</h4>
      <el-table
        :data="form.subsidyAccountList"
        header-row-class-name="table-header"
        :style="{
          width: 'calc(100vw - 255px)',
          border: '1px solid #f5f3f0',
          borderRadius: '8px'
        }"
        max-height="200"
      >
        <el-table-column type="index" width="40" />
        <el-table-column show-overflow-tooltip prop="month" min-width="160" label="时间" />
        <el-table-column show-overflow-tooltip prop="rechargeMoney" min-width="160" label="充值" />
        <el-table-column show-overflow-tooltip prop="lastMonthMoney" min-width="160" label="本月可用上月余额" />
        <el-table-column show-overflow-tooltip prop="offsetMoney" min-width="160" label="冲减" />
        <el-table-column show-overflow-tooltip prop="consumeMoney" min-width="160" label="消费" />
        <el-table-column show-overflow-tooltip prop="backMoney" min-width="160" label="返款" />
        <el-table-column show-overflow-tooltip prop="balance" min-width="160" label="余额" />
      </el-table>

      <h4 class="title" style="margin: 20px 0; font-weight: 600">补贴人员历史记录</h4>
      <el-table
        :data="subsidyRecordTable"
        header-row-class-name="table-header"
        :style="{
          width: 'calc(100vw - 255px)',
          border: '1px solid #f5f3f0',
          borderRadius: '8px'
        }"
        max-height="200"
      >
        <el-table-column type="index" width="40" />
        <el-table-column label="操作" width="100">
          <template #default="{ row }">
            <el-button v-if="row.cardId" link type="primary" size="small" @click="subsidyRecordDetail(row.cardId)"> 查看 </el-button>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="createTime" min-width="170" label="时间" />
        <el-table-column show-overflow-tooltip prop="creatorName" min-width="160" label="人员" />
        <el-table-column show-overflow-tooltip prop="act" min-width="160" label="操作" />
        <el-table-column show-overflow-tooltip prop="addMoney" min-width="160" label="金额" />
        <el-table-column show-overflow-tooltip prop="month" min-width="160" label="账单月份" />
        <el-table-column show-overflow-tooltip prop="remark" min-width="200" label="备注" />
        <el-table-column show-overflow-tooltip prop="brief" min-width="200" label="说明" />
      </el-table>
      <div style="margin-top: 20px">
        <el-pagination
          v-model:current-page="subsidyRecordFrom.pageNum"
          v-model:page-size="subsidyRecordFrom.pageSize"
          :page-sizes="[10, 20, 50, 100, 200, 500]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="subsidyRecordTotal"
          @size-change="getSubsidyRecord"
          @current-change="getSubsidyRecord"
        />
      </div>
    </el-scrollbar>
  </el-scrollbar>
  <AddCardDialog ref="AddCardRef" @reload-list="getDetail" :dict="dictMap" :formCustomer="form" />
  <LossCardDialog ref="LossCardRef" @reload-list="getDetail" :dict="dictMap" />
  <ChangeCardDialog ref="ChangeCardRef" @reload-list="getDetail" :dict="dictMap" />
</template>
<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import AddCardDialog from './components/add-card-dialog/index.vue'
import LossCardDialog from './components/unbind-loss-dialog/index.vue'
import ChangeCardDialog from './components/change-card-dialog/index.vue'
import { getSubsidyUserDetail, subsidyRecordPage } from '@/api/subsidy'
import { useCache } from '@/hooks/web/useCache'
import { useAppStoreWithOut } from '@/store/modules/app'
import { renderDict, dictMap } from '@/hooks/web/useDict'

// @ts-ignore
defineOptions({
  // eslint-disable-next-line vue/component-definition-name-casing
  name: 'SubsidyAdd'
})

const { wsCache } = useCache()

const appStoreOut = useAppStoreWithOut()

const areaList = ref(
  wsCache.get(appStoreOut.getUserInfo).sysAreas.map((item) => {
    return {
      value: item.code,
      label: item.name
    }
  })
)

const areaCode = ref(wsCache.get('areaCode'))

const { back, push } = useRouter()

const route = useRoute()

function onBack() {
  back()
}

const addDefault = reactive({
  name: undefined,
  sortKey: undefined,
  areaCode: undefined,
  date: undefined,
  startDate: undefined,
  endDate: undefined,
  manager: undefined,
  brief: undefined,
  remark: undefined,
  isClosed: undefined,
  finishStatus: undefined,
  serveDesc: undefined,
  rechargeMode: undefined,
  rechargeMoney: undefined,
  balanceMode: undefined,
  stopType: undefined,
  subsidyAmount: undefined,
  subsidyFreday: undefined,
  subsidyFremonth: undefined,
  subsidyFreweek: undefined,
  subsidyPurpose: [],
  subsidyCustomers: []
})
let form = reactive<any>({ ...addDefault })

const imgList = computed(() => {
  if (!(form.attachList && form.attachList.length)) return []
  return form.attachList.map((item) => item.url)
})

const getDetail = async () => {
  const { data } = await getSubsidyUserDetail(route.query.id)
  Object.assign(form, data)
  if (data.startDate) {
    form.date = [data.startDate, data.endDate]
  }
  getSubsidyRecord()
}

const id = ref<any>('')

// 绑卡
const AddCardRef = ref()

const openAddCord = () => {
  AddCardRef.value.show()
}

// 挂失/解除绑定
const LossCardRef = ref()

const openLossCord = () => {
  LossCardRef.value.show(form)
}

// 换卡
const ChangeCardRef = ref()

const openChangeCord = () => {
  ChangeCardRef.value.show(form)
}

const subsidyRecordFrom = ref({
  type: 2,
  pageNum: 1,
  pageSize: 20,
  orderByColumn: undefined,
  asc: undefined
})

const subsidyRecordTable = ref([])

const subsidyRecordTotal = ref(0)

// 获取补贴人员历史记录
const getSubsidyRecord = async () => {
  const { data } = await subsidyRecordPage({
    ...subsidyRecordFrom.value,
    // cardId: form.cardId,
    customerId: form.customerId,
    subsidyInfoId: form.id
  })
  subsidyRecordTable.value = data.list
  subsidyRecordTotal.value = data.total
}

const subsidyRecordDetail = (id) => {
  push(`/subsidy/cardDetail?id=${id}`)
}

const toDetail = (id) => {
  push(`/customer/detail?id=${id}&customerUpdate=true`)
}

function toSubsidyDetail(id) {
  push(`/subsidy/subsidyDetail?id=${id}`)
}

onMounted(() => {
  if (route.query.id) {
    id.value = route.query.id
    getDetail()
  } else {
    form.areaCode = areaCode.value
  }
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
  margin-top: 10px;
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
// .subsidy-add-out {
//   width: calc(100vw - 300px);
//   padding: 0 15px 15px 0;
// }
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
}
.info-item {
  width: 33.33%;
  line-height: 23px;
  font-size: 14px;
  margin-bottom: 20px;
  display: flex;
  .item-label {
    text-align: left;
    // color: var(--el-text-color-regular);
    // margin-right: 10px;
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
.img-size {
  display: inline-block;
  height: 80px;
  width: 80px;
  border: 1px solid #eceaea;
  margin: 0 10px 10px 0;
  border-radius: 4px;
}
</style>
