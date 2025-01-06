<template>
  <div>
    <el-card shadow="never" class="card">
      <template #header>
        <div class="card-header">
          <span class="title">补贴统计</span>
        </div>
      </template>

      <div class="query-form">
        <el-space wrap :size="12">
          <el-button type="primary" @click="showExportDialog" :disabled="!leafAreaFlag || getAuth('subsidyCard:index:export')">导出</el-button>
          <div>
            <!-- <span class="date-label">关键字:</span> -->
            <el-input v-model="queryForm.keyword" placeholder="模糊搜索客户ID/客户姓名/证件号码/电话号码" style="width: 320px" @change="getTableList" />
          </div>
          <div>
            <!-- <span class="date-label">政府补贴辅助:</span> -->
            <DictSelect v-model="queryForm.subsidyStandard" :distList="filterDict('subsidy_standard')" placeholder="政府补贴补助" :clearable="true" :multiple="true" />
          </div>
          <div>
            <!-- <span class="date-label">年份:</span> -->
            <DictSelect v-model="queryForm.year" :distList="yearList" placeholder="年份" :clearable="true" style="width: 120px" />
          </div>
          <template v-if="!extraQueryFlag">
            <el-button type="primary" @click="getTableList()">查询</el-button>
            <el-button @click="reset">重置</el-button>
          </template>
          <el-link :icon="Filter" type="primary" @click="extraQueryFlag = !extraQueryFlag">高级筛选</el-link>
        </el-space>
      </div>

      <div class="advance-filter-box scrollbarHide" :class="{ 'show-filter': extraQueryFlag }">
        <div class="filter-content-wrapper">
          <div class="customer-filter">
            <div class="filter-row">
              <span class="row-head">现居地址</span>
              <Cascader width="100%" :check="true" placeholder="请选择现居地址" v-model="queryForm.currentList" />
            </div>
            <div class="filter-row">
              <span class="row-head">服务对象来源</span>
              <DictSelect width="100%" v-model="queryForm.serviceObjSource" :distList="filterDict('service_obj_source')" placeholder="请选择(多选)" :multiple="true" :clearable="true" />
            </div>
            <div class="filter-row">
              <span class="row-head">补贴名称</span>
              <DictSelect width="100%" v-model="queryForm.name" :distList="subsidyData" :clearable="true" />
            </div>
            <div class="filter-row">
              <span class="row-head">户籍地址</span>
              <Cascader width="100%" :check="true" placeholder="请选择户籍地址" v-model="queryForm.domicileList" />
            </div>
            <div class="filter-row">
              <span class="row-head">补贴人员状态</span>
              <DictSelect width="100%" v-model="queryForm.subsidyCustomerUsingStatus" :distList="filterDict('subsidy_using_status')" placeholder="全部" :clearable="true" />
            </div>
            <div class="filter-row">
              <span class="row-head">补贴状态</span>
              <DictSelect width="100%" v-model="queryForm.usingStatus" :distList="filterDict('subsidy_using_status')" placeholder="全部" :clearable="true" />
            </div>
          </div>

          <div v-if="extraQueryFlag">
            <el-button type="primary" @click="getTableList()">查询</el-button>
            <el-button @click="reset">重置</el-button>
          </div>
        </div>
      </div>

      <el-table
        :data="tableData"
        ref="tableRef"
        header-row-class-name="table-header"
        v-loading="loading"
        @selection-change="handleSelectionChange"
        class-name="table-without-border list-page-table"
        height="calc(100vh - 310px)"
      >
        <el-table-column type="selection" width="40" />
        <el-table-column fixed="left" label="操作" class-name="table-operation">
          <template #default="{ row }">
            <el-button :disabled="!leafAreaFlag || getAuth('subsidy:user:detail')" link type="primary" @click="detail(row)"> 查看 </el-button>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="customerId" label="客户ID" min-width="160" />
        <el-table-column show-overflow-tooltip prop="customerName" label="姓名" min-width="120" />
        <el-table-column show-overflow-tooltip prop="customerIdCard" label="证件号码" min-width="180" />
        <el-table-column prop="customerMobilePhone" label="联系电话" min-width="140" show-overflow-tooltip />
        <el-table-column show-overflow-tooltip prop="subsidyCustomerUsingStatus" label="补贴人员状态" min-width="120">
          <template #default="{ row }">
            <span class="not-bound" v-if="row.subsidyCustomerUsingStatus === '1'">未使用</span>
            <span class="bound" v-else-if="row.subsidyCustomerUsingStatus === '2'">使用中</span>
            <span class="void" v-else-if="row.subsidyCustomerUsingStatus === '3'">停止使用</span>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="name" label="补贴名称" min-width="180" />
        <el-table-column show-overflow-tooltip prop="usingStatus" label="补贴状态">
          <template #default="{ row }">
            <span class="not-bound" v-if="row.usingStatus === '1'">未使用</span>
            <span class="bound" v-else-if="row.usingStatus === '2'">使用中</span>
            <span class="void" v-else-if="row.usingStatus === '3'">停止使用</span>
          </template>
        </el-table-column>
        <el-table-column prop="balance" label="养老卡剩余余额(当月余额)" min-width="200" show-overflow-tooltip />
        <!-- <el-table-column show-overflow-tooltip prop="minPrice" label="次月余额(预估)" min-width="120" /> -->
        <el-table-column show-overflow-tooltip prop="code" label="卡号" min-width="140" />
        <el-table-column show-overflow-tooltip prop="remark" label="备注" min-width="200" />
        <el-table-column show-overflow-tooltip prop="updateTime" label="更新时间" min-width="180" />
        <el-table-column show-overflow-tooltip prop="domicileAddress" label="地址(户籍)" min-width="200" />
        <el-table-column show-overflow-tooltip prop="currentAddress" label="地址(现居)" min-width="200" />
        <el-table-column show-overflow-tooltip prop="subsidyStandard" label="政府补贴标准" min-width="180" />
        <el-table-column show-overflow-tooltip prop="rechargeAllMoney" label="充值总金额" min-width="120" />
        <el-table-column show-overflow-tooltip prop="lastYearServiceAllMoney" label="上年度服务总金额" min-width="140" />
        <el-table-column show-overflow-tooltip prop="janServiceAllMoney" label="1月服务总金额" min-width="120" />
        <el-table-column show-overflow-tooltip prop="febServiceAllMoney" label="2月服务总金额" min-width="120" />
        <el-table-column show-overflow-tooltip prop="marServiceAllMoney" label="3月服务总金额" min-width="120" />
        <el-table-column show-overflow-tooltip prop="aprServiceAllMoney" label="4月服务总金额" min-width="120" />
        <el-table-column show-overflow-tooltip prop="mayServiceAllMoney" label="5月服务总金额" min-width="120" />
        <el-table-column show-overflow-tooltip prop="junServiceAllMoney" label="6月服务总金额" min-width="120" />
        <el-table-column show-overflow-tooltip prop="julServiceAllMoney" label="7月服务总金额" min-width="120" />
        <el-table-column show-overflow-tooltip prop="augServiceAllMoney" label="8月服务总金额" min-width="120" />
        <el-table-column show-overflow-tooltip prop="sepServiceAllMoney" label="9月服务总金额" min-width="120" />
        <el-table-column show-overflow-tooltip prop="octServiceAllMoney" label="10月服务总金额" min-width="130" />
        <el-table-column show-overflow-tooltip prop="novServiceAllMoney" label="11月服务总金额" min-width="130" />
        <el-table-column show-overflow-tooltip prop="decServiceAllMoney" label="12月服务总金额" min-width="130" />
        <el-table-column show-overflow-tooltip prop="serviceAllMoney" label="总计" />
      </el-table>
      <div style="margin-top: 20px">
        <el-pagination
          v-model:current-page="queryForm.pageNum"
          v-model:page-size="queryForm.pageSize"
          :page-sizes="[10, 20, 50, 100, 200, 500]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="getTableList"
          @current-change="getTableList"
        />
      </div>
    </el-card>
  </div>
  <ExportDialog ref="exportRef" :multipleSelection="multipleSelection" :queryForm="queryForm" :loading="exportLoading" title="养老卡补贴统计" @export-submit="exportExcel" />
