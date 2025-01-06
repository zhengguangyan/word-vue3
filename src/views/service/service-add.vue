<template>
  <el-page-header title="" @back="onBack">
    <template #content> 新增服务 </template>
  </el-page-header>
  <el-divider style="margin: 11px 0 20px" />
  <h4 class="title" style="margin: 20px 0 16px; font-weight: 600">
    客户信息
    <el-button class="customer-edit" type="primary" link @click="customerEdit" v-if="currentCustomer"> 完善客户信息 </el-button>
  </h4>
  <el-form ref="formRef" :model="phoneForm" :rules="phoneRules" label-width="102px">
    <!-- 新增或校验手机号之后的展示 -->
    <template v-if="!isAdd">
      <el-row>
        <el-col :span="8">
          <el-form-item class="inline-form-item" label="联系电话" prop="phoneNumber" style="width: 100%">
            <!-- <span v-if="currentCustomer" class="show-text" style="width: 100%">{{ phoneForm.phoneNumber }}</span> -->
            <el-input v-model="phoneForm.phoneNumber" style="width: 100%" placeholder="请输入电话号码" @keyup.enter="checkMobilephone" :disabled="currentCustomer" />
          </el-form-item>
        </el-col>

        <el-col :span="8">
          <div class="customer-tag" v-if="currentCustomer">老客户</div>
          <!-- <img
            v-if="currentCustomer && currentCustomer.mobilephone"
            class="r-m-l-28"
            src="@/assets/icon/phone-icon.png"
            alt="phone"
            width="24"
            height="24"
            style="display: inline-block"
          /> -->
          <el-button style="display: inline-block" v-if="!(currentCustomer && currentCustomer.mobilephone)" class="ml-2" type="primary" @click="checkMobilephone" :loading="adding">
            查询电话
          </el-button>
        </el-col>
      </el-row>
    </template>
    <template v-else>
      <el-form-item label="联系电话" prop="phoneNumber">
        <!-- <span class="show-text" style="width: 336px" v-if="currentCustomer">{{ phoneForm.phoneNumber }}</span> -->
        <el-input v-model="phoneForm.phoneNumber" placeholder="请输入电话号码" @blur="checkMobilephone" style="width: 336px" :disabled="currentCustomer" />
        <div class="customer-tag">新客户</div>
      </el-form-item>
    </template>
    <el-row v-if="currentCustomer">
      <el-col :span="8">
        <el-form-item label="客户姓名" class="inline-form-item" style="width: 100%">
          <span class="show-text" style="width: 100%" v-if="currentCustomer.name">{{ currentCustomer.name }}</span>
          <!-- <el-input style="width: 100%" v-if="currentCustomer.name" v-model="currentCustomer.name" :disabled="true"></el-input> -->
          <span v-else class="unchecked" style="width: 100%">暂未填写</span>
        </el-form-item>
      </el-col>
      <el-col :span="8" class="r-p-l-80">
        <el-form-item label="性别" class="inline-form-item">
          <el-radio-group v-if="currentCustomer.sex" v-model="currentCustomer.sex" disabled>
            <el-radio value="1">男</el-radio>
            <el-radio value="2">女</el-radio>
          </el-radio-group>
          <!-- <span v-if="currentCustomer.sex">{{ radioDict(currentCustomer.sex, 'vols_sex') }}</span> -->
          <span v-else class="unchecked">暂未填写</span>
        </el-form-item>
      </el-col>
      <el-col :span="8" class="r-p-l-80">
        <el-form-item label="是否纳入饱和度计算" label-width="140px" class="inline-form-item">
          <el-radio-group v-model="currentCustomer.saturationLevel" disabled>
            <el-radio :value="1">是</el-radio>
            <el-radio :value="0">否</el-radio>
          </el-radio-group>
          <!-- {{ currentCustomer.saturationLevel == 1 ? '是' : '否' }} -->
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="服务对象来源" class="inline-form-item" style="width: 100%">
          <span class="show-text" style="width: 100%" v-if="currentCustomer.serviceObjSource?.length">{{ renderDict(currentCustomer.serviceObjSource, 'service_obj_source') }}</span>
          <!-- <el-input style="width: 100%" v-if="currentCustomer.serviceObjSource?.length" :value="renderDict(currentCustomer.serviceObjSource, 'service_obj_source')" :disabled="true"></el-input> -->
          <span v-else class="unchecked">暂未选择</span>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="备注" class="inline-form-item" style="width: 100%">
          <span class="show-text" style="width: 100%" v-if="currentCustomer.remark">{{ currentCustomer.remark }}</span>
          <!-- <el-input type="textarea" style="width: 100%" v-if="currentCustomer.remark" :value="currentCustomer.remark" :disabled="true"></el-input> -->
          <span v-else class="unchecked">暂未填写</span>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
  <el-form v-if="!currentCustomer && isAdd" ref="addFormRef" :model="addForm" label-width="102px" :rules="addRules">
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
    <el-form-item label="服务对象来源">
      <DictSelect style="width: 250px" v-model="addForm.serviceObjSource" placeholder="请选择服务对象来源" :distList="filterDict('service_obj_source')" :multiple="true" :tags="1" />
    </el-form-item>
    <el-form-item label="备注">
      <el-input
        style="max-width: 766px"
        v-model="addForm.remark"
        type="textarea"
        :rows="3"
        placeholder="请输入特殊情况填写备注内容，如：三无老人，联系电话为邻居，腿脚不便等"
        show-word-limit
        maxlength="2000"
      />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="saveCustomer" :loading="adding"> 添加新客户 </el-button>
    </el-form-item>
  </el-form>

  <h4 class="title r-m-t-24" style="margin-bottom: 20px; font-weight: 600">服务信息</h4>
  <div class="service-type">
    <span class="form-title">服务类型</span>
    <el-radio-group v-model="serviceType">
      <el-radio-button value="consult"> 咨询 </el-radio-button>
      <el-radio-button value="complaint"> 投诉 </el-radio-button>
      <el-radio-button value="order"> 订单 </el-radio-button>
      <el-radio-button value="care"> 关怀 </el-radio-button>
    </el-radio-group>
  </div>
  <div v-if="currentCustomer && (serviceType == 'consult' || serviceType == 'complaint')">
    <WorksheetAddForm @clear-phone="clearPhone" :customerId="currentCustomer.id" :serviceType="serviceType" />
  </div>
  <div v-if="currentCustomer && serviceType == 'care'">
    <CareinfoAddForm @clear-phone="clearPhone" :customerId="currentCustomer.id" :serviceType="serviceType" />
  </div>
  <div v-if="currentCustomer && serviceType == 'order'">
    <OrderAddForm @clear-phone="clearPhone" :customerId="currentCustomer.id" :memberLevel="currentCustomer.memberLevel" :serviceType="serviceType" />
  </div>
  <el-dialog v-model="visiblePhone" title="客户查询" width="800px" center @close="closePhone" :close-on-press-escape="false" :close-on-click-modal="false">
    <p style="margin-bottom: 5px">
      电话号码 {{ phoneForm.phoneNumber }} 已有 {{ customerList.length }} 位客户，请选择已有客户或
      <a href="javascript:;" @click="handleCreateCustomer" style="color: var(--el-color-primary)"> 创建新客户 </a>
    </p>
    <el-table :data="customerList" header-row-class-name="table-header" style="max-height: calc(100vh - 500px); margin-bottom: 5px">
      <el-table-column fixed="left" label="操作" width="140">
        <template #default="{ row }">
          <el-button link type="primary" @click="detail(row)">查看</el-button>
          <el-button link type="primary" @click="handleCustomerChange(row.id)">选择客户</el-button>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip prop="name" label="姓名" width="100" />
      <el-table-column show-overflow-tooltip prop="sex" label="性别" width="100">
        <template #default="{ row }">
          <span v-if="row.sex == '1'">男</span>
          <span v-else-if="row.sex == '2'">女</span>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip prop="saturationNumber" label="饱和度" width="100">
        <template #default="{ row }"> {{ row.saturationNumber || 0 }} % </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip prop="mobilephone" label="联系电话" width="160" />
      <el-table-column show-overflow-tooltip prop="visitnumber" label="拜访数" width="100" />
      <el-table-column show-overflow-tooltip prop="workSum" label="工单数" width="100" />
      <el-table-column show-overflow-tooltip prop="orderSum" label="订单数" width="100" />
      <el-table-column show-overflow-tooltip prop="careSum" label="关怀数" width="100" />
      <el-table-column show-overflow-tooltip prop="serviceSum" label="服务包数" width="100" />
      <el-table-column show-overflow-tooltip prop="finalContactTime" min-width="170" label="最后联系时间">
        <template #default="{ row }">
          {{ formatDateString(row.finalContactTime) }}
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip prop="currentAllAddress" label="现居地址" width="350" />
      <el-table-column show-overflow-tooltip prop="remark" label="备注" width="300" />
    </el-table>
    <div style="margin: 10px 0 20px">
      <el-pagination
        v-model:current-page="phonePage.pageNum"
        v-model:page-size="phonePage.pageSize"
        :page-sizes="[10, 20, 50, 100, 200, 500]"
        layout="total, prev, pager, next"
        :total="phonePage.total"
        @current-change="checkMobilephone"
      />
    </div>
    <!-- <template #footer>
      <span class="dialog-footer">
        <el-button @click="clearPhone">清空号码</el-button>
        <el-button type="primary" @click="closePhone">忽略提示</el-button>
      </span>
    </template> -->
  </el-dialog>
