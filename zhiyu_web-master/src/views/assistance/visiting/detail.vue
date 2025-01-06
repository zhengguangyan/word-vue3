<template>
  <el-page-header @back="goBack" class="common-page-header">
    <template #content>
      <strong class="r-font-16">拜访详情</strong>
    </template>
  </el-page-header>
  <div class="detail-top-gray-info">
    <span class="r-m-r-10">来源: {{ platform }}</span>
    <span class="r-m-r-10">创建人: {{ detail.creatorName }}</span>
    <span>创建时间: {{ detail.createTime }}</span>
  </div>
  <h2 class="label-title r-m-t-20 r-m-b-16">拜访人</h2>
  <div class="item r-m-b-16">
    <span class="label">拜访人:</span>
    <span>{{ detail.visitOperatorName }}</span>
  </div>
  <div class="item r-m-b-16" v-if="detail.visitMode === '1'">
    <span class="label">共同拜访(内部):</span>
    <span>{{ detail.operatorNames.join(',') || '-' }}</span>
  </div>
  <div class="item r-m-b-16" v-if="detail.visitMode === '1'">
    <span class="label">共同拜访(外部):</span>
    <span>{{ detail.externalNames }}</span>
  </div>
  <div class="item r-m-b-16" v-if="detail.visitMode === '1'">
    <span class="label">共同拜访(志愿者):</span>
    <span>{{ detail.volunteerNames.join(',') || '-' }}</span>
  </div>
  <h2 class="label-title r-m-t-40 r-m-b-16">拜访信息</h2>
  <div class="item r-m-b-16">
    <span class="label">拜访客户:</span>
    <span>{{ detail.visitCustomerName }}{{ customerInfo }}</span>
  </div>
  <div class="grid-box grid-box-4">
    <div class="item">
      <span class="label">拜访时间:</span>
      <span>{{ detail.visitTime }}</span>
    </div>
    <div class="item">
      <span class="label">拜访方式:</span>
      <span>{{ renderDict(detail.visitMode, 'visit_mode') }}</span>
    </div>
    <div class="item" v-if="detail.visitMode === '1' && isXiaMen">
      <span class="label">拜访时长:</span>
      <span>{{ detail.visitMinute }}<span v-if="detail.visitMinute">分钟</span></span>
    </div>
    <div class="item">
      <span class="label">归属项目:</span>
      <span>{{ renderDict(detail.belongProjectType, 'project_type') }}</span>
    </div>
  </div>
  <section class="section">
    <div class="item">
      <span class="label">所属区域:</span>
      <span>{{ detail.belongRegion }}</span>
    </div>
    <div class="item" v-if="detail.visitMode === '1' && platform === '助老员APP'">
      <span class="label">定位地址:</span>
      <span>{{ detail.visitLocationCode }}</span>
    </div>
    <div class="item" v-if="detail.visitMode === '1'">
      <span class="label">拜访地址:</span>
      <span>{{ visitRegion }}</span>
    </div>
    <div class="item" v-if="detail.visitMode === '1'">
      <span class="label">详细地址:</span>
      <span>{{ detail.visitDetailAddress }}</span>
    </div>
    <div class="item" v-if="['1', '2'].includes(detail.visitMode) && isXiaMen">
      <span class="label">拜访标签:</span>
      <span>{{ detail.visitLabel.join(',') }}</span>
    </div>
    <div class="item">
      <span class="label">拜访内容:</span>
      <span class="pre-wrap">{{ detail.visitContent }}</span>
    </div>
    <div class="item" v-if="['1', '2'].includes(detail.visitMode) && isXiaMen">
      <span class="label">信息反馈:</span>
      <span class="pre-wrap">{{ detail.infoFeedback || '-' }}</span>
    </div>
    <div class="item" v-if="['1', '2'].includes(detail.visitMode) && isXiaMen">
      <span class="label">结果跟踪:</span>
      <span class="pre-wrap">{{ detail.resultTracking || '-' }}</span>
    </div>
    <div class="grid-box-2">
      <div class="item" v-if="['1', '2'].includes(detail.visitMode)">
        <span class="label">拜访照片:</span>
        <div class="img-ul">
          <el-image style="width: 80px; height: 80px" v-for="(item, index) in detail.visitPhotoList" :key="item.id" :src="item.url" :initial-index="index" :preview-src-list="detail.visitPhotoList.map((item) => item.url)"></el-image>
        </div>
      </div>
      <div class="item" v-if="detail.visitMode === '1' && detail.finishPhotoAttach && detail.finishPhotoAttach.url && isXiaMen">
        <span class="label">拜访结束照片:</span>
        <div class="img-ul">
          <el-image style="width: 80px; height: 80px" :src="detail.finishPhotoAttach.url" :preview-src-list="[detail.finishPhotoAttach.url]"></el-image>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { visitingDetail } from '@/api/assistance/visiting'
