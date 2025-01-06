<template>
  <el-form ref="formRef" :model="form" :rules="!props.customerUpdate ? {} : xiamenFlag ? baseRules : otherRules" label-width="auto">
    <el-descriptions title="基本信息" border v-if="xiamenFlag">
      <el-descriptions-item label="身高">
        <el-input v-model="form.height" type="number" :min="55" :max="300" placeholder="请输入身高" :disabled="deathFlag == '0'" @change="computeBmi">
          <template #suffix> cm </template>
        </el-input>
      </el-descriptions-item>
      <el-descriptions-item label="体重">
        <el-input v-model="form.weight" type="number" :min="5" :max="600" placeholder="请输入体重" :disabled="deathFlag == '0'" @change="computeBmi">
          <template #suffix> kg </template>
        </el-input>
      </el-descriptions-item>
      <el-descriptions-item label="腰围">
        <el-input v-model="form.waist" type="number" :min="33" :max="244" placeholder="请输入腰围" :disabled="deathFlag == '0'" @change="changeWaist">
          <template #suffix> cm </template>
        </el-input>
      </el-descriptions-item>
      <el-descriptions-item label="体质指数">
        <el-input v-model="form.bmi" placeholder="请输入体质指数" disabled>
          <template #suffix>BMI</template>
        </el-input>
      </el-descriptions-item>
      <el-descriptions-item />
      <el-descriptions-item />
    </el-descriptions>
    <el-descriptions title="身体情况" border>
      <el-descriptions-item label="健康状况自评">
        <DictSelect width="100%" v-model="form.healthSelfRating" placeholder="请选择健康状况自评" :distList="filterDict('health_self_rating')" :disabled="deathFlag == '0'" />
      </el-descriptions-item>
      <el-descriptions-item label="自理能力自评" v-if="xiamenFlag">
        <DictSelect width="100%" v-model="form.selfCareSelfRating" placeholder="请选择自理能力自评" :distList="filterDict('self_care_self_rating')" :disabled="deathFlag == '0'" />
      </el-descriptions-item>
      <el-descriptions-item label="身体状况" :label-class-name="{ 'required-item': props.customerUpdate }">
        <el-form-item prop="physicalCondition">
          <DictSelect width="100%" v-model="form.physicalCondition" placeholder="请选择身体状况(多选)" :distList="filterDict('physical_condition')" :disabled="deathFlag == '0'" :multiple="true" />
        </el-form-item>
      </el-descriptions-item>
      <el-descriptions-item label="慢性病" :label-class-name="{ 'required-item': props.customerUpdate }">
        <el-form-item prop="chronicDisease">
          <DictSelect
            width="100%"
            v-model="form.chronicDisease"
            placeholder="请选择慢性病(多选)"
            :distList="filterDict('chronic_disease')"
            :multiple="true"
            :zero="true"
            :disabled="deathFlag == '0'"
          />
        </el-form-item>
      </el-descriptions-item>
      <el-descriptions-item label="日常抽烟情况" v-if="xiamenFlag">
        <DictSelect width="100%" v-model="form.smokingSituationDay" placeholder="请选择日常抽烟情况" :distList="filterDict('smoking_situation_day')" :disabled="deathFlag == '0'" />
      </el-descriptions-item>
      <el-descriptions-item label="饮酒情况" v-if="xiamenFlag">
        <DictSelect width="100%" v-model="form.drinkSituation" placeholder="请选择饮酒情况" :distList="filterDict('drink_situation')" :disabled="deathFlag == '0'" />
      </el-descriptions-item>
      <el-descriptions-item label="日常睡眠情况" v-if="xiamenFlag">
        <DictSelect width="100%" v-model="form.sleepSituationDay" placeholder="请选择日常睡眠情况" :distList="filterDict('sleep_situation_day')" :disabled="deathFlag == '0'" />
      </el-descriptions-item>
      <el-descriptions-item label="睡眠质量" v-if="xiamenFlag">
        <DictSelect width="100%" v-model="form.sleepQuality" placeholder="请选择睡眠质量" :distList="filterDict('sleep_quality')" :disabled="deathFlag == '0'" />
      </el-descriptions-item>
      <el-descriptions-item v-if="xiamenFlag" />
      <el-descriptions-item label="体育锻炼" :label-class-name="{ 'required-item': props.customerUpdate }">
        <el-form-item prop="physicalExercise">
          <DictSelect
            width="100%"
            v-model="form.physicalExercise"
            placeholder="请选择体育锻炼(多选)"
            :distList="filterDict('physical_exercise')"
            :multiple="true"
            :zero="true"
            :disabled="deathFlag == '0'"
          />
        </el-form-item>
      </el-descriptions-item>
      <el-descriptions-item label="周运动量">
        <el-input v-model="form.exerciseAmountWeek" placeholder="请输入周运动量" :disabled="deathFlag == '0'">
          <template #suffix>次</template>
        </el-input>
      </el-descriptions-item>
      <el-descriptions-item label="每次运动量">
        <el-input v-model="form.exerciseAmountEvery" placeholder="请输入每次运动量" :disabled="deathFlag == '0'">
          <template #suffix>分钟</template>
        </el-input>
      </el-descriptions-item>
      <el-descriptions-item label="饮食习惯">
        <DictSelect width="100%" v-model="form.foodHabits" placeholder="请选择饮食习惯" :distList="filterDict('food_habits')" :disabled="deathFlag == '0'" />
      </el-descriptions-item>
      <el-descriptions-item label="饮食偏好">
        <DictSelect
          width="100%"
          v-model="form.foodPreference"
          placeholder="请选择饮食偏好(多选)"
          :distList="filterDict('food_preference')"
          :multiple="true"
          :zero="true"
          :disabled="deathFlag == '0'"
        />
      </el-descriptions-item>
      <el-descriptions-item label="心理特征">
        <DictSelect
          width="100%"
          v-model="form.psychologicalFeature"
          placeholder="请选择心理特征(多选)"
          :distList="filterDict('psychological_feature')"
          :multiple="true"
          :zero="true"
          :disabled="deathFlag == '0'"
        />
      </el-descriptions-item>
      <el-descriptions-item label="形体特征">
        <DictSelect width="100%" v-model="form.formFeature" placeholder="请选择形体特征" :distList="filterDict('form_feature')" :disabled="deathFlag == '0'" />
      </el-descriptions-item>
      <el-descriptions-item label="是否长期用药">
        <DictSelect width="100%" v-model="form.isMedication" placeholder="是否长期用药" :distList="filterDict('is_medication')" :disabled="deathFlag == '0'" />
      </el-descriptions-item>
      <el-descriptions-item label="痴呆前兆" v-if="xiamenFlag">
        <DictSelect
          width="100%"
          v-model="form.dementiaPrecursor"
          placeholder="请选择痴呆前兆(多选)"
          :distList="filterDict('dementia_precursor')"
          :multiple="true"
          :zero="true"
          :disabled="deathFlag == '0'"
        />
      </el-descriptions-item>
      <el-descriptions-item label="现存症状" v-if="xiamenFlag">
        <DictSelect
          width="100%"
          v-model="form.existingSymptoms"
          placeholder="请选择现存症状(多选)"
          :distList="filterDict('existing_symptoms')"
          :multiple="true"
          :zero="true"
          :tags="5"
          :disabled="deathFlag == '0'"
        />
      </el-descriptions-item>
    </el-descriptions>
    <el-descriptions title="生活环境" border v-if="xiamenFlag">
      <el-descriptions-item label="厨房排风设施">
        <DictSelect
          width="100%"
          v-model="form.exhaustFacilities"
          placeholder="请选择厨房排风设施(多选)"
          :distList="filterDict('exhaust_facilities')"
          :multiple="true"
          :zero="true"
          :disabled="deathFlag == '0'"
        />
      </el-descriptions-item>
      <el-descriptions-item label="燃料类型">
        <DictSelect width="100%" v-model="form.fuelType" placeholder="请选择燃料类型(多选)" :distList="filterDict('fuel_type')" :multiple="true" :zero="true" :disabled="deathFlag == '0'" />
      </el-descriptions-item>
      <el-descriptions-item label="饮水类型">
        <DictSelect width="100%" v-model="form.drinkingWater" placeholder="请选择饮水类型(多选)" :distList="filterDict('drinking_water')" :multiple="true" :zero="true" :disabled="deathFlag == '0'" />
      </el-descriptions-item>
      <el-descriptions-item label="厕所">
        <DictSelect width="100%" v-model="form.toilet" placeholder="请选择厕所(多选)" :distList="filterDict('toilet')" :multiple="true" :zero="true" :disabled="deathFlag == '0'" />
      </el-descriptions-item>
      <el-descriptions-item label="宠物">
        <DictSelect :tags="1" v-model="form.pet" placeholder="请选择宠物(多选)" :distList="filterDict('pet')" :multiple="true" :zero="true" :disabled="deathFlag == '0'" />
      </el-descriptions-item>
      <el-descriptions-item />
    </el-descriptions>
    <el-descriptions title="病史" border v-if="xiamenFlag">
      <el-descriptions-item label="药物过敏史">
        <DictSelect
          width="100%"
          :tags="1"
          v-model="form.drugAllergyHistory"
          placeholder="请选择药物过敏史(多选)"
          :distList="filterDict('drug_allergy_history')"
          :multiple="true"
          :zero="true"
          :disabled="deathFlag == '0'"
        />
      </el-descriptions-item>
      <el-descriptions-item label="家族病史">
        <DictSelect
          width="100%"
          :tags="1"
          v-model="form.familyMedicalHistory"
          placeholder="请选择家族病史(多选)"
          :distList="filterDict('family_history')"
          :multiple="true"
          :zero="true"
          :disabled="deathFlag == '0'"
        />
      </el-descriptions-item>
      <el-descriptions-item>
        <DictSelect style="width: 100%; z-index: -1" v-model="form.height" />
      </el-descriptions-item>
      <el-descriptions-item label="遗传病史" span="3">
        <el-input style="width: 100%" clearable v-model="form.hereditMedicalHistory" placeholder="请输入遗传病史,多选用英文逗号隔开" :disabled="deathFlag == '0'" />
      </el-descriptions-item>
      <el-descriptions-item label="既往病史" span="3">
        <el-input style="width: 100%" clearable v-model="form.pastMedicalHistory" placeholder="请输入既往病史,多选用英文逗号隔开" :disabled="deathFlag == '0'" />
      </el-descriptions-item>
    </el-descriptions>
    <el-descriptions title="主要指标" border>
      <el-descriptions-item label="血压情况">
        <DictSelect width="100%" v-model="form.bloodPressureSituation" placeholder="请选择血压情况" :distList="filterDict('blood_pressure_situation')" :disabled="deathFlag == '0'" />
      </el-descriptions-item>
      <el-descriptions-item label="血糖情况">
        <DictSelect width="100%" v-model="form.bloodSugarSituation" placeholder="请选择血糖情况" :distList="filterDict('blood_sugar_situation')" :disabled="deathFlag == '0'" />
      </el-descriptions-item>
      <el-descriptions-item>
        <DictSelect style="width: 100%; z-index: -1" v-model="form.height" />
      </el-descriptions-item>
    </el-descriptions>
    <el-descriptions title="中医体质辨识" border>
      <el-descriptions-item label="中医体质辨识">
        <DictSelect
          width="100%"
          v-model="form.chineseMedicinePhysique"
          placeholder="请选择中医体质(多选)"
          :distList="filterDict('chinese_medicine_physique')"
          :multiple="true"
          :tags="1"
          :disabled="deathFlag == '0'"
        />
      </el-descriptions-item>
      <el-descriptions-item />
      <el-descriptions-item />
    </el-descriptions>
    <el-descriptions title="现存主要健康问题" border>
      <el-descriptions-item label="心脑血管疾病">
        <DictSelect width="100%" v-model="form.cardiovascularDisease" placeholder="请选择心脑血管疾病" :distList="filterDict('cardiovascular_disease')" :disabled="deathFlag == '0'" />
      </el-descriptions-item>
      <el-descriptions-item label="肾脏疾病">
        <DictSelect width="100%" v-model="form.kidneyDisease" placeholder="请选择肾脏疾病" :distList="filterDict('kidney_disease')" :disabled="deathFlag == '0'" />
      </el-descriptions-item>
      <el-descriptions-item label="心脏疾病">
        <DictSelect width="100%" v-model="form.heartDisease" placeholder="请选择心脏疾病" :distList="filterDict('heart_disease')" :disabled="deathFlag == '0'" />
      </el-descriptions-item>
      <el-descriptions-item label="眼部疾病">
        <DictSelect width="100%" v-model="form.ocularDisease" placeholder="请选择眼部疾病" :distList="filterDict('ocular_disease')" :disabled="deathFlag == '0'" />
      </el-descriptions-item>
      <el-descriptions-item label="骨骼疾病" :label-class-name="xiamenFlag || !props.customerUpdate ? '' : 'required-item'">
        <el-form-item prop="skeletonDisease">
          <DictSelect
            width="100%"
            v-model="form.skeletonDisease"
            placeholder="请选择骨骼疾病(多选)"
            :distList="filterDict('skeleton_disease')"
            :multiple="true"
            :zero="true"
            :disabled="deathFlag == '0'"
          />
        </el-form-item>
      </el-descriptions-item>
      <el-descriptions-item label="口腔疾病" :label-class-name="xiamenFlag || !props.customerUpdate ? '' : 'required-item'">
        <el-form-item prop="cavityDisease">
          <DictSelect
            width="100%"
            v-model="form.cavityDisease"
            placeholder="请选择口腔疾病(多选)"
            :distList="filterDict('cavity_disease')"
            :multiple="true"
            :zero="true"
            :disabled="deathFlag == '0'"
          />
        </el-form-item>
      </el-descriptions-item>
    </el-descriptions>
    <el-descriptions title="过往住院史" border v-if="xiamenFlag">
      <el-descriptions-item label="" label-class-name="display-none">
        <el-table
          :data="hospitalInfo"
          max-height="200"
          header-row-class-name="table-header"
          :style="{
            maxWidth: '850px',
            display: 'flex',
            border: '1px solid #f5f3f0',
            borderRadius: '8px'
          }"
        >
          <el-table-column type="index" />
          <el-table-column label="操作" width="150">
            <template #default="{ row }">
              <el-button link type="primary" size="small" @click="editHospital(row)" :disabled="deathFlag == '0'">编辑</el-button>
              <el-popconfirm title="请确认是否永久删除该记录？" @confirm="delHospital(row.id)" :disabled="deathFlag == '0'">
                <template #reference>
                  <el-button link type="primary" size="small">删除</el-button>
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="hospitalDate" label="入院日期">
            <template #default="{ row }">
              {{ row.hospitalDate.slice(0, 11) }}
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="hospitalReason" label="入院原因" />
          <el-table-column show-overflow-tooltip prop="medicalInstitution" label="医疗机构" />
          <el-table-column show-overflow-tooltip prop="recoverySituation" label="健康恢复情况">
            <template #default="{ row }">
              {{ filterDict('recovery_situation').find((item) => item.value == row.recoverySituation)?.label }}
            </template>
          </el-table-column>
        </el-table>
        <p class="w-full mt-10px">
          <el-button :icon="Plus" type="primary" link @click="openHospital" :disabled="deathFlag == '0'"> 添加过往住院史 </el-button>
        </p>
      </el-descriptions-item>
    </el-descriptions>
    <el-descriptions title="用药情况" border v-if="xiamenFlag">
      <el-descriptions-item label="" label-class-name="display-none">
        <el-table
          :data="medicationInfo"
          max-height="200"
          header-row-class-name="table-header"
          :style="{
            maxWidth: '850px',
            display: 'flex',
            border: '1px solid #f5f3f0',
            borderRadius: '8px'
          }"
        >
          <el-table-column type="index" />
          <el-table-column label="操作" width="150">
            <template #default="{ row }">
              <el-button link type="primary" size="small" @click="editMedication(row)" :disabled="deathFlag == '0'">编辑</el-button>
              <el-popconfirm title="请确认是否永久删除该记录？" @confirm="delMedication(row.id)" :disabled="deathFlag == '0'">
                <template #reference>
                  <el-button link type="primary" size="small">删除</el-button>
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="medicationName" label="用药名称或类型" />
          <el-table-column show-overflow-tooltip prop="dosageDay" label="每日用量/次" />
          <el-table-column show-overflow-tooltip prop="medicationTime" label="用药时间">
            <template #default="{ row }">
              {{
                row.medicationTime
                  .sort((a: string, b: string) => parseInt(a) - parseInt(b))
                  .map((time: any) => filterDict('medication_time').find((item: any) => item.value == time)?.label)
                  .join('，')
              }}
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="medicationCompliance" label="服药依从性">
            <template #default="{ row }">
              {{ filterDict('medication_compliance').find((item) => item.value == row.medicationCompliance)?.label }}
            </template>
          </el-table-column>
        </el-table>
        <p class="w-full mt-10px">
          <el-button :icon="Plus" type="primary" link @click="openMedication" :disabled="deathFlag == '0'"> 添加用药情况 </el-button>
        </p>
      </el-descriptions-item>
    </el-descriptions>
  </el-form>
  <el-button type="primary" @click="handleSaveHealth" :loading="saveLoading" :disabled="deathFlag == '0'">保存</el-button>

  <!-- 新增修改住院信息弹窗 -->
  <el-dialog
    destroy-on-close
    center
    v-model="hospitalVisible"
    :title="isAdd ? '添加住院历史' : '修改住院历史'"
    width="500px"
    @close="closeHospital"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
  >
    <el-form ref="hospitalRef" :model="hospitalForm" :rules="hospitalRules" label-width="120px">
      <el-form-item label="入院日期：" prop="hospitalTimeDate">
        <el-date-picker v-model="hospitalForm.hospitalTimeDate" type="date" placeholder="请输入入院日期" />
      </el-form-item>
      <el-form-item label="入院原因：" prop="hospitalReason">
        <el-input v-model="hospitalForm.hospitalReason" type="textarea" placeholder="请输入入院原因" clearable />
      </el-form-item>
      <el-form-item label="医疗机构：" prop="medicalInstitution">
        <el-input v-model="hospitalForm.medicalInstitution" placeholder="请输入医疗机构" clearable />
      </el-form-item>
      <el-form-item label="健康恢复情况：">
        <DictSelect width="100%" v-model="hospitalForm.recoverySituation" placeholder="请选择健康恢复情况" :distList="filterDict('recovery_situation')" />
      </el-form-item>
      <el-form-item>
        <el-button @click="closeHospital">取消</el-button>
        <el-button color="#ff9500" style="color: #fff" @click="handleSaveHospital" :loading="addHospitalLoading"> 确认{{ isAdd ? '新增' : '修改' }} </el-button>
      </el-form-item>
    </el-form>
  </el-dialog>

  <!-- 新增修改用药信息弹窗 -->
  <el-dialog
    destroy-on-close
    center
    v-model="medicationVisible"
    :title="isAdd ? '添加用药信息' : '修改用药信息'"
    width="500px"
    @close="closeMedication"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
  >
    <el-form ref="medicationRef" :model="medicationForm" :rules="medicationRules" label-width="140px">
      <el-form-item label="用药名称或类型：" prop="medicationName">
        <el-input v-model="medicationForm.medicationName" placeholder="请输入用药名称或类型" clearable />
      </el-form-item>
      <el-form-item label="每日用量：" prop="dosageDay">
        <el-input-number style="width: 250px; margin-right: 15px" :min="1" :max="10" :precision="0" v-model="medicationForm.dosageDay" placeholder="请输入每日用量,1~10" />
        次
      </el-form-item>
      <el-form-item label="用药时间：" prop="medicationTime">
        <el-checkbox-group v-model="medicationForm.medicationTime">
          <el-checkbox v-for="item in filterDict('medication_time')" :key="item.value" :label="item.value">{{ item.label }}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="服药依从性：">
        <DictSelect width="100%" v-model="medicationForm.medicationCompliance" placeholder="请选择服药依从性" :distList="filterDict('medication_compliance')" />
      </el-form-item>
      <el-form-item>
        <el-button @click="closeMedication">取消</el-button>
        <el-button color="#ff9500" style="color: #fff" @click="handleSaveMedication" :loading="addHospitalLoading"> 确认{{ isAdd ? '新增' : '修改' }} </el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<script lang="ts" setup>
