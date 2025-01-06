<template>
  <el-page-header title="" @back="onBack">
    <template #content>
      <span class="font-bold"> 编辑客户信息：{{ customerDetail.name }} </span>
    </template>
    <div class="detail-top-gray-info">
      <span class="mr-5" v-if="customerDetail.customerType">类型：{{ radioDict(customerDetail.customerType, 'customer_type') }}</span>
      <span class="mr-5">ID：{{ customerDetail.id }}</span>
      <span class="mr-5">创建：{{ customerDetail.creatorName }} {{ customerDetail.createTime }}</span>
      <span class="mr-5">最近更新：{{ customerDetail.updaterName }}{{ customerDetail.updateTime }}</span>
      <span class="mr-5" v-if="customerDetail.finalContactTime">最近联系：{{ customerDetail.finalContactTime }}</span>
    </div>
  </el-page-header>

  <div style="padding-top: 20px; display: flex">
    <el-tabs tab-position="left" v-model="currentMenu" :before-leave="beforeTabLeave" class="demo-tabs">
      <el-tab-pane label="基础信息" name="baseInfo" />
      <el-tab-pane label="需求信息" name="requirementInfo" />
      <el-tab-pane label="延伸信息" name="extendInfo" />
      <el-tab-pane label="健康信息" name="healthInfo" />
      <el-tab-pane label="家庭信息" name="familyInfo" />
    </el-tabs>
    <div style="width: calc(100% - 200px)">
      <el-scrollbar class="info-container" v-if="currentMenu === 'baseInfo'">
        <BaseInfoEditForm :dict="dictMap" :customerId="customerDetail.id" :deathFlag="deathFlag" :customerUpdate="customerUpdate" @handle-data-change="handleDataChange" />
      </el-scrollbar>
      <el-scrollbar class="info-container" v-if="currentMenu === 'requirementInfo'">
        <RequirementInfoEditForm :dict="dictMap" :customerId="customerDetail.id" :deathFlag="deathFlag" :customerUpdate="customerUpdate" @handle-data-change="handleDataChange" />
      </el-scrollbar>
      <el-scrollbar class="info-container" v-if="currentMenu === 'extendInfo'">
        <ExtendInfoEditForm :dict="dictMap" :customerId="customerDetail.id" :customerUpdate="customerUpdate" @handle-data-change="handleDataChange" />
      </el-scrollbar>
      <el-scrollbar class="info-container" v-if="currentMenu === 'healthInfo'">
        <HealthInfoEditForm :dict="dictMap" :customerId="customerDetail.id" :deathFlag="deathFlag" :customerUpdate="customerUpdate" @handle-data-change="handleDataChange" />
      </el-scrollbar>
      <el-scrollbar class="info-container" v-if="currentMenu === 'familyInfo'">
        <FamilyInfoEditForm :dict="dictMap" :customer="customerDetail" :deathFlag="deathFlag" />
      </el-scrollbar>
      <!-- <div class="info-container" v-if="currentMenu === 'bpDataInfo'">
        <BpDataInfoEditForm :dict="dictMap" :customerId="customerDetail.id" />
      </div>
      <div class="info-container" v-if="currentMenu === 'bsDataInfo'">
        <BsDataInfoEditForm :dict="dictMap" :customerId="customerDetail.id" />
      </div> -->
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessageBox } from 'element-plus'
import { getCustomerBaseDetailById, getExtendDetailById } from '@/api/customer/index'
import BaseInfoEditForm from './components/base-info-edit-form/index.vue'
import RequirementInfoEditForm from './components/requirement-info-edit-form/index.vue'
import ExtendInfoEditForm from './components/extend-info-edit-form/index.vue'
import HealthInfoEditForm from './components/health-info-edit-form/index.vue'
import FamilyInfoEditForm from './components/family-info-edit-form/index.vue'

import { dictMap, filterDict } from '@/hooks/web/useDict'
// @ts-ignore
defineOptions({
  // eslint-disable-next-line vue/component-definition-name-casing
  name: 'Customer/edit'
})

const { back } = useRouter()
const { query } = useRoute()

const currentMenu = ref('baseInfo')
const dataChangeFlag = ref(false)
const customerUpdate = ref(query.customerUpdate ? JSON.parse(query.customerUpdate as string) : true)

function handleDataChange(flag) {
  dataChangeFlag.value = flag
}

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

let customerDetail = ref<any>({})

const deathFlag = ref('1')

async function getDetail() {
  const res = await getCustomerBaseDetailById(Number(query.id))
  if (res) {
    customerDetail.value = res.data
  }
  const extendRes = await getExtendDetailById(Number(query.id))
  if (extendRes.data) {
    deathFlag.value = extendRes.data.deathFlag
  }
  if (deathFlag.value === '0') {
    currentMenu.value = 'extendInfo'
  }
}

const radioDict = (key: any, dict: any) => {
  if (!key) {
    return
  }
  return filterDict(dict)
    ?.filter((item: any) => item.value == key)
    .map((item: any) => item?.label)
    .join('，')
}
onMounted(() => {
  getDetail()
})
</script>

<style scoped>
:deep(.el-descriptions__cell.el-descriptions__content.is-bordered-content) {
  padding-right: 50px;
}
.info-container {
  padding: 0 40px 10px;
  /* 设置容器的高度 */
  height: calc(100vh - 295px);
  /* 当内容超出容器高度时显示滚动条 */
  overflow: auto;
}
.info-container h2 {
  font-size: 16px;
  font-weight: 600;
  color: var(--main-text-color);
  margin-bottom: 10px;
}

:deep(.el-sub-menu.is-active.is-opened .el-sub-menu__title) {
  color: var(--el-color-primary);
}
:deep(.el-tabs__item.is-active),
:deep(.el-menu-item.is-active) {
  font-size: var(--el-font-size-base);
  background: linear-gradient(270deg, rgba(255, 149, 0, 0.16) 0%, rgba(255, 149, 0, 0.02) 100%);
}

:deep(.el-menu-item) {
  height: 44px !important;
  padding-left: 28px !important;
}
:deep(.el-tabs--left .el-tabs__item.is-left) {
  width: 200px;
  height: 44px;
  font-size: 16px;
  justify-content: flex-start;
  padding-left: 40px;
}
</style>
