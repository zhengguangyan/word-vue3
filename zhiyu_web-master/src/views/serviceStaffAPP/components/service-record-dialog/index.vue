<template>
  <el-dialog v-model="visibleFlag" title="预览基本信息" width="500px" :close-on-press-escape="false" :close-on-click-modal="false" destroy-on-close @close="onClose">
    <div class="r-p-b-20">
      <div class="item-box">
        <div class="item-title">添加时间</div>
        <div class="item-content">{{ form.createTime }}</div>
      </div>
      <div class="item-box">
        <div class="item-title">操作人</div>
        <div class="item-content">{{ form.creatorName }}</div>
      </div>
      <div class="item-box">
        <div class="item-title">方式</div>
        <div class="item-content">{{ form.callModeName }}</div>
      </div>
      <div class="item-box">
        <div class="item-title">状态</div>
        <div class="item-content">{{ form.callRecordComment }}</div>
      </div>
      <div class="item-box">
        <div class="item-title">详细内容</div>
        <div class="item-content">{{ form.detailContent }}</div>
      </div>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" :loading="loading" @click="onClose">确认</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script lang="ts" setup>
import { ref, reactive } from 'vue'

const visibleFlag = ref(false)

const loading = ref(false)

function show(data) {
  Object.assign(form, data)
  visibleFlag.value = true
}

function onClose() {
  visibleFlag.value = false
}

const formDefault = reactive({})

let form = reactive<any>({ ...formDefault })

const formRef = ref()

defineExpose({
  show
})
</script>
<style scoped>
:deep(.el-form-item) {
  margin-bottom: 0px !important;
}
</style>
