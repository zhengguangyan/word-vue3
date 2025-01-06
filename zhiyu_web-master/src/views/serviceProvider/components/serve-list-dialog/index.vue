<template>
  <el-dialog class="sever-dialog" destroy-on-close v-model="visibleFlag" title="查看关联服务" width="778px" @close="onClose" :close-on-press-escape="false" :close-on-click-modal="false">
    <div>
      <el-space class="button-box" :size="12">
        <el-button type="primary" @click="openAdd"> 添加 </el-button>
        <el-popconfirm width="180" title="是否删除所选记录？" @confirm="deleteSever">
          <template #reference>
            <el-button :disabled="!leafAreaFlag" :loading="deleting"> 移除 </el-button>
          </template>
        </el-popconfirm>
      </el-space>
      <el-table
        :data="listData"
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
        <el-table-column show-overflow-tooltip prop="serveCategoryName" label="服务类别" />
        <el-table-column show-overflow-tooltip prop="serveName" label="服务项目" />
      </el-table>
      <div style="margin-top: 20px">
        <el-pagination
          v-model:current-page="queryForm.pageNum"
          v-model:page-size="queryForm.pageSize"
          :page-sizes="[10, 20, 50, 100, 200, 500]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="getList"
          @current-change="getList"
        />
      </div>
    </div>
  </el-dialog>
  <AddServe ref="addRef" @reload-list="getList" />
</template>
<script lang="ts" setup>
import AddServe from '../add-serve-list-dialog/index.vue'
import { ref } from 'vue'
import { getServeWithSeller, removeServeWithSeller } from '@/api/serviceProvider'
import { useCache } from '@/hooks/web/useCache'
import { ElMessage } from 'element-plus'
const { wsCache } = useCache()
const leafAreaFlag = ref(wsCache.get('leafAreaFlag'))

const emits = defineEmits(['reload-list'])

const visibleFlag = ref(false)

const loading = ref(false)

const deleting = ref(false)

const addRef = ref()

const sellerId = ref()

const listData = ref([])

const queryForm = ref({
  pageNum: 1,
  pageSize: 20
})

const total = ref(0)

function show(id) {
  sellerId.value = id
  getList()
  visibleFlag.value = true
}

const openAdd = () => {
  addRef.value.show(sellerId.value)
}

const multipleSelection = ref<any>([])
const handleSelectionChange = (val: any) => {
  multipleSelection.value = val
}

function onClose() {
  listData.value = []
  sellerId.value = undefined
  visibleFlag.value = false
}

const getList = async () => {
  const { data } = await getServeWithSeller({
    sellerId: sellerId.value,
    ...queryForm.value
  })
  listData.value = data.list
  total.value = data.total
}

const deleteSever = async () => {
  deleting.value = true
  try {
    const { msg } = await removeServeWithSeller(multipleSelection.value.map((item) => item.id))
    deleting.value = false
    ElMessage.success(msg)
    getList()
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
