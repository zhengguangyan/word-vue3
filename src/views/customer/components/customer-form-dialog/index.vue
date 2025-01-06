<template>
  <el-dialog v-model="visibleFlag" width="500px" :close-on-press-escape="false" :close-on-click-modal="false" destroy-on-close append-to-body>
    <template #header>
      <div>
        新增客户
        <el-tooltip class="box-item" effect="dark" placement="right-start">
          <template #content>
            提示：<br />
            在本页面创建新用户<br />
            1、是否健在，默认为“是”；<br />
            2、类型，默认为“平台”；<br />
            3、证件类型，默认为“身份证”；<br />
            4、证件有效期，默认为“长期有效”；<br />
            5、是否正常服务，默认为“是”；<br />
            如需修改，请在保存成功后，前往【编辑客户信息】页修改；
          </template>
          <Icon icon="ant-design:question-circle-outlined" style="vertical-align: middle; color: var(--el-color-primary)" />
        </el-tooltip>
      </div>
    </template>
    <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
      <el-form-item label="客户姓名" prop="name">
        <el-input v-model="form.name" placeholder="请输入客户姓名，可以是汉字、字母" maxlength="10" show-word-limit />
      </el-form-item>
      <el-form-item label="客户性别" prop="sex">
        <el-radio-group v-model="form.sex">
          <el-radio v-for="item in filterDict('vols_sex')" :key="item.value" :label="item.value">{{ item.label }}</el-radio>
          <!-- <el-radio label="2">女</el-radio> -->
        </el-radio-group>
      </el-form-item>
      <el-form-item label="证件类型" prop="idType">
        <el-select v-model="form.idType" style="width: 100%" placeholder="证件类型" clearable @change="changeIdType">
          <el-option v-for="item in filterDict('document_type')" :key="(item as any).value" :value="(item as any).value" :label="(item as any).label" />
        </el-select>
      </el-form-item>
      <el-form-item label="证件号码" prop="idcard" v-if="form.idType">
        <el-input v-model="form.idcard" placeholder="请输入证件号码" @blur="checkIdcard" />
      </el-form-item>
      <el-form-item label="联系电话" prop="mobilephone">
        <el-input v-model="form.mobilephone" placeholder="请输入11位手机号码或11-12位固定电话" @change="checkMobilephone" />
        <!-- <p class="form-item-alert">如有多个号码以英文逗号“,”隔开</p> -->
      </el-form-item>
      <el-form-item label="备注">
        <el-input v-model="form.remark" type="textarea" :rows="3" placeholder="请输入特殊情况填写备注内容，如：三无老人，联系电话为邻居，腿脚不便等" show-word-limit maxlength="50" />
      </el-form-item>
      <el-form-item label="" prop="saturationLevel">
        <el-checkbox label="是否纳入饱和度计算" v-model="form.saturationLevelBoolean" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="onClose">取消</el-button>
        <el-button type="primary" @click="onSubmit" :loading="loading">确认</el-button>
      </span>
    </template>
  </el-dialog>
  <el-dialog v-model="visiblePhone" title="联系电话重复提醒" width="800px" center @close="closePhone" :close-on-press-escape="false" :close-on-click-modal="false">
    <p style="margin-bottom: 5px"> 电话号码 {{ form.mobilephone }} 已有 {{ phoneMsg.length }} 位客户，请选择已有客户或创建新客户 </p>
    <el-table :data="phoneMsg" header-row-class-name="table-header" style="max-height: calc(100vh - 500px); margin-bottom: 5px">
      <el-table-column fixed="left" label="操作" width="70">
        <template #default="{ row }">
          <el-button link type="primary" @click="detail(row)">查看</el-button>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip prop="name" label="姓名" width="100" />
      <el-table-column show-overflow-tooltip prop="sex" label="性别" width="100">
        <template #default="{ row }">
          <span v-if="row.sex == '1'">男</span>
          <span v-else-if="row.sex == '2'">女</span>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip prop="mobilephone" label="联系电话" width="160" />
      <el-table-column show-overflow-tooltip prop="saturationNumber" label="饱和度" width="100">
        <template #default="{ row }"> {{ row.saturationNumber || 0 }} % </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip prop="visitnumber" label="拜访数" width="100" />
      <el-table-column show-overflow-tooltip prop="workSum" label="工单数" width="100" />
      <el-table-column show-overflow-tooltip prop="orderSum" label="订单数" width="100" />
      <el-table-column show-overflow-tooltip prop="careSum" label="关怀数" width="100" />
      <el-table-column show-overflow-tooltip prop="serviceSum" label="服务包数" width="100" />
      <el-table-column show-overflow-tooltip prop="finalContactTime" label="最后联系时间" width="170">
        <template #default="{ row }">
          {{ formatDateString(row.finalContactTime) }}
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip prop="currentAllAddress" label="现居地址" width="350" />
      <el-table-column show-overflow-tooltip prop="remark" label="备注" width="300" />
    </el-table>
    <div class="mt-10px mb-20px">
      <el-pagination
        v-model:current-page="phonePage.pageNum"
        v-model:page-size="phonePage.pageSize"
        :page-sizes="[10, 20, 50, 100, 200, 500]"
        layout="total, prev, pager, next"
        :total="phonePage.total"
        @current-change="checkMobilephone"
      />
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="clearPhone">清空号码</el-button>
        <el-button type="primary" @click="closePhone">忽略提示</el-button>
      </span>
    </template>
  </el-dialog>
  <CustomerExistDialog :existId="existId" ref="customerExistDialogRef" @on-close="onClose" />
  <PhoneNumberExistDialog ref="phoneNumberExistDialogRef" />
