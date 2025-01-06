<template>
  <div>
    <el-card shadow="never" class="card">
      <template #header>
        <div class="card-header">
          <span class="title">拜访管理</span>
        </div>
      </template>
      <div class="query-form visiting-query-form">
        <el-space wrap :size="12">
          <el-button type="primary" @click="handleAdd" :disabled="!leafAreaFlag || getAuth('visiting:add')">添加</el-button>
          <el-button plain @click="handleRemove" :loading="deleteLoading" :disabled="!leafAreaFlag || getAuth('visiting:remove')">删除</el-button>
          <el-button plain @click="openExport('list')" :loading="exporting" :disabled="getAuth('visiting:export')">导出</el-button>
          <el-button plain @click="openExport('img')" :loading="exporting2" :disabled="getAuth('visiting:exportImg')">导出截图</el-button>
          <el-input v-model="params.keyword" placeholder="搜索创建人/拜访客户/机构(公司)" style="width: 300px" @change="loadData(true)" clearable>
            <template #suffix><Icon icon="ep:search" :color="primaryColor" /></template>
          </el-input>
          <el-select v-model="params.dataSet" placeholder="请选择" clearable style="width: 120px">
            <el-option label="全部" value="全部" />
            <el-option label="一个月" value="一个月" />
            <el-option label="两个月" value="两个月" />
            <el-option label="三个月" value="三个月" />
            <el-option label="半年" value="半年" />
            <el-option label="一年" value="一年" />
            <el-option label="两年" value="两年" />
            <el-option label="三年" value="三年" />
            <el-option label="三年以上" value="三年以上" />
          </el-select>
          <template v-if="!showMore">
            <el-button type="primary" @click="loadData(true)">查询</el-button>
            <el-button plain @click="resetQueryForm(params, { pageNum: 1, pageSize: params.pageSize }, loadData, true)">重置</el-button>
          </template>
          <span class="more-btn" @click="showMore = !showMore">
            <Icon icon="ep:filter" :color="primaryColor" />
            <span class="span">高级搜索</span>
          </span>
        </el-space>
      </div>

      <el-collapse-transition>
        <div class="more-search-wrapper" v-show="showMore">
          <section class="more-search">
            <div class="search-grid">
              <div class="search-item" label="拜访时间">
                <el-date-picker
                  v-model="params.visitTimeRange"
                  type="daterange"
                  range-separator="~"
                  start-placeholder="起始时间"
                  end-placeholder="结束时间"
                  value-format="YYYY-MM-DD"
                  clearable
                  :editable="false"
                  class="create-time-picker"
                />
              </div>
              <div class="search-item" label="拜访方式">
                <DictSelect v-model="params.visitMode" :distList="filterDict('visit_mode')" placeholder="选择拜访方式" :clearable="true" style="width: 100%" />
              </div>
              <div class="search-item" label="编辑状态">
                <el-select v-model="params.editStatus" placeholder="选择编辑状态" clearable>
                  <el-option label="草稿" value="0" />
                  <el-option label="已完成" value="1" />
                </el-select>
              </div>
              <div class="search-item" label="创建时间">
                <el-date-picker
                  v-model="params.createTimeRange"
                  type="daterange"
                  range-separator="~"
                  start-placeholder="起始时间"
                  end-placeholder="结束时间"
                  value-format="YYYY-MM-DD"
                  clearable
                  :editable="false"
                  class="create-time-picker"
                />
              </div>
              <div class="search-item" label="来源">
                <el-select v-model="params.platform" placeholder="选择来源" clearable>
                  <el-option label="助老员APP" value="2" />
                  <el-option label="平台" value="3" />
                </el-select>
              </div>
              <div class="search-item" label="是否有图">
                <el-radio-group v-model="params.hasPhotos">
                  <el-radio label="是" :value="true"></el-radio>
                  <el-radio label="否" :value="false"></el-radio>
                </el-radio-group>
              </div>
              <div class="search-item" label="年龄">
                <el-input v-model="params.ageBegin" placeholder="最小年龄" class="age-input" />
                <span class="r-m-lr-4">-</span>
                <el-input v-model="params.ageEnd" placeholder="最大年龄" class="age-input" />
              </div>
              <div class="search-item" label="老人分类">
                <DictSelect v-model="params.elderClassifyOld" :distList="filterDict('elder_classify')" placeholder="老人分类(多选)" :clearable="true" multiple style="width: 100%" />
              </div>
              <div class="search-item" label="慢性病">
                <DictSelect v-model="params.chronicDisease" :distList="filterDict('chronic_disease')" placeholder="慢性病(多选)" :clearable="true" multiple style="width: 100%" />
              </div>
              <div class="search-item" label="是否纳入饱和度计算">
                <el-radio-group v-model="params.saturationLevel">
                  <el-radio label="是" value="1"></el-radio>
                  <el-radio label="否" value="0"></el-radio>
                </el-radio-group>
              </div>
              <div class="search-item" label="是否人户一致">
                <el-radio-group v-model="params.entryFamilyFlag">
                  <el-radio label="是" value="1"></el-radio>
                  <el-radio label="否" value="0"></el-radio>
                </el-radio-group>
              </div>
            </div>
            <div class="search-grid r-m-tb-10" v-if="xiamenFlag">
              <div class="search-item grid-span-2" label="拜访标签">
                <el-input v-model="params.visitLabel" placeholder="可搜索拜访标签/拜访内容/跟踪内容/反馈结果" clearable></el-input>
              </div>
            </div>
            <div class="search-grid r-m-tb-10">
              <div class="search-item grid-span-4" label="服务分类">
                <el-select
                  v-model="params.serviceClassify"
                  placeholder="一级服务分类"
                  clearable
                  @change=";(params.secondServiceClassify = ''), (params.thirdServiceClassify = '')"
                  :style="{ width: selectWidth }"
                >
                  <el-option v-for="item in filterDict('service_classify')" :key="item.value" :value="item.value" :label="item.label" />
                </el-select>
                <el-select
                  v-model="params.secondServiceClassify"
                  placeholder="二级服务分类"
                  clearable
                  v-if="params.serviceClassify || params.serviceClassify?.length"
                  @change="params.thirdServiceClassify = ''"
                  :style="{ width: selectWidth, marginLeft: '10px' }"
                >
                  <el-option v-for="item in filterDict('second_service_classify')" :key="item.value" :value="item.value" :label="item.label" />
                </el-select>
                <DictSelect
                  :width="{ width: 'calc(100% - 80px)' }"
                  v-model="params.thirdServiceClassify"
                  :distList="third_service_classify"
                  placeholder="三级服务分类"
                  v-if="params.secondServiceClassify || params.secondServiceClassify?.length"
                  :clearable="true"
                  :style="{ width: selectWidth, marginLeft: '10px' }"
                />
              </div>
            </div>
            <div class="search-grid r-m-b-10">
              <div class="search-item grid-span-2" label="所属区域">
                <Cascader :check="true" placeholder="请选择所在地区" v-model="params.belongList" width="100%" />
              </div>
              <div class="search-item empty" label="">
                <span class="tip-text" @click="filterOwnerAddress('current')">筛选用户本职组织区域</span>
              </div>
            </div>
            <div class="search-grid r-m-b-10">
              <div class="search-item grid-span-2" label="户籍地址">
                <Cascader :check="true" placeholder="请选择所在地区" v-model="params.domicileList" width="100%" />
              </div>
              <div class="search-item empty" label="">
                <el-input v-model="params.domicileVillage" placeholder="户籍地址所在小区" />
              </div>
              <div class="search-item empty" label="">
                <span class="tip-text" @click="filterOwnerAddress('domicile')">筛选用户本职组织区域</span>
              </div>
            </div>
            <div class="search-grid">
              <div class="search-item" label="归属项目">
                <DictSelect v-model="params.belongProjectType" :distList="filterDict('project_type')" placeholder="归属项目" :clearable="true" style="width: 100%" />
              </div>
              <div class="search-item" label="归属项目名称">
                <el-input v-model="params.belongProjectName" placeholder="搜索归属项目名称" />
              </div>
              <div class="search-item" label="政府补助标准">
                <DictSelect v-model="params.subsidyStandard" :distList="filterDict('subsidy_standard')" placeholder="政府补助标准(多选)" :clearable="true" multiple style="width: 100%" />
              </div>
              <div class="search-item" label="是否民政同步">
                <el-radio-group v-model="params.isMinZhen">
                  <el-radio label="是" :value="true"></el-radio>
                  <el-radio label="否" :value="false"></el-radio>
                </el-radio-group>
              </div>
            </div>
          </section>
          <div class="r-m-t-20">
            <el-button type="primary" @click="loadData(true)">查询</el-button>
            <el-button plain @click="resetQueryForm(params, { pageNum: 1, pageSize: params.pageSize }, loadData, true)">重置</el-button>
          </div>
        </div>
      </el-collapse-transition>
      <el-table
        :data="tableData"
        ref="tableRef"
        header-row-class-name="table-header"
        class-name="table-without-border list-page-table"
        v-loading="loading"
        @sort-change="handleSortChange"
        @selection-change="handleSelectionChange"
        height="calc(100vh - 310px)"
      >
        <el-table-column type="selection" width="45" align="center" fixed="left" />
        <el-table-column label="" type="index" width="50" align="center" fixed="left" />
        <el-table-column label="操作" width="220" fixed="left">
          <template #default="{ row }">
            <el-button type="primary" link :disabled="getAuth('visiting:customer')" @click="handleCustomerDetail(row)">客户详情</el-button>
            <el-button type="primary" link :disabled="getAuth('visiting:detail')" @click="handleVisitingDetail(row)">拜访详情</el-button>
            <el-button type="primary" link :disabled="row.editStatus === 1 || !leafAreaFlag || getAuth('visiting:edit')" @click="handleEdit(row)">编辑</el-button>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip label="来源" width="100" prop="platform" sortable="custom">
          <template #default="{ row }">
            <span v-if="row.platform === '2'">助老员APP</span>
            <span v-if="row.platform === '3'">平台</span>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip label="拜访时间" width="150" prop="visitTime" sortable="custom">
          <template #default="{ row }">{{ row.visitTime ? row.visitTime.slice(0, 16) : '' }}</template>
        </el-table-column>
        <el-table-column show-overflow-tooltip label="拜访时长(分钟)" width="160" prop="visitMinute" sortable="custom" v-if="xiamenFlag" />
        <el-table-column show-overflow-tooltip label="拜访标签" width="200" prop="visitLabel" sortable="custom" v-if="xiamenFlag"></el-table-column>
        <el-table-column show-overflow-tooltip label="拜访客户" width="120" prop="visitCustomerName" sortable="custom" />
        <el-table-column show-overflow-tooltip label="拜访内容" width="240" prop="visitContent" sortable="custom" />
        <el-table-column show-overflow-tooltip label="机构(公司)" width="200" prop="companyName" sortable="custom" />
        <el-table-column show-overflow-tooltip label="拜访地址" width="200" prop="visitDetailAddress" sortable="custom"></el-table-column>
        <el-table-column show-overflow-tooltip label="联系电话" width="220" prop="visitCustomerMobilePhone" sortable="custom" />
        <el-table-column show-overflow-tooltip label="证件号码" width="180" prop="visitCustomerIdCard" sortable="custom" />
        <el-table-column show-overflow-tooltip label="创建人" width="140" prop="creatorName" sortable="custom" />
        <el-table-column show-overflow-tooltip label="是否有图" width="100">
          <template #default="{ row }">{{ Boolean(row.finishPhoto || row.visitPhotos.length) ? '是' : '否' }}</template>
        </el-table-column>
        <el-table-column show-overflow-tooltip label="拜访方式" width="140" prop="visitMode" sortable="custom">
          <template #default="{ row }">{{ renderDict(row.visitMode, 'visit_mode') }}</template>
        </el-table-column>
        <el-table-column show-overflow-tooltip label="所属区域" width="180" prop="belongRegion" sortable="custom">
          <template #default="{ row }">
            <div class="line-2" :title="row.belongRegion">{{ row.belongRegion }}</div>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip label="创建时间" width="150" prop="createTime" sortable="custom">
          <template #default="{ row }">{{ row.createTime ? row.createTime.slice(0, 16) : '' }}</template>
        </el-table-column>
      </el-table>
      <el-pagination
        class="r-m-t-20"
        v-model:current-page="params.pageNum"
        v-model:page-size="params.pageSize"
        :page-sizes="[10, 20, 50, 100, 200, 500]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </el-card>
    <el-dialog
      v-model="exportVisible"
      :title="exportType === 'img' ? '导出拜访信息截图' : '导出拜访信息'"
      append-to-body
      width="500px"
      :close-on-click-modal="false"
      draggable
      @close="exportVisible = false"
      class="common-export-dialog"
    >
      <div class="flex">
        <span class="r-m-r-10 text-nowrap">导出数据</span>
        <el-select v-model="params.exportWay" placeholder="请选择导出方式">
          <el-option label="导出所选数据" value="1"></el-option>
          <el-option label="导出筛选结果" value="2"></el-option>
          <el-option label="导出全部数据" value="3"></el-option>
        </el-select>
      </div>
      <div class="error-color r-p-l-66 r-p-t-10 r-p-b-20">一次性导出不能超过6.5W条数据</div>
      <template #footer>
        <el-button plain @click="exportVisible = false">取消</el-button>
        <el-button type="primary" @click="handleExport">导出</el-button>
      </template>
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
import { ref, reactive, onMounted, computed, onUnmounted } from 'vue'
import { resetQueryForm } from '@/utils'
import { useCache } from '@/hooks/web/useCache'
import { getAuth } from '@/utils/export'
import DictSelect from '/@/components/DictSelect/index.vue'
import Cascader from '/@/components/Cascader/index.vue'
import { useRouter } from 'vue-router'
import { intRegexp } from '@/utils/validate'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useAppStore } from '@/store/modules/app'
import { getDept } from '@/api/sys/Department'
import { visitingPage, visitingRemove, visitingExport, visitingExportImg } from '@/api/assistance/visiting'
import download from '@/utils/download'
import { tagPage } from '@/api/assistance/tag'
import { filterDict, renderDict } from '@/hooks/web/useDict'
// @ts-ignore
defineOptions({
  name: 'Visiting'
})
const { wsCache } = useCache()
const xiamenFlag = ref(wsCache.get('xiamenFlag'))
const appStore = useAppStore()
const router = useRouter()
// const isXiaMen = ref(false)
const tableRef = ref()

