<template>
  <div id="map-container" class="w-full h-full min-h-300px"></div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue'
import AMapLoader from '@amap/amap-jsapi-loader'
import { number } from 'vue-types'

let map = null
const emits = defineEmits(['ready'])

onMounted(() => {
  window._AMapSecurityConfig = {
    securityJsCode: import.meta.env.VITE_AMAP_CODE
  }
  AMapLoader.load({
    key: import.meta.env.VITE_AMAP_KEY, // 申请好的Web端开发者Key，首次调用 load 时必填
    version: '2.0', // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
    plugins: ['AMap.Scale'] //需要使用的的插件列表，如比例尺'AMap.Scale'，支持添加多个如：['...','...']
  })
    .then((AMap) => {
      map = new AMap.Map('map-container', {
        // 设置地图容器id
        viewMode: '2D', // 是否为3D地图模式
        zoom: 18, // 初始化地图级别
        center: [116.397428, 39.90923] // 初始化地图中心点位置
      })
      emits('ready')
    })
    .catch((e) => {})
})

onUnmounted(() => {
  map?.destroy()
})

const initMarker = (lng, lat, address) => {
  map.setCenter([lng, lat], 18)
  const marker = new AMap.Marker({
    position: new AMap.LngLat(lng, lat), //经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
    title: address
  })
  map.add(marker)

  const infoWindow = new AMap.InfoWindow({
    content: address,
    anchor: 'bottom-center',
    offset: new AMap.Pixel(50, -50)
  })
  marker.on('click', (e) => {
    infoWindow.open(map, new AMap.LngLat(lng, lat))
  })
}

defineExpose({
  initMarker
})
</script>
