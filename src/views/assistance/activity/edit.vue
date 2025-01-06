<template>
  <el-page-header @back="goBack" class="common-page-header">
    <template #content>
      <strong class="r-font-16">{{ route.query.id ? '编辑' : '新增' }}活动信息</strong>
    </template>
  </el-page-header>
  <el-scrollbar height="calc(100vh - 205px)" class="pr-scrollbar">
    <div class="detail-top-gray-info" v-if="route.query.id">
      <span class="r-m-r-16">来源: {{ platform }}</span>
      <span class="r-m-r-16">活动编号: {{ detail.id }}</span>
      <span class="r-m-r-16">创建: {{ detail.creatorName }} {{ detail.createTime }}</span>
      <span>最新更新: {{ detail.updaterName }} {{ detail.updateTime }}</span>
    </div>
    <el-form :model="form" ref="formRef" :rules="formRules" label-width="85px" class="r-m-t-20" :disabled="loading">
      <h2 class="label-title r-m-b-20">基础信息</h2>
      <el-form-item label="标题" prop="title">
        <el-input v-model="form.title" placeholder="请输入标题"></el-input>
      </el-form-item>
      <el-form-item label="参与组织" prop="activityCommunity">
        <el-input v-model="form.activityCommunity" placeholder="请选择参与组织" readonly @click="handleChooseOrg" class="pointer-input">
          <template #suffix>
            <Icon icon="ep:arrow-down" color="#c0c4cc" :size="14" />
          </template>
        </el-input>
      </el-form-item>
      <div class="grid-box">
        <el-form-item label="分类" prop="assort">
          <DictSelect v-model="form.assort" :distList="filterDict('assort')" placeholder="请选择分类" clearable style="width: 100%" />
        </el-form-item>
        <el-form-item label="活动分类" prop="activitySort">
          <DictSelect v-model="form.activitySort" :distList="filterDict('activity_sort')" placeholder="请选择活动分类" clearable style="width: 100%" />
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <DictSelect v-model="form.type" :distList="filterDict('comactivty_type')" placeholder="请选择类型" clearable style="width: 100%" />
        </el-form-item>
      </div>
      <div class="grid-box">
        <el-form-item label="活动地址" prop="regionCode" class="span-2">
          <Cascader placeholder="请选择活动地址" v-model="form.regionCode" style="width: 100%" @get-selected-text="getSelectedText" />
          <div class="zone-name-div">
            <el-input v-model="form.village" placeholder="请输入小区名称" style="width: 200px; margin-left: 10px" />
          </div>
        </el-form-item>
      </div>
      <div class="grid-box">
        <el-form-item label="详细地址" prop="detailAddress" class="span-2">
          <el-input v-model="form.detailAddress" placeholder="请输入详细地址" maxlength="64" />
        </el-form-item>
      </div>
      <el-form-item label="活动内容" prop="content">
        <Editor v-model="form.content" ref="editorRef" style="width: 100%" :height="300" />
      </el-form-item>
      <div class="grid-box">
        <el-form-item label="活动时间" prop="timeRange">
          <el-date-picker
            v-model="form.timeRange"
            type="datetimerange"
            range-separator="~"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            value-format="YYYY-MM-DD HH:mm:ss"
            format="YYYY-MM-DD HH:mm"
            clearable
            :editable="false"
          />
        </el-form-item>
      </div>
      <el-form-item label="活动状态" prop="taskStatus">
        <el-radio-group v-model="form.taskStatus">
          <el-radio label="马上发布" value="1"></el-radio>
          <el-radio label="活动关闭" value="3"></el-radio>
          <el-radio label="活动已完成" value="4"></el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="活动备注" prop="remark" v-if="['3', '4'].includes(form.taskStatus)">
        <el-input v-model="form.remark" :rows="4" placeholder="请输入活动状态变更的备注内容(非必填)" maxlength="300" show-word-limit type="textarea" />
      </el-form-item>
      <el-form-item label="活动照片" prop="activityPhotos">
        <ImgsUpload v-model="form.activityPhotos" :disabled="loading" :limit="10" />
      </el-form-item>
      <el-form-item label="附件文件" prop="activityFiles">
        <FilesUpload v-model="form.activityFiles" :disabled="loading" :limit="10" :size="2" tips="支持上传 Word、Excel、PDF、zip、rar(以上类型文件不超过2M)、JPG、PNG格式文件，最多支持上传10份文件" />
      </el-form-item>
    </el-form>
    <h2 class="label-title r-m-t-40">老人信息</h2>
    <div class="flex r-m-t-16 r-m-b-12">
      <el-button type="primary" @click="handleInvite">邀约</el-button>
      <el-button plain @click="handleSearch">搜索</el-button>
      <el-button plain @click="handleImport">导入</el-button>
      <el-button plain @click="handleRemoveMultiple">删除</el-button>
      <el-input v-model="keyword" placeholder="搜索姓名/联系电话/证件号码" clearable style="width: 300px; margin-left: 12px">
        <template #prefix><Icon icon="ep:search" :color="primaryColor" /></template>
      </el-input>
    </div>
    <el-table :data="oldManList" @selection-change="handleSelectionChange">
      <el-table-column width="45" align="center" type="selection"></el-table-column>
      <el-table-column label="序号" type="index" width="60" align="center"></el-table-column>
      <el-table-column label="操作" width="80" align="center">
        <template #default="{ $index }">
          <el-button type="primary" link @click="handleRemoveCustomer($index)">移除</el-button>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip label="姓名" prop="name" width="100"></el-table-column>
      <el-table-column show-overflow-tooltip label="性别" prop="sex" width="100" sortable="custom">
        <template #default="{ row }">{{ row.sex === '1' ? '男' : row.sex === '2' ? '女' : '' }}</template>
      </el-table-column>
      <el-table-column show-overflow-tooltip label="年龄" prop="age" width="100"></el-table-column>
      <el-table-column show-overflow-tooltip label="联系电话" prop="mobilephone"></el-table-column>
      <el-table-column show-overflow-tooltip label="证件号码" prop="idcard"></el-table-column>
      <el-table-column show-overflow-tooltip label="户籍地址" prop="domicileAllAddress"></el-table-column>
      <el-table-column show-overflow-tooltip label="现居地址" prop="currentAllAddress"></el-table-column>
    </el-table>
    <div class="r-m-t-40 r-p-l-85">
      <el-button type="primary" @click="handleConfirm">保存</el-button>
      <el-button plain @click="goBack">取消</el-button>
    </div>
  </el-scrollbar>
  <ChooseCustomer ref="chooseCustomerRef" @update-customers="updateCustomers" />
  <ChooseOrg ref="chooseOrgRef" @update-operators="updateOperators" />
  <ChooseInvite ref="chooseInviteRef" @update-customers="updateCustomers" />
  <ImportData ref="importDataRef" @update-customers="updateCustomers" />
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, computed } from 'vue'
import DictSelect from '/@/components/DictSelect/index.vue'
import Editor from '../../Components/Editor/Editor.vue'
import Cascader from '@/components/Cascader/index.vue'
import ImgsUpload from '/@/components/ImgsUpload/index.vue'
import FilesUpload from '/@/components/FilesUpload/index.vue'
import { ElMessage, ElMessageBox, FormInstance, FormRules } from 'element-plus'
import { activityDetail, activitySave, activityUpdate } from '@/api/assistance/activity'
import { useRouter, useRoute } from 'vue-router'
import { useTagsViewStore } from '@/store/modules/tagsView'
import ChooseCustomer from './components/ChooseCustomer.vue'
import ChooseOrg from './components/ChooseOrg.vue'
import ChooseInvite from './components/ChooseInvite.vue'
import ImportData from './components/ImportData.vue'
import { useAppStore } from '@/store/modules/app'
import { filterDict } from '@/hooks/web/useDict'
// @ts-ignore
defineOptions({
  name: 'ActivityAdd'
})
const appStore = useAppStore()
const primaryColor = computed(() => appStore.getTheme.elColorPrimary)

