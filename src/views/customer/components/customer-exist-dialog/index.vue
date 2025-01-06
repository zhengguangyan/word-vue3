<template>
  <el-dialog
    v-model="visibleFlag"
    title="该客户已经存在"
    width="500px"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
  >
    <span>输入的客户信息已存在，请勿重复创建，可直接前往查看。</span>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="onClose">取消</el-button>
        <el-button type="primary" @click="pushDetail">前往编辑</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
const { push } = useRouter()

const emits = defineEmits(['on-close'])

const props = defineProps({
  existId: {
    type: String,
    default: null,
  }
})

const visibleFlag = ref(false)


function show() {
  visibleFlag.value = true
}

function onClose() {
  visibleFlag.value = false
}

const pushDetail = () => {
  visibleFlag.value = false
  emits('on-close')
  push(`/customer/edit?id=${props.existId}`)
}

defineExpose({
  show
})
</script>
