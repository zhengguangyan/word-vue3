<template>
  <div>
    <div class="flex" style="justify-content: space-between">
      <div class="banner"></div>
      <div class="clock">
        <p class="time">{{ time }}</p>
        <p class="date">{{ date }}</p>
        <p class="weekday">星期{{ weekday }}</p>
        <!-- <p class="chinese-calendar">阴历 十月初二</p> -->
      </div>
    </div>
    <div style="margin-top: 30px; position: relative">
      <el-tabs v-model="currentMenu" class="function-tabs">
        <el-tab-pane v-for="item in routers" :key="item.meta.title" :label="item.meta.title" :name="item.meta.title">
          <el-space wrap :size="20">
            <template v-for="innerItem in item.children" :key="innerItem.meta.title">
              <div @click="go(item.path, innerItem.path)" class="item" shadow="never" v-if="!innerItem.hidden">
                <img src="@/assets/bg/icon-dashboard-function.png" alt="" />
                <span>{{ innerItem.meta.title }}</span>
              </div>
            </template>
          </el-space>
        </el-tab-pane>
      </el-tabs>
      <el-input v-model="searchValue" placeholder="搜索功能名称或关键词" style="width: 320px; position: absolute; right: 0; top: 0" @change="getItemList">
        <template #append>
          <el-button :icon="searchIcon" @click="getItemList" />
        </template>
      </el-input>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { useCache } from '@/hooks/web/useCache'
const { wsCache } = useCache()
import { useRouter } from 'vue-router'
const { push } = useRouter()
import { useIcon } from '@/hooks/web/useIcon'
const searchIcon = useIcon({ icon: 'ant-design:search-outlined' })
const currentMenu = ref()
const weekdayEnum = ['日', '一', '二', '三', '四', '五', '六']
const time = ref()
const date = ref()
const weekday = ref()

function updateTime() {
  var today = new Date()
  time.value = today.toLocaleTimeString()
  date.value = `${today.getFullYear()}年${today.getMonth() + 1}月${today.getDate()}日`
  weekday.value = weekdayEnum[today.getDay()]
}

const routers = ref([])

function initMenu() {
  routers.value = wsCache.get('roleRouters').filter((item) => !item.hidden)
  currentMenu.value = routers.value[0].meta.title
}

const searchValue = ref()
function getItemList() {
  routers.value = wsCache
    .get('roleRouters')
    .map((item) => ({
      ...item,
      children: item.children.filter((child) => child.meta.title.includes(searchValue.value) && !item.hidden)
    }))
    .filter((item) => item.children.length > 0 && !item.hidden)
  currentMenu.value = routers.value[0].meta.title
}

function go(path, path2) {
  if (path == '/') {
    push(`/${path2}`)
    return
  }
  push(`${path}/${path2}`)
}

onMounted(() => {
  setInterval(updateTime, 1000)
  initMenu()
})
</script>
<style scoped lang="less">
.banner {
  height: 330px;
  width: calc(100% - 400px);
  background-image: url('@/assets/bg/banner.png');
  background-repeat: no-repeat;
  background-size: 100% auto;
  border-radius: 4px;
}
@media (max-width: 1914px) {
  .banner {
    background-size: auto 100%; /* 容器长宽比更宽，设置背景图片为100%宽度平铺 */
  }
}

.clock {
  width: 396px;
  height: 330px;
  background-image: url('@/assets/bg/bg-dashboard-clock.png');
  background-repeat: no-repeat;
  padding: 40px 40px;
  border-radius: 4px;
}

.clock p {
  font-size: 24px;
  font-family: PingFang SC, PingFang SC-Medium;
  font-weight: 500;
  color: #666462;
  line-height: 34px;
  margin-bottom: 20px;
}

.clock .time {
  font-size: 70px;
  font-weight: 700;
  color: #279999;
  line-height: 92px;
}

.function-tabs {
  width: calc(100% - 330px);
  /* float: left; */
}

.item {
  width: 300px;
  padding: 16px 0 16px 24px;
  cursor: pointer;
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid #ebe9e6;
  border-radius: 4px;
}
.item img,
.item span {
  float: left;
  line-height: 40px;
  color: var(--main-text-color);
  font-weight: 400;
  margin-right: 12px;
}
:deep(.el-tabs__item) {
  color: #666462;
  font-size: 14px;
  font-weight: 400;
}
:deep(.el-tabs__item.is-active) {
  color: var(--el-color-primary);
  font-size: 16px;
  font-weight: bold;
}
:deep(.el-tabs__nav-wrap::after) {
  display: none;
}
:deep(.content-layout) {
  background: none !important;
}
:deep(.el-tabs__content) {
  width: calc(100vw - 300px);
}
</style>
