<template>
  <el-dialog v-model="visible" append-to-body width="980px" :close-on-click-modal="false" draggable @close="handleClose" class="choose-customers-dialog">
    <template #header>
      <div class="flex">
        <h2>请选择客户</h2>
        <span class="error-color">(注：列表不显示已过世老人)</span>
      </div>
    </template>
    <div class="flex r-m-b-20">
      <el-button type="primary" @click="handleAdd">新增客户</el-button>
      <el-input v-model="params.search" placeholder="搜索姓名/证件号码/联系电话/客户ID/备注" @input="handleInput" class="r-m-l-10">
        <template #suffix><Icon icon="ep:search" color="#FF9500" @click="loadData(true)" class="pointer" /></template>
      </el-input>
    </div>
    <el-table :data="tableData" v-loading="loading" max-height="440px" @sort-change="handleSortChange" @select="handleSelect" @select-all="handleSelect" ref="tableRef">
      <el-table-column width="45" align="center" type="selection"></el-table-column>
      <el-table-column show-overflow-tooltip label="序号" type="index" width="60" align="center"></el-table-column>
      <el-table-column show-overflow-tooltip label="姓名" prop="name" sortable="custom"></el-table-column>
      <el-table-column show-overflow-tooltip label="性别" prop="sex" sortable="custom">
        <template #default="{ row }">{{ row.sex === '1' ? '男' : row.sex === '2' ? '女' : '' }}</template>
      </el-table-column>
      <el-table-column show-overflow-tooltip label="联系电话" prop="mobilephone"></el-table-column>
      <el-table-column show-overflow-tooltip label="证件号码" prop="idcard"></el-table-column>
      <el-table-column show-overflow-tooltip label="备注" prop="remark"></el-table-column>
    </el-table>
    <div class="rela r-m-t-20 r-m-b-40">
      <span class="choose-num"
        >已选择<span class="primary-color r-m-lr-4">{{ chooseNum }}</span
        >个</span
      >
      <el-pagination
        v-model:current-page="params.pageNum"
        v-model:page-size="params.pageSize"
        :page-sizes="[10, 20, 50, 100, 200, 500]"
        layout="total, prev, pager, next, jumper"
        :total="total"
        :pager-count="5"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    <template #footer>
      <el-button plain @click="handleClose">取消</el-button>
      <el-button type="primary" @click="handleConfirm">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, nextTick } from 'vue'
import { getCustomerPage } from '@/api/customer/index'
import { ElTable } from 'element-plus'
import { useRouter } from 'vue-router'

const visible = ref(false)
const open = (ids: string[]) => {
  ids.forEach((id) => {
    selectedObj[id] = true
  })
  visible.value = true
  nextTick(() => {
    loadData()
  })
}
defineExpose({ open })

const params = reactive({
  search: '',
  pageNum: 1,
  pageSize: 10,
  deathFlag: '1', // 是否健在
  orderByColumn: undefined as undefined | string,
  asc: undefined as undefined | 0 | 1
})

const loading = ref(false)
const tableData = ref<any[]>([])
const total = ref(0)
const loadData = async (query?: true) => {
  if (loading.value) return
  try {
    loading.value = true
    if (query) {
      params.pageNum = 1
    }
    const { data } = await getCustomerPage(params)
    tableData.value = data.list
    total.value = data.total
    nextTick(() => {
      tableData.value.forEach((item) => {
        if (selectedObj[item.id]) {
          selectedObj[item.id] = item
          tableRef.value?.toggleRowSelection(item, true)
        }
      })
    })
  } finally {
    window.clearTimeout(timeId)
    loading.value = false
  }
}

const tableRef = ref<InstanceType<typeof ElTable>>()
const emit = defineEmits(['updateCustomers'])
// 多选确认
const handleConfirm = () => {
  emit(
    'updateCustomers',
    Object.values(selectedObj).filter((item) => Object.prototype.toString.call(item) === '[object Object]')
  )
  handleClose()
}

const router = useRouter()
const handleAdd = () => {
  sessionStorage.setItem('add-customer', 'activity')
  router.push('/customer')
}

let timeId = 0
const handleInput = () => {
  window.clearTimeout(timeId)
  timeId = window.setTimeout(() => {
    loadData(true)
  }, 600)
}

const handleSortChange = (column: any) => {
  if (column.order) {
    params.orderByColumn = column.prop
    params.asc = column.order == 'ascending' ? 0 : 1
  } else {
    params.orderByColumn = undefined
    params.asc = undefined
  }
  loadData(true)
}

const handleSizeChange = (size: number) => {
  params.pageNum = 1
  params.pageSize = size
  loadData()
}
const handleCurrentChange = (current: number) => {
  params.pageNum = current
  loadData()
}

const handleReset = () => {
  params.search = ''
  params.pageNum = 1
  params.pageSize = 10
  params.asc = undefined
  params.orderByColumn = undefined
  tableData.value.splice(0)
  total.value = 0
  for (const key in selectedObj) {
    delete selectedObj[key]
  }
}

const handleClose = () => {
  visible.value = false
  handleReset()
}

const selectedObj: any = {}
const handleSelect = (selection: any[]) => {
  const ids = selection.map((item) => item.id)
  tableData.value.forEach((item) => {
    if (ids.includes(item.id)) {
      selectedObj[item.id] = item
    } else {
      delete selectedObj[item.id]
    }
  })
  chooseNum.value = Object.keys(selectedObj).length
}

const chooseNum = ref(0)
</script>

<style lang="less">
.choose-customers-dialog {
  .el-dialog__header {
    .error-color {
      font-size: 12px;
      font-weight: normal;
      margin-left: 10px;
    }
  }
  .choose-num {
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
  }
}
</style>
