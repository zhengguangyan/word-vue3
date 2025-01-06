<template>
  <div>
    <el-card shadow="never" class="card">
      <template #header>
        <div class="card-header">
          <span class="title">工单列表</span>
          <!-- <span class="about">
            <Icon icon="ant-design:question-circle-outlined" style="vertical-align: middle" />
            权限说明
          </span> -->
        </div>
      </template>

      <div class="query-form">
        <el-space wrap :size="12">
          <el-button type="primary" @click="add()" :disabled="!leafAreaFlag || getAuth('worksheet:index:add')">添加</el-button>
          <el-button :disabled="!leafAreaFlag || getAuth('worksheet:index:delete')" @click="batchDelete"> 删除 </el-button>
          <!-- <el-button :disabled="!leafAreaFlag || getAuth('worksheet:index:allot')" @click="showAllocateDialog">分配</el-button> -->
          <!-- <el-button :disabled="!leafAreaFlag || getAuth('worksheet:index:delete')" @click="handlePublicAgency"> 导回公共代办 </el-button> -->
          <el-button @click="showExportDialog" :disabled="getAuth('worksheet:index:export')"> 导出 </el-button>
          <el-input v-model="queryForm.keyword" placeholder="请输工单编号/会员姓名/联系电话/创建人" style="width: 360px" @change="getTableList">
            <template #suffix>
              <el-icon @click="getTableList"><search /></el-icon>
            </template>
          </el-input>
          <el-link :icon="Filter" type="primary" @click="extraQueryFlag = !extraQueryFlag">高级筛选</el-link>
        </el-space>
      </div>
      <div class="filter-box" :class="{ 'show-filter': !extraQueryFlag }">
        <div class="customer-filter">
          <div class="filter-row">
            <span class="row-head">工单类型</span>
            <DictSelect clearable v-model="queryForm.worksheetTypeId" placeholder="工单类型" :distList="filterDict('worksheet_category')" @change="getWorksheetCategoryList" style="width: 100%" />
          </div>
          <div class="filter-row">
            <span class="row-head">工单类别</span>
            <el-select v-model="queryForm.worksheetCategoryId" placeholder="工单类别" @change="getWorksheetTypeList" :disabled="!queryForm.worksheetTypeId" style="width: 100%" clearable>
              <el-option v-for="item in worksheetCategoryList" :key="item.id" :label="item.worksheetTypeName" :value="item.id" />
            </el-select>
          </div>
          <div class="filter-row">
            <span class="row-head">工单子类</span>
            <el-select v-model="queryForm.worksheettypeInfoId" placeholder="工单子类" :disabled="!queryForm.worksheetCategoryId" style="width: 100%" clearable>
              <el-option v-for="item in worksheetTypeInfoList" :key="item.id" :label="item.worksheetTypeName" :value="item.id" />
            </el-select>
          </div>
          <div class="filter-row">
            <span class="row-head">是否结案</span>
            <el-select v-model="queryForm.isClosed" placeholder="是否结案" style="width: 100%" clearable>
              <el-option label="是" value="1" />
              <el-option label="否" value="0" />
            </el-select>
          </div>
          <div class="filter-row">
            <span class="row-head">客户来源</span>
            <DictSelect width="100%" v-model="queryForm.memberSource" :distList="filterDict('member_source')" placeholder="客户来源" :clearable="true" />
          </div>
          <div class="filter-row">
            <span class="row-head">创建时间</span>
            <el-date-picker
              v-model="queryForm.createTime"
              type="daterange"
              range-separator="-"
              start-placeholder="创建时间开始"
              end-placeholder="创建时间结束"
              value-format="YYYY-MM-DD"
              clearable
              style="width: 100%"
            />
          </div>
          <div class="filter-row filter-row-50" style="width: 100%">
            <span class="row-head">现居地址</span>
            <Cascader width="calc(50% - 78px)" :check="true" placeholder="请选择现居地址" v-model="queryForm.currentList" />
          </div>
          <div class="filter-row filter-row-50">
            <span class="row-head">户籍地址</span>
            <Cascader width="100%" :check="true" placeholder="请选择户籍地址" v-model="queryForm.domicileList" />
          </div>
          <el-space :size="12" style="width: 100%">
            <el-button type="primary" @click="onSubmit">查询</el-button>
            <el-button @click="reset">重置</el-button>
            <el-button @click="extraQueryFlag = false">收起</el-button>
          </el-space>
        </div>
      </div>

      <el-table
        :data="tableData"
        ref="tableRef"
        header-row-class-name="table-header"
        @selection-change="handleSelectionChange"
        @sort-change="handleSortChange"
        v-loading="loading"
        class-name="table-without-border r-m-t-10"
        height="calc(100vh - 310px)"
      >
        <el-table-column type="selection" width="40" />
        <el-table-column fixed="left" label="操作" width="160" class-name="table-operation">
          <template #default="{ row }">
            <el-button link type="primary" @click="detail(row)" :disabled="getAuth('worksheet:index:detail')"> 查看 </el-button>
            <el-button link :disabled="row.isClosed === 1 || getAuth('worksheet:index:edit')" type="primary" @click="edit(row)" v-if="leafAreaFlag"> 编辑 </el-button>
            <el-popconfirm title="是否删除该记录？" @confirm="del(row.id)" v-if="leafAreaFlag">
              <template #reference>
                <el-button link type="primary" :disabled="getAuth('worksheet:index:delete')"> 删除 </el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
        <el-table-column prop="worksheetNo" label="工单编号" width="200" show-overflow-tooltip sortable="custom" />
        <el-table-column show-overflow-tooltip prop="createTime" label="创建时间" width="180" sortable="custom" />
        <el-table-column show-overflow-tooltip prop="creatorName" label="创建人" width="100" sortable="custom" />
        <el-table-column show-overflow-tooltip prop="isClosed" label="是否结案" width="100">
          <template #default="{ row }">
            {{ row.isClosed != 0 ? '是' : '否' }}
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="worksheetType" label="工单类型" width="110" sortable="custom">
          <template #default="{ row }">
            {{ renderDict(row.worksheetTypeId, 'worksheet_category') }}
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="worksheetCategory" label="工单类别" width="110" sortable="custom">
          <template #default="{ row }">
            {{ filterWorksheetType(row.worksheetCategoryId) }}
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="worksheettypeInfo" label="工单子类" width="110" sortable="custom">
          <template #default="{ row }">
            {{ filterWorksheetType(row.worksheettypeInfoId) }}
          </template>
        </el-table-column>
        <el-table-column prop="customerName" label="会员姓名" width="180" show-overflow-tooltip sortable="custom" />
        <el-table-column prop="mobilephone" label="联系电话" width="200" show-overflow-tooltip sortable="custom" />
        <el-table-column prop="currentCountyName" label="区（现居）" width="150" show-overflow-tooltip sortable="custom" />
        <el-table-column prop="currentStreetName" label="街道（现居）" width="150" show-overflow-tooltip sortable="custom" />
        <el-table-column prop="currentCommunityName" label="归属社区（现居）" width="160" show-overflow-tooltip sortable="custom" />
        <el-table-column prop="domicileCountyName" label="区（户籍）" width="150" show-overflow-tooltip sortable="custom" />
        <el-table-column prop="domicileStreetName" label="街道（户籍）" width="150" show-overflow-tooltip sortable="custom" />
        <el-table-column prop="domicileCommunityName" label="归属社区（户籍）" width="160" show-overflow-tooltip sortable="custom" />
        <el-table-column show-overflow-tooltip prop="memberSource" label="会员来源" width="110" sortable="custom">
          <template #default="{ row }">
            {{ renderDict(row.memberSource, 'member_source') }}
          </template>
        </el-table-column>
        <el-table-column prop="lastContactTime" label="最后联系时间" width="180" sortable="custom" />
        <el-table-column prop="lastContactUserName" label="最后联系人" width="120" sortable="custom" />
        <el-table-column show-overflow-tooltip prop="returnTime" label="下次回访时间" width="180" sortable="custom" />
        <el-table-column show-overflow-tooltip prop="returnUserName" label="回访人" width="100" sortable="custom" />
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
  <WorksheetEditDrawer ref="editRef" :dict="dictMap" @reload-list="getTableList" />
  <ExportDialog ref="exportRef" :multipleSelection="multipleSelection" :queryForm="queryForm" />
  <AllocateFormDialog :multipleSelection="multipleSelection" ref="allocateRef" @reload-list="getTableList" />
