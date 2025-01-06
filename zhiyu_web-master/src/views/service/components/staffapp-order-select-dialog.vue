<template>
  <el-dialog v-model="visibleFlag" title="选择订单" width="800px" :close-on-press-escape="false" :close-on-click-modal="false" destroy-on-close @close="onClose">
    <div>
      <el-input v-model="queryForm.keyword" placeholder="请输入关键词服务对象姓名/电话/工单编号/订单编号" @change="getTableList">
        <template #suffix><Icon icon="ep:search" color="#ff9500" /></template>
      </el-input>

      <el-table ref="multipleRef" :data="tableData" class="mt-15px">
        <el-table-column fixed="left" label="操作" align="center" width="100">
          <template #default="{ row }">
            <el-button link type="primary" @click="onSubmit(row.orderNumber)"> 选择 </el-button>
          </template>
        </el-table-column>
        <el-table-column type="index" label="序号" align="center" width="60" />
        <el-table-column show-overflow-tooltip prop="memberName" label="服务对象" width="150" />
        <el-table-column show-overflow-tooltip prop="startOrderTime" label="开始服务时间" width="180" />
        <el-table-column show-overflow-tooltip prop="operatorName" label="服务人员" width="120" />
        <el-table-column show-overflow-tooltip prop="workNumber" label="工单号" width="160" />
        <el-table-column prop="orderNumber" label="订单编号" width="180" />
        <el-table-column show-overflow-tooltip prop="serveName" label="服务项目内容" width="150" />
        <el-table-column show-overflow-tooltip prop="address" label="服务地址" width="200" />
      </el-table>
      <div class="mt-20px">
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
    </div>
  </el-dialog>
</template>

<script lang="ts" setup>
import { getStaffInfoPage } from '@/api/serviceStaffAPP'
import { ref, reactive } from 'vue'

const emits = defineEmits(['change'])
const queryForm = reactive({ keyword: '', pageNum: 1, pageSize: 20, memberId: '' })

const visibleFlag = ref(false)
const tableData = ref([])
const total = ref(0)

const loading = ref(false)
const getTableList = async () => {
  loading.value = true
  const { data } = await getStaffInfoPage(queryForm)
  tableData.value = data.list
  total.value = data.total
  loading.value = false
}

function show(memberId) {
  queryForm.memberId = memberId
  getTableList()
  visibleFlag.value = true
}

function onClose() {
  visibleFlag.value = false
}

const onSubmit = async (orderNumber: string | number) => {
  loading.value = true
  try {
    loading.value = false
    emits('change', orderNumber)
    onClose()
  } finally {
    loading.value = false
  }
}

defineExpose({
  show
})
</script>
