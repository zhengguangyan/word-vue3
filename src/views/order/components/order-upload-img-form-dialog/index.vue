<template>
  <el-dialog v-model="visibleFlag" :title="`上传服务${type}照片`" width="500px" :close-on-press-escape="false" :close-on-click-modal="false" destroy-on-close @close="onClose">
    <el-form ref="formRef" :model="form" label-width="100px" :rules="rules">
      <el-form-item :label="`服务${type}照片`" prop="fileIdList">
        <ImgsUpload v-model="form.fileIdList" :disabled="imgLoading" :limit="10" />
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
import { ref, reactive } from 'vue'
import { ElMessage, FormRules } from 'element-plus'
import { uploadImages } from '@/api/order'
import ImgsUpload from '@/components/ImgsUpload/index.vue'

const emits = defineEmits(['reload-list'])

const visibleFlag = ref(false)

const loading = ref(false)

const imgLoading = ref(false)

const type = ref('前')

function show(data, t) {
  form.id = data.id
  type.value = t
  visibleFlag.value = true
}

function onClose() {
  visibleFlag.value = false
  Object.assign(form, formDefault)
}

const formDefault = reactive({
  id: undefined,
  fileIdList: []
})

const rules = reactive<FormRules>({
  fileIdList: [{ required: true, message: '请上传照片', trigger: 'change' }]
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
    await uploadImages({
      id: form.id,
      fileIdList: form.fileIdList.map((item) => item.id),
      type: type.value === '前' ? 'before' : 'after'
    })
    ElMessage.success('操作成功')
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
<style scoped>
.tip {
  color: var(--main-text-color);
  line-height: 16px;
  margin-bottom: 15px;
}
</style>
