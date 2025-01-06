<template>
  <el-form ref="formRef" :model="form" :rules="!props.customerUpdate ? baseRules : xiamenFlag ? xiamenRules : otherRules" label-width="auto">
    <el-descriptions title="基础信息" :border="true">
      <el-descriptions-item label="客户姓名" label-class-name="required-item">
        <el-form-item prop="name">
          <el-input v-model="form.name" :disabled="deathFlag === '0'" />
        </el-form-item>
      </el-descriptions-item>
      <el-descriptions-item label="客户类型">
        <DictSelect width="100%" v-model="form.customerType" :distList="filterDict('customer_type')" placeholder=" " :disabled="true" />
      </el-descriptions-item>
      <el-descriptions-item label="APP账号">
        <el-input v-model="form.appAcount" disabled />
      </el-descriptions-item>
      <el-descriptions-item label="客户性别" label-class-name="required-item">
        <el-form-item prop="sex">
          <el-radio-group v-model="form.sex" :disabled="deathFlag === '0'">
            <el-radio v-for="(item, index) in filterDict('vols_sex')" :key="index" :label="item.value">
              {{ item.label }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
      </el-descriptions-item>
      <el-descriptions-item label="出生日期">
        <el-form-item prop="birthday">
          <el-date-picker
            v-model="form.birthday"
            type="date"
            placeholder="出生日期"
            style="width: 100%"
            value-format="YYYY-MM-DD"
            @change="changeBirthday"
            :disabled="form.idcard === '1' || deathFlag === '0'"
          />
        </el-form-item>
      </el-descriptions-item>
      <el-descriptions-item label="年龄">
        <el-input v-model="form.age" disabled />
      </el-descriptions-item>
      <el-descriptions-item label="联系电话" span="3" label-class-name="required-item align-top-item">
        <el-form-item prop="mobilephone">
          <el-input style="width: 60%" v-model="form.mobilephone" placeholder="请输入11位手机号码或11-12位固定电话" @change="checkMobilephone" :disabled="deathFlag === '0'" />
          <!-- <p class="error-tips" v-if="!isValidPhone">请输入正确的手机号码</p> -->
          <div class="el-form-item__error" v-if="isValidPhone" style="color: #ccc; font-size: 12px"> 如有多个号码以英文逗号“,”隔开 </div>
        </el-form-item>
      </el-descriptions-item>
      <el-descriptions-item label="备注" span="3" label-class-name="align-top-item">
        <el-input
          style="width: 60%"
          v-model="form.remark"
          type="textarea"
          :rows="3"
          placeholder="请根据特殊情况输入备注内容，不超过2000字，非必填。（比如：三无老人，联系电话为邻居，腿脚不方便等）"
          :disabled="deathFlag === '0'"
          maxlength="2000"
          show-word-limit
        />
      </el-descriptions-item>
      <el-descriptions-item label="服务标签(多选)" span="3" label-class-name="align-top-item">
        <div style="position: relative">
          <el-space>
            <DictSelect width="225px" v-model="form.serviceLabel" placeholder="服务标签(多选)" :distList="filterDict('service_label')" :multiple="true" :disabled="deathFlag === '0'" />
            <DictSelect
              v-model="form.secondServiceLabel"
              placeholder="二级服务标签(多选)"
              :distList="filterDict('second_service_label')"
              :multiple="true"
              v-if="form.serviceLabel.includes('1') && !xiamenFlag"
              :disabled="deathFlag === '0'"
            />
            <DictSelect
              v-model="form.thirdServiceLabel"
              placeholder="三级服务标签(多选)"
              :distList="filterDict('third_service_label')"
              :multiple="true"
              v-if="form.serviceLabel.includes('1') && !xiamenFlag"
              :disabled="deathFlag === '0'"
            />
          </el-space>
          <p class="error-tips" style="color: #ccc">选择“政府”标签，才可纳入工时补贴</p>
        </div>
      </el-descriptions-item>
      <el-descriptions-item label="服务分类">
        <DictSelect width="100%" v-model="form.serviceClassify" :distList="filterDict('service_classify')" placeholder="服务分类" :disabled="deathFlag === '0'" />
      </el-descriptions-item>
      <el-descriptions-item label="服务对象来源(一级)" class="line-2" :label-class-name="xiamenFlag ? '' : 'required-item'">
        <el-form-item prop="serviceObjSource">
          <DictSelect
            width="100%"
            v-model="form.serviceObjSource"
            :distList="filterDict('service_obj_source')"
            placeholder="服务对象来源(一级)(多选)"
            :multiple="true"
            :tags="1"
            :disabled="deathFlag === '0'"
          />
        </el-form-item>
      </el-descriptions-item>
      <el-descriptions-item label="服务对象来源(二级)" class="line-2">
        <DictSelect width="100%" v-model="form.secondServiceSource" :distList="belongItemList" placeholder="服务对象来源(二级)(多选)" :multiple="true" :tags="1" :disabled="deathFlag === '0'" />
      </el-descriptions-item>
      <el-descriptions-item label="证件类型">
        <el-select v-model="form.idType" style="width: 100%" placeholder="证件类型" clearable @change="changeIdType" :disabled="deathFlag === '0'">
          <el-option v-for="item in filterDict('document_type')" :key="item.value" :value="item.value" :label="item.label" />
        </el-select>
        <!-- <div class="error-tips" style="opacity: 0">1</div> -->
      </el-descriptions-item>
      <el-descriptions-item label="证件号码" :label-class-name="!xiamenFlag && form.idType == '1' ? 'required-item' : ''">
        <el-form-item prop="idcard" v-if="form.idType == '1'">
          <el-input v-model="form.idcard" @blur="checkIdcard(form.idcard)" placeholder="证件号码" :disabled="!form.idType || deathFlag === '0'" />
          <!-- <div class="error-tips" v-if="form.idcard && !idcardEfficacyFlag && form.idType == '1'">
            请输入正确身份证号
          </div> -->
          <div class="el-form-item__error" v-if="form.idcard != '' && idcardEfficacyFlag && form.idType == '1'" style="color: #ccc"> 出生日期及年龄由身份证计算得出 </div>
        </el-form-item>
        <el-input v-else v-model="form.idcard" :disabled="!form.idType || deathFlag === '0'" />
      </el-descriptions-item>
      <el-descriptions-item label="发证机关">
        <el-input v-model="form.issuer" :disabled="deathFlag === '0'" placeholder="发证机关" />
        <!-- <div class="error-tips" style="opacity: 0">1</div> -->
      </el-descriptions-item>
      <el-descriptions-item label="证件有效期">
        <el-select v-model="form.idEffective" placeholder="证件有效期" style="width: 100%" clearable @change="form.expireDate = null" :disabled="deathFlag === '0'">
          <el-option v-for="item in filterDict('id_effective')" :key="item.value" :value="item.value" :label="item.label" />
        </el-select>
      </el-descriptions-item>
      <el-descriptions-item :label-class-name="form.idEffective != '2' ? '' : 'required-item'" label="证件截止日期">
        <el-form-item prop="expireDate">
          <el-date-picker v-model="form.expireDate" type="date" placeholder="证件截止日期" style="width: 100%" value-format="YYYY-MM-DD" :disabled="form.idEffective != '2' || deathFlag === '0'" />
        </el-form-item>
      </el-descriptions-item>
      <el-descriptions-item label="服务标准">
        <DictSelect width="100%" v-model="form.serviceStandards" :distList="filterDict('service_standards')" placeholder="服务标准(多选)" :multiple="true" :tags="1" :disabled="deathFlag === '0'" />
      </el-descriptions-item>
      <el-descriptions-item label="国籍" v-if="xiamenFlag">
        <DictSelect width="100%" v-model="form.nation" :distList="filterDict('nation')" placeholder="国籍" :disabled="deathFlag === '0'" />
      </el-descriptions-item>
      <el-descriptions-item label="民族">
        <DictSelect width="100%" v-model="form.nationality" :distList="filterDict('nationality')" placeholder="民族" :disabled="deathFlag === '0'" />
      </el-descriptions-item>
      <el-descriptions-item label="政治面貌" v-if="xiamenFlag">
        <DictSelect width="100%" v-model="form.politicalstatus" :distList="filterDict('political_status')" placeholder="政治面貌" :disabled="deathFlag === '0'" />
      </el-descriptions-item>
      <el-descriptions-item label="文化程度" :label-class-name="xiamenFlag ? '' : 'required-item'">
        <el-form-item prop="educationLevel">
          <DictSelect width="100%" v-model="form.educationLevel" :distList="filterDict('degree_education')" placeholder="文化程度" :disabled="deathFlag === '0'" />
        </el-form-item>
      </el-descriptions-item>
      <el-descriptions-item label="婚姻状况" :label-class-name="xiamenFlag ? '' : 'required-item'">
        <el-form-item prop="maritalStatus">
          <DictSelect width="100%" v-model="form.maritalStatus" :distList="filterDict('marital_status')" placeholder="婚姻状况" :disabled="deathFlag === '0'" />
        </el-form-item>
      </el-descriptions-item>
      <el-descriptions-item label="子女数量" v-if="xiamenFlag">
        <el-input-number
          style="width: 100%"
          v-model="form.childrennumSection"
          placeholder="子女数量"
          step-strictly
          :min="0"
          :max="100"
          controls-position="right"
          :disabled="deathFlag === '0'"
          :precision="0"
        />
      </el-descriptions-item>
      <el-descriptions-item label="职业" :label-class-name="xiamenFlag ? '' : 'required-item'">
        <el-form-item prop="profession">
          <DictSelect width="100%" v-model="form.profession" :distList="filterDict('occupation')" placeholder="职业" :disabled="deathFlag === '0'" />
        </el-form-item>
      </el-descriptions-item>
      <el-descriptions-item label="详细职业" v-if="xiamenFlag">
        <el-input v-model="form.detaileProfession" placeholder="详细职业" :disabled="deathFlag === '0'" />
      </el-descriptions-item>
      <el-descriptions-item label="是否退休" v-if="xiamenFlag">
        <el-radio-group style="height: 34px" v-model="form.isRetire" :disabled="deathFlag === '0'">
          <el-radio :value="1" size="large">是</el-radio>
          <el-radio :value="2" size="large">否</el-radio>
        </el-radio-group>
      </el-descriptions-item>
      <el-descriptions-item label="主要经济来源" v-if="xiamenFlag">
        <DictSelect width="100%" v-model="form.mainFinancially" :distList="filterDict('main_economic_source')" placeholder="主要经济来源" :disabled="deathFlag === '0'" />
      </el-descriptions-item>
      <el-descriptions-item label="收入/月" :label-class-name="xiamenFlag ? '' : 'required-item'">
        <el-form-item prop="income">
          <DictSelect width="100%" v-model="form.income" :distList="filterDict('income_month')" placeholder="收入/月" :disabled="deathFlag === '0'" />
        </el-form-item>
      </el-descriptions-item>
      <el-descriptions-item label="保险" v-if="xiamenFlag">
        <DictSelect width="100%" v-model="form.insurance" :distList="filterDict('insurance')" placeholder="保险" :multiple="true" :zero="true" :tags="1" :disabled="deathFlag === '0'" />
      </el-descriptions-item>
      <el-descriptions-item label="个人特长" :label-class-name="{ 'required-item': props.customerUpdate }">
        <el-form-item prop="speciality">
          <el-input v-model="form.speciality" :disabled="deathFlag === '0'" placeholder="个人特长" />
        </el-form-item>
      </el-descriptions-item>
      <el-descriptions-item label="会员级别">
        <DictSelect width="100%" v-model="form.memberLevel" :distList="filterDict('member_level')" placeholder="会员级别" :disabled="deathFlag === '0' || !!form.id" />
      </el-descriptions-item>
      <el-descriptions-item />
      <el-descriptions-item v-if="!xiamenFlag" />

      <el-descriptions-item label="户籍地址" :label-class-name="[{ 'required-item': props.customerUpdate && xiamenFlag }, 'align-top-item']" span="3">
        <el-form-item prop="domicileList">
          <div style="display: flex; flex-wrap: wrap; width: calc(100vw - 800px)">
            <Cascader class="mr-2 mb-2" @change-default="setDefaultAddress" v-model="form.domicileList" />
            <el-input v-model="form.domicileVillage" placeholder="填写小区" class="mr-2 mb-2" @blur="setDefaultAddress" style="width: 150px; height: 32px" :disabled="deathFlag === '0'" />
            <el-input v-model="form.domicileAddress" placeholder="填写详细地址" @blur="setDefaultAddress" style="width: 450px; height: 32px" :disabled="deathFlag === '0'" />
          </div>
          <!-- <p> -->
          <el-checkbox v-model="setDefaultAddressFlag" label="默认为现居地址" size="small" @change="setDefaultAddress" :disabled="deathFlag === '0'" />
          <!-- </p> -->
        </el-form-item>
      </el-descriptions-item>
      <el-descriptions-item label="现居住地地址" :label-class-name="[{ 'required-item': props.customerUpdate && !xiamenFlag }, 'align-top-item']" span="3">
        <el-form-item prop="currentList">
          <div style="display: flex; flex-wrap: wrap; width: calc(100vw - 800px)">
            <Cascader class="mr-2 mb-2" :disabled="setDefaultAddressFlag" v-model="form.currentList" />
            <el-input v-model="form.currentVillage" :disabled="setDefaultAddressFlag || deathFlag === '0'" placeholder="填写小区" class="mr-2 mb-2" style="width: 150px; height: 32px" />
            <el-input v-model="form.currentAddress" :disabled="setDefaultAddressFlag || deathFlag === '0'" placeholder="填写详细地址" style="width: 450px; height: 32px" />
          </div>
        </el-form-item>
      </el-descriptions-item>

      <el-descriptions-item span="3" v-if="!xiamenFlag" />
      <el-descriptions-item label="联系人" :label-class-name="[{ 'required-item': props.customerUpdate }, 'align-top-item']" span="3" v-if="xiamenFlag">
        <el-table
          :data="contactList"
          header-row-class-name="table-header"
          :style="{
            width: '500px',
            border: '1px solid #f5f3f0',
            borderRadius: '8px'
          }"
        >
          <el-table-column type="index" />
          <el-table-column label="操作" width="120">
            <template #default="scope">
              <el-popconfirm title="请确认是否永久删除该记录？" @confirm="deleteContact(scope.row.id)" :disabled="deathFlag === '0'">
                <template #reference>
                  <el-button link type="primary" size="small">删除</el-button>
                </template>
              </el-popconfirm>
              <el-button link type="primary" size="small" @click="editContact(scope.row)" :disabled="deathFlag === '0'"> 编辑 </el-button>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="ownerName" width="100" label="联系人" />
          <el-table-column show-overflow-tooltip prop="phoneNumber" min-width="120" label="联系方式" />
          <el-table-column show-overflow-tooltip prop="contactRole" width="100" label="角色">
            <template #default="scope">
              {{ filterDict('contact_role').find((item) => item.value == scope.row.contactRole)?.label }}
            </template>
          </el-table-column>
        </el-table>
        <p class="w-full mt-10px">
          <el-button :icon="Plus" type="primary" link @click="addContact" :disabled="deathFlag === '0'"> 添加联系人 </el-button>
        </p>
      </el-descriptions-item>
    </el-descriptions>
  </el-form>
  <el-button type="primary" :disabled="deathFlag === '0'" @click="handleSaveBaseInfo" :loading="saveBaseInfoLoading"> 保存 </el-button>
  <!-- 新增联系人 -->
  <el-dialog
    center
    v-model="addContactVisible"
    :title="contactAddFlag ? '添加联系人' : '编辑联系人'"
    width="500px"
    @close="onClose"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    destroy-on-close
  >
    <el-form :ref="contactFormRef" :model="contactForm" :rules="contactRules" label-width="100px">
      <el-form-item label="姓名" prop="ownerName">
        <el-input v-model="contactForm.ownerName" placeholder="请输入姓名" />
      </el-form-item>
      <el-form-item label="联系电话" prop="phoneNumber">
        <el-input v-model="contactForm.phoneNumber" placeholder="联系电话" />
      </el-form-item>
      <el-form-item label="角色" prop="contactRole">
        <DictSelect width="100%" v-model="contactForm.contactRole" :distList="filterDict('contact_role')" placeholder="请选择角色" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="onClose">取消</el-button>
        <el-button type="primary" @click="handleSaveContact" :loading="addContactLoading"> 保存 </el-button>
      </span>
    </template>
  </el-dialog>
  <el-dialog v-model="visiblePhone" title="联系电话重复提醒" width="800px" center @close="closePhone" :close-on-press-escape="false" :close-on-click-modal="false">
    <p style="margin-bottom: 5px"> 电话号码 {{ form.mobilephone }} 已有 {{ phoneMsg.length }} 位客户，请选择已有客户或创建新客户 </p>
    <el-table :data="phoneMsg" header-row-class-name="table-header" style="max-height: calc(100vh - 500px); margin-bottom: 5px">
      <el-table-column fixed="left" label="操作" width="70">
        <template #default="{ row }">
          <el-button link type="primary" @click="detail(row)">查看</el-button>
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
      <el-table-column show-overflow-tooltip prop="saturationNumber" label="饱和度" width="100">
        <template #default="{ row }"> {{ row.saturationNumber || 0 }} % </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip prop="visitnumber" label="拜访数" width="100" />
      <el-table-column show-overflow-tooltip prop="workSum" label="工单数" width="100" />
      <el-table-column show-overflow-tooltip prop="orderSum" label="订单数" width="100" />
      <el-table-column show-overflow-tooltip prop="careSum" label="关怀数" width="100" />
      <el-table-column show-overflow-tooltip prop="serviceSum" label="服务包数" width="100" />
      <el-table-column show-overflow-tooltip prop="finalContactTime" label="最后联系时间" width="160" />
      <el-table-column show-overflow-tooltip prop="currentAllAddress" label="现居地址" width="350" />
    </el-table>
    <div class="mt-10px mb-20px">
      <el-pagination
        v-model:current-page="phonePage.pageNum"
        v-model:page-size="phonePage.pageSize"
        :page-sizes="[10, 20, 50, 100, 200, 500]"
        layout="total, prev, pager, next"
        :total="phonePage.total"
        @current-change="checkMobilephone"
      />
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="clearPhone">清空号码</el-button>
        <el-button type="primary" @click="closePhone">忽略提示</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script lang="ts" setup>
import { ref, reactive, watch } from 'vue'
import { useRouter } from 'vue-router'
import { Plus } from '@element-plus/icons-vue'
import DictSelect from '/@/components/DictSelect/index.vue'
import Cascader from '/@/components/Cascader/index.vue'
import { getCustomerBaseDetailById, deleteContactById, getContactListById, saveContact, saveCustomerBaseInfo, updateCustomerBaseInfo, getMobilephone } from '@/api/customer/index'
import { ElMessage, FormInstance, ElMessageBox, FormRules } from 'element-plus'
import { useCache } from '@/hooks/web/useCache'
import { calculateAgeFromIdNumber, ageByBirthday } from '@/utils/index'
import { getBelongItemlabelList } from '@/api/filiale'
const { wsCache } = useCache()
const { push } = useRouter()
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
const xiamenFlag = ref(wsCache.get('xiamenFlag'))
const addContactVisible = ref(false)
const contactAddFlag = ref(true)
const addContactLoading = ref(false)
const isValidPhone = ref(true)
const contactFormRef = ref<FormInstance>()
let contactForm = ref<any>({})

const contactRules = reactive({
  ownerName: [{ required: true, message: '姓名不能为空', trigger: 'blur' }],
  phoneNumber: [
    {
      pattern: /^(1[3-9]\d{9}|0\d{2,3}-\d{7,8}|0\d{2,3}\d{7,8})$/,
      required: true,
      message: '请输入正确的联系电话',
      trigger: 'blur'
    }
  ],
  contactRole: [{ required: true, message: '角色不能为空', trigger: 'change' }]
})

