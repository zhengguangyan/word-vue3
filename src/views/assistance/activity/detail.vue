<template>
  <el-page-header @back="goBack" class="common-page-header">
    <template #content>
      <strong class="r-font-16"
        >活动详情：{{ detail.title }}（<span :style="{ color: taskStatusColor[detail.taskStatus] }">{{ statusName }}</span
        >）</strong
      >
    </template>
  </el-page-header>
  <el-scrollbar height="calc(100vh - 205px)" class="pr-scrollbar">
    <div class="detail-top-gray-info">
      <span class="r-m-r-10">来源: {{ platform }}</span>
      <span class="r-m-r-10">活动编号: {{ detail.id }}</span>
      <span class="r-m-r-10">创建: {{ detail.creatorName }} {{ detail.createTime }}</span>
      <span>最新更新: {{ detail.updaterName }} {{ detail.updateTime }}</span>
    </div>
    <h2 class="label-title r-m-t-20 r-m-b-16">基础信息</h2>
    <div class="item r-m-b-16">
      <span class="label">标题:</span>
      <span>{{ detail.title }}</span>
    </div>
    <div class="grid-box">
      <div class="item">
        <span class="label">发布人:</span>
        <span>{{ detail.publishName }}</span>
      </div>
      <div class="item">
        <span class="label">参与组织:</span>
        <span>{{ detail.activityCommunity }}</span>
      </div>
      <div class="item">
        <span class="label">活动时间:</span>
        <span>{{ activityTime }}</span>
      </div>
    </div>
    <div class="grid-box">
      <div class="item">
        <span class="label">分类:</span>
        <span>{{ renderDict(detail.assort, 'assort') }}</span>
      </div>
      <div class="item">
        <span class="label">活动分类:</span>
        <span>{{ renderDict(detail.activitySort, 'activity_sort') }}</span>
      </div>
      <div class="item">
        <span class="label">类型:</span>
        <span>{{ renderDict(detail.type, 'comactivty_type') }}</span>
      </div>
    </div>
    <div class="item r-m-b-16">
      <span class="label">活动地点:</span>
      <span>{{ detail.activityAddress }}</span>
    </div>
    <div class="item r-m-b-16" v-if="['3', '4'].includes(detail.taskStatus) && detail.remark">
      <span class="label">活动备注:</span>
      <div class="content-text pre-wrap">{{ detail.remark }}</div>
    </div>
    <div class="item r-m-b-16">
      <span class="label">活动内容:</span>
      <div class="content-text" v-html="detail.content"></div>
    </div>
    <div class="item r-m-b-16">
      <span class="label">活动照片:</span>
      <div class="img-ul">
        <el-image v-for="item in detail.activityPhotoList" :key="item.id" :src="item.url" :preview-src-list="srcList" fit="fill"></el-image>
      </div>
    </div>
    <div class="item" v-if="detail.activityFileList.length">
      <span class="label">文件内容:</span>
      <div class="file-box">
        <a class="file-item" v-for="item in detail.activityFileList" :key="item.id" :href="item.url" target="_blank">
          <Icon icon="svg-icon:icon_word" color="#406cff" :size="24" v-if="['doc', 'docx'].includes(item.type)" />
          <Icon icon="svg-icon:icon_pdf" color="#eb1d25" :size="24" v-if="item.type === 'pdf'" />
          <Icon icon="svg-icon:icon_zip" color="#dc4ec1" :size="24" v-if="item.type === 'zip'" />
          <Icon icon="svg-icon:icon_rar" color="#f9bd0f" :size="24" v-if="item.type === 'rar'" />
          <Icon icon="svg-icon:icon_excel" color="#2fa556" :size="24" v-if="['xls', 'xlsx'].includes(item.type)" />
          <Icon icon="svg-icon:icon_img" color="#5d7091" :size="24" v-if="['png', 'jpg', 'jpeg', 'bmp', 'webp'].includes(item.type)" />
          <h4 class="file-title line-1">{{ item.originalName }}</h4>
        </a>
      </div>
    </div>
    <h2 class="label-title r-m-t-40">老人名单</h2>
    <div class="flex r-m-t-16 r-m-b-12">
      <el-button type="primary" :loading="exporting" @click="handleExport" :disabled="!detail.customerInfoVOList">导出</el-button>
      <el-button plain @click="handleToRepeatDetail" :disabled="!detail.customerInfoVOList">计算活动重复率</el-button>
      <el-input v-model="keyword" placeholder="模糊搜索客户姓名/证件号/联系电话/备注" style="width: 420px; margin-left: 24px">
        <template #suffix><Icon icon="ep:search" :color="primaryColor" /></template>
      </el-input>
    </div>
    <el-table :data="customerList" @selection-change="handleSelectionChange">
      <el-table-column width="45" align="center" type="selection"></el-table-column>
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
  </el-scrollbar>
  <el-dialog v-model="exportVisible" title="导出老人名单" append-to-body width="500px" :close-on-click-modal="false" draggable @close="exportVisible = false" class="common-export-dialog">
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
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { activityDetail, activityOldManExport } from '@/api/assistance/activity'
import { computed, onMounted, reactive, ref } from 'vue'
import { ElLoading, ElMessage } from 'element-plus'
import download from '@/utils/download'
import { useAppStore } from '@/store/modules/app'
import { renderDict } from '@/hooks/web/useDict'

