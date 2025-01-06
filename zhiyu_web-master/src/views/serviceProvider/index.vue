<template>
  <div>
    <el-card shadow="never" class="card">
      <template #header>
        <div class="card-header">
          <span class="title">服务商列表</span>
        </div>
      </template>

      <div class="query-form">
        <el-space wrap :size="12">
          <el-button type="primary" @click="add()" :disabled="!leafAreaFlag || getAuth('serviceProvider:index:add')">添加</el-button>
          <el-button v-if="leafAreaFlag" :disabled="!leafAreaFlag || getAuth('serviceProvider:index:delete')" @click="batchDelete">删除</el-button>
          <el-button :disabled="!leafAreaFlag || getAuth('serviceProvider:index:statistics')" @click="openAnalysis">统计分析</el-button>
          <el-input v-model="queryForm.keyword" style="width: 250px" placeholder="搜索服务商名称/联系电话" clearable @change="onSubmit">
            <template #suffix>
              <el-icon @click="onSubmit"><search /></el-icon>
            </template>
          </el-input>

          <el-link :icon="Filter" type="primary" @click="extraQueryFlag = !extraQueryFlag">高级筛选</el-link>
        </el-space>
      </div>
      <div class="filter-box" :class="{ 'show-filter': !extraQueryFlag }">
        <div class="customer-filter">
          <div class="filter-row">
            <span class="row-head">类型</span>
            <DictSelect clearable v-model="queryForm.categoryid" :distList="typeList" style="width: 100%" :multiple="true" placeholder="请选择(多选)" />
          </div>
          <div class="filter-row">
            <span class="row-head">是否合作</span>
            <el-select v-model="queryForm.isCooperation" placeholder="是否合作" style="width: 100%" clearable>
              <el-option label="是" value="1" />
              <el-option label="否" value="0" />
            </el-select>
          </div>
          <div class="filter-row">
            <span class="row-head">是否可公益</span>
            <el-select v-model="queryForm.isWelfare" placeholder="是否可公益" style="width: 100%" clearable>
              <el-option label="是" value="1" />
              <el-option label="否" value="0" />
            </el-select>
          </div>
          <div class="filter-row">
            <span class="row-head">创建时间</span>
            <el-date-picker
              v-model="queryForm.createTime"
              type="datetimerange"
              range-separator="-"
              start-placeholder="创建时间开始"
              end-placeholder="创建时间结束"
              value-format="YYYY-MM-DD HH:mm:ss"
              time-format="HH:mm:ss"
              clearable
              style="width: 100%"
              @change="changeTime"
            />
          </div>
          <div class="filter-row" style="width: 50%">
            <span class="row-head">所在地区</span>
            <Cascader width="100%" :check="true" placeholder="请选择所在地区" v-model="queryForm.sellerList" />
          </div>
          <div class="filter-row" style="width: 50%">
            <span class="row-head">服务范围</span>
            <Cascader width="100%" :check="true" placeholder="请选择服务范围" v-model="queryForm.serveAreaCodeList" />
          </div>
          <el-space style="width: 100%" :size="12">
            <el-button type="primary" @click="onSubmit">查询</el-button>
            <el-button @click="reset">重置</el-button>
            <el-button @click="extraQueryFlag = !extraQueryFlag">收起</el-button>
          </el-space>
        </div>
      </div>

      <el-table
        :data="tableData"
        ref="tableRef"
        header-row-class-name="table-header"
        @selection-change="handleSelectionChange"
        @sort-change="handleSortChange"
        v-loading="loading"
        class-name="table-without-border list-page-table"
        height="calc(100vh - 310px)"
      >
        <el-table-column type="selection" width="40" />
        <el-table-column fixed="left" label="操作" width="160" class-name="table-operation">
          <template #default="{ row }">
            <el-button link type="primary" @click="detail(row)" :disabled="getAuth('serviceProvider:index:detail')"> 查看 </el-button>
            <el-button link :disabled="!leafAreaFlag || getAuth('serviceProvider:index:edit')" type="primary" @click="edit(row.id)" v-if="leafAreaFlag"> 编辑 </el-button>
            <el-button v-if="leafAreaFlag" link type="primary" :disabled="!leafAreaFlag || getAuth('serviceProvider:index:delete')" @click="verifyDelete(row.id)"> 删除 </el-button>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="服务商名称" min-width="200" show-overflow-tooltip sortable="custom" />
        <el-table-column show-overflow-tooltip prop="createTime" label="关联服务" min-width="100">
          <template #default="{ row }">
            <el-button link type="primary" @click="serve(row.id)"> 查看 </el-button>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="categoryid" label="服务商类别" min-width="120" sortable="custom">
          <template #default="{ row }">
            {{ typeList.find((item: any) => item.value === row.categoryid)?.label }}
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="seller" label="所属区域" min-width="150">
          <template #default="{ row }">
            {{ row.sellerCounty + (row.sellerStreet ? ',' + row.sellerStreet : '') }}
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="isCooperation" label="是否已合作" min-width="120" sortable="custom">
          <template #default="{ row }">
            {{ renderDict(row.isCooperation, 'yes_no') }}
          </template>
        </el-table-column>
        <el-table-column prop="serveAreaName" label="服务范围" min-width="150" show-overflow-tooltip sortable="custom" />
        <el-table-column show-overflow-tooltip prop="companyPhone" label="电话" min-width="140" sortable="custom">
          <template #default="{ row }">
            {{ maskPhoneNumber(row.companyPhone) }}
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="isWelfare" label="公益" min-width="110" sortable="custom">
          <template #default="{ row }">
            {{ renderDict(row.isWelfare, 'yes_no') }}
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="starEvaluate" label="星级评价" min-width="110" sortable="custom">
          <template #default="{ row }">
            {{ renderDict(row.starEvaluate, 'star_evaluate') }}
          </template>
        </el-table-column>
        <el-table-column prop="address" label="详细地址" min-width="300" show-overflow-tooltip sortable="custom" />
        <el-table-column show-overflow-tooltip prop="status" label="商家状态" min-width="110">
          <template #default="{ row }">
            <span v-if="row.status === '1'" style="color: #5cd7a8">{{ renderDict(row.status, 'seller_status') }}</span>
            <span v-if="row.status === '2'" style="color: #999693">{{ renderDict(row.status, 'seller_status') }}</span>
          </template>
        </el-table-column>
      </el-table>
      <div style="margin-top: 20px">
        <el-pagination
          v-model:current-page="queryForm.pageNum"
          v-model:page-size="queryForm.pageSize"
          :page-sizes="[10, 20, 50, 100, 200, 500]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="getTableList"
          @current-change="getTableList"
        />
      </div>
    </el-card>

    <el-dialog destroy-on-close v-model="visibleFlag" title="统计分析" width="500px" @close="onClose" :close-on-press-escape="false" :close-on-click-modal="false">
      <div style="padding: 0 20px">
        <div id="analysis-chart" style="height: 200px; width: 100%"></div>
      </div>
    </el-dialog>
  </div>
  <ServeList ref="listRef" />
