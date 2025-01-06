<template>
  <el-card shadow="never" class="card">
    <template #header>
      <div class="card-header">
        <span class="title">批量导入客户</span>
      </div>
    </template>
    <div class="query-form">
      <el-space wrap :size="12">
        <el-button type="primary" @click="showImportDialog" :disabled="!leafAreaFlag || getAuth('customer:index:import')"> 批量导入 </el-button>
        <el-button @click="downloadClick" :disabled="!leafAreaFlag">下载导入模板</el-button>
        <el-input v-model="queryForm.keyword" placeholder="请输入操作人/导入结果/所属区域" style="width: 300px" @change="getData" />
        <el-date-picker
          v-model="queryForm.uploadTime"
          type="datetimerange"
          range-separator="-"
          start-placeholder="导入时间起始"
          end-placeholder="导入时间截止"
          value-format="YYYY-MM-DD HH:mm:ss"
          date-format="YYYY-MM-DD"
          time-format="HH:mm:ss"
          :default-time="defaultTime"
          style="width: 300px"
        />
        <el-button type="primary" @click="getData">查询</el-button>
        <el-button @click="reset">重置</el-button>
      </el-space>
    </div>
    <el-table :data="tableData" header-row-class-name="table-header" class-name="table-without-border list-page-table" :border="true" height="calc(100vh - 320px)">
      <!-- <el-table-column type="selection" width="70" /> -->
      <el-table-column fixed="left" label="操作" width="130" class-name="table-operation">
        <template #default="{ row }">
          <el-button link type="primary" @click="downResult(row)" v-if="row.fileName"> 下载失败数据 </el-button>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip prop="uploadTime" label="导入时间" width="180" />
      <el-table-column show-overflow-tooltip prop="creatorName" label="操作人" width="200" />
      <el-table-column show-overflow-tooltip prop="regionName" label="所属区域" width="350" />
      <el-table-column show-overflow-tooltip prop="uploadResult" label="导入结果" min-width="200" />
      <el-table-column show-overflow-tooltip prop="explainRemark" label="说明" min-width="500" />
    </el-table>
    <div style="margin-top: 20px">
      <el-pagination
        v-model:current-page="queryForm.pageNum"
        v-model:page-size="queryForm.pageSize"
        :page-sizes="[10, 20, 50, 100, 200]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="getData(1)"
        @current-change="getData()"
      />
    </div>
  </el-card>
  <ImportDialog @download-click="downloadClick" @reload-list="getData(1)" ref="importRef" />
</template>
<script lang="ts" setup>
import { ref, reactive, onMounted, watch } from 'vue'
// import { Icon } from "@/components/Icon";
import ImportDialog from './components/customer-import-dialog/index.vue'
import { importTemplate, getBulkImportPage, downloadAndDelete } from '@/api/customer'
import download from '@/utils/download'
import { useCache } from '@/hooks/web/useCache'
import { getAuth } from '@/utils/export'
const { wsCache } = useCache()

const leafAreaFlag = ref(wsCache.get('leafAreaFlag'))

const importRef = ref()

function showImportDialog() {
  importRef.value.show()
}

const total = ref(0)
const defaultTime: [Date, Date] = [new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 1, 1, 23, 59, 59)]
const queryFormDefault = {
  keyword: undefined,
  uploadTime: undefined,
  uploadBeginTime: undefined,
  uploadEndTime: undefined,
  pageNum: 1,
  pageSize: 20
}
const queryForm = reactive({ ...queryFormDefault })

const tableData = ref<any>([])

const downloadClick = async () => {
  const res = await importTemplate()
  download.excel(res.data, '客户批量导入模板.xlsx')
}

const getData = async (page?: any) => {
  if (page) {
    queryForm.pageNum = 1
  }
  const res = await getBulkImportPage({ ...queryForm })
  tableData.value = res.data.list
  total.value = res.data.total
}

const reset = () => {
  Object.assign(queryForm, queryFormDefault)
  getData()
}
watch(
  () => queryForm.uploadTime,
  () => {
    if (queryForm.uploadTime) {
      queryForm.uploadBeginTime = queryForm.uploadTime[0]
      queryForm.uploadEndTime = queryForm.uploadTime[1]
    } else {
      queryForm.uploadBeginTime = undefined
      queryForm.uploadEndTime = undefined
    }
  }
)

// 下载失败数据
const downResult = async (row) => {
  const res = await downloadAndDelete(row.fileName)
  download.excel(res.data, row.fileName)
}

onMounted(() => {
  getData()
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
}
</style>
