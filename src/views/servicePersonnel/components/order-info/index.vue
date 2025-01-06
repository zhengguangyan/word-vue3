<template>
  <p class="title" style="font-weight: bold; margin-bottom: 10px">订单信息</p>
  <div class="query-form">
    <el-space wrap :size="12">
      <el-input
        v-model="queryForm.keyword"
        style="width: 250px"
        placeholder="精确搜索订单编号/服务项目/服务子项/评价内容"
      >
        <template #suffix>
          <el-icon><search /></el-icon>
        </template>
      </el-input>
      <el-date-picker
        v-model="queryForm.time"
        type="daterange"
        range-separator="-"
        start-placeholder="服务开始时间"
        end-placeholder="服务结束时间"
        value-format="YYYY-MM-DD"
        clearable
        style="width: 100%"
        @change="changeTime"
      />
      <DictSelect
        clearable
        v-model="queryForm.statusCode"
        :distList="filterDict('order_status')"
        style="width: 100%"
      />
      <el-button type="primary" @click="queryInfo">查询</el-button>
      <el-button @click="reset">重置</el-button>
    </el-space>
  </div>
  <el-table
    class-name="table-without-border"
    :data="tableData"
    header-row-class-name="table-header"
    :style="{
      height: 'calc(100vh - 448px)',
      border: '1px solid #f5f3f0',
      borderRadius: '4px'
    }"
  >
    <el-table-column fixed="left" label="操作" width="120" class-name="table-operation">
      <template #default="{ row }">
        <el-button link type="primary" @click="orderDetail(row)"> 查看详情 </el-button>
      </template>
    </el-table-column>
    <el-table-column show-overflow-tooltip prop="id" label="订单编码" width="200" />
    <el-table-column show-overflow-tooltip prop="statusCode" label="订单状态" width="160">
      <template #default="{ row }">
        {{ renderDict(row.statusCode, 'order_status') }}
      </template>
    </el-table-column>
    <el-table-column show-overflow-tooltip prop="updateTime" label="状态变更时间" width="160" />
    <el-table-column show-overflow-tooltip prop="serveTime" label="服务开始时间" width="160" />
    <el-table-column show-overflow-tooltip prop="serveName" label="服务项目" width="160" />
    <el-table-column show-overflow-tooltip prop="serveOptionName" label="服务子项" width="160" />
    <el-table-column show-overflow-tooltip prop="finalNumber" label="服务子数量项" width="160" />
    <el-table-column show-overflow-tooltip prop="serveQuality" label="评价量级" width="160" />
    <el-table-column prop="content" label="评价内容" min-width="350" show-overflow-tooltip />
  </el-table>
  <div style="margin-top: 20px">
    <el-pagination
      v-model:current-page="queryForm.pageNum"
      v-model:page-size="queryForm.pageSize"
      :page-sizes="[10, 20, 50, 100, 200]"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="changeSize()"
      @current-change="queryInfo()"
    />
  </div>
</template>
<script lang="ts" setup>
import DictSelect from '@/components/DictSelect/index.vue'
import { watch, ref } from 'vue'
import { reactive } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { resetQueryForm } from '@/utils'
import { getOrderPage } from '@/api/order'
import { useRouter } from 'vue-router'
const { push } = useRouter()

const props = defineProps({
  operatorSellerId: {
    type: Number,
    default: null
  },
  dict: {
    type: Array,
    default: null
  }
})
const total = ref(0)

const queryForm = reactive({
  keyword: undefined,
  time: [],
  serveBeginTime: undefined,
  serveEndTime: undefined,
  statusCode: undefined,
  pageNum: 1,
  pageSize: 20
})

const tableData = ref([])

async function queryInfo() {
  const res = await getOrderPage({ operatorSellerId: props.operatorSellerId, ...queryForm })
  if (res) {
    tableData.value = res.data.list
    total.value = res.data.total
  }
}

const changeTime = () => {
  if (queryForm.time.length) {
    queryForm.serveBeginTime = queryForm.time[0]
    queryForm.serveEndTime = queryForm.time[1]
  }
}

const changeSize = () => {
  queryForm.pageNum = 1
  queryInfo()
}

watch(
  () => props.operatorSellerId,
  (e) => {
    if (e) {
      queryInfo()
    }
  },
  { immediate: true }
)

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

const orderDetail = (row) => {
  push(`/order/orderDetail?id=${row.id}`)
}

const reset = () => {
  resetQueryForm(queryForm, { pageNum: 1, pageSize: 20 })
  queryInfo()
}
</script>

<style scoped lang="less">
.query-form {
  margin-bottom: 12px;
}
:deep(.el-input__wrapper) {
  min-width: 150px !important;
}
:deep(.el-select__wrapper) {
  min-width: 150px !important;
}
</style>
