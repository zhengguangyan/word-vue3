<template>
  <el-dialog v-model="visibleFlag" title="派单确认" width="976px" @closed="onClose" :close-on-press-escape="false" :close-on-click-modal="false">
    <div class="detail-box">
      <h2 class="title"> 订单信息 </h2>
      <div class="info-item item-100">
        <span class="item-label">订单编号</span>
        <span class="item-content">{{ orderInfo.orderNo }}</span>
      </div>
      <div class="info-item">
        <span class="item-label">服务类别</span>
        <span class="item-content">{{ orderInfo.categoryName }}</span>
      </div>
      <div class="info-item">
        <span class="item-label">服务项目</span>
        <span class="item-content">{{ orderInfo.serveName }}</span>
      </div>
      <div class="info-item">
        <span class="item-label">服务子项</span>
        <span class="item-content">{{ orderInfo.serveOptionName }}</span>
      </div>
      <div class="info-item">
        <span class="item-label">单价</span>
        <span class="item-content">￥{{ orderInfo.minCountPrice }}</span>
      </div>
      <div class="info-item">
        <span class="item-label">购买数量</span>
        <span class="item-content">{{ orderInfo.serveCount }}</span>
      </div>
      <div class="info-item">
        <span class="item-label">时间</span>
        <span class="item-content">{{ orderInfo.serveTime }}</span>
      </div>
      <div class="info-item item-100">
        <span class="item-label">备注</span>
        <span class="item-content">{{ orderInfo.remark }}</span>
      </div>
      <div class="interval"></div>
      <h2 class="title"> 下单信息 </h2>
      <div class="info-item">
        <span class="item-label">下单会员</span>
        <span class="item-content">{{ orderInfo.memberName + ' ' + orderInfo.memberMobilephone }}</span>
      </div>
      <div class="info-item">
        <span class="item-label">联系人</span>
        <span class="item-content">{{ orderInfo.contactman + ' ' + orderInfo.mobilephone }}</span>
      </div>
      <div class="info-item item-100">
        <span class="item-label">联系地址</span>
        <span class="item-content">{{ orderInfo.address }}</span>
      </div>
      <div class="interval"></div>
      <h2 class="title"> 服务信息 </h2>

      <!-- 补录历史订单才有 (接单时间) -->
      <el-form v-if="orderInfo.orderType === '3'" ref="formRef" :model="ruleForm" label-width="80px" :rules="rules">
        <el-form-item label="派单时间" prop="sendOrder">
          <el-date-picker v-model="ruleForm.sendOrder" type="datetime" placeholder="请选择派单时间" value-format="YYYY-MM-DD HH:mm" format="YYYY-MM-DD HH:mm" />
        </el-form-item>
      </el-form>

      <el-table :data="[staffInfo]" v-loading="loading" header-row-class-name="table-header" style="max-height: calc(100vh - 600px); margin-bottom: 5px">
        <el-table-column show-overflow-tooltip prop="name" label="员工姓名" width="120" />
        <el-table-column show-overflow-tooltip prop="sex" label="性别" width="80">
          <template #default="{ row }">
            {{ renderDict(row.sex, 'vols_sex') }}
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="acceptSum" label="当天是否已接单">
          <template #default="{ row }">
            {{ row.acceptSum ? '是' : '否' }}
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="professionals" label="专业特长" width="160">
          <template #default="{ row }">
            {{ renderDict(row.professionals, 'profession_skill') }}
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="belongDepartMentName" label="所属部门" />
        <el-table-column show-overflow-tooltip prop="roleNames" label="角色" />
        <el-table-column show-overflow-tooltip prop="mobilePhone" label="联系方式">
          <template #default="{ row }">
            {{ maskPhoneNumber(row.mobilePhone) }}
          </template>
        </el-table-column>
      </el-table>
      <div class="tip r-m-t-10">提示：点击确认派单后，请电话联系服务人员及时确认!</div>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-space :size="30">
          <el-button @click="onClose">取消</el-button>
          <el-button type="primary" @click="changeStaff">确定派单</el-button>
        </el-space>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { setServeorderstatus } from '@/api/order'