// 打开新增弹窗
const addContact = () => {
  addContactVisible.value = true
  contactForm.value.customerId = props.customerId
}

// 打开编辑弹窗
const editContact = (data: any) => {
  contactAddFlag.value = false
  contactForm.value.customerId = props.customerId
  contactForm.value = { ...data }
  addContactVisible.value = true
}

// 关闭新增弹窗
const onClose = () => {
  addContactVisible.value = false
  setTimeout(() => {
    saveBaseInfoLoading.value = false
    addContactLoading.value = false
    contactAddFlag.value = true
    contactForm.value = {}
  }, 100)
}

const form = ref<any>({ serviceLabel: [] })

// const idcardEfficacyFlag = computed(() => {
//   return checkIdcard(form.value.idcard)
// })
const changeIdType = () => {
  form.value.idcard = undefined
  form.value.birthday = undefined
  form.value.age = undefined
  if (form.value.idType == '1') {
    form.value.idEffective = '1'
  }
}

const idcardEfficacyFlag = ref(true)
function checkIdcard(idcard) {
  if (!idcard) {
    return false
  }
  const reg = new RegExp(/^[1-9]\d{5}(?:18|19|20)\d{2}(?:0[1-9]|10|11|12)(?:0[1-9]|[1-2]\d|30|31)\d{3}[\dXx]$/)
  const flag = reg.test(idcard)
  if (flag) {
    idcardEfficacyFlag.value = true
    form.value.birthday = `${idcard.slice(6, 10)}-${idcard.slice(10, 12)}-${idcard.slice(12, 14)}`
    form.value.age = calculateAgeFromIdNumber(idcard)
  } else {
    idcardEfficacyFlag.value = false
  }
  return flag
}

