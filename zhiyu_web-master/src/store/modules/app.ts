import { defineStore } from 'pinia'
import { store } from '../index'
import { setCssVar, humpToUnderline } from '@/utils'
import { ElMessage } from 'element-plus'
import { ElementPlusSize } from '@/types/elementPlus'
import { useCache } from '@/hooks/web/useCache'
import { LayoutType } from '@/types/layout'
import { ThemeTypes } from '@/types/theme'
import { ref } from 'vue'
import { colorConfig } from '@/utils/color'

const { wsCache } = useCache()

interface AppState {
  token: string
  breadcrumb: boolean
  breadcrumbIcon: boolean
  collapse: boolean
  uniqueOpened: boolean
  hamburger: boolean
  screenfull: boolean
  size: boolean
  locale: boolean
  tagsView: boolean
  tagsViewIcon: boolean
  logo: boolean
  fixedHeader: boolean
  greyMode: boolean
  dynamicRouter: boolean
  pageLoading: boolean
  layout: LayoutType
  title: string
  userInfo: string
  usermag: string
  userrem: string
  isDark: boolean
  currentSize: ElementPlusSize
  sizeMap: ElementPlusSize[]
  mobile: boolean
  footer: boolean
  theme: ThemeTypes
  fixedMenu: boolean
}

