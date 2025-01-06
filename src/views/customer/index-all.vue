<template>
  <div>
    <el-card shadow="never" class="card">
      <template #header>
        <div class="card-header">
          <span class="title">全部客户</span>
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
          <el-button type="primary" @click="addCustomer" :disabled="!leafAreaFlag || getAuth('customer:all:add')"> 添加客户 </el-button>
          <!-- <el-button :disabled="!leafAreaFlag || getAuth('customer:all:allot')">分配</el-button> -->
          <!-- <el-button :disabled="!leafAreaFlag || getAuth('customer:all:packet')">生成数据包</el-button> -->
          <el-button :disabled="!leafAreaFlag || getAuth('customer:all:equipment')">批量关联设备卡</el-button>
          <el-button :disabled="getAuth('customer:all:analyse')" @click="showAnalysisOptionsDialog">数据分析</el-button>
          <el-button @click="showExportDialog" :disabled="getAuth('customer:all:export')">导出</el-button>
          <el-popover :width="320" trigger="click" @show="showSaturationStatistics">
            <template #reference>
              <el-button :disabled="getAuth('customer:all:saturability')">饱和度计算</el-button>
            </template>
            <div v-loading="saturationStatisticsLoading">
              <el-space spacer="|">
                <div class="saturation-box">
                  <strong> {{ xiamenFlag ? saturationStatistics.generalInfoPct : saturationStatistics.generalInfoNonePct }}% </strong>
                  <span>总体</span>
                </div>
                <div class="saturation-box">
                  <strong> {{ xiamenFlag ? saturationStatistics.baseInfoPct : saturationStatistics.baseInfoNonePct }}% </strong>
                  <span>基础</span>
                </div>
                <div class="saturation-box">
                  <strong> {{ xiamenFlag ? saturationStatistics.extenInfoPct : saturationStatistics.extenInfoNonePct }}% </strong>
                  <span>延伸</span>
                </div>
                <div class="saturation-box">
                  <strong> {{ xiamenFlag ? saturationStatistics.demandInfoPct : saturationStatistics.demandInfoNonePct }}% </strong>
                  <span>需求</span>
                </div>
              </el-space>
              <el-divider style="margin: 5px 0" />
              <el-space spacer="|">
                <div class="saturation-box">
                  <strong> {{ xiamenFlag ? saturationStatistics.visitInfoPct : saturationStatistics.visitInfoNonePct }}% </strong>
                  <span>拜访</span>
                </div>
                <div class="saturation-box">
                  <strong> {{ xiamenFlag ? saturationStatistics.familyInfoPct : saturationStatistics.familyInfoNonePct }}% </strong>
                  <span>家庭</span>
                </div>
                <div class="saturation-box">
                  <strong> {{ xiamenFlag ? saturationStatistics.healthInfoPct : saturationStatistics.healthInfoNonePct }}% </strong>
                  <span>健康</span>
                </div>
              </el-space>
            </div>
          </el-popover>
          <el-input v-model="queryForm.accurateSearch" placeholder="精确搜索证件号/联系电话/ID" style="width: 250px" @change="getTableList(null)" v-show="isAccurate">
            <template #suffix>
              <el-icon @click="getTableList(null)"><search /></el-icon>
            </template>
          </el-input>
          <el-link :icon="Filter" type="primary" @click="showFilterDialog">
            高级筛选
            <span v-if="filterKeyCount > 0">({{ filterKeyCount }})</span>
          </el-link>
        </el-space>
      </div>
      <CustomerFilterDrawer :dict="dictMap" ref="filterRef" :activeIndex="activeIndex" @reload-list="getTableList" @change-accurate="changeAccurate" />
      <el-table
        :data="tableData"
        ref="tableRef"
        header-row-class-name="table-header"
        @selection-change="handleSelectionChange"
        v-loading="loading"
        class-name="table-without-border r-m-t-10"
        @sort-change="handleSortChange"
        border
        height="calc(100vh - 320px)"
      >
        <el-table-column type="selection" width="40" />
        <el-table-column fixed="left" label="操作" width="110" class-name="table-operation">
          <template #default="scope">
            <el-button link type="primary" @click="detail(scope.row)"> 查看 </el-button>
            <el-button link type="primary" @click="edit(scope.row)" :disabled="!leafAreaFlag || getAuth('customer:all:edit') || scope.row.deathFlag == '0'"> 编辑 </el-button>
            <!-- <el-button
                link
               
                type="primary"
                @click="question(scope.row)"
                :disabled="!leafAreaFlag"
              >
                编辑市场化问卷
              </el-button> -->
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="id" label="客户ID" width="160" />
        <el-table-column show-overflow-tooltip prop="name" label="姓名" width="180" />
        <el-table-column show-overflow-tooltip prop="sex" label="性别" width="60">
          <template #default="{ row }">
            {{ renderDict(row.sex, 'vols_sex') }}
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="age" label="年龄" width="80" sortable="custom" />
        <el-table-column show-overflow-tooltip prop="mobilephone" label="联系电话" width="130">
          <template #default="{ row }">
            {{ row.mobilephone.split(',').map(maskPhoneNumber).join(',') }}
          </template>
        </el-table-column>
        <el-table-column prop="serviceObjSource" label="服务对象来源（一级）" width="180" show-overflow-tooltip>
          <template #default="{ row }">
            {{ renderDict(row.serviceObjSource, 'service_obj_source') }}
          </template>
        </el-table-column>
        <el-table-column prop="secondServiceSource" label="服务对象来源（二级）" width="180" show-overflow-tooltip>
          <template #default="{ row }">
            {{ belongList(row.secondServiceSource) }}
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="serviceLabel" label="一级服务标签" width="150">
          <template #default="{ row }">
            {{ renderDict(row.serviceLabel, 'service_label') }}
          </template>
        </el-table-column>
        <el-table-column prop="secondServiceLabel" label="二级服务标签" width="150" show-overflow-tooltip>
          <template #default="{ row }">
            {{ renderDict(row.secondServiceLabel, 'second_service_label') }}
          </template>
        </el-table-column>
        <el-table-column prop="thirdServiceLabel" label="三级服务标签" width="150" show-overflow-tooltip>
          <template #default="{ row }">
            {{ renderDict(row.thirdServiceLabel, 'third_service_label') }}
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="serviceStandards" label="服务标准" width="130">
          <template #default="{ row }">
            {{ renderDict(row.serviceStandards, 'service_standards') }}
          </template>
        </el-table-column>
        <el-table-column :prop="xiamenFlag ? 'generalInfoCount' : 'generalInfoCountnone'" label="信息饱和度" width="120" sortable="custom">
          <template #default="{ row }">
            {{ xiamenFlag ? (row.generalInfoCount || 0) + ' %' : (row.generalInfoCountnone || 0) + ' %' }}
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="visitnumber" label="拜访次数" width="120" sortable="custom" />
        <el-table-column prop="currentAllAddress" label="现居地址" width="300" show-overflow-tooltip />
        <el-table-column show-overflow-tooltip prop="liveOld" label="居住情况" width="100">
          <template #default="{ row }">
            {{ renderDict(row.liveOld, 'live_situation') }}
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="elderClassifyOld" label="老人分类" width="100">
          <template #default="{ row }">
            {{ renderDict(row.elderClassifyOld, 'elder_classify') }}
          </template>
        </el-table-column>
        <el-table-column prop="subsidyStandard" label="政府补助标准" width="200" show-overflow-tooltip>
          <template #default="{ row }">
            {{ renderDict(row.subsidyStandard, 'subsidy_standard') }}
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="idcard" label="证件号码" width="180" />
        <el-table-column show-overflow-tooltip prop="childrennumSection" label="子女数量" width="110" sortable="custom" />
        <el-table-column show-overflow-tooltip prop="reputationEvaluation" label="信誉评估" width="100">
          <template #default="{ row }">
            {{ renderDict(row.reputationEvaluation, 'reputation_evaluation') }}
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="updateTime" label="更新时间" width="180" sortable="custom" />
        <el-table-column prop="finalContactTime" label="最后接通时间" width="180" sortable="custom" />
        <el-table-column show-overflow-tooltip prop="finalCareTime" label="最后关怀时间" width="180" sortable="custom" />
        <el-table-column show-overflow-tooltip prop="createTime" label="创建时间" width="180" sortable="custom" />
      </el-table>
      <div style="margin-top: 20px">
        <el-pagination
          v-model:current-page="queryForm.pageNum"
          v-model:page-size="queryForm.pageSize"
          :page-sizes="[10, 20, 50, 100, 200, 500]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="getTableList(null)"
          @current-change="getTableList(null)"
        />
      </div>
    </el-card>
  </div>
  <CustomerFormDialog :dict="dictMap" ref="formRef" @reload-list="getTableList" />

  <CustomerExportDialog ref="exportRef" :queryForm="queryForm" :multipleSelection="multipleSelection" />
  <AnalysisOptionDialog ref="analysisOptionRef" />
