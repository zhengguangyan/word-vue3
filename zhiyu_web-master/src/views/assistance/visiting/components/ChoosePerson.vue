<template>
  <el-dialog
    v-model="visible"
    :title="dialogTitle"
    append-to-body
    width="780px"
    :close-on-click-modal="false"
    draggable
    @close="handleClose"
  >
    <el-input v-model="params.keyword" placeholder="搜索姓名/电话" @input="handleInput" class="r-m-b-20">
      <template #suffix><Icon icon="ep:search" color="#FF9500" /></template>
    </el-input>
    <el-table
      :data="tableData"
      v-loading="loading"
      max-height="440px"
      @sort-change="handleSortChange"
      @select="handleSelect"
      @select-all="handleSelect"
      ref="tableRef"
    >
      <el-table-column width="45" align="center" type="selection" v-if="['operatorNames', 'volunteerNames'].includes(fieldName)"></el-table-column>
      <el-table-column label="" type="index" width="60" align="center"></el-table-column>
      <el-table-column label="操作" align="center">
        <template #default="{row}">
          <el-button type="primary" link @click="handleChoose(row)">选择</el-button>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip label="姓名" prop="name" align="center" sortable="custom" v-if="fieldName === 'visitCustomerName'"></el-table-column>
      <el-table-column show-overflow-tooltip label="姓名" prop="nickname" align="center" sortable="custom" v-else></el-table-column>
      <el-table-column show-overflow-tooltip label="是否健在" align="center" v-if="fieldName === 'visitCustomerName'">
        <template #default="{row}">{{ row.deathFlag === '1' ? '是' : '否' }}</template>
      </el-table-column>
      <el-table-column show-overflow-tooltip label="电话" prop="mobilephone" align="center" sortable="custom" v-if="fieldName === 'visitCustomerName'"></el-table-column>
      <el-table-column show-overflow-tooltip label="电话" prop="mobile" align="center" sortable="custom" v-else></el-table-column>
      <el-table-column show-overflow-tooltip label="证件号码" prop="idcard" width="160" v-if="fieldName === 'visitCustomerName'"></el-table-column>
    </el-table>
    <el-pagination
      class="r-m-t-20 r-m-b-40"
      v-model:current-page="params.pageNum"
      v-model:page-size="params.pageSize"
      :page-sizes="[10, 20, 50, 100, 200, 500]"
      layout="total, prev, pager, next, jumper"
      :total="total"
      :pager-count="5"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    <template #footer v-if="['operatorNames', 'volunteerNames'].includes(fieldName)">
      <el-button plain @click="handleClose">取消</el-button>
      <el-button type="primary" @click="handleConfirm">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, nextTick, computed } from 'vue'
import { getCustomerPage } from '@/api/customer/index'
import { getUserSelectList } from '@/api/sys/user'
import { ElTable } from 'element-plus'

const visible = ref(false)
const fieldName = ref('')
const open = (name: string, list?: { id: string, name: string }[]) => {
  fieldName.value = name
  if (list && list.length) {
    list.forEach(item => {
      selectedObj[item.id] = { id: item.id, nickname: item.name }
    })
  }
  visible.value = true
  nextTick(() => {
    loadData()
  })
}
defineExpose({ open })

const urlConfig: any = {
  visitOperatorName: getUserSelectList,
  operatorNames: getUserSelectList,
  visitCustomerName: getCustomerPage,
  volunteerNames: getUserSelectList
}
const dialogTitle = computed(() => {
  switch (fieldName.value) {
    case 'visitOperatorName': return '选择拜访人'
    case 'visitCustomerName': return '选择客户'
    case 'operatorNames': return '选择共同拜访(内部)'
    case 'volunteerNames': return '选择志愿者'
    default: return ''
  }
})
const params = reactive({
  keyword: '',
  pageNum: 1,
  pageSize: 10,
  orderByColumn: undefined as undefined | string,
  asc: undefined as undefined | 0 | 1
})

const getParams = () => {
  if (fieldName.value === 'visitCustomerName') return {
    deathFlag: '1',
    type: '1',
    keywordForVisit: params.keyword,
    pageNum: params.pageNum,
    pageSize: params.pageSize,
    orderByColumn: params.orderByColumn,
    asc: params.asc
  }
  if (fieldName.value === 'visitOperatorName' || fieldName.value === 'operatorNames') {
    const data: any = { ...params }
    data.attr = '0'
    return data
  }
  return params
}

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
    const { data } = await urlConfig[fieldName.value](getParams())
    tableData.value = data.list
    total.value = data.total
    nextTick(() => {
      tableData.value.forEach(item => {
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
// 多选确认
const handleConfirm = () => {
  emit('confirmChoosePerson', Object.values(selectedObj), fieldName.value)
  handleClose()
}

const emit = defineEmits(['confirmChoosePerson'])
const handleChoose = (row: any) => {
  if (['operatorNames', 'volunteerNames'].includes(fieldName.value)) {
    selectedObj[row.id] = row
    tableRef.value?.toggleRowSelection(row, true)
    emit('confirmChoosePerson', Object.values(selectedObj), fieldName.value)
  } else {
    emit('confirmChoosePerson', row, fieldName.value)
  }
  handleClose()
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
  params.keyword = ''
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
  const ids = selection.map(item => item.id)
  tableData.value.forEach(item => {
    if (ids.includes(item.id)) {
      selectedObj[item.id] = item
    } else {
      delete selectedObj[item.id]
    }
  })
}
</script>
