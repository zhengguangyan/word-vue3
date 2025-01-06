<template>
  <el-page-header @back="onBack" class="common-page-header">
    <template #content>
      <h2 class="r-font-16">{{ pageTitle }}</h2>
    </template>
  </el-page-header>
  <el-scrollbar height="calc(100vh - 195px)">
    <div class="detail-top-gray-info" v-if="route.query.id">
      <span class="mr-5">补贴编号：{{ form.no }}</span>
      <span class="mr-5">创建：{{ form.creatorName }} {{ form.createTime }} </span>
      <span class="mr-5">最近更新：{{ form.updateTime ? form.updaterName + ' ' + form.updateTime : form.creatorName + ' ' + form.createTime }}</span>
    </div>
    <el-form ref="formRef" :model="form" label-width="110px" :rules="rules" :validate-on-rule-change="false" class="subsidy-form">
      <h4 class="title r-m-b-16">基础信息</h4>
      <div class="grid-box">
        <el-form-item label="补贴名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入补贴名称" maxlength="20" show-word-limit />
        </el-form-item>
        <el-form-item label="排序码" prop="sortKey">
          <el-input-number class="numberInput" :controls="false" v-model="form.sortKey" :min="1" :max="999" :step="1" :precision="0" placeholder="1~999" />
        </el-form-item>
        <el-form-item label="合同起止时间" prop="date">
          <el-date-picker
            v-model="form.date"
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            @change="changeBusiness"
            :shortcuts="dateShortcuts"
            class="time-picker"
          />
        </el-form-item>
        <el-form-item label="业务负责人">
          <el-input v-model="form.manager" placeholder="请输入业务负责人" />
        </el-form-item>
        <el-form-item label="所属项目" class="project-form-item">
          <DictSelect width="100%" v-model="form.areaCode" :distList="areaList" placeholder="请选择所属项目" :disabled="true" />
          <span class="project-tip">系统自动根据创建人当前所属项目显示，不支持修改</span>
        </el-form-item>
      </div>
      <el-form-item label="补贴简介">
        <el-input
          v-model="form.brief"
          type="textarea"
          :rows="3"
          placeholder="请输入补贴介绍，如充值方式：每人每月1号充值600元；余额支持累加；余额清零方式；过世次月清零，其他不清零"
          maxlength="2000"
          show-word-limit
        />
      </el-form-item>
      <el-form-item label="备注">
        <el-input v-model="form.remark" type="textarea" :rows="3" placeholder="请输入备注" maxlength="300" show-word-limit />
      </el-form-item>
      <div class="grid-box">
        <el-form-item label="是否暂停使用">
          <el-radio-group v-model="form.isClosed" :disabled="!route.query.id">
            <el-radio value="1">是</el-radio>
            <el-radio value="0">否</el-radio>
          </el-radio-group>
          <p class="error-tips" v-if="form.isClosed === '1'"> 补贴暂停使用的客户下单不支持使用该补贴金支付，支持修改。 </p>
        </el-form-item>
        <el-form-item label="是否结案">
          <el-radio-group v-model="form.isFinish" :disabled="!route.query.id">
            <el-radio value="1">是</el-radio>
            <el-radio value="0">否</el-radio>
          </el-radio-group>
          <p class="error-tips" v-if="form.isFinish === '1'"> 补贴结案后不再支持修改/使用该补贴信息，请慎重操作。 </p>
        </el-form-item>
      </div>
      <h4 class="title r-m-t-20 r-m-b-16">服务信息</h4>
      <el-form-item label="服务描述" prop="serveDesc">
        <el-input v-model="form.serveDesc" placeholder="请输入服务描述" maxlength="20" show-word-limit />
      </el-form-item>
      <div class="grid-box">
        <el-form-item label="系统充值方式" prop="rechargeMode" class="system-form-item">
          <div class="flex">
            <DictSelect v-model="form.rechargeMode" :distList="filterDict('subsidy_recharge_type')" placeholder="请选择" class="recharge-type-select" width="120px" />
            <template v-if="form.rechargeMode === '3'">
              <DictSelect v-model="form.rechargeMonth" :distList="monthDic" placeholder="请选择" class="r-m-l-10" width="80px" />
              <span>月</span>
              <DictSelect v-model="form.rechargeDay" :distList="calDayDic" placeholder="请选择" class="r-m-l-10" width="80px" /> <span>日</span>
            </template>
            <div class="flex flex-nowrap r-m-l-8">
              <span class="text-nowrap">每人充值</span>
              <el-input class="rechargeMoney" style="width: 80px; margin: 0 6px" v-model="form.rechargeMoney" min="0" type="number"></el-input>
              <span>元</span>
            </div>
          </div>
          <p class="tip" v-if="form.rechargeMoney <= 0 && form.rechargeMoney.toString() && form.rechargeMode">充值金额不得小于等于0</p>
        </el-form-item>
        <el-form-item label="余额计算周期" prop="balanceMode">
          <DictSelect width="100%" v-model="form.balanceMode" :distList="filterDict('subsidy_reset_type')" placeholder="请选择(不支持修改)" :disabled="Boolean(id)" />
        </el-form-item>
        <el-form-item label="客户过世方式" prop="stopType">
          <DictSelect width="100%" v-model="form.stopType" :distList="filterDict('subsidy_stop_type')" placeholder="请选择" />
        </el-form-item>
      </div>
      <div class="grid-box">
        <el-form-item label="补贴用途" prop="subsidyPurpose">
          <DictSelect width="100%" v-model="form.subsidyPurpose" :distList="filterDict('subsidy_purpose')" placeholder="请选择(多选)" :multiple="true" :tags="2" />
        </el-form-item>
        <el-form-item label="每单补贴规则" v-if="form.subsidyPurpose.includes('1')" class="grid-span-2">
          <div class="flex" style="height: 32px">
            <span class="ruleSpan" v-if="form.subsidyAmount">每单补贴上限 {{ form.subsidyAmount }} 元</span>
            <span class="ruleSpan" v-if="form.subsidyFreday">每日限制 {{ form.subsidyFreday }} 次</span>
            <span class="ruleSpan" v-if="form.subsidyFremonth">每周限制 {{ form.subsidyFremonth }} 次</span>
            <span class="ruleSpan" v-if="form.subsidyFreweek">每月限制 {{ form.subsidyFreweek }} 次</span>
            <el-button link type="primary" @click="editSubsidyRule">
              {{ form.subsidyAmount || form.subsidyFreday || form.subsidyFremonth || form.subsidyFreweek ? '修改' : '添加' }}
            </el-button>
          </div>
        </el-form-item>
      </div>
      <h4 class="title r-m-t-20 r-m-b-16">客户信息</h4>
      <el-space wrap :size="12" style="margin-bottom: 10px">
        <el-button type="primary" @click="addCustomer">添加</el-button>
        <el-button @click="batchAddCustomer">批量添加</el-button>
        <el-popconfirm title="确认是否移除所选客户？" :width="200" @confirm="deleteCustomer()">
          <template #reference>
            <el-button :disabled="!multipleSelection.length">移除</el-button>
          </template>
        </el-popconfirm>
      </el-space>
      <el-table
        :data="form.subsidyCustomers"
        header-row-class-name="table-header"
        :style="{
          width: 'calc(100% - 40px)',
          border: '1px solid #f5f3f0',
          borderRadius: '8px'
        }"
        max-height="200"
        @selection-change="handleSelectionChange"
        class="subsidy-add-table"
      >
        <el-table-column type="selection" width="40" />
        <el-table-column label="操作" width="100">
          <template #default="{ row }">
            <el-popconfirm title="确认是否移除该客户？" :width="200" @confirm="deleteOneCustomer(row)">
              <template #reference>
                <el-button link type="primary" size="small"> 移除 </el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
        <el-table-column v-if="route.query.id" prop="disableOrNot" min-width="160" label="是否停止使用">
          <template #default="{ row }">
            <el-switch v-model="row.disableOrNot" inline-prompt active-text="是" inactive-text="否" />
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="usingStatus" min-width="170" label="状态">
          <template #default="{ row }">
            <span class="not-bound" v-if="row.usingStatus === '1'">未使用</span>
            <span class="bound" v-else-if="row.usingStatus === '2'">使用中</span>
            <span class="void" v-else-if="row.usingStatus === '3'">停止使用</span>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="name" min-width="160" label="姓名" />
        <el-table-column show-overflow-tooltip prop="sex" min-width="160" label="性别">
          <template #default="{ row }">
            {{ renderDict(row.sex, 'vols_sex') }}
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="mobilephone" min-width="160" label="电话" />
        <el-table-column show-overflow-tooltip prop="idcard" min-width="180" label="证件号码" />
        <el-table-column show-overflow-tooltip prop="deathFlag" min-width="160" label="是否健在">
          <template #default="{ row }">
            {{ renderDict(row.deathFlag, 'yes_no') }}
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="remark" min-width="160" label="备注" />
      </el-table>
    </el-form>
    <div class="tips">
      <p>注意：</p>
      <p>
        1、补贴信息保存成功，<span class="red-color">合同起止日期内</span>，系统将按选择的充值/清零方式，<span class="red-color">在次月/次季度1号00:00/固定日期</span>充值至客户补贴账户中，并将<span
          class="red-color"
          >上月/上季度/上年度余额清零</span
        >
      </p>
      <p>2、“停止使用“的补贴，“停止便用“的客户，不支持系统自动充值</p>
      <p> 3、修改客户为过世状态（注意不是指过世时间，是指将是否健在修改为否的时间），该客户补贴自动停止使用，将不再支持使用补贴金支付订单 </p>
      <p> 4、合同到期当月，补贴金可继续使用，合同到期次月补贴停止使用，补贴停止使用，客户不支持使用补贴支付订单 </p>
    </div>
    <div class="button-box">
      <el-button type="primary" @click="onSubmit" :loading="saving">保存</el-button>
      <el-button @click="onBack">取消</el-button>
    </div>
  </el-scrollbar>
  <AddCustomerDialog ref="addCustomerRef" @add-customer="addCustomerList" />
  <BatchAddCustomerDialog ref="batchAddCustomerRef" @add-customer="addCustomerList" />
  <SubsidyRuleFormDialog ref="subsidyRuleFormRef" @reload-list="changeSubsidyRule" />
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox, FormRules } from 'element-plus'
import DictSelect from '@/components/DictSelect/index.vue'
import { useRouter, useRoute } from 'vue-router'
import { watch } from 'vue'
import AddCustomerDialog from './components/add-customer-dialog/index.vue'
import BatchAddCustomerDialog from './components/batch-add-customer-dialog/index.vue'
import SubsidyRuleFormDialog from './components/subsidy-rule-form-dialog/index.vue'
import { saveSubsidyInfo, getSubsidyInfo } from '@/api/subsidy'
import { updateSubsidyInfo } from '@/api/subsidy'
import { useCache } from '@/hooks/web/useCache'
import { useAppStoreWithOut } from '@/store/modules/app'
import { useTagsViewStore } from '@/store/modules/tagsView'
import { filterDict, renderDict } from '@/hooks/web/useDict'

