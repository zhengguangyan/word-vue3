<template>
    <el-transfer v-model="value" filterable :filter-method="filterMethod" :data="data" />
  
    <el-steps :active="active" finish-status="success">
      <el-step title="计划服务时间" description="2023-03-10 10:00"  />
      <el-step title="开始服务"  description="2023-03-10 10:00"  />
      <el-step title="完成服务" description="2023-03-10 10:00"  />
      <el-step title="服务审核通过" description="2023-03-10 10:00"   />
  
    </el-steps>
    
    <el-button style="margin-top: 12px" @click="next">Next step</el-button>
  </template>
    
  <script lang="ts" setup>
  import { ref } from 'vue'
  
  interface Option {
    key: number
    label: string
    initial: string
  }
  
  const generateData = () => {
    const data: Option[] = []
    const states = [
      'California',
      'Illinois',
      'Maryland',
      'Texas',
      'Florida',
      'Colorado',
      'Connecticut ',
    ]
    const initials = ['CA', 'IL', 'MD', 'TX', 'FL', 'CO', 'CT']
    states.forEach((city, index) => {
      data.push({
        label: city,
        key: index,
        initial: initials[index],
      })
    })
    return data
  }
  
  
  const data = ref<Option[]>(generateData())
  const value = ref([])
  
  
  const filterMethod = (query, item) => {
    return item.initial.toLowerCase().includes(query.toLowerCase())
  }
  
  const active = ref(0)
  const next = () => {
    if (active.value++ > 2) active.value = 0
  }
  </script>