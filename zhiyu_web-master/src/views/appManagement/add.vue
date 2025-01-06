<template>
  <el-page-header title="" @back="onBack">
    <template #content>{{ route.query.id ? '编辑' : '新增' }}服务商 </template>
  </el-page-header>
  <el-divider style="margin: 11px 0 20px" />
  <el-form ref="formRef" :model="addForm" label-width="110px" :rules="addRules" :validate-on-rule-change="false">
    <h4 class="title" style="margin: 20px 0 16px; font-weight: 600">基础信息</h4>

    <div class="form-item">
      <el-form-item label="服务商名称" prop="name">
        <el-input v-model="addForm.name" placeholder="请输入服务商名称" maxlength="32" clearable />
      </el-form-item>
    </div>
    <div class="form-item">
      <el-form-item label="服务商编号">
        <el-input v-model="addForm.code" placeholder="请输入服务商编号" clearable />
      </el-form-item>
    </div>
    <div class="form-item">
      <el-form-item label="服务商类别">
        <DictSelect width="100%" v-model="addForm.categoryid" :distList="typeList" placeholder="请选择服务商类别" />
      </el-form-item>
    </div>
    <div class="form-item">
      <el-form-item label="服务商电话" prop="companyPhone">
        <el-input v-model="addForm.companyPhone" placeholder="请输入服务商电话" clearable />
      </el-form-item>
    </div>
    <div class="form-item">
      <el-form-item label="服务商状态">
        <DictSelect width="100%" v-model="addForm.status" :distList="filterDict('seller_status')" placeholder="请选择服务商状态" />
      </el-form-item>
    </div>
    <div class="form-item">
      <el-form-item label="营业状态">
        <DictSelect width="100%" v-model="addForm.businessstatus" :distList="filterDict('seller_businessstatus')" placeholder="请选择营业状态" />
      </el-form-item>
    </div>
    <div class="form-item">
      <el-form-item label="所属区域" prop="sellerList">
        <Cascader v-model="addForm.sellerList" :needProject="true" />
      </el-form-item>
    </div>
    <div class="form-item">
      <el-form-item label="详细地址" prop="address">
        <el-input v-model="addForm.address" placeholder="请输入详细地址" clearable />
      </el-form-item>
    </div>
    <div class="form-item">
      <el-form-item label="开户行" prop="depositBank">
        <el-input v-model="addForm.depositBank" placeholder="请输入开户行" clearable />
      </el-form-item>
    </div>
    <div class="form-item">
      <el-form-item label="商户账号" prop="merAccount">
        <el-input v-model="addForm.merAccount" placeholder="请输入商户账号" clearable />
      </el-form-item>
    </div>
    <div class="form-item">
      <el-form-item label="服务商结算方式">
        <DictSelect width="100%" v-model="addForm.paymentType" :distList="filterDict('checkout_mode')" placeholder="请选择服务商结算方式" />
      </el-form-item>
    </div>
    <div class="form-item">
      <el-form-item label="合同到期日期" prop="contractendDate">
        <el-date-picker v-model="addForm.contractendDate" type="date" placeholder="合同到期日期" style="width: 100%" value-format="YYYY-MM-DD" />
      </el-form-item>
    </div>
    <div class="form-item">
      <el-form-item label="是否已合作">
        <el-radio-group v-model="addForm.isCooperation">
          <el-radio value="1" size="large">是</el-radio>
          <el-radio value="0" size="large">否</el-radio>
        </el-radio-group>
      </el-form-item>
    </div>
    <div class="form-item">
      <el-form-item label="是否公益">
        <el-radio-group v-model="addForm.isWelfare">
          <el-radio value="1" size="large">是</el-radio>
          <el-radio value="0" size="large">否</el-radio>
        </el-radio-group>
      </el-form-item>
    </div>
    <div class="form-item">
      <el-form-item label="备注">
        <el-input v-model="addForm.remark" placeholder="请输入备注" clearable />
      </el-form-item>
    </div>

    <h4 class="title" style="margin-bottom: 20px; font-weight: 600">服务信息</h4>
    <div class="form-item item-100">
      <el-form-item label="服务商介绍">
        <el-input v-model="addForm.cooperationcontent" type="textarea" :rows="3" placeholder="请输入服务内容" maxlength="300" show-word-limit />
      </el-form-item>
    </div>
    <div class="form-item item-66">
      <el-form-item label="营业时间">
        <el-checkbox-group v-model="addForm.businessWeekDays" @change="handleWeekChange">
          <el-checkbox v-for="week in filterDict('business_week_days')" :key="week.value" :label="week.value">
            {{ week.label }}
          </el-checkbox>
        </el-checkbox-group>
        <el-checkbox v-model="checkAll" @change="checkAllWeek">全选</el-checkbox>
      </el-form-item>
    </div>
    <div class="form-item">
      <el-form-item label="服务起止时间">
        <el-date-picker
          v-model="addForm.businessTime"
          type="datetimerange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          format="YYYY-MM-DD HH:mm"
          value-format="YYYY-MM-DD HH:mm"
          date-format="MMM DD, YYYY"
          time-format="HH:mm"
          @change="changeBusiness"
        />
      </el-form-item>
    </div>
    <div class="form-item">
      <el-form-item label="是否送货">
        <DictSelect width="100%" v-model="addForm.delivergoods" :distList="filterDict('yes_no')" placeholder="请选择" />
      </el-form-item>
    </div>
    <div class="form-item">
      <el-form-item label="起送价">
        <el-input-number class="numberInput" v-model="addForm.deliverMinPrice" :controls="false" :min="0" :precision="2" />
      </el-form-item>
    </div>
    <div class="form-item">
      <el-form-item label="星级评价">
        <DictSelect width="100%" v-model="addForm.starEvaluate" :distList="filterDict('star_evaluate')" placeholder="请选择" />
      </el-form-item>
    </div>
    <div class="form-item item-100">
      <el-form-item label="服务范围">
        <Cascader width="100%" v-model="addForm.serveAreaCodeList" :multiple="true" :check="true" :needProject="true" />
      </el-form-item>
    </div>
    <div class="form-item item-100">
      <el-form-item label="图片">
        <ImgUpload v-model="addForm.photoUrl" show-limit @success="handleImgSuccess" @remove="handleImgRemove" />
      </el-form-item>
    </div>
  </el-form>
  <div class="button-box">
    <el-button type="primary" @click="onSubmit" :loading="saving">保存</el-button>
    <el-button @click="onBack">取消</el-button>
  </div>
