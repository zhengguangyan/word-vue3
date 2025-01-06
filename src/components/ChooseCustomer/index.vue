<template>
  <el-dialog v-model="visible" :title="title" width="1000px" @close="close" :close-on-press-escape="false" :close-on-click-modal="false" class="common-choose-customer-dialog">
    <el-input v-model="params.search" placeholder="请输入客户姓名/证件号码/联系电话/备注/回车搜索" @change="loadData(true)">
      <template #suffix><Icon icon="ep:search" :color="primaryColor" /></template>
    </el-input>
    <div class="customer-list">
      <div class="customer-item" v-for="item in selectedList" :key="item.id">
        <span class="r-m-r-4">{{ item.name }}</span>
        <Icon icon="ep:circle-close-filled" :color="primaryColor" :size="16" class="pointer" @click="handleRemove(item)" />
      </div>
    </div>
    <el-table :data="tableData" ref="tableRef" @select="handleSelect" @select-all="handleSelect" :border="true">
      <el-table-column type="selection" width="45" align="center" />
      <el-table-column prop="name" label="姓名" width="150" />
      <el-table-column prop="sex" label="性别" width="80">
        <template #default="{ row }">
          {{ row.sex == '1' ? '男' : row.sex === '2' ? '女' : '' }}
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip prop="mobilephone" label="联系电话" width="160" />
      <el-table-column prop="idcard" label="证件号码" width="160" />
      <el-table-column show-overflow-tooltip prop="remark" label="备注" />
    </el-table>
    <div class="r-m-tb-20">
      <el-pagination
        v-model:current-page="params.pageNum"
        v-model:page-size="params.pageSize"
        :page-sizes="[10, 20, 30, 50]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    <template #footer>
      <span class="choose-num"
        >已选择<span class="primary-color r-m-lr-2">{{ selectedList.length }}</span
        >人</span
      >
      <el-button @click="close">取消</el-button>
      <el-button type="primary" @click="handleConfirm">确定</el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref, reactive, computed, nextTick } from 'vue'
import { getCustomerPage } from '@/api/customer'
import { useAppStore } from '@/store/modules/app'
import { ElTable, ElMessage } from 'element-plus'

const appStore = useAppStore()
const primaryColor = computed(() => appStore.getTheme.elColorPrimary)

const props = defineProps({
  title: { type: String, default: '请选择客户' },
  source: { type: String, default: 'common' }
})

const emits = defineEmits(['add-customer'])

const visible = ref(false)
const open = async (ids: string[]) => {
  if (ids && ids.length) {
    params.excludeCustomers = ids
  }
  visible.value = true
  nextTick(() => {
    loadData()
  })
}
defineExpose({ open })

const tableData = ref<any[]>([])
const total = ref(0)
const params = reactive({
  search: '',
  excludeCustomers: [] as string[],
  deathFlag: 1, // 0=过世
  pageNum: 1,
  pageSize: 10
})

const handleConfirm = () => {
  const list = Object.values(selectedObj)
  if (!list.length) return ElMessage.error('请选择客户')
  if (props.source === 'serve-packet-add') {
    // 弹窗来源于新增服务包
    emits(
      'add-customer',
      list.map((item: any) => ({
        ...item,
        customerName: item.name,
        customerId: item.id,
        usingStatus: '1',
        disableOrNot: false
      }))
    )
  } else {
    emits('add-customer', list)
  }
  close()
}

const selectedObj: any = reactive({})
const selectedList = computed<any[]>(() => Object.values(selectedObj))
const handleSelect = (selection: any[]) => {
  const ids = selection.map((item) => item.id)
  tableData.value.forEach((item) => {
    if (ids.includes(item.id)) {
      selectedObj[item.id] = item
    } else {
      delete selectedObj[item.id]
    }
  })
}

const tableRef = ref<InstanceType<typeof ElTable>>()
const handleRemove = (item: any) => {
  delete selectedObj[item.id]
  tableRef.value?.toggleRowSelection(item, false)
}

const loading = ref(false)
const loadData = async (query?: true) => {
  if (loading.value) return
  try {
    loading.value = true
    if (query) {
      params.pageNum = 1
    }
    const { data } = await getCustomerPage(params)
    tableData.value = data.list
    total.value = data.total
    nextTick(() => {
      tableData.value.forEach((item) => {
        if (selectedObj[item.id]) {
          tableRef.value?.toggleRowSelection(item, true)
        }
      })
    })
  } finally {
    loading.value = false
  }
}

const close = () => {
  visible.value = false
  params.deathFlag = 1
  params.excludeCustomers = []
  params.pageNum = 1
  params.pageSize = 10
  params.search = ''
  for (const key in selectedObj) {
    delete selectedObj[key]
  }
}

const handleSizeChange = (size: number) => {
  params.pageNum = 1
  params.pageSize = size
  loadData()
}
const handleCurrentChange = (current: number) => {
  params.pageNum = current
  loadData()
}
</script>

<style lang="less">
.common-choose-customer-dialog {
  .customer-list {
    display: flex;
    flex-wrap: wrap;
    margin-top: 12px;
  }
  .customer-item {
    height: 32px;
    padding: 0 8px;
    border: 1px solid var(--el-color-primary);
    background-color: rgba(var(--el-color-primary-rgb), 0.05);
    color: var(--el-color-primary);
    display: flex;
    align-items: center;
    border-radius: 4px;
    margin: 0 12px 12px 0;
  }
  .el-dialog__footer {
    position: relative;
  }
  .choose-num {
    position: absolute;
    right: 550px;
    top: 50%;
    transform: translateY(-50%);
    color: #999;
  }
}
</style>
