<template>
  <div>
    <el-card shadow="never" class="card">
      <template #header>
        <div class="card-header">
          <span class="title">服务商类别管理</span>
        </div>
      </template>
      <div class="query-form">
        <el-space wrap :size="12">
          <el-button type="primary" @click="add()" :disabled="!leafAreaFlag || getAuth('serviceProvider:type:add')"> 新增 </el-button>
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
        <el-table-column v-if="leafAreaFlag" label="操作" width="170" fixed="left" type="" class-name="table-operation">
          <template #default="{ row }">
            <el-button :disabled="!leafAreaFlag || getAuth('serviceProvider:type:delete')" link type="primary" @click="edit(row)"> 编辑 </el-button>
            <el-button :disabled="!leafAreaFlag || getAuth('serviceProvider:type:delete')" link type="primary" @click="checkDel(row.id)"> 删除 </el-button>
            <el-button link type="primary" :disabled="getAuth('worksheet:type:subclass')" @click="add(row)" v-if="row.children.length || row.parentId === 0"> 增加子类 </el-button>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="name" label="服务商类别" />
        <el-table-column show-overflow-tooltip prop="code" label="标识码" />
        <el-table-column show-overflow-tooltip prop="orderCode" label="排序码" />
        <el-table-column show-overflow-tooltip prop="remark" label="备注" />
      </el-table>
    </el-card>

    <TypeFormDialog ref="formRef" @reload-list="getTree" />
  </div>
</template>
<script setup lang="ts">
import TypeFormDialog from './components/type-form-dialog/index.vue'
import { ref, onMounted } from 'vue'
import { getProviderTypeTree, deleteProviderType, verifyDeleteProviderType } from '@/api/serviceProvider'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useCache } from '@/hooks/web/useCache'
import { getAuth } from '@/utils/export'

const { wsCache } = useCache()

const leafAreaFlag = ref(wsCache.get('leafAreaFlag'))

const delMsg = ref('')

const formRef = ref()
const add = (data?: any) => {
  formRef.value.show()
  if (data) {
    formRef.value.setDefault(data)
  }
}

const edit = (data: any) => {
  formRef.value.show(data)
}

onMounted(() => {
  getTree()
})

const loading = ref(true)
const listData = ref()
const tableRef = ref()

const getTree = async () => {
  const res = await getProviderTypeTree()
  listData.value = res.data
  loading.value = false
}

const del = async (ids) => {
  const res: any = await deleteProviderType(ids)
  if (res.code === 200) {
    ElMessage.success('操作成功')
    getTree()
  }
}

const checkDel = (ids) => {
  ElMessageBox.confirm('', '确定删除服务商类别数据？')
    .then(async () => {
      const { data }: any = await verifyDeleteProviderType(ids)
      if (data.delete && !data.part) {
        del(ids)
      } else {
        delMsg.value = data.msg
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
    .catch(() => {})
}
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

.extra-query-form {
  background-color: #f7f8fa;
  padding: 20px;
  margin: 10px 0;
}
</style>
