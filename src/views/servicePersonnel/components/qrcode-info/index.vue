<template>
  <p class="title" style="font-weight: bold; margin-bottom: 10px">二维码记录</p>

  <el-table
    :data="tableData"
    header-row-class-name="table-header"
    :style="{
      height: 'calc(100vh - 398px)',
      border: '1px solid #f5f3f0',
      borderRadius: '8px'
    }"
  >
    <el-table-column show-overflow-tooltip prop="millTime" label="扫描时间" min-width="160" />
    <el-table-column show-overflow-tooltip prop="customerInfoName" label="被扫描人" min-width="160" />
    <el-table-column show-overflow-tooltip prop="locationAddress" label="扫描地址" min-width="200" />
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
import { reactive } from 'vue'
import { getQrRecordPage } from '@/api/servicePersonnel'

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
  const res = await getQrRecordPage({ customerInfoId: props.customerId, ...queryForm })
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

</script>

<style scoped lang="less">
:deep(.el-table__cell) {
  text-align: center;
}
</style>
