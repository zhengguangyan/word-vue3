<template>
  <div>
    <el-card shadow="never" class="card">
      <template #header>
        <div class="card-header">
          <span class="title">服务类别管理</span>
        </div>
      </template>
      <div class="query-form">
        <el-space wrap :size="12">
          <el-button :disabled="!leafAreaFlag || getAuth('serviceProject:type:add')" type="primary" @click="add()"> 新增 </el-button>
        </el-space>
      </div>

      <el-table
        :data="listData"
        ref="tableRef"
        row-key="id"
        default-expand-all
        header-row-class-name="table-header"
        v-loading="loading"
        class-name="table-without-border list-page-table"
        height="calc(100vh - 260px)"
      >
        <el-table-column label="操作" width="160" fixed="left" type="" class-name="table-operation">
          <template #default="{ row }">
            <el-button :disabled="!leafAreaFlag || getAuth('serviceProject:type:detail')" link type="primary" @click="detail(row)"> 查看 </el-button>
            <el-button :disabled="!leafAreaFlag || getAuth('serviceProject:type:edit')" link type="primary" @click="edit(row)"> 编辑 </el-button>
            <el-button :disabled="!leafAreaFlag || getAuth('serviceProject:type:delete')" link type="primary" @click="checkDel(row.id)"> 删除 </el-button>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="name" label="服务类别名称" />
        <el-table-column show-overflow-tooltip prop="sort" label="排序码" />
        <el-table-column show-overflow-tooltip prop="code" label="标识码" />
      </el-table>
    </el-card>
  </div>
  <TypeFormDialog ref="formRef" @reload-list="getTree" />
  <TypeDetailDialog ref="deFormRef" @reload-list="getTree" />
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getAuth } from '@/utils/export'
import TypeFormDialog from './components/type-form-dialog/index.vue'
import TypeDetailDialog from './components/type-detail-dialog/index.vue'
import { deleteServeType, getServeTypeTree, verifyDeleteServeType } from '@/api/serviceProvider'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useCache } from '@/hooks/web/useCache'
const { wsCache } = useCache()
const leafAreaFlag = ref(wsCache.get('leafAreaFlag'))

const formRef = ref()
const deFormRef = ref()

const add = (data?: any) => {
  formRef.value.show()
  if (data) {
    formRef.value.setDefault(data)
  }
}

function edit(row) {
  formRef.value.show(row)
}

function detail(row) {
  deFormRef.value.show(row)
}

const del = async (ids) => {
  const res: any = await deleteServeType(ids)
  if (res.code === 200) {
    ElMessage.success('操作成功')
    getTree()
  }
}

const checkDel = (ids) => {
  ElMessageBox.confirm('', '确认删除服务类别数据？')
    .then(async () => {
      const { data }: any = await verifyDeleteServeType(ids)
      if (data.delete && !data.part) {
        del(ids)
      } else {
        ElMessageBox.confirm(data.msg, '系统提示')
          .then(() => {
            // done()
            if (data.part) {
              del(ids)
              return
            }
          })
          .catch(() => {
            // catch error
          })
      }
    })
    .catch(() => {
      // catch error
    })
}

const loading = ref(true)
const listData = ref()
const tableRef = ref()

const getTree = async () => {
  const res = await getServeTypeTree()
  listData.value = res.data
  loading.value = false
}

onMounted(() => {
  getTree()
})
</script>

<style>
.el-card {
  border: 0 !important;
}
.el-card__header {
  padding: 0 0 10px 0;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
