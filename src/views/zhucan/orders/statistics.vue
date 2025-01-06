<template>
  <div>
    <el-card shadow="never" class="card">
      <template #header>
        <div class="card-header">
          <span class="title">助餐订单统计</span>
        </div>
      </template>
      <div class="query-form flex row-between">
        <div class="flex">
          <el-select v-model="params.stationId" placeholder="全部站点" clearable style="width: 200px" @change="loadData">
            <el-option v-for="item in stationList" :key="item.id" :label="item.stationName" :value="item.id" />
          </el-select>
        </div>
        <div class="flex">
          <div class="flex r-m-r-12">
            <div class="date-btn" :class="{ active: isYesterday }" @click="changeDateType('1')">昨天</div>
            <div class="date-btn" :class="{ active: isCurrentWeek }" @click="changeDateType('2')">本周</div>
            <div class="date-btn" :class="{ active: isCurrentMonth }" @click="changeDateType('3')">本月</div>
          </div>
          <el-date-picker
            v-model="params.timeRange"
            type="datetimerange"
            range-separator="~"
            start-placeholder="起始日期"
            end-placeholder="结束日期"
            value-format="YYYY-MM-DD HH:mm"
            format="YYYY-MM-DD HH:mm"
            :editable="false"
            class="stat-time-picker"
            @change="loadData"
            :clearable="false"
          />
        </div>
      </div>
      <h2 class="label-title r-m-t-20 r-m-b-12">站点销售统计</h2>
      <div class="grid-box">
        <div class="grid-item">
          <div class="flex grid-title-box">
            <h4 class="grid-title">销售金额(元)</h4>
            <el-tooltip effect="dark" content="销售营养餐原价的总和（不包括已退款）" placement="top">
              <img src="@/assets/svgs/small-tag.svg" class="pointer r-m-l-8" />
            </el-tooltip>
          </div>
          <el-statistic :value="saleMoneyValue" />
        </div>
        <div class="grid-item">
          <div class="flex grid-title-box">
            <h4 class="grid-title">销售份数(份)</h4>
            <el-tooltip effect="dark" content="实际销售营养餐份数的总和" placement="top">
              <img src="@/assets/svgs/small-tag.svg" class="pointer r-m-l-8" />
            </el-tooltip>
          </div>
          <el-statistic :value="saleNumValue" />
        </div>
        <div class="grid-item">
          <div class="flex grid-title-box">
            <h4 class="grid-title">补贴金额(元)</h4>
            <el-tooltip effect="dark" content="销售营养餐补贴金额的总和" placement="top">
              <img src="@/assets/svgs/small-tag.svg" class="pointer r-m-l-8" />
            </el-tooltip>
          </div>
          <el-statistic :value="subsidyMoneyValue" />
        </div>
        <div class="grid-item">
          <div class="flex grid-title-box">
            <h4 class="grid-title">补贴份数(份)</h4>
            <el-tooltip effect="dark" content="实际销售营养餐补贴份数的总和" placement="top">
              <img src="@/assets/svgs/small-tag.svg" class="pointer r-m-l-8" />
            </el-tooltip>
          </div>
          <el-statistic :value="subsidyNumValue" />
        </div>
      </div>
      <h2 class="label-title r-m-t-40 r-m-b-12">站点销售份数排行</h2>
      <div class="chart-box">
        <div id="zhucan-stat"></div>
        <div class="empty-box" v-if="!rankings.length">
          <img src="@/assets/bg/data-empty.png" class="r-m-b-20" />
          <span class="info-color">暂无排行数据</span>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted, onUnmounted } from 'vue'
import { siteList } from '@/api/zhucan/station'
import { formatDateString } from '@/utils'
import { orderStat } from '@/api/zhucan/orders'
import { computed } from 'vue'
import { useTransition } from '@vueuse/core'
import echarts from '@/plugins/echarts'
import { nextTick } from 'vue'

onMounted(() => {
  chartBox = document.getElementById('zhucan-stat') as HTMLElement
  initDate()
  loadData()
  loadStationList()
  window.addEventListener('resize', resize)
})
onUnmounted(() => {
  window.addEventListener('resize', resize)
})

const params = reactive({
  payTimeEnd: '',
  payTimeStart: '',
  timeRange: [] as string[], // 前端自定义字段
  stationId: ''
})

const rankings = ref<any[]>([])
const saleMoney = ref(0)
const saleNum = ref(0)
const subsidyMoney = ref(0)
const subsidyNum = ref(0)

