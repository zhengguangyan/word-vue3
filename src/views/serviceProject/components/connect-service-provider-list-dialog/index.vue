<template>
  <el-dialog
    destroy-on-close
    v-model="visibleFlag"
    :title="form.serveName + '-关联服务商'"
    width="778px"
    @close="onClose"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
  >
    <div class="serve-main">
      <el-space class="button-box" :size="12">
        <el-button type="primary" @click="add">添加</el-button>
        <el-popconfirm width="200" title="是否取消关联所选记录？" @confirm="handleDisconnect">
          <template #reference>
            <el-button :disabled="!leafAreaFlag || !multipleSelection.length" :loading="deleting">
              取消关联
            </el-button>
          </template>
        </el-popconfirm>
      </el-space>
      <el-table
        :data="tableData"
        ref="tableRef"
        row-key="id"
        default-expand-all
        header-row-class-name="table-header"
        v-loading="loading"
        class-name="table-without-border"
        @selection-change="handleSelectionChange"
        border
      >
        <el-table-column type="selection" width="40" />
        <el-table-column show-overflow-tooltip prop="serveName" label="服务名称" min-width="120" />
        <el-table-column
          show-overflow-tooltip
          prop="sellerName"
          label="服务商家名称"
          min-width="130"
        />
        <el-table-column
          show-overflow-tooltip
          prop="sellerRemark"
          label="服务商家服务备注"
          min-width="180"
        />
      </el-table>

      <el-pagination
        class="r-m-t-20"
        v-model:current-page="form.pageNum"
        v-model:page-size="form.pageSize"
        :page-sizes="[10, 20, 50, 100, 200, 500]"
        layout="total, sizes, prev, pager, next"
        :total="total"
        @size-change="getTableList"
        @current-change="getTableList"
      />
    </div>
  </el-dialog>
  <ConnectServiceProviderFormDialog ref="formRef" @reload-list="getTableList" />
</template>
<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { getServeWithSellerPage, removeServeWithSeller } from '@/api/serviceProject'
import ConnectServiceProviderFormDialog from '../connect-service-provider-form-dialog/index.vue'
import { useCache } from '@/hooks/web/useCache'
const { wsCache } = useCache()
const leafAreaFlag = ref(wsCache.get('leafAreaFlag'))

const emits = defineEmits(['reload-list'])

const visibleFlag = ref(false)

const formRef = ref()
function add() {
  formRef.value.show(form)
}

const loading = ref(false)
const deleting = ref(false)

function show(rowData) {
  if (rowData) {
    form.serveId = rowData.id
    form.serveName = rowData.name
  }
  getTableList()
  visibleFlag.value = true
}

function onClose() {
  Object.assign(form, formDefault)
  visibleFlag.value = false
}

const formDefault = reactive({
  serveId: undefined,
  pageNum: 1,
  pageSize: 10,
  serveName: undefined
})

let form = reactive({ ...formDefault })

const tableData = ref()
const total = ref(0)

async function getTableList() {
  loading.value = true
  const res = await getServeWithSellerPage(form)
  tableData.value = res.data.list
  total.value = res.data.total
  loading.value = false
}

const multipleSelection = ref<any>([])
const handleSelectionChange = (val: any) => {
  multipleSelection.value = val
}

const handleDisconnect = async () => {
  deleting.value = true
  try {
    const { msg } = await removeServeWithSeller(multipleSelection.value.map((item) => item.id))
    deleting.value = false
    ElMessage.success(msg)
    getTableList()
  } catch (error) {
    deleting.value = false
  }
}
defineExpose({
  show
})
</script>

<style scoped>
.button-box {
  margin-bottom: 12px;
}
</style>
