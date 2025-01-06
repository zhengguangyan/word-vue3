<script setup lang="ts">
import { computed, watch } from 'vue'
import { useAppStore } from '@/store/modules/app'
import { ConfigGlobal } from '@/components/ConfigGlobal'
import { isDark } from '@/utils/is'
import { useDesign } from '@/hooks/web/useDesign'
import { useCache } from '@/hooks/web/useCache'
import { useDictStore } from '@/store/modules/dict'
import { useRoute } from 'vue-router'
import CallPanelPlugin from '@/assets/callPanelPlugin/index.vue'

// 为保证数据字典及时刷新，在路由跳转时，都要更新数据字典
const dictStore = useDictStore()
const route = useRoute()
watch(
  () => route.path,
  (val) => {
    if (val !== '/login') {
      dictStore.getAllDictData()
    }
  }
)

const { getPrefixCls } = useDesign()

const prefixCls = getPrefixCls('app')

const appStore = useAppStore()

const currentSize = computed(() => appStore.getCurrentSize)

const greyMode = computed(() => appStore.getGreyMode)

const { wsCache } = useCache()

// 根据浏览器当前主题设置系统主题色
const setDefaultTheme = () => {
  if (wsCache.get('isDark') !== null) {
    appStore.setIsDark(wsCache.get('isDark'))
    return
  }
  const isDarkTheme = isDark()
  appStore.setIsDark(isDarkTheme)
}

setDefaultTheme()
</script>

<template>
  <ConfigGlobal :size="currentSize">
    <RouterView :class="greyMode ? `${prefixCls}-grey-mode` : ''" />
  </ConfigGlobal>
  <CallPanelPlugin />
</template>

<style lang="less">
@prefix-cls: ~'@{namespace}-app';

.size {
  width: 100%;
  height: 100%;
}

html,
body {
  padding: 0 !important;
  margin: 0;
  overflow: hidden;
  .size;

  #app {
    .size;
  }
}
#app {
  background-image: url('@/assets/bg/bg-site.png');
}

.@{prefix-cls}-grey-mode {
  filter: grayscale(100%);
}

.v-logo {
  color: var(--el-color-primary);
}

.el-descriptions__header {
  margin: 0 0 20px;
}
.el-descriptions__cell.el-descriptions__label.is-bordered-label {
  width: 3%;
}
.el-descriptions__cell.el-descriptions__content.is-bordered-content {
  width: 20%;
}

.el-descriptions__body .el-descriptions__table.is-bordered .el-descriptions__cell {
  border: none !important;
  background: none !important;
  padding: 0 12px 20px;
}
.el-descriptions__cell.el-descriptions__label.is-bordered-label {
  background: none;
  padding-left: 0 !important;
  min-width: 120px !important;
}

.v-layout,
.top,
#v-menu,
.el-menu,
.el-menu-item,
.el-sub-menu,
.el-sub-menu__title,
.v-tags-view,
.layout-top-header,
.el-menu .el-menu-item.is-active:after {
  background-color: transparent !important;
}

.z-3000 #v-menu {
  background-color: var(--left-menu-bg-color) !important;
}

.v-tags-view,
.v-tags-view__tool::after {
  border: 0 !important;
}

.v-tags-view__tool {
  background: rgba(255, 255, 255, 0.64);
  border: 1px solid #ffffff !important;
  border-radius: 4px;
}

.v-tags-view__item {
  height: 35px !important;
  background: rgba(255, 255, 255, 0.64);
  border: 1px solid #ffffff !important;
  border-radius: 4px;
  margin-left: 12px !important;
}

#v-tags-view,
.v-layout-content {
  // width: calc(100% - var(--left-menu-max-width) - 20px) !important;
  margin-left: 10px;
}

// .v-layout-content-scrollbar {
//   margin-top: calc(var(--tags-view-height) + 20px) !important;
// }

.layout-top-header {
  border: 0 !important;
}

.v-layout__top {
  #v-tags-view {
    width: 100% !important;
    margin: 0;
    padding: 0 20px;
  }
  .v-layout-content {
    padding: 0 20px;
    width: auto !important;
    margin: 0;
    .v-layout-content-scrollbar {
      margin-top: var(--tags-view-height) !important;
    }
  }
}

.content-layout {
  border-radius: 4px;
  border: 1px solid rgba(var(--el-color-primary-rgb), 0.16);
}