</template>
<script lang="ts" setup>
import { ref, reactive } from 'vue'
import type { FormRules } from 'element-plus'
import { ElMessage, ElMessageBox } from 'element-plus'
import { saveCustomerInfo, getMobilephone } from '@/api/customer/index'
import CustomerExistDialog from '../customer-exist-dialog/index.vue'
import PhoneNumberExistDialog from '../phone-number-exist-dialog/index.vue'
import { useCache } from '@/hooks/web/useCache'
import { checkIdcard, formatDateString } from '@/utils'
import { useRouter } from 'vue-router'
const { wsCache } = useCache()
const { push } = useRouter()

const props = defineProps({
  dict: {
    type: Array,
    default: null
  }
})
const loading = ref(false)

const filterDict = (key: any) => {
  return (props.dict.find((item: any) => item.type == key) as any)?.list
}

const changeIdType = () => {
  form.idcard = ''
}

const emits = defineEmits(['reload-list'])

const visibleFlag = ref(false)

const visiblePhone = ref(false)

const phoneMsg = ref<any>([])

const clearPhone = () => {
  form.mobilephone = ''
  closePhone()
}

const closePhone = () => {
  phoneMsg.value = []
  phonePage.value.pageNum = 1
  visiblePhone.value = false
}

function detail(row) {
  push(`/customer/detail?id=${row.id}`)
}

function show() {
  Object.assign(form, formDefault)
  visibleFlag.value = true
}

function onClose() {
  Object.assign(form, formDefault)
  visibleFlag.value = false
}

const formDefault = reactive({
  areaProjectCode: '',
  areaCode: '',
  name: '',
  sex: '',
  idType: '1',
  idcard: '',
  mobilephone: '',
  saturationLevelBoolean: true,
  saturationLevel: 1,
  remark: ''
})

let form = reactive({ ...formDefault })

const formRef = ref()

