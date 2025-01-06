<template>
  <el-dialog
    v-model="visible"
    append-to-body
    width="660px"
    title="选择站点人员"
    :close-on-click-modal="false"
    draggable
    @close="handleClose"
    class="choose-station-user-dialog"
  >
    <div class="flex r-m-b-20">
      <el-input v-model="params.keyword" placeholder="搜索姓名/电话" @input="handleInput">
        <template #suffix><Icon icon="ep:search" color="#FF9500" /></template>
      </el-input>
    </div>
    <el-table
      :data="tableData"
      v-loading="loading"
      max-height="440px"
      @sort-change="handleSortChange"
      @select="handleSelect"
      @select-all="handleSelect"
      ref="tableRef"
      :row-class-name="rowClassName"
    >
      <el-table-column width="45" align="center" type="selection" :selectable="selectable"></el-table-column>
      <el-table-column label="序号" type="index" width="60" align="center"></el-table-column>
      <el-table-column show-overflow-tooltip label="姓名" prop="nickName" sortable="custom"></el-table-column>
      <el-table-column show-overflow-tooltip label="联系电话" prop="mobile">
        <template #default="{row}">{{ row.mobile || '-' }}</template>
      </el-table-column>
      <el-table-column show-overflow-tooltip label="是否已加入站点" prop="hasJoin"></el-table-column>
    </el-table>
    <div class="rela r-m-t-20 r-m-b-40">
      <span class="choose-num">已选择<span class="primary-color r-m-lr-4">{{ chooseNum }}</span>个</span>
      <el-pagination
        v-model:current-page="params.pageNum"
        v-model:page-size="params.pageSize"
        :page-sizes="[10, 20, 50, 100, 200, 500]"
        layout="total, prev, pager, next, jumper"
        size="small"
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
import { siteUserPage } from '@/api/zhucan/station'
import { ElTable } from 'element-plus'

const visible = ref(false)
const oldIds = ref<string[]>([]) // 存储详情接口返回的站点人员id列表，避免出现在外层删除站点人员后，打开选择人员弹窗，再也选不了这个在外层被删除的人员
const open = (ids: string[], oldOperatorIds: string[]) => {
  oldIds.value = oldOperatorIds
  for (const key in selectedObj) {
    delete selectedObj[key]
  }
  ids.forEach(id => {
    selectedObj[id] = true
  })
  chooseNum.value = Object.keys(selectedObj).length
  visible.value = true
  nextTick(() => {
    loadData()
  })
}
defineExpose({ open })

const params = reactive({
  keyword: '',
  pageNum: 1,
  pageSize: 10,
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
    const { data } = await siteUserPage(params)
    tableData.value = data.list
    total.value = data.total
    nextTick(() => {
      tableData.value.forEach(item => {
        if (selectedObj[item.id]) {
          selectedObj[item.id] = item
          tableRef.value?.toggleRowSelection(item, true)
        } else {
          tableRef.value?.toggleRowSelection(item, false)
        }
      })
    })
  } finally {
    window.clearTimeout(timeId)
    loading.value = false
  }
}

const rowClassName = (data: any) => {
  return data.row.hasJoin === '是' && !oldIds.value.includes(String(data.row.id)) ? 'disabled-row' : ''
}
const selectable = (row: any) => {
  return row.hasJoin === '否' || oldIds.value.includes(String(row.id))
}

const tableRef = ref<InstanceType<typeof ElTable>>()
const emit = defineEmits(['updateUsers'])
// 多选确认
const handleConfirm = () => {
  emit('updateUsers', Object.values(selectedObj).filter(item => Object.prototype.toString.call(item) === '[object Object]').map((item: any) => ({ id: item.id, name: item.nickName })))
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

const handleClose = () => {
  visible.value = false
  params.pageNum = 1
  params.pageSize = 10
  params.keyword = ''
  tableData.value.splice(0)
  total.value = 0
  for (const key in selectedObj) {
    delete selectedObj[key]
  }
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
  chooseNum.value = Object.keys(selectedObj).length
}

const chooseNum = ref(0)
</script>

<style lang="less">
.choose-station-user-dialog {
  .choose-num {
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
  }
  .el-pagination {
    justify-content: flex-end;
  }
  .el-table .cell {
    color: #303133;
  }
  .disabled-row {
    cursor: not-allowed;
    .cell {
      color: #999693;
    }
  }
}
</style>
