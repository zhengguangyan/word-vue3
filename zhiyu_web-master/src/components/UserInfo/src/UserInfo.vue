<script setup lang="ts">
import { ElDropdown, ElDropdownMenu, ElDropdownItem, ElMessageBox, ElTree } from 'element-plus'
import { ArrowDown } from '@element-plus/icons-vue'
import { useI18n } from '@/hooks/web/useI18n'
import { useCache } from '@/hooks/web/useCache'
import { resetRouter } from '@/router'
import { useRouter } from 'vue-router'
import { useDesign } from '@/hooks/web/useDesign'
import { useAppStore, useAppStoreWithOut } from '@/store/modules/app'
import { useTagsViewStore } from '@/store/modules/tagsView'
import { ref } from 'vue'
import avatarStore from '@/store/modules/app'
import { storeToRefs } from 'pinia'
// import { areaList } from "@/api/sys/Project";//引入数据
import { area, removeArea } from '@/api/sys/user'
import userImg from '@/assets/imgs/user.png'
const { wsCache } = useCache()
const appStore = useAppStore()
const appStoreOut = useAppStoreWithOut()
const imageStore = avatarStore()
// import type Node from 'element-plus/es/components/tree/src/model/node'
// interface Tree {
//   id: number
//   label: string
//   children?: Tree[]
// }

// const treeRef = ref<InstanceType<typeof ElTree>>()

// const defaultProps = {
//   children: 'children',
//   label: 'label',
// }
const deptTreeRef = ref()
const areaText = ref('')
const errorHandler = () => true
// 树状图
function listToTree(data: any, parentId: any = null) {
  const result: any[] = []
  for (const node of data) {
    if (node.parentId === parentId) {
      const treeNode = { ...node, children: listToTree(data, node.id) }
      result.push(treeNode)
    }
  }
  return result
}
/** 通过条件过滤节点  */
const filterNode = (value, data) => {
  if (!value) return true
  return data.label.indexOf(value) !== -1
}
const listData: any = ref([])
const leafAreaList = ref([])
const getareaList = async () => {
  const result: any = wsCache.get(appStoreOut.getUserInfo).sysAreas
  // 遍历出顶级节点id
  const ids = result.map((item) => item.id)
  const pIds = result.map((item) => item.parentId)
  let parentIds = result.filter((item) => !ids.includes(item.parentId)).map((item) => item.parentId)
  // 去重
  parentIds = [...new Set(parentIds)]
  parentIds.forEach((id) => {
    listData.value = [...listData.value, ...listToTree(result, id)]
  })
  listData.value.unshift({ name: '显示全部' })
  const areaCode = wsCache.get('areaName')
  leafAreaList.value = result.filter((item) => {
    return !result.some((innerItem) => item.id === innerItem.parentId)
  })
  if (areaCode) {
    areaText.value = areaCode
  } else {
    reloadArea()
  }
}

const reloadArea = () => {
  areaText.value = listData.value[1].name
  wsCache.set('areaInfo', listData.value[1])
  wsCache.set('areaCode', listData.value[1].code)
  wsCache.set('areaName', listData.value[1].name)
  const areaProjectCode = getAreaProjectCode(listData.value[1])
  wsCache.set('areaProjectCode', areaProjectCode)
  const leafAreaFlag = listData.value[1].level === 3
  wsCache.set('leafAreaFlag', leafAreaFlag)
  if (leafAreaFlag) {
    const currentArea = leafAreaList.value?.find((item: any) => item.name === listData.value[1].name)
    const areaProjectCode = getAreaProjectCode(currentArea)
    const areaProjectName = getAreaProjectName(currentArea)
    wsCache.set('areaProjectCode', areaProjectCode)
    wsCache.set('xiamenFlag', areaProjectName?.includes('厦门'))
  }
}

const selectedNodeId = ref(null as any)
async function handleNodeClick(data: any) {
  if (data.name === '显示全部') {
    await removeArea().then(() => {
      reloadArea()
      // resetRouter() // 重置静态路由表
      replace('/dashboard/analysis')
      setTimeout(() => {
        location.reload()
      }, 500)
    })
    return
  }
  if (data.id === selectedNodeId.value) {
    // 如果当前节点已经选中，则取消选中
    selectedNodeId.value = null
  } else {
    // 否则选中当前节点
    selectedNodeId.value = data.id
  }
  await area({ id: selectedNodeId.value, name: data.name }).then((response) => {
    wsCache.set('areaInfo', response.data)
    wsCache.set('areaCode', response.data.code)
    wsCache.set('areaName', response.data.name)
    // 每层级都记录项目code
    const areaProjectCode = getAreaProjectCode(response.data)
    wsCache.set('areaProjectCode', areaProjectCode)

    // 选中的节点是否是叶子节点（单一项目层级）
    const leafAreaFlag = response.data.level === 3
    wsCache.set('leafAreaFlag', leafAreaFlag)
    if (leafAreaFlag) {
      // 拼接项目代码
      const currentArea = leafAreaList.value?.find((item: any) => item.name === response.data.name)
      const areaProjectCode = getAreaProjectCode(currentArea)
      const areaProjectName = getAreaProjectName(currentArea)
      wsCache.set('areaProjectCode', areaProjectCode)
      wsCache.set('xiamenFlag', areaProjectName?.includes('厦门'))
    }
    // resetRouter() // 重置静态路由表
    replace('/dashboard/analysis')
    setTimeout(() => {
      location.reload()
    }, 500)
  })
}