// @ts-ignore
defineOptions({
  // eslint-disable-next-line vue/component-definition-name-casing
  name: 'SubsidyAdd'
})

const { wsCache } = useCache()

const appStoreOut = useAppStoreWithOut()
const monthDic = ref([
  { label: '一月', value: '01' },
  { label: '二月', value: '02' },
  { label: '三月', value: '03' },
  { label: '四月', value: '04' },
  { label: '五月', value: '05' },
  { label: '六月', value: '06' },
  { label: '七月', value: '07' },
  { label: '八月', value: '08' },
  { label: '九月', value: '09' },
  { label: '十月', value: '10' },
  { label: '十一月', value: '11' },
  { label: '十二月', value: '12' }
])
const dayDic = ref([
  { label: '1号', value: '01' },
  { label: '2号', value: '02' },
  { label: '3号', value: '03' },
  { label: '4号', value: '04' },
  { label: '5号', value: '05' },
  { label: '6号', value: '06' },
  { label: '7号', value: '07' },
  { label: '8号', value: '08' },
  { label: '9号', value: '09' },
  { label: '10号', value: '10' },
  { label: '11号', value: '11' },
  { label: '12号', value: '12' },
  { label: '13号', value: '13' },
  { label: '14号', value: '14' },
  { label: '15号', value: '15' },
  { label: '16号', value: '16' },
  { label: '17号', value: '17' },
  { label: '18号', value: '18' },
  { label: '19号', value: '19' },
  { label: '20号', value: '20' },
  { label: '21号', value: '21' },
  { label: '22号', value: '22' },
  { label: '23号', value: '23' },
  { label: '24号', value: '24' },
  { label: '25号', value: '25' },
  { label: '26号', value: '26' },
  { label: '27号', value: '27' },
  { label: '28号', value: '28' },
  { label: '29号', value: '29' },
  { label: '30号', value: '30' },
  { label: '31号', value: '31' }
])

