<template>
  <div>
    <el-card shadow="never" class="card">
      <template #header>
        <div class="card-header">
          <span class="title">工单分类管理</span>
          <span class="about">
            <Icon icon="ant-design:question-circle-outlined" style="vertical-align: middle" />
            权限说明
          </span>
        </div>
      </template>
      <div class="query-form">
        <el-space wrap :size="12">
          <el-button type="primary" @click="add()" :disabled="!leafAreaFlag && getAuth('worksheet:type:add')"> 新增 </el-button>
          <!-- <el-popconfirm width="280" title="同时会删除下属子项，是否确认删除？">
            <template #reference> </template>
          </el-popconfirm> -->
          <el-button :disabled="!leafAreaFlag || getAuth('worksheet:type:delete')" @click="batchDelete"> 删除 </el-button>
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
        <el-table-column type="selection" width="40" />
        <el-table-column v-if="leafAreaFlag" label="操作" width="180" fixed="left" type="" class-name="table-operation">
          <template #default="{ row }">
            <el-button :disabled="getAuth('worksheet:type:edit')" link type="primary" @click="edit(row)" v-if="row.parentId !== 0"> 编辑 </el-button>
            <el-popconfirm title="同时会删除下属子项，是否确认删除?" @confirm="del(row.id)" :width="280" v-if="row.parentId !== 0">
              <template #reference>
                <el-button :disabled="getAuth('worksheet:type:delete')" link type="primary"> 删除 </el-button>
              </template>
            </el-popconfirm>
            <el-button link type="primary" :disabled="getAuth('worksheet:type:subclass')" @click="add(row)" v-if="row.worksheetLevel == '1' || row.worksheetLevel == '2'"> 增加子类 </el-button>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="worksheetTypeName" label="工单分类名称" min-width="190" />
        <el-table-column show-overflow-tooltip prop="worksheetTypeCode" label="标识码" min-width="160" />
        <el-table-column show-overflow-tooltip prop="worksheetType" label="分类" min-width="160">
          <template #default="{ row }">
            {{ filterDict('worksheet_type')?.find((item) => item.value == row.worksheetType)?.label }}
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="worksheetTypeSort" label="排序码" width="160" />
        <el-table-column show-overflow-tooltip prop="worksheetTypeDesc" label="描述" min-width="200" />
      </el-table>
    </el-card>
  </div>
  <WorksheetTypeFormDialog ref="formRef" @reload-list="getTree" />
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { deleteWorksheetType, getWorksheetTree } from '@/api/worksheet'
import WorksheetTypeFormDialog from './components/worksheet-type-form-dialog/index.vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useCache } from '@/hooks/web/useCache'
import { getAuth } from '@/utils/export'
import { filterDict } from '@/hooks/web/useDict'

const { wsCache } = useCache()

const leafAreaFlag = ref(wsCache.get('leafAreaFlag'))

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
  const res = await getWorksheetTree()
  listData.value = res.data
  loading.value = false
}

const del = (ids) => {
  ElMessageBox.confirm('同时会删除下属子项', '确定删除工单分类数据？')
    .then(async () => {
      const res: any = await deleteWorksheetType(ids)
      if (res.code === 200) {
        ElMessage.success('操作成功')
        getTree()
      }
    })
    .catch(() => {})
}

function batchDelete() {
  let idList = tableRef.value.getSelectionRows()
  if (!idList.length) {
    return ElMessage.error('请先选择要删除的数据')
  }
  let ids = idList.map((obj) => obj.id).join(',')
  del(ids)
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
