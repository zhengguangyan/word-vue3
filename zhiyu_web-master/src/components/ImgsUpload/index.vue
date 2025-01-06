<template>
  <ul class="my-imgs-upload" :style="{ 'grid-template-columns': `repeat(auto-fill, ${_width})` }">
    <li class="my-img-li" v-for="(item, index) in modelValue" :key="item.id" :style="{ height: _height }">
      <el-image :src="config.base_img.dev + item.path" :preview-src-list="srcList" :initial-index="index" preview-teleported fit="fill"></el-image>
      <div class="remove-btn" @click="handleRemove(index)" v-if="!disabled && !preview">
        <Icon icon="ep:close" color="#fff" />
      </div>
    </li>
    <li v-if="modelValue.length < limit && !preview" class="my-img-li upload-li" :class="{ disabled, loading }" @click="handleInputClick" :style="{ height: _height }">
      <Icon :icon="loading ? 'ep:loading' : 'ep:plus'" :size="24" />
    </li>
    <li class="img-limit">{{ modelValue.length }}/{{ limit }}</li>
    <input type="file" v-show="false" accept="image/jpg, image/png, image/jpeg, image/bmp, image/gif, image/webp" ref="inputFileRef" multiple @change="handleImgChange" />
  </ul>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { ref, PropType, computed } from 'vue'
import { service } from '@/config/axios/service'
import { config } from '@/config/axios/config'

const props = defineProps({
  width: { type: [Number, String], default: '80px' },
  height: { type: [Number, String], default: '80px' },
  limit: { type: Number, default: 5 }, // 限制上传数量
  size: { type: Number, default: 5 },
  disabled: { type: Boolean, default: false },
  preview: { type: Boolean, default: false },
  modelValue: { type: Array as PropType<FileItem[]>, required: true }
})
const _width = computed(() => {
  if (typeof props.width === 'number') return `${props.width}px`
  const value = props.width.replace('px', '')
  if (Number(value).toString() === value) return `${value}px`
  return '80px'
})
const _height = computed(() => {
  if (typeof props.height === 'number') return `${props.height}px`
  const value = props.height.replace('px', '')
  if (Number(value).toString() === value) return `${value}px`
  return '80px'
})

const srcList = computed(() => props.modelValue.map((item) => config.base_img.dev + item.path))

const emit = defineEmits(['update:modelValue', 'change'])
const loading = ref(false)
const inputFileRef = ref<HTMLInputElement>()
const handleInputClick = () => {
  if (props.disabled) return
  if (props.modelValue.length > props.limit) return ElMessage.error(`最多上传${props.limit}张图片`)
  inputFileRef.value?.click()
}
const imageTypes = ['image/jpg', 'image/png', 'image/jpeg', 'image/bmp', 'image/gif', 'image/webp']
const handleImgChange = async (e: Event) => {
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
    ;(e.target as HTMLInputElement).value = '' // 清空已选图片
    const dataList = await Promise.all(requestList)
    const list = [...props.modelValue]
    dataList.forEach((item: any) => {
      list.push(item.data as FileItem)
    })
    emit('update:modelValue', list)
    emit('change')
    loading.value = false
  } catch {
    loading.value = false
  }
}

const handleCheck = (files: FileList) => {
  if (files.length + props.modelValue.length > props.limit) return ElMessage.error(`最多上传${props.limit}张图片`)
  for (let i = 0; i < files.length; i++) {
    if (!imageTypes.includes(files[i].type)) {
      ElMessage.error('仅支持上传jpg, jpeg, png, bmp, webp, gif格式的图片')
      return false
    }
    if (files[i].size / 1024 / 1024 > props.size) {
      ElMessage.error(`上传图片大小不得超过${props.size}Mb`)
      return false
    }
  }
  return true
}
const handleRemove = (index: number) => {
  const list = [...props.modelValue]
  list.splice(index, 1)
  emit('update:modelValue', list)
  emit('change')
}
</script>

<style lang="less">
.my-imgs-upload {
  width: 100%;
  display: grid;
  gap: 10px;
  .my-img-li {
    position: relative;
    border-radius: 4px;
  }
  .upload-li {
    cursor: pointer;
    border: 1px solid var(--el-color-primary);
    color: var(--el-color-primary);
    transition: background-color 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    &:hover {
      background-color: rgba(var(--el-color-primary-rgb), 0.05);
    }
    &.disabled {
      cursor: not-allowed;
      background-color: transparent;
      color: rgba(var(--el-color-primary-rgb), 0.6);
      border-color: rgba(var(--el-color-primary-rgb), 0.6);
    }
  }
  .el-image {
    width: 100%;
    height: 100%;
    border-radius: 4px;
  }
  .el-image__inner {
    border-radius: 4px;
    display: block;
  }
  .remove-btn {
    width: 20px;
    height: 20px;
    background-color: rgba(0, 0, 0, 0.6);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    position: absolute;
    top: 0;
    right: 0;
    z-index: 2;
  }
}
.img-limit {
  color: #ccc;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}
</style>
