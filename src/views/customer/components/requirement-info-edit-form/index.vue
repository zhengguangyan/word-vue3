<template>
  <el-form ref="formRef" :model="form" :rules="!props.customerUpdate ? {} : xiamenFlag ? rules : otherRules" label-width="auto">
    <el-descriptions title="需求情况" border>
      <el-descriptions-item label="是否接受电话关怀精神慰问" :label-class-name="{ 'required-item': props.customerUpdate }" class="line-2" span="3" v-if="xiamenFlag">
        <el-form-item prop="isCare">
          <el-radio-group v-model="form.isCare" :disabled="deathFlag == '0'">
            <el-radio value="1" size="large">是</el-radio>
            <el-radio value="2" size="large">否</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-descriptions-item>
      <el-descriptions-item label="生活需求(多选)" :label-class-name="{ 'required-item': props.customerUpdate }">
        <el-form-item prop="livingDemand">
          <DictSelect width="100%" v-model="form.livingDemand" :distList="filterDict('living_demand')" placeholder="生活需求" :multiple="true" :zero="true" :disabled="deathFlag == '0'" />
        </el-form-item>
      </el-descriptions-item>
      <el-descriptions-item label="家政需求(多选)" :label-class-name="{ 'required-item': props.customerUpdate }">
        <el-form-item prop="domesticDemand">
          <DictSelect width="100%" v-model="form.domesticDemand" :distList="filterDict('domestic_demand')" placeholder="家政需求" :multiple="true" :zero="true" :disabled="deathFlag == '0'" />
        </el-form-item>
      </el-descriptions-item>
      <el-descriptions-item label="医疗需求(多选)" :label-class-name="{ 'required-item': props.customerUpdate }">
        <el-form-item prop="medicalDemand">
          <DictSelect width="100%" v-model="form.medicalDemand" :distList="filterDict('medical_demand')" placeholder="医疗需求" :multiple="true" :zero="true" :disabled="deathFlag == '0'" />
        </el-form-item>
      </el-descriptions-item>
      <el-descriptions-item label="安全需求(多选)" :label-class-name="{ 'required-item': !xiamenFlag && props.customerUpdate }">
        <el-form-item prop="securityDemand">
          <DictSelect width="100%" v-model="form.securityDemand" :distList="filterDict('security_demand')" placeholder="安全需求" :multiple="true" :zero="true" :disabled="deathFlag == '0'" />
        </el-form-item>
      </el-descriptions-item>
      <el-descriptions-item label="精神需求(多选)" :label-class-name="{ 'required-item': props.customerUpdate }">
        <el-form-item prop="spiritDemand">
          <DictSelect width="100%" v-model="form.spiritDemand" :distList="filterDict('spirit_demand')" placeholder="精神需求" :multiple="true" :zero="true" :disabled="deathFlag == '0'" />
        </el-form-item>
      </el-descriptions-item>
      <el-descriptions-item label="需求重要程度排序(全选)" class="line-2" v-if="xiamenFlag">
        <div style="position: relative">
          <DictSelect
            width="100%"
            v-model="form.demandImportantLevel"
            :distList="filterDict('demand_important_level')"
            placeholder="请按重要程度排序全选"
            :multiple="true"
            :disabled="deathFlag == '0'"
          />
          <div v-if="form.demandImportantLevel?.length && form.demandImportantLevel?.length != filterDict('demand_important_level').length" class="error-tips"> 需求重要程度需按要求全选! </div>
          <div v-else class="error-tips" style="color: #ccc"> 按重要程度从高到低依次选择 </div>
        </div>
      </el-descriptions-item>
      <el-descriptions-item label="其他需求" span="3" :label-class-name="{ 'required-item': !xiamenFlag && props.customerUpdate }">
        <el-form-item prop="otherDemand">
          <el-input v-model="form.otherDemand" :disabled="deathFlag == '0'" />
        </el-form-item>
      </el-descriptions-item>
    </el-descriptions>
    <el-descriptions title="消费情况" border>
      <el-descriptions-item label="当前主要消费排序(多选)" class="line-2" :label-class-name="{ 'required-item': !xiamenFlag && props.customerUpdate }">
        <el-form-item prop="currMainConsumption">
          <DictSelect width="100%" v-model="form.currMainConsumption" :distList="filterDict('curr_main_consumption')" placeholder="当前主要消费排序" :multiple="true" :disabled="deathFlag == '0'" />
        </el-form-item>
      </el-descriptions-item>
      <el-descriptions-item label="每年次消费" :label-class-name="{ 'required-item': !xiamenFlag && props.customerUpdate }">
        <el-form-item prop="everyYearConsumption">
          <DictSelect width="100%" v-model="form.everyYearConsumption" :distList="filterDict('every_year_consumption')" placeholder="每年次消费" :disabled="deathFlag == '0'" />
        </el-form-item>
      </el-descriptions-item>
      <el-descriptions-item label="喜欢的旅游方式(多选)" class="line-2" :label-class-name="{ 'required-item': !xiamenFlag && props.customerUpdate }">
        <el-form-item prop="fondTourismType">
          <DictSelect width="100%" v-model="form.fondTourismType" :distList="filterDict('fond_tourism_type')" placeholder="喜欢的旅游方式" :multiple="true" :zero="true" :disabled="deathFlag == '0'" />
        </el-form-item>
      </el-descriptions-item>
      <el-descriptions-item label="旅游频次" :label-class-name="{ 'required-item': !xiamenFlag && props.customerUpdate }">
        <el-form-item prop="tourismFrequency">
          <DictSelect width="100%" v-model="form.tourismFrequency" :distList="filterDict('tourism_frequency')" placeholder="旅游频次" :disabled="deathFlag == '0'" />
        </el-form-item>
      </el-descriptions-item>
      <el-descriptions-item label="喜欢旅游的距离(多选)" class="line-2" :label-class-name="{ 'required-item': !xiamenFlag && props.customerUpdate }">
        <el-form-item prop="fondTourismDistance">
          <DictSelect
            width="100%"
            v-model="form.fondTourismDistance"
            :distList="filterDict('fond_tourism_distance')"
            placeholder="喜欢旅游的距离"
            :multiple="true"
            :zero="true"
            :disabled="deathFlag == '0'"
          />
        </el-form-item>
      </el-descriptions-item>
      <el-descriptions-item label="最愿投资的健康项目" class="line-2" v-if="xiamenFlag">
        <DictSelect width="100%" v-model="form.wishHealthyObject" :distList="filterDict('wish_healthy_object')" placeholder="最愿投资的健康项目" :multiple="true" :disabled="deathFlag == '0'" />
      </el-descriptions-item>
    </el-descriptions>
    <el-descriptions title="分析总结" border>
      <el-descriptions-item label="分析总结" span="3" :label-class-name="[{ 'required-item': xiamenFlag && props.customerUpdate }, 'align-top-item']">
        <el-form-item prop="analysisSummary">
          <el-input v-model="form.analysisSummary" type="textarea" :rows="3" :disabled="deathFlag == '0'" maxlength="1000" show-word-limit />
        </el-form-item>
      </el-descriptions-item>
      <el-descriptions-item label="老人或其他特殊情况说明" class="line-2" span="3" label-class-name="align-top-item">
        <el-input v-model="form.specialInstructions" type="textarea" :rows="3" :disabled="deathFlag == '0'" maxlength="1000" show-word-limit />
      </el-descriptions-item>
      <el-descriptions-item />
      <el-descriptions-item />
      <el-descriptions-item />
    </el-descriptions>
  </el-form>
  <el-button type="primary" @click="saveRequirementInfo" :disabled="deathFlag == '0'" :loading="loading"> 保存 </el-button>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import DictSelect from '/@/components/DictSelect/index.vue'
