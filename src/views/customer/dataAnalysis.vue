<template>
  <el-page-header title="" @back="onBack">
    <template #content>
      <span class="font-bold"> 数据分析 </span>
    </template>
    <div class="header">
      <span class="mr-5">已选分析条目：{{ baseInfo ? mapArr(baseInfo) : '' }}</span>
      <el-button type="primary" @click="showAnalysisOptionsDialog">重新分析</el-button>
    </div>
  </el-page-header>
  <div class="card-box">
    <div class="card" v-for="(item, index) in baseInfo" :key="index">
      <span>{{ item.option }}</span>
      <div>
        <div :id="'chart' + index" style="height: 200px; width: 100%"></div>
      </div>
    </div>
  </div>
  <AnalysisOptionDialog ref="analysisOptionRef" type="reset" @reload="reload" />
</template>

<script lang="ts" setup>
import { ref, onMounted, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { getAnalysisData } from '@/api/customer'
import { useCache } from '@/hooks/web/useCache'
import AnalysisOptionDialog from './components/analysis-options-dialog/index.vue'
import * as echarts from 'echarts'
import { ElMessage } from 'element-plus'

const { wsCache } = useCache()
const { back } = useRouter()
const route = useRoute()
function onBack() {
  back()
}

let baseInfo = ref<any>()

const analysisOptionRef = ref()
function showAnalysisOptionsDialog() {
  analysisOptionRef.value.show()
}

const mapArr = (arr) => {
  return arr.map((item) => item.option).join('、')
}

const getData = async (areaCode: any, fieldName: any) => {
  // {
  //   areaCode: areaCode,
  //   fieldName: fieldName
  // }
  let data = await getAnalysisData({ ...route.query, fieldName })
  return data
}

const initChart = async () => {
  const areaCode = wsCache.get('areaCode')
  if (!areaCode) {
    return ElMessage.error('请先选择项目')
  }
  for (let i = 0; i < baseInfo.value.length; i++) {
    let chartDom = document.getElementById('chart' + i)
    echarts.dispose(chartDom as any)
    let currentChart = echarts.init(chartDom)
    let result = await getData(areaCode, baseInfo.value[i].value)
    let data = result.data
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
    let option = {
      legend: {
        type: 'scroll',
        orient: 'vertical',
        right: 'left',
        formatter: function (name) {
          // 遍历数据，查找与当前 name 匹配的项
          for (let i = 0; i < data.length; i++) {
            const item = data[i]
            if (item.name === name) {
              // 返回自定义的内容，包含 name 和对应的 value
              return (name.length > 7 ? name.slice(0, 5) + '' : name) + '： ' + item.percentage + '%  ' + item.value + '人'
            }
          }
          // 默认情况下返回 name
          return name
        }
      },
      tooltip: {
        trigger: 'item',
        formatter: '{b} <br/><span style="color:#FF9500">{d}%</span>'
      },
      series: [
        {
          name: baseInfo.value.option,
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
}

const reload = () => {
  if (localStorage.getItem('analyzeData')) {
    baseInfo.value = JSON.parse(localStorage.getItem('analyzeData') as string)
  }
  nextTick(() => {
    initChart()
  })
}
onMounted(() => {
  if (localStorage.getItem('analyzeData')) {
    baseInfo.value = JSON.parse(localStorage.getItem('analyzeData') as string)
  }
  nextTick(() => {
    initChart()
  })
})
</script>

<style scoped lang="less">
.header {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
  > span {
    color: #666462;
  }
}
.card-box {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
}
.card {
  min-width: 500px;
  margin: 0 10px;
  width: 31.5%;
  > span {
    display: block;
    font-size: 14px;
    font-weight: bolder;
    color: var(--main-text-color);
    margin: 20px 0 8px;
  }
  > div {
    box-sizing: border-box;
    padding: 20px;
    height: 240px;
    border: 1px solid #f5f3f0;
    border-radius: 4px;
  }
}
</style>