function getAreaProjectCode(area) {
  if (!area.parentArea) {
    return area.code
  }
  return getAreaProjectCode(area.parentArea) + ',' + area.code
}

function getAreaProjectName(area) {
  if (!area.parentArea) {
    return area.name
  }
  return getAreaProjectName(area.parentArea) + ',' + area.name
}

getareaList()
const tagsViewStore = useTagsViewStore()

const { getPrefixCls } = useDesign()

const prefixCls = getPrefixCls('user-info')

const { t } = useI18n()

const { replace } = useRouter()

const loginOut = () => {
  ElMessageBox.confirm(t('common.loginOutMessage'), t('common.reminder'), {
    confirmButtonText: t('common.ok'),
    cancelButtonText: t('common.cancel'),
    type: 'warning'
  })
    .then(async () => {
      wsCache.clear()
      tagsViewStore.delAllViews()
      resetRouter() // 重置静态路由表
      replace('/login')
      location.reload()
    })
    .catch(() => {})
}

// const toDocument = () => {
//   window.open('https://element-plus-admin-doc.cn/')
// }
const { avatar } = storeToRefs(imageStore)

const imageURL = avatarStore()
const avatarImg = wsCache.get(appStore.getUserInfo).user.avatar
const image = avatarImg ? imageURL.imageLink + avatarImg : userImg

const userCenter = () => {
  replace('/system/userCenter')
  // replace('/userCenter/index')
}
</script>

<template>
  <div>
    <el-avatar shape="square" :size="36" src="" @error="errorHandler" style="margin-right: 5px">
      <img :src="avatar || image" />
    </el-avatar>
    <ElDropdown :class="prefixCls">
      <div class="flex items-center">
        <span class="<lg:hidden text-14px pl-[5px] text-[var(--top-header-text-color)]">[欢迎你,&nbsp;{{ wsCache.get(appStore.getUserInfo).user.nickname }}]</span>
      </div>
      <span class="el-dropdown-link">
        Dropdown List
        <el-icon class="el-icon--right">
          <arrow-down />
        </el-icon>
      </span>
      <template #dropdown>
        <!-- <el-dropdown-menu>
        <el-dropdown-item>版本切换
          <el-dropdown-menu>
            <el-dropdown-item>新系统
            </el-dropdown-item>
            <el-dropdown-item>旧系统</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown-item>
        <el-dropdown-item>设备管理系统</el-dropdown-item>
      </el-dropdown-menu> -->
        <ElDropdownMenu>
          <!-- <ElDropdownItem>
          <div @click="toDocument">{{ t('common.document') }}</div>
        </ElDropdownItem> -->
          <ElDropdownItem>
            <div @click="userCenter">个人中心</div>
          </ElDropdownItem>
          <ElDropdownItem divided>
            <div @click="loginOut">{{ t('common.loginOut') }}</div>
          </ElDropdownItem>
        </ElDropdownMenu>
      </template>
    </ElDropdown>
    <ElDropdown :class="prefixCls">
      <div>
        &nbsp;&nbsp;|&nbsp;&nbsp;当前所属项目:
        <span style="text-decoration: underline; cursor: pointer">{{ areaText || '全国' }}</span>
        <Icon icon="ep:caret-bottom" style="vertical-align: top; color: #000" />
        &nbsp;&nbsp;|&nbsp;&nbsp;
      </div>
      <template #dropdown>
        <ElDropdownMenu style="width: 170px">
          <el-tree
            :data="listData"
            :props="{ label: 'name', children: 'children' }"
            :expand-on-click-node="false"
            :filter-node-method="filterNode"
            ref="deptTreeRef"
            node-key="code"
            :highlight-current="true"
            default-expand-all
            :check-strictly="true"
            :current-node-key="selectedNodeId"
            @node-click="handleNodeClick"
          />
        </ElDropdownMenu>
      </template>
    </ElDropdown>
  </div>
</template>
<style scoped>
:deep(.el-dropdown) {
  color: var(--top-header-text-color);
}
:deep(.el-divider--vertical) {
  margin: 0 20px;
  border-color: #ebe9e6;
}
.top-project {
  color: var(--main-text-color);
}
</style>
