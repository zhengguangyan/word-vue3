<template>
  <div>
    <el-card shadow="never" class="card">
      <template #header>
        <div class="card-header">
          <span class="title">客户拜访统计</span>
        </div>
      </template>
      <div class="r-m-t-20">
        <el-space wrap :size="12">
          <el-date-picker
            v-model="params.visitTimeRange"
            type="daterange"
            range-separator="~"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            value-format="YYYY-MM-DD"
            :clearable="false"
            :editable="false"
            class="create-time-picker"
            style="width: 240px"
          />
          <div class="flex">
            <el-input v-model="params.beginVisitCnt" placeholder="拜访次数" style="width: 80px" />
            <span class="r-m-lr-4">-</span>
            <el-input v-model="params.endVisitCnt" placeholder="拜访次数" style="width: 80px" />
          </div>
          <template v-if="!showMore">
            <el-button type="primary" @click="loadData(true)">查询</el-button>
            <el-button plain @click="resetQueryForm(params, { pageNum: 1, pageSize: params.pageSize }, loadData, true)">重置</el-button>
          </template>
          <span class="more-btn" @click="showMore = !showMore">
            <Icon icon="ep:filter" :color="primaryColor" />
            <span class="span">高级搜索</span>
          </span>
        </el-space>

        <el-collapse-transition>
          <div class="more-search-wrapper" v-show="showMore">
            <section class="more-search">
              <div class="search-grid-one r-m-b-16">
                <div class="search-item" label="居住地地址">
                  <Cascader :check="true" placeholder="请选择所在地区" width="100%" v-model="params.currentList" />
                </div>
                <div class="search-item empty" label="">
                  <span class="tip-text" @click="filterOwnerAddress('current')">筛选用户本职组织区域</span>
                </div>
                <div class="search-item" label="户籍地址">
                  <Cascader width="100%" :check="true" placeholder="请选择所在地区" v-model="params.domicileList" />
                </div>
                <div class="search-item empty" label="">
                  <span class="tip-text" @click="filterOwnerAddress('domicile')">筛选用户本职组织区域</span>
                </div>
              </div>
              <div class="search-grid">
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
                <div class="search-item" label="政府补助标准">
                  <DictSelect v-model="params.subsidyStandard" :distList="filterDict('subsidy_standard')" placeholder="政府补助标准(多选)" :clearable="true" multiple style="width: 100%" />
                </div>
                <div class="search-item" label="是否民政同步">
                  <el-radio-group v-model="params.isMinZhen">
                    <el-radio label="是" value="1"></el-radio>
                    <el-radio label="否" value="0"></el-radio>
                  </el-radio-group>
                </div>
                <div class="search-item" label="拜访方式">
                  <DictSelect v-model="params.visitMode" :distList="filterDict('visit_mode')" placeholder="拜访方式" :clearable="true" style="width: 100%" />
                </div>
                <div class="search-item" label="是否人户一致">
                  <el-radio-group v-model="params.entryFamilyFlag">
                    <el-radio label="是" value="1"></el-radio>
                    <el-radio label="否" value="0"></el-radio>
                  </el-radio-group>
                </div>
                <div class="search-item" label="服务对象来源">
                  <DictSelect v-model="params.serviceObjSource" :distList="filterDict('service_obj_source')" placeholder="服务对象来源(多选)" :clearable="true" multiple style="width: 100%" />
                </div>
              </div>
            </section>
            <div class="r-m-t-20">
              <el-button type="primary" @click="loadData(true)">查询</el-button>
              <el-button plain @click="resetQueryForm(params, { pageNum: 1, pageSize: params.pageSize }, loadData, true)">重置</el-button>
            </div>
          </div>
        </el-collapse-transition>
      </div>
      <div class="r-m-t-16 r-m-b-20">
        <span class="count-btn" :class="{ active: params.beginVisitCnt === '' && params.endVisitCnt === '' }" @click="handleCountQuery('')">
          老人共计/总拜访次数({{ countTotal.customerCnt }}人/{{ countTotal.totalVisitCnt }}次)
        </span>
        <span class="count-btn" :class="{ active: params.beginVisitCnt === '0' && params.endVisitCnt === '0' }" @click="handleCountQuery('0')"> 未拜访({{ countTotal.unVisitCnt }}人) </span>
        <span class="count-btn" :class="{ active: params.beginVisitCnt === '1' && params.endVisitCnt === '1' }" @click="handleCountQuery('1')"> 已拜访1次({{ countTotal.visitOnceCnt }}人) </span>
        <span class="count-btn" :class="{ active: params.beginVisitCnt === '2' && params.endVisitCnt === '' }" @click="handleCountQuery('2')"> 已拜访2次及以上({{ countTotal.visitMoreCnt }}人) </span>
      </div>
      <div class="r-m-b-12">
        <el-button type="primary" @click="handleExport" :disabled="!leafAreaFlag && getAuth('visiting:stat:export')">导出</el-button>
      </div>
      <el-table
        :data="tableData"
        height="calc(100vh - 400px)"
        v-loading="loading"
        @sort-change="handleSortChange"
        @selection-change="handleSelectionChange"
        header-row-class-name="table-header"
        class-name="table-without-border"
        border
      >
        <el-table-column type="selection" width="45" align="center" fixed="left" />
        <el-table-column label="" type="index" width="50" align="center" fixed="left" />
        <el-table-column label="操作" width="80" fixed="left">
          <template #default="{ row }">
            <el-button type="primary" link @click="handleDetail(row)">查看</el-button>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip label="姓名" width="100" prop="name" />
        <el-table-column show-overflow-tooltip label="性别" width="80" prop="sex" sortable="custom">
          <template #default="{ row }">{{ row.sex === '1' ? '男' : row.sex === '2' ? '女' : '' }}</template>
        </el-table-column>
        <el-table-column show-overflow-tooltip label="年龄" width="80" prop="age" sortable="custom" />
        <el-table-column show-overflow-tooltip label="拜访次数" width="110" prop="visitCount" sortable="custom" />
        <el-table-column show-overflow-tooltip label="最后一次拜访时间" width="166" prop="lastVisitTime" sortable="custom">
          <template #default="{ row }">{{ row.lastVisitTime ? row.lastVisitTime.slice(0, 16) : '' }}</template>
        </el-table-column>
        <el-table-column show-overflow-tooltip label="证件号码" width="200" prop="idCard" />
        <el-table-column show-overflow-tooltip label="联系电话" width="140" prop="mobilePhone" />
        <el-table-column show-overflow-tooltip label="户籍地址" min-width="200" prop="domicileAllAddress" />
        <el-table-column show-overflow-tooltip label="现居地址" min-width="200" prop="currentAllAddress" />
        <el-table-column show-overflow-tooltip label="更新时间" width="166" prop="updateTime" sortable="custom">
          <template #default="{ row }">{{ row.updateTime ? row.updateTime.slice(0, 16) : '' }}</template>
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
    <el-dialog v-model="exportVisible" title="导出客户拜访统计" append-to-body width="500px" :close-on-click-modal="false" draggable @close="exportVisible = false" class="common-export-dialog">
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
import { ref, reactive, onMounted, computed } from 'vue'
import { resetQueryForm, formatDateString } from '@/utils'
import { useCache } from '@/hooks/web/useCache'
import { getAuth } from '@/utils/export'
import DictSelect from '@/components/DictSelect/index.vue'
import Cascader from '@/components/Cascader/index.vue'
import { useRouter } from 'vue-router'
import { intRegexp, int0Regexp } from '@/utils/validate'
import { ElMessage } from 'element-plus'
import { useAppStore } from '@/store/modules/app'
import { getDept } from '@/api/sys/Department'
import { visitingStatPage, visitingStatExport, visitingStatTotal } from '@/api/assistance/visiting'
import download from '@/utils/download'
import { filterDict } from '@/hooks/web/useDict'

