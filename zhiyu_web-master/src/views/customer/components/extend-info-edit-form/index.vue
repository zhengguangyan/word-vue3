<template>
  <el-form ref="formRef" :model="form" :rules="props.customerUpdate ? rules : {}" label-width="auto">
    <el-descriptions title="延伸信息" border>
      <el-descriptions-item label="老人分类" :label-class-name="{ 'required-item': props.customerUpdate }">
        <el-form-item prop="elderClassify">
          <DictSelect width="100%" v-model="form.elderClassify" :distList="filterDict('elder_classify')" placeholder="老人分类" :disabled="form.deathFlag == '0'" />
        </el-form-item>
      </el-descriptions-item>
      <el-descriptions-item label="养老方式" v-if="xiamenFlag">
        <DictSelect width="100%" v-model="form.pensionMode" :distList="filterDict('pension_mode')" placeholder="养老方式" :disabled="form.deathFlag == '0'" />
      </el-descriptions-item>
      <el-descriptions-item label="信誉评估" v-if="xiamenFlag">
        <DictSelect width="100%" v-model="form.reputationEvaluation" :distList="filterDict('reputation_evaluation')" placeholder="信誉评估" :disabled="form.deathFlag == '0'" />
      </el-descriptions-item>
      <el-descriptions-item label="政府补助标准(多选)">
        <DictSelect width="100%" v-model="form.subsidyStandard" :distList="filterDict('subsidy_standard')" placeholder="政府补助标准" :multiple="true" :zero="true" :disabled="form.deathFlag == '0'" />
      </el-descriptions-item>
      <el-descriptions-item label="补偿类型" v-if="xiamenFlag">
        <DictSelect width="100%" v-model="form.compensationType" :distList="filterDict('compensation_type')" placeholder="补偿类型" :disabled="form.deathFlag == '0'" />
      </el-descriptions-item>
      <el-descriptions-item label="政府补助金额度" v-if="xiamenFlag">
        <DictSelect width="100%" v-model="form.subsidyQuota" :distList="filterDict('gov_grant_amount')" placeholder="政府补助金额度" :disabled="form.deathFlag == '0'" />
      </el-descriptions-item>
      <el-descriptions-item label="老人类型" v-if="xiamenFlag">
        <DictSelect width="100%" v-model="form.oldmanType" :distList="filterDict('elder_type')" placeholder="老人类型" :disabled="form.deathFlag == '0'" />
      </el-descriptions-item>
      <el-descriptions-item label="居住情况" :label-class-name="{ 'required-item': props.customerUpdate }">
        <el-form-item prop="oldmanLive">
          <DictSelect width="100%" v-model="form.oldmanLive" :distList="filterDict('live_situation')" placeholder="居住情况" :disabled="form.deathFlag == '0'" />
        </el-form-item>
      </el-descriptions-item>
      <el-descriptions-item label="老人群体" v-if="xiamenFlag">
        <DictSelect width="100%" v-model="form.oldmanGroup" :distList="filterDict('elder_group')" placeholder="老人群体" :disabled="form.deathFlag == '0'" />
      </el-descriptions-item>
      <el-descriptions-item label="老人性格" v-if="xiamenFlag">
        <DictSelect width="100%" v-model="form.personality" :distList="filterDict('elder_character')" placeholder="老人性格" :disabled="form.deathFlag == '0'" />
      </el-descriptions-item>
      <el-descriptions-item :label-class-name="{ 'required-item': props.customerUpdate }" label="老人爱好(多选)">
        <el-form-item prop="oldmanHobby">
          <DictSelect width="100%" v-model="form.oldmanHobby" :distList="filterDict('elder_hobby')" placeholder="老人爱好" :multiple="true" :zero="true" :disabled="form.deathFlag == '0'" />
        </el-form-item>
      </el-descriptions-item>
      <el-descriptions-item v-if="xiamenFlag" />
      <el-descriptions-item label="上网方式(多选)" v-if="xiamenFlag">
        <DictSelect width="100%" v-model="form.internetMode" :distList="filterDict('internet_mode')" placeholder="上网方式" :multiple="true" :zero="true" :disabled="form.deathFlag == '0'" />
      </el-descriptions-item>
      <el-descriptions-item label="上网目的(多选)" v-if="xiamenFlag">
        <DictSelect width="100%" v-model="form.internetAim" :distList="filterDict('internet_aims')" placeholder="上网目的" :multiple="true" :zero="true" :disabled="form.deathFlag == '0'" />
      </el-descriptions-item>
      <el-descriptions-item v-if="xiamenFlag" />
      <el-descriptions-item label="是否健在">
        <el-radio-group v-model="form.deathFlag" @change="changeDeath">
          <el-radio value="1">是</el-radio>
          <el-radio value="0">否</el-radio>
        </el-radio-group>
      </el-descriptions-item>
      <el-descriptions-item label="死亡日期">
        <el-date-picker :disabled="form.deathFlag != '0'" v-model="form.dateOfDeath" type="date" value-format="YYYY-MM-DD" placeholder="请选择死亡日期" style="width: 100%" />
      </el-descriptions-item>
      <el-descriptions-item v-if="xiamenFlag" />
      <el-descriptions-item label="是否人户一致">
        <el-radio-group v-model="form.entryFamilyFlag" :disabled="form.deathFlag == '0'">
          <el-radio :value="1">是</el-radio>
          <el-radio :value="0">否</el-radio>
        </el-radio-group>
      </el-descriptions-item>
      <el-descriptions-item />
      <el-descriptions-item />
      <div v-if="!xiamenFlag">
        <el-descriptions-item label="是否正常服务" v-if="!xiamenFlag" :disabled="form.deathFlag == '0'" :label-class-name="{ 'required-item': props.customerUpdate }">
          <el-form-item prop="normalService">
            <el-radio-group v-model="form.normalService" @change="changeNormalService">
              <el-radio value="1">是</el-radio>
              <el-radio value="0">否</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-descriptions-item>
        <el-descriptions-item v-else />
        <el-descriptions-item label="取消服务原因" v-if="!xiamenFlag && form.normalService == '0'" :disabled="form.deathFlag == '0'" :label-class-name="{ 'required-item': props.customerUpdate }">
          <DictSelect width="100%" v-model="form.cancelServiceReason" :distList="filterDict('cancel_service_reason')" placeholder="取消服务原因" :disabled="form.deathFlag == '0'" />
        </el-descriptions-item>
        <el-descriptions-item v-else />
        <el-descriptions-item label="取消服务日期" v-if="!xiamenFlag && form.normalService == '0'" :disabled="form.deathFlag == '0'" :label-class-name="{ 'required-item': props.customerUpdate }">
          <el-date-picker :disabled="form.normalService != '0'" v-model="form.cancelServiceTime" type="date" value-format="YYYY-MM-DD" placeholder="请选择取消服务日期" style="width: 100%" />
        </el-descriptions-item>
        <el-descriptions-item v-else />
      </div>

      <el-descriptions-item label="是否残联服务对象">
        <el-radio-group style="min-width: 150px" v-model="form.disableInfo.disableObject" @change="changeDisable" :disabled="form.deathFlag == '0'">
          <el-radio :value="1">是</el-radio>
          <el-radio :value="0">否</el-radio>
        </el-radio-group>
      </el-descriptions-item>
      <el-descriptions-item label="残疾类别">
        <el-select :disabled="form.deathFlag == '0'" v-model="form.disableInfo.disableCategory" style="width: 100%" placeholder="残疾类别" clearable @change="changeType">
          <el-option v-for="item in filterDict('disability_category')" :key="item.value" :value="item.value" :label="item.label" />
        </el-select>
      </el-descriptions-item>
      <el-descriptions-item />
    </el-descriptions>
    <el-descriptions border>
      <el-descriptions-item label="残疾等级细分" span="3">
        <div style="display: flex; align-items: center" v-for="(level, index) in disableLevel_type" :key="level.name">
          <span v-if="index != 2" style="margin-right: 10px">{{ level.name }}等级：</span>
          <el-radio-group
            :key="level"
            v-if="index != 2"
            :disabled="(form.disableInfo.disableCategory != '3' && form.disableInfo.disableCategory != index + 1) || form.deathFlag == '0'"
            style="display: block"
            v-model="form.disableInfo[level.value]"
          >
            <el-radio v-for="item in filterDict('disableLevel_mince')" :key="item.value" :value="item.value">
              {{ item.label }}
            </el-radio>
          </el-radio-group>
        </div>
      </el-descriptions-item>
      <el-descriptions-item label="是否持证">
        <el-radio-group v-model="form.disableInfo.hasCertificate" @change="changeCertificate" :disabled="form.deathFlag == '0'">
          <el-radio :value="1">是</el-radio>
          <el-radio :value="0">否</el-radio>
        </el-radio-group>
      </el-descriptions-item>
      <el-descriptions-item label="持证时间">
        <el-date-picker
          :disabled="form.disableInfo.hasCertificate != '1' || form.deathFlag == '0'"
          v-model="form.disableInfo.certificateTimeDate"
          type="date"
          placeholder="请选择持证时间"
          width="100%"
        />
      </el-descriptions-item>
      <el-descriptions-item label="残疾证号">
        <el-input :disabled="form.disableInfo.hasCertificate != '1' || form.deathFlag == '0'" v-model="form.disableInfo.certificateNumber" placeholder="请输入残疾证号" />
      </el-descriptions-item>
      <el-descriptions-item label="是否纳入饱和度计算">
        <el-radio-group v-model="form.saturationLevel" :disabled="form.deathFlag == '0'">
          <el-radio :value="1">是</el-radio>
          <el-radio :value="0">否</el-radio>
        </el-radio-group>
      </el-descriptions-item>
    </el-descriptions>
    <el-descriptions border>
      <el-descriptions-item label="附属文件" span="3">
        <el-upload
          :headers="header"
          v-model:file-list="fileList"
          action="/api/minio/endpoint/upload"
          :on-success="successUpload"
          :on-remove="successUpload"
          :on-preview="downloadList"
          :on-exceed="handleExceed"
          :before-upload="beforeUpload"
          multiple
          :limit="10"
          :disabled="form.deathFlag == '0'"
        >
          <el-button type="primary" :disabled="form.deathFlag == '0'">上传附件</el-button>
          <template #tip>
            <div class="el-upload__tip"> 支持word、excel、pdf、zip、rar、jpg、png、MP4格式文件，最多上传10份，文档压缩包等不得超过2M，图片、视频超过2M自动压缩 </div>
          </template>
        </el-upload>
      </el-descriptions-item>
      <el-descriptions-item />
      <el-descriptions-item />
      <el-descriptions-item />
    </el-descriptions>
  </el-form>
  <el-button type="primary" @click="saveExtendInfo" :loading="loading"> 保存 </el-button>
  <NotAliceTipDialog ref="notAliceTipRef" @confirm="save" />
