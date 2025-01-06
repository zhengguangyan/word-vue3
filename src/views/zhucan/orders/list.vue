<template>
  <div>
    <el-card shadow="never" class="card">
      <template #header>
        <div class="card-header">
          <span class="title">助餐订单记录</span>
        </div>
      </template>
      <div class="r-m-t-20">
        <el-space wrap :size="12">
          <el-button @click="handleExport" :loading="exporting" type="primary" :disabled="!leafAreaFlag || getAuth('zhucan:order:export')">导出</el-button>
          <el-button plain @click="handleInvalid" :disabled="!leafAreaFlag || getAuth('zhucan:order:invalid')">作废</el-button>
          <el-input v-model="params.serveInfo" placeholder="操作人/菜单名/订单编号" style="max-width: 320px" @change="loadData" clearable></el-input>
          <el-input v-model="params.memberInfo" placeholder="姓名/卡号/联系电话" style="max-width: 320px" @change="loadData" clearable></el-input>
          <DictSelect v-model="params.source" :distList="filterDict('mealSource')" placeholder="选择订单来源" clearable />
          <template v-if="!showMore">
            <el-button type="primary" @click="loadData(true)">查询</el-button>
            <el-button plain @click="resetQueryForm(params, { pageNum: 1, pageSize: params.pageSize }, loadData, true)">重置</el-button>
          </template>

          <span class="more-btn" @click="showMore = !showMore">
            <Icon icon="ep:filter" :color="primaryColor" />
            <span class="span">高级搜索</span>
          </span>
        </el-space>
        <el-collapse-transition>
          <div class="more-search-wrapper" v-show="showMore">
            <section class="more-search">
              <div class="search-grid">
                <div class="search-item" label="支付时间">
                  <el-date-picker
                    v-model="params.timeRange"
                    type="daterange"
                    range-separator="~"
                    start-placeholder="起始日期"
                    end-placeholder="结束日期"
                    value-format="YYYY-MM-DD"
                    clearable
                    :editable="false"
                    class="create-time-picker"
                  />
                </div>
                <div class="search-item" label="就餐方式">
                  <DictSelect v-model="params.eatModel" :distList="filterDict('eat_model')" placeholder="选择就餐方式" clearable style="width: 100%" />
                </div>
                <div class="search-item" label="价格">
                  <el-input v-model="params.totalMoneyStart" placeholder="请输入" class="age-input" />
                  <span class="r-m-lr-4">-</span>
                  <el-input v-model="params.totalMoneyEnd" placeholder="请输入" class="age-input" />
                </div>
                <div class="search-item" label="站点名称">
                  <el-select v-model="params.stationIds" multiple collapse-tags placeholder="站点名称(多选)" clearable>
                    <el-option v-for="item in stationList" :key="item.id" :label="item.stationName" :value="item.id" />
                  </el-select>
                </div>
                <div class="search-item" label="补贴名称">
                  <el-select v-model="params.subsidyInfoIds" multiple collapse-tags placeholder="补贴名称(多选)" clearable>
                    <el-option v-for="item in subsidyList" :key="item.id" :label="item.name" :value="item.id" />
                  </el-select>
                </div>
                <div class="search-item" label="是否有补贴">
                  <el-radio-group v-model="params.hasSubsidyInfo">
                    <el-radio label="是" value="1"></el-radio>
                    <el-radio label="否" value="0"></el-radio>
                  </el-radio-group>
                </div>
                <div class="search-item" label="单据类型">
                  <DictSelect v-model="params.status" :distList="filterDict('bill_type')" placeholder="搜索单据类型" clearable style="width: 100%" />
                </div>
              </div>
            </section>

            <div class="r-m-t-20">
              <el-button type="primary" @click="loadData(true)">查询</el-button>
              <el-button plain @click="resetQueryForm(params, { pageNum: 1, pageSize: params.pageSize }, loadData, true)">重置</el-button>
            </div>
          </div>
        </el-collapse-transition>
      </div>
      <el-table
        class-name="table-without-border list-page-table"
        :data="tableData"
        v-loading="loading"
        @sort-change="handleSortChange"
        @selection-change="handleSelectionChange"
        height="calc(100vh - 310px)"
      >
        <el-table-column type="selection" width="45" align="center" fixed="left" />
        <el-table-column label="序号" type="index" width="60" align="center" fixed="left" />
        <el-table-column show-overflow-tooltip label="操作人" width="120" prop="operatorName" fixed="left"></el-table-column>
        <el-table-column show-overflow-tooltip label="助餐站点" prop="stationName" width="160"></el-table-column>
        <el-table-column show-overflow-tooltip label="菜单名" width="140" prop="serveName"></el-table-column>
        <el-table-column show-overflow-tooltip label="就餐人" width="140" prop="customerName">
          <template #default="{ row }">
            <el-button type="primary" link @click="handleDetail(row)" v-if="row.status !== '2'">{{ row.customerName }}</el-button>
            <span v-else class="r-m-l-3">{{ row.customerName }}</span>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip label="养老卡卡号" width="140" prop="subsidyCard"></el-table-column>
        <el-table-column show-overflow-tooltip label="就餐方式" width="120" prop="eatModel">
          <template #default="{ row }">{{ renderDict(row.eatModel, 'eat_model') }}</template>
        </el-table-column>
        <el-table-column show-overflow-tooltip label="商品数量" width="120" prop="count" sortable="custom" />
        <el-table-column show-overflow-tooltip label="单价" width="160" prop="totalMoney" sortable="custom" />
        <el-table-column show-overflow-tooltip label="补贴金额" width="160" prop="subsidyMoney" />
        <el-table-column show-overflow-tooltip label="自费金额" width="160" prop="expenseMoney" />
        <el-table-column show-overflow-tooltip label="自费方式" width="160" prop="expenseModel">
          <template #default="{ row }">{{ renderDict(row.expenseModel, 'expense_model') }}</template>
        </el-table-column>
        <el-table-column show-overflow-tooltip label="是否使用补贴" width="160" prop="hasSubsidy" />
        <el-table-column show-overflow-tooltip label="补贴名称" width="160" prop="subsidyInfoName" sortable="custom" />
        <el-table-column show-overflow-tooltip label="支付时间" width="150" prop="payTime" sortable="custom">
          <template #default="{ row }">{{ row.payTime ? row.payTime.slice(0, 16) : '' }}</template>
        </el-table-column>
        <el-table-column show-overflow-tooltip label="订单编号" width="180" prop="orderNumber" />
        <el-table-column show-overflow-tooltip label="订单来源" width="120" prop="source">
          <template #default="{ row }">{{ renderDict(row.source, 'station_source') }}</template>
        </el-table-column>
        <el-table-column show-overflow-tooltip label="单据类型" width="160" prop="status">
          <template #default="{ row }">
            <span v-if="row.status === '1'" class="success-color">{{ renderDict(row.status, 'bill_type') }}</span>
            <span v-if="row.status === '2'" class="info-color">{{ renderDict(row.status, 'bill_type') }}</span>
            <span v-if="row.status === '3'" class="error-color">{{ renderDict(row.status, 'bill_type') }}</span>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        class="r-m-t-20"
        v-model:current-page="params.pageNum"
        v-model:page-size="params.pageSize"
        :page-sizes="[10, 20, 50, 100, 200, 500]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </el-card>
    <el-dialog v-model="exportVisible" title="导出助餐订单记录" append-to-body width="500px" :close-on-click-modal="false" draggable @close="exportVisible = false" class="common-export-dialog">
      <div class="flex">
        <span class="r-m-r-10 text-nowrap">导出数据</span>
        <el-select v-model="params.exportWay" placeholder="请选择导出方式">
          <el-option label="导出所选数据" value="1"></el-option>
          <el-option label="导出筛选结果" value="2"></el-option>
          <el-option label="导出全部数据" value="3"></el-option>
        </el-select>
      </div>
      <div class="error-color r-p-l-66 r-p-t-10 r-p-b-20">一次性导出不能超过6.5W条数据</div>
      <template #footer>
        <el-button plain @click="exportVisible = false">取消</el-button>
        <el-button type="primary" @click="handleExport">导出</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { resetQueryForm } from '@/utils'