export const useAppStore = defineStore('app', {
  state: (): AppState => {
    return {
      userInfo: 'userInfo', // 登录信息存储字段-建议每个项目换一个字段，避免与其他项目冲突
      usermag: 'usermag',
      userrem: 'false',
      sizeMap: ['default', 'large', 'small'],
      mobile: false, // 是否是移动端
      title: import.meta.env.VITE_APP_TITLE, // 标题
      pageLoading: false, // 路由跳转loading
      token: '',
      breadcrumb: true, // 面包屑
      breadcrumbIcon: true, // 面包屑图标
      collapse: false, // 折叠菜单
      uniqueOpened: false, // 是否只保持一个子菜单的展开
      hamburger: true, // 折叠图标
      screenfull: true, // 全屏图标
      size: true, // 尺寸图标
      locale: true, // 多语言图标
      tagsView: true, // 标签页
      tagsViewIcon: true, // 是否显示标签图标
      logo: true, // logo
      fixedHeader: true, // 固定toolheader
      footer: true, // 显示页脚
      greyMode: false, // 是否开始灰色模式，用于特殊悼念日
      dynamicRouter: wsCache.get('dynamicRouter') || false, // 是否动态路由
      fixedMenu: wsCache.get('fixedMenu') || false, // 是否固定菜单

      layout: wsCache.get('layout') || 'topLeft', // layout布局
      isDark: wsCache.get('isDark') || false, // 是否是暗黑模式
      currentSize: wsCache.get('default') || 'default', // 组件尺寸
      theme: wsCache.get('theme') || {
        // 主题色
        elColorPrimary: '#ff9500',
        elColorPrimaryRgb: '255, 149, 0',
        elColorPrimaryLight3: '#FFA82E',
        elColorPrimaryLight5: '#FFBB5C',
        elColorPrimaryLight7: '#FFCE8A',
        elColorPrimaryLight8: '#FFE1B8',
        elColorPrimaryLight9: '#FFF9F0',
        elColorPrimaryDark2: '#D17A00',
        // 左侧菜单边框颜色
        leftMenuBorderColor: 'inherit',
        // 左侧菜单背景颜色
        leftMenuBgColor: '#fff',
        // 左侧菜单浅色背景颜色
        leftMenuBgLightColor: '#fff',
        // 左侧菜单选中背景颜色
        leftMenuBgActiveColor: `#fff9f0`,
        // 左侧菜单收起选中背景颜色
        leftMenuCollapseBgActiveColor: '#ff9500',
        // 左侧菜单字体颜色
        leftMenuTextColor: '#333',
        // 左侧菜单选中字体颜色
        leftMenuTextActiveColor: '#ff9500',
        // logo字体颜色
        logoTitleTextColor: '#fff',
        // logo边框颜色
        logoBorderColor: 'inherit',
        // 头部背景颜色
        topHeaderBgColor: '#fff',
        // 头部字体颜色
        topHeaderTextColor: 'inherit',
        // 头部悬停颜色
        topHeaderHoverColor: '#f6f6f6',
        // 头部边框颜色
        topToolBorderColor: '#eee'
      }
    }
  },
  getters: {
    getBreadcrumb(): boolean {
      return this.breadcrumb
    },
    getToken(): string {
      return this.token
    },
    getBreadcrumbIcon(): boolean {
      return this.breadcrumbIcon
    },
    getCollapse(): boolean {
      return this.collapse
    },
    getUniqueOpened(): boolean {
      return this.uniqueOpened
    },
    getHamburger(): boolean {
      return this.hamburger
    },
    getScreenfull(): boolean {
      return this.screenfull
    },
    getSize(): boolean {
      return this.size
    },
    getLocale(): boolean {
      return this.locale
    },
    getTagsView(): boolean {
      return this.tagsView
    },
    getTagsViewIcon(): boolean {
      return this.tagsViewIcon
    },
    getLogo(): boolean {
      return this.logo
    },
    getFixedHeader(): boolean {
      return this.fixedHeader
    },
    getGreyMode(): boolean {
      return this.greyMode
    },
    getDynamicRouter(): boolean {
      return this.dynamicRouter
    },
    getFixedMenu(): boolean {
      return this.fixedMenu
    },
    getPageLoading(): boolean {
      return this.pageLoading
    },
    getLayout(): LayoutType {
      return this.layout
    },
    getTitle(): string {
      return this.title
    },
    getUserInfo(): string {
      return this.userInfo
    },
    getUserMsg(): string {
      return this.usermag
    },
    getUserRem(): string {
      return this.userrem
    },
    getIsDark(): boolean {
      return this.isDark
    },
    getCurrentSize(): ElementPlusSize {
      return this.currentSize
    },
    getSizeMap(): ElementPlusSize[] {
      return this.sizeMap
    },
    getMobile(): boolean {
      return this.mobile
    },
    getTheme(): ThemeTypes {
      return this.theme
    },
    getFooter(): boolean {
      return this.footer
    }
  },
  actions: {
    setBreadcrumb(breadcrumb: boolean) {
      this.breadcrumb = breadcrumb
    },
    setToken(token: string) {
      this.token = token
    },
    setBreadcrumbIcon(breadcrumbIcon: boolean) {
      this.breadcrumbIcon = breadcrumbIcon
    },
    setCollapse(collapse: boolean) {
      this.collapse = collapse
    },
    setUniqueOpened(uniqueOpened: boolean) {
      this.uniqueOpened = uniqueOpened
    },
    setHamburger(hamburger: boolean) {
      this.hamburger = hamburger
    },
    setScreenfull(screenfull: boolean) {
      this.screenfull = screenfull
    },
    setSize(size: boolean) {
      this.size = size
    },
    setLocale(locale: boolean) {
      this.locale = locale
    },
    setTagsView(tagsView: boolean) {
      this.tagsView = tagsView
    },
    setTagsViewIcon(tagsViewIcon: boolean) {
      this.tagsViewIcon = tagsViewIcon
    },
    setLogo(logo: boolean) {
      this.logo = logo
    },
    setFixedHeader(fixedHeader: boolean) {
      this.fixedHeader = fixedHeader
    },
    setGreyMode(greyMode: boolean) {
      this.greyMode = greyMode
    },
    setDynamicRouter(dynamicRouter: boolean) {
      wsCache.set('dynamicRouter', dynamicRouter)
      this.dynamicRouter = dynamicRouter
    },
    setFixedMenu(fixedMenu: boolean) {
      wsCache.set('fixedMenu', fixedMenu)
      this.fixedMenu = fixedMenu
    },
    setPageLoading(pageLoading: boolean) {
      this.pageLoading = pageLoading
    },
    setLayout(layout: LayoutType) {
      if (this.mobile && layout !== 'classic') {
        ElMessage.error('移动端模式下不支持切换其他布局')
        return
      }
      this.layout = layout
      wsCache.set('layout', this.layout)
    },
    setTitle(title: string) {
      this.title = title
    },
    setIsDark(isDark: boolean) {
      this.isDark = isDark
      if (this.isDark) {
        document.documentElement.classList.add('dark')
        document.documentElement.classList.remove('light')
      } else {
        document.documentElement.classList.add('light')
        document.documentElement.classList.remove('dark')
      }
      wsCache.set('isDark', this.isDark)
    },
    setCurrentSize(currentSize: ElementPlusSize) {
      this.currentSize = currentSize
      wsCache.set('currentSize', this.currentSize)
    },
    setMobile(mobile: boolean) {
      this.mobile = mobile
    },
    setTheme(theme: ThemeTypes) {
      if (theme.elColorPrimary) {
        const keyName = theme.elColorPrimary.toLowerCase() // 将大写的颜色值转为小写
        if (colorConfig[keyName]) { // 配置element-plus的其他色值
          for (const key in colorConfig[keyName]) {
            theme[key] = colorConfig[keyName][key]
          }
        }
      }
      this.theme = Object.assign(this.theme, theme)
      wsCache.set('theme', this.theme)
    },
    setCssVarTheme() {
      for (const key in this.theme) {
        setCssVar(`--${humpToUnderline(key)}`, this.theme[key])
      }
    },
    setFooter(footer: boolean) {
      this.footer = footer
    }
  }
})

const avatarStore = defineStore('demo', () => {
  const avatar = ref()
  // const imageLink = 'http://192.168.20.220:8001'
  // const imageLink = 'http://192.168.20.220:8003'
  // const imageLink = 'http://121.40.237.0:8062'
  const imageLink = 'http://192.168.20.174:8062'
  return {
    avatar,
    imageLink
  }
})

export default avatarStore

export const useAppStoreWithOut = () => {
  return useAppStore(store)
}
