<template>
  <el-dialog
    v-model="visible"
    append-to-body
    width="980px"
    :close-on-click-modal="false"
    draggable
    class="choose-customers-dialog"
    title="客户活动参与情况"
  >
    <div class="flex items-center r-m-b-10">
      <div>
        <el-date-picker
          v-model="params.timeRange"
          type="daterange"
          range-separator="~"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          value-format="YYYY-MM-DD"
          disabled
        />
      </div>
      <el-button class="r-m-lr-10" type="primary" link @click="handleWatch">{{
        params.name
      }}</el-button>
      <div>
        <span>共参与活动</span>
        <span class="error-color mx-4px">{{ total }}</span>
        <span>次</span>
      </div>
    </div>
    <el-table :data="tableData" v-loading="loading" max-height="440px" ref="tableRef">
      <el-table-column label="序号" type="index" width="60" align="center"></el-table-column>
      <el-table-column label="操作" width="80" align="center">
        <template #default="{ row }">
          <el-button type="primary" link @click="handleDetail(row)">查看</el-button>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip label="活动编号" prop="id"></el-table-column>
      <el-table-column show-overflow-tooltip label="标题" prop="title"></el-table-column>
      <el-table-column show-overflow-tooltip label="活动状态" prop="taskStatus">
        <template #default="{ row }">{{ getStatusName(row.taskStatus) }}</template>
      </el-table-column>
    </el-table>
    <div class="rela r-m-t-20 r-m-b-40">
      <el-pagination
        v-model:current-page="params.pageNum"
        v-model:page-size="params.pageSize"
        :page-sizes="[10, 20, 50, 100, 200, 500]"
        layout="total, prev, pager, next, jumper"
        :total="total"
        :pager-count="5"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue'
import { activityPage } from '@/api/assistance/activity'
import { ElTable } from 'element-plus'
import { useRouter } from 'vue-router'

const visible = ref(false)
const params = ref({
  name: '',
  beginTime: '',
  endTime: '',
  customerId: '',
  pageNum: 1,
  pageSize: 10,
  timeRange: []
})
const open = (data: any) => {
  params.value = data
  visible.value = true
  nextTick(() => {
    loadData()
  })
}
defineExpose({ open })

const loading = ref(false)
const tableData = ref<any[]>([])
const total = ref(0)
const loadData = async (query?: true) => {
  if (loading.value) return
  loading.value = true
  if (query) {
    params.value.pageNum = 1
  }
  const { data } = await activityPage(params.value)
  tableData.value = data.list
  total.value = data.total
  loading.value = false
}

const router = useRouter()
const handleWatch = () => {
  router.push(`/customer/detail?id=${params.value.customerId}`)
}

const handleDetail = (row: any) => {
  router.push(`/assistance/activity/detail?id=${row.id}`)
}

const handleSizeChange = (size: number) => {
  params.value.pageNum = 1
  params.value.pageSize = size
  loadData()
}
const handleCurrentChange = (current: number) => {
  params.value.pageNum = current
  loadData()
}

const getStatusName = (taskStatus: string) => {
  switch (taskStatus) {
    case '0':
      return '草稿'
    case '1':
      return '未开始'
    case '2':
      return '进行中'
    case '3':
      return '已关闭'
    case '4':
      return '已完成'
    default:
      return ''
  }
}
</script>

<style lang="less">
.choose-customers-dialog {
  .el-dialog__header {
    .error-color {
      font-size: 12px;
      font-weight: normal;
      margin-left: 10px;
    }
  }
  .choose-num {
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
  }
  .label {
    white-space: nowrap;
    margin-right: 8px;
    width: 90px;
    text-align: right;
  }
  .huji-label {
    text-indent: 1em;
  }
  .keyword-label {
    text-indent: 2em;
  }
  .create-time-picker {
    width: 300px;
  }
}
</style>
