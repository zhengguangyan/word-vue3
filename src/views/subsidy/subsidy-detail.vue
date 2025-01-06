<template>
  <el-page-header title="" @back="onBack">
    <template #content>
      <div class="title-name">
        <span> 补贴详情：{{ form.name }} </span>
        <span>（{{ renderDict(form.usingStatus, 'subsidy_using_status') }} | </span>
        <span :class="form.finishStatus === '3' ? 'bound' : 'not-bound'">{{ renderDict(form.finishStatus, 'subsidy_finish_status') }}</span
        >）
      </div>
    </template>
    <div class="detail-top-gray-info">
      <span class="mr-5">补贴编号：{{ form.no }}</span>
      <span class="mr-5">创建：{{ form.creatorName }} {{ form.createTime }} </span>
      <span class="mr-5"> 最近更新：{{ form.updateTime ? form.updaterName + ' ' + form.updateTime : form.creatorName + ' ' + form.createTime }} </span>
    </div>
  </el-page-header>
  <el-scrollbar>
    <el-scrollbar class="subsidy-add-main">
      <h4 class="title" style="margin: 0 0 16px; font-weight: 600">基础信息</h4>
      <div class="info-box">
        <div class="info-item">
          <span class="item-label">补贴名称</span>
          <span class="item-content">{{ form.name }}</span>
        </div>
        <div class="info-item">
          <span class="item-label">排序码</span>
          <span class="item-content">{{ form.sortKey }}</span>
        </div>
        <div class="info-item">
          <span class="item-label">所属项目</span>
          <span class="item-content">
            {{ areaList.find((item) => item.value == form.areaCode)?.label }}
          </span>
        </div>
        <div class="info-item">
          <span class="item-label">合同起止时间</span>
          <span class="item-content">
            {{ (form.startDate || '') + ' - ' + (form.endDate || '') }}
          </span>
        </div>
        <div class="info-item">
          <span class="item-label">业务负责人</span>
          <span class="item-content">
            {{ form.manager }}
          </span>
        </div>
        <div class="info-item info-item-100">
          <span class="item-label">补贴简介</span>
          <span class="item-content">
            {{ form.brief }}
          </span>
        </div>
        <div class="info-item info-item-100">
          <span class="item-label">备注</span>
          <span class="item-content">
            {{ form.remark }}
          </span>
        </div>
        <div class="info-item">
          <span class="item-label">是否暂停使用</span>
          <span class="item-content">
            {{ renderDict(form.isClosed, 'yes_no') }}
          </span>
        </div>
        <div class="info-item">
          <span class="item-label">是否结案</span>
          <span class="item-content">
            {{ renderDict(form.isFinish, 'yes_no') }}
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
            <span v-if="form.rechargeMode === '3'">{{ form.rechargeMonth }}月{{ form.rechargeDay }}日</span>
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
        <div class="info-item">
          <span class="item-label">补贴用途</span>
          <span class="item-content">
            {{ renderDict(form.subsidyPurpose, 'subsidy_purpose') }}
          </span>
        </div>
        <div class="info-item info-item-100">
          <span class="item-label">每单补贴规则</span>
          <span class="item-content">
            <span class="ruleSpan" v-if="form.subsidyAmount"> 每单补贴上限 {{ form.subsidyAmount }} 元 </span>
            <span class="ruleSpan" v-if="form.subsidyFreday"> 每日限制 {{ form.subsidyFreday }} 次 </span>
            <span class="ruleSpan" v-if="form.subsidyFremonth"> 每周限制 {{ form.subsidyFremonth }} 次 </span>
            <span class="ruleSpan" v-if="form.subsidyFreweek"> 每月限制 {{ form.subsidyFreweek }} 次 </span>
          </span>
        </div>
      </div>

      <h4 class="title" style="margin-bottom: 20px; font-weight: 600">
        客户信息
        <span class="customer-title"
          >（共{{ form.subsidyCustomerAllNum || 0 }}人， 使用中{{ form.subsidyCustomerUsing || 0 }}人， 未使用{{ form.subsidyCustomerNotUsed || 0 }}人， 停止使用{{
            form.subsidyCustomerStopUsing || 0
          }}人）</span
        >
      </h4>

      <el-space :size="12" wrap style="margin-bottom: 10px">
        <el-button type="primary" :disabled="!multipleSelection.length" @click="openTopUp" v-if="form.usingStatus !== '3' && form.finishStatus !== '3'"> 批量充值 </el-button>
        <el-button :disabled="!multipleSelection.length" @click="openDeduct" v-if="form.usingStatus !== '3' && form.finishStatus !== '3'"> 批量冲减 </el-button>
        <el-button @click="openAddCord">批量绑定养老卡</el-button>
        <el-input v-model="queryForm.keyword" placeholder="精确搜索姓名/证件号/联系电话/ID" style="width: 300px">
          <template #suffix>
            <el-icon><search /></el-icon>
          </template>
        </el-input>
        <DictSelect width="100%" v-model="queryForm.status" :distList="filterDict('subsidy_using_status')" placeholder="请选择状态" />
      </el-space>
      <div class="r-p-r-20">
        <el-table
          :data="userList"
          header-row-class-name="table-header"
          :style="{
            border: '1px solid #f5f3f0',
            borderRadius: '8px'
          }"
          max-height="200"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="40" />
          <el-table-column label="操作" width="100">
            <template #default="{ row }">
              <el-button link type="primary" size="small" @click="customerDetail(row.subsidyCustomerId)"> 查看 </el-button>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="usingStatus" min-width="170" label="状态">
            <template #default="{ row }">
              <span class="void" v-if="row.disableOrNot">停止使用</span>
              <div v-else>
                <span class="not-bound" v-if="row.usingStatus === '1'">未使用</span>
                <span class="bound" v-else-if="row.usingStatus === '2'">使用中</span>
                <span class="void" v-else-if="row.usingStatus === '3'">停止使用</span>
              </div>
              <!-- 状态：{{ row.usingStatus }} -->
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="name" min-width="160" label="姓名" />
          <el-table-column show-overflow-tooltip prop="sex" min-width="100" label="性别">
            <template #default="{ row }">
              {{ renderDict(row.sex, 'vols_sex') }}
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="mobilephone" min-width="160" label="电话" />
          <el-table-column show-overflow-tooltip prop="idcard" min-width="180" label="证件号码" />
          <el-table-column show-overflow-tooltip prop="deathFlag" min-width="140" label="是否健在">
            <template #default="{ row }">
              {{ renderDict(row.deathFlag, 'yes_no') }}
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="balance" min-width="140" label="当月余额" />
          <el-table-column show-overflow-tooltip prop="balance" min-width="140" label="次月余额(预估)" />
          <el-table-column show-overflow-tooltip prop="remark" min-width="200" label="备注" />
        </el-table>
      </div>
      <div class="tips">
        <p>注意：</p>
        <p>
          1、补贴信息保存成功，<span class="tip">合同起止日期内</span>，累统将按选择的充值/清零方式，<span class="tip">在次月/次季度1号00:00/固定日期</span>充值至客户补贴账户中，<span class="tip"
            >并将上月/上季度/上年度余额清零</span
          >
        </p>
        <p>2、“停止使用“的补贴，“停止便用“的客户，不支持系统自动充值</p>
        <p> 3、修改客户为过世状态（注意不是指过世时间，是指将是否健在修改为否的时间），该客户补贴自动停止使用，将不再支持使用补贴金支付订单 </p>
        <p> 4、合同到期当月，补贴金可继续使用，合同到期次月补贴停止使用，补贴停止使用，客户不支持使用补贴支付订单 </p>
      </div>
      <h4 class="title" style="margin: 40px 0 16px; font-weight: 600">补贴历史记录</h4>
      <el-table
        :data="historyList"
        header-row-class-name="table-header"
        :style="{
          width: 'calc(100vw - 335px)',
          border: '1px solid #f5f3f0',
          borderRadius: '8px'
        }"
        max-height="200"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="index" label="序号" width="60" />
        <el-table-column show-overflow-tooltip prop="createTime" min-width="160" label="时间" />
        <el-table-column show-overflow-tooltip prop="creatorName" min-width="160" label="人员" />
        <el-table-column show-overflow-tooltip prop="act" min-width="160" label="操作" />
        <el-table-column show-overflow-tooltip prop="remark" min-width="160" label="备注" />
      </el-table>
    </el-scrollbar>
  </el-scrollbar>
  <BatchTopUpDialog ref="BatchTopUpRef" @reload-list="getDetail" />
  <BatchDeductDialog ref="BatchDeductRef" @reload-list="getDetail" />
  <BatchAddCordDialog ref="BatchAddCordRef" :id="id" @reload-list="getDetail" />
