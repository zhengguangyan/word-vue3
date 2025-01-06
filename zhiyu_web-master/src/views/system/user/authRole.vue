<script setup lang="ts">
import { ContentWrap } from '@/components/ContentWrap'
import { Search } from '@/components/Search'
import { useI18n } from '@/hooks/web/useI18n'
import { ElButton, ElTag, ElMessage, ElMessageBox, ElLink } from 'element-plus'
import { Dialog } from '@/components/Dialog'
import { Table } from '@/components/Table'
import { getTableListApi, delTableListApi, getUser, deptTreeSelect, addUser, updateUser, resetUserPwd, getRoles, dictType } from '@/api/sys/user'
import { areaList, treeList } from "@/api/sys/Project";
import { useTable } from '@/hooks/web/useTable'
import { TableData } from '@/api/table/types'
import { ref, reactive, h, getCurrentInstance, watch, nextTick } from 'vue'
// import Write from './components/Write.vue'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { useIcon } from '@/hooks/web/useIcon'
import { useRouter } from 'vue-router'
import { download } from '@/utils/export'
// 导出
defineOptions({
  name: 'index'
})
import { UploadFilled } from '@element-plus/icons-vue'
// import { getDictOneApi } from '@/api/common'
// import { TableColumn } from '@/types/table'
const addicon = useIcon({ icon: 'material-symbols:add' })
const delicon = useIcon({ icon: 'material-symbols:delete-outline-sharp' })
const improticon = useIcon({ icon: 'material-symbols:import-contacts' })
const expicon = useIcon({ icon: 'material-symbols:export-notes' })
const deptOptions = ref('')
const deptOptionsJz = ref('')
const deptName = ref("");
const title = ref("");
const { proxy } = getCurrentInstance() as any;
// const dictStore = useDictStore()
const { push } = useRouter()
const { register, tableObject, methods } = useTable<TableData>({
  getListApi: getTableListApi,
  delListApi: delTableListApi,
  response: {
    list: 'list',
    total: 'total'
  }
})
interface Params {
  pageNum?: number
  pageSize?: number
}

const defaultProps = {
  children: 'children',
  label: 'label',
  disabled: 'disabled',
}
// 区域选择
const listData: any = ref([]);
const getareaList = async () => {
  const result: any = await treeList()
  if (result.code == 200) {

    listData.value = result.data
    // listToTree(result.data, result.data[0].parentId)
  }
}
const userForm = ref()
// const getUserForm = async () => {
//   await dictType('sys_user_source').then((response) => {
//     userForm.value = response.data
//   });
// }

