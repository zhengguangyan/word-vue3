<template>
  <div>
    <el-card shadow="never" class="card">
      <template #header>
        <div class="card-header">
          <span class="title">关怀管理</span>
          <!-- <span class="about">
            <Icon icon="ant-design:question-circle-outlined" style="vertical-align: middle" />
            权限说明
          </span> -->
        </div>
      </template>

      <div class="query-form">
        <el-space wrap :size="12">
          <el-button type="primary" @click="add()" :disabled="!leafAreaFlag || getAuth('careinfo:index:add')"> 添加 </el-button>
          <el-button v-if="leafAreaFlag" :disabled="getAuth('careinfo:index:delete')" @click="batchDelete"> 删除 </el-button>
          <!-- <el-button :disabled="!leafAreaFlag || getAuth('worksheet:index:allot')" @click="showAllocateDialog">分配</el-button> -->
          <!-- <el-button :disabled="!leafAreaFlag || getAuth('worksheet:index:delete')" @click="handlePublicAgency"> 导回公共代办 </el-button> -->
          <el-button @click="showExportDialog" :disabled="getAuth('careinfo:index:export')">导出</el-button>
          <el-input v-model="queryForm.keyword" placeholder="请输入关怀编号/会员姓名/联系电话/创建项目名称" style="width: 360px" @change="getTableList">
            <template #suffix>
              <el-icon @click="getTableList"><search /></el-icon>
            </template>
          </el-input>
          <el-link :icon="Filter" type="primary" @click="extraQueryFlag = !extraQueryFlag"> 高级筛选 </el-link>
        </el-space>
      </div>
      <div class="filter-box" :class="{ 'show-filter': !extraQueryFlag }">
        <div class="customer-filter">
          <div class="filter-row">
            <span class="row-head">是否结案</span>
            <el-select v-model="queryForm.isClosed" placeholder="是否结案" style="width: 100%" clearable>
              <el-option label="是" value="1" />
              <el-option label="否" value="0" />
            </el-select>
          </div>
          <div class="filter-row">
            <span class="row-head">是否接通</span>
            <el-select v-model="queryForm.isConnect" placeholder="是否接通" style="width: 100%" clearable>
              <el-option label="是" value="1" />
              <el-option label="否" value="0" />
            </el-select>
          </div>
          <div class="filter-row">
            <span class="row-head">归属项目</span>
            <DictSelect width="100%" v-model="queryForm.belongProjectType" :distList="filterDict('project_type')" placeholder="归属项目" :clearable="true" />
          </div>
          <div class="filter-row">
            <span class="row-head">创建时间</span>
            <el-date-picker
              style="width: 100%"
              v-model="queryForm.createTime"
              type="daterange"
              range-separator="-"
              start-placeholder="创建时间开始"
              end-placeholder="创建时间结束"
              value-format="YYYY-MM-DD"
              clearable
            />
          </div>
          <div class="filter-row" style="width: 100%">
            <span class="row-head">现居地址</span>
            <Cascader class="mr-2" :check="true" placeholder="请选择现居地址" v-model="queryForm.currentList" />
          </div>
          <div class="filter-row" style="width: 100%">
            <span class="row-head">户籍地址</span>
            <Cascader class="mr-2" :check="true" placeholder="请选择户籍地址" v-model="queryForm.domicileList" />
          </div>

          <el-space style="width: 100%" :size="12">
            <el-button type="primary" @click="onSubmit">查询</el-button>
            <el-button @click="reset">重置</el-button>
            <el-button @click="extraQueryFlag = false">收起</el-button>
          </el-space>
        </div>
      </div>
      <el-table
        :data="tableData"
        ref="tableRef"
        @selection-change="handleSelectionChange"
        @sort-change="handleSortChange"
        header-row-class-name="table-header"
        v-loading="loading"
        class-name="table-without-border list-page-table"
        height="calc(100vh - 310px)"
      >
        <el-table-column type="selection" width="40" />
        <el-table-column fixed="left" label="操作" width="160" class-name="table-operation">
          <template #default="{ row }">
            <el-button link type="primary" @click="detail(row)" :disabled="getAuth('careinfo:index:detail')"> 查看 </el-button>
            <el-button link type="primary" @click="edit(row)" :disabled="row.isClosed === 1 || getAuth('careinfo:index:edit')" v-if="leafAreaFlag"> 编辑 </el-button>
            <el-button v-if="leafAreaFlag" link type="primary" :disabled="getAuth('careinfo:index:delete') || row.isClosed === 1" @click="del(row.id)"> 删除 </el-button>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="careNo" label="关怀编号" width="180" sortable="custom" />
        <el-table-column prop="createTime" label="创建时间" width="180" sortable="custom" />
        <el-table-column prop="creatorName" label="创建人" width="100" sortable="custom" />
        <el-table-column show-overflow-tooltip prop="isClosed" label="是否结案" width="80">
          <template #default="{ row }">
            <span v-if="row.isClosed == 0">否</span>
            <span v-else-if="row.isClosed == 1">是</span>
            <span v-else></span>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="isConnect" label="是否接通" width="80">
          <template #default="{ row }">
            <span v-if="row.isConnect == 0">否</span>
            <span v-else-if="row.isConnect == 1">是</span>
            <span v-else></span>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="customerId" label="客户ID" width="180" sortable="custom" />
        <el-table-column prop="customerName" label="客户姓名" width="180" sortable="custom" />
        <el-table-column prop="phone" label="联系电话" width="200" show-overflow-tooltip sortable="custom" />
        <el-table-column prop="belongProjectType" label="归属项目" width="120" sortable="custom">
          <template #default="{ row }">
            {{ renderDict(row.belongProjectType, 'project_type') }}
          </template>
        </el-table-column>
        <el-table-column prop="belongProjectName" label="归属项目名称" width="180" show-overflow-tooltip sortable="custom">
          <template #default="{ row }">
            <span v-if="row.belongProjectType == '2'">
              {{ renderDict(row.belongProjectName, 'service_package_type') }}
            </span>
            <span v-if="row.belongProjectType == '7'">
              {{ renderDict(row.belongProjectName, 'carePackage_type') }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="reserveTime" label="预定关怀时间" width="200" show-overflow-tooltip sortable="custom">
          <template #default="{ row }">
            <!-- {{ formatDateString(row.reserveTime, 'YYYY-MM-DD') }} -->
            {{ row.reserveTime }}
          </template>
        </el-table-column>
        <el-table-column prop="reserveUserName" label="预定关怀客服" width="160" sortable="custom" />
        <el-table-column prop="currentAllAddress" label="现居地所在地区" min-width="300" show-overflow-tooltip />
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
  <CareinfoEditDrawer ref="editRef" :dict="dictMap" @reload-list="getTableList" />
  <ExportDialog ref="exportRef" :multipleSelection="multipleSelection" :queryForm="queryForm" :loading="exportLoading" title="关怀列表" @export-submit="exportExcel" />
  <AllocateFormDialog :multipleSelection="multipleSelection" ref="allocateRef" @reload-list="getTableList" />
</template>
<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue'
import { Filter, Search } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import DictSelect from '/@/components/DictSelect/index.vue'
import { getCareinfoPage, deleteCareinfo, savePublicAgency } from '@/api/careinfo/index'
import CareinfoEditDrawer from './components/careinfo-edit-drawer/index.vue'
import ExportDialog from './components/export-dialog/index.vue'
import AllocateFormDialog from './components/allocate-form-dialog/index.vue'
import { useRouter } from 'vue-router'
// import { formatDateString } from '@/utils'
import { useCache } from '@/hooks/web/useCache'
// import { useAppStore } from '@/store/modules/app'
import { getAuth } from '@/utils/export'
import Cascader from '/@/components/Cascader/index.vue'
import download from '@/utils/download'
import { exportCare } from '@/api/worksheet'
import { filterDict, renderDict, dictMap } from '@/hooks/web/useDict'

const { wsCache } = useCache()
// const appStore = useAppStore()
const { push } = useRouter()

const leafAreaFlag = ref(wsCache.get('leafAreaFlag'))
// const currentUser = ref(wsCache.get(appStore.getUserInfo).user.nickname)

const loading = ref(true)
const extraQueryFlag = ref(false)
const multipleSelection = ref<any>([])
const handleSelectionChange = (val: any) => {
  multipleSelection.value = val
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
const exportRef = ref()
function showExportDialog() {
  exportRef.value.show()
}

const allocateRef = ref()
function showAllocateDialog() {
  if (multipleSelection.value?.length == 0) {
    ElMessage.error('未选择数据')
    return
  }
  allocateRef.value.show()
}

function add() {
  push(`/service/add?serviceType=care`)
}

function detail(row) {
  push(`/careinfo/detail?id=${row.id}`)
}

const editRef = ref()
function edit(row) {
  editRef.value.show(row)
}

const queryFormDefault = {
  keyword: undefined,
  isClosed: undefined,
  isConnect: undefined,
  belongProjectType: undefined,
  domicileProvince: undefined,
  domicileCity: undefined,
  domicileCounty: undefined,
  domicileStreet: undefined,
  domicileCommunity: undefined,
  currentProvince: undefined,
  currentCity: undefined,
  currentCounty: undefined,
  currentStreet: undefined,
  currentCommunity: undefined,
  createTime: undefined,
  createBeginTime: undefined,
  createEndTime: undefined,
  orderByColumn: undefined,
  asc: undefined,
  currentList: [],
  domicileList: [],
  pageNum: 1,
  pageSize: 20
}
const queryForm = reactive<any>({ ...queryFormDefault })

const tableData = ref()
const total = ref(0)
const tableRef = ref()

async function getTableList() {
  loading.value = true
  const res = await getCareinfoPage(queryForm)
  tableData.value = res.data.list
  total.value = res.data.total
  loading.value = false
}

function onSubmit() {
  getTableList()
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
const reset = () => {
  Object.assign(queryForm, queryFormDefault)
  getTableList()
}

function del(ids) {
  ElMessageBox.confirm('', '确定删除关怀数据？')
    .then(async () => {
      const res: any = await deleteCareinfo(ids)
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

async function handlePublicAgency() {
  let idList = tableRef.value.getSelectionRows()
  if (idList.length === 0) {
    ElMessage.error('请先选择要操作的记录')
    return
  }
  let ids = idList.map((obj) => obj.id).join(',')
  const res: any = await savePublicAgency(ids)
  if (res.code === 200) {
    ElMessage.success('操作成功')
    getTableList()
  }
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
    const data = await exportCare(exportForm)
    download.excel(data.data, '关怀列表.xlsx')
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

.extra-query-form {
  background-color: #f7f8fa;
  padding: 20px;
  margin: 10px 0;
}
</style>

<style scoped lang="less">
.filter-box {
  height: 215px;
  overflow: hidden;
  transition: height 0.5s ease-in-out;
}
.show-filter {
  height: 0;
}
</style>
