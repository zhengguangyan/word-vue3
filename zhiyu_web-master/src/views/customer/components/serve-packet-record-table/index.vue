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
    <el-table-column fixed="left" label="操作" width="100" class-name="table-operation">
      <template #default="{ row }">
        <el-button link type="primary" @click="detail(row)" :disabled="getAuth('order:servePacket:detail')"> 查看 </el-button>
      </template>
    </el-table-column>
    <el-table-column show-overflow-tooltip prop="servePacketNo" label="服务包编号" width="200" />
    <el-table-column show-overflow-tooltip prop="servePacketName" label="服务包名称" width="180" />
    <el-table-column show-overflow-tooltip prop="servePacketFinishStatus" label="结案状态" min-width="120">
      <template #default="{ row }">
        <span class="not-bound" v-if="row.servePacketFinishStatus === '1'">未结案</span>
        <span class="not-bound" v-if="row.servePacketFinishStatus === '2'">到期待结案</span>
        <span class="bound" v-else-if="row.servePacketFinishStatus === '3'">结案</span>
      </template>
    </el-table-column>
    <el-table-column show-overflow-tooltip prop="servePacketUsingStatus" label="服务包状态" min-width="100">
      <template #default="{ row }">
        <span class="not-bound" v-if="row.servePacketUsingStatus === '1'">未使用</span>
        <span class="bound" v-else-if="row.servePacketUsingStatus === '2'">使用中</span>
        <span class="void" v-else-if="row.servePacketUsingStatus === '3'">停止使用</span>
      </template>
    </el-table-column>
    <el-table-column show-overflow-tooltip prop="balance" label="余额" width="180" />
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
  <OtherServePacketFormDialog ref="otherServePacketFormDialog" @reload-list="getTableList" />
  <OtherServePacketDetailDialog ref="otherServePacketDetailDialog" />
</template>
<script lang="ts" setup>
import { watch, ref, reactive } from 'vue'
import { servePacketCustomerPage } from '@/api/servePacket'
import { getAuth } from '@/utils/export'
import { useRouter } from 'vue-router'
import OtherServePacketFormDialog from '@/views/order/components/other-serve-packet-form-dialog/index.vue'
import OtherServePacketDetailDialog from '@/views/order/components/other-serve-packet-detail-dialog/index.vue'

const { push } = useRouter()

// const leafAreaFlag = ref(wsCache.get('leafAreaFlag'))

const otherServePacketFormDialog = ref()

const otherServePacketDetailDialog = ref()
function detail(row) {
  push(`/order/servePacketCustomerDetail?id=${row.id}`)
  // if (row.type === 'open') {
  // } else {
  //   otherServePacketDetailDialog.value.show(row)
  // }
}

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
  const res = await servePacketCustomerPage(queryForm)
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