import { useCache } from '@/hooks/web/useCache'
import { getAuth } from '@/utils/export'
import DictSelect from '/@/components/DictSelect/index.vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { siteList } from '@/api/zhucan/station'
import { orderExport, orderInvalid, orderPage, verifyInvalid } from '@/api/zhucan/orders'
import { priceRegexp } from '@/utils/validate'
import download from '@/utils/download'
import { subsidyInfoList } from '@/api/subsidy'
import { useAppStore } from '@/store/modules/app'
import { filterDict, renderDict } from '@/hooks/web/useDict'

const { wsCache } = useCache()
const router = useRouter()

const leafAreaFlag = ref(wsCache.get('leafAreaFlag'))
const appStore = useAppStore()
const primaryColor = computed(() => appStore.getTheme.elColorPrimary)

const params = reactive({
  exportWay: '1', // 前端自定义字段 1=所选 2=筛选 3=全部
  asc: undefined as number | undefined,
  eatModel: '',
  hasSubsidyInfo: '', // 是否补贴：0否，1是
  idList: [] as string[], // 导出id专用
  memberInfo: '', // 客户信息：姓名/卡号/联系电话
  orderByColumn: '',
  pageNum: 1,
  pageSize: 10,
  payTimeEnd: '', // 支付时间
  payTimeStart: '', // 支付时间
  timeRange: [] as string[], // 支付时间
  serveInfo: '', // 服务方信息：操作人/订单名/订单编号
  source: '', // 订单来源
  stationIds: [], // 站点id
  status: '', // 单据类型：bill_type
  subsidyInfoIds: [], // 补贴id
  totalMoneyEnd: '',
  totalMoneyStart: ''
})

