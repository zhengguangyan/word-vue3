<template>
  <el-card shadow="never" class="card address-change-statistics">
    <template #header>
      <div class="card-header">
        <span class="title">
          {{ sumData.title + (sumData.currentAndDomicileName === '户籍现居总人数' ? '户籍现居情况' : sumData.currentAndDomicileName === '户籍总人数' ? '户籍情况' : '现居情况') }}
        </span>
      </div>
    </template>
    <el-row :gutter="20" style="padding: 0 10px">
      <el-col :span="12">
        <el-card shadow="never" class="item-card">
          <template #header>
            <span class="card-title">{{ sumData.currentAndDomicileName }}</span>
          </template>
          <div class="statistics">
            <el-statistic :value="sumData.currentAndDomicileCount">
              <template #title>
                <div>{{ sumData.currentAndDomicileName }}</div>
              </template>
            </el-statistic>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12" v-show="sumData.currentAndDomicileName === '户籍现居总人数'">
        <el-card shadow="never" class="item-card">
          <template #header>
            <span class="card-title">户籍现居人数</span>
          </template>
          <div class="chart">
            <div class="current-and-domicile-chart" ref="currentAndDomicileChartRef" style="height: calc(50vh - 190px); min-height: 250px"></div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12" v-show="sumData.currentAndDomicileName === '户籍现居总人数' || sumData.currentAndDomicileName === '户籍总人数'">
        <el-card shadow="never" class="item-card">
          <template #header>
            <span class="card-title">户籍人员</span>
          </template>
          <div class="chart">
            <el-space wrap :size="12" style="margin-left: 20px">
              <el-button type="primary" :plain="domicileType != 1" @click="changeDomicile(1)"> 今日 </el-button>
              <el-button type="primary" :plain="domicileType != 2" @click="changeDomicile(2)"> 本月 </el-button>
              <el-button type="primary" :plain="domicileType != 3" @click="changeDomicile(3)"> 本季度 </el-button>
              <el-button type="primary" :plain="domicileType != 4" @click="changeDomicile(4)"> 本年 </el-button>
            </el-space>
            <div class="domicile-chart" ref="domicileChartRef" style="height: calc(50vh - 225px); min-height: 216px"></div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12" v-show="sumData.currentAndDomicileName === '户籍现居总人数' || sumData.currentAndDomicileName === '现居总人数'">
        <el-card shadow="never" class="item-card">
          <template #header>
            <span class="card-title">现居人员</span>
          </template>
          <div class="chart">
            <el-space :size="12" wrap style="margin-left: 20px">
              <el-button type="primary" :plain="currentType != 1" @click="changeCurrent(1)"> 今日 </el-button>
              <el-button type="primary" :plain="currentType != 2" @click="changeCurrent(2)"> 本月 </el-button>
              <el-button type="primary" :plain="currentType != 3" @click="changeCurrent(3)"> 本季度 </el-button>
              <el-button type="primary" :plain="currentType != 4" @click="changeCurrent(4)"> 本年 </el-button>
            </el-space>
            <div class="current-chart" ref="currentChartRef" style="height: calc(50vh - 225px); min-height: 216px"></div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </el-card>
</template>
<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from 'vue'
import * as echarts from 'echarts'
import { useRouter } from 'vue-router'
import { nextTick } from 'vue'
import { getCurrentAndDomicileVO, getCurrentVO, getDomicileVO } from '@/api/customer'
import { useCache } from '@/hooks/web/useCache'
// @ts-ignore
defineOptions({
  // eslint-disable-next-line vue/component-definition-name-casing
  name: 'Customer/addressChangeStatistics'
})

const { wsCache } = useCache()

const { push } = useRouter()

const sumData = ref<any>({
  title: '',
  currentAndDomicileName: '',
  currentAndDomicileCount: 0,
  currentCount: 0,
  domicileCount: 0
})

const currentData = ref<any>({})

const domicileData = ref<any>({})

const name = ref()

const domicileType = ref(1)

const currentType = ref(1)

const changeDomicile = (data) => {
  domicileType.value = data
  getDomicile()
}

const changeCurrent = (data) => {
  currentType.value = data
  getCurrent()
}