// getUserForm()
const rolename = ref('')
const deptRef = ref();
/** 所有部门节点数据 */
function getDeptAllCheckedKeys() {
  // 目前被选中的部门节点
  let checkedKeys = deptRef.value.getCheckedKeys();
  // 半选中的部门节点
  let halfCheckedKeys = [];
  checkedKeys.unshift.apply(checkedKeys, halfCheckedKeys);
  return checkedKeys;
}
function handleNodeAreaClick(data) {
}
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
//弹框数据
const form = ref({
  id: undefined,
  deptId: undefined,
  username: undefined,
  nickname: undefined,
  password: undefined,
  mobile: undefined,
  email: undefined,
  sex: undefined,
  status: '0',
  remark: undefined,
  postIds: [],
  roleIds: [],
  areaCodes: [],
  idCard: '',
  creatorName: '',
  updaterName: '',
  updateTime: '',
  createTime: '',
  deptNames: [],
  deptMap: {},
  administerDeptIds: []
})
//弹框数据验证
const rules = ref({
  username: [
    { required: true, message: '用户名称不能为空', trigger: 'blur' },
    {
      min: 2,
      max: 20,
      message: '用户名称长度必须介于 2 和 20 之间',
      trigger: 'blur',
    },
  ],
  nickname: [
    { required: true, message: '用户昵称不能为空', trigger: 'blur' },
  ],
  roleIds: [
    { required: true, message: '角色不能为空', trigger: 'blur' },
  ],
  sex: [
    { required: true, message: '性别不能为空', trigger: 'blur' },
  ],
  areaCodes: [
    { required: true, message: '所属项目不能为空', trigger: 'change' },
  ],
  deptId: [
    { required: true, message: '本职部门不能为空', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '用户密码不能为空', trigger: 'blur' },
    {
      min: 5,
      max: 20,
      message: '用户密码长度必须介于 5 和 20 之间',
      trigger: 'blur',
    },
  ],
  email: [
    {
      type: 'email',
      message: '请输入正确的邮箱地址',
      trigger: ['blur', 'change'],
    },
  ],
  mobile: [
    {
      pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
      message: '请输入正确的手机号码',
      trigger: 'blur',
    },
  ],
})
// 弹框岗位
const postOptions = ref([{ id: '', name: '', status: 1 }]);
const roleOptions = ref([{ id: '', name: '', status: 1 }])
let tableDataList = ref<TableData[]>([])
const par = ref({
  pageNum: '1',
  pageSize: 10,
  username: undefined,
  'params%5BcreateTime%5D': undefined,
  mobile: undefined,
  status: undefined,
  deptId: undefined,
  createTime: undefined
})
const getTableList = async (params?: Params) => {
  const res = await getTableListApi(
    params || par.value
  )
    .catch(() => { })
    .finally(() => {
      loading.value = false
    })
  if (res) {
    tableDataList.value = res.data.list
    tableObject.total = res.data.total
  }
}
function reset() {
  form.value = {
    id: undefined,
    deptId: undefined,
    username: undefined,
    nickname: undefined,
    password: undefined,
    mobile: undefined,
    email: undefined,
    sex: undefined,
    status: '0',
    remark: undefined,
    postIds: [],
    roleIds: [],
    areaCodes: [],
    idCard: '',
    creatorName: '',
    updaterName: '',
    updateTime: '',
    createTime: '',
    deptMap: {},
    administerDeptIds: [],
  };
  // proxy.resetForm('userRef');
}
/** 取消按钮 */
function cancel() {
  dialogVisible.value = false;
  reset();
}
const val = ref()
const pageSizeVal = ref()
watch(tableObject, (newValue, oldValue) => {
  val.value = newValue.currentPage
  pageSizeVal.value = newValue.pageSize
  par.value['pageNum'] = val.value
  par.value['pageSize'] = pageSizeVal.value
  getTableList()
});
getTableList()
const setSearchParams = (data) => {
  tableObject.currentPage = 1
  par.value = Object.assign(par.value, {
    ...data
  })
  par.value['params%5BcreateTime%5D'] = data.createTime
  delete par.value.createTime
  getTableList()
}

// getList()

