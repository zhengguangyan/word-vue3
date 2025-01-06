<template>
  <el-dialog v-model="visibleFlag" :title="form.id ? '编辑跟踪信息' : '新增跟踪信息'" width="570px" :close-on-press-escape="false" :close-on-click-modal="false" destroy-on-close @close="onClose">
    <el-form ref="formRef" :model="form" label-width="110px" :rules="rules">
      <el-form-item label="时间" prop="time">
        <el-date-picker style="width: 100%" v-model="form.time" type="datetime" placeholder="服务时间" value-format="YYYY-MM-DD HH:mm:ss" date-format="YYYY-MM-DD" time-format="HH:mm:ss" clearable />
      </el-form-item>
      <el-form-item label="方式" prop="callMode">
        <!-- <el-radio-group v-model="form.callMode">
          <el-radio value="1">呼入</el-radio>
          <el-radio value="2">呼出</el-radio>
        </el-radio-group> -->
        <el-select v-model="form.callMode" placeholder="请选择方式" clearable>
          <el-option value="1" label="呼入" />
          <el-option value="2" label="呼出" />
        </el-select>
      </el-form-item>
      <el-form-item label="详细内容" prop="detailContent">
        <el-input v-model="form.detailContent" placeholder="请输入详细内容" :rows="3" type="textarea" maxlength="300" show-word-limit />
      </el-form-item>
      <el-form-item label="受理起止时间" prop="dateRange">
        <el-date-picker
          v-model="form.dateRange"
          type="datetimerange"
          range-separator="-"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          value-format="YYYY-MM-DD HH:mm:ss"
          date-format="YYYY-MM-DD"
          time-format="HH:mm:ss"
          @change="changeDate"
        />
      </el-form-item>
      <el-form-item label="客服" prop="userName">
        <el-input v-model="form.userName" disabled />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="onClose">取消</el-button>
        <el-button type="primary" @click="onSubmit" :loading="loading">确认</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, FormRules } from 'element-plus'
import { useCache } from '@/hooks/web/useCache'
import { useAppStore } from '@/store/modules/app'
import { resetQueryForm } from '@/utils'
import { saveRecord, updateRecord } from '@/api/worksheet'
const { wsCache } = useCache()
const appStore = useAppStore()

const emits = defineEmits(['reload-list'])

const visibleFlag = ref(false)

const loading = ref(false)

function show(data, row) {
  form.infoId = data.id
  form.customerId = data.memberId
  if (row) {
    Object.assign(form, row)
    form.dateRange = [row.startTime, row.endTime]
  }
  visibleFlag.value = true
}

function onClose() {
  visibleFlag.value = false
  resetQueryForm(form, {})
}

const formDefault = reactive({
  id: undefined,
  time: undefined,
  callMode: undefined,
  detailContent: undefined,
  dateRange: undefined,
  userName: undefined
})

const rules = reactive<FormRules>({
  time: [{ required: true, message: '请选择日期', trigger: 'change' }],
  callMode: [{ required: true, message: '请选择方式', trigger: 'change' }],
  detailContent: [{ required: true, message: '请填写详情内容', trigger: 'change' }],
  dateRange: [{ required: true, message: '请填写受理时间', trigger: 'change' }]
})

let form = reactive<any>({ ...formDefault })

const formRef = ref()

const changeDate = () => {
  form.startTime = form.dateRange[0]
  form.endTime = form.dateRange[1]
}

const onSubmit = async () => {
  loading.value = true
  await formRef.value.validate((valid) => {
    if (valid) {
      save()
    } else {
      ElMessage.error('请确认必填参数填写正确')
      loading.value = false
    }
  })
}

const save = async () => {
  try {
    if (!form.id) {
      await saveRecord(form)
    } else {
      await updateRecord(form)
    }
    ElMessage.success('操作成功')
    emits('reload-list')
    onClose()
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  form.userName = wsCache.get(appStore.getUserInfo).user.nickname
})

defineExpose({
  show
})
</script>
<style scoped>
.el-upload__tip {
  color: #ccc;
}
</style>
