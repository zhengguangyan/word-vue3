<template>
  <el-dialog
    v-model="visibleFlag"
    :title="title"
    width="600px"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    destroy-on-close
    @close="onClose"
  >
    <div class="h-400px">
      <Map ref="mapRef" @ready="initMap" />
    </div>
  </el-dialog>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import Map from '@/components/Map/index.vue'

const visibleFlag = ref(false)

const title = ref('')
const mapRef = ref()
let mapInfo = { lng: '', lat: '', address: '' }

function show(t, info) {
  mapInfo = info
  title.value = t
  visibleFlag.value = true
}

function initMap() {
  if (!mapInfo.lng) {
    return
  }
  mapRef.value.initMarker(mapInfo.lng, mapInfo.lat, mapInfo.address)
}

function onClose() {
  visibleFlag.value = false
}

defineExpose({
  show
})
</script>