import DictSelect from '@/components/DictSelect/index.vue'
import { watch } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import {
  getHealthDetailById,
  saveHealth,
  updateHealth,
  saveHospital,
  updateHospital,
  getHospital,
  getMedication,
  delHospitalById,
  saveMedication,
  updateMedication,
  delMedicationById
} from '@/api/customer/index'
import { ref } from 'vue'
import { ElMessage, FormRules, ElMessageBox } from 'element-plus'
import { reactive } from 'vue'
import { formatDateString } from '@/utils'
import { useCache } from '@/hooks/web/useCache'
const { wsCache } = useCache()
import { useRouter } from 'vue-router'
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

const hospitalInfo = ref([])

const medicationInfo = ref([])

const saveLoading = ref(false)

const isAdd = ref(false)

const hospitalVisible = ref(false)

const medicationVisible = ref(false)

const addHospitalLoading = ref(false)

const form = ref<any>({})

const hospitalRef = ref<any>()

const hospitalForm = ref<any>({})

const medicationRef = ref<any>()

const medicationForm = ref<any>({})

const hospitalRules = reactive<FormRules>({
  hospitalReason: [{ required: true, message: '入院原因不能为空', trigger: 'blur' }],
  hospitalTimeDate: [{ required: true, message: '入院日期不能为空', trigger: 'blur' }]
})

