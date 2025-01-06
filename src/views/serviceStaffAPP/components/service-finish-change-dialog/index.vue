<template>
  <el-dialog v-model="visibleFlag" title="修改完成服务信息" width="500px" :close-on-press-escape="false" :close-on-click-modal="false" destroy-on-close @close="onClose">
    <el-form ref="formRef" :model="form" label-width="110px" :rules="rules">
      <el-form-item label="完成时间" prop="finishOrderTime">
        <el-date-picker v-model="form.finishOrderTime" type="datetime" placeholder="请选择完成时间" value-format="YYYY-MM-DD HH:mm" format="YYYY-MM-DD HH:mm" :clearable="false" class="!w-full" />
      </el-form-item>
      <el-form-item label="完成服务地址" prop="finishOrderAddress">
        <el-input v-model="form.finishOrderAddress" placeholder="请输入完成服务地址" @change="addressChange" />
        <div v-if="lngErr" class="text-12px text-[#f56c6c] mt-4px">{{ lngErr }}</div>
      </el-form-item>
      <el-form-item label="完成备注" prop="finishServeRemark">
        <el-input v-model="form.finishServeRemark" maxlength="300" show-word-limit type="textarea" :autosize="{ minRows: 3 }" placeholder="请输入完成备注" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="onClose">取消</el-button>
        <el-button type="primary" :loading="loading" @click="onSubmit">确认</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { ElMessage, FormRules } from 'element-plus'
import { updateFinishService } from '@/api/serviceStaffAPP'
import { resetQueryForm } from '@/utils'
import { useMapLocation } from '@/hooks/web/useMapLocation'

const emits = defineEmits(['reload'])

const visibleFlag = ref(false)

const loading = ref(false)

function show(data) {
  form.id = data.id
  form.finishOrderTime = data.finishOrderTime
  form.finishOrderAddress = data.finishOrderAddress
  form.finishServeRemark = data.finishServeRemark
  form.finishLatitude = data.finishLatitude
  form.finishLongitude = data.finishLongitude
  visibleFlag.value = true
}

function onClose() {
  visibleFlag.value = false
  resetQueryForm(form, {})
}

const formDefault = reactive({})

const rules = reactive<FormRules>({
  finishOrderTime: [{ required: true, message: '请选择完成时间', trigger: 'change' }],
  finishOrderAddress: [{ required: true, message: '请输入完成服务地址', trigger: 'blur' }]
})

let form = reactive<any>({ ...formDefault })

const formRef = ref()

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
    await updateFinishService(form)
    ElMessage.success('操作成功')
    emits('reload')
    onClose()
  } finally {
    loading.value = false
  }
}

const lngErr = ref('')
const addressChange = async (address: string) => {
  try {
    const { lat, lng } = (await useMapLocation(address)) as { lat: number; lng: number }
    form.finishLatitude = lat
    form.finishLongitude = lng
  } catch (e) {
    lngErr.value = '无法获取经纬度，请输入更详细地址信息'
  }
}

defineExpose({
  show
})
</script>
<style scoped>
.tip {
  color: var(--main-text-color);
  line-height: 16px;
  margin-bottom: 15px;
}
</style>
