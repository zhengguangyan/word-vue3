<template>
  <el-space wrap :size="12" style="margin-bottom: 10px">
    <el-button type="primary" @click="add()" :disabled="!leafAreaFlag || getAuth('careinfo:index:add')"> 新增 </el-button>
    <el-popconfirm width="180" title="是否删除所选记录？" @confirm="batchDelete">
      <template #reference>
        <el-button :disabled="!leafAreaFlag || getAuth('careinfo:index:delete')"> 删除 </el-button>
      </template>
    </el-popconfirm>
    <!-- <el-button :disabled="!leafAreaFlag || getAuth('careinfo:index:allot')" @click="showAllocateDialog">分配</el-button> -->
    <el-button :disabled="!leafAreaFlag || getAuth('careinfo:index:delete')" @click="handlePublicAgency"> 导回公共待办 </el-button>
  </el-space>
  <el-table
    :data="tableData"
    ref="tableRef"
    header-row-class-name="table-header"
    :style="{
      height: 'calc(100vh - 398px)',
      border: '1px solid #f5f3f0',
      borderRadius: '8px'
    }"
    v-loading="loading"
    @selection-change="handleSelectionChange"
    @sort-change="handleSortChange"
  >
    <el-table-column type="selection" width="40" />
    <el-table-column fixed="left" label="操作" width="160" class-name="table-operation">
      <template #default="{ row }">
        <el-button link type="primary" @click="detail(row)" :disabled="getAuth('careinfo:index:detail')"> 查看 </el-button>
        <el-button link type="primary" @click="edit(row)" :disabled="row.isClosed === 1 || getAuth('careinfo:index:edit')" v-if="leafAreaFlag"> 编辑 </el-button>
        <el-popconfirm title="是否删除该记录？" :width="220" @confirm="del(row.id)" v-if="leafAreaFlag">
          <template #reference>
            <el-button link type="primary" :disabled="getAuth('careinfo:index:delete') || row.isClosed === 1"> 删除 </el-button>
          </template>
        </el-popconfirm>
      </template>
    </el-table-column>
    <el-table-column show-overflow-tooltip prop="careNo" label="关怀编号" sortable="custom" min-width="160" />
    <el-table-column show-overflow-tooltip prop="createTime" label="创建时间" sortable="custom" min-width="180" />
    <el-table-column show-overflow-tooltip prop="creatorName" label="创建人" sortable="custom" min-width="120" />
    <el-table-column show-overflow-tooltip prop="isClosed" label="是否结案">
      <template #default="{ row }">
        <span v-if="row.isClosed == 0">否</span>
        <span v-else-if="row.isClosed == 1">是</span>
        <span v-else></span>
      </template>
    </el-table-column>
    <el-table-column show-overflow-tooltip prop="customerName" label="客户姓名" sortable="custom" min-width="120" />
    <el-table-column prop="phone" label="联系电话" width="180" show-overflow-tooltip sortable="custom" />
    <el-table-column prop="reserveTime" label="预定关怀时间" width="180" show-overflow-tooltip sortable="custom">
      <template #default="{ row }">
        {{ row.reserveTime }}
      </template>
    </el-table-column>
    <el-table-column show-overflow-tooltip prop="reserveUserName" label="预定关怀客服" sortable="custom" min-width="150" />
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
  <CareinfoEditDrawer ref="editRef" :dict="props.dict" @reload-list="getTableList" />
  <AllocateFormDialog :multipleSelection="multipleSelection" ref="allocateRef" @reload-list="getTableList" />
</template>
<script lang="ts" setup>
import { watch, ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { getCareinfoPage, deleteCareinfo, savePublicAgency } from '@/api/careinfo/index'
import CareinfoEditDrawer from '@/views/careinfo/components/careinfo-edit-drawer/index.vue'
import AllocateFormDialog from '@/views/careinfo/components/allocate-form-dialog/index.vue'
import { getAuth } from '@/utils/export'
import { useCache } from '@/hooks/web/useCache'
import { useRouter } from 'vue-router'
const { wsCache } = useCache()
const { push } = useRouter()

const leafAreaFlag = ref(wsCache.get('leafAreaFlag'))

function add() {
  push(`/service/add?serviceType=care&id=${props.customerId}&phone=${props.phone}`)
}

function detail(row) {
  push(`/careinfo/detail?id=${row.id}`)
}

const editRef = ref()
function edit(row) {
  editRef.value.show(row)
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
  const res = await getCareinfoPage(queryForm)
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
  const res: any = await deleteCareinfo(ids)
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

watch(
  () => props.customerId,
  (e) => {
    if (e) {
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