const changeBirthday = () => {
  form.value.age = ageByBirthday(form.value.birthday)
}

const contactList = ref<any>([])

const setDefaultAddressFlag = ref(false)
function setDefaultAddress() {
  if (setDefaultAddressFlag.value) {
    form.value.currentList = form.value.domicileList
    form.value.currentAddress = form.value.domicileAddress
    form.value.currentVillage = form.value.domicileVillage
  }
}

// 添加联系方式
async function handleSaveContact() {
  if (!contactForm.value.ownerName || !contactForm.value.phoneNumber) {
    ElMessage({
      message: '请完善必填信息',
      type: 'warning'
    })
    return
  }
  addContactLoading.value = true
  try {
    const res: any = await saveContact(contactForm.value)
    if (res.code == 200) {
      ElMessage({
        message: contactAddFlag.value ? '添加成功' : '编辑成功',
        type: 'success'
      })
      onClose()
      getContactList()
    }
  } catch (error) {
    addContactLoading.value = false
  }
}

// 删除联系方式
async function deleteContact(constactId: any) {
  const res: any = await deleteContactById(constactId)
  if (res.code == 200) {
    ElMessage({
      message: '删除成功',
      type: 'success'
    })
    getContactList()
  } else {
    ElMessage.error(res.msg)
  }
}

