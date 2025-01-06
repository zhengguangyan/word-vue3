<script setup lang="ts">
import { ContentWrap } from '@/components/ContentWrap'
import { useI18n } from '@/hooks/web/useI18n'
import { Table } from '@/components/Table'
// import { getUserListApi } from '@/api/login'
import { ref, reactive, h, watch, unref, getCurrentInstance } from 'vue'
import { ElButton, ElTag, ElMessage, ElLink } from 'element-plus'
// import { TableSlotDefault } from '@/types/table'
import { useIcon } from '@/hooks/web/useIcon'
import { Search } from '@/components/Search'
import { useTable } from '@/hooks/web/useTable'
import { TableData } from '@/api/table/types'
import { Dialog } from '@/components/Dialog'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import {
  allocatedUserList,
  delTableListApi,
  unallocatedUserList,
  authUserSelectAll,
  authUserCancel,
  authUserCancelAll
} from '@/api/sys/role'
import { useRoute, useRouter } from 'vue-router'
import { useTagsViewStore } from '@/store/modules/tagsView'
const { replace } = useRouter()
const tagsViewStore = useTagsViewStore()
const route = useRoute()
const { proxy } = getCurrentInstance() as any
// improt {getCurrentInstance} from 'vue'
const addicon = useIcon({ icon: 'material-symbols:add' })
const delicon = useIcon({ icon: 'material-symbols:delete-outline-sharp' })
// const refreshicon = useIcon({ icon: 'carbon:close-outline' })
// const { proxy } = getCurrentInstance() as any;
interface Params {
  pageNum?: number
  pageSize?: number
  roleId?: any
}

const currentPage = ref(1)
const currentPageTable = ref(1)
const pageSize = ref(10)
const small = ref(false)
const total = ref()
const background = ref(false)
const disabled = ref(false)

const { t } = useI18n()
const { register, tableObject, methods } = useTable<TableData>({
  getListApi: allocatedUserList,
  delListApi: delTableListApi,
  response: {
    list: 'list',
    total: 'total'
  }
})
const actionShow = ref(true)
const crudSchemas = reactive<CrudSchema[]>([
  {
    field: 'username',
    label: t('登录名'),
    search: {
      show: true,
      colProps: {
        span: 12
      }
    }
  },
  {
    field: 'nickname',
    label: t('姓名'),
    search: {
      show: false,
      colProps: {
        span: 12
      }
    }
  },
  // {
  //   field: 'email',
  //   label: t('邮箱'),
  //   search: {
  //     show: false,
  //     colProps: {
  //       span: 12
  //     },
  //   }
  // },
  {
    field: 'mobile',
    label: t('手机'),
    search: {
      show: true
    }
  },
  {
    field: 'status',
    label: t('状态'),
    formatter: (_: Recordable, __: CrudSchema, cellValue: string) => {
      return h(
        ElTag,
        {
          type: cellValue == '0' ? 'success' : 'danger'
        },
        () => (cellValue == '0' ? t('正常') : t('停用'))
      )
    },
    search: {
      show: false
    },
    form: {
      show: false
    }
  },
  {
    field: 'createTime',
    label: t('userDemo.createTime'),
    width: '200px',
    form: {
      show: false
    },
    search: {
      show: false
    }
  },
  {
    field: 'action',
    label: t('userDemo.action'),
    table: {
      show: actionShow.value
    },
    form: {
      show: false
    },
    search: {
      show: false
    }
  }
])
const pageparms = ref({
  pageNum: 1,
  pageSize: 10,
  username: undefined,
  status: undefined,
  roleId: undefined
})
const par = ref({
  pageNum: 1,
  pageSize: 10,
  username: undefined,
  status: undefined,
  roleId: undefined
})
const setSearchParamsDiel = (data) => {
  tableObject.currentPage = 1
  par.value = Object.assign(par.value, {
    ...data
  })
  addGetTableList()
}
const setSearchParams = (data) => {
  tableObject.currentPage = 1

  pageparms.value = Object.assign(pageparms.value, {
    ...data
  })
  getTableList()
}
let tableDataList = ref<TableData[]>([])
let tableDataListDiel = ref<TableData[]>([])
const getTableList = async (params?: Params) => {
  const roleId = route.query && route.query.id
  pageparms.value = Object.assign(pageparms.value, {
    roleId: roleId
  })
  const res = await allocatedUserList(params || pageparms.value)
    .catch(() => {})
    .finally(() => {
      loading.value = false
    })
  if (res) {
    const { setColumn } = methods
    setColumn([
      {
        field: 'action',
        path: 'label',
        value: '操作',
        width: '10px'
        // show: false
      }
    ])
    tableDataList.value = res.data ? res.data.list : []
    loading.value = false
    tableObject.total = res.data.total
  }
}
const val = ref()
const pageSizeVal = ref()
watch(tableObject, (newValue, oldValue) => {
  val.value = newValue.currentPage
  pageSizeVal.value = newValue.pageSize
  pageparms.value['pageNum'] = val.value
  pageparms.value['pageSize'] = pageSizeVal.value
  getTableList()
})
watch(currentPageTable, (newValue, oldValue) => {
  val.value = newValue
  pageparms.value['pageNum'] = newValue
  getTableList()
})
const roleId = route.query && route.query.id
const addGetTableList = async (params?: Params) => {
  par.value = Object.assign(par.value, {
    ...{ roleId: roleId }
  })
  const res = await unallocatedUserList(params || par.value)
    .catch(() => {})
    .finally(() => {
      loading.value = false
    })
  if (res) {
    tableDataListDiel.value = res.data ? res.data.list : []
    total.value = res.data.total
    loading.value = false
  }
}
const addPas = ref()
const taggerGetTableList = (pas: null | number) => {
  addPas.value = pas
  if (pas) {
    addGetTableList()
  } else {
    getTableList()
  }
}
taggerGetTableList(null)
const loading = ref(false)
const { allSchemas } = useCrudSchemas(crudSchemas)
//保存
const { getSelections } = methods
const dialogVisible = ref(false)
const actionType = ref('')
const dialogTitle = ref('')
const AddAction = () => {
  actionShow.value = false
  const { setColumn } = methods
  setColumn([
    {
      field: 'action',
      path: 'label',
      value: ''
    }
  ])
  dialogTitle.value = t('exampleDemo.add')
  tableObject.currentRow = null
  dialogVisible.value = true
  actionType.value = ''
  taggerGetTableList(1)
}
const save = async () => {
  const selectionss = await getSelections()
  if (selectionss.length != 0) {
    loading.value = true
    const data = ref({
      userIds: selectionss.map((v) => v.id).join(','),
      roleId: route.query && route.query.id
    })
    await authUserSelectAll(data.value).then((res) => {
      if (res) {
        // const obj = { path: "/system/authuser" } as any;
        // tagsViewStore.delView(obj)

        // replace(obj)
        ElMessage.success('操作成功')
        getTableList()

        dialogVisible.value = false
        // tableObject.currentPage = 1
      }
    })
  } else {
    ElMessage.error('请选择')
  }

  // if (selections) {

  // } else {
  //
  // }
}
//删除
const delLoading = ref(false)
const delData = async (row: TableData | null) => {
  tableObject.currentRow = row
  delLoading.value = true
  await authUserCancel({
    userId: tableObject.currentRow?.id as string,
    roleId: route.query && route.query.id
  })
    .then((response) => {
      if (response) {
        ElMessage.success('操作成功')
        currentPageTable.value = 1
        getTableList()
      } else {
      }
    })
    .finally(() => {
      delLoading.value = true
    })
}
const delDataAll = async () => {
  const seles = unref(proxy.$refs['tableMine']).selections
  const selections = await getSelections()
  delLoading.value = true
  if (seles.length != 0) {
    await authUserCancelAll({
      userIds: seles.map((v) => v.id).join(','),
      roleId: route.query && route.query.id
    })
      .then((response) => {
        if (response) {
          ElMessage.success('操作成功')
          getTableList()
        } else {
        }
      })
      .finally(() => {
        delLoading.value = true
      })
  } else {
    ElMessage.error('请选择')
  }
}
//关闭
const close = () => {
  dialogVisible.value = false
  getTableList()
}
const handleSizeChange = (val: number) => {

  par.value['pageSize'] = val
  addGetTableList()
}
const handleCurrentChange = (val: number) => {
  par.value['pageNum'] = val
  addGetTableList()
}
</script>

