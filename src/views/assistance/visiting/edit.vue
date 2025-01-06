<template>
  <el-page-header @back="goBack" class="common-page-header">
    <template #content>
      <strong class="r-font-16">{{ route.query.id ? '编辑' : '新增' }}拜访信息</strong>
    </template>
  </el-page-header>
  <el-scrollbar height="calc(100vh - 205px)" class="pr-scrollbar">
    <div class="detail-top-gray-info" v-if="route.query.id">
      <span class="r-m-r-10">来源: {{ platform }}</span>
      <span class="r-m-r-10">创建人: {{ detail.creatorName }}</span>
      <span>创建时间: {{ detail.createTime }}</span>
    </div>
    <el-form :model="form" ref="formRef" :rules="formRules" label-width="120px" class="r-m-t-20" :disabled="loading">
      <div class="grid-box">
        <el-form-item label="创建人">
          <el-input v-model="form.creatorName" disabled />
        </el-form-item>
        <el-form-item label="拜访人" prop="visitOperatorName" class="pointer-form-item">
          <el-input v-model="form.visitOperatorName" placeholder="请选择拜访人" readonly @click="handleChoosePerson('visitOperatorName')"></el-input>
        </el-form-item>
        <el-form-item label="共同拜访(志愿者)" prop="volunteerNames" class="pointer-form-item" v-if="form.visitMode === '1'">
          <el-input v-model="form.volunteerNames" placeholder="请选择志愿者" readonly @click="handleChoosePerson('volunteerNames')"></el-input>
        </el-form-item>
      </div>
      <div class="grid-box" v-if="form.visitMode === '1'">
        <el-form-item label="共同拜访(内部)" prop="operatorNames" class="pointer-form-item">
          <el-input v-model="form.operatorNames" placeholder="请选择共同拜访(内部)" readonly @click="handleChoosePerson('operatorNames')"></el-input>
        </el-form-item>
        <el-form-item label="共同拜访(外部)" prop="externalNames" class="span-2">
          <el-input v-model="form.externalNames" placeholder="多人请用英文逗号分隔"></el-input>
        </el-form-item>
      </div>
      <div class="grid-box">
        <el-form-item label="拜访客户" prop="visitCustomerName" :class="{ 'pointer-form-item': !form.id }">
          <el-input v-model="form.visitCustomerName" placeholder="请选择拜访客户" readonly @click="handleChoosePerson('visitCustomerName')"></el-input>
          <div v-if="form.visitCustomerName" class="customer-info">证件号: {{ form.visitCustomerIdCard }}&nbsp;&nbsp;联系电话: {{ form.visitCustomerMobilePhone }}</div>
          <router-link to="/customer" class="new-customer-link" v-if="!form.id && !fromCustomerDetail">新增</router-link>
        </el-form-item>
      </div>
      <div class="grid-box">
        <el-form-item label="拜访时间" prop="visitTime">
          <el-date-picker
            v-model="form.visitTime"
            type="datetime"
            placeholder="请选择拜访时间"
            value-format="YYYY-MM-DD HH:mm"
            format="YYYY-MM-DD HH:mm"
            style="width: 100%"
            :disabled-date="disabledDate"
            :editable="false"
          />
        </el-form-item>
        <el-form-item label="拜访方式" prop="visitMode">
          <DictSelect v-model="form.visitMode" :distList="filterDict('visit_mode')" placeholder="请选择拜访方式" :clearable="true" style="width: 100%" @change="visitModeChange" />
        </el-form-item>
        <el-form-item label="归属项目" prop="belongProjectType">
          <DictSelect v-model="form.belongProjectType" :distList="filterDict('project_type')" placeholder="请选择归属项目" :clearable="true" style="width: 100%" />
        </el-form-item>
      </div>
      <div class="grid-box">
        <el-form-item label="所属区域" prop="belongList" class="span-2">
          <Cascader placeholder="请选择所属区域" v-model="form.belongList" style="width: 100%" ref="belongCascaderRef" />
        </el-form-item>
      </div>
      <div class="grid-box" v-if="form.visitMode === '1'">
        <el-form-item label="拜访地址" prop="visitRegionList" class="span-2">
          <Cascader placeholder="请选择拜访地址" v-model="form.visitRegionList" style="width: 100%" ref="visitCascaderRef" />
          <div class="zone-name-div">
            <el-input v-model="form.visitVillage" placeholder="请输入小区名称" style="width: 200px; margin-left: 10px" />
          </div>
        </el-form-item>
      </div>
      <div class="grid-box" v-if="form.visitMode === '1'">
        <el-form-item label="详细地址" prop="visitDetailAddress" class="span-2">
          <el-input v-model="form.visitDetailAddress" placeholder="请输入详细地址" maxlength="64" />
        </el-form-item>
      </div>
      <div class="grid-box" v-if="['1', '2'].includes(form.visitMode) && xiamenFlag && isInsideAccount">
        <el-form-item label="拜访标签" prop="visitLabel" class="tag-form-item span-2">
          <section class="tag-box" v-if="form.visitLabel.length">
            <div v-for="(item, index) in form.visitLabel" :key="item + index" class="primary-color underline">{{ index + 1 }}. {{ item }}</div>
          </section>
          <div class="add-btn" :class="{ disabled: loading }" @click="handleChooseTag">选择拜访标签</div>
        </el-form-item>
      </div>
      <el-form-item label="拜访内容" prop="visitContent">
        <el-input v-model="form.visitContent" placeholder="请输入拜访内容" maxlength="300" show-word-limit :rows="4" resize="none" type="textarea" />
      </el-form-item>
      <el-form-item label="信息反馈" prop="infoFeedback" v-if="['1', '2'].includes(form.visitMode) && xiamenFlag && isInsideAccount">
        <el-input v-model="form.infoFeedback" placeholder="请输入信息反馈" maxlength="300" show-word-limit :rows="4" resize="none" type="textarea" />
      </el-form-item>
      <el-form-item label="结果跟踪" prop="resultTracking" v-if="['1', '2'].includes(form.visitMode) && xiamenFlag && isInsideAccount">
        <el-input v-model="form.resultTracking" placeholder="请输入结果跟踪" maxlength="300" show-word-limit :rows="4" resize="none" type="textarea" />
      </el-form-item>
      <el-form-item label="拜访照片" prop="visitPhotos" v-if="['1', '2'].includes(form.visitMode)">
        <ImgsUpload v-model="form.visitPhotos" :disabled="loading" />
      </el-form-item>
      <el-form-item label="拜访结束照片" prop="finishPhotoUrl" class="label-1" v-if="form.visitMode === '1' && xiamenFlag">
        <ImgUpload v-model="form.finishPhotoUrl" @success="handleImgSuccess" @remove="handleImgRemove" :disabled="loading" show-limit />
      </el-form-item>
      <div class="grid-box" v-if="form.visitMode === '1' && xiamenFlag">
        <el-form-item label="拜访时长" prop="visitMinute">
          <el-input v-model="form.visitMinute" placeholder="请输入1~180内的整数">
            <template #append>分钟</template>
          </el-input>
        </el-form-item>
      </div>
      <el-form-item class="r-m-t-20">
        <el-button type="primary" :loading="loading" @click="handleConfirm(1)">完成</el-button>
        <el-button type="primary" :loading="loading" plain @click="handleConfirm(0)" v-if="form.editStatus !== '1'">存草稿</el-button>
        <el-button plain @click="goBack">取消</el-button>
      </el-form-item>
    </el-form>
  </el-scrollbar>
  <ChoosePerson ref="choosePersonRef" @confirm-choose-person="confirmChoosePerson" />
  <ChooseTag ref="chooseTagRef" @confirm-choose-tag="confirmChooseTag" />
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, computed } from 'vue'
import DictSelect from '@/components/DictSelect/index.vue'
import Cascader from '@/components/Cascader/index.vue'
import ImgsUpload from '@/components/ImgsUpload/index.vue'
import ImgUpload from '@/components/ImgUpload/index.vue'
import ChoosePerson from './components/ChoosePerson.vue'
import ChooseTag from './components/ChooseTag.vue'
import { FormInstance, FormRules } from 'element-plus'
import { intRegexp } from '@/utils/validate'
import { useCache } from '@/hooks/web/useCache'
import { useAppStoreWithOut } from '@/store/modules/app'
import { visitingDetail, visitingSave, visitingUpdate } from '@/api/assistance/visiting'
import { useRouter, useRoute } from 'vue-router'
import { useTagsViewStore } from '@/store/modules/tagsView'
import { filterDict } from '@/hooks/web/useDict'