const showMore = ref(false)

onMounted(() => {
  loadData()
  loadStationList()
  loadSubsidyList()
})

const stationList = ref<any[]>([])
const loadStationList = async () => {
  const { data } = await siteList({})
  stationList.value = data
}

const subsidyList = ref<any[]>([])
const loadSubsidyList = async () => {
  const { data } = await subsidyInfoList({})
  subsidyList.value = data
}

const loading = ref(false)
const tableData = ref<any[]>([])
const total = ref(0)

const loadData = async (query?: true) => {
  if (loading.value) return
  try {
    loading.value = true
    if (query) {
      params.pageNum = 1
    }
    handleParams()
    const { data } = await orderPage(params)
    tableData.value = data.list
    total.value = data.total
  } finally {
    loading.value = false
  }
}
const handleParams = () => {
  if (params.timeRange && params.timeRange.length) {
    params.payTimeStart = params.timeRange[0]
    params.payTimeEnd = params.timeRange[1]
  } else {
    params.payTimeStart = ''
    params.payTimeEnd = ''
  }
  if (params.totalMoneyStart && !priceRegexp.test(params.totalMoneyStart)) {
    ElMessage.error('请输入正确的价格')
    return false
  }
  if (params.totalMoneyEnd && !priceRegexp.test(params.totalMoneyEnd)) {
    ElMessage.error('请输入正确的价格')
    return false
  }
  if (params.totalMoneyStart && params.totalMoneyEnd && Number(params.totalMoneyStart) > Number(params.totalMoneyEnd)) {
    ElMessage.error('最小价格不得大于最大价格')
    return false
  }
}

