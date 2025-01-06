<template>
  <div>
    <el-card shadow="never" class="card">
      <template #header>
        <div class="card-header">
          <span class="title">服务项目管理</span>
        </div>
      </template>

      <div class="query-form">
        <el-space wrap :size="12">
          <el-button type="primary" @click="add" :disabled="!leafAreaFlag || getAuth('serviceProject:index:add')">添加</el-button>
          <el-tree-select
            v-model="queryForm.categoryId"
            :data="categoryTree"
            placeholder="选择服务类别"
            node-key="value"
            check-strictly
            clearable
            :render-after-expand="false"
            style="width: 220px"
            @change="getTableList"
          />
          <el-input v-model="queryForm.name" placeholder="请输入服务项目名称" style="width: 220px" @change="getTableList" />
          <el-input v-model="queryForm.serveoptionName" placeholder="请输入服务子项名称" style="width: 220px" @change="getTableList" />
          <el-button type="primary" @click="getTableList">查询</el-button>
          <el-button @click="reset">重置</el-button>
        </el-space>
      </div>

      <el-table
        :data="tableData"
        ref="tableRef"
        header-row-class-name="table-header"
        v-loading="loading"
        @selection-change="handleSelectionChange"
        class-name="table-without-border list-page-table"
        height="calc(100vh - 310px)"
      >
        <!-- <el-table-column type="selection" width="40" /> -->
        <el-table-column fixed="left" label="操作" width="160" class-name="table-operation">
          <template #default="{ row }">
            <el-button :disabled="!leafAreaFlag || getAuth('serviceProject:index:detail')" link type="primary" @click="detail(row)"> 查看 </el-button>
            <el-button link type="primary" @click="edit(row)" :disabled="!leafAreaFlag || getAuth('serviceProject:index:edit')"> 编辑 </el-button>
            <!-- <el-popconfirm :title="`删除该“${row.name}”，将会同时会删除关联的服务子项,是否确定删除?`" :width="180" @confirm="verifyDelete(row.id)" v-if="leafAreaFlag">
                <template #reference>
                  <el-button link type="primary" :disabled="!leafAreaFlag && getAuth('serviceProject:index:delete')"> 删除 </el-button>
                </template>
              </el-popconfirm> -->
            <el-button v-if="leafAreaFlag" link type="primary" :disabled="!leafAreaFlag && getAuth('serviceProject:index:delete')" @click="rowDel(row)"> 删除 </el-button>
          </template>
        </el-table-column>
        <el-table-column prop="fullCategoryName" label="分类" min-width="180" show-overflow-tooltip />
        <el-table-column show-overflow-tooltip prop="name" label="名称" min-width="180" />
        <el-table-column show-overflow-tooltip prop="hoursSubsidy" label="工时补贴（小时）" width="180" />
        <el-table-column show-overflow-tooltip prop="serveitemHours" label="项目工时（小时）" width="180" />
        <el-table-column show-overflow-tooltip prop="minCountPrice" label="服务最小价" width="110" />
        <el-table-column show-overflow-tooltip prop="price" label="365价格" width="110" />
        <el-table-column show-overflow-tooltip prop="minPrice" label="365最低价" width="110" />
        <el-table-column show-overflow-tooltip prop="marketPrice" label="市场价格" width="100" />
        <el-table-column show-overflow-tooltip prop="centerPrice" label="中心价格" width="100" />
        <el-table-column show-overflow-tooltip prop="maxCount" label="最大数" width="100" />
        <el-table-column show-overflow-tooltip prop="minCount" label="最小数" width="120" />
        <el-table-column show-overflow-tooltip prop="activityPrice" label="活动价格" width="100" />
        <el-table-column show-overflow-tooltip prop="orderNumber" label="排序" width="100" />
        <el-table-column show-overflow-tooltip prop="serviceProvider" label="关联服务商" width="120">
          <template #default="{ row }">
            <el-button link type="primary" @click="showServiceProviderList(row)"> 查看 </el-button>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="subService" label="维护子项服务" width="120">
          <template #default="{ row }">
            <el-button link type="primary" @click="showServiceOptionList(row)"> 服务子项 </el-button>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="isGround" label="上架/下架" width="100">
          <template #default="{ row }">
            <el-switch v-model="row.isGround" active-value="1" inactive-value="0" :loading="isGroundLoading" @change="(val : any) => handleIsGround(row, val)" />
          </template>
        </el-table-column>
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
    </el-card>
  </div>
  <ConnectServiceProviderListDialog ref="listRef" />
  <ServiceOptionListDialog ref="serviceOptionListRef" :serviceName="rowServiceName" />
