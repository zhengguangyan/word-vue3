<template>
  <el-dialog v-model="visible" append-to-body width="980px" :close-on-click-modal="false" draggable @close="handleClose" class="choose-customers-dialog">
    <template #header>
      <div class="flex">
        <h2>邀约特定时间内活动参与次数为0的老人</h2>
        <span class="error-color">(注：列表不显示已过世老人；当前活动不计入)</span>
      </div>
    </template>
    <div class="flex r-m-b-10">
      <span class="label">活动开始时间:</span>
      <div>
        <el-date-picker
          v-model="params.timeRange"
          type="daterange"
          range-separator="~"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          value-format="YYYY-MM-DD"
          clearable
          :editable="false"
          class="create-time-picker"
        />
      </div>
    </div>
    <div class="flex r-m-b-10">
      <span class="label">居住地地址:</span>
      <Cascader placeholder="搜索活动地址" v-model="params.currentList" check width="600px" />
      <ins class="primary-color pointer r-m-l-10" @click="filterOwnerAddress('current')">筛选用户本职组织区域</ins>
    </div>
    <div class="flex r-m-b-10">
      <span class="label huji-label">户籍地址:</span>
      <Cascader placeholder="搜索户籍地址" v-model="params.domicileList" check width="600px" />
      <ins class="primary-color pointer r-m-l-10" @click="filterOwnerAddress('domicile')">筛选用户本职组织区域</ins>
    </div>
    <div class="flex r-m-b-10">
      <el-input v-model="params.keyword" placeholder="搜索姓名/证件号码/联系电话/客户ID/备注" @change="handleInput" class="r-m-r-10">
        <template #suffix><Icon icon="ep:search" color="#999693" /></template>
      </el-input>
      <el-button type="primary" @click="loadData(true)">搜索</el-button>
      <el-button plain @click="handleClear">清除</el-button>
    </div>
    <el-table :data="tableData" v-loading="loading" max-height="440px" @sort-change="handleSortChange" @select="handleSelect" @select-all="handleSelect" ref="tableRef">
      <el-table-column width="45" align="center" type="selection"></el-table-column>
      <el-table-column label="序号" type="index" width="60" align="center"></el-table-column>
      <el-table-column label="操作" width="80" align="center">
        <template #default="{ row }">
          <el-button type="primary" link @click="handleWatch(row)">查看</el-button>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip label="姓名" prop="name" sortable="custom"></el-table-column>
      <el-table-column show-overflow-tooltip label="性别" prop="sex" sortable="custom">
        <template #default="{ row }">{{ row.sex === '1' ? '男' : row.sex === '2' ? '女' : '' }}</template>
      </el-table-column>
      <el-table-column show-overflow-tooltip label="联系电话" prop="mobilephone"></el-table-column>
      <el-table-column show-overflow-tooltip label="证件号码" prop="idcard"></el-table-column>
      <el-table-column show-overflow-tooltip label="备注" prop="remark"></el-table-column>
    </el-table>
    <div class="rela r-m-t-20 r-m-b-40">
      <span class="choose-num"
        >已选择<span class="primary-color r-m-lr-4">{{ chooseNum }}</span
        >个</span
      >
      <el-pagination
        v-model:current-page="params.pageNum"
        v-model:page-size="params.pageSize"
        :page-sizes="[10, 20, 50, 100, 200, 500]"
        layout="total, prev, pager, next, jumper"
        :total="total"
        :pager-count="5"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    <template #footer>
      <el-button plain @click="handleClose">取消</el-button>
      <el-button type="primary" @click="handleConfirm">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, nextTick } from 'vue'
import { getOldManList } from '@/api/assistance/activity'
import Cascader from '/@/components/Cascader/index.vue'
import { ElTable } from 'element-plus'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/store/modules/app'
import { useCache } from '@/hooks/web/useCache'
import { getDept } from '@/api/sys/Department'

const visible = ref(false)
const open = (ids: string[]) => {
  ids.forEach((id) => {
    if (!selectedObj[id]) {
      selectedObj[id] = true
    }
  })
  visible.value = true
  nextTick(() => {
    loadData()
  })
}
defineExpose({ open })

const params = reactive({
  keyword: '',
  beginActivityCnt: 0,
  endActivityCnt: 0,
  beginTime: '',
  endTime: '',
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
  pageNum: 1,
  pageSize: 10,
  timeRange: [],
  deathFlag: '1', // 是否健在
  orderByColumn: undefined as undefined | string,
  asc: undefined as undefined | 0 | 1
})