const tagsViewStore = useTagsViewStore()
const visitedViews = computed(() => tagsViewStore.getVisitedViews)

const { wsCache } = useCache()
const xiamenFlag = ref(wsCache.get('xiamenFlag'))

const appStore = useAppStoreWithOut()
const userInfo = wsCache.get(appStore.getUserInfo)
const isInsideAccount = userInfo.user.dept.attribute === '0' //'0'内部，'1':外部
// const isXiaMen = ref(false)
const fromCustomerDetail = ref(false) // 标记: 来自客户详情页面，来自客户详情页面的不支持更改客户

onMounted(() => {
  // const areaInfo = wsCache.get('areaInfo')
  // isXiaMen.value = Boolean(areaInfo && areaInfo.city === '厦门市')
  if (route.query.id) {
    loadDetail(route.query.id as string)
  } else {
    form.companyName = userInfo.user.dept.name
    form.creatorName = userInfo.user.nickname
    form.visitOperatorId = userInfo.user.id
    form.visitOperatorName = userInfo.user.nickname
    initBelongRegion()
    const data = sessionStorage.getItem('visiting-customer-info')
    if (data) {
      fromCustomerDetail.value = true
      Object.assign(form, JSON.parse(data))
    } else {
      fromCustomerDetail.value = false
    }
  }
})

