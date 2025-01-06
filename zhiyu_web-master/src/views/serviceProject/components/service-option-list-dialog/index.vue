<template>
  <el-dialog destroy-on-close v-model="visibleFlag" title="服务子项" width="1000px" @close="onClose" :close-on-press-escape="false" :close-on-click-modal="false">
    <p style="margin-bottom: 5px">
      <el-space wrap>
        <span>服务名称：{{ props.serviceName }}</span>
        <!-- <el-input v-model="form.name" placeholder="服务名称" disabled style="width: 200px" @change="getTableList"/> -->
        <!-- <el-button type="primary" @click="getTableList">查询</el-button> -->
        <el-button class="r-m-l-20" type="primary" @click="add">添加</el-button>
      </el-space>
    </p>
    <el-table :data="tableData" v-loading="loading" header-row-class-name="table-header" style="max-height: calc(100vh - 500px); margin-bottom: 5px">
      <el-table-column type="selection" width="40" />
      <el-table-column fixed="left" label="操作" width="120" class-name="table-operation">
        <template #default="{ row }">
          <el-button link type="primary" @click="edit(row)" v-if="leafAreaFlag"> 编辑 </el-button>
          <el-popconfirm title="是否删除该记录？" :width="180" @confirm="verifyDelete(row.id)" v-if="leafAreaFlag">
            <template #reference>
              <el-button link type="primary" :disabled="!leafAreaFlag"> 删除 </el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip prop="code" label="标识码" width="100" />
      <el-table-column show-overflow-tooltip prop="name" label="子项名称" width="130" />
      <el-table-column show-overflow-tooltip prop="hoursSubsidy" label="工时补贴（小时）" width="140" />
      <el-table-column show-overflow-tooltip prop="serveitemHours" label="项目工时（小时）" width="140" />
      <el-table-column show-overflow-tooltip prop="serviceTime" label="预计时长（小时）" width="140" />
      <el-table-column show-overflow-tooltip prop="price" label="中心价格" width="100" />
      <el-table-column show-overflow-tooltip prop="marketPrice" label="市场价格" width="100" />
      <el-table-column show-overflow-tooltip prop="minCount" label="服务最低数" width="100" />
      <el-table-column show-overflow-tooltip prop="minCountPrice" label="服务最低价" width="100" />
      <el-table-column show-overflow-tooltip prop="optionPrice" label="365价格" width="100" />
      <el-table-column show-overflow-tooltip prop="minOptionPrice" label="365最低价" width="100" />
      <el-table-column show-overflow-tooltip prop="maxCount" label="服务最大数" width="100" />
      <el-table-column show-overflow-tooltip prop="unit" label="价格单位" width="100" />
      <el-table-column show-overflow-tooltip prop="isGround" label="上架/下架" width="100">
        <template #default="{ row }">
          <el-switch v-model="row.isGround" active-value="1" inactive-value="0" :loading="isGroundLoading" @change="(val : any) => handleIsGround(row, val)" />
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      class="r-m-t-20"
      v-model:current-page="form.pageNum"
      v-model:page-size="form.pageSize"
      :page-sizes="[10, 20, 50, 100, 200, 500]"
      layout="total, sizes, prev, pager, next"
      :total="total"
      @size-change="getTableList"
      @current-change="getTableList"
    />
  </el-dialog>
  <ServiceOptionFormDialog ref="serviceOptionFormRef" @reload-list="getTableList" />
</template>
<script lang="ts" setup>
import { ref, reactive, defineProps } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import ServiceOptionFormDialog from '../service-option-form-dialog/index.vue'
import { getOptionPage, updateOptionIsGroundById, verifyDeleteOption, deleteOption } from '@/api/serviceProject'
import { useCache } from '@/hooks/web/useCache'
const props = defineProps({
  serviceName: {
    type: String, // 根据实际类型指定
    required: false // 是否必填
  }
})
const { wsCache } = useCache()
const leafAreaFlag = ref(wsCache.get('leafAreaFlag'))

const emits = defineEmits(['reload-list'])

const visibleFlag = ref(false)

const loading = ref(false)

function show(rowData) {
  if (rowData) {
    form.serveId = rowData.id
  }
  getTableList()
  visibleFlag.value = true
}

function onClose() {
  Object.assign(form, formDefault)
  visibleFlag.value = false
}

const serviceOptionFormRef = ref()
function add() {
  serviceOptionFormRef.value.show(form.serveId)
}

function edit(row) {
  serviceOptionFormRef.value.show(form.serveId, row)
}

const formDefault = reactive({
  serveId: undefined,
  name: undefined,
  pageNum: 1,
  pageSize: 10
})

let form = reactive({ ...formDefault })
const tableData = ref()
const total = ref(0)

async function getTableList() {
  loading.value = true
  const res = await getOptionPage(form)
  tableData.value = res.data.list
  total.value = res.data.total
  loading.value = false
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
  const res = await updateOptionIsGroundById(isGroundForm)
  ElMessage.success(res.msg)
  isGroundLoading.value = false
}

const verifyDelete = async (ids) => {
  const { data } = await verifyDeleteOption(ids)
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
  const res: any = await deleteOption(ids)
  if (res.code === 200) {
    ElMessage.success('删除成功')
    getTableList()
  }
}

defineExpose({
  show
})
</script>
