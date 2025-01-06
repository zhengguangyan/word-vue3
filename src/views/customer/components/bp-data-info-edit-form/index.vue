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
        <el-popconfirm title="请确认是否永久删除该记录？" @confirm="delBpData(row.id)">
          <template #reference>
            <el-button link type="primary" size="small" :disabled="!leafAreaFlag">删除</el-button>
          </template>
        </el-popconfirm>
      </template>
    </el-table-column>
    <el-table-column show-overflow-tooltip prop="measureTime" label="测量时间" />
    <el-table-column show-overflow-tooltip prop="highBlood" label="高压">
      <template #default="{ row }"> {{ row.highBlood }} mmHg </template>
    </el-table-column>
    <el-table-column show-overflow-tooltip prop="lowBlood" label="低压">
      <template #default="{ row }"> {{ row.lowBlood }} mmHg </template>
    </el-table-column>
    <el-table-column show-overflow-tooltip prop="heartRate" label="心率">
      <template #default="{ row }"> {{ row.heartRate }} 次/分钟 </template>
    </el-table-column>
    <el-table-column show-overflow-tooltip prop="uploadUserId" label="上传人员" />
    <el-table-column show-overflow-tooltip prop="bloodDataSource" label="数据来源">
      <template #default="{ row }">
        {{ filterDict('blood_data_source').find((item) => item.value == row.bloodDataSource)?.label }}
      </template>
    </el-table-column>
    <el-table-column show-overflow-tooltip prop="bloodPressure" label="血压情况">
      <template #default="{ row }">
        {{ filterDict('blood_pressure_situation').find((item) => item.value == row.bloodPressure)?.label }}
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
    v-model="addBpDataVisible"
    :title="isAdd ? '添加血压信息' : '修改血压信息'"
    width="500px"
    @close="closeAdd"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
  >
    <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
      <el-form-item label="测量时间：" prop="measureTime">
        <el-date-picker v-model="form.measureTime" type="datetime" placeholder="请选择测量时间" value-format="YYYY-MM-DD HH:mm:ss" style="width: 100%" />
      </el-form-item>
      <el-form-item label="高压：" prop="highBlood">
        <el-input v-model="form.highBlood" placeholder="高压">
          <template #append>mmHg</template>
        </el-input>
      </el-form-item>
      <el-form-item label="低压：" prop="lowBlood">
        <el-input v-model="form.lowBlood" placeholder="低压">
          <template #append>mmHg</template>
        </el-input>
      </el-form-item>
      <el-form-item label="心率：" prop="heartRate">
        <el-input v-model="form.heartRate" placeholder="心率">
          <template #append>次/分钟</template>
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="closeAdd">取消</el-button>
        <el-button type="primary" @click="submit" :loading="addBpDataLoading"> 确认{{ isAdd ? '新增' : '修改' }} </el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<script lang="ts" setup>
import { Plus } from '@element-plus/icons-vue'
import { watch, ref } from 'vue'
import { getBpDataPage, saveBpData, updateBpData, delBpDataById } from '@/api/customer/index'
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

const addBpDataVisible = ref(false)

const isAdd = ref(true)

const addBpDataLoading = ref(false)

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
  highBlood: [{ required: true, message: '高压不能为空', trigger: 'blur' }],
  lowBlood: [{ required: true, message: '低压不能为空', trigger: 'blur' }],
  heartRate: [{ required: true, message: '心率不能为空', trigger: 'blur' }]
})

async function queryInfo() {
  const res = await getBpDataPage({ customerId: props.customerId, ...queryForm })
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
  addBpDataVisible.value = true
  form.value.customerId = props.customerId
}

// 打开编辑弹窗
const openEdit = (data: any) => {
  isAdd.value = false
  form.value = { ...data, customerId: props.customerId }
  addBpDataVisible.value = true
}

// 关闭新增弹窗
const closeAdd = () => {
  addBpDataVisible.value = false
  setTimeout(() => {
    addBpDataLoading.value = false
    isAdd.value = true
    form.value = {}
  }, 100)
}

// 添加血压信息
const submit = async () => {
  formRef.value.validate(async (val) => {
    if (!val) return ElMessage.error('请完善必填信息')
    try {
      addBpDataLoading.value = true
      if (isAdd.value) {
        await saveBpData(form.value)
      } else {
        await updateBpData(form.value)
      }
      ElMessage.success(isAdd.value ? '添加成功' : '修改成功')
      closeAdd()
      queryInfo()
    } finally {
      addBpDataLoading.value = false
    }
  })
}

// 删除血压信息
const delBpData = async (id: any) => {
  await delBpDataById(id)
  ElMessage.success('删除成功')
  queryInfo()
}
</script>

<style scoped lang="less">
:deep(.el-table__cell) {
  text-align: center;
}
</style>
