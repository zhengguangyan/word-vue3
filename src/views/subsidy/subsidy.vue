<template>
  <div>
    <el-card shadow="never" class="card">
      <template #header>
        <div class="card-header">
          <span class="title">补贴管理</span>
        </div>
      </template>

      <div class="query-form">
        <el-space wrap :size="12">
          <el-button type="primary" @click="add" :disabled="!leafAreaFlag || getAuth('subsidy:subsidy:add')">添加</el-button>
          <div>
            <!-- <span class="date-label">关键字:</span> -->
            <el-input v-model="queryForm.name" placeholder="模糊搜索补贴编号/补贴名称" style="width: 300px" @change="getTableList" />
          </div>
          <div>
            <!-- <span class="date-label">补贴状态:</span> -->
            <DictSelect v-model="queryForm.usingStatus" :distList="filterDict('subsidy_using_status')" placeholder="补贴状态" :clearable="true" />
          </div>
          <!-- <div>
            <span class="date-label">结案状态:</span>
            <DictSelect v-model="queryForm.finishStatus" :distList="filterDict('subsidy_finish_status')" placeholder="结案状态" :clearable="true" />
          </div>
          <div>
            <span class="date-label">合同开始时间:</span>
            <el-date-picker
              style="width: 280px"
              v-model="queryForm.startTime"
              type="daterange"
              range-separator="~"
              start-placeholder="合同开始时间"
              end-placeholder="合同开始时间"
              value-format="YYYY-MM-DD"
              @change="changeStartTime"
              clearable
            />
          </div>
          <div>
            <span class="date-label">合同结束时间:</span>
            <el-date-picker
              style="width: 280px"
              v-model="queryForm.endTime"
              type="daterange"
              range-separator="~"
              start-placeholder="合同结束时间"
              end-placeholder="合同结束时间"
              value-format="YYYY-MM-DD"
              @change="changeEndTime"
              clearable
            />
          </div> -->
          <template v-if="!extraQueryFlag">
            <el-button type="primary" @click="getTableList()">查询</el-button>
            <el-button @click="reset">重置</el-button>
          </template>
          <el-link :icon="Filter" type="primary" @click="extraQueryFlag = !extraQueryFlag">高级筛选</el-link>
        </el-space>
      </div>
      <div class="advance-filter-box scrollbarHide" :class="{ 'show-filter': extraQueryFlag }">
        <div class="filter-content-wrapper">
          <div class="customer-filter">
            <div class="filter-row">
              <span class="row-head">结案状态</span>
              <DictSelect width="100%" v-model="queryForm.finishStatus" :distList="filterDict('subsidy_finish_status')" placeholder="结案状态" :clearable="true" />
            </div>
            <div class="filter-row">
              <span class="row-head">合同开始时间</span>
              <el-date-picker
                style="width: 100%"
                v-model="queryForm.startTime"
                type="daterange"
                range-separator="~"
                start-placeholder="合同开始时间"
                end-placeholder="合同开始时间"
                value-format="YYYY-MM-DD"
                @change="changeStartTime"
                clearable
              />
            </div>
            <div class="filter-row">
              <span class="row-head">合同结束时间</span>
              <el-date-picker
                style="width: 100%"
                v-model="queryForm.endTime"
                type="daterange"
                range-separator="~"
                start-placeholder="合同结束时间"
                end-placeholder="合同结束时间"
                value-format="YYYY-MM-DD"
                @change="changeEndTime"
                clearable
              />
            </div>
          </div>
          <div v-if="extraQueryFlag">
            <el-button type="primary" @click="getTableList()">查询</el-button>
            <el-button @click="reset">重置</el-button>
          </div>
        </div>
      </div>

      <el-table
        :data="tableData"
        ref="tableRef"
        header-row-class-name="table-header"
        v-loading="loading"
        @selection-change="handleSelectionChange"
        class-name="table-without-border list-page-table"
        height="calc(100vh - 310px)"
      >
        <el-table-column fixed="left" type="index" label="序号" width="60" />
        <el-table-column fixed="left" label="操作" width="150" class-name="table-operation">
          <template #default="{ row }">
            <el-button link type="primary" @click="detail(row)" :disabled="!leafAreaFlag || getAuth('subsidy:subsidy:detail')"> 查看 </el-button>
            <el-button link type="primary" @click="edit(row)" :disabled="!leafAreaFlag || getAuth('subsidy:subsidy:edit') || row.finishStatus === '3'"> 编辑 </el-button>
            <el-button v-if="leafAreaFlag" link type="primary" :disabled="!leafAreaFlag || getAuth('subsidy:subsidy:delete') || row.usingStatus !== '1'" @click="verifyDelete(row.id)">
              删除
            </el-button>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="no" label="补贴编号" min-width="180" />
        <el-table-column show-overflow-tooltip prop="name" label="补贴名称" min-width="130" />
        <el-table-column show-overflow-tooltip prop="sortKey" label="排序码" />
        <el-table-column show-overflow-tooltip prop="usingStatus" label="补贴状态" min-width="100">
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
        <el-table-column show-overflow-tooltip prop="remark" label="备注" min-width="140" />
        <el-table-column show-overflow-tooltip prop="startDate" label="合同开始时间" min-width="140" />
        <el-table-column show-overflow-tooltip prop="endDate" label="合同结束时间" min-width="140" />
        <el-table-column show-overflow-tooltip prop="updateTime" label="更新时间" min-width="170" />
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
// import { ElMessage, ElMessageBox } from 'element-plus'
import { useCache } from '@/hooks/web/useCache'
const { wsCache } = useCache()
import { useRouter } from 'vue-router'
import { getAuth } from '@/utils/export'
import DictSelect from '/@/components/DictSelect/index.vue'
import { removeSubsidyInfo, subsidyInfoPage, verifyDeleteSubsidyInfo } from '@/api/subsidy'
import { ElMessage, ElMessageBox } from 'element-plus'
import { filterDict } from '@/hooks/web/useDict'
import { Filter } from '@element-plus/icons-vue'
const { push } = useRouter()
const extraQueryFlag = ref(false)
const leafAreaFlag = ref(wsCache.get('leafAreaFlag'))