const calDayDic = computed(() => {
  if (form.rechargeMonth === '02') {
    return dayDic.value.filter((item) => !['30', '31'].includes(item.value))
  }
  if (['04', '06', '09', '11'].includes(form.rechargeMonth)) {
    return dayDic.value.filter((item) => !['31'].includes(item.value))
  }
  return dayDic.value
})
const areaList = ref(
  wsCache.get(appStoreOut.getUserInfo).sysAreas.map((item) => {
    return {
      value: item.code,
      label: item.name
    }
  })
)

const areaCode = ref(wsCache.get('areaCode'))

const { back, replace } = useRouter()

const id = ref<any>(undefined)

const route = useRoute()

const addCustomerRef = ref()
const addCustomer = () => {
  addCustomerRef.value.show(form)
}

const batchAddCustomerRef = ref()
const batchAddCustomer = () => {
  batchAddCustomerRef.value.show(form)
}

const subsidyRuleFormRef = ref()
const editSubsidyRule = () => {
  subsidyRuleFormRef.value.show(form)
}

const changeSubsidyRule = (data) => {
  form.subsidyAmount = Number(data.subsidyAmount)
  form.subsidyFreday = Number(data.subsidyFreday)
  form.subsidyFremonth = Number(data.subsidyFremonth)
  form.subsidyFreweek = Number(data.subsidyFreweek)
}

