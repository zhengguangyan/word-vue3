<template>
  <el-dialog
    v-model="visibleFlag"
    title="选择服务项目"
    width="920px"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    destroy-on-close
    @close="onClose"
  >
    <div>
      <el-space wrap :size="12">
        <DictSelect
          width="220px"
          v-model="queryForm.serveCategoryId"
          :distList="typeList"
          placeholder="服务类别"
          :clearable="true"
        />
        <el-input v-model="queryForm.serveName" placeholder="请输入服务项目名称">
          <template #suffix><Icon icon="ep:search" color="#ff9500" /></template>
        </el-input>
        <br />
        <el-input v-model="queryForm.serveOptionName" placeholder="搜索服务项目">
          <template #suffix><Icon icon="ep:search" color="#ff9500" /></template>
        </el-input>
        <el-button type="primary" @click="getTableList">查询</el-button>
        <el-button type="reset" @click="reset">清除</el-button>
      </el-space>

      <el-table :data="tableData" class="mt-15px">
        <el-table-column type="index" label="序号" align="center" width="60" />
        <el-table-column label="操作" align="center" width="100">
          <template #default="{ row }">
            <el-button link type="primary" @click="onSubmit(row)"> 选择 </el-button>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="serveCategoryName" label="服务类别" />
        <el-table-column show-overflow-tooltip prop="serveName" label="服务项目" />
        <el-table-column show-overflow-tooltip prop="serveOptionName" label="菜单名(服务子项目)" />
        <el-table-column show-overflow-tooltip prop="price" label="中心价(元)" />
      </el-table>
      <div class="mt-20px">
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
    </div>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { serveInfoPage } from '@/api/serviceStaffAPP'
import { getServeTypeList } from '@/api/serviceProvider'
import DictSelect from '@/components/DictSelect/index.vue'

const emits = defineEmits(['change'])

const visibleFlag = ref(false)

const loading = ref(false)

const queryFormDefault = {
  serveCategoryId: undefined,
  serveName: undefined,
  serveOptionName: undefined,
  pageNum: 1,
  pageSize: 10
}
const queryForm = reactive<any>({ ...queryFormDefault })

const tableData = ref()
const total = ref(0)

const typeList = ref<any>([])

const getTypeList = async () => {
  const dictRes = await getServeTypeList()
  typeList.value = dictRes.data.map((item) => {
    return {
      value: item.id,
      label: item.name
    }
  })
}

async function getTableList() {
  loading.value = true
  const { data } = await serveInfoPage(queryForm)
  tableData.value = data.list
  total.value = data.total
  loading.value = false
}

const reset = () => {
  Object.assign(queryForm, queryFormDefault)
  getTableList()
}

function show() {
  getTableList()
  getTypeList()
  visibleFlag.value = true
}

function onClose() {
  visibleFlag.value = false
}
const onSubmit = async (row) => {
  emits('change', row)
  onClose()
}

defineExpose({
  show
})
</script>
