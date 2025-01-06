<template>
  <el-dialog v-model="visibleFlag" title="分配客服" width="1000px" :close-on-press-escape="false" :close-on-click-modal="false" destroy-on-close @close="onClose">
    <div class="query-form">
      <el-space wrap :size="12">
        <el-input v-model="queryForm.keyword" placeholder="请输入用户名称/手机号" style="width: 360px" @change="getTableList" />
        <el-button type="primary" @click="getTableList()">查询</el-button>
      </el-space>
    </div>
    <el-table :data="tableData" ref="tableRef" header-row-class-name="table-header" class-name="table-without-border" v-loading="loading" border>
      <el-table-column fixed="left" label="操作" width="120" class-name="table-operation">
        <template #default="{ row }">
          <el-button link type="primary" @click="handleAllocate(row.id)"> 分配 </el-button>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip prop="nickname" label="姓名" min-width="200" />
      <el-table-column show-overflow-tooltip prop="mobile" label="手机号" min-width="200" />
    </el-table>
    <div style="margin-top: 20px">
      <el-pagination
        v-model:current-page="queryForm.pageNum"
        v-model:page-size="queryForm.pageSize"
        :page-sizes="[10, 20, 50, 100, 200, 500]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="getTableList"
        @current-change="getTableList"
      />
    </div>
    <template #footer> </template>
  </el-dialog>
</template>
<script lang="ts" setup>
import { ref, reactive, PropType } from 'vue'
import { ElMessage } from 'element-plus'
import { getTableListApi } from '@/api/sys/user'
import { allocateUser } from '@/api/worksheet/index'

const emits = defineEmits(['reload-list'])

const props = defineProps({
  multipleSelection: {
    type: Array as PropType<any[]>,
    default: undefined
  }
})
const visibleFlag = ref(false)
const loading = ref(false)

const queryFormDefault = {
  keyword: undefined,
  nickname: undefined,
  mobile: undefined,
  pageNum: 1,
  pageSize: 10
}
const queryForm = reactive({ ...queryFormDefault })
const tableData = ref()
const total = ref(0)
const tableRef = ref()

function show() {
  getTableList()
  visibleFlag.value = true
}

function onClose() {
  visibleFlag.value = false
}

async function getTableList() {
  loading.value = true
  if (queryForm.keyword) {
    queryForm.nickname = queryForm.keyword
    queryForm.mobile = queryForm.keyword
  }
  const res = await getTableListApi(queryForm)
  tableData.value = res.data.list
  total.value = res.data.total
  loading.value = false
}

async function handleAllocate(userId) {
  if (!(props.multipleSelection && props.multipleSelection.length)) return
  const id = props.multipleSelection[0].id
  await allocateUser({ id: id, userId: userId })
  ElMessage.success('分配成功')
  emits('reload-list')
  onClose()
}
defineExpose({
  show
})
</script>
