<template>
  <el-dialog
    destroy-on-close
    v-model="visibleFlag"
    title="批量设置图片"
    width="500px"
    @close="onClose"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
  >
    <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
      <el-form-item label="卡类别" prop="type">
        <DictSelect
          width="100%"
          v-model="form.type"
          :distList="filterDict('card_type')"
          placeholder="卡类别"
          :clearable="true"
        />
      </el-form-item>
      <el-form-item label="图片" prop="pic">
        <ImgsUpload v-model="fileList" :limit="2" />
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
import { ElMessage } from 'element-plus'
import DictSelect from '/@/components/DictSelect/index.vue'
import { subsidyPhotoSet } from '@/api/subsidy'
import ImgsUpload from '@/components/ImgsUpload/index.vue'
import { filterDict } from '@/hooks/web/useDict'

const emits = defineEmits(['reload-list'])

const visibleFlag = ref(false)

const loading = ref(false)

const show = async () => {
  visibleFlag.value = true
}

function onClose() {
  Object.assign(form, formDefault)
  fileList.value = []
  visibleFlag.value = false
}

const fileList = ref<any>([])
const formDefault = reactive({
  type: undefined,
  pic: undefined
})

let form = reactive({ ...formDefault })

const validatePic = (_rule: any, _value: any, callback: any) => {
  if (!fileList.value && fileList.value.length) return callback(new Error('请上传图片'))
  callback()
}
const rules = reactive({
  type: [{ required: true, message: '请选择卡类别', trigger: 'change' }],
  pic: [{ required: true, validator: validatePic, trigger: 'blur' }]
})

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
  const batchPhotos = fileList.value.map((item) => item.id).join(',')
  try {
    loading.value = true
    await subsidyPhotoSet({ type: form.type, batchPhotos })
    ElMessage.success('设置成功')
    emits('reload-list')
    onClose()
  } finally {
    loading.value = false
  }
}

defineExpose({
  show
})
</script>

<style scoped lang="less">
.avatar-uploader-icon {
  background-color: #fff;
  font-size: 28px;
  color: #8c939d;
  width: 80px;
  height: 80px;
  text-align: center;
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
}
.avatar {
  width: 80px;
  height: 80px;
  display: block;
}
:deep(.el-dialog__body) {
  padding-top: 10px !important;
}
:deep(.el-upload-list--picture-card) {
  --el-upload-list-picture-card-size: 80px;
}
:deep(.el-upload--picture-card) {
  --el-upload-picture-card-size: 80px;
}
:deep(.disabled .el-upload--picture-card) {
  display: none;
}
</style>
