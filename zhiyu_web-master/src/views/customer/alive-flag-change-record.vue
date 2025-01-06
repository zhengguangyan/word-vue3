<template>
  <el-card shadow="never" class="card">
    <template #header>
      <div class="card-header">
        <span class="title">
          是否健在变更记录：{{ query.title }}{{ changeType }}变更为{{ aliveType }}
          <el-tooltip class="box-item" effect="dark" placement="right-start">
            <template #content>
              数据说明：<br />
              本页面显示的数据为记录变更的操作时间当时的老人信息，而非<br />
              当前系统时间的最新数据，即在变更操作时间后，再进行的信息<br />
              修改，不影响本页面显示的信息数据
            </template>
            <Icon icon="mdi:about-circle-outline" style="vertical-align: middle; padding-bottom: 2px" />
          </el-tooltip>
        </span>
      </div>
    </template>
    <div class="query-form">
      <el-space wrap :size="12">
        <el-button @click="showExportDialog">导出</el-button>
        <el-input v-model="queryForm.keyword" placeholder="请输入操作人/客户姓名/证件号/联系方式" style="width: 360px" />
        <div>
          <span class="date-label">操作时间:</span>
          <el-date-picker v-model="queryForm.date" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" />
        </div>
        <el-button type="primary" @click="getTableData">查询</el-button>
        <el-button @click="reset">重置</el-button>
      </el-space>
    </div>
    <el-table :data="tableData" style="height: calc(100vh - 310px)" @selection-change="handleSelectionChange" class-name="table-without-border" border>
      <el-table-column type="selection" width="40" />
      <el-table-column fixed="left" label="操作" width="70" class-name="table-operation">
        <template #default="{ row }">
          <el-button link type="primary" @click="detail(row)" :disabled="getAuth('customer:index:detail')"> 查看 </el-button>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip prop="type" label="操作类型" width="150">
        <template #default="{ row }"> {{ changeType }}变更为{{ row.aliveFlag == 1 ? '健在' : '去世' }} </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip prop="createTime" label="操作时间" width="180" />
      <el-table-column show-overflow-tooltip prop="creatorName" label="操作人" width="100" />
      <el-table-column show-overflow-tooltip prop="customerName" label="姓名" width="180" />
      <el-table-column show-overflow-tooltip prop="sex" label="性别" width="60">
        <template #default="{ row }">
          {{ renderDict(row.sex, 'vols_sex') }}
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip prop="age" label="年龄" width="60" />
      <el-table-column show-overflow-tooltip prop="mobilephone" label="联系电话" width="180" />
      <el-table-column show-overflow-tooltip prop="idcard" label="证件号码" width="200" />
      <el-table-column show-overflow-tooltip v-if="changeType === '户籍'" prop="domicileRegionName" label="户籍地址" min-width="300" />
      <el-table-column show-overflow-tooltip v-if="changeType === '现居'" prop="currentRegionName" label="现居地址" min-width="300" />
    </el-table>
    <div style="margin-top: 20px">
      <el-pagination
        v-model:current-page="queryForm.pageNum"
        v-model:page-size="queryForm.pageSize"
        :page-sizes="[10, 20, 50, 100, 200, 500]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="getTableData()"
        @current-change="getTableData()"
      />
    </div>
  </el-card>
  <ExportDialog ref="exportRef" title="导出迁入迁出记录" :loading="exportLoading" @export-submit="exportSubmit" @export-close="exportLoading = false" />
</template>
<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue'
import { Icon } from '@/components/Icon'
import { aliveOrNotExport, getAliveFlagChangeRecordPage } from '@/api/customer'
import ExportDialog from './components/address-change-record-export-dialog/index.vue'
import { useCache } from '@/hooks/web/useCache'
const { wsCache } = useCache()
import { useRoute, useRouter } from 'vue-router'
import download from '@/utils/download'
import { ElMessage } from 'element-plus'
import { getAuth } from '@/utils/export'
import { watch } from 'vue'
import { formatDateString } from '@/utils'
import { renderDict } from '@/hooks/web/useDict'

const { query } = useRoute()
const { push } = useRouter()

function detail(row) {
  push(`/customer/detail?id=${row.customerId}`)
}
const exportRef = ref()
function showExportDialog() {
  exportRef.value.show()
}

const exportLoading = ref(false)

const exportSubmit = async (form: any) => {
  const exportForm = {
    addressType: query.changeType,
    type: query.type,
    movingMatch: query.movingMatch,
    title: query.title,
    aliveFlag: query.aliveFlag,
    idList: [],
    keyword: '',
    beginDate: '',
    endDate: ''
  }

  if (form.data === 'select') {
    if (!multipleSelection.value.length) {
      return ElMessage.error('请先选中数据')
    }
    exportLoading.value = true

    exportForm.idList = multipleSelection.value?.map((obj: any) => {
      return obj.id
    })
    const data = await aliveOrNotExport(exportForm)
    download.excel(data.data, '健在变更记录.xlsx')
    exportLoading.value = false
  } else if (form.data === 'filter') {
    exportLoading.value = true
    exportForm.keyword = queryForm.keyword
    exportForm.beginDate = queryForm.date ? queryForm.date[0] : ''
    exportForm.endDate = queryForm.date ? queryForm.date[1] : ''

    const data = await aliveOrNotExport(exportForm)
    download.excel(data.data, '健在变更记录.xlsx')
    exportLoading.value = false
  } else if (form.data === 'all') {
    const data = await aliveOrNotExport(exportForm)
    download.excel(data.data, '健在变更记录.xlsx')
    exportLoading.value = false
  }
}

const multipleSelection = ref<any>([])
const handleSelectionChange = (val: any) => {
  multipleSelection.value = val
}

const queryFormDefault = {
  keyword: undefined,
  beginDate: undefined,
  endDate: undefined,
  date: '',
  pageNum: 1,
  pageSize: 20
}
const queryForm = reactive<any>({ ...queryFormDefault })
const total = ref(0)
const tableData = ref([])

watch(
  () => queryForm.date,
  (e) => {
    if (e) {
      queryForm.beginDate = formatDateString(e[0], 'YYYY-MM-DD')
      queryForm.endDate = formatDateString(e[1], 'YYYY-MM-DD')
    } else {
      queryForm.beginDate = undefined
      queryForm.endDate = undefined
    }
  }
)

const reset = () => {
  Object.assign(queryForm, queryFormDefault)
  getTableData()
}

async function getTableData() {
  const areaCode = wsCache.get('areaCode')
  const res = await getAliveFlagChangeRecordPage({
    ...queryForm,
    areaCode: areaCode,
    aliveFlag: Number(query.aliveFlag),
    type: Number(query.type),
    addressType: query.changeType
  })
  if (res) {
    tableData.value = res.data.list
    total.value = res.data.total
  }
}

const name = ref()
const aliveType = ref()
const changeType = ref()
onMounted(() => {
  name.value = wsCache.get('areaName')
  aliveType.value = Number(query.aliveFlag) == 1 ? '健在' : '去世'
  changeType.value = query.changeType === 'current' ? '现居' : '户籍'
  getTableData()
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
.title {
  color: #313233;
  font-weight: bold;
}
.about {
  margin-left: 10px;
  color: #626466;
  font-size: 14px;
}
.query-form {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}
</style>
