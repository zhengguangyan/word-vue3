<template>
  <div>
    <el-card shadow="never" class="card">
      <template #header>
        <div class="card-header">
          <span class="title">助餐站点管理</span>
        </div>
      </template>
      <div class="query-form">
        <el-button type="primary" @click="handleAdd" :disabled="!leafAreaFlag || getAuth('zhucan:station:add')">添加</el-button>
        <el-button plain @click="handleRemoveMultiple" :loading="deleteLoading" :disabled="!leafAreaFlag || getAuth('zhucan:station:remove')">删除</el-button>
      </div>
      <el-table
        :data="tableData"
        v-loading="loading"
        @sort-change="handleSortChange"
        @selection-change="handleSelectionChange"
        class-name="table-without-border list-page-table"
        height="calc(100vh - 310px)"
      >
        <el-table-column type="selection" width="45" align="center" fixed="left" />
        <el-table-column label="序号" type="index" width="60" align="center" fixed="left" />
        <el-table-column label="操作" width="200" fixed="left">
          <template #default="{ row }">
            <el-button type="primary" :disabled="!leafAreaFlag || getAuth('zhucan:station:menu')" link @click="menuConfig(row)">配置菜单</el-button>
            <el-button type="primary" :disabled="!leafAreaFlag || getAuth('zhucan:station:edit')" link @click="handleEdit(row)">修改</el-button>
            <el-button type="primary" :disabled="!leafAreaFlag || getAuth('zhucan:station:remove')" :loading="row.loading" link @click="handleRemove(row)">删除</el-button>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip label="站点ID" prop="id" width="180" sortable="custom"></el-table-column>
        <el-table-column show-overflow-tooltip label="站点人员" width="140" prop="operatorNames" sortable="custom"></el-table-column>
        <el-table-column show-overflow-tooltip label="助餐站点" width="140" prop="stationName" sortable="custom"></el-table-column>
        <el-table-column show-overflow-tooltip label="站点来源" width="140" prop="activitySort" sortable="custom">
          <template #default="{ row }">{{ renderDict(row.source, 'station_source') }}</template>
        </el-table-column>
        <el-table-column show-overflow-tooltip label="所属区域" min-width="200" prop="address" sortable="custom" />
        <el-table-column show-overflow-tooltip label="更新时间" width="150" prop="updateTime" sortable="custom">
          <template #default="{ row }">{{ row.updateTime.slice(0, 16) }}</template>
        </el-table-column>
        <el-table-column show-overflow-tooltip label="创建时间" width="150" prop="createTime" sortable="custom">
          <template #default="{ row }">{{ row.createTime.slice(0, 16) }}</template>
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
    <EditStation ref="editStationRef" @load-data="loadData" />
    <MenuConfig ref="menuConfigRef" />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useCache } from '@/hooks/web/useCache'
import { getAuth } from '@/utils/export'
import { ElMessage, ElMessageBox } from 'element-plus'
import { sitePage, siteRemove, verifyDelete } from '@/api/zhucan/station'
import EditStation from './components/EditStation.vue'
import MenuConfig from './components/MenuConfig.vue'
import { renderDict } from '@/hooks/web/useDict'

const { wsCache } = useCache()

const leafAreaFlag = ref(wsCache.get('leafAreaFlag'))
const params = reactive({
  asc: undefined as number | undefined,
  keyword: '',
  orderByColumn: '',
  pageNum: 1,
  pageSize: 10,
  idList: [] as string[]
})

onMounted(() => {
  loadData()
})

const loading = ref(false)
const tableData = ref<any[]>([])
const total = ref(0)

const loadData = async () => {
  if (loading.value) return
  try {
    loading.value = true
    const { data } = await sitePage(params)
    tableData.value = data.list.map((item: any) => {
      item.loading = false
      return item
    })
    total.value = data.total
  } finally {
    loading.value = false
  }
}

const menuConfigRef = ref<InstanceType<typeof MenuConfig>>()
const menuConfig = (row: any) => {
  menuConfigRef.value?.open(row)
}

const editStationRef = ref<InstanceType<typeof EditStation>>()
const handleAdd = () => {
  editStationRef.value?.open()
}
const handleEdit = (row: any) => {
  editStationRef.value?.open(row.id)
}

const handleRemove = async (row: any) => {
  if (row.loading) return
  try {
    row.loading = true
    const { data } = await verifyDelete(row.id)
    if (!data.delete) {
      row.loading = false
      ElMessageBox.confirm(data.msg, '提示', { type: 'warning' })
        .then(() => {})
        .catch(() => {})
      return
    }
    await ElMessageBox.confirm('是否删除该站点？', '站点删除提醒', { type: 'warning' })
    await siteRemove(row.id)
    row.loading = false
    ElMessage.success('已删除')
    if (tableData.value.length === 1 && params.pageNum > 1) {
      params.pageNum--
    }
    loadData()
  } catch {
    row.loading = false
  }
}

const deleteLoading = ref(false)
const handleRemoveMultiple = async () => {
  if (deleteLoading.value) return
  if (!params.idList.length) return ElMessage.error('请选择要删除的数据')
  try {
    deleteLoading.value = true
    const { data } = await verifyDelete(params.idList.join(','))
    if (!data.delete) {
      deleteLoading.value = false
      ElMessageBox.confirm(data.msg, '提示', { type: 'warning' })
        .then(() => {})
        .catch(() => {})
      return
    }
    await ElMessageBox.confirm('是否删除选中站点？', '站点删除提醒', { type: 'warning' })
    await siteRemove(params.idList.join(','))
    deleteLoading.value = false
    ElMessage.success('已删除')
    if (tableData.value.length === params.idList.length && params.pageNum > 1) {
      params.pageNum--
    }
    loadData()
  } catch {
    deleteLoading.value = false
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
  loadData()
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
</script>
