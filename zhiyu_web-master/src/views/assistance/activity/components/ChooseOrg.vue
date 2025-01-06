<template>
  <el-dialog v-model="visible" title="选择参与组织" append-to-body width="1208px" :close-on-click-modal="false" draggable @close="handleClose" class="choose-org-dialog">
    <div class="left-box">
      <h2 class="box-title">组织列表</h2>
      <div class="input-box">
        <el-input v-model="params.keyword" placeholder="搜索组织名称" clearable />
      </div>
      <div class="tree-box">
        <el-tree
          :data="DeptTree"
          :props="{ label: 'deptName', children: 'children' }"
          ref="treeRef"
          node-key="id"
          :expand-on-click-node="false"
          default-expand-all
          :filter-node-method="filterNode"
          @node-click="handleDeptClick"
        />
      </div>
    </div>
    <div class="user-box">
      <h2 class="box-title line-1" :title="currentDept.deptName">
        <span>可分配用户</span>
        <span v-if="currentDept.deptName">「{{ currentDept.deptName }}」</span>
      </h2>
      <el-table :data="currentDept.children" @selection-change="handleDeptSelectionChange" height="calc(60vh - 33px)" :empty-text="currentDept.deptName ? '该组织暂无可分配用户' : '请先选择组织'">
        <el-table-column show-overflow-tooltip type="selection" width="45" align="center"></el-table-column>
        <el-table-column show-overflow-tooltip label="用户名" width="100" prop="userName"></el-table-column>
        <el-table-column show-overflow-tooltip label="组织" prop="parentName"></el-table-column>
      </el-table>
    </div>
    <section class="center-box">
      <el-button type="primary" class="ope-btn" :disabled="!deptMultipleSelection.length || !currentDept.children.length" @click="handleAdd">
        <span class="r-m-r-10">添加</span>
        <Icon icon="ep:arrow-right" />
      </el-button>
      <div class="r-m-t-20">
        <el-button plain class="ope-btn" :disabled="!multipleSelection.length || !userList.length" @click="handleRemove">
          <Icon icon="ep:arrow-left" />
          <span class="r-m-l-10">移除</span>
        </el-button>
      </div>
    </section>
    <div class="right-box">
      <h2 class="box-title">已分配用户</h2>
      <el-table :data="userList" @selection-change="handleSelectionChange" height="calc(60vh - 33px)" empty-text="暂未选择人员">
        <el-table-column type="selection" width="45" align="center"></el-table-column>
        <el-table-column show-overflow-tooltip label="用户名" width="100" prop="userName"></el-table-column>
        <el-table-column show-overflow-tooltip label="组织" prop="parentName"></el-table-column>
      </el-table>
    </div>
    <template #footer>
      <el-button plain @click="handleClose">取消</el-button>
      <el-button type="primary" @click="handleConfirm">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, nextTick, watch } from 'vue'
import { getOrgUsers } from '@/api/assistance/activity'
import { ElLoading, ElMessage, ElTree } from 'element-plus'

const visible = ref(false)
const open = (list?: any[]) => {
  if (list) {
    userList.value = list
  }
  visible.value = true
  if (!treeData.value.length) {
    nextTick(() => {
      loadData()
    })
  }
}
defineExpose({ open })

const treeData = ref<any[]>([]) // 真实树形数据（包含部门和用户）
const DeptTree = ref<any[]>([]) // 显示在最左侧的树形列表（仅包含部门）
const userList = ref<any[]>([]) // 已分配用户
const currentDept = reactive({
  // 当前选择的部门
  id: 0,
  deptName: '',
  children: [] as any[]
})

const params = reactive({
  keyword: '',
  deptId: ''
})
const loadData = async () => {
  const loading = ElLoading.service({
    target: '.choose-org-dialog',
    text: '数据加载中，请稍候...'
  })
  try {
    const { data } = await getOrgUsers(params)
    treeData.value = data
    const copyData = JSON.parse(JSON.stringify(data))
    handleTreeData(copyData)
    DeptTree.value = copyData
  } finally {
    loading.close()
  }
}

