<script setup lang="ts">
// import { ContentWrap } from '@/components/ContentWrap'
import { useI18n } from '@/hooks/web/useI18n'
import { Table } from '@/components/Table'
// import { getUserListApi } from '@/api/login'
import { ref, reactive, unref } from 'vue'
import { ElMessage, ElLink, ElMessageBox } from 'element-plus'
// import { TableSlotDefault } from '@/types/table'
import { useIcon } from '@/hooks/web/useIcon'
import { Search } from '@/components/Search'
import { useTable } from '@/hooks/web/useTable'
import { TableData } from '@/api/table/types'
import Write from '../components/Write.vue'
import { Dialog } from '@/components/Dialog'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { listType, addType, updateType, refreshCache, delType, onOff } from '@/api/sys/Dictionary'
import { useRouter } from 'vue-router'
import { useValidator } from '@/hooks/web/useValidator'
import { getAuth } from '@/utils/export'
// @ts-ignore
defineOptions({
  // eslint-disable-next-line vue/component-definition-name-casing
  name: 'Dict'
})

// improt {getCurrentInstance} from 'vue'
const addicon = useIcon({ icon: 'material-symbols:add' })
const delicon = useIcon({ icon: 'material-symbols:delete-outline-sharp' })
const refreshicon = useIcon({ icon: 'material-symbols:import-contacts' })
// const expicon = useIcon({ icon: 'material-symbols:export-notes' })
// const editicon = useIcon({ icon: 'material-symbols:edit' })
// const { proxy } = getCurrentInstance() as any;
const { required } = useValidator()
// interface Params {
//   pageIndex?: number
//   pageSize?: number
// }
const { push } = useRouter()
const { t } = useI18n()
const { register, tableObject, methods } = useTable<TableData>({
  getListApi: listType,
  delListApi: delType,
  response: {
    list: 'list',
    total: 'total'
  }
})

const crudSchemas = reactive<CrudSchema[]>([
  {
    field: 'id',
    label: t('dictionary.index'),
    type: 'index',
    form: {
      show: false
    }
  },
  {
    field: 'name',
    label: t('dictionary.name'),
    form: {
      formItemProps: {
        rules: [required()]
      },
      colProps: {
        span: 24
      }
    },
    search: {
      show: true,
      colProps: {
        span: 12
      }
    }
  },
  {
    field: 'type',
    label: t('dictionary.type'),
    form: {
      formItemProps: {
        rules: [required()]
      },
      colProps: {
        span: 24
      }
    },
    search: {
      show: true,
      colProps: {
        span: 12
      }
    }
  },

  {
    field: 'status',
    label: t('dictionary.status'),
    slot: true,
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
            value: '0'
          },
          {
            label: '否',
            value: '1'
          }
        ]
      }
    },
    form: {
      component: 'Radio',
      show: true,
      value: '0', //默认选择
      componentProps: {
        options: [
          {
            label: '是',
            value: '0'
          },
          {
            label: '否',
            value: '1'
          }
        ]
      },
      colProps: {
        span: 24
      }
    }
  },
  // {
  //   field: 'remark',
  //   label: t('userDemo.remark'),
  //   form: {
  //     show: true
  //   }
  // },
  {
    field: 'createTime',
    label: t('userDemo.createTime'),
    form: {
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
        valueFormat: 'YYYY-MM-DD'
      }
    }
  },
  {
    field: 'remark',
    label: t('userDemo.remark'),
    show: false,
    form: {
      show: true,
      colProps: {
        span: 24
      }
    }
  },
  {
    field: 'action',
    label: t('userDemo.action'),
    width: '120px',
    form: {
      show: false
    },
    fixed: 'left'
  }
])
const { getList, setSearchParams } = methods
getList()
const loading = ref(false)
const { allSchemas } = useCrudSchemas(crudSchemas)
// let tableDataList = ref<UserType[]>([])
// const getTableList = async (params?: Params) => {
//   const res = await listType, ({
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
  const validate = await write?.elFormRef?.validate()?.catch(() => {})
  if (validate) {
    loading.value = true
    const data = (await write?.getFormData()) as TableData
    const res =
      dialogTitle.value == '编辑'
        ? await updateType(data)
        : await addType(data)
            .catch(() => {})
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
  await delList(multiple ? selections.map((v) => v.id) : [tableObject.currentRow?.id as string], multiple).finally(() => {
    delLoading.value = false
  })
}

