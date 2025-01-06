<template>
  <div>
    <el-card shadow="never" class="card">
      <template #header>
        <div class="card-header">
          <span class="title">养老卡管理</span>
        </div>
      </template>

      <div class="query-form">
        <el-space wrap :size="12">
          <el-button type="primary" @click="add" :disabled="!leafAreaFlag || getAuth('subsidyCard:index:add')">添加</el-button>
          <el-button @click="batchSetPic" :disabled="!leafAreaFlag || getAuth('subsidy:subsidy:add')">图片设置</el-button>
          <el-input v-model="queryForm.name" placeholder="模糊搜索卡号/客户姓名/证件号码" style="width: 300px" @change="getTableList" />
          <DictSelect v-model="queryForm.type" :distList="filterDict('card_type')" placeholder="卡类别" :clearable="true" />
          <DictSelect v-model="queryForm.status" :distList="filterDict('subsidy_card_using_status')" placeholder="卡状态" :clearable="true" />
          <el-button type="primary" @click="getTableList">查询</el-button>
          <el-button @click="reset">重置</el-button>
        </el-space>
      </div>

      <el-table :data="tableData" ref="tableRef" header-row-class-name="table-header" v-loading="loading" class-name="table-without-border list-page-table" height="calc(100vh - 310px)">
        <el-table-column fixed="left" label="序号" type="index" width="60" />
        <el-table-column fixed="left" label="操作" class-name="table-operation" width="200">
          <template #default="{ row }">
            <el-button link type="primary" @click="detail(row)" :disabled="!leafAreaFlag || getAuth('subsidy:card:detail')"> 查看 </el-button>
            <!-- 作废的卡不可编辑 -->
            <el-button link type="primary" @click="edit(row)" :disabled="!leafAreaFlag || getAuth('subsidyCard:index:edit') || row.status === '4'"> 编辑 </el-button>
            <el-button
              v-if="leafAreaFlag"
              link
              type="primary"
              :disabled="!leafAreaFlag || getAuth('subsidyCard:index:delete') || row.status === '2' || row.status === '3'"
              @click="verifyDelete(row.id)"
            >
              删除
            </el-button>
            <el-popconfirm :title="'作废后将不支持取消作废，是否确定作废该卡号: ' + row.code + ' 的信息？'" :width="250" v-if="leafAreaFlag" @confirm="valid(row.id)">
              <template #reference>
                <el-button link type="primary" :disabled="!leafAreaFlag || getAuth('subsidyCard:index:valid') || row.status !== '1'"> 作废 </el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="code" label="卡号" min-width="130" />
        <el-table-column show-overflow-tooltip prop="internalCode" label="内码" min-width="300" />
        <el-table-column show-overflow-tooltip prop="type" label="卡类别" min-width="130">
          <template #default="{ row }">
            {{ renderDict(row.type, 'card_type') }}
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="status" label="状态" min-width="130">
          <template #default="{ row }">
            <span class="not-bound" v-if="row.status === '1'">未绑定</span>
            <span class="bound" v-else-if="row.status === '2'">已绑定</span>
            <span class="loss" v-else-if="row.status === '3'">挂失</span>
            <span class="void" v-else-if="row.status === '4'">作废</span>
          </template>
        </el-table-column>
        <el-table-column prop="customerName" label="客户姓名" min-width="130" show-overflow-tooltip />
        <el-table-column prop="customerIdCard" label="证件号码" min-width="200" show-overflow-tooltip />
        <el-table-column show-overflow-tooltip prop="updateTime" label="更新时间" min-width="170" />
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
  <CardAddFormDialog ref="addFormRef" @reload-list="getTableList" :dict="dictMap" />
  <CardEditFormDialog ref="editFormRef" @reload-list="getTableList" :dict="dictMap" />
  <BatchSetPicFormDialog ref="batchSetPicFormRef" @reload-list="getTableList" :dict="dictMap" />
</template>
<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useCache } from '@/hooks/web/useCache'
import { getAuth } from '@/utils/export'
import { removeSubsidyCard, subsidyCardPage, verifyDeleteSubsidyCard, validSubsidyCard } from '@/api/subsidy/index'
import DictSelect from '/@/components/DictSelect/index.vue'
import CardAddFormDialog from './components/card-add-form-dialog/index.vue'
import CardEditFormDialog from './components/card-edit-form-dialog/index.vue'
import BatchSetPicFormDialog from './components/batch-set-pic-form-dialog/index.vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { filterDict, renderDict, dictMap } from '@/hooks/web/useDict'

import { useRouter } from 'vue-router'
const { push } = useRouter()

const { wsCache } = useCache()

const leafAreaFlag = ref(wsCache.get('leafAreaFlag'))

const addFormRef = ref()

function add() {
  addFormRef.value.show()
}

const batchSetPicFormRef = ref()
function batchSetPic() {
  batchSetPicFormRef.value.show()
}

function detail(row) {
  push(`/subsidy/cardDetail?id=${row.id}`)
}

const editFormRef = ref()
function edit(row) {
  editFormRef.value.show(row)
}

const queryFormDefault = {
  name: undefined,
  type: undefined,
  status: undefined,
  pageNum: 1,
  pageSize: 20,
  orderByColumn: undefined,
  asc: undefined
}
const queryForm = reactive<any>({ ...queryFormDefault })

const loading = ref(false)
const tableData = ref()
const total = ref(0)
const tableRef = ref()

async function getTableList() {
  loading.value = true
  const { data } = await subsidyCardPage(queryForm)
  tableData.value = data.list
  total.value = data.total
  loading.value = false
}

const reset = () => {
  Object.assign(queryForm, queryFormDefault)
  getTableList()
}

async function del(ids) {
  const res: any = await removeSubsidyCard(ids)
  if (res.code === 200) {
    ElMessage.success('删除成功')
    getTableList()
  }
}

async function valid(ids) {
  const res: any = await validSubsidyCard(ids)
  if (res.code === 200) {
    ElMessage.success('操作成功')
    getTableList()
  }
}

const verifyDelete = async (ids) => {
  ElMessageBox.confirm('删除此卡信息后将不可恢复', '确定删除养老卡数据？')
    .then(async () => {
      const { data } = await verifyDeleteSubsidyCard(ids)
      if (data.delete) {
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
    .catch(() => {})
}

// function batchDelete() {
//   let idList = tableRef.value.getSelectionRows()
//   if (!idList.length) {
//     return ElMessage.error('请先选择要删除的数据')
//   }
//   let ids = idList.map((obj) => obj.id).join(',')
//   verifyDelete(ids)
// }

onMounted(() => {
  getTableList()
})
</script>
<style lang="less" scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
