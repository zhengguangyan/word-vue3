<template>
  <p class="title" style="font-weight: bold; margin-bottom: 10px">更新记录</p>

  <el-table
    :data="tableData"
    header-row-class-name="table-header"
    :style="{
      height: 'calc(100vh - 398px)',
      border: '1px solid #f5f3f0',
      borderRadius: '8px'
    }"
  >
    <el-table-column show-overflow-tooltip prop="logDate" label="操作时间" width="200" />
    <el-table-column show-overflow-tooltip prop="sourceType" label="来源" width="160">
      <template #default="{ row }">
        {{ renderDict(row.sourceType, 'memberCard_channel') }}
      </template>
    </el-table-column>
    <el-table-column show-overflow-tooltip prop="creatorName" label="操作者" width="160" />
    <el-table-column show-overflow-tooltip prop="organization" label="组织" width="160" />
    <el-table-column show-overflow-tooltip prop="logPage" label="页面" width="160" />
    <el-table-column show-overflow-tooltip prop="logAction" label="操作" width="160" />
    <el-table-column show-overflow-tooltip prop="logDescriptions" label="操作描述" min-width="450" />
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
import { watch, ref } from 'vue'
import { getUpdateCustomerPage } from '@/api/customer/index'
import { reactive } from 'vue'

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
const total = ref(0)
const queryFormDefault = {
  pageNum: 1,
  pageSize: 20
}
const queryForm = reactive({ ...queryFormDefault })

const tableData = ref([])

async function queryInfo() {
  const res = await getUpdateCustomerPage({ customerId: props.customerId, ...queryForm })
  if (res) {
    tableData.value = res.data.list
    total.value = res.data.total
  }
}

const changeSize = () => {
  queryForm.pageNum = 1
  queryInfo()
}
watch(
  () => props.customerId,
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
</script>

<style scoped lang="less">
:deep(.el-table__cell) {
  text-align: center;
}
</style>
