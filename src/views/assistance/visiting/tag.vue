<template>
  <div class="visiting-tag-page">
    <el-card shadow="never" class="card">
      <template #header>
        <div class="card-header">
          <span class="title">拜访标签管理</span>
        </div>
      </template>
      <div class="type-box">
        <span class="type-btn" :class="{ active: contentType === 'view' }" @click="switchContent('view')">拜访标签统计</span>
        <span class="type-btn" :class="{ active: contentType === 'edit' }" @click="switchContent('edit')">编辑拜访标签</span>
      </div>
      <section v-show="contentType === 'view'">
        <div class="query-form">
          <el-space wrap :size="12">
            <el-input v-model="params.name" placeholder="搜索拜访标签内容" @change="loadData" clearable>
              <template #suffix><i class="el-icon-search el-input__icon"></i></template>
            </el-input>
            <el-date-picker
              v-model="params.timeRange"
              type="daterange"
              range-separator="~"
              start-placeholder="拜访时间开始"
              end-placeholder="拜访时间结束"
              value-format="YYYY-MM-DD"
              clearable
              style="width: 260px"
            />
            <el-button type="primary" @click="loadData">查询</el-button>
            <el-button @click="resetQueryForm(params, null, loadData)">重置</el-button>
          </el-space>
        </div>
        <el-table :data="tableData" ref="tableRef" header-row-class-name="table-header" v-loading="loading" class-name="table-without-border list-page-table" height="calc(100vh - 320px)">
          <el-table-column label="序号" type="index" width="60" />
          <el-table-column show-overflow-tooltip label="拜访标签" prop="name" />
          <el-table-column show-overflow-tooltip label="项目次数" prop="projectCount" />
        </el-table>
      </section>
      <section v-show="contentType === 'edit'">
        <div class="query-form">
          <el-button type="primary" @click="handleAdd" :disabled="!leafAreaFlag || getAuth('visiting:tag:add')">添加</el-button>
        </div>
        <el-table :data="tableData" ref="tableRef" header-row-class-name="table-header" v-loading="loading" class-name="table-without-border list-page-table" height="calc(100vh - 320px)">
          <el-table-column label="序号" type="index" width="60" />
          <el-table-column label="操作" width="120">
            <template #default="{ row, $index }">
              <el-button type="primary" link @click="handleMove(row, $index, 'up')" v-if="$index > 0">上移</el-button>
              <el-button type="primary" link @click="handleMove(row, $index, 'down')" v-if="$index < tableData.length - 1">下移</el-button>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip label="拜访标签" prop="name" />
          <el-table-column show-overflow-tooltip label="是否启用">
            <template #default="{ row }">
              <el-switch v-model="row.showOnApp" :disabled="row.loading" @change="handleSwitchChange(row, $event)" />
            </template>
          </el-table-column>
        </el-table>
      </section>
    </el-card>
    <EditTag ref="editTagRef" @load-data="loadData" />
  </div>
</template>
<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { resetQueryForm } from '@/utils'
import EditTag from './components/EditTag.vue'
import { tagPage, tagSort, setTagStatus, tagStatPage } from '@/api/assistance/tag'
import { useCache } from '@/hooks/web/useCache'
import { getAuth } from '@/utils/export'
import { ElMessageBox } from 'element-plus'

type Tag = {
  id: string
  name: string
  showOnApp: boolean
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
  name: '',
  beginTime: '',
  endTime: '',
  timeRange: [],
  pageNum: 1,
  pageSize: 1000
})

const loading = ref(false)
const tableData = ref<Tag[]>([])

const loadData = async (type: 'view' | 'edit') => {
  if (loading.value) return
  try {
    if (params.timeRange && params.timeRange.length) {
      params.beginTime = params.timeRange[0]
      params.endTime = params.timeRange[1]
    } else {
      params.beginTime = ''
      params.endTime = ''
    }
    loading.value = true
    if (type === 'edit') {
      const { data } = await tagPage(params)
      tableData.value = data.list.map((item) => ({ ...item, loading: false }))
    } else {
      const { data } = await tagStatPage(params)
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

const editTagRef = ref<InstanceType<typeof EditTag>>()
const handleAdd = () => {
  editTagRef.value?.open()
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

const handleSwitchChange = (row: Tag, val: boolean) => {
  if (row.loading) return
  ElMessageBox.confirm(`是否确认修改为${val ? '启用' : '禁用'}`, '修改提醒', { type: 'warning' })
    .then(async () => {
      row.loading = true
      await setTagStatus({ id: row.id, showOnApp: val })
      row.loading = false
    })
    .catch(() => {
      row.loading = false
      row.showOnApp = !val
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
    await tagSort({ data: tableData.value })
  }, 2000)
}
</script>

<style lang="less" scoped>
.visiting-tag-page {
  .el-switch {
    height: auto;
  }
}
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
