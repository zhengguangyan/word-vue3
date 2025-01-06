<template>
  <el-table
    :data="tableData"
    header-row-class-name="table-header"
    :style="{
      height: 'calc(100vh - 398px)',
      border: '1px solid #f5f3f0',
      borderRadius: '8px'
    }"
    v-loading="loading"
    @sort-change="handleSortChange"
  >
    <el-table-column fixed="left" label="序号" type="index" width="60" />
    <el-table-column fixed="left" label="操作" width="110" class-name="table-operation">
      <template #default="scope">
        <el-button link type="primary" @click="detail(scope.row)" :disabled="getAuth('staffAPP:selfOrder:detail')"> 查看 </el-button>
        <el-button link type="primary" @click="edit(scope.row)" :disabled="!leafAreaFlag || getAuth('staffAPP:selfOrder:edit') || scope.row.deathFlag == '0'"> 编辑 </el-button>
      </template>
    </el-table-column>
    <el-table-column show-overflow-tooltip prop="orderNumber" label="订单号" width="180" />
    <el-table-column show-overflow-tooltip prop="workNumber" label="工单号" width="160" />
    <el-table-column prop="status" label="订单状态" width="140" show-overflow-tooltip sortable="custom">
      <template #default="{ row }">
        {{ renderDict(row.status, 'staff_status') }}
      </template>
    </el-table-column>
    <el-table-column show-overflow-tooltip prop="serveName" label="服务项目内容" width="200" />
    <el-table-column prop="sellerName" label="服务商（所属组织）" show-overflow-tooltip width="150" />
    <el-table-column show-overflow-tooltip prop="operatorName" label="服务人员" width="120" />
    <el-table-column show-overflow-tooltip prop="reviewName" label="审核人员" width="120" />
    <el-table-column show-overflow-tooltip prop="reviewTime" label="审核时间" width="180" />
    <el-table-column show-overflow-tooltip prop="hasReturn" label="订单回访" width="120" />
    <el-table-column show-overflow-tooltip prop="hasOrder" label="订单评价" width="120" />
    <el-table-column show-overflow-tooltip prop="hasVoice" label="语音评价" width="120" />
    <el-table-column show-overflow-tooltip prop="serNumber" label="服务项目数量" width="120" />
    <el-table-column show-overflow-tooltip prop="serveDuration" label="服务时长" width="120" />
    <el-table-column show-overflow-tooltip prop="money" label="金额" width="120" />
  </el-table>
  <div style="margin-top: 20px">
    <el-pagination
      v-model:current-page="queryForm.pageNum"
      v-model:page-size="queryForm.pageSize"
      :page-sizes="[10, 20, 50, 100, 200]"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="changeSize()"
      @current-change="getTableList()"
    />
  </div>
</template>
<script lang="ts" setup>
import { watch, ref, reactive } from 'vue'
import { getStaffInfoPage } from '@/api/serviceStaffAPP/index'
import { getAuth } from '@/utils/export'
import { useCache } from '@/hooks/web/useCache'
import { useRouter } from 'vue-router'
const { wsCache } = useCache()
const { push } = useRouter()

const leafAreaFlag = ref(wsCache.get('leafAreaFlag'))

const props = defineProps({
  customerId: {
    type: Number,
    default: null
  },
  dict: {
    type: Array,
    default: null
  }
})

function detail(row) {
  push(`/serviceStaffAPP/selfOrderDetail?id=${row.id}`)
}

function edit(row) {
  push(`/serviceStaffAPP/selfOrderEdit?id=${row.id}`)
}

const queryFormDefault = {
  memberId: props.customerId,
  pageNum: 1,
  pageSize: 20,
  orderByColumn: undefined,
  asc: undefined as undefined | number
}
const queryForm = reactive<any>({ ...queryFormDefault })

const loading = ref(false)
const tableData = ref()
const total = ref(0)

async function getTableList() {
  loading.value = true
  const res = await getStaffInfoPage(queryForm)
  tableData.value = res.data.list
  total.value = res.data.total
  loading.value = false
}

const changeSize = () => {
  queryForm.pageNum = 1
  getTableList()
}

const handleSortChange = (column: any) => {
  if (column.order) {
    queryForm.orderByColumn = column.prop
    queryForm.asc = column.order == 'ascending' ? 0 : 1
  } else {
    queryForm.orderByColumn = undefined
    queryForm.asc = undefined
  }
  getTableList()
}

const filterDict = (key: any) => {
  return (props.dict.find((item: any) => item.type == key) as any)?.list
}
const renderDict = (key: any, dict: any) => {
  if (!key) {
    return
  }
  return filterDict(dict)
    ?.filter((item: any) => key.includes(item.value))
    .map((item: any) => item?.label)
    .join('，')
}

watch(
  () => props.customerId,
  (e) => {
    if (e) {
      getTableList()
    }
  },
  { immediate: true }
)
</script>

<style scoped lang="less">
:deep(.el-table__cell) {
  text-align: center;
}
</style>