<template>
  <el-card shadow="never" class="card">
    <template #header>
      <div class="card-header">
        <span class="title">用户授权</span>
      </div>
    </template>

    <Search :schema="allSchemas.searchSchema" @search="setSearchParams" @reset="setSearchParams" />

    <div class="mb-10px">
      <ElButton type="primary" :icon="addicon" @click="AddAction">
        {{ t('添加用户') }}
      </ElButton>
      <ElButton type="primary" :icon="delicon" @click="delDataAll()">
        {{ t('批量取消授权') }}
      </ElButton>
      <!-- <ElButton type="primary" :icon="refreshicon" @click="handleRefreshCache">
        {{ t('关闭') }}
      </ElButton> -->
    </div>
    <Table
      ref="tableMine"
      v-model:pageSize="tableObject.pageSize"
      :pagination="{ total: tableObject.total }"
      v-model:currentPage="currentPageTable"
      :columns="allSchemas.tableColumns"
      :data="tableDataList"
      @register="register"
    >
      <template #action="{ row }">
        <ElLink size="small" class="links" type="primary" @click="delData(row)">取消授权 </ElLink>
      </template>
    </Table>
  </el-card>
  <Dialog v-model="dialogVisible" :title="dialogTitle">
    <Search
      :schema="allSchemas.searchSchema"
      @keyup="setSearchParams"
      @search="setSearchParamsDiel"
      @reset="setSearchParamsDiel"
    />
    <Table :columns="allSchemas.tableColumns" :data="tableDataListDiel" @register="register" />

    <el-pagination
      style="margin-top: 10px"
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      :page-sizes="[10, 20, 30, 50, 100, 200]"
      :small="small"
      :disabled="disabled"
      :background="background"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    <ElButton class="mt-10" v-if="actionType !== 'detail'" type="primary" @click="save">
      {{ t('exampleDemo.save') }}
    </ElButton>
    <ElButton class="mt-10" @click="close()">{{ t('dialogDemo.close') }}</ElButton>
  </Dialog>
</template>

<style>
.el-pagination__total {
  margin-right: 20px;
}

.links {
  margin-right: 15px;
  text-decoration: underline;
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
