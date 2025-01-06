<template>
  <el-form ref="formRef" :model="form" label-width="102px" :rules="!form.returnTime ? rules : specRules" :validate-on-rule-change="false">
    <el-form-item prop="worksheetCategoryId" :label="serviceType == 'consult' ? '咨询类别' : '投诉类别'" label-class-name="required-item" span="3" v-if="leafAreaFlag">
      <el-select v-model="form.worksheetCategoryId" placeholder="请选择" @change="getWorksheetTypeChildren">
        <el-option v-for="item in worksheetTypeList" :key="item.id" :label="item.worksheetTypeName" :value="item.id" />
      </el-select>
    </el-form-item>
    <el-form-item prop="worksheettypeInfoId" :label="serviceType == 'consult' ? '咨询子类' : '投诉子类'" label-class-name="required-item" span="3" v-if="leafAreaFlag">
      <el-select :disabled="!form.worksheetCategoryId" v-model="form.worksheettypeInfoId" placeholder="请选择">
        <el-option v-for="item in worksheetTypeInfoList" :key="item.id" :label="item.worksheetTypeName" :value="item.id" />
      </el-select>
    </el-form-item>
    <el-form-item prop="worksheetQuestion" label="呼入问题" label-class-name="required-item" span="3">
      <el-input v-model="form.worksheetQuestion" :rows="3" type="textarea" maxlength="2000" show-word-limit />
    </el-form-item>
    <el-form-item prop="worksheetAnswer" label="处理方式" label-class-name="required-item" span="3">
      <el-input v-model="form.worksheetAnswer" :rows="3" type="textarea" maxlength="2000" show-word-limit />
    </el-form-item>
    <el-form-item label="备注" span="3">
      <el-input v-model="form.worksheetComment" :rows="3" type="textarea" maxlength="2000" show-word-limit />
    </el-form-item>
    <el-form-item prop="isClosed" label="是否结案" label-class-name="required-item" span="3">
      <el-radio-group v-model="form.isClosed">
        <el-radio value="1">是</el-radio>
        <el-radio value="0">否</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item prop="isReturnMe" label="是否由我回访" span="3" v-if="form.isClosed === '0'">
      <el-radio-group v-model="form.isReturnMe">
        <el-radio value="1">是</el-radio>
        <el-radio value="0">否</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="下次回访日期" span="3" v-if="form.isClosed === '0'">
      <el-date-picker v-model="form.returnTime" type="datetime" value-format="YYYY-MM-DD HH:mm:ss" />
      <!-- <el-checkbox v-model="form.isReturnMe" label="由我访问" style="margin-left: 20px" /> -->
    </el-form-item>
    <h4 class="title" style="margin: 24px 0 16px; font-weight: 600">历史工单</h4>
    <el-table
      :data="historyWorksheetList"
      header-row-class-name="table-header"
      :style="{
        width: 'calc(100vw - 415px)',
        border: '1px solid #f5f3f0',
        borderRadius: '8px'
      }"
      max-height="200"
    >
      <el-table-column type="index" />
      <el-table-column label="操作" width="80">
        <template #default="{ row }">
          <el-button link type="primary" size="small" @click="detail(row)"> 查看 </el-button>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip prop="worksheetNo" label="工单编号" min-width="200" />
      <el-table-column show-overflow-tooltip prop="createTime" label="受理时间" min-width="200" />
      <el-table-column show-overflow-tooltip prop="creatorName" label="归属客服" min-width="100" />
      <el-table-column show-overflow-tooltip prop="isClosed" label="是否结案" min-width="100">
        <template #default="{ row }">
          {{ row.isClosed !== 0 ? '是' : '否' }}
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip prop="worksheetType" label="工单类型" min-width="100" />
      <el-table-column show-overflow-tooltip prop="worksheetCategory" label="工单类别" min-width="100" />
      <el-table-column show-overflow-tooltip prop="returnTime" label="下次访问日期" min-width="200" />
      <el-table-column show-overflow-tooltip prop="returnUserName" label="回访人" min-width="100" />
    </el-table>
  </el-form>
  <div class="button-box">
    <el-button type="primary" @click="submit" :loading="saving">保存</el-button>
    <el-button @click="onBack">取消</el-button>
    <span class="tips">
      <Icon icon="mdi:about-circle-outline" style="vertical-align: middle" />
      若要自动关联通话录音，请在通话挂断后再点击添加（录音在通话挂断后才会生成），通话挂断前点击添加，关联的录音将不正确！
    </span>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import { ElMessage, FormRules } from 'element-plus'
