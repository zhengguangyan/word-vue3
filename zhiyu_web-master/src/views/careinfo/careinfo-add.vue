<template>
  <el-page-header title="" @back="onBack">
    <template #content> 新增关怀 </template>
  </el-page-header>
  <el-form ref="formRef" :model="careinfo" label-width="100px" :rules="rules">
    <h4 class="title" style="margin: 20px 0 16px; font-weight: 600">客户信息</h4>
    <el-form-item v-if="isAdd" label="联系电话" prop="phone">
      <el-select
        v-model="careinfo.phone"
        filterable
        remote
        placeholder="请输入电话号码"
        no-data-text="未搜索到关联用户，请重新输入"
        :remote-method="getCustomerList"
        style="width: 250px"
        @change="handleCustomerChange"
      >
        <el-option v-for="item in customerList" :key="item.id" :label="item.mobilephone" :value="item.mobilephone">
          <span>{{ item.name }}: {{ item.mobilephone }}</span>
        </el-option>
      </el-select>
      <a class="change-button" @click="changeAdd">添加新客户</a>
    </el-form-item>
    <el-form-item v-else label="联系电话" prop="phone">
      <el-input v-model="careinfo.phone" placeholder="请输入电话号码" style="width: 250px" />
      <a class="change-button" @click="changeAdd">查询旧客户</a>
    </el-form-item>
    <el-row v-if="currentCustomer && isAdd">
      <el-col :span="8">
        <el-form-item label="客户姓名" class="inline-form-item">
          <span v-if="currentCustomer.name">{{ currentCustomer.name }}</span>
          <!-- <span v-else class="unchecked">暂未填写</span> -->
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="性别" class="inline-form-item">
          <span v-if="currentCustomer.sex">{{ renderDict(currentCustomer.sex, 'vols_sex') }}</span>
          <!-- <span v-else class="unchecked">暂未填写</span> -->
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="是否纳入饱和度计算" label-width="140px" class="inline-form-item">
          {{ currentCustomer.saturationLevel == 1 ? '是' : '否' }}
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="服务对象来源" label-width="97px" class="inline-form-item">
          <span v-if="currentCustomer.serviceObjSource">{{ renderDict(currentCustomer.serviceObjSource, 'service_obj_source') }}</span>
          <!-- <span v-else class="unchecked">暂未选择</span> -->
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="备注" class="inline-form-item">
          <span v-if="currentCustomer.remark">{{ currentCustomer.remark }}</span>
          <!-- <span v-else class="unchecked">暂未填写</span> -->
        </el-form-item>
      </el-col>
    </el-row>
    <el-form v-if="!isAdd" ref="addFormRef" :model="addForm" label-width="95px" :rules="addRules">
      <el-form-item label="客户姓名" class="inline-form-item" prop="name">
        <el-input v-model="addForm.name" placeholder="请输入客户姓名" style="width: 250px" />
      </el-form-item>
      <el-form-item label="性别" label-width="60px" class="inline-form-item" prop="sex">
        <el-radio-group v-model="addForm.sex">
          <el-radio value="1">男</el-radio>
          <el-radio value="2">女</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="是否纳入饱和度计算" label-width="150px" class="inline-form-item" prop="saturationLevel">
        <el-radio-group v-model="addForm.saturationLevel">
          <el-radio :value="1">是</el-radio>
          <el-radio :value="0">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="服务对象来源" label-width="97px">
        <DictSelect style="width: 250px" v-model="addForm.serviceObjSource" placeholder="请选择服务对象来源(多选)" :distList="filterDict('service_obj_source')" />
      </el-form-item>
      <el-form-item label="备注">
        <el-input
          style="max-width: 766px"
          v-model="addForm.remark"
          type="textarea"
          :rows="3"
          placeholder="请输入特殊情况填写备注内容，如：三无老人，联系电话为邻居，腿脚不便等"
          show-word-limit
          maxlength="50"
        />
      </el-form-item>
      <el-form-item>
        <el-button style="margin-left: 95px" type="primary" @click="saveCustomer" :loading="adding">添加新客户</el-button>
      </el-form-item>
    </el-form>
    <h4 class="title" style="margin: 40px 0 16px; font-weight: 600">服务信息</h4>
    <el-form-item label="服务类型">
      <el-radio-group disabled v-model="type">
        <el-radio :value="0">咨询</el-radio>
        <el-radio :value="1">投诉</el-radio>
        <el-radio :value="3">订单</el-radio>
        <el-radio :value="2">关怀</el-radio>
        <el-radio :value="4">套餐</el-radio>
        <el-radio :value="5">会员卡</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="归属项目" prop="belongProjectType">
      <el-select v-model="careinfo.belongProjectType" placeholder="请选择项目" style="width: 250px">
        <el-option v-for="item in filterDict('project_type')" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
    </el-form-item>
    <el-form-item label="归属项目名称" prop="belongProjectid" v-if="careinfo.belongProjectType == 2">
      <el-select v-model="careinfo.belongProjectid" placeholder="请选择归属项目名称" style="width: 250px">
        <el-option v-for="item in filterDict('belong_project')" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
    </el-form-item>
    <el-form-item label="关怀内容" prop="careContent">
      <el-input v-model="careinfo.careContent" type="textarea" style="max-width: 766px" maxlength="1500" show-word-limit />
    </el-form-item>
    <el-form-item label="备注">
      <el-input v-model="careinfo.careComment" type="textarea" style="max-width: 766px" maxlength="300" show-word-limit />
    </el-form-item>
    <el-form-item label="是否结案" prop="isClosed">
      <el-radio-group v-model="careinfo.isClosed">
        <el-radio :value="1">是</el-radio>
        <el-radio :value="0">否</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="是否接通" prop="isConnect">
      <el-radio-group v-model="careinfo.isConnect" @change="changeIsCon">
        <el-radio :value="1">是</el-radio>
        <el-radio :value="0">否</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="是否空号" prop="isEmptynumber" v-if="careinfo.isConnect == 0">
      <el-radio-group v-model="careinfo.isEmptynumber">
        <el-radio :value="1">是</el-radio>
        <el-radio :value="0">否</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="回访日期">
      <el-date-picker value-format="YYYY-MM-DD HH:mm:ss" v-model="careinfo.reserveTime" type="date" />
      <el-checkbox v-model="careinfo.isReturnMe" label="由我访问" style="margin-left: 20px" />
    </el-form-item>
    <h4 class="title" style="margin: 40px 0 16px; font-weight: 600">历史关怀</h4>
    <el-table
      :data="historyCareinfoList"
      header-row-class-name="table-header"
      :style="{
        width: 'calc(100vw - 255px)',
        border: '1px solid #f5f3f0',
        borderRadius: '8px'
      }"
      max-height="200"
    >
      <el-table-column type="index" />
      <el-table-column label="操作" width="100">
        <template #default="{ row }">
          <el-button link type="primary" size="small" @click="detail(row)"> 查看 </el-button>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip prop="careNo" min-width="160" label="关怀编号" />
      <el-table-column show-overflow-tooltip prop="createTime" min-width="170" label="外呼时间" />
      <el-table-column show-overflow-tooltip prop="returnUserName" min-width="160" label="归属客服" />
      <el-table-column show-overflow-tooltip prop="isClosed" min-width="100" label="是否结案">
        <template #default="{ row }">
          {{ row.isClosed !== 0 ? '是' : '否' }}
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip prop="reserveTime" min-width="170" label="预定关怀时间">
        <template #default="{ row }">
          {{ formatDateString(row.reserveTime) }}
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip prop="reserveUserName" min-width="180" label="预定关怀客服" />
    </el-table>
    <el-form-item style="margin-top: 20px">
      <el-button type="primary" @click="submit" :loading="saving">保存</el-button>
      <el-button @click="onBack"> 返回 </el-button>
    </el-form-item>
  </el-form>
