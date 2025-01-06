<template>
  <div>
    <div class="r-m-b-20">
      <el-button type="primary" :disabled="!leafAreaFlag || getAuth('visiting:add')" @click="handleAdd">添加</el-button>
    </div>
    <el-table :data="tableData" max-height="70vh" v-loading="loading">
      <el-table-column label="" type="index" width="50" align="center" fixed="left" />
      <el-table-column label="操作" width="220" fixed="left">
        <template #default="{ row }">
          <el-button type="primary" link :disabled="getAuth('visiting:detail')" @click="handleVisitingDetail(row)">拜访详情</el-button>
          <el-button type="primary" link :disabled="row.editStatus === 1 || !leafAreaFlag || getAuth('visiting:edit')" @click="handleEdit(row)">编辑</el-button>
          <el-button type="primary" link :loading="row.loading" :disabled="!leafAreaFlag || getAuth('visiting:remove')" @click="handleRemove(row)">删除</el-button>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip label="拜访时间" width="150" prop="visitTime">
        <template #default="{ row }">{{ row.visitTime ? row.visitTime.slice(0, 16) : '' }}</template>
      </el-table-column>
      <el-table-column show-overflow-tooltip label="拜访方式" width="140" prop="visitMode">
        <template #default="{ row }">{{ renderDict(row.visitMode, 'visit_mode') }}</template>
      </el-table-column>
      <el-table-column show-overflow-tooltip label="创建人" width="140" prop="creatorName" />
      <el-table-column show-overflow-tooltip label="来源" width="100" prop="platform">
        <template #default="{ row }">
          <span v-if="row.platform === '2'">助老员APP</span>
          <span v-if="row.platform === '3'">平台</span>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip label="拜访地址" width="140" prop="visitDetailAddress">
        <template #default="{ row }">
          <div class="line-2" :title="row.visitDetailAddress">{{ row.visitDetailAddress }}</div>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip label="状态" width="100" prop="editStatus">
        <template #default="{ row }">
          <div v-if="row.editStatus === 1">完成</div>
          <div v-else class="error-color">草稿</div>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip label="拜访内容" width="200" prop="visitContent" />
    </el-table>
    <el-pagination
      class="r-m-t-20"
      v-model:current-page="params.pageNum"
      v-model:page-size="params.pageSize"
      :page-sizes="[10, 20, 50, 100, 200, 500]"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script setup lang="ts">
import { visitingPage, visitingRemove } from '@/api/assistance/visiting'
import { onMounted, reactive, ref } from 'vue'
import { useCache } from '@/hooks/web/useCache'
import { getAuth } from '@/utils/export'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'

const { wsCache } = useCache()
const leafAreaFlag = ref(wsCache.get('leafAreaFlag'))

const props = defineProps({
  dict: { required: true, type: Array },
  baseInfo: { required: true, type: Object }
})

onMounted(() => {
  loadData()
})
const loading = ref(false)
const params = reactive({
  customerId: '',
  pageNum: 1,
  pageSize: 10,
  queryEntranceType: 'customer'
})
const tableData = ref<any[]>([])
const total = ref(0)

const loadData = async () => {
  try {
    loading.value = true
    params.customerId = props.baseInfo.id
    const { data } = await visitingPage(params)
    tableData.value = data.list.map((item: any) => {
      item.loading = false
      return item
    })
    total.value = data.total
  } finally {
    loading.value = false
  }
}

const filterDict = (key: any) => {
  return (props.dict.find((item: any) => item.type == key) as any)?.list
}
const renderDict = (key: any, dict: any) => {
  if (!key) {
    return
  }
  return filterDict(dict)
    ?.filter((item: any) => key.includes(item.value))
    .map((item: any) => item?.label)
    .join('，')
}

const router = useRouter()
const handleAdd = () => {
  sessionStorage.setItem(
    'visiting-customer-info',
    JSON.stringify({
      customerId: props.baseInfo.id,
      visitCustomerIdCard: props.baseInfo.idcard,
      visitCustomerMobilePhone: props.baseInfo.mobilephone,
      visitCustomerName: props.baseInfo.name,
      visitRegionList: props.baseInfo.currentList, //拜访地址
      visitVillage: props.baseInfo.currentVillage, //小区名称
      visitDetailAddress: props.baseInfo.currentAddress //详细地址
    })
  )
  router.push('/assistance/visiting/edit')
}

const handleVisitingDetail = (row: any) => {
  router.push(`/assistance/visiting/detail?id=${row.id}`)
}
const handleEdit = (row: any) => {
  router.push(`/assistance/visiting/edit?id=${row.id}`)
}
const handleRemove = (row: any) => {
  if (row.loading) return
  ElMessageBox.confirm('此操作将永久删除该数据, 是否继续？', '操作提示', { type: 'warning' })
    .then(async () => {
      row.loading = true
      await visitingRemove(row.id)
      ElMessage.success('已删除')
      if (tableData.value.length === 1 && params.pageNum > 1) {
        params.pageNum--
      }
      loadData()
    })
    .finally(() => {
      row.loading = false
    })
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
