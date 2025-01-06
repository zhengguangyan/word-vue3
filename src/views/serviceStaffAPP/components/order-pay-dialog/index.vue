<template>
  <div>
    <el-dialog v-model="visibleFlag" title="请选择支付方式" width="500px" :close-on-press-escape="false" :close-on-click-modal="false" @close="onClose">
      <div class="w-280px m-auto">
        <el-button type="primary" size="large" class="w-full" @click="handleSubsidy"> 养老卡(补贴) </el-button>
      </div>
    </el-dialog>

    <el-dialog v-model="visibleSubsidy" title="选择补贴" width="800px" :close-on-press-escape="false" :close-on-click-modal="false" @close="onSubsidyClose">
      <div class="flex justify-between">
        <span>本单服务时间：{{ form.serveTime }}</span>
        <span>本单金额：{{ form.money }}元</span>
      </div>
      <el-table :data="subsidyTableData" class="mt-15px">
        <el-table-column type="index" label="序号" align="center" width="60" />
        <el-table-column label="操作" align="center" width="100">
          <template #default="{ row }">
            <el-button link type="primary" @click="onAccount(row)"> 选择 </el-button>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="code" label="养老卡号" />
        <el-table-column show-overflow-tooltip prop="name" label="补贴名称">
          <template #default="{ row }">
            <el-button link type="primary" @click="onSubsidyDetail(row)">
              {{ row.name }}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="subsidyDate" label="补贴合同周期" />
        <el-table-column show-overflow-tooltip prop="balanceMode" label="余额计算周期">
          <template #default="{ row }">
            <span>{{ renderDict(row.balanceMode, 'subsidy_reset_type') }}</span>
          </template>
        </el-table-column>
      </el-table>
      <div class="error-tips">
        补贴列表显示规则：<span class="text-[#999]">（要查看老人的所有补贴，可进入“补贴人员管理”页面搜索查看。）</span><br />
        1、仅显示当前项目地区下的补贴； <br />
        2、不显示“已结案”的补贴；<br />
        3、不显示“服务时间所在月份”不在“补贴合同周期月份”内的补贴（仅显示“服务时间月份”在“合同周期月份”内的补贴）；<br />
        4、不显示“补贴状态”或“补贴人员状态”停止使用的补贴；
      </div>
    </el-dialog>

    <el-dialog v-model="visibleAccount" title="请选择支付的账单月份" width="800px" :close-on-press-escape="false" :close-on-click-modal="false" @close="onAccountClose">
      <div class="flex justify-between top">
        <span>
          <span>养老卡号：</span>
          <el-button link type="primary" @click="onCardDetail">
            {{ subsidy.code }}
          </el-button>
        </span>
        <span>本单服务时间：{{ form.serveTime }}</span>
        <span>本单金额：{{ form.money }}元</span>
      </div>
      <div class="mt-15px">已选补贴：{{ subsidy.name }}</div>
      <div class="flex justify-between mt-15px">
        <span>余额计算周期：{{ renderDict(subsidy.balanceMode, 'subsidy_reset_type') }}</span>
        <span>补贴合同周期：{{ subsidy.subsidyDate }}</span>
      </div>
      <el-table :data="accountTableData" class="mt-15px">
        <el-table-column type="index" label="序号" align="center" width="60" />
        <el-table-column label="操作" align="center" width="100">
          <template #default="{ row }">
            <el-button link type="primary" @click="onPay(row)" :disabled="+row.balance < +form.money"> 选择 </el-button>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="month" label="账单月份" />
        <el-table-column show-overflow-tooltip prop="balance" label="当月余额">
          <template #default="{ row }">
            <div>
              <span>{{ row.balance }}</span>
              <span v-if="+row.balance < +form.money" class="error-color">（当月余额不足）</span>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <template #footer>
        <div class="dialog-footer mt-15px">
          <el-button type="primary" @click="onSubsidyBack">返回选择补贴</el-button>
        </div>
      </template>
    </el-dialog>

    <el-dialog v-model="visiblePay" title="支付确认" width="500px" :close-on-press-escape="false" :close-on-click-modal="false" @close="onPayClose">
      <el-form ref="formRef" :model="form" label-width="120px">
        <el-form-item label="服务时间">
          <span>{{ form.serveTime }}</span>
        </el-form-item>
        <el-form-item label="本单金额">
          <span>{{ form.money }}元</span>
        </el-form-item>
        <el-form-item label="支付方式">
          <span>
            <span> 养老卡</span>
            <el-button link type="primary" @click="onCardDetail">
              {{ subsidy.code }}
            </el-button>
          </span>
        </el-form-item>
        <el-form-item label="已选补贴">
          <div>
            <span>{{ subsidy.name }}</span>
            <div class="info-color">余额：{{ balanceInfo.balance }}元</div>
          </div>
        </el-form-item>
        <el-form-item label="已选账单月份">
          <div>
            <span>{{ balanceInfo.month }}</span>
            <div class="error-color" v-if="!form.serveTime.includes(balanceInfo.month)"> 账单月份与服务时间月份不一致，请核对信息 </div>
          </div>
        </el-form-item>
        <el-form-item label="支付后当月余额">
          <span>{{ (balanceInfo.balance - form.money).toFixed(2) }}元</span>
        </el-form-item>
      </el-form>
      <div class="error-tips">
        注意：<br />
        请仔细核对本次支付信息，确认支付后将无法再次修改。<br />
        同时，订单的“服务时间、金额”等内容将不再支持修改
      </div>
      <div v-if="!form.serveTime.includes(balanceInfo.month)">
        <el-checkbox v-model="btnDisabled" label="已核对信息，确认支付" />
      </div>
      <template #footer>
        <div class="dialog-footer mt-20px">
          <el-button @click="onAcountBack" class="w-120px">返回选择</el-button>
          <el-button type="primary" :disabled="!btnDisabled" class="w-120px" @click="onSubmit"> 确 认 </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getSubsidyByCustomerId, getSubsidyAccountPage, confirmPayment } from '@/api/serviceStaffAPP'
