<template>
  <div>
    <el-card shadow="never" class="card">
      <template #header>
        <div class="card-header">
          <span class="title">活动管理</span>
        </div>
      </template>
      <div class="activity-query-form r-m-t-20">
        <el-space wrap :size="12">
          <el-button type="primary" @click="handleAdd" :disabled="!leafAreaFlag || getAuth('activity:add')">添加</el-button>
          <el-button plain @click="handleRemove" :loading="deleteLoading" :disabled="!leafAreaFlag || getAuth('activity:remove')">删除</el-button>
          <el-button plain @click="handleExport" :loading="exporting" :disabled="getAuth('activity:export')">导出</el-button>
          <el-input v-model="params.keyword" placeholder="搜索标题/发布人/参与社区" style="width: 240px" @change="loadData(true)" clearable>
            <template #suffix><Icon icon="ep:search" :color="primaryColor" /></template>
          </el-input>
          <el-select v-model="params.taskStatus" placeholder="搜索活动状态" clearable class="assort-select">
            <el-option label="全部" value="" />
            <el-option label="草稿" value="0" />
            <el-option label="未开始" value="1" />
            <el-option label="进行中" value="2" />
            <el-option label="已关闭" value="3" />
            <el-option label="已完成" value="4" />
          </el-select>
          <DictSelect v-model="params.assort" :distList="filterDict('assort')" placeholder="搜索分类" clearable class="assort-select" />
          <template v-if="!showMore">
            <el-button type="primary" @click="loadData(true)">查询</el-button>
            <el-button plain @click="resetQueryForm(params, { pageNum: 1, pageSize: params.pageSize }, loadData, true)">重置</el-button>
          </template>
          <span class="more-btn" @click="showMore = !showMore">
            <Icon icon="ep:filter" :color="primaryColor" />
            <span class="span">高级搜索</span>
          </span>
        </el-space>
      </div>
      <div class="advance-filter-box scrollbarHide" :class="{ 'show-filter': showMore }">
        <div class="filter-content-wrapper">
          <div class="customer-filter">
            <div class="filter-row">
              <span class="row-head">活动分类</span>
              <DictSelect v-model="params.activitySort" :distList="filterDict('activity_sort')" placeholder="搜索活动分类" :clearable="true" style="width: 100%" />
            </div>
            <div class="filter-row">
              <span class="row-head">开始时间</span>
              <el-date-picker
                v-model="params.timeRange"
                type="daterange"
                range-separator="~"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                value-format="YYYY-MM-DD"
                clearable
                :editable="false"
                class="create-time-picker"
              />
            </div>
            <div class="filter-row">
              <span class="row-head">创建时间</span>
              <el-date-picker
                v-model="params.createTimeRange"
                type="daterange"
                range-separator="~"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                value-format="YYYY-MM-DD"
                clearable
                class="create-time-picker"
              />
            </div>

            <div class="filter-row row-50">
              <span class="row-head">活动地址</span>
              <Cascader :check="true" placeholder="搜索活动地址" v-model="params.addressList" width="100%" />
            </div>
          </div>
          <div v-if="showMore">
            <el-button type="primary" @click="loadData(true)">查询</el-button>
            <el-button plain @click="resetQueryForm(params, { pageNum: 1, pageSize: params.pageSize }, loadData, true)">重置</el-button>
          </div>
        </div>
      </div>
      <el-table
        :data="tableData"
        v-loading="loading"
        @sort-change="handleSortChange"
        @selection-change="handleSelectionChange"
        header-row-class-name="table-header"
        class-name="table-without-border list-page-table"
        height="calc(100vh - 310px)"
      >
        <el-table-column type="selection" width="45" align="center" fixed="left" />
        <el-table-column label="" type="index" width="50" align="center" fixed="left" />
        <el-table-column label="操作" width="120" fixed="left">
          <template #default="{ row }">
            <el-button type="primary" link :disabled="getAuth('activity:detail')" @click="handleDetail(row)">查看</el-button>
            <el-button type="primary" link :disabled="!leafAreaFlag || getAuth('activity:edit')" @click="handleEdit(row)">修改</el-button>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip label="标题" prop="title" min-width="200" sortable="custom"></el-table-column>
        <el-table-column show-overflow-tooltip label="分类" width="140" prop="assort" sortable="custom">
          <template #default="{ row }">{{ renderDict(row.assort, 'assort') }}</template>
        </el-table-column>
        <el-table-column show-overflow-tooltip label="类型" width="140" prop="comactivtyType" sortable="custom">
          <template #default="{ row }">{{ renderDict(row.type, 'comactivty_type') }}</template>
        </el-table-column>
        <el-table-column show-overflow-tooltip label="活动分类" width="140" prop="activitySort" sortable="custom">
          <template #default="{ row }">{{ renderDict(row.activitySort, 'activity_sort') }}</template>
        </el-table-column>
        <el-table-column show-overflow-tooltip label="发布人员" width="120" prop="publishName" sortable="custom" />
        <el-table-column show-overflow-tooltip label="参与组织" width="200" prop="activityCommunity" sortable="custom" />
        <el-table-column show-overflow-tooltip label="活动地点" min-width="160" prop="activityAddress" sortable="custom" />
        <el-table-column show-overflow-tooltip label="开始时间" width="150" prop="startTime" sortable="custom">
          <template #default="{ row }">
            <div v-if="row.startTime">{{ row.startTime.slice(0, 16) }}</div>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip label="结束时间" min-width="160" prop="endTime" sortable="custom">
          <template #default="{ row }">
            <div v-if="row.endTime">{{ row.endTime.slice(0, 16) }}</div>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip label="创建时间" min-width="160" prop="createTime" sortable="custom">
          <template #default="{ row }">
            <div v-if="row.createTime">{{ row.createTime.slice(0, 16) }}</div>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip label="状态" min-width="160" prop="taskStatus">
          <template #default="{ row }">
            <div :style="{ color: taskStatusColor[row.taskStatus] }">{{ taskStatusFun(row.taskStatus) }}</div>
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
    </el-card>
    <el-dialog v-model="exportVisible" title="导出活动信息" append-to-body width="500px" :close-on-click-modal="false" draggable @close="exportVisible = false" class="common-export-dialog">
      <div class="flex">
        <span class="r-m-r-10 text-nowrap">导出数据</span>
        <el-select v-model="params.exportWay" placeholder="请选择导出方式">
          <el-option label="导出所选数据" value="1"></el-option>
          <el-option label="导出筛选结果" value="2"></el-option>
          <el-option label="导出全部数据" value="3"></el-option>
        </el-select>
      </div>
      <div class="error-color r-p-l-66 r-p-t-10 r-p-b-20">一次性导出不能超过6.5W条数据</div>
      <template #footer>
        <el-button plain @click="exportVisible = false">取消</el-button>
        <el-button type="primary" @click="handleExport">导出</el-button>
      </template>
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { resetQueryForm } from '@/utils'
import { useCache } from '@/hooks/web/useCache'
import { getAuth } from '@/utils/export'
import DictSelect from '/@/components/DictSelect/index.vue'
import Cascader from '/@/components/Cascader/index.vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { activityPage, activityRemove, activityExport } from '@/api/assistance/activity'
import download from '@/utils/download'
import { useAppStore } from '@/store/modules/app'
import { filterDict, renderDict } from '@/hooks/web/useDict'
// @ts-ignore
defineOptions({
  name: 'Activity'
})

