<script setup lang="ts">
import { ContentWrap } from '@/components/ContentWrap'
import { useI18n } from '@/hooks/web/useI18n'
import { Table } from '@/components/Table'
// import { getUserListApi } from '@/api/login'
import { ref, reactive, h, unref, getCurrentInstance } from 'vue'
import { ElButton, ElTag, ElMessage } from 'element-plus'
// import { TableSlotDefault } from '@/types/table'
import { useIcon } from '@/hooks/web/useIcon'
import { Search } from '@/components/Search'
import { useTable } from '@/hooks/web/useTable'
import { TableData } from '@/api/table/types'
import Write from '../components/Write.vue'
import { Dialog } from '@/components/Dialog'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { getConfigListApi, addConfigApi, editConfigApi, refreshCache, delTableListApi } from '@/api/sys/parameters'
import { getAuth } from '@/utils/export'
// improt {getCurrentInstance} from 'vue'
const addicon = useIcon({ icon: 'material-symbols:add' })
const delicon = useIcon({ icon: 'material-symbols:delete-outline-sharp' })
const refreshicon = useIcon({ icon: 'material-symbols:import-contacts' })
const expicon = useIcon({ icon: 'material-symbols:export-notes' })
const editicon = useIcon({ icon: 'material-symbols:edit' })
const { proxy } = getCurrentInstance() as any;
// interface Params {
//   pageIndex?: number
//   pageSize?: number
// }

const { t } = useI18n()
const { register, tableObject, methods } = useTable<TableData>({
  getListApi: getConfigListApi,
  delListApi: delTableListApi,
  response: {
    list: 'list',
    total: 'total'
  }
})

const crudSchemas = reactive<CrudSchema[]>([
  {
    field: 'id',
    label: t('参数主键'),
  },
  {
    field: 'name',
    label: t('参数名称'),
    search: {
      show: true,
      colProps: {
        span: 12
      },
    }
  },
  {
    field: 'code',
    label: t('参数键名'),
    search: {
      show: true,
      colProps: {
        span: 12
      },
    }
  },
  {
    field: 'value',
    label: t('参数键值')
  },
  {
    field: 'type',
    label: t('系统内置'),
    formatter: (_: Recordable, __: CrudSchema, cellValue: string) => {
      return h(
        ElTag,
        {
          type: cellValue === 'Y' ? 'success' : 'danger'
        },
        () =>
          cellValue == 'Y'
            ? t('是')
            : t('否')
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
            label: '是',
            value: 'Y'
          },
          {
            label: '否',
            value: 'N'
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
            label: '是',
            value: 'Y'
          },
          {
            label: '否',
            value: 'N'
          }
        ]
      }
    },
  },
  {
    field: 'remark',
    label: t('userDemo.remark'),
    form: {
      show: true
    }
  },
  {
    field: 'createTime',
    label: t('userDemo.createTime'),
    form: {
      show: false
    },
    search: {
      show: true,
      field: 'params%5BcreateTime%5D',
      colProps: {
        span: 12,

      },
      component: 'DatePicker',
      componentProps: {
        type: 'daterange',
        valueFormat: 'YYYY-MM-DD HH:mm:ss'
      }
    },
  },
  {
    field: 'action',
    label: t('userDemo.action'),
    form: {
      show: false
    }
  }
])
const { getList, setSearchParams } = methods

getList()
const loading = ref(false)
const { allSchemas } = useCrudSchemas(crudSchemas)
// let tableDataList = ref<UserType[]>([])

// const getTableList = async (params?: Params) => {
//   const res = await getConfigListApi({
//     params: params || {
//       pageIndex: 1,
//       pageSize: 10
//     }
//   })
//   // .catch(() => {})
//   // .finally(() => {
//   //   loading.value = false
//   // })
//   if (res) {
//     tableDataList.value = res.data.list
//     loading.value = false
//   }
// }

// getTableList()

