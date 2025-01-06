<template>
  <el-dialog v-model="visibleFlag" :title="form.id ? '编辑其他服务包' : '新增其他服务包'" width="500px" :close-on-press-escape="false" :close-on-click-modal="false" destroy-on-close @close="onClose">
    <el-form ref="formRef" :model="form" label-width="100px" :rules="rules">
      <el-form-item label="编号" v-if="form.id">
        {{ form.no }}
      </el-form-item>
      <el-form-item label="服务包名称" prop="name">
        <el-input v-model="form.name" placeholder="服务包名称" maxlength="20" show-word-limit />
      </el-form-item>
      <el-form-item label="排序码" prop="sortKey">
        <el-input v-model="form.sortKey" placeholder="1-999" />
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="form.remark" placeholder="请输入备注" :rows="3" type="textarea" show-word-limit maxlength="300" />
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
import { saveOtherPacket, updateOtherPacket } from '@/api/servePacket'

const emits = defineEmits(['reload-list'])

const visibleFlag = ref(false)

const loading = ref(false)

function show(data) {
  if (data) {
    Object.assign(form, data)
  }
  visibleFlag.value = true
}

function onClose() {
  visibleFlag.value = false
  Object.assign(form, formDefault)
}

const formDefault = reactive({
  areaProjectCode: undefined,
  id: undefined,
  name: undefined,
  sortKey: undefined,
  remark: undefined
})

const rules = reactive<FormRules>({
  name: [{ required: true, message: '请填写服务包名称', trigger: 'change' }],
  sortKey: [{ required: true, message: '请填写排序码', trigger: 'change' }]
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
    if (!form.id) {
      await saveOtherPacket(form)
    } else {
      await updateOtherPacket(form)
    }
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
.el-upload__tip {
  color: #ccc;
}
</style>
