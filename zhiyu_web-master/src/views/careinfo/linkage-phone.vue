<template>
  <div>
    <el-card shadow="never" class="card">
      <template #header>
        <div class="card-header">
          <span class="title">联动号码管理</span>
          <span class="about">
            <Icon icon="ant-design:question-circle-outlined" style="vertical-align: middle" />
            权限说明
          </span>
        </div>
      </template>

      <div class="query-form flex row-between">
        <el-space wrap :size="12">
          <el-button type="primary" @click="add()" :disabled="getAuth('careinfo:phone:add')">添加</el-button>
          <el-button :disabled="getAuth('careinfo:phone:delete')" @click="batchDelete">删除</el-button>
          <el-input v-model="queryForm.query" placeholder="精确搜索联系电话/创建人" style="width: 360px" @change="search" />
          <el-button type="primary" @click="search()">查询</el-button>
          <el-button>重置</el-button>
        </el-space>
        <!-- <div>
          <el-button>导出</el-button>
        </div> -->
      </div>

      <el-table :data="tableData" ref="tableRef" header-row-class-name="table-header" class-name="table-without-border list-page-table" height="calc(100vh - 310px)">
        <el-table-column type="selection" width="40" />
        <el-table-column fixed="left" label="操作" width="120" class-name="table-operation">
          <template #default="{ row }">
            <el-button link type="primary" @click="edit(row)" :disabled="getAuth('careinfo:phone:edit')"> 编辑 </el-button>
            <el-button link type="primary" :disabled="getAuth('careinfo:phone:delete')" @click="del(row.id)"> 删除 </el-button>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="phone" label="联系电话" min-width="200" />
        <el-table-column show-overflow-tooltip prop="phoneName" label="名称" min-width="200" />
        <el-table-column show-overflow-tooltip prop="creatorName" label="创建人" min-width="180" />
        <el-table-column show-overflow-tooltip prop="createTime" label="创建时间" min-width="180" />
      </el-table>
      <div style="margin-top: 20px">
        <el-pagination
          v-model:current-page="queryForm.pageNum"
          v-model:page-size="queryForm.pageSize"
          :page-sizes="[10, 20, 50, 100, 200, 500]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="getTableList"
          @current-change="getTableList"
        />
      </div>
    </el-card>
  </div>
  <LinkagePhoneFormDialog ref="formRef" @reload-list="getTableList" />
</template>
<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getLinkagePhonePage, deleteLinkagePhone } from '@/api/linkage/index'
import LinkagePhoneFormDialog from './components/linkage-phone-form-dialog/index.vue'
import { getAuth } from '@/utils/export'

const formRef = ref()
function add() {
  formRef.value.show()
}

function search() {
  getTableList()
}

function edit(data) {
  formRef.value.show(data)
}

const queryFormDefault = {
  query: undefined,
  pageNum: 1,
  pageSize: 20
}
const queryForm = reactive({ ...queryFormDefault })

const tableData = ref()
const total = ref(0)
const tableRef = ref()

async function getTableList() {
  const res = await getLinkagePhonePage(queryForm)
  tableData.value = res.data.list
  total.value = res.data.total
}

function del(ids) {
  ElMessageBox.confirm('', '确定删除联动号码数据？')
    .then(async () => {
      const res: any = await deleteLinkagePhone(ids)
      if (res.code === 200) {
        ElMessage.success('操作成功')
        getTableList()
      }
    })
    .catch(() => {})
}

function batchDelete() {
  let idList = tableRef.value.getSelectionRows()
  let ids = idList.map((obj) => obj.id).join(',')
  if (!idList.length) {
    return ElMessage.error('请先选择要删除的数据')
  }
  del(ids)
}

onMounted(() => {
  getTableList()
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

.extra-query-form {
  background-color: #f7f8fa;
  padding: 20px;
  margin: 10px 0;
}
</style>