const saving = ref(false)

const formRef = ref()

const pageTitle = computed(() => {
  return route.query.id ? `编辑补贴：${form.name}(${renderDict(form.usingStatus, 'subsidy_using_status')})` : '新增补贴'
})

const onSubmit = async () => {
  if (form.rechargeMoney <= 0) {
    ElMessage.error('充值金额不得小于等于0!')
    return
  }
  try {
    await formRef.value.validate()
    save()
  } catch (err) {
    ElMessage.error('参数验证错误，请仔细填写表单数据!')
  }
}

const save = async () => {
  saving.value = true
  try {
    if (route.query.id) {
      const editForm = form.subsidyCustomers
        ? form.subsidyCustomers.map((item) => {
            return {
              id: item.id,
              usingStatus: item.disableOrNot ? '3' : item.usingStatus === '3' ? '1' : item.usingStatus
            }
          })
        : null
      await updateSubsidyInfo({ ...form, subsidyCustomers: editForm })
      ElMessage.success('修改成功')
      onClear()
      goDetail()
    } else {
      ElMessageBox.confirm(
        '补贴结束日期为' + form.endDate + '，是否确认保存？保存成功，结束日期次日补贴结案状态将变更为“到期待结案”，结束日期次月，补贴状态将变更为“停止使用”，补贴停止使用时不支持充值、下单！',
        '确认添加补贴？',
        {
          confirmButtonText: '确认',
          cancelButtonText: '取消'
          // type: "warning",
        }
      )
        .then(async () => {
          const customerIds = form.subsidyCustomers.map((item) => item.id)
          const res = await saveSubsidyInfo({ ...form, customerIds })
          ElMessage.success('添加成功')
          let id = res.log.split('新增补贴').join('')
          onClear()
          goDetail(id)
          // setTimeout(() => {
          //   formRef.value.clearValidate()
          // }, 10)
        })
        .catch(() => {})
    }
  } finally {
    saving.value = false
  }
}

