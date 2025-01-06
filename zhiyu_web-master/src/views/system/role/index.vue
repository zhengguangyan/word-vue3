<template>
  <el-card shadow="never" class="card">
    <template #header>
      <div class="card-header">
        <span class="title">角色管理</span>
      </div>
    </template>
    <Search :schema="allSchemas.searchSchema" @keyup="setSearchParams" @search="setSearchParams" @reset="setSearchParams" />
    <div class="mb-12px">
      <!-- <ElButton type="primary" :disabled="getAuth('system:role:add')" :icon="addicon" @click="AddAction">
        {{ t('exampleDemo.add') }}
      </ElButton> -->
      <el-button type="primary" :disabled="getAuth('system:role:add')" :icon="addicon" @click="AddAction">{{ t('exampleDemo.add') }}</el-button>
      <!-- <ElButton :disabled="getAuth('system:role:remove')" :icon="delicon" plain @click="delData(null, true)">
        {{ t('exampleDemo.del') }}
      </ElButton> -->
      <el-button :disabled="getAuth('system:role:remove')" :icon="delicon" plain @click="delData(null, true)">{{ t('exampleDemo.del') }}</el-button>

      <!-- <ElButton type="primary" :icon="improticon" @click="AddAction">
        {{ t('导入') }}
      </ElButton>
      <ElButton type="primary" :icon="expicon" @click="AddAction">
        {{ t('导出') }}
      </ElButton> -->
    </div>
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
      header-row-class-name="table-header"
      class-name="table-without-border"
      height="calc(100vh - 345px)"
    >
      <template #status="{ row }">
        <el-switch v-model="row.status" class="ml-2" active-value="0" @click="getStatus(row)" />
      </template>
      <template #action="{ row }">
        <ElLink v-if="row.id != 1" class="links" :disabled="getAuth('system:role:query')" size="small" type="primary" @click="action(row, 'detail')">
          {{ t('exampleDemo.detail') }}
        </ElLink>
        <ElLink v-if="row.id != 1" class="links" :disabled="getAuth('system:role:edit')" size="small" type="primary" @click="action(row, 'edit')">
          {{ t('exampleDemo.edit') }}
        </ElLink>
        <ElLink v-if="row.id != 1" class="links" size="small" type="primary" @click="autHority(row)">
          {{ t('权限') }}
        </ElLink>
        <ElLink v-if="row.id != 1" class="links" :disabled="getAuth('system:role:allocation')" size="small" type="primary" @click="handleAuthUser(row)">
          {{ t('分配') }}
        </ElLink>
        <ElLink v-if="row.id != 1" class="links" size="small" type="primary" :disabled="getAuth('system:role:remove')" @click="delData(row, false)">
          {{ t('exampleDemo.del') }}
        </ElLink>
      </template>
    </Table>
  </el-card>
  <!--编辑对话框-->
  <Dialog v-model="dialogVisible" :title="dialogTitle" width="700">
    <Write v-if="actionType !== 'detail'" ref="writeRef" :form-schema="allSchemas.formSchema" :current-row="tableObject.currentRow" />
    <Detail v-if="actionType === 'detail'" :detail-schema="allSchemas.detailSchema" :current-row="tableObject.currentRow" />
    <el-button style="margin-left: 10px; margin-bottom: 20px" type="primary" v-if="actionType !== 'detail'" v-model="menuNodeAll" @click="handleCheckedTreeNodeAll(handleChecked)"
      >全选/全不选</el-button
    >
    <!-- <el-button style="margin-left: 10px; margin-bottom: 10px;" v-if="actionType !== 'detail'" type="primary"
      @click="handleCheckedTreeNodeAll($event)">全选/全不选</el-button> -->
    <el-button style="margin-left: 10px; margin-bottom: 20px" type="primary" v-if="actionType !== 'detail'" v-model="deptExpand" @click="handleCheckedTreeExpand(handleCheckedtwo)"
      >展开/折叠</el-button
    >
    <!-- <el-button v-if="actionType !== 'detail'" type="primary" @click="toggleRowExpansion(menuOptions)">张开/收缩</el-button> -->
    <el-tree class="r-m-b-20" v-if="actionType !== 'detail'" :data="menuOptions" show-checkbox node-key="id" ref="menuRefTow" :props="{ children: 'children' }" />
    <!--弹窗表格-->
    <el-table
      style="display: none"
      v-if="actionType !== 'detail'"
      ref="menuRef"
      :data="menuOptions"
      :border="true"
      :key="1"
      row-key="id"
      @selection-change="handleSelectionChange"
      @select="selectFun"
      :tree-props="{ children: 'children' }"
    >
      <!-- :selectable="(row) => getDisable(row, 'unpub')" -->
      <el-table-column type="selection" width="45" />

      <el-table-column show-overflow-tooltip prop="label" label="菜单选择" />
    </el-table>
    <template #footer>
      <!-- <ElButton v-if="actionType !== 'detail'" type="primary" :loading="loading" @click="save">
        {{ t('exampleDemo.save') }}
      </ElButton>
      <ElButton @click="dialogVisible = false">{{ t('dialogDemo.close') }}</ElButton> -->

      <el-button v-if="actionType !== 'detail'" type="primary" :loading="loading" @click="save">
        {{ t('exampleDemo.save') }}
      </el-button>
      <el-button @click="dialogVisible = false">{{ t('dialogDemo.close') }}</el-button>
    </template>
  </Dialog>

  <!-- 权限配置弹窗 -->
  <Dialog v-model="dialogVisibleTwo" title="权限配置" width="1000px">
    <el-form :model="data.form" label-width="80px">
      <el-form-item label="角色名称">
        <el-input v-model="data.form.name" :disabled="true" clearable />
      </el-form-item>
      <el-form-item label="权限字符">
        <el-input v-model="data.form.code" :disabled="true" clearable />
      </el-form-item>
      <el-form-item label="状态">
        <el-radio-group v-model="data.form.status" :disabled="true" clearable>
          <el-radio value="0">启用</el-radio>
          <el-radio value="1">停用</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="显示顺序">
        <el-input type="number" v-model="data.form.sort" :disabled="true" min="0" />
      </el-form-item>
      <el-form-item label="数据权限">
        <el-table
          ref="menuRef"
          :data="menuOptions"
          style="height: calc(100vh - 600px)"
          :border="true"
          :key="1"
          row-key="id"
          @selection-change="handleSelectionChange"
          @select="selectFun"
          default-expand-all
          :tree-props="{ children: 'children' }"
        >
          <el-table-column fixed prop="label" label="菜单选择" width="200" />
          <el-table-column show-overflow-tooltip prop="allData" label="全国数据" width="100">
            <template #default="{ row }">
              <el-checkbox v-if="!row.children" :disabled="!row.otherData.menuPower.allData" v-model="row.otherData.dataPower.allData" @change="installStatus(row, '0')" label="" size="small" />
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="orgAndBelow" label="所属项目数据" width="110">
            <template #default="{ row }">
              <el-checkbox
                :disabled="!row.otherData.menuPower.orgAndBelow"
                v-if="!row.children"
                v-model="row.otherData.dataPower.orgAndBelow"
                @change="installStatus(row, '1')"
                label=""
                size="small"
              />
            </template>
          </el-table-column>

          <el-table-column show-overflow-tooltip prop="orgRegionAndBelow" label="所属组织区域数据" width="140">
            <template #default="{ row }">
              <el-checkbox
                :disabled="!row.otherData.menuPower.orgRegionAndBelow"
                v-if="!row.children"
                v-model="row.otherData.dataPower.orgRegionAndBelow"
                @change="installStatus(row, '2')"
                label=""
                size="small"
              />
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="onlySelf" label="仅本人数据" width="100">
            <template #default="{ row }">
              <el-checkbox :disabled="!row.otherData.menuPower.onlySelf" v-if="!row.children" v-model="row.otherData.dataPower.onlySelf" @change="installStatus(row, '3')" label="" size="small" />
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="onlySelf" label="组织区域与对应菜单匹配" width="250">
            <template #default="{ row }">
              <div v-if="!row.children">
                <el-checkbox
                  v-for="item in orgRegionList(row.otherData.menuPower.orgRegionMateMenuAreaAndBelow)"
                  :disabled="!row.otherData.dataPower.orgRegionAndBelow"
                  :key="item.value"
                  :label="item.name"
                  @click="installStatus(row, '4')"
                  v-model="row.otherData.dataPower[item.value]"
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
// import { ContentWrap } from '@/components/ContentWrap'
import { useI18n } from '@/hooks/web/useI18n'
import { Table } from '@/components/Table'
// getCurrentInstance
import { ref, reactive, h, unref, nextTick } from 'vue'
import { ElTag, ElMessage, ElTable, ElLink, ElMessageBox } from 'element-plus'
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
  // deptTreeSelect,
  changeRoleStatus,
  checkDeletedRole,
  getRole,
  dataScope
} from '@/api/sys/role'
import { useIcon } from '@/hooks/web/useIcon'
import { useRouter } from 'vue-router'
import { getAuth } from '@/utils/export'
const addicon = useIcon({ icon: 'material-symbols:add' })
const delicon = useIcon({ icon: 'material-symbols:delete-outline-sharp' })
// const improticon = useIcon({ icon: 'material-symbols:import-contacts' })
// const expicon = useIcon({ icon: 'material-symbols:export-notes' })
const { push } = useRouter()
const { t } = useI18n()
// const { proxy } = getCurrentInstance() as any
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
      value: '0',
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
    table: {
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
    width: '250px',
    detail: {
      show: false
    },
    form: {
      show: false
    },
    fixed: 'left'
  }
])
const { getList, setSearchParams } = methods
getList()
interface User {
  label: string
  id: string | number
  parentId: string | number
  ancestorIds: number[] | any
  checked: boolean
  children: User[] | any
  checkedStatus: number //0未选中 1部分选中 2全部选中
}
const loading = ref(false)
const { allSchemas } = useCrudSchemas(crudSchemas)
const menuRef = ref<InstanceType<typeof ElTable>>()
// 树形表格数据
let menuOptions = ref<User[]>([])
const checkedRows = ref<User[]>([])
// const menutypes = ref()
const menuRefTow = ref()
/** 根据角色ID查询部门树结构 */
/*
const getRoleMenu = async (id) => {
  //const checkedIds = ref<[]>([])
  const checkedIds: (string | number)[] = []
  //const checkedRows = ref<User[]>([])
  await getRoleMenuTreeselect(id).then((response: any) => {
    // menuOptions.value = response.menus;
    menuOptions.value = getTreeData(response.menus, response.menus[0].parentId);
    let checkedKeys = response.checkedKeys;
    checkedKeys.forEach((element: number) => {
      checkedIds.push(element)
    });
    //menuChx.value.push(tarverse(menuOptions.value, element))

  });
  //initListStatus(menuOptions.value)
  menuOptions.value.forEach((item) => {
    //item.checkedStatus = 1 //默认为不选中
    item.label = item.label + ''
  })

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
function walktreeAndCheck(rows: User[], checkedIds: (string | number)[]) {
  if (!rows) return
  rows.forEach((item: User) => {
    menuRef.value!.toggleRowSelection(item, checkedIds.indexOf(item.id) > -1)
    walktreeAndCheck(item.children, checkedIds)
  })
}
const multipleSelection = ref()

const resetRows = (rows: User[]) => {
  if (!rows) return
  rows.forEach((item: User) => {
    menuRef.value!.toggleRowSelection(item, item.checked)
    //resetRows(item.children)
  })
}

const getParentRow = (row: User) => {
  return getById(row.parentId)
}

const getById = (id: string | number, list: User[] = menuOptions.value): User | undefined => {
  const _getItem = (list: User[], id: string | number, items: User[]) => {
    if (list && list.length > 0) {
      list.forEach((item: User) => {
        if (item.id == id) {
          items.push(item)
          return
        }
        _getItem(item.children, id, items)
      })
    }
  }
  let items: User[] = []
  _getItem(list, id, items)
  if (items.length > 0) {
    return items[0]
  }
  return undefined
}

const setRowValue = (id: number | any, key: string, value: any) => {
  const _setRowValue = (rows: User[], id: number | any, key: string, value: any) => {
    if (!rows) return
    rows.forEach((item: User) => {
      if (item.id === id) {
        item[key] = value

        return
      }
      _setRowValue(item.children, id, key, value)
    })
  }
  _setRowValue(menuOptions.value, id, key, value)
}

/** 所有菜单节点数据 */
function getMenuAllCheckedKeys() {
  // 目前被选中的菜单节点
  let checkedKeys = menuRefTow.value.getCheckedKeys()
  // 半选中的菜单节点
  let halfCheckedKeys = menuRefTow.value.getHalfCheckedKeys()
  checkedKeys.unshift.apply(checkedKeys, halfCheckedKeys)
  return checkedKeys
}