import { renderDict } from '@/hooks/web/useDict'

interface Subsidy {
  code?: string
  name?: string
  subsidyDate?: string
  balanceMode?: string
  subsidyCustomerId?: number
  subsidyInfoId?: number
  cardId?: number
}

const { push } = useRouter()

const emits = defineEmits(['reload'])

const visibleFlag = ref(false)
const visibleSubsidy = ref(false)
const visibleAccount = ref(false)
const visiblePay = ref(false)
const loading = ref(false)
const subsidyTableData = ref([])
const accountTableData = ref<Subsidy[]>([])
const subsidy = ref<any>({})
const btnDisabled = ref(false)
const balanceInfo = ref({ month: '', balance: 0, id: 0 })

function show(data) {
  form = data
  visibleFlag.value = true
}

function onClose() {
  visibleFlag.value = false
}

const handleSubsidy = () => {
  visibleFlag.value = false
  loadSubsidy()
}

async function loadSubsidy() {
  loading.value = true
  const { data } = await getSubsidyByCustomerId({
    customerId: form.memberId,
    serveTime: form.serveTime
  })
  if (!data || !data.length) {
    onSubsidyClose()
    ElMessageBox.confirm('该老人没有可以使用的补贴方式', '提示', { showCancelButton: false })
    return
  }
  subsidyTableData.value = data
  loading.value = false
  visibleSubsidy.value = true
}

function onSubsidyClose() {
  visibleFlag.value = false
  visibleSubsidy.value = false
}

const onSubsidyDetail = (row) => {
  push(`/subsidy/subsidyDetail?id=${row.subsidyInfoId}`)
}

const onCardDetail = () => {
  push(`/subsidy/cardDetail?id=${subsidy.value.cardId}`)
}

const onAccount = (row) => {
  subsidy.value = row
  visibleSubsidy.value = false
  loadAccount(row)
}

async function loadAccount(row) {
  loading.value = true
  const { data } = await getSubsidyAccountPage({
    customerId: form.memberId,
    subsidyInfoId: row.subsidyInfoId,
    pageSize: 20
  })
  accountTableData.value = data.list
  loading.value = false
  visibleAccount.value = true
}

const onAccountClose = () => {
  visibleFlag.value = false
  visibleAccount.value = false
}

const onSubsidyBack = () => {
  visibleAccount.value = false
  visibleSubsidy.value = true
}

const onPay = (row) => {
  visibleAccount.value = false
  balanceInfo.value = row
  visiblePay.value = true
  btnDisabled.value = form.serveTime.includes(row.month)
}

const onPayClose = () => {
  visiblePay.value = false
}

const onAcountBack = () => {
  visiblePay.value = false
  visibleAccount.value = true
}

const formDefault = reactive({})

let form = reactive<any>({ ...formDefault })

const formRef = ref()

const onSubmit = async () => {
  try {
    const params = {
      cardId: subsidy.value.cardId,
      code: subsidy.value.code,
      id: form.id,
      name: subsidy.value.name,
      payType: 1,
      subsidyAccountId: balanceInfo.value.id,
      subsidyCustomerId: subsidy.value.subsidyCustomerId
    }
    await confirmPayment(params)
    ElMessage.success('支付成功')
    emits('reload')
    visiblePay.value = false
  } finally {
    loading.value = false
  }
}

defineExpose({
  show
})
</script>

<style lang="less" scoped>
.error-tips {
  margin: 10px 0;
  font-size: 12px;
  color: var(--el-color-danger);
  line-height: 18px;
}

.top {
  padding-bottom: 15px;
  border-bottom: 1px dotted #ccc;
}
</style>
