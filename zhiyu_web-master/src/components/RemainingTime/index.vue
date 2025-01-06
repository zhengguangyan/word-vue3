<template>
  <div>{{ remainingTime }}</div>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { automaticOperat } from '@/api/order'
const emits = defineEmits(['finish-time'])
const props = defineProps({
  time: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    default: undefined
  },
  id: {
    type: String,
    default: ''
  },
  code: {
    type: String,
    default: ''
  }
})

const countDownDate = new Date(props.time).getTime()

const remainingTime = ref('')

function updateTime() {
  let countDay = 0
  switch (props.status) {
    case '确认':
      countDay = 1
      break
    case '评价':
      countDay = 7
      break
    case '结案':
      countDay = 3
      break
    case '已接单':
      countDay = 0.25
      break
    default:
      break
  }

  const now = new Date().getTime()
  const distance = countDownDate * 1000 + countDay * 24 * 60 * 60 * 1000 - now

  if (distance < 0) {
    remainingTime.value = '倒计时已结束'
    clearInterval(interval.value)
    automaticOperatFun()
    return
  }

  const hours = Math.floor(distance / (1000 * 60 * 60))
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((distance % (1000 * 60)) / 1000)
  if (props.status === '已接单') {
    remainingTime.value = `剩余 ${hours < 10 ? `0${hours}` : hours}:${minutes < 10 ? `0${minutes}` : minutes}:${seconds < 10 ? `0${seconds}` : seconds} ${props.status ? '自动退回' : ''}`
  } else {
    remainingTime.value = `剩余 ${hours < 10 ? `0${hours}` : hours}:${minutes < 10 ? `0${minutes}` : minutes}:${seconds < 10 ? `0${seconds}` : seconds} ${props.status ? '自动' + props.status : ''}`
  }

  if (distance < 0) {
    clearInterval(interval.value)
    automaticOperatFun()
  }
}
const automaticOperatFun = async () => {
  await automaticOperat({ id: props.id, code: props.code })
  emits('finish-time')
}

const interval = ref<any>(null)

onMounted(() => {
  interval.value = setInterval(updateTime, 1000)
})

onUnmounted(() => {
  if (interval.value) {
    clearInterval(interval.value)
  }
})
</script>
