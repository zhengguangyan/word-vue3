<template>
  <el-dialog destroy-on-close v-model="visibleFlag" title="请选择客户" width="1000px" @close="onClose" :close-on-press-escape="false" :close-on-click-modal="false">
    <div class="flex flex-wrap">
      <el-tag class="r-m-r-5 r-m-b-5" v-for="tag in multipleSelection" :key="tag.name" closable @close="handleDel(tag.id)">
        {{ tag.name }}
      </el-tag>
    </div>

    <div class="flex row-between r-m-b-12 r-m-t-18">
      <div>
        <el-input v-model="form.search" placeholder="模糊搜索客户姓名/证件号码/联系电话/备注" style="width: 360px" clearable @change="search" />
        <el-button class="r-m-l-10" type="primary" @click="search">查询</el-button>
      </div>
      <div>
        <span> 已选择</span>
        <span class="error-color r-m-lr-5">{{ multipleSelection.length }}</span>
        <span>人</span>
      </div>
    </div>
    <el-table ref="tableRef" :data="tableData" @select="singleSelect" @select-all="singleSelect" :border="true">
      <el-table-column type="selection" width="40" />
      <el-table-column show-overflow-tooltip prop="name" label="姓名" width="150" />
      <el-table-column show-overflow-tooltip prop="sex" label="性别" width="80">
        <template #default="{ row }">
          {{ row.sex == '1' ? '男' : '女' }}
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip prop="mobilephone" label="联系电话" width="140" />
      <el-table-column show-overflow-tooltip prop="idcard" label="证件号" width="180" />
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
import { ref, reactive, nextTick, computed } from 'vue'
import { getCustomerPage } from '@/api/customer'
import { ElMessage } from 'element-plus'

const emits = defineEmits(['add-customer'])
const visibleFlag = ref(false)
const loading = ref(false)
const tableRef = ref()
const maps = ref<any>(new Map())
const multipleSelection = computed(() => [...maps.value.values()])
// 删除某个人员
const handleDel = (id) => {
  const row = maps.value.get(id)
  maps.value.delete(id)
  nextTick(() => {
    //反选的方法
    tableRef.value.toggleRowSelection(row, false)
  })
}

const show = (rowData) => {
  visibleFlag.value = true
  if (rowData.subsidyCustomers) {
    form.excludeCustomers = rowData.subsidyCustomers.map((item) => item.id)
  }
  getTableList()
}
function singleSelect(list) {
  const ids = list.map((item) => item.id)
  tableData.value.forEach((item) => {
    if (ids.includes(item.id)) {
      if (!maps.value.has(item.id)) {
        maps.value.set(item.id, item)
      }
    } else {
      maps.value.delete(item.id)
    }
  })
}
function onClose() {
  Object.assign(form, formDefault)
  maps.value = new Map()
  visibleFlag.value = false
}

const tableData = ref<any>([])

const total = ref(0)

const formDefault = reactive({
  search: undefined,
  excludeCustomers: [],
  deathFlag: 1,
  pageNum: 1,
  pageSize: 10
})

let form = reactive({ ...formDefault })

const onSubmit = async () => {
  const newArr = multipleSelection.value.map((item) => {
    return {
      ...item,
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
  const ids = [...maps.value.keys()] //得到id数组
  nextTick(() => {
    tableData.value.forEach((i) => {
      if (ids.includes(i.id)) {
        //反选的方法
        tableRef.value.toggleRowSelection(i)
      }
    })
  })
}

defineExpose({
  show
})
</script>
