<template>
  <div>
    <el-card shadow="never" class="card">
      <template #header>
        <div class="card-header">
          <span class="title">订单列表</span>
        </div>
      </template>
      <div class="order-top r-m-t-20">
        <el-input
          v-model="queryForm.keyword"
          placeholder="联系电话/下单会员/订单编号/联系人/联系人电话/服务商/归属项目名称(成功包)/服务人员/优惠/服务工单号/服务包"
          style="width: 900px"
          @change="accurateSearch"
          clearable
        >
          <template #suffix>
            <el-icon @click="accurateSearch"><search /></el-icon>
          </template>
        </el-input>
        <el-link class="filter-button" :icon="Filter" type="primary" @click="showFilterDialog">
          高级筛选
          <span v-if="filterKeyCount > 0">({{ filterKeyCount }})</span>
        </el-link>
      </div>

      <OrderFilterDrawer :dict="dictMap" ref="filterRef" :activeIndex="activeIndex" @reload-list="getTableList" @reset-list="resetTable" @change-accurate="changeAccurate" />
      <div class="status-list">
        <div class="status-item status-all" :class="{ 'status-active': !queryForm.statusCode }" @click="changeStatus(undefined)">
          <p>全部状态</p>
          <p>({{ statusList.find((item) => item.statusCode === '')?.statusSum || 0 }})</p>
        </div>
        <div class="status-item" v-for="item in statusList" :key="item.statusCode" :class="{ 'status-active': queryForm.statusCode == item.statusCode }" @click="changeStatus(item.statusCode)">
          <p v-if="item.statusCode">
            {{ radioDict(item.statusCode, 'order_status') }}
          </p>
          <p v-if="item.statusCode">({{ item.statusSum || 0 }})</p>
        </div>
      </div>
      <div class="query-form flex row-between">
        <el-space wrap :size="12">
          <el-button type="primary" @click="addOrder" :disabled="!leafAreaFlag || getAuth('order:index:add')"> 添加 </el-button>
          <el-button v-if="leafAreaFlag" :disabled="!leafAreaFlag || getAuth('order:index:delete')" plain @click="delBatch">
            删除
            <el-tooltip effect="dark" placement="right-start">
              <template #content>
                不可删除订单包括：<br />
                1、订单来源为“小程序商城”和“商城后台”的非“已取消”状态的订单；<br />
                2、订单来源为“小程序商城”，订单字段“是否上门服务”为否的订单<br />
                3、订单来源为“平台”，订单字段“是否有抽成”为是，<br />
                且订单状态为“服务开始”之后（包含）的订单<br />
                4、订单来源为“市平台” 的订单
              </template>
              <span class="iconfont icon-biaoqian-mian r-m-l-3"></span>
            </el-tooltip>
          </el-button>

          <el-button @click="showExportDialog" :disabled="getAuth('order:index:export')">导出</el-button>
        </el-space>
        <div v-if="allMoney" class="r-font-14"
          >服务商订单总金额 <span style="color: red"> {{ allMoney }} </span> 元</div
        >
      </div>
      <el-table
        :data="tableData"
        ref="tableRef"
        header-row-class-name="table-header"
        class-name="table-without-border list-page-table"
        @selection-change="handleSelectionChange"
        v-loading="loading"
        @sort-change="handleSortChange"
        height="calc(100vh - 400px)"
      >
        <el-table-column type="selection" width="40" />
        <el-table-column fixed="left" label="操作" width="150" class-name="table-operation">
          <template #default="{ row }">
            <el-button link type="primary" @click="detail(row)" :disabled="getAuth('order:index:detail')"> 查看 </el-button>
            <el-button link type="primary" @click="openEdit(row)" :disabled="!leafAreaFlag || getAuth('order:index:edit')"> 编辑 </el-button>
            <!-- source1：商城后台，2：app，3：平台,4：市平台，5：小程序商城；governmentOrder=1有抽成；订单状态为服务开始（包含）之后：statusCode >=6  -->
            <el-button
              v-if="leafAreaFlag"
              link
              type="primary"
              :disabled="
                !leafAreaFlag ||
                getAuth('order:index:delete') ||
                (['1', '5'].includes(row.source) && Number(row.statusCode) !== 11) ||
                (row.source === '5' && !row.shangmenUserName) ||
                (Number(row.statusCode) >= 6 && row.source === '3' && row.governmentOrder === '1') ||
                row.source === '4'
              "
              @click="verifyDelete(row.id)"
              >删除</el-button
            >
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="serveTime" label="服务时间" width="180" sortable="custom">
          <template #default="{ row }">
            {{ formatDateString(row.serveTime) }}
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="statusCode" label="订单状态" width="110" sortable="custom">
          <template #default="{ row }">
            {{ radioDict(row.statusCode, 'order_status') }}
          </template>
        </el-table-column>
        <el-table-column prop="memberName" label="下单会员" width="120" show-overflow-tooltip sortable="custom" />
        <el-table-column prop="contactman" label="联系人" width="120" show-overflow-tooltip sortable="custom" />
        <el-table-column show-overflow-tooltip prop="mobilephone" label="联系人电话" width="180" sortable="custom">
          <template #default="{ row }">
            {{ maskPhoneNumber(row.mobilephone) }}
          </template>
        </el-table-column>
        <el-table-column prop="address" label="联系人地址" width="380" sortable="custom" show-overflow-tooltip />
        <el-table-column show-overflow-tooltip prop="money" label="订单金额" width="180" sortable="custom" />
        <el-table-column show-overflow-tooltip prop="operatorSellerName" label="服务人员" width="180" sortable="custom" />
        <el-table-column show-overflow-tooltip prop="sellerName" label="服务商" width="180" sortable="custom" />
        <el-table-column show-overflow-tooltip prop="serveNo" label="服务工单号" width="180" sortable="custom" />
        <el-table-column show-overflow-tooltip prop="source" label="来源" width="180" sortable="custom">
          <template #default="{ row }">
            {{ renderDict(row.source, 'order_source') }}
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="orderTime" label="下单时间" width="180" sortable="custom">
          <template #default="{ row }">
            {{ formatDateString(row.orderTime) }}
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="creatorName" label="创建人" width="180" sortable="custom" />
        <el-table-column show-overflow-tooltip prop="isClosed" label="是否结案" width="110" sortable="custom">
          <template #default="{ row }">
            {{ renderDict(row.isClosed, 'yes_no') }}
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="categoryName" label="服务类别" width="180" sortable="custom" />
        <el-table-column show-overflow-tooltip prop="serveName" label="服务项目" width="180" sortable="custom" />
        <el-table-column show-overflow-tooltip prop="platformReceipts" label="平台收款" width="180" sortable="custom" />
        <!-- <el-table-column show-overflow-tooltip prop="subsidyStandard" label="政府补助标准" width="180">
          <template #default="{ row }">
            {{ radioDict(row.subsidyStandard, 'subsidy_standard') }}
          </template>
        </el-table-column> -->
        <el-table-column prop="remark" label="备注" width="200" show-overflow-tooltip sortable="custom" />
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
  <OrderExportDialog ref="exportRef" :multipleSelection="multipleSelection" :queryForm="queryForm" :loading="exportLoading" title="订单列表" />
  <OrderInfoFormDialog ref="editRef" @reload-list="getTableList(null)" />