const getItems = (list: User[], ids: (string | number)[], ancesterRows: User[]) => {
  list.forEach((item) => {
    if (ids.indexOf(item.id) > -1) {
      ancesterRows.push(item)
    }
    getItems(item.children, ids, ancesterRows)
  })
}

//初始化数据,将数据都用isSelect标记一下，isSelect为false不选中、true选中、half半选
const initListStatus = (list) => {
  list.forEach((item) => {
    //item.checkedStatus = 33; //默认为不选中
    if (item.children && item.children.length) {
      initListStatus(item.children)
    }
  })
}

// 判断同级选中状态
const checkedStatus = (row) => {
  //const ancesterRows = ref<User[]>([])
  //getItems(menuOptions.value, row.ancesterIds, ancesterRows.value)
  let parentRow: User | any = undefined
  getById(row.parentId)
  if (!parentRow) return
  let children = parentRow.children
  let sum = 0
  let fullSum = 2 * children.length
  parentRow.children.forEach((item: User) => {
    sum += item.checkedStatus
  })
  return sum == 0 ? 0 : sum == fullSum ? 2 : 1
}

//弹框多选框选择
const handleSelectionChange = (val: User[]) => {
  checkedRows.value = val
  multipleSelection.value = val.map((item) => {
    if (item) {
      return item.id
    }
  })
}
const selectFun = (selection, row) => {
  //handleSelectionChange(row);
  let parentRow: User | any = getParentRow(row)
  //nextTick(() => {
  //const findRow = selection.find(x => x.id === row.id)
  const index = selection.indexOf(row)
  //row.checked = index > -1
  //row.label = row.label + '/'
  //menuRef.value!.toggleRowSelection(row, row.checked)
  //})
  // return
  // //setRowValue(row.id, 'checked', true)
  // if(index > -1) {
  // if(parentRow) {
  //  menuRef.value!.toggleRowSelection(parentRow, true)
  //  //resetRows(parentRow.children);
  //   nextTick(() => {
  // 	  parentRow.children.forEach((item: User) => {
  //  	menuRef.value!.toggleRowSelection(item, item.checked)
  //  })
  //  })
  // }
  // }
}