// 初始化所属区域
const initBelongRegion = () => {
  const dept = userInfo.user.dept
  if (!dept) return
  if (!(dept.province && dept.city && dept.county && dept.street && dept.community)) return
  form.belongList = [dept.province, dept.city, dept.county, dept.street, dept.community]
}

const loadDetail = async (id: string) => {
  if (loading.value) return
  try {
    loading.value = true
    const { data } = await visitingDetail(id)
    Object.assign(detail, data)
    form.belongProjectId = data.belongProjectId
    form.belongProjectName = data.belongProjectName
    form.belongProjectType = data.belongProjectType
    form.belongRegion = data.belongRegion
    form.companyName = data.companyName
    form.creatorName = data.creatorName
    form.customerId = data.customerId
    form.externalNames = data.externalNames
    form.finishPhoto = data.finishPhoto
    form.finishPhotoUrl = data.finishPhotoAttach && data.finishPhotoAttach.url
    form.id = data.id
    form.infoFeedback = data.infoFeedback
    form.operatorIds = data.operatorIds.join(',')
    form.operatorNames = data.operatorNames.join(',')
    form.platform = data.platform
    form.resultTracking = data.resultTracking
    form.visitContent = data.visitContent
    form.visitCustomerIdCard = data.visitCustomerIdCard
    form.visitCustomerMobilePhone = data.visitCustomerMobilePhone
    form.visitCustomerName = data.visitCustomerName
    form.visitDetailAddress = data.visitDetailAddress
    form.visitLabel = data.visitLabel
    form.visitMinute = data.visitMinute ? String(data.visitMinute) : ''
    form.visitMode = data.visitMode
    form.visitOperatorId = data.visitOperatorId
    form.visitOperatorName = data.visitOperatorName
    form.visitPhotos = data.visitPhotoList || []
    form.visitTime = data.visitTime
    form.visitProvince = data.visitProvince
    form.visitCity = data.visitCity
    form.visitCounty = data.visitCounty
    form.visitStreet = data.visitStreet
    form.visitCommunity = data.visitCommunity
    form.visitVillage = data.visitVillage
    form.volunteerIds = data.volunteerIds.join(',')
    form.volunteerNames = data.volunteerNames.join(',')
    form.voice = data.voice
    form.voiceLength = data.voiceLength
    form.visitAppendAddress = data.visitAppendAddress
    form.visitLocationCode = data.visitLocationCode
    form.editStatus = data.editStatus.toString()
    const currentList: (string | null)[] = [data.visitProvinceCode, data.visitCityCode, data.visitCountyCode, data.visitStreetCode, data.visitCommunityCode]
    currentList.forEach((item) => {
      if (item) {
        form.visitRegionList.push(item)
      }
    })
    const belongList: (string | null)[] = [data.belongProvince, data.belongCity, data.belongCounty, data.belongStreet, data.belongCommunity]
    belongList.forEach((item) => {
      if (item) {
        form.belongList.push(item)
      }
    })
  } finally {
    loading.value = false
  }
}

