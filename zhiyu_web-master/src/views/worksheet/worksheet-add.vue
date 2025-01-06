<template>
  <el-page-header title="" @back="onBack">
    <template #content> 新增工单 </template>
  </el-page-header>
  <el-divider style="margin: 11px 0 20px" />
  <el-descriptions title="客户信息" style="margin-top: 20px" border>
    <el-descriptions-item label="联系电话" label-class-name="required-item" span="3">
      <div v-if="isAdd">
        <el-select
          v-model="phoneNumber"
          filterable
          remote
          placeholder="请输入电话号码"
          no-data-text="未搜索到关联用户，请重新输入"
          :remote-method="getCustomer"
          style="width: 250px"
          @change="handleCustomerChange"
        >
          <el-option v-for="item in customerList" :key="item.id" :label="item.mobilephone" :value="item.mobilephone">
            <span>{{ item.name }}: {{ item.mobilephone }}</span>
          </el-option>
        </el-select>
        <a class="change-button" @click="changeAdd">添加新客户</a>
      </div>
      <div class="new-phoneB-box" v-else>
        <el-input v-model="phoneNumber" placeholder="请输入电话号码" @blur="checkMobilephone" style="width: 250px" />
        <a class="change-button" @click="changeAdd">查询旧客户</a>
        <p v-if="verifyPhone">请输入正确的手机号码</p>
      </div>
    </el-descriptions-item>
    <div v-if="currentCustomer && isAdd">
      <el-descriptions-item label="客户姓名">
        <span v-if="currentCustomer.name">{{ currentCustomer.name }}</span>
        <!-- <span v-else class="unchecked">暂未填写</span> -->
      </el-descriptions-item>
      <el-descriptions-item label="性别">
        <span v-if="currentCustomer.sex">{{ renderDict(currentCustomer.sex, 'vols_sex') }}</span>
        <!-- <span v-else class="unchecked">暂未填写</span> -->
      </el-descriptions-item>
      <el-descriptions-item label="是否纳入饱和度计算">
        {{ currentCustomer.saturationLevel == 1 ? '是' : '否' }}
      </el-descriptions-item>
      <el-descriptions-item label="服务对象来源" span="3">
        <span v-if="currentCustomer.serviceObject">{{ renderDict(currentCustomer.serviceObjSource, 'service_obj_source') }}</span>
        <!-- <span v-else class="unchecked">暂未选择</span> -->
      </el-descriptions-item>
      <el-descriptions-item label="备注" span="3">
        <span v-if="currentCustomer.remark">{{ currentCustomer.remark }}</span>
        <!-- <span v-else class="unchecked">暂未填写</span> -->
      </el-descriptions-item>
    </div>
    <div v-if="!isAdd">
      <el-descriptions-item label="客户姓名" label-class-name="required-item">
        <el-input v-model="addForm.name" placeholder="请输入客户姓名" style="width: 250px" />
      </el-descriptions-item>
      <el-descriptions-item label="性别" label-class-name="required-item">
        <el-radio-group v-model="addForm.sex">
          <el-radio value="1">男</el-radio>
          <el-radio value="2">女</el-radio>
        </el-radio-group>
      </el-descriptions-item>
      <el-descriptions-item label="是否纳入饱和度计算" label-class-name="required-item">
        <el-radio-group v-model="addForm.saturationLevel">
          <el-radio :value="1">是</el-radio>
          <el-radio :value="0">否</el-radio>
        </el-radio-group>
      </el-descriptions-item>
      <el-descriptions-item label="服务对象来源" span="3">
        <DictSelect v-model="addForm.serviceObjSource" placeholder="请选择服务对象来源" :distList="filterDict('service_obj_source')" />
      </el-descriptions-item>
      <el-descriptions-item label="备注" span="3">
        <el-input v-model="addForm.remark" type="textarea" :rows="3" placeholder="请输入特殊情况填写备注内容，如：三无老人，联系电话为邻居，腿脚不便等" show-word-limit maxlength="50" />
      </el-descriptions-item>
      <el-descriptions-item label="" span="3">
        <el-button type="primary" @click="saveCustomer" :loading="adding">添加新客户</el-button>
      </el-descriptions-item>
    </div>
  </el-descriptions>
  <el-descriptions title="服务信息" style="margin-top: 20px" border>
    <el-descriptions-item label="工单类型" label-class-name="required-item" span="3">
      <el-radio-group v-model="form.worksheetTypeId" @change="getWorksheetType">
        <el-radio v-for="item in filterDict('worksheet_category')" :key="item.value" :value="item.value">
          {{ item.label }}
        </el-radio>
        <!-- <el-radio :value="2">投诉</el-radio> -->
        <!-- <el-radio :value="3">订单</el-radio>
        <el-radio :value="2">关怀</el-radio>
        <el-radio :value="4">套餐</el-radio>
        <el-radio :value="5">会员卡</el-radio> -->
      </el-radio-group>
    </el-descriptions-item>
    <el-descriptions-item label="工单类别" label-class-name="required-item" span="3">
      <el-select v-model="form.worksheetCategoryId" placeholder="请选择工单类别" @change="getWorksheetTypeChildren">
        <el-option v-for="item in worksheetTypeList" :key="item.id" :label="item.worksheetTypeName" :value="item.id" />
      </el-select>
    </el-descriptions-item>
    <el-descriptions-item label="工单子类" label-class-name="required-item" span="3">
      <el-select :disabled="!form.worksheetCategoryId" v-model="form.worksheettypeInfoId" placeholder="请选择工单子类">
        <el-option v-for="item in worksheetTypeInfoList" :key="item.id" :label="item.worksheetTypeName" :value="item.id" />
      </el-select>
    </el-descriptions-item>
    <el-descriptions-item label="呼入问题" label-class-name="required-item" span="3">
      <el-input v-model="form.worksheetQuestion" :rows="3" type="textarea" />
    </el-descriptions-item>
    <el-descriptions-item label="处理方式" label-class-name="required-item" span="3">
      <el-input v-model="form.worksheetAnswer" :rows="3" type="textarea" />
    </el-descriptions-item>
    <el-descriptions-item label="备注" span="3">
      <el-input v-model="form.worksheetComment" :rows="3" type="textarea" />
    </el-descriptions-item>
    <el-descriptions-item label="结案" label-class-name="required-item" span="3">
      <el-radio-group v-model="form.isClosed">
        <el-radio value="1">是</el-radio>
        <el-radio value="0">否</el-radio>
      </el-radio-group>
    </el-descriptions-item>
    <el-descriptions-item label="回访日期" span="3">
      <el-date-picker v-model="form.returnTime" type="datetime" value-format="YYYY-MM-DD HH:mm:ss" />
      <el-checkbox v-model="form.isReturnMe" label="由我访问" style="margin-left: 20px" />
    </el-descriptions-item>
  </el-descriptions>
  <el-descriptions title="历史工单" style="margin-top: 20px">
    <el-descriptions-item span="3">
      <el-table
        :data="historyWorksheetList"
        header-row-class-name="table-header"
        :style="{
          width: 'calc(100vw - 415px)',
          display: 'flex',
          border: '1px solid #f5f3f0',
          borderRadius: '8px'
        }"
        max-height="200"
      >
        <el-table-column type="index" />
        <el-table-column label="操作" width="120">
          <template #default="{ row }">
            <el-button link type="primary" size="small" @click="detail(row)"> 查看 </el-button>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="worksheetNo" label="工单编号" />
        <el-table-column show-overflow-tooltip prop="createTime" label="受理时间" />
        <el-table-column show-overflow-tooltip prop="returnUserName" label="归属客服" />
        <el-table-column show-overflow-tooltip prop="isClosed" label="是否结案">
          <template #default="{ row }">
            {{ row.isClosed !== 0 ? '是' : '否' }}
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="worksheetType" label="工单类型" />
        <el-table-column show-overflow-tooltip prop="worksheetCategory" label="工单类别" />
        <el-table-column show-overflow-tooltip prop="returnTime" label="下次访问时间" />
        <el-table-column show-overflow-tooltip prop="returnUserName" label="回访人" />
      </el-table>
    </el-descriptions-item>
  </el-descriptions>
  <p class="w-full" style="margin: 5px 0 15px">
    <el-button type="primary" @click="save" :loading="saving">保存</el-button>
    <el-button @click="onBack">取消</el-button>
    <span class="tips">
      <Icon icon="mdi:about-circle-outline" style="vertical-align: middle" />
      若要自动关联通话录音，请在通话挂断后再点击添加（录音在通话挂断后才会生成），通话挂断前点击添加，关联的录音将不正确！</span
    >
  </p>
