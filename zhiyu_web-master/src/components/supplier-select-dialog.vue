<template>
  <el-dialog destroy-on-close v-model="visibleFlag" title="选择服务商" width="778px" @close="onClose" :close-on-press-escape="false" :close-on-click-modal="false">
    <p style="margin-bottom: 12px">
      <el-input v-model="form.sellerName" placeholder="商家名称" style="width: 100%" clearable @change="getTableList">
        <template #suffix>
          <el-icon @click="getTableList"><search /></el-icon>
        </template>
      </el-input>
    </p>
    <el-table
      v-if="multiple"
      :data="tableData"
      ref="tableRef"
      row-key="id"
      default-expand-all
      header-row-class-name="table-header"
      v-loading="loading"
      class-name="table-without-border"
      @selection-change="handleSelectionChange"
      :border="true"
    >
      <el-table-column type="selection" width="40" />
      <el-table-column show-overflow-tooltip prop="sellerName" label="服务商家名称" />
      <el-table-column show-overflow-tooltip prop="sellerCategoryName" label="服务商类别" />
    </el-table>

    <el-table
      v-else
      :data="tableData"
      ref="tableRef"
      row-key="id"
      default-expand-all
      header-row-class-name="table-header"
      v-loading="loading"
      class-name="table-without-border"
      @select="selectSingle"
      @select-all="selectAll"
      :border="true"
    >
      <el-table-column type="selection" width="40" />
      <el-table-column show-overflow-tooltip prop="sellerName" label="服务商家名称" />
      <el-table-column show-overflow-tooltip prop="sellerCategoryName" label="服务商类别" />
    </el-table>

    <div style="margin: 20px 0 20px">
      <el-pagination
        v-model:current-page="form.pageNum"
        v-model:page-size="form.pageSize"
        :page-sizes="[10, 20, 50, 100, 200, 500]"
        layout="total, sizes, prev, pager, next"
        :total="total"
        @size-change="getTableList"
        @current-change="getTableList"
      />
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="onClose">取消</el-button>
        <el-button type="primary" @click="submit">添加</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { getServeWithSellerSellerPage } from '@/api/serviceProject'
defineProps({
  multiple: {
    type: Boolean,
    default: false
  }
})
const emits = defineEmits(['selectChange'])

const visibleFlag = ref(false)

const loading = ref(false)
const serveId = ref()

function show(data) {
  if (data) {
    serveId.value = data.serveId
  }
  getTableList()
  visibleFlag.value = true
}

function onClose() {
  multipleSelection.value = []
  Object.assign(form, formDefault)
  visibleFlag.value = false
}

const formDefault = reactive({
  sellerName: undefined,
  pageNum: 1,
  pageSize: 10
})

let form = reactive({ ...formDefault })

const tableData = ref()
const total = ref(0)

async function getTableList() {
  loading.value = true
  const res = await getServeWithSellerSellerPage({ ...form, serveId: serveId.value })
  tableData.value = res.data.list
  total.value = res.data.total
  loading.value = false
}
const tableRef = ref()
const multipleSelection = ref<any>([])

/* 多选 */
const handleSelectionChange = (val: any) => {
  multipleSelection.value = val
}

/* 单选 */
// 全选操作
const selectAll = (selection) => {
  if (selection.length) {
    tableRef.value.clearSelection()
    multipleSelection.value = []
  }
}
//单个选中于不选中
const selectSingle = (selection, row) => {
  if (!selection.length) {
    tableRef.value.clearSelection()
    multipleSelection.value = []
    return
  }
  tableRef.value.clearSelection()
  tableRef.value.toggleRowSelection(row)
  multipleSelection.value = [row]
}

const submit = async () => {
  emits('selectChange', multipleSelection.value)
  visibleFlag.value = false
}

defineExpose({
  show
})
</script>
