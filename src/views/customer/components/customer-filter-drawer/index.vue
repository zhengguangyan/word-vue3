<template>
  <div
    class="filter-box scrollbarHide"
    :class="{
      'show-filter': !visibleFlag,
      'all-filter': activeIndex == '2' || activeIndex == '3'
    }"
  >
    <div class="customer-filter">
      <div class="filter-row" style="width: 50%">
        <span class="row-head">模糊搜索</span>
        <el-input style="width: 100%" v-model="form.search" placeholder="模糊搜索姓名、证件号码、联系电话、详细地址、备注、APP账号" @change="onSubmit" />
      </div>

      <div class="filter-row" style="width: 50%; justify-content: end">
        <el-space>
          <el-button type="primary" @click="onSubmit">查询</el-button>
          <el-button @click="reset">重置</el-button>
          <el-button @click="closeFlag">收起</el-button>
        </el-space>
      </div>
      <div class="filter-row">
        <span class="row-head">客户性别</span>
        <DictSelect width="100%" v-model="form.sex" :distList="filterDict('vols_sex')" placeholder="性别" :clearable="true" />
      </div>
      <div class="filter-row">
        <span>类型</span>
        <DictSelect width="100%" v-model="form.customerType" :distList="filterDict('customer_type')" placeholder="类型(多选)" :multiple="true" :tags="1" :clearable="true" />
      </div>
      <div class="filter-row">
        <span>年龄</span>
        <el-input v-model="form.ageBegin" placeholder="年龄开始" />
        -
        <el-input v-model="form.ageEnd" placeholder="年龄结束" />
      </div>
      <div class="filter-row">
        <span>文化程度</span>
        <DictSelect width="100%" v-model="form.educationLevel" :distList="filterDict('degree_education')" placeholder="文化程度" :clearable="true" />
      </div>
      <div class="filter-row">
        <span class="row-head">职业</span>
        <DictSelect width="100%" v-model="form.profession" :distList="filterDict('occupation')" placeholder="职业" :clearable="true" />
      </div>
      <div class="filter-row">
        <span>主要经济来源</span>
        <DictSelect width="100%" v-model="form.mainFinancially" :distList="filterDict('main_economic_source')" placeholder="主要经济来源" :clearable="true" />
      </div>
      <div class="filter-row">
        <span>收入/月</span>
        <DictSelect width="100%" v-model="form.income" :distList="filterDict('income_month')" placeholder="收入/月" :clearable="true" />
      </div>
      <div class="filter-row">
        <span>婚姻状况</span>
        <DictSelect width="100%" v-model="form.maritalStatus" :distList="filterDict('marital_status')" placeholder="婚姻状况" :clearable="true" />
      </div>
      <div class="filter-row">
        <span class="row-head">子女数量</span>
        <el-input v-model="form.childrennumSection" placeholder="子女数量" />
      </div>
      <div class="filter-row">
        <span>创建时间</span>
        <el-date-picker v-model="form.createTime" type="daterange" range-separator="-" start-placeholder="创建时间开始" end-placeholder="创建时间结束" value-format="YYYY-MM-DD" clearable />
      </div>
      <div class="filter-row">
        <span>更新时间</span>
        <el-date-picker v-model="form.updateTime" type="daterange" range-separator="-" start-placeholder="更新时间开始" end-placeholder="更新时间结束" value-format="YYYY-MM-DD" clearable />
      </div>
      <div class="filter-row">
        <span>是否有APP账号</span>
        <el-select v-model="form.appAcount" placeholder="是否有APP账号" style="width: 100%" clearable>
          <el-option label="是" value="1" />
          <el-option label="否" value="0" />
        </el-select>
      </div>
      <div class="filter-row">
        <span class="row-head">是否纳入饱和度计算</span>
        <el-select v-model="form.saturationLevel" placeholder="是否纳入饱和度计算" style="width: 100%" clearable>
          <el-option label="是" value="1" />
          <el-option label="否" value="0" />
        </el-select>
      </div>
      <div class="filter-row">
        <span>是否服务对象</span>
        <el-select v-model="form.disableObject" placeholder="是否服务对象" style="width: 100%" clearable>
          <el-option label="是" value="1" />
          <el-option label="否" value="0" />
        </el-select>
      </div>
      <div class="filter-row">
        <span>是否为覆盖</span>
        <el-select v-model="form.coverage" placeholder="是否为覆盖" style="width: 100%" clearable>
          <el-option label="是" value="1" />
          <el-option label="否" value="0" />
        </el-select>
      </div>
      <div class="filter-row">
        <span>是否为政府</span>
        <el-select v-model="form.iszf" placeholder="是否为政府" style="width: 100%" clearable>
          <el-option label="是" value="1" />
          <el-option label="否" value="0" />
        </el-select>
      </div>
      <div class="filter-row">
        <span class="row-head">是否人户一致</span>
        <el-select v-model="form.entryFamilyFlag" placeholder="是否人户一致" style="width: 100%" clearable>
          <el-option label="是" value="1" />
          <el-option label="否" value="0" />
        </el-select>
      </div>
      <div class="filter-row" style="width: 75%">
        <span>服务分类</span>
        <el-select
          v-model="form.serviceClassify"
          placeholder="一级服务分类"
          style="width: 270px; margin-right: 10px"
          clearable
          @change=";(form.secondServiceClass = undefined), (form.thirdServiceClass = undefined)"
        >
          <el-option v-for="item in filterDict('service_classify')" :key="item.value" :value="item.value" :label="item.label" />
        </el-select>
        <el-select
          v-model="form.secondServiceClass"
          placeholder="二级服务分类"
          style="width: 270px; margin-right: 10px"
          clearable
          v-if="form.serviceClassify || form.serviceClassify?.length"
          @change="form.thirdServiceClass = undefined"
        >
          <el-option v-for="item in filterDict('second_service_classify')" :key="item.value" :value="item.value" :label="item.label" />
        </el-select>
        <DictSelect
          width="270px"
          v-model="form.thirdServiceClass"
          :distList="third_service_classify"
          placeholder="三级服务分类"
          v-if="form.secondServiceClass || form.secondServiceClass?.length"
          :clearable="true"
        />
      </div>
      <div class="filter-row" style="width: 100%">
        <span class="row-head">现居地址</span>
        <Cascader class="mr-2" :check="true" placeholder="请选择现居地址" v-model="form.currentList" />
        <span class="form-tips" @click="filterOwnerAddress('current')"> 筛选用户本职组织区域 </span>
      </div>
      <div class="filter-row" style="width: 100%">
        <span class="row-head">户籍地址</span>
        <Cascader class="mr-2" :check="true" placeholder="请选择户籍地址" v-model="form.domicileList" />
        <span class="form-tips" @click="filterOwnerAddress('domicile')"> 筛选用户本职组织区域 </span>
      </div>
      <div class="filter-row" style="width: 50%">
        <span class="row-head">服务对象来源(一级)</span>
        <DictSelect width="270px" v-model="form.serviceObjSource" :distList="filterDict('service_obj_source')" placeholder="服务对象来源(一级)(多选)" :multiple="true" :tags="1" :clearable="true" />
        <el-checkbox style="margin-left: 10px" label="精确匹配" v-model="form.isServiceObjSource" />
      </div>
      <div class="filter-row" style="width: 50%">
        <span>服务对象来源(二级)</span>
        <DictSelect width="270px" v-model="form.secondServiceSource" :distList="filterDict('service_obj_source')" placeholder="服务对象来源(二级)(多选)" :multiple="true" :tags="1" :clearable="true" />
        <el-checkbox style="margin-left: 10px" label="精确匹配" v-model="form.isSecondServiceSource" />
      </div>
      <div class="filter-row" v-if="props.activeIndex == '2' || props.activeIndex == '3'">
        <span class="row-head">是否有市场化订单</span>
        <el-select v-model="form.haveMarketOrder" placeholder="是否有市场化订单" style="width: 100%" clearable>
          <el-option label="是" value="1" />
          <el-option label="否" value="0" />
        </el-select>
      </div>
      <div class="filter-row" v-if="props.activeIndex == '2' || props.activeIndex == '3'">
        <span>是否有助餐订单</span>
        <el-select v-model="form.haveMealOrder" placeholder="是否有助餐订单" style="width: 100%" clearable>
          <el-option label="是" value="1" />
          <el-option label="否" value="0" />
        </el-select>
      </div>
      <div class="filter-row" v-if="props.activeIndex == '2' || props.activeIndex == '3'">
        <span>是否为市场化平台</span>
        <el-select v-model="form.isMarkerCustomer" placeholder="是否为市场化平台" style="width: 100%" clearable>
          <el-option label="是" value="1" />
          <el-option label="否" value="0" />
        </el-select>
      </div>
      <el-divider border-style="dashed" />
      <div class="filter-row">
        <span class="row-head">老人分类</span>
        <DictSelect width="100%" v-model="form.elderClassify" :distList="filterDict('elder_classify')" placeholder="老人分类" :clearable="true" />
      </div>
      <div class="filter-row">
        <span>养老方式</span>
        <DictSelect width="100%" v-model="form.pensionMode" :distList="filterDict('pension_mode')" placeholder="养老方式" :clearable="true" />
      </div>
      <div class="filter-row">
        <span>补偿类型</span>
        <DictSelect width="100%" v-model="form.compensationType" :distList="filterDict('compensation_type')" placeholder="补偿类型" :clearable="true" />
      </div>
      <div class="filter-row">
        <span>政府补助标准</span>
        <DictSelect width="100%" v-model="form.subsidyStandard" :distList="filterDict('subsidy_standard')" placeholder="政府补助标准(多选)" :multiple="true" :tags="1" :zero="true" :clearable="true" />
      </div>
      <div class="filter-row">
        <span class="row-head">政府补助金额度</span>
        <DictSelect width="100%" v-model="form.subsidyQuota" :distList="filterDict('gov_grant_amount')" placeholder="政府补助金额度" :clearable="true" />
      </div>
      <div class="filter-row">
        <span>一级服务标签</span>
        <DictSelect width="100%" v-model="form.serviceLabel" :distList="filterDict('service_label')" placeholder="一级服务标签(多选)" :multiple="true" :tags="1" :clearable="true" />
      </div>
      <div class="filter-row">
        <span>二级服务标签</span>
        <DictSelect width="100%" v-model="form.secondServiceLabel" :distList="filterDict('second_service_label')" placeholder="二级服务标签(多选)" :multiple="true" :tags="1" :clearable="true" />
      </div>
      <div class="filter-row">
        <span>三级服务标签</span>
        <DictSelect width="100%" v-model="form.thirdServiceLabel" :distList="third_service_classify" placeholder="三级服务标签(多选)" :multiple="true" :tags="1" :clearable="true" />
      </div>
      <div class="filter-row">
        <span class="row-head">服务标准</span>
        <DictSelect width="100%" v-model="form.serviceStandards" :distList="filterDict('service_standards')" placeholder="服务标准(多选)" :multiple="true" :tags="1" :clearable="true" />
      </div>
      <el-divider border-style="dashed" />
      <div class="filter-row">
        <span class="row-head">是否接受关怀</span>
        <el-select v-model="form.isCare" placeholder="是否接受关怀" style="width: 100%" clearable>
          <el-option label="是" value="1" />
          <el-option label="否" value="0" />
        </el-select>
      </div>
      <div class="filter-row">
        <span>保险</span>
        <DictSelect width="100%" v-model="form.insurance" :distList="filterDict('insurance')" placeholder="保险" :clearable="true" />
      </div>
      <div class="filter-row">
        <span>身体状况</span>
        <DictSelect width="100%" v-model="form.physicalCondition" :distList="filterDict('physical_condition')" placeholder="身体状况(多选)" :multiple="true" :tags="1" :clearable="true" />
      </div>
      <div class="filter-row">
        <span>慢性病</span>
        <DictSelect width="100%" v-model="form.chronicDisease" :distList="filterDict('chronic_disease')" placeholder="慢性病(多选)" :multiple="true" :tags="1" :zero="true" :clearable="true" />
      </div>
      <div class="filter-row">
        <span class="row-head">生活需求</span>
        <DictSelect width="100%" v-model="form.livingDemand" :distList="filterDict('living_demand')" placeholder="生活需求" :clearable="true" />
      </div>
      <div class="filter-row">
        <span>家政需求</span>
        <DictSelect width="100%" v-model="form.domesticDemand" :distList="filterDict('domestic_demand')" placeholder="家政需求" :clearable="true" />
      </div>
      <div class="filter-row">
        <span>医疗需求</span>
        <DictSelect width="100%" v-model="form.medicalDemand" :distList="filterDict('medical_demand')" placeholder="医疗需求" :clearable="true" />
      </div>
      <div class="filter-row">
        <span>信誉评估</span>
        <DictSelect width="100%" v-model="form.reputationEvaluation" :distList="filterDict('reputation_evaluation')" placeholder="信誉评估" :clearable="true" />
      </div>
      <div class="filter-row">
        <span>其他需求</span>
        <el-input v-model="form.otherDemand" placeholder="其他需求" />
      </div>
      <el-divider border-style="dashed" />
      <div class="filter-row">
        <span class="row-head">老人类型</span>
        <DictSelect width="100%" v-model="form.oldmanType" :distList="filterDict('elder_type')" placeholder="老人类型" :clearable="true" />
      </div>
      <div class="filter-row">
        <span>居住情况</span>
        <DictSelect width="100%" v-model="form.liveOld" :distList="filterDict('live_situation')" placeholder="居住情况" :clearable="true" />
      </div>
      <div class="filter-row">
        <span>老人群体</span>
        <DictSelect width="100%" v-model="form.oldmanGroup" :distList="filterDict('elder_group')" placeholder="老人群体" :clearable="true" />
      </div>
      <div class="filter-row">
        <span>老人性格</span>
        <DictSelect width="100%" v-model="form.personality" :distList="filterDict('elder_character')" placeholder="老人性格" :clearable="true" />
      </div>
      <div class="filter-row">
        <span>老人爱好</span>
        <DictSelect width="100%" v-model="form.oldmanHobby" :distList="filterDict('elder_hobby')" placeholder="老人爱好" :clearable="true" />
      </div>
      <div class="filter-row">
        <span>上网方式</span>
        <DictSelect width="100%" v-model="form.internetMode" :distList="filterDict('internet_mode')" placeholder="上网方式" :clearable="true" />
      </div>
      <div class="filter-row">
        <span>上网目的</span>
        <DictSelect width="100%" v-model="form.internetAim" :distList="filterDict('internet_aims')" placeholder="上网目的" :clearable="true" />
      </div>
      <div class="filter-row" v-if="props.activeIndex == '2'">
        <span>是否健在</span>
        <el-select v-model="form.deathFlag" placeholder="是否健在" style="width: 100%" clearable>
          <el-option label="是" value="1" />
          <el-option label="否" value="0" />
        </el-select>
      </div>
      <el-divider border-style="dashed" />
      <div class="filter-row">
        <span>外呼结果</span>
        <DictSelect width="100%" v-model="form.resultIdentity" :distList="filterDict('result_identity')" placeholder="外呼结果(多选)" :multiple="true" :tags="1" :clearable="true" />
      </div>
      <div class="filter-row">
        <span>是否用于生成数据包</span>
        <el-select v-model="form.isDataPacket" placeholder="是否用于生成数据包" style="width: 100%" clearable>
          <el-option label="是" value="1" />
          <el-option label="否" value="0" />
        </el-select>
      </div>
      <div class="filter-row">
        <span>是否曾归属数据包</span>
        <el-select v-model="form.belongDataPackage" placeholder="是否曾归属数据包" style="width: 100%" clearable>
          <el-option label="是" value="1" />
          <el-option label="否" value="0" />
        </el-select>
      </div>
      <div class="filter-row">
        <span>历史归属数据包</span>
        <el-input v-model="form.historyPackage" placeholder="历史归属数据包" />
      </div>
      <div class="filter-row">
        <span>拜访次数</span>
        <el-input v-model="form.visitNoStart" placeholder="拜访次数" />
        -
        <el-input v-model="form.visitNoEnd" placeholder="" />
      </div>
      <div class="filter-row">
        <span>有效家庭成员</span>
        <el-input v-model="form.familyNoStart" placeholder="有效家庭成员" />
        -
        <el-input v-model="form.familyNoEnd" placeholder="" />
      </div>
      <div class="filter-row">
        <span>是否禁呼</span>
        <el-select v-model="form.isNocall" placeholder="是否禁呼" style="width: 100%" clearable>
          <el-option label="是" value="1" />
          <el-option label="否" value="0" />
        </el-select>
      </div>
      <div class="filter-row">
        <span>非</span>
        <DictSelect width="100%" v-model="form.haveEquipmentType" :distList="filterDict('have_equipment_type')" :clearable="true" />
        <p style="width: 70px; padding-left: 10px; font-size: 14px">客户</p>
      </div>
      <el-divider border-style="dashed" />
      <div class="filter-row">
        <span>是否正常服务</span>
        <el-select v-model="form.normalService" placeholder="是否正常服务" style="width: 100%" clearable>
          <el-option label="是" value="1" />
          <el-option label="否" value="0" />
        </el-select>
      </div>
      <div class="filter-row">
        <span>取消服务原因</span>
        <DictSelect width="100%" v-model="form.cancelServiceReason" :distList="filterDict('cancel_service_reason')" placeholder="取消服务原因(多选)" :multiple="true" :tags="1" :clearable="true" />
      </div>
      <div class="filter-row">
        <span>取消服务日期</span>
        <el-date-picker v-model="form.cancelServiceTime" type="daterange" range-separator="-" start-placeholder="更新时间开始" end-placeholder="更新时间结束" value-format="YYYY-MM-DD" clearable />
      </div>

      <!-- <el-space style="width: 100%">
        <el-button type="primary" @click="onSubmit">查询</el-button>
        <el-button @click="reset">重置</el-button>
        <el-button @click="closeFlag">收起</el-button>
      </el-space> -->
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import DictSelect from '/@/components/DictSelect/index.vue'
import { getDept } from '@/api/sys/Department'
import { useCache } from '@/hooks/web/useCache'
import { useAppStore } from '@/store/modules/app'
import Cascader from '/@/components/Cascader/index.vue'
const { wsCache } = useCache()
const appStore = useAppStore()

