<template>
  <el-dialog v-model="visible" title="提示" width="500px" :close-on-press-escape="false" :close-on-click-modal="false" destroy-on-close @close="onClose">
    <div class="r-p-b-20">
      <div class="r-m-b-10">保存后，该老人的信息将不纳入饱和度统计</div>
      <p class="r-m-b-10" v-for="(item, index) in tipList" :key="index">
        <span class="font-bold">{{ item.name }}：</span>
        <span>{{ item.msg }}</span>
      </p>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="onClose">取消</el-button>
        <el-button type="primary" @click="onSubmit" :loading="loading">确认</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
const emits = defineEmits(['confirm'])
const visible = ref(false)

/* 取消 保存操作 */
const loading = ref(false)
const onClose = () => {
  visible.value = false
}
const onSubmit = async () => {
  loading.value = true
  visible.value = false
  emits('confirm')
  loading.value = false
}
interface tipObject {
  name: string
  msg: string
}
const tipList = ref<tipObject[]>([])
async function show(data: any = []) {
  tipList.value = data
  visible.value = true
}
defineExpose({
  show
})
</script>
