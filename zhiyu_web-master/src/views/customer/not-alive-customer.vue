<template>
  <el-card shadow="never" class="card">
    <template #header>
      <div class="card-header">
        <span class="title">过世老人管理</span>
        <el-tooltip class="box-item" effect="dark" :content="`权限说明：${customerMsg}`" placement="left">
          <span class="about">
            <Icon icon="ant-design:question-circle-outlined" style="vertical-align: middle" />
            权限说明
          </span>
        </el-tooltip>
      </div>
    </template>
    <div class="query-form">
      <el-space wrap :size="12">
        <el-button :disabled="getAuth('staffAPP:unalive:export')" @click="showExportDialog">导出</el-button>
        <el-select style="width: 100px" v-model="queryForm.searchType">
          <el-option value="1" label="精确搜索" key="1" />
          <el-option value="2" label="模糊搜索" key="2" />
        </el-select>
        <el-input v-model="queryForm.search" placeholder="请输入证件号/联系方式" style="width: 240px" @change="getTableList" />
        <el-date-picker v-model="queryForm.date" type="daterange" range-separator="~" start-placeholder="过世时间起始" end-placeholder="过世时间截止" style="width: 300px" @change="changeDate" />
        <el-button type="primary" @click="search">查询</el-button>
        <el-button @click="reset">重置</el-button>
      </el-space>
    </div>
    <el-table :data="tableData" ref="tableRef" header-row-class-name="table-header" @selection-change="handleSelectionChange" class-name="table-without-border" border height="calc(100vh - 320px)">
      <el-table-column type="selection" width="40" />
      <el-table-column fixed="left" label="操作" width="70" class-name="table-operation">
        <template #default="{ row }">
          <el-button link type="primary" @click="detail(row)"> 查看 </el-button>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip prop="name" label="姓名" width="180" />
      <el-table-column show-overflow-tooltip prop="sex" label="性别" width="60">
        <template #default="{ row }">
          {{ renderDict(row.sex, 'vols_sex') }}
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip prop="age" label="年龄" width="60" />
      <el-table-column show-overflow-tooltip prop="dateOfDeath" label="死亡日期" width="160">
        <template #default="{ row }">
          {{ formatDateString(row.dateOfDeath, 'YYYY-MM-DD') }}
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip prop="mobilephone" label="联系电话" width="120" />
      <el-table-column show-overflow-tooltip prop="idcard" label="证件号码" width="180" />
      <el-table-column prop="currentAllAddress" label="现居地址" min-width="200" show-overflow-tooltip />
      <el-table-column show-overflow-tooltip prop="updateTime" label="更新时间" width="180" />
      <el-table-column show-overflow-tooltip prop="updaterName" label="更新人" width="180" />
    </el-table>
    <div style="margin-top: 20px">
      <el-pagination
        v-model:current-page="queryForm.pageNum"
        v-model:page-size="queryForm.pageSize"
        :page-sizes="[10, 20, 50, 100, 200, 500]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="getTableList()"
        @current-change="getTableList()"
      />
    </div>
  </el-card>
  <ExportDialog ref="exportRef" title="导出过世老人数据" :needShowFormat="true" :loading="exportLoading" @export-submit="exportSubmit" @export-close="exportLoading = false" />
</template>
<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue'
import { exportExcelInOne, exportWord, exportToZipExcel, getCustomerPage, getCustomerMsg } from '@/api/customer/index'
import { Icon } from '@/components/Icon'
import ExportDialog from './components/address-change-record-export-dialog/index.vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import download from '@/utils/download'
import { getAuth } from '@/utils/export'
import { formatDateString } from '@/utils'
import { renderDict } from '@/hooks/web/useDict'
const { push } = useRouter()
const customerMsg = ref('')
const getMsg = async () => {
  const res = await getCustomerMsg()
  customerMsg.value = res.data
}
function detail(row) {
  push(`/customer/detail?id=${row.id}`)
}
const exportLoading = ref(false)
const exportSubmit = async (e: any) => {
  let exportForm: any = { deathFlag: 0, type: 5 }
  if (e.data == 'select') {
    if (!multipleSelection.value.length) {
      ElMessage.error('请先选中数据')
      return
    }
    exportForm = {
      idList: multipleSelection.value?.map((obj: any) => {
        return obj.id
      }),
      deathFlag: 0,
      type: 5
    }
  } else if (e.data == 'filter') {
    exportForm = {
      search: queryForm.search,
      dateOfDeathBegin: queryForm.dateOfDeathBegin,
      dateOfDeathEnd: queryForm.dateOfDeathEnd,
      deathFlag: 0,
      type: 5
    }
  }
  exportLoading.value = true
  if (e.type == '1') {
    const data = await exportExcelInOne(exportForm)
    download.excel(data.data, '过世老人数据.xlsx')
  }
  if (e.type == '2') {
    const data = await exportToZipExcel(exportForm)
    download.excel(data.data, '过世老人数据.zip')
  }
  if (e.type == '3') {
    const data = await exportWord(exportForm)
    download.zip(data.data, '过世老人数据.zip')
  }
  exportLoading.value = false
}

const multipleSelection = ref<any>([])
const handleSelectionChange = (val: any) => {
  multipleSelection.value = val
}

const exportRef = ref()
function showExportDialog() {
  exportRef.value.show()
}

const tableData = ref()
const total = ref(0)
const tableRef = ref()
const queryFormDefault = {
  searchType: '1', // 1: 精确 2：模糊
  search: undefined,
  accurateSearch: undefined,
  date: undefined,
  dateOfDeathBegin: undefined,
  dateOfDeathEnd: undefined,
  deathFlag: '0',
  type: 5,
  pageNum: 1,
  pageSize: 20
}
const queryForm = reactive<any>({ ...queryFormDefault })

async function getTableList() {
  if (queryForm.searchType === '1') {
    queryForm.accurateSearch = queryForm.search
  }
  if (queryForm.searchType === '2') {
    queryForm.accurateSearch = undefined
  }
  const res = await getCustomerPage(queryForm)
  if (res) {
    tableData.value = res.data.list
    total.value = res.data.total
  }
}

const search = () => {
  if (!queryForm.search && !queryForm.date) {
    return ElMessage.error('请先填写查询条件')
  }
  if (queryForm.searchType === '1' && queryForm.search) {
    queryForm.deathFlag = undefined
  }
  getTableList()
}

const changeDate = () => {
  queryForm.dateOfDeathBegin = queryForm.date ? formatDateString(queryForm.date[0], 'YYYY-MM-DD') : undefined
  queryForm.dateOfDeathEnd = queryForm.date ? formatDateString(queryForm.date[1], 'YYYY-MM-DD') : undefined
}

const reset = () => {
  Object.assign(queryForm, queryFormDefault)
  getTableList()
}

onMounted(() => {
  getMsg()
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
.query-form {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}
</style>