.v-footer {
  display: none;
}
.el-button.is-link:focus {
  color: var(--el-color-primary) !important;
}
.el-card__body {
  padding: 0 !important;
}
.el-card__header {
  // border: none !important;
  margin-bottom: 10px;
}
.el-table th.el-table__cell,
.table-header > .el-table__cell {
  background-color: #faf9f7 !important;
  color: var(--main-text-color) !important;
}
.title {
  color: #313233;
  font-weight: bold;
}
.about {
  font-size: 14px;
  font-weight: 400;
  color: #666462;
}
.unchecked {
  color: #ccc;
}

.el-form-item__label {
  padding-right: 8px;
  color: var(--main-text-color);
  justify-content: flex-start !important;
}

.el-form-item.is-required .el-form-item__label::before {
  display: none;
}

.required-item::after,
.el-form-item.is-required .el-form-item__label::after {
  content: '*';
  color: red;
  margin-left: 4px;
}
.el-descriptions__title {
  display: flex;
  align-items: center;
}
.el-descriptions__title::before {
  content: '';
  display: inline-block;
  width: 4px;
  height: 14px;
  background-color: var(--el-color-primary);
  border-radius: 2px;
  margin-right: 8px;
}
.title::before {
  content: '';
  display: inline-block;
  width: 4px;
  height: 14px;
  background-color: var(--el-color-primary);
  border-radius: 2px;
  margin-right: 8px;
}
.el-dialog__body {
  padding: 0 !important;
  max-height: calc(100vh - 350px);
  overflow-y: auto;
  //滚动条隐藏
  scrollbar-width: none;
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    display: none;
  }
}
.el-card__header {
  padding: 0 !important;
}
.table-operation .el-button.is-link {
  text-decoration: underline;
}

.el-card,
.el-card__header {
  border: 0 !important;
}
.about {
  cursor: default;
}
.el-drawer__header {
  margin-bottom: 0 !important;
}
.error-tips {
  // position: absolute;
  // bottom: -19px;
  // left: 0;
  color: var(--el-color-danger);
  font-size: 12px;
  white-space: nowrap;
}
.table-without-border .el-table__cell {
  border: none !important;
  border-bottom: 1px solid #f5f3f0 !important;
}
.table-without-border::before,
.table-without-border::after,
.table-without-border .el-table__inner-wrapper::before,
.table-without-border .el-table__inner-wrapper::after,
.table-without-border .el-table__border-left-patch {
  display: none !important;
}
.el-pagination {
  justify-content: center;
  color: #666462;
}
.el-pagination button {
  border-radius: 4px;
}
.el-pagination .btn-prev {
  color: var(--el-color-primary);
  margin-left: 24px !important;
}
.el-pager li.number {
  border: 1px solid #ebe9e6;
  border-radius: 4px;
  margin: 0 4px;
  font-size: 14px;
  font-weight: 400;
}
.el-pager li.is-active {
  border: 1px solid var(--el-color-primary);
  color: var(--el-color-primary);
}
.v-menu__title {
  font-size: 16px;
  font-weight: 400;
}
.el-tag.el-tag--info {
  color: var(--el-input-text-color, var(--el-text-color-regular));
}
.align-top-item {
  vertical-align: top;
  padding-top: 8px !important;
}
.el-button--primary.is-link,
.el-button--primary.is-text {
  font-size: 14px;
  text-decoration: underline;
}
.el-alert .el-alert__description {
  margin: 0;
}
input::placeholder,
.el-input__inner::placeholder,
.el-input::placeholder {
  color: #ccc !important ; /* 设置提示语的字体颜色 */
}

.el-input.is-disabled .el-input__inner {
  -webkit-text-fill-color: #ccc !important; // 禁用状态提示语颜色
}
.el-textarea__inner,
.el-input.is-disabled {
  --el-input-placeholder-color: #ccc !important;

  scrollbar-width: none;
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    display: none;
  }
}

// 饱和度弹窗计算样式
.saturation-box {
  width: 50px;
  height: 42px;
  text-align: center;
  margin: 5px;
}
.saturation-box strong {
  display: block;
  font-size: 16px;
  font-weight: 700;
  color: var(--el-color-primary);
  line-height: 19px;
}
.saturation-box span {
  font-size: 14px;
  font-weight: 400;
  color: #666462;
  line-height: 16px;
}

