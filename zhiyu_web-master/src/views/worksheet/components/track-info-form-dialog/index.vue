<template>
  <el-dialog v-model="visibleFlag" title="添加跟踪信息" width="600px" destroy-on-close @close="onClose" :close-on-press-escape="false" :close-on-click-modal="false">
    <el-form ref="formRef" :model="form" label-width="120px" :rules="rules">
      <el-form-item label="时间" prop="time">
        <el-date-picker style="width: 100%" v-model="form.time" type="datetime" value-format="YYYY-MM-DD HH:mm:ss" />
      </el-form-item>
      <el-form-item label="方式" prop="callMode">
        <DictSelectApi width="100%" v-model="form.callMode" keyCode="call_mode" placeholder="请选择方式" />
      </el-form-item>
      <el-form-item label="详情内容" prop="detailContent">
        <el-input v-model="form.detailContent" :rows="3" type="textarea" maxlength="300" show-word-limit />
      </el-form-item>
      <el-form-item label="受理起止时间" prop="dateRange">
        <el-date-picker
          v-model="form.dateRange"
          type="datetimerange"
          range-separator="-"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          format="YYYY-MM-DD HH:mm:ss"
          date-format="YYYY/MM/DD ddd"
          time-format="A hh:mm:ss"
          @change="changeDate"
        />
      </el-form-item>
      <el-form-item label="通话时长"> {{ time }} 分钟 </el-form-item>
      <el-form-item label="客服姓名">
        <el-input v-model="form.userName" disabled />
      </el-form-item>
      <el-form-item>
        <el-button @click="onClose">取消</el-button>
        <el-button type="primary" @click="onSubmit">确认</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<script lang="ts" setup>
import { computed } from 'vue'
import { ref, reactive } from 'vue'
import DictSelectApi from '/@/components/DictSelectApi/index.vue'
import { ElMessage, FormRules } from 'element-plus'
import { saveRecord } from '@/api/worksheet'
import { formatDateString } from '@/utils/index'
import { onMounted } from 'vue'
import { useCache } from '@/hooks/web/useCache'
import { useAppStore } from '@/store/modules/app'
const { wsCache } = useCache()
const appStore = useAppStore()

const emits = defineEmits(['reload-list'])

const visibleFlag = ref(false)

function show(worksheetInfo, trackInfo) {
  if (trackInfo) {
    Object.assign(form, trackInfo)
    form.dateRange = [new Date(trackInfo.startTime), new Date(trackInfo.endTime)]
  }
  if (worksheetInfo) {
    form.customerId = worksheetInfo.customerId
    form.infoId = worksheetInfo.id
  }
  visibleFlag.value = true
}

function onClose() {
  visibleFlag.value = false
  Object.assign(form, formDefault)
}

const changeDate = () => {
  form.startTime = formatDateString(form.dateRange[0])
  form.endTime = formatDateString(form.dateRange[1])
  form.talkMinute = time.value
}

const formDefault = reactive({
  areaProjectCode: '',
  callMode: '',
  customerId: 0,
  detailContent: '',
  endTime: '',
  infoId: 0,
  startTime: '',
  talkMinute: 0,
  date: '',
  dateRange: null,
  userName: '',
  time: formatDateString(new Date())
})

const rules = reactive<FormRules>({
  time: [{ required: true, message: '请选择日期', trigger: 'change' }],
  callMode: [{ required: true, message: '请选择方式', trigger: 'change' }],
  detailContent: [{ required: true, message: '请填写详情内容', trigger: 'change' }],
  dateRange: [{ required: true, message: '请填写受理时间', trigger: 'change' }]
})

let form = reactive<any>({ ...formDefault })

const formRef = ref()

const calculationTime = (data: any) => {
  if (!data) return 0
  let start = new Date(data[0])
  let end = new Date(data[1])
  // 计算时间戳之间的差值
  const diffMilliseconds = Math.abs(start.getTime() - end.getTime())

  // 将差值转换成分钟
  const minutes = Math.floor(diffMilliseconds / 60000)

  return minutes
}

const time = computed(() => {
  return calculationTime(form.dateRange)
})

const onSubmit = async () => {
  await formRef.value.validate((valid) => {
    if (valid) {
      save()
    } else {
      ElMessage.error('请确认必填参数填写正确')
    }
  })
}

const save = async () => {
  await saveRecord({ ...form, time: formatDateString(form.time) })
  ElMessage.success('操作成功')
  emits('reload-list')
  onClose()
}
onMounted(() => {
  form.userName = wsCache.get(appStore.getUserInfo).user.nickname
})

defineExpose({
  show
})
</script>
