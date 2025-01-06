<template>
  <el-dialog v-model="visibleFlag" title="平台审核" width="500px" :close-on-press-escape="false" :close-on-click-modal="false" destroy-on-close @close="onClose">
    <div class="w-280px m-auto">
      <p>
        <el-button type="primary" size="large" class="w-full" @click="handleAudit(7)"> 通过 </el-button>
      </p>
      <p class="my-20px">
        <el-button type="danger" size="large" class="w-full" @click="handleAudit(8)"> 不通过 </el-button>
      </p>
      <el-button size="large" class="w-full" @click="handleAudit(10)">此单作废</el-button>
    </div>
  </el-dialog>
  <el-dialog v-model="visibleAudit" title="审核结果" width="500px" :close-on-press-escape="false" :close-on-click-modal="false" destroy-on-close @close="onAuditClose">
    <div v-if="form.status === 7" class="tip"> 审核通过后，该订单将变为“已通过”状态，且不可修改状态。是否确 认审核通过? </div>
    <el-form v-else ref="formRef" :model="form" label-width="100px" :rules="rules">
      <el-form-item :label="`${form.status === 8 ? '未通过' : '作废'}原因`" prop="reason">
        <el-input v-model="form.reason" placeholder="请输入" :rows="3" type="textarea" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="onAuditClose">取消</el-button>
        <el-button type="primary" :loading="loading" @click="onSubmit">
          {{ form.status === 7 ? '通过' : '确认' }}
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { ElMessage, FormRules } from 'element-plus'
import { updateStatus } from '@/api/serviceStaffAPP'
import { resetQueryForm } from '@/utils'

const emits = defineEmits(['reload'])

const visibleFlag = ref(false)
const visibleAudit = ref(false)

const loading = ref(false)

function show(data) {
  form.id = data.id
  visibleFlag.value = true
}

const handleAudit = (status: number) => {
  visibleFlag.value = false
  visibleAudit.value = true
  form.status = status
}

function onClose() {
  visibleFlag.value = false
}

function onAuditClose() {
  visibleFlag.value = false
  visibleAudit.value = false
  resetQueryForm(form, {})
}

const formDefault = reactive({})

const rules = reactive<FormRules>({
  reason: [{ required: true, message: '请填写原因', trigger: 'change' }]
})

let form = reactive<any>({ ...formDefault })

const formRef = ref()

const onSubmit = async () => {
  loading.value = true
  if (form.status === 7) {
    save()
    return
  }
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
    await updateStatus(form)
    ElMessage.success('操作成功')
    emits('reload')
    onAuditClose()
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