</template>
<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
// import { useCache } from '@/hooks/web/useCache'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Icon } from '@/components/Icon'
import { getCustomerInfoByPhone, saveCustomerInfo } from '@/api/customer/index'
import { saveWorksheet, getWorksheetList, getWorksheetTree } from '@/api/worksheet/index'
import DictSelect from '/@/components/DictSelect/index.vue'
import { filterDict, renderDict } from '@/hooks/web/useDict'
// @ts-ignore
defineOptions({
  name: 'Append'
})

const route = useRoute()

const isAdd = ref(true)

const adding = ref(false)

const verifyPhone = ref(false)

const checkMobilephone = () => {
  let reg = /^(1[3-9]\d{9}|0\d{2,3}-\d{7,8}|0\d{2,3}\d{7,8})$/ // 匹配手机号码或固定电话
  if (!reg.test(phoneNumber.value)) {
    verifyPhone.value = true
  } else {
    verifyPhone.value = false
  }
}

const saveCustomer = async () => {
  adding.value = true
  try {
    let result: any = await saveCustomerInfo({
      ...addForm,
      mobilephone: phoneNumber.value
    })
    if (result.msg == '客户已存在') {
      ElMessage.error(result.msg)
      return
    }
    ElMessage.success('添加成功')
    getCustomer(phoneNumber.value)
    setTimeout(() => {
      handleCustomerChange(phoneNumber.value)
    }, 500)
    Object.assign(addForm, addDefault)
    isAdd.value = !isAdd.value
  } finally {
    // ElMessage.error(err.message)
    adding.value = false
  }
}