// const actionFn = (data: TableSlotDefault) => {
// }
//保存
const dialogVisible = ref(false)
const actionType = ref('')
const action = (row: TableData, type: string) => {
  actionType.value = type
  dialogTitle.value = t('exampleDemo.edit')
  tableObject.currentRow = row
  dialogVisible.value = true
}
const writeRef = ref<ComponentRef<typeof Write>>()
const dialogTitle = ref('')
const AddAction = () => {
  dialogTitle.value = t('exampleDemo.add')
  tableObject.currentRow = null
  dialogVisible.value = true
  actionType.value = ''
}
const save = async () => {
  const write = unref(writeRef)
  const validate = await write?.elFormRef?.validate()?.catch(() => { })
  if (validate) {
    loading.value = true
    const data = (await write?.getFormData()) as TableData
    const res = dialogTitle.value == '编辑' ? await editConfigApi(data) : await addConfigApi(data)
      .catch(() => { })
      .finally(() => {
        loading.value = false
      })
    if (res) {
      ElMessage.success('操作成功')
      dialogVisible.value = false
      tableObject.currentPage = 1
      getList()
    }
  }
}
//删除
const delLoading = ref(false)
const delData = async (row: TableData | null, multiple: boolean) => {
  tableObject.currentRow = row
  const { delList, getSelections } = methods
  const selections = await getSelections()
  delLoading.value = true
  await delList(
    multiple ? selections.map((v) => v.id) : [tableObject.currentRow?.id as string],
    multiple
  ).finally(() => {
    delLoading.value = false
  })
}

//刷新缓存
const handleRefreshCache = async () => {
  refreshCache().then(() => {
    ElMessage.success('刷新缓存成功')
  });
}

//导出
const exprotBtn = () => {
  proxy.download(
    'system/config/export',
    {
      ...tableObject.tableList,
    },
    `config_${new Date().getTime()}.xlsx`
  );
}
</script>

<template >
  <!-- <ContentWrap :title="t('参数管理')"> -->
  <Search :schema="allSchemas.searchSchema" @keyup="setSearchParams" @search="setSearchParams" @reset="setSearchParams" />

  <div class="mb-10px">
    <ElButton type="primary" v-hasPermi="['system:config:add']" :icon="addicon" @click="AddAction">
      {{ t('exampleDemo.add') }}
    </ElButton>
    <ElButton type="danger" v-hasPermi="['system:config:remove']" :icon="delicon" @click="delData(null, true)">
      {{ t('exampleDemo.del') }}
    </ElButton>
    <!-- <ElButton type="primary" :icon="expicon" @click="exprotBtn">
        {{ t('导出') }}
      </ElButton> -->
    <!-- <ElButton type="primary" :icon="refreshicon" @click="handleRefreshCache">
        {{ t('刷新缓存') }}
      </ElButton> -->
  </div>
  <Table v-model:pageSize="tableObject.pageSize" v-model:currentPage="tableObject.currentPage"
    :columns="allSchemas.tableColumns" :data="tableObject.tableList" :loading="tableObject.loading" :pagination="{
      total: tableObject.total
    }" @register="register">
    <template #action="{ row }">
      <ElButton size="small" :icon="editicon" v-hasPermi="['system:config:edit']" type="primary"
        @click="action(row, 'edit')" />

      <ElButton size="small" :icon="delicon" type="danger" v-hasPermi="['system:config:remove']"
        @click="delData(row, false)" />

    </template>
  </Table>
  <!-- </ContentWrap> -->
  <Dialog v-model="dialogVisible" :title="dialogTitle">
    <Write ref="writeRef" :form-schema="allSchemas.formSchema" :current-row="tableObject.currentRow" />
    <template #footer>
      <ElButton v-if="actionType !== 'detail'" type="primary" @click="save">
        {{ t('exampleDemo.save') }}
      </ElButton>
      <ElButton @click="dialogVisible = false">{{ t('dialogDemo.close') }}</ElButton>
    </template>
  </Dialog>
</template>