const { t } = useI18n()
/** 通过条件过滤节点  */
const filterNode = (value, data) => {
  if (!value) return true;
  return data.label.indexOf(value) !== -1;
};
let suoshuxiangm = []
const crudSchemas = reactive<CrudSchema[]>([
  // {
  //   field: 'id',
  //   label: t('userDemo.userindex'),
  //   // width: '300px',
  //   form: {
  //     show: false
  //   },
  //   detail: {
  //     show: false
  //   }
  // },

  {
    field: 'username',
    label: t('登录名'),
    search: {
      show: true,
      colProps: {
        span: 8
      }
    },
    form: {
      colProps: {
        span: 24
      }
    },
    detail: {
      span: 24
    }
  },
  {
    field: 'nickname',
    label: t('姓名')
  },
  {
    field: 'sex',
    label: t('性别'),
    formatter: (_: Recordable, __: CrudSchema, cellValue: number) => {
      return h(
        ElTag,
        {
          type: cellValue == 1 ? 'success' : 'danger'
        },
        () =>
          cellValue == 0
            ? t('男')
            : cellValue == 1 ? t('女') : t('未知')
      )
    },
  },
  {
    field: 'dept.name',
    label: t('userDemo.userdept')
  },
  {
    field: 'areaNames',
    label: t('所属项目'),
    search: {
      field: 'areaCode',
      api: () => treeList().then((response) => {
        response.data.map(item => {
          suoshuxiangm.push({
            id: item.id,
            name: item.name,
            children: item.children
          })

        })
        // suoshuxiangm = response.data
        return suoshuxiangm
        // return response.data
      }),
      componentProps: {
        optionsSlot: true,
        props: { label: 'name', value: 'id', children: 'children' },
        data: suoshuxiangm,
        checkStrictly: true
      },
      show: true,
      colProps: {
        span: 12
      },
      component: 'TreeSelect',
    },
  },
  {
    field: 'mobile',
    label: t('userDemo.phonenumber'),
    search: {
      show: true,
      colProps: {
        span: 12
      }
    },
  },
  {
    field: 'sourceName',
    label: t('用户来源'),
    search: {
      show: true,
      api: () => dictType('sys_user_source').then((response) => {
        return response.data
      }),
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
      },
      field: 'source',
      colProps: {
        span: 12
      },
      component: 'Select',
    },
    form: {
      show: false
    }
  },
  {
    field: 'status',
    label: t('userDemo.stats'),
    formatter: (_: Recordable, __: CrudSchema, cellValue: number) => {
      return h(
        ElTag,
        {
          type: cellValue == 0 ? 'success' : 'danger'
        },
        () =>
          cellValue == 0
            ? t('启用')
            : t('停用')
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
            label: '禁用',
            value: '1'
          }
        ]
      }
    },
  },
  {
    field: 'createTime',
    label: t('userDemo.createTime'),
    form: {
      component: 'DatePicker',
      componentProps: {
        type: 'daterange',
        valueFormat: 'YYYY-MM-DD HH:mm:ss'
      }
    },
    search: {
      show: true,
      colProps: {
        span: 12,
      },
      field: 'createTime',
      component: 'DatePicker',
      componentProps: {
        type: 'daterange',
        valueFormat: 'YYYY-MM-DD HH:mm:ss'
      }
    },
  },
  {
    field: 'loginTime',
    label: t('最后登录时间'),
    width: '150px',
    form: {
      component: 'DatePicker',
      componentProps: {
        type: 'daterange',
        valueFormat: 'YYYY-MM-DD HH:mm:ss'
      }
    },
    search: {
      show: false,
      colProps: {
        span: 12,
      },
      field: 'createTime',
      component: 'DatePicker',
      componentProps: {
        type: 'daterange',
        valueFormat: 'YYYY-MM-DD HH:mm:ss'
      }
    },
  },
  {
    field: 'action',
    width: '300px',
    label: t('tableDemo.action'),
    form: {
      show: false
    },
    detail: {
      show: false
    }
  }
])

const { allSchemas } = useCrudSchemas(crudSchemas)

const delLoading = ref(false)
//编辑
const userdata = ref()
const actionType = ref('')

