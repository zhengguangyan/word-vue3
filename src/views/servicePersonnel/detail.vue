<template>
  <el-page-header title="" @back="onBack">
    <template #content>
      <span class="font-bold"> 服务人员详情：{{ baseInfo.name }} </span>
    </template>
    <div class="detail-top-gray-info">
      <span class="mr-5"> 年龄：{{ baseInfo.age }} </span>
      <span class="mr-5"> 性别：{{ renderDict(baseInfo.sex, 'sys_user_sex') }} </span>
      <span class="mr-5"> 联系号码：{{ baseInfo.mobilePhone }} </span>
      <span class="mr-5"> 身份证号：{{ baseInfo.idcard }} </span>
      <span class="mr-5"> 所属部门：{{ baseInfo.orgCompanyName }} </span>
      <span class="mr-5" v-if="baseInfo.roleNames"> 角色：{{ baseInfo.roleNames }} </span>
    </div>
  </el-page-header>
  <div style="display: flex">
    <div class="tab-box">
      <el-tabs tab-position="left" v-model="currentMenu" :before-leave="beforeTabLeave">
        <el-tab-pane label="个人信息" name="baseInfo" />
        <el-tab-pane label="服务属性" name="server" />
        <el-tab-pane label="订单信息" name="order" />
        <el-tab-pane label="二维码记录" name="QRcode" />
      </el-tabs>
    </div>
    <div style="width: calc(100% - 200px)">
      <el-scrollbar class="info-container" v-if="currentMenu === 'baseInfo'">
        <BaseInfo :dict="dictMap" :customerId="Number(query.id)" :dataChangeFlag="dataChangeFlag" @handle-data-change="handleDataChange" />
      </el-scrollbar>
      <el-scrollbar class="info-container" v-if="currentMenu === 'server'">
        <SeverInfo :dict="dictMap" :customerId="Number(query.id)" :dataChangeFlag="dataChangeFlag" @handle-data-change="handleDataChange" />
      </el-scrollbar>
      <el-scrollbar class="info-container" v-if="currentMenu === 'order'">
        <OrderInfo :dict="dictMap" :operatorSellerId="Number(baseInfo.sourceUserId)" />
      </el-scrollbar>
      <el-scrollbar class="info-container" v-if="currentMenu === 'QRcode'">
        <QrcodeInfo :dict="dictMap" :customerId="Number(query.id)" />
      </el-scrollbar>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import QrcodeInfo from './components/qrcode-info/index.vue'
import BaseInfo from './components/baseinfo/index.vue'
import SeverInfo from './components/sever-info/index.vue'
import OrderInfo from './components/order-info/index.vue'
import { ElMessageBox } from 'element-plus'
import { getOperatorDetail } from '@/api/servicePersonnel'
import { dictMap, renderDict } from '@/hooks/web/useDict'
const { back } = useRouter()
const { query } = useRoute()

const currentMenu = ref('baseInfo')

function handleDataChange(flag) {
  dataChangeFlag.value = flag
}

const dataChangeFlag = ref(false)

async function beforeTabLeave() {
  if (!dataChangeFlag.value) {
    return true
  }
  await ElMessageBox.confirm('存在未保存的修改内容，确认是否跳转页面？', '编辑未保存', {
    confirmButtonText: '取消跳转',
    cancelButtonText: '不保存',
    type: 'warning',
    distinguishCancelAndClose: true,
    showClose: false,
    closeOnClickModal: false,
    closeOnPressEscape: false
  })
    .then((_action) => {
      return Promise.reject()
    })
    .catch((action) => {
      if (action === 'cancel') {
        handleDataChange(false)
        return true
      }
      return Promise.reject()
    })
}
function onBack() {
  back()
}

let baseInfo = ref<any>({})

// 获取基础信息
async function getBaseInfo() {
  const { data } = await getOperatorDetail(Number(query.id))
  baseInfo.value = data
}

onMounted(() => {
  getBaseInfo()
})
</script>

<style scoped lang="less">
.info-container {
  padding: 0 40px;
  height: calc(100vh - 310px); /* 设置容器的高度 */
  overflow: auto; /* 当内容超出容器高度时显示滚动条 */
}
.info-container h2 {
  font-size: 16px;
  font-weight: 600;
  color: var(--main-text-color);
  margin-bottom: 20px;
}
.tab-box {
  width: 200px;
  border-right: 1px solid #e0dedc;
}
.info-box {
  display: flex;
  flex-wrap: wrap;
}
.info-box:not(:empty) {
  margin-bottom: 10px;
}
.info-item {
  width: 50%;
  line-height: 23px;
  font-size: 14px;
  margin-bottom: 20px;
  display: flex;
  .item-label {
    text-align: left;
    color: var(--el-text-color-regular);
    margin-right: 5px;
    flex-shrink: 0;
    &::after {
      content: ' :';
    }
  }
  .item-content {
    width: calc(100% - 100px);
    padding-right: 40px;
  }
}
.item-100 {
  width: 100% !important;
}
:deep(.el-tabs__item.is-active) {
  background: linear-gradient(270deg, rgba(255, 149, 0, 0.16) 0%, rgba(255, 149, 0, 0.02) 100%);
}
:deep(.el-tabs--left .el-tabs__item.is-left) {
  width: 200px;
  height: 44px;
  font-size: 16px;
  justify-content: flex-start;
  padding-left: 40px;
}
:deep(.el-tabs--left .el-tabs__active-bar.is-left) {
  width: 2px;
  right: 1px;
}
:deep(.el-tabs--left .el-tabs__nav-wrap.is-left::after) {
  width: 0;
}
</style>