</template>
<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, FormRules } from 'element-plus'
import { getProviderTypeList, addProvider, getProviderDetail, updateProvider, getUrl } from '@/api/serviceProvider'
import DictSelect from '@/components/DictSelect/index.vue'
import Cascader from '@/components/Cascader/indexSub.vue'
import { useRouter, useRoute } from 'vue-router'
import { config } from '@/config/axios/config'
import { filterDict } from '@/hooks/web/useDict'
import ImgUpload from '@/components/ImgUpload/index.vue'

// @ts-ignore
defineOptions({
  // eslint-disable-next-line vue/component-definition-name-casing
  name: 'ProviderAdd'
})

const handleImgSuccess = (data: any) => {
  addForm.photo = data.id.toString()
}
const handleImgRemove = () => {
  addForm.photo = ''
}

const { back } = useRouter()

const serviceType = ref<any>('')

const route = useRoute()

// const isAdd = ref(false)
const saving = ref(false)

const adding = ref(false)

const weekList = ref([
  { label: '星期一', value: '1' },
  { label: '星期二', value: '2' },
  { label: '星期三', value: '3' },
  { label: '星期四', value: '4' },
  { label: '星期五', value: '5' },
  { label: '星期六', value: '6' },
  { label: '星期日', value: '7' }
])

const formRef = ref()

const onSubmit = async () => {
  try {
    await formRef.value.validate()
    save()
  } catch (err) {
    ElMessage.error('参数验证错误，请仔细填写表单数据!')
  }
}

const save = async () => {
  adding.value = true
  try {
    if (route.query.id) {
      await updateProvider(addForm)
      ElMessage.success('修改成功')
      onClear()
      back()
    } else {
      await addProvider(addForm)
      ElMessage.success('添加成功')
      onClear()
    }
  } finally {
    adding.value = false
  }
}

const onClear = () => {
  Object.assign(addForm, addDefault)
  checkAll.value = false
  formRef.value.resetFields()
}

function onBack() {
  back()
}