import { useRouter } from 'vue-router'
import { saveWorksheet, getWorksheetList, getAllWorksheetTypeList } from '@/api/worksheet/index'
import { useCache } from '@/hooks/web/useCache'
const { wsCache } = useCache()

const leafAreaFlag = ref(wsCache.get('leafAreaFlag'))

const props = defineProps({
  customerId: {
    type: Number,
    default: null
  },
  serviceType: {
    type: String,
    default: 'consult'
  }
})

const emits = defineEmits(['clear-phone'])

const { back, push } = useRouter()

const detail = (row) => {
  push(`/worksheet/details?id=${row.id}`)
}

function onBack() {
  onClear()
  back()
}

const onClear = () => {
  Object.assign(form, formDefault)
  formRef.value?.resetFields()
  // emits('clear-phone')
}

const rules = reactive<FormRules>({
  worksheetCategoryId: [{ required: true, message: '请选择类别', trigger: 'blur' }],
  worksheettypeInfoId: [{ required: true, message: '请选择子类', trigger: 'blur' }],
  worksheetQuestion: [{ required: true, message: '请填写呼入问题', trigger: 'change' }],
  worksheetAnswer: [{ required: true, message: '请填写处理方式', trigger: 'change' }],
  isClosed: [{ required: true, message: '请选择是否结案', trigger: 'blur' }]
})

const specRules = reactive<FormRules>({
  worksheetCategoryId: [{ required: true, message: '请选择类别', trigger: 'blur' }],
  worksheettypeInfoId: [{ required: true, message: '请选择子类', trigger: 'blur' }],
  worksheetQuestion: [{ required: true, message: '请填写呼入问题', trigger: 'change' }],
  worksheetAnswer: [{ required: true, message: '请填写处理方式', trigger: 'change' }],
  isClosed: [{ required: true, message: '请选择是否结案', trigger: 'blur' }],
  isReturnMe: [{ required: true, message: '请选择是否由我回访', trigger: 'blur' }]
})

const formDefault = reactive({
  areaProjectCode: undefined,
  customerId: 0,
  isClosed: '0',
  isReturnMe: undefined,
  returnTime: undefined,
  worksheetAnswer: undefined,
  worksheetCategoryId: undefined,
  worksheetComment: undefined,
  worksheetQuestion: undefined,
  worksheetTypeId: '1',
  worksheettypeInfoId: undefined
})

let form = reactive({ ...formDefault })

const saving = ref(false)

const formRef = ref()

const submit = async () => {
  await formRef.value.validate((valid) => {
    if (valid) {
      save()
    } else {
      ElMessage.error('请确认必填参数填写正确')
    }
  })
}

async function save() {
  saving.value = true
  try {
    await saveWorksheet(form)
    ElMessage.success('添加成功')
    onClear()
    getHistoryWorksheetList()
  } finally {
    saving.value = false
  }
}

const historyWorksheetList = ref([])

const worksheetTypeList = ref<any>([])
const worksheetTypeInfoList = ref<any>([])
const getWorksheetTypeList = async (parentId) => {
  const res = await getAllWorksheetTypeList({ parentId: parentId })
  return res.data
}

const getWorksheetTypeListByName = async (worksheetTypeName) => {
  const res = await getAllWorksheetTypeList({ worksheetTypeName: worksheetTypeName })
  return res.data
}

const getWorksheetTypeChildren = async () => {
  form.worksheettypeInfoId = undefined
  worksheetTypeInfoList.value = await getWorksheetTypeList(form.worksheetCategoryId)
}

async function queryInfo() {
  onClear()
  form.customerId = props.customerId
  form.worksheetTypeId = props.serviceType == 'consult' ? '3965342271209989' : '3965352075919877'
  let worksheetTypeName = props.serviceType == 'consult' ? '咨询' : '投诉'
  form.worksheetCategoryId = undefined
  form.worksheettypeInfoId = undefined
  worksheetTypeList.value = await getWorksheetTypeListByName(worksheetTypeName)
}

async function getHistoryWorksheetList() {
  const result = await getWorksheetList({ customerId: props.customerId })
  historyWorksheetList.value = result.data
}
watch(
  () => [{ ...props }],
  () => {
    queryInfo()
    getHistoryWorksheetList()
  },
  { deep: true, immediate: true }
)
</script>

<style scoped lang="less">
.tips {
  margin-left: 40px;
  color: #e96848;
  font-size: 14px;
}
.button-box {
  margin: 20px 0;
  display: flex;
  align-items: center;
}
:deep(.el-form-item--default .el-form-item__label) {
  white-space: nowrap;
}
</style>
