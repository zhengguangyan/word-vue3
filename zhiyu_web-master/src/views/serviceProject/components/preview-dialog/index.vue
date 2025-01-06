<template>
  <el-dialog destroy-on-close v-model="visibleFlag" title="预览服务" width="976px" @close="onClose" :close-on-press-escape="false" :close-on-click-modal="false">
    <div class="detail-main r-p-b-20">
      <div class="item-box">
        <div class="item-title">服务名称</div>
        <div class="item-content">{{ detail?.name }}</div>
      </div>
      <div class="item-box">
        <div class="item-title">服务分类</div>
        <div class="item-content">
          {{ (categoryList.find((item: any) => item.value === detail?.categoryId) as any)?.label }}
        </div>
      </div>
      <div class="item-box">
        <div class="item-title">365价格</div>
        <div class="item-content">{{ detail?.price }}</div>
      </div>
      <div class="item-box">
        <div class="item-title">365服务最小价格</div>
        <div class="item-content">{{ detail?.minPrice }}</div>
      </div>
      <div class="item-box">
        <div class="item-title">单位</div>
        <div class="item-content">{{ detail?.unit }}</div>
      </div>
      <div class="item-box">
        <div class="item-title">价格备注</div>
        <div class="item-content">{{ detail?.priceRemark }}</div>
      </div>
      <div class="item-box">
        <div class="item-title">市场价格</div>
        <div class="item-content">{{ detail?.marketPrice }}</div>
      </div>
      <div class="item-box">
        <div class="item-title">中心价格</div>
        <div class="item-content">{{ detail?.centerPrice }}</div>
      </div>
      <div class="item-box">
        <div class="item-title">服务最小数量</div>
        <div class="item-content">{{ detail?.minCount }}</div>
      </div>
      <div class="item-box">
        <div class="item-title">服务最大数量</div>
        <div class="item-content">{{ detail?.maxCount }}</div>
      </div>
      <div class="item-box">
        <div class="item-title">参与活动</div>
        <div class="item-content">{{ detail?.participationUser }}</div>
      </div>
      <div class="item-box">
        <div class="item-title">服务营业时间</div>
        <span v-if="detail.businessStartTime" class="item-content">{{ detail.businessStartTime + ' ~ ' + detail.businessEndTime }}</span>
      </div>
      <!-- <div class="item-box">
        <div class="item-title">下单时间距离最大的服务时间</div>
        <div class="item-content">{{ detail?.code }}</div>
      </div>
      <div class="item-box">
        <div class="item-title">下单时间距离最小的服务时间</div>
        <div class="item-content">{{ detail?.code }}</div>
      </div> -->
      <div class="item-box">
        <div class="item-title">是否为预约服务</div>
        <div class="item-content">
          {{ !detail?.canbook ? '' : detail?.canbook === '1' ? '是' : '否' }}
        </div>
      </div>
      <div class="item-box">
        <div class="item-title">是否在APP上显示</div>
        <div class="item-content">
          {{ !detail?.showOnApp ? '' : detail?.showOnApp === '1' ? '是' : '否' }}
        </div>
      </div>
      <div class="item-box">
        <div class="item-title">活动状态</div>
        <div class="item-content">
          {{ renderDict(detail?.activityStauts, 'activity_stauts') }}
        </div>
      </div>
      <div class="item-box">
        <div class="item-title">是否支持发票</div>
        <div class="item-content">
          {{ !detail?.offerInvoice ? '' : detail?.offerInvoice === '1' ? '支持' : '不支持' }}
        </div>
      </div>
      <div class="item-box">
        <div class="item-title">是否支持货到付款</div>
        <div class="item-content">
          {{ !detail?.canOfflinePay ? '' : detail?.canOfflinePay === '1' ? '支持' : '不支持' }}
        </div>
      </div>
      <div class="item-box">
        <div class="item-title">服务便签</div>
        <div class="item-content">{{ detail?.serveLabel }}</div>
      </div>
      <div class="item-box item-100">
        <div class="item-title">备注</div>
        <div class="item-content">{{ detail?.remark }}</div>
      </div>
      <div class="item-box item-100">
        <div class="item-title">服务介绍</div>
        <div class="item-content" v-html="detail.content"></div>
      </div>
      <div class="item-box item-100">
        <div class="item-title">图标</div>
        <div class="item-content img-box flex row-center">
          <el-image :src="config.base_img.dev + imageUrl" :preview-src-list="[config.base_img.dev + imageUrl]" preview-teleported fit="fill" style="width: 80px;height: 80px;"></el-image>
        </div>
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
import { config } from '@/config/axios/config'
import { ref } from 'vue'

const emits = defineEmits(['reload-list'])

const props = defineProps({
  categoryList: {
    type: Array,
    default: null
  },
  dict: {
    type: Array,
    default: null
  },
  imageUrl: {
    type: String,
    default: null
  }
})

const filterDict = (key: any) => {
  return (props.dict.find((item: any) => item.type == key) as any)?.list
}

const renderDict = (key: any, dict: any) => {
  if (!key) {
    return
  }
  return filterDict(dict)
    ?.filter((item: any) => key == item.value)
    .map((item: any) => item?.label)
    .join('，')
}

const visibleFlag = ref(false)

const detail = ref<any>({ businessTime: [] })

const show = async (form) => {
  detail.value = { ...form }
  visibleFlag.value = true
}

const onClose = () => {
  detail.value = { businessTime: [] }
  visibleFlag.value = false
}

defineExpose({
  show
})
</script>
<style lang="less" scoped>
.detail-main {
  display: flex;
  flex-wrap: wrap;
}
.item-box {
  width: 50%;
  display: flex;
  font-size: 14px;
  color: var(--main-text-color);
  margin-bottom: 16px;
  .item-title {
    // width: 94px;
    margin-right: 8px;
    flex-grow: 0;
    flex-shrink: 0;
    &::after {
      content: '：';
    }
  }
  .item-content {
    width: calc(100% -94px);
  }
}
.item-100 {
  width: 100%;
}
.img-box {
  width: 78px;
  height: 78px;
  border-radius: 6px;
  border: 1px solid var(--el-border-color);
}
</style>
