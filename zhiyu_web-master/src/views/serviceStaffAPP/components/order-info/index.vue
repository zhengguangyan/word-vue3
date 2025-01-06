<template>
  <el-page-header title="" @back="onBack">
    <template #content>
      <div class="title-name">自建订单{{ isEdit ? '编辑' : '详情' }}： {{ form.memberName }} （{{ orderStatus }}） </div>
    </template>
    <template #extra>
      <el-space wrap :size="12">
        <el-button v-if="form.status === '3'" @click="verifyCancel">取消订单</el-button>
        <el-button v-if="form.status === '4'" @click="showVideoCall">发起视频通话</el-button>
        <el-button v-if="form.status === '6'" @click="showAuditDialog">选择审核结果</el-button>
        <el-button v-if="!isEdit && ['3', '4', '5', '6', '7', '8'].includes(form.status)" @click="handleEdit"> 编辑 </el-button>
      </el-space>
    </template>
    <div class="detail-top-gray-info">
      <span class="mr-5">订单编号：{{ form.orderNumber }}</span>
      <span class="mr-5">订单类型：普通订单</span>
      <span class="mr-5">来源：{{ form.source || 'APP订单' }}</span>
      <span class="mr-5">创建人：{{ form.creatorName }}</span>
      <span class="mr-5">服务人员：{{ form.operatorName }}</span>
    </div>
  </el-page-header>

  <el-scrollbar height="calc(100vh - 285px)">
    <h4 class="title !mt-0">订单状态</h4>
    <OrderStatus :detail="form" @aduit="showAuditDialog" />

    <h4 class="title">基础信息</h4>
    <div class="info-list">
      <div class="detail-info-item item-33">
        <span class="detail-info-item-label">服务对象</span>
        <span class="detail-info-item-content">
          <el-button class="r-m-r-5" link type="primary" @click="customerDetail(form.memberId)">
            {{ form.memberName }}
          </el-button>
          <span class="r-m-r-5">{{ renderDict(form.sex, 'vols_sex') }}</span>
          <span class="r-m-r-5">{{ form.idcard }}</span>
          <span>{{ form.age || '-' }}岁</span>
        </span>
      </div>
      <div class="detail-info-item item-66">
        <span class="detail-info-item-label">联系电话</span>
        <span class="detail-info-item-content">{{ form.mobilePhone }}</span>
      </div>
      <div class="detail-info-item item-33">
        <span class="detail-info-item-label">归属项目(一级)</span>
        <span class="detail-info-item-content">
          <span>{{ renderDict(form.belongProject, 'belong_project') }} </span>
          <el-button v-if="isEdit" link type="primary" class="ml-5px" @click="showBelongProjectSelect">修改 </el-button>
        </span>
      </div>
      <div v-if="form.secondBelongProjectName || isEdit" class="detail-info-item item-33">
        <span class="detail-info-item-label">归属项目(二级)</span>
        <span class="detail-info-item-content">
          <span> {{ form.secondBelongProjectName || '' }} </span>
          <el-button v-if="isEdit" link type="primary" class="ml-5px" @click="showSecondBelongProjectSelect">修改</el-button>
        </span>
      </div>
      <div v-if="false" class="detail-info-item item-100">
        <span class="detail-info-item-label">政府补贴内容</span>
        <span class="detail-info-item-content"> - </span>
      </div>
      <div v-if="false" class="detail-info-item item-100">
        <span class="detail-info-item-label">补贴内容</span>
        <span class="detail-info-item-content"> - </span>
      </div>
      <div v-if="false" class="detail-info-item item-100">
        <span class="detail-info-item-label">归属合同</span>
        <span class="detail-info-item-content"> - </span>
      </div>

      <div class="detail-info-item item-33">
        <span class="detail-info-item-label">政府补助标准</span>
        <span class="detail-info-item-content"> {{ '' || '无' }} </span>
      </div>

      <div class="detail-info-item item-633">
        <span class="detail-info-item-label">服务地址</span>
        <span class="detail-info-item-content"> {{ form.address }} </span>
      </div>
      <div class="detail-info-item item-66">
        <span class="detail-info-item-label">计划服务时间</span>
        <span class="detail-info-item-content">
          <span>{{ form.serveTime }}</span>
          <el-button v-if="isEdit" link type="primary" class="ml-5px" @click="showServiceTimeChange">修改</el-button>
        </span>
      </div>
    </div>

    <div v-if="form.startOrderTime">
      <h4 class="flex justify-between">
        <span class="title">开始服务</span>
        <el-button v-if="isEdit" type="primary" plain class="mr-20px" @click="showServiceStartChange">修改开始服务 </el-button>
      </h4>
      <div class="info-list">
        <div class="detail-info-item item-33">
          <span class="detail-info-item-label">开始时间</span>
          <span class="detail-info-item-content"> {{ form.startOrderTime }} </span>
        </div>
        <div class="detail-info-item item-66">
          <span class="detail-info-item-label">开始地址</span>
          <span class="detail-info-item-content">
            <el-button link type="primary" @click="showServiceStartMap">
              {{ form.startOrderAddress || '未获取到位置信息' }}
            </el-button>
          </span>
        </div>
        <div class="detail-info-item item-100">
          <span class="detail-info-item-label">开始备注</span>
          <span class="detail-info-item-content">{{ form.startServeRemark || '-' }} </span>
        </div>
        <div v-if="form.startAddressPictureAttach || isEdit" class="detail-info-item item-33">
          <span class="detail-info-item-label">地址照片</span>
          <span class="detail-info-item-content">
            <ImgsUpload v-model="form.startAddressPictureAttach" :preview="!isEdit" :limit="3" @change="updateStartServiceAttach" />
          </span>
        </div>
        <div v-if="form.startObjectPictureAttach || isEdit" class="detail-info-item item-66">
          <span class="detail-info-item-label">服务对象合照</span>
          <span class="detail-info-item-content">
            <ImgsUpload v-model="form.startObjectPictureAttach" :preview="!isEdit" :limit="3" @change="updateStartServiceAttach" />
          </span>
        </div>
      </div>
    </div>

    <div v-if="form.status > 4">
      <h4 class="flex justify-between">
        <span class="title">完成服务</span>
        <el-button v-if="isEdit" type="primary" plain class="mr-20px" @click="showServiceFinishChange">修改完成服务 </el-button>
      </h4>
      <div class="info-list">
        <div class="detail-info-item item-33">
          <span class="detail-info-item-label">完成时间</span>
          <span class="detail-info-item-content">
            {{ form.finishOrderTime }}
          </span>
        </div>
        <div class="detail-info-item item-66">
          <span class="detail-info-item-label">完成地址</span>
          <span class="detail-info-item-content">
            <el-button link type="primary" @click="showServiceFinishMap">
              {{ form.finishOrderAddress || '未获取到位置信息' }}
            </el-button>
          </span>
        </div>
        <div class="detail-info-item"></div>
        <div class="detail-info-item item-100">
          <span class="detail-info-item-label">完成备注</span>
          <span class="detail-info-item-content">
            {{ form.finishServeRemark || '-' }}
          </span>
        </div>
        <div v-if="form.finishAddressPictureAttach || isEdit" class="detail-info-item item-33">
          <span class="detail-info-item-label">工单照片</span>
          <span class="detail-info-item-content">
            <ImgsUpload v-model="form.finishAddressPictureAttach" :preview="!isEdit" :limit="3" @change="updateFinishServiceAttach" />
          </span>
        </div>
        <div v-if="form.finishObjectPictureAttach || isEdit" class="detail-info-item item-66">
          <span class="detail-info-item-label">服务对象合照</span>
          <span class="detail-info-item-content">
            <ImgsUpload v-model="form.finishObjectPictureAttach" :preview="!isEdit" :limit="3" @change="updateFinishServiceAttach" />
          </span>
        </div>
      </div>
    </div>

    <div v-if="form.status > 4">
      <h4 class="title">完成信息</h4>
      <div class="info-list">
        <div class="detail-info-item item-33">
          <span class="detail-info-item-label">工单编号</span>
          <span class="detail-info-item-content">
            <span>{{ form.workNumber }}</span>
            <el-button v-if="isEdit" link type="primary" class="ml-5px" @click="showServiceNumberChange">修改 </el-button>
          </span>
        </div>
        <div class="detail-info-item item-33">
          <span class="detail-info-item-label">项目数量</span>
          <span class="detail-info-item-content">{{ form.serNumber }} </span>
        </div>
        <div class="detail-info-item item-33">
          <span class="detail-info-item-label">服务时长</span>
          <span class="detail-info-item-content"> {{ form.serveDuration }} </span>
        </div>
        <div class="detail-info-item item-33">
          <span class="detail-info-item-label">总金额</span>
          <span class="detail-info-item-content"> {{ form.money }} </span>
        </div>
        <div class="detail-info-item item-33">
          <span class="detail-info-item-label">服务人员人数</span>
          <span class="detail-info-item-content">
            <span>{{ form.serviceNumber }}</span>
          </span>
        </div>
        <div class="detail-info-item item-33">
          <span class="detail-info-item-label">统计工时</span>
          <span class="detail-info-item-content">
            {{ form.serveItemHours }}
          </span>
        </div>
        <div class="detail-info-item item-33">
          <span class="detail-info-item-label">共同服务人员</span>
          <span class="detail-info-item-content">
            <span>{{ form.commonStaffName }}</span>
            <el-button v-if="isEdit" link type="primary" class="ml-5px" @click="showServiceStaffChange">修改</el-button>
          </span>
        </div>
      </div>
    </div>

    <div v-if="renderDict(form.payType, 'staff_pay_type') || (isEdit && ['6', '7'].includes(form.status))">
      <h4 class="title">支付信息</h4>
      <el-button v-if="isEdit && !renderDict(form.payType, 'staff_pay_type')" type="primary" link @click="showOrderPay"> 添加 </el-button>
      <div v-else class="info-list">
        <div class="detail-info-item item-33">
          <span class="detail-info-item-label">支付方式</span>
          <span class="detail-info-item-content">
            <span>{{ renderDict(form.payType, 'staff_pay_type') }}</span>
            <el-button link type="primary" class="ml-5px" @click="onSubsidyDetail">
              <span>{{ form.subsidyInfo }} {{ form.month }}</span>
            </el-button>
          </span>
        </div>
        <div class="detail-info-item item-33">
          <span class="detail-info-item-label">支付金额</span>
          <span class="detail-info-item-content"> {{ form.money }}元 </span>
        </div>
        <div class="detail-info-item item-33">
          <span class="detail-info-item-label">卡号</span>
          <span class="detail-info-item-content">
            <el-button link type="primary" class="ml-5px" @click="onCardDetail">
              {{ form.subsidyCard }}
            </el-button>
          </span>
        </div>
      </div>
    </div>
    <div v-if="form.status > 2">
      <h4 class="flex justify-between">
        <span class="title">回访信息</span>
      </h4>
      <div class="info-list">
        <el-button v-if="isEdit" type="primary" link @click="showPhoneCall"> 添加 </el-button>
      </div>
    </div>
    <div v-if="form.status > 2">
      <h4 class="flex justify-between">
        <span class="title">评价信息</span>
        <el-button v-if="isEdit && form.content" type="primary" plain class="mr-20px" @click="showOrderEvaluate"> 修改评价 </el-button>
      </h4>
      <div class="info-list">
        <div v-if="form.voice" class="detail-info-item item-100">
          <span class="detail-info-item-label">客户语音评价</span>
          <span class="detail-info-item-content">
            <el-button type="primary" link class="mr-20px" @click="showAudioPlay"> 播放 </el-button>
          </span>
        </div>
        <el-button v-if="isEdit && !form.content" type="primary" link @click="showOrderEvaluate"> 添加 </el-button>
        <div v-if="form.content" class="detail-info-item item-100">
          <span class="detail-info-item-label">客户回访评价</span>
          <span class="detail-info-item-content flex">
            <div class="flex row-center">
              <span class="color333 r-m-r-10">准时送达</span>
              <el-rate class="r-m-r-20" style="height: 23px" v-model="form.punctualArrive" disabled text-color="#ff9900" />
            </div>
            <div class="flex row-center">
              <span class="color333 r-m-r-10">满意度</span>
              <el-rate class="r-m-r-20" style="height: 23px" v-model="form.satisfaction" disabled text-color="#ff9900" />
            </div>
            <div class="flex row-center">
              <span class="color333 r-m-r-10">服务态度</span>
              <el-rate class="r-m-r-20" style="height: 23px" v-model="form.serveAttitude" disabled text-color="#ff9900" />
            </div>
            <div class="flex row-center">
              <span class="color333 r-m-r-10">服务质量</span>
              <el-rate style="height: 23px" v-model="form.serveQuality" disabled text-color="#ff9900" />
            </div>
          </span>
        </div>
        <div v-if="form.content" class="detail-info-item item-100">
          <span class="detail-info-item-label">评价内容</span>
          <span class="detail-info-item-content">
            {{ form.content }}
          </span>
        </div>
      </div>
    </div>

    <div v-for="(s, index) in form.serveItems" :key="s.id">
      <h4 class="flex justify-between">
        <span class="title">服务项目({{ numTo(index) }})</span>
        <el-button v-if="isEdit" type="primary" plain class="mr-20px" @click="showServiceProjectChange(s, `服务项目(${numTo(index)})`)"> 修改服务信息 </el-button>
      </h4>
      <div class="info-list">
        <template v-if="s.serveOptionId">
          <div class="detail-info-item item-33">
            <span class="detail-info-item-label">服务类别</span>
            <span class="detail-info-item-content">
              {{ s.serveCategoryName }}
            </span>
          </div>
          <div class="detail-info-item item-33">
            <span class="detail-info-item-label">服务项目</span>
            <span class="detail-info-item-content">
              {{ s.serveInfoName }}
            </span>
          </div>
          <div class="detail-info-item item-33">
            <span class="detail-info-item-label">服务子项</span>
            <span class="detail-info-item-content">
              {{ s.serveOptionName }}
            </span>
          </div>
        </template>
        <div v-else class="detail-info-item item-33">
          <span class="detail-info-item-label"> 服务名称</span>
          <span class="detail-info-item-content">
            {{ s.serveName }}
          </span>
        </div>
        <div class="detail-info-item item-33">
          <span class="detail-info-item-label">数量</span>
          <span class="detail-info-item-content"> {{ s.count }} </span>
        </div>
        <div class="detail-info-item item-33">
          <span class="detail-info-item-label">金额</span>
          <span class="detail-info-item-content"> {{ s.money }} </span>
        </div>
        <div class="detail-info-item item-33">
          <span class="detail-info-item-label">时长</span>
          <span class="detail-info-item-content"> {{ s.serveMinute }}分钟 </span>
        </div>
        <div class="detail-info-item item-100">
          <span class="detail-info-item-label">相关照片</span>
          <span class="detail-info-item-content">
            <ImgsUpload v-model="s.beforePictureAttach" :preview="!isEdit" :limit="10" @change="updateProject(s)" />
          </span>
        </div>
      </div>
    </div>

    <h4 class="title">跟踪信息</h4>
    <el-table
      class-name="table-without-border"
      :data="serveRecordData"
      header-row-class-name="table-header"
      :style="{
        border: '1px solid #f5f3f0',
        borderRadius: '8px'
      }"
      max-height="300"
    >
      <el-table-column type="index" width="60" />
      <el-table-column label="操作" width="110" class-name="table-operation">
        <template #default="{ row }">
          <el-button link type="primary" @click="showRecordDialog(row)"> 查看 </el-button>
          <el-button link type="primary" :disabled="row.callMode === '3'" @click="showRecordChangeDialog(row)"> 修改 </el-button>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip prop="createTime" label="时间" />
      <el-table-column show-overflow-tooltip prop="callMode" label="方式">
        <template #default="{ row }">
          <span>{{ renderDict(row.callMode, 'call_mode') }}</span>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip prop="callRecordComment" label="状态" />
      <el-table-column show-overflow-tooltip prop="detailContent" label="详细内容" />
      <el-table-column show-overflow-tooltip prop="creatorName" label="操作人" />
    </el-table>
  </el-scrollbar>

  <OrderAuditDialog ref="orderAuditDialogRef" @reload="getDetail" />
  <VideoCallDialog ref="videoCallDialogRef" />

  <BelongProjectSelectDialog ref="belongProjectSelectDialogRef" :list="filterDict('belong_project')" @reload="getDetail" />

  <SecondBelongProjectSelectDialog ref="secondBelongProjectSelectDialogRef" :belongProjectName="renderDict(form.belongProject, 'belong_project')" @reload="getDetail" />

  <ServiceTimeChangeDialog ref="serviceTimeChangeDialogRef" @reload="getDetail" />
  <ServiceStartChangeDialog ref="serviceStartChangeDialogRef" @reload="getDetail" />
  <ServiceFinishChangeDialog ref="serviceFinishChangeDialogRef" @reload="getDetail" />
  <ServiceNumberChangeDialog ref="serviceNumberChangeDialogRef" @reload="getDetail" />
  <ServiceProjectChangeDialog ref="serviceProjectChangeDialogRef" @reload="getDetail" />
  <OrderEvaluateDialog ref="orderEvaluateDialogRef" @reload="getDetail" />
  <AudioPlay v-if="form.voice" ref="audioPlayRef" :url="form.voiceAttach.url" />
  <ServiceRecordDialog ref="serviceRecordDialogRef" />
  <ServiceRecordChangeDialog ref="serviceRecordChangeDialogRef" @reload="getDetail" />
  <ServiceStaffChangeDialog ref="serviceStaffChangeRef" @reload="getDetail" />
  <ServiceMapDialog ref="serviceMapDialogRef" />
  <OrderPayDialog ref="orderPayRef" @reload="getDetail" />
  <PhoneCallDialog ref="phoneCallRef" @reload="getDetail" />
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRouter, useRoute } from 'vue-router'
import { getStaffInfoDetail, cancelOrder, updateServeItem, updateStartService, updateFinishService } from '@/api/serviceStaffAPP'
import { getRecordPage } from '@/api/worksheet'
import ImgsUpload from '/@/components/ImgsUpload/index.vue'
import OrderStatus from '../order-status/index.vue'
import OrderAuditDialog from '../order-audit-dialog/index.vue'
import VideoCallDialog from '../video-call-dialog/index.vue'
import BelongProjectSelectDialog from '../belong-project-select-dialog/index.vue'
import SecondBelongProjectSelectDialog from '../second-belong-project-select-dialog/index.vue'
import ServiceTimeChangeDialog from '../service-time-change-dialog/index.vue'
import ServiceStartChangeDialog from '../service-start-change-dialog/index.vue'
import ServiceFinishChangeDialog from '../service-finish-change-dialog/index.vue'
import ServiceNumberChangeDialog from '../service-number-change-dialog/index.vue'
import ServiceProjectChangeDialog from '../service-project-change-dialog/index.vue'
import OrderEvaluateDialog from '../order-evaluate-dialog/index.vue'
import AudioPlay from '@/components/AudioPlay/index.vue'
import ServiceRecordDialog from '../service-record-dialog/index.vue'
import ServiceRecordChangeDialog from '../service-record-change-dialog/index.vue'
import ServiceMapDialog from '../service-map-dialog/index.vue'
import ServiceStaffChangeDialog from '../service-staff-change-dialog/index.vue'
import OrderPayDialog from '../order-pay-dialog/index.vue'
import PhoneCallDialog from '../phone-call-dialog/index.vue'
import { filterDict, renderDict } from '@/hooks/web/useDict'