</template>
<script lang="ts" setup>
import { ref, watch, computed } from 'vue'
import DictSelect from '@/components/DictSelect/index.vue'
import NotAliceTipDialog from './NotAliceTipDialog.vue'
import { getExtendDetailById, verifyDeathFlag, saveExtend, updateExtend } from '@/api/customer/index'
import { ElMessage, ElMessageBox, FormRules } from 'element-plus'
import { timeFormat } from '@/utils/index'
import Cookies from 'js-cookie'
import { useCache } from '@/hooks/web/useCache'
const { wsCache } = useCache()
import { useRouter, useRoute } from 'vue-router'
import { reactive } from 'vue'
import { useTagsViewStore } from '@/store/modules/tagsView'
const { push } = useRouter()
const tagsViewStore = useTagsViewStore()
const visitedViews = computed(() => tagsViewStore.getVisitedViews)
const route = useRoute()
const xiamenFlag = ref(wsCache.get('xiamenFlag'))

const props = defineProps({
  customerId: {
    type: Number,
    default: null
  },
  dict: {
    type: Array,
    default: null
  },
  customerUpdate: {
    type: Boolean,
    default: false
  }
})

const filterDict = (key: any) => {
  return (props.dict.find((item: any) => item.type == key) as any)?.list
}

const disableLevel_type = ref([
  { name: '肢体', value: 'disablelevelMinceLimbs' },
  { name: '智力', value: 'disablelevelMinceIntelligence' },
  { name: '多重', value: 'disablelevelMinceMultiple' },
  { name: '言语', value: 'disablelevelMinceSpeech' },
  { name: '视力', value: 'disablelevelMinceVision' },
  { name: '精神', value: 'disablelevelMinceSpirit' },
  { name: '听力', value: 'disablelevelMinceHearing' }
])