// 关闭当前标签
const tagsViewStore = useTagsViewStore()
const visitedViews = computed(() => tagsViewStore.getVisitedViews)
const goDetail = (data?) => {
  const obj = visitedViews.value.find((item) => item.fullPath === route.fullPath)
  if (obj) {
    tagsViewStore.delView(obj)
  }
  if (data) {
    replace(`/subsidy/subsidyDetail?id=${data}`)
    return
  }
  replace(`/subsidy/subsidyDetail?id=${id.value}`)
}

const onClear = () => {
  Object.assign(form, addDefault)
}

function onBack() {
  back()
}

const dateShortcuts = [
  {
    text: '最近一周',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
      return [start, end]
    }
  },
  {
    text: '最近一个月',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
      return [start, end]
    }
  },
  {
    text: '最近三个月',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
      return [start, end]
    }
  },
  {
    text: '本季度',
    value: () => {
      const now = new Date()
      const currMonth = now.getMonth() + 1
      const quarterStartMonth = Math.floor((currMonth - 1) / 3) * 3 + 1
      const start = new Date(now.getFullYear(), quarterStartMonth - 1, 1)
      const nextMonth = now.getMonth() + 1 // 下一个月
      let end
      if (nextMonth < 12) {
        end = new Date(now.getFullYear(), nextMonth, 0)
      } else {
        end = new Date(now.getFullYear() + 1, 0, 0)
      }
      return [start, end]
    }
  },
  {
    text: '今年',
    value: () => {
      const now = new Date()
      const end = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999)
      const start = new Date(now.getFullYear(), 0, 1)
      return [start, end]
    }
  }
]

const addDefault = reactive({
  name: undefined,
  sortKey: undefined,
  areaCode: undefined,
  date: undefined,
  startDate: undefined,
  endDate: undefined,
  manager: undefined,
  brief: undefined,
  remark: undefined,
  isClosed: '0',
  isFinish: '0',
  serveDesc: undefined,
  rechargeMode: undefined,
  rechargeMoney: undefined,
  balanceMode: undefined,
  stopType: '1',
  subsidyAmount: undefined,
  subsidyFreday: undefined,
  subsidyFremonth: undefined,
  subsidyFreweek: undefined,
  subsidyPurpose: [],
  subsidyCustomers: []
})
let form = reactive<any>({ ...addDefault })

const rules = reactive<FormRules>({
  name: [
    {
      required: true,
      pattern: /^[\u4e00-\u9fa5a-zA-Z0-9-]{1,20}$/,
      message: '请正确填写补贴名称',
      trigger: 'change'
    }
  ],
  sortKey: [{ required: true, message: '请输入排序码', trigger: 'change' }],
  date: [{ required: true, message: '请选择合同起止时间', trigger: ['change', 'blur'] }],
  serveDesc: [{ required: true, message: '请输入服务描述', trigger: ['change', 'blur'] }],
  rechargeMode: [{ required: true, message: '请选择系统充值方式', trigger: ['change', 'blur'] }],
  rechargeMoney: [{ required: true, message: '请填写每人充值', trigger: ['change', 'blur'] }],
  balanceMode: [{ required: true, message: '请填写余额计算周期', trigger: ['change', 'blur'] }],
  stopType: [{ required: true, message: '请选择客户过世方式', trigger: ['change', 'blur'] }],
  subsidyPurpose: [{ required: true, message: '请选择补贴用途', trigger: 'change' }]
})

