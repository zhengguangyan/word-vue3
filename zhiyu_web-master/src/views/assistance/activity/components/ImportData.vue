<template>
  <el-dialog v-model="visible" title="批量导入老人信息" append-to-body width="580px" :close-on-click-modal="false" draggable @close="handleClose" class="activity-import-dialog">
    <div class="flex row-between">
      <span>请先下载Excel模板，按模板填写后上传</span>
      <span class="flex primary-color pointer" @click="handleDownload"><Icon :icon="downloading ? 'ep:loading' : 'ep:download'" :color="primaryColor" />下载导入模板</span>
    </div>
    <div class="center-box">
      <div class="upload-box" v-if="!file">
        <input type="file" class="input-file" ref="inputRef" accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel" @change="handleChange" />
        <Icon icon="ep:upload-filled" :color="primaryColor" :size="48" />
        <span class="r-m-t-12">
          <span class="primary-color">点击</span>
          <span class="color666">或拖拽文件到这里上传</span>
        </span>
      </div>
      <div class="file-box" v-else>
        <div class="flex">
          <Icon icon="svg-icon:icon_excel" color="#2fa556" :size="48" />
          <div class="r-m-l-8">
            <h4 class="font-bold r-font-16 line-1" style="max-width: 320px">{{ file.name }}</h4>
            <span class="color999 r-font-12">{{ fileSize }}</span>
          </div>
        </div>
        <div style="color: #e96848" class="flex pointer" @click="file = null"><Icon icon="ep:refresh-right" color="#E96848" />重新上传</div>
      </div>
    </div>
    <div class="primary-color tips-box">
      <div>1、仅支持导入客户管理中已存在的老人<br />2、详细导入规则，请下载导入模板查看</div>
    </div>
    <template #footer>
      <el-button plain @click="handleClose">取消</el-button>
      <el-button type="primary" :disabled="!file" @click="handleImport">导入</el-button>
    </template>
    <el-dialog v-model="errorVisible" :title="importInfo.title" append-to-body width="500px" :close-on-click-modal="false" @close="errorVisible = false" class="activity-import-result-dialog">
      <div class="r-p-b-20" v-if="importInfo.title === '批量导入表格不规范'">请按批量导入模板修正表格后重新导入</div>
      <div class="r-p-b-20" v-else>
        老人信息导入成功 <span class="primary-color">{{ importInfo.success }}条</span>，导入失败 <span class="error-color">{{ importInfo.fail }}条</span>！
      </div>
      <template #footer>
        <el-button plain :loading="downloading" @click="handleDownload" v-if="importInfo.title === '批量导入表格不规范'">下载导入模板</el-button>
        <el-button plain :loading="downloadErrorLoading" @click="downResult" v-if="importInfo.title.includes('部分成功') || importInfo.title.includes('导入失败')">下载失败数据</el-button>
        <el-button type="primary" @click="errorVisible = false">确定</el-button>
      </template>
    </el-dialog>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import { useAppStore } from '@/store/modules/app'
import { getTemplate, importData } from '@/api/assistance/activity'
import { ElLoading, ElMessage } from 'element-plus'
import { useCache } from '@/hooks/web/useCache'
import { downloadAndDelete } from '@/api/customer'
import download from '@/utils/download'

const { wsCache } = useCache()
const areaCode = wsCache.get('areaCode')
const areaProjectCode = wsCache.get('areaProjectCode')

const appStore = useAppStore()
const primaryColor = computed(() => appStore.getTheme.elColorPrimary)

const visible = ref(false)
const open = () => {
  visible.value = true
}
defineExpose({ open })

const handleClose = () => {
  file.value = null
  visible.value = false
}

const downloading = ref(false)
const handleDownload = async () => {
  if (downloading.value) return
  try {
    downloading.value = true
    const { data } = await getTemplate()
    ElMessage.error('下载成功')
    download.excel(data, '老人名单导入模板.xls')
  } finally {
    downloading.value = false
  }
}

const inputRef = ref<HTMLInputElement>()
const file = ref<File | null>(null)
const fileSize = computed(() => {
  if (!file.value) return '0kb'
  return Math.floor(file.value.size / 1024) + 'kb'
})
const handleChange = (e: any) => {
  if (!e.target.files) {
    file.value = null
    return
  }
  file.value = e.target.files[0] as File
}

const emit = defineEmits(['updateCustomers'])
const importInfo = reactive({
  customerInfo: [] as any[],
  failedFile: '',
  msg: '',
  title: '',
  fail: 0,
  success: 0
})
const handleImport = async () => {
  const loading = ElLoading.service({
    target: '.activity-import-dialog',
    text: '导入中，请稍候...'
  })
  try {
    const formData = new FormData()
    formData.append('file', file.value as File)
    formData.append('areaCode', areaCode)
    formData.append('areaProjectCode', areaProjectCode)
    const { data } = await importData(formData)
    loading.close()
    Object.assign(importInfo, data)
    if (data.customerInfo.length) {
      emit('updateCustomers', data.customerInfo)
      handleClose()
    }
    errorVisible.value = true
  } catch {
    loading.close()
  }
}

const errorVisible = ref(false)
const downloadErrorLoading = ref(false)
const downResult = async () => {
  if (downloadErrorLoading.value) return
  try {
    downloadErrorLoading.value = true
    const res = await downloadAndDelete(importInfo.failedFile)
    download.excel(res.data, importInfo.failedFile)
    ElMessage.success('已下载失败数据')
  } finally {
    downloadErrorLoading.value = false
  }
}
</script>

<style lang="less">
.activity-import-dialog {
  .center-box {
    margin: 12px 0 20px 0;
    border-radius: 4px;
    background: #ffffff;
    border: 1px solid #f5f3f0;
  }
  .upload-box {
    padding: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
  }
  .input-file {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 10;
    opacity: 0;
    cursor: pointer;
  }
  .file-box {
    padding: 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .tips-box {
    display: flex;
    font-size: 12px;
    line-height: 2;
    padding-bottom: 20px;
    &::before {
      content: '注意:';
      margin-right: 10px;
    }
  }
}
</style>