function parseLongKeyMap(map) {
  let result = {}
  if (map) {
    for (let key in map) {
      result[parseInt(key)] = map[key]
    }
  }
  return result
}
const action = async (row: TableData, type: string) => {
  await getareaList()
  await getUser(row.id).then((response) => {
    //proxy.$refs['deptTreeRefJz'].setCheckedKeys([103,105])
    //proxy.$refs['deptTreeRefJz'].getCheckedKeys()
    form.value = response.data;
    form.value.administerDeptIds = response.data.administerDeptIds && response.data.administerDeptIds.split(',')
    //form.value.administerDeptIds = [999,888,777]
    //form.value.administerDeptIds = ['aaa','bbb']
    //form.value.administerDeptIds = [{id:105, label:444}, {id:109, label:555}]
    userdata.value = response
    postOptions.value = userdata.value.posts;
    roleOptions.value = userdata.value.roles;
    form.value.postIds = userdata.value.postIds
    form.value.roleIds = userdata.value.roleIds


    form.value.deptNames = userdata.value.deptNames
    form.value.deptMap = userdata.value.deptMap
    //form.value.deptMap = {"104":"市场部", "3460515545022981":"产品部"}
    actionType.value = type
    dialogTitle.value = type == 'detail' ? t('exampleDemo.detail') : t('exampleDemo.edit')

    tableObject.currentRow = row
    dialogVisible.value = true
    nextTick(() => {
      if (deptRef.value) {
        deptRef.value.setCheckedKeys(response.data['areaCodes'].split(','));
      }
    });
  });

}
// const writeRef = ref<ComponentRef<typeof Write>>()
const dialogTitle = ref('')
//新增
const addUserData = ref()

function check(allNode, selectedNode) {
  //alert(JSON.stringify(selectedNode));
}
function loadTreeNode(node, resolve) {
  // node其实是需要展开树节点，但是第一次的node是个无用的数据，可以认为这个node是element给我们创建的，判断的话，就是level等于0
  //alert(node)
  //alert(resolve)
  //resolve(deptOptionsJz)
  if (node) {

    //getDeptData(0, resolve);
  } else {
    //getDeptData(node, resolve);
  }
  //getDeptTreeJz(null)
}
function AddAction() {
  getareaList()
  form.value = {
    id: undefined,
    deptId: undefined,
    username: undefined,
    nickname: undefined,
    password: undefined,
    mobile: undefined,
    email: undefined,
    sex: undefined,
    status: '0',
    remark: undefined,
    postIds: [],
    roleIds: [],
    areaCodes: [],
    idCard: '',
    creatorName: '',
    updaterName: '',
    updateTime: '',
    createTime: '',
    deptNames: [],
    deptMap: {},
    administerDeptIds: []
  };
  getUser('').then((response) => {
    addUserData.value = response
    postOptions.value = addUserData.value.posts;
    roleOptions.value = addUserData.value.roles;

    dialogTitle.value = t('exampleDemo.add')
    tableObject.currentRow = null
    dialogVisible.value = true
    actionType.value = ''
  })

}
const submitForm = async () => {
  const administerDept = ref()
  administerDept.value = form.value.administerDeptIds && form.value.administerDeptIds.join(',')
  form.value.areaCodes = getDeptAllCheckedKeys().join(',');
  form.value.administerDeptIds = administerDept.value
  proxy.$refs['userRef'].validate((valid) => {
    if (valid) {
      if (form.value.id != undefined) {

        updateUser(form.value).then((response) => {
          ElMessage.success('修改成功');
          dialogVisible.value = false;
          getTableList();
        });
      } else {
        addUser(form.value).then((response) => {
          ElMessage.success('新增成功');
          dialogVisible.value = false;
          getTableList();
        });
      }
    }
  });
}
const loading = ref(false)
const dialogVisible = ref(false)
//删除
const delData = async (row: TableData | null, multiple: boolean) => {
  const tip = ref()
  tableObject.currentRow = row
  tip.value = multiple ? '是否确认删除所选数据？' : '是否确定删除该数据'
  const { getSelections } = methods
  const selections = await getSelections()
  if (multiple && selections.length == 0) {
    ElMessage.error('请先选择')
  } else {
    delLoading.value = true
    ElMessageBox.confirm(
      tip.value,
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )
      .then(() => {
        delTableListApi(
          multiple ? selections.map((v) => v.id) : [tableObject.currentRow?.id as string],
        ).then((res) => {
          if (res) {
            delLoading.value = false
            getTableList()
          }

        })
      })
      .catch(() => {
        delLoading.value = false
      });
  }



}

