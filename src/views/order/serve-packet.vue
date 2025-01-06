<template>
  <div>
    <el-card shadow="never" class="card">
      <template #header>
        <div class="card-header">
          <span class="title">服务包管理</span>
        </div>
      </template>
      <div>
        <el-space wrap :size="12" class="r-m-t-10">
          <el-dropdown placement="bottom-start" :disabled="!leafAreaFlag || getAuth('order:servePacket:add')">
            <el-button type="primary" :disabled="!leafAreaFlag || getAuth('order:servePacket:add')"> 添加 </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="add">
                  <p class="dropdown-title">开放式</p>
                  <p class="dropdown-desc">金额固定</p>
                </el-dropdown-item>
                <el-dropdown-item divided @click="addOther">
                  <p class="dropdown-title">其他</p>
                  <p class="dropdown-desc">服务固定，金额不固定或其他</p>
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <el-input v-model="queryForm.keyword" placeholder="服务包编号/服务包名称" style="width: 240px" @change="getTableList">
            <template #suffix>
              <el-icon @click="getTableList"><search /></el-icon>
            </template>
          </el-input>
          <DictSelect width="200px" v-model="queryForm.usingStatus" :distList="filterDict('serve_packet_using_status')" placeholder="服务包状态" :clearable="true" />
          <template v-if="!showMore">
            <el-button type="primary" @click="onSubmit">查询</el-button>
            <el-button @click="reset">重置</el-button>
          </template>

          <span class="more-btn" @click="showMore = !showMore">
            <Icon icon="ep:filter" :color="primaryColor" />
            <span class="span">高级搜索</span>
          </span>
        </el-space>

        <div class="advance-filter-box scrollbarHide" :class="{ 'show-filter': showMore }">
          <div class="filter-content-wrapper">
            <div class="customer-filter">
              <div class="filter-row">
                <span class="row-head">结案状态</span>
                <DictSelect clearable width="100%" v-model="queryForm.finishStatus" placeholder="结案状态" :distList="filterDict('serve_packet_finish_status')" />
              </div>
              <div class="filter-row">
                <span class="row-head">合同开始时间</span>
                <el-date-picker
                  v-model="queryForm.startDate"
                  type="daterange"
                  range-separator="~"
                  start-placeholder="开始时间"
                  end-placeholder="结束时间"
                  value-format="YYYY-MM-DD"
                  clearable
                  @change="startDateChange"
                  class="create-time-picker"
                />
              </div>
              <div class="filter-row">
                <span class="row-head">合同结束时间</span>
                <el-date-picker
                  v-model="queryForm.endDate"
                  type="daterange"
                  range-separator="~"
                  start-placeholder="开始时间"
                  end-placeholder="结束时间"
                  value-format="YYYY-MM-DD"
                  clearable
                  @change="endDateChange"
                  class="create-time-picker"
                />
              </div>
            </div>
            <div v-if="showMore">
              <el-button type="primary" @click="onSubmit">查询</el-button>
              <el-button @click="reset">重置</el-button>
            </div>
          </div>
        </div>
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
        <el-table-column fixed="left" label="序号" type="index" width="55" />
        <el-table-column fixed="left" label="操作" width="160" class-name="table-operation">
          <template #default="{ row }">
            <el-button link type="primary" @click="detail(row)" :disabled="getAuth('order:servePacket:detail')"> 查看 </el-button>
            <el-button link :disabled="!leafAreaFlag || getAuth('order:servePacket:edit') || row.finishStatus === '3'" v-if="row.finishStatus !== 3" type="primary" @click="edit(row)">
              编辑
            </el-button>
            <el-button link type="primary" :disabled="getAuth('order:servePacket:delete') || !leafAreaFlag || row.usingStatus === '2' || row.usingStatus === '3'" @click="del(row.id)">
              删除
            </el-button>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="no" label="服务包编号" width="200" />
        <el-table-column show-overflow-tooltip prop="name" label="服务包名称" width="180" />
        <el-table-column show-overflow-tooltip prop="sortKey" label="排序码" width="100" />
        <el-table-column show-overflow-tooltip prop="usingStatus" label="服务包状态" min-width="100">
          <template #default="{ row }">
            <span class="not-bound" v-if="row.usingStatus === '1'">未使用</span>
            <span class="bound" v-else-if="row.usingStatus === '2'">使用中</span>
            <span class="void" v-else-if="row.usingStatus === '3'">停止使用</span>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="finishStatus" label="结案状态" min-width="120">
          <template #default="{ row }">
            <span class="not-bound" v-if="row.finishStatus === '1'">未结案</span>
            <span class="not-bound" v-if="row.finishStatus === '2'">到期待结案</span>
            <span class="bound" v-else-if="row.finishStatus === '3'">结案</span>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="type" label="类型" width="110">
          <template #default="{ row }">
            {{ renderDict(row.type, 'serve_packet_type') }}
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="remark" label="备注" min-width="180" />
        <el-table-column show-overflow-tooltip prop="startDate" label="合同开始日期" width="180">
          <!-- <template #default="{ row }">
            {{ formatDateString(row.startDate, 'YYYY-MM-DD') }}
          </template> -->
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="endDate" label="合同结束日期" width="180">
          <!-- <template #default="{ row }">
            {{ formatDateString(row.endDate, 'YYYY-MM-DD') }}
          </template> -->
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="updateTime" label="更新时间" width="180" />
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
  <OtherServePacketFormDialog ref="otherServePacketFormDialog" @reload-list="getTableList" />
  <OtherServePacketDetailDialog ref="otherServePacketDetailDialog" />
