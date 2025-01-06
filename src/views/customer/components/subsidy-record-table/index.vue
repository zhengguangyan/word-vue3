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
    <el-table-column fixed="left" type="index" label="序号" width="60" />
    <el-table-column fixed="left" label="操作" width="100" class-name="table-operation">
      <template #default="{ row }">
        <el-button link type="primary" @click="detail(row)"> 查看 </el-button>
      </template>
    </el-table-column>
    <el-table-column show-overflow-tooltip prop="no" label="补贴编号" min-width="180" />
    <el-table-column show-overflow-tooltip prop="name" label="补贴名称" min-width="130" />
    <el-table-column show-overflow-tooltip prop="usingStatus" label="补贴状态" min-width="100">
      <!-- <template #default="{ row }">
        <span class="not-bound" v-if="row.usingStatus === '1'">未使用</span>
        <span class="bound" v-else-if="row.usingStatus === '2'">使用中</span>
        <span class="void" v-else-if="row.usingStatus === '3'">停止使用</span>
      </template> -->

      <template #default="{ row }">
        <div :class="usingStatusClass[row.usingStatus]">{{ renderDict(row.usingStatus, 'subsidy_using_status') }}</div>
      </template>
    </el-table-column>
    <el-table-column show-overflow-tooltip prop="subsidyDate" label="合同周期" min-width="140" />
    <el-table-column show-overflow-tooltip prop="finishStatus" label="结案状态" min-width="120">
      <!-- <template #default="{ row }">
        <span class="not-bound" v-if="row.finishStatus === '1'">未结案</span>
        <span class="not-bound" v-if="row.finishStatus === '2'">到期待结案</span>
        <span class="bound" v-else-if="row.finishStatus === '3'">结案</span>
      </template> -->

      <template #default="{ row }">
        <div :class="finishStatusClass[row.finishStatus]">{{ renderDict(row.finishStatus, 'subsidy_finish_status') }}</div>
      </template>
    </el-table-column>
    <el-table-column show-overflow-tooltip prop="subsidyCustomerUsingStatus" label="补贴人员状态" min-width="130">
      <template #default="{ row }">
        <div :class="usingStatusClass[row.subsidyCustomerUsingStatus]">{{ renderDict(row.subsidyCustomerUsingStatus, 'subsidy_using_status') }}</div>
      </template>
    </el-table-column>
    <el-table-column show-overflow-tooltip prop="code" label="卡号" min-width="130" />
    <el-table-column show-overflow-tooltip prop="balance" label="余额" min-width="130" />
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
import { subsidyCustomerPage } from '@/api/subsidy'
import { useRouter } from 'vue-router'
import { renderDict } from '@/hooks/web/useDict'
const { push } = useRouter()
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
const usingStatusClass = ref({
  1: 'not-bound',
  2: 'bound',
  3: 'void'
})
const finishStatusClass = ref({
  1: 'not-bound',
  2: 'not-bound',
  3: 'bound'
})

function detail(row) {
  push(`/subsidy/subsidyDetail?id=${row.subsidyInfoId}`)
}
const queryFormDefault = {
  customerId: props.customerId,
  pageNum: 1,
  pageSize: 20,
  orderByColumn: undefined,
  asc: undefined
}
const queryForm = reactive<any>({ ...queryFormDefault })
const loading = ref(false)
const tableData = ref()
const total = ref(0)

async function getTableList() {
  loading.value = true
  const res = await subsidyCustomerPage(queryForm)
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
