<template>
  <el-dialog v-model="visible" append-to-body width="1000px" :close-on-click-modal="false" draggable @close="handleClose" class="menu-config-dialog">
    <template #header>
      <div class="dialog-title">配置站点菜单(当前站点: {{ stationInfo.stationName }})</div>
    </template>
    <div class="r-m-b-20">
      <el-button type="primary" @click="handleChooseMenu">选择菜单</el-button>
      <el-button plain @click="handleChangeMenu">修改菜单</el-button>
    </div>
    <el-table :data="tableData" v-loading="loading" height="40vh" @sort-change="handleSortChange" ref="tableRef">
      <el-table-column label="序号" type="index" width="60" align="center"></el-table-column>
      <el-table-column label="操作" width="80">
        <template #default="{ row }">
          <el-button type="primary" link :loading="row.loading" @click="handleRemove(row)">移除</el-button>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip label="服务类别" prop="categoryName" sortable="custom"></el-table-column>
      <el-table-column show-overflow-tooltip label="服务项目" prop="serveName" sortable="custom"></el-table-column>
      <el-table-column show-overflow-tooltip label="菜单名(服务子项)" width="140" prop="menuName"></el-table-column>
      <el-table-column show-overflow-tooltip label="中心价(元)" prop="price"></el-table-column>
      <el-table-column show-overflow-tooltip label="365会员价(元)" prop="minOptionPrice"></el-table-column>
      <el-table-column show-overflow-tooltip label="市场价(元)" prop="marketPrice"></el-table-column>
    </el-table>
    <div class="r-m-t-20 r-m-b-20">
      <el-pagination
        v-model:current-page="params.pageNum"
        v-model:page-size="params.pageSize"
        :page-sizes="[10, 20, 50, 100, 200, 500]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        :pager-count="5"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    <template #footer>
      <el-button plain @click="handleClose">取消</el-button>
      <el-button type="primary" @click="handleConfirm">确定</el-button>
    </template>
    <ChooseMenu ref="chooseMenuRef" :station-id="stationInfo.id" @load-data="loadData" />
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, nextTick } from 'vue'
import { menusPage, menuRemove } from '@/api/zhucan/station'
import { ElMessageBox, ElTable } from 'element-plus'
import ChooseMenu from './ChooseMenu.vue'
import { useRouter } from 'vue-router'

const visible = ref(false)
const stationInfo = reactive({
  id: 0,
  stationName: ''
})
const open = (info: any) => {
  Object.assign(stationInfo, info)
  params.id = info.id
  visible.value = true
  nextTick(() => {
    loadData()
  })
}
defineExpose({ open })

const params = reactive({
  id: '',
  keyword: '',
  pageNum: 1,
  pageSize: 10,
  orderByColumn: undefined as undefined | string,
  asc: undefined as undefined | 0 | 1
})

const loading = ref(false)
const tableData = ref<any[]>([])
const total = ref(0)
const loadData = async (query?: true) => {
  if (loading.value) return
  try {
    loading.value = true
    if (query) {
      params.pageNum = 1
    }
    const { data } = await menusPage(params)
    tableData.value = data.list.map((item) => {
      item.loading = false
      return item
    })
    total.value = data.total
  } finally {
    loading.value = false
  }
}

const handleConfirm = () => {
  visible.value = false
}

const handleRemove = (row: any) => {
  if (row.loading) return
  ElMessageBox.confirm('是否确认将该菜单从当前站点移除？', '菜单移除提醒', { type: 'warning' })
    .then(async () => {
      row.loading = true
      await menuRemove({
        id: stationInfo.id,
        menuIds: row.menuId
      })
      row.loading = false
      if (tableData.value.length === 1 && params.pageNum > 1) {
        params.pageNum--
      }
      loadData()
    })
    .catch(() => {
      row.loading = false
    })
}

const router = useRouter()
const handleChangeMenu = () => {
  visible.value = false
  router.push('/order/projectIndex')
}

const handleSortChange = (column: any) => {
  if (column.order) {
    params.orderByColumn = column.prop
    params.asc = column.order == 'ascending' ? 0 : 1
  } else {
    params.orderByColumn = undefined
    params.asc = undefined
  }
  loadData(true)
}

const chooseMenuRef = ref<InstanceType<typeof ChooseMenu>>()
const handleChooseMenu = () => {
  chooseMenuRef.value?.open()
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

const handleClose = () => {
  visible.value = false
}
</script>

<style lang="less">
.menu-config-dialog {
  .dialog-title {
    &::after {
      content: '(说明: 此处用于设置当前站点下，可以显示哪些菜单提供给老人点餐。)';
      color: #999693;
      font-size: 12px;
      line-height: 18px;
      font-weight: normal;
      margin-left: 8px;
    }
  }
}
</style>
