<template>
  <div>
    <el-card shadow="never" class="card">
      <template #header>
        <div class="card-header">
          <span class="title">服务人员列表</span>
        </div>
      </template>

      <div class="query-form">
        <el-space wrap :size="12">
          <el-input v-model="queryForm.keyword" style="width: 550px" placeholder="姓名/电话/服务内容/服务范围/机构(公司)/本职组织" @change="onSubmit" clearable>
            <template #suffix>
              <el-icon @click="onSubmit"><search /></el-icon>
            </template>
          </el-input>

          <el-link :icon="Filter" type="primary" @click="extraQueryFlag = !extraQueryFlag">高级筛选</el-link>
        </el-space>
      </div>
      <div class="filter-box" :class="{ 'show-filter': !extraQueryFlag }">
        <div class="customer-filter">
          <div class="filter-row">
            <span class="row-head">角色</span>
            <DictSelect clearable v-model="queryForm.roleNames" :distList="roleList" style="width: 100%" :multiple="true" placeholder="请选择(多选)" />
          </div>
          <div class="filter-row">
            <span class="row-head">性别</span>
            <DictSelect clearable v-model="queryForm.sex" :distList="filterDict('sys_user_sex')" style="width: 100%" />
          </div>
          <div class="filter-row">
            <span class="row-head">是否开启接单</span>
            <el-select v-model="queryForm.acceptOrder" placeholder="是否开启接单" style="width: 100%" clearable>
              <el-option label="是" value="1" />
              <el-option label="否" value="0" />
            </el-select>
          </div>
          <div class="filter-row">
            <span class="row-head">账号状态</span>
            <el-select v-model="queryForm.userStatus" placeholder="账号状态" style="width: 100%" clearable>
              <el-option label="冻结" value="1" />
              <el-option label="解冻" value="0" />
            </el-select>
          </div>
          <div class="filter-row">
            <span class="row-head">服务人员性质</span>
            <DictSelect clearable v-model="queryForm.orgAttribute" :distList="filterDict('org_attribute')" style="width: 100%" />
          </div>
          <div class="filter-row">
            <span class="row-head">是否市场化平台</span>
            <el-select v-model="queryForm.ifMarket" placeholder="是否市场化平台" style="width: 100%" clearable>
              <el-option label="是" value="1" />
              <el-option label="否" value="0" />
            </el-select>
          </div>
          <el-space :size="12" style="width: 100%">
            <el-button type="primary" @click="onSubmit">查询</el-button>
            <el-button @click="reset">重置</el-button>
            <el-button @click="extraQueryFlag = !extraQueryFlag">收起</el-button>
          </el-space>
        </div>
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
        <el-table-column fixed="left" label="操作" width="120" class-name="table-operation">
          <template #default="{ row }">
            <el-button link type="primary" @click="openDetail(row.id)" :disabled="getAuth('servicePersonnel:index:detail')"> 预览 </el-button>
            <el-button link type="primary" @click="detail(row)" :disabled="!leafAreaFlag || getAuth('servicePersonnel:index:detail')"> 查看 </el-button>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="acceptOrder" label="是否开启接单" min-width="140" sortable="custom">
          <template #default="{ row }">
            {{ renderDict(row.acceptOrder, 'yes_no') }}
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="name" label="姓名" min-width="180" sortable="custom" />
        <el-table-column show-overflow-tooltip prop="sex" label="性别" min-width="90" sortable="custom">
          <template #default="{ row }">
            {{ renderDict(row.sex, 'sys_user_sex') }}
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="mobilePhone" label="电话" min-width="140" sortable="custom">
          <template #default="{ row }">
            {{ maskPhoneNumber(row.mobilePhone) }}
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="belongDepartMentName" label="本职组织" min-width="150" sortable="custom" />
        <el-table-column show-overflow-tooltip prop="orgAttribute" label="组织属性" min-width="150" sortable="custom">
          <template #default="{ row }">
            {{ renderDict(row.orgAttribute, 'org_attribute') }}
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="orgCompanyName" label="机构(公司)" min-width="150" sortable="custom" />
        <el-table-column show-overflow-tooltip prop="roleNames" label="角色" min-width="170" sortable="custom" />
        <el-table-column show-overflow-tooltip prop="ifMarket" label="是否为市场化平台" min-width="160" sortable="custom">
          <template #default="{ row }">
            {{ renderDict(row.ifMarket, 'yes_no') }}
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="userStatus" label="账号状态" min-width="160">
          <template #default="{ row }">
            <span class="bound" v-if="row.userStatus === '0'">解冻</span>
            <span class="void" v-else-if="row.userStatus === '1'">冻结</span>
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
          @size-change="changeSize"
          @current-change="getTableList"
        />
      </div>
    </el-card>

    <DetailDialog ref="detailRef" :dict="dictMap" />
  </div>
</template>

<script setup lang="ts">
import DictSelect from '@/components/DictSelect/index.vue'
import DetailDialog from './components/detail-dialog/index.vue'
import { ref, reactive, onMounted } from 'vue'
import { Filter, Search } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import { useCache } from '@/hooks/web/useCache'
import { getAuth } from '@/utils/export'
import { maskPhoneNumber } from '@/utils'
import { getOperatorPage } from '@/api/servicePersonnel'
import { getRoleListApi } from '@/api/sys/role'
import { dictMap, filterDict, renderDict } from '@/hooks/web/useDict'

const { wsCache } = useCache()
const leafAreaFlag = ref(wsCache.get('leafAreaFlag'))
const { push } = useRouter()

const extraQueryFlag = ref(false)

function detail(row) {
  push(`/servicePersonnel/personnelDetail?id=${row.id}`)
}

const detailRef = ref()

const openDetail = (id) => {
  detailRef.value.show(id)
}

const queryFormDefault = {
  keyword: undefined,
  roleNames: [],
  sex: undefined,
  acceptOrder: undefined,
  orgAttribute: undefined,
  ifMarket: undefined,
  userStatus: undefined,
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

const getTableList = async () => {
  loading.value = true
  const res = await getOperatorPage(queryForm)
  tableData.value = res.data.list
  total.value = res.data.total
  loading.value = false
}

const changeSize = () => {
  queryForm.pageNum = 1
  getTableList()
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

const roleList = ref([])

// 部门
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

function onSubmit() {
  getTableList()
}

const reset = () => {
  Object.assign(queryForm, queryFormDefault)
  getTableList()
}

onMounted(() => {
  getTableList()
  getRoleList()
})
</script>

<style scoped lang="less">
.filter-box {
  height: 170px;
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
</style>