const leafAreaFlag = ref(wsCache.get('leafAreaFlag'))
const primaryColor = computed(() => appStore.getTheme.elColorPrimary)

const params = reactive({
  ageBegin: '',
  ageEnd: '',
  asc: undefined as number | undefined, // 排序的方向
  beginTime: '', // 拜访时间-开始
  visitTimeRange: [], // 拜访时间
  belongCity: '', // 所属城市
  belongCommunity: '', // 所属社区
  belongCounty: '', // 所属县/区
  belongList: [] as any[], // 所属地址
  belongProjectName: '', // 归属项目名称
  belongProjectType: '', // 归属项目类型
  belongProvince: '', // 所属省份
  belongStreet: '', // 所属街道
  chronicDisease: [], // 慢性病
  createTimeBegin: '', // 创建时间-开始
  createTimeEnd: '', // 创建时间-结束
  createTimeRange: [], // 创建时间
  dataSet: '', // 数据显示
  domicileCity: '', // 户籍市
  domicileCommunity: '', // 户籍社区
  domicileCounty: '', // 户籍县/区
  domicileList: [] as any[], // 户籍地址list
  domicileProvince: '', // 户籍省份
  domicileStreet: '', // 户籍街道
  domicileVillage: '', // 户籍小区
  editStatus: '', // 编辑状态 0=操作 1=已完成
  elderClassifyOld: [], // 老人分类
  endTime: '', // 拜访时间-结束
  entryFamilyFlag: '', // 是否人户一致 0||1
  exportWay: '1', // 导出方式（1-勾选，2-筛选，3-全部）
  idList: [] as string[],
  hasPhotos: null as null | boolean, // 是否有图
  isMinZhen: null as null | boolean, // 是否民政同步
  keyword: '',
  orderByColumn: '', // 排序列
  pageNum: 1,
  pageSize: 20,
  platform: '', // 来源 平台=3，助老员app=2
  saturationLevel: '', // 是否纳入饱和度计算 0 || 1
  secondServiceClassify: '', // 服务分类（二级）
  serviceClassify: '', // 服务分类（一级）
  sortMode: '', // 排序，desc或asc
  subsidyStandard: [], // 政府补助标准
  thirdServiceClassify: '', // 服务分类（三级）
  visitMode: '', // 拜访方式
  visitLabel: ''
})

