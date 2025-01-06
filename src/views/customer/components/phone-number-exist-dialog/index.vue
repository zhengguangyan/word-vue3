<template>
  <el-dialog v-model="visibleFlag" title="存在同手机号客户提示" width="1200px" :close-on-press-escape="false" :close-on-click-modal="false">
    <span> 输入的手机号已关联了如下客户，请确认是否需要继续创建新客户：</span>
    <el-table :data="tableData" border>
      <el-table-column label="操作" width="70">
        <template #default="scope">
          <el-button link type="primary" size="small" @click="detail(scope.row)"> 查看 </el-button>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip prop="name" label="姓名" width="100" />
      <el-table-column show-overflow-tooltip prop="idcard" label="证件号码" width="160" />
      <el-table-column show-overflow-tooltip prop="saturationNumber" label="信息饱和度" width="100" />
      <el-table-column show-overflow-tooltip prop="visitnumber" label="拜访次数" width="90" />
      <el-table-column show-overflow-tooltip prop="workSum" label="工单数" width="70" />
      <el-table-column show-overflow-tooltip prop="orderSum" label="订单数" width="70" />
      <el-table-column show-overflow-tooltip prop="careSum" label="关怀数" width="70" />
      <el-table-column show-overflow-tooltip prop="finalContactTime" label="最后联系时间" width="160" />
      <el-table-column show-overflow-tooltip prop="currentAllAddress" label="现居地址" />
      <el-table-column show-overflow-tooltip prop="remark" label="备注" />
    </el-table>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="onClose">取消</el-button>
        <el-button type="primary" @click="continueCreate">继续创建</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
const { push } = useRouter()

const visibleFlag = ref(false)

const tableData = ref()

function show(data) {
  tableData.value = data
  visibleFlag.value = true
}

function onClose() {
  visibleFlag.value = false
}

function continueCreate() {
  ignorePhonenumberExistFlag.value = true
  onClose()
}

function detail(row) {
  onClose()
  push(`/customer/detail?id=${row.id}`)
}

const ignorePhonenumberExistFlag = ref(false)

defineExpose({
  show,
  ignorePhonenumberExistFlag
})
</script>
