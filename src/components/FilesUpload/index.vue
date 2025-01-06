<template>
  <div class="files-upload">
    <input type="file" v-show="false" ref="inputFileRef" multiple @change="handleChange" :accept="accepts" />
    <div class="upload-file-btn" @click="handleUploadClick">
      <Icon :icon="loading ? 'ep:loading' : 'ep:plus'" :size="14" />
      <span class="r-m-l-4">{{ btnName }}</span>
    </div>
    <div class="color999 r-font-12 r-m-t-10 line-height-1" v-if="tips">{{ tips }}</div>
    <ul class="file-ul">
      <li class="file-li line-1" v-for="(item, index) in props.modelValue" :key="item.id" :title="item.originalName">
        {{ item.originalName }}<Icon icon="ep:close" class="close-btn" @click="handleRemove(index)" />
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, PropType, computed } from 'vue'
import { service } from '@/config/axios/service'
import { ElMessage } from 'element-plus'

const props = defineProps({
  tips: { type: String, default: '' },
  size: { type: Number, default: 5 },
  limit: { type: Number, default: 10 },
  disabled: { type: Boolean, default: false },
  btnName: { type: String, default: '上传附件' },
  modelValue: { type: Array as PropType<FileItem[]>, required: true },
  accept: {
    type: Array as PropType<string[]>,
    default: () => [
      'image/jpg',
      'image/jpeg',
      'image/png',
      'application/zip',
      'application/rar',
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
      'application/x-zip-compressed'
    ]
  }
})

const accepts = computed(() => props.accept.join(','))

const emit = defineEmits(['update:modelValue'])
const loading = ref(false)
const inputFileRef = ref<HTMLInputElement>()
const handleUploadClick = () => {
  if (props.disabled) return
  if (props.modelValue.length >= props.limit) return ElMessage.error(`最多支持${props.limit}个文件`)
  inputFileRef.value?.click()
}

const handleChange = async (e: Event) => {
  const files = (e.target as HTMLInputElement).files
  if (files === null || (files !== null && files.length === 0)) return
  if (!handleCheck(files)) return
  try {
    loading.value = true
    const requestList: Promise<any>[] = []
    for (let i = 0; i < files.length; i++) {
      const formData = new FormData()
      formData.append('file', files[i])
      requestList.push(
        service({
          method: 'POST',
          url: '/minio/endpoint/uploadToSysAttach',
          data: formData
        })
      )
    }
    ;(e.target as HTMLInputElement).value = '' // 清空已选文件
    const dataList = await Promise.all(requestList)
    const list = [...props.modelValue]
    dataList.forEach((item: any) => {
      list.push(item.data as FileItem)
    })
    emit('update:modelValue', list)
    loading.value = false
  } catch {
    loading.value = false
  }
}

const handleCheck = (files: FileList) => {
  if (files.length + props.modelValue.length >= props.limit) return ElMessage.error(`最多支持${props.limit}个文件`)
  for (let i = 0; i < files.length; i++) {
    const fileType = files[i].name.endsWith('.rar') ? 'application/rar' : files[i].type
    if (!props.accept.includes(fileType)) {
      ElMessage.error('仅支持上传Word、Excel、PDF、zip、rar、JPG、PNG格式文件')
      return false
    }
    if (files[i].size / 1024 / 1024 > props.size) {
      ElMessage.error(`上传文件大小不得超过${props.size}Mb`)
      return false
    }
  }
  return true
}
const handleRemove = (index: number) => {
  const list = [...props.modelValue]
  list.splice(index, 1)
  emit('update:modelValue', list)
}
</script>

<style lang="less" scoped>
.files-upload {
  width: 100%;
  .upload-file-btn {
    display: inline-flex;
    align-items: center;
    padding: 0 20px;
    height: 32px;
    border: 1px solid var(--el-color-primary);
    background-color: #fff;
    color: var(--el-color-primary);
    border-radius: 4px;
    transition: background-color 0.2s;
    cursor: pointer;
    &:hover {
      background-color: rgba(var(--el-color-primary-rgb), 0.05);
    }
  }
  .file-ul {
    margin-top: 10px;
  }
  .file-li {
    max-width: 100%;
    height: 24px;
    border-radius: 4px;
    position: relative;
    padding: 0 34px 0 10px;
    background-color: #f5f7fa;
    color: #303133;
    line-height: 24px;
    margin-bottom: 8px;
    &:last-child {
      margin-bottom: 0;
    }
  }
  .close-btn {
    cursor: pointer;
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 12px;
    transition: color 0.2s;
    &:hover {
      color: var(--el-color-primary);
    }
  }
}
</style>