// @ts-ignore
defineOptions({
  // eslint-disable-next-line vue/component-definition-name-casing
  name: 'SubsidyAdd'
})

defineProps({
  isEdit: {
    type: Boolean,
    default: false
  }
})

const { back, push } = useRouter()

const route = useRoute()

function onBack() {
  back()
}

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
  isClosed: undefined,
  finishStatus: undefined,
  serveDesc: undefined,
  rechargeMode: undefined,
  rechargeMoney: undefined,
  balanceMode: undefined,
  stopType: undefined,
  subsidyAmount: undefined,
  subsidyFreday: undefined,
  subsidyFremonth: undefined,
  subsidyFreweek: undefined,
  subsidyPurpose: [],
  subsidyCustomers: []
})
let form = reactive<any>({ ...addDefault })

const serveRecordData = ref([])

const orderStatus = computed(() => {
  let name = renderDict(form.status, 'staff_status')
  // if (form.status === '4') {
  //   if (form.startOrderTime) {
  //     name = '开始服务'
  //   }
  //   if (form.finishOrderTime) {
  //     name = '完成服务'
  //   }
  // }
  return name
})

const getServeRecordList = async () => {
  const res = await getRecordPage({
    pageNum: 1,
    pageSize: 100,
    infoId: form.id
  })
  serveRecordData.value = res.data.list
}

