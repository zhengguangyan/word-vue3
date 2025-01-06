<script setup lang="ts">
import { ContentWrap } from '@/components/ContentWrap'
import { useI18n } from '@/hooks/web/useI18n'
import { Table } from '@/components/Table'
// import { getUserListApi } from '@/api/login'
import { ref, reactive, h, unref, getCurrentInstance } from 'vue'
import { ElTag, ElMessage, ElLink, ElInput, ElSwitch, ElMessageBox } from 'element-plus'
// import { TableSlotDefault } from '@/types/table'
import { useIcon } from '@/hooks/web/useIcon'
import { Search } from '@/components/Search'
import { useTable } from '@/hooks/web/useTable'
import { TableData } from '@/api/table/types'
import Write from '../components/Write.vue'
import { Dialog } from '@/components/Dialog'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { getLogListApi, delPost, addPost, updatePost, onOff } from '@/api/sys/post'
import { useValidator } from '@/hooks/web/useValidator'
import { Edit, Delete } from '@element-plus/icons-vue'
// improt {getCurrentInstance} from 'vue'
const addicon = useIcon({ icon: 'material-symbols:add' })
const delicon = useIcon({ icon: 'material-symbols:delete-outline-sharp' })
const expicon = useIcon({ icon: 'material-symbols:export-notes' })
const editicon = useIcon({ icon: 'material-symbols:edit' })
const { proxy } = getCurrentInstance() as any
import { getAuth } from '@/utils/export'
const { required } = useValidator()
const open = ref(false)
// interface Params {
//   pageIndex?: number
//   pageSize?: number
// }

const { t } = useI18n()
const { register, tableObject, methods } = useTable<TableData>({
  getListApi: getLogListApi,
  delListApi: delPost,
  response: {
    list: 'list',
    total: 'total'
  }
})

const crudSchemas = reactive<CrudSchema[]>([
  {
    field: 'code',
    label: t('岗位编码'),
    form: {
      show: true,
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
    field: 'name',
    label: t('岗位名称'),
    form: {
      show: true,
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
    field: 'sort',
    label: t('岗位排序'),
    form: {
      show: true,
      formItemProps: {
        rules: [required()]
      },
      component: 'InputNumber',
      value: '0',
      componentProps: {
        type: 'daterange',
        min: '0'
      },
      colProps: {
        span: 24
      }
    }
  },
  {
    field: 'status',
    label: t('岗位状态'),
    slot: true,
    search: {
      show: true,
      colProps: {
        span: 24
      },
      component: 'Select',
      componentProps: {
        options: [
          {
            label: '正常',
            value: '0'
          },
          {
            label: '停用',
            value: '1'
          }
        ]
      }
    },
    form: {
      component: 'Radio',
      show: true,
      formItemProps: {
        rules: [required()]
      },
      componentProps: {
        options: [
          {
            label: '正常',
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
    field: 'remark',
    label: t('userDemo.remark'),
    form: {
      show: true,
      colProps: {
        span: 24
      }
    },
    table: {
      show: true,
      colProps: {
        span: 12
      }
    }
  },
  {
    field: 'createTime',
    label: t('userDemo.createTime'),
    form: {
      show: false
    },
    search: {
      field: 'params%5BcreateTime%5D',
      show: false,
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
    field: 'action',
    label: t('userDemo.action'),
    width: '200px',
    form: {
      show: false
    },
    fixed: 'left'
  }
])

let lookData = {
  code: '',
  name: '',
  sort: '',
  status: '',
  remark: '',
  creatorName: '',
  createTime: '',
  updaterName: '',
  updateTime: ''
}

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

// 切换状态
function changeStatus(val) {
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
        ? await updatePost(data)
        : await addPost(data)
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

//查看
function look(row) {
  lookData = row
  open.value = true
}

// 取消按钮
function cancel() {
  open.value = false
}
</script>

<template>
  <el-card shadow="never" class="card">
    <template #header>
      <div class="card-header">
        <span class="title">岗位管理</span>
      </div>
    </template>

    <Search :schema="allSchemas.searchSchema" @keyup="setSearchParams" @search="setSearchParams" @reset="setSearchParams" />

    <div class="mb-12px">
      <el-button type="primary" :icon="addicon" :disabled="getAuth('system:post:add')" @click="AddAction">
        {{ t('exampleDemo.add') }}
      </el-button>
      <el-button :icon="delicon" :disabled="getAuth('system:post:remove')" plain @click="delData(null, true)">
        {{ t('exampleDemo.del') }}
      </el-button>
      <!-- <ElButton type="primary" :icon="expicon" @click="exprotBtn">
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
      border
      height="calc(100vh - 348px)"
    >
      <template #status="{ row }">
        <el-switch v-model="row.status" active-value="0" inactive-value="1" @change="changeStatus(row)" />
      </template>
      <template #action="{ row }">
        <ElLink class="links" size="small" type="primary" @click="look(row)" :disabled="getAuth('system:post:query')"> 查看 </ElLink>
        <ElLink class="links" :disabled="getAuth('system:post:edit')" size="small" type="primary" @click="action(row, 'edit')"> 编辑 </ElLink>

        <ElLink class="links" :disabled="getAuth('system:post:remove')" size="small" type="primary" @click="delData(row, false)"> 删除 </ElLink>
      </template>
    </Table>
  </el-card>
  <Dialog v-model="dialogVisible" :title="dialogTitle" class="log" style="width: 560px">
    <Write ref="writeRef" :form-schema="allSchemas.formSchema" :current-row="tableObject.currentRow" />
    <template #footer>
      <div>
        <el-button v-if="actionType !== 'detail'" type="primary" @click="save">
          {{ t('exampleDemo.save') }}
        </el-button>

        <el-button @click="dialogVisible = false" plain>{{ t('dialogDemo.close') }}</el-button>
      </div>
    </template>
  </Dialog>

  <el-dialog v-model="open" title="查看详情" :close-on-click-modal="false" width="30%">
    <el-form label-width="100px" :model="lookData" style="max-width: 300px">
      <el-form-item label="岗位代码">
        <span>{{ lookData.code || '' }}</span>
      </el-form-item>
      <el-form-item label="岗位名称">
        <span>{{ lookData.name || '' }}</span>
      </el-form-item>
      <el-form-item label="岗位排序">
        <span v-text="lookData.sort"></span>
      </el-form-item>
      <el-form-item label="岗位状态">
        <span>{{ lookData.status == '0' ? '正常' : '停用' || '' }}</span>
      </el-form-item>
      <el-form-item label="创建者">
        <span>{{ lookData.creatorName || '' }}</span>
      </el-form-item>
      <el-form-item label="创建时间">
        <span>{{ lookData.createTime || '' }}</span>
      </el-form-item>
      <el-form-item label="更新者">
        <span>{{ lookData.updaterName || '' }}</span>
      </el-form-item>
      <el-form-item label="更新时间">
        <span>{{ lookData.updateTime || '' }}</span>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="cancel">关闭</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style lang="less" scoped>
::v-deep(.el-dialog__footer) {
  border-top: 1px solid var(--tags-view-border-color);
}

body {
  background-color: #fff;
}

.links {
  margin-right: 15px;
  text-decoration: underline;
}

.el-dialog__body {
  height: 370px !important;
}

.el-link.el-link--primary {
  --el-link-disabled-text-color: #cccccc;
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
