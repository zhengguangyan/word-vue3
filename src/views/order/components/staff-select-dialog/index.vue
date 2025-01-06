<template>
  <el-dialog destroy-on-close v-model="visibleFlag" title="订单派单-选择内部员工" width="1400px" @close="onClose" :close-on-press-escape="false" :close-on-click-modal="false">
    <div class="type-box">
      <span class="type-btn" :class="{ active: recommendType === 'system' }" @click="recommendType = 'system'"> 系统推荐 </span>
      <span class="type-btn" :class="{ active: recommendType === 'manual' }" @click="recommendType = 'manual'"> 人工选择 </span>
    </div>

    <div v-if="recommendType === 'system'">
      <p style="margin-bottom: 10px">
        <el-space wrap :size="12">
          <el-input v-model="form.keyword" placeholder="请输入关键字" clearable style="width: 200px">
            <template #suffix>
              <el-icon><search /></el-icon>
            </template>
          </el-input>
          <el-select v-model="form.isAcceptSum" clearable placeholder="当天是否已接单" style="width: 200px">
            <el-option label="是" value="1" />
            <el-option label="否" value="0" />
          </el-select>
          <DictSelect width="200px" v-model="form.professionals" :distList="filterDict('profession_skill')" placeholder="专业特长" :multiple="true" :clearable="true" />
          <DictSelect width="200px" v-model="form.sex" :distList="filterDict('vols_sex')" placeholder="性别" :clearable="true" />
          <el-button type="primary" @click="getRecommendDataList">查询</el-button>
          <el-button type="reset" @click="resetRecommend">重置</el-button>
        </el-space>
      </p>
      <el-table
        :data="tableData"
        v-loading="loading"
        header-row-class-name="table-header"
        @sort-change="handleSortChangeSystem"
        style="min-height: calc(100vh - 800px); max-height: calc(100vh - 600px); margin-bottom: 5px"
      >
        <el-table-column fixed="left" type="index" width="50" />
        <el-table-column fixed="left" label="操作" width="120" class-name="table-operation">
          <template #default="{ row }">
            <el-button link type="primary" @click="openDetail(row.id)"> 预览 </el-button>
            <el-button link type="primary" @click="openVerify(row)"> 选择 </el-button>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="员工姓名" width="160" show-overflow-tooltip sortable="custom" />
        <el-table-column show-overflow-tooltip prop="sex" label="性别" sortable="custom">
          <template #default="{ row }">
            {{ renderDict(row.sex, 'vols_sex') }}
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="acceptSum" label="当天是否已接单" sortable="custom">
          <template #default="{ row }">
            {{ row.acceptSum ? '是' : '否' }}
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="professionals" label="专业特长" sortable="custom">
          <template #default="{ row }">
            {{ renderDict(row.professionals, 'profession_skill') }}
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        class="r-m-t-20"
        v-model:current-page="form.pageNum"
        v-model:page-size="form.pageSize"
        :page-sizes="[10, 20, 50, 100, 200, 500]"
        layout="total, sizes, prev, pager, next"
        :total="total"
        @size-change="getRecommendDataList"
        @current-change="getRecommendDataList"
      />
    </div>
    <div v-else-if="recommendType === 'manual'">
      <div style="margin-bottom: 10px" class="flex">
        <div class="flex row-between flex-wrap r-p-r-24">
          <el-input class="r-m-b-12" v-model="manualQueryForm.keyword" placeholder="请输入关键字姓名/电话/机构(公司)/服务内容/专业特长" clearable style="width: 906px">
            <template #suffix>
              <el-icon><search /></el-icon>
            </template>
          </el-input>
          <el-select class="r-m-b-12" style="width: 295px" v-model="manualQueryForm.isAcceptSum" clearable placeholder="当天是否已接订单：全部">
            <el-option label="是" value="1" />
            <el-option label="否" value="0" />
          </el-select>
          <DictSelect width="295px" v-model="manualQueryForm.sex" :distList="filterDict('vols_sex')" placeholder="全部性别" :clearable="true" />
          <DictSelect width="295px" v-model="manualQueryForm.orgAttribute" :distList="filterDict('org_attribute')" placeholder="员工性质：全部" :clearable="true" />
          <DictSelect width="295px" v-model="manualQueryForm.roleNames" :distList="roleList" placeholder="员工角色：全部" :multiple="true" :clearable="true" />
          <DictSelect width="295px" v-model="manualQueryForm.professionals" :distList="filterDict('profession_skill')" placeholder="专业特长" :multiple="true" :clearable="true" />
        </div>

        <div class="flex-col manual-button row-right col-bottom">
          <el-button class="r-m-b-12" type="primary" @click="getManualDataList">查询</el-button>
          <el-button type="reset" @click="resetManualData">重置</el-button>
        </div>
      </div>
      <div class="flex col-top">
        <div class="department">
          <span class="font-bold">组织部门</span>
          <el-tree :data="deptTreeList" :props="{ value: 'id', children: 'children', label: 'name' }" accordion @node-click="handleTreeClick" />
        </div>
        <div style="width: calc(100% - 307px)">
          <el-table :data="manualStaffData" v-loading="loading" header-row-class-name="table-header" @sort-change="handleSortChangeManual" style="height: calc(100vh - 600px); margin-bottom: 5px">
            <el-table-column fixed="left" type="index" width="50" />
            <el-table-column fixed="left" label="操作" width="120" class-name="table-operation">
              <template #default="{ row }">
                <el-button link type="primary" @click="openDetail(row.id)"> 预览 </el-button>
                <el-button link type="primary" @click="openVerify(row)"> 选择 </el-button>
              </template>
            </el-table-column>
            <el-table-column prop="name" label="员工姓名" min-width="180" show-overflow-tooltip sortable="custom" />
            <el-table-column show-overflow-tooltip prop="sex" label="性别" min-width="90" sortable="custom">
              <template #default="{ row }">
                {{ renderDict(row.sex, 'vols_sex') }}
              </template>
            </el-table-column>
            <el-table-column prop="orgCompanyName" label="机构(公司)" min-width="150" show-overflow-tooltip sortable="custom" />
            <el-table-column prop="roleNames" label="员工角色" min-width="170" show-overflow-tooltip sortable="custom" />
            <el-table-column prop="acceptSum" label="当天是否已接单" min-width="150" sortable="custom">
              <template #default="{ row }">
                {{ row.acceptSum ? '是' : '否' }}
              </template>
            </el-table-column>
            <el-table-column prop="serveRange" label="服务内容" min-width="170" show-overflow-tooltip sortable="custom" />
            <el-table-column prop="professional" label="专业特长" min-width="170" show-overflow-tooltip sortable="custom" />
          </el-table>
          <el-pagination
            class="r-m-t-20"
            v-model:current-page="manualQueryForm.pageNum"
            v-model:page-size="manualQueryForm.pageSize"
            :page-sizes="[10, 20, 50, 100, 200, 500]"
            layout="total, sizes, prev, pager, next"
            :total="manualTotal"
            @size-change="getManualDataList"
            @current-change="getManualDataList"
          />
        </div>
      </div>
    </div>
  </el-dialog>
  <DetailDialog ref="detailRef" :dict="dictMap" />
  <StaffVerifyDialog ref="verifyRef" :dict="dictMap" @reload-list="reload" />
