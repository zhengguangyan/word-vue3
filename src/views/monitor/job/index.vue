<template>
  <el-card shadow="never" class="card">
    <template #header>
      <div class="card-header">
        <span class="title">定时任务</span>
      </div>
    </template>
    <div>
      <!-- 搜索 -->
      <el-form ref="menuRef" :inline="true" :model="queryParams" class="demo-form-inline">
        <el-form-item label="状态">
          <el-select v-model="queryParams.status" placeholder="菜单状态" clearable>
            <el-option label="正常" value="0" />
            <el-option label="停用" value="1" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">搜索</el-button>
          <el-button @click="resetQuery" :icon="Refresh">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 按钮 -->
    <el-row :gutter="10" class="mb-10px">
      <el-col :span="1.5">
        <el-button type="primary" :disabled="getAuth('system:menu:add')" :icon="Plus" @click="handleAdd">新增</el-button>
      </el-col>
    </el-row>

    <!-- 表格 -->
    <el-table
      v-if="refreshTable"
      :data="DataList"
      row-key="id"
      :default-expand-all="isExpandAll"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      style="height: calc(100vh - 330px)"
      header-row-class-name="table-header"
      class-name="table-without-border"
      border
    >
      <el-table-column show-overflow-tooltip prop="name" label="菜单名称" width="200" />
      <!-- <el-table-column show-overflow-tooltip prop="icon" label="图标">
          <template #default="scope">
            <span>{{ scope.row.icon }}</span>
            <svg-icon :icon-class="scope.row.icon" />
          </template>
        </el-table-column> -->
      <el-table-column show-overflow-tooltip prop="orderNum" label="排序" width="100" />
      <el-table-column show-overflow-tooltip prop="perms" label="权限标识" min-width="200" />
      <el-table-column show-overflow-tooltip prop="component" label="组件路径" min-width="200" />
      <el-table-column show-overflow-tooltip prop="status" label="菜单状态" width="100">
        <!-- <template #default="scope">
          <el-tag>{{ scope.row.status == 0 ? '正常' : '停用' }}</el-tag>
        </template> -->
        <template #default="scope">
          <el-switch v-model="scope.row.status" class="ml-2" active-value="0" inactive-value="1" @change="getStatus(scope.row)" />
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip prop="createTime" label="创建时间" width="170" />
      <el-table-column label="操作" align="center" width="210" class-name="small-padding fixed-width" fixed="left" type="">
        <template #default="scope">
          <el-link type="primary" class="links" :disabled="getAuth('system:menu:query')" @click="handleUpdate(scope.row, '查看')">查看</el-link>
          <el-link type="primary" class="links" :disabled="getAuth('system:menu:edit')" @click="handleUpdate(scope.row, 'edit')">修改</el-link>
          <el-link type="primary" class="links" :disabled="getAuth('system:menu:remove')" @click="handleDelete(scope.row)">删除</el-link>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
  <!-- 弹框 -->
  <el-dialog v-model="open" :title="modalType + '菜单'" :close-on-click-modal="false">
    <el-form v-show="modalType == '修改' || modalType == '添加'" ref="menuRef" :model="form" :rules="rules" label-width="100px" :label-position="'right'">
      <el-row>
        <el-col :span="24">
          <el-form-item label="菜单类型">
            <el-radio-group v-model="form.menuType" :change="menuType()">
              <el-radio :value="1">目录</el-radio>
              <el-radio :value="2" :disabled="modalType == '修改'">菜单</el-radio>
              <el-radio :value="3" :disabled="modalType == '修改'">按钮</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="上级菜单" v-if="form.menuType != '1'">
            <el-tree-select
              v-model="form.parentId"
              v-if="title != '查看'"
              :data="menuOptions"
              clearable
              style="width: 220px"
              :props="{ value: 'id', label: 'label', children: 'children' }"
              value-key="id"
              placeholder="选择上级菜单"
              check-strictly
              class="tree-select"
            />
          </el-form-item>
        </el-col>

        <el-col :span="24" v-if="form.menuType != 3">
          <el-form-item label="菜单图标" prop="icon">
            <IconPicker v-model="form.icon" @selected="selected" :icon="form.icon" style="width: 220px" />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="菜单名称" prop="name">
            <el-input v-model="form.name" clearable v-if="title != '查看'" style="width: 220px" placeholder="请输入菜单名称" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="显示排序" prop="orderNum">
            <el-input-number style="width: 220px" v-model="form.orderNum" controls-position="right" :min="0" :precision="0" v-if="title != '查看'" />
          </el-form-item>
        </el-col>

        <el-col :span="12" v-if="form.menuType != 3">
          <el-form-item>
            <template #label>
              <span>
                <el-tooltip content="选择是外链则路由地址需要以`http(s)://`开头" placement="top">
                  <el-icon><question-filled /></el-icon> </el-tooltip
                >是否外链
              </span>
            </template>
            <el-radio-group v-model="form.isFrame" v-if="title != '查看'">
              <el-radio value="0">是</el-radio>
              <el-radio value="1">否</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="form.menuType != 3">
          <el-form-item prop="path">
            <template #label>
              <span>
                <el-tooltip content="访问的路由地址，如：`user`，如外网地址需内链访问则以`http(s)://`开头" placement="top">
                  <el-icon><question-filled /></el-icon>
                </el-tooltip>
                路由地址
              </span>
            </template>
            <el-input v-model="form.path" placeholder="请输入路由地址" style="width: 220px" />
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="form.menuType == 2">
          <el-form-item prop="component">
            <template #label>
              <span>
                <el-tooltip content="访问的组件路径，如：`system/user/index`，默认在`views`目录下" placement="top">
                  <el-icon><question-filled /></el-icon>
                </el-tooltip>
                组件路径
              </span>
            </template>
            <el-input v-model="form.component" placeholder="请输入组件路径" style="width: 220px" />
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="form.menuType != 1">
          <el-form-item>
            <el-input v-model="form.perms" placeholder="请输入权限标识" maxlength="100" style="width: 220px" />
            <template #label>
              <span>
                <el-tooltip content="控制器中定义的权限字符，如：@PreAuthorize(`@ss.hasPermi('system:user:list')`)" placement="top">
                  <el-icon><question-filled /></el-icon>
                </el-tooltip>
                权限字符
              </span>
            </template>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="form.menuType == 2">
          <el-form-item>
            <el-input v-model="form.query" placeholder="请输入路由参数" maxlength="255" style="width: 220px" />
            <template #label>
              <span>
                <el-tooltip content='访问路由的默认传递参数，如：`{"id": 1, "name": "ry"}`' placement="top">
                  <el-icon><question-filled /></el-icon>
                </el-tooltip>
                路由参数
              </span>
            </template>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="form.menuType == 2">
          <el-form-item>
            <template #label>
              <span>
                <el-tooltip content="选择是则会被`keep-alive`缓存，需要匹配组件的`name`和地址保持一致" placement="top">
                  <el-icon><question-filled /></el-icon>
                </el-tooltip>
                是否缓存
              </span>
            </template>
            <el-radio-group v-model="form.isCache">
              <el-radio value="0">缓存</el-radio>
              <el-radio value="1">不缓存</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="form.menuType != 3">
          <el-form-item>
            <template #label>
              <span>
                <el-tooltip content="选择隐藏则路由将不会出现在侧边栏，但仍然可以访问" placement="top">
                  <el-icon><question-filled /></el-icon>
                </el-tooltip>
                显示状态
              </span>
            </template>
            <el-radio-group v-model="form.visible">
              <el-radio value="0">正常</el-radio>
              <el-radio value="1">停用</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="菜单状态">
            <el-radio-group v-model="form.status">
              <el-radio value="0">正常</el-radio>
              <el-radio value="1">停用</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <!-- 菜单数据权限 -->
      <el-row v-if="form.menuType == 2">
        <el-col :span="24">
          <el-form-item label="数据权限类型">
            <el-table :data="menuDataAuth" border style="width: 100%">
              <el-table-column show-overflow-tooltip prop="date" label="权限类型" />
              <el-table-column show-overflow-tooltip prop="stauts" label="授权状态">
                <template #default="scope">
                  <el-switch v-model="scope.row.stauts" @click="installStatus(scope.row, scope.$index)" inline-prompt active-text="" inactive-text="" />
                </template>
              </el-table-column>
              <el-table-column show-overflow-tooltip prop="roleAndMenu" label=" 组织区域与对应菜单匹配项" width="200" />
              <el-table-column show-overflow-tooltip prop="defaultPermission" label="特殊权限">
                <template #default="scope">
                  <!-- :checked="scope.row.auth == form.defaultPermission" -->
                  <el-check-tag :checked="scope.row.stauts" size="small" :style="defalutArr[scope.$index] ? 'color: green' : ''" type="success" @change="installDefault(scope)">设置默认</el-check-tag>
                </template>
              </el-table-column>
            </el-table>
            <el-checkbox v-model="Configure" @change="installAllStauts" label="暂不支持配置用户数据权限" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="数据显示规则">
            <el-radio-group v-model="form.ShowRule">
              <el-radio :value="0">按用户数据权限显示</el-radio>
              <el-radio :value="1">按项目显示</el-radio>
              <el-radio :value="2">其他</el-radio>
              <el-radio :value="3">无</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="20">
          <el-form-item label="备注">
            <el-input v-model="form.remark" :rows="2" type="textarea" placeholder="请输入备注内容" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <el-form v-if="modalType == '查看'" ref="menuRef" :model="form" :rules="rules" label-position="'right'" label-width="100px">
      <el-row>
        <el-col :span="24">
          <el-form-item label="菜单类型">
            <span>{{ form.menuType == 1 ? '目录' : form.menuType == 2 ? '菜单' : form.menuType == 3 ? '按钮' : '' }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="上级菜单" v-if="form.menuType != '1'">
            <span>{{ getParent(form.parentId) }}</span>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="菜单名称" prop="name">
            <span>{{ form.name }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="显示排序" prop="orderNum">
            <span>{{ form.orderNum }}</span>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="创建时间" prop="createTime">
            <span>{{ form.createTime }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="创建人" prop="creatorName">
            <span>{{ form.creatorName }}</span>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="更新时间" prop="updateTime">
            <span>{{ form.updateTime }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="更新人" prop="updaterName">
            <span>{{ form.updaterName }}</span>
          </el-form-item>
        </el-col>

        <el-col :span="12" v-if="form.menuType != 3">
          <el-form-item>
            <template #label>
              <span>
                <el-tooltip content="选择是外链则路由地址需要以`http(s)://`开头" placement="top">
                  <el-icon><question-filled /></el-icon> </el-tooltip
                >是否外链
              </span>
            </template>
            <span>{{ form.isFrame == 0 ? '是' : form.isFrame == 1 ? '否' : '' }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="form.menuType != 3">
          <el-form-item prop="path">
            <template #label>
              <span>
                <el-tooltip content="访问的路由地址，如：`user`，如外网地址需内链访问则以`http(s)://`开头" placement="top">
                  <el-icon><question-filled /></el-icon>
                </el-tooltip>
                路由地址
              </span>
            </template>
            <span>{{ form.path }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="form.menuType == 2">
          <el-form-item prop="component">
            <template #label>
              <span>
                <el-tooltip content="访问的组件路径，如：`system/user/index`，默认在`views`目录下" placement="top">
                  <el-icon><question-filled /></el-icon>
                </el-tooltip>
                组件路径
              </span>
            </template>
            <span>{{ form.component }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="form.menuType != 1">
          <el-form-item>
            <span>{{ form.perms }}</span>
            <template #label>
              <span>
                <el-tooltip content="控制器中定义的权限字符，如：@PreAuthorize(`@ss.hasPermi('system:user:list')`)" placement="top">
                  <el-icon><question-filled /></el-icon>
                </el-tooltip>
                权限字符
              </span>
            </template>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="form.menuType == 2">
          <el-form-item>
            <span>{{ form.query }}</span>
            <template #label>
              <span>
                <el-tooltip content='访问路由的默认传递参数，如：`{"id": 1, "name": "ry"}`' placement="top">
                  <el-icon><question-filled /></el-icon>
                </el-tooltip>
                路由参数
              </span>
            </template>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="form.menuType == 2">
          <el-form-item>
            <template #label>
              <span>
                <el-tooltip content="选择是则会被`keep-alive`缓存，需要匹配组件的`name`和地址保持一致" placement="top">
                  <el-icon><question-filled /></el-icon>
                </el-tooltip>
                是否缓存
              </span>
            </template>
            <span>{{ form.isCache == 0 ? '缓存' : '不缓存' }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="form.menuType != 3">
          <el-form-item>
            <template #label>
              <span>
                <el-tooltip content="选择隐藏则路由将不会出现在侧边栏，但仍然可以访问" placement="top">
                  <el-icon><question-filled /></el-icon>
                </el-tooltip>
                显示状态
              </span>
            </template>
            <span>{{ form.visible == 0 ? '正常' : '停用' }}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <!-- 菜单数据权限 -->
      <el-row v-if="form.menuType == 2">
        <el-col :span="24">
          <el-form-item label="数据权限类型">
            <el-table :data="menuDataAuth" border style="width: 100%">
              <el-table-column show-overflow-tooltip prop="date" label="权限类型" />
              <el-table-column show-overflow-tooltip prop="stauts" label="授权状态">
                <template #default="scope">
                  <el-switch v-model="scope.row.stauts" @click="installStatus(scope.row, scope.$index)" inline-prompt active-text="" inactive-text="" />
                </template>
              </el-table-column>
              <el-table-column show-overflow-tooltip prop="roleAndMenu" label=" 组织区域与对应菜单匹配项" width="200" />
              <el-table-column show-overflow-tooltip prop="defaultPermission" label="特殊权限">
                <template #default="scope">
                  <!-- :checked="scope.row.auth == form.defaultPermission" -->
                  <el-check-tag :checked="scope.row.stauts" size="small" :style="defalutArr[scope.$index] ? 'color: green' : ''" type="success" @change="installDefault(scope)">设置默认</el-check-tag>
                  <!-- <el-button :type="defalutArr[scope.$index] ? 'warning' : 'info'"
                      @change="installDefault(scope)">设置默认</el-button> -->
                </template>
              </el-table-column>
            </el-table>
            <el-checkbox v-model="Configure" @change="installAllStauts" label="暂不支持配置用户数据权限" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="数据显示规则">
            <el-radio-group v-model="form.ShowRule">
              <el-radio :value="0">按用户数据权限显示</el-radio>
              <el-radio :value="1">按项目显示</el-radio>
              <el-radio :value="2">其他</el-radio>
              <el-radio :value="3">无</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="20">
          <el-form-item label="备注">
            <el-input v-model="form.remark" :rows="2" type="textarea" placeholder="请输入备注内容" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" v-if="modalType != '查看'" @click="submitForm"> 确定 </el-button>
        <el-button @click="cancel">取消</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts" name="Menu">
import { reactive, ref, onMounted, toRefs } from 'vue'
import { addMenu, updateMenu, menuDetail, getMenuAuth, getRoleMenuTree } from '@/api/sys/menu' //引入数据
import { ElMessage, ElMessageBox } from 'element-plus'
import { IconPicker } from '@/components/IconPicker'
import { QuestionFilled, Refresh, Plus } from '@element-plus/icons-vue'
import { getAuth } from '@/utils/export'
import { jobChangeStatus, jobDetail, jobList } from '@/api/sys/monitor'
const DataList: any = ref([]) //存放表格数据
const menuRef = ref(null) //声明一个表单dom,这个元素身上所有的方法 属性都可以使用
const open = ref(false)
const title = ref('编辑')
const menuOptions: any = ref([]) //新增的树状型
const refreshTable = ref(true) //表格展开
const isExpandAll = ref(false)
const tagChecked = ref('') //默认选中

//修改弹框里的菜单数据
const menuCheck = ref(false) //现在弹框菜单按钮
const Configure = ref(false)
const defalutArr = ref([false, false, false, false])
const modalType = ref('')
const parent = ref()
const parentList: any = ref([])

const menuDataAuth = ref([
  {
    date: '全国数据',
    stauts: false,
    auth: 'allData'
  },
  {
    date: '所属项目数据',
    stauts: false,
    auth: 'orgAndBelow'
  },
  {
    date: '所属组织区域数据',
    stauts: false,
    auth: 'orgRegionAndBelow'
  },
  {
    date: '仅本人数据',
    stauts: false,
    auth: 'onlySelf'
  }
])
const data: any = reactive({
  form: {
    parentId: undefined,
    menuType: undefined,
    name: undefined,
    orderNum: undefined,
    isFrame: undefined,
    path: undefined,
    visible: undefined,
    status: undefined,
    icon: undefined,
    component: undefined,
    perms: undefined,
    query: undefined,
    isCache: undefined,
    id: undefined,
    remark: undefined,
    allData: undefined,
    orgRegionAndBelow: undefined,
    onlySelf: undefined,
    orgAndBelow: undefined,
    defaultPermission: 'allData',
    ShowRule: ''
  },
  queryParams: {
    name: undefined,
    visible: undefined,
    status: undefined
  },
  rules: {
    name: [{ required: true, message: '菜单名称不能为空', trigger: 'blur' }],
    orderNum: [{ required: true, message: '菜单顺序不能为空', trigger: 'blur' }],
    // path: [{ required: true, message: "路由地址不能为空", trigger: "blur" }],
    defaultPermission: [{ required: true, message: '默认权限必须设置一条', trigger: 'blur' }],
    component: [{ required: true, message: '组件地址不能为空', trigger: 'blur' }]
  }
})
const { queryParams, form, rules } = toRefs(data)
/** 表单重置 */
function reset() {
  form.value = {
    id: undefined,
    parentId: '',
    name: undefined,
    icon: undefined,
    menuType: 2,
    orderNum: undefined,
    isFrame: '1',
    isCache: '0',
    visible: '',
    status: '0',
    remark: undefined,
    allData: undefined,
    orgRegionAndBelow: undefined,
    onlySelf: undefined,
    orgAndBelow: undefined,
    defaultPermission: 'allData'
  }
  // proxy.resetForm("menuRef");
}

const installDefault = (scope) => {
  if (!scope.row.stauts) {
    return
  }
  defalutArr.value.forEach((_item, index) => {
    defalutArr.value[index] = index == scope.$index
  })

  menuDataAuth.value.forEach((_item, _index) => {
    //item.stauts = false //index == row.$index
  })
  if (scope.row.stauts) {
    //defalutArr.value[row.$index] = true
    //menuDataAuth.value[row.$index].stauts = false
  }

  tagChecked.value = scope.row.auth
  form.value.defaultPermission = tagChecked.value
}

const installStatus = (row, index: number) => {
  form.value[row.auth] = row.stauts

  if (row.stauts && Configure.value) {
    Configure.value = false
  }
  defalutArr.value[index] = false
}
const installAllStauts = (e) => {
  if (e) {
    menuDataAuth.value.forEach((element) => {
      element.stauts = !e
      form.value[element.auth] = element.stauts
    })
    defalutArr.value.forEach((_item, index) => {
      defalutArr.value[index] = !e
    })
  }
}
// 方法

// 菜单数据
const getmenuList = async () => {
  const result: any = await jobList({
    status: data.queryParams.status
  })
  if (result.code == 200) {
    DataList.value = result.list
  }
}

function getParent(id) {
  parent.value = parentList.value.find((item) => item.id === id)
  const parentName = parent.value.name
  return parentName
}

async function getMenuThree(type) {
  menuOptions.value = []
  getRoleMenuTree(type).then((res) => {
    menuOptions.value = res['menus']
  })
  // const res = await menuList()
  // menuOptions.value = getTreeData(res.data, 0)
}

const menuType = () => {
  getMenuThree(data.form.menuType)
}

// 重置
function resetQuery() {
  data.queryParams.name = undefined
  data.queryParams.status = undefined
  getmenuList() //清空在请求列表
}
// 搜索
function onSubmit() {
  getmenuList()
}

/** 选择图标 */
function selected(name) {
  form.value.icon = name
  // showChooseIcon.value = false
}
//组件挂载完毕钩子---发一次请求,获取第一页、一页三个已有品牌数据
onMounted(() => {
  getmenuList()
})

// 添加
function handleAdd() {
  reset()
  menuDataAuth.value.forEach((item) => {
    item.stauts = false
  })
  open.value = true
  title.value = '添加菜单'
  modalType.value = '添加'
}
// 修改
async function handleUpdate(row, type) {
  if (type === '查看') {
    modalType.value = '查看'
  } else {
    modalType.value = '修改'
  }

  // reset();
  if (row.children.length != 0) {
    menuCheck.value = true
  } else {
    menuCheck.value = false
  }

  await menuDetail(row.id).then((response) => {
    form.value = response.data
    open.value = true
    title.value = '修改菜单'
  })

  await getMenuAuth(row.id).then((response) => {
    menuDataAuth.value.forEach((item) => {
      item.stauts = response.data[item.auth]
    })
    if (response.data.defaultPermission == 'onlySelf') {
      defalutArr.value[3] = true
    } else if (response.data.defaultPermission == 'orgAndBelow') {
      defalutArr.value[1] = true
    } else if (response.data.defaultPermission == 'orgRegionAndBelow') {
      defalutArr.value[2] = true
    } else if (response.data.defaultPermission == 'allData') {
      defalutArr.value[0] = true
    }
  })
}

function getParentId(id) {
  parent.value = parentList.value.find((item) => item.id === id)
  const parentId = parent.value.parentId
  const parents = ref()
  parents.value = parentList.value.find((item) => item.id === parentId)
  return parents.value
}

// 提交按钮
const submitForm = async () => {
  if (data.form.menuType == 3) {
    if (getParentId(data.form.parentId) === undefined) {
      ElMessage({
        type: 'error',
        message: '上级菜单不能为目录类型'
      })
      return false
    }
  }
  if (form.value.id != undefined) {
    let result: any = await updateMenu(form.value)
    if (result.code == 200) {
      //关闭对话框
      open.value = false
      //弹出提示信息
      ElMessage({
        type: 'success',
        message: '修改成功'
      })
      //再次发请求获取
      getmenuList()
    }
  } else {
    let result: any = await addMenu(form.value)
    if (result.code == 200) {
      //关闭对话框
      open.value = false
      //弹出提示信息
      ElMessage({
        type: 'success',
        message: '添加成功'
      })
      //再次发请求获取
      getmenuList()
    }
  }
}
// 取消按钮
function cancel() {
  open.value = false
}

// 删除
function handleDelete(row) {
  const tipText = ref('')
  tipText.value = '是否确认删除名称为"' + row.name + '"的数据项?'
  ElMessageBox.confirm(tipText.value, '系统提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消'
  }).then(() => {
    jobDetail(row.id)
      .then(() => {
        ElMessage({
          type: 'success',
          message: '删除成功'
        })
        getmenuList()
      })
      .catch(() => {
        ElMessage({
          type: 'info',
          message: '已取消'
        })
        getmenuList()
      })
  })
}

// 点击开启按钮改变状态
function getStatus(val) {
  let data = { id: val.id, status: val.status }
  if (val.status == 0) {
    ElMessageBox.confirm('是否开启状态?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消'
    })
      .then(() => {
        jobChangeStatus(data).then(() => {
          ElMessage({
            type: 'success',
            message: '修改成功'
          })
          getmenuList()
        })
      })
      .catch(() => {
        getmenuList()
      })
  } else {
    ElMessageBox.confirm('是否关闭状态?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消'
    })
      .then(() => {
        jobChangeStatus(data).then(() => {
          ElMessage({
            type: 'success',
            message: '修改成功'
          })
          getmenuList()
        })
      })
      .catch(() => {
        getmenuList()
      })
  }
}

getmenuList()
</script>

<style lang="less" scoped>
.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.box-card {
  width: 100%;
}

.tree-select {
  width: 50%;
}

.links {
  margin-right: 15px;
  text-decoration: underline;
}

.el-button.is-disabled,
.el-button.is-disabled:focus,
.el-button.is-disabled:hover {
  background-color: #cccccc;
  border-color: #cccccc;
}

.color-green {
  color: green;
}

.color-none {
  color: #909399;
}

.el-link.el-link--primary {
  --el-link-disabled-text-color: #cccccc;
}

.el-button:hover {
  border-color: #ffbf66;
  background-color: #ffbf66;
  color: #fff;
}

.el-button:active {
  border-color: #e58600;
  background-color: #e58600;
}

.el-button:focus-visible {
  outline: 2px solid #e58600;
  outline-offset: 1px;
}

.el-button:focus {
  border-color: #e58600;
  background-color: #e58600;
  outline: 0;
}

.el-link:hover {
  color: #ffbf66;
}

.el-link.is-disabled:hover {
  color: #ccc;
}
</style>
