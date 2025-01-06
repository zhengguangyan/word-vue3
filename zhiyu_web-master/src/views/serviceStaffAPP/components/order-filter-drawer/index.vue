<template>
  <div
    class="filter-box"
    :class="{
      'show-filter': !visibleFlag,
      'all-filter': activeIndex == '2' || activeIndex == '3'
    }"
  >
    <div class="customer-filter">
      <div class="filter-row">
        <span>服务时间</span>
        <el-date-picker v-model="form.serveTime" type="daterange" range-separator="-" start-placeholder="服务开始时间" end-placeholder="服务结束时间" value-format="YYYY-MM-DD" clearable />
      </div>
      <div class="filter-row">
        <span>创建时间</span>
        <el-date-picker v-model="form.createTime" type="daterange" range-separator="-" start-placeholder="创建开始时间" end-placeholder="服务时间结束" value-format="YYYY-MM-DD" clearable />
      </div>
      <div class="filter-row">
        <span>共同服务人员</span>
        <el-input v-model="form.commonStaffName" placeholder="共同服务人员" />
      </div>
      <div class="filter-row">
        <span>订单状态</span>
        <DictSelect width="100%" v-model="form.status" :distList="filterDict('staff_status')" placeholder="订单状态" :clearable="true" />
      </div>
      <div class="filter-row">
        <span>服务类别</span>
        <DictSelect width="100%" v-model="form.serveCategoryIds" :distList="typeList" placeholder="服务类别" :clearable="true" @change="changeCategoryId" />
      </div>
      <div class="filter-row">
        <span>服务项目</span>
        <DictSelect width="100%" v-model="form.serveIds" :distList="serveList" placeholder="服务项目" :clearable="true" :disabled="!serveList.length" @change="changeServeId" />
      </div>
      <div class="filter-row">
        <span>服务子项</span>
        <DictSelect width="100%" v-model="form.serveOptionIds" :distList="serveOptionList" placeholder="服务子项" :clearable="true" :disabled="!serveOptionList.length" />
      </div>
      <div class="filter-row" style="width: 50%">
        <span class="row-head">服务地址所在区域</span>
        <Cascader :check="true" placeholder="请选择服务地址所在区域" v-model="form.contactAddressList" style="width: 100%" />
      </div>
      <div class="filter-row" style="width: 50%">
        <span class="row-head">服务地址所在小区</span>
        <el-input v-model="form.village" placeholder="服务地址所在小区" />
      </div>
      <div class="filter-row" style="width: 50%">
        <span class="row-head">户籍地址所在区域</span>
        <Cascader :check="true" placeholder="请选择户籍地址所在区域" v-model="form.domicileList" style="width: 100%" />
      </div>
      <div class="filter-row" style="width: 50%">
        <span class="row-head">户籍地址所在小区</span>
        <el-input v-model="form.domicileVillage" placeholder="户籍地址所在小区" />
      </div>
      <div class="filter-row">
        <span>订单回访</span>
        <el-radio-group v-model="form.hasReturn">
          <el-radio v-for="(item, index) in filterDict('yes_no')" :key="index" :value="item.value">{{ item.label }}</el-radio>
        </el-radio-group>
        <!-- <DictSelect width="100%" v-model="form.hasReturn" :distList="filterDict('yes_no')" placeholder="订单回访" :clearable="true" /> -->
      </div>
      <div class="filter-row">
        <span>订单评价</span>
        <el-radio-group v-model="form.hasOrder">
          <el-radio v-for="(item, index) in filterDict('yes_no')" :key="index" :value="item.value">{{ item.label }}</el-radio>
        </el-radio-group>
        <!-- <DictSelect width="100%" v-model="form.hasOrder" :distList="filterDict('yes_no')" placeholder="订单评价" :clearable="true" /> -->
      </div>
      <div class="filter-row">
        <span>语音评价</span>
        <el-radio-group v-model="form.hasVoice">
          <el-radio v-for="(item, index) in filterDict('yes_no')" :key="index" :value="item.value">{{ item.label }}</el-radio>
        </el-radio-group>
        <!-- <DictSelect width="100%" v-model="form.hasVoice" :distList="filterDict('yes_no')" placeholder="语音评价" :clearable="true" /> -->
      </div>
      <div class="filter-row">
        <span>支付方式</span>
        <DictSelect width="100%" v-model="form.payType" :distList="filterDict('staff_pay_type')" placeholder="支付方式" :clearable="true" />
      </div>
      <div class="filter-row">
        <span>订单工时</span>
        <el-input v-model.number="form.hoursSubsidyStart" placeholder="开始工时" />
        -
        <el-input v-model.number="form.hoursSubsidyEnd" placeholder="结束工时" />
      </div>
      <div class="filter-row">
        <span>是否残联服务对象</span>
        <el-radio-group v-model="form.disableObject">
          <el-radio v-for="(item, index) in filterDict('yes_no')" :key="index" :value="item.value">{{ item.label }}</el-radio>
        </el-radio-group>
        <!-- <DictSelect width="100%" v-model="form.disableObject" :distList="filterDict('yes_no')" placeholder="是否残联服务对象" :clearable="true" /> -->
      </div>
      <div class="filter-row">
        <span>残疾等级</span>
        <DictSelect width="100%" v-model="form.disableLevel" :distList="filterDict('disability_level')" placeholder="残疾等级" :clearable="true" />
      </div>
      <div class="filter-row">
        <span>服务人员性质</span>
        <DictSelect width="100%" v-model="form.operatorNature" :distList="filterDict('operatorNature')" placeholder="服务人员性质" :clearable="true" />
      </div>
      <div class="filter-row">
        <span>服务项目内容</span>
        <el-input v-model="form.serveName" placeholder="服务项目内容" />
      </div>
      <div class="filter-row">
        <span>一级服务标签</span>
        <DictSelect width="100%" multiple v-model="form.serviceLabel" :distList="filterDict('service_label')" placeholder="一级服务标签（多选）" :clearable="true" />
      </div>
      <div class="filter-row">
        <span>二级服务标签</span>
        <DictSelect width="100%" multiple v-model="form.secondServiceLabel" :distList="filterDict('second_service_label')" placeholder="二级服务标签（多选）" :clearable="true" />
      </div>

      <div class="filter-row">
        <span>补助标准</span>
        <DictSelect width="100%" v-model="form.subsidyStandard" :distList="filterDict('subsidy_standard')" placeholder="补助标准（多选）" :multiple="true" :tags="1" :clearable="true" />
      </div>
      <div class="filter-row" style="width: 50%">
        <span class="row-head">服务对象来源(一级)</span>
        <DictSelect width="270px" v-model="form.serviceObjSource" :distList="filterDict('service_obj_source')" placeholder="服务对象来源(一级)(多选)" :multiple="true" :tags="1" :clearable="true" />
        <el-checkbox style="margin-left: 10px" label="精确匹配" v-model="form.isServiceObjSource" />
      </div>
      <div class="filter-row">
        <span>订单归属项目(一级)</span>
        <DictSelect width="100%" v-model="form.belongProject" :distList="filterDict('belong_project')" placeholder="订单归属项目(一级)" :clearable="true" @change="belongProjectChange" />
      </div>
      <div class="filter-row">
        <span>"未通过"记录</span>
        <el-radio-group v-model="form.notPassRecord">
          <el-radio v-for="(item, index) in filterDict('yes_no')" :key="index" :value="item.value">{{ item.label }}</el-radio>
        </el-radio-group>
        <!-- <DictSelect width="100%" v-model="form.notPassRecord" :distList="filterDict('yes_no')" placeholder="“未通过”记录评价" :clearable="true" /> -->
      </div>
      <div class="filter-row" style="width: 50%">
        <span>服务对象来源(二级)</span>
        <DictSelect width="270px" v-model="form.secondServiceSource" :distList="secondServiceSourceList" placeholder="服务对象来源(二级)(多选)" :multiple="true" :tags="1" :clearable="true" />
        <el-checkbox style="margin-left: 10px" label="精确匹配" v-model="form.isSecondServiceSource" />
      </div>
      <div class="filter-row">
        <span>订单归属项目(二级)</span>
        <DictSelect
          width="100%"
          v-model="form.secondBelongProject"
          :distList="secondBelongProjectList"
          :placeholder="form.belongProject ? '订单归属项目(二级)' : '请先选择订单归属项目(一级)'"
          :disabled="!form.belongProject"
          :clearable="true"
        />
      </div>
      <div class="filter-row">
        <span>服务商</span>
        <DictSelect width="100%" v-model="form.sellerName" :distList="sellerList" placeholder="服务商" :tags="1" :clearable="true" />
      </div>
      <div class="filter-row">
        <span>是否为市场化平台</span>
        <el-radio-group v-model="form.ifMarket">
          <el-radio v-for="(item, index) in filterDict('yes_no')" :key="index" :value="item.value">{{ item.label }}</el-radio>
        </el-radio-group>
        <!-- <DictSelect width="100%" v-model="form.ifMarket" :distList="filterDict('yes_no')" placeholder="是否为市场化平台" :clearable="true" /> -->
      </div>
      <div class="filter-row">
        <span class="row-head">服务标准</span>
        <DictSelect width="100%" v-model="form.serviceStandards" :distList="filterDict('service_standards')" placeholder="服务标准(多选)" :multiple="true" :tags="1" :clearable="true" />
      </div>
      <div class="filter-row">
        <span>服务地址一致</span>
        <el-radio-group v-model="form.serveAddressEqual">
          <el-radio v-for="(item, index) in filterDict('yes_no')" :key="index" :value="item.value">{{ item.label }}</el-radio>
        </el-radio-group>
        <!-- <DictSelect width="100%" v-model="form.serveAddressEqual" :distList="filterDict('yes_no')" placeholder="服务地址一致" :clearable="true" /> -->
      </div>
      <!-- <div class="filter-row">
        <span>是否有抽成</span>
        <DictSelect
          width="100%"
          v-model="form.customerType"
          :distList="filterDict('yes_no')"
          placeholder="是否有抽成"
          :clearable="true"
        />
      </div> -->
      <div class="filter-row">
        <span>是否为预约订单</span>
        <el-radio-group v-model="form.ifPreOrder">
          <el-radio v-for="(item, index) in filterDict('yes_no')" :key="index" :value="item.value">{{ item.label }}</el-radio>
        </el-radio-group>
        <!-- <DictSelect width="100%" v-model="form.ifPreOrder" :distList="filterDict('yes_no')" placeholder="是否为预约订单" :clearable="true" /> -->
      </div>

      <el-space style="width: 100%" :size="12">
        <el-button type="primary" @click="onSubmit">查询</el-button>
        <el-button @click="reset">重置</el-button>
        <el-button @click="closeFlag">收起</el-button>
      </el-space>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import DictSelect from '/@/components/DictSelect/index.vue'
