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
      :data="tableData"
      ref="tableRef"
      row-key="id"
      default-expand-all
      header-row-class-name="table-header"
      v-loading="loading"
      class-name="table-without-border"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="40" />
      <el-table-column show-overflow-tooltip prop="sellerCategoryName" label="服务商类别" width="120" />
      <el-table-column show-overflow-tooltip prop="sellerName" label="服务商家名称" />
    </el-table>

    <el-pagination
      class="r-m-tb-20"
      v-model:current-page="form.pageNum"
      v-model:page-size="form.pageSize"
      :page-sizes="[10, 20, 50, 100, 200, 500]"
      layout="total, sizes, prev, pager, next"
      :total="total"
      @size-change="getTableList"
      @current-change="getTableList"
    />
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="onClose">取消</el-button>
        <el-button type="primary" @click="submit" :loading="adding" :disabled="!multipleSelection.length">添加</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { Search } from '@element-plus/icons-vue'
import { getServeWithSellerSellerPage, saveYlSrvSeller } from '@/api/serviceProject'

const emits = defineEmits(['reload-list'])

const visibleFlag = ref(false)

const loading = ref(false)
const adding = ref(false)
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

const multipleSelection = ref<any>([])
const handleSelectionChange = (val: any) => {
  multipleSelection.value = val
}

const submit = async () => {
  adding.value = true
  try {
    await saveYlSrvSeller({
      serveId: serveId.value,
      sellerIdList: multipleSelection.value.map((item) => item.sellerId)
    })
    ElMessage.success('关联服务成功!')
    adding.value = false
    emits('reload-list', serveId.value)
    onClose()
  } catch (error) {
    adding.value = false
  }
}

defineExpose({
  show
})
</script>
