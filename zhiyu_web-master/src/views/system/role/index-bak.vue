<template>
  <ContentWrap :title="t('角色管理')">
    <Search :schema="allSchemas.searchSchema" @keyup="setSearchParams" @search="setSearchParams" @reset="setSearchParams" />

    <div class="mb-10px">
      <ElButton type="primary" :icon="addicon" @click="AddAction">
        {{ t('exampleDemo.add') }}
      </ElButton>
      <ElButton type="danger" :icon="delicon" @click="delData(null, true)">
        {{ t('exampleDemo.del') }}
      </ElButton>
      <!-- <ElButton type="primary" :icon="improticon" @click="AddAction">
        {{ t('导入') }}
      </ElButton>
      <ElButton type="primary" :icon="expicon" @click="AddAction">
        {{ t('导出') }}
      </ElButton> -->
    </div>

    <!--页面主表格-->
    <Table
      v-model:pageSize="tableObject.pageSize"
      v-model:currentPage="tableObject.currentPage"
      :columns="allSchemas.tableColumns"
      :data="tableObject.tableList"
      :loading="tableObject.loading"
      :pagination="{
        total: tableObject.total
      }"
      @register="register"
    >
      <template #action="{ row }">
        <ElButton size="small" type="primary" @click="action(row, 'edit')">
          {{ t('exampleDemo.edit') }}
        </ElButton>
        <ElButton size="small" type="primary" @click="action(row, 'dataAuthority')">
          {{ t('exampleDemo.dataAuthority') }}
        </ElButton>
        <ElButton size="small" type="danger" @click="delData(row, false)">
          {{ t('exampleDemo.del') }}
        </ElButton>
        <ElButton size="small" type="primary" @click="action(row, 'detail')">
          {{ t('exampleDemo.detail') }}
        </ElButton>
        <ElButton size="small" type="primary" @click="autHority(row)">
          {{ t('权限') }}
        </ElButton>
        <ElButton size="small" type="primary" @click="handleAuthUser(row)">
          {{ t('分配') }}
        </ElButton>
      </template>
    </Table>
  </ContentWrap>

  <Dialog v-model="dialogVisible" :title="dialogTitle" width="700">
    <Write v-if="actionType !== 'detail'" ref="writeRef" :form-schema="allSchemas.formSchema" :current-row="tableObject.currentRow" />
    <Detail v-if="actionType === 'detail'" :detail-schema="allSchemas.detailSchema" :current-row="tableObject.currentRow" />
    <el-button style="margin-left: 10px; margin-bottom: 10px" v-if="actionType !== 'detail'" type="primary" @click="toggleAllSelections(menuOptions)">全选/全不选</el-button>
    <!-- <el-button v-if="actionType !== 'detail'" type="primary" @click="toggleRowExpansion(menuOptions)">张开/收缩</el-button> -->

    <!--弹窗表格-->
    <el-table
      v-if="actionType !== 'detail'"
      ref="menuRef"
      :data="menuOptions"
      border
      :key="1"
      row-key="id"
      @selection-change="handleSelectionChange"
      @select="selectFun"
      :tree-props="{ children: 'children' }"
    >
      <!-- :selectable="(row) => getDisable(row, 'unpub')" -->
      <el-table-column type="selection" width="45" />
      <el-table-column show-overflow-tooltip prop="label" label="菜单选择" />
      <!-- <el-table-column show-overflow-tooltip prop="allData" label="全国数据" width="100">
        <template #default="scope">
          <el-checkbox v-if="!scope.row.children" v-model="scope.row.otherData.allData"
            @click="installStatus(scope.row, '0')" label="" size="small" />
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip prop="orgAndBelow" label="所属项目数据" width="110">
        <template #default="scope">
          <el-checkbox v-if="!scope.row.children" v-model="scope.row.otherData.orgAndBelow"
            @click="installStatus(scope.row, '0')" label="" size="small" />
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip prop="orgRegionAndBelow" label="所属组织区域数据" width="140">
        <template #default="scope">
          <el-checkbox v-if="!scope.row.children" v-model="scope.row.otherData.orgRegionAndBelow"
            @click="installStatus(scope.row, '0')" label="" size="small" />
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip prop="onlySelf" label="仅本人数据" width="100">
        <template #default="scope">
          <el-checkbox v-if="!scope.row.children" v-model="scope.row.otherData.onlySelf"
            @click="installStatus(scope.row, '0')" label="" size="small" />
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip prop="onlySelf" label="组织区域与对应菜单匹配" width="200">
        <template #default="scope">
          <div v-if="!scope.row.children">
            <el-checkbox line :disabled="scope.row.otherData.orgRegionAndBelow != true"
              v-model="scope.row.otherData.regionDomicile" @click="installStatus(scope.row, '1')" label="现居地址"
              size="small" />
            <el-checkbox line style="display:line-block ;" :disabled="scope.row.otherData.orgRegionAndBelow != true"
              v-model="scope.row.otherData.regionCurrent" @click="installStatus(scope.row, '1')" label="户籍地址"
              size="small" />
          </div>

        </template>
      </el-table-column> -->
    </el-table>
    <template #footer>
      <ElButton v-if="actionType !== 'detail'" type="primary" :loading="loading" @click="save">
        {{ t('exampleDemo.save') }}
      </ElButton>
      <ElButton @click="dialogVisible = false">{{ t('dialogDemo.close') }}</ElButton>
    </template>
  </Dialog>

  <!-- 功能权限配置 -->
  <Dialog v-model="menuDialogVisible" :title="dialogTitle">
    <Write v-if="actionType !== 'detail'" ref="writeRef" :form-schema="allSchemas.formSchema" :current-row="tableObject.currentRow" />
    <Detail v-if="actionType === 'detail'" :detail-schema="allSchemas.detailSchema" :current-row="tableObject.currentRow" />
    <el-button style="margin-left: 10px" v-if="actionType !== 'detail'" type="primary" @click="toggleAllSelections(menuOptions)">全选/全不选</el-button>
    <!-- <el-button v-if="actionType !== 'detail'" type="primary" @click="toggleRowExpansion(menuOptions)">张开/收缩</el-button> -->

    <!--弹窗表格-->
    <el-table
      style="margin-left: 10px"
      v-if="actionType !== 'detail'"
      ref="menuRef"
      :data="menuOptions"
      border
      :key="1"
      row-key="id"
      @selection-change="handleSelectionChange"
      @select="selectFun"
      :tree-props="{ children: 'children' }"
    >
      <!-- :selectable="(row) => getDisable(row, 'unpub')" -->
      <el-table-column type="selection" width="80" />
      <el-table-column show-overflow-tooltip prop="label" label="菜单选择" />
    </el-table>
    <template #footer>
      <ElButton v-if="actionType !== 'detail'" type="primary" :loading="loading" @click="save">
        {{ t('exampleDemo.save') }}
      </ElButton>
      <ElButton @click="menuDialogVisible = false">{{ t('dialogDemo.close') }}</ElButton>
    </template>
  </Dialog>

  <!-- 数据权限配置 -->
  <Dialog v-model="dataDialogVisible" :title="dialogTitle">
    <Write v-if="actionType !== 'detail'" ref="writeRef" :form-schema="allSchemas.formSchema" :current-row="tableObject.currentRow" />
    <Detail v-if="actionType === 'detail'" :detail-schema="allSchemas.detailSchema" :current-row="tableObject.currentRow" />
    <el-button style="margin-left: 10px" v-if="actionType !== 'detail'" type="primary" @click="toggleAllSelections(menuOptions)">全选/全不选</el-button>
    <!-- <el-button v-if="actionType !== 'detail'" type="primary" @click="toggleRowExpansion(menuOptions)">张开/收缩</el-button> -->

    <!--弹窗表格-->
    <el-table
      style="margin-left: 10px"
      v-if="actionType !== 'detail'"
      ref="menuRef"
      :data="menuOptions"
      border
      :key="1"
      row-key="id"
      @selection-change="handleSelectionChange"
      @select="selectFun"
      :tree-props="{ children: 'children' }"
    >
      <!-- :selectable="(row) => getDisable(row, 'unpub')" -->
      <el-table-column type="selection" width="80" />
      <el-table-column show-overflow-tooltip prop="label" label="菜单选择" />
      <el-table-column show-overflow-tooltip prop="allData" label="全国数据" width="100">
        <template #default="scope">
          <el-checkbox v-model="scope.row.otherData.allData" @click="installStatus(scope.row, '0')" label="" size="small" />
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip prop="orgAndBelow" label="所属项目数据" width="100">
        <template #default="scope">
          <el-checkbox v-model="scope.row.otherData.orgAndBelow" @click="installStatus(scope.row, '0')" label="" size="small" />
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip prop="orgRegionAndBelow" label="所属组织区域数据" width="100">
        <template #default="scope">
          <el-checkbox v-model="scope.row.orgRegionAndBelow" @click="installStatus(scope.row, '0')" label="" size="small" />
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip prop="onlySelf" label="仅本人数据" width="100">
        <template #default="scope">
          <el-checkbox v-model="scope.row.onlySelf" @click="installStatus(scope.row, '0')" label="" size="small" />
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip prop="onlySelf" label="组织区域与对应菜单匹配" width="100">
        <template #default="scope">
          <div>
            <el-checkbox :disabled="scope.row.orgRegionAndBelow != true" v-model="scope.row.regionDomicile" @click="installStatus(scope.row, '1')" label="现居地址" size="small" />
            <el-checkbox :disabled="scope.row.orgRegionAndBelow != true" v-model="scope.row.regionCurrent" @click="installStatus(scope.row, '1')" label="户籍地址" size="small" />
          </div>
        </template>
      </el-table-column>
    </el-table>
    <template #footer>
      <ElButton v-if="actionType !== 'detail'" type="primary" :loading="loading" @click="save">
        {{ t('exampleDemo.save') }}
      </ElButton>
      <ElButton @click="dataDialogVisible = false">{{ t('dialogDemo.close') }}</ElButton>
    </template>
  </Dialog>

  <!--原 部门数据权限-->
  <Dialog v-model="dialogVisibleTwo" title="权限配置" width="900px">
    <el-form :model="data.form" label-width="80px">
      <el-form-item label="角色名称">
        <el-input v-model="data.form.name" disabled="true" clearable />
      </el-form-item>
      <el-form-item label="权限字符">
        <el-input v-model="data.form.code" disabled="true" clearable />
      </el-form-item>
      <el-form-item label="状态">
        <!-- <el-input v-model="data.form.status" /> -->
        <el-radio-group v-model="data.form.status" disabled="true" clearable>
          <el-radio value="0">启用</el-radio>
          <el-radio value="1">停用</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="显示顺序">
        <el-input type="number" v-model="data.form.sort" disabled="true" min="0" />
      </el-form-item>
      <!-- <el-form-item label="权限范围">
        <el-select v-model="data.form.dataScope" @change="dataScopeSelectChange">
          <el-option v-for="item in dataScopeOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item> -->
      <!-- v-show="data.form.dataScope == '2'" -->
      <el-form-item label="数据权限">
        <!-- <el-checkbox v-model="deptExpand" @change="handleCheckedTreeExpand($event)">展开/折叠</el-checkbox>
        <el-checkbox v-model="deptNodeAll" @change="handleCheckedTreeNodeAll($event)">全选/全不选</el-checkbox>
        <el-checkbox v-model="data.form.deptCheckStrictly"
          @change="handleCheckedTreeConnect($event, 'dept')">父子联动</el-checkbox>
        <el-tree class="tree-border" :data="menuOptions" show-checkbox default-expand-all ref="deptRef" node-key="id"
          :check-strictly="!data.form.deptCheckStrictly" empty-text="加载中，请稍候"
          :props="{ label: 'label', children: 'children' }" /> -->
        <el-table ref="menuRef" :data="menuOptions" border :key="1" row-key="id" @selection-change="handleSelectionChange" @select="selectFun" :tree-props="{ children: 'children' }">
          <!-- :selectable="(row) => getDisable(row, 'unpub')" -->
          <!-- <el-table-column type="selection" width="45" /> -->
          <el-table-column show-overflow-tooltip prop="label" label="菜单选择" />
          <el-table-column show-overflow-tooltip prop="allData" label="全国数据" width="100">
            <template #default="scope">
              <el-checkbox v-if="!scope.row.children" v-model="scope.row.otherData.allData" @click="installStatus(scope.row, '0')" label="" size="small" />
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="orgAndBelow" label="所属项目数据" width="110">
            <template #default="scope">
              <el-checkbox v-if="!scope.row.children" v-model="scope.row.otherData.orgAndBelow" @click="installStatus(scope.row, '0')" label="" size="small" />
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="orgRegionAndBelow" label="所属组织区域数据" width="140">
            <template #default="scope">
              <el-checkbox v-if="!scope.row.children" v-model="scope.row.otherData.orgRegionAndBelow" @click="installStatus(scope.row, '0')" label="" size="small" />
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="onlySelf" label="仅本人数据" width="100">
            <template #default="scope">
              <el-checkbox v-if="!scope.row.children" v-model="scope.row.otherData.onlySelf" @click="installStatus(scope.row, '0')" label="" size="small" />
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="onlySelf" label="组织区域与对应菜单匹配" width="200">
            <template #default="scope">
              <div v-if="!scope.row.children">
                <el-checkbox
                  line
                  :disabled="scope.row.otherData.orgRegionAndBelow != true"
                  v-model="scope.row.otherData.regionDomicile"
                  @click="installStatus(scope.row, '1')"
                  label="现居地址"
                  size="small"
                />
                <el-checkbox
                  line
                  style="display: line-block"
                  :disabled="scope.row.otherData.orgRegionAndBelow != true"
                  v-model="scope.row.otherData.regionCurrent"
                  @click="installStatus(scope.row, '1')"
                  label="户籍地址"
                  size="small"
                />
              </div>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="submitDataScope">确 定</el-button>
        <el-button @click="cancelDataScope">取 消</el-button>
      </div>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { ContentWrap } from '@/components/ContentWrap'