const form = reactive({
  belongCity: '', // 所属城市
  belongCommunity: '', // 所属社区
  belongCounty: '', // 所属县/区
  belongProjectId: '',
  belongProjectName: '', // 项目名称
  belongProjectType: '', // 项目类型
  belongProvince: '', // 所属省份
  belongRegion: '', // 所属区域字符串拼接
  belongStreet: '', // 所属街道
  belongList: [] as string[],
  companyName: '',
  creatorName: '', // 前端显示字段，创建者
  customerId: '', // 被访客户id
  editStatus: '', // 编辑状态 0=草稿 1-已完成
  externalNames: '',
  finishPhoto: '', // 拜访结束照片
  finishPhotoUrl: '',
  id: '',
  imgHeight: '', // 图片高度
  imgWidth: '', // 图片宽度
  infoFeedback: '', // 信息反馈
  isRead: false, // 已读标志
  isSent: false, // 发送标志
  isVerify: false, // 校验标志
  latitude: '', // 纬度
  longitude: '', // 经度
  minzhengId: '', // 民政id
  oldId: '', // 旧id
  operatorDepartments: '', // 拜访人员部门
  operatorIds: '', // 拜访人员ids（外部）
  operatorNameColors: '', // 拜访人员心情
  operatorNames: '', // 拜访人员姓名（外部）
  org: '', // 组织机构
  platform: '', // 平台
  regionCode: '', // 拜访地区代码
  registerAddress: '', // 登记地址
  remark: '',
  resultTracking: '', // 结果跟踪
  successPackContentId: '', // 成功包内容ID
  userId: '', // 用户ID
  visitAppendAddress: '', // 拜访附加地址
  visitCity: '',
  visitCityCode: '',
  visitCommunity: '', // 拜访社区
  visitCommunityCode: '', // 拜访社区编码
  visitContent: '', // 拜访内容
  visitCounty: '',
  visitCountyCode: '',
  visitRegionList: [] as string[],
  visitCustomerIdCard: '', // 被访客户身份证号
  visitCustomerMobilePhone: '', // 被访客户手机号
  visitCustomerName: '', // 被访客户姓名
  visitDetailAddress: '', // 拜访详细地址
  visitLabel: [] as any[], // 拜访标签，提交后端时是逗号分隔的字符串
  visitLocationCode: '', // 定位地址区域code
  visitMinute: '', // 拜访时长
  visitMode: '', // 拜访方式
  visitOperatorId: '', // 拜访人员id（内部）
  visitOperatorName: '', // 拜访人员姓名（内部）
  visitPhotos: [] as any[], // 拜访照片
  visitProvince: '',
  visitProvinceCode: '',
  visitStreet: '',
  visitStreetCode: '',
  visitTime: '', // 拜访时间
  visitVillage: '', // 拜访小区
  voice: '', // 声音
  voiceLength: '', // 声音长度
  volunteerDepartments: '', // 志愿者部门
  volunteerIds: '', // 志愿者ids
  volunteerNameColors: '', // 志愿者心情
  volunteerNames: '', // 志愿者姓名
  workTaskId: '' // 工作任务ID
})
const detail = reactive({
  platform: '',
  createTime: '',
  creatorName: ''
})
const platform = computed(() => {
  return detail.platform === '2' ? '助老员APP' : detail.platform === '3' ? '平台' : ''
})