// const multipleDict = (key: any, dict: any) => {
//   if (!key.length && !key) {
//     return
//   }
//   return filterDict(dict)
//     ?.filter((item: any) => key.includes(item.value))
//     .map((item: any) => item?.label)
//     .join('，')
// }

const getDetail = async () => {
  const { data } = await getStaffInfoDetail(route.query.id)
  data.startAddressPictureAttach = data.startAddressPictureAttach || []
  data.startObjectPictureAttach = data.startObjectPictureAttach || []
  data.finishAddressPictureAttach = data.finishAddressPictureAttach || []
  data.finishObjectPictureAttach = data.finishObjectPictureAttach || []
  Object.assign(form, data)
  if (data.startDate) {
    form.date = [data.startDate, data.endDate]
  }
  getServeRecordList()
}

const customerDetail = (id) => {
  push(`/customer/detail?id=${id}`)
}

const handleEdit = () => {
  push(`/serviceStaffAPP/selfOrderEdit?id=${form.id}`)
}
// 跳转到补贴人员详情页
const onSubsidyDetail = () => {
  // push(`/subsidy/subsidyDetail?id=${form.subsidyInfoId}`)
  push(`/subsidy/subsidyUserDetail?id=${form.subsidyCustomerId}`)
}

const onCardDetail = () => {
  push(`/subsidy/cardDetail?id=${form.subsidyCardId}`)
}

const videoCallDialogRef = ref()
const showVideoCall = () => {
  videoCallDialogRef.value.show(form)
}

const orderAuditDialogRef = ref()
const showAuditDialog = () => {
  orderAuditDialogRef.value.show(form)
}

const belongProjectSelectDialogRef = ref()
const showBelongProjectSelect = () => {
  belongProjectSelectDialogRef.value.show(form)
}

const secondBelongProjectSelectDialogRef = ref()
const showSecondBelongProjectSelect = () => {
  secondBelongProjectSelectDialogRef.value.show(form)
}

const serviceTimeChangeDialogRef = ref()
const showServiceTimeChange = () => {
  serviceTimeChangeDialogRef.value.show(form)
}

const serviceStartChangeDialogRef = ref()
const showServiceStartChange = () => {
  serviceStartChangeDialogRef.value.show(form)
}

const serviceFinishChangeDialogRef = ref()
const showServiceFinishChange = () => {
  serviceFinishChangeDialogRef.value.show(form)
}

const serviceNumberChangeDialogRef = ref()
const showServiceNumberChange = () => {
  serviceNumberChangeDialogRef.value.show(form)
}

const serviceProjectChangeDialogRef = ref()
const showServiceProjectChange = (s, title) => {
  s.staffOrderId = form.id
  serviceProjectChangeDialogRef.value.show(s, title)
}

const audioPlayRef = ref()
const showAudioPlay = () => {
  audioPlayRef.value.show()
}

const phoneCallRef = ref()
const showPhoneCall = () => {
  phoneCallRef.value.show(form)
}

const orderPayRef = ref()
const showOrderPay = () => {
  orderPayRef.value.show(form)
}

const serviceRecordDialogRef = ref()
const showRecordDialog = (row) => {
  row.callModeName = renderDict(row.callMode, 'call_mode')
  serviceRecordDialogRef.value.show(row)
}

const serviceRecordChangeDialogRef = ref()
const showRecordChangeDialog = (row) => {
  serviceRecordChangeDialogRef.value.show(row)
}

// 修改评价
const orderEvaluateDialogRef = ref()
const showOrderEvaluate = () => {
  orderEvaluateDialogRef.value.show(form)
}

const serviceMapDialogRef = ref()
const showServiceStartMap = () => {
  const info = {
    lng: form.startLongitude,
    lat: form.startLatitude,
    address: form.startOrderAddress
  }
  serviceMapDialogRef.value.show('开始服务地址', info)
}

const showServiceFinishMap = () => {
  const info = {
    lng: form.finishLongitude,
    lat: form.finishLatitude,
    address: form.finishOrderAddress
  }
  serviceMapDialogRef.value.show('结束服务地址', info)
}