const { wsCache } = useCache()
const router = useRouter()
const appStore = useAppStore()
const primaryColor = computed(() => appStore.getTheme.elColorPrimary)

const leafAreaFlag = ref(wsCache.get('leafAreaFlag'))
const params = reactive({
  activitySort: '',
  addressList: [],
  asc: undefined as number | undefined,
  assort: '',
  beginTime: '',
  city: '',
  community: '',
  county: '',
  createTimeBegin: '',
  createTimeEnd: '',
  endTime: '',
  exportWay: '1', // 导出方式（1-勾选，2-筛选，3-全部）
  idList: [] as string[],
  keyword: '',
  orderByColumn: '',
  pageNum: 1,
  pageSize: 20,
  province: '',
  street: '',
  taskStatus: '', // 活动状态（0-草稿，1-未开始，2-进行中，3-已关闭，4-已完成）
  timeRange: [],
  createTimeRange: [],
  regionCode: []
})

const taskStatusColor = ref({
  0: '#E96848',
  1: '#FF9E4D',
  2: '#5CD7A8',
  3: '#999693',
  4: '#999693'
})
const showMore = ref(false)

onMounted(() => {
  loadData()
})

const loading = ref(false)
const tableData = ref<any[]>([])
const total = ref(0)

const loadData = async (query?: true) => {
  if (loading.value) return
  try {
    loading.value = true
    if (query) {
      params.pageNum = 1
    }
    handleParams()
    const { data } = await activityPage(params)
    tableData.value = data.list
    total.value = data.total
  } finally {
    loading.value = false
  }
}
const handleParams = () => {
  if (params.timeRange && params.timeRange.length) {
    params.beginTime = params.timeRange[0]
    params.endTime = params.timeRange[1]
  } else {
    params.beginTime = ''
    params.endTime = ''
  }
  if (params.createTimeRange && params.createTimeRange.length) {
    params.createTimeBegin = params.createTimeRange[0]
    params.createTimeEnd = params.createTimeRange[1]
  } else {
    params.createTimeBegin = ''
    params.createTimeEnd = ''
  }
  if (params.regionCode && params.regionCode.length) {
    const keys = ['province', 'city', 'country', 'street', 'community']
    keys.forEach((key) => {
      params[key] = ''
    })
    params.regionCode.forEach((item, index) => {
      params[keys[index]] = item
    })
  }
}
const handleAdd = () => {
  router.push('/assistance/activityAdd')
}
const handleEdit = (row: any) => {
  router.push(`/assistance/activityAdd?id=${row.id}`)
}
const handleDetail = (row: any) => {
  router.push(`/assistance/activity/detail?id=${row.id}`)
}

