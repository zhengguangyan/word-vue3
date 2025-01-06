<template>
  <el-dialog v-model="visibleFlag" title="查看添加/移除客户名单" width="1000px" :close-on-press-escape="false" :close-on-click-modal="false" destroy-on-close @close="onClose">
    <div class="text-[#666] mb-10px">{{ statTitle }}</div>
    <el-table
      class="r-m-b-20"
      :data="servePacketRecordDetailData"
      header-row-class-name="table-header"
      :style="{
        width: 'calc(100vw - 255px)',
        border: '1px solid #f5f3f0',
        borderRadius: '4px'
      }"
      max-height="200"
    >
      <el-table-column type="index" width="60" />
      <el-table-column show-overflow-tooltip prop="act" min-width="160" label="操作" />
      <el-table-column show-overflow-tooltip prop="customerId" min-width="160" label="客户ID" />
      <el-table-column show-overflow-tooltip prop="customerName" min-width="170" label="姓名" />
      <el-table-column show-overflow-tooltip prop="sex" min-width="80" label="性别">
        <template #default="{ row }">
          {{ renderDict(row.sex, 'vols_sex') }}
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip prop="age" min-width="80" label="年龄" />
      <el-table-column show-overflow-tooltip prop="idcard" min-width="160" label="证件号码" />
    </el-table>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="onClose">关闭</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import { servePacketRecordDetail } from '@/api/servePacket'
import { renderDict } from '@/hooks/web/useDict'

const visibleFlag = ref(false)

function show(id, subTitle) {
  getServePacketRecordList(id)
  statTitle.value = subTitle
  visibleFlag.value = true
}

function onClose() {
  visibleFlag.value = false
}

const statTitle = ref('')

const servePacketRecordDetailData = ref([])
const getServePacketRecordList = async (id) => {
  const res = await servePacketRecordDetail(id)
  servePacketRecordDetailData.value = res.data
}
defineExpose({
  show
})
</script>
<style scoped>
.el-upload__tip {
  color: #ccc;
}
</style>
