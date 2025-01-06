<template>
  <el-page-header title="" @back="onBack">
    <template #content>
      工单详情（<span :class="worksheetInfo.isClosed === 1 ? 'color-close' : 'color-unclose'">{{ worksheetInfo.isClosed === 1 ? '已结案' : '未结案' }}</span
      >）
    </template>
    <template #extra>
      <div class="flex items-center">
        <el-button :disabled="!leafAreaFlag">一键拨号</el-button>
        <el-button class="ml-2">打印</el-button>
      </div>
    </template>
    <div class="detail-top-gray-info">
      <span class="mr-5">工单编号：{{ worksheetInfo.worksheetNo }}</span>
      <span class="mr-5"> 创建：{{ worksheetInfo.creatorName }} {{ worksheetInfo.createTime }} </span>
      <span class="mr-5" v-if="worksheetInfo.updaterName">
        最近更新：{{ worksheetInfo.updateTime ? worksheetInfo.updaterName + ' ' + worksheetInfo.updateTime : worksheetInfo.creatorName + ' ' + worksheetInfo.createTime }}
      </span>
      <span class="mr-5">
        最近联系：{{ worksheetInfo.lastContactUserName }}
        {{ worksheetInfo.lastContactTime }}
      </span>
    </div>
  </el-page-header>

  <div class="flex row-between r-m-b-20">
    <h2 class="title">会员信息</h2>
    <el-button link type="primary" @click="customerDetail">查看客户信息</el-button>
  </div>
  <div class="grid-col-3">
    <div class="item-box">
      <span class="item-title">客户姓名</span>
      <span class="item-content">{{ worksheetInfo.customerName }}</span>
    </div>
    <div class="item-box">
      <span class="item-title">联系电话</span>
      <span class="item-content">{{ worksheetInfo.mobilephone }}</span>
    </div>
    <div class="item-box">
      <span class="item-title">性别</span>
      <span class="item-content">{{ worksheetInfo.sex == 1 ? '男' : '女' }}</span>
    </div>
    <div class="item-box">
      <span class="item-title">年龄</span>
      <span class="item-content">{{ worksheetInfo.age }} 岁</span>
    </div>
    <div class="item-box">
      <span class="item-title">证件类型</span>
      <span class="item-content">{{ renderDict(worksheetInfo.idType, 'document_type') }}</span>
    </div>
    <div class="item-box">
      <span class="item-title">证件号码</span>
      <span class="item-content">{{ worksheetInfo.idcard }}</span>
    </div>
  </div>

  <div class="flex row-between r-m-tb-20">
    <h2 class="title">服务信息</h2>
    <el-button :icon="Edit" plain type="primary" v-if="worksheetInfo.isClosed === 0" :disabled="!leafAreaFlag" @click="editWorksheetInfo">编辑信息</el-button>
  </div>
  <div class="grid-col-3">
    <div class="item-box">
      <span class="item-title">工单类型</span>
      <span class="item-content">{{ renderDict(worksheetInfo.worksheetTypeId, 'worksheet_category') }}</span>
    </div>
    <div class="item-box">
      <span class="item-title">工单类别</span>
      <span class="item-content">{{ filterWorksheetType(worksheetInfo.worksheetCategoryId) }}</span>
    </div>
    <div class="item-box">
      <span class="item-title">工单子类</span>
      <span class="item-content">{{ filterWorksheetType(worksheetInfo.worksheettypeInfoId) }}</span>
    </div>
  </div>

  <div class="item-box">
    <span class="item-title">呼入问题</span>
    <span class="item-content" v-if="worksheetInfo.worksheetQuestion">{{ worksheetInfo.worksheetQuestion }}</span>
  </div>
  <div class="item-box">
    <span class="item-title">处理方式</span>
    <span class="item-content" v-if="worksheetInfo.worksheetAnswer">{{ worksheetInfo.worksheetAnswer }}</span>
  </div>
  <div class="item-box">
    <span class="item-title">备注</span>
    <span class="item-content">{{ worksheetInfo.worksheetComment }}</span>
  </div>

  <div class="grid-col-3">
    <div class="item-box">
      <span class="item-title">最后联系时间</span>
      <span class="item-content">{{ worksheetInfo.lastContactTime }}</span>
    </div>
    <div class="item-box">
      <span class="item-title">最后联系人</span>
      <span class="item-content">{{ worksheetInfo.lastContactUserName }}</span>
    </div>
    <div class="item-box">
      <span class="item-title">是否结案</span>
      <span class="item-content">{{ worksheetInfo.isClosed == 0 ? '否' : '是' }}</span>
    </div>
    <div class="item-box">
      <span class="item-title">通话录音</span>
      <span class="item-content">
        <span v-if="worksheetInfo.agentRecordLogCallId">
          {{ worksheetInfo.agentRecordLogCallId }}
          <el-button link type="primary" size="small" v-if="worksheetInfo.agentRecordLogCallId" @click="handlePlayRecord"> 播放 </el-button>
          <!-- <el-button link type="primary" size="small"> 取消关联 </el-button> -->
        </span>
        <span v-else>
          <el-button link type="primary" size="small" @click="connectAgentRecordLogCall"> 添加关联录音 </el-button>
        </span>
      </span>
    </div>
    <div class="item-box">
      <span class="item-title">下次回访时间</span>
      <span class="item-content">{{ worksheetInfo.returnTime }}</span>
    </div>
    <div class="item-box">
      <span class="item-title">下次回访人</span>
      <span class="item-content">{{ worksheetInfo.returnUserName }}</span>
    </div>
  </div>

  <el-descriptions class="r-m-t-20" title="跟踪信息">
    <template #extra>
      <el-button :icon="Plus" plain type="primary" @click="addTrackInfo" :disabled="!leafAreaFlag" v-if="worksheetInfo.isClosed === 0"> 添加跟踪信息 </el-button>
    </template>
    <el-descriptions-item span="3">
      <el-table
        :data="dataList"
        header-row-class-name="table-header"
        :style="{
          width: 'calc(100vw - 340px)',
          display: 'flex',
          border: '1px solid #f5f3f0',
          borderRadius: '8px'
        }"
        height="250"
      >
        <el-table-column type="index" />
        <el-table-column label="操作" width="150">
          <template #default="scope">
            <el-button link type="primary" size="small" @click="trackInfoDetail(scope.row)"> 查看 </el-button>
            <el-button link type="primary" size="small" @click="editTrackInfo(scope.row)" v-if="worksheetInfo.isClosed === 0"> 编辑 </el-button>
            <el-popconfirm width="160" title="是否删除该记录？" @confirm="deleteTrackInfo(scope.row.id)" v-if="worksheetInfo.isClosed === 0">
              <template #reference>
                <el-button link type="primary" size="small"> 删除 </el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="time" label="时间" width="200" />
        <el-table-column show-overflow-tooltip prop="callMode" label="方式" width="80">
          <template #default="{ row }">
            {{ row.callMode == '1' ? '呼入' : '呼出' }}
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="detailContent" label="详情内容" min-width="200" />
        <el-table-column show-overflow-tooltip prop="contactRole" label="受理起止时间" width="300">
          <template #default="{ row }">
            {{ formatDateString(row.startTime, 'YYYY-MM-DD HH:mm') + ' ~ ' + formatDateString(row.endTime, 'YYYY-MM-DD HH:mm') }}
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="talkMinute" label="通话时长(分钟)" width="120" />
        <el-table-column show-overflow-tooltip prop="userName" label="客服" width="120" />
      </el-table>
    </el-descriptions-item>
  </el-descriptions>

  <WorksheetEditDrawer ref="worksheetInfoEditRef" :dict="dictMap" @reload-list="getWorksheetInfo" />
  <AgentRecordLogCallFormDialog ref="agentRecordLogCallFormRef" />
  <TrackInfoFormDialog ref="trackInfoFormRef" @reload-list="getRecordList" />
  <TrackInfoDetailDialog ref="trackInfoDetailRef" />
  <!-- 播放录音操作弹窗 -->
  <PlayRecordDialog ref="playRecordDialogRef" :requestFun="saveCallRecord" @reload-data="getWorksheetInfo" />
  <!-- 录音关联操作弹窗 -->
  <AssociateCallRecordDialog ref="associateCallRecordRef" :requestFun="saveCallRecord" @reload-data="getWorksheetInfo" />
</template>
<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Plus, Edit } from '@element-plus/icons-vue'
import { getWorksheetInfoById, getRecordPage, deleteRecord, getAllWorksheetTypeList, saveCallRecord } from '@/api/worksheet/index'
import WorksheetEditDrawer from './components/worksheet-edit-drawer/index.vue'
import AgentRecordLogCallFormDialog from './components/agent-record-log-call-form-dialog/index.vue'
import TrackInfoFormDialog from './components/track-info-form-dialog/index.vue'
import TrackInfoDetailDialog from './components/track-info-detail-dialog/index.vue'
import { formatDateString } from '@/utils'
import { useCache } from '@/hooks/web/useCache'
import { dictMap, renderDict } from '@/hooks/web/useDict'
import PlayRecordDialog from '@/components/PlayRecordDialog.vue'
import AssociateCallRecordDialog from '@/components/AssociateCallRecordDialog.vue'

const { push } = useRouter()
const { query } = useRoute()
const { wsCache } = useCache()

const leafAreaFlag = ref(wsCache.get('leafAreaFlag'))

function onBack() {
  push('/worksheet/page')
}

function customerDetail() {
  push(`/customer/detail?id=${worksheetInfo.value.customerId}&customerUpdate=true`)
}

const worksheetInfoEditRef = ref()
function editWorksheetInfo() {
  worksheetInfoEditRef.value.show(worksheetInfo.value)
}

