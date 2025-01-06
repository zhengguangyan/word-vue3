<template>
  <el-dialog v-model="visibleFlag" :title="form.id ? '编辑联动号码' : '新增联动号码'" width="500px" :close-on-press-escape="false" :close-on-click-modal="false" destroy-on-close @close="onClose">
    <el-form ref="formRef" :model="form" label-width="100px" :rules="rules">
      <el-form-item label="联系电话" prop="phone">
        <el-input v-model="form.phone" placeholder="请输入3-20位纯数字，固话请加上区号" />
      </el-form-item>
      <el-form-item label="名称" prop="phoneName">
        <el-input v-model="form.phoneName" maxlength="20" show-word-limit placeholder="请输入20位以内的汉字、数字、字母" />
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
import { saveLinkagePhone, updateLinkagePhone } from '@/api/linkage/index'

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
  phoneName: undefined,
  phone: undefined
})

const rules = reactive<FormRules>({
  phoneName: [
    {
      required: true,
      pattern: /^[\u4e00-\u9fa5a-zA-Z0-9]{1,20}$/,
      message: '请输入20位以内的汉字、数字、字母',
      trigger: 'blur'
    }
  ],
  phone: [
    {
      required: true,
      pattern: /^\d{3,11}$/,
      message: '请输入3-20位纯数字，固话请加上区号',
      trigger: 'blur'
    }
  ]
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
      await saveLinkagePhone(form)
    } else {
      await updateLinkagePhone(form)
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