</template>
<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import ConnectServiceProviderListDialog from './components/connect-service-provider-list-dialog/index.vue'
import ServiceOptionListDialog from './components/service-option-list-dialog/index.vue'
import { useCache } from '@/hooks/web/useCache'
const { wsCache } = useCache()
import { useRouter } from 'vue-router'
import { getAuth } from '@/utils/export'
import { getCategoryTree, getServeInfoPage, updateIsGroundById, verifyDeleteServe, deleteServe } from '@/api/serviceProject'

const { push } = useRouter()

const leafAreaFlag = ref(wsCache.get('leafAreaFlag'))

function add() {
  push('/order/projectAdd')
}

function detail(row) {
  push(`/order/projectDetail?id=${row.id}`)
}
const rowDel = (row) => {
  ElMessageBox.confirm(`删除该“${row.name}”，将会同时会删除关联的服务子项，是否确定删除？`, '提示')
    .then(() => {
      verifyDelete(row.id)
    })
    .catch(() => {
      // catch error
    })
}

function edit(row) {
  push(`/order/projectEdit?id=${row.id}`)
}

const listRef = ref()
function showServiceProviderList(row) {
  listRef.value.show(row)
}

const serviceOptionListRef = ref()
const rowServiceName = ref()
function showServiceOptionList(row) {
  rowServiceName.value = row.name
  serviceOptionListRef.value.show(row)
}

const queryFormDefault = {
  categoryId: undefined,
  name: undefined,
  serveoptionName: undefined,
  pageNum: 1,
  pageSize: 20,
  orderByColumn: undefined,
  asc: undefined
}
const queryForm = reactive<any>({ ...queryFormDefault })

const loading = ref(false)
const tableData = ref()
const total = ref(0)
const tableRef = ref()

async function getTableList() {
  loading.value = true
  const { data } = await getServeInfoPage(queryForm)
  tableData.value = data.list
  total.value = data.total
  loading.value = false
}

const reset = () => {
  Object.assign(queryForm, queryFormDefault)
  getTableList()
}

const isGroundFormDefault = reactive({
  id: undefined,
  isGround: undefined
})
let isGroundForm = reactive<any>({ ...isGroundFormDefault })
const isGroundLoading = ref(false)

async function handleIsGround(row: any, val: any) {
  isGroundLoading.value = true
  isGroundForm.id = row.id
  isGroundForm.isGround = val
  const res = await updateIsGroundById(isGroundForm)
  ElMessage.success(res.msg)
  isGroundLoading.value = false
}

const categoryTree = ref<any>([])
const categoryListData = ref([])
const getCategoryTreeList = async () => {
  const res = await getCategoryTree()
  categoryTree.value = mapList(res.data)
  categoryListData.value = flattenTree(categoryTree.value)
}

const mapList = (data: any) => {
  return data.map((item: any) => {
    if (item.children) {
      return {
        value: item.id,
        label: item.name,
        children: mapList(item.children)
      }
    } else {
      return {
        value: item.id,
        label: item.name
      }
    }
  })
}
function flattenTree(data) {
  let result: any = []

  data.forEach((item) => {
    result.push(item)
    if (item.children && item.children.length > 0) {
      result = result.concat(flattenTree(item.children))
    }
  })

  return result
}

const multipleSelection = ref<any>([])
const handleSelectionChange = (val: any) => {
  multipleSelection.value = val
}

const verifyDelete = async (ids) => {
  const { data } = await verifyDeleteServe(ids)
  if (data.delete && !data.part) {
    del(ids)
  } else {
    ElMessageBox.confirm(data.msg, '系统提示')
      .then(() => {
        if (data.part) {
          del(ids)
          return
        }
      })
      .catch(() => {
        // catch error
      })
  }
}

async function del(ids) {
  const res: any = await deleteServe(ids)
  if (res.code === 200) {
    ElMessage.success('删除成功')
    getTableList()
  }
}

// function batchDelete() {
//   let idList = tableRef.value.getSelectionRows()
//   if (!idList.length) {
//     return ElMessage.error('请先选择要删除的数据')
//   }
//   let ids = idList.map((obj) => obj.id).join(',')

//   verifyDelete(ids)
// }

onMounted(() => {
  getTableList()
  getCategoryTreeList()
})
</script>
<style lang="less" scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
:deep(.el-switch) {
  height: 25px;
}
</style>