const medicationRules = reactive<FormRules>({
  medicationName: [{ required: true, message: '	用药名称或类型不能为空', trigger: 'blur' }]
})

const openHospital = () => {
  isAdd.value = true
  hospitalForm.value.customerId = props.customerId
  hospitalVisible.value = true
}

const closeHospital = () => {
  isAdd.value = false
  hospitalForm.value = {}
  hospitalVisible.value = false
  addHospitalLoading.value = false
}

const handleSaveHospital = async () => {
  hospitalRef.value.validate(async (val) => {
    if (!val) return ElMessage.error('请完善必填信息')
    try {
      addHospitalLoading.value = true
      if (isAdd.value) {
        await saveHospital({
          ...hospitalForm.value,
          hospitalDate: formatDateString(hospitalForm.value.hospitalTimeDate, 'YYYY-MM-DD')
        })
      } else {
        await updateHospital({
          ...hospitalForm.value,
          hospitalDate: formatDateString(hospitalForm.value.hospitalTimeDate, 'YYYY-MM-DD')
        })
      }
      ElMessage.success(isAdd.value ? '添加成功' : '修改成功')
      closeHospital()
      getHospitalPage()
    } finally {
      addHospitalLoading.value = false
    }
  })
}

const delHospital = async (id: any) => {
  const res: any = await delHospitalById(id)
  if (res.code == 200) {
    ElMessage.success('删除成功')
    getHospitalPage()
  } else {
    ElMessage.error(res.msg)
  }
}