const addDefault = reactive({
  name: undefined,
  code: undefined,
  categoryid: undefined,
  companyPhone: undefined,
  status: undefined,
  businessstatus: undefined,
  sellerList: [],
  address: undefined,
  depositBank: undefined,
  merAccount: undefined,
  paymentType: undefined,
  contractendDate: undefined,
  isCooperation: undefined,
  isWelfare: undefined,
  starEvaluate: undefined,
  cooperationcontent: undefined,
  businessWeekDays: [],
  businessTime: undefined,
  businessStartTime: undefined,
  businessEndTime: undefined,
  delivergoods: undefined,
  deliverMinPrice: undefined,
  photo: '',
  photoUrl: '',
  remark: undefined,
  serveAreaCodeList: []
})
let addForm = reactive<any>({ ...addDefault })

const addRules = reactive<FormRules>({
  careContent: [
    {
      required: true,
      pattern: /^[\u4e00-\u9fa5a-zA-Z]{1,15}$/,
      message: '请填写客户姓名',
      trigger: 'change'
    }
  ],
  name: [
    {
      required: true,
      pattern: /^[\u4e00-\u9fa5a-zA-Z0-9]/,
      message: '请正确填写服务商名称（不含特殊字符）',
      trigger: 'blur'
    }
  ],
  sex: [{ required: true, message: '请选择性别', trigger: 'change' }],
  depositBank: [{ required: true, message: '请填写开户行', trigger: ['change', 'blur'] }],
  companyPhone: [{ required: true, message: '请填写服务商号码', trigger: ['change', 'blur'] }],
  merAccount: [{ required: true, message: '请填写商户账号', trigger: ['change', 'blur'] }],
  contractendDate: [{ required: true, message: '请填写合同到期日期', trigger: ['change', 'blur'] }],
  sellerList: [{ required: true, message: '请选择所属区域', trigger: ['change', 'blur'] }],
  address: [{ required: true, message: '请填写详细地址', trigger: ['change', 'blur'] }],
  saturationLevel: [{ required: true, message: '请选择是否纳入饱和度计算', trigger: 'change' }]
})

const typeList = ref([])

const getTypeList = async () => {
  const dictRes = await getProviderTypeList()
  typeList.value = dictRes.data.map((item) => {
    return {
      value: item.id,
      label: item.name
    }
  })
}

const checkAll = ref(false)

const handleWeekChange = (value: string[]) => {
  const checkedCount = value.length
  checkAll.value = checkedCount === weekList.value.length
}

const checkAllWeek = (val: boolean) => {
  addForm.businessWeekDays = val ? weekList.value.map((item) => item.value) : []
}

const changeBusiness = () => {
  if (addForm.businessTime.length) {
    addForm.businessStartTime = addForm.businessTime[0]
    addForm.businessEndTime = addForm.businessTime[1]
    return
  }
  addForm.businessStartTime = undefined
  addForm.businessEndTime = undefined
}

const getTypeDetail = async () => {
  const res = await getProviderDetail(route.query.id)
  Object.assign(addForm, res.data)
  if (res.data.businessStartTime) {
    addForm.businessTime = [res.data.businessStartTime, res.data.businessEndTime]
  }
  if (res.data.businessWeekDays.length === 7) {
    checkAll.value = true
  }
  if (res.data.photo) {
    const { data } = await getUrl(res.data.photo)
    addForm.photoUrl = config.base_img.dev + data
  }
}

onMounted(() => {
  if (route.query.serviceType) {
    serviceType.value = route.query.serviceType
  }
  getTypeList()
  if (route.query.id) {
    getTypeDetail()
  }
})
</script>
<style scoped lang="less">
.inline-form-item {
  display: inline-flex;
  vertical-align: middle;
  margin-right: 32px;
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
  position: absolute;
  bottom: -25px;
  left: 2px;
  font-size: 12px;
  color: #f56c6c;
}
.form-item {
  width: 33.33%;
  padding-right: 40px;
  display: inline-block;
}
.item-100 {
  width: 100%;
}
.item-66 {
  width: 66.66%;
}
.numberInput {
  width: 100%;
}
:deep(.el-input-number .el-input__inner) {
  text-align: left;
}
:deep(.el-checkbox:last-of-type) {
  margin-right: 30px;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