</template>
<script setup lang="ts">
import { useCache } from '@/hooks/web/useCache'
import { ref, reactive, onMounted } from 'vue'
import { Filter, PriceTag } from '@element-plus/icons-vue'
import { Search } from '@element-plus/icons-vue'
import { formatDateString, maskPhoneNumber, resetQueryForm } from '@/utils'
import { getOrderPage, getStatusCount, removeOrder, verifyDeleteOrder, orderGetAllmoney } from '@/api/order/index'
import { useRouter } from 'vue-router'
import OrderExportDialog from './components/order-export-dialog/index.vue'
import OrderFilterDrawer from './components/order-filter-drawer/index.vue'
import { getAuth } from '@/utils/export'
import { ElMessage, ElMessageBox } from 'element-plus'
import OrderInfoFormDialog from './components/order-info-form-dialog/index.vue'
import { dictMap, filterDict, renderDict } from '@/hooks/web/useDict'
// @ts-ignore
defineOptions({
  name: 'OrderIndex'
})

const { wsCache } = useCache()
const { push } = useRouter()
const activeIndex = ref('1')
// const searchIcon = useIcon({ icon: 'ant-design:search-outlined' })
const leafAreaFlag = ref(wsCache.get('leafAreaFlag'))
// const xiamenFlag = ref(wsCache.get('xiamenFlag'))