const appStore = useAppStore()
const primaryColor = computed(() => appStore.getTheme.elColorPrimary)
const taskStatusColor = ref({
  0: '#E96848',
  1: '#FF9E4D',
  2: '#5CD7A8',
  3: '#999693',
  4: '#999693'
})
const router = useRouter()
const route = useRoute()

onMounted(() => {
  const loading = ElLoading.service({
    target: 'section.content-layout',
    text: '加载中，请稍候...'
  })
  Promise.all([loadDetail()]).then(() => {
    loading.close()
  })
})

const detail = reactive({
  activityAddress: '',
  activityCommunity: '',
  activityFileList: [] as any[],
  activityFiles: '',
  activityPhotoList: [] as FileItem[],
  activityPhotos: '',
  activitySort: '',
  assort: '',
  city: '',
  comNameAndOrg: '',
  community: '',
  content: '',
  county: '',
  createTime: '',
  creatorName: '',
  customerInfoVOList: [] as any[],
  detailAddress: '',
  endTime: '',
  id: '',
  idNameComString: '',
  operatorIds: '',
  personalStatus: '',
  platform: '',
  province: '',
  publishName: '',
  regionCode: '',
  remark: '',
  startTime: '',
  street: '',
  taskStatus: '',
  title: '',
  type: '',
  updateTime: '',
  updaterName: '',
  verificationCode: '',
  village: ''
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
const activityTime = computed(() => {
  if (!(detail.startTime && detail.endTime)) return ''
  const startDate = detail.startTime.slice(0, 10)
  const startTime = detail.startTime.slice(10)
  const endDate = detail.endTime.slice(0, 10)
  const endTime = detail.endTime.slice(10)
  if (startDate === endDate) return `${startDate} ${startTime}~${endTime}`
  return `${detail.startTime} ~ ${detail.endTime}`
})

const keyword = ref('')
const customerList = computed(() => {
  if (!detail.customerInfoVOList) return []
  return detail.customerInfoVOList.filter((item) => {
    item.remark = item.remark || ''
    item.idcard = item.idcard || ''
    item.mobilephone = item.mobilephone || ''
    return item.name.includes(keyword.value) || item.idcard.includes(keyword.value) || item.mobilephone.includes(keyword.value) || item.remark.includes(keyword.value)
  })
})

const platform = computed(() => {
  return detail.platform === '2' ? '助老员APP' : detail.platform === '3' ? '平台' : ''
})
const srcList = computed(() => detail.activityPhotoList.map((item: any) => item.url))

const loadDetail = async () => {
  const { data } = await activityDetail(route.query.id as string)
  if (!data.activityFileList) {
    data.activityFileList = []
  } else {
    // 为文件添加后缀名
    data.activityFileList.forEach((item: any) => {
      const list = item.path.split('.')
      const type = list[list.length - 1]
      item.type = type.toLowerCase()
    })
  }
  Object.assign(detail, data)
}

const handleWatch = (row: any) => {
  router.push(`/customer/detail?id=${row.id}`)
}

const params = reactive({
  customerList: [] as any[],
  exportWay: '1', // 导出方式（1-勾选，2-筛选，3-全部）
  id: '',
  search: ''
})
const exportVisible = ref(false)
const exporting = ref(false)
const handleExport = async () => {
  if (exporting.value) return
  if (!exportVisible.value) {
    exportVisible.value = true
    return
  }
  if (params.exportWay === '1' && !multipleSelection.value.length) {
    ElMessage.error('请勾选要导出的数据')
    return
  }
  try {
    exportVisible.value = false
    exporting.value = true
    params.id = detail.id
    params.search = keyword.value
    params.customerList = multipleSelection.value.map((item) => item.id)
    const { data } = await activityOldManExport(params)
    ElMessage.success('导出成功')
    download.excel(data, `${detail.title}_老人名单.xlsx`)
  } finally {
    exporting.value = false
  }
}

const handleToRepeatDetail = () => {
  router.push(`/assistance/activity/repeatDetail?id=${detail.id}`)
}

const multipleSelection = ref<any[]>([])
const handleSelectionChange = (val: any[]) => {
  multipleSelection.value = val
}

const goBack = () => {
  window.history.back()
}
</script>

<style lang="less" scoped>
.grid-box {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0 30px;
  margin-bottom: 16px;
}
.item {
  font-size: 14px;
  display: flex;
  .label {
    flex-shrink: 0;
    // color: #666;
    margin-right: 10px;
  }
}
.section {
  .item {
    margin-bottom: 16px;
  }
}
.img-ul {
  flex: 1;
  display: grid;
  grid-template-columns: repeat(auto-fill, 64px);
  gap: 8px;
}
:deep(.el-image) {
  height: 64px;
  .el-image__inner {
    border-radius: 4px;
  }
}
.content-text {
  flex: 1;
}
.file-box {
  flex: 1;
  display: grid;
  grid-template-columns: repeat(auto-fill, 240px);
  gap: 8px;
}
.file-item {
  display: flex;
  align-items: center;
  border: 1px solid #f5f3f0;
  padding: 12px;
  border-radius: 4px;
  transition: color 0.2s, border-color 0.2s;
  border-color: var(--el-color-primary);
  color: var(--el-color-primary);
}
</style>
