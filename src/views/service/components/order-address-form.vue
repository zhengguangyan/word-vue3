<template>
  <el-dialog v-model="visibleFlag" :title="form.id ? '修改联系地址' : '新增联系地址'" width="574px" :close-on-press-escape="false" :close-on-click-modal="false" destroy-on-close @close="onClose">
    <el-form ref="formRef" :model="form" label-width="100px" :rules="rules">
      <el-form-item label="联系人名称" prop="contactman">
        <el-input v-model="form.contactman" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="联系电话" prop="mobilephone">
        <el-input v-model="form.mobilephone" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="详细地址" prop="addressList">
        <Cascader class="mr-2" placeholder="省份-城市-区县-街道-社区" v-model="form.addressList" />
      </el-form-item>
      <el-form-item label="小区">
        <el-input v-model="form.village" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="详细地址" prop="detail">
        <el-input v-model="form.detail" placeholder="请输入" />
      </el-form-item>
      <el-checkbox v-model="form.acquiescent" label="设为默认联系人信息" size="large" />
    </el-form>
    <!-- 联系人信息，已支付、派单中、已接单状态，修改订单联系人信息，需显示提示语 -->
    <div v-if="form.id && ['2', '3', '5'].includes(orderStatus)" class="tip r-m-t-10 r-m-b-20">注意：修改联系人信息前，请先与对应的服务人员、服务商确认，再修改！</div>
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
import Cascader from '/@/components/Cascader/index.vue'
import { saveMemberAddress, updateMemberAddress } from '@/api/order'

const emits = defineEmits(['reload-list'])

const props = defineProps({
  memberid: {
    type: Number,
    default: null
  },
  orderStatus: {
    type: String,
    default: ''
  }
})

const visibleFlag = ref(false)

const loading = ref(false)

function show(data) {
  if (data) {
    Object.assign(form, data)
    form.addressList = [form.province, form.city, form.county, form.street, form.community]
  }
  form.memberid = props.memberid
  visibleFlag.value = true
}

function onClose() {
  visibleFlag.value = false
  Object.assign(form, formDefault)
}

const formDefault = reactive({
  id: undefined,
  memberid: undefined,
  contactman: undefined,
  mobilephone: undefined,
  village: undefined,
  addressList: [],
  acquiescent: false,
  detail: undefined
})

const rules = reactive<FormRules>({
  contactman: [
    {
      required: true,
      pattern: /^[\u4e00-\u9fa5a-zA-Z0-9]{1,20}$/,
      message: '请输入20位以内的汉字、数字、字母',
      trigger: 'blur'
    }
  ],
  mobilephone: [
    {
      required: true,
      pattern: /^\d{3,11}$/,
      message: '请输入3-20位纯数字，固话请加上区号',
      trigger: 'blur'
    }
  ],
  detail: [{ required: true, message: '请填写详情地址', trigger: 'blur' }],
  addressList: [{ required: true, message: '请选择详细地址', trigger: 'change' }]
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
      await saveMemberAddress(form)
    } else {
      await updateMemberAddress(form)
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
