<template>
  <el-page-header @back="goBack" class="common-page-header">
    <template #content>
      <strong class="r-font-16">活动详情：{{ detail.title }}（{{ statusName }}）</strong>
    </template>
  </el-page-header>
  <div>
    <el-date-picker
      v-model="params.timeRange"
      type="daterange"
      range-separator="~"
      start-placeholder="起始日期"
      end-placeholder="结束日期"
      value-format="YYYY-MM-DD"
      format="YYYY-MM-DD"
      :editable="false"
      class="activity-time-picker"
      @change="handleTimeChange"
      :clearable="false"
    />
    <div class="r-font-14 r-m-b-12">活动参与老人: 共{{ repeatInfo.currentCount }}人，其中{{ params.beginTime }} 至 {{ params.endTime }}，参加过其他活动的老人，共{{ repeatInfo.otherCount }}人</div>
    <div class="r-font-14 flex r-m-b-12">
      <span>活动重复率为: {{ repeatInfo.repeatRatio }}</span>
      <span class="color999 flex r-m-l-10"><Icon icon="ep:warning" color="#999" :size="14" class="r-m-r-2" />活动重复率=在选定时间段内活动参与次数不为0的人数(当前活动不计入)/当前活动总人数</span>
    </div>
  </div>
  <el-table :data="list">
    <el-table-column label="序号" type="index" width="60" align="center"></el-table-column>
    <el-table-column label="操作" width="80" align="center">
      <template #default="{ row }">
        <el-button type="primary" link @click="handleWatch(row)">查看</el-button>
      </template>
    </el-table-column>
    <el-table-column show-overflow-tooltip label="姓名" prop="name" width="100"></el-table-column>
    <el-table-column show-overflow-tooltip label="性别" prop="sex" width="100" sortable="custom">
      <template #default="{ row }">{{ row.sex === '1' ? '男' : row.sex === '2' ? '女' : '' }}</template>
    </el-table-column>
    <el-table-column show-overflow-tooltip label="年龄" prop="age" width="100"></el-table-column>
    <el-table-column show-overflow-tooltip label="联系电话" prop="mobilephone"></el-table-column>
    <el-table-column show-overflow-tooltip label="证件号码" prop="idcard"></el-table-column>
    <el-table-column show-overflow-tooltip label="户籍地址" prop="domicileAllAddress"></el-table-column>
    <el-table-column show-overflow-tooltip label="现居地址" prop="currentAllAddress"></el-table-column>
  </el-table>
  <el-pagination
    class="r-m-t-20"
    v-model:current-page="listParams.pageNum"
    v-model:page-size="listParams.pageSize"
    :page-sizes="[10, 20, 50, 100, 200, 500]"
    layout="total, sizes, prev, pager, next, jumper"
    :total="total"
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
  />

  <RepeatActive ref="repeatActiveRef" />
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { repeatDetail, activityDetail, activityStatPage } from '@/api/assistance/activity'
import { computed, onMounted, ref, reactive } from 'vue'
import { useTagsViewStore } from '@/store/modules/tagsView'
import { formatDateString } from '@/utils'
import RepeatActive from './components/RepeatActive.vue'

onMounted(() => {
  listParams.excludeId = route.query.id as string
  initParams()
  loadDetail()
  loadData()
  loadList()
})

const params = reactive({
  beginTime: '',
  endTime: '',
  id: '',
  timeRange: [] as string[] // 前端自定义字段
})
const initParams = () => {
  params.id = route.query.id as string
  const date = new Date()
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const quarter = {
    '1,2,3': `${year}-01-01`,
    '4,5,6': `${year}-04-01`,
    '7,8,9': `${year}-07-01`,
    '10,11,12': `${year}-10-01`
  }
  let time = ''
  for (const key in quarter) {
    if (key.includes(month.toString())) {
      time = quarter[key]
      break
    }
  }
  params.timeRange = [formatDateString(time, 'YYYY-MM-DD'), formatDateString(Date.now(), 'YYYY-MM-DD')]
}
const repeatInfo = reactive({
  currentCount: 0,
  otherCount: 0,
  repeatRatio: ''
})
const loadData = async () => {
  params.beginTime = params.timeRange[0]
  params.endTime = params.timeRange[1]
  const { data } = await repeatDetail(params)
  Object.assign(repeatInfo, data)
}

const detail = reactive({
  title: '',
  customerInfoVOList: [] as any[],
  taskStatus: '' // 0-草稿，1-未开始，2-进行中，3-已关闭，4-已完成
})
const statusName = computed(() => {
  switch (detail.taskStatus) {
    case '0':
      return '草稿'
    case '1':
      return '未开始'
    case '2':
      return '进行中'
    case '3':
      return '已关闭'
    case '4':
      return '已完成'
    default:
      return ''
  }
})
const loadDetail = async () => {
  const { data } = await activityDetail(route.query.id as string)
  Object.assign(detail, data)
}

const listParams = reactive({
  excludeId: '',
  beginTime: '',
  endTime: '',
  beginActivityCnt: 1,
  pageNum: 1,
  pageSize: 20
})
const loading = ref(false)
const list = ref<any[]>([])
const total = ref(0)
const loadList = async () => {
  if (loading.value) return
  try {
    loading.value = true
    listParams.beginTime = params.timeRange[0]
    listParams.endTime = params.timeRange[1]
    const { data } = await activityStatPage(listParams)
    list.value = data.list
    total.value = data.total
  } finally {
    loading.value = false
  }
}
const handleSizeChange = (size: number) => {
  listParams.pageNum = 1
  listParams.pageSize = size
  loadList()
}
const handleCurrentChange = (current: number) => {
  listParams.pageNum = current
  loadList()
}

const handleTimeChange = () => {
  loadData()
  loadList()
}

const repeatActiveRef = ref()
const handleWatch = (row: any) => {
  const data = {
    timeRange: params.timeRange,
    customerId: row.id,
    beginTime: params.beginTime,
    endTime: params.endTime,
    name: row.name
  }
  repeatActiveRef.value.open(data)
}

const router = useRouter()
const route = useRoute()
const tagsViewStore = useTagsViewStore()
const visitedViews = computed(() => tagsViewStore.getVisitedViews)
const goBack = () => {
  const obj = visitedViews.value.find((item) => item.fullPath === route.fullPath)
  if (obj) {
    tagsViewStore.delView(obj)
  }
  router.replace(`/assistance/activity/detail?id=${route.query.id}`)
}
</script>

<style lang="less" scoped>
:deep(.activity-time-picker) {
  margin: 20px 0 12px 0;
  svg {
    display: none;
  }
  .el-range__icon {
    width: 56px;
    &::after {
      content: '活动时间';
      white-space: nowrap;
      font-style: normal;
      color: #999693;
    }
  }
}
</style>