const tagsViewStore = useTagsViewStore()
const visitedViews = computed(() => tagsViewStore.getVisitedViews)

onMounted(() => {
  loadData()
})

const loadData = async () => {
  if (!route.query.id) return
  try {
    loading.value = true
    const { data } = await activityDetail(route.query.id as string)
    Object.assign(detail, data)
    form.activityAddress = data.activityAddress
    form.activityCommunity = data.activityCommunity
    form.activityFiles = data.activityFileList || []
    form.activityPhotos = data.activityPhotoList || []
    form.activitySort = data.activitySort
    form.assort = data.assort
    form.city = data.city
    form.comNameAndOrg = data.comNameAndOrg
    form.community = data.community
    form.content = data.content
    form.county = data.county
    form.customerList = data.customerInfoVOList || []
    form.customerIds = data.customerInfoVOList && data.customerInfoVOList.length ? data.customerInfoVOList.map((item) => item.id).join(',') : ''
    form.detailAddress = data.detailAddress
    form.endTime = data.endTime
    form.id = data.id
    form.idNameComString = data.idNameComString
    form.operatorIds = data.operatorIds && data.operatorIds.length ? data.operatorIds.join(',') : ''
    form.platform = data.platform
    form.province = data.province
    form.regionCode = data.regionCode ? data.regionCode.split(',') : []
    form.startTime = data.startTime
    form.street = data.street
    form.taskStatus = data.taskStatus || '0'
    form.title = data.title
    form.type = data.type
    form.verificationCode = data.verificationCode
    form.village = data.village
    form.timeRange = [data.startTime, data.endTime]
  } finally {
    loading.value = false
  }
}

