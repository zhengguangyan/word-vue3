<template>
  <div>
    <div class="r-m-b-15">
      <el-date-picker style="width: 300px" v-model="queryForm.date" type="daterange" range-separator="~" start-placeholder="开始时间" end-placeholder="结束时间" value-format="YYYY-MM-DD" @change="changeTime" clearable />
    </div>
    <div class="flex row-between">
      <div class="sta-item" :class="[`item-${index}`]" v-for="(item, index) in staList" :key="item.type">
        <p class="r-m-b-5">{{ item.type }}</p>
        <p class="font-bold">{{ item.number }}</p>
      </div>
      <div class="sta-item item-5">
        <p class="r-m-b-5">合计</p>
        <p class="font-bold">{{ sumNumber }}</p>
      </div>
    </div>

    <div class="r-m-t-40">
      <el-radio-group v-model="type" @change="changeType">
        <el-radio-button :label="1">柱状图</el-radio-button>
        <el-radio-button :label="2">折线图</el-radio-button>
        <el-radio-button :label="3">饼状图</el-radio-button>
      </el-radio-group>
      <div class="chart r-m-t-20">
        <div class="domicile-chart" ref="chartRef" style="height: calc(100vh - 620px)"></div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { getComprehensive } from '@/api/serviceProject'
import { computed } from 'vue'
import { ref } from 'vue'
import { watch, reactive } from 'vue'
import * as echarts from 'echarts'
import { nextTick } from 'vue'
import { onMounted } from 'vue'
import { onUnmounted } from 'vue'

const props = defineProps({
  customerId: {
    type: Number,
    default: null
  }
})
const queryFormDefault = {
  customerId: props.customerId,
  date: undefined,
  beginDate: undefined,
  endDate: undefined
}

const queryForm = reactive<any>({ ...queryFormDefault })

const getList = async () => {
  const { data } = await getComprehensive(queryForm)
  staList.value = data
  loadEcharts()
}

const sumNumber = computed(() => {
  let sum = 0
  if (staList.value.length) {
    staList.value.map((item) => {
      sum += item.number
    })
  }
  return sum
})

const staList = ref<any>([])

const changeTime = () => {
  if (queryForm.date) {
    queryForm.beginDate = queryForm.date[0]
    queryForm.endDate = queryForm.date[1]
  } else {
    queryForm.beginDate = undefined
    queryForm.endDate = undefined
  }
  getList()
}

const type = ref(1)

const changeType = (data) => {
  type.value = data
  loadEcharts()
}

const chartRef = ref()

