<template>
  <el-page-header title="" @back="onBack" class="common-page-header">
    <template #content>
      <div class="title-name">
        {{ route.query.id ? '编辑' : '新增' }}服务包
        <span v-if="route.query.id">
          ：{{ form.name }} ({{ renderDict(form.usingStatus, 'subsidy_using_status') }} |
          <span :class="form.finishStatus === '3' ? 'color-close' : 'color-unclose'">{{ renderDict(form.finishStatus, 'subsidy_finish_status') }}</span>
          )
        </span>
      </div>
    </template>
  </el-page-header>
  <el-scrollbar class="pr-scrollbar" height="calc(100vh - 205px)">
    <div class="detail-top-gray-info" v-if="route.query.id">
      <span class="mr-5">服务包id：{{ form.id }}</span>
      <span class="mr-5">创建：{{ form.creatorName }} {{ form.createTime }} </span>
      <span class="mr-5"> 最近更新：{{ form.updateTime ? form.updaterName + ' ' + form.updateTime : form.creatorName + ' ' + form.createTime }} </span>
    </div>
    <el-form ref="formRef" :model="form" label-width="110px" :rules="rules" :validate-on-rule-change="false" class="serve-packet-form">
      <h4 class="title r-m-b-16">基础信息</h4>
      <div class="grid-box">
        <el-form-item label="服务包名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入服务包名称" maxlength="20" show-word-limit />
        </el-form-item>
        <el-form-item label="排序码" prop="sortKey">
          <el-input v-model="form.sortKey" placeholder="1-999" />
        </el-form-item>
        <el-form-item label="所属项目">
          <DictSelect width="100%" v-model="form.areaCode" :distList="areaList" placeholder="请选择" :disabled="true" />
        </el-form-item>
      </div>
      <div class="grid-box">
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
      </div>
      <el-form-item label="服务包简介">
        <el-input v-model="form.brief" type="textarea" :rows="3" placeholder="请输入服务包简介" maxlength="2000" show-word-limit />
      </el-form-item>
      <el-form-item label="备注">
        <el-input v-model="form.remark" type="textarea" :rows="3" placeholder="请输入备注" maxlength="300" show-word-limit />
      </el-form-item>
      <div class="grid-box">
        <el-form-item label="是否暂停使用" prop="isUsed">
          <el-radio-group v-model="form.isUsed" :disabled="!route.query.id">
            <el-radio v-for="item in filterDict('yes_no')" :key="item.value" :label="item.value">
              {{ item.label }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否结案" prop="isFinishStatus">
          <el-radio-group v-model="form.isFinishStatus" :disabled="!route.query.id">
            <el-radio v-for="item in filterDict('yes_no')" :key="item.value" :label="item.value">
              {{ item.label }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
      </div>
      <h4 class="title r-m-t-20 r-m-b-16">服务信息</h4>
      <el-form-item label="服务描述" prop="serveDesc">
        <el-input v-model="form.serveDesc" placeholder="请输入服务描述" maxlength="20" show-word-limit />
      </el-form-item>
      <div class="grid-box">
        <el-form-item label="系统充值方式" prop="rechargeMode" class="system-form-item">
          <div class="mode-grid">
            <DictSelect v-model="form.rechargeMode" :distList="filterDict('serve_packet_recharge_mode')" placeholder="请选择" class="recharge-type-select" />
            <div class="flex flex-nowrap r-m-l-8">
              <span class="text-nowrap">每人充值</span>
              <el-input class="rechargeMoney" style="width: 80px; margin: 0 6px" v-model="form.rechargeMoney" min="0" type="number"></el-input>
              <span>元</span>
            </div>
          </div>
          <p class="tip" v-if="form.rechargeMoney <= 0 && form.rechargeMoney.toString() && form.rechargeMode">充值金额不得小于等于0</p>
        </el-form-item>
        <el-form-item label="余额计算周期" prop="balanceMode">
          <DictSelect width="100%" v-model="form.balanceMode" :distList="filterDict('serve_packet_reset_type')" placeholder="请选择（不支持修改）" :disabled="route.query.id != null" />
        </el-form-item>
        <el-form-item label="客户过世方式" prop="stopType">
          <!-- 新增的时候默认第一个 -->
          <DictSelect width="100%" v-model="form.stopType" :distList="filterDict('subsidy_stop_type')" placeholder="请选择" />
        </el-form-item>
      </div>
      <h4 class="title r-m-t-20 r-m-b-16">客户信息</h4>
      <div class="r-m-b-12">
        <el-button type="primary" @click="addCustomer">添加</el-button>
        <el-button @click="batchAddCustomer">批量添加</el-button>
        <el-popconfirm title="确认是否移除所选客户？" :width="200" @confirm="deleteCustomer()">
          <template #reference>
            <el-button :disabled="!multipleSelection.length">移除</el-button>
          </template>
        </el-popconfirm>
      </div>
      <el-table
        :data="form.customerList"
        header-row-class-name="table-header"
        :style="{
          width: 'calc(100vw - 255px)',
          border: '1px solid #f5f3f0',
          borderRadius: '8px'
        }"
        max-height="200"
        @selection-change="handleSelectionChange"
        class="serve-packet-add-table"
      >
        <el-table-column type="selection" width="40" />
        <el-table-column label="序号" type="index" width="60" />
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
        <el-table-column show-overflow-tooltip v-if="route.query.id" prop="usingStatus" min-width="170" label="状态">
          <template #default="{ row }">
            <span class="not-bound" v-if="row.usingStatus === '1'">未使用</span>
            <span class="bound" v-else-if="row.usingStatus === '2'">使用中</span>
            <span class="void" v-else-if="row.usingStatus === '3'">停止使用</span>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="customerName" min-width="160" label="姓名" />
        <el-table-column show-overflow-tooltip prop="sex" min-width="160" label="性别">
          <template #default="{ row }">
            {{ renderDict(row.sex, 'vols_sex') }}
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="mobilephone" min-width="160" label="电话" />
        <el-table-column show-overflow-tooltip prop="idcard" min-width="160" label="证件号码" />
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
      <p
        >1.服务包信息保存成功，<span class="tip">合同起止日期内</span>，系统将按选择的充值/清零方式，<span class="tip">在次月/次季度1号00:00/固定日期</span>充值至客户服务包账户，<span class="tip"
          >并将上月/上季度/上年度余额清零</span
        >
      </p>
      <p>2.过世、暂停使用的客户，不支持系统自动充值</p>
      <p>3.修改客户为过世状态（注意不是指过世时间，是指将是否健在修改为否的时间），该客户服务包立即停止使用</p>
      <p>4.合同到期当月，余额可继续使用，次月起不支持使用</p>
    </div>
    <div class="button-box">
      <el-button type="primary" @click="onSubmit" :loading="saving">保存</el-button>
      <el-button @click="onBack">取消</el-button>
    </div>
  </el-scrollbar>
  <ContractSelectDialog ref="contractSelectRef" />
  <AddCustomerDialog ref="addCustomerRef" source="serve-packet-add" @add-customer="addCustomerList" />
  <BatchAddCustomerDialog ref="batchAddCustomerRef" @add-customer="batchAddCustomerList" />
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue'
import { ElMessage, ElMessageBox, FormRules } from 'element-plus'
import DictSelect from '@/components/DictSelect/index.vue'
import { useRouter, useRoute } from 'vue-router'
import { useCache } from '@/hooks/web/useCache'
import { useAppStoreWithOut } from '@/store/modules/app'
import ContractSelectDialog from './components/contract-select-dialog/index.vue'
import AddCustomerDialog from '@/components/ChooseCustomer/index.vue'
import { saveOpenPacket, servePacketDetail, updateOpenPacket } from '@/api/servePacket'
import BatchAddCustomerDialog from '../subsidy/components/batch-add-customer-dialog/index.vue'
import { computed } from 'vue'
import { useTagsViewStore } from '@/store/modules/tagsView'
import { dictMap, filterDict, renderDict } from '@/hooks/web/useDict'
const { push } = useRouter()
// @ts-ignore
defineOptions({
  // eslint-disable-next-line vue/component-definition-name-casing
  name: 'ServePacketAdd'
})

const { wsCache } = useCache()

const appStoreOut = useAppStoreWithOut()

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

const route = useRoute()
const addCustomerRef = ref()
const addCustomer = () => {
  addCustomerRef.value.open(form.customerList.map((item) => item.customerId))
}

const saving = ref(false)

const formRef = ref()

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
      const editForm = form.customerList.map((item) => {
        return {
          ...item,
          customerId: item.customerId ? item.customerId : item.id,
          servePacketId: item.servePacketId ? item.servePacketId : form.id,
          usingStatus: item.disableOrNot ? '3' : item.usingStatus === '3' ? '1' : item.usingStatus
        }
      })
      await updateOpenPacket({ ...form, customerList: editForm })
      ElMessage.success('修改成功')
      onClear()
      goDetail() // 跳转到详情页
    } else {
      ElMessageBox.confirm(
        '服务包结束日期为' + form.endDate + '，是否确认保存？保存成功，结束日期次日服务包结案状态将变更为“到期待结案”，结束日期次月，服务包状态将变更为“停止使用”，服务包停止使用时不支持充值、下单！',
        '提示',
        {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(async () => {
          const customerList = form.customerList.map((item) => {
            return {
              customerId: item.id
            }
          })
          const { data } = await saveOpenPacket({ ...form, customerList })
          ElMessage.success('添加成功')
          onClear()
          setTimeout(() => {
            formRef.value.clearValidate()
          }, 10)

          // 开放式新增完要进入详情（当前新增页面属于开放式新增）
          push(`/order/servePacketDetail?id=${data}`)
        })
        .catch(() => {})
    }
  } finally {
    saving.value = false
  }
}