const emits = defineEmits(['handle-data-change'])
watch(
  () => [{ ...form.value }],
  (_newValue, oldValue) => {
    if (JSON.stringify(oldValue[0]) != '{"serviceLabel":[]}') {
      emits('handle-data-change', true)
    }
  }
)

const validateBirthday = (_rule: any, value: any, callback: any) => {
  const birthdayRegex = /^\d{4}-\d{2}-\d{2}$/
  if (value && !birthdayRegex.test(value)) {
    callback(new Error('出生日期格式为yyyy-mm-dd'))
  } else {
    callback()
  }
}

const validateIdcard = (_rule: any, value: any, callback: any) => {
  if (!xiamenFlag.value && value === '') {
    callback(new Error('请输入身份证号'))
  }
  if (form.value.idType == '1' && !idcardEfficacyFlag.value && value !== '') {
    callback(new Error('请输入正确身份证号'))
  } else {
    callback()
  }
}

const validateMobilephone = (_rule: any, value: any, callback: any) => {
  if (value !== '' && !isValidPhone.value) {
    callback(new Error('请输入正确手机号码'))
  } else {
    callback()
  }
}

const validateMobilephoneAndIdcard = (_rule: any, _value: any, callback: any) => {
  if (!form.value.mobilephone && form.value.idType == '1' && !form.value.idcard) {
    callback(new Error('联系电话和身份证号至少需要填一项'))
  } else {
    callback()
  }
}