function add() {
  push(`/subsidy/subsidyAdd`)
}

function detail(row) {
  push(`/subsidy/subsidyDetail?id=${row.id}`)
}

function edit(row) {
  push(`/subsidy/subsidyEdit?id=${row.id}`)
}

const queryFormDefault = {
  usingStatus: undefined,
  finishStatus: undefined,
  startTime: undefined,
  endTime: undefined,
  startTimeStart: undefined,
  startTimeEnd: undefined,
  endTimeStart: undefined,
  endTimeEnd: undefined,
  name: undefined,
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

const changeStartTime = () => {
  if (queryForm.startTime) {
    queryForm.startTimeStart = queryForm.startTime[0]
    queryForm.startTimeEnd = queryForm.startTime[1]
  } else {
    queryForm.startTimeStart = undefined
    queryForm.startTimeEnd = undefined
  }
}

const changeEndTime = () => {
  if (queryForm.endTime) {
    queryForm.endTimeStart = queryForm.endTime[0]
    queryForm.endTimeEnd = queryForm.endTime[1]
  } else {
    queryForm.endTimeStart = undefined
    queryForm.endTimeEnd = undefined
  }
}

async function getTableList() {
  loading.value = true
  const { data } = await subsidyInfoPage(queryForm)
  tableData.value = data.list
  total.value = data.total
  loading.value = false
}

const reset = () => {
  Object.assign(queryForm, queryFormDefault)
  getTableList()
}

const multipleSelection = ref<any>([])
const handleSelectionChange = (val: any) => {
  multipleSelection.value = val
}

const verifyDelete = (ids) => {
  ElMessageBox.confirm('', '确定删除补贴数据？')
    .then(async () => {
      const { data } = await verifyDeleteSubsidyInfo(ids)
      if (data.delete) {
        del(ids)
      } else {
        ElMessageBox.confirm(data.msg, '系统提示')
          .then(() => {
            if (data.part) {
              del(ids)
              return
            }
          })
          .catch(() => {
            // catch error
          })
      }
    })
    .catch(() => {})
}

async function del(ids) {
  const res: any = await removeSubsidyInfo(ids)
  if (res.code === 200) {
    ElMessage.success('删除成功')
    getTableList()
  }
}

onMounted(() => {
  getTableList()
})
</script>
<style lang="less" scoped>
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
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
