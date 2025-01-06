<template>
  <el-page-header title="" @back="onBack" class="common-page-header">
    <template #content> {{ route.query.id ? '编辑' : '新增' }}服务项目 </template>
  </el-page-header>
  <el-scrollbar height="calc(100vh - 205px)">
    <div class="detail-top-gray-info" v-if="route.query.id">
      <span class="mr-5">创建时间：{{ addForm.createTime }} {{ addForm.creatorName }}</span>
      <span class="mr-5">更新时间：{{ addForm.updateTime }} {{ addForm.updaterName }}</span>
    </div>

    <el-form ref="formRef" :model="addForm" label-width="145px" class="r-m-t-20" :rules="addRules" :validate-on-rule-change="false">
      <div class="form-item">
        <el-form-item label="服务类别" prop="categoryId">
          <el-tree-select v-model="addForm.categoryId" :data="categoryTree" node-key="value" check-strictly :render-after-expand="false" />
        </el-form-item>
      </div>
      <div class="form-item">
        <el-form-item label="名称" prop="name">
          <el-input v-model="addForm.name" placeholder="请输入名称" />
        </el-form-item>
      </div>
      <div class="form-item">
        <el-form-item label="副标题">
          <el-input v-model="addForm.subhead" placeholder="请输入副标题" />
        </el-form-item>
      </div>
      <div class="form-item">
        <el-form-item label="标识码" prop="code">
          <el-input v-model="addForm.code" placeholder="请输入标识码" />
        </el-form-item>
      </div>
      <div class="form-item">
        <el-form-item label="单位" prop="unit">
          <el-input v-model="addForm.unit" placeholder="请输入单位" />
        </el-form-item>
      </div>
      <div class="form-item item-100">
        <el-form-item label="图片" prop="appPhoto">
          <div class="flex col-bottom" style="width: 100%">
            <ImgUpload v-model="addForm.appPhotoUrl" show-limit @success="handleImgSuccess" @remove="handleImgRemove" />
            <div class="gray-tip r-m-l-40" style="left: 130px">请上传宽高比例为1:1的图片</div>
          </div>
        </el-form-item>
      </div>
      <div class="form-item item-100">
        <el-form-item label="服务介绍" prop="content">
          <Editor v-model="addForm.content" ref="editorRef" style="width: 100%" :height="300" />
        </el-form-item>
      </div>
      <div class="form-item item-100">
        <el-form-item label="服务摘要" prop="serveSummary">
          <el-input v-model="addForm.serveSummary" type="textarea" :rows="3" maxlength="300" show-word-limit placeholder="请输入服务摘要" />
        </el-form-item>
      </div>
      <div class="form-item">
        <el-form-item label="服务便签">
          <el-input v-model="addForm.serveLabel" placeholder="请输入服务便签" />
        </el-form-item>
      </div>
      <div class="form-item">
        <el-form-item label="购买人数">
          <el-input-number class="numberInput" v-model="addForm.buyCount" placeholder="请输入购买人数" :controls="false" :min="0" :precision="0" />
        </el-form-item>
      </div>
      <div class="form-item">
        <el-form-item label="市场价格" prop="marketPrice">
          <el-input-number class="numberInput" v-model="addForm.marketPrice" placeholder="请输入市场价格" :controls="false" :min="0" :precision="2" />
        </el-form-item>
      </div>
      <div class="form-item">
        <el-form-item label="365价格" prop="price">
          <el-input-number class="numberInput" v-model="addForm.price" placeholder="请输入365价格" :controls="false" :min="0" :precision="2" />
        </el-form-item>
      </div>
      <div class="form-item">
        <el-form-item label="365服务最小价格" prop="minPrice">
          <el-input-number class="numberInput" v-model="addForm.minPrice" placeholder="请输入365服务最小价格" :controls="false" :min="0" :precision="2" />
        </el-form-item>
      </div>
      <div class="form-item">
        <el-form-item label="中心价格" prop="centerPrice">
          <el-input-number class="numberInput" v-model="addForm.centerPrice" placeholder="请输入中心价格" :controls="false" :min="0" :precision="2" />
        </el-form-item>
      </div>
      <div class="form-item">
        <el-form-item label="活动价格">
          <el-input-number class="numberInput" v-model="addForm.activityPrice" placeholder="请输入活动价格" :controls="false" :min="0" :precision="2" />
        </el-form-item>
      </div>
      <div class="form-item">
        <el-form-item label="服务最小价格" prop="minCountPrice">
          <el-input-number class="numberInput" v-model="addForm.minCountPrice" placeholder="请输入服务最小价格" :controls="false" :min="0" :precision="2" />
        </el-form-item>
      </div>
      <div class="form-item">
        <el-form-item label="服务最小数量" prop="minCount">
          <el-input-number class="numberInput" v-model="addForm.minCount" placeholder="请输入服务最小数量" :controls="false" :min="1" :precision="0" />
        </el-form-item>
      </div>
      <div class="form-item">
        <el-form-item label="服务最大数量" prop="maxCount">
          <el-input-number class="numberInput" v-model="addForm.maxCount" placeholder="请输入服务最大数量" :controls="false" :min="1" :precision="0" />
        </el-form-item>
      </div>
      <div class="form-item">
        <el-form-item label="价格备注">
          <el-input v-model="addForm.priceRemark" placeholder="请输入价格备注" />
        </el-form-item>
      </div>
      <div class="form-item">
        <el-form-item label="参与活动">
          <el-input v-model="addForm.participationUser" placeholder="请输入参与活动" />
        </el-form-item>
      </div>
      <div class="form-item">
        <el-form-item label="下单时间距离最小的服务时间（小时）" prop="doserveFirstTime">
          <el-input-number class="numberInput" v-model="addForm.doserveFirstTime" placeholder="请输入下单时间距离最小的服务时间（小时）" :controls="false" :min="0" :precision="1" :step="0.1" />
        </el-form-item>
      </div>
      <div class="form-item">
        <el-form-item label="下单时间距离最大的服务时间（天）" prop="doserveLatestTime">
          <el-input-number class="numberInput" v-model="addForm.doserveLatestTime" placeholder="请输入下单时间距离最大的服务时间（天）" :controls="false" :min="0" :precision="0" />
        </el-form-item>
      </div>

      <div class="form-item">
        <el-form-item label="营业起止时间">
          <el-time-picker
            v-model="addForm.businessTime"
            is-range
            range-separator="-"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            format="HH:mm"
            value-format="HH:mm"
            @change="changeBusiness"
          />
        </el-form-item>
      </div>
      <div class="form-item">
        <el-form-item label="活动状态">
          <DictSelect width="100%" v-model="addForm.activityStauts" :distList="filterDict('activity_stauts')" placeholder="请选择" />
        </el-form-item>
      </div>
      <div class="form-item">
        <el-form-item label="是否为预约服务">
          <el-radio-group v-model="addForm.canbook">
            <el-radio value="1">是</el-radio>
            <el-radio value="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
      </div>
      <div class="form-item">
        <el-form-item label="在 APP 显示">
          <el-radio-group v-model="addForm.showOnApp">
            <el-radio value="1">是</el-radio>
            <el-radio value="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
      </div>
      <div class="form-item">
        <el-form-item label="是否支持货到付款">
          <el-select v-model="addForm.canOfflinePay">
            <el-option key="0" label="不支持" value="0" />
            <el-option key="1" label="支持" value="1" />
          </el-select>
        </el-form-item>
      </div>
      <div class="form-item">
        <el-form-item label="是否支持会员卡">
          <el-select v-model="addForm.supportMemberCard">
            <el-option key="0" label="不支持" value="0" />
            <el-option key="1" label="支持" value="1" />
          </el-select>
        </el-form-item>
      </div>
      <div class="form-item">
        <el-form-item label="是否支持快递">
          <el-select v-model="addForm.deliver">
            <el-option key="0" label="不支持" value="0" />
            <el-option key="1" label="支持" value="1" />
          </el-select>
        </el-form-item>
      </div>
      <div class="form-item">
        <el-form-item label="是否支持发票">
          <el-select v-model="addForm.offerInvoice">
            <el-option key="0" label="不支持" value="0" />
            <el-option key="1" label="支持" value="1" />
          </el-select>
        </el-form-item>
      </div>
      <div class="form-item">
        <el-form-item label="排序">
          <el-input-number class="numberInput" v-model="addForm.orderNumber" placeholder="请输入排序" :controls="false" :min="0" :precision="0" />
        </el-form-item>
      </div>
      <div class="form-item">
        <el-form-item label="标签">
          <el-input v-model="addForm.tag" placeholder="请输入标签" />
        </el-form-item>
      </div>
      <div class="form-item">
        <el-form-item label="工时（小时）">
          <el-input-number class="numberInput" v-model="addForm.hoursSubsidy" :controls="false" :min="0.5" :max="15" :precision="1" placeholder="工时补贴系统专用字段" />
          <p class="el-form-item__error" style="color: #ccc">输入范围0.5~15，若输入小数只允许X.5，X=0~14</p>
        </el-form-item>
      </div>
      <div class="form-item">
        <el-form-item label="项目工时（小时）">
          <el-input-number class="numberInput" v-model="addForm.serveitemHours" :controls="false" :min="0.5" :max="15" :precision="1" placeholder="自建订单系统调用" />
          <p class="el-form-item__error" style="color: #ccc">输入范围0.5~15，若输入小数只允许X.5，X=0~14</p>
        </el-form-item>
      </div>
      <div class="form-item r-m-b-10">
        <el-form-item label="预计时长（小时）" prop="serviceTime">
          <el-input-number class="numberInput" v-model="addForm.serviceTime" :controls="false" :min="0.5" :max="15" :precision="1" placeholder="输入范围0.5~15" />
          <!-- <p class="el-form-item__error" style="color: #ccc;" >输入范围0.5~15，若输入小数只允许X.5，X=0~14</p> -->
        </el-form-item>
      </div>
      <div class="form-item item-100">
        <el-form-item label="备注">
          <el-input v-model="addForm.remark" type="textarea" :rows="3" maxlength="300" show-word-limit placeholder="请输入备注" />
        </el-form-item>
      </div>
      <div class="form-item item-100">
        <el-form-item label="活动摘要">
          <el-input v-model="addForm.summary" type="textarea" :rows="3" maxlength="300" show-word-limit placeholder="请输入活动摘要" />
        </el-form-item>
      </div>
    </el-form>
    <div class="button-box r-m-t-20">
      <el-button type="primary" @click="onSubmit" :loading="saving">保存</el-button>
      <el-button @click="onBack">取消</el-button>
      <el-button @click="openPreview">预览</el-button>
    </div>
  </el-scrollbar>
  <PreviewDialog ref="previewRef" :categoryList="categoryListData" :dict="dictMap" :imageUrl="addForm.appPhotoUrl" />
