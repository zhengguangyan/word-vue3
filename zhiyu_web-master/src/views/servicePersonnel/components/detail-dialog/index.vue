<template>
  <el-dialog v-model="visibleFlag" title="服务人员信息预览" width="976px" @closed="onClose" :close-on-press-escape="false" :close-on-click-modal="false">
    <div>
      <h2 class="title"> 基础信息 </h2>
      <div class="info-list r-m-b-24">
        <div class="detail-info-item">
          <span class="detail-info-item-label">姓名</span>
          <span class="detail-info-item-content">{{ detailData?.name }}</span>
        </div>
        <div class="detail-info-item">
          <span class="detail-info-item-label">年龄</span>
          <span class="detail-info-item-content">{{ detailData?.age }}</span>
        </div>
        <div class="detail-info-item">
          <span class="detail-info-item-label">性别</span>
          <span class="detail-info-item-content">{{ renderDict(detailData?.sex, 'sys_user_sex') }}</span>
        </div>
        <div class="detail-info-item">
          <span class="detail-info-item-label">联系电话</span>
          <span class="detail-info-item-content">{{ maskPhoneNumber(detailData?.mobilePhone) }}</span>
        </div>
        <div class="detail-info-item">
          <span class="detail-info-item-label">所属部门</span>
          <span class="detail-info-item-content">{{ detailData?.belongDepartMentName }}</span>
        </div>
        <div class="detail-info-item">
          <span class="detail-info-item-label">角色</span>
          <span class="detail-info-item-content">{{ detailData?.roleNames }}</span>
        </div>
      </div>

      <h2 class="title"> 个人信息 </h2>
      <div class="info-list r-m-b-24">
        <div class="detail-info-item">
          <span class="detail-info-item-label">户籍</span>
          <span class="detail-info-item-content">{{ detailData?.address }}</span>
        </div>
        <div class="detail-info-item">
          <span class="detail-info-item-label">出生日期</span>
          <span class="detail-info-item-content">{{ detailData?.birthday }}</span>
        </div>
        <div class="detail-info-item">
          <span class="detail-info-item-label">专业技能(特长)</span>
          <span class="detail-info-item-content">{{ renderDict(detailData?.domesticDemand, 'profession_skill') }}</span>
        </div>
        <div class="detail-info-item">
          <span class="detail-info-item-label">荣誉证书</span>
          <span class="detail-info-item-content">{{ renderDict(detailData?.livingDemand, 'certificate') }}</span>
        </div>
        <div class="detail-info-item item-100">
          <span class="detail-info-item-label">个人备注</span>
          <span class="detail-info-item-content">{{ detailData?.remark }}</span>
        </div>
      </div>

      <h2 class="title"> 服务信息 </h2>
      <div class="info-list r-m-b-24">
        <div class="detail-info-item item-100">
          <span class="detail-info-item-label">服务内容(服务子项)</span>
          <span class="detail-info-item-content">{{ detailData?.serveOptionNames }}</span>
        </div>
        <div class="detail-info-item item-100">
          <span class="detail-info-item-label">服务范围</span>
          <span class="detail-info-item-content">{{ detailData?.serveRange }}</span>
        </div>
        <div class="detail-info-item item-100">
          <span class="detail-info-item-label">常驻地址</span>
          <span class="detail-info-item-content">{{ detailData?.resiCompleAddr }}</span>
        </div>
      </div>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="onClose">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { getOperatorDetail } from '@/api/servicePersonnel'
import { maskPhoneNumber } from '@/utils'
import { ref } from 'vue'

const emits = defineEmits(['on-close'])

const props = defineProps({
  dict: {
    type: Array,
    default: null
  }
})

const filterDict = (key: any) => {
  return (props.dict?.find((item: any) => item.type == key) as any)?.list
}

const renderDict = (key: any, dict: any) => {
  if (!key) {
    return
  }
  return filterDict(dict)
    ?.filter((item: any) => key.includes(item.value))
    .map((item: any) => item?.label)
    .join('，')
}

const visibleFlag = ref(false)

const show = (id) => {
  visibleFlag.value = true
  getDetail(id)
}

const detailData = ref<any>()

const getDetail = async (id) => {
  const { data } = await getOperatorDetail(id)
  detailData.value = data
}

const onClose = () => {
  detailData.value = {}
  visibleFlag.value = false
}

defineExpose({
  show
})
</script>

<style scoped lang="less">
.title {
  width: 100%;
  font-size: 16px;
  margin-bottom: 18px;
}
</style>