const tagsViewStore = useTagsViewStore()
const visitedViews = computed(() => tagsViewStore.getVisitedViews)
//跳转到详情页
const goDetail = () => {
  const obj = visitedViews.value.find((item) => item.path === route.path)
  if (obj) {
    tagsViewStore.delView(obj)
  }
  replace(`/order/servePacketDetail?id=${route.query.id}`)
}

const onClear = () => {
  Object.assign(form, addDefault)
  form.customerList = []
}

function onBack() {
  back()
}

const addDefault = reactive({
  areaCode: undefined,
  areaProjectCode: undefined,
  balanceMode: undefined,
  brief: undefined,
  customerList: [],
  startDate: undefined,
  endDate: undefined,
  date: [],
  id: undefined,
  isFinishStatus: '0',
  isUsed: '0',
  manager: undefined,
  name: undefined,
  no: undefined,
  rechargeMode: undefined,
  rechargeMoney: undefined,
  remark: undefined,
  serveDesc: undefined,
  sortKey: undefined,
  stopType: undefined,
  type: undefined,
  usingStatus: undefined
})
let form = reactive<any>({ ...addDefault })

const rules = reactive<FormRules>({
  name: [
    {
      required: true,
      pattern: /^[\u4e00-\u9fa5a-zA-Z0-9]/,
      message: '请正确填写服务商名称（不含特殊字符）',
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

const addCustomerList = (data) => {
  if (form.customerList) {
    // 使用map()和find()方法来找出与旧数组id不重复的元素
    const uniqueElements = data.filter((newItem) => !form.customerList.find((oldItem) => oldItem.customerId === newItem.id))
    // 将uniqueElements添加至newArray
    form.customerList.push(...uniqueElements)
  } else {
    form.customerList = data
  }
}

const batchAddCustomerList = (data) => {
  const newArr = data.map((item) => {
    return {
      ...item,
      customerName: item.name,
      usingStatus: '1',
      disableOrNot: false
    }
  })
  if (form.customerList) {
    // 使用map()和find()方法来找出与旧数组id不重复的元素
    const uniqueElements = newArr.filter((newItem) => !form.customerList.find((oldItem) => oldItem.customerId === newItem.id))
    // 将uniqueElements添加至newArray
    form.customerList.push(...uniqueElements)
  } else {
    form.customerList = newArr
  }
}

const multipleSelection = ref<any>([])
const handleSelectionChange = (val: any) => {
  multipleSelection.value = val
}

const deleteCustomer = () => {
  let hasUsingData = false
  multipleSelection.value.forEach((item) => {
    if (item.usingStatus === '2') {
      hasUsingData = true
    }
  })
  if (hasUsingData) {
    ElMessage.error('已使用中的客户不可移除')
    return
  }

  // 使用filter()方法过滤出旧数组中不与新数组重复的元素
  form.customerList = form.customerList.filter((item) => !multipleSelection.value.includes(item))
  ElMessage.success('移除成功')
}

const deleteOneCustomer = (row) => {
  // 已使用中的客户不支持移除
  if (row.usingStatus === '2') {
    ElMessage.error('已使用中的客户不可移除')
    return
  }
  // 使用filter()方法过滤出旧数组中不与新数组重复的元素
  form.customerList = form.customerList.filter((item) => item !== row)
  ElMessage.success('移除成功')
}

const getDetail = async () => {
  const { data } = await servePacketDetail(route.query.id)
  Object.assign(form, data)
  if (data.startDate) {
    form.date = [data.startDate, data.endDate]
  }
  if (data.customerList.length) {
    form.customerList = data.customerList.map((item) => {
      return {
        ...item,
        disableOrNot: item.usingStatus === '3'
      }
    })
  }
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

const id = ref<any>('')

const batchAddCustomerRef = ref()
const batchAddCustomer = () => {
  batchAddCustomerRef.value.show(form)
}
let isFirst = true
watch(dictMap, () => {
  if (isFirst) {
    form.stopType = filterDict('subsidy_stop_type')[0].value
    isFirst = !isFirst
    return
  }
})
onMounted(() => {
  //编辑
  if (route.query.id) {
    id.value = route.query.id
    getDetail()
  } else {
    // 新增
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
.serve-packet-form {
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
:deep(.recharge-type-select) {
  width: auto !important;
}

:deep(.time-picker) {
  width: auto !important;
}
.numberInput {
  width: 100%;
}
.tips {
  margin-top: 10px;
  font-size: 12px;
  color: #999;
}
.tips p {
  margin: 3px 0;
}
.tip {
  line-height: 1.4;
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
:deep(.rechargeMoney .el-input__wrapper) {
  min-width: 80px !important;
}
:deep(.rechargeMoney .el-input-group__append) {
  padding: 0 8px;
}
.rechargeMoneyTitle {
  display: block;
  color: #666462;
  width: 56px;
  flex-grow: 1;
}
.serve-packet-add-table :deep(.el-table__inner-wrapper) {
  &::before {
    content: none;
  }
}
</style>
