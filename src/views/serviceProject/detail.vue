<template>
  <el-page-header title="" @back="onBack" class="common-page-header">
    <template #content> 服务项目详情 </template>
  </el-page-header>
  <el-scrollbar height="calc(100vh - 205px)">
    <div class="detail-top-gray-info">
      <span class="mr-5">创建时间：{{ data.createTime }} {{ data.creatorName }}</span>
      <span class="mr-5">更新时间：{{ data.updateTime }} {{ data.updaterName }}</span>
    </div>

    <h2 class="title">服务信息</h2>
    <div class="info-box">
      <div class="info-item">
        <span class="item-label">名称</span>
        <span class="item-content">{{ data.name }}</span>
      </div>
      <div class="info-item">
        <span class="item-label">副标题</span>
        <span class="item-content">{{ data.subhead }}</span>
      </div>
      <div class="info-item">
        <span class="item-label">标识码</span>
        <span class="item-content">{{ data.code }}</span>
      </div>
      <div class="info-item">
        <span class="item-label">单位</span>
        <span class="item-content">{{ data.unit }}</span>
      </div>
      <div class="info-item info-item-100">
        <span class="item-label">图片</span>
        <span class="item-content">
          <el-image :src="data.appPhotoUrl" :preview-src-list="[data.appPhotoUrl]" fit="fill" style="width: 80px; height: 80px"></el-image>
        </span>
      </div>
      <div class="info-item info-item-100">
        <span class="item-label">服务介绍</span>
        <div class="item-content" v-html="data.content"></div>
      </div>
      <div class="info-item info-item-100">
        <span class="item-label">服务摘要</span>
        <span class="item-content">{{ data.serveSummary }}</span>
      </div>
      <div class="info-item">
        <span class="item-label">服务便签</span>
        <span class="item-content">{{ data.serveLabel }}</span>
      </div>
      <div class="info-item">
        <span class="item-label">购买人数</span>
        <span class="item-content">{{ data.buyCount }}</span>
      </div>
      <div class="info-item">
        <span class="item-label">市场价格</span>
        <span class="item-content">{{ data.marketPrice }}元</span>
      </div>
      <div class="info-item">
        <span class="item-label">365价格</span>
        <span class="item-content">{{ data.price }}元</span>
      </div>
      <div class="info-item">
        <span class="item-label">365服务最小价格</span>
        <span class="item-content">{{ data.minPrice }}元</span>
      </div>
      <div class="info-item">
        <span class="item-label">中心价格</span>
        <span class="item-content">{{ data.centerPrice }}元</span>
      </div>
      <div class="info-item">
        <span class="item-label">活动价格</span>
        <span class="item-content">{{ data.activityPrice }}元</span>
      </div>
      <div class="info-item">
        <span class="item-label">服务最小价格</span>
        <span class="item-content">{{ data.minCountPrice }}元</span>
      </div>
      <div class="info-item">
        <span class="item-label">服务最小数量</span>
        <span class="item-content">{{ data.minCount }}</span>
      </div>
      <div class="info-item">
        <span class="item-label">服务最大数量</span>
        <span class="item-content">{{ data.maxCount }}</span>
      </div>
      <div class="info-item">
        <span class="item-label">价格备注</span>
        <span class="item-content">{{ data.priceRemark }}</span>
      </div>
      <div class="info-item">
        <span class="item-label">参与活动</span>
        <span class="item-content">{{ data.participationUser }}</span>
      </div>

      <div class="info-item">
        <span class="item-label">下单时间距离最小的服务时间（小时）</span>
        <span class="item-content" v-if="data.doserveFirstTime">{{ data.doserveFirstTime }}小时</span>
      </div>

      <div class="info-item">
        <span class="item-label">下单时间距离最大的服务时间（天）</span>
        <span class="item-content" v-if="data.doserveLatestTime">{{ data.doserveLatestTime }}天</span>
      </div>

      <div class="info-item">
        <span class="item-label">营业起止时间</span>
        <span v-if="data.businessStartTime" class="item-content">{{ data.businessStartTime + ' ~ ' + data.businessEndTime }}</span>
      </div>
      <div class="info-item">
        <span class="item-label">活动状态</span>
        <span class="item-content">{{ renderDict(data.activityStauts, 'activity_stauts') }}</span>
      </div>
      <div class="info-item">
        <span class="item-label">是否为预约服务</span>
        <span class="item-content">{{ data.canbook == '0' ? '否' : '是' }}</span>
      </div>
      <div class="info-item">
        <span class="item-label">在 APP 显示</span>
        <span class="item-content">{{ data.showOnApp == '0' ? '不显示' : '显示' }}</span>
      </div>
      <div class="info-item">
        <span class="item-label">是否支持货到付款</span>
        <span class="item-content">{{ data.canOfflinePay == '0' ? '不支持' : '支持' }}</span>
      </div>
      <div class="info-item">
        <span class="item-label">是否支持会员卡</span>
        <span class="item-content">{{ data.supportMemberCard == '0' ? '不支持' : '支持' }}</span>
      </div>
      <div class="info-item">
        <span class="item-label">是否支持快递</span>
        <span class="item-content">{{ data.deliver == '0' ? '不支持' : '支持' }}</span>
      </div>
      <div class="info-item">
        <span class="item-label">是否支持发票</span>
        <span class="item-content">{{ data.offerInvoice == '0' ? '不支持' : '支持' }}</span>
      </div>
      <div class="info-item">
        <span class="item-label">排序</span>
        <span class="item-content">{{ data.orderNumber }}</span>
      </div>
      <div class="info-item">
        <span class="item-label">标签</span>
        <span class="item-content">{{ data.tag }}</span>
      </div>
      <div class="info-item">
        <span class="item-label">工时（小时）</span>
        <span class="item-content">{{ data.hoursSubsidy }}</span>
      </div>
      <div class="info-item">
        <span class="item-label">项目工时（小时）</span>
        <span class="item-content">{{ data.serveitemHours }}</span>
      </div>
      <div class="info-item">
        <span class="item-label">预计时长（小时）</span>
        <span class="item-content">{{ data.serviceTime }}</span>
      </div>
      <div class="info-item info-item-100">
        <span class="item-label">备注</span>
        <span class="item-content">{{ data.remark }}</span>
      </div>
      <div class="info-item info-item-100">
        <span class="item-label">活动摘要</span>
        <span class="item-content">{{ data.summary }}</span>
      </div>
    </div>
  </el-scrollbar>
