<template>
  <el-dialog
    destroy-on-close
    v-model="visibleFlag"
    title="请选择卡号"
    width="838px"
    @close="onClose"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
  >
    <div class="query-form">
      <el-space wrap :size="12">
        <el-input
          v-model="form.name"
          placeholder="模糊搜索卡号"
          style="width: 360px"
          @change="searchCard"
          clearable
        >
          <template #suffix>
            <el-icon @click="searchCard"><search /></el-icon>
          </template>
        </el-input>
      </el-space>
    </div>
    <el-table :data="tableData" @selection-change="handleSelectionChange" border>
      <el-table-column fixed="left" label="操作" width="100" class-name="table-operation">
        <template #default="{ row }">
          <el-button link type="primary" @click="handleCard(row)"> 选择 </el-button>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip prop="code" label="卡号" min-width="150" />
      <el-table-column show-overflow-tooltip prop="type" label="卡类别" min-width="100" >
        <template #default="{ row }">
          {{ renderDict(row.type, 'card_type') }}
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip prop="status" min-width="100" label="状态">
        <template #default="{ row }">
          {{ renderDict(row.status, 'subsidy_card_using_status') }}
        </template>
      </el-table-column>
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
  </el-dialog>
</template>
<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { subsidyCardPage, subsidyBindCard } from '@/api/subsidy'
import { Search } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const emits = defineEmits(['reload-list', 'change-card'])

const props = defineProps({
  dict: {
    type: Array,
    default: null
  },
  formCustomer: {
    type: Object,
    default: null
  },
  isChange: {
    type: Boolean,
    default: false
  }
})

const filterDict = (key: any) => {
  return (props.dict.find((item: any) => item.type == key) as any)?.list
}

const renderDict = (key: any, dict: any) => {
  if (!key) {
    return
  }
  return filterDict(dict)
    ?.filter((item: any) => key == item.value)
    .map((item: any) => item?.label)
    .join('，')
}

const visibleFlag = ref(false)

const loading = ref(false)

const show = async (rowData) => {
  Object.assign(form, rowData)
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
  name: undefined,
  status: '1',
  pageNum: 1,
  pageSize: 10
})

let form = reactive({ ...formDefault })

const multipleSelection = ref<any>([])
const handleSelectionChange = (val: any) => {
  multipleSelection.value = val
}

const searchCard = () => {
  form.pageNum = 1
  getTableList()
}

async function getTableList() {
  loading.value = true
  const res = await subsidyCardPage(form)
  tableData.value = res.data.list
  total.value = res.data.total
  loading.value = false
}

const handleCard = (row) => {
  if (props.isChange) {
    emits('change-card', row)
    onClose()
    return
  }
  changeCard(row)
}

const changeCard = async (row) => {
  try {
    await subsidyBindCard({
      cardId: row.id,
      customerId: props.formCustomer.customerId,
      subsidyCustomerId: props.formCustomer.subsidyCustomerId,
      subsidyInfoId: props.formCustomer.id
    })
    ElMessage.success('绑定成功')
    onClose()
    emits('reload-list')
  } catch (error) {}
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