const tableData = ref()
const total = ref(0)
const tableRef = ref()
const loading = ref(false)
const exportLoading = ref(false)
const isAccurate = ref(true)
const queryFormDefault = {
  keyword: undefined,
  accurateSearch: undefined,
  search: undefined,
  id: undefined,
  statusCode: undefined,
  orderByColumn: undefined,
  asc: undefined,
  pageNum: 1,
  pageSize: 20
}
const queryForm = reactive<any>({ ...queryFormDefault })
const filterKeyCount = ref(0)

const accurateSearch = () => {
  queryForm.search = undefined
  filterKeyCount.value = 0
  filterRef.value.resetValue()
  getTableList(null)
}

const resetTable = () => {
  resetQueryForm(queryForm, { pageNum: 1, pageSize: 20 })
  getTableList(null)
}

async function getTableList(filterForm) {
  if (filterForm) {
    queryForm.accurateSearch = undefined
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
  loading.value = true
  // 选择了服务商搜索
  if (queryForm.sellerId && queryForm.sellerId.length) {
    getAllMoney(queryForm)
  } else {
    allMoney.value = 0
  }

  try {
    const res = await getOrderPage(queryForm)
    if (res) {
      tableData.value = res.data.list
      total.value = res.data.total
    }
    getStatusCountList()
    loading.value = false
  } catch (error) {
    loading.value = false
  }
}
const allMoney = ref(0)
const getAllMoney = async (queryForm) => {
  const { data } = await orderGetAllmoney(queryForm)
  allMoney.value = data
}

const radioDict = (key: any, dict: any) => {
  if (!key) {
    return
  }
  return filterDict(dict)
    ?.filter((item: any) => item.value == key)
    .map((item: any) => item?.label)
    .join('，')
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

function addOrder() {
  push(`/service/add?serviceType=order`)
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

function detail(row) {
  push(`/order/orderDetail?id=${row.id}`)
}

const statusList = ref<any>([])
async function getStatusCountList() {
  const res = await getStatusCount(queryForm)
  statusList.value = res.data
}

const changeStatus = (status) => {
  queryForm.statusCode = status
  filterRef.value.setStatus(status)
  getTableList(null)
}

const verifyDelete = async (ids) => {
  ElMessageBox.confirm('', '确认删除订单数据？')
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
  const res: any = await removeOrder(ids)
  if (res.code === 200) {
    ElMessage.success('删除成功')
    getTableList(null)
  }
}

// 批量删除订单
async function delBatch() {
  let idList = tableRef.value.getSelectionRows()
  if (!idList.length) {
    return ElMessage.error('请先选择要删除的数据')
  }
  let ids = idList.map((obj) => obj.id).join(',')

  verifyDelete(ids)
  // let ids = multipleSelection.value.join(',')
  // const res: any = await removeOrder(ids)
  // if (res.code === 200) {
  //   ElMessage.success('删除成功')
  //   getTableList(null)
  // }
}

const editRef = ref()

const openEdit = (data) => {
  editRef.value.show(data)
}

onMounted(() => {
  getTableList(null)
})
</script>
<style scoped lang="less">
.order-top {
  display: flex;
  // margin-bottom: 16px;
  .filter-button {
    flex-shrink: 0;
    margin-left: 20px;
  }
}
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
  .status-all {
    margin-right: 0;
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