</template>
<script lang="ts" setup>
import { saveCareinfo, getCareinfoList } from '@/api/careinfo'
import { getCustomerInfoByPhone, saveCustomerInfo } from '@/api/customer/index'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, FormRules } from 'element-plus'
import { reactive } from 'vue'
import { formatDateString } from '@/utils'
import DictSelect from '/@/components/DictSelect/index.vue'
import { filterDict, renderDict } from '@/hooks/web/useDict'

// @ts-ignore
defineOptions({
  name: 'Add'
})

const isAdd = ref(true)

const adding = ref(false)

// const verifyPhone = ref(false)

// const checkMobilephone = () => {
//   let reg = /^(1[3-9]\d{9}|0\d{2,3}-\d{7,8}|0\d{2,3}\d{7,8})$/ // 匹配手机号码或固定电话
//   if (!reg.test(careinfo.value.phone)) {
//     verifyPhone.value = true
//   } else {
//     verifyPhone.value = false
//   }
// }

const saveCustomer = async () => {
  adding.value = true
  try {
    let result: any = await saveCustomerInfo({
      ...addForm,
      mobilephone: careinfo.value.phone
    })
    if (result.msg == '客户已存在') {
      ElMessage.error(result.msg)
      return
    }
    ElMessage.success('添加成功')
    getCustomerList(careinfo.value.phone)
    setTimeout(() => {
      handleCustomerChange(careinfo.value.phone)
    }, 500)
    adding.value = false
    Object.assign(addForm, addDefault)
    isAdd.value = !isAdd.value
  } finally {
    // ElMessage.error(err.message)
    adding.value = false
  }
}

