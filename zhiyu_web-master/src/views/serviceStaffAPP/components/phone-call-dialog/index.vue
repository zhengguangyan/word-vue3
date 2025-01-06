<template>
  <el-dialog v-model="visibleFlag" title="请选择回访电话" width="500px" :close-on-press-escape="false" :close-on-click-modal="false" destroy-on-close @close="onClose">
    <el-form ref="formRef" :model="form" :rules="rules" label-width="120px">
      <el-form-item label="服务对象号码" prop="mobilePhone">
        <div v-if="form.mobilePhone" class="flex-col">
          <div v-for="(item, index) in form.mobilePhone.split(',')" :key="index">
            <el-button type="primary" link @click="phoneCall(item)">{{ item }}</el-button>
          </div>
        </div>
      </el-form-item>
      <el-form-item label="服务人员号码" prop="operatorPhone">
        <div v-if="form.operatorPhone" class="flex-col">
          <div v-for="(item, index) in form.operatorPhone.split(',')" :key="index">
            <el-button type="primary" link @click="phoneCall(item)">{{ item }}</el-button>
          </div>
        </div>
        <!-- <el-button type="text" @click="phoneCall">{{ form.operatorPhone }}</el-button> -->
      </el-form-item>
      <el-form-item label="输入新号码" prop="phone">
        <div class="flex">
          <el-input v-model="form.phone" placeholder="请输入新号码" :maxlength="12" clearable></el-input>
          <el-button type="primary" @click="newPhoneCall" class="ml-10px">拨打新号码</el-button>
        </div>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { resetQueryForm } from '@/utils'

const emits = defineEmits(['reload'])

const visibleFlag = ref(false)

function show(data) {
  form.mobilePhone = data.mobilePhone
  form.operatorPhone = data.operatorPhone
  visibleFlag.value = true
}

function onClose() {
  visibleFlag.value = false
  resetQueryForm(form, {})
}

const phoneCall = (phone) => {
  ElMessage({
    message: '检测到你账号未分配工号,请联系运维!',
    type: 'error'
  })
}

const newPhoneCall = async () => {
  await formRef.value.validate((valid) => {
    if (valid) {
      phoneCall(form.phone)
    }
  })
}

const validatePhone = (rule: any, value: any, callback: any) => {
  const mobilePhoneList = form.mobilePhone ? form.mobilePhone.split(',') : []
  const operatorPhoneList = form.operatorPhone ? form.operatorPhone.split(',') : []
  const pattern = /^(1[3-9]\d{9}|(010|02[1-9]|0[3-9]\d{1,2})\d{7,8})$/
  if (!value) {
    callback(new Error('请输入新号码'))
  } else if (!pattern.test(value)) {
    callback(new Error('格式不正确，请修订后再拨打!'))
  } else if (mobilePhoneList.includes(String(value)) || operatorPhoneList.includes(String(value))) {
    callback(new Error('不可与上述已有号码重复!'))
  } else {
    callback()
  }
}

const formDefault = reactive({ phone: undefined })

let form = reactive<any>({ ...formDefault })

const rules = reactive({
  phone: [{ required: true, validator: validatePhone, trigger: 'blur' }]
})

const formRef = ref()

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