const editHospital = (data: any) => {
  hospitalForm.value = {
    ...data,
    hospitalTimeDate: data.hospitalDate,
    customerId: props.customerId
  }
  isAdd.value = false
  hospitalVisible.value = true
}

const openMedication = () => {
  isAdd.value = true
  medicationForm.value.customerId = props.customerId
  medicationVisible.value = true
}

const closeMedication = () => {
  isAdd.value = false
  medicationForm.value = {}
  medicationVisible.value = false
  addHospitalLoading.value = false
}

const handleSaveMedication = async () => {
  medicationRef.value.validate(async (val) => {
    if (!val) return ElMessage.error('请完善必填信息')
    try {
      addHospitalLoading.value = true
      if (isAdd.value) {
        await saveMedication(medicationForm.value)
      } else {
        await updateMedication(medicationForm.value)
      }
      ElMessage.success(isAdd.value ? '添加成功' : '修改成功')
      closeMedication()
      getMedicationPage()
    } finally {
      addHospitalLoading.value = false
    }
  })
}

const delMedication = async (id: any) => {
  const res: any = await delMedicationById(id)
  if (res.code == 200) {
    ElMessage.success('删除成功')
    getMedicationPage()
  } else {
    ElMessage.error(res.msg)
  }
}

const editMedication = (data: any) => {
  medicationForm.value = { ...data, customerId: props.customerId }
  isAdd.value = false
  medicationVisible.value = true
}