</template>
<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, FormRules } from 'element-plus'
import { getCustomerInfoByPhone, getMobilephone, saveCustomerInfo } from '@/api/customer/index'
import DictSelect from '/@/components/DictSelect/index.vue'
import WorksheetAddForm from './components/worksheet-add-form.vue'
import CareinfoAddForm from './components/careinfo-add-form.vue'
import OrderAddForm from './components/order-add-form.vue'
import { useRouter, useRoute } from 'vue-router'
import { formatDateString } from '@/utils'
import { filterDict, renderDict } from '@/hooks/web/useDict'
const { push, back } = useRouter()
// @ts-ignore
defineOptions({
  // eslint-disable-next-line vue/component-definition-name-casing
  name: 'Add'
})

function customerEdit() {
  push(`/customer/edit?id=${currentCustomer.value.id}&customerUpdate=false`)
}

const serviceType = ref<any>('')

const route = useRoute()

const isAdd = ref(false)

const adding = ref(false)

const visiblePhone = ref(false)

// const verifyPhone = ref(false)

const checkMobilephone = () => {
  let reg = /^(1[3-9]\d{9}|0\d{2,3}-\d{7,8}|0\d{2,3}\d{7,8})$/ // 匹配手机号码或固定电话
  // if (!reg.test(phoneForm.phoneNumber)) {
  //   verifyPhone.value = true
  // } else {
  //   verifyPhone.value = false
  //   searchPhone()
  // }
  if (reg.test(phoneForm.phoneNumber)) {
    searchPhone()
  }
}