const showMore = ref(false)

let queryFormDom: HTMLElement
const selectWidth = ref('') // 用于设置服务分类搜索条件，选择器的宽度
onMounted(() => {
  queryFormDom = document.querySelector('.visiting-query-form') as HTMLElement
  selectWidth.value = (queryFormDom.offsetWidth - 70) / 4 - 94 + 'px'
  // const areaInfo = wsCache.get('areaInfo')
  // isXiaMen.value = Boolean(areaInfo && areaInfo.city === '厦门市')
  loadData()
  loadLabelList()
  window.addEventListener('resize', resize)
})
onUnmounted(() => {
  window.removeEventListener('resize', resize)
})
const resize = () => {
  selectWidth.value = (queryFormDom.offsetWidth - 70) / 4 - 94 + 'px'
}

const third_service_classify = computed<any>(() => {
  if (!params.secondServiceClassify) return
  const filterName = 'second_service_classify_' + params.secondServiceClassify
  return filterDict(filterName)
})

const labelList = ref<any[]>([])
const loadLabelList = async () => {
  const { data } = await tagPage({ pageNum: 1, pageSize: 1000 })
  labelList.value = data.list
}

const loading = ref(false)
const tableData = ref<any[]>([])
const total = ref(0)

const loadData = async (query?: true) => {
  if (loading.value) return
  if (!handleCheck()) return
  try {
    loading.value = true
    if (query) {
      params.pageNum = 1
    }
    const { data } = await visitingPage(params)
    tableData.value = data.list.map((item) => {
      item.visitLabel = item.visitLabel && item.visitLabel.length ? item.visitLabel.join(',') : ''
      return item
    })
    total.value = data.total
  } finally {
    loading.value = false
  }
}
const handleCheck = () => {
  if (params.ageBegin && !intRegexp.test(params.ageBegin)) {
    ElMessage.error('请输入正确的年龄')
    return false
  }
  if (params.ageEnd && !intRegexp.test(params.ageEnd)) {
    ElMessage.error('请输入正确的年龄')
    return false
  }
  if (params.ageBegin && params.ageEnd && Number(params.ageBegin) > Number(params.ageEnd)) {
    ElMessage.error('最小年龄不得大于最大年龄')
    return false
  }
  if (params.visitTimeRange && params.visitTimeRange.length) {
    params.beginTime = params.visitTimeRange[0]
    params.endTime = params.visitTimeRange[1]
  } else {
    params.beginTime = ''
    params.endTime = ''
  }
  if (params.createTimeRange && params.createTimeRange.length) {
    params.createTimeBegin = params.createTimeRange[0]
    params.createTimeEnd = params.createTimeRange[1]
  } else {
    params.createTimeBegin = ''
    params.createTimeEnd = ''
  }
  if (params.belongList && params.belongList.length) {
    const keys = ['belongProvince', 'belongCity', 'belongCounty', 'belongStreet', 'belongCommunity']
    keys.forEach((key) => {
      params[key] = ''
    })
    params.belongList.forEach((item, index) => {
      params[keys[index]] = item
    })
  } else {
    params.belongProvince = ''
    params.belongCity = ''
    params.belongCounty = ''
    params.belongCommunity = ''
    params.belongStreet = ''
  }
  if (params.domicileList && params.domicileList.length) {
    const keys = ['domicileProvince', 'domicileCity', 'domicileCounty', 'domicileStreet', 'domicileCommunity']
    keys.forEach((key) => {
      params[key] = ''
    })
    params.domicileList.forEach((item, index) => {
      params[keys[index]] = item
    })
  } else {
    params.domicileProvince = ''
    params.domicileCity = ''
    params.domicileCounty = ''
    params.domicileCommunity = ''
    params.domicileStreet = ''
  }
  return true
}
const handleAdd = () => {
  router.push('/assistance/visiting/add')
}
const handleEdit = (row: any) => {
  router.push(`/assistance/visiting/edit?id=${row.id}`)
}
const handleVisitingDetail = (row: any) => {
  router.push(`/assistance/visiting/detail?id=${row.id}`)
}
const handleCustomerDetail = (row: any) => {
  router.push(`/customer/detail?id=${row.customerId}`)
}
const deleteLoading = ref(false)
const handleRemove = () => {
  if (deleteLoading.value) return
  if (!params.idList.length) return ElMessage.error('请选择数据')
  ElMessageBox.confirm('此操作将永久删除该数据, 是否继续？', '操作提示', { type: 'warning' })
    .then(async () => {
      deleteLoading.value = true
      await visitingRemove(params.idList.join(','))
      ElMessage.success('已删除')
      if (tableData.value.length === params.idList.length && params.pageNum > 1) {
        params.pageNum--
      }
      loadData()
    })
    .finally(() => {
      deleteLoading.value = false
    })
}

