<template>
  <el-space wrap :size="12" style="margin-bottom: 10px">
    <el-button type="primary" @click="add()" :disabled="!leafAreaFlag || getAuth('order:index:add')"> 新增 </el-button>
    <el-popconfirm width="180" title="是否删除所选记录？" @confirm="batchDelete">
      <template #reference>
        <el-button :disabled="!leafAreaFlag || getAuth('order:index:delete')"> 删除 </el-button>
      </template>
    </el-popconfirm>
    <!-- <el-button :disabled="!leafAreaFlag || getAuth('order:index:allot')">分配</el-button>
    <el-button :disabled="!leafAreaFlag || getAuth('order:index:delete')"> 导回公共待办 </el-button> -->
  </el-space>
  <el-table
    :data="tableData"
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
        <el-button link type="primary" @click="detail(row)" :disabled="getAuth('order:index:detail')"> 查看 </el-button>
        <el-button link type="primary" @click="openEdit(row)" :disabled="!leafAreaFlag || getAuth('order:index:edit') || row.deathFlag == '0'"> 编辑 </el-button>
        <el-popconfirm title="是否删除该记录？" @confirm="verifyDelete(row.id)" :width="180" v-if="leafAreaFlag">
          <template #reference>
            <el-button link type="primary" :disabled="!leafAreaFlag || getAuth('order:index:delete') || (Number(row.statusCode) > 6 && row.source === '3') || row.source !== '3'"> 删除 </el-button>
          </template>
        </el-popconfirm>
      </template>
    </el-table-column>
    <el-table-column prop="id" label="订单编号" width="200" show-overflow-tooltip sortable="custom" />
    <el-table-column show-overflow-tooltip prop="source" label="来源" width="180" sortable="custom">
      <template #default="{ row }">
        {{ renderDict(row.source, 'order_source') }}
      </template>
    </el-table-column>
    <el-table-column show-overflow-tooltip prop="orderTime" label="下单时间" width="180" sortable="custom">
      <template #default="{ row }">
        {{ formatDateString(row.orderTime) }}
      </template>
    </el-table-column>
    <el-table-column show-overflow-tooltip prop="creatorName" label="创建人" width="180" sortable="custom" />
    <el-table-column show-overflow-tooltip prop="isClosed" label="是否结案" width="120" sortable="custom">
      <template #default="{ row }">
        {{ renderDict(row.isClosed, 'yes_no') }}
      </template>
    </el-table-column>
    <el-table-column show-overflow-tooltip prop="categoryName" label="订单类型" width="180" sortable="custom" />
    <el-table-column show-overflow-tooltip prop="serveName" label="订单类别" width="180" sortable="custom" />
    <el-table-column show-overflow-tooltip prop="money" label="订单金额" width="120" sortable="custom" />
    <el-table-column show-overflow-tooltip prop="shangmenTime" label="上门回访时间" width="180" sortable="custom" />
    <el-table-column show-overflow-tooltip prop="shangmenUserName" label="上门回访人" width="180" sortable="custom" />
    <el-table-column show-overflow-tooltip prop="manyiduTime" label="满意度回访时间" width="180" sortable="custom" />
    <el-table-column show-overflow-tooltip prop="manyiduUserName" label="满意度回访人" width="180" sortable="custom" />
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
  <OrderInfoFormDialog ref="editRef" @reload-list="getTableList()" />
</template>
<script lang="ts" setup>
import { watch, ref, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { formatDateString } from '@/utils'
import { getOrderPage, removeOrder, verifyDeleteOrder } from '@/api/order/index'
import OrderInfoFormDialog from '@/views/order/components/order-info-form-dialog/index.vue'
import { getAuth } from '@/utils/export'
import { useCache } from '@/hooks/web/useCache'
import { useRouter } from 'vue-router'
const { wsCache } = useCache()
const { push } = useRouter()

const leafAreaFlag = ref(wsCache.get('leafAreaFlag'))

function add() {
  push(`/service/add?serviceType=order&id=${props.customerId}&phone=${props.phone}`)
}

function detail(row) {
  push(`/order/orderDetail?id=${row.id}`)
}

const editRef = ref()
const openEdit = (data) => {
  editRef.value.show(data)
}

// const allocateRef = ref()
// function showAllocateDialog() {
//   if (multipleSelection.value?.length == 0) {
//     ElMessage.error('未选择数据')
//     return
//   }
//   allocateRef.value.show()
// }

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
  memberId: props.customerId,
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
  const res = await getOrderPage(queryForm)
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

const verifyDelete = async (ids) => {
  const { data } = await verifyDeleteOrder(ids)
  if (data.delete && data.part) {
    del(ids)
  } else {
    ElMessageBox.confirm(data.msg, '系统提示')
      .then(() => {
        if (data.part) {
          del(ids)
          return
        }
      })
      .catch(() => {
        // catch error
      })
  }
}

// 删除订单
async function del(ids) {
  const res: any = await removeOrder(ids)
  if (res.code === 200) {
    ElMessage.success('删除成功')
    getTableList()
  }
}

// 批量删除订单
async function batchDelete() {
  let idList = tableRef.value.getSelectionRows()
  if (!idList.length) {
    return ElMessage.error('请先选择要删除的数据')
  }
  let ids = idList.map((obj) => obj.id).join(',')

  verifyDelete(ids)
}

const filterDict = (key: any) => {
  return (props.dict.find((item: any) => item.type == key) as any)?.list
}
const renderDict = (key: any, dict: any) => {
  if (!key) {
    return
  }
  return filterDict(dict)
    ?.filter((item: any) => key.includes(item.value))
    .map((item: any) => item?.label)
    .join('，')
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