</template>
<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue'
import { Filter, Search } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRouter } from 'vue-router'
import Cascader from '/@/components/Cascader/index.vue'

import { getWorksheetPage, getAllWorksheetTypeList, deleteWorksheet, savePublicAgency } from '@/api/worksheet/index'
import DictSelect from '/@/components/DictSelect/index.vue'
import WorksheetEditDrawer from './components/worksheet-edit-drawer/index.vue'
import ExportDialog from './components/export-dialog/index.vue'
import AllocateFormDialog from './components/allocate-form-dialog/index.vue'
import { useCache } from '@/hooks/web/useCache'
import { filterDict, renderDict, dictMap } from '@/hooks/web/useDict'
// import { useAppStore } from '@/store/modules/app'
import { getAuth } from '@/utils/export'
const { wsCache } = useCache()
// const appStore = useAppStore()

const { push } = useRouter()

const extraQueryFlag = ref(false)

function add() {
  push(`/service/add?serviceType=consult`)
}

function detail(row) {
  push(`/worksheet/details?id=${row.id}`)
}

const allocateRef = ref()
function showAllocateDialog() {
  if (multipleSelection.value?.length == 0) {
    ElMessage.error('未选择数据')
    return
  }
  allocateRef.value.show()
}

const leafAreaFlag = ref(wsCache.get('leafAreaFlag'))
// const currentUser = ref(wsCache.get(appStore.getUserInfo).user.nickname)