const changeAdd = () => {
  isAdd.value = !isAdd.value
  phoneNumber.value = null
  currentCustomer.value = null
  Object.assign(addForm, addDefault)
}

const { back, push } = useRouter()
// const { wsCache } = useCache()

function onBack() {
  // push('/worksheet/page')
  back()
}

const formDefault = reactive({
  areaProjectCode: undefined,
  customerId: 0,
  isClosed: '0',
  isReturnMe: false,
  returnTime: undefined,
  worksheetAnswer: undefined,
  worksheetCategoryId: undefined,
  worksheetComment: undefined,
  worksheetQuestion: undefined,
  worksheetTypeId: '1',
  worksheettypeInfoId: undefined
})

let form = reactive({ ...formDefault })

const addDefault = reactive({
  name: undefined,
  sex: undefined,
  saturationLevel: 0,
  serviceObjSource: undefined,
  remark: undefined
})
let addForm = reactive({ ...addDefault })
const saving = ref(false)

async function save() {
  saving.value = true
  try {
    await saveWorksheet(form)
    ElMessage.success('操作成功')
    onBack()
  } finally {
    saving.value = false
  }
}

const historyWorksheetList = ref([])

const phoneNumber = ref()
const customerList = ref<any>([])
const currentCustomer = ref<any>(null)
async function getCustomer(phoneNumber) {
  if (!phoneNumber) {
    customerList.value = []
    return
  }
  let result = await getCustomerInfoByPhone(phoneNumber)
  customerList.value = result.data
  if (route.query.phone) {
    handleCustomerChange(route.query.phone)
  }
}
async function handleCustomerChange(customer) {
  currentCustomer.value = customerList.value?.find((item: any) => item.mobilephone === customer)
  if (!currentCustomer.value) {
    return
  }
  form.customerId = currentCustomer.value.id
  const result = await getWorksheetList({ customerId: form.customerId })
  historyWorksheetList.value = result.data
}

const typeTreeList = ref<any>([])
const worksheetTypeList = ref<any>([])
const worksheetTypeInfoList = ref<any>([])
async function getWorksheetTypeList() {
  const result = await getWorksheetTree()
  typeTreeList.value = result.data
  getWorksheetType()
}

const getWorksheetType = () => {
  form.worksheetCategoryId = undefined
  form.worksheettypeInfoId = undefined
  worksheetTypeList.value = typeTreeList.value.find((item) => item.worksheetTypeCode == form.worksheetTypeId).children
}

const getWorksheetTypeChildren = () => {
  form.worksheettypeInfoId = undefined
  worksheetTypeInfoList.value = worksheetTypeList.value.find((item) => item.id == form.worksheetCategoryId).children
}

const detail = (row) => {
  push(`/worksheet/details?id=${row.id}`)
}
onMounted(() => {
  getWorksheetTypeList()
  if (route.query.phone) {
    phoneNumber.value = route.query.phone
    getCustomer(phoneNumber.value)
    setTimeout(() => {
      handleCustomerChange(phoneNumber.value)
    }, 1000)
  }
})
</script>
<style scoped lang="less">
// :deep(.el-descriptions__cell.el-descriptions__label.is-bordered-label) {
//   width: 120px;
// }
:deep(.el-descriptions__cell.el-descriptions__content.is-bordered-content) {
  padding-right: 80px;
}
.tips {
  margin-left: 40px;
  color: #ccc;
  font-size: 14px;
}
.change-button {
  margin-left: 10px;
  cursor: pointer;
  color: var(--el-color-primary);
  &:hover {
    color: var(--el-color-primary-dark-2);
  }
}
.new-phoneB-box {
  position: relative;
  > p {
    color: red;
    font-size: 12px;
    position: absolute;
    bottom: -22px;
    left: 3px;
  }
}
</style>
