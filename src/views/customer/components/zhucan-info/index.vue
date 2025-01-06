<template>
  <div>
    <el-table
      :data="tableData"
      max-height="70vh"
      v-loading="loading"
    >
      <el-table-column label="" type="index" width="50" align="center" fixed="left" />
      <el-table-column show-overflow-tooltip label="助餐站点" prop="stationName" width="160" sortable="custom"></el-table-column>
      <el-table-column show-overflow-tooltip label="菜单名" width="140" prop="serveName" sortable="custom"></el-table-column>
      <el-table-column show-overflow-tooltip label="就餐方式" width="120" prop="eatModel" sortable="custom">
        <template #default="{ row }">{{renderDict(row.eatModel, 'eat_model')}}</template>
      </el-table-column>
      <el-table-column show-overflow-tooltip label="商品数量" width="120" prop="count" sortable="custom" />
      <el-table-column show-overflow-tooltip label="单价" width="160" prop="totalMoney" sortable="custom" />
      <el-table-column show-overflow-tooltip label="补贴金额" width="160" prop="subsidyMoney" sortable="custom" />
      <el-table-column show-overflow-tooltip label="自费金额" width="160" prop="expenseMoney" sortable="custom" />
      <el-table-column show-overflow-tooltip label="自费方式" width="160" prop="expenseModel" sortable="custom">
        <template #default="{ row }">{{renderDict(row.expenseModel, 'expense_model')}}</template>
      </el-table-column>
      <el-table-column show-overflow-tooltip label="是否使用补贴" width="160" prop="hasSubsidy" sortable="custom" />
      <el-table-column show-overflow-tooltip label="补贴名称" width="160" prop="subsidyInfoName" sortable="custom" />
      <el-table-column show-overflow-tooltip label="支付时间" width="150" prop="payTime" sortable="custom">
        <template #default="{ row }">{{row.payTime ? row.payTime.slice(0, 16) : ''}}</template>
      </el-table-column>
      <el-table-column show-overflow-tooltip label="订单编号" width="160" prop="orderNumber" sortable="custom" />
      <el-table-column show-overflow-tooltip label="订单来源" width="120" prop="source" sortable="custom">
        <template #default="{ row }">{{renderDict(row.source, 'station_source')}}</template>
      </el-table-column>
      <el-table-column show-overflow-tooltip label="单据类型" width="160" prop="status" sortable="custom">
        <template #default="{ row }">
          <span v-if="row.status === '1'" class="success-color">{{renderDict(row.status, 'bill_type')}}</span>
          <span v-if="row.status === '2'" class="info-color">{{renderDict(row.status, 'bill_type')}}</span>
          <span v-if="row.status === '3'" class="error-color">{{renderDict(row.status, 'bill_type')}}</span>
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
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { orderPage } from '@/api/zhucan/orders'

const props = defineProps({
  dict: { required: true, type: Array },
  customerId: { required: true, type: Number }
})

onMounted(() => {
  loadData()
})
const loading = ref(false)
const params = reactive({
  memberId: '',
  pageNum: 1,
  pageSize: 10
})
const tableData = ref<any[]>([])
const total = ref(0)

const loadData = async () => {
  try {
    loading.value = true
    params.memberId = props.customerId.toString()
    const { data } = await orderPage(params)
    tableData.value = data.list
    total.value = data.total
  } finally {
    loading.value = false
  }
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
