<template>
  <div>
    <el-card shadow="never" class="card">
      <template #header>
        <div class="card-header">
          <span class="title">APP基本信息管理</span>
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
        <el-space wrap :size="12">
          <el-button type="primary" @click="add()" :disabled="!leafAreaFlag || getAuth('app:index:add')"> 添加APP基本信息 </el-button>
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
        <el-table-column fixed="left" type="index" label="序号" width="60" />
        <el-table-column fixed="left" label="操作" width="160" class-name="table-operation">
          <template #default="{ row }">
            <!-- <el-button
                link
                type="primary"
                @click="detail(row)"
                :disabled="getAuth('serviceProvider:index:detail')"
              >
                查看
              </el-button> -->
            <el-button link :disabled="!leafAreaFlag || getAuth('app:index:publish')" type="primary" @click="publish(row.id)" v-if="leafAreaFlag && !row.enabled"> 发布 </el-button>
            <el-button link :disabled="!leafAreaFlag || getAuth('app:index:edit')" type="primary" @click="add(row)" v-if="leafAreaFlag"> 编辑 </el-button>
            <el-button v-if="leafAreaFlag" link type="primary" :disabled="!leafAreaFlag || getAuth('app:index:delete')" @click="del(row.id)"> 删除 </el-button>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="categoryName" label="信息类别" min-width="120" sortable="custom" />
        <el-table-column show-overflow-tooltip prop="title" label="基本信息名称" min-width="150" sortable="custom" />
        <el-table-column show-overflow-tooltip prop="code" label="标识码" min-width="150" sortable="custom" />
        <el-table-column show-overflow-tooltip prop="createTime" label="录入时间" min-width="200" sortable="custom" />
        <el-table-column show-overflow-tooltip prop="creatorName" label="录入人" min-width="150" sortable="custom" />
        <el-table-column show-overflow-tooltip prop="enabled" label="状态" min-width="110">
          <template #default="{ row }">
            <span v-if="row.enabled" style="color: #5cd7a8">已发布</span>
            <span v-else style="color: #ff9e4d">未发布</span>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="showHelpNotes" label="在帮助页显示" min-width="150">
          <template #default="{ row }">
            {{ row.showHelpNotes === '1' ? '是' : '否' }}
          </template>
        </el-table-column>
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
  <ServeList ref="listRef" @reload-list="getTableList" />
</template>
<script setup lang="ts">
import ServeList from './components/serve-list-dialog/index.vue'
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useCache } from '@/hooks/web/useCache'
import { getAuth } from '@/utils/export'
import { appInfoPage, removeAppInfo, updateEnabledAppInfo } from '@/api/appManagement'

const { wsCache } = useCache()
const leafAreaFlag = ref(wsCache.get('leafAreaFlag'))

const queryFormDefault = {
  keywords: undefined,
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
  const res = await appInfoPage(queryForm)
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

function del(ids) {
  ElMessageBox.confirm('', '确定删除APP基本信息数据？')
    .then(async () => {
      const res: any = await removeAppInfo(ids)
      if (res.code === 200) {
        ElMessage.success('删除成功')
        getTableList()
      }
    })
    .catch(() => {})
}

async function publish(ids) {
  const res: any = await updateEnabledAppInfo(ids)
  if (res.code === 200) {
    ElMessage.success('发布成功')
    getTableList()
  }
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