// import LevelSelect from './LevelSelect.vue'
import { getRequirementDetailById, saveRequirement, updateRequirement } from '@/api/customer/index'
import { ElMessageBox, FormRules } from 'element-plus'
import { useCache } from '@/hooks/web/useCache'
const { wsCache } = useCache()
import { useRouter } from 'vue-router'
import { reactive } from 'vue'
const { push } = useRouter()

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
  deathFlag: {
    type: String,
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

// const radioDict = (key: any, dict: any) => {
//   if (!key) {
//     return
//   }
//   return filterDict(dict)
//     ?.filter((item: any) => item.value == key)
//     .map((item: any) => item?.label)
//     .join('，')
// }

let form = ref<any>({})
async function queryInfo() {
  const res = await getRequirementDetailById(props.customerId)
  if (res) {
    form.value = res.data
    if (res.data.isCare == null) {
      form.value.isCare = '1'
    }
  }
}

const loading = ref(false)

const rules = reactive<FormRules>({
  isCare: [{ required: true, message: '请选择是否接受电话关怀精神慰问', trigger: 'change' }],
  livingDemand: [{ required: true, message: '请选择生活需求', trigger: 'change' }],
  domesticDemand: [{ required: true, message: '请选择家政需求', trigger: 'change' }],
  medicalDemand: [{ required: true, message: '请选择医疗需求', trigger: 'change' }],
  spiritDemand: [{ required: true, message: '请选择精神需求', trigger: 'change' }],
  analysisSummary: [{ required: true, message: '请填写分析总结', trigger: 'change' }]
})

const otherRules = reactive<FormRules>({
  isCare: [{ required: true, message: '请选择是否接受电话关怀精神慰问', trigger: 'change' }],
  livingDemand: [{ required: true, message: '请选择生活需求', trigger: 'change' }],
  domesticDemand: [{ required: true, message: '请选择家政需求', trigger: 'change' }],
  medicalDemand: [{ required: true, message: '请选择医疗需求', trigger: 'change' }],
  spiritDemand: [{ required: true, message: '请选择精神需求', trigger: 'change' }],
  securityDemand: [{ required: true, message: '请选择安全需求', trigger: 'change' }],
  otherDemand: [{ required: true, message: '请填写其他需求', trigger: ['blur', 'change'] }],
  currMainConsumption: [{ required: true, message: '请选择当前主要消费排序', trigger: 'change' }],
  everyYearConsumption: [{ required: true, message: '请选择每年次消费', trigger: 'change' }],
  fondTourismType: [{ required: true, message: '请选择喜欢的旅游方式', trigger: 'change' }],
  tourismFrequency: [{ required: true, message: '请选择旅游频次', trigger: 'change' }],
  fondTourismDistance: [{ required: true, message: '请选择喜欢旅游的距离', trigger: 'change' }]
})
const formRef = ref()

async function saveRequirementInfo() {
  try {
    await formRef.value.validate()
  } catch (err) {
    // ElMessage.error('参数验证错误，请仔细填写表单数据!')
    // return
  }
  loading.value = true
  try {
    if (props.customerUpdate) {
      form.value.customerUpdate = props.customerUpdate
    }
    if (!form.value.id) {
      await saveRequirement(form.value)
    } else {
      await updateRequirement(form.value)
    }
    loading.value = false
    ElMessageBox.confirm('保存成功', '提示', {
      confirmButtonText: '前往客户详情',
      cancelButtonText: '继续编辑',
      closeOnClickModal: false,
      closeOnPressEscape: false,
      distinguishCancelAndClose: true,
      type: 'success'
    })
      .then(() => {
        push(`/customer/detail?id=${props.customerId}`)
      })
      .catch(() => {
        queryInfo()
        setTimeout(() => {
          emits('handle-data-change', false)
        }, 500)
      })
  } catch (error) {
    loading.value = false
  }
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
    if (JSON.stringify(oldValue[0]) != '{}') {
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
.error-tips {
  bottom: -20px;
}
:deep(.el-descriptions__cell.el-descriptions__content.is-bordered-content .el-form-item) {
  margin-bottom: 0 !important;
}
:deep(.el-input__wrapper) {
  min-width: 150px !important;
}
:deep(.el-select__wrapper) {
  min-width: 150px !important;
}
</style>
