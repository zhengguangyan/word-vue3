<template>
  <el-dialog destroy-on-close v-model="visibleFlag" title="编辑卡信息" width="500px" @close="onClose" :close-on-press-escape="false" :close-on-click-modal="false">
    <el-form ref="formRef" :model="form" label-width="100px">
      <el-form-item label="卡号"> {{ form.code }} </el-form-item>
      <el-form-item label="内码"> {{ form.internalCode }} </el-form-item>
      <el-form-item label="状态">
        {{ renderDict(form.status, 'subsidy_card_using_status') }}
      </el-form-item>
      <el-form-item label="卡类别">
        {{ renderDict(form.type, 'card_type') }}
      </el-form-item>
      <el-form-item label="图片" prop="pic">
        <ImgsUpload v-model="fileList" :limit="2" show-limit />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="onClose">取消</el-button>
        <el-button :disabled="!fileList.length" type="primary" :loading="loading" @click="save">确认</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { subsidyCardDetail, updateSubsidyCard } from '@/api/subsidy'
import ImgsUpload from '@/components/ImgsUpload/index.vue'
import { renderDict } from '@/hooks/web/useDict'

const emits = defineEmits(['reload-list'])

const formDefault = reactive({
  id: undefined,
  code: undefined,
  internalCode: undefined,
  type: undefined,
  status: undefined
})

let form = reactive<any>({ ...formDefault })

const formRef = ref()

const visibleFlag = ref(false)

const loading = ref(false)

const show = async (rowData) => {
  try {
    const { data } = await subsidyCardDetail(rowData.id)
    Object.assign(form, data)
    if (data.attachList) {
      fileList.value = data.attachList
    }
    visibleFlag.value = true
  } catch (error) {}
}

// async function getData(id) {
//   const res = await subsidyCardDetail(id)
//   Object.assign(form, res.data)
// }

function onClose() {
  Object.assign(form, formDefault)
  fileList.value = []
  visibleFlag.value = false
}

const fileList = ref<any>([])

const save = async () => {
  const batchPhotos = fileList.value.map((item) => item.id).join(',')
  try {
    loading.value = true
    await updateSubsidyCard({ id: form.id, batchPhotos })
    ElMessage.success('编辑成功')
    emits('reload-list')
    onClose()
  } finally {
    loading.value = false
    // ElMessage.error(err.message)
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
  display: inline-block;
  margin-right: 5px;
}
:deep(.el-dialog__body) {
  padding-top: 10px;
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