const validateMinute = (_rule: any, value: any, callback: any) => {
  if (!value) return callback()
  if (!intRegexp.test(value)) return callback(new Error('请输入1~180内的整数'))
  if (Number(value) < 1 || Number(value) > 180) {
    callback(new Error('请输入1~180内的整数'))
  } else {
    callback()
  }
}
const validateTime = (_rule: any, value: any, callback: any) => {
  if (!value) return callback(new Error('请选择拜访时间'))
  if (new Date(value) >= new Date()) return callback(new Error('拜访时间不能大于北京时间'))
  callback()
}
const formRules = reactive<FormRules>({
  visitCustomerName: { required: true, message: '请选择拜访客户', trigger: 'change' },
  visitTime: { required: true, validator: validateTime, trigger: 'change' },
  visitMode: { required: true, message: '请选择拜访方式', trigger: 'change' },
  belongList: { required: true, type: 'array', message: '请选择所属区域', trigger: 'change' },
  visitRegionList: { required: true, type: 'array', message: '请选择拜访地址', trigger: 'change' },
  visitDetailAddress: { required: true, message: '请输入详细地址', trigger: 'blur' },
  visitLabel: { required: true, type: 'array', message: '请选择拜访标签', trigger: 'none' },
  visitContent: { required: true, message: '请输入拜访内容', trigger: 'blur' },
  visitMinute: { required: false, validator: validateMinute, trigger: 'blur' }
})

// 删除当前页签
const delViewTag = () => {
  const obj = visitedViews.value.find((item) => item.fullPath === route.fullPath)
  if (obj) {
    tagsViewStore.delView(obj)
  }
}

const loading = ref(false)
const formRef = ref<FormInstance>()
const handleConfirm = (editStatus: 0 | 1) => {
  if (loading.value) return
  formRef.value?.validate(async (val) => {
    if (!val) return
    try {
      loading.value = true
      if (form.id) {
        await visitingUpdate(getParams(editStatus))
        delViewTag()
        router.push(`/assistance/visiting/detail?id=${form.id}`)
      } else {
        const { data } = await visitingSave(getParams(editStatus))
        delViewTag()
        router.push(`/assistance/visiting/detail?id=${data}`)
      }
      loading.value = false
      sessionStorage.removeItem('visiting-customer-info')
      fromCustomerDetail.value = false
    } catch {
      loading.value = false
    }
  })
}

const belongCascaderRef = ref<InstanceType<typeof Cascader>>()
const visitCascaderRef = ref<InstanceType<typeof Cascader>>()