const changeAdd = () => {
  isAdd.value = !isAdd.value
  careinfo.value.phone = null
  currentCustomer.value = null
  Object.assign(addForm, addDefault)
}
const { push } = useRouter()

function onBack() {
  push('/careinfo/index')
}

function detail(row) {
  push(`/careinfo/detail?id=${row.id}`)
}

const saving = ref(false)

const type = ref(2)

const careinfo = ref<any>({})

const formRef = ref()

const addFormRef = ref()

const addDefault = reactive({
  name: undefined,
  sex: undefined,
  saturationLevel: 0,
  serviceObjSource: undefined,
  remark: undefined
})
let addForm = reactive({ ...addDefault })

const rules = reactive<FormRules>({
  phone: [
    {
      required: true,
      pattern: /^(1[3-9]\d{9}|0\d{2,3}-\d{7,8}|0\d{2,3}\d{7,8})$/,
      message: '请填写正确联系电话',
      trigger: 'blur'
    }
  ],
  belongProjectType: [{ required: true, message: '请选择所属项目', trigger: 'blur' }],
  careContent: [{ required: true, message: '请填写关怀内容', trigger: 'blur' }],
  isConnect: [{ required: true, message: '请选择是否接通', trigger: 'blur' }],
  isClosed: [{ required: true, message: '请选择是否接通', trigger: 'blur' }],
  isEmptynumber: [{ required: true, message: '请选择是否空号', trigger: 'blur' }]
})

const addRules = reactive<FormRules>({
  name: [
    {
      required: true,
      pattern: /^[\u4e00-\u9fa5a-zA-Z]{1,15}$/,
      message: '请填写客户姓名',
      trigger: 'blur'
    }
  ],
  sex: [{ required: true, message: '请选择性别', trigger: 'blur' }],
  saturationLevel: [{ required: true, message: '请选择是否纳入饱和度计算', trigger: 'blur' }]
})
const historyCareinfoList = ref([])

const customerList = ref<any>([])
const currentCustomer = ref<any>(null)
async function getCustomerList(phoneNumber) {
  if (!phoneNumber) {
    customerList.value = []
    return
  }
  let result = await getCustomerInfoByPhone(phoneNumber)
  customerList.value = result.data
}
async function handleCustomerChange(customer) {
  currentCustomer.value = customerList.value?.find((item: any) => item.mobilephone === customer)
  if (!currentCustomer.value) {
    return
  }
  careinfo.value.customerId = currentCustomer.value.id
  const result: any = await getCareinfoList({ customerId: careinfo.value.customerId })
  historyCareinfoList.value = result.data
}

const submit = async () => {
  await formRef.value.validate((valid) => {
    if (valid) {
      save()
    } else {
      ElMessage.error('请确认必填参数填写正确')
    }
  })
}

const save = async () => {
  saving.value = true
  try {
    const res: any = await saveCareinfo(careinfo.value)
    if (res.code == 200) {
      ElMessage.success('新增成功')
      onBack()
    }
    saving.value = false
  } catch (error) {
    saving.value = false
  }
}

const changeIsCon = (data) => {
  if (data) {
    careinfo.value.isEmptynumber = null
  }
}
</script>
<style scoped>
:deep(.el-descriptions__content.el-descriptions__cell.is-bordered-content) {
  width: 23%;
}
/* :deep(.el-descriptions__cell.el-descriptions__label.is-bordered-label) {
  width: 12%;
} */
:deep(.el-page-header__header) {
  padding-bottom: 11px;
  border-bottom: 1px solid #ebe9e6;
}
:deep(.el-form-item__label) {
  justify-content: flex-start;
  font-size: 14px;
}
:deep(.el-form-item__content) {
  margin-left: 0 !important;
}
.inline-form-item {
  display: inline-flex;
  vertical-align: middle;
  margin-right: 32px;
}
.title {
  display: flex;
  align-items: center;
}
.change-button {
  margin-left: 10px;
  cursor: pointer;
  color: var(--el-color-primary);
  &:hover {
    color: var(--el-color-primary-dark-2);
  }
}
</style>
