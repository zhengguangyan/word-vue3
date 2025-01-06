<template>
  <el-page-header title="" @back="onBack">
    <template #content>
      <span class="font-bold"> 编辑客户信息：{{ customerDetail.name }} </span>
    </template>
    <div class="detail-top-gray-info">
      <span class="mr-5">ID：{{ customerDetail.id }}</span>
      <span class="mr-5">
        创建：{{ customerDetail.creatorName }} {{ customerDetail.createTime }}
      </span>
      <span class="mr-5">
        最近更新：{{ customerDetail.updaterName }}
        {{ customerDetail.updateTime }}
      </span>
      <span class="mr-5">最近联系：{{ customerDetail.finalContactTime }}</span>
    </div>
  </el-page-header>
  <el-descriptions title="基础信息" border :column="2">
    <el-descriptions-item label="姓名(必填)" class="line-2">
      <el-input v-model="form.otherDemand" />
    </el-descriptions-item>
    <el-descriptions-item label="性别(必填)" class="line-2">
      <el-radio-group v-model="form.isCare">
        <el-radio value="1" size="large">男</el-radio>
        <el-radio value="2" size="large">女</el-radio>
      </el-radio-group>
    </el-descriptions-item>
    <el-descriptions-item label="服务对象来源(必填)">
      <DictSelect
        width="100%"
        v-model="form.livingDemand"
        :distList="filterDict('living_demand')"
        placeholder="生活需求"
        :multiple="true"
        :zero="true"
      />
    </el-descriptions-item>
    <el-descriptions-item />
    <el-descriptions-item label="联系电话(必填)" class="line-2">
      <el-input v-model="form.otherDemand" />
    </el-descriptions-item>
    <el-descriptions-item />
    <el-descriptions-item label="证件号码(必填)" class="line-2">
      <el-input v-model="form.otherDemand" />
    </el-descriptions-item>
    <el-descriptions-item label="证件类型"> 身份证 </el-descriptions-item>
    <el-descriptions-item label="出生年月"> 1933-11-22 </el-descriptions-item>
    <el-descriptions-item label="年龄(必填)" class="line-2">
      <el-input v-model="form.otherDemand" />
    </el-descriptions-item>
    <el-descriptions-item label="民族(必填)" class="line-2">
      <el-input v-model="form.otherDemand" />
    </el-descriptions-item>
    <el-descriptions-item label="政治面貌(必填)" class="line-2">
      <el-input v-model="form.otherDemand" />
    </el-descriptions-item>
    <el-descriptions-item label="身高(必填)" class="line-2">
      <el-input v-model="form.otherDemand" />
    </el-descriptions-item>
    <el-descriptions-item label="体重(必填)" class="line-2">
      <el-input v-model="form.otherDemand" />
    </el-descriptions-item>
  </el-descriptions>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { getCustomerBaseDetailById } from '@/api/customer/index'
import DictSelect from '@/components/DictSelect/index.vue'
import { filterDict } from '@/hooks/web/useDict'

const { push } = useRouter()
const { query } = useRoute()

function onBack() {
  push('/customer')
}

let customerDetail = ref<any>({})

const form = ref<any>({})

const getDetail = async () => {
  const res = await getCustomerBaseDetailById(Number(query.id))
  customerDetail.value = res.data
}

onMounted(getDetail)
</script>

<style scoped>
:deep(.el-descriptions__content.el-descriptions__cell.is-bordered-content) {
  padding-right: 10vw;
}
</style>