const validateExpireDate = (_rule: any, value: any, callback: any) => {
  if (form.value.idEffective == '2' && value == null) {
    callback(new Error('请填写证件有效期'))
  } else {
    callback()
  }
}

const baseRules = reactive<FormRules>({
  name: [
    {
      required: true,
      message: '请填写姓名',
      trigger: 'blur'
    }
  ],
  sex: [{ required: true, message: '请选择性别', trigger: 'change' }],
  mobilephone: [
    { validator: validateMobilephone, trigger: 'blur' },
    { validator: validateMobilephoneAndIdcard, trigger: 'blur' }
  ]
})

const xiamenRules = reactive<FormRules>({
  name: [
    {
      required: true,
      message: '请填写姓名',
      trigger: 'blur'
    }
  ],
  sex: [{ required: true, message: '请选择性别', trigger: 'change' }],
  birthday: [{ validator: validateBirthday, trigger: 'change' }],
  mobilephone: [
    { validator: validateMobilephone, trigger: 'blur' },
    { validator: validateMobilephoneAndIdcard, trigger: 'blur' }
  ],
  idcard: [
    { validator: validateIdcard, trigger: 'blur' },
    { validator: validateMobilephoneAndIdcard, trigger: 'blur' }
  ],
  speciality: [{ required: true, message: '请填写个人特长', trigger: 'blur' }],
  domicileList: [{ required: true, message: '请选择户籍地址', trigger: 'change' }],
  expireDate: [{ validator: validateExpireDate, trigger: 'blur' }]
})