const columnOption = ref({
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
    data: ['咨询', '投诉', '平台订单', '自建订单', '关怀'],
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
      name: '数量',
      data: [{ value: 0 }, { value: 0 }, { value: 0 }, { value: 0 }, { value: 0 }],
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

const lineOption = ref({
  tooltip: {
    trigger: 'axis'
  },
  grid: {
    left: 50,
    right: 20,
    bottom: 30,
    top: 30
  },
  xAxis: {
    type: 'category',
    data: ['咨询', '投诉', '平台订单', '自建订单', '关怀'],
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
      data: [0, 0, 0, 0, 0],
      type: 'line',
      itemStyle: {
        color: '#ffaa33'
      }
    }
  ]
})

const pieOption = ref({
  tooltip: {
    trigger: 'item',
    axisPointer: {
      type: 'shadow'
    }
  },
  legend: {
    orient: 'vertical',
    right: 50,
    top: '20%',
    bottom: 'center',
    textStyle: {
      fontSize: 14,
      lineHeight: 30
    },
    formatter: function (name) {
      // 遍历数据，查找与当前 name 匹配的项
      for (let i = 0; i < staList.value.length; i++) {
        const item = staList.value[i]
        if (item.type === name) {
          // 返回自定义的内容，包含 name 和对应的 value
          return name + '： ' + (sumNumber.value ? (((item.number / sumNumber.value) * 100) as any).toFixed(2) : 0) + '%  ' + item.number
        }
      }
      // 默认情况下返回 name
      return name
    }
  },
  grid: {
    left: 50,
    right: 20,
    bottom: 30,
    top: 10
  },
  series: [
    {
      name: '数量',
      data: [
        { value: 0, name: '咨询' },
        { value: 0, name: '投诉' },
        { value: 0, name: '平台订单' },
        { value: 0, name: '自建订单' },
        { value: 0, name: '关怀' }
      ],
      type: 'pie',
      radius: '70%',
      color: ['#D07A00', '#FF9501', '#FEA82D', '#FFBB5C', '#FFCE8B', '#FEE1B7'],
      label: {
        show: true,
        position: 'top'
      }
    }
  ]
})

const loadEcharts = () => {
  switch (type.value) {
    case 1:
      assignNumber(columnOption.value.series[0], staList.value)
      echarts.dispose(chartRef.value)
      nextTick(() => {
        let currentChart = echarts.init(chartRef.value)
        currentChart.setOption(columnOption.value)
      })
      break
    case 2:
      lineNumber(lineOption.value.series[0], staList.value)
      echarts.dispose(chartRef.value)
      nextTick(() => {
        let currentChart = echarts.init(chartRef.value)
        currentChart.setOption(lineOption.value)
      })
      break
    case 3:
      assignNumber(pieOption.value.series[0], staList.value)
      echarts.dispose(chartRef.value)
      nextTick(() => {
        let currentChart = echarts.init(chartRef.value)
        currentChart.setOption(pieOption.value)
      })
      break
  }
}

const assignNumber = (option, sta) => {
  option.data[0].value = sta[0].number
  option.data[1].value = sta[1].number
  option.data[2].value = sta[2].number
  option.data[3].value = sta[3].number
  option.data[4].value = sta[4].number
}

const lineNumber = (option, sta) => {
  option.data[0] = sta[0].number
  option.data[1] = sta[1].number
  option.data[2] = sta[2].number
  option.data[3] = sta[3].number
  option.data[4] = sta[4].number
}

watch(
  () => props.customerId,
  (e) => {
    if (e) {
      getList()
    }
  },
  { immediate: true }
)

let resizeTimeId = 0
const watchResize = () => {
  window.clearTimeout(resizeTimeId)
  resizeTimeId = window.setTimeout(() => {
    loadEcharts()
  }, 500)
}

onMounted(() => {
  window.addEventListener('resize', watchResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', watchResize)
})
</script>

<style scoped lang="less">
.sta-item {
  box-sizing: border-box;
  width: 16%;
  height: 80px;
  border-radius: 4px;
  padding: 12px 22px;
}
.item-0 {
  background: url(../../../../assets/bg/sta-item-0.png) no-repeat top right;
  background-size: 100% 100%;
}
.item-1 {
  background: url(../../../../assets/bg/sta-item-1.png) no-repeat top right;
  background-size: 100% 100%;
}
.item-2 {
  background: url(../../../../assets/bg/sta-item-2.png) no-repeat top right;
  background-size: 100% 100%;
}
.item-3 {
  background: url(../../../../assets/bg/sta-item-3.png) no-repeat top right;
  background-size: 100% 100%;
}
.item-4 {
  background: url(../../../../assets/bg/sta-item-4.png) no-repeat top right;
  background-size: 100% 100%;
}
.item-5 {
  background: url(../../../../assets/bg/sta-item-5.png) no-repeat top right;
  background-size: 100% 100%;
}
:deep(.el-radio-button:last-child .el-radio-button__inner) {
  border-radius: 0 8px 8px 0;
}
:deep(.el-radio-button:first-child .el-radio-button__inner) {
  border-radius: 8px 0 0 8px;
}
.chart {
  border: 1px solid #f5f3f0;
  border-radius: 4px;
  padding: 20px 0 10px;
  background-color: #fffdfa;
}
</style>
