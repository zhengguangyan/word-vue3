<template>
  <el-dialog v-model="visibleFlag" :title="form.id ? '编辑联动' : '新增联动'" width="500px" :close-on-press-escape="false" :close-on-click-modal="false" destroy-on-close @close="onClose">
    <el-form ref="formRef" :model="form" label-width="100px" :rules="rules">
      <el-form-item label="联动编号" prop="linkageNo" v-if="form.id">
        {{ form.linkageNo }}
      </el-form-item>
      <el-form-item label="创建时间" prop="createTime" v-if="form.id"> {{ form.createTime }} {{ form.creatorName }} </el-form-item>
      <el-form-item label="更新时间" prop="updateTime" v-if="form.id">
        {{ form.updateTime || form.createTime }}
        {{ form.updaterName || form.creatorName }}
      </el-form-item>
      <el-form-item label="联动名称" prop="linkageName">
        <el-input v-model="form.linkageName" placeholder="请输入20位以内的汉字、数字、字母" maxlength="20" show-word-limit :disabled="form.id" />
      </el-form-item>
      <el-form-item label="联系电话" prop="phone">
        <el-input v-model="form.phone" placeholder="请输入3-20位纯数字，固话请加上区号" :disabled="form.id" />
      </el-form-item>
      <el-form-item label="详情内容" prop="details">
        <el-input v-model="form.details" placeholder="请输入详情内容" :rows="3" type="textarea" maxlength="300" show-word-limit />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="onClose">取消</el-button>
        <el-button type="primary" @click="onSubmit" :loading="loading">确认</el-button>
      </span>
      <div class="el-upload__tip" v-if="!form.id">
        <p>
          <Icon icon="ant-design:exclamation-circle-outlined" style="vertical-align: top; color: var(--el-color-primary)" />
          若要自动关联通话录音，请在通话挂断后再点击添加（录音在通话挂断后才会生成），通话挂断前点击添加，关联的录音将不正确！
        </p>
      </div>
    </template>
  </el-dialog>
</template>
<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { ElMessage, FormRules } from 'element-plus'
import { saveLinkage, updateLinkage } from '@/api/linkage/index'

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
  linkageName: undefined,
  phone: undefined,
  details: undefined
})

const rules = reactive<FormRules>({
  linkageName: [
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
  ],
  details: [{ required: true, message: '请填写详情内容', trigger: 'blur' }]
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
      await saveLinkage(form)
    } else {
      await updateLinkage(form)
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
