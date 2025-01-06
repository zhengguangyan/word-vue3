<template>
  <el-dialog
    v-model="visible"
    append-to-body
    width="574px"
    class="edit-custom-service-dialog"
    :close-on-click-modal="false"
    draggable
    @close="handleCancel"
  >
    <h2 class="r-font-16 font-bold r-m-b-20">添加{{ global ? '全局' : '' }}自定义项目</h2>
    <el-form :model="form" ref="formRef" :rules="formRules" hide-required-asterisk>
      <el-form-item prop="name">
        <span class="form-label">项目名称<span class="color999">(必填)</span></span>
        <el-input v-model="form.name" placeholder="请输入项目名称(不超过8个汉字)" maxlength="8" />
      </el-form-item>
      <el-form-item prop="showOnApp">
        <span class="form-label">是否在APP显示</span>
        <el-radio-group v-model="form.showOnApp">
          <el-radio :value="1">是</el-radio>
          <el-radio :value="0">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <div class="error-color r-font-12 mb-15px">
        <div>注意：</div>
        <div>
          <div class="flex col-top">
            <span>1、</span>
            <span>项目名称不支持字母、标点和空格</span>
          </div>
          <div class="flex col-top">
            <span>2、</span>
            <span
              >添加后项目名称无法再编辑，项目亦不可删除（如果制除会影响到数据统计），请确
              保填写的内容准确无误</span
            >
          </div>
          <div class="flex col-top">
            <span>3、</span>
            <span>添加“自定义项目”仅作为APP上快捷选项，无其他作用</span>
          </div>
          <div class="flex col-top font-bold" v-if="global">
            <span>4、</span>
            <span>全局项目添加后，将显示在所有分公司的自定义项目选项中，请谨慎添加</span>
          </div>
        </div>
      </div>
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
import { customServeSave } from '@/api/serviceStaffAPP/custom'

const visible = ref(false)
const global = ref(false)

const open = (isGlobal: boolean) => {
  visible.value = true
  global.value = isGlobal
}
defineExpose({ open })

const form = reactive({
  name: '',
  showOnApp: 1,
  sort: 0,
  areaCode: '',
  areaProjectCode: ''
})
const formRules = reactive<FormRules>({
  name: { required: true, message: '请输入项目名称', trigger: 'blur' }
})

const formRef = ref<FormInstance>()
const emit = defineEmits(['loadData'])
const handleConfirm = () => {
  formRef.value?.validate(async (val) => {
    if (!val) return
    const loading = ElLoading.service({
      target: '.edit-custom-service-dialog',
      text: '保存中，请稍候...'
    })
    try {
      form.areaCode = global.value ? '00' : ''
      form.areaProjectCode = global.value ? '00' : ''
      await customServeSave(form)
      loading.close()
      handleCancel()
      ElMessage.success('保存成功')
      emit('loadData')
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
.edit-custom-service-dialog {
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
