<script setup lang="ts">
import { ContentWrap } from '@/components/ContentWrap'
import { Search } from '@/components/Search'
import { Dialog } from '@/components/Dialog'
import { useI18n } from '@/hooks/web/useI18n'
import { createImageViewer } from '@/components/ImageViewer'
import { ElButton, ElUpload, ElMessage, ElInput } from 'element-plus'
import { Table } from '@/components/Table'
import { getTableListApi, saveTableApi, delTableListApi } from '@/api/table'
import type { UploadProps, UploadUserFile } from 'element-plus'
import { useTable } from '@/hooks/web/useTable'
import { TableData } from '@/api/table/types'
import { h, ref, unref, reactive } from 'vue'
import Write from './components/Write.vue'
import Detail from './components/Detail.vue'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { TableColumn } from '@/types/table'

const { register, tableObject, methods } = useTable<TableData>({
  getListApi: getTableListApi,
  delListApi: delTableListApi,
  response: {
    list: 'list',
    total: 'total'
  },
  defaultParams: {
    title: 's'
  }
})

const { getList, setSearchParams } = methods

const fileList = ref<UploadUserFile[]>([
  {
    name: 'element-plus-logo.svg',
    url: 'https://element-plus.org/images/element-plus-logo.svg'
  },
  {
    name: 'element-plus-logo2.svg',
    url: 'https://element-plus.org/images/element-plus-logo.svg'
  }
])

const handleRemove: UploadProps['onRemove'] = (file, uploadFiles) => {}

const inputtext = ref('1')

const handlePreview: UploadProps['onPreview'] = (uploadFile) => {}

const handleExceed: UploadProps['onExceed'] = (files, uploadFiles) => {
  ElMessage.error(`The limit is 3, you selected ${files.length} files this time, add up to ${files.length + uploadFiles.length} totally`)
}

// const beforeRemove: UploadProps['beforeRemove'] = (uploadFile) => {
//   return ElMessageBox.confirm(
//     `Cancel the transfer of ${uploadFile.name} ?`
//   ).then(
//     () => true,
//     () => false
//   )
// }

getList()

const { t } = useI18n()

