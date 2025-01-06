<template>
  <el-dialog v-model="visibleFlag" title="修改共同服务人员" width="600px" :close-on-press-escape="false" :close-on-click-modal="false" destroy-on-close @close="onClose">
    <el-form ref="formRef" :model="form" label-width="140px" :rules="rules">
      <el-form-item label="共同服务人员(内部)" prop="serveCategoryName">
        <div class="w-full flex">
          <el-input class="r-m-r-8" v-model="form.internalOperatorNames" disabled />
          <el-button link type="primary" @click="showStaffSelect">选择</el-button>
        </div>
      </el-form-item>
      <el-form-item label="外部服务人员" prop="externalOperatorNames">
        <el-input v-model="form.externalOperatorNames" placeholder="多人请用英文逗号分隔，最多10人" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="onClose">取消</el-button>
        <el-button type="primary" :loading="loading" @click="onSubmit">确认</el-button>
      </span>
    </template>
  </el-dialog>

  <ServiceStaffSelectDialog ref="serviceStaffSelectDialogRef" @change="serviceStaffChange" />
</template>
<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { ElMessage, FormRules } from 'element-plus'
import { updateEndInfo } from '@/api/serviceStaffAPP'
import { resetQueryForm } from '@/utils'
import ServiceStaffSelectDialog from '../service-staff-select-dialog/index.vue'

interface User {
  id: number | string
  userName: string
}

const emits = defineEmits(['reload'])

const visibleFlag = ref(false)

const loading = ref(false)

function show(data) {
  form.id = data.id
  form.commonStaffName = data.commonStaffName || ''
  form.externalOperatorNames = data.externalOperatorNames || ''
  form.internalOperatorIds = data.internalOperatorIds
  form.internalOperatorNames = data.internalOperatorNames || ''
  form.workNumber = data.workNumber
  visibleFlag.value = true
}

function onClose() {
  visibleFlag.value = false
  resetQueryForm(form, {})
}

const formDefault = reactive({})

const rules = reactive<FormRules>({})

let form = reactive<any>({ ...formDefault })

const formRef = ref()

const onSubmit = async () => {
  loading.value = true
  await formRef.value.validate((valid) => {
    const arr = [form.internalOperatorNames, form.externalOperatorNames].filter((l) => l)
    form.commonStaffName = arr.join(',')
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
    await updateEndInfo(form)
    ElMessage.success('操作成功')
    emits('reload')
    onClose()
  } finally {
    loading.value = false
  }
}

const serviceStaffSelectDialogRef = ref()
const showStaffSelect = () => {
  const list: User[] = []
  const names = form.internalOperatorNames ? form.internalOperatorNames.split(',') : []
  form.internalOperatorIds
    .split(',')
    .filter((l) => l)
    .forEach((item, index) => {
      list.push({ id: item, userName: names[index] })
    })
  serviceStaffSelectDialogRef.value.show(list)
}

const serviceStaffChange = (list: User[]) => {
  form.internalOperatorIds = list.map((l) => l.id).join(',')
  form.internalOperatorNames = list.map((l) => l.userName).join(',')
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