const addCustomerList = (data) => {
  if (form.subsidyCustomers) {
    // 使用map()和find()方法来找出与旧数组id不重复的元素
    const uniqueElements = data.filter((newItem) => !form.subsidyCustomers.find((oldItem) => oldItem.id === newItem.id))
    // 将uniqueElements添加至newArray
    form.subsidyCustomers.push(...uniqueElements)
  } else {
    form.subsidyCustomers = data
  }
}

const multipleSelection = ref<any>([])
const handleSelectionChange = (val: any) => {
  multipleSelection.value = val
}

const deleteCustomer = () => {
  // 使用filter()方法过滤出旧数组中不与新数组重复的元素
  form.subsidyCustomers = form.subsidyCustomers.filter((item) => !multipleSelection.value.includes(item))
  ElMessage.success('移除成功')
}

const deleteOneCustomer = (row) => {
  // 使用filter()方法过滤出旧数组中不与新数组重复的元素
  form.subsidyCustomers = form.subsidyCustomers.filter((item) => item !== row)
  ElMessage.success('移除成功')
}

const changeBusiness = () => {
  if (form.date?.length) {
    form.startDate = form.date[0]
    form.endDate = form.date[1]
    return
  }
  form.startDate = undefined
  form.endDate = undefined
}

const getDetail = async () => {
  const { data } = await getSubsidyInfo(route.query.id)
  Object.assign(form, data)
  if (data.startDate) {
    form.date = [data.startDate, data.endDate]
  }
  if (data.subsidyCustomers.length) {
    form.subsidyCustomers = data.subsidyCustomers.map((item) => {
      return {
        ...item,
        disableOrNot: item.usingStatus === '3'
      }
    })
  }
}

watch(
  () => id.value,
  (value) => {
    if (value) {
      getDetail()
    }
  }
)

onMounted(() => {
  if (route.query.id) {
    id.value = route.query.id
    getDetail()
  } else {
    form.areaCode = areaCode.value
  }
})
</script>

<style scoped lang="less">
.adapter(@size, @content) {
  @media only screen and (max-width: @size) {
    @content();
  }
}
.subsidy-form {
  margin-top: 20px;
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
.mode-grid {
  width: 100%;
  display: grid;
  grid-template-columns: 1fr auto;
}
// :deep(.recharge-type-select) {
//   width: auto !important;
// }
.project-tip {
  position: absolute;
  left: calc(100% + 10px);
  top: 0;
  color: #999;
  white-space: nowrap;
}
.red-color {
  color: var(--el-color-danger);
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
:deep(.time-picker) {
  width: auto !important;
}
.form-item {
  width: 33.33%;
  padding-right: 40px;
  display: inline-block;
}
.numberInput {
  width: 100%;
}
.tips {
  margin-top: 16px;
  font-size: 12px;
  color: #999;
}
.tips p {
  margin: 3px 0;
}
.button-box {
  margin-top: 40px;
  padding-left: 110px;
}
:deep(.el-input-number .el-input__inner) {
  text-align: left;
}
:deep(.el-checkbox:last-of-type) {
  margin-right: 30px;
}
.ruleSpan {
  margin-right: 10px;
}
.error-tips {
  line-height: 1.2;
  color: #ccc;
}
.subsidy-add-table :deep(.el-table__inner-wrapper) {
  &::before {
    content: none;
  }
}
.tip {
  line-height: 1.4;
}
</style>
