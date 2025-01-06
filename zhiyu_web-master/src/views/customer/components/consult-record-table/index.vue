<template>
  <el-space wrap :size="12" style="margin-bottom: 10px">
    <el-button type="primary" @click="add()" :disabled="!leafAreaFlag || getAuth('worksheet:index:add')"> 新增 </el-button>
    <el-popconfirm width="180" title="是否删除所选记录？" @confirm="batchDelete">
      <template #reference>
        <el-button :disabled="!leafAreaFlag || getAuth('worksheet:index:delete')"> 删除 </el-button>
      </template>
    </el-popconfirm>
    <!-- <el-button :disabled="!leafAreaFlag || getAuth('worksheet:index:allot')" @click="showAllocateDialog">分配</el-button> -->
    <!-- <el-button :disabled="!leafAreaFlag || getAuth('worksheet:index:delete')" @click="handlePublicAgency"> 导回公共待办 </el-button> -->
  </el-space>
  <el-table
    :data="tableData"
    ref="tableRef"
    header-row-class-name="table-header"
    :style="{
      height: 'calc(100vh - 440px)',
      border: '1px solid #f5f3f0',
      borderRadius: '8px'
    }"
    v-loading="loading"
    @selection-change="handleSelectionChange"
    @sort-change="handleSortChange"
  >
    <el-table-column type="selection" width="40" />
    <el-table-column fixed="left" label="操作" width="150" class-name="table-operation">
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
    <el-table-column show-overflow-tooltip prop="createTime" label="创建时间" sortable="custom" min-width="180" />
    <el-table-column show-overflow-tooltip prop="creatorName" label="创建人" sortable="custom" min-width="120" />
    <el-table-column show-overflow-tooltip prop="isClosed" label="是否结案">
      <template #default="{ row }">
        {{ row.isClosed != 0 ? '是' : '否' }}
      </template>
    </el-table-column>
    <el-table-column show-overflow-tooltip prop="worksheetCategory" label="咨询类型" sortable="custom" min-width="120">
      <template #default="{ row }">
        {{ filterWorksheetType(row.worksheetCategoryId) }}
      </template>
    </el-table-column>
    <el-table-column show-overflow-tooltip prop="worksheettypeInfo" label="咨询类别" sortable="custom" min-width="120">
      <template #default="{ row }">
        {{ filterWorksheetType(row.worksheettypeInfoId) }}
      </template>
    </el-table-column>
    <el-table-column show-overflow-tooltip prop="returnTime" label="下次回访时间" sortable="custom" min-width="180" />
    <el-table-column show-overflow-tooltip prop="returnUserName" label="回访人" sortable="custom" min-width="140" />
  </el-table>
  <div style="margin-top: 20px">
    <el-pagination
      v-model:current-page="queryForm.pageNum"
      v-model:page-size="queryForm.pageSize"
      :page-sizes="[10, 20, 50, 100, 200]"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="changeSize()"
      @current-change="getTableList()"
    />
  </div>
  <WorksheetEditDrawer ref="editRef" :dict="props.dict" @reload-list="getTableList" />
  <AllocateFormDialog :multipleSelection="multipleSelection" ref="allocateRef" @reload-list="getTableList" />
</template>
<script lang="ts" setup>
import { watch, ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { getWorksheetPage, getAllWorksheetTypeList, deleteWorksheet, savePublicAgency } from '@/api/worksheet/index'
import WorksheetEditDrawer from '@/views/worksheet/components/worksheet-edit-drawer/index.vue'
import AllocateFormDialog from '@/views/worksheet/components/allocate-form-dialog/index.vue'
import { getAuth } from '@/utils/export'
import { useCache } from '@/hooks/web/useCache'
import { useRouter } from 'vue-router'
const { wsCache } = useCache()
const { push } = useRouter()

const leafAreaFlag = ref(wsCache.get('leafAreaFlag'))

function add() {
  push(`/service/add?serviceType=consult&id=${props.customerId}&phone=${props.phone}`)
}

function detail(row) {
  push(`/worksheet/details?id=${row.id}`)
}

const editRef = ref()
function edit(data) {
  editRef.value.show(data)
}

const allocateRef = ref()
function showAllocateDialog() {
  if (multipleSelection.value?.length == 0) {
    ElMessage.error('未选择数据')
    return
  }
  allocateRef.value.show()
}

const props = defineProps({
  customerId: {
    type: Number,
    default: null
  },
  phone: {
    type: String,
    default: null
  },
  dict: {
    type: Array,
    default: null
  }
})
const queryFormDefault = {
  worksheetTypeId: 3965342271209989,
  customerId: props.customerId,
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

const multipleSelection = ref<any>([])
const handleSelectionChange = (val: any) => {
  multipleSelection.value = val
}

async function del(ids) {
  const res: any = await deleteWorksheet(ids)
  if (res.code === 200) {
    ElMessage.success('操作成功')
    getTableList()
  }
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

// const filterDict = (key: any) => {
//   return (props.dict.find((item: any) => item.type == key) as any)?.list
// }

// const renderDict = (key: any, dict: any) => {
//   if (!key) {
//     return
//   }
//   return filterDict(dict)
//     ?.filter((item: any) => key.includes(item.value))
//     .map((item: any) => item?.label)
//     .join('，')
// }

const allWorksheetTypeList = ref([])
const getWorksheetTypeAllList = async () => {
  const res = await getAllWorksheetTypeList({})
  allWorksheetTypeList.value = res.data
}
const filterWorksheetType = (key: any) => {
  return (allWorksheetTypeList.value.find((item: any) => item.id == key) as any)?.worksheetTypeName
}

watch(
  () => props.customerId,
  (e) => {
    if (e) {
      getWorksheetTypeAllList()
      getTableList()
    }
  },
  { immediate: true }
)
</script>

<style scoped lang="less">
:deep(.el-table__cell) {
  text-align: center;
}
</style>
