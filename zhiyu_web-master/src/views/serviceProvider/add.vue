<template>
  <el-page-header @back="onBack" class="common-page-header">
    <template #content>{{ route.query.id ? '编辑' : '新增' }}服务商 </template>
  </el-page-header>
  <el-scrollbar height="calc(100vh - 205px)" class="pr-scrollbar">
    <el-form ref="formRef" :model="addForm" label-width="110px" :rules="addRules" :validate-on-rule-change="false" class="fuwushang-form">
      <h4 class="title r-m-t-20 r-m-b-16">基础信息</h4>
      <div class="grid-box">
        <el-form-item label="服务商名称" prop="name">
          <el-input v-model="addForm.name" placeholder="请输入服务商名称" maxlength="32" clearable />
        </el-form-item>
        <el-form-item label="服务商编号">
          <el-input v-model="addForm.code" placeholder="请输入服务商编号" clearable />
        </el-form-item>
        <el-form-item label="服务商类别">
          <DictSelect width="100%" v-model="addForm.categoryid" :distList="typeList" placeholder="请选择服务商类别" />
        </el-form-item>
      </div>
      <div class="grid-box">
        <el-form-item label="服务商电话" prop="companyPhone">
          <el-input v-model="addForm.companyPhone" placeholder="请输入服务商电话" clearable />
        </el-form-item>
        <el-form-item label="服务商状态">
          <DictSelect width="100%" v-model="addForm.status" :distList="filterDict('seller_status')" placeholder="请选择服务商状态" />
        </el-form-item>
        <el-form-item label="营业状态">
          <DictSelect width="100%" v-model="addForm.businessstatus" :distList="filterDict('seller_businessstatus')" placeholder="请选择营业状态" />
        </el-form-item>
      </div>
      <div class="grid-box">
        <el-form-item label="所属区域" prop="sellerList">
          <Cascader width="100%" v-model="addForm.sellerList" :needProject="true" />
        </el-form-item>
        <el-form-item label="详细地址" prop="address" class="grid-span-2">
          <el-input v-model="addForm.address" placeholder="请输入详细地址" clearable />
        </el-form-item>
      </div>
      <div class="grid-box">
        <el-form-item label="开户行" prop="depositBank">
          <el-input v-model="addForm.depositBank" placeholder="请输入开户行" clearable />
        </el-form-item>
        <el-form-item label="商户账号" prop="merAccount">
          <el-input v-model="addForm.merAccount" placeholder="请输入商户账号" clearable />
        </el-form-item>
        <el-form-item label="服务商结算方式">
          <DictSelect width="100%" v-model="addForm.paymentType" :distList="filterDict('checkout_mode')" placeholder="请选择服务商结算方式" />
        </el-form-item>
      </div>
      <div class="grid-box">
        <el-form-item label="合同到期日期" prop="contractendDate">
          <el-date-picker v-model="addForm.contractendDate" type="date" placeholder="合同到期日期" style="width: 100%" value-format="YYYY-MM-DD" />
        </el-form-item>
        <el-form-item label="是否已合作">
          <el-radio-group v-model="addForm.isCooperation">
            <el-radio value="1">是</el-radio>
            <el-radio value="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否公益">
          <el-radio-group v-model="addForm.isWelfare">
            <el-radio value="1">是</el-radio>
            <el-radio value="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
      </div>
      <el-form-item label="备注">
        <el-input v-model="addForm.remark" type="textarea" :rows="3" placeholder="请输入备注" maxlength="300" show-word-limit clearable />
      </el-form-item>
      <h4 class="title r-m-t-20 r-m-b-16">服务信息</h4>
      <el-form-item label="服务商介绍">
        <el-input v-model="addForm.cooperationcontent" type="textarea" :rows="3" placeholder="请输入服务商介绍" maxlength="300" show-word-limit clearable />
      </el-form-item>
      <div class="grid-box">
        <el-form-item label="营业时间" class="grid-span-2">
          <el-checkbox-group v-model="addForm.businessWeekDays" @change="handleWeekChange">
            <el-checkbox v-for="week in filterDict('business_week_days')" :key="week.value" :label="week.value">
              {{ week.label }}
            </el-checkbox>
          </el-checkbox-group>
          <el-checkbox v-model="checkAll" @change="checkAllWeek">全选</el-checkbox>
        </el-form-item>
        <el-form-item label="服务起止时间">
          <el-time-picker
            v-model="addForm.businessTime"
            is-range
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="HH:mm"
            value-format="HH:mm"
            @change="changeBusiness"
          />
        </el-form-item>
      </div>
      <div class="grid-box">
        <el-form-item label="是否送货">
          <el-radio-group v-model="addForm.delivergoods">
            <el-radio value="1">是</el-radio>
            <el-radio value="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="起送价">
          <el-input-number class="numberInput" placeholder="请输入起送价格" v-model="addForm.deliverMinPrice" :controls="false" :min="0" :precision="2" />
        </el-form-item>
        <el-form-item label="星级评价">
          <el-rate v-model="addForm.starEvaluate" clearable />
        </el-form-item>
      </div>
      <el-form-item label="服务范围">
        <CascaderSub width="100%" v-model="addForm.serveAreaCodeList" placeholder="区县-街道-社区" :multiple="true" :showAllLevels="false" />
      </el-form-item>
      <el-form-item label="图片">
        <ImgUpload v-model="addForm.photoUrl" show-limit @success="handleImgSuccess" @remove="handleImgRemove" />
      </el-form-item>
    </el-form>
    <div class="button-box">
      <el-button type="primary" @click="onSubmit" :loading="saving">保存</el-button>
      <el-button @click="onBack">取消</el-button>
    </div>
  </el-scrollbar>
