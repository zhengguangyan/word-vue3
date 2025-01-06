// 引入windi css
import '@/plugins/windi.css'

// 导入全局的svg图标
import '@/plugins/svgIcon'

// 初始化多语言
import { setupI18n } from '@/plugins/vueI18n'

// 引入状态管理
import { setupStore } from '@/store'

// 全局组件
import { setupGlobCom  } from '@/components'

import LineOneTooltip from '@/components/LineOneTooltip/index.vue'

// 全局引用ElementPlus
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

// 引入全局样式
import '@/styles/index.less'
import '@/styles/common.less'

// 引入动画
import '@/plugins/animate.css'

// 路由
import { setupRouter } from './router'

// 权限
import { setupPermission } from './directives'

import { createApp } from 'vue'

import App from './App.vue'

import './permission'
// import { useDict } from '@/utils/dict'
// import { download } from '@/utils/request'
// import { parseTime, resetForm, addDateRange, handleTree, selectDictLabel, selectDictLabels } from '@/utils/ec'
// 创建实例
const setupAll = async () => {
  const app = createApp(App)
  app.component('line-one-tooltip',LineOneTooltip)

  await setupI18n(app)

  app.use(ElementPlus)
  // app.config.globalProperties.useDict = useDict
  // app.config.globalProperties.download = download
  // app.config.globalProperties.parseTime = parseTime
  // app.config.globalProperties.resetForm = resetForm
  // app.config.globalProperties.handleTree = handleTree
  // app.config.globalProperties.addDateRange = addDateRange
  // app.config.globalProperties.selectDictLabel = selectDictLabel
  // app.config.globalProperties.selectDictLabels = selectDictLabels
  setupStore(app)
  setupGlobCom(app)
  setupRouter(app)
  setupPermission(app)
  app.mount('#app')
}

setupAll()
