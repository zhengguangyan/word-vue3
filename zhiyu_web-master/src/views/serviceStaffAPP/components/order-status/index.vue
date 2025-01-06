<template>
  <div class="flex flex-wrap">
    <div class="step">
      <div class="relative flex">
        <img src="@/assets/icon/icon_check1.png" class="setp-icon" />
        <span class="step-title">计划服务时间</span>
        <span class="step-time">{{ detail.serveTime }}</span>
      </div>
    </div>

    <div v-if="detail.status === '9'" class="step">
      <div class="flex">
        <div class="bar"></div>
        <div class="relative flex">
          <img src="@/assets/icon/icon_close.png" class="setp-icon" />
          <span :class="['step-title']">已取消</span>
          <span class="step-time">{{ detail.cancelTime }}</span>
        </div>
      </div>
    </div>
    <template v-else>
      <div class="step">
        <div class="flex">
          <div v-if="detail.startOrderTime" class="bar"></div>
          <div v-else class="bar bar-3"></div>
          <div class="relative flex">
            <img v-if="detail.startOrderTime" src="@/assets/icon/icon_check1.png" class="setp-icon" />
            <img v-else src="@/assets/icon/icon_single2.png" class="setp-icon" />
            <span :class="['step-title', { color999: !detail.startOrderTime }]">开始服务</span>
            <span class="step-time">{{ detail.startOrderTime }}</span>
          </div>
        </div>
      </div>
      <div class="step">
        <div class="flex">
          <div v-if="detail.status > 4" class="bar"></div>
          <div v-else-if="detail.status === '4' && detail.finishOrderTime" class="bar-2"></div>
          <div v-else class="bar bar-3"></div>
          <div class="relative flex">
            <img v-if="detail.status > 4" src="@/assets/icon/icon_check1.png" class="setp-icon" />
            <img v-else-if="detail.status === '4' && detail.finishOrderTime" src="@/assets/icon/icon_single1.png" class="setp-icon" />
            <img v-else src="@/assets/icon/icon_single2.png" class="setp-icon" />
            <span :class="['step-title', { color999: detail.status < 5 }]">完成服务</span>
            <span class="step-time">{{ detail.finishOrderTime }}</span>
          </div>
        </div>
      </div>
      <div v-if="['6', '7', '8','10'].includes(detail.status) && detail.passOrgTime" class="step">
        <div class="flex">
          <div class="bar"></div>
          <div class="relative flex">
            <img src="@/assets/icon/icon_check1.png" class="setp-icon" />
            <span :class="['step-title']">
              <span>机构审核通过</span>
            </span>
            <span class="step-time">{{ detail.passOrgTime || '' }}</span>
          </div>
        </div>
      </div>
      <div class="step">
        <div class="flex">
          <div v-if="detail.status > 6" class="bar"></div>
          <div v-else-if="['5', '6'].includes(detail.status)" class="bar-2"></div>
          <div v-else class="bar bar-3"></div>
          <div class="relative flex">
            <img v-if="detail.status === '7'" src="@/assets/icon/icon_check1.png" class="setp-icon" />
            <img v-else-if="detail.status === '10'" src="@/assets/icon/icon_check2.png" class="setp-icon" />
            <img v-else-if="detail.status === '8'" src="@/assets/icon/icon_close.png" class="setp-icon" />
            <img v-else-if="['5', '6'].includes(detail.status)" src="@/assets/icon/icon_single1.png" class="setp-icon" />
            <img v-else src="@/assets/icon/icon_single2.png" />
            <span :class="['step-title', { color999: detail.status < 7 }]">
              <span v-if="detail.status < 5">平台审核</span>
              <span v-if="detail.status === '5'" class="cursor-pointer" @click="handleAudit">机构自审</span>
              <span v-if="detail.status === '6'" class="cursor-pointer" @click="handleAudit">平台审核</span>
              <span v-if="detail.status === '7'">审核已通过</span>
              <span v-if="detail.status === '8'">
                <span>审核未通过</span>
              </span>
              <span v-if="detail.status === '10'">已作废</span>
            </span>
            <span class="step-time">{{ detail.reviewTime || '' }}</span>
          </div>
        </div>
      </div>
    </template>
  </div>
  <div v-if="detail.status === '8'" class="msg">未通过原因： {{ detail.reason }}</div>
  <div v-if="detail.status === '9'" class="msg">取消原因： {{ detail.cancelReason }}</div>
  <div v-if="detail.status === '10'" class="msg">作废原因： {{ detail.reason }}</div>
</template>

<script lang="ts" setup>
const emits = defineEmits(['aduit'])

defineProps({
  detail: {
    type: Object,
    default: () => {}
  }
})

const handleAudit = () => {
  emits('aduit')
}
</script>
<style scoped lang="less">
.bar {
  width: 64px;
  height: 2px;
  background: #5cd7a8;
  border-radius: 1px;
  margin: 0 8px;
}
.bar-2 {
  width: 64px;
  height: 2px;
  margin: 0 8px;
  background-image: linear-gradient(to right, #ff9500 0%, #ff9500 50%, transparent 0%);
  background-size: 14px 2px;
  background-repeat: repeat-x;
}
.bar-3 {
  background-color: #e0dedc;
}
.step {
  margin-bottom: 30px;
}

.setp-icon {
  width: 24px;
  height: 24px;
}

.step-title {
  margin-left: 4px;
  font-size: 14px;
  // color: var(--main-text-color);
  font-weight: 600;
}

.step-time {
  position: absolute;
  margin: auto;
  left: 0;
  right: 0;
  bottom: -23px;
  font-size: 12px;
  white-space: nowrap;
  color: #999693;
}

.msg {
  line-height: 40px;
  height: 40px;
  padding: 0 12px;
  color: #e96848;
  background: rgba(233, 104, 72, 0.08);
  border-radius: 4px;
}
</style>
