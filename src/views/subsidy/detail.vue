<template>
  <el-page-header @back="onBack">
    <template #content>
      <span class="font-bold"> 养老卡详情：{{ data.code }} ({{ renderDict(data.status, 'subsidy_card_using_status') }}) </span>
    </template>
    <div class="detail-top-gray-info">
      <span class="mr-5"> 卡ID：{{ data.id }} </span>
      <span class="mr-5"> 创建：{{ data.creatorName + ' ' + data.createTime }} </span>
      <span class="mr-5"> 最近更新：{{ data.updaterName + ' ' + data.updateTime }} </span>
    </div>
  </el-page-header>

  <h2 class="title">基础信息</h2>
  <div class="info-box">
    <div class="info-item">
      <span class="item-label">卡号</span>
      <span class="item-content">{{ data.code }}</span>
    </div>
    <div class="info-item">
      <span class="item-label">卡类型</span>
      <span class="item-content">{{ renderDict(data.type, 'card_type') }}</span>
    </div>
    <div class="info-item">
      <span class="item-label">内码</span>
      <span class="item-content">{{ data.internalCode }}</span>
    </div>
    <div class="info-item info-item-100">
      <span class="item-label">状态</span>
      <span class="item-content">{{ renderDict(data.status, 'subsidy_card_using_status') }}</span>
    </div>
    <div class="info-item info-item-100" style="margin-bottom: 0">
      <span class="item-label">图片</span>
      <span class="item-content">
        <el-image v-for="(item, index) in imgList" :key="index" :src="item" :initial-index="index" :preview-src-list="imgList" fit="fill" class="img-size"></el-image>
      </span>
    </div>
  </div>
  <div v-if="data.customerId">
    <h2 class="title">客户信息</h2>
    <div class="info-box">
      <div class="info-item">
        <span class="item-label">客户姓名</span>
        <span class="item-content">
          {{ data.customerName }}
          <span class="void" v-if="data.customerSex">({{ renderDict(data.customerSex, 'vols_sex') }})</span>
          <el-button link type="primary" @click="toDetail(data.customerId)">查看</el-button>
        </span>
      </div>
      <div class="info-item">
        <span class="item-label">年龄</span>
        <span class="item-content">{{ data.customerAge }}</span>
      </div>
      <div class="info-item">
        <span class="item-label">联系电话</span>
        <span class="item-content">{{ data.customerMobilePhone }}</span>
      </div>
      <div class="info-item">
        <span class="item-label">证件号码</span>
        <span class="item-content">{{ data.customerIdCard }}</span>
      </div>
    </div>
  </div>
  <h2 class="title" v-if="data.status === '2'">补贴信息</h2>
  <el-table
    v-if="data.status === '2'"
    :data="data.subsidyInfoList"
    header-row-class-name="table-header"
    :style="{
      width: 'calc(100vw - 350px)',
      border: '1px solid #f5f3f0',
      borderRadius: '8px'
    }"
    max-height="200"
  >
    <el-table-column type="index" />
    <el-table-column label="操作" width="80">
      <template #default="{ row }">
        <el-button link type="primary" size="small" @click="subsidyDetail(row.id)"> 查看 </el-button>
      </template>
    </el-table-column>
    <el-table-column show-overflow-tooltip prop="name" label="补贴名称" min-width="150" />
    <el-table-column show-overflow-tooltip prop="usingStatus" label="补贴状态" min-width="150">
      <template #default="{ row }">
        <!-- {{ renderDict(row.usingStatus, 'subsidy_using_status') }} -->
        <span class="not-bound" v-if="row.usingStatus === '1'">未使用</span>
        <span class="bound" v-else-if="row.usingStatus === '2'">使用中</span>
        <span class="void" v-else-if="row.usingStatus === '3'">停止使用</span>
      </template>
    </el-table-column>
    <el-table-column show-overflow-tooltip prop="customerUsingStatus" label="补贴人员状态" min-width="150">
      <template #default="{ row }">
        <span class="not-bound" v-if="row.customerUsingStatus === '1'">未使用</span>
        <span class="bound" v-else-if="row.customerUsingStatus === '2'">使用中</span>
        <span class="void" v-else-if="row.customerUsingStatus === '3'">停止使用</span>
      </template>
    </el-table-column>
    <el-table-column show-overflow-tooltip prop="balance" label="当月余额" min-width="150" />
    <!-- <el-table-column show-overflow-tooltip prop="balance" label="次月余额(预估)" min-width="150" /> -->
    <el-table-column show-overflow-tooltip prop="areaCode" label="所属项目" min-width="100">
      <template #default="{ row }">
        {{ areaList.find((item) => item.value == row.areaCode)?.label }}
      </template>
    </el-table-column>
    <el-table-column show-overflow-tooltip prop="startDate" label="合同开始时间" min-width="150" />
    <el-table-column show-overflow-tooltip prop="endDate" label="合同结束时间" min-width="150" />
  </el-table>
  <h2 class="title">卡历史记录</h2>
  <el-table
    :data="subsidyCordTable"
    header-row-class-name="table-header"
    :style="{
      width: 'calc(100vw - 350px)',
      border: '1px solid #f5f3f0',
      borderRadius: '8px'
    }"
    max-height="200"
  >
    <el-table-column type="index" />
    <el-table-column label="操作" width="100">
      <template #default="{ row }">
        <el-button v-if="row.cardId" link type="primary" size="small" @click="subsidyRecordDetail(row.subsidyCustomerId)"> 查看 </el-button>
      </template>
    </el-table-column>
    <el-table-column show-overflow-tooltip prop="createTime" min-width="170" label="时间" />
    <el-table-column show-overflow-tooltip prop="creatorName" min-width="160" label="姓名" />
    <el-table-column show-overflow-tooltip prop="act" min-width="160" label="作业" />
    <el-table-column show-overflow-tooltip prop="status" min-width="160" label="状态" />
    <el-table-column show-overflow-tooltip prop="remark" min-width="400" label="备注" />
  </el-table>
  <div style="margin-top: 20px">
    <el-pagination
      v-model:current-page="subsidyCordFrom.pageNum"
      v-model:page-size="subsidyCordFrom.pageSize"
      :page-sizes="[10, 20, 50, 100, 200, 500]"
      layout="total, sizes, prev, pager, next, jumper"
      :total="subsidyCordTotal"
      @size-change="getSubsidyCord"
      @current-change="getSubsidyCord"
    />
  </div>