const invalidLoading = ref(false)
const handleInvalid = async () => {
  if (invalidLoading.value) return
  if (!params.idList.length) return ElMessage.error('请选择您要作废的数据')
  try {
    invalidLoading.value = true
    const { data } = await verifyInvalid(params.idList.join(','))
    if (!data.flag) {
      invalidLoading.value = false
      ElMessageBox.confirm(data.msg, '提示', { type: 'warning' })
        .then(() => {})
        .catch(() => {})
      return
    }
    await ElMessageBox.confirm('若订单金额包含补贴，作废后将自动返回单月补贴，同时该订单不纳入数据管理。是否确认作废？', '订单作废提醒', { type: 'warning' })
    await orderInvalid(params.idList.join(','))
    invalidLoading.value = false
    ElMessage.success('操作成功')
    loadData()
  } catch {
    invalidLoading.value = false
  }
}
const handleDetail = (row: any) => {
  router.push(`/customer/detail?id=${row.memberId}`)
}

const exportVisible = ref(false)
const exporting = ref(false)
const handleExport = async () => {
  if (exporting.value) return
  if (!exportVisible.value) {
    exportVisible.value = true
    return
  }
  try {
    exportVisible.value = false
    if (params.exportWay === '1' && !params.idList.length) {
      ElMessage.error('请选择您要导出的数据')
      return
    }
    exporting.value = true
    let obj: any = {}
    if (params.exportWay === '1') {
      obj.idList = params.idList
    } else if (params.exportWay === '2') {
      obj = { ...params }
      delete obj.pageSize
      delete obj.pageNum
    }
    const { data } = await orderExport(obj)
    ElMessage.success('导出成功')
    download.excel(data, '助餐订单记录.xlsx')
  } finally {
    exporting.value = false
  }
}

const handleSortChange = (column: any) => {
  if (column.order) {
    params.orderByColumn = column.prop
    params.asc = column.order == 'ascending' ? 0 : 1
  } else {
    params.orderByColumn = ''
    params.asc = undefined
  }
  loadData(true)
}

const handleSelectionChange = (val: any[]) => {
  params.idList = val.map((item) => item.id)
}

const handleSizeChange = (size: number) => {
  params.pageNum = 1
  params.pageSize = size
  loadData()
}
const handleCurrentChange = (current: number) => {
  params.pageNum = current
  loadData()
}
</script>

<style lang="less" scoped>
.more-btn {
  display: flex;
  align-items: center;
  font-size: 14px;
  color: var(--el-color-primary);
  cursor: pointer;
  margin-left: 12px;
  white-space: nowrap;
  .span {
    text-decoration: underline;
    margin-left: 2px;
  }
}
.adapter(@size, @content) {
  @media only screen and (max-width: @size) {
    @content();
  }
}
.more-search-wrapper {
  padding: 20px;
  border-radius: 4px;
  background-color: #faf9f7;
  border: 1px solid #f5f3f0;
}
:deep(.age-input) {
  .el-input__wrapper {
    min-width: 50px !important;
  }
}
.search-grid {
  display: grid;
  grid-template-columns: repeat(4, calc((100% - 30px) / 4));
  gap: 10px 10px;
}
.top-search-item {
  display: flex;
  align-items: center;
  max-width: 362px;
  &::before {
    flex-shrink: 0;
    content: attr(label);
    font-size: 14px;
    margin-right: 6px;
  }
}
.search-item {
  display: flex;
  align-items: center;
  &::before {
    width: 80px;
    flex-shrink: 0;
    text-align: right;
    line-height: 1.2;
    content: attr(label);
    font-size: 14px;
    margin-right: 10px;
  }
  &.span2 {
    grid-column: span 2;
  }
}
:deep(.create-time-picker) {
  padding: 0 5px;
  .el-icon.el-input__icon {
    display: none;
  }
  .el-range-separator {
    padding: 0 5px;
    flex: 0;
  }
  .el-range-input {
    flex: 1;
  }
}
</style>