</template>
<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { config } from '@/config/axios/config'
import { getCategoryTree, getServeInfoDetail } from '@/api/serviceProject'
import { renderDict } from '@/hooks/web/useDict'
const { query } = useRoute()
const { back } = useRouter()

const onBack = () => {
  back()
}

const data = ref<any>({})

async function getData() {
  const res = await getServeInfoDetail(query.id)
  if (res) {
    if (res.data.appPhotoUrl) {
      res.data.appPhotoUrl = config.base_img.dev + res.data.appPhotoUrl
    }
    data.value = res.data
  }
}

const typeList = ref<any>([])

const getTypeList = async () => {
  const dictRes = await getCategoryTree()
  typeList.value = dictRes.data.map((item) => {
    return {
      value: item.id,
      label: item.name
    }
  })
}

onMounted(() => {
  getData()
  getTypeList()
})
</script>
<style scoped lang="less">
/* :deep(.el-descriptions__cell.el-descriptions__label.is-bordered-label) {
  width: 12%;
} */
.info-box {
  display: flex;
  flex-wrap: wrap;
}
.info-box:not(:empty) {
  margin-bottom: 10px;
}
.info-item {
  width: 33.33%;
  line-height: 23px;
  font-size: 14px;
  margin-bottom: 20px;
  display: flex;
  .item-label {
    text-align: left;
    // color: var(--el-text-color-regular);
    margin-right: 10px;
    white-space: nowrap;
  }
  .item-content {
    width: calc(100% - 100px);
  }
}
.info-item-100 {
  width: 100% !important;
}
.info-item-66 {
  width: 66.66% !important;
}
.title {
  margin: 20px 0;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
