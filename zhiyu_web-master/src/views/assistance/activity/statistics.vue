<template>
  <div>
    <el-card shadow="never" class="card">
      <template #header>
        <div class="card-header">
          <span class="title">客户活动统计</span>
        </div>
      </template>
      <div class="r-m-t-20">
        <el-space wrap :size="12">
          <el-date-picker
            v-model="params.timeRange"
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
            <el-input v-model="params.beginActivityCnt" placeholder="活动次数" style="width: 80px" />
            <span class="r-m-lr-4">-</span>
            <el-input v-model="params.endActivityCnt" placeholder="活动次数" style="width: 80px" />
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
              <div class="search-item r-m-b-10" label="居住地地址">
                <Cascader :check="true" placeholder="请选择所在地区" v-model="params.currentList" />
                <span class="tip-text" @click="filterOwnerAddress('current')">筛选用户本职组织区域</span>
              </div>
              <div class="search-item" label="户籍地址">
                <Cascader :check="true" placeholder="请选择所在地区" v-model="params.domicileList" />
                <span class="tip-text" @click="filterOwnerAddress('domicile')">筛选用户本职组织区域</span>
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
        <span class="count-btn" :class="{ active: params.beginActivityCnt === '' && params.endActivityCnt === '' }" @click="handleCountQuery('')"> 老人共计({{ countTotal.customerCnt }}人) </span>
        <span class="count-btn" :class="{ active: params.beginActivityCnt === '0' && params.endActivityCnt === '0' }" @click="handleCountQuery('0')">
          未参与活动({{ countTotal.unActivityCnt }}人)
        </span>
        <span class="count-btn" :class="{ active: params.beginActivityCnt === '1' && params.endActivityCnt === '1' }" @click="handleCountQuery('1')">
          参与活动1次及以上({{ countTotal.visitMoreCnt }}人)
        </span>
      </div>
      <div class="r-m-b-12">
        <el-button type="primary" @click="handleExport" :disabled="!leafAreaFlag && getAuth('activity:stat:export')">导出</el-button>
      </div>
      <el-table
        :data="tableData"
        v-loading="loading"
        @sort-change="handleSortChange"
        @selection-change="handleSelectionChange"
        header-row-class-name="table-header"
        class-name="table-without-border"
        height="calc(100vh - 400px)"
      >
        <el-table-column type="selection" width="45" align="center" fixed="left" />
        <el-table-column label="" type="index" width="50" align="center" fixed="left" />
        <el-table-column label="操作" width="80" fixed="left">
          <template #default="{ row }">
            <el-button type="primary" link @click="handleDetail(row)">查看</el-button>
          </template>
        </el-table-column>
        <!-- <el-table-column show-overflow-tooltip label="ID" width="140" prop="id"/> -->
        <el-table-column show-overflow-tooltip label="姓名" width="100" prop="name" />
        <el-table-column show-overflow-tooltip label="性别" width="80" prop="sex" sortable="custom">
          <template #default="{ row }">{{ row.sex === '1' ? '男' : row.sex === '2' ? '女' : '' }}</template>
        </el-table-column>
        <el-table-column show-overflow-tooltip label="年龄" width="80" prop="age" sortable="custom" />
        <el-table-column show-overflow-tooltip label="活动参与次数" width="150" prop="activityCount" sortable="custom" />
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
    <el-dialog v-model="exportVisible" title="导出客户活动统计" append-to-body width="500px" :close-on-click-modal="false" draggable @close="exportVisible = false" class="common-export-dialog">
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
import Cascader from '/@/components/Cascader/index.vue'
import { useRouter } from 'vue-router'
import { int0Regexp } from '@/utils/validate'
import { ElMessage } from 'element-plus'
import { useAppStore } from '@/store/modules/app'
import { getDept } from '@/api/sys/Department'
import { activityStatPage, activityStatExport, activityStatTotal } from '@/api/assistance/activity'
import download from '@/utils/download'

const { wsCache } = useCache()
const appStore = useAppStore()
const router = useRouter()

const leafAreaFlag = ref(wsCache.get('leafAreaFlag'))
const primaryColor = computed(() => appStore.getTheme.elColorPrimary)

const params = reactive({
  asc: undefined as number | undefined, // 排序的方向
  beginActivityCnt: '', // 活动次数-起始
  beginTime: '',
  currentCity: '',
  currentCommunity: '',
  currentCounty: '',
  currentList: [] as string[],
  currentProvince: '',
  currentStreet: '',
  deathFlag: '', // 是否健在（0-否，1-是）
  domicileCity: '',
  domicileCommunity: '',
  domicileCounty: '',
  domicileList: [] as string[],
  domicileProvince: '',
  domicileStreet: '',
  endActivityCnt: '', // 活动次数-终止
  endTime: '',
  excludeId: '', // 特邀老人，不计当前活动id
  exportWay: '1', // 导出方式（1-勾选，2-筛选，3-全部）
  idList: [] as string[], // 勾选id列表，导出专用
  keyword: '',
  orderByColumn: '',
  pageNum: 1,
  pageSize: 20,
  timeRange: [] as string[] // 前端自定义字段-活动次数
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
  const month = date.getMonth() + 1
  if (month === 1) {
    params.timeRange = [formatDateString(`${year - 1}-12-01`, 'YYYY-MM-DD'), formatDateString(Date.now(), 'YYYY-MM-DD')]
  } else {
    params.timeRange = [formatDateString(`${year}-${(month - 1).toString().padStart(2, '0')}-01`, 'YYYY-MM-DD'), formatDateString(Date.now(), 'YYYY-MM-DD')]
  }
}

const loadData = async (query?: true) => {
  if (loading.value) return
  if (!handleCheck()) return
  try {
    loading.value = true
    if (query) {
      params.pageNum = 1
    }
    const { data } = await activityStatPage(params)
    tableData.value = data.list
    total.value = data.total
    loadTotal()
  } finally {
    loading.value = false
  }
}
const handleCheck = () => {
  if (params.beginActivityCnt && !int0Regexp.test(params.beginActivityCnt)) {
    ElMessage.error('请输入正确的活动次数')
    return false
  }
  if (params.endActivityCnt && !int0Regexp.test(params.endActivityCnt)) {
    ElMessage.error('请输入正确的活动次数')
    return false
  }
  if (params.beginActivityCnt && params.endActivityCnt && Number(params.beginActivityCnt) > Number(params.endActivityCnt)) {
    ElMessage.error('最小活动次数不得大于最大活动次数')
    return false
  }
  if (params.timeRange && params.timeRange.length) {
    params.beginTime = params.timeRange[0]
    params.endTime = params.timeRange[1]
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
  unActivityCnt: 0,
  visitMoreCnt: 0
})
const loadTotal = async () => {
  const { data } = await activityStatTotal(params)
  Object.assign(countTotal, data)
}

// 点击次数进行查询
const handleCountQuery = (count: '' | '0' | '1') => {
  if (loading.value) return
  if (count === '1') {
    params.beginActivityCnt = '1'
    params.endActivityCnt = ''
  } else {
    params.beginActivityCnt = count
    params.endActivityCnt = count
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
    const { data } = await activityStatExport(params)
    ElMessage.success('导出成功')
    download.excel(data, '客户活动统计.xlsx')
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
  if (type === 'current') {
    params.currentList = address
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
.search-grid {
  display: grid;
  grid-template-columns: repeat(4, calc((100% - 30px) / 4));
  gap: 10px 10px;
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
  margin-left: 10px;
  flex-shrink: 0;
  cursor: pointer;
}
</style>