const editRef = ref()
function edit(data) {
  editRef.value.show(data)
}
const queryFormDefault = {
  keywords: undefined,
  worksheetTypeId: undefined,
  worksheetCategoryList: undefined,
  worksheettypeInfoId: undefined,
  isClosed: undefined,
  isConnect: undefined,
  memberSource: undefined,
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
  worksheetCategoryId: undefined,
  currentList: [],
  domicileList: [],
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
  const res = await getWorksheetPage(queryForm)
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

const worksheetTypeList = ref<any>([])
const worksheetTypeInfoList = ref<any>([])
async function getWorksheetTypeList(value) {
  queryForm.worksheettypeInfoId = undefined
  const result = await getAllWorksheetTypeList({ parentId: value })
  if (value === 0) {
    worksheetTypeList.value = result.data
  } else {
    worksheetTypeInfoList.value = result.data
  }
}
const worksheetCategoryList = ref<any>([])
async function getWorksheetCategoryList(value) {
  queryForm.worksheetCategoryId = undefined
  queryForm.worksheettypeInfoId = undefined
  const result = await getAllWorksheetTypeList({ parentId: value })
  worksheetCategoryList.value = result.data
}

const allWorksheetTypeList = ref([])

const getWorksheetTypeAllList = async () => {
  const res = await getAllWorksheetTypeList({})
  allWorksheetTypeList.value = res.data
}
const filterWorksheetType = (key: any) => {
  return (worksheetTypeList.value.find((item: any) => item.id == key) as any)?.worksheetTypeName
}

const multipleSelection = ref<any>([])
const handleSelectionChange = (val: any) => {
  multipleSelection.value = val
}
const exportRef = ref()
function showExportDialog() {
  exportRef.value.show()
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

async function del(ids) {
  ElMessageBox.confirm('', '确定删除工单数据？')
    .then(async () => {
      const res: any = await deleteWorksheet(ids)
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

const reset = () => {
  Object.assign(queryForm, queryFormDefault)
  getTableList()
}

onMounted(() => {
  getTableList()
  getWorksheetTypeList(0)
  getWorksheetTypeAllList()
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
.el-col-md-24 {
  margin-top: 20px;
}
</style>
<style scoped lang="less">
.query-form {
  display: flex;
  justify-content: space-between;
  align-items: center;
  // margin-bottom: 10px;
}
.filter-box {
  height: 266px;
  overflow: hidden;
  transition: height 0.5s ease-in-out;
  .filter-row {
    &.filter-row-50 {
      width: 50%;
    }
    > span {
      width: 60px;
    }
  }
}
.show-filter {
  height: 0;
}
</style>