</template>
<script setup lang="ts">
import { useCache } from '@/hooks/web/useCache'
import { ref, reactive, onMounted } from 'vue'
import { Filter, Search } from '@element-plus/icons-vue'
import { getCustomerMsg, getCustomerPage, getSaturationStatistics } from '@/api/customer/index'
import { useRouter } from 'vue-router'
import CustomerFormDialog from './components/customer-form-dialog/index.vue'
import CustomerExportDialog from './components/customer-export-dialog/index.vue'
import AnalysisOptionDialog from './components/analysis-options-dialog/index.vue'
import CustomerFilterDrawer from './components/customer-filter-drawer/index.vue'
import { getAuth } from '@/utils/export'
import { maskPhoneNumber } from '@/utils/index'
import { dictMap, renderDict } from '@/hooks/web/useDict'
import useBelong from '@/hooks/web/useBelong'

// @ts-ignore
defineOptions({
  // eslint-disable-next-line vue/component-definition-name-casing
  name: 'Customer-all'
})
const { wsCache } = useCache()
const { belongList } = useBelong()
const { push } = useRouter()
const activeIndex = ref('2')
const leafAreaFlag = ref(wsCache.get('leafAreaFlag'))
const xiamenFlag = ref(wsCache.get('xiamenFlag'))
const tableData = ref()
const total = ref(0)
const tableRef = ref()
const loading = ref(false)
const queryFormDefault = {
  accurateSearch: undefined,
  id: undefined,
  orderByColumn: undefined,
  asc: undefined,
  pageNum: 1,
  pageSize: 20,
  type: 3
}
const queryForm = reactive<any>({ ...queryFormDefault })
const filterKeyCount = ref(0)