const { wsCache } = useCache()
const appStore = useAppStore()
const router = useRouter()

const leafAreaFlag = ref(wsCache.get('leafAreaFlag'))
const primaryColor = computed(() => appStore.getTheme.elColorPrimary)

const params = reactive({
  ageBegin: '',
  ageEnd: '',
  asc: undefined as number | undefined, // 排序的方向
  beginTime: '', // 拜访时间-开始
  visitTimeRange: [] as string[], // 拜访时间
  beginVisitCnt: '', // 拜访次数-起始
  chronicDisease: [], // 慢性病
  currentCity: '',
  currentCommunity: '',
  currentCounty: '',
  currentList: [] as string[],
  currentProvince: '',
  currentStreet: '',
  domicileCity: '',
  domicileCommunity: '',
  domicileCounty: '',
  domicileList: [] as string[],
  domicileProvince: '',
  domicileStreet: '',
  elderClassifyOld: [], // 老人分类
  endTime: '', // 拜访时间-结束
  endVisitCnt: '', // 拜访次数-终止
  entryFamilyFlag: '', // 是否人户一致
  exportWay: '1', // 导出方式（1-勾选，2-筛选，3-全部）
  idList: [] as string[], // 勾选id列表，导出专用
  isMinZhen: null as null | boolean, // 是否民政同步
  orderByColumn: '',
  pageNum: 1,
  pageSize: 20,
  reasonable: false,
  saturationLevel: '', // 是否纳入饱和度计算
  serviceObjSource: [], // 服务对象来源
  sortMode: '',
  subsidyStandard: [], // 政府补助标准
  visitMode: ''
})