</template>
<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useCache } from '@/hooks/web/useCache'
const { wsCache } = useCache()
import { getAuth } from '@/utils/export'
import DictSelect from '/@/components/DictSelect/index.vue'
import { subsidyInfoList, subsidyStatPage } from '@/api/subsidy'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import download from '@/utils/download'
import { Filter } from '@element-plus/icons-vue'
import { subsidyStatExport } from '@/api/subsidy'
import ExportDialog from '../careinfo/components/export-dialog/index.vue'
import Cascader from '/@/components/Cascader/index.vue'
import { resetQueryForm } from '@/utils'
import { filterDict } from '@/hooks/web/useDict'

const leafAreaFlag = ref(wsCache.get('leafAreaFlag'))

const { push } = useRouter()

function detail(row) {
  push(`/subsidy/subsidyUserDetail?id=${row.subsidyCustomerId}`)
}

const extraQueryFlag = ref(false)

// 导出
const exportRef = ref()
function showExportDialog() {
  exportRef.value.show()
}
const exportLoading = ref(false)
const exportExcel = async (f) => {
  let exportForm: any = {}
  if (f.data == 'select' && multipleSelection.value?.length == 0) {
    ElMessage.error('未选择数据')
    return
  }
  if (f.data == 'select') {
    exportForm.idList = multipleSelection.value?.map((obj: any) => {
      return obj.subsidyCustomerId
    })
  }
  if (f.data == 'filter') {
    exportForm = { ...queryForm }
    exportForm.pageSize = undefined
    exportForm.pageNum = undefined
  }
  if (f.data == 'all') {
    exportForm = {}
  }
  exportLoading.value = true
  let time = getTime()
  try {
    const data = await subsidyStatExport(exportForm)
    download.excel(data.data, `${time}养老卡补贴统计.xlsx`)
    ElMessage.success('导出成功')
    exportLoading.value = false
  } finally {
    exportLoading.value = false
  }
}
const getTime = () => {
  const currentDate = new Date()
  const year = currentDate.getFullYear()
  const month = String(currentDate.getMonth() + 1).padStart(2, '0')
  const day = String(currentDate.getDate()).padStart(2, '0')
  const yyyymmdd = `${year}${month}${day}`
  return yyyymmdd
}