const form = ref<any>({
  disableInfo: {
    id: null,
    customerId: null,
    disableCategory: null,
    disableObject: null,
    hasCertificate: null,
    certificateTime: null,
    certificateNumber: null,
    disablelevelMinceLimbs: null,
    disablelevelMinceIntelligence: null,
    disablelevelMinceMultiple: null,
    disablelevelMinceSpeech: null,
    disablelevelMinceVision: null,
    disablelevelMinceSpirit: null,
    disablelevelMinceHearing: null,
    areaProjectCode: null
  },
  normalService: '1'
})
async function queryInfo() {
  const res = await getExtendDetailById(props.customerId)
  if (res.data) {
    form.value = res.data
    form.value.disableInfo.certificateTimeDate = form.value.disableInfo.certificateTime
    form.value.dateOfDeathTime = form.value.dateOfDeath
    fileList.value = form.value.attachmentList.map((item: any) => {
      return {
        ...item,
        name: item.originalName
      }
    })
  } else {
    form.value.deathFlag = '1'
  }
}
const fileList = ref([])

const header = ref({
  Authorization: Cookies.get('TokenKey')
})

const successUpload = () => {
  form.value.attachmentList = fileList.value.map((item: any) => {
    if (item.originalName) {
      return item
    }
    return {
      id: item.response.data,
      type: item.raw.type
    }
  })
}

