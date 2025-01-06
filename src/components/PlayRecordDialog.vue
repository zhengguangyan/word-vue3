<template>
  <el-dialog v-model="visible" title="播放通话录音" width="550px" :close-on-press-escape="false" :close-on-click-modal="false" destroy-on-close @close="onClose">
    <div class="r-p-b-20 content-wrapper">
      <video class="record-video" :src="ruleForm.agentRecordLogUrl" controls autoplay></video>
      <div class="r-m-t-10">
        <span class="info-color">注：谷歌浏览器可能出现不支持播放知信录音的情况，可更换为360或火狐浏览器或者复制录音网址使用浏览器打开进行播放</span>
        <el-button class="r-m-l-5" type="primary" link @click="copy">点击复制音频链接</el-button>
      </div>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="onDel">删除</el-button>
        <el-button @click="onClose">关闭</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { ElMessage, ElMessageBox, Action } from 'element-plus'
import { saveRecord } from '@/api/order'
const props = defineProps({
  requestFun: {
    type: Function,
    default: () => {}
  }
})
const emits = defineEmits(['reload-data'])
const visible = ref(false)
const formDefault = reactive({
  id: undefined,
  agentRecordLogCallId: '',
  agentRecordLogUrl: ''
})
let ruleForm = reactive<any>({ ...formDefault })
const copy = async () => {
  //旧的、兼容性较好的复制方法
  const textarea = document.createElement('textarea')
  textarea.value = ruleForm.agentRecordLogUrl
  document.body.appendChild(textarea)
  textarea.select()
  try {
    document.execCommand('copy')
    ElMessage.success('内容已复制到剪贴板')
    return
  } catch (err) {
    ElMessage.error(`复制失败：${err}`)
    return false
  } finally {
    document.body.removeChild(textarea)
  }
  // try {
  //   await navigator.clipboard.writeText(ruleForm.agentRecordLogUrl)
  //   ElMessage.success('内容已复制到剪贴板')
  // } catch (err) {
  //   ElMessage.error(`复制失败：${err}`)
  // }
}
/* 删除关闭操作 */

// 删除
const onDel = () => {
  ElMessageBox.confirm('确定删除当前录音？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
    center: true
  })
    .then(() => {
      save()
    })
    .catch(() => {})
}
function onClose() {
  visible.value = false
  Object.assign(ruleForm, formDefault)
}

const save = async () => {
  try {
    await props.requestFun({ id: ruleForm.id, agentRecordLogCallId: '' })
    ElMessage.success('操作成功')
    emits('reload-data')
    onClose()
  } finally {
  }
}

function show(data) {
  ruleForm.id = data.id
  ruleForm.agentRecordLogCallId = data.agentRecordLogCallId
  ruleForm.agentRecordLogUrl = data.agentRecordLogUrl
  visible.value = true
}

defineExpose({
  show
})
</script>
<style scoped>
.record-video {
  width: 100%;
  height: 50px;
}
</style>