</template>
<script lang="ts" setup>
import { ref, reactive } from 'vue'
import DictSelect from '@/components/DictSelect/index.vue'
import DetailDialog from '@/views/servicePersonnel/components/detail-dialog/index.vue'
import StaffVerifyDialog from '../staff-verify-dialog/index.vue'
import { getOperatorPage, getRecommendPage } from '@/api/servicePersonnel'
import { Search } from '@element-plus/icons-vue'
import { resetQueryForm } from '@/utils'
import { listDept } from '@/api/sys/Department'
import { getRoleListApi } from '@/api/sys/role'
import { filterDict, renderDict, dictMap } from '@/hooks/web/useDict'

const emits = defineEmits(['reload-list'])

const reload = () => {
  emits('reload-list')
  onClose()
}

const recommendType = ref<'system' | 'manual'>('system')

const visibleFlag = ref(false)

const loading = ref(false)

const statusId = ref()

const orderInfo = ref()

function show(data, status) {
  orderInfo.value = data
  form.latitude = data.latitude
  form.longitude = data.longitude
  form.serveRange = data.community
  statusId.value = status.id
  getRecommendDataList()
  getDeptTree()
  getRoleList()
  getManualDataList()
  if (!tableData.value.length) {
    recommendType.value = 'manual'
  }
  visibleFlag.value = true
}

function onClose() {
  visibleFlag.value = false
}

const formDefault = reactive({
  latitude: undefined,
  longitude: undefined,
  keyword: undefined,
  isAcceptSum: undefined,
  professionals: [],
  sex: undefined,
  orderByColumn: undefined,
  asc: undefined,
  serveRange: undefined,
  pageNum: 1,
  pageSize: 10,
  userStatus: 0,
  isOrder: '1'
})

let form = reactive<any>({ ...formDefault })

