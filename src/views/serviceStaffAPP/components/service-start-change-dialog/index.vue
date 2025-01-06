<template>
  <el-dialog v-model="visibleFlag" title="修改开始服务信息" width="500px" :close-on-press-escape="false" :close-on-click-modal="false" destroy-on-close @close="onClose">
    <el-form ref="formRef" :model="form" label-width="80px" :rules="rules">
      <el-form-item label="开始时间" prop="startOrderTime">
        <el-date-picker v-model="form.startOrderTime" type="datetime" placeholder="请选择开始时间" value-format="YYYY-MM-DD HH:mm" format="YYYY-MM-DD HH:mm" :clearable="false" class="!w-full" />
      </el-form-item>
      <el-form-item label="开始地址" prop="startOrderAddress">
        <el-input v-model="form.startOrderAddress" placeholder="请输入开始服务地址" @change="addressChange" />
        <div v-if="lngErr" class="text-12px text-[#f56c6c] mt-4px">{{ lngErr }}</div>
      </el-form-item>
      <el-form-item label="开始备注" prop="startServeRemark">
        <el-input v-model="form.startServeRemark" maxlength="300" show-word-limit type="textarea" :autosize="{ minRows: 3 }" placeholder="请输入开始备注" />
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
import { updateStartService } from '@/api/serviceStaffAPP'
import { resetQueryForm } from '@/utils'
import { useMapLocation } from '@/hooks/web/useMapLocation'

const emits = defineEmits(['reload'])

const visibleFlag = ref(false)

const loading = ref(false)

function show(data) {
  form.id = data.id
  form.startOrderTime = data.startOrderTime
  form.startOrderAddress = data.startOrderAddress
  form.startServeRemark = data.startServeRemark
  form.startLatitude = data.startLatitude
  form.startLongitude = data.startLongitude
  visibleFlag.value = true
}

function onClose() {
  visibleFlag.value = false
  resetQueryForm(form, {})
}

const formDefault = reactive({})

const rules = reactive<FormRules>({
  startOrderTime: [{ required: true, message: '请选择开始时间', trigger: 'change' }],
  startOrderAddress: [{ required: true, message: '请输入开始服务地址', trigger: 'blur' }]
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
    await updateStartService(form)
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
    form.startLatitude = lat
    form.startLongitude = lng
    lngErr.value = ''
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