const customerValidate = (rule: any, _value: any, callback: any) => {
  if (!form.idcard && !form.mobilephone) {
    callback(new Error('证件号码和手机号必须填一个'))
  } else {
    if (rule.field === 'idcard' && form.idcard && form.idType == '1') {
      let reg =
        /^\d{6}((((((19|20)\d{2})(0[13-9]|1[012])(0[1-9]|[12]\d|30))|(((19|20)\d{2})(0[13578]|1[02])31)|((19|20)\d{2})02(0[1-9]|1\d|2[0-8])|((((19|20)([13579][26]|[2468][048]|0[48]))|(2000))0229))\d{3})|((((\d{2})(0[13-9]|1[012])(0[1-9]|[12]\d|30))|((\d{2})(0[13578]|1[02])31)|((\d{2})02(0[1-9]|1\d|2[0-8]))|(([13579][26]|[2468][048]|0[048])0229))\d{2}))(\d|X|x)$/
      // 34052419800101001X 513701930509101
      if (!reg.test(form.idcard)) {
        callback(new Error('请输入正确的证件号码'))
      }
    }
    if (rule.field === 'mobilephone' && form.mobilephone) {
      // let reg = /^(?:(?:\+|00)86)?1\d{10}(?:,(?:(?:\+|00)86)?1\d{10})*$/
      let reg = /^(1[3-9]\d{9}|0\d{2,3}-\d{7,8}|0\d{2,3}\d{7,8})$/ // 匹配手机号码或固定电话
      if (!reg.test(form.mobilephone)) {
        callback(new Error('请输入正确的手机号码或固定电话'))
      }
    }
    formRef.value?.clearValidate(['idcard', 'mobilephone'])
    callback()
  }
}

const rules = reactive<FormRules>({
  name: [
    {
      required: true,
      pattern: /^[\u4e00-\u9fa5a-zA-Z]{1,15}$/,
      message: '请输入正确姓名',
      trigger: 'blur'
    }
  ],
  sex: [{ required: true, message: '请选择性别', trigger: 'change' }],
  idcard: [
    {
      required: true,
      validator: customerValidate,
      trigger: 'blur'
    }
  ],
  saturationLevel: [{ required: true, message: '是否纳入饱和度计算' }],
  mobilephone: [
    {
      required: true,
      validator: customerValidate,
      trigger: 'blur'
    }
  ],
  remark: [{ max: 50, message: '备注最多只能50个字', trigger: 'blur' }]
})

const phoneNumberExistDialogRef = ref()

async function onSubmit() {
  try {
    await formRef.value.validate()
    save()
  } catch (err) {
    ElMessage.error('参数验证错误，请仔细填写表单数据!')
    return
  }
}

const customerExistDialogRef = ref()

const existId = ref()

async function save() {
  try {
    loading.value = true
    form.saturationLevel = form.saturationLevelBoolean ? 1 : 0
    form.areaProjectCode = wsCache.get('areaProjectCode')
    form.areaCode = wsCache.get('areaCode')
    let result: any = await saveCustomerInfo(form)
    if (result.msg == '客户已存在') {
      existId.value = result.data
      customerExistDialogRef.value.show()
      // onClose()
      return
    }
    emits('reload-list')
    ElMessageBox.confirm('新增客户成功', '提示', {
      confirmButtonText: '编辑客户信息',
      cancelButtonText: '新增服务',
      closeOnClickModal: false,
      closeOnPressEscape: false,
      distinguishCancelAndClose: true,
      type: 'success'
    })
      .then(() => {
        onClose()
        push(`/customer/edit?id=${result.data}`)
      })
      .catch((action) => {
        if (action === 'cancel') {
          if (form.mobilephone) {
            onClose()
            push(`/service/add?serviceType=consult&phone=${form.mobilephone}&id=${result.data}`)
            return
          }
          onClose()
          push(`/service/add?serviceType=consult`)
          return
        }
        onClose()
      })
    // ElMessage.success('添加成功')
    // push(`/customer/detail?id=${result.data}`)
    // onClose()
  } finally {
    // ElMessage.error(err.message)
    loading.value = false
  }
}

const phonePage = ref({
  pageNum: 1,
  pageSize: 5,
  total: 0
})
const checkMobilephone = async () => {
  if (!form.mobilephone) return
  const pattern = /^(1[3-9]\d{9}|0\d{2,3}-\d{7,8}|0\d{2,3}\d{7,8})$/
  const isValid = pattern.test(form.mobilephone)
  if (isValid) {
    const res: any = await getMobilephone({
      mobilephone: form.mobilephone,
      ...phonePage.value
    })
    if (res.data.list.length) {
      phoneMsg.value = res.data.list
      phonePage.value.total = res.data.total
      visiblePhone.value = true
    }
  }
}
defineExpose({
  show
})
</script>
<style>
.form-item-alert {
  font-size: 12px;
  color: #ccc;
}
</style>
