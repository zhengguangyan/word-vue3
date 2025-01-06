<template>
  <div v-if="content" @mouseenter="handleShowTooltip($event)">
    <el-tooltip
      :disabled="showTooltip"
      class="box-item"
      effect="dark"
      :content="content"
      placement="top"
    >
      <div class="line-1" :style="{minWidth:width}">{{ content }}</div>
    </el-tooltip>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
let showTooltip = ref(true)
defineProps({
  // icon name
  content: { type: String, default: "" },
  effect:{type: String, default: "dark"},
  placement:{type: String, default: "top"},
  width:{type: String, default: "60px"},
})

 //超出隐藏的才会移入显示tooltip
const handleShowTooltip = (event) =>{
  const cell = event.target.querySelector('.el-tooltip__trigger')
  showTooltip.value = cell.scrollWidth === cell.offsetWidth
}

</script>