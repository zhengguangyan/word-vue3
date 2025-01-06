<template>
  <el-page-header title="" @back="onBack">
    <template #content>
      关怀详情<strong>【{{ careinfo.isClosed == 0 ? '未' : '' }}结案】</strong>
    </template>
    <template #extra>
      <div class="flex items-center">
        <el-button :disabled="!leafAreaFlag">一键拨号</el-button>
        <el-button class="ml-2">打印</el-button>
      </div>
    </template>
    <div class="detail-top-gray-info">
      <span class="mr-5">关怀编号：{{ careinfo.careNo }}</span>
      <span class="mr-5">创建：{{ careinfo.creatorName }} {{ careinfo.createTime }} </span>
      <span class="mr-5">最近更新：{{ careinfo.updateTime ? careinfo.updaterName + ' ' + careinfo.updateTime : careinfo.creatorName + ' ' + careinfo.createTime }}</span>
    </div>
  </el-page-header>

  <div class="flex row-between r-m-b-20">
    <h2 class="title">客户信息</h2>
    <el-button link type="primary" @click="customerDetail">查看客户信息</el-button>
  </div>

  <div class="grid-col-3">
    <div class="item-box">
      <span class="item-title">客户姓名</span>
      <span class="item-content">{{ careinfo.customerName }}</span>
    </div>
    <div class="item-box">
      <span class="item-title">联系电话</span>
      <span class="item-content">{{ careinfo.phone }}</span>
    </div>
    <div class="item-box">
      <span class="item-title">性别</span>
      <span class="item-content"> {{ careinfo.sex == '1' ? '男' : '女' }}</span>
    </div>

    <div class="item-box">
      <span class="item-title">年龄</span>
      <span class="item-content">{{ careinfo.age }} 岁</span>
    </div>
    <div class="item-box">
      <span class="item-title">证件类型</span>
      <span class="item-content">{{ renderDict(careinfo.idType, 'document_type') }}</span>
    </div>
    <div class="item-box">
      <span class="item-title">证件号码</span>
      <span class="item-content">{{ careinfo.idcard }}</span>
    </div>
  </div>

  <div class="flex row-between r-m-tb-20">
    <h2 class="title">服务信息</h2>
    <el-button :icon="Edit" v-if="careinfo.isClosed == 0" :disabled="!leafAreaFlag" plain @click="edit(careinfo)"> 编辑信息 </el-button>
  </div>
  <div class="grid-col-3">
    <div class="item-box">
      <span class="item-title">回访电话</span>
      <span class="item-content">{{ careinfo.reservePhone }}</span>
    </div>

    <div class="item-box">
      <span class="item-title">预定关怀时间</span>
      <span class="item-content">{{ careinfo.reserveTime }}</span>
    </div>
    <div class="item-box">
      <span class="item-title">受理起止日期</span>
      <span class="item-content" v-if="careinfo.startTime">{{ careinfo.startTime }} - {{ careinfo.endTime }}</span>
    </div>
    <div class="item-box">
      <span class="item-title">通话时长</span>
      <span class="item-content">{{ careinfo.talkMinute }}分钟</span>
    </div>
    <div class="item-box">
      <span class="item-title">归属项目</span>
      <span class="item-content">{{ renderDict(careinfo.belongProjectType, 'project_type') }}</span>
    </div>

    <div class="item-box" v-if="careinfo.belongProjectType == '9'">
      <span class="item-title">订单编号</span>
      <span class="item-content">
        <span>{{ careinfo.orderNumber }}</span>
        <el-button link type="primary" style="margin-left: 5px" @click="orderDetail">查看</el-button>
      </span>
    </div>
    <div class="item-box">
      <span class="item-title">归属项目名称</span>
      <span class="item-content" v-if="careinfo.belongProjectType == '2'">{{ careinfo.belongProjectName }}</span>
      <span class="item-content" v-if="careinfo.belongProjectType == '7'">
        {{ renderDict(careinfo.belongProjectName, 'carePackage_type') }}
      </span>
    </div>
    <div class="item-box">
      <span class="item-title">是否接通</span>
      <span class="item-content" v-if="careinfo.isConnect == 0">否</span>
      <span class="item-content" v-else-if="careinfo.isConnect == 1">是</span>
    </div>
  </div>
  <div class="item-box">
    <span class="item-title">关怀内容</span>
    <span class="item-content">{{ careinfo.orderNumber }}</span>
  </div>
  <div class="item-box">
    <span class="item-title">备注</span>
    <span class="item-content">{{ careinfo.careComment }}</span>
  </div>
  <div class="item-box">
    <span class="item-title">通话录音</span>
    <span class="item-content" v-if="careinfo.agentRecordLogCallId">
      {{ careinfo.agentRecordLogCallId }}
      <el-button link type="primary" size="small" v-if="careinfo.agentRecordLogCallId" @click="handlePlayRecord"> 播放 </el-button>
      <!-- <el-button link type="primary" size="small"> 取消关联 </el-button> -->
    </span>
    <span class="item-content" v-else>
      <el-button style="margin-left: -3px" link type="primary" size="small" @click="connectAgentRecordLogCall"> 添加关联录音 </el-button>
    </span>
  </div>

  <!-- <el-descriptions title="客户信息" style="margin-top: 20px" border>
    <template #extra>
      <el-button link type="primary" @click="customerDetail">查看客户信息</el-button>
    </template>
    <el-descriptions-item label="客户姓名：">{{ careinfo.customerName }}</el-descriptions-item>
    <el-descriptions-item label="联系电话：">
      <span>{{ careinfo.phone }}</span>
    </el-descriptions-item>
    <el-descriptions-item label="性别：">
      <span>{{ careinfo.sex == '1' ? '男' : '女' }}</span>
    </el-descriptions-item>
    <el-descriptions-item label="年龄：">
      <span>{{ careinfo.age }} 岁</span>
    </el-descriptions-item>
    <el-descriptions-item label="证件类型：">
      <span>{{ renderDict(careinfo.idType, 'document_type') }}</span>
    </el-descriptions-item>
    <el-descriptions-item label="证件号码：">
      <span>{{ careinfo.idcard }}</span>
    </el-descriptions-item>
  </el-descriptions>

  <el-descriptions title="服务信息" border>
    <template #extra>
      <el-button :icon="Edit" v-if="careinfo.isClosed == 0" :disabled="!leafAreaFlag" plain @click="edit(careinfo)"> 编辑信息 </el-button>
    </template>
    <el-descriptions-item label="回访电话：">
      <span>{{ careinfo.reservePhone }}</span>
    </el-descriptions-item>
    <el-descriptions-item label="预定关怀时间：">
      <span>{{ careinfo.reserveTime }}</span>
    </el-descriptions-item>
    <el-descriptions-item label="受理起止日期：">
      <span v-if="careinfo.startTime">{{ careinfo.startTime }} - {{ careinfo.endTime }}</span>
    </el-descriptions-item>
    <el-descriptions-item label="通话时长：">
      <span>{{ careinfo.talkMinute }}分钟</span>
    </el-descriptions-item>
    <el-descriptions-item label="归属项目：">
      <span>{{ renderDict(careinfo.belongProjectType, 'project_type') }}</span>
    </el-descriptions-item>
    <el-descriptions-item v-if="careinfo.belongProjectType == '9'" label="订单编号：">
      <span>{{ careinfo.orderNumber }}</span>
      <el-button link type="primary" style="margin-left: 5px" @click="orderDetail">查看</el-button>
    </el-descriptions-item>
    <el-descriptions-item label="归属项目名称：">
      <span v-if="careinfo.belongProjectType == '2'">
        {{ renderDict(careinfo.belongProjectName, 'service_package_type') }}
      </span>
      <span v-if="careinfo.belongProjectType == '7'">
        {{ renderDict(careinfo.belongProjectName, 'carePackage_type') }}
      </span>
    </el-descriptions-item>
    <el-descriptions-item label="是否接通：">
      <span v-if="careinfo.isConnect == 0">否</span>
      <span v-else-if="careinfo.isConnect == 1">是</span>
    </el-descriptions-item>
    <el-descriptions-item label="关怀内容：" :span="3">
      <span>{{ careinfo.careContent }}</span>
    </el-descriptions-item>
    <el-descriptions-item label="备注：" :span="3">
      <span>{{ careinfo.careComment }}</span>
    </el-descriptions-item>
    <el-descriptions-item label="通话录音：" :span="3">
      <span v-if="careinfo.agentRecordLogCallId">
        {{ careinfo.agentRecordLogCallId }}
        <el-button link type="primary" size="small"> 播放 </el-button>
        <el-button link type="primary" size="small"> 取消关联 </el-button>
      </span>
      <span v-else>
        <el-button style="margin-left: -3px" link type="primary" size="small" @click="connectAgentRecordLogCall"> 添加关联录音 </el-button>
      </span>
    </el-descriptions-item>
  </el-descriptions> -->
  <CareinfoEditDrawer ref="editRef" :dict="dictMap" @reload-list="getCareInfoDetail" />
  <AgentRecordLogCallFormDialog ref="agentRecordLogCallFormRef" />

  <!-- 播放录音操作弹窗 -->
  <PlayRecordDialog ref="playRecordDialogRef" :requestFun="saveRecord" @reload-data="getCareInfoDetail" />
  <!-- 录音关联操作弹窗 -->
  <AssociateCallRecordDialog ref="associateCallRecordRef" :requestFun="saveRecord" @reload-data="getCareInfoDetail" />