// import { title } from 'process'
const DialogOpen = ref(false)
// function deImport() {
//   DialogOpen.value = true;
//   title.value = "用户导出"

// }
// const deImport01 = async () => {
//   download(
//     'system/user/export',
//     {
//       ...par.value,
//     },
//     `user_${new Date().getTime()}.xlsx`,
//     {}
//   );
// }

//导出



function getDeptTree() {
  deptTreeSelect(null).then((response) => {
    deptOptions.value = response.data;
  });
}
function getDeptTreeJz(id) {

  deptTreeSelect({ disabledDeptId: [id] }).then((response) => {
    deptOptionsJz.value = response.data;
  });
}



function handleNodeClick(data) {
  par.value.deptId = data.id;
  handleQuery();
}
/** 搜索按钮操作 */
function handleQuery() {
  par.value.pageNum = '1';
  getTableList();
}
getDeptTree()
getDeptTreeJz(null)



/** 根据名称筛选部门树 */
function watchs(val) {
  getDeptTreeJz(val.id)
  // proxy.$refs['deptTreeRefJz'].filter(val);
};
// function watchs(val) {
//   proxy.$refs['deptTreeRefJz'].filter(val);
// };
/** 重置密码按钮操作 */
function handleResetPwd(row) {
  proxy
    .$prompt('请输入"' + row.username + '"的新密码', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      closeOnClickModal: false,
      inputPattern: /^.{5,20}$/,
      inputErrorMessage: '用户密码长度必须介于 5 和 20 之间',
    })
    .then(({ value }) => {
      let data = {
        id: row.id,
        password: value
      }
      resetUserPwd(data).then((response) => {
        ElMessage.success('修改成功，新密码是：' + value);
      });
    })
    .catch(() => { });
}
const sexOptions = ref([
  {
    value: '2',
    label: '未知',
  },
  {
    value: '0',
    label: '男',
  },
  {
    value: '1',
    label: '女',
  },
])
const statusOptions = ref([
  {
    value: '0',
    label: '启用',
  },
  {
    value: '1',
    label: '停用',
  },
])
/** 跳转角色分配 */
function handleAuthRole(row) {
  push(`/system/authRole?id=${row.id}`)
}
const rolenameChange = async (e) => {
  await getRoles({ name: e }).then((response) => {
    roleOptions.value = response.data
  })
}
/** 节点单击事件 */
function deptHandleNodeClick(data) {
  form.value.deptId = data.id;
  handleQuery();
}
// const dialogFormVisible = ref(false)
</script>

