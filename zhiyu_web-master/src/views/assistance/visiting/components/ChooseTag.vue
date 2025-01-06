<template>
  <el-dialog v-model="visible" title="选择标签" append-to-body width="780px" :close-on-click-modal="false" draggable @close="handleClose">
    <el-table
      :data="tableData"
      v-loading="loading"
      max-height="440px"
      @sort-change="handleSortChange"
      @selection-change="handleSelectionChange"
      ref="tableRef"
      class="r-m-b-20"
      @row-click="rowClick"
      row-class-name="pointer"
    >
      <el-table-column label="序号" type="index" width="60" align="center"></el-table-column>
      <el-table-column type="selection" width="45" align="center"></el-table-column>
      <el-table-column show-overflow-tooltip label="拜访标签" prop="name" align="center"></el-table-column>
    </el-table>
    <template #footer>
      <el-button plain @click="handleClose">取消</el-button>
      <el-button type="primary" @click="handleConfirm">确认</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, nextTick } from 'vue'
import { tagPage } from '@/api/assistance/tag'
import { ElMessage, ElTable } from 'element-plus'

const visible = ref(false)
const selectedList = ref<any[]>([])
const open = (list: any[]) => {
  selectedList.value = list
  visible.value = true
  nextTick(() => {
    loadData()
  })
}
defineExpose({ open })

const params = reactive({
  pageNum: 1,
  pageSize: 10000,
  isFilter: 1,
  orderByColumn: undefined as undefined | string,
  asc: undefined as undefined | 0 | 1
})

const loading = ref(false)
const tableRef = ref<InstanceType<typeof ElTable>>()
const tableData = ref<any[]>([])
const loadData = async (query?: true) => {
  if (loading.value) return
  try {
    loading.value = true
    if (query) {
      params.pageNum = 1
    }
    const { data } = await tagPage(params)
    tableData.value = data.list
    const ids = selectedList.value.map((item) => item.id)
    nextTick(() => {
      tableData.value.forEach((item) => {
        if (ids.includes(item.id)) {
          tableRef.value?.toggleRowSelection(item, true)
        }
      })
    })
  } finally {
    loading.value = false
  }
}

const rowClick = (row: any) => {
  const ids = tableRef.value?.getSelectionRows().map((item) => item.id)
  tableRef.value?.toggleRowSelection(row, !ids.includes(row.id))
}

const emit = defineEmits(['confirmChooseTag'])
const handleConfirm = () => {
  if (!multipleSelection.value.length) return ElMessage.error('请选择拜访标签')
  emit(
    'confirmChooseTag',
    multipleSelection.value.map((item) => item.name)
  )
  visible.value = false
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

const multipleSelection = ref<any[]>([])
const handleSelectionChange = (val: any[]) => {
  multipleSelection.value = val
}

const handleClose = () => {
  visible.value = false
}
</script>