// 多选下拉样式覆盖
.el-select-dropdown.is-multiple .el-select-dropdown__item {
  padding-left: 30px !important;
}
.el-select-dropdown.is-multiple .el-select-dropdown__item::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 10px;
  border-top: none;
  border-right: none;
  background-repeat: no-repeat;
  background-position: center;
  -webkit-mask: url('data:image/svg+xml;utf8,%3Csvg%20xmlns=%22http://www.w3.org/2000/svg%22%20aria-hidden=%22true%22%20role=%22img%22%20width=%221em%22%20height=%221em%22%20viewBox=%220%200%201024%201024%22%20data-icon=%22ant-design:border-outlined%22%20class=%22iconify%20iconify--ant-design%22%3E%3Cpath%20fill=%22currentColor%22%20d=%22M880%20112H144c-17.7%200-32%2014.3-32%2032v736c0%2017.7%2014.3%2032%2032%2032h736c17.7%200%2032-14.3%2032-32V144c0-17.7-14.3-32-32-32zm-40%20728H184V184h656v656z%22%3E%3C/path%3E%3C/svg%3E')
    no-repeat;
  mask: url('data:image/svg+xml;utf8,%3Csvg%20xmlns=%22http://www.w3.org/2000/svg%22%20aria-hidden=%22true%22%20role=%22img%22%20width=%221em%22%20height=%221em%22%20viewBox=%220%200%201024%201024%22%20data-icon=%22ant-design:border-outlined%22%20class=%22iconify%20iconify--ant-design%22%3E%3Cpath%20fill=%22currentColor%22%20d=%22M880%20112H144c-17.7%200-32%2014.3-32%2032v736c0%2017.7%2014.3%2032%2032%2032h736c17.7%200%2032-14.3%2032-32V144c0-17.7-14.3-32-32-32zm-40%20728H184V184h656v656z%22%3E%3C/path%3E%3C/svg%3E')
    no-repeat;
  mask-size: 100% 100%;
  -webkit-mask: url('data:image/svg+xml;utf8,%3Csvg%20xmlns=%22http://www.w3.org/2000/svg%22%20aria-hidden=%22true%22%20role=%22img%22%20width=%221em%22%20height=%221em%22%20viewBox=%220%200%201024%201024%22%20data-icon=%22ant-design:border-outlined%22%20class=%22iconify%20iconify--ant-design%22%3E%3Cpath%20fill=%22currentColor%22%20d=%22M880%20112H144c-17.7%200-32%2014.3-32%2032v736c0%2017.7%2014.3%2032%2032%2032h736c17.7%200%2032-14.3%2032-32V144c0-17.7-14.3-32-32-32zm-40%20728H184V184h656v656z%22%3E%3C/path%3E%3C/svg%3E')
    no-repeat;
  -webkit-mask-size: 100% 100%;
  transform: translateY(-50%);
  width: 16px;
  height: 16px;
  background-color: var(--el-text-color-regular);
}
.el-select-dropdown.is-multiple .el-select-dropdown__item.is-selected::before {
  -webkit-mask: url('data:image/svg+xml;utf8,%3Csvg%20xmlns=%22http://www.w3.org/2000/svg%22%20aria-hidden=%22true%22%20role=%22img%22%20width=%221em%22%20height=%221em%22%20viewBox=%220%200%201024%201024%22%20data-icon=%22ant-design:check-square-filled%22%20class=%22iconify%20iconify--ant-design%22%3E%3Cpath%20fill=%22currentColor%22%20d=%22M880%20112H144c-17.7%200-32%2014.3-32%2032v736c0%2017.7%2014.3%2032%2032%2032h736c17.7%200%2032-14.3%2032-32V144c0-17.7-14.3-32-32-32zM695.5%20365.7l-210.6%20292a31.8%2031.8%200%200%201-51.7%200L308.5%20484.9c-3.8-5.3%200-12.7%206.5-12.7h46.9c10.2%200%2019.9%204.9%2025.9%2013.3l71.2%2098.8l157.2-218c6-8.3%2015.6-13.3%2025.9-13.3H689c6.5%200%2010.3%207.4%206.5%2012.7z%22%3E%3C/path%3E%3C/svg%3E')
    no-repeat;
  mask: url('data:image/svg+xml;utf8,%3Csvg%20xmlns=%22http://www.w3.org/2000/svg%22%20aria-hidden=%22true%22%20role=%22img%22%20width=%221em%22%20height=%221em%22%20viewBox=%220%200%201024%201024%22%20data-icon=%22ant-design:check-square-filled%22%20class=%22iconify%20iconify--ant-design%22%3E%3Cpath%20fill=%22currentColor%22%20d=%22M880%20112H144c-17.7%200-32%2014.3-32%2032v736c0%2017.7%2014.3%2032%2032%2032h736c17.7%200%2032-14.3%2032-32V144c0-17.7-14.3-32-32-32zM695.5%20365.7l-210.6%20292a31.8%2031.8%200%200%201-51.7%200L308.5%20484.9c-3.8-5.3%200-12.7%206.5-12.7h46.9c10.2%200%2019.9%204.9%2025.9%2013.3l71.2%2098.8l157.2-218c6-8.3%2015.6-13.3%2025.9-13.3H689c6.5%200%2010.3%207.4%206.5%2012.7z%22%3E%3C/path%3E%3C/svg%3E')
    no-repeat;
  -webkit-mask: url('data:image/svg+xml;utf8,%3Csvg%20xmlns=%22http://www.w3.org/2000/svg%22%20aria-hidden=%22true%22%20role=%22img%22%20width=%221em%22%20height=%221em%22%20viewBox=%220%200%201024%201024%22%20data-icon=%22ant-design:check-square-filled%22%20class=%22iconify%20iconify--ant-design%22%3E%3Cpath%20fill=%22currentColor%22%20d=%22M880%20112H144c-17.7%200-32%2014.3-32%2032v736c0%2017.7%2014.3%2032%2032%2032h736c17.7%200%2032-14.3%2032-32V144c0-17.7-14.3-32-32-32zM695.5%20365.7l-210.6%20292a31.8%2031.8%200%200%201-51.7%200L308.5%20484.9c-3.8-5.3%200-12.7%206.5-12.7h46.9c10.2%200%2019.9%204.9%2025.9%2013.3l71.2%2098.8l157.2-218c6-8.3%2015.6-13.3%2025.9-13.3H689c6.5%200%2010.3%207.4%206.5%2012.7z%22%3E%3C/path%3E%3C/svg%3E')
    no-repeat;
  background-color: var(--el-color-primary);
}
.el-select-dropdown.is-multiple .el-select-dropdown__item.is-selected:after {
  display: none;
}
.el-select-dropdown.is-multiple .el-select-dropdown__item.is-selected {
  color: var(--el-text-color-regular) !important;
  font-weight: normal;
}
.date-label {
  color: var(--main-text-color);
  font-size: 14px;
  margin-right: 10px;
  white-space: nowrap;
}