</template>
<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { FormRules, ElMessage } from 'element-plus'
import DictSelect from '@/components/DictSelect/index.vue'
import Editor from '../Components/Editor/Editor.vue'
import PreviewDialog from './components/preview-dialog/index.vue'
import { getCategoryTree, addProject, updateProject, getServeInfoDetail } from '@/api/serviceProject'
import { computed } from 'vue'
import { useTagsViewStore } from '@/store/modules/tagsView'
import { filterDict, dictMap } from '@/hooks/web/useDict'
import ImgUpload from './components/img-upload/index.vue'
import { config } from '@/config/axios/config'

const { push } = useRouter()
// @ts-ignore
defineOptions({
  // eslint-disable-next-line vue/component-definition-name-casing
  name: 'ProjectAdd'
})

const { back, replace } = useRouter()
const route = useRoute()

const onBack = () => {
  back()
}

const addDefault = reactive({
  categoryId: undefined,
  name: undefined,
  subhead: undefined,
  code: undefined,
  unit: undefined,
  appPhoto: '',
  appPhotoUrl: '',
  content: undefined,
  serveSummary: undefined,
  serveLabel: undefined,
  buyCount: undefined,
  marketPrice: undefined,
  price: undefined,
  minPrice: undefined,
  centerPrice: undefined,
  activityPrice: undefined,
  minCountPrice: undefined,
  minCount: undefined,
  maxCount: undefined,
  priceRemark: undefined,
  participationUser: undefined,
  businessTime: undefined,
  activityStauts: undefined,
  canbook: undefined,
  showOnApp: undefined,
  canOfflinePay: undefined,
  supportMemberCard: undefined,
  deliver: undefined,
  offerInvoice: undefined,
  orderNumber: undefined,
  tag: undefined,
  serveitemHours: undefined,
  hoursSubsidy: undefined,
  remark: undefined,
  summary: undefined,
  businessStartTime: '',
  businessEndTime: ''
})
let addForm = reactive<any>({ ...addDefault })