</template>
<script setup lang="ts">
import ServeList from './components/serve-list-dialog/index.vue'
import Cascader from '/@/components/Cascader/indexSub.vue'
import DictSelect from '@/components/DictSelect/index.vue'
import { ref, reactive, onMounted, watch } from 'vue'
import { Filter, Search } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRouter } from 'vue-router'
import { useCache } from '@/hooks/web/useCache'
// import { useAppStore } from '@/store/modules/app'
import { getAuth } from '@/utils/export'
import { getProviderPage, getProviderTypeList, verifyDeleteSeller, deleteSeller, getDataAnalysis } from '@/api/serviceProvider'
import { maskPhoneNumber } from '@/utils'
import * as echarts from 'echarts'
import { nextTick } from 'vue'
import { renderDict } from '@/hooks/web/useDict'

const { wsCache } = useCache()
const leafAreaFlag = ref(wsCache.get('leafAreaFlag'))

// const appStore = useAppStore()

const { push } = useRouter()

const extraQueryFlag = ref(false)

const add = () => {
  push('/serviceProvider/providerAdd')
}

function detail(row) {
  push(`/serviceProvider/providerDetail?id=${row.id}`)
}

// const currentUser = ref(wsCache.get(appStore.getUserInfo).user.nickname)

const edit = (data) => {
  push(`/serviceProvider/providerEdit?id=${data}`)
}
const queryFormDefault = {
  keyword: undefined,
  createTime: [],
  createBeginTime: undefined,
  createEndTime: undefined,
  isCooperation: undefined,
  isWelfare: undefined,
  categoryid: [],
  sellerList: [],
  serveAreaCodeList: [],
  pageNum: 1,
  pageSize: 20,
  orderByColumn: undefined,
  asc: undefined
}
const queryForm = reactive<any>({ ...queryFormDefault })

const loading = ref(false)
const tableData = ref()
const total = ref(0)
const tableRef = ref()

async function getTableList() {
  loading.value = true
  const res = await getProviderPage(queryForm)
  tableData.value = res.data.list
  total.value = res.data.total
  loading.value = false
}

const changeTime = () => {
  if (queryForm.createTime.length) {
    queryForm.createBeginTime = queryForm.createTime[0]
    queryForm.createEndTime = queryForm.createTime[1]
  } else {
    queryForm.createBeginTime = undefined
    queryForm.createEndTime = undefined
  }
}

const handleSortChange = (column: any) => {
  if (column.order) {
    queryForm.orderByColumn = column.prop
    queryForm.asc = column.order == 'ascending' ? 0 : 1
  } else {
    queryForm.orderByColumn = undefined
    queryForm.asc = undefined
  }
  getTableList()
}