</template>
<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue'
// import { useCache } from '@/hooks/web/useCache'
import { useRouter, useRoute } from 'vue-router'
import { subsidyCardDetail, subsidyCardRecordPage } from '@/api/subsidy'
import { useCache } from '@/hooks/web/useCache'
import { useAppStoreWithOut } from '@/store/modules/app'
import { renderDict } from '@/hooks/web/useDict'
const { back, push } = useRouter()
const { query } = useRoute()
// const { wsCache } = useCache()
// const leafAreaFlag = ref(wsCache.get('leafAreaFlag'))

function onBack() {
  back()
}

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

const data = ref<any>({})
const imgList = computed(() => {
  if (!(data.value.attachList && data.value.attachList.length)) return []
  return data.value.attachList.map((item) => item.url)
})

async function getData() {
  const res = await subsidyCardDetail(query.id)
  if (res) {
    data.value = res.data
    getSubsidyCord()
  }
}

const subsidyDetail = (id) => {
  push(`/subsidy/subsidyDetail?id=${id}`)
}

const toDetail = (id) => {
  push(`/customer/detail?id=${id}&customerUpdate=true`)
}

const subsidyRecordDetail = (id) => {
  push(`/subsidy/subsidyUserDetail?id=${id}`)
}
const subsidyCordFrom = ref({
  type: 2,
  pageNum: 1,
  pageSize: 20,
  orderByColumn: undefined,
  asc: undefined
})

const subsidyCordTable = ref([])

const subsidyCordTotal = ref(0)

// 获取卡历史记录
const getSubsidyCord = async () => {
  const { data } = await subsidyCardRecordPage({ subsidyCardId: query.id })
  subsidyCordTable.value = data.list
  subsidyCordTotal.value = data.total
}

onMounted(() => {
  getData()
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
    word-wrap: break-word;
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
.img-size {
  display: inline-block;
  height: 80px;
  width: 80px;
  border: 1px solid #eceaea;
  margin: 0 10px 10px 0;
  border-radius: 4px;
}
</style>