const props = defineProps({
  dict: {
    type: Array,
    default: null
  },
  activeIndex: {
    type: String,
    default: '1'
  }
})

const emits = defineEmits(['reload-list', 'change-accurate'])

const filterDict = (key: any) => {
  return (props.dict.find((item: any) => item.type == key) as any)?.list
}

const third_service_classify = computed<any>(() => {
  if (!form.value.secondServiceClass) return
  let filterName = 'second_service_classify_' + form.value.secondServiceClass
  return filterDict(filterName)
})

const visibleFlag = ref(false)

function show() {
  visibleFlag.value = !visibleFlag.value
}

const form = ref<any>({
  secondServiceClass: undefined,
  sex: null,
  appAcount: null,
  pageNum: 1,
  pageSize: 20
})

function onSubmit() {
  // visibleFlag.value = false
  if (form.value.createTime) {
    form.value.createBeginTime = form.value.createTime[0]
    form.value.createEndTime = form.value.createTime[1]
  } else {
    form.value.createBeginTime = undefined
    form.value.createEndTime = undefined
  }
  if (form.value.updateTime) {
    form.value.updateBeginTime = form.value.updateTime[0]
    form.value.updateEndTime = form.value.updateTime[1]
  } else {
    form.value.updateBeginTime = undefined
    form.value.updateEndTime = undefined
  }
  if (form.value.cancelServiceTime) {
    form.value.cancelServiceTimeStart = form.value.cancelServiceTime[0]
    form.value.cancelServiceTimeEnd = form.value.cancelServiceTime[1]
  } else {
    form.value.cancelServiceTimeStart = undefined
    form.value.cancelServiceTimeEnd = undefined
  }
  if (props.activeIndex == '1') {
    form.value = { ...form.value, deathFlag: '1', pageNum: 1, pageSize: 20, type: 1 } // 客户列表
  }
  if (props.activeIndex == '2') {
    form.value = { ...form.value, pageNum: 1, pageSize: 20, type: 3 } // 全部客户列表
  }
  if (props.activeIndex == '3') {
    form.value = { ...form.value, deathFlag: '1', pageNum: 1, pageSize: 20, type: 2 } // 智宇客户列表
  }
  if (props.activeIndex == '4') {
    form.value = {
      ...form.value,
      deathFlag: '1',
      isMarkerCustomer: 1,
      pageNum: 1,
      pageSize: 20,
      type: 4
    } // 平台客户列表
  }
  emits('reload-list', form.value)
}