import { useI18n } from '@/hooks/web/useI18n'
import { Table } from '@/components/Table'
import { ref, reactive, h, unref, nextTick, getCurrentInstance } from 'vue'
import { ElButton, ElTag, ElMessage, ElTable } from 'element-plus'
// import { TableSlotDefault } from '@/types/table'
import { Search } from '@/components/Search'
import { useTable } from '@/hooks/web/useTable'
import { TableData } from '@/api/table/types'
import Write from '../components/Write.vue'
import Detail from '../components/Detail.vue'
import { Dialog } from '@/components/Dialog'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import {
  getRoleListApi,
  delTableListApi,
  saveTableApi,
  getRoleMenuTreeselect,
  getRoleMenuTree,
  saveAddTableApi,
  treeselect as menuTreeselect,
  deptTreeSelect,
  getRole,
  dataScope
} from '@/api/sys/role'
import { useIcon } from '@/hooks/web/useIcon'
import { useRouter } from 'vue-router'
const addicon = useIcon({ icon: 'material-symbols:add' })
const delicon = useIcon({ icon: 'material-symbols:delete-outline-sharp' })
const improticon = useIcon({ icon: 'material-symbols:import-contacts' })
const expicon = useIcon({ icon: 'material-symbols:export-notes' })
const { push } = useRouter()
const { t } = useI18n()
const { proxy } = getCurrentInstance() as any
const { register, tableObject, methods } = useTable<TableData>({
  getListApi: getRoleListApi,
  delListApi: delTableListApi,
  response: {
    list: 'list',
    total: 'total'
  }
})
// const menuIds = ref(['1000', '1001', '1002', '1003', '1004'])
const crudSchemas = reactive<CrudSchema[]>([
  // {
  //   field: 'index',
  //   label: t('userDemo.roleindex'),
  //   type: 'index',
  //   form: {
  //     show: false
  //   },
  // },
  {
    field: 'name',
    label: t('userDemo.rolename'),
    search: {
      show: true,
      colProps: {
        span: 12
      }
    }
  },
  {
    field: 'code',
    label: t('userDemo.rolemes'),
    search: {
      show: true,
      colProps: {
        span: 12
      }
    }
  },
  {
    field: 'sort',
    label: t('userDemo.order'),
    form: {
      component: 'InputNumber',
      value: '0',
      componentProps: {
        type: 'daterange',
        min: '0'
      },
      show: true
    }
  },
  {
    field: 'status',
    label: t('userDemo.stats'),
    formatter: (_: Recordable, __: CrudSchema, cellValue: string) => {
      return h(
        ElTag,
        {
          type: cellValue === '0' ? 'success' : 'danger'
        },
        () => (cellValue == '0' ? t('启用') : t('停用'))
      )
    },
    search: {
      show: true,
      colProps: {
        span: 12
      },
      component: 'Select',
      componentProps: {
        options: [
          {
            label: '启用',
            value: '0'
          },
          {
            label: '禁用',
            value: '1'
          }
        ]
      }
    },
    form: {
      component: 'Radio',
      show: true,
      componentProps: {
        options: [
          {
            label: '启用',
            value: '0'
          },
          {
            label: '停用',
            value: '1'
          }
        ]
      }
    }
  },
  {
    field: 'createTime',
    label: t('userDemo.createTime'),
    form: {
      // component: 'DatePicker',
      // componentProps: {
      //   type: 'daterange',
      //   valueFormat: 'YYYY-MM-DD HH:mm:ss'
      // }
      show: false
    },
    search: {
      field: 'params%5BcreateTime%5D',
      show: true,
      colProps: {
        span: 12
      },
      component: 'DatePicker',
      componentProps: {
        type: 'daterange',
        valueFormat: 'YYYY-MM-DD HH:mm:ss'
      }
    }
  },
  {
    field: 'creatorName',
    label: t('创建人'),
    form: {
      show: false
    },
    search: {
      show: false
    },
    table: {
      show: false
    }
  },
  {
    field: 'updateTime',
    label: t('更新时间'),
    form: {
      show: false
    },
    search: {
      show: false
    }
  },
  {
    field: 'updaterName',
    label: t('更新人'),
    table: {
      show: false
    },
    form: {
      show: false
    },
    search: {
      show: false
    }
  },

  {
    field: 'remark',
    label: t('userDemo.remark'),
    show: false,
    form: {
      show: true
    }
    // formatter: (row: UserType) => {
    //   return h(
    //     'span',
    //     row.username === 'admin' ? t('userDemo.remarkMessage1') : t('userDemo.remarkMessage2')
    //   )
    // }
  },
  {
    field: 'action',
    label: t('userDemo.action'),
    width: '350px',
    detail: {
      show: false
    },
    form: {
      show: false
    }
  }
])
const { getList, setSearchParams } = methods
getList()
interface User {
  label: string
  id: string | number
  checked: boolean
  children: User[] | any
}
const loading = ref(false)
const { allSchemas } = useCrudSchemas(crudSchemas)
const menuRef = ref<InstanceType<typeof ElTable>>()
// 树形表格数据
const menuOptions = ref<User[]>([])
//const checkedRows = ref<User[]>([])

