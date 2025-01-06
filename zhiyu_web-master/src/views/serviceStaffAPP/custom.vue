<template>
  <div>
    <el-card shadow="never" class="card">
      <template #header>
        <div class="card-header">
          <span class="title">自定义项目</span>
        </div>
      </template>
      <div class="type-box">
        <span class="type-btn" :class="{ active: contentType === 'view' }" @click="switchContent('view')">自定义项目统计</span>
        <span class="type-btn" :class="{ active: contentType === 'edit' }" @click="switchContent('edit')">热门自定义项目</span>
      </div>
      <section v-show="contentType === 'view'">
        <div class="query-form">
          <el-space wrap :size="12">
            <el-input v-model="params.keyword" placeholder="搜索项目名称" @change="loadData" clearable :suffix-icon="Search"></el-input>
            <el-date-picker v-model="params.timeRange" type="daterange" range-separator="~" start-placeholder="服务时间开始" end-placeholder="服务时间结束" value-format="YYYY-MM-DD" clearable />
            <el-button type="primary" @click="loadData">查询</el-button>
            <el-button @click="resetQueryForm(params, null, loadData)">重置</el-button>
          </el-space>
        </div>
        <el-table :data="tableData" ref="tableRef" header-row-class-name="table-header" v-loading="loading" class-name="table-without-border list-page-table" height="calc(100vh - 320px)">
          <el-table-column label="序号" type="index" width="60" />
          <el-table-column show-overflow-tooltip label="项目名称" prop="name" />
          <el-table-column show-overflow-tooltip label="项目次数" prop="num" />
        </el-table>
      </section>
      <section v-show="contentType === 'edit'">
        <div class="query-form">
          <el-button type="primary" @click="handleAdd(false)" :disabled="!leafAreaFlag || getAuth('serviceStaffAPP:custom:add')">添加项目</el-button>
          <el-button @click="handleAdd(true)" :disabled="!leafAreaFlag || getAuth('serviceStaffAPP:custom:add')">添加全局项目</el-button>
        </div>
        <el-table :data="tableData" ref="tableRef" header-row-class-name="table-header" v-loading="loading" class-name="table-without-border list-page-table" height="calc(100vh - 320px)">
          <el-table-column label="序号" type="index" width="60" />
          <el-table-column label="操作" width="120">
            <template #default="{ row, $index }">
              <el-button type="primary" link :disabled="!leafAreaFlag || getAuth('serviceStaffAPP:custom:sort')" @click="handleMove(row, $index, 'up')" v-if="$index > 0">上移</el-button>
              <el-button type="primary" link :disabled="!leafAreaFlag || getAuth('serviceStaffAPP:custom:sort')" @click="handleMove(row, $index, 'down')" v-if="$index < tableData.length - 1"
                >下移</el-button
              >
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip label="项目名称" prop="name" />
          <el-table-column show-overflow-tooltip label="是否为全国项目">
            <template #default="{ row }">
              <span>{{ row.areaProjectCode === '00' ? '是' : '否' }}</span>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip label="是否在APP上展示">
            <template #default="{ row }">
              <el-switch v-model="row.showOnApp" :active-value="1" :inactive-value="0" :disabled="row.loading" @change="handleSwitchChange(row, $event)" />
            </template>
          </el-table-column>
        </el-table>
      </section>
    </el-card>
    <EditCustomService ref="editCustomServiceRef" @load-data="loadData('edit')" />
  </div>
</template>
<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { resetQueryForm } from '@/utils'
import EditCustomService from './components/edit-custom-service/index.vue'
import { customStatPage, customServePage, customServeSort, customServeSave } from '@/api/serviceStaffAPP/custom'
import { useCache } from '@/hooks/web/useCache'
import { getAuth } from '@/utils/export'
import { ElMessageBox } from 'element-plus'
import { Search } from '@element-plus/icons-vue'
type CustomService = {
  id: string
  name: string
  showOnApp: number
  sort: number
  loading: boolean
}

const { wsCache } = useCache()
const leafAreaFlag = ref(wsCache.get('leafAreaFlag'))

onMounted(() => {
  loadData('view')
})

const contentType = ref<'view' | 'edit'>('view')
const params = reactive({
  keyword: '',
  serveTimeStart: '',
  serveTimeEnd: '',
  timeRange: [],
  pageNum: 1,
  pageSize: 1000
})

const loading = ref(false)
const tableData = ref<CustomService[]>([])

const loadData = async (type: 'view' | 'edit') => {
  if (loading.value) return
  try {
    if (params.timeRange && params.timeRange.length) {
      params.serveTimeStart = params.timeRange[0]
      params.serveTimeEnd = params.timeRange[1]
    } else {
      params.serveTimeStart = ''
      params.serveTimeEnd = ''
    }
    loading.value = true
    if (type === 'edit') {
      const { data } = await customServePage(params)
      tableData.value = data.list.map((item) => ({ ...item, loading: false }))
    } else {
      const { data } = await customStatPage(params)
      tableData.value = data.list
    }
  } finally {
    loading.value = false
  }
}

const switchContent = (type: 'view' | 'edit') => {
  if (loading.value) return
  tableData.value.splice(0)
  contentType.value = type
  loadData(type)
}

const editCustomServiceRef = ref<InstanceType<typeof EditCustomService>>()
const handleAdd = (isGlobal: boolean) => {
  editCustomServiceRef.value?.open(isGlobal)
}

const handleMove = (row: any, index: number, action: 'up' | 'down') => {
  if (action === 'up') {
    tableData.value.splice(index, 1)
    tableData.value.splice(index - 1, 0, row)
  } else {
    tableData.value.splice(index, 1)
    tableData.value.splice(index + 1, 0, row)
  }
  handleSort()
}

const handleSwitchChange = (row: CustomService, val: number) => {
  if (row.loading) return
  if (contentType.value === 'view') return
  ElMessageBox.confirm(`确定设置为“${val ? '是' : '否'}”`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
    center: true
  })
    .then(async () => {
      try {
        row.loading = true
        const params = { ...row }
        params.showOnApp = val
        await customServeSave(params)
        row.loading = false
      } catch {
        row.loading = false
        row.showOnApp = val === 0 ? 1 : 0
      }
    })
    .catch(() => {
      row.loading = false
      row.showOnApp = val === 0 ? 1 : 0
    })
}
let timeId = 0
// 排序
const handleSort = () => {
  window.clearTimeout(timeId)
  timeId = window.setTimeout(async () => {
    tableData.value.forEach((item, index) => {
      item.sort = index + 1
    })
    await customServeSort({ data: tableData.value })
  }, 2000)
}
</script>

<style lang="less" scoped>
.type-box {
  display: flex;
  align-items: center;
  margin: 20px 0;
}
.type-btn {
  width: 120px;
  height: 40px;
  border-radius: 8px 0 0 8px;
  border: 1px solid #ebe9e6;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666462;
  font-size: 14px;
  transition: background-color 0.2s, border-color 0.2s, color 0.2s;
  cursor: pointer;
  &:last-child {
    border-radius: 0 8px 8px 0;
  }
  &:hover {
    color: var(--el-color-primary-light-3);
    border-color: var(--el-color-primary-light-3);
  }
  &.active {
    border-color: var(--el-color-primary-light-3);
    color: var(--el-color-primary-light-3);
    background-color: rgba(var(--el-color-primary-rgb), 0.08);
  }
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