//校验手机号
const checkPhone = (_rule, value, callback) => {
  let reg = /^(1[3-9]\d{9}|0\d{2,3}-\d{7,8}|0\d{2,3}\d{7,8})$/ // 匹配手机号码或固定电话
  if (!reg.test(value)) {
    callback(new Error('请输入正确的手机号码或固定电话手机号码'))
  } else {
    callback()
  }
}

const saveCustomer = async () => {
  adding.value = true
  try {
    let result: any = await saveCustomerInfo({
      ...addForm,
      mobilephone: phoneForm.phoneNumber
    })
    if (result.msg == '客户已存在') {
      ElMessage.error(result.msg)
      return
    }
    ElMessage.success('添加成功')
    await getCustomer(phoneForm.phoneNumber, result.data)
    adding.value = false
    Object.assign(addForm, addDefault)
    // isAdd.value = !isAdd.value
  } finally {
    adding.value = false
  }
}

const clearPhone = () => {
  phoneForm.phoneNumber = ''
  currentCustomer.value = null
  Object.assign(addForm, addDefault)
}

function onBack() {
  back()
}

const addDefault = reactive({
  name: undefined,
  sex: undefined,
  saturationLevel: 0,
  serviceObjSource: undefined,
  remark: undefined
})
let addForm = reactive({ ...addDefault })

