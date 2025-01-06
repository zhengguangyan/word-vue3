<template>
  <el-dialog v-model="visibleFlag" title="选择派单方式" width="500px" :close-on-press-escape="false" :close-on-click-modal="false" destroy-on-close @close="onClose">
    <p>
      <el-button type="primary" style="width: 100%; height: 40px; line-height: 40px" @click="showSellerSelectDialog"> 选择服务商 </el-button>
    </p>
    <p class="r-m-tb-20">
      <el-button type="primary" style="width: 100%; height: 40px; line-height: 40px" @click="showStaffSelectDialog"> 选择服务人员 </el-button>
    </p>
    <p v-if="orderInfo.oldOperatorSellerName">历史派单的服务人员：{{ orderInfo.oldOperatorSellerName }}（按时间先后排序）</p>
  </el-dialog>
  <SellerSelectDialog ref="sellerSelectDialog" @reload-list="reload" />
  <StaffSelectDialog ref="staffSelectDialog" @reload-list="reload" />
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import SellerSelectDialog from '../seller-select-dialog/index.vue'
import StaffSelectDialog from '../staff-select-dialog/index.vue'

const emits = defineEmits(['reload-list'])

const visibleFlag = ref(false)

const orderInfo = ref({ oldOperatorSellerName: '' })
const statusInfo = ref({})

const reload = () => {
  emits('reload-list')
}

function show(data, id) {
  orderInfo.value = data
  statusInfo.value = id
  visibleFlag.value = true
}

function onClose() {
  orderInfo.value = { oldOperatorSellerName: '' }
  statusInfo.value = {}
  visibleFlag.value = false
}

const sellerSelectDialog = ref()
function showSellerSelectDialog() {
  sellerSelectDialog.value.show(orderInfo.value, statusInfo.value)
  onClose()
}

const staffSelectDialog = ref()
function showStaffSelectDialog() {
  staffSelectDialog.value.show(orderInfo.value, statusInfo.value)
  onClose()
}

defineExpose({
  show
})
</script>