const queryFormDefault = {
  keyword: undefined,
  subsidyStandard: undefined,
  year: undefined,
  pageNum: 1,
  pageSize: 20,
  orderByColumn: undefined,
  asc: undefined
}
const queryForm = reactive<any>({ ...queryFormDefault })

const loading = ref(false)
const tableData = ref()
const total = ref(0)
const tableRef = ref()

async function getTableList() {
  loading.value = true
  const { data } = await subsidyStatPage(queryForm)
  tableData.value = data.list
  total.value = data.total
  loading.value = false
}

const reset = () => {
  resetQueryForm(queryForm, { pageNum: 1, pageSize: 20, serviceObjSource: undefined })
  getTableList()
}

const yearList = ref<any>([])

const getYear = () => {
  const currentYear = new Date().getFullYear()
  const pastYearsArray = Array.from({ length: currentYear - 2014 }, (_, index) => currentYear - index)
  yearList.value = pastYearsArray.map((item) => {
    return {
      value: item.toString(),
      label: item
    }
  })
  queryForm.year = yearList.value[0].value
  getTableList()
}

const multipleSelection = ref<any>([])
const handleSelectionChange = (val: any) => {
  multipleSelection.value = val
}

const subsidyData = ref<any>([])

const getSubsidyList = async () => {
  const { data } = await subsidyInfoList()
  subsidyData.value = data.map((item) => {
    return {
      value: item.name,
      label: item.name
    }
  })
}

onMounted(() => {
  getSubsidyList()
  getYear()
})
</script>
<style lang="less" scoped>
.advance-filter-box {
  &.show-filter {
    height: 170px;
  }
  .customer-filter {
    .filter-row {
      width: 33.33%;
    }
  }
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