</template>
<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { useAppStore } from '@/store/modules/app'
import { Search } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRouter } from 'vue-router'
import OtherServePacketFormDialog from './components/other-serve-packet-form-dialog/index.vue'
import OtherServePacketDetailDialog from './components/other-serve-packet-detail-dialog/index.vue'
import DictSelect from '/@/components/DictSelect/index.vue'
import { useCache } from '@/hooks/web/useCache'
import { getAuth } from '@/utils/export'
import { servePacketPage, removeServePacket } from '@/api/servePacket'
import { resetQueryForm } from '@/utils'
import { filterDict, renderDict } from '@/hooks/web/useDict'
const appStore = useAppStore()
const primaryColor = computed(() => appStore.getTheme.elColorPrimary)
const { wsCache } = useCache()
const { push } = useRouter()

// const extraQueryFlag = ref(false)

const showMore = ref(false)

function add() {
  push(`/order/servePacketAdd`)
}

const otherServePacketFormDialog = ref()
function addOther() {
  otherServePacketFormDialog.value.show()
}

function edit(row) {
  if (row.type === 'open') {
    push(`/order/servePacketEdit?id=${row.id}`)
  } else {
    otherServePacketFormDialog.value.show(row)
  }
}

const otherServePacketDetailDialog = ref()
function detail(row) {
  if (row.type === 'open') {
    push(`/order/servePacketDetail?id=${row.id}`)
  } else {
    otherServePacketDetailDialog.value.show(row)
  }
}

const leafAreaFlag = ref(wsCache.get('leafAreaFlag'))

const queryForm = reactive<any>({
  keywords: undefined,
  usingStatus: undefined,
  finishStatus: undefined,
  startDate: [],
  endDate: [],
  pageNum: 1,
  pageSize: 20,
  orderByColumn: undefined,
  asc: undefined
})
const startDateChange = (date) => {
  if (date) {
    queryForm.startBeginDate = date[0]
    queryForm.startEndDate = date[1]
    return
  }
  queryForm.startBeginDate = ''
  queryForm.startEndDate = ''
}
const endDateChange = (date) => {
  if (date) {
    queryForm.endBeginDate = date[0]
    queryForm.endEndDate = date[1]
    return
  }
  queryForm.endBeginDate = ''
  queryForm.endEndDate = ''
}

const loading = ref(false)
const tableData = ref()
const total = ref(0)
const tableRef = ref()

async function getTableList() {
  loading.value = true
  const { data } = await servePacketPage(queryForm)
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

function onSubmit() {
  getTableList()
}

function del(id) {
  ElMessageBox.confirm('', '确认删除服务包数据？')
    .then(async () => {
      const res: any = await removeServePacket(id)
      if (res.code === 200) {
        ElMessage.success('操作成功')
        getTableList()
      }
    })
    .catch(() => {})
}

const reset = () => {
  resetQueryForm(queryForm, { pageNum: 1, pageSize: 20 }, getTableList)
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
.advance-filter-box {
  &.show-filter {
    height: 122px;
  }
  .customer-filter {
    .filter-row {
      width: 33.33%;
    }
  }
}

:deep(.el-dropdown-menu__item) {
  width: 210px;
  padding: 12px 24px;
  display: list-item;
}
.dropdown-title {
  font-size: 14px;
  font-weight: 400;
  color: #000000;
}
.dropdown-desc {
  font-size: 12px;
  font-weight: 400;
  color: #999693;
}
:deep(.el-dropdown-menu__item--divided) {
  margin: 0 !important;
}

.more-btn {
  display: flex;
  align-items: center;
  font-size: 14px;
  color: var(--el-color-primary);
  cursor: pointer;
  margin-left: 12px;
  white-space: nowrap;
  .span {
    text-decoration: underline;
    margin-left: 2px;
  }
}
.search-item {
  display: flex;
  align-items: center;
}
:deep(.create-time-picker) {
  padding: 0 5px;
  // .el-icon.el-input__icon {
  //   display: none;
  // }
  .el-range-separator {
    padding: 0 5px;
    flex: 0;
  }
  .el-range-input {
    flex: 1;
  }
}
</style>
