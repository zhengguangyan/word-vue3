<template>
  <el-button type="primary" :icon="Plus" @click="openAdd" style="margin-bottom: 20px" :disabled="!leafAreaFlag"> 新增 </el-button>
  <el-table
    :data="tableData"
    header-row-class-name="table-header"
    :style="{
      height: 'calc(100vh - 450px)',
      border: '1px solid #f5f3f0',
      borderRadius: '8px'
    }"
  >
    <el-table-column fixed="left" label="操作" width="150">
      <template #default="{ row }">
        <el-button link type="primary" size="small" @click="openEdit(row)" :disabled="!leafAreaFlag">修改</el-button>
        <el-popconfirm title="请确认是否永久删除该记录？" @confirm="delBsData(row.id)">
          <template #reference>
            <el-button link type="primary" size="small" :disabled="!leafAreaFlag">删除</el-button>
          </template>
        </el-popconfirm>
      </template>
    </el-table-column>
    <el-table-column show-overflow-tooltip prop="measureTime" label="测量时间" />
    <el-table-column show-overflow-tooltip prop="bloodglucose" label="血糖">
      <template #default="{ row }"> {{ row.bloodglucose }} mmol/l </template>
    </el-table-column>
    <el-table-column show-overflow-tooltip prop="source" label="数据来源">
      <template #default="{ row }">
        {{ filterDict('blood_data_source').find((item) => item.value == row.source)?.label }}
      </template>
    </el-table-column>
  </el-table>
  <div style="margin-top: 20px">
    <el-pagination
      v-model:current-page="queryForm.pageNum"
      v-model:page-size="queryForm.pageSize"
      :page-sizes="[10, 20, 50, 100, 200]"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="changeSize()"
      @current-change="queryInfo()"
    />
  </div>

  <!-- 新增修改弹窗 -->
  <el-dialog
    destroy-on-close
    center
    v-model="addBsDataVisible"
    :title="isAdd ? '添加血糖信息' : '修改血糖信息'"
    width="500px"
    @close="closeAdd"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
  >
    <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
      <el-form-item label="测量时间：" prop="measureTime">
        <el-date-picker v-model="form.measureTime" type="datetime" placeholder="请选择测量时间" value-format="YYYY-MM-DD HH:mm:ss" style="width: 100%" />
      </el-form-item>
      <el-form-item label="血糖：" prop="bloodglucose">
        <div class="flex" style="width: 100%">
          <el-input-number v-model="form.bloodglucose" placeholder="0-100，数字，保留小数点后2位" :min="0" :max="100" :precision="2" :controls="false">
            <!-- <template #append>mmol/l</template> -->
          </el-input-number>
          <span class="r-m-l-5">mmol/l</span>
        </div>
      </el-form-item>
      <el-form-item>
        <el-button @click="closeAdd">取消</el-button>
        <el-button type="primary" @click="submit" :loading="addBsDataLoading"> 确认{{ isAdd ? '新增' : '修改' }} </el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<script lang="ts" setup>
import { Plus } from '@element-plus/icons-vue'
import { watch, ref } from 'vue'
import { getBsDataPage, saveBsData, updateBsData, delBsDataById } from '@/api/customer/index'
import { reactive } from 'vue'
import { ElMessage, FormRules } from 'element-plus'
import { useCache } from '@/hooks/web/useCache'

const { wsCache } = useCache()

const leafAreaFlag = ref(wsCache.get('leafAreaFlag'))

const props = defineProps({
  customerId: {
    type: Number,
    default: null
  },
  dict: {
    type: Array,
    default: null
  }
})

const addBsDataVisible = ref(false)

const isAdd = ref(true)

const addBsDataLoading = ref(false)

const tableData = ref([])

const total = ref(0)
const queryFormDefault = {
  pageNum: 1,
  pageSize: 20
}
const queryForm = reactive({ ...queryFormDefault })

const changeSize = () => {
  queryForm.pageNum = 1
  queryInfo()
}

const formRef = ref<any>()

let form = ref<any>({})

const rules = reactive<FormRules>({
  measureTime: [{ required: true, message: '请选择测量时间', trigger: 'blur' }],
  bloodglucose: [{ required: true, message: '血糖不能为空', trigger: 'blur' }]
})

async function queryInfo() {
  const res = await getBsDataPage({ customerId: props.customerId, ...queryForm })
  if (res) {
    tableData.value = res.data.list
    total.value = res.data.total
  }
}

watch(
  () => props.customerId,
  (e) => {
    if (e) {
      queryInfo()
    }
  },
  { immediate: true }
)

const filterDict = (key: any) => {
  return (props.dict.find((item: any) => item.type == key) as any)?.list
}

// 打开新增弹窗
const openAdd = () => {
  addBsDataVisible.value = true
  form.value.customerId = props.customerId
}

// 打开编辑弹窗
const openEdit = (data: any) => {
  isAdd.value = false
  form.value = { ...data, customerId: props.customerId }
  addBsDataVisible.value = true
}

// 关闭新增弹窗
const closeAdd = () => {
  addBsDataVisible.value = false
  setTimeout(() => {
    addBsDataLoading.value = false
    isAdd.value = true
    form.value = {}
  }, 100)
}

// 添加血糖信息
const submit = async () => {
  formRef.value.validate(async (val) => {
    if (!val) return ElMessage.error('请完善必填信息')
    try {
      addBsDataLoading.value = true
      if (isAdd.value) {
        await saveBsData(form.value)
      } else {
        await updateBsData(form.value)
      }
      ElMessage.success(isAdd.value ? '添加成功' : '修改成功')
      closeAdd()
      queryInfo()
    } finally {
      addBsDataLoading.value = false
    }
  })
}

// 删除血糖信息
const delBsData = async (id: any) => {
  await delBsDataById(id)
  ElMessage.success('删除成功')
  queryInfo()
}
</script>

<style scoped lang="less">
:deep(.el-table__cell) {
  text-align: center;
}
</style>
