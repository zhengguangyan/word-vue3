<template>
  <el-dialog v-model="visibleFlag" :title="title" width="500px" :close-on-press-escape="false" :close-on-click-modal="false" destroy-on-close @close="onClose">
    <el-form ref="formRef" :model="form" label-width="120px" :rules="rules">
      <template v-if="form.serveOptionId">
        <el-form-item label="服务类别" prop="serveCategoryName">
          <view class="w-full flex justify-between">
            <span>{{ form.serveCategoryName }}</span>
            <el-button link type="primary" @click="showProjectSelect"> 选择服务项目 </el-button>
          </view>
        </el-form-item>
        <el-form-item label="服务项目" prop="serveInfoName">
          <span>{{ form.serveInfoName }}</span>
        </el-form-item>
        <el-form-item label="服务子项" prop="serveOptionName">
          <span>{{ form.serveOptionName }}</span>
        </el-form-item>
      </template>
      <el-form-item v-else label="服务名称" prop="serveName">
        <span>{{ form.serveName }}</span>
      </el-form-item>
      <el-form-item label="项目金额(元)" prop="money">
        <el-input v-model.number="form.money" type="number" maxlength="6" placeholder="非必填,最高9999.99" />
      </el-form-item>
      <el-form-item label="项目数量" prop="count">
        <el-input v-model.number="form.count" type="number" maxlength="2" placeholder="0-99,数量和时长必选其一" />
      </el-form-item>
      <el-form-item label="项目时长(分钟)" prop="serveMinute">
        <el-input v-model.number="form.serveMinute" type="number" maxlength="3" placeholder="1-999,数量和时长必选其一填,最高9999.99" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="onClose">取消</el-button>
        <el-button type="primary" :loading="loading" @click="onSubmit">确认</el-button>
      </span>
    </template>
  </el-dialog>

  <ServiceProjectSelectDialog ref="serviceProjectSelectDialogRef" @change="serviceProjectChange" />
</template>
<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { ElMessage, FormRules } from 'element-plus'
import { updateServeItem } from '@/api/serviceStaffAPP'
import { resetQueryForm } from '@/utils'
import ServiceProjectSelectDialog from '../service-project-select-dialog/index.vue'

const emits = defineEmits(['reload'])

const visibleFlag = ref(false)

const loading = ref(false)
const title = ref('')

function show(data, t) {
  title.value = t
  Object.assign(form, data)
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
  if (!form.count && !form.serveMinute) {
    ElMessage.error('数量和时长必选其一')
    return
  }
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
    await updateServeItem(form)
    ElMessage.success('操作成功')
    emits('reload')
    onClose()
  } finally {
    loading.value = false
  }
}

const serviceProjectSelectDialogRef = ref()
const showProjectSelect = () => {
  serviceProjectSelectDialogRef.value.show()
}

const serviceProjectChange = (row) => {
  form.serveName = `${row.serveName}-${row.serveOptionName}`
  form.serveCategoryId = row.serveCategoryId
  form.serveCategoryName = row.serveCategoryName
  form.serveId = row.serveId
  form.serveInfoName = row.serveName
  form.serveOptionId = row.serveOptionId
  form.serveOptionName = row.serveOptionName
  form.money = row.price
  form.count = row.count
  form.serveMinute = row.serveMinute
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