const addRules = reactive<FormRules>({
  categoryId: [{ required: true, message: '请选择服务类别', trigger: 'change' }],
  name: [{ required: true, pattern: /^[\u4e00-\u9fa5a-zA-Z0-9]{1,15}$/, message: '请正确填写名称（15字以内）', trigger: 'blur' }],
  code: [{ required: true, message: '请填写标识码', trigger: 'blur' }],
  unit: [{ required: true, message: '请填写单位', trigger: 'blur' }],
  appPhoto: [{ required: true, message: '请选上传图标', trigger: 'change' }],
  content: [{ required: true, message: '请填写服务介绍', trigger: 'blur' }],
  serveSummary: [{ required: true, message: '请填写服务摘要', trigger: 'blur' }],
  marketPrice: [{ required: true, message: '请填写市场价格', trigger: 'blur' }],
  price: [{ required: true, message: '请填写365价格', trigger: 'blur' }],
  minPrice: [{ required: true, message: '请填写365服务最小价格', trigger: 'blur' }],
  centerPrice: [{ required: true, message: '请填写中心价格', trigger: 'blur' }],
  minCountPrice: [{ required: true, message: '请填写服务最小价格', trigger: 'blur' }],
  minCount: [{ required: true, message: '请填写服务最小数量', trigger: 'blur' }],
  maxCount: [{ required: true, message: '请填写服务最大数量', trigger: 'blur' }],
  serviceTime: [{ required: true, message: '预计时长不可为空', trigger: 'blur' }],
  doserveFirstTime: [{ required: true, message: '请输入下单时间距离最小的服务时间（小时）', trigger: 'blur' }],
  doserveLatestTime: [{ required: true, message: '请输入下单时间距离最大的服务时间（天）', trigger: 'blur' }]
})
const changeBusiness = (val: any) => {
  if (val) {
    addForm.businessStartTime = val[0]
    addForm.businessEndTime = val[1]
    return
  }
  addForm.businessStartTime = ''
  addForm.businessEndTime = ''
}

