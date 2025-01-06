<script setup lang="ts">
import { ContentWrap } from '@/components/ContentWrap'
import { useI18n } from '@/hooks/web/useI18n'
import { Table } from '@/components/Table'
// import { getUserListApi } from '@/api/login'
import { ref, reactive, h, getCurrentInstance } from 'vue'
import { ElButton, ElTag, ElMessage } from 'element-plus'
// import { TableSlotDefault } from '@/types/table'
import { useIcon } from '@/hooks/web/useIcon'
import { Search } from '@/components/Search'
import { useTable } from '@/hooks/web/useTable'
import { TableData } from '@/api/table/types'
import { Dialog } from '@/components/Dialog'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { getLoginLogListApi, delTableListApi, cleanTableListApi, unlockTableListApi } from '@/api/sys/loginLog'
import moment from 'moment'
import { TableColumn } from '@/types/table'
import Detail from '../components/Detail.vue'
import { getAuth } from '@/utils/export'
// improt {getCurrentInstance} from 'vue'
const delicon = useIcon({ icon: 'material-symbols:delete-outline-sharp' })
const refreshicon = useIcon({ icon: 'grommet-icons:empty-circle' })
const improticon = useIcon({ icon: 'material-symbols:import-contacts' })
const { proxy } = getCurrentInstance() as any
// interface Params {
//   pageIndex?: number
//   pageSize?: number
// }

const { t } = useI18n()
const { register, tableObject, methods } = useTable<TableData>({
  getListApi: getLoginLogListApi,
  delListApi: delTableListApi,
  response: {
    list: 'list',
    total: 'total'
  }
})

const crudSchemas = reactive<CrudSchema[]>([
  {
    field: 'id',
    label: t('访问编号')
  },
  {
    field: 'userName',
    label: t('用户名称'),
    search: {
      show: true,
      colProps: {
        span: 12
      }
    },
    sortable: true
  },
  {
    field: 'ipaddr',
    label: t('登录地址'),
    search: {
      show: true,
      colProps: {
        span: 12
      }
    }
  },
  {
    field: 'loginLocation',
    label: t('登录地点')
  },
  {
    field: 'browser',
    label: t('浏览器')
  },

  {
    field: 'os',
    label: t('操作系统')
  },
  {
    field: 'status',
    label: t('登录状态'),
    search: {
      show: true,
      colProps: {
        span: 12
      },
      component: 'Select',
      componentProps: {
        options: [
          {
            label: '成功',
            value: 0
          },
          {
            label: '失败',
            value: 1
          }
        ]
      }
    },
    formatter: (_: Recordable, __: TableColumn, cellValue: number) => {
      return h(
        ElTag,
        {
          type: cellValue == 0 ? 'success' : cellValue == 1 ? 'warning' : 'danger'
        },
        () => (cellValue == 0 ? t('成功') : cellValue == 1 ? t('失败') : t('tableDemo.commonly'))
      )
    }
  },
  {
    field: 'updateBy',
    label: t('操作信息')
  },
  {
    field: 'loginTime',
    label: t('登录日期'),
    sortable: true,
    solt: true,
    form: {
      show: false
    },

    search: {
      field: 'params%5BcreateTime%5D',
      show: true,
      value: [moment().format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')],
      colProps: {
        span: 12
      },
      component: 'DatePicker',
      componentProps: {
        type: 'daterange',
        valueFormat: 'YYYY-MM-DD'
      }
    }
  }
])
const { getList, setSearchParams } = methods

getList()
setSearchParams({
  'params%5BcreateTime%5D': [moment().format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')]
})
const { allSchemas } = useCrudSchemas(crudSchemas)
const dialogVisible = ref(false)
const details = (row: TableData) => {
  dialogTitle.value = t('exampleDemo.detail')
  tableObject.currentRow = row
  dialogVisible.value = true
}
const dialogTitle = ref('')
//删除
const delLoading = ref(false)
const delData = async (row: TableData | null, multiple: boolean) => {
  tableObject.currentRow = row
  const { delList, getSelections } = methods
  const selections = await getSelections()
  unlockLoading.value = true
  await delList(multiple ? selections.map((v) => v.id) : [tableObject.currentRow?.id as string], multiple).finally(() => {
    unlockLoading.value = false
  })
}
//解锁
const unlockLoading = ref(false)
const unlock = async (row: TableData | null, multiple: boolean) => {
  tableObject.currentRow = row
  const { getSelections } = methods
  const selections = await getSelections()
  delLoading.value = true
  if (selections.length != 0) {
    await unlockTableListApi(multiple ? selections.map((v) => v.userName) : [tableObject.currentRow?.userName as string]).finally(() => {
      getList()
      delLoading.value = false
      ElMessage.success('解锁成功')
    })
  } else {
    ElMessage.success('请选择')
  }
}

const cleanLoading = ref(false)
const clean = async () => {
  cleanLoading.value = true
  await cleanTableListApi().finally(() => {
    cleanLoading.value = false
    getList()
  })
}

// //导出
// const exprotBtn = () => {
//   proxy.download(
//     'system/config/export',
//     {
//       ...tableObject.tableList,
//     },
//     `config_${new Date().getTime()}.xlsx`
//   );
// }
</script>

<template>
  <el-card shadow="never" class="card">
    <template #header>
      <div class="card-header">
        <span class="title">登录日志</span>
      </div>
    </template>
    <Search :schema="allSchemas.searchSchema" @keyup="setSearchParams" @search="setSearchParams" @reset="setSearchParams" />

    <!-- <div class="mb-10px"> -->
    <!-- <ElButton type="danger" :icon="delicon" @click="delData(null, true)">
        {{ t('exampleDemo.del') }}
      </ElButton>
      <ElButton type="primary" :icon="refreshicon" @click="clean()">
        {{ t('清空') }}
      </ElButton>
      <ElButton type="primary" :icon="refreshicon" @click="unlock(null, true)">
        {{ t('解锁') }}
      </ElButton> -->
    <!-- <ElButton type="primary" :icon="improticon" @click="exprotBtn">
        {{ t('导出') }}
      </ElButton> -->
    <!-- </div> -->
    <Table
      v-model:pageSize="tableObject.pageSize"
      :selection="false"
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
      border
      height="calc(100vh - 305px)"
    >
      <template #action="{ row }">
        <ElButton size="small" type="primary" :disabled="getAuth('monitor:logininfor:query')" @click="details(row)">{{ t('详情') }} </ElButton>
      </template>
    </Table>
  </el-card>
  <Dialog v-model="dialogVisible" :title="dialogTitle">
    <Detail :detail-schema="allSchemas.detailSchema" :current-row="tableObject.currentRow" />
  </Dialog>
</template>
<style scoped>
.el-button.is-disabled,
.el-button.is-disabled:focus,
.el-button.is-disabled:hover {
  background-color: #cccccc;
  border-color: #cccccc;
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
:deep(.el-input__wrapper) {
  min-width: 150px !important;
}
:deep(.el-select__wrapper) {
  min-width: 150px !important;
}
</style>
