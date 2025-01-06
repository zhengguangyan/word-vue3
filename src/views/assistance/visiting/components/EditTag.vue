<template>
  <el-dialog
    v-model="visible"
    append-to-body
    width="574px"
    class="edit-visiting-tag-dialog"
    title="添加拜访标签"
    :close-on-click-modal="false"
    draggable
    @close="handleCancel"
  >
    <!-- <h2 class="r-font-16 font-bold r-m-b-20">添加拜访标签</h2> -->
    <el-form class="r-m-b-20" :model="form" ref="formRef" :rules="formRules" hide-required-asterisk>
      <el-form-item prop="name">
        <span class="form-label">标签名称<span class="color999">(必填)</span></span>
        <el-input v-model="form.name" placeholder="请输入标签名称(不超过50个汉字)" maxlength="50" />
      </el-form-item>
      <div class="error-color r-font-12">注意：请确保填写的内容准确无误，添加后无法删除(删除可能会影响到标签统计)，如添加错误，可选择禁止启用该标签。</div>
    </el-form>
    <template #footer>
      <el-button plain @click="handleCancel">取消</el-button>
      <el-button type="primary" @click="handleConfirm">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ElLoading, ElMessage, FormInstance, FormRules } from 'element-plus'
import { reactive, ref } from 'vue'
import { addTag } from '@/api/assistance/tag'

const visible = ref(false)
const open = () => {
  visible.value = true
}
defineExpose({ open })

const form = reactive({
  name: ''
})
const formRules = reactive<FormRules>({
  name: { required: true, message: '请输入标签名称', trigger: 'blur' }
})

const formRef = ref<FormInstance>()
const emit = defineEmits(['loadData'])
const handleConfirm = () => {
  formRef.value?.validate(async val => {
    if (!val) return
    const loading = ElLoading.service({
      target: '.edit-visiting-tag-dialog',
      text: '保存中，请稍候...'
    })
    try {
      await addTag(form)
      loading.close()
      handleCancel()
      ElMessage.success('保存成功')
      emit('loadData', 'edit')
    } catch {
      loading.close()
    }
  })
}
const handleCancel = () => {
  formRef.value?.resetFields()
  visible.value = false
}
</script>

<style lang="less">
.edit-visiting-tag-dialog {
  .el-form-item__content {
    flex-wrap: nowrap;
  }
  .form-label {
    flex-shrink: 0;
    margin-right: 10px;
  }
  .el-form-item__error {
    padding-left: 105px;
  }
  .el-dialog__footer {
    padding-top: 20px;
  }
}
</style>