const saving = ref(false)

const formRef = ref()

const onSubmit = async () => {
  try {
    await formRef.value.validate()
    save()
  } catch (err) {
    ElMessage.error('参数验证错误，请仔细填写表单数据!')
  }
}
// 关闭当前标签

const tagsViewStore = useTagsViewStore()
const visitedViews = computed(() => tagsViewStore.getVisitedViews)
const goDetail = () => {
  const obj = visitedViews.value.find((item) => item.path === route.path)
  if (obj) {
    tagsViewStore.delView(obj)
  }
  replace(`/order/projectDetail?id=${route.query.id}`)
}

const save = async () => {
  saving.value = true
  try {
    if (route.query.id) {
      await updateProject(addForm)
      ElMessage.success('修改成功')
      onClear()
      goDetail() //跳转详情
    } else {
      const { data } = await addProject(addForm)
      ElMessage.success('添加成功')
      onClear()
      // back()
      //跳转详情
      push(`/order/projectDetail?id=${data}`)
    }
  } finally {
    saving.value = false
  }
}

const onClear = () => {
  Object.assign(addForm, addDefault)
  formRef.value.resetFields()
}

const handleImgSuccess = (data: any) => {
  addForm.appPhoto = data.id.toString()
}
const handleImgRemove = () => {
  addForm.appPhoto = ''
}

const categoryTree = ref<any>([])
const categoryListData = ref([])
const getCategoryTreeList = async () => {
  const res = await getCategoryTree()
  categoryTree.value = mapList(res.data)
  categoryListData.value = flattenTree(categoryTree.value)
}

const mapList = (data: any) => {
  return data.map((item: any) => {
    if (item.children) {
      return {
        value: item.id,
        label: item.name,
        children: mapList(item.children)
      }
    } else {
      return {
        value: item.id,
        label: item.name
      }
    }
  })
}
function flattenTree(data) {
  let result: any = []

  data.forEach((item) => {
    result.push(item)
    if (item.children && item.children.length > 0) {
      result = result.concat(flattenTree(item.children))
    }
  })

  return result
}

const getProjectDetail = async () => {
  const res = await getServeInfoDetail(route.query.id)
  Object.assign(addForm, res.data)
  if (res.data.businessStartTime) {
    addForm.businessTime = [res.data.businessStartTime, res.data.businessEndTime]
  }
  if (res.data.appPhotoUrl) {
    addForm.appPhotoUrl = config.base_img.dev + res.data.appPhotoUrl
  }
}

const previewRef = ref()

const openPreview = async () => {
  try {
    await formRef.value.validate()
    previewRef.value.show(addForm)
  } catch (err) {
    ElMessage.error('参数验证错误，请仔细填写表单数据!')
  }
}

onMounted(() => {
  getCategoryTreeList()
  if (route.query.id) {
    getProjectDetail()
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
  position: relative;
  width: 33.33%;
  padding-right: 50px;
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
.avatar-uploader-icon {
  background-color: #fff;
  font-size: 28px;
  color: #8c939d;
  width: 80px;
  height: 80px;
  text-align: center;
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
}
.avatar {
  width: 80px;
  height: 80px;
  display: block;
}
:deep(.el-input-number .el-input__inner) {
  text-align: left;
}
:deep(.el-checkbox:last-of-type) {
  margin-right: 30px;
}
:deep(.long-label .el-form-item__label) {
  width: 260px !important;
}
:deep(.long-label .el-input-number) {
  width: 100% !important;
}
:deep(.el-upload-list--picture-card) {
  --el-upload-list-picture-card-size: 80px;
}
:deep(.el-upload--picture-card) {
  --el-upload-picture-card-size: 80px;
  background-color: #fff;
}
:deep(.disabled .el-upload--picture-card) {
  display: none;
}
.button-box {
  padding-left: 140px;
}
:deep(.el-input__wrapper) {
  min-width: 150px !important;
}
:deep(.el-select__wrapper) {
  min-width: 150px !important;
}

:deep(.el-form-item__label) {
  line-height: normal !important;
}
</style>
