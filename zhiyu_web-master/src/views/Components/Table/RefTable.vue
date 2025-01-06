<script setup lang="ts">
import { ContentWrap } from '@/components/ContentWrap'
import { useI18n } from '@/hooks/web/useI18n'
import { Table, TableExpose } from '@/components/Table'
import { getTableListApi } from '@/api/table'
import { TableData } from '@/api/table/types'
import { ref, h, reactive, unref } from 'vue'
import { ElTag, ElButton, ElTree, ElSteps } from 'element-plus'
import { useTable } from '@/hooks/web/useTable'
import { Pagination, TableColumn, TableSlotDefault } from '@/types/table'
// import {
//   Document,
//   Menu as IconMenu,
//   Location,
//   Setting,
// } from '@element-plus/icons-vue'

const { t } = useI18n()
const columns = reactive<TableColumn[]>([
  {
    field: 'index',
    label: t('tableDemo.index'),
    type: 'index'
  },
  {
    field: 'content',
    label: t('tableDemo.header'),
    children: [
      {
        field: 'title',
        label: t('tableDemo.title')
      },
      {
        field: 'author',
        label: t('tableDemo.author')
      },
      {
        field: 'author',
        label: t('tableDemo.images')
      },
      {
        field: 'display_time',
        label: t('tableDemo.displayTime')
      },
      {
        field: 'importance',
        label: t('tableDemo.importance'),
        formatter: (_: Recordable, __: TableColumn, cellValue: number) => {
          return h(
            ElTag,
            {
              type: cellValue === 1 ? 'success' : cellValue === 2 ? 'warning' : 'danger'
            },
            () => (cellValue === 1 ? t('tableDemo.important') : cellValue === 2 ? t('tableDemo.good') : t('tableDemo.commonly'))
          )
        }
      },
      {
        field: 'pageviews',
        label: t('tableDemo.pageviews'),
        table: {
          span: '24'
        }
      }
    ]
  },
  {
    field: 'action',
    label: t('tableDemo.action')
  }
])

const { register, tableObject, methods } = useTable<TableData>({
  getListApi: getTableListApi,
  response: {
    list: 'list',
    total: 'total'
  },
  props: {
    columns
  }
})

const { getList } = methods

getList()

const tableRef = ref<TableExpose>()

const actionFn = (data: TableSlotDefault) => {}

const paginationObj = ref<Pagination>()

const showPagination = (show: boolean) => {
  if (show) {
    paginationObj.value = {
      total: tableObject.total
    }
  } else {
    paginationObj.value = undefined
  }
}

const reserveIndex = (custom: boolean) => {
  unref(tableRef)?.setProps({
    reserveIndex: custom
  })
}
interface Tree {
  label: string
  children?: Tree[]
}
const showSelections = (show: boolean) => {
  unref(tableRef)?.setProps({
    selection: show
  })
}
const treedata: Tree[] = [
  {
    label: 'Level one 1',
    children: [
      {
        label: 'Level two 1-1',
        children: [
          {
            label: 'Level three 1-1-1'
          }
        ]
      }
    ]
  },
  {
    label: 'Level one 2',
    children: [
      {
        label: 'Level two 2-1',
        children: [
          {
            label: 'Level three 2-1-1'
          }
        ]
      },
      {
        label: 'Level two 2-2',
        children: [
          {
            label: 'Level three 2-2-1'
          }
        ]
      }
    ]
  },
  {
    label: 'Level one 3',
    children: [
      {
        label: 'Level two 3-1',
        children: [
          {
            label: 'Level three 3-1-1'
          }
        ]
      },
      {
        label: 'Level two 3-2',
        children: [
          {
            label: 'Level three 3-2-1'
          }
        ]
      }
    ]
  }
]
const index = ref(1)
const handleNodeClick = (data: Tree) => {}
const changeTitle = () => {
  unref(tableRef)?.setColumn([
    {
      field: 'title',
      path: 'label',
      value: `${t('tableDemo.title')}${unref(index)}`
    }
  ])
  index.value++
}
const showExpandedRows = (show: boolean) => {
  unref(tableRef)?.setProps({
    expand: show
  })
}

const selectAllNone = () => {
  unref(tableRef)?.elTableRef?.toggleAllSelection()
}
const defaultProps = {
  children: 'children',
  label: 'label'
}
// const active = ref(0)

// const next = () => {
//   if (active.value++ > 2) active.value = 0
// }
</script>

<template>
  <ContentWrap :title="`RefTable ${t('tableDemo.operate')}`">
    <ElButton @click="showPagination(true)"> {{ t('tableDemo.show') }} {{ t('tableDemo.pagination') }} </ElButton>
    <ElButton @click="showPagination(false)"> {{ t('tableDemo.hidden') }} {{ t('tableDemo.pagination') }} </ElButton>

    <ElButton @click="reserveIndex(true)">{{ t('tableDemo.reserveIndex') }}</ElButton>
    <ElButton @click="reserveIndex(false)">{{ t('tableDemo.restoreIndex') }}</ElButton>

    <ElButton @click="showSelections(true)">{{ t('tableDemo.showSelections') }}</ElButton>
    <ElButton @click="showSelections(false)">{{ t('tableDemo.hiddenSelections') }}</ElButton>

    <ElButton @click="changeTitle">{{ t('tableDemo.changeTitle') }}</ElButton>

    <ElButton @click="showExpandedRows(true)">{{ t('tableDemo.showExpandedRows') }}</ElButton>
    <ElButton @click="showExpandedRows(false)">{{ t('tableDemo.hiddenExpandedRows') }}</ElButton>

    <ElButton @click="selectAllNone">{{ t('tableDemo.selectAllNone') }}</ElButton>
  </ContentWrap>
  <ContentWrap :title="`RefTable ${t('tableDemo.example')}`">
    <Table
      ref="tableRef"
      v-model:pageSize="tableObject.pageSize"
      v-model:currentPage="tableObject.currentPage"
      :data="tableObject.tableList"
      :loading="tableObject.loading"
      :pagination="paginationObj"
      @register="register"
    >
      <template #action="data">
        <ElButton type="primary" @click="actionFn(data as TableSlotDefault)">
          {{ t('tableDemo.action') }}
        </ElButton>
      </template>
      <template #pageviews>
        <el-tree :data="treedata" :props="defaultProps" @node-click="handleNodeClick" />
      </template>
      <template #expand="data">
        <div class="ml-30px">
          <div>{{ t('tableDemo.title') }}：{{ data.row.title }}</div>
          <div>{{ t('tableDemo.author') }}：{{ data.row.author }}</div>
          <div>{{ t('tableDemo.displayTime') }}：{{ data.row.display_time }}</div>
        </div>
      </template>
    </Table>
    <!--   <el-steps :active="active" finish-status="success">
        <el-step title="计划服务时间" description="2023-03-10 10:00"  />
        <el-step title="开始服务"  description="2023-03-10 10:00"  />
        <el-step title="完成服务" description="2023-03-10 10:00"  />
        <el-step title="服务审核通过" description="2023-03-10 10:00"   />

      </el-steps>
  
     <el-button style="margin-top: 12px" @click="next">Next step</el-button> -->
  </ContentWrap>
</template>
