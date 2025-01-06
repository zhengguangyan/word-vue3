<template>
  <el-dialog class="sever-dialog" destroy-on-close v-model="visibleFlag" title="选择关联服务" width="778px" @close="onClose" :close-on-press-escape="false" :close-on-click-modal="false">
    <div class="serve-main">
      <el-space class="button-box">
        <el-input v-model="queryForm.serveName" placeholder="搜索服务商名称" @change="getList" clearable style="width: 250px">
          <template #suffix>
            <el-icon @click="getList"><search /></el-icon>
          </template>
        </el-input>
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
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="onClose">取消</el-button>
        <el-button type="primary" @click="submit" :loading="adding">添加</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import { getServeWithSellerServePage, saveYlSrvServe } from '@/api/serviceProvider'
import { Search } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const emits = defineEmits(['reload-list'])

const visibleFlag = ref(false)

const loading = ref(false)

const adding = ref(false)

const listData = ref([])

const total = ref(0)

const sellerId = ref()

const queryForm = ref({
  pageNum: 1,
  pageSize: 20,
  serveName: undefined
})

function show(id) {
  sellerId.value = id
  getList(id)
  visibleFlag.value = true
}

const multipleSelection = ref<any>([])
const handleSelectionChange = (val: any) => {
  multipleSelection.value = val
}

function onClose() {
  listData.value = []
  multipleSelection.value = []
  sellerId.value = undefined
  visibleFlag.value = false
}

const getList = async (id) => {
  const { data } = await getServeWithSellerServePage({ sellerId: id, ...queryForm.value })
  listData.value = data.list
  total.value = data.total
}

const submit = async () => {
  adding.value = true
  try {
    await saveYlSrvServe({
      sellerId: sellerId.value,
      serveIdList: multipleSelection.value.map((item) => item.serveId)
    })
    ElMessage.success('关联服务成功!')
    adding.value = false
    emits('reload-list', sellerId.value)
    onClose()
  } catch (error) {
    adding.value = false
  }
}

defineExpose({
  show
})
</script>

<style scoped>
.serve-main {
  padding-bottom: 20px;
}
.button-box {
  margin-bottom: 12px;
}
</style>