/** 根据角色ID查询部门树结构 */
const getRoleMenus = async (type, id) => {
  if (type == 'data') {
    dataDialogVisible.value = true
  } else if (type == 'menu') {
    menuDialogVisible.value = true
  }
  //const checkedIds = ref<[]>([])
  const checkedRows = ref<User[]>([])
  await getRoleMenuTree(type, id).then((response: any) => {
    menuOptions.value = response.menus
    if (type == 'data') {
      let dataPowers = response.dataPowers
    } else if (type == 'menu') {
      const checkedIds: (string | number)[] = []
      let checkedKeys = response.checkedKeys
      checkedKeys.forEach((element: number) => {
        checkedIds.push(element)
      })
      menuRef.value!.clearSelection()

      walktreeAndCheck(menuOptions.value, checkedIds)
    }
    //menuChx.value.push(tarverse(menuOptions.value, element))
  })
}

/** 根据角色ID查询部门树结构 旧版*/
/*
const getRoleMenu = async (id) => {
  //const checkedIds = ref<[]>([])
  const checkedIds: (string | number)[] = []
  const checkedRows = ref<User[]>([])
  await getRoleMenuTreeselect(id).then((response: any) => {
    //menuOptions.value = response.menus;
    let checkedKeys = response.checkedKeys;
    checkedKeys.forEach((element: number) => {
      checkedIds.push(element)
    });
    //menuChx.value.push(tarverse(menuOptions.value, element))

  });

  walktreeAndCheck(menuOptions.value, checkedIds)
  //menuOptions.value.forEach((menu : User) => {
  //  if(checkedIds.indexOf(menu.id)>-1) {
  //	  checkedRows.value.push(menu)
  //  }
  //});


  //await toggleSelections(menuChx.value)
  //await toggleSelections2(checkedRows.value)

}
*/
// 遍历树形结构并且选中复选框
function walktreeAndCheck(list: User[], checkedIds: (string | number)[]) {
  if (!list) return
  nextTick(() => {
    list.forEach((menu: User) => {
      menuRef.value!.toggleRowSelection(menu, checkedIds.indexOf(menu.id) > -1)
      walktreeAndCheck(menu.children, checkedIds)
    })
  })
}