import { computed, onMounted, reactive, ref } from 'vue'
import { ElLoading } from 'element-plus'
import { useCache } from '@/hooks/web/useCache'
import { renderDict } from '@/hooks/web/useDict'

const router = useRouter()
const route = useRoute()

const { wsCache } = useCache()
const isXiaMen = ref(false)

onMounted(() => {
  const areaInfo = wsCache.get('areaInfo')
  isXiaMen.value = Boolean(areaInfo && areaInfo.city === '厦门市')
  const loading = ElLoading.service({
    target: 'section.content-layout',
    text: '加载中，请稍候...'
  })
  Promise.all([loadDetail()]).then(() => {
    loading.close()
  })
})

const detail = reactive({
  belongProjectName: '',
  belongProjectType: '',
  belongRegion: '',
  companyName: '',
  createTime: '',
  creatorName: '',
  externalNames: '',
  finishPhotoAttach: { url: '' },
  id: '',
  infoFeedback: '',
  operatorNames: [] as string[],
  platform: '',
  resultTracking: '',
  updateTime: '',
  updaterName: '',
  visitLocationCode: '',
  visitCity: '',
  visitCommunity: '',
  visitContent: '',
  visitCounty: '',
  visitCustomerIdCard: '',
  visitCustomerMobilePhone: '',
  visitCustomerName: '',
  visitDetailAddress: '',
  visitLabel: [] as string[],
  visitMinute: 0,
  visitMode: '',
  visitOperatorName: '',
  visitPhotoList: [] as FileItem[],
  visitProvince: '',
  visitStreet: '',
  visitTime: '',
  visitVillage: '',
  volunteerNames: [] as string[]
})

const platform = computed(() => {
  return detail.platform === '2' ? '助老员APP' : detail.platform === '3' ? '平台' : ''
})
const visitRegion = computed(() => {
  return `${detail.visitProvince || ''}${detail.visitCity || ''}${detail.visitCounty || ''}${detail.visitStreet || ''}${detail.visitCommunity || ''}${detail.visitVillage || ''}${detail.visitDetailAddress || ''}`
})
const customerInfo = computed(() => {
  return `(${detail.visitCustomerIdCard ? detail.visitCustomerIdCard + '；' : ''}${detail.visitCustomerMobilePhone || ''})`
})
const loadDetail = async () => {
  const { data } = await visitingDetail(route.query.id as string)
  Object.assign(detail, data)
}

const goBack = () => {
  router.back()
}
</script>

<style lang="less" scoped>
.grid-box {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0 30px;
  margin-bottom: 16px;
}
.item {
  font-size: 14px;
  display: flex;
  .label {
    flex-shrink: 0;
    // color: #666;
    margin-right: 10px;
  }
}
.grid-box-2 {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0 30px;
}
.section {
  .item {
    margin-bottom: 16px;
  }
}
.img-ul {
  display: flex;
  align-items: center;
}
:deep(.el-image) {
  margin-right: 10px;
  .el-image__inner {
    border-radius: 4px;
  }
}
</style>
