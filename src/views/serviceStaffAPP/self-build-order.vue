<template>
  <div>
    <el-card shadow="never" class="card">
      <template #header>
        <div class="card-header">
          <span class="title">自建订单管理</span>
        </div>
      </template>
      <div class="order-top r-m-t-20">
        <el-space>
          <el-input v-model="queryForm.keyword" placeholder="订单编号/工单编号/服务对象/服务对象电话/服务商/自定义项目/补贴名称/审核人员" style="width: 600px" clearable @change="accurateSearch">
            <template #suffix>
              <el-icon @click="accurateSearch"><search /></el-icon>
            </template>
          </el-input>
          <el-input v-model="queryForm.operatorName" placeholder="请输入服务人员/服务人员电话" style="width: 300px" clearable @change="accurateSearch">
            <template #suffix>
              <el-icon @click="accurateSearch"><search /></el-icon>
            </template>
          </el-input>
          <el-link :icon="Filter" type="primary" @click="showFilterDialog">
            高级筛选
            <span v-if="filterKeyCount > 0">({{ filterKeyCount }})</span>
          </el-link>
        </el-space>
      </div>

      <OrderFilterDrawer :dict="dictMap" ref="filterRef" :activeIndex="activeIndex" @reload-list="getTableList" @reset-list="resetTable" @change-accurate="changeAccurate" />
      <div class="status-list">
        <div class="status-item" :class="{ 'status-active': !queryForm.status }" @click="changeStatus(undefined)">
          <p>全部状态</p>
          <p>({{ statusList.find((item) => item.status === '')?.num || 0 }})</p>
        </div>
        <template v-for="item in statusList.filter((s) => s.status !== '2')" :key="item.status">
          <div class="status-item" v-if="item.status" :class="{ 'status-active': queryForm.status == item.status }" @click="changeStatus(item.status)">
            <p> {{ renderDict(item.status, 'staff_status') }} </p>
            <p>({{ item.num || 0 }})</p>
          </div>
        </template>
      </div>
      <div class="r-m-t-10">
        <el-space wrap :size="12">
          <el-button type="primary" @click="showExportDialog" :disabled="getAuth('staffAPP:selfBuildOrder:export')">导出</el-button>

          <el-button v-if="leafAreaFlag" :disabled="!leafAreaFlag || getAuth('staffAPP:selfBuildOrder:delete')" plain @click="delBatch">
            删除
            <el-tooltip effect="dark" placement="right-start">
              <template #content>
                不可删除订单：<br />
                1、订单状态为"已通过"的订单<br />
              </template>
              <span class="iconfont icon-biaoqian-mian r-m-l-3"></span>
            </el-tooltip>
          </el-button>

          <!-- <el-button
            :disabled="
              !leafAreaFlag || getAuth('customer:index:allot') || !multipleSelection.length
            "
            >退回订单</el-button
          > -->
          <!-- :disabled="!leafAreaFlag || getAuth('staffAPP:selfBuildOrder:cancel') || !multipleSelection.length" -->
          <el-button :disabled="!leafAreaFlag || getAuth('staffAPP:selfBuildOrder:cancel')" @click="cancelBath" plain>取消订单</el-button>
        </el-space>
      </div>
      <el-table
        :data="tableData"
        ref="tableRef"
        header-row-class-name="table-header"
        @selection-change="handleSelectionChange"
        v-loading="loading"
        class-name="table-without-border list-page-table"
        @sort-change="handleSortChange"
        height="calc(100vh - 400px)"
      >
        <el-table-column type="selection" width="40" />
        <el-table-column fixed="left" label="操作" width="110" class-name="table-operation">
          <template #default="scope">
            <el-button link type="primary" @click="detail(scope.row)" :disabled="getAuth('staffAPP:selfOrder:detail')"> 查看 </el-button>
            <el-button link type="primary" @click="edit(scope.row)" :disabled="!leafAreaFlag || getAuth('staffAPP:selfOrder:edit') || scope.row.deathFlag == '0'"> 编辑 </el-button>
          </template>
        </el-table-column>
        <el-table-column fixed="left" prop="orderNumber" label="订单号" width="180" />
        <el-table-column show-overflow-tooltip prop="belongProject" label="订单归属项目(一级)" width="160">
          <template #default="{ row }">
            {{ renderDict(row.belongProject, 'belong_project') }}
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="secondBelongProjectName" label="订单归属项目(二级)" width="160" />
        <el-table-column show-overflow-tooltip prop="workNumber" label="工单号" width="160" />
        <el-table-column show-overflow-tooltip prop="status" label="订单状态" width="120" sortable="custom">
          <template #default="{ row }">
            {{ renderDict(row.status, 'staff_status') }}
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="startOrderTime" label="开始服务时间" width="180" />
        <el-table-column show-overflow-tooltip prop="memberName" label="服务对象" width="150" />
        <el-table-column show-overflow-tooltip prop="serviceLabel" label="一级服务标签" width="180">
          <template #default="{ row }">
            {{ renderDict(row.serviceLabel, 'service_label') }}
          </template>
        </el-table-column>
        <el-table-column prop="secondServiceLabel" label="二级服务标签" width="180" show-overflow-tooltip>
          <template #default="{ row }">
            <span v-if="row.secondServiceLabel">{{ renderDict(row.secondServiceLabel.split(','), 'second_service_label') }}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column
          prop="thirdServiceLabel"
          label="三级服务标签"
          width="150"
          show-overflow-tooltip
        >
          <template #default="{ row }">
            {{ renderDict(row.thirdServiceLabel, 'third_service_label') }}
          </template>
        </el-table-column> -->
        <el-table-column show-overflow-tooltip prop="serviceStandards" label="服务标准" width="150">
          <template #default="{ row }">
            {{ renderDict(row.serviceStandards, 'service_standards') }}
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="mobilePhone" label="服务对象电话" width="150" />
        <el-table-column show-overflow-tooltip prop="serveName" label="服务项目内容" width="150" />
        <el-table-column show-overflow-tooltip prop="address" label="服务地址" width="200" />
        <el-table-column prop="sellerName" label="服务商（所属组织）" show-overflow-tooltip width="150" />
        <el-table-column show-overflow-tooltip prop="operatorName" label="服务人员" width="120" />
        <el-table-column prop="operatorPhone" label="服务人员电话" width="120" show-overflow-tooltip />
        <el-table-column prop="commonStaffName" label="共同服务人员" width="120" show-overflow-tooltip />
        <el-table-column show-overflow-tooltip prop="reviewName" label="审核人员" width="120" />
        <el-table-column show-overflow-tooltip prop="reviewTime" label="审核时间" width="120" />
        <el-table-column show-overflow-tooltip prop="hasReturn" label="订单回访" width="120" />
        <el-table-column show-overflow-tooltip prop="hasOrder" label="订单评价" width="120" />
        <el-table-column show-overflow-tooltip prop="hasVoice" label="语音评价" width="120" />
        <el-table-column show-overflow-tooltip prop="createTime" label="创建时间" width="180" />
        <el-table-column show-overflow-tooltip prop="serNumber" label="服务项目数量" width="120" />
        <el-table-column show-overflow-tooltip prop="serveDuration" label="服务时长" width="120" />
        <el-table-column show-overflow-tooltip prop="money" label="金额" width="120" />
        <el-table-column show-overflow-tooltip prop="serveItemHours" label="工时" width="120" />
        <el-table-column show-overflow-tooltip prop="payType" label="支付方式" width="120">
          <template #default="{ row }">
            {{ renderDict(row.payType, 'staff_pay_type') }}
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="subsidyCard" label="养老卡号" width="120" />
        <el-table-column show-overflow-tooltip prop="subsidyInfo" label="补贴名称" width="120" />
        <el-table-column prop="subsidyBalance" label="补贴最新金额" width="120" show-overflow-tooltip />
        <el-table-column show-overflow-tooltip prop="shizhengUuid" label="uuid" width="180" />
      </el-table>
      <div style="margin-top: 20px">
        <el-pagination
          v-model:current-page="queryForm.pageNum"
          v-model:page-size="queryForm.pageSize"
          :page-sizes="[10, 20, 50, 100, 200, 500]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="getTableList(null)"
          @current-change="getTableList(null)"
        />
      </div>
    </el-card>
  </div>
  <ExportDialog ref="exportRef" :multipleSelection="multipleSelection" :queryForm="queryForm" title="自建订单列表" />