/** 根据部门树结构 */
const getMenu = async () => {
  await menuTreeselect().then((response: any) => {
    menuOptions.value = response.data
  })
}
// 遍历树形结构
function tarverse(nodes, id) {
  let result
  nodes.forEach((element) => {
    if (element.id == id) {
      result = element
      return result
    } else if (element.children && element.children.length > 0) {
      result = tarverse(element.children, id)
    }
    if (result) return result
  })
  return result
}

//全选全不选选择
const toggleAllSelections = (rows?: User[]) => {
  if (rows) {
    rows.forEach((row) => {
      // TODO: improvement typing when refactor table
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      menuRef.value!.toggleAllSelection(row, true)
    })
  } else {
    menuRef.value!.clearSelection()
  }
}
const dialogVisible = ref(false)
const menuDialogVisible = ref(false)
const dataDialogVisible = ref(false)
const actionType = ref('')
const action = (row: TableData, type: string) => {
  multipleSelection.value = []
  //dialogTitle.value = type == 'edit' ? t('exampleDemo.edit') : type == 'detail' ? t('exampleDemo.detail') : t('exampleDemo.add')
  dialogTitle.value = t('exampleDemo.' + type)
  actionType.value = type
  tableObject.currentRow = row
  reset()
  getRole(row.id).then((response) => {
    row['updaterName'] = response.data.updaterName
    row['creatorName'] = response.data.creatorName
  })
  if (type == 'edit') {
    //getRoleMenu(row.id)
    getRoleMenus('menu', row.id)
  } else if (type == 'dataAuthority') {
    getRoleMenus('data', row.id)
  }
  //dialogVisible.value = true
}
const writeRef = ref<ComponentRef<typeof Write>>()
const dialogTitle = ref('')
const AddAction = () => {
  dialogTitle.value = t('exampleDemo.add')
  tableObject.currentRow = null
  dialogVisible.value = true
  reset()
  getMenu()
  actionType.value = ''
}
//删除
const delLoading = ref(false)
const delData = async (row: TableData | null, multiple: boolean) => {
  tableObject.currentRow = row
  const { delList, getSelections } = methods
  const selections = await getSelections()
  delLoading.value = true

  await delList(multiple ? selections.map((v) => v.id) : [tableObject.currentRow?.id as string], multiple).finally(() => {
    delLoading.value = false
  })
}
const save = async () => {
  // let menuRefId = ref<User[]>([])
  // multipleSelection.value.forEach(element => {
  //   menuRefId.value.push(element.id)
  // });

  const write = unref(writeRef)
  const validate = await write?.elFormRef?.validate()?.catch(() => {})
  if (validate) {
    loading.value = true
    const data = (await write?.getFormData()) as TableData
    data['dataPowerList'] = rowArray.value
    data['menuIds'] = multipleSelection.value
    if (dialogTitle.value == '编辑') {
      const res = await saveTableApi(data)
        .catch(() => {})
        .finally(() => {
          loading.value = false
        })
      if (res) {
        dialogVisible.value = false
        ElMessage.success('操作成功')
        getList()
      }
    } else {
      const res = await saveAddTableApi(data)
        .catch(() => {})
        .finally(() => {
          loading.value = false
        })
      if (res) {
        dialogVisible.value = false
        ElMessage.success('操作成功')
        getList()
      }
    }
  }
}
const multipleSelection = ref()
//弹框多选框选择
const handleSelectionChange = (val: User[]) => {
  multipleSelection.value = val.map((item) => {
    if (item) {
      return item.id
    }
  })
}
const selectFun = (selection, row) => {
  //handleSelectionChange(row);
}
//展开/收缩
const toggleRowExpansion = (menuOptions) => {
  if (menuOptions) {
    menuOptions.forEach((row) => {
      menuRef.value!.toggleRowExpansion(row, undefined)
      // TODO: improvement typing when refactor table
    })
  }
}
/** 跳转用户分配 */
function handleAuthUser(row) {
  push(`/system/authuser?id=${row.id}`)
}
const deptExpand = ref(true)
const deptNodeAll = ref(false)
const data = reactive({
  form: {
    id: undefined,
    name: undefined,
    key: undefined,
    sort: 0,
    deptExpand: true,
    deptNodeAll: false,
    code: '',
    status: '0',
    dataScope: '2',
    menuIds: [],
    deptIds: [],
    menuCheckStrictly: true,
    deptCheckStrictly: true,
    remark: undefined,
    dataPowerList: []
  },
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    name: undefined,
    key: undefined,
    status: undefined
  },
  rules: {
    name: [{ required: true, message: '角色名称不能为空', trigger: 'blur' }],
    key: [{ required: true, message: '权限字符不能为空', trigger: 'blur' }],
    sort: [{ required: true, message: '角色顺序不能为空', trigger: 'blur' }]
  }
})
/** 数据范围选项*/
const dataScopeOptions = ref([
  { value: '1', label: '全部数据权限' },
  { value: '2', label: '自定数据权限' },
  { value: '3', label: '本部门数据权限' },
  { value: '4', label: '本部门及以下数据权限' },
  { value: '5', label: '仅本人数据权限' }
])
const deptRef = ref()
const reset = () => {
  if (menuRef.value != undefined) {
    menuRef.value!.setCurrentRow([])
  }
  data.form = {
    id: undefined,
    name: undefined,
    key: undefined,
    deptExpand: true,
    deptNodeAll: false,
    dataScope: '',
    code: '',
    sort: 0,
    status: '0',
    menuIds: [],
    deptIds: [],
    menuCheckStrictly: true,
    deptCheckStrictly: true,
    remark: undefined,
    dataPowerList: []
  }
}
// const deptExpand = ref(true);
const dialogVisibleTwo = ref(false)
const deptOptions = ref([])
const autHority = (row: TableData) => {
  reset()
  const deptTreeSelect = getDeptTree(row.id)
  // getRole(row.id).then((response) => {
  //   row['updaterName'] = response.data.updaterName
  //   row['creatorName'] = response.data.creatorName
  // });
  // getRoleMenu(row.id)
  getRole(row.id).then((response) => {
    data.form = response.data
    rowArray.value = response.data.dataPowerList
    dialogVisibleTwo.value = true
    nextTick(() => {
      deptTreeSelect.then((res) => {
        nextTick(() => {
          if (deptRef.value) {
            deptRef.value.setCheckedKeys(res['checkedKeys'])
          }
        })
      })
    })
  })
  getDeptTree(row.id)
}
/** 选择角色权限范围触发 */
function dataScopeSelectChange(value) {
  if (value !== '2') {
    deptRef.value.setCheckedKeys([])
  }
}
/** 根据角色ID查询部门树结构 */
function getDeptTree(id) {
  const menus = ref()
  return getRoleMenuTreeselect(id).then((response: any) => {
    menus.value = response
    menuOptions.value = response.menus
    return response
  })
  // return deptTreeSelect(id).then((response) => {
  //   menus.value = response
  //   deptOptions.value = menus.value.depts;
  //   return response;
  // });
}
/** 所有部门节点数据 */
function getDeptAllCheckedKeys() {
  // 目前被选中的部门节点
  let checkedKeys = deptRef.value.getCheckedKeys()
  // 半选中的部门节点
  let halfCheckedKeys = deptRef.value.getHalfCheckedKeys()
  checkedKeys.unshift.apply(checkedKeys, halfCheckedKeys)
  return checkedKeys
}
/** 提交按钮（数据权限） */
async function submitDataScope() {
  if (data.form.id != undefined) {
    data.form.dataPowerList = rowArray
    // data.form.menuIds = getDeptAllCheckedKeys();
    const res = await dataScope(data.form.id, data.form)
      .catch(() => {})
      .finally(() => {
        loading.value = false
      })
    if (res) {
      dialogVisibleTwo.value = false
      ElMessage.success('修改成功')
      getList()
    }
    // dataScope(data.form).then((response) => {
    //   ElMessage.success('修改成功')
    //   dialogVisibleTwo.value = false;
    //   getList();
    // });
  }
}
/** 取消按钮（数据权限）*/
function cancelDataScope() {
  dialogVisibleTwo.value = false
  reset()
}
/** 树权限（展开/折叠）*/
function handleCheckedTreeExpand(value) {
  let treeList = menuOptions.value
  for (let i = 0; i < treeList.length; i++) {
    deptRef.value.store.nodesMap[treeList[i]['id']].expanded = value
  }
}
/** 树权限（全选/全不选） */
function handleCheckedTreeNodeAll(value) {
  deptRef.value.setCheckedNodes(value ? menuOptions.value : [])
}
/** 树权限（父子联动） */
function handleCheckedTreeConnect(value, type) {
  if (type == 'menu') {
    data.form.menuCheckStrictly = value ? true : false
  } else if (type == 'dept') {
    data.form.deptCheckStrictly = value ? true : false
  }
}
const rowArray: any = ref([])
function installStatus(row, type) {
  if (type == '0') {
    row.otherData.allData = false
    row.otherData.onlySelf = false
    row.otherData.orgAndBelow = false
    row.otherData.menuId = row.id
    row.otherData.orgRegionAndBelow = false
    if (row.otherData.orgRegionAndBelow == false) {
      row.otherData.regionCurrent = false
      row.otherData.regionDomicile = false
    }
  }
  if (rowArray.value) {
    rowArray.value.forEach((element, index) => {
      if (row.otherData.menuId == element['menuId']) {
        rowArray.value.splice(index, 1)
        // delete rowArray[index]
      }
    })
  }
  rowArray.value.push(row.otherData)
}
</script>

<style>
.has-gutter .el-table-column--selection div {
  display: none;
}
</style>