function getTreeData(arr, parentId) {
  function loop(parentId) {
    return arr.reduce((pre, cur) => {
      if (cur.parentId === parentId) {
        // cur.children = loop(cur.id)
        pre.push(cur)
      }
      return pre
    }, [])
  }
  return loop(parentId)
}

/** 根据部门树结构 */
const getMenu = async () => {
  await menuTreeselect().then((response: any) => {
    menuOptions.value = getTreeData(response.data, response.data[0].parentId)
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

const dialogVisible = ref(false)
const actionType = ref('')
const action = (row: TableData, type: string) => {
  const roleMenu = _getRoleMenuTreeselectTwo(row.id)
  multipleSelection.value = []
  dialogTitle.value = type == 'edit' ? t('exampleDemo.edit') : type == 'detail' ? t('exampleDemo.detail') : t('exampleDemo.add')
  actionType.value = type
  tableObject.currentRow = row
  reset()
  getRole(row.id).then((response) => {
    row['updaterName'] = response.data.updaterName
    row['creatorName'] = response.data.creatorName
    if (response.code != '403') {
      dialogVisible.value = true
    }
    nextTick(() => {
      roleMenu.then((res) => {
        let checkedKeys = res.checkedKeys
        checkedKeys.forEach((v) => {
          nextTick(() => {
            menuRefTow.value.setChecked(v, true, false)
          })
        })
      })
    })
  })
  // getRoleMenu(row.id)
}
const writeRef = ref<ComponentRef<typeof Write>>()
const dialogTitle = ref('')
const AddAction = () => {
  multipleSelection.value = []
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
  let checked = multiple ? selections.map((v) => v.id) : [tableObject.currentRow?.id as string]
  if (!checked.length) {
    return ElMessage.error('请选择需要删除的角色')
  }

  let deleteCheck: any = await checkDeletedRole(checked)
  if (deleteCheck.code == 200) {
    await delList(multiple ? selections.map((v) => v.id) : [tableObject.currentRow?.id as string], multiple).finally(() => {
      delLoading.value = false
    })
  }
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
    data['menuIds'] = getMenuAllCheckedKeys()
    //data['menuIds'] = fixIds(multipleSelection.value)
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

function fixIds(ids: number[] | any) {
  let fixedIds: number[] = []
  ids.forEach((id: number) => {
    fixedIds.push(id)
  })
  checkedRows.value.forEach((item) => {
    fixedIds = fixedIds.concat(item.ancestorIds)
  })
  return unique(fixedIds)
}

function _fixIds(ids: number[] | any) {
  let fixedIds: number[] = []
  ids.forEach((id: number) => {
    fixedIds.push(id)
  })
  checkedRows.value.forEach((item) => {
    if (ids.indexOf(item.id) > -1) {
      alert(item.id)
      alert(JSON.stringify(item.ancestorIds))
      fixedIds = fixedIds.concat(item.ancestorIds)
    }
  })
  return unique(fixedIds)
}

function unique(arr: number[] | any) {
  let newArr: number[] | any = [] //新数组，用来接管不反复的元素
  for (var i = 0; i < arr.length; i++) {
    if (newArr.indexOf(arr[i]) === -1) {
      newArr.push(arr[i])
    }
  }
  return newArr
}

/** 跳转用户分配 */
function handleAuthUser(row) {
  push(`/system/authuser?id=${row.id}`)
}
// const deptExpand = ref(true);
// const deptNodeAll = ref(false);
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
    dataPowerList: [],
    orgRegionMateMenuAreaAndBelow: []
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
    dataPowerList: [],
    orgRegionMateMenuAreaAndBelow: []
  }
}
// const deptExpand = ref(true);
const dialogVisibleTwo = ref(false)
// const deptOptions = ref([])
const autHority = (row: TableData) => {
  reset()
  const deptTreeSelect = getRoleDataPower(row.id)
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
  //getRoleDataPower(row.id)
}
/** 选择角色权限范围触发 */
function dataScopeSelectChange(value) {
  if (value !== '2') {
    deptRef.value.setCheckedKeys([])
  }
}

function _getRoleMenuTreeselectTwo(id) {
  return getRoleMenuTreeselect(id).then((response) => {
    menuOptions.value = response.menus
    return response
  })
}
/** 根据角色ID查询部门树结构 */
function getRoleDataPower(id) {
  const menus = ref()
  return getRoleMenuTree('data', id).then((response: any) => {
    menus.value = response
    menuOptions.value = getTreeData(response.menus, response.menus[0].parentId)
    return response
  })
  // if (2 > 1) {
  //   return getRoleMenuTree('data', id).then((response: any) => {
  //     menus.value = response
  //     menuOptions.value = getTreeData(response.menus, response.menus[0].parentId)
  //     return response
  //   })
  // } else {
  //   return getRoleMenuTreeselect(id).then((response: any) => {
  //     menus.value = response
  //     menuOptions.value = getTreeData(response.menus, response.menus[0].parentId)
  //     return response
  //   })
  // }
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
const handleChecked = ref(false)
const handleCheckedtwo = ref(true)
/** 树权限（展开/折叠）*/
function handleCheckedTreeExpand(value) {
  let treeList = menuOptions.value
  handleCheckedtwo.value = handleCheckedtwo.value ? false : true
  for (let i = 0; i < treeList.length; i++) {
    if (treeList[i].children) {
      for (let j = 0; j < treeList[i].children.length; j++) {
        menuRefTow.value.store.nodesMap[treeList[i].children[j]['id']].expanded = value
      }
    }
    menuRefTow.value.store.nodesMap[treeList[i]['id']].expanded = value
  }
}
/** 树权限（全选/全不选） */
function handleCheckedTreeNodeAll(value) {
  handleChecked.value = handleChecked.value ? false : true
  menuRefTow.value.setCheckedNodes(value ? menuOptions.value : [])
}

const orgRegionListData = ref([
  { name: '户籍地址', value: 'regionDomicile' },
  { name: '现居地址', value: 'regionCurrent' },
  { name: '所属区域', value: 'belongingRegion' },
  { name: '联系人地址', value: 'ylMcMemberAddress' },
  { name: '活动地址', value: 'activityAddress' },
  { name: '本职', value: 'deptId' },
  { name: '兼职', value: 'administerDeptIds' },
  { name: '家庭住址', value: 'familyAddress' },
  { name: '使用人联系地址', value: 'userContactAddress' }
])

const orgRegionList = (key) => {
  if (key) {
    let keyArr = key.split(',')
    return orgRegionListData.value.filter((item) => keyArr.includes(item.value))
  }
  return []
}

const rowArray: any = ref([])
function installStatus(row, type) {
  nextTick(() => {
    const list = orgRegionList(row.otherData.menuPower.orgRegionMateMenuAreaAndBelow)
    const orgRegionAndBelow = row.otherData.dataPower.orgRegionAndBelow
    //全国数据
    if (type === '0') {
      row.otherData.dataPower.orgAndBelow = false
      row.otherData.dataPower.orgRegionAndBelow = false
      row.otherData.dataPower.onlySelf = false
    }
    //所属项目数据
    if (type === '1') {
      row.otherData.dataPower.allData = false
      row.otherData.dataPower.orgRegionAndBelow = false
      row.otherData.dataPower.onlySelf = false
    }
    //所属组织区域数据
    if (type === '2') {
      row.otherData.dataPower.allData = false
      row.otherData.dataPower.orgAndBelow = false
      row.otherData.dataPower.onlySelf = false
      //所属组织区域数据勾选上的情况下，组织区域与对应菜单匹配 默认 勾选上
      list.forEach((item) => {
        if (orgRegionAndBelow) {
          row.otherData.dataPower[item.value] = true
        } else {
          row.otherData.dataPower[item.value] = false
        }
      })
    }

    // 仅本人数据
    if (type === '3') {
      row.otherData.dataPower.allData = false
      row.otherData.dataPower.orgAndBelow = false
      row.otherData.dataPower.orgRegionAndBelow = false
    }

    if (['0', '1', '3'].includes(type)) {
      list.forEach((item) => {
        row.otherData.dataPower[item.value] = false
      })
    }
    row.otherData.dataPower.menuId = row.id
    if (rowArray.value.length) {
      rowArray.value.forEach((element, index) => {
        if (row.otherData.dataPower.menuId == element['menuId']) {
          rowArray.value.splice(index, 1)
          // delete rowArray[index]
        }
      })
    }
    rowArray.value.push(row.otherData.dataPower)
  })
}
/** 用户状态修改  */
function getStatus(row) {
  let text = row.status == '0' ? '启用' : '停用'
  ElMessageBox.confirm('是否' + text + '状态?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消'
  })
    .then(() => {
      changeRoleStatus({
        id: row.id,
        status: row.status === '0' ? row.status : '1'
      }).then((response) => {
        ElMessage({
          type: 'success',
          message: '修改成功'
        })
        getList()
      })
    })
    .catch(() => {
      getList()
    })
}
</script>
<style scoped>
.el-card {
  border: 0;
}
.has-gutter .el-table-column--selection div {
  display: none;
}

.links {
  margin-right: 15px;
  text-decoration: underline;
}

/* .el-button.is-disabled,
.el-button.is-disabled:focus,
.el-button.is-disabled:hover {
  background-color: #cccccc;
  border-color: #cccccc;
} */

.el-link.el-link--primary {
  --el-link-disabled-text-color: #cccccc;
}

/* .el-button:hover { */
/* border-color: #ffbf66;
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
} */

.el-link:hover {
  color: #ffbf66;
}

.el-link.is-disabled:hover {
  color: #ccc;
}
:deep(.el-input__wrapper) {
  min-width: 150px !important;
}
:deep(.el-select__wrapper) {
  min-width: 150px !important;
}
</style>