const saleMoneyValue = useTransition(saleMoney, { duration: 1500 })
const saleNumValue = useTransition(saleNum, { duration: 1500 })
const subsidyMoneyValue = useTransition(subsidyMoney, { duration: 1500 })
const subsidyNumValue = useTransition(subsidyNum, { duration: 1500 })

const loadData = async () => {
  params.payTimeStart = params.timeRange[0]
  params.payTimeEnd = params.timeRange[1]
  const { data } = await orderStat(params)
  rankings.value = data.rankings && data.rankings.length ? data.rankings.reverse() : []
  saleMoney.value = Number(data.saleMoney ?? 0)
  saleNum.value = Number(data.saleNum ?? 0)
  subsidyMoney.value = Number(data.subsidyMoney ?? 0)
  subsidyNum.value = Number(data.subsidyNum ?? 0)
  if (rankings.value.length > 7) {
    // 数据大于7条时，需要重置图表容器的高度
    chartBox.style.height = `${42 * rankings.value.length}px` // 每条数据占据高度大概为42px
  }
  nextTick(() => {
    initChart(rankings.value)
  })
}

const timeData = reactive({
  yesterday: '',
  week: [] as string[],
  month: [] as string[]
})
const isYesterday = computed(() => {
  if (!(params.timeRange && params.timeRange.length)) return false
  return params.timeRange[0].slice(0, 10) === timeData.yesterday && params.timeRange[1].slice(0, 10) === timeData.yesterday
})
const isCurrentWeek = computed(() => {
  if (!(params.timeRange && params.timeRange.length)) return false
  return params.timeRange[0].slice(0, 10) === timeData.week[0] && params.timeRange[1].slice(0, 10) === timeData.week[1]
})
const isCurrentMonth = computed(() => {
  if (!(params.timeRange && params.timeRange.length)) return false
  return params.timeRange[0].slice(0, 10) === timeData.month[0] && params.timeRange[1].slice(0, 10) === timeData.month[1]
})
const initDate = () => {
  const date = new Date()
  timeData.yesterday = formatDateString(date.valueOf() - 8.64e7, 'YYYY-MM-DD')
  const day = date.getDay() === 0 ? 7 : date.getDay()
  const monday = formatDateString(new Date(date.valueOf() - 8.64e7 * (day - 1)), 'YYYY-MM-DD')
  const sunday = formatDateString(new Date(date.valueOf() + 8.64e7 * (7 - day)), 'YYYY-MM-DD')
  timeData.week = [monday, sunday]
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const firstDay = `${date.getFullYear()}-${month}-01`
  const lastDay = `${date.getFullYear()}-${month}-${getDaysByMonth(date.getFullYear(), date.getMonth() + 1)}`
  timeData.month = [firstDay, lastDay]
  params.timeRange = [`${timeData.yesterday} 00:00`, `${timeData.yesterday} 23:59`]
}

// 1=昨天 2=本周 3=本月
const changeDateType = (type: '1' | '2' | '3') => {
  if (type === '1') {
    params.timeRange = [`${timeData.yesterday} 00:00`, `${timeData.yesterday} 23:59`]
  } else if (type === '2') {
    params.timeRange = [`${timeData.week[0]} 00:00`, `${timeData.week[1]} 23:59`]
  } else if (type === '3') {
    params.timeRange = [`${timeData.month[0]} 00:00`, `${timeData.month[1]} 23:59`]
  }
  loadData()
}

const stationList = ref<any[]>([])
const loadStationList = async () => {
  const { data } = await siteList({})
  stationList.value = data
}

// 根据月份获取每月天数
const getDaysByMonth = (year: number, month: number) => {
  switch (month) {
    case 1:
    case 3:
    case 5:
    case 7:
    case 8:
    case 10:
    case 12:
      return 31
    case 4:
    case 6:
    case 9:
    case 11:
      return 30
    case 2:
      return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0 ? 29 : 28
  }
}

