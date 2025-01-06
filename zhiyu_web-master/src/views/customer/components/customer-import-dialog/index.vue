<template>
  <el-dialog v-model="visibleFlag" title="批量导入客户信息" width="500px" :close-on-press-escape="false" :close-on-click-modal="false" destroy-on-close @close="onClose">
    <div v-loading="loading">
      <p>您当前所属区域为：{{ areaName }}</p>
      <p>数据权限为：支持查看 所属项目为 {{ areaName }} 的客户信息</p>
      <div class="upload-header">
        <span>请先下载Excel模板，按模板填写后上传</span>
        <el-link :icon="Download" type="primary" @click="emits('download-click')"> 下载导入模板 </el-link>
      </div>
      <el-upload
        :drag="!file"
        ref="uploadRef"
        :headers="header"
        :data="areaCode"
        :auto-upload="false"
        action="/api/bulkImport/web/importData"
        :on-success="fileSuccess"
        :on-change="fileChange"
        :on-remove="fileRemove"
        :accept="'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'"
      >
        <el-icon v-if="!file" class="el-icon--upload"><upload-filled /></el-icon>
        <div v-if="!file" class="el-upload__text">点击或拖拽文件到这里上传</div>
      </el-upload>
      <div class="el-upload__tip">
        <p>注意：1、支持新增、更新客户信息，更新只更新平台的空值字段，有值字段不予更新</p>
        <p style="text-indent: 3em">2、建议单次导入不得超过1000条</p>
        <p style="text-indent: 3em">3、批量导入所需时间较长，请尽量选择空闲时间导入</p>
        <p style="text-indent: 3em">4、仅支持导入用户当前数据权限范围内的数据</p>
        <p style="text-indent: 3em">5、详细导入规则及要求，请下载导入模板查看</p>
      </div>
      <!-- <div>{{ file }}</div>s -->
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="onClose">取消</el-button>
        <el-button type="primary" @click="onSubmit" :loading="loading">导入</el-button>
      </span>
    </template>
  </el-dialog>

  <el-dialog v-model="resultFlag" title="批量导入结果" width="500px" :close-on-press-escape="false" :close-on-click-modal="false" destroy-on-close>
    <p>{{ resultMsg.msg }}</p>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="downResult" v-if="resultMsg.failureNum">下载失败数据</el-button>
        <el-button type="primary" @click="onClose">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { Download, UploadFilled } from '@element-plus/icons-vue'
import Cookies from 'js-cookie'
import { useCache } from '@/hooks/web/useCache'
import { ElMessage, UploadInstance } from 'element-plus'
import { downloadAndDelete } from '@/api/customer'
import download from '@/utils/download'

const { wsCache } = useCache()

const emits = defineEmits(['download-click', 'reload-list'])

const uploadRef = ref<UploadInstance>()

const visibleFlag = ref(false)

const resultFlag = ref(false)

const resultMsg = ref<any>({})

const loading = ref(false)

function show() {
  visibleFlag.value = true
}

const header = ref({
  Authorization: Cookies.get('TokenKey')
})

const areaCode = ref({
  areaCode: wsCache.get('areaCode'),
  areaProjectCode: wsCache.get('areaProjectCode')
})

const areaName = ref(wsCache.get('areaName'))

const file = ref<any>()

function onClose() {
  visibleFlag.value = false
  resultFlag.value = false
  loading.value = false
  file.value = null
}

const onSubmit = async () => {
  if (!file.value) {
    ElMessage.error('请选择上传导入文件')
    return
  }
  loading.value = true
  uploadRef.value!.submit()
}

const fileChange = (data) => {
  file.value = data
}

const fileRemove = () => {
  file.value = null
}

const fileSuccess = (res) => {
  loading.value = false
  if (res.code == 200) {
    ElMessage.success('导入完成')
    visibleFlag.value = false
    resultFlag.value = true
    resultMsg.value = res.data
    file.value = null
  } else {
    ElMessage.error(res.msg)
    uploadRef.value!.clearFiles()
    setTimeout(() => {
      file.value = null
    }, 0)
  }
  emits('reload-list')
}

const downResult = async () => {
  const res = await downloadAndDelete(resultMsg.value.fileName)
  download.excel(res.data, resultMsg.value.fileName)
}

defineExpose({
  show
})
</script>
<style>
.upload-header {
  margin-top: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
}
.el-upload__tip {
  font-size: 12px;
  color: #ff9e4d;
}
</style>

<style scoped>
:deep(.el-upload-list__item) {
  padding-bottom: 10px;
}
</style>
