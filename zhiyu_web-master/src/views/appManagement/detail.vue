<template>
  <el-page-header @back="onBack" class="common-page-header">
    <template #content>服务商详情</template>
    <div></div>
  </el-page-header>
  <el-scrollbar height="calc(100vh - 195px)">
    <h2 class="title r-m-t-20 r-m-b-16">基础信息</h2>
    <div class="info-list">
      <div class="detail-info-item">
        <span class="detail-info-item-label">服务商名称</span>
        <span class="detail-info-item-content">{{ data.name }}</span>
      </div>
      <div class="detail-info-item">
        <span class="detail-info-item-label">服务商编号</span>
        <span class="detail-info-item-content">{{ data.code }}</span>
      </div>
      <div class="detail-info-item">
        <span class="detail-info-item-label">服务商类型</span>
        <span class="detail-info-item-content">{{ typeList.find((item) => item.value === data.categoryid)?.label }}</span>
      </div>
      <div class="detail-info-item">
        <span class="detail-info-item-label">服务商电话</span>
        <span class="detail-info-item-content">{{ data.companyPhone }}</span>
      </div>
      <div class="detail-info-item">
        <span class="detail-info-item-label">服务商状态</span>
        <span class="detail-info-item-content">{{ renderDict(data.status, 'seller_status') }}</span>
      </div>
      <div class="detail-info-item">
        <span class="detail-info-item-label">营业状态</span>
        <span class="detail-info-item-content">{{ renderDict(data.businessstatus, 'seller_businessstatus') }}</span>
      </div>
      <div class="detail-info-item">
        <span class="detail-info-item-label">所属地区</span>
        <span class="detail-info-item-content">
          {{ data.sellerCounty + (data.sellerStreet ? ',' + data.sellerStreet : '') + (data.sellerCommuniy ? ',' + data.sellerCommunity : '') }}
        </span>
      </div>
      <div class="detail-info-item">
        <span class="detail-info-item-label">详细地址</span>
        <span class="detail-info-item-content">{{ data.address }}</span>
      </div>
      <div class="detail-info-item">
        <span class="detail-info-item-label">开户行</span>
        <span class="detail-info-item-content">{{ data.depositBank }}</span>
      </div>
      <div class="detail-info-item">
        <span class="detail-info-item-label">商户账号</span>
        <span class="detail-info-item-content">{{ data.merAccount }}</span>
      </div>
      <div class="detail-info-item">
        <span class="detail-info-item-label">服务商结算方式</span>
        <span class="detail-info-item-content">{{ renderDict(data.paymentType, 'checkout_mode') }}</span>
      </div>
      <div class="detail-info-item">
        <span class="detail-info-item-label">合同到期日期</span>
        <span class="detail-info-item-content">{{ data.contractendDate }}</span>
      </div>
      <div class="detail-info-item">
        <span class="detail-info-item-label">是否已合作</span>
        <span class="detail-info-item-content">{{ renderDict(data.isCooperation, 'yes_no') }}</span>
      </div>
      <div class="detail-info-item">
        <span class="detail-info-item-label">是否公益</span>
        <span class="detail-info-item-content">{{ renderDict(data.isCooperation, 'yes_no') }}</span>
      </div>
      <div class="detail-info-item">
        <span class="detail-info-item-label">备注</span>
        <span class="detail-info-item-content">{{ data.remark }}</span>
      </div>
    </div>
    <h2 class="title r-m-t-20 r-m-b-16">服务信息</h2>
    <div class="info-list">
      <div class="detail-info-item item-100">
        <span class="detail-info-item-label">服务商介绍</span>
        <span class="detail-info-item-content">{{ data.cooperationcontent }}</span>
      </div>
      <div class="detail-info-item">
        <span class="detail-info-item-label">营业时间</span>
        <span class="detail-info-item-content">{{ renderDict(data.businessWeekDays, 'business_week_days') }}</span>
      </div>
      <div class="detail-info-item item-66">
        <span class="detail-info-item-label">服务商起止时间</span>
        <span class="detail-info-item-content">{{ data.businessStartTime ? data.businessStartTime + ' ~ ' + data.businessEndTime : '' }}</span>
      </div>
      <div class="detail-info-item">
        <span class="detail-info-item-label">是否送货</span>
        <span class="detail-info-item-content">{{ renderDict(data.delivergoods, 'yes_no') }}</span>
      </div>
      <div class="detail-info-item">
        <span class="detail-info-item-label">起送价格</span>
        <span class="detail-info-item-content">{{ data.deliverMinPrice }}</span>
      </div>
      <div class="detail-info-item">
        <span class="detail-info-item-label">星级评价</span>
        <span class="detail-info-item-content">{{ renderDict(data.starEvaluate, 'star_evaluate') }}</span>
      </div>
      <div class="detail-info-item item-100">
        <span class="detail-info-item-label">服务范围</span>
        <span class="detail-info-item-content">
          <Cascader disabled width="100%" v-model="data.serveAreaCodeList" :multiple="true" :check="true" />
        </span>
      </div>
    </div>
  </el-scrollbar>
</template>
<script lang="ts" setup>
import { ref, onMounted } from 'vue'
// import { useCache } from '@/hooks/web/useCache'
import { useRouter, useRoute } from 'vue-router'
import { getProviderDetail, getProviderTypeList } from '@/api/serviceProvider'
import Cascader from '@/components/Cascader/indexSub.vue'
import { renderDict } from '@/hooks/web/useDict'
const { back } = useRouter()
const { query } = useRoute()
// const { wsCache } = useCache()
// const leafAreaFlag = ref(wsCache.get('leafAreaFlag'))

function onBack() {
  back()
}

const data = ref<any>({})

async function getData() {
  const res = await getProviderDetail(query.id)
  if (res) {
    data.value = res.data
  }
}

const typeList = ref<any>([])

const getTypeList = async () => {
  const dictRes = await getProviderTypeList()
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