import Cascader from '/@/components/Cascader/index.vue'
import { getServeTypeList } from '@/api/serviceProvider'
import { onMounted } from 'vue'
import { getServeInfoList, getOptionList } from '@/api/serviceProject'
import { getProviderList } from '@/api/serviceProvider'
import { belongItemlabelList, getBelongItemlabelList } from '@/api/filiale'
import { ElMessage } from 'element-plus'
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

const emits = defineEmits(['reload-list', 'change-accurate', 'reset-list'])

const filterDict = (key: any) => {
  return (props.dict.find((item: any) => item.type == key) as any)?.list
}

const visibleFlag = ref(false)

function show() {
  visibleFlag.value = !visibleFlag.value
}

const form = ref<any>({
  status: undefined,
  sex: null,
  appAcount: null,
  pageNum: 1,
  pageSize: 20
})

function onSubmit() {
  // visibleFlag.value = false
  if (form.value.serveTime) {
    form.value.serveTimeStart = form.value.serveTime[0]
    form.value.serveTimeEnd = form.value.serveTime[1]
  } else {
    form.value.serveTimeStart = undefined
    form.value.serveTimeEnd = undefined
  }
  if (form.value.createTime) {
    form.value.createTimeStart = form.value.createTime[0]
    form.value.createTimeEnd = form.value.createTime[1]
  } else {
    form.value.createTimeStart = undefined
    form.value.createTimeEnd = undefined
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
  form.value = {}
  emits('reset-list')
}

const resetValue = () => {
  form.value = {}
  // visibleFlag.value = false
}

const closeFlag = () => {
  visibleFlag.value = false
  emits('change-accurate')
}

// 服务类别
const typeList = ref<any>([])

const getTypeList = async () => {
  const res = await getServeTypeList()
  typeList.value = res.data.map((item) => {
    return {
      value: item.id,
      label: item.name
    }
  })
}

// 服务项目下拉数据
const serveList = ref<any>([])

const getServeList = async () => {
  if (!form.value.serveCategoryIds) return
  const res = await getServeInfoList({ categoryId: form.value.serveCategoryIds })
  serveList.value = res.data.map((item) => {
    return {
      value: item.id,
      label: item.name
    }
  })
}

// 服务子项下拉数据
const serveOptionList = ref<any>([])

const getServeOptionList = async () => {
  if (!form.value.serveIds) return
  const res = await getOptionList({ serveId: form.value.serveIds })
  serveOptionList.value = res.data.map((item) => {
    return {
      value: item.id,
      label: item.name
    }
  })
}

// 服务商下拉数据
const sellerList = ref<any>([])

const getSellerList = async () => {
  const res = await getProviderList()
  sellerList.value = res.data.map((item) => {
    return {
      value: item.name,
      label: item.name
    }
  })
}

// 订单归属项目(二级)
const secondServiceSourceList = ref<any>([])
const getBelongItemlabelListFun = async () => {
  const { data } = await getBelongItemlabelList({ labelType: 'serviceObject' })
  secondServiceSourceList.value = data.map((item) => {
    return {
      value: item.id,
      label: item.name
    }
  })
}

function belongProjectChange(val) {
  form.value.secondBelongProject = ''
  secondBelongProjectList.value = []
  belongItemlabelListFun(val)
}
// 订单归属项目(二级)
const secondBelongProjectList = ref<any>([])
const belongItemlabelListFun = async (parentKey) => {
  const { data } = await belongItemlabelList({ labelType: 'belong_project', parentKey, deleted: 0 })
  if (!data.length) {
    return ElMessage.error('暂无订单归属项目(二级)数据')
  }
  secondBelongProjectList.value = data.map((item) => {
    return {
      value: item.id,
      label: item.name
    }
  })
}

// const third_service_classify = computed<any>(() => {
//   if (!form.value.secondServiceClass) return
//   let filterName = 'second_service_classify_' + form.value.secondServiceClass
//   return filterDict(filterName)
// })

const changeCategoryId = () => {
  form.value.serveIds = undefined
  form.value.serveOptionIds = undefined
  serveList.value = []
  serveOptionList.value = []
  getServeList()
}

const changeServeId = () => {
  form.value.serveOptionIds = undefined
  serveOptionList.value = []
  getServeOptionList()
}

onMounted(() => {
  getTypeList()
  getSellerList()
  getBelongItemlabelListFun()
})

const setStatus = (data) => {
  form.value.status = data
}

defineExpose({
  show,
  resetValue,
  setStatus
})
</script>
<style scoped lang="less">
.filter-box {
  height: 555px;
  overflow: hidden;
  transition: height 0.5s ease-in-out;
  .filter-row {
    > span {
      width: 125px;
    }
  }
}
.all-filter {
  height: 1150px;
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