async function queryInfo() {
  const res = await getHealthDetailById(props.customerId)
  if (res.data) {
    form.value = res.data
  }
}

async function getHospitalPage() {
  const res = await getHospital({ customerId: props.customerId, pageSize: 100 })
  if (res) {
    hospitalInfo.value = res.data.list
  }
}

async function getMedicationPage() {
  const res = await getMedication({ customerId: props.customerId, pageSize: 100 })
  if (res) {
    medicationInfo.value = res.data.list
  }
}

watch(
  () => props.customerId,
  (e) => {
    if (e) {
      queryInfo()
      getHospitalPage()
      getMedicationPage()
    }
  },
  { immediate: true }
)

const baseRules = reactive<FormRules>({
  physicalCondition: [{ required: true, message: '请选择身体状况', trigger: 'change' }],
  chronicDisease: [{ required: true, message: '请选择慢性病', trigger: 'change' }],
  physicalExercise: [{ required: true, message: '请选择体育锻炼', trigger: 'change' }]
})
const otherRules = reactive<FormRules>({
  physicalCondition: [{ required: true, message: '请选择身体状况', trigger: 'change' }],
  chronicDisease: [{ required: true, message: '请选择慢性病', trigger: 'change' }],
  physicalExercise: [{ required: true, message: '请选择体育锻炼', trigger: 'change' }],
  skeletonDisease: [{ required: true, message: '请选择骨骼疾病', trigger: 'change' }],
  cavityDisease: [{ required: true, message: '请选择口腔疾病', trigger: 'change' }]
})
const formRef = ref()