// 处理树形数据，过滤掉用户，生成纯部门树
const handleTreeData = (list: any[]) => {
  list.forEach((item) => {
    if (item.children && item.children.length) {
      item.children = item.children.filter((i) => !i.userId)
      handleTreeData(item.children)
    }
  })
}

// 根据部门id，从treeData中找到部门
const getDeptById = (list: any[], id: number) => {
  for (let i = 0; i < list.length; i++) {
    if (list[i].id === id) return JSON.parse(JSON.stringify(list[i]))
    if (list[i].children && list[i].children.length) {
      const dept = getDeptById(list[i].children, id)
      if (dept) return JSON.parse(JSON.stringify(dept))
    }
  }
}

// 添加到右侧
const handleAdd = () => {
  if (!currentDept.children.length) return ElMessage.error('该组织暂无人员')
  if (!deptMultipleSelection.value.length) return ElMessage.error('请选择人员')
  userList.value.push(...deptMultipleSelection.value)
  // 添加到右侧后，左侧的“可分配用户”也要随之改变
  const ids = deptMultipleSelection.value.map((item) => item.userId)
  currentDept.children = currentDept.children.filter((item) => !ids.includes(item.userId))
}
const handleRemove = () => {
  if (!multipleSelection.value.length) return ElMessage.error('请选择要移除的人员')
  const ids = multipleSelection.value.map((item) => item.userId)
  userList.value = userList.value.filter((item) => !ids.includes(item.userId))
  // 如果当前有已选中的部门，则需要重置“可分配用户”列表
  if (currentDept && currentDept.id) {
    const dept = getDeptById(treeData.value, currentDept.id)
    const userIds = userList.value.map((item) => item.userId)
    currentDept.children = dept.children && dept.children.length ? dept.children.filter((item) => !userIds.includes(item.userId) && item.userId) : []
  }
}

const treeRef = ref<InstanceType<typeof ElTree>>()
watch(
  () => params.keyword,
  (val) => {
    treeRef.value!.filter(val)
  }
)

const filterNode = (value: string, data: any) => {
  if (!value) return true
  return data.deptName.includes(value)
}

// 点击最左侧部门树
const handleDeptClick = (deptData: any) => {
  const dept = getDeptById(treeData.value, deptData.id)
  if (dept.children && dept.children.length) {
    const ids = userList.value.map((item) => item.userId)
    dept.children = dept.children.filter((item) => !ids.includes(item.id) && item.userId)
  } else {
    dept.children = []
  }
  Object.assign(currentDept, dept)
}

const deptMultipleSelection = ref<any[]>([]) // 可分配用户-勾选列表
const handleDeptSelectionChange = (val: any[]) => {
  deptMultipleSelection.value = val
}

const multipleSelection = ref<any[]>([]) // 已分配用户-勾选列表
const handleSelectionChange = (val: any[]) => {
  multipleSelection.value = val
}

const emit = defineEmits(['updateOperators'])
// 多选确认
const handleConfirm = () => {
  emit('updateOperators', userList.value)
  visible.value = false
}

const handleClose = () => {
  visible.value = false
}
</script>

<style lang="less">
.choose-org-dialog {
  .el-dialog__body {
    display: grid;
    grid-template-columns: 400px 300px auto 300px;
    height: 60vh;
    margin-bottom: 20px;
  }
  .box-title {
    line-height: 32px;
    padding: 0 16px;
    border-bottom: 1px solid #e0e0e0;
    background-color: #fff;
    font-size: 16px;
  }
  .input-box {
    padding: 10px;
  }
  .tree-box {
    height: calc(100% - 85px);
    overflow-x: auto;
    overflow-y: auto;
  }
  .left-box {
    height: 60vh;
    background-color: #fff;
  }
  .user-box {
    border-left: 1px solid #e0e0e0;
  }
  .right-box {
    height: 60vh;
    background-color: #fff;
  }
  .center-box {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 0 20px;
  }
  .ope-btn {
    width: 88px;
  }
}
</style>
