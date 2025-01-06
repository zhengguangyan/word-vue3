<script setup lang="ts">
import { useI18n } from '@/hooks/web/useI18n'
import { Table } from '@/components/Table'
// import { getUserListApi } from '@/api/login'
import { ref, reactive, h, getCurrentInstance } from 'vue'
import { ElLink } from 'element-plus'
// import { TableSlotDefault } from '@/types/table'
import { Search } from '@/components/Search'
import { useTable } from '@/hooks/web/useTable'
import { TableData } from '@/api/table/types'
import { Dialog } from '@/components/Dialog'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import moment from 'moment'
import { getLogListApi, delTableListApi, cleanTableListApi } from '@/api/sys/log'
import { TableColumn } from '@/types/table'
import Detail from '../components/Detail.vue'
import { getAuth } from '@/utils/export'
// import moment from 'moment'
// improt {getCurrentInstance} from 'vue'
const { proxy } = getCurrentInstance() as any
// interface Params {
//   pageNum??: number
//   pageSize?: number
// }

const { t } = useI18n()
const { register, tableObject, methods } = useTable<TableData>({
  getListApi: getLogListApi,
  delListApi: delTableListApi,
  response: {
    list: 'list',
    total: 'total'
  }
})
const crudSchemas = reactive<CrudSchema[]>([
  {
    field: 'id',
    label: t('日志编号')
  },
  {
    field: 'title',
    label: t('系统模块'),
    search: {
      show: true,
      colProps: {
        span: 12
      }
    }
  },
  {
    field: 'operatorType',
    label: t('界面类型'),
    formatter: (_: Recordable, __: TableColumn, cellValue: number) => {
      return renderDict(cellValue, 'operator_type')
    }
  },
  {
    field: 'businessType',
    label: t('操作类型'),
    formatter: (_: Recordable, __: TableColumn, cellValue: number) => {
      return h(
        // span,
        // {
        //   type: cellValue == 0 ? 'success' : 'danger'
        // },
        () =>
          cellValue == 0
            ? t('其他')
            : cellValue == 1
            ? t('新增')
            : cellValue == 2
            ? t('修改')
            : cellValue == 3
            ? t('删除')
            : cellValue == 4
            ? t('授权')
            : cellValue == 5
            ? t('导出')
            : cellValue == 6
            ? t('导入')
            : cellValue == 7
            ? t('强退')
            : cellValue == 8
            ? t('生成代码')
            : cellValue == 9
            ? t('清空数据')
            : ''
      )
    },
    form: {
      component: 'Select',
      componentProps: {
        style: {
          width: '100%'
        },
        options: [
          {
            label: '其他',
            value: 0
          },
          {
            label: '新增',
            value: 1
          },
          {
            label: '修改',
            value: 2
          },
          {
            label: '删除',
            value: 3
          },
          {
            label: '授权',
            value: 4
          },
          {
            label: '导出',
            value: 5
          },
          {
            label: '导入',
            value: 6
          },
          {
            label: '强退',
            value: 7
          },
          {
            label: '生成代码',
            value: 8
          },
          {
            label: '清空数据',
            value: 9
          }
        ]
      }
    },
    detail: {
      show: true
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
            label: '其他',
            value: '0'
          },
          {
            label: '新增',
            value: '1'
          },
          {
            label: '修改',
            value: '2'
          },
          {
            label: '删除',
            value: '3'
          },
          {
            label: '授权',
            value: '4'
          },
          {
            label: '导出',
            value: '5'
          },
          {
            label: '导入',
            value: '6'
          },
          {
            label: '强退',
            value: '7'
          },
          {
            label: '生成代码',
            value: '8'
          },
          {
            label: '清空数据',
            value: '9'
          }
        ]
      }
    }
  },
  {
    field: 'source',
    label: t('来源'),
    formatter: (_: Recordable, __: TableColumn, cellValue: number) => {
      return renderDict(cellValue, 'timeBankSource')
    },
    search: {
      show: true,
      colProps: {
        span: 12
      }
    }
  },
  {
    field: 'deptName',
    label: t('组织'),
    search: {
      show: true,
      colProps: {
        span: 12
      }
    }
  },
  {
    field: 'description',
    label: t('操作信息'),
    search: {
      show: true,
      colProps: {
        span: 12
      }
    }
  },
  {
    field: 'operatorUsername',
    label: t('操作人员'),
    search: {
      show: true,
      colProps: {
        span: 12
      }
    }
  },
  {
    field: 'ip',
    label: t('操作地址')
  },

  {
    field: 'location',
    label: t('操作地点')
  },
  {
    field: 'status',
    label: t('操作状态'),
    detail: {
      show: false
    },
    formatter: (_: Recordable, __: TableColumn, cellValue: number) => {
      return h(
        // ElTag,
        // {
        //   type: cellValue == 0 ? 'success' : cellValue == 1 ? 'warning' : 'danger'
        // },
        () => (cellValue == 0 ? t('成功') : cellValue == 1 ? t('失败') : t('tableDemo.commonly'))
      )
    },
    form: {
      component: 'Select',
      componentProps: {
        style: {
          width: '100%'
        },
        options: [
          {
            label: '失败',
            value: 1
          },
          {
            label: '成功',
            value: 0
          }
        ]
      }
    }
  },
  {
    field: 'time',
    label: t('操作日期'),
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
  },
  {
    field: 'costTime',
    label: t('消耗时间'),
    formatter: (_: Recordable, __: CrudSchema, cellValue: string) => {
      return h(() => (cellValue ? cellValue + '毫秒' : ''))
    },
    detail: {
      show: true
    },
    solt: true
  },
  {
    field: 'action',
    label: t('userDemo.action'),
    width: '100px',
    detail: {
      show: false
    },
    fixed: 'left'
  }
])
const { getList, setSearchParams } = methods
getList()
setSearchParams({
  'params%5BcreateTime%5D': [moment().format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')]
})
const detailForm = ref()
const { allSchemas } = useCrudSchemas(crudSchemas)
const dialogVisible = ref(false)
const details = (row: TableData) => {
  dialogTitle.value = t('exampleDemo.detail')
  detailForm.value = row
  // switch (detailForm.value['businessType']) {
  //   case 0:
  //     detailForm.value['businessType'] = '其他'
  //     break;
  //   case 1:
  //     detailForm.value['businessType'] = '新增'
  //     break;
  //   case 2:
  //     detailForm.value['businessType'] = '修改'
  //     break;
  //   case 3:
  //     detailForm.value['businessType'] = '删除'
  //     break;
  //   case 4:
  //     detailForm.value['businessType'] = '授权'
  //     break;
  //   case 5:
  //     detailForm.value['businessType'] = '导出'
  //     break;
  //   case 6:
  //     detailForm.value['businessType'] = '导入'
  //     break;
  //   case 7:
  //     detailForm.value['businessType'] = '强退'
  //     break;
  //   case 8:
  //     detailForm.value['businessType'] = '生成代码'
  //     break;
  //   case 9:
  //     detailForm.value['businessType'] = '清空数据'
  //     break;
  //   default:
  //     break;
  // }
  // detailForm.value['costTime'] = detailForm.value['costTime'] + '毫秒'
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
  delLoading.value = true
  await delList(multiple ? selections.map((v) => v.id) : [tableObject.currentRow?.id as string], multiple).finally(() => {
    delLoading.value = false
  })
}

const cleanLoading = ref(false)
const clean = async () => {
  cleanLoading.value = true
  await cleanTableListApi().finally(() => {
    cleanLoading.value = false
    getList()
  })
}

//导出
const exprotBtn = () => {
  proxy.download(
    'system/config/export',
    {
      ...tableObject.tableList
    },
    `config_${new Date().getTime()}.xlsx`
  )
}
const dictMap = ref([])

const filterDict = (key: any) => {
  return (dictMap.value.find((item: any) => item.type == key) as any)?.list
}

const renderDict = (key: any, dict: any) => {
  if (!key) {
    return
  }
  return filterDict(dict)
    ?.filter((item: any) => key == item.value)
    .map((item: any) => item?.label)
    .join('，')
}
</script>

<template>
  <el-card shadow="never" class="card">
    <template #header>
      <div class="card-header">
        <span class="title">操作日志</span>
      </div>
    </template>

    <Search :schema="allSchemas.searchSchema" @keyup="setSearchParams" @search="setSearchParams" @reset="setSearchParams" />

    <!-- <div class="mb-10px"> -->
    <!-- <ElButton type="danger" :icon="delicon" @click="delData(null, true)">
        {{ t('exampleDemo.del') }}
      </ElButton>
      <ElButton type="primary" :icon="refreshicon" @click="clean()">
        {{ t('清空') }}
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
      height="calc(100vh - 350px)"
    >
      <template #action="{ row }">
        <ElLink class="links" size="small" :disabled="getAuth('monitor:log:query')" type="primary" @click="details(row)">{{ t('详情') }} </ElLink>
      </template>
    </Table>
  </el-card>
  <Dialog v-model="dialogVisible" :title="dialogTitle">
    <Detail :detail-schema="allSchemas.detailSchema" :current-row="detailForm" />
  </Dialog>
</template>

<style lang="less" scoped>
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
