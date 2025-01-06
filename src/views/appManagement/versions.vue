<template>
  <div>
    <el-card shadow="never" class="card">
      <template #header>
        <div class="card-header">
          <span class="title">APP版本管理</span>
        </div>
      </template>
      <!-- <div>
        <el-radio-group v-model="queryForm.versionType" @change="getTableList">
          <el-radio-button
            v-for="item in filterDict('version_type')"
            :key="item.value"
            :label="item.value"
            >{{ item.label }}</el-radio-button
          >
        </el-radio-group>
      </div> -->
      <div class="query-form">
        <el-button type="primary" @click="add()" :disabled="!leafAreaFlag || getAuth('app:versions:add')">添加APP版本</el-button>
      </div>
      <el-table
        :data="tableData"
        ref="tableRef"
        header-row-class-name="table-header"
        @selection-change="handleSelectionChange"
        @sort-change="handleSortChange"
        v-loading="loading"
        class-name="table-without-border list-page-table"
        height="calc(100vh - 310px)"
      >
        <el-table-column fixed="left" type="index" label="序号" width="60" />
        <el-table-column fixed="left" label="操作" width="120" class-name="table-operation">
          <template #default="{ row }">
            <el-button link :disabled="!leafAreaFlag || getAuth('app:versions:edit')" type="primary" @click="add(row)" v-if="leafAreaFlag"> 编辑 </el-button>
            <el-button v-if="leafAreaFlag" link type="primary" :disabled="!leafAreaFlag || getAuth('app:versions:delete')" @click="del(row.id)"> 删除 </el-button>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="osType" label="系统" min-width="120" sortable="custom">
          <template #default="{ row }">
            {{ renderDict(row.osType, 'os_type') }}
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="versionCode" label="版本号" min-width="150" sortable="custom" />
        <el-table-column show-overflow-tooltip prop="instruction" label="更新说明" min-width="300" sortable="custom" />
        <el-table-column show-overflow-tooltip prop="areaProjectNames" label="更新范围" min-width="150" sortable="custom" />
        <el-table-column show-overflow-tooltip prop="isUpdate" label="是否强制更新" min-width="140" sortable="custom">
          <template #default="{ row }">
            {{ renderDict(row.isUpdate, 'yes_no') }}
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="url" label="下载地址" min-width="200" sortable="custom" />
        <el-table-column show-overflow-tooltip prop="updateTime" label="最后编辑时间" min-width="200" sortable="custom" />
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
  <ServeList ref="listRef" :dict="dictMap" @reload-list="getTableList" />
</template>
<script setup lang="ts">
import ServeList from './components/add-versions-dialog/index.vue'
import { ref, reactive, onMounted, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useCache } from '@/hooks/web/useCache'
import { getAuth } from '@/utils/export'
import { appVersionPage, removeAppVersion } from '@/api/appManagement'
import { renderDict, dictMap } from '@/hooks/web/useDict'

const { wsCache } = useCache()
const leafAreaFlag = ref(wsCache.get('leafAreaFlag'))

const queryFormDefault = {
  // versionType: 'zhulao',
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
  const res = await appVersionPage(queryForm)
  tableData.value = res.data.list
  total.value = res.data.total
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

const multipleSelection = ref<any>([])
const handleSelectionChange = (val: any) => {
  multipleSelection.value = val
}

watch(
  () => queryForm.createTime,
  () => {
    if (queryForm.createTime) {
      queryForm.createBeginTime = queryForm.createTime[0]
      queryForm.createEndTime = queryForm.createTime[1]
    } else {
      queryForm.createBeginTime = undefined
      queryForm.createEndTime = undefined
    }
  }
)

async function del(ids) {
  ElMessageBox.confirm('', '确定删除APP基本信息分类数据？')
    .then(async () => {
      const res: any = await removeAppVersion(ids)
      if (res.code === 200) {
        ElMessage.success('删除成功')
        getTableList()
      }
    })
    .catch(() => {})
}

const listRef = ref()

const add = (id?) => {
  listRef.value.show(id)
}

onMounted(() => {
  getTableList()
})
</script>

<style scoped lang="less">
.filter-box {
  height: 200px;
  overflow: hidden;
  transition: height 0.5s ease-in-out;
}
.show-filter {
  height: 0;
}
.search-head {
  color: #ccc;
  font-size: 14px;
}
.row-50 {
  width: 40%;
}
:deep(.el-radio-button:last-child .el-radio-button__inner) {
  border-radius: 0 8px 8px 0;
}
:deep(.el-radio-button:first-child .el-radio-button__inner) {
  border-radius: 8px 0 0 8px;
}
</style>