<template>
  <el-row class="tac">
    <!-- <el-col :span="3" class="mr-15px">
        <div class="head-container">
          <el-input v-model="deptName" @input="watchs" placeholder="请输入部门名称" clearable prefix-icon="Search"
            style="margin-bottom: 20px" />
        </div>
        <el-tree :data="deptOptions" :props="{ label: 'label', children: 'children' }" :expand-on-click-node="false"
          :filter-node-method="filterNode" ref="deptTreeRef" node-key="id" highlight-current default-expand-all
          @node-click="handleNodeClick" />
      </el-col> -->
    <el-col>
      <Search :schema="allSchemas.searchSchema" @keyup="setSearchParams" @search="setSearchParams"
        @reset="setSearchParams">
        <template #areaNames-default>
          <span>1111</span>
          <span>
            222
          </span>
        </template>
        <template #areaNames>
          <span>1111</span>
          <span>
            222
          </span>
        </template>
      </Search>


      <div class="mb-10px">
        <ElButton type="primary" v-hasPermi="['system:user:add']" :icon=addicon @click="AddAction">
          {{ t('exampleDemo.add') }}
        </ElButton>
        <ElButton :loading="delLoading" v-hasPermi="['system:user:remove']" :icon=delicon type="primary"
          @click="delData(null, true)">
          {{ t('exampleDemo.del') }}
        </ElButton>
        <!-- <ElButton :loading="delLoading" :icon=improticon type="primary" @click="deImport">
            {{ t('导入') }}
          </ElButton>
          <ElButton :loading="delLoading" :icon=expicon type="primary" @click="deImport01">
            {{ t('导出') }}
          </ElButton> -->
      </div>
      <Table v-model:pageSize="tableObject.pageSize" :columns="allSchemas.tableColumns" :data="tableDataList"
        :loading="loading" :pagination="{ total: tableObject.total }" v-model:currentPage="tableObject.currentPage"
        @register="register">

        <template #action="{ row }">
          <ElLink class="links" size="small" v-hasPermi="['system:user:edit']" type="primary" @click="action(row, 'edit')"
            v-if="row.id != 1">
            {{ t('exampleDemo.edit') }}
          </ElLink>
          <ElLink class="links" size="small" type="primary" v-hasPermi="['system:user:query']"
            @click="action(row, 'detail')" v-if="row.id != 1">
            {{ t('exampleDemo.detail') }}
          </ElLink>
          <ElLink class="links" :loading="delLoading" v-hasPermi="['system:user:remove']" size="small" type="primary"
            @click="delData(row, false)" v-if="row.id != 1">
            {{ t('exampleDemo.del') }}
          </ElLink>
          <ElLink class="links" :loading="delLoading" v-hasPermi="['system:user:resetPwd']" size="small" type="primary"
            @click="handleResetPwd(row)" v-if="row.id != 1">
            {{ t('重置') }}
          </ElLink>
          <!-- <ElButton :loading="delLoading" size="small" type="default" v-if="row.id != 1" @click="handleAuthRole(row)">
              {{ t('分配') }}
            </ElButton> -->
        </template>
      </Table>
    </el-col>
  </el-row>
  <Dialog v-model="dialogVisible" :title="dialogTitle">
    <el-form :model="form" handleType="desc" :rules="rules" ref="userRef" label-width="80px"
      :disabled="actionType == 'detail'">
      <el-row>
        <el-col :span="10">
          <el-form-item label="姓名" prop="nickname">
            <el-input clearable v-model="form.nickname" placeholder="请输入用户昵称" maxlength="30" />
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="本职部门" prop="deptId">
            <el-tree-select clearable v-model="form.deptId" :data="deptOptions"
              :props="{ label: 'label', children: 'children', disabled: 'disabled' }" value-key="id"
              :expand-on-click-node="false" placeholder="请选择归属部门" ref="deptTreeRef" check-strictly filterable
              @node-click="watchs" :filter-node-method="filterNode" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10">
          <el-form-item label="手机号码" prop="mobile">
            <el-input clearable v-model="form.mobile" placeholder="请输入手机号码" maxlength="11" />
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="兼职部门" prop="administerDeptIds">
            <el-tree-select clearable v-model="form.deptMap" multiple :data="deptOptionsJz"
              :props="{ id: 'id', label: 'label', children: 'children', disabled: 'disabled' }" value-key="id"
              :expand-on-click-node="false" placeholder="请选择管辖部门" ref="deptTreeRefJz" check-strictly filterable
              :filter-node-method="filterNode" show-checkbox="true" node-key="id" @check="check" @load="loadTreeNode"
              :default-expanded-keys="[form.administerDeptIds]" :default-checked-keys="form.administerDeptIds" />
          </el-form-item>
        </el-col>
        <!-- <el-col :span="12">
          <el-form-item label="邮箱" prop="email">
            <el-input clearable v-model="form.email" placeholder="请输入邮箱" maxlength="50" />
          </el-form-item>
        </el-col> -->
      </el-row>
      <el-row>
        <el-col :span="10">
          <el-form-item label="登录名" prop="username">
            <el-input clearable :disabled="form.id != undefined" v-model="form.username" placeholder="请输入用户名称"
              maxlength="30" />
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item v-if="form.id == undefined" label="用户密码" prop="password">
            <el-input clearable v-model="form.password" placeholder="请输入用户密码" type="password" maxlength="20"
              show-password />
          </el-form-item>
          <el-form-item label="身份证号">
            <el-input clearable :disabled="actionType == 'detail'" v-model="form.idCard" placeholder="请输入身份证号"
              maxlength="30" />
          </el-form-item>
        </el-col>

      </el-row>
      <el-row>
        <el-col :span="10">
          <el-form-item label="用户性别" prop="sex">
            <el-select clearable v-model="form.sex" placeholder="请选择">
              <el-option v-for="  dict   in   sexOptions  " :key="dict.value" :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="状态">
            <el-select clearable v-model="form.status" placeholder="请选择">
              <el-option v-for="  dict   in   statusOptions  " :key="dict.value" :label="dict.label"
                :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10">
          <el-form-item clearable label="岗位">
            <el-select clearable v-model="form.postIds" multiple placeholder="请选择">
              <el-option v-for="  item   in   postOptions  " :key="item.id" :label="item.name" :value="item.id"
                :disabled="item.status == 1" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="角色" prop="roleIds">

            <el-select clearable v-model="form.roleIds" multiple placeholder="请选择">
              <el-input v-model="rolename" filterable @change="rolenameChange" placeholder="请输入角色名称" clearable />
              <el-option v-for=" item in roleOptions " :disabled="item.status == 1" :key="item.id" :label="item.name"
                :value="item.id" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="20">
          <el-form-item label="备注">
            <el-input clearable v-model="form.remark" type="textarea" placeholder="请输入内容" />
          </el-form-item>
        </el-col>
      </el-row>
      <div>
        <el-row v-if="actionType == 'detail'">
          <el-col :span="10">
            <el-form-item label="创建人">
              <el-input v-model="form.creatorName" />
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="更新时间">
              <el-input v-model="form.updateTime" maxlength="30" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="actionType == 'detail'">
          <el-col :span="10">
            <el-form-item label="创建时间">
              <el-input v-model="form.createTime" maxlength="30" />
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="更新人">
              <el-input v-model="form.updaterName" />
            </el-form-item>
          </el-col>
        </el-row>
      </div>
      <el-row>
        <el-col :span="24">
          <el-form-item label="所属项目" prop="areaCodes">
            <!-- <el-checkbox v-model="deptExpand" @change="handleCheckedTreeExpand($event)">展开/折叠</el-checkbox>
            <el-checkbox v-model="deptNodeAll" @change="handleCheckedTreeNodeAll($event)">全选/全不选</el-checkbox> -->
            <!-- <el-checkbox v-model="form.deptCheckStrictly"
              @change="handleCheckedTreeConnect($event, 'dept')">父子联动</el-checkbox> -->
            <el-tree class="tree-border" :data="listData" show-checkbox ref="deptRef" node-key="code" empty-text="加载中，请稍候"
              :props="{ label: 'name', children: 'children' }" @node-click="handleNodeAreaClick" />
          </el-form-item>
        </el-col>
      </el-row>

    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button v-if="actionType != 'detail'" type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </template>
  </Dialog>

  <!-- 导入弹框 -->
  <el-dialog v-model="DialogOpen" :title="title" width="30%" align-center>
    <el-upload class="upload-demo" drag action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15" multiple>
      <el-icon class="el-icon--upload"><upload-filled /></el-icon>
      <div class="el-upload__text">
        将文件拖到此处 ,或<em>点击上</em>
      </div>
      <template #tip>
        <div class="el-upload__tip ">
          是否更新已经存在的用户数据
          仅允许导入xls、xlsx格式文件。下载模板
        </div>
      </template>
    </el-upload>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="DialogOpen = false">
          确定
        </el-button>
        <el-button @click="DialogOpen = false">取消</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<style lang="less">
.links {
  margin-right: 15px;
  text-decoration: underline;
}
</style>