</template>
<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Edit } from '@element-plus/icons-vue'
import CareinfoEditDrawer from './components/careinfo-edit-drawer/index.vue'
import { getCareinfoDetailById, saveRecord } from '@/api/careinfo/index'
import AgentRecordLogCallFormDialog from '../worksheet/components/agent-record-log-call-form-dialog/index.vue'
import { useCache } from '@/hooks/web/useCache'
import { renderDict, dictMap } from '@/hooks/web/useDict'
import PlayRecordDialog from '@/components/PlayRecordDialog.vue'
import AssociateCallRecordDialog from '@/components/AssociateCallRecordDialog.vue'

const { wsCache } = useCache()

const leafAreaFlag = ref(wsCache.get('leafAreaFlag'))
const { push, back } = useRouter()
const { query } = useRoute()

function onBack() {
  back()
}
function customerDetail() {
  push(`/customer/detail?id=${careinfo.value.customerId}&customerUpdate=true`)
}

const editRef = ref()
function edit(row) {
  editRef.value.show(row)
}

const careinfo = ref<any>({})

async function getCareInfoDetail() {
  const res = await getCareinfoDetailById(Number(query.id))
  if (res) {
    careinfo.value = res.data
  }
}
// 播放录用操作
const playRecordDialogRef = ref()
const handlePlayRecord = () => {
  playRecordDialogRef.value.show(careinfo.value)
}
// 录音关联操作
const associateCallRecordRef = ref()
function connectAgentRecordLogCall() {
  associateCallRecordRef.value.show(careinfo.value)
}

const orderDetail = () => {
  push(`/serviceStaffAPP/selfOrderDetail?id=${careinfo.value.orderId}`)
}

onMounted(() => {
  getCareInfoDetail()
})
</script>
<style scoped>
:deep(.el-page-header__content strong) {
  font-size: 14px;
  color: var(--el-color-primary);
}
:deep(.el-descriptions__content.el-descriptions__cell.is-bordered-content) {
  width: 23%;
}
/* :deep(.el-descriptions__cell.el-descriptions__label.is-bordered-label) {
  width: 12%;
} */
</style>
