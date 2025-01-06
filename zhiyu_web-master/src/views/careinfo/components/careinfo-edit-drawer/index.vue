<template>
  <el-drawer v-model="visibleFlag" size="900px" title="编辑关怀信息" destroy-on-close :close-on-click-modal="false">
    <div class="info-list info">
      <div class="detail-info-item item-33">
        <span class="detail-info-item-label">关怀编号</span>
        <span class="detail-info-item-content">{{ form.careNo }}</span>
      </div>
      <div class="detail-info-item item-33">
        <span class="detail-info-item-label">会员姓名</span>
        <span class="detail-info-item-content">
          <span> {{ form.customerName }}</span>
          <el-button class="r-m-l-5" link type="primary" @click="customerDetail"> 查看客户信息 </el-button>
        </span>
      </div>
      <div class="detail-info-item item-33">
        <span class="detail-info-item-label">归属项目</span>
        <span class="detail-info-item-content">{{ renderDict(form.belongProjectType, 'project_type') }}</span>
      </div>
      <div class="detail-info-item item-33" v-if="form.belongProjectType == '9'">
        <span class="detail-info-item-label">订单编号</span>
        <span class="detail-info-item-content">{{ form.orderNumber }} </span>
      </div>
      <div class="detail-info-item item-33">
        <span class="detail-info-item-label">归属项目名称</span>
        <span class="detail-info-item-content">
          <span v-if="form.belongProjectType == '2'">
            {{ renderDict(form.belongProjectName, 'service_package_type') }}
          </span>
          <span v-if="form.belongProjectType == '7'">
            {{ renderDict(form.belongProjectName, 'carePackage_type') }}
          </span>
        </span>
      </div>
      <div class="detail-info-item item-33">
        <span class="detail-info-item-label">通话时长</span>
        <span class="detail-info-item-content">{{ form.talkMinute || 0 }}分钟</span>
      </div>
      <div class="detail-info-item item-33">
        <span class="detail-info-item-label">联系电话</span>
        <span class="detail-info-item-content">{{ form.phone }}</span>
      </div>
      <div class="detail-info-item item-100">
        <span class="detail-info-item-label">预定关怀时间</span>
        <span class="detail-info-item-content">{{ formatDateString(form.reserveTime) }}</span>
      </div>
    </div>

    <el-form :model="form" ref="formRef" label-width="110px" :rules="rules">
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

      <el-form-item label="关怀内容" prop="careContent">
        <el-input v-model="form.careContent" :rows="3" type="textarea" maxlength="1500" show-word-limit />
      </el-form-item>
      <el-form-item label="备注">
        <el-input v-model="form.careComment" :rows="3" type="textarea" maxlength="300" show-word-limit />
      </el-form-item>
      <!-- <el-form-item label="是否结案">
        <el-radio-group v-model="form.isClosed">
          <el-radio :value="1">是</el-radio>
          <el-radio :value="0">否</el-radio>
        </el-radio-group>
      </el-form-item> -->
      <el-form-item label="下次回访日期" prop="reserveTime">
        <el-date-picker v-model="form.reserveTime" value-format="YYYY-MM-DD HH:mm:ss" type="datetime" />
        <!-- <el-checkbox
          @change="rules.reserveTime[0].required = form.isReturnMe"
          v-model="form.isReturnMe"
          label="由我访问"
          style="margin-left: 20px"
        /> -->
      </el-form-item>
      <el-form-item label="是否由我访问">
        <el-radio-group v-model="form.isReturnMe">
          <el-radio :value="1">是</el-radio>
          <el-radio :value="0">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="是否接通" prop="isConnect">
        <el-radio-group v-model="form.isConnect" @change="changeIsConnect">
          <el-radio :value="1">是</el-radio>
          <el-radio :value="0">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="!form.isConnect" label="是否空号" prop="isEmptynumber">
        <el-radio-group v-model="form.isEmptynumber">
          <el-radio :value="1">是</el-radio>
          <el-radio :value="0">否</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="onSubmit" :loading="submitLoading">保存</el-button>
        <el-button @click="onClose">取消</el-button>
      </el-form-item>
    </el-form>
  </el-drawer>
</template>
<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { formatDateString } from '@/utils/index'
import { getCareinfoDetailById, updateCareinfo } from '@/api/careinfo'
import { useRouter } from 'vue-router'
const { push } = useRouter()

const props = defineProps({
  dict: {
    type: Array,
    default: null
  }
})

const emits = defineEmits(['reload-list'])

const visibleFlag = ref(false)

const submitLoading = ref(false)

const form = ref<any>({})

const rules = reactive<any>({
  dateRange: [{ required: true, message: '请选择受理起止时间', trigger: 'change' }],
  careContent: [{ required: true, message: '请填写关怀内容', trigger: 'blur' }],
  isConnect: [{ required: true, message: '请选择是否接通', trigger: 'change' }],
  isEmptynumber: [{ required: false, message: '请选择是否空号', trigger: 'change' }],
  reserveTime: [{ required: false, message: '请选择回日期', trigger: 'blur' }]
})

function show(data) {
  getCareinfo(data.id)
  visibleFlag.value = true
}

function onClose() {
  visibleFlag.value = false
  form.value = {}
}

const changeIsConnect = () => {
  form.value.isEmptynumber = null
  rules.isEmptynumber[0].required = !form.value.isConnect
}

// const changeIsReturnMe = () => {
//   rules.reserveTime[0].required = form.value.isReturnMe
// }

function customerDetail() {
  push(`/customer/detail?id=${form.value.customerId}&customerUpdate=true`)
}

async function getCareinfo(id) {
  const res = await getCareinfoDetailById(id)
  if (res) {
    form.value = res.data
    if (res.data.startTime && res.data.endTime) {
      form.value.dateRange = [new Date(res.data.startTime), new Date(res.data.endTime)]
    }
    if (!res.data.isConnect) {
      rules.isEmptynumber[0].required = true
    }
    // if (res.data.isReturnMe) {
    //   rules.reserveTime[0].required = true
    // }
  }
}

const formRef = ref()

const changeDate = () => {
  form.value.startTime = formatDateString(form.value.dateRange[0])
  form.value.endTime = formatDateString(form.value.dateRange[1])
  form.value.talkMinute = time.value
}

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
  return calculationTime(form.value.dateRange)
})

const onSubmit = async () => {
  try {
    submitLoading.value = true
    await formRef.value.validate()
    save()
  } catch (err) {
    ElMessage.error('参数验证错误，请仔细填写表单数据!')
    submitLoading.value = false
  }
}

const save = async () => {
  try {
    let result: any = await updateCareinfo(form.value)
    if (result.code === 200) {
      ElMessage.success('操作成功')
      emits('reload-list')
      onClose()
    }
  } finally {
    submitLoading.value = false
  }
}

const filterDict = (key: any) => {
  return (props.dict.find((item: any) => item.type == key) as any)?.list
}

const renderDict = (key: any, dict: any) => {
  if (!key) {
    return
  }
  return filterDict(dict)
    ?.filter((item: any) => key.includes(item.value))
    .map((item: any) => item?.label)
    .join('，')
}

// const radioDict = (key: any, dict: any) => {
//   if (!key) {
//     return
//   }
//   return filterDict(dict)
//     ?.filter((item: any) => item.value == key)
//     .map((item: any) => item?.label)
//     .join('，')
// }
defineExpose({
  show
})
</script>
<style scope>
.info {
  font-size: 14px;
  color: var(--main-text-color);
}
</style>