const otherRules = reactive<FormRules>({
  name: [
    {
      required: true,
      message: '请填写姓名',
      trigger: 'blur'
    }
  ],
  sex: [{ required: true, message: '请选择性别', trigger: 'change' }],
  birthday: [{ validator: validateBirthday, trigger: 'change' }],
  mobilephone: [
    { validator: validateMobilephone, trigger: 'blur' },
    { validator: validateMobilephoneAndIdcard, trigger: 'blur' }
  ],
  idcard: [
    { validator: validateIdcard, trigger: 'blur' },
    { validator: validateMobilephoneAndIdcard, trigger: 'blur' }
  ],
  speciality: [{ required: true, message: '请填写个人特长', trigger: 'blur' }],
  currentList: [{ required: true, message: '请选择现居地址', trigger: 'change' }],
  expireDate: [{ validator: validateExpireDate, trigger: 'blur' }],
  serviceObjSource: [{ required: true, message: '请选择服务对象来源', trigger: 'change' }],
  maritalStatus: [{ required: true, message: '请选择婚姻状况', trigger: 'change' }],
  profession: [{ required: true, message: '请选择职业', trigger: 'change' }],
  educationLevel: [{ required: true, message: '请选择文化程度', trigger: 'change' }],
  income: [{ required: true, message: '请选择月收入', trigger: 'change' }]
})
const formRef = ref()

