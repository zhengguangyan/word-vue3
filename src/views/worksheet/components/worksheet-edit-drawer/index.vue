<template>
  <el-drawer v-model="visibleFlag" :close-on-press-escape="false" :close-on-click-modal="false" size="900px" title="编辑工单信息">
    <el-row class="info" justify="space-evenly">
      <el-col :span="8">工单类型 {{ renderDict(form.worksheetTypeId, 'worksheet_category') }}</el-col>
      <el-col :span="8">工单编号 {{ form.worksheetNo }}</el-col>
      <el-col :span="8">
        会员姓名 {{ form.customerName }}
        <el-button link type="primary" @click="customerDetail"> 查看客户信息 </el-button>
      </el-col>
    </el-row>
    <el-form :model="form" ref="formRef" label-width="110px" :rules="rules">
      <el-form-item label="工单类别" prop="worksheetCategoryId">
        <DictSelect width="100%" v-model="form.worksheetCategoryId" :distList="filterDict('worksheet_category')" placeholder="工单类别" :clearable="true" />
      </el-form-item>

      <el-form-item label="呼入问题" prop="worksheetQuestion">
        <el-input v-model="form.worksheetQuestion" :rows="3" type="textarea" />
      </el-form-item>
      <el-form-item label="处理方式" prop="worksheetAnswer">
        <el-input v-model="form.worksheetAnswer" :rows="3" type="textarea" />
      </el-form-item>
      <el-form-item label="备注">
        <el-input v-model="form.worksheetComment" :rows="3" type="textarea" />
      </el-form-item>
      <el-form-item label="结案" prop="isClosed">
        <el-radio-group v-model="form.isClosed">
          <el-radio :value="1">是</el-radio>
          <el-radio :value="0">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="是否由我访问">
        <el-radio-group v-model="form.isReturnMe">
          <el-radio :value="1">是</el-radio>
          <el-radio :value="0">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="回访日期">
        <el-date-picker v-model="form.returnTime" value-format="YYYY-MM-DD HH:mm:ss" type="datetime" />
        <!-- <el-checkbox v-model="form.isReturnMe" label="由我访问" style="margin-left: 20px" /> -->
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">保存</el-button>
        <el-button @click="onClose">取消</el-button>
      </el-form-item>
    </el-form>
  </el-drawer>
</template>
<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import DictSelect from '/@/components/DictSelect/index.vue'
import { getWorksheetInfoById, updateWorksheet } from '@/api/worksheet/index'
import { useCache } from '@/hooks/web/useCache'
import { useRouter } from 'vue-router'
const { push } = useRouter()

const emits = defineEmits(['reload-list'])

const { wsCache } = useCache()

const visibleFlag = ref(false)

const props = defineProps({
  dict: {
    type: Array,
    default: null
  }
})

const rules = reactive<any>({
  worksheetCategoryId: [{ required: true, message: '请选择受理起止时间', trigger: 'change' }],
  worksheetQuestion: [{ required: true, message: '请填写关怀内容', trigger: 'change' }],
  worksheetAnswer: [{ required: true, message: '请选择是否接通', trigger: 'change' }],
  isClosed: [{ required: true, message: '请选择是否空号', trigger: 'change' }]
})

function show(data) {
  getWorksheetInfo(data.id)
  visibleFlag.value = true
}

function onClose() {
  visibleFlag.value = false
  Object.assign(form, {})
}

function customerDetail() {
  push(`/customer/detail?id=${form.customerId}&customerUpdate=true`)
}

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

async function getWorksheetInfo(id) {
  const res = await getWorksheetInfoById(id)
  if (res) {
    Object.assign(form, res.data)
  }
}

const form = reactive<any>({})
const formRef = ref()

const onSubmit = async () => {
  try {
    await formRef.value.validate()
    save()
  } catch (err) {
    ElMessage.error('参数验证错误，请仔细填写表单数据!')
  }
}

const save = async () => {
  try {
    await updateWorksheet({
      ...form,
      areaCode: wsCache.get('areaCode')
    })
    ElMessage.success('操作成功')
    emits('reload-list')
    onClose()
  } finally {
    // ElMessage.error(err.message)
  }
}

defineExpose({
  show
})
</script>
<style>
.info {
  padding-left: 20px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 400;
  margin-bottom: 20px;
}
</style>
