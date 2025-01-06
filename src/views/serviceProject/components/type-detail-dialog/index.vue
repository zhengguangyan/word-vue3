<template>
  <el-dialog destroy-on-close v-model="visibleFlag" title="查看服务类别" width="500px" append-to-body @close="onClose" :close-on-press-escape="false" :close-on-click-modal="false">
    <div class="scrollbarHide r-p-b-20">
      <div class="item-box">
        <div class="item-title">类别名称</div>
        <div class="item-content">{{ detail?.name }}</div>
      </div>
      <div class="item-box">
        <div class="item-title">上级分类</div>
        <div class="item-content">{{ parentIdList.find((item) => item.value === detail?.parentId)?.label }}</div>
      </div>
      <div class="item-box">
        <div class="item-title">标识码</div>
        <div class="item-content">{{ detail?.code }}</div>
      </div>
      <div class="item-box" v-if="detail?.sort">
        <div class="item-title">排序码</div>
        <div class="item-content">{{ detail?.sort }}</div>
      </div>
      <div class="item-box">
        <div class="item-title">描述</div>
        <div class="item-content">{{ detail?.remark }}</div>
      </div>
      <div class="item-box" v-if="detail?.isShowApp">
        <div class="item-title">是否在子女版APP显示：</div>
        <div class="item-content">{{ detail?.isShowApp === '1' ? '是' : '否' }}</div>
      </div>
      <div class="item-box">
        <div class="item-title">图标</div>
        <div class="item-content">
          <el-image :src="config.base_img.dev + detail.iconUrl" preview-teleported :preview-src-list="[config.base_img.dev + detail.iconUrl]" fit="fill" style="width: 80px;height: 80px;"></el-image>
        </div>
      </div>
      <div class="item-box" v-if="detail?.updateTime">
        <div class="item-title">更新时间</div>
        <div class="item-content">{{ detail?.updateTime }}</div>
      </div>
      <div class="item-box">
        <div class="item-title">创建时间</div>
        <div class="item-content">{{ detail?.createTime }}</div>
      </div>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="onClose">关闭</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script lang="ts" setup>
import { getServeTypeDetail, getServeTypeTree } from '@/api/serviceProvider'
import { config } from '@/config/axios/config'
import { ref } from 'vue'

const emits = defineEmits(['reload-list'])

const visibleFlag = ref(false)

const detail = ref<any>({})

const show = async (data) => {
  getList()
  getData(data.id)
  visibleFlag.value = true
  // config.base_img.dev
}

const onClose = () => {
  detail.value = {}
  visibleFlag.value = false
}

const getData = async (id) => {
  const { data } = await getServeTypeDetail(id)
  detail.value = data
}

const parentIdList = ref<any>([])

const getList = async () => {
  const res = await getServeTypeTree()
  parentIdList.value = mapList(res.data)
  parentIdList.value.unshift({ value: 0, label: '作为顶级分类' })
}

const mapList = (data: any) => {
  return data.map((item: any) => {
    if (item.children) {
      return {
        value: item.id,
        label: item.name,
        children: mapList(item.children)
      }
    } else {
      return {
        value: item.id,
        label: item.name
      }
    }
  })
}

defineExpose({
  show
})
</script>
<style lang="less" scoped>
:deep(.el-upload--picture-card) {
  width: 60px !important;
  height: 60px !important;
}
.el-upload__tip {
  color: #ccc;
}
.avatar-uploader-icon {
  background-color: #fff;
  font-size: 28px;
  color: #8c939d;
  width: 80px;
  height: 80px;
  text-align: center;
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
}
.avatar {
  width: 80px;
  height: 80px;
  display: block;
}

.item-box {
  display: flex;
  font-size: 14px;
  color: var(--main-text-color);
  margin-bottom: 16px;
  .item-title {
    flex-grow: 0;
    flex-shrink: 0;
  }
  .item-content {
    width: calc(100% -94px);
  }
}
</style>