const saveBaseInfoLoading = ref(false)

async function handleSaveBaseInfo() {
  try {
    await formRef.value.validate()
  } catch (err) {
    ElMessage.error('参数验证错误，请仔细填写表单数据!')
    return
  }

  saveBaseInfoLoading.value = true
  const areaProjectCode = wsCache.get('areaProjectCode')
  form.value.isContact = contactList.value.length ? true : false
  form.value.customerUpdate = props.customerUpdate
  if (form.value.mobilephone) {
    form.value.mobilephone = form.value.mobilephone
      .split(',')
      .filter((item) => item !== '')
      .join(',')
  }
  try {
    if (form.value.id) {
      await updateCustomerBaseInfo({
        ...form.value,
        areaProjectCode: areaProjectCode
      })
    } else {
      await saveCustomerBaseInfo({
        ...form.value,
        areaProjectCode: areaProjectCode
      })
    }
    ElMessageBox.confirm('保存成功', '提示', {
      confirmButtonText: '客户详情',
      cancelButtonText: '确定',
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
    saveBaseInfoLoading.value = false
  }
}

async function getContactList() {
  const res = await getContactListById(props.customerId)
  if (res) {
    contactList.value = res.data
  }
}

async function getBaseInfo() {
  const res = await getCustomerBaseDetailById(props.customerId)
  if (res) {
    form.value = res.data
    if (!res.data.nation) {
      form.value.nation = '1'
    }
    if (!res.data.politicalstatus) {
      form.value.politicalstatus = '13'
    }
  }
}

const belongItemList = ref([])

const getBelongList = async () => {
  const { data } = await getBelongItemlabelList({ labelType: 'serviceObject', deleted: false })
  belongItemList.value = data.map((item) => {
    return {
      value: item.id.toString(),
      label: item.name
    }
  })
}

async function queryInfo() {
  await getBaseInfo()
  getContactList()
  getBelongList()
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

const visiblePhone = ref(false)

const phoneMsg = ref([])

const clearPhone = () => {
  form.value.mobilephone = ''
  closePhone()
}

const closePhone = () => {
  phoneMsg.value = []
  phonePage.value.pageNum = 1
  visiblePhone.value = false
}

function detail(row) {
  push(`/customer/detail?id=${row.id}`)
}

const phonePage = ref({
  pageNum: 1,
  pageSize: 5,
  total: 0
})
const checkMobilephone = async () => {
  if (!form.value.mobilephone) return
  form.value.mobilephone = form.value.mobilephone.replace(/，/g, ',')
  const pattern = /^(1[3-9]\d{9}|0\d{2,3}-\d{7,8}|0\d{2,3}\d{7,8})$/
  const mobilephoneArr = form.value.mobilephone.split(',').filter((item) => item !== '')
  isValidPhone.value = mobilephoneArr.every((item) => pattern.test(item))
  if (!isValidPhone.value) return
  const res: any = await getMobilephone({
    mobilephone: form.value.mobilephone,
    id: props.customerId,
    ...phonePage.value
  })
  if (res.data.list.length) {
    phoneMsg.value = res.data.list
    phonePage.value.total = res.data.total
    visiblePhone.value = true
  }
}
</script>
<style scoped lang="less">
.addressInput {
  min-width: 120px;
}
:deep(.el-descriptions__table tr) {
  height: 50px;
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
:deep(.el-descriptions__cell.el-descriptions__label.is-bordered-label) {
  min-width: 134px !important;
}
</style>
