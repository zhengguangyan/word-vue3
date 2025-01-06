<template>
  <div class="my-img-upload" :style="{ width: _width, height: _height }">
    <section class="img-upload-btn" :class="{ disabled }" @click="handleInputClick">
      <Icon :icon="loading ? 'ep:loading' : 'ep:plus'" :size="24" />
    </section>
    <section class="my-img-box" v-if="modelValue">
      <el-image :src="modelValue" :preview-src-list="[modelValue]" preview-teleported fit="fill"></el-image>
      <div class="remove-btn" v-if="!disabled" @click="handleRemove">
        <Icon icon="ep:close" color="#fff" />
      </div>
    </section>
    <input type="file" v-show="false" accept="image/jpg, image/png, image/jpeg, image/bmp, image/gif, image/webp" ref="inputFileRef" @change="handleImgChange" />
    <div class="limit-count" :style="{ left: limitCountLeft }" v-if="showLimit">{{ modelValue ? 1 : 0 }}/1</div>
  </div>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { ref, computed } from 'vue'
import { service } from '@/config/axios/service'
import { config } from '@/config/axios/config'

const props = defineProps({
  width: { type: [Number, String], default: '80px' },
  height: { type: [Number, String], default: '80px' },
  size: { type: Number, default: 5 },
  disabled: { type: Boolean, default: false },
  modelValue: { type: String, required: true },
  showLimit: { type: Boolean, default: false } // 是否显示限制0/1
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
// 限制数量left定位值
const limitCountLeft = computed(() => {
  return parseInt(_width.value) + 10 + 'px'
})

const emit = defineEmits(['update:modelValue', 'success', 'remove'])
const loading = ref(false)
const inputFileRef = ref<HTMLInputElement>()
const handleInputClick = () => {
  if (props.disabled) return
  inputFileRef.value?.click()
}
const imageTypes = ['image/jpg', 'image/png', 'image/jpeg', 'image/bmp', 'image/gif', 'image/webp']
const handleImgChange = async (e: Event) => {
  const files = (e.target as HTMLInputElement).files
  if (files === null || (files !== null && files.length === 0)) return
  const file = files[0]
  if (!imageTypes.includes(file.type)) {
    ElMessage.error('仅支持上传jpg, jpeg, png, bmp, webp, gif格式的图片')
    return
  }
  if (file.size / 1024 / 1024 > props.size) {
    ElMessage.error(`上传图片大小不得超过${props.size}Mb`)
    return
  }
  try {
    loading.value = true
    const formData = new FormData()
    formData.append('file', file)
    ;(e.target as HTMLInputElement).value = '' // 清空已选图片
    const { data }: { data: FileItem } = await service({
      method: 'POST',
      url: '/minio/endpoint/uploadToSysAttach',
      data: formData
    })
    data.path = config.base_img.dev + data.path
    emit('update:modelValue', data.path)
    emit('success', data)
    loading.value = false
  } catch {
    loading.value = false
  }
}
const handleRemove = () => {
  emit('update:modelValue', '')
  emit('remove')
}
</script>

<style lang="less">
.my-img-upload {
  position: relative;
  border-radius: 4px;
  .limit-count {
    position: absolute;
    bottom: 0;
    color: #ccc;
  }
  .img-upload-btn {
    width: 100%;
    height: 100%;
    border-radius: 4px;
    border: 1px solid var(--el-color-primary);
    color: var(--el-color-primary);
    transition: background-color 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
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
  .my-img-box {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    border-radius: 4px;
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
</style>