const exportVisible = ref(false)
const exportType = ref<'img' | 'list'>('list')
const openExport = (type: 'img' | 'list') => {
  if ((type === 'list' && exporting.value) || (type === 'img' && exporting2.value)) return
  exportType.value = type
  exportVisible.value = true
}

const exporting = ref(false)
const exporting2 = ref(false)
const handleExport = async () => {
  if (params.exportWay === '1' && !params.idList.length) {
    ElMessage.error('请勾选要导出的数据')
    return
  }
  try {
    exportVisible.value = false
    exportType.value === 'list' ? (exporting.value = true) : (exporting2.value = true)
    if (exportType.value === 'list') {
      const data = await visitingExport(params)
      download.excel(data.data, '拜访信息列表.xlsx')
    } else {
      const data = await visitingExportImg(params)
      download.zip(data.data, '拜访信息截图.zip')
    }
    ElMessage.success('导出成功')
  } finally {
    exportType.value === 'list' ? (exporting.value = false) : (exporting2.value = false)
  }
}

const handleSortChange = (column: any) => {
  if (column.order) {
    params.orderByColumn = column.prop
    params.asc = column.order == 'ascending' ? 0 : 1
  } else {
    params.orderByColumn = ''
    params.asc = undefined
  }
  loadData(true)
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
  if (type === 'current') {
    params.belongList = address
  } else if (type === 'domicile') {
    params.domicileList = address
  }
}