const handleExceed = () => {
  ElMessage.error('最多上传10份附件')
}

const beforeUpload = (file) => {
  const isLt2M = file.size / 1024 / 1024 < 2

  if (['application/zip', 'application/x-zip-compressed'].includes(file.type)) {
    if (!isLt2M) {
      ElMessage.error('上传的压缩包大小不能超过 2MB!')
      return false
    }
  } else if (file.type.startsWith('video/')) {
    return new Promise<void>((resolve, reject) => {
      // 创建视频对象用于加载文件
      const video = document.createElement('video')
      video.preload = 'metadata'
      video.onloadedmetadata = function () {
        window.URL.revokeObjectURL(video.src)
        const duration = video.duration
        if (duration > 60) {
          ElMessage.error('上传的视频时长不能超过 1分钟!')
          reject()
        } else {
          resolve()
        }
      }
      video.onerror = function () {
        ElMessage.error('读取视频文件失败！')
        reject()
      }
      video.src = URL.createObjectURL(file)
    })
  } else {
    return true
  }
}

const rules = reactive<FormRules>({
  elderClassify: [
    {
      required: true,
      message: '请选择老人分类',
      trigger: 'change'
    }
  ],
  oldmanLive: [{ required: true, message: '请选择居住情况', trigger: 'change' }],
  oldmanHobby: [{ required: true, message: '请选择老人爱好', trigger: 'change' }],
  normalService: [{ required: true, message: '请选择是否正常服务', trigger: 'change' }]
})
const formRef = ref()
const loading = ref(false)

const notAliceTipRef = ref()
async function saveExtendInfo() {
  //是否健在：否的時候需要掉用接口
  if (form.value.deathFlag === '0') {
    const { data } = await verifyDeathFlag({ id: form.value.customerId })
    // const html: string[] = []
    // data.forEach((item: any) => html.push(`${item}`))
    // const text = html.join(' ')

    notAliceTipRef.value.show(data)

    // ElMessageBox.confirm(`保存后，改老人的信息降不纳入饱和度统计;${data.join(';')}`, '提示', {
    //   confirmButtonText: '确认',
    //   cancelButtonText: '取消',
    //   closeOnClickModal: false,
    //   closeOnPressEscape: false,
    //   distinguishCancelAndClose: true
    // })
    //   .then(() => {
    //     // save()
    //   })
    //   .catch(() => {})
    return
  }
  save()
}