</template>
<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, FormRules } from 'element-plus'
import { getProviderTypeList, addProvider, getProviderDetail, updateProvider, getUrl } from '@/api/serviceProvider'
import DictSelect from '@/components/DictSelect/index.vue'
import CascaderSub from '@/components/Cascader/indexSubCom.vue'
import Cascader from '@/components/Cascader/index.vue'
import { useRouter, useRoute } from 'vue-router'
import { config } from '@/config/axios/config'
import { useTagsViewStore } from '@/store/modules/tagsView'
import { computed } from 'vue'
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

const { back, replace } = useRouter()

const serviceType = ref<any>('')

const route = useRoute()

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
      goDetail(String(route.query.id))
    } else {
      const { data } = await addProvider(addForm)
      ElMessage.success('添加成功')
      onClear()
      goDetail(data)
    }
  } finally {
    adding.value = false
  }
}

// 关闭当前标签
const tagsViewStore = useTagsViewStore()
const visitedViews = computed(() => tagsViewStore.getVisitedViews)
const goDetail = (id: string) => {
  const obj = visitedViews.value.find((item) => item.fullPath === route.fullPath)
  if (obj) {
    tagsViewStore.delView(obj)
  }
  replace(`/serviceProvider/providerDetail?id=${id}`)
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
  companyPhone: [
    {
      required: true,
      pattern: /^\d{3,12}$/,
      message: '请填写正确的服务商号码',
      trigger: ['change', 'blur']
    }
  ],
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
.adapter(@size, @content) {
  @media only screen and (max-width: @size) {
    @content();
  }
}
.fuwushang-form {
  :deep(.el-form-item) {
    align-items: flex-start;
  }
}
.grid-box {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0 80px;
  .adapter(1700px, { gap: 0 40px; });
  .adapter(1600px, { gap: 0 20px; });
}
.grid-span-2 {
  grid-column-start: span 2;
}
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
.button-box {
  margin: 40px 0 0 110px;
}
:deep(.el-date-editor.el-input__wrapper) {
  width: auto;
}
:deep(.el-upload-list--picture-card) {
  --el-upload-list-picture-card-size: 64px;
}
:deep(.el-upload--picture-card) {
  --el-upload-picture-card-size: 64px;
}
:deep(.disabled .el-upload--picture-card) {
  display: none;
}
</style>
