<template>
  <el-dialog destroy-on-close v-model="visibleFlag" title="请选择客户" width="1000px" @close="onClose" :close-on-press-escape="false" :close-on-click-modal="false">
    <div class="query-form">
      <el-space wrap :size="12">
        <el-input v-model="form.search" placeholder="模糊搜索客户姓名/证件号码/联系电话/备注" style="width: 360px" clearable @change="search" />
        <el-button type="primary" @click="search">查询</el-button>
      </el-space>
    </div>
    <el-table :data="tableData" @selection-change="handleSelectionChange" :border="true">
      <el-table-column type="selection" width="40" />
      <el-table-column show-overflow-tooltip prop="name" label="姓名" width="150" />
      <el-table-column show-overflow-tooltip prop="sex" label="性别" width="80">
        <template #default="{ row }">
          {{ row.sex == '1' ? '男' : '女' }}
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip prop="mobilephone" label="联系电话" width="160" />
      <el-table-column show-overflow-tooltip prop="idcard" label="证件号码" width="160" />
      <el-table-column show-overflow-tooltip prop="remark" label="备注" />
    </el-table>

    <div style="margin: 10px 0 20px">
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
        <el-button type="primary" @click="onSubmit">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { getCustomerPage } from '@/api/customer'
import { ElMessage } from 'element-plus'

const emits = defineEmits(['add-customer'])

const visibleFlag = ref(false)

const loading = ref(false)

const show = async (rowData) => {
  if (rowData.customerList) {
    form.excludeCustomers = rowData.customerList.map((item) => item.customerId)
  }
  getTableList()
  visibleFlag.value = true
}

function onClose() {
  Object.assign(form, formDefault)
  visibleFlag.value = false
}

const tableData = ref([])

const total = ref(0)

const formDefault = reactive({
  search: undefined,
  excludeCustomers: [],
  deathFlag: 1,
  pageNum: 1,
  pageSize: 10
})

let form = reactive({ ...formDefault })

const multipleSelection = ref<any>([])
const handleSelectionChange = (val: any) => {
  multipleSelection.value = val
}

const onSubmit = async () => {
  const newArr = multipleSelection.value.map((item) => {
    return {
      ...item,
      customerName: item.name,
      customerId: item.id,
      usingStatus: '1',
      disableOrNot: false
    }
  })
  emits('add-customer', newArr)
  onClose()
  ElMessage.success('添加成功')
}

const search = () => {
  form.pageNum = 1
  getTableList()
}

async function getTableList() {
  loading.value = true
  const res = await getCustomerPage(form)
  tableData.value = res.data.list
  total.value = res.data.total
  loading.value = false
}

defineExpose({
  show
})
</script>
<style lang="less" scoped>
.query-form {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}
:deep(.el-dialog__body) {
  padding-top: 10px !important;
}
</style>