// 获取请求参数 0=草稿 1=已完成
const getParams = (editStatus: 0 | 1) => {
  getBelongSelectedText()
  const params: any = {
    id: form.id,
    companyName: form.companyName,
    visitOperatorName: form.visitOperatorName,
    visitOperatorId: form.visitOperatorId,
    visitCustomerName: form.visitCustomerName,
    customerId: form.customerId,
    visitCustomerIdCard: form.visitCustomerIdCard,
    visitCustomerMobilePhone: form.visitCustomerMobilePhone,
    visitTime: form.visitTime,
    visitMode: form.visitMode,
    belongProjectType: form.belongProjectType,
    belongProvince: form.belongList[0],
    belongCity: form.belongList[1],
    belongCounty: form.belongList[2],
    belongStreet: form.belongList[3],
    belongCommunity: form.belongList[4],
    belongRegion: getBelongSelectedText(),
    visitContent: form.visitContent,
    editStatus
  }
  if (form.visitMode === '1') {
    // 入户
    getVisitSelectedText() // 为拜访地址省市区赋值中文名称
    params.volunteerNames = form.volunteerNames
    params.volunteerIds = form.volunteerIds
    params.operatorNames = form.operatorNames
    params.operatorIds = form.operatorIds
    params.externalNames = form.externalNames
    params.visitProvinceCode = form.visitRegionList[0]
    params.visitProvince = form.visitProvince
    params.visitCityCode = form.visitRegionList[1]
    params.visitCity = form.visitCity
    params.visitCountyCode = form.visitRegionList[2]
    params.visitCounty = form.visitCounty
    params.visitStreetCode = form.visitRegionList[3]
    params.visitStreet = form.visitStreet
    params.visitCommunityCode = form.visitRegionList[4]
    params.visitCommunity = form.visitCommunity
    params.visitVillage = form.visitVillage
    params.visitDetailAddress = form.visitDetailAddress
    params.visitLabel = form.visitLabel.join(',')
    params.infoFeedback = form.infoFeedback
    params.resultTracking = form.resultTracking
    params.visitPhotos = form.visitPhotos.map((item) => item.id).join(',')
    params.finishPhoto = form.finishPhoto
    params.visitMinute = form.visitMinute
    params.voice = form.voice
    params.voiceLength = form.voiceLength
    params.visitAppendAddress = form.visitAppendAddress
    params.visitLocationCode = form.visitLocationCode
  } else if (form.visitMode === '2') {
    // 电话
    params.visitLabel = form.visitLabel.join(',')
    params.infoFeedback = form.infoFeedback
    params.resultTracking = form.resultTracking
    params.visitPhotos = form.visitPhotos.map((item) => item.id).join(',')
  }
  return params
}

// 获取所属区域字符串拼接
const getBelongSelectedText = () => {
  if (!belongCascaderRef.value) return ''
  const value = belongCascaderRef.value.getCascaderLabel()
  return value.replaceAll('/', '')
}
// 获取拜访地址字符串拼接
const getVisitSelectedText = () => {
  if (!visitCascaderRef.value) return
  const value = visitCascaderRef.value.getCascaderLabel()
  const list = value.split('/')
  const nameList = ['visitProvince', 'visitCity', 'visitCounty', 'visitStreet', 'visitCommunity']
  for (let i = 0; i < list.length; i++) {
    form[nameList[i]] = list[i]
  }
}

const router = useRouter()
const route = useRoute()
const goBack = () => {
  router.back()
  sessionStorage.removeItem('visiting-customer-info')
  fromCustomerDetail.value = false
}