</template>
<script setup lang="ts">
import { useCache } from '@/hooks/web/useCache'
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Filter, PriceTag } from '@element-plus/icons-vue'
import { Search } from '@element-plus/icons-vue'
import { renderDict, dictMap } from '@/hooks/web/useDict'
import { getStaffInfoStatusStat, getStaffInfoPage, verifyDeleteOrder, staffInfoRemove, verifyCancelOrder, cancelOrder } from '@/api/serviceStaffAPP/index'
import { useRouter } from 'vue-router'
import { getAuth } from '@/utils/export'
import ExportDialog from './components/export-dialog/index.vue'
import OrderFilterDrawer from './components/order-filter-drawer/index.vue'
import { resetQueryForm } from '@/utils'

// @ts-ignore
defineOptions({
  name: 'SelfBuildOrder'
})
const { wsCache } = useCache()
const { push } = useRouter()
const activeIndex = ref('1')
const leafAreaFlag = ref(wsCache.get('leafAreaFlag'))
const tableData = ref()
const total = ref(0)
const tableRef = ref()
const loading = ref(false)
const isAccurate = ref(true)
const queryFormDefault = {
  accurateSearch: undefined,
  staff: undefined,
  search: undefined,
  id: undefined,
  status: undefined,
  orderByColumn: undefined,
  asc: undefined,
  pageNum: 1,
  pageSize: 20
}

const queryForm = reactive<any>({ ...queryFormDefault })

const filterKeyCount = ref(0)

const accurateSearch = () => {
  queryForm.search = undefined
  getTableList(null)
}

const resetTable = () => {
  resetQueryForm(queryForm, { pageNum: 1, pageSize: 20 })
  getTableList(null)
}