const loading = ref(false)
const tableData = ref<any[]>([])
const total = ref(0)
const loadData = async (query?: true) => {
  if (loading.value) return
  try {
    loading.value = true
    if (query) {
      params.pageNum = 1
    }
    handleParams()
    const { data } = await getOldManList(params)
    tableData.value = data.list.map((item) => {
      item.mobilephone = item.mobilephone ?? item.mobilePhone
      item.idcard = item.idcard ?? item.idCard
      return item
    })
    total.value = data.total
    nextTick(() => {
      tableData.value.forEach((item) => {
        if (selectedObj[item.id]) {
          selectedObj[item.id] = item
          tableRef.value?.toggleRowSelection(item, true)
        }
      })
    })
  } finally {
    window.clearTimeout(timeId)
    loading.value = false
  }
}

const handleParams = () => {
  if (params.timeRange && params.timeRange.length) {
    params.beginTime = params.timeRange[0]
    params.endTime = params.timeRange[1]
  } else {
    params.beginTime = ''
    params.endTime = ''
  }
  if (params.currentList && params.currentList.length) {
    params.currentProvince = params.currentList[0]
    params.currentCity = params.currentList[1]
    params.currentCounty = params.currentList[2]
    params.currentStreet = params.currentList[3]
    params.currentCommunity = params.currentList[4]
  } else {
    params.currentProvince = ''
    params.currentCity = ''
    params.currentCounty = ''
    params.currentStreet = ''
    params.currentCommunity = ''
  }
  if (params.domicileList && params.domicileList.length) {
    params.domicileProvince = params.domicileList[0]
    params.domicileCity = params.domicileList[1]
    params.domicileCounty = params.domicileList[2]
    params.domicileStreet = params.domicileList[3]
    params.domicileCommunity = params.domicileList[4]
  } else {
    params.domicileProvince = ''
    params.domicileCity = ''
    params.domicileCounty = ''
    params.domicileStreet = ''
    params.domicileCommunity = ''
  }
}

const { wsCache } = useCache()
const appStore = useAppStore()
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

const tableRef = ref<InstanceType<typeof ElTable>>()
const emit = defineEmits(['updateCustomers'])
// 多选确认
const handleConfirm = () => {
  emit(
    'updateCustomers',
    Object.values(selectedObj).filter((item) => Object.prototype.toString.call(item) === '[object Object]')
  )
  handleClose()
}

const router = useRouter()
const handleWatch = (row: any) => {
  handleClose()
  router.push(`/customer/detail?id=${row.id}`)
}

let timeId = 0
const handleInput = () => {
  window.clearTimeout(timeId)
  timeId = window.setTimeout(() => {
    loadData(true)
  }, 600)
}

const handleClear = () => {
  params.keyword = ''
  params.beginTime = ''
  params.endTime = ''
  params.currentCity = ''
  params.currentCommunity = ''
  params.currentCounty = ''
  params.currentList = []
  params.currentProvince = ''
  params.currentStreet = ''
  params.domicileCity = ''
  params.domicileCommunity = ''
  params.domicileCounty = ''
  params.domicileList = []
  params.domicileProvince = ''
  params.domicileStreet = ''
  params.timeRange = []
  tableData.value.splice(0)
  total.value = 0
  for (const key in selectedObj) {
    delete selectedObj[key]
  }
  loadData(true)
}

const handleSortChange = (column: any) => {
  if (column.order) {
    params.orderByColumn = column.prop
    params.asc = column.order == 'ascending' ? 0 : 1
  } else {
    params.orderByColumn = undefined
    params.asc = undefined
  }
  loadData(true)
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

const handleClose = () => {
  visible.value = false
  handleClear()
}

const selectedObj: any = {}
const handleSelect = (selection: any[]) => {
  const ids = selection.map((item) => item.id)
  tableData.value.forEach((item) => {
    if (ids.includes(item.id)) {
      selectedObj[item.id] = item
    } else {
      delete selectedObj[item.id]
    }
  })
  chooseNum.value = Object.keys(selectedObj).length
}

const chooseNum = ref(0)
</script>

<style lang="less">
.choose-customers-dialog {
  .el-dialog__header {
    .error-color {
      font-size: 12px;
      font-weight: normal;
      margin-left: 10px;
    }
  }
  .choose-num {
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
  }
  .label {
    white-space: nowrap;
    margin-right: 8px;
    width: 90px;
    text-align: right;
  }
  .huji-label {
    text-indent: 1em;
  }
  .keyword-label {
    text-indent: 2em;
  }
  .create-time-picker {
    width: 300px;
  }
}
</style>