const handleSaveHealth = async () => {
  try {
    await formRef.value.validate()
  } catch (err) {
    // ElMessage.error('参数验证错误，请仔细填写表单数据!')
  }
  saveLoading.value = true
  form.value.isHospitalInfo = hospitalInfo.value.length ? true : false
  form.value.isMedicationInfo = medicationInfo.value.length ? true : false
  form.value.customerId = props.customerId
  if (props.customerUpdate) {
    form.value.customerUpdate = props.customerUpdate
  }
  try {
    if (!form.value.id) {
      await saveHealth(form.value)
    } else {
      await updateHealth(form.value)
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
        push(`/customer/detail?id=${props.customerId}`)
      })
      .catch(() => {
        queryInfo()
        setTimeout(() => {
          emits('handle-data-change', false)
        }, 500)
      })
  } finally {
    saveLoading.value = false
  }
}

const emits = defineEmits(['handle-data-change'])
watch(
  () => [{ ...form.value }],
  (_newValue, oldValue) => {
    if (JSON.stringify(oldValue[0]) != '{}') {
      emits('handle-data-change', true)
    }
  }
)
// watch(
//   () => [form.value.height, form.value.weight],
//   () => {
//     let height = form.value.height
//     let weight = form.value.weight
//     if (!height || !weight) {
//       form.value.bmi = ''
//       return
//     }
//     if (height <= 0 || weight <= 0) {
//       ElMessage.error('身高和体重不能小于等于0')
//       form.value.bmi = ''
//       return
//     }
//     const heightInMeters = height / 100
//     form.value.bmi = (weight / heightInMeters ** 2).toFixed(2)
//   }
// )
const computeBmi = () => {
  let height = form.value.height
  let weight = form.value.weight
  if (height < 50 && height) {
    form.value.height = 50
  }
  if (height > 300 && height) {
    form.value.height = 300
  }
  if (weight < 6 && weight) {
    form.value.weight = 6
  }
  if (weight > 600 && weight) {
    form.value.weight = 600
  }
  if (!height || !weight) {
    form.value.bmi = ''
    return
  }
  const heightInMeters = height / 100
  form.value.bmi = (weight / heightInMeters ** 2).toFixed(2)
}
const changeWaist = () => {
  let waist = form.value.waist
  if (waist < 33 && waist) {
    form.value.waist = 33
  }
  if (waist > 244 && waist) {
    form.value.waist = 244
  }
}
</script>

<style lang="less" scoped>
.el-descriptions {
  margin-bottom: 15px;
}

.display-none {
  display: none;
}
:deep(.el-descriptions__table tr) {
  height: 50px;
}
.place-box {
  width: 200px;
  min-width: 150px;
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