const currentAndDomicileChartRef = ref()
const currentAndDomicileOption = ref({
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    }
  },
  grid: {
    left: 50,
    right: 20,
    bottom: 30,
    top: 20
  },
  xAxis: {
    type: 'category',
    data: ['户籍人数', '现居人数'],
    axisTick: {
      alignWithLabel: true
    }
  },
  yAxis: {
    minInterval: 1,
    type: 'value'
  },
  series: [
    {
      name: '人数',
      data: [
        {
          value: sumData.value.domicileCount
        },
        {
          value: sumData.value.currentCount
        }
      ],
      type: 'bar',
      barWidth: 74,
      itemStyle: {
        color: '#ffaa33',
        borderRadius: [8, 8, 0, 0]
      },
      label: {
        show: true,
        position: 'top'
      }
    }
  ]
})

const domicileChartRef = ref()
const domicileOption = ref({
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    }
  },
  grid: {
    left: 70,
    right: 20,
    bottom: 30,
    top: 30
  },
  xAxis: {
    type: 'category',
    data: ['迁入人数', '迁出人数', '变更为健在人数', '变更为过世人数'],
    axisTick: {
      alignWithLabel: true
    }
  },
  yAxis: {
    minInterval: 1,
    type: 'value'
  },
  series: [
    {
      name: '人数',
      data: [{ value: 0 }, { value: 0 }, { value: 0 }, { value: 0 }],
      type: 'bar',
      barWidth: 50,
      itemStyle: {
        color: '#ffaa33',
        borderRadius: [8, 8, 0, 0]
      },
      label: {
        show: true,
        position: 'top'
      }
    }
  ]
})

const currentChartRef = ref()
const currentOption = ref({
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    }
  },
  grid: {
    left: 50,
    right: 20,
    bottom: 30,
    top: 30
  },
  xAxis: {
    type: 'category',
    data: ['迁入人数', '迁出人数', '变更为健在人数', '变更为过世人数'],
    axisTick: {
      alignWithLabel: true
    }
  },
  yAxis: {
    minInterval: 1,
    type: 'value'
  },
  series: [
    {
      name: '人数',
      data: [{ value: 0 }, { value: 0 }, { value: 0 }, { value: 0 }],
      type: 'bar',
      barWidth: 50,
      itemStyle: {
        color: '#ffaa33',
        borderRadius: [8, 8, 0, 0]
      },
      label: {
        show: true,
        position: 'top'
      }
    }
  ]
})
function handleAddressClick(params, changeType) {
  const aliveFlag = params.name.includes('健在') ? 1 : 0
  const movingMatch = params.name.includes('迁出') ? 1 : 0
  const type = changeType === 'domicile' ? domicileType.value : currentType.value
  if (params.name.includes('变更')) {
    push(`/customer/aliveFlagChangeRecord?changeType=${changeType}&type=${type}&aliveFlag=${aliveFlag}&title=${sumData.value.title}`)
  } else {
    push(`/customer/addressChangeRecord?changeType=${changeType}&type=${type}&movingMatch=${movingMatch}&title=${sumData.value.title}`)
  }
}

function handleDomicileClick(params) {
  handleAddressClick(params, 'domicile')
}

function handleCurrentClick(params) {
  handleAddressClick(params, 'current')
}

const loadEcharts = () => {
  currentAndDomicileOption.value.series[0].data[0].value = sumData.value.domicileCount
  currentAndDomicileOption.value.series[0].data[1].value = sumData.value.currentCount
  domicileOption.value.series[0].data[0].value = domicileData.value?.moveInCount
  domicileOption.value.series[0].data[1].value = domicileData.value?.moveOutCount
  domicileOption.value.series[0].data[2].value = domicileData.value?.aliveflagCount
  domicileOption.value.series[0].data[3].value = domicileData.value?.notAliveflagCount
  currentOption.value.series[0].data[0].value = currentData.value?.moveInCount
  currentOption.value.series[0].data[1].value = currentData.value?.moveOutCount
  currentOption.value.series[0].data[2].value = currentData.value?.aliveflagCount
  currentOption.value.series[0].data[3].value = currentData.value?.notAliveflagCount
  echarts.dispose(currentAndDomicileChartRef.value)
  echarts.dispose(domicileChartRef.value)
  echarts.dispose(currentChartRef.value)
  nextTick(() => {
    let currentAndDomicileChart = echarts.init(currentAndDomicileChartRef.value)
    currentAndDomicileChart.setOption(currentAndDomicileOption.value)

    let domicileChart = echarts.init(domicileChartRef.value)
    domicileChart.setOption(domicileOption.value)
    domicileChart.on('click', handleDomicileClick)

    let currentChart = echarts.init(currentChartRef.value)
    currentChart.setOption(currentOption.value)
    currentChart.on('click', handleCurrentClick)
  })
}

