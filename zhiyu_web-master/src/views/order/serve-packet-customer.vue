2
<template>
  <div>
    <el-card shadow="never" class="card">
      <template #header>
        <div class="card-header">
          <span class="title">服务包客户管理</span>
        </div>
      </template>

      <div class="query-form">
        <el-space wrap :size="12">
          <el-input v-model="queryForm.keyword" placeholder="搜索姓名/证件号码/联系电话/服务包名称" style="width: 300px" @change="getTableList">
            <template #suffix>
              <el-icon @click="getTableList"><search /></el-icon>
            </template>
          </el-input>
          <DictSelect v-model="queryForm.usingStatus" :distList="filterDict('serve_packet_using_status')" placeholder="状态" :clearable="true" />
          <DictSelect v-model="queryForm.servePacketUsingStatus" :distList="filterDict('serve_packet_using_status')" placeholder="服务包状态" :clearable="true" />
          <el-button type="primary" @click="getTableList">查询</el-button>
          <el-button @click="reset">重置</el-button>
        </el-space>
      </div>

      <el-table
        :data="tableData"
        ref="tableRef"
        header-row-class-name="table-header"
        @sort-change="handleSortChange"
        v-loading="loading"
        class-name="table-without-border list-page-table"
        height="calc(100vh - 310px)"
      >
        <el-table-column type="selection" width="40" />
        <el-table-column fixed="left" type="index" label="序号" width="60" />
        <el-table-column fixed="left" label="操作" width="80" class-name="table-operation">
          <template #default="{ row }">
            <el-button link type="primary" @click="detail(row)" :disabled="getAuth('order:serverPacketCustomer:detail') || !leafAreaFlag"> 查看 </el-button>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="customerName" label="姓名" min-width="140" />
        <el-table-column show-overflow-tooltip prop="idcard" label="证件号码" min-width="180" />
        <el-table-column show-overflow-tooltip prop="mobilephone" label="联系电话" min-width="120" />
        <el-table-column show-overflow-tooltip prop="usingStatus" label="状态" min-width="100">
          <template #default="{ row }">
            <span class="not-bound" v-if="row.usingStatus === '1'">未使用</span>
            <span class="bound" v-else-if="row.usingStatus === '2'">使用中</span>
            <span class="void" v-else-if="row.usingStatus === '3'">停止使用</span>
          </template>
        </el-table-column>
        <el-table-column prop="servePacketName" label="服务包名称" min-width="200" show-overflow-tooltip />
        <el-table-column show-overflow-tooltip prop="balance" label="当前余额" min-width="110" />
        <!-- <el-table-column show-overflow-tooltip prop="lastMonthMoney" label="次月余额（预估）" min-width="140" /> -->
        <el-table-column show-overflow-tooltip prop="servePacketUsingStatus" label="服务包状态" min-width="180">
          <template #default="{ row }">
            <span class="not-bound" v-if="row.servePacketUsingStatus === '1'">未使用</span>
            <span class="bound" v-else-if="row.servePacketUsingStatus === '2'">使用中</span>
            <span class="void" v-else-if="row.servePacketUsingStatus === '3'">停止使用</span>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="remark" label="备注" min-width="180" />
        <el-table-column show-overflow-tooltip prop="updateTime" label="更新时间" min-width="180" />
      </el-table>
      <div style="margin-top: 20px">
        <el-pagination
          v-model:current-page="queryForm.pageNum"
          v-model:page-size="queryForm.pageSize"
          :page-sizes="[10, 20, 50, 100, 200, 500]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="getTableList"
          @current-change="getTableList"
        />
      </div>
    </el-card>
  </div>
</template>
<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import DictSelect from '/@/components/DictSelect/index.vue'
import { useCache } from '@/hooks/web/useCache'
import { getAuth } from '@/utils/export'
import { servePacketCustomerPage } from '@/api/servePacket'
import { filterDict } from '@/hooks/web/useDict'

// @ts-ignore
defineOptions({
  name: 'ServePacketCustomer'
})
const { wsCache } = useCache()

const { push } = useRouter()

function detail(row) {
  push(`/order/servePacketCustomerDetail?id=${row.id}`)
}

const leafAreaFlag = ref(wsCache.get('leafAreaFlag'))

const queryFormDefault = {
  keyword: undefined,
  usingStatus: undefined,
  servePacketUsingStatus: undefined,
  pageNum: 1,
  pageSize: 20,
  orderByColumn: undefined,
  asc: undefined
}
const queryForm = reactive<any>({ ...queryFormDefault })

const loading = ref(false)
const tableData = ref()
const total = ref(0)
const tableRef = ref()

async function getTableList() {
  loading.value = true
  const { data } = await servePacketCustomerPage(queryForm)
  tableData.value = data.list
  total.value = data.total
  loading.value = false
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

const reset = () => {
  Object.assign(queryForm, queryFormDefault)
  getTableList()
}

onMounted(() => {
  getTableList()
})
</script>
<style>
.el-card {
  border: 0 !important;
}
.el-card__header {
  padding: 0 0 10px 0;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.extra-query-form {
  background-color: #f7f8fa;
  padding: 20px;
  margin: 10px 0;
}
.el-col-md-24 {
  margin-top: 20px;
}
</style>
<style scoped lang="less">
.filter-box {
  height: 275px;
  overflow: hidden;
  transition: height 0.5s ease-in-out;
}
.show-filter {
  height: 0;
}
:deep(.el-select__wrapper) {
  min-width: 150px;
}
</style>