const deleteLoading = ref(false)
const handleRemove = () => {
  if (deleteLoading.value) return
  if (!params.idList.length) return ElMessage.error('请选择数据')
  ElMessageBox.confirm('此操作将永久删除该数据, 是否继续？', '操作提示', { type: 'warning' })
    .then(async () => {
      deleteLoading.value = true
      await activityRemove(params.idList.join(','))
      ElMessage.success('已删除')
      if (tableData.value.length === params.idList.length && params.pageNum > 1) {
        params.pageNum--
      }
      loadData()
    })
    .finally(() => {
      deleteLoading.value = false
    })
}

const exportVisible = ref(false)
const exporting = ref(false)
const handleExport = async () => {
  if (exporting.value) return
  if (!exportVisible.value) {
    exportVisible.value = true
    return
  }
  if (params.exportWay === '1' && !params.idList.length) {
    ElMessage.error('请勾选要导出的数据')
    return
  }
  try {
    exportVisible.value = false
    exporting.value = true
    const { data } = await activityExport(params)
    ElMessage.success('导出成功')
    download.excel(data, '活动信息.xlsx')
  } finally {
    exporting.value = false
  }
}

const handleSortChange = (column: any) => {
  if (column.order) {
    params.orderByColumn = column.prop
    params.asc = column.order == 'ascending' ? 0 : 1
  } else {
    params.orderByColumn = ''
    params.asc = undefined
  }
  loadData(true)
}

const handleSelectionChange = (val: any) => {
  params.idList = val.map((item) => item.id)
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

// 状态值文本函数
const taskStatusFun = (taskStatus) => {
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

<style lang="less" scoped>
.advance-filter-box {
  &.show-filter {
    height: 170px;
  }
  .customer-filter {
    .filter-row {
      width: 25%;
      &.row-50 {
        width: 50%;
      }
    }
  }
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
.adapter(@size, @content) {
  @media only screen and (max-width: @size) {
    @content();
  }
}
:deep(.assort-select) {
  width: 160px !important;
}
.search-grid {
  padding: 20px;
  border-radius: 4px;
  background-color: #faf9f7;
  border: 1px solid #f5f3f0;
}
.search-grid-div {
  display: grid;
  grid-template-columns: repeat(4, calc((100% - 30px) / 4));
  gap: 10px 10px;
}
.grid-span-2 {
  grid-column-start: span 2;
}
.top-search-item {
  display: flex;
  align-items: center;
  &::before {
    flex-shrink: 0;
    content: attr(label);
    font-size: 14px;
    margin-right: 6px;
  }
}
.search-item {
  display: flex;
  align-items: center;
  &::before {
    width: 56px;
    flex-shrink: 0;
    text-align: right;
    line-height: 1.2;
    content: attr(label);
    font-size: 14px;
    margin-right: 10px;
  }
  &.span2 {
    grid-column: span 2;
  }
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