</template>
<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { useRouter, useRoute } from 'vue-router'
import BatchTopUpDialog from './components/batch-top-up-dialog/index.vue'
import BatchDeductDialog from './components/batch-deduct-dialog/index.vue'
import BatchAddCordDialog from './components/batch-add-cord-dialog/index.vue'
import DictSelect from '@/components/DictSelect/index.vue'
import { getSubsidyInfo, subsidyHistoryRecordList } from '@/api/subsidy'
import { useCache } from '@/hooks/web/useCache'
import { useAppStoreWithOut } from '@/store/modules/app'
import { computed } from 'vue'
import { filterDict, renderDict } from '@/hooks/web/useDict'

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

const multipleSelection = ref<any>([])
const handleSelectionChange = (val: any) => {
  multipleSelection.value = val
}

const customerDetail = (id) => {
  push(`/subsidy/subsidyUserDetail?id=${id}`)
}

const historyList = ref([])

const getDetail = async () => {
  const { data } = await getSubsidyInfo(route.query.id)
  const res = await subsidyHistoryRecordList({ subsidyInfoId: route.query.id, type: '1' })
  Object.assign(form, data)
  historyList.value = res.data
  if (data.startDate) {
    form.date = [data.startDate, data.endDate]
  }
}

const queryForm = ref({
  keyword: undefined,
  status: undefined
})