const choosePersonRef = ref<InstanceType<typeof ChoosePerson>>()
const handleChoosePerson = (fieldName: string) => {
  if (fieldName === 'visitCustomerName' && form.id) return
  if (fieldName === 'visitCustomerName' && fromCustomerDetail.value) return
  if (fieldName === 'operatorNames') {
    const ids = form.operatorIds ? form.operatorIds.split(',') : []
    const names = form.operatorNames ? form.operatorNames.split(',') : []
    const list = ids.map((id, index) => ({ id, name: names[index] }))
    choosePersonRef.value?.open(fieldName, list)
  } else if (fieldName === 'volunteerNames') {
    const ids = form.volunteerIds ? form.volunteerIds.split(',') : []
    const names = form.volunteerNames ? form.volunteerNames.split(',') : []
    const list = ids.map((id, index) => ({ id, name: names[index] }))
    choosePersonRef.value?.open(fieldName, list)
  } else {
    choosePersonRef.value?.open(fieldName)
  }
}
const confirmChoosePerson = (data: any, fieldName: string) => {
  if (fieldName === 'visitOperatorName') {
    // 拜访人
    form.visitOperatorId = data.id
    form.visitOperatorName = data.nickname
  } else if (fieldName === 'operatorNames') {
    // 共同拜访(内部)
    form.operatorIds = ''
    form.operatorNames = ''
    data.forEach((item) => {
      form.operatorIds += form.operatorIds ? `,${item.id}` : `${item.id}`
      form.operatorNames += form.operatorNames ? `,${item.nickname}` : `${item.nickname}`
    })
  } else if (fieldName === 'visitCustomerName') {
    // 拜访客户
    form.customerId = data.id
    form.visitCustomerIdCard = data.idcard
    form.visitCustomerMobilePhone = data.mobilephone
    form.visitCustomerName = data.name
    form.visitDetailAddress = data.currentAddress
    form.visitVillage = data.currentVillage
    if (data.currentProvince && data.currentCity && data.currentCounty && data.currentStreet && data.currentCommunity) {
      form.visitRegionList = [data.currentProvince, data.currentCity, data.currentCounty, data.currentStreet, data.currentCommunity]
    }
  } else if (fieldName === 'volunteerNames') {
    // 志愿者
    form.volunteerIds = ''
    form.volunteerNames = ''
    data.forEach((item) => {
      form.volunteerIds += form.volunteerIds ? `,${item.id}` : `${item.id}`
      form.volunteerNames += form.volunteerNames ? `,${item.nickname}` : `${item.nickname}`
    })
  }
}

const chooseTagRef = ref<InstanceType<typeof ChooseTag>>()
const handleChooseTag = () => {
  if (loading.value) return
  chooseTagRef.value?.open(form.visitLabel)
}
const confirmChooseTag = (list: any[]) => {
  form.visitLabel = list
}

const handleImgSuccess = (data: FileItem) => {
  form.finishPhoto = data.id.toString()
}
const handleImgRemove = () => {
  form.finishPhoto = ''
}

// 禁止被选中的时间
const disabledDate = (time: Date) => {
  const today = new Date().toLocaleString().slice(0, 10)
  const timeStr = today + ' 23:59:59'
  return time.getTime() > new Date(timeStr).valueOf()
}
// 拜访方式选择的回调
const visitModeChange = (val) => {}
</script>

<style lang="less" scoped>
.grid-box {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0 80px;
}
.span-2 {
  grid-column: span 2;
}
.zone-name-div {
  position: absolute;
  right: -210px;
}
.tag-form-item {
  :deep(.el-form-item__content) {
    flex-direction: column;
    align-items: flex-start;
  }
}
.tag-box {
  box-shadow: 0 0 0 1px #ebe9e6 inset;
  border-radius: 4px;
  padding: 10px 12px;
  width: 100%;
}

.add-btn {
  cursor: pointer;
  color: var(--el-color-primary);
  text-decoration: underline;
  &.disabled {
    cursor: not-allowed;
    color: rgba(var(--el-color-primary-rgb), 0.5);
  }
}
.pointer-form-item {
  :deep(.el-input__wrapper),
  :deep(.el-input__inner) {
    cursor: pointer;
  }
}
.customer-info {
  font-size: 12px;
  color: #999;
  line-height: 18px;
  word-break: break-all;
}
.new-customer-link {
  color: var(--el-color-primary);
  text-decoration: underline;
  position: absolute;
  right: -38px;
  top: 0;
}
@media only screen and (max-width: 1680px) {
  .grid-box {
    gap: 0 40px;
  }
}
@media only screen and (max-width: 1600px) {
  .grid-box {
    gap: 0 30px;
  }
}
@media only screen and (max-width: 1440px) {
  .grid-box {
    gap: 0 20px;
  }
}
</style>