const form = reactive({
  activityAddress: '', // 活动地址，省市区街道社区+详细地址
  activityCommunity: '', // 参与组织名称（逗号拼接）
  activityFiles: [] as any[],
  activityPhotos: [] as any[],
  activitySort: '', // 活动分类（字典-activity_sort）
  assort: '', // 分类（字典-assort）
  city: '',
  comNameAndOrg: '', // 参与人员id、组织名称；数据格式=人员1id:组织名称,人员2id:组织名称
  community: '',
  communityId: '', // 照料中心id(无用)
  content: '',
  county: '',
  customerIds: '', // 参加活动的老人ids（英文逗号分隔）
  customerList: [] as any[], // 前端自定义字段，参加活动的老人列表
  delCustomerIds: '', // 移除活动的老人ids（英文逗号分隔）
  detailAddress: '',
  endTime: '',
  flag: '', // 标识（0-助老，1-照料）
  id: '',
  idNameComString: '', // 参与人员id;人员名称;组织名称；数据格式=人员1id,人员2id;姓名1,姓名2;组织名称1,组织名称2
  operatorIds: '', // 参与人员ids（英文逗号分隔）
  personalStatus: '', // 个人状态(无用)
  platform: '3', // 所属平台
  province: '',
  regionCode: [], // 地区代码，传给后端时逗号拼接
  remark: '',
  startTime: '',
  street: '',
  taskStatus: '0', // 活动状态（0-草稿，1-已发布[1未开始2进行中]，3-已关闭，4-已完成）
  title: '',
  type: '', // 类型（字典-comactivt_type）
  village: '', // 小区名称
  verificationCode: '',
  timeRange: [] as string[] // 前端自定义字段，活动时间
})
const validateAddress = (_rule: any, value: any, callback: any) => {
  if (!(value && value.length)) return callback(new Error('请选择活动地址'))
  if (!form.village) return callback(new Error('请输入小区名称'))
  callback()
}
const formRules = reactive<FormRules>({
  title: { required: true, message: '请输入活动标题', trigger: 'blur' },
  activityCommunity: { required: true, message: '请选择参与组织', trigger: 'change' },
  assort: { required: true, message: '请选择分类', trigger: 'change' },
  activitySort: { required: true, message: '请选择活动分类', trigger: 'change' },
  type: { required: true, message: '请选择类型', trigger: 'change' },
  regionCode: { required: true, validator: validateAddress, trigger: 'blur' },
  detailAddress: { required: true, message: '请输入详细地址', trigger: 'blur' },
  content: { required: true, message: '请输入活动内容', trigger: 'none' },
  timeRange: { required: true, type: 'array', message: '请选择活动时间', trigger: 'change' },
  activityPhotos: { required: true, type: 'array', message: '请上传活动照片', trigger: 'none' }
})

