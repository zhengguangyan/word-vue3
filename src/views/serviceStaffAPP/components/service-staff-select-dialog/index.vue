<template>
  <el-dialog v-model="visibleFlag" title="选择服务人员" width="920px" :close-on-press-escape="false" :close-on-click-modal="false" destroy-on-close @close="onClose">
    <div class="r-m-b-20">
      <el-space wrap :size="12">
        <el-input v-model="queryForm.keyword" placeholder="搜索服务人员姓名">
          <template #suffix><Icon icon="ep:search" color="#ff9500" /></template>
        </el-input>
        <el-button type="primary" @click="getUsers">查询</el-button>
        <el-button type="reset" @click="reset">清除</el-button>
      </el-space>

      <el-table :data="tableData" ref="tableRef" height="500" @selection-change="handleSelectionChange" class="mt-15px">
        <el-table-column type="selection" width="40" />
        <el-table-column type="index" label="序号" align="center" width="60" />
        <el-table-column label="操作" align="center" width="100">
          <template #default="{ row }">
            <el-button link type="primary" @click="onSelect(row)"> 选择 </el-button>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="userName" label="姓名" />
        <el-table-column show-overflow-tooltip prop="mobile" label="电话"></el-table-column>
      </el-table>
    </div>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="onClose">取消</el-button>
        <el-button type="primary" :loading="loading" @click="onSubmit">确认</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref, reactive, nextTick } from 'vue'
import { commonUsersPage } from '@/api/serviceStaffAPP'
import { ElTable } from 'element-plus'

interface User {
  id: number
  userName: string
  mobile?: number
}

const emits = defineEmits(['change'])

const visibleFlag = ref(false)

const loading = ref(false)

const tableRef = ref<InstanceType<typeof ElTable>>()

const queryFormDefault = {
  serveCategoryId: undefined,
  serveName: undefined,
  userName: undefined,
  pageNum: 1,
  pageSize: 10
}
const queryForm = reactive<any>({ ...queryFormDefault })

const tableData = ref()

let defaultSelect: number[] = []

async function getUsers() {
  loading.value = true
  const { data } = await commonUsersPage(queryForm)
  tableData.value = data
  nextTick(() => {
    data.forEach((d: User) => {
      if (defaultSelect.includes(d.id)) {
        tableRef.value!.toggleRowSelection(d, true)
      }
    })
  })
  loading.value = false
}

const multipleSelection = ref<User[]>([])
const handleSelectionChange = (val: User[]) => {
  multipleSelection.value = val
}

const onSelect = (val: User) => {
  multipleSelection.value = [val]
  onSubmit()
}

const reset = () => {
  Object.assign(queryForm, queryFormDefault)
  getUsers()
}

function show(list) {
  getUsers()
  defaultSelect = list.map((l) => Number(l.id))
  visibleFlag.value = true
}

function onClose() {
  visibleFlag.value = false
}
const onSubmit = async () => {
  emits('change', multipleSelection.value)
  onClose()
}

defineExpose({
  show
})
</script>
