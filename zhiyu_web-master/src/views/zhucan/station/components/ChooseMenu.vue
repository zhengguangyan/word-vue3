<template>
  <el-dialog v-model="visible" append-to-body width="1000px" title="选择菜单" :close-on-click-modal="false" draggable @close="handleClose" class="choose-menu-dialog">
    <div class="flex r-m-b-20">
      <span class="data-label">服务类别:</span>
      <DictSelect width="220px" v-model="params.serveCategoryId" :distList="typeList" placeholder="服务类别" clearable style="width: 180px" />
      <span class="data-label r-m-l-10">服务项目:</span>
      <el-input v-model="params.serveName" placeholder="请输入服务项目名称" style="width: 180px" />
      <span class="data-label r-m-l-10">服务子项:</span>
      <el-input v-model="params.serveOptionName" placeholder="请输入服务子项名称" style="width: 180px; margin-right: 10px" />
      <el-button type="primary" @click="loadData(true)">搜索</el-button>
      <el-button plain @click="handleClear">清除</el-button>
    </div>
    <el-table :data="tableData" v-loading="loading" height="40vh" @select="handleSelect" @select-all="handleSelect" @sort-change="handleSortChange">
      <el-table-column label="序号" type="index" width="60" align="center"></el-table-column>
      <el-table-column type="selection" width="45" align="center"></el-table-column>
      <el-table-column show-overflow-tooltip label="服务类别" prop="serveCategoryName" sortable="custom"></el-table-column>
      <el-table-column show-overflow-tooltip label="服务项目" prop="serveName" sortable="custom"></el-table-column>
      <el-table-column show-overflow-tooltip label="菜单名(服务子项)" width="140" prop="serveOptionName"></el-table-column>
      <el-table-column show-overflow-tooltip label="中心价(元)" prop="price"></el-table-column>
      <el-table-column show-overflow-tooltip label="365会员价(元)" prop="minCountPrice"></el-table-column>
      <el-table-column show-overflow-tooltip label="市场价(元)" prop="marketPrice"></el-table-column>
    </el-table>
    <div class="rela r-m-t-20 r-m-b-20">
      <span class="choose-num"
        >已选择<span class="primary-color r-m-lr-4">{{ chooseNum }}</span
        >个</span
      >
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
import { ElLoading, ElMessage, ElTable } from 'element-plus'
import { serveInfoPage } from '@/api/serviceStaffAPP'
import DictSelect from '/@/components/DictSelect/index.vue'
import { getServeTypeList } from '@/api/serviceProvider'
import { menuSave } from '@/api/zhucan/station'

const props = defineProps({
  stationId: { type: Number, required: true }
})
const visible = ref(false)
const open = () => {
  visible.value = true
  nextTick(() => {
    getTypeList()
    loadData()
  })
}
defineExpose({ open })

const params = reactive({
  serveCategoryId: '',
  serveName: '',
  serveOptionName: '',
  pageNum: 1,
  pageSize: 20,
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
    const { data } = await serveInfoPage(params)
    tableData.value = data.list.map((item) => {
      item.id = item.serveOptionId
      return item
    })
    total.value = data.total
  } finally {
    loading.value = false
  }
}

const typeList = ref<any[]>([])
const getTypeList = async () => {
  const { data } = await getServeTypeList()
  typeList.value = data.map((item: any) => ({ value: item.id, label: item.name }))
}

const emit = defineEmits(['loadData'])
// 多选确认
const handleConfirm = async () => {
  if (!Object.keys(selectedObj).length) return ElMessage.error('请选择菜单')
  const loading = ElLoading.service({
    target: '.choose-menu-dialog',
    text: '保存中，请稍候...'
  })
  try {
    await menuSave({
      id: props.stationId,
      menuIds: Object.keys(selectedObj).join(',')
    })
    loading.close()
    handleClose()
    ElMessage.success('保存成功')
    emit('loadData', true)
  } catch {
    loading.close()
  }
}

const handleClear = () => {
  params.serveCategoryId = ''
  params.serveName = ''
  params.serveOptionName = ''
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
  handleClear()
  tableData.value.splice(0)
  chooseNum.value = 0
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
.choose-menu-dialog {
  .data-label {
    flex-shrink: 0;
    margin-right: 10px;
  }
  .choose-num {
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
  }
  .el-pagination {
    justify-content: flex-end;
  }
}
</style>
