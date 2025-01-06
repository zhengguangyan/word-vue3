<template>
  <div>
    <el-card shadow="never" class="card">
      <template #header>
        <div class="card-header">
          <span class="title">联动管理</span>
          <span class="about">
            <Icon icon="ant-design:question-circle-outlined" style="vertical-align: middle" />
            权限说明
          </span>
        </div>
      </template>

      <div class="query-form">
        <el-space wrap :size="12">
          <el-button type="primary" @click="add" :disabled="!leafAreaFlag || getAuth('careinfo:linkage:add')">添加</el-button>
          <el-button :disabled="!leafAreaFlag || getAuth('careinfo:linkage:delete')" @click="batchDelete">删除</el-button>

          <el-button @click="showExportDialog" :disabled="getAuth('careinfo:linkage:export')">导出</el-button>
          <el-input v-model="queryForm.query" placeholder="请输入操作人/客户姓名/证件号/联系方式" style="width: 300px" @change="search" />
          <el-date-picker
            v-model="queryForm.createTime"
            type="datetimerange"
            range-separator="-"
            start-placeholder="创建时间开始"
            end-placeholder="创建时间结束"
            value-format="YYYY-MM-DD HH:mm:ss"
            date-format="YYYY/MM/DD ddd"
            time-format="A hh:mm:ss"
            clearable
            style="width: 300px"
          />
          <el-button type="primary" @click="search">查询</el-button>
          <el-button @click="reset">重置</el-button>
        </el-space>
        <div></div>
      </div>

      <el-table
        :data="tableData"
        ref="tableRef"
        header-row-class-name="table-header"
        class-name="table-without-border list-page-table"
        @selection-change="handleSelectionChange"
        height="calc(100vh - 310px)"
      >
        <el-table-column type="selection" width="40" />
        <el-table-column fixed="left" label="操作" width="160" class-name="table-operation">
          <template #default="{ row }">
            <el-button link type="primary" @click="detail(row)" :disabled="getAuth('careinfo:linkage:detail')"> 查看 </el-button>
            <el-button link type="primary" @click="edit(row)" :disabled="!leafAreaFlag || getAuth('careinfo:linkage:edit')"> 编辑 </el-button>
            <el-button link type="primary" :disabled="!leafAreaFlag || getAuth('careinfo:linkage:delete')" @click="del(row.id)"> 删除 </el-button>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="linkageNo" label="联动编号" min-width="180" />
        <el-table-column show-overflow-tooltip prop="createTime" label="创建时间" min-width="180" />
        <el-table-column show-overflow-tooltip prop="creatorName" label="创建人" min-width="100" />
        <el-table-column show-overflow-tooltip prop="phone" label="联系电话" min-width="200" />
        <el-table-column show-overflow-tooltip prop="linkageName" label="联动名称" min-width="200" />
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
  <LinkageFormDialog ref="formRef" @reload-list="getTableList" />
  <ExportDialog ref="exportRef" :multipleSelection="multipleSelection" :queryForm="queryForm" :loading="exportLoading" title="联动列表" @export-submit="exportExcel" />
</template>
<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getLinkagePage, deleteLinkage } from '@/api/linkage/index'
import LinkageFormDialog from './components/linkage-form-dialog/index.vue'
import { useRouter } from 'vue-router'
import { getAuth } from '@/utils/export'
import { useCache } from '@/hooks/web/useCache'
import download from '@/utils/download'
import { exportCareLink } from '@/api/worksheet'
import ExportDialog from './components/export-dialog/index.vue'

const { push } = useRouter()
const { wsCache } = useCache()

const leafAreaFlag = ref(wsCache.get('leafAreaFlag'))

const formRef = ref()
function add() {
  formRef.value.show()
}

function search() {
  getTableList()
}

function detail(data) {
  push(`/careinfo/linkage/detail?id=${data.id}`)
}

function edit(data) {
  formRef.value.show(data)
}

const queryFormDefault = {
  query: undefined,
  createTime: undefined,
  startTime: undefined,
  endTime: undefined,
  pageNum: 1,
  pageSize: 20
}
const queryForm = reactive({ ...queryFormDefault })

const tableData = ref()
const total = ref(0)
const tableRef = ref()

async function getTableList() {
  const res = await getLinkagePage(queryForm)
  tableData.value = res.data.list
  total.value = res.data.total
}
const reset = () => {
  Object.assign(queryForm, queryFormDefault)
  getTableList()
}

watch(
  () => queryForm.createTime,
  () => {
    if (queryForm.createTime) {
      queryForm.startTime = queryForm.createTime[0]
      queryForm.endTime = queryForm.createTime[1]
    } else {
      queryForm.startTime = undefined
      queryForm.endTime = undefined
    }
  }
)

function del(ids) {
  ElMessageBox.confirm('', '确定删除联动数据？')
    .then(async () => {
      const res: any = await deleteLinkage(ids)
      if (res.code === 200) {
        ElMessage.success('操作成功')
        getTableList()
      }
    })
    .catch(() => {})
}

function batchDelete() {
  let idList = tableRef.value.getSelectionRows()
  if (!idList.length) {
    return ElMessage.error('请先选择要删除的数据')
  }
  let ids = idList.map((obj) => obj.id).join(',')
  del(ids)
}

// 导出数据
const exportRef = ref()
function showExportDialog() {
  exportRef.value.show()
}
const multipleSelection = ref<any>([])
const handleSelectionChange = (val: any) => {
  multipleSelection.value = val
}
const exportLoading = ref(false)
const exportExcel = async (f) => {
  let exportForm: any = {}
  if (f.data == 'select' && multipleSelection.value?.length == 0) {
    ElMessage.error('未选择数据')
    return
  }
  if (f.data == 'select') {
    exportForm.idList = multipleSelection.value?.map((obj: any) => {
      return obj.id
    })
  }
  if (f.data == 'filter') {
    exportForm = { ...queryForm }
    exportForm.pageSize = undefined
    exportForm.pageNum = undefined
  }
  if (f.data == 'all') {
    exportForm = {}
  }
  exportLoading.value = true
  try {
    const data = await exportCareLink(exportForm)
    download.excel(data.data, '联动列表.xlsx')
    ElMessage.success('导出成功')
    exportLoading.value = false
  } finally {
    exportLoading.value = false
  }
}
onMounted(() => {
  getTableList()
})
</script>
<style>
.card {
  border: 0;
}
.el-card__header {
  padding-top: 0;
}
.el-card__header,
.el-card__body {
  padding-left: 0;
  padding-right: 0;
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
</style>