const reset = () => {
  if (props.activeIndex == '1') {
    form.value = { deathFlag: '1', pageNum: 1, pageSize: 20, type: 1 } // 客户列表
  }
  if (props.activeIndex == '2') {
    form.value = { pageNum: 1, pageSize: 20, type: 3 } // 全部客户列表
  }
  if (props.activeIndex == '3') {
    form.value = { deathFlag: '1', pageNum: 1, pageSize: 20, type: 2 } // 智宇客户列表
  }
  if (props.activeIndex == '4') {
    form.value = {
      deathFlag: '1',
      isMarkerCustomer: 1,
      pageNum: 1,
      pageSize: 20,
      type: 4
    } // 平台客户列表
  }
  // visibleFlag.value = false
  emits('reload-list', form.value)
}

const resetValue = () => {
  if (props.activeIndex == '1') {
    form.value = { deathFlag: '1', pageNum: 1, pageSize: 20, type: 1 } // 客户列表
  }
  if (props.activeIndex == '2') {
    form.value = { pageNum: 1, pageSize: 20, type: 3 } // 全部客户列表
  }
  if (props.activeIndex == '3') {
    form.value = { deathFlag: '1', pageNum: 1, pageSize: 20, type: 2 } // 智宇客户列表
  }
  if (props.activeIndex == '4') {
    form.value = {
      deathFlag: '1',
      isMarkerCustomer: 1,
      pageNum: 1,
      pageSize: 20,
      type: 4
    } // 平台客户列表
  }
  // visibleFlag.value = false
}