import { getOperatorDetail } from '@/api/servicePersonnel'
import { maskPhoneNumber } from '@/utils'
import { ElMessage, FormRules } from 'element-plus'
import { ref, reactive } from 'vue'
import { getSystemTime } from '@/api'
import { formatTime } from '@/utils'
const emits = defineEmits(['reload-list'])

const props = defineProps({
  dict: {
    type: Array,
    default: null
  }
})
const ruleForm = reactive<any>({ sendOrder: '' }) //派单时间
const validateSendOrderTime = (rule: any, value: any, callback: any) => {
  if (new Date(value).getTime() < new Date(orderInfo.value.serveTime).getTime()) {
    return callback()
  }
  return callback(new Error('派单时间需早于服务时间'))
}
const rules = reactive<FormRules>({
  sendOrder: [
    { required: true, message: '请选择派单时间', trigger: 'change' },
    { validator: validateSendOrderTime, trigger: 'change' }
  ]
})
const filterDict = (key: any) => {
  return (props.dict?.find((item: any) => item.type == key) as any)?.list
}

const renderDict = (key: any, dict: any) => {
  if (!key) {
    return
  }
  return filterDict(dict)
    ?.filter((item: any) => key.includes(item.value))
    .map((item: any) => item?.label)
    .join('，')
}

const visibleFlag = ref(false)

const loading = ref(false)

const orderInfo = ref<any>({})

const staffInfo = ref<any>({})

const statusId = ref<any>()
const show = async (row, order, status) => {
  visibleFlag.value = true
  orderInfo.value = order
  staffInfo.value = row
  statusId.value = status
  getDetail(row.id)
  const { data: systemTime } = await getSystemTime()
  ruleForm.sendOrder = formatTime(systemTime, 'yyyy-MM-dd HH:mm')
}

const detailData = ref<any>()

const getDetail = async (id) => {
  const { data } = await getOperatorDetail(id)
  detailData.value = data
}

const onClose = () => {
  detailData.value = {}
  visibleFlag.value = false
}

// const submit = () => {
//   ElMessageBox.confirm('是否确认帮助服务人员“接单”？', '提示')
//     .then(() => {
//       changeStaff()
//     })
//     .catch(() => {})
// }

const submiting = ref(false)
const formRef = ref()
const changeStaff = async () => {
  // //判断是否选择了订单时间
  if (orderInfo.value.orderType === '3') {
    await formRef.value.validate()
    change()
    return
  }
  change()
}

const change = async () => {
  submiting.value = true
  try {
    const res: any = await setServeorderstatus({
      sendOrder: ruleForm.sendOrder || undefined,
      operatorSellerId: staffInfo.value.sourceUserId,
      serveorderId: orderInfo.value.id,
      id: statusId.value
    })
    if (res.code == 200) {
      ElMessage.success('操作成功')
      emits('reload-list')
      onClose()
    } else {
      ElMessage.error(res.msg)
    }
  } finally {
    submiting.value = false
  }
}

defineExpose({
  show
})
</script>

<style scoped lang="less">
.detail-box {
  padding-top: 4px;
  display: flex;
  flex-wrap: wrap;
}
.title {
  width: 100%;
  font-size: 16px;
  margin-bottom: 18px;
}
.interval {
  width: 100%;
  margin-bottom: 24px;
}
.info-item {
  width: 50%;
  line-height: 23px;
  font-size: 14px;
  margin-bottom: 16px;
  display: flex;
  .item-label {
    text-align: left;
    color: var(--main-text-color);
    margin-right: 5px;
    flex-shrink: 0;
  }
  .item-content {
    width: calc(100% - 100px);
    padding-right: 40px;
  }
}
.item-100 {
  width: 100% !important;
}
</style>