// 批量充值
const BatchTopUpRef = ref()

const openTopUp = () => {
  const isStop = multipleSelection.value.filter((item) => item.usingStatus === '3')
  if (isStop.length) {
    ElMessage.error('所选客户存在状态为停止使用,不支持充值')
    return
  }
  BatchTopUpRef.value.show(multipleSelection.value, route.query.id)
}

// 批量冲减
const BatchDeductRef = ref()

const openDeduct = () => {
  const isStop = multipleSelection.value.filter((item) => item.usingStatus === '3')
  if (isStop.length) {
    ElMessage.error('所选客户存在状态为停止使用,不支持充值')
    return
  }
  BatchDeductRef.value.show(multipleSelection.value, route.query.id)
}

// 批量绑定养老卡
const BatchAddCordRef = ref()

const openAddCord = () => {
  const isStop = multipleSelection.value.filter((item) => item.usingStatus === '3')
  if (isStop.length) {
    ElMessage.error('所选客户存在状态为停止使用,不支持充值')
    return
  }
  BatchAddCordRef.value.show()
}

const userList = computed(() => {
  if (queryForm.value.status) {
    return form.subsidyCustomers.filter((item) => item.usingStatus === queryForm.value.status)
  }
  if (queryForm.value.keyword) {
    return form.subsidyCustomers.filter(
      (item) => item.name === queryForm.value.keyword || item.mobilephone === queryForm.value.keyword || item.idcard === queryForm.value.keyword || item.customerId === queryForm.value.keyword
    )
  }
  return form.subsidyCustomers
})

const id = ref<any>('')

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

.subsidy-add-main {
  height: calc(100vh - 280px); /* 设置容器的高度 */
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
:deep(.el-input__wrapper) {
  min-width: 150px !important;
}
:deep(.el-select__wrapper) {
  min-width: 150px !important;
}
</style>
