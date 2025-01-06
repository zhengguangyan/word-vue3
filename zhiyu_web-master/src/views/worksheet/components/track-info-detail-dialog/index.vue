<template>
  <el-dialog v-model="visibleFlag" title="跟踪信息详情" width="500px" @close="onClose" :close-on-press-escape="false" :close-on-click-modal="false">
    <el-descriptions :column="1" border class="detail">
      <el-descriptions-item label="跟踪时间">{{ trackInfo.time }} </el-descriptions-item>
      <el-descriptions-item label="方式">
        {{ trackInfo.callMode == '1' ? '呼入' : '呼出' }}
      </el-descriptions-item>
      <el-descriptions-item label="详情内容">
        {{ trackInfo.detailContent }}
      </el-descriptions-item>
      <el-descriptions-item label="受理起止时间">
        {{ formatDateString(trackInfo.startTime, 'YYYY-MM-DD HH:mm') + ' ~ ' + formatDateString(trackInfo.endTime, 'YYYY-MM-DD HH:mm') }}
      </el-descriptions-item>
      <el-descriptions-item label="客服姓名">
        {{ trackInfo.userName }}
      </el-descriptions-item>
      <el-descriptions-item label="通话时长">
        {{ trackInfo.talkMinute }}
      </el-descriptions-item>
      <el-descriptions-item>
        <el-button type="primary" @click="onClose">确认</el-button>
      </el-descriptions-item>
    </el-descriptions>
  </el-dialog>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import { formatDateString } from '@/utils'
import { getRecordDetail } from '@/api/worksheet/index'

const visibleFlag = ref(false)

const trackInfo = ref()
async function show(id) {
  const result = await getRecordDetail(id)
  trackInfo.value = result.data
  visibleFlag.value = true
}

function onClose() {
  visibleFlag.value = false
}

defineExpose({
  show
})
</script>
<style>
.detail .el-descriptions__cell {
  background: none !important;
  border: 0 !important;
}
.detail .el-descriptions__label {
  width: 120px;
}
</style>
