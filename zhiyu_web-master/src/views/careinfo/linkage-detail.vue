<template>
  <el-page-header title="" @back="onBack">
    <template #content> {{ linkage.linkageName }} </template>
    <template #extra>
      <div class="flex items-center">
        <el-button>一键拨号</el-button>
        <el-button class="ml-2">打印</el-button>
      </div>
    </template>
    <div class="detail-top-gray-info">
      <span class="mr-5">联动编号：{{ linkage.linkageNo }}</span>
      <span class="mr-5">创建：{{ linkage.creatorName }} {{ linkage.createTime }} </span>
      <span class="mr-5"> 最近更新：{{ linkage.updateTime ? linkage.updaterName + ' ' + linkage.updateTime : linkage.creatorName + ' ' + linkage.createTime }} </span>
    </div>
  </el-page-header>

  <h2 class="title r-m-b-20">联动信息</h2>
  <div class="info-list">
    <div class="detail-info-item item-100">
      <span class="detail-info-item-label">联系电话</span>
      <span class="detail-info-item-content">{{ linkage.phone }}</span>
    </div>
    <div class="detail-info-item item-100">
      <span class="detail-info-item-label">关怀内容</span>
      <span class="detail-info-item-content">{{ linkage.details }}</span>
    </div>
    <div class="detail-info-item item-100">
      <span class="detail-info-item-label">通话录音</span>
      <span class="detail-info-item-content">
        <span v-if="linkage.agentRecordLogCallId">
          {{ linkage.agentRecordLogCallId }}
          <el-button link type="primary" size="small" v-if="linkage.agentRecordLogCallId" @click="handlePlayRecord"> 播放 </el-button>
          <!-- <el-button link type="primary" size="small"> 取消关联 </el-button> -->
        </span>
        <span v-else>
          <el-button link type="primary" size="small" @click="connectAgentRecordLogCall"> 添加关联录音 </el-button>
        </span>
      </span>
    </div>
    <div class="detail-info-item item-100" v-if="leafAreaFlag">
      <span class="detail-info-item-label">修改联动信息</span>
      <span class="detail-info-item-content">
        <el-button link type="primary" size="small" @click="edit"> 编辑联动信息 </el-button>
      </span>
    </div>
  </div>

  <LinkageFormDialog ref="formRef" @reload-list="getLinkageDetail" />
  <!-- 播放录音操作弹窗 -->
  <PlayRecordDialog ref="playRecordDialogRef" :requestFun="saveRecord" @reload-data="getLinkageDetail" />
  <!-- 录音关联操作弹窗 -->
  <AssociateCallRecordDialog ref="associateCallRecordRef" :requestFun="saveRecord" @reload-data="getLinkageDetail" />
</template>
<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useCache } from '@/hooks/web/useCache'
import { useRouter, useRoute } from 'vue-router'
import { getLinkageDetailById, saveRecord } from '@/api/linkage/index'
import LinkageFormDialog from './components/linkage-form-dialog/index.vue'
import PlayRecordDialog from '@/components/PlayRecordDialog.vue'
import AssociateCallRecordDialog from '@/components/AssociateCallRecordDialog.vue'
const { push } = useRouter()
const { query } = useRoute()
const { wsCache } = useCache()
const leafAreaFlag = ref(wsCache.get('leafAreaFlag'))

function onBack() {
  push('/careinfo/linkage')
}
const formRef = ref()
function edit() {
  formRef.value.show(linkage.value)
}

const linkage = ref<any>({})

async function getLinkageDetail() {
  const res = await getLinkageDetailById(Number(query.id))
  if (res) {
    linkage.value = res.data
  }
}
// 播放录用操作
const playRecordDialogRef = ref()
const handlePlayRecord = () => {
  playRecordDialogRef.value.show(linkage.value)
}
// 录音关联操作
const associateCallRecordRef = ref()
function connectAgentRecordLogCall() {
  associateCallRecordRef.value.show(linkage.value)
}

onMounted(() => {
  getLinkageDetail()
})
</script>
<style scoped>
/* :deep(.el-descriptions__cell.el-descriptions__label.is-bordered-label) {
  width: 12%;
} */
</style>