//刷新缓存
const handleRefreshCache = async () => {
  refreshCache().then(() => {
    ElMessage.success('刷新缓存成功')
  })
}

//导出
// const exprotBtn = () => {
//   proxy.download(
//     'system/config/export',
//     {
//       ...tableObject.tableList,
//     },
//     `config_${new Date().getTime()}.xlsx`
//   );
// }
//类型按钮
const typeBtn = (row) => {
  // push(`/system/data?id=${row.id}`)
  push({ path: '/system/data', query: { id: row.id } })
}

// 切换状态
function getStatus(val) {
  let data = { id: val.id, status: val.status }
  if (val.status == 0) {
    ElMessageBox.confirm('是否开启状态?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消'
    })
      .then(() => {
        onOff(data).then((response) => {
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
  } else {
    ElMessageBox.confirm('是否关闭状态?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消'
    })
      .then(() => {
        onOff(data).then((response) => {
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
}
</script>

<template>
  <el-card shadow="never" class="card">
    <template #header>
      <div class="card-header">
        <span class="title">字典管理</span>
      </div>
    </template>

    <Search :schema="allSchemas.searchSchema" @search="setSearchParams" @reset="setSearchParams" />

    <div class="mb-10px">
      <el-button type="primary" :disabled="getAuth('system:dict:add')" :icon="addicon" @click="AddAction">
        {{ t('exampleDemo.add') }}
      </el-button>
      <el-button :disabled="getAuth('system:dict:remove')" :icon="delicon" plain @click="delData(null, true)">
        {{ t('exampleDemo.del') }}
      </el-button>
      <!-- <el-button type="primary" :icon="expicon" @click="exprotBtn">
        {{ t('导出') }}
      </el-button> -->
      <el-button :icon="refreshicon" @click="handleRefreshCache" plain>
        {{ t('刷新缓存') }}
      </el-button>
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
      border
      height="calc(100vh - 345px)"
    >
      <template #status="{ row }">
        <el-switch v-model="row.status" active-value="0" inactive-value="1" @change="getStatus(row)" />
      </template>
      <template #action="{ row }">
        <ElLink size="small" class="links" type="primary" @click="action(row, 'edit')" :disabled="getAuth('system:dict:edit')">
          {{ t('编辑') }}
        </ElLink>
        <ElLink size="small" class="links" type="primary" @click="delData(row, false)" :disabled="getAuth('system:dict:remove')">
          {{ t('删除') }}
        </ElLink>
      </template>
      <template #type="{ row }">
        <el-link :underline="false" :disabled="getAuth('system:dict:allocation')" class="links" type="primary" @click="typeBtn(row)">
          {{ row.type }}
        </el-link>
      </template>
    </Table>
  </el-card>
  <Dialog v-model="dialogVisible" :title="dialogTitle" style="width: 500px">
    <Write ref="writeRef" :form-schema="allSchemas.formSchema" :current-row="tableObject.currentRow" />
    <template #footer>
      <el-button v-if="actionType !== 'detail'" type="primary" @click="save">
        {{ t('exampleDemo.save') }}
      </el-button>
      <el-button @click="dialogVisible = false" plain>{{ t('dialogDemo.close') }}</el-button>
    </template>
  </Dialog>
</template>
<style scoped>
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

.el-link:hover {
  color: var(--el-color-primary);
}

/* .el-link.is-disabled:hover {
  color: #ccc;
} */
:deep(.el-input__wrapper) {
  min-width: 150px !important;
}
:deep(.el-select__wrapper) {
  min-width: 150px !important;
}
</style>