async function save() {
  try {
    await formRef.value.validate()
  } catch (err) {
    // ElMessage.error('参数验证错误，请仔细填写表单数据!')
    // return
  }
  if (form.value.deathFlag == '0') {
    formRef.value.clearValidate()
  }
  loading.value = true
  form.value.disableInfo.certificateTime = timeFormat(form.value.disableInfo.certificateTimeDate)
  if (props.customerUpdate) {
    form.value.customerUpdate = props.customerUpdate
  }
  try {
    if (!form.value.id) {
      await saveExtend(form.value)
    } else {
      await updateExtend(form.value)
    }
    ElMessageBox.confirm('保存成功', '提示', {
      confirmButtonText: '前往客户详情',
      cancelButtonText: '继续编辑',
      closeOnClickModal: false,
      closeOnPressEscape: false,
      distinguishCancelAndClose: true,
      type: 'success'
    })
      .then(() => {
        const obj = visitedViews.value.find((item) => item.fullPath === route.fullPath)
        if (obj) {
          tagsViewStore.delView(obj)
        }
        push(`/customer/detail?id=${props.customerId}`)
      })
      .catch(() => {
        queryInfo()
        setTimeout(() => {
          emits('handle-data-change', false)
        }, 500)
        // location.reload()
      })
  } finally {
    loading.value = false
  }
}

const changeType = () => {
  form.value.disableInfo.disablelevelMinceLimbs = null
  form.value.disableInfo.disablelevelMinceIntelligence = null
  form.value.disableInfo.disablelevelMinceMultiple = null
  form.value.disableInfo.disablelevelMinceSpeech = null
  form.value.disableInfo.disablelevelMinceVision = null
  form.value.disableInfo.disablelevelMinceSpirit = null
  form.value.disableInfo.disablelevelMinceHearing = null
}

const changeCertificate = () => {
  form.value.disableInfo.certificateTimeDate = null
  form.value.disableInfo.certificateNumber = null
}

const changeDisable = () => {
  form.value.disableInfo.disableCategory = null
  changeType()
}

const changeDeath = () => {
  form.value.dateOfDeath = null
  if (form.value.deathFlag == '0') {
    form.value.saturationLevel = 0
  }
  formRef.value.clearValidate()
}

const downloadList = (val) => {
  if (val.url) {
    window.open(val.url)
  } else {
    const url = URL.createObjectURL(new Blob([val.raw]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', val.name)
    link.setAttribute('target', '_blank')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
}

const changeNormalService = () => {
  form.value.cancelServiceReason = null
  form.value.cancelServiceTime = null
}

watch(
  () => props.customerId,
  (e) => {
    if (e) {
      queryInfo()
    }
  },
  { immediate: true }
)

const emits = defineEmits(['handle-data-change'])
watch(
  () => [{ ...form.value }],
  (_newValue, oldValue) => {
    delete oldValue[0].disableInfo
    if (JSON.stringify(oldValue[0]) != '{"normalService":"1"}') {
      emits('handle-data-change', true)
    }
  }
)
</script>
<style scoped>
h4 {
  font-weight: bold;
  font-size: 16px;
  margin-bottom: 15px;
}

.line-2 .el-descriptions-item__label {
  line-height: 1.5 !important;
}
:deep(.el-descriptions__table tr) {
  height: 50px;
}
:deep(.el-descriptions__cell.el-descriptions__content.is-bordered-content .el-form-item) {
  margin-bottom: 0 !important;
}
.el-upload__tip {
  color: #ccc;
}
:deep(.el-input__wrapper) {
  min-width: 150px !important;
}
:deep(.el-select__wrapper) {
  min-width: 150px !important;
}
</style>
