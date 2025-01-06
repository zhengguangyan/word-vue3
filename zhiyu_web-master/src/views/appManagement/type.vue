<template>
  <div>
    <el-card shadow="never" class="card">
      <template #header>
        <div class="card-header">
          <span class="title">APP基本信息类别管理</span>
        </div>
      </template>
      <!-- <div>
        <el-radio-group v-model="queryForm.versionType" @change="getTree">
          <el-radio-button
            v-for="item in filterDict('version_type')"
            :key="item.value"
            :label="item.value"
            >{{ item.label }}</el-radio-button
          >
        </el-radio-group>
      </div> -->
      <div class="query-form">
        <el-space wrap>
          <el-button type="primary" @click="add()" :disabled="!leafAreaFlag || getAuth('app:type:add')"> 添加APP信息类别 </el-button>
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
        height="calc(100vh - 310px)"
      >
        <el-table-column type="index" fixed="left" label="序号" width="60" />
        <el-table-column v-if="leafAreaFlag" label="操作" width="160" fixed="left" type="" class-name="table-operation">
          <template #default="{ row }">
            <el-button :disabled="!leafAreaFlag || getAuth('app:type:edit')" link type="primary" @click="edit(row)"> 编辑 </el-button>
            <el-button :disabled="!leafAreaFlag || getAuth('app:type:delete')" link type="primary" @click="checkDel(row.id)"> 删除 </el-button>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="name" label="类别名称" />
        <el-table-column show-overflow-tooltip prop="code" label="标识码" />
        <el-table-column show-overflow-tooltip prop="remark" label="描述" />
      </el-table>
      <div style="margin-top: 20px">
        <el-pagination
          v-model:current-page="queryForm.pageNum"
          v-model:page-size="queryForm.pageSize"
          :page-sizes="[10, 20, 50, 100, 200, 500]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="getTree"
          @current-change="getTree"
        />
      </div>
    </el-card>

    <TypeFormDialog ref="formRef" :dict="dictMap" @reload-list="getTree" />
  </div>
</template>
<script setup lang="ts">
import TypeFormDialog from './components/type-form-dialog/index.vue'
import { ref, onMounted, reactive } from 'vue'
import { verifyDeleteProviderType } from '@/api/serviceProvider'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useCache } from '@/hooks/web/useCache'
import { getAuth } from '@/utils/export'
import { appInfoCategoryPage, removeAppInfoCategory } from '@/api/appManagement'

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

const queryFormDefault = {
  // versionType: 'zhulao',
  pageNum: 1,
  pageSize: 20
}
const queryForm = reactive<any>({ ...queryFormDefault })

const edit = (data: any) => {
  formRef.value.show(data)
}

onMounted(() => {
  getTree()
})

const loading = ref(true)
const listData = ref()
const dictMap = ref([])
const tableRef = ref()
const total = ref(0)

const getTree = async () => {
  loading.value = true
  const { data } = await appInfoCategoryPage(queryForm)
  listData.value = data.list
  total.value = data.total
  loading.value = false
}

const del = async (ids) => {
  const res: any = await removeAppInfoCategory(ids)
  if (res.code === 200) {
    ElMessage.success('操作成功')
    getTree()
  }
}

const checkDel = (ids) => {
  ElMessageBox.confirm('', '确定删除APP基本信息分类数据？')
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

<style scoped lang="less">
:deep(.el-radio-button:last-child .el-radio-button__inner) {
  border-radius: 0 8px 8px 0;
}
:deep(.el-radio-button:first-child .el-radio-button__inner) {
  border-radius: 8px 0 0 8px;
}
</style>