let crudSchemas = reactive<CrudSchema[]>([
  {
    field: 'index',
    label: t('tableDemo.index'),
    type: 'index',
    search: {
      show: true
    },
    table: {
      show: false
    },
    form: {
      show: true,
      component: 'Input'
    },
    detail: {
      show: false
    },
    sortable: true
  },
  {
    field: 'upload',
    label: t('tableDemo.images'),
    form: {
      show: true,
      componentProps: {
        component: 'Upload',
        slots: {
          default: true
        }
      }
    },
    detail: {
      show: false
    }
  },
  {
    field: 'title',
    label: t('tableDemo.title'),
    search: {
      show: true
    },
    detail: {
      span: 20
    }
  },
  {
    field: 'field6',
    component: 'TimeSelect',
    search: {
      show: true
    },
    label: t('formDemo.timeSelect')
  },
  {
    field: 'author',
    label: t('tableDemo.author'),
    sortable: true,
    search: {
      show: true
    }
  },
  {
    field: 'display_time',
    label: t('tableDemo.displayTime'),
    form: {
      component: 'DatePicker',
      componentProps: {
        type: 'datatime',
        valueFormat: 'YYYY-MM-DD HH:mm:ss'
      }
    },
    search: {
      show: true
    },
    sortable: true
  },
  {
    field: 'importance',
    label: t('tableDemo.importance'),
    formatter: (_: Recordable, __: TableColumn, cellValue: number) => {
      return h(
        ElInput,
        {
          value: ''
        },
        () => (cellValue === 1 ? t('tableDemo.important') : cellValue === 2 ? t('tableDemo.good') : t('tableDemo.commonly'))
      )
    },
    form: {
      component: 'Autocomplete',
      componentProps: {
        style: {
          width: '100%'
        },
        options: [
          {
            label: '重要',
            value: 3
          },
          {
            label: '良好',
            value: 2
          },
          {
            label: '一般',
            value: 1
          }
        ]
      }
    }
  },
  {
    field: 'pageviews',
    label: t('tableDemo.pageviews'),
    search: {
      show: true
    },
    form: {
      component: 'InputNumber',
      value: 0
    }
  },
  {
    field: 'content',
    label: t('exampleDemo.content'),
    table: {
      show: false
    },
    form: {
      component: 'Editor',
      colProps: {
        span: 20
      }
    },
    detail: {
      span: 24
    }
  },
  {
    field: 'action',
    width: '260px',
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
const dialogVisible = ref(false)

const dialogTitle = ref('')

const AddAction = () => {
  dialogTitle.value = t('exampleDemo.add')
  tableObject.currentRow = null
  dialogVisible.value = true
  actionType.value = ''
}

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

const actionType = ref('')
const open = () => {
  createImageViewer({
    urlList: [
      'http://192.168.18.107:4000/src/assets/aimg/logo.png',
      'http://192.168.18.107:4000/src/assets/aimg/logo.png',
      'http://192.168.18.107:4000/src/assets/aimg/logo.png',
      'http://192.168.18.107:4000/src/assets/aimg/logo.png',
      'http://192.168.18.107:4000/src/assets/aimg/logo.png',
      'http://192.168.18.107:4000/src/assets/aimg/logo.png'
    ]
  })
  dialogVisible.value = false
}
const action = (row: TableData, type: string) => {
  dialogTitle.value = t(type === 'edit' ? 'exampleDemo.edit' : 'exampleDemo.detail')
  actionType.value = type
  tableObject.currentRow = row
  dialogVisible.value = true
}

const writeRef = ref<ComponentRef<typeof Write>>()
const buttomPosition = ref('right')
const loading = ref(false)
const layout = ref('inline')
const save = async () => {
  const write = unref(writeRef)
  await write?.elFormRef?.validate(async (isValid) => {
    if (isValid) {
      loading.value = true
      const data = (await write?.getFormData()) as TableData
      const res = await saveTableApi(data)
        .catch(() => {})
        .finally(() => {
          loading.value = false
        })
      if (res) {
        dialogVisible.value = false
        tableObject.currentPage = 1
        getList()
      }
    }
  })
}
</script>

<template>
  <ContentWrap>
    <Search
      :model="{ title: 's' }"
      :schema="allSchemas.searchSchema"
      @search="setSearchParams"
      @reset="setSearchParams"
      :layout="layout"
      :buttom-position="buttomPosition"
      expand
      expand-field="field6"
    />
    <div class="mb-10px">
      <ElButton type="primary" @click="AddAction">{{ t('exampleDemo.add') }}</ElButton>
      <ElButton :loading="delLoading" type="danger" @click="delData(null, true)">
        {{ t('exampleDemo.del') }}
      </ElButton>
    </div>
    <Table
      v-model:pageSize="tableObject.pageSize"
      v-model:currentPage="tableObject.currentPage"
      :columns="allSchemas.tableColumns"
      :data="tableObject.tableList"
      :loading="tableObject.loading"
      :defaultSort="{ prop: 'display_time', order: 'descending' }"
      :pagination="{
        total: tableObject.total
      }"
      @register="register"
    >
      <template #pageviews>
        <ElInput v-model="inputtext">
          {{ t('exampleDemo.edit') }}
        </ElInput>
      </template>
      <template #action="{ row }">
        <ElButton type="primary" v-hasPermi="['example:dialog:edit']" @click="action(row, 'edit')">
          {{ t('exampleDemo.edit') }}
        </ElButton>
        <ElButton type="success" v-hasPermi="['example:dialog:view']" @click="action(row, 'detail')">
          {{ t('exampleDemo.detail') }}
        </ElButton>
        <ElButton type="danger" v-hasPermi="['example:dialog:delete']" @click="delData(row, false)">
          {{ t('exampleDemo.del') }}
        </ElButton>
      </template>
    </Table>
  </ContentWrap>

  <Dialog v-model="dialogVisible" :title="dialogTitle">
    <Write v-if="actionType !== 'detail'" ref="writeRef" :form-schema="allSchemas.formSchema" :current-row="tableObject.currentRow" />
    <ElUpload
      class="upload-demo"
      action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
      v-model:file-list="fileList"
      :on-preview="handlePreview"
      :on-remove="handleRemove"
      :limit="3"
      :on-exceed="handleExceed"
    >
      {{ t('exampleDemo.upload') }}
    </ElUpload>
    <ElButton type="primary" @click="open">预览</ElButton>
    <Detail v-if="actionType === 'detail'" :detail-schema="allSchemas.detailSchema" :current-row="tableObject.currentRow" />
    <template #footer>
      <ElButton v-if="actionType !== 'detail'" type="primary" :loading="loading" @click="save">
        {{ t('exampleDemo.save') }}
      </ElButton>
      <ElButton @click="dialogVisible = false">{{ t('dialogDemo.close') }}</ElButton>
    </template>
  </Dialog>
</template>