const detail = reactive({
  platform: '',
  createTime: '',
  creatorName: '',
  id: '',
  updaterName: '',
  updateTime: ''
})
const platform = computed(() => {
  return detail.platform === '2' ? '助老员APP' : detail.platform === '3' ? '平台' : ''
})

const keyword = ref('')
const oldManList = computed(() => {
  return form.customerList.filter((item) => {
    return item.name.includes(keyword.value) || item.mobilephone.includes(keyword.value) || item.idcard.includes(keyword.value)
  })
})

const getSelectedText = (val: string) => {
  if (val) {
    form.activityAddress = val.replaceAll('/', '')
  }
}

const chooseCustomerRef = ref<InstanceType<typeof ChooseCustomer>>()
const handleSearch = () => {
  chooseCustomerRef.value?.open(form.customerList.map((item) => item.id))
}

const chooseInviteRef = ref<InstanceType<typeof ChooseInvite>>()
const handleInvite = () => {
  chooseInviteRef.value?.open(form.customerList.map((item) => item.id))
}
const updateCustomers = (list: any[]) => {
  const ids = form.customerList.map((item) => Number(item.id))
  list.forEach((item) => {
    if (!ids.includes(Number(item.id))) {
      form.customerList.push(item)
    }
  })
}

const importDataRef = ref<InstanceType<typeof ImportData>>()
const handleImport = () => {
  importDataRef.value?.open()
}

const loading = ref(false)
const formRef = ref<FormInstance>()
const handleConfirm = () => {
  if (loading.value) return
  formRef.value?.validate(async (val) => {
    if (!val) return
    if (!form.customerList.length) {
      ElMessage.error('请选择老人')
      return
    }
    try {
      loading.value = true
      const obj = visitedViews.value.find((item) => item.fullPath === route.fullPath)
      if (obj) {
        tagsViewStore.delView(obj)
      }
      if (form.id) {
        await activityUpdate(getParams())
        router.replace(`/assistance/activity/detail?id=${form.id}`)
      } else {
        const { data } = await activitySave(getParams())
        router.replace(`/assistance/activity/detail?id=${data}`)
      }
      loading.value = false
    } catch {
      loading.value = false
    }
  })
}

// 编辑活动的时候，如若删除老人，则删掉老人的id都要保存起来传给后端
const getDelCustomerIds = () => {
  if (!form.id) return ''
  const newIds = form.customerList.map((item) => item.id.toString())
  const oldIds = form.customerIds ? form.customerIds.split(',') : []
  for (let i = 0; i < oldIds.length; i++) {
    if (newIds.includes(oldIds[i])) {
      oldIds.splice(i, 1)
      i--
    }
  }
  return oldIds.join(',')
}

const getParams = () => {
  return {
    activityAddress: form.regionCode ? form.activityAddress : '', // 活动地址，省市区街道社区
    activityCommunity: form.activityCommunity, // 参与组织名称（逗号拼接）
    activityFiles: form.activityFiles.map((item) => item.id).join(','),
    activityPhotos: form.activityPhotos.map((item) => item.id).join(','),
    activitySort: form.activitySort, // 活动分类（字典-activity_sort）
    assort: form.assort, // 分类（字典-assort）
    city: form.regionCode[1],
    comNameAndOrg: form.comNameAndOrg, // 参与人员id、组织名称；数据格式=人员1id:组织名称,人员2id:组织名称
    community: form.regionCode[4],
    content: form.content,
    county: form.regionCode[2],
    customerIds: form.customerList.map((item) => item.id).join(','), // 参加活动的老人ids（英文逗号分隔）
    delCustomerIds: getDelCustomerIds(),
    detailAddress: form.detailAddress,
    endTime: form.timeRange[1],
    id: form.id,
    idNameComString: form.idNameComString, // 参与人员id;人员名称;组织名称；数据格式=人员1id,人员2id;姓名1,姓名2;组织名称1,组织名称2
    operatorIds: form.operatorIds, // 参与人员ids（英文逗号分隔）
    platform: '3', // 所属平台
    province: form.regionCode[0],
    regionCode: form.regionCode.join(','), // 地区代码
    remark: form.remark,
    startTime: form.timeRange[0],
    street: form.regionCode[3],
    taskStatus: form.taskStatus, // 活动状态（0-草稿，1-已发布[1未开始2进行中]，3-已关闭，4-已完成）
    title: form.title,
    type: form.type, // 类型（字典-comactivt_type）
    village: form.village, // 小区名称
    verificationCode: form.verificationCode
  }
}