async function getTableList(filterForm) {
  if (filterForm) {
    queryForm.accurateSearch = undefined
    Object.keys(queryForm).forEach((key) => {
      delete queryForm[key]
    })
    Object.assign(queryForm, filterForm)
    // 排除空字符串，空数组，undefined
    const cleanObj = Object.keys(filterForm)
      .filter((key) => {
        const value = filterForm[key]
        return value !== null && value !== undefined && value !== '' && (!Array.isArray(value) || (Array.isArray(value) && value.length > 0))
      })
      .reduce((result, key) => {
        result[key] = filterForm[key]
        return result
      }, {})
    filterKeyCount.value = Object.keys(cleanObj).length - 3
  }
  loading.value = true
  const res = await getCustomerPage(queryForm)
  if (res) {
    tableData.value = res.data.list
    total.value = res.data.total
    loading.value = false
    getMsg()
  }
}
const customerMsg = ref('')

const getMsg = async () => {
  const res = await getCustomerMsg()
  customerMsg.value = res.data
}

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
  getTableList(null)
}
const formRef = ref()
function addCustomer() {
  formRef.value.show()
}

const isAccurate = ref(true)
const filterRef = ref()
function showFilterDialog() {
  filterRef.value.show()
  changeAccurate()
}
const changeAccurate = () => {
  isAccurate.value = !isAccurate.value
}
const exportRef = ref()
function showExportDialog() {
  exportRef.value.show()
}

const analysisOptionRef = ref()
function showAnalysisOptionsDialog() {
  analysisOptionRef.value.show()
}

function detail(row) {
  push(`/customer/detail?id=${row.id}`)
}

function edit(row) {
  push(`/customer/edit?id=${row.id}&customerUpdate=true`)
}

const saturationStatistics = ref<any>({})
const saturationStatisticsLoading = ref(false)
const areaCode = ref(wsCache.get('areaCode'))
// const areaName = ref(wsCache.get('areaName'))
async function showSaturationStatistics() {
  saturationStatisticsLoading.value = true
  const res = await getSaturationStatistics({
    queryAreaCode: areaCode.value,
    ...queryForm
  })
  if (res.data) {
    saturationStatistics.value = res.data
  }
  saturationStatisticsLoading.value = false
}

// function question(row) {
//   push(`/customer/question?id=${row.id}`)
// }

// const handleSelect = (key: string) => {
//   activeIndex.value = key
// }

onMounted(() => {
  getTableList(null)
})
</script>
<style>
.el-menu--horizontal {
  height: 30px !important;
  border: 0 !important;
}
.el-menu--horizontal > .el-menu-item {
  padding: 0 10px !important;
}

.el-card__header {
  padding: 0;
}
.el-card__body {
  padding-left: 0;
  padding-right: 0;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.about {
  font-size: 14px;
  font-weight: 400;
  color: #666462;
}
.query-form {
  display: flex;
  justify-content: space-between;
  align-items: center;
  /* margin-bottom: 10px; */
}
</style>
