<template>
  <el-dialog
    v-model="visibleFlag"
    :title="props.title"
    width="500px"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    @close="onClose"
    @open="onOpen"
  >
    <audio ref="audioPlayerRef" :src="props.url" controls class="w-full"></audio>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
const props = defineProps({
  url: {
    type: String,
    required: true
  },
  title: {
    type: String,
    default: '播放语音'
  }
})
const visibleFlag = ref(false)

const audioPlayerRef = ref()
function show() {
  visibleFlag.value = true
}

const onOpen = () => {
  audioPlayerRef.value.play()
}

function onClose() {
  visibleFlag.value = false
  audioPlayerRef.value.pause()
}

defineExpose({
  show
})
</script>