const closeFlag = () => {
  visibleFlag.value = false
  emits('change-accurate')
}

const filterOwnerAddress = async (type) => {
  const deptId = wsCache.get(appStore.getUserInfo).user.deptId
  const { data } = await getDept(deptId)
  const address: any[] = []
  const keys = ['province', 'city', 'county', 'street', 'community']
  keys.forEach((key) => {
    if (data[key]) {
      address.push(data[key])
    }
  })
  if (type === 'domicile') {
    form.value.domicileList = address
  } else if (type === 'current') {
    form.value.currentList = address
  }
}

defineExpose({
  show,
  resetValue
})
</script>
<style scoped lang="less">
.filter-box {
  height: 500px;
  // overflow: hidden;
  overflow: scroll;
  transition: height 0.5s ease-in-out;
}
.show-filter {
  height: 0;
}
:deep(.el-form-item--default) {
  margin-bottom: 16px;
}
:deep(.el-divider--horizontal) {
  margin: 16px 0;
}

:deep(.el-input__wrapper) {
  min-width: auto !important;
}

.filter-foot {
  background-color: #fff;
  width: 100%;
  position: fixed;
  bottom: 0;
  padding: 15px 0;
}

:deep(.el-radio-group) {
  flex-wrap: nowrap;
}
:deep(.el-divider--horizontal) {
  margin-top: 0;
}
</style>