const multipleSelection = ref<any>([])
const handleSelectionChange = (val: any) => {
  multipleSelection.value = val
}

function onSubmit() {
  getTableList()
}

watch(
  () => queryForm.createTime,
  () => {
    if (queryForm.createTime) {
      queryForm.createBeginTime = queryForm.createTime[0]
      queryForm.createEndTime = queryForm.createTime[1]
    } else {
      queryForm.createBeginTime = undefined
      queryForm.createEndTime = undefined
    }
  }
)

// 批量 删除
const batchDelete = () => {
  let idList = tableRef.value.getSelectionRows()
  if (!idList.length) {
    return ElMessage.error('请先选择要删除的数据')
  }
  let ids = idList.map((obj) => obj.id).join(',')
  verifyDelete(ids)
}

//删除前的判断（是否能删除）
const verifyDelete = async (ids) => {
  const { data } = await verifyDeleteSeller(ids)
  // 所有都可以删除
  if (data.delete && !data.part) {
    ElMessageBox.confirm(data.msg, '确认删除服务商？', {
      showClose: false // 设置关闭按钮隐藏
    })
      .then(() => {
        del(ids)
      })
      .catch(() => {})
    return
  }
  // 部分删除
  if (data.delete && data.part) {
    ElMessageBox.confirm(data.msg, '部分删除提醒', {
      showClose: false // 设置关闭按钮隐藏
    })
      .then(() => {
        del(ids)
      })
      .catch(() => {})
    return
  }
  //false 表示不能删除
  if (!data.delete) {
    ElMessageBox.confirm(data.msg, '无法删除', {
      confirmButtonText: '知道了',
      showCancelButton: false,
      showClose: false // 设置关闭按钮隐藏
    })
  }
}
// 删除操作
async function del(ids) {
  const res: any = await deleteSeller(ids)
  if (res.code === 200) {
    ElMessage.success('删除成功')
    getTableList()
  }
}

const reset = () => {
  Object.assign(queryForm, queryFormDefault)
  getTableList()
}

const typeList = ref<any>([])

const getTypeList = async () => {
  const dictRes = await getProviderTypeList()
  typeList.value = dictRes.data.map((item) => {
    return {
      value: item.id,
      label: item.name
    }
  })
}

const visibleFlag = ref(false)

const onClose = () => {
  visibleFlag.value = false
}

const openAnalysis = () => {
  visibleFlag.value = true
  nextTick(() => {
    dataAnalysis()
  })
}

const dataAnalysis = async () => {
  const res = await getDataAnalysis()
  let data = res.data
    .map((item) => {
      return {
        value: item.number,
        name: item.name,
        percentage: item.percentage
      }
    })
    .sort(function (a, b) {
      return b.value - a.value
    })
  let chartDom = document.getElementById('analysis-chart')
  echarts.dispose(chartDom as any)
  let currentChart = echarts.init(chartDom)
  let option = {
    legend: {
      orient: 'vertical',
      // right: 'left',
      right: 10,
      top: 'center',
      bottom: 'center',
      textStyle: {
        fontSize: 14,
        lineHeight: 20
      },
      formatter: function (name) {
        // 遍历数据，查找与当前 name 匹配的项
        for (let i = 0; i < data.length; i++) {
          const item = data[i]
          if (item.name === name) {
            // 返回自定义的内容，包含 name 和对应的 value
            return (name.length > 7 ? name.slice(0, 5) + '' : name) + '： ' + item.percentage + '%  ' + item.value
          }
        }
        // 默认情况下返回 name
        return name
      }
    },
    tooltip: {
      trigger: 'item',
      formatter: '{b}{a} : {c} <br/><span style="color:#FF9500;">{d}%</span>'
    },
    series: [
      {
        name: '服务商数量',
        type: 'pie',
        radius: [50, 90],
        center: ['25%', '50%'],
        // roseType: 'radius',
        color: ['#D07A00', '#FF9501', '#FEA82D', '#FFBB5C', '#FFCE8B', '#FEE1B7'],
        itemStyle: {
          borderRadius: 4,
          borderColor: '#fff',
          borderWidth: 1
        },
        labelLine: {
          show: false
        },
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 16,
            fontWeight: 'bold'
          }
        },
        data: data
      }
    ]
  }

  option && currentChart.setOption(option)
}

const listRef = ref()

const serve = (data) => {
  listRef.value.show(data)
}

onMounted(() => {
  getTableList()
  getTypeList()
})
</script>

<style scoped lang="less">
.filter-box {
  height: 170px;
  overflow: hidden;
  transition: height 0.5s ease-in-out;
}
.show-filter {
  height: 0;
}
.search-head {
  color: #ccc;
  font-size: 14px;
}
.row-50 {
  width: 40%;
}
</style>