const getData = async () => {
  let code = wsCache.get('areaCode')
  const resAll = await getCurrentAndDomicileVO(code)
  const resCurrent = await getCurrentVO({ type: currentType.value, areaCode: code })
  const resDomicile = await getDomicileVO({ type: domicileType.value, areaCode: code })
  sumData.value = resAll.data
  currentData.value = resCurrent.data
  domicileData.value = resDomicile.data
  // sumData.value.currentAndDomicileName = '户籍现居总人数'
  loadEcharts()
}

const getDomicile = async () => {
  let code = wsCache.get('areaCode')
  const resDomicile = await getDomicileVO({ type: domicileType.value, areaCode: code })
  domicileData.value = resDomicile.data
  domicileOption.value.series[0].data[0].value = domicileData.value?.moveInCount
  domicileOption.value.series[0].data[1].value = domicileData.value?.moveOutCount
  domicileOption.value.series[0].data[2].value = domicileData.value?.aliveflagCount
  domicileOption.value.series[0].data[3].value = domicileData.value?.notAliveflagCount
  echarts.dispose(domicileChartRef.value)
  nextTick(() => {
    let domicileChart = echarts.init(domicileChartRef.value)
    domicileChart.setOption(domicileOption.value)
    domicileChart.on('click', handleDomicileClick)
  })
}

const getCurrent = async () => {
  let code = wsCache.get('areaCode')
  const resCurrent = await getCurrentVO({ type: currentType.value, areaCode: code })
  currentData.value = resCurrent.data
  currentOption.value.series[0].data[0].value = currentData.value?.moveInCount
  currentOption.value.series[0].data[1].value = currentData.value?.moveOutCount
  currentOption.value.series[0].data[2].value = currentData.value?.aliveflagCount
  currentOption.value.series[0].data[3].value = currentData.value?.notAliveflagCount
  echarts.dispose(currentChartRef.value)
  nextTick(() => {
    let currentChart = echarts.init(currentChartRef.value)
    currentChart.setOption(currentOption.value)
    currentChart.on('click', handleCurrentClick)
  })
}

onMounted(() => {
  getData()
  window.addEventListener('resize', watchResize)
  name.value = wsCache.get('areaName')
})

onUnmounted(() => {
  window.removeEventListener('resize', watchResize)
})

let resizeTimeId = 0
const watchResize = () => {
  window.clearTimeout(resizeTimeId)
  resizeTimeId = window.setTimeout(() => {
    getData()
  }, 500)
}
</script>
<style lang="less">
.address-change-statistics {
  .el-card,
  .item-card,
  .item-card .el-card__header {
    border: 0 !important;
  }
  .item-card .el-card__header {
    padding: 8px 0;
    font-size: 14px;
    font-weight: bold;
    color: #313233;
    line-height: 16px;
  }
  .statistics {
    position: relative;
    padding: 40px 0 0 40px;
    width: 100%;
    height: calc(50vh - 160px);
    min-height: 280px;
    background-image: url('@/assets/bg/bg-customer-statistic.png');
    background-repeat: no-repeat;
    background-size: auto 100%;
    margin: 0 auto 20px;
    border-radius: 10px;
    border: 1px solid #f5f3f0;
  }
  .el-statistic__head {
    font-weight: bold;
    font-size: 16px;
    color: #626466;
    line-height: 19px;
  }
  .el-statistic__content {
    font-size: 88px;
    font-family: Arial, Arial-700;
    font-weight: 700;
    text-align: LEFT;
    color: #ff9500;
  }
}
</style>

<style scoped lang="less">
.card-title {
  padding-left: 0;
}
.chart {
  border: 1px solid #f5f3f0;
  border-radius: 4px;
  padding: 20px 0 10px;
  background-color: #fffdfa;
}
</style>
