<template>
  <el-dialog destroy-on-close v-model="visibleFlag" title="每单补贴规则设置" width="500px" @close="onClose" :close-on-press-escape="false" :close-on-click-modal="false">
    <el-form ref="formRef" :model="form" label-width="120px">
      <el-form-item label="每单补贴上限">
        <el-space>
          <el-input-number style="width: 265px" :controls="false" :min="1" :max="999.99" :precision="2" v-model="form.subsidyAmount" placeholder="1~999.99" />
          元
        </el-space>
      </el-form-item>
      <el-form-item label="补贴次数限制">
        <el-space>
          每日不超过
          <el-input-number style="width: 185px" :controls="false" :min="1" :max="99" :precision="0" v-model="form.subsidyFreday" placeholder="1~99" />
          次
        </el-space>
      </el-form-item>
      <el-form-item>
        <el-space>
          每周不超过
          <el-input-number style="width: 185px" :controls="false" :min="1" :max="99" :precision="0" v-model="form.subsidyFremonth" placeholder="1~99" />
          次
        </el-space>
      </el-form-item>
      <el-form-item>
        <el-space>
          每月不超过
          <el-input-number style="width: 185px" :controls="false" :min="1" :max="99" :precision="0" v-model="form.subsidyFreweek" placeholder="1~99" />
          次
        </el-space>
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

const emits = defineEmits(['reload-list'])

const visibleFlag = ref(false)

const loading = ref(false)

const show = async (data) => {
  visibleFlag.value = true
  form.subsidyAmount = data.subsidyAmount
  form.subsidyFreday = data.subsidyFreday
  form.subsidyFremonth = data.subsidyFremonth
  form.subsidyFreweek = data.subsidyFreweek
}

function onClose() {
  Object.assign(form, formDefault)
  visibleFlag.value = false
}

const formDefault = reactive({
  subsidyAmount: undefined,
  subsidyFreday: undefined,
  subsidyFremonth: undefined,
  subsidyFreweek: undefined
})

let form = reactive({ ...formDefault })

const formRef = ref()

const onSubmit = async () => {
  emits('reload-list', form)
  ElMessage.success('操作成功')
  onClose()
}

defineExpose({
  show
})
</script>
<style scoped lang="less">
:deep(.el-dialog__body) {
  padding-top: 10px !important;
}
:deep(.el-input-group__prepend) {
  background: none !important;
  border: 0 !important;
  box-shadow: none !important;
  padding: 0 40px 0 0 !important;
  color: #666462;
}
:deep(.el-input-number .el-input__inner) {
  text-align: left;
}
</style>