let chartBox: HTMLElement
let barChart: echarts.ECharts
// 绘制横向柱状图
const initChart = (data: any[]) => {
  echarts.dispose(chartBox) // 先销毁
  if (!data || data.length === 0) return
  barChart = echarts.init(chartBox)
  let maxCount = 0 // 统计哪个站点字数最多
  data.forEach(item => {
    if (item.name.length > maxCount) {
      maxCount = item.name.length
    }
  })
  barChart.setOption({
    yAxis: {
      type: 'category',
      data: data.map((item) => item.name),
      axisLabel: {
        color: 'var(--main-text-color)', // y轴文字颜色
        interval: 0, // 设置成 0 强制显示所有标签
        width: 14 * (maxCount + 1),
        overflow: 'truncate',
        ellipsis: '...',
        fontSize: 14
      },
      axisLine: {
        lineStyle: {
          color: ['#e0e0e0'] // y轴的轴线颜色
        }
      }
    },
    xAxis: {
      type: 'value',
      minInterval: 1,
      splitLine: {
        // 区域分隔线的样式
        lineStyle: {
          type: 'dashed',
          color: ['#F5F3F0']
        }
      },
      axisLabel: {
        color: 'rgba(0,0,0,0)', // x轴文字颜色
        fontSize: 14
      }
    },
    tooltip: {
      show: true,
      borderColor: 'rgba(0, 0, 0, 0)',
      padding: [8, 12],
      formatter: (data: any) => {
        return `<div class="flex line-height-1">
        <span class="zhucan-stat-span">${data.name}:</span>
        <strong class="primary-color line-height-1">${data.data.value}</strong></div>`
      }
    },
    grid: {
      left: 5,
      bottom: 5,
      right: 50,
      top: 10,
      containLabel: true
    },
    series: [
      {
        type: 'bar',
        data: data.map((item) => ({ value: item.num, label: item.num })),
        label: {
          show: true,
          color: '#999693',
          position: 'right',
          fontSize: 14
        },
        barWidth: 16,
        itemStyle: {
          normal: {
            borderRadius: [0, 4, 4, 0],
            // 设置渐变色
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 1,
              y2: 0,
              colorStops: [
                { offset: 0, color: '#ffcf3d' }, // 0% 处的颜色
                { offset: 0.5, color: '#ffbd38' },
                { offset: 1, color: '#ffaa33' } // 100% 处的颜色
              ]
            }
          },
          emphasis: {
            // 当鼠标悬停时的效果，这里可以继续设置为渐变色
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 1,
              y2: 0,
              colorStops: [
                { offset: 0, color: '#ffcf3d' }, // 0% 处的颜色
                { offset: 0.5, color: '#ffbd38' },
                { offset: 1, color: '#ffaa33' } // 100% 处的颜色
              ]
            }
          }
        }
      }
    ]
  })
}

let timeId = 0
const resize = () => {
  window.clearTimeout(timeId)
  timeId = window.setTimeout(() => {
    barChart.resize()
  }, 300)
}
</script>

<style lang="less" scoped>
.label-text {
  font-size: 14px;
  flex-shrink: 0;
  margin-right: 10px;
}
.date-btn {
  width: 80px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #ebe9e6;
  color: #666462;
  background-color: #fff;
  transition: color 0.2s, border-color 0.2s, background-color 0.2s;
  cursor: pointer;
  font-size: 14px;
  &:first-child {
    border-radius: 4px 0 0 4px;
  }
  &:last-child {
    border-radius: 0 4px 4px 0;
  }
  &.active {
    background-color: rgba(var(--el-color-primary-rgb), 0.05);
    color: var(--el-color-primary);
    border-color: var(--el-color-primary);
  }
  &:hover {
    color: var(--el-color-primary);
  }
}
:deep(.stat-time-picker) {
  svg {
    display: none;
  }
  .el-range__icon {
    width: 56px;
    &::after {
      content: '日期选择';
      white-space: nowrap;
      font-style: normal;
      color: #999693;
    }
  }
}
.grid-box {
  display: flex;
  justify-content: space-between;
}
.grid-item {
  width: calc((100% - 60px) / 4);
  min-width: 250px;
  aspect-ratio: 376 / 160;
  padding: 2% 2.4%;
  &:nth-of-type(1) {
    background: url('@/assets/imgs/zhucan-1.png') center/100% no-repeat;
  }
  &:nth-of-type(2) {
    background: url('@/assets/imgs/zhucan-2.png') center/100% no-repeat;
  }
  &:nth-of-type(3) {
    background: url('@/assets/imgs/zhucan-3.png') center/100% no-repeat;
  }
  &:nth-of-type(4) {
    background: url('@/assets/imgs/zhucan-4.png') center/100% no-repeat;
  }
}
.grid-title-box {
  margin-bottom: 12px;
}
.grid-title {
  font-size: 18px;
  color: #666462;
  font-weight: bold;
}
:deep(.el-statistic__number) {
  font-size: 40px;
  font-weight: bold;
  line-height: 1;
}
.chart-box {
  position: relative;
}
#zhucan-stat {
  height: 300px;
  overflow: hidden;
}
.empty-box {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #fff;
  z-index: 1;
}
</style>

<style lang="less">
.zhucan-stat-span {
  padding-left: 16px;
  position: relative;
  margin-right: 6px;
  line-height: 1;
  &::before {
    position: absolute;
    content: '';
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: var(--el-color-primary);
  }
}
</style>