// 播放录用操作
const playRecordDialogRef = ref()
const handlePlayRecord = () => {
  playRecordDialogRef.value.show(worksheetInfo.value)
}
// 录音关联操作
const associateCallRecordRef = ref()
function connectAgentRecordLogCall() {
  associateCallRecordRef.value.show(worksheetInfo.value)
}

const trackInfoFormRef = ref()
function addTrackInfo() {
  trackInfoFormRef.value.show(worksheetInfo.value, null)
}

function editTrackInfo(data) {
  trackInfoFormRef.value.show(null, data)
}

const trackInfoDetailRef = ref()
function trackInfoDetail(data) {
  trackInfoDetailRef.value.show(data.id)
}

const worksheetInfo = ref<any>({})

async function getWorksheetInfo() {
  const res = await getWorksheetInfoById(Number(query.id))
  if (res) {
    worksheetInfo.value = res.data
  }
}

const dataList = ref([])
async function getRecordList() {
  const res = await getRecordPage({
    pageNum: 1,
    pageSize: 100,
    worksheetId: Number(query.id)
  })
  if (res) {
    dataList.value = res.data.list
  }
}

async function deleteTrackInfo(ids) {
  const res: any = await deleteRecord(ids)
  if (res.code === 200) {
    ElMessage.success('操作成功')
    getRecordList()
  }
}

const worksheetTypeList = ref([])

const getWorksheetTypeList = async () => {
  const res = await getAllWorksheetTypeList({})
  worksheetTypeList.value = res.data
}
const filterWorksheetType = (key: any) => {
  return (worksheetTypeList.value.find((item: any) => item.id == key) as any)?.worksheetTypeName
}

onMounted(() => {
  getWorksheetInfo()
  getRecordList()
  getWorksheetTypeList()
})
</script>
<style scoped>
/* :deep(.el-descriptions__content.el-descriptions__cell.is-bordered-content) {
  width: 23%;
}
:deep(.el-descriptions__cell.el-descriptions__label.is-bordered-label) {
  width: 12%;
} */
.unchecked {
  color: #ccc;
}
</style>