const addRules = reactive<FormRules>({
  name: [
    {
      required: true,
      pattern: /^[\u4e00-\u9fa5a-zA-Z]{1,15}$/,
      message: '请填写客户姓名',
      trigger: 'change'
    }
  ],
  sex: [{ required: true, message: '请选择性别', trigger: 'change' }],
  saturationLevel: [{ required: true, message: '请选择是否纳入饱和度计算', trigger: 'change' }]
})

// const phoneNumber = ref()

const phoneForm = reactive({
  phoneNumber: ''
})

const phoneRules = reactive<FormRules>({
  phoneNumber: [
    {
      required: true,
      message: '请输入手机号',
      trigger: 'blur'
    },
    { validator: checkPhone, trigger: 'blur' }
  ]
})
const customerList = ref<any>([])
const currentCustomer = ref<any>(null)
async function getCustomer(phoneNumber, id) {
  if (!phoneNumber) {
    currentCustomer.value = null
    return
  }
  let result = await getCustomerInfoByPhone(phoneNumber)
  currentCustomer.value = result.data.find((item) => item.id == id)
}

async function handleCustomerChange(id) {
  currentCustomer.value = customerList.value?.find((item: any) => item.id === id)
  closePhone()
}

function handleCreateCustomer() {
  isAdd.value = true
  closePhone()
}

const phonePage = ref({
  pageNum: 1,
  pageSize: 5,
  total: 0
})

function detail(row) {
  push(`/customer/detail?id=${row.id}`)
}

const closePhone = () => {
  customerList.value = []
  phonePage.value.pageNum = 1
  visiblePhone.value = false
}

const searchPhone = async () => {
  if (!phoneForm.phoneNumber) {
    customerList.value = []
    return
  }
  let res = await getMobilephone({ mobilephone: phoneForm.phoneNumber, ...phonePage.value })
  if (res.data.list.length == 1) {
    currentCustomer.value = res.data.list[0]
  } else if (res.data.list.length) {
    customerList.value = res.data.list
    phonePage.value.total = res.data.total
    visiblePhone.value = true
  } else {
    isAdd.value = true
  }

  // if (route.query.phone) {
  //   handleCustomerChange(route.query.phone)
  // }
}

onMounted(() => {
  if (route.query.serviceType) {
    serviceType.value = route.query.serviceType
  }
  if (route.query.id) {
    phoneForm.phoneNumber = String(route.query.phone)
    getCustomer(phoneForm.phoneNumber, route.query.id)
  }
})
</script>
<style scoped lang="less">
.inline-form-item {
  display: inline-flex;
  vertical-align: middle;
  margin-right: 32px;
  .show-text {
    line-height: 30px;
    padding: 0 12px;
    background: #f5f7fa;
    border-radius: 4px;
    color: #d6d6d7;
    border: 1px solid #eaecf1;
    cursor: not-allowed;
  }
}
.title {
  display: flex;

  align-items: center;
  position: relative;
}
.title .customer-edit {
  position: absolute;
  right: 0;
}
.change-button {
  margin-left: 10px;
  cursor: pointer;
  color: var(--el-color-primary);
  &:hover {
    color: var(--el-color-primary-dark-2);
  }
}
.service-type {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}
.form-title {
  width: 100px;
  padding-right: 12px;
  text-align: left;
  font-size: 14px;
  color: var(--el-text-color-regular);
}
.customer-tag {
  display: inline-block;
  width: 49px;
  height: 21px;
  background: url(../../assets/bg/customer-tag.png) no-repeat top left;
  background-size: 100% auto;
  margin-left: 5px;
  text-align: right;
  font-size: 12px;
  color: #fff;
  line-height: 21px;
  padding-right: 3px;
}
.tip {
  // position: absolute;
  // bottom: -25px;
  margin-left: 100px;
  font-size: 12px;
  color: #f56c6c;
}
</style>