const handleRemoveCustomer = (index: number) => {
  ElMessageBox.confirm('是否确认删除该老人？', '操作提示', { type: 'warning' })
    .then(() => {
      form.customerList.splice(index, 1)
    })
    .catch(() => {})
}

const handleRemoveMultiple = () => {
  if (!multipleSelection.value.length) return ElMessage.error('请选择要删除的老人')
  ElMessageBox.confirm('是否确认删除选中老人？', '操作提示', { type: 'warning' })
    .then(() => {
      const ids = multipleSelection.value.map((item) => item.id)
      for (let i = 0; i < form.customerList.length; i++) {
        if (ids.includes(form.customerList[i].id)) {
          form.customerList.splice(i, 1)
          i--
        }
      }
    })
    .catch(() => {})
}

const chooseOrgRef = ref<InstanceType<typeof ChooseOrg>>()
const handleChooseOrg = () => {
  if (form.id) {
    const list = form.idNameComString.split(';')
    const ids = list[0].split(',')
    const names = list[1].split(',')
    const orgs = list[2].split(',')
    chooseOrgRef.value?.open(
      ids.map((id, index) => ({
        userId: Number(id),
        userName: names[index],
        parentName: orgs[index]
      }))
    )
  } else {
    chooseOrgRef.value?.open()
  }
}

// 更新参与组织数据
const updateOperators = (list: any[]) => {
  const set = new Set(list.map((item) => item.parentName)) // 去重
  form.activityCommunity = [...set].join(',') // 参与组织名称（逗号拼接）
  form.comNameAndOrg = list.map((item) => `${item.userId}:${item.parentName}`).join(',') // 参与人员id、组织名称；数据格式=人员1id:组织名称,人员2id:组织名称
  form.operatorIds = list.map((item) => item.userId).join(',') // 参与人员ids（英文逗号分隔）
  let ids = ''
  let names = ''
  let orgs = ''
  list.forEach((item, index) => {
    ids += index === list.length - 1 ? item.userId : `${item.userId},`
    names += index === list.length - 1 ? item.userName : `${item.userName},`
    orgs += index === list.length - 1 ? item.parentName : `${item.parentName},`
  })
  form.idNameComString = `${ids};${names};${orgs}` // 参与人员id;人员名称;组织名称；数据格式=人员1id,人员2id;姓名1,姓名2;组织名称1,组织名称2
}

const multipleSelection = ref<any[]>([])
const handleSelectionChange = (val: any[]) => {
  multipleSelection.value = val
}

const router = useRouter()
const route = useRoute()
const goBack = () => {
  const obj = visitedViews.value.find((item) => item.fullPath === route.fullPath)
  if (obj) {
    tagsViewStore.delView(obj)
  }
  router.replace('/assistance/activity')
}
</script>

<style lang="less" scoped>
.edit-activity-header {
  padding-bottom: 20px;
  border-bottom: 1px solid #ebe9e6;
}
.grid-box {
  display: grid;
  gap: 0 80px;
  grid-template-columns: repeat(3, 1fr);
}
.span-2 {
  grid-column: span 2;
}
.zone-name-div {
  position: absolute;
  right: -210px;
}
.pointer-input {
  :deep(.el-input__wrapper) {
    cursor: pointer;
  }
  :deep(.el-input__inner) {
    cursor: pointer;
  }
}
:deep(.file-ul) {
  width: 400px;
}
@media only screen and (max-width: 1440px) {
  .grid-box {
    gap: 0 40px;
  }
}
</style>