.item-label {
  &::after {
    content: '：';
  }
}
.el-input__count {
  color: #c0c4cc !important;
}
.imgSize {
  display: inline-block;
  height: 80px;
  width: 80px;
  object-fit: contain;
  vertical-align: middle;
  margin-right: 10px;
  border: 1px solid #eceaea;
  border-radius: 4px;
  cursor: pointer;
}
.el-dialog__body > img {
  margin: auto;
}
.title-name {
  font-weight: 700;
}
.el-dialog__header {
  font-weight: bold;
  border-bottom: 0 !important;
  padding: 0 0 20px !important;
}
.el-table {
  /* 替换默认展开收起图片 */
  /* prettier-ignore */
  .el-table__expand-icon {
    width: 20px !important;
    height: 20px !important;
    background: url("./assets/icon/icon_shouqi.png") no-repeat;
    background-size: 100% 100%;
    margin-bottom: -5px;

    .el-icon {
      display: none;
    }
  }
  .el-table__expand-icon--expanded {
    transform: none;
    background: url('./assets/icon/icon_zhankai.png') no-repeat;
    background-size: 100% 100%;
  }
}
.el-select__placeholder.is-transparent {
  // color: #ccc;
  color: #cecfd2 !important;
}
.el-page-header__title {
  white-space: nowrap;
}
.el-message-box__btns {
  justify-content: center !important;
}
.el-message-box {
  padding: 20px !important;
}
.numberInput {
  width: 100% !important;
}
.el-popper.is-dark {
  max-width: 500px;
}
.el-upload--picture-card {
  border: 1px solid var(--el-color-primary);
  background-color: #fff;
}
.el-upload--picture-card > i {
  color: var(--el-color-primary);
}
.el-form-item--default {
  margin-bottom: 16px;
}
.el-dialog__footer {
  .el-button + .el-button {
    margin-left: 40px;
  }
}
</style>