const handleSelectionChange = (val: any) => {
  params.idList = val.map((item) => item.id)
}

const handleSizeChange = (size: number) => {
  params.pageNum = 1
  params.pageSize = size
  loadData()
}
const handleCurrentChange = (current: number) => {
  params.pageNum = current
  loadData()
}
</script>

<style lang="less" scoped>
.more-btn {
  display: flex;
  align-items: center;
  font-size: 14px;
  color: var(--el-color-primary);
  cursor: pointer;
  margin-left: 12px;
  white-space: nowrap;
  .span {
    text-decoration: underline;
    margin-left: 2px;
  }
}
.adapter(@size, @content) {
  @media only screen and (max-width: @size) {
    @content();
  }
}
.more-search-wrapper {
  background-color: #faf9f7;
  border: 1px solid #f5f3f0;
  border-radius: 4px;
  padding: 20px;
}

:deep(.age-input) {
  .el-input__wrapper {
    min-width: 50px !important;
  }
}
.search-grid {
  display: grid;
  grid-template-columns: repeat(4, calc((100% - 30px) / 4));
  gap: 10px 10px;
}
.grid-span-2 {
  grid-column-start: span 2;
}
.grid-span-4 {
  grid-column-start: span 4;
}
.top-search-item {
  display: flex;
  align-items: center;
  max-width: 362px;
  &::before {
    flex-shrink: 0;
    content: attr(label);
    font-size: 14px;
    margin-right: 6px;
  }
}
.search-item {
  display: flex;
  align-items: center;
  &::before {
    width: 84px;
    flex-shrink: 0;
    text-align: right;
    line-height: 1.2;
    content: attr(label);
    font-size: 14px;
    margin-right: 10px;
  }
  &.empty::before {
    display: none;
  }
  &.span2 {
    grid-column: span 2;
  }
}
:deep(.create-time-picker) {
  padding: 0 5px;
  // .el-icon.el-input__icon {
  //   display: none;
  // }
  .el-range-separator {
    padding: 0 5px;
    flex: 0;
  }
  .el-range-input {
    flex: 1;
  }
}
.tip-text {
  font-size: 14px;
  color: var(--el-color-primary);
  text-decoration: underline;
  flex-shrink: 0;
  cursor: pointer;
}
</style>