async function getTableList(filterForm?) {
  if (filterForm) {
    // queryForm.keyword = undefined
    // Object.keys(queryForm).forEach((key) => {
    //   delete queryForm[key]
    // })
    Object.assign(queryForm, filterForm)
    // 排除空字符串，空数组，undefined
    const cleanObj = Object.keys(filterForm)
      .filter((key) => {
        const value = filterForm[key]
        return value !== null && value !== undefined && value !== '' && (!Array.isArray(value) || (Array.isArray(value) && value.length > 0))
      })
      .reduce((result, key) => {
        result[key] = filterForm[key]
        return result
      }, {})
    filterKeyCount.value = Object.keys(cleanObj).length - 4
  }
  try {
    loading.value = true
    const res = await getStaffInfoPage(queryForm)
    getStatusCountList()
    tableData.value = res.data.list
    total.value = res.data.total
    loading.value = false
  } catch (error) {
    loading.value = false
  }
}

const multipleSelection = ref<any>([])
const handleSelectionChange = (val: any) => {
  multipleSelection.value = val
}

const handleSortChange = (column: any) => {
  if (column.order) {
    queryForm.orderByColumn = column.prop
    queryForm.asc = column.order == 'ascending' ? 0 : 1
  } else {
    queryForm.orderByColumn = undefined
    queryForm.asc = undefined
  }
  getTableList(null)
}

const filterRef = ref()
function showFilterDialog() {
  filterRef.value.show()
  changeAccurate()
}

const changeAccurate = () => {
  isAccurate.value = !isAccurate.value
}

const exportRef = ref()
function showExportDialog() {
  exportRef.value.show()
}

const statusList = ref<any>([])
async function getStatusCountList() {
  const res = await getStaffInfoStatusStat(queryForm)
  statusList.value = res.data
}
const changeStatus = (status) => {
  queryForm.status = status
  filterRef.value.setStatus(status)
  getTableList(null)
}

function detail(row) {
  push(`/serviceStaffAPP/selfOrderDetail?id=${row.id}`)
}

function edit(row) {
  push(`/serviceStaffAPP/selfOrderEdit?id=${row.id}`)
}

const verifyDelete = (ids) => {
  ElMessageBox.confirm('', '确定删除自建订单数据？')
    .then(async () => {
      const { data } = await verifyDeleteOrder(ids)
      if (data.delete && data.part) {
        del(ids)
      } else {
        ElMessageBox.confirm(data.msg, '系统提示')
          .then(() => {
            if (data.part) {
              del(ids)
              return
            }
          })
          .catch(() => {
            // catch error
          })
      }
    })
    .catch(() => {
      // catch error
    })
}

// 删除订单
async function del(ids) {
  const res: any = await staffInfoRemove(ids)
  if (res.code === 200) {
    ElMessage.success('删除成功')
    getTableList(null)
  }
}

// 批量删除订单
async function delBatch() {
  if (!queryForm.status) {
    ElMessageBox.confirm('全部状态下，不可删除订单，请重新选择！', '系统提示')
    return
  }
  let idList = tableRef.value.getSelectionRows()
  if (!idList.length) {
    return ElMessage.error('请先选择要删除的订单')
  }
  let ids = idList.map((obj) => obj.id).join(',')

  verifyDelete(ids)
}

const verifyCancel = async (ids) => {
  ElMessageBox.confirm('', '确定取消自建订单数据？')
    .then(async () => {
      const { data } = await verifyCancelOrder(ids)
      if (data.flag && data.part) {
        cancel(ids)
      } else {
        ElMessageBox.confirm(data.msg, '系统提示')
          .then(() => {
            if (data.part) {
              cancel(ids)
              return
            }
          })
          .catch(() => {
            // catch error
          })
      }
    })
    .catch(() => {
      // catch error
    })
}

// 删除订单
async function cancel(ids) {
  const res: any = await cancelOrder(ids)
  if (res.code === 200) {
    ElMessage.success('取消成功')
    getTableList(null)
  }
}

function cancelBath() {
  let idList = tableRef.value.getSelectionRows()
  if (!idList.length) {
    return ElMessage.error('请先选择要取消的订单')
  }
  let ids = idList.map((obj) => obj.id).join(',')
  ElMessageBox.confirm('订单将变为“已取消”状态（请注意是否需要补充新的订单），是否确认取消?', '确定取消订单')
    .then(() => {
      verifyCancel(ids)
    })
    .catch(() => {})
}

onMounted(() => {
  getTableList(null)
})
</script>
<style scoped lang="less">
.status-list {
  display: flex;
  margin: 16px 0 20px;
  font-size: 14px;
  color: #666462;
  :hover {
    color: var(--el-color-primary);
  }
  .status-item {
    cursor: pointer;
    text-align: center;
    margin-right: 16px;
    > p {
      line-height: 16px;
      display: inline;
    }
  }
  .status-active {
    color: var(--el-color-primary);
    font-weight: bold;
  }
}

@media (max-width: 1600px) {
  .status-list .status-item p {
    display: block;
  }
}
</style>