const showMore = ref(false)

onMounted(() => {
  initDate()
  loadData()
})

const loading = ref(false)
const tableData = ref<any[]>([])
const total = ref(0)

const initDate = () => {
  const date = new Date()
  const year = date.getFullYear()
  params.visitTimeRange = [formatDateString(`${year}-01-01`, 'YYYY-MM-DD'), formatDateString(Date.now(), 'YYYY-MM-DD')]
}

const loadData = async (query?: true) => {
  if (loading.value) return
  if (!handleCheck()) return
  try {
    loading.value = true
    if (query) {
      params.pageNum = 1
    }
    const { data } = await visitingStatPage(params)
    tableData.value = data.list
    total.value = data.total
    loadTotal()
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
  if (params.beginVisitCnt && !int0Regexp.test(params.beginVisitCnt)) {
    ElMessage.error('请输入正确的拜访次数')
    return false
  }
  if (params.endVisitCnt && !int0Regexp.test(params.endVisitCnt)) {
    ElMessage.error('请输入正确的拜访次数')
    return false
  }
  if (params.beginVisitCnt && params.endVisitCnt && Number(params.beginVisitCnt) > Number(params.endVisitCnt)) {
    ElMessage.error('最小拜访次数不得大于最大拜访次数')
    return false
  }
  if (params.visitTimeRange && params.visitTimeRange.length) {
    params.beginTime = params.visitTimeRange[0]
    params.endTime = params.visitTimeRange[1]
  } else {
    params.beginTime = ''
    params.endTime = ''
  }
  if (params.currentList && params.currentList.length) {
    const keys = ['currentProvince', 'currentCity', 'currentCounty', 'currentStreet', 'currentCommunity']
    keys.forEach((key) => {
      params[key] = ''
    })
    params.currentList.forEach((item, index) => {
      params[keys[index]] = item
    })
  } else {
    params.currentProvince = ''
    params.currentCity = ''
    params.currentCounty = ''
    params.currentStreet = ''
    params.currentCommunity = ''
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

const countTotal = reactive({
  customerCnt: 0,
  totalVisitCnt: 0,
  unVisitCnt: 0,
  visitMoreCnt: 0,
  visitOnceCnt: 0
})
const loadTotal = async () => {
  const { data } = await visitingStatTotal(params)
  Object.assign(countTotal, data)
}

// 点击次数进行查询
const handleCountQuery = (count: '' | '0' | '1' | '2') => {
  if (loading.value) return
  if (count === '2') {
    params.beginVisitCnt = '2'
    params.endVisitCnt = ''
  } else {
    params.beginVisitCnt = count
    params.endVisitCnt = count
  }
  loadData(true)
}

const handleDetail = (row: any) => {
  router.push(`/customer/detail?id=${row.id}`)
}

const exportVisible = ref(false)
const exporting = ref(false)
const handleExport = async () => {
  if (exporting.value) return
  if (!exportVisible.value) {
    exportVisible.value = true
    return
  }
  try {
    exportVisible.value = false
    exporting.value = true
    const { data } = await visitingStatExport(params)
    ElMessage.success('导出成功')
    download.excel(data, '客户拜访统计.xlsx')
  } finally {
    exporting.value = false
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
  if (type === 'domicile') {
    params.domicileList = address
  } else if (type === 'current') {
    params.currentList = address
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
.count-btn {
  cursor: pointer;
  color: #666462;
  transition: color 0.2s;
  margin-right: 16px;
  font-size: 14px;
  &:hover {
    color: var(--el-color-primary);
  }
  &.active {
    color: var(--el-color-primary);
    font-weight: bold;
  }
}
.more-btn {
  display: flex;
  align-items: center;
  font-size: 14px;
  color: var(--el-color-primary);
  cursor: pointer;
  margin-left: 20px;
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
  grid-template-columns: repeat(4, calc((100% - 48px) / 4));
  gap: 16px 16px;
}
.search-grid-one {
  display: grid;
  grid-template-columns: repeat(2, calc(50% - 8px));
  gap: 16px 16px;
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
  &.empty::before {
    display: none;
  }
  &::before {
    width: 84px;
    flex-shrink: 0;
    text-align: right;
    line-height: 1.2;
    content: attr(label);
    font-size: 14px;
    margin-right: 10px;
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
