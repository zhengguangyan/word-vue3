<template>
  <div>
    <el-card shadow="never" class="card">
      <template #header>
        <div class="card-header">
          <span class="title">服务对象来源</span>
          <el-tooltip effect="dark" placement="left">
            <template #content> 各个分公司根据当地业务规则自行添加，也可以不添加。不添加时，<br />仅需选择服务对象来源一级。 </template>
            <span class="about">
              <Icon icon="ant-design:question-circle-outlined" style="vertical-align: middle" />
              权限说明
            </span>
          </el-tooltip>
        </div>
      </template>
      <div class="query-form">
        <el-space wrap :size="12">
          <el-button type="primary" @click="add()" :disabled="!leafAreaFlag || getAuth('filialeLabel:source:add')"> 添加 </el-button>
          <el-input clearable v-model="queryForm.name" style="width: 250px" placeholder="请输入项目名称" @change="getTableList">
            <template #suffix>
              <el-icon @click="getTableList"><search /></el-icon>
            </template>
          </el-input>
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
        <!-- <el-table-column type="selection" width="40" /> -->
        <el-table-column v-if="leafAreaFlag" label="操作" width="160" fixed="left" type="" class-name="table-operation">
          <template #default="{ row }">
            <el-button :disabled="!leafAreaFlag || getAuth('filialeLabel:source:edit')" link type="primary" @click="edit(row)"> 修改备注 </el-button>
            <el-popconfirm width="280" :title="'请确认是否' + (row.deleted ? '禁用' : '启用') + '该项目？'" @confirm="operate(row)">
              <template #reference>
                <el-button :disabled="!leafAreaFlag || getAuth('filialeLabel:source:change')" link type="primary">
                  {{ row.deleted ? '启用' : '禁用' }}
                </el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="name" label="服务对象来源（二级）" />
        <el-table-column show-overflow-tooltip prop="deleted" label="状态">
          <template #default="{ row }">
            <span class="gary" v-if="row.deleted">已禁用</span>
            <span class="green" v-else>已启用</span>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="remark" label="备注" />
      </el-table>
      <div style="margin-top: 20px">
        <el-pagination
          v-model:current-page="queryForm.pageNum"
          v-model:page-size="queryForm.pageSize"
          :page-sizes="[10, 20, 50, 100, 200, 500]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="getTableList()"
          @current-change="getTableList()"
        />
      </div>
    </el-card>
  </div>
  <el-dialog destroy-on-close v-model="visibleSub" :title="form.id ? '修改备注' : '添加服务对象来源'" width="500px" @close="onClose" :close-on-press-escape="false" :close-on-click-modal="false">
    <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
      <el-form-item label="名称" prop="name">
        <el-input :disabled="form.id" v-model="form.name" placeholder="请输入项目名称" maxlength="10" show-word-limit />
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="form.remark" placeholder="请输入项目备注说明" maxlength="50" show-word-limit :rows="3" type="textarea" />
      </el-form-item>
    </el-form>

    <div class="flex col-top tip r-m-b-20" v-if="!form.id">
      <span style="flex-shrink: 0">注意：</span>
      <div>
        <p class="flex col-top">
          <span>1、</span>
          <span>添加前请仔细检查填写的项目名称是否正确，添加后不可删除项目（只能禁用项目）</span>
        </p>
        <p class="flex col-top">
          <span>2、</span>
          <span>备注可修改</span>
        </p>
      </div>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="onClose">取消</el-button>
        <el-button type="primary" @click="onSubmit" :loading="submiting">确认</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { useCache } from '@/hooks/web/useCache'
import { getAuth } from '@/utils/export'
import { getBelongItemlabel, operateBelongItemlabel, saveBelongItemlabel } from '@/api/filiale'
import { reactive } from 'vue'
import { Search } from '@element-plus/icons-vue'

const { wsCache } = useCache()

const leafAreaFlag = ref(wsCache.get('leafAreaFlag'))

const queryForm = ref({
  name: undefined,
  pageNum: 1,
  pageSize: 20
})

const total = ref(0)

onMounted(() => {
  getTableList()
})

const loading = ref(true)
const listData = ref()
const tableRef = ref()

const operate = async (row) => {
  const res = await operateBelongItemlabel({ ...row, deleted: !row.deleted })
  ElMessage.success(res.msg)
  getTableList()
}

const getTableList = async () => {
  loading.value = true
  try {
    const { data } = await getBelongItemlabel({
      labelType: 'serviceObject',
      ...queryForm.value
    })
    listData.value = data.list
    total.value = data.total
  } finally {
    loading.value = false
  }
}
const edit = (row) => {
  Object.assign(form, row)
  visibleSub.value = true
}

const add = () => {
  visibleSub.value = true
}

const visibleSub = ref(false)

const submiting = ref(false)

const formDefault = reactive({
  id: undefined,
  parentKey: undefined,
  name: undefined,
  remark: undefined
})

let form = reactive<any>({ ...formDefault })

const rules = reactive({
  name: [{ required: true, message: '请输入项目名称', trigger: 'change' }],
  remark: [{ required: true, message: '请输入项目备注说明', trigger: 'change' }]
})

const formRef = ref()

const onClose = () => {
  visibleSub.value = false
  Object.assign(form, formDefault)
}

const onSubmit = async () => {
  try {
    await formRef.value.validate()
    save()
  } catch (err) {
    ElMessage.error('参数验证错误，请仔细填写表单数据!')
  }
}

const save = async () => {
  submiting.value = true
  try {
    const { msg } = await saveBelongItemlabel({ labelType: 'serviceObject', ...form })
    ElMessage.success(msg)
    submiting.value = false
    getTableList()
    onClose()
  } catch (error) {
    submiting.value = false
  }
}
</script>

<style lang="less" scoped>
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