const serviceStaffChangeRef = ref()
const showServiceStaffChange = () => {
  serviceStaffChangeRef.value.show(form)
}

const verifyCancel = async () => {
  const ids = form.id
  ElMessageBox.confirm('订单将变为“已取消”状态（请注意是否需要补充新的订单），是否确认取消?', '确定取消订单').then(() => {
    cancel(ids)
  })
}

// 取消订单
async function cancel(ids) {
  const res: any = await cancelOrder(ids)
  if (res.code === 200) {
    ElMessage.success('取消成功')
    getDetail()
  }
}

// 更新开始服务图片
const updateStartServiceAttach = async () => {
  const params = {
    id: form.id,
    startAddressPicture: form.startAddressPictureAttach && form.startAddressPictureAttach.map((b) => b.id).join(','),
    startObjectPicture: form.startObjectPictureAttach && form.startObjectPictureAttach.map((b) => b.id).join(',')
  }
  await updateStartService(params)
  getDetail()
}

// 更新完成服务图片
const updateFinishServiceAttach = async () => {
  const params = {
    id: form.id,
    finishAddressPicture: form.finishAddressPictureAttach && form.finishAddressPictureAttach.map((b) => b.id).join(','),
    finishObjectPicture: form.finishObjectPictureAttach && form.finishObjectPictureAttach.map((b) => b.id).join(',')
  }
  await updateFinishService(params)
  getDetail()
}

// 更新服务项目
const updateProject = async (projectItem) => {
  projectItem.staffOrderId = form.id
  projectItem.beforePicture = projectItem.beforePictureAttach.map((b) => b.id).join(',')
  await updateServeItem(projectItem)
  getDetail()
}

const id = ref<any>('')

const numTo = (num: number) => {
  const arr = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十']
  return arr[num]
}

onMounted(() => {
  if (route.query.id) {
    id.value = route.query.id
  }
  getDetail()
})
</script>
<style scoped lang="less">
.inline-form-item {
  display: inline-flex;
  vertical-align: middle;
  margin-right: 32px;
}
.title {
  display: flex;
  align-items: center;
  position: relative;
  margin: 24px 0 16px;
  font-weight: 600;
}
.title-name {
  font-weight: 700;
  white-space: nowrap;
}
.title .customer-edit {
  position: absolute;
  right: 0;
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
.button-box {
  margin-top: 10px;
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

.customer-title {
  color: #666462;
  font-size: 14px;
  font-weight: 400;
}
</style>