const tableData = ref([])
const total = ref(0)
//查询
async function getRecommendDataList() {
  loading.value = true
  const { data } = await getRecommendPage(form)
  tableData.value = data.list
  total.value = data.total
  loading.value = false
}

const resetRecommend = () => {
  resetQueryForm(
    form,
    {
      pageNum: 1,
      pageSize: 20,
      latitude: orderInfo.value.latitude,
      longitude: orderInfo.value.longitude,
      serveRange: orderInfo.value.community
    },
    getRecommendDataList
  )
}

function listToTree(data: any[], parentId: number | null = null): any[] {
  const result: any[] = []
  for (const node of data) {
    if (node.parentId === parentId) {
      const treeNode = { ...node, children: listToTree(data, node.id) }
      result.push(treeNode)
    }
  }

  return result
}
const deptTreeList = ref()
// 部门
async function getDeptTree() {
  deptTreeList.value = []
  listDept().then((res) => {
    deptTreeList.value = [...listToTree(res.data, 0)]
  })
}

const roleList = ref([])

// 角色
async function getRoleList() {
  roleList.value = []
  getRoleListApi({}).then(({ data }) => {
    roleList.value = data.list.map((item) => {
      return {
        value: item.name,
        label: item.name
      }
    })
  })
}

const queryFormDefault = {
  keywords: undefined,
  roleNames: undefined,
  sex: undefined,
  isAcceptSum: undefined,
  orgAttribute: undefined,
  orgCompanyName: undefined,
  userStatus: 0,
  isOrder: '1',
  pageNum: 1,
  pageSize: 20,
  orderByColumn: undefined,
  asc: undefined
}
const manualQueryForm = reactive<any>({ ...queryFormDefault })
const manualStaffData = ref([])
const manualTotal = ref(0)
const getManualDataList = async () => {
  loading.value = true
  const res = await getOperatorPage(manualQueryForm)
  manualStaffData.value = res.data.list
  manualTotal.value = res.data.total
  loading.value = false
}

const resetManualData = () => {
  resetQueryForm(manualQueryForm, { pageNum: 1, pageSize: 20, isOrder: '1', userStatus: 0 }, getManualDataList)
}

const handleTreeClick = (data) => {
  manualQueryForm.orgCompanyName = data.name
  getManualDataList()
}

const handleSortChangeSystem = (column: any) => {
  if (column.order) {
    form.orderByColumn = column.prop
    form.asc = column.order == 'ascending' ? 0 : 1
  } else {
    form.orderByColumn = undefined
    form.asc = undefined
  }
  getRecommendDataList()
}

const handleSortChangeManual = (column: any) => {
  if (column.order) {
    manualQueryForm.orderByColumn = column.prop
    manualQueryForm.asc = column.order == 'ascending' ? 0 : 1
  } else {
    manualQueryForm.orderByColumn = undefined
    manualQueryForm.asc = undefined
  }
  getManualDataList()
}

// 预览
const detailRef = ref()

const openDetail = (id) => {
  detailRef.value.show(id)
}

// 预览
const verifyRef = ref()

const openVerify = async (row) => {
  verifyRef.value.show(row, orderInfo.value, statusId.value)
}

defineExpose({
  show
})
</script>

<style lang="less" scoped>
:deep(.el-row) {
  margin-right: 0 !important;
}
.type-box {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}
.type-btn {
  width: 120px;
  height: 40px;
  border-radius: 4px 0 0 4px;
  border: 1px solid #ebe9e6;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666462;
  font-size: 14px;
  transition: background-color 0.2s, border-color 0.2s, color 0.2s;
  cursor: pointer;
  &:last-child {
    border-radius: 0 4px 4px 0;
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
.manual-button {
  padding-left: 12px;
  border-left: 1px solid #ebe9e6;
}
.department {
  width: 295px;
  height: calc(100vh - 600px);
  margin-right: 11px;
  background: rgba(255, 255, 255, 0.88);
  border-radius: 4px;
  overflow: auto;
  padding: 12px;
}
.staff-org-tree {
  width: 320px;
  height: 580px;
  background: rgba(255, 255, 255, 0.88);
  border: 1px solid #f5f3f0;
  border-radius: 4px;
  float: left;
  overflow-y: auto;
  padding: 12px;
  margin-right: 12px;
}
.staff-org-tree h2 {
  font-size: 14px;
  font-weight: 600;
  color: var(--main-text-color);
  line-height: 16px;
  margin-bottom: 20px;
}
.staff-list {
  width: calc(100% - 340px);
  float: left;
}
</style>
