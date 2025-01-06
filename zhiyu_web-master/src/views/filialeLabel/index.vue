<template>
  <el-card shadow="never" class="card">
    <template #header>
      <div class="card-header">
        <span class="title">自建订单归属项目</span>
      </div>
    </template>
    <div class="flex col-top">
      <div class="left">
        <div class="lower-title">
          订单归属项目(一级)
          <el-tooltip effect="dark" placement="right">
            <template #content> 为集团统一创建。各分公司不可修改。各个分公司可选择其中的一个<br />项目，创建订单归属项目（二级）。 </template>
            <span class="about">
              <Icon icon="ant-design:question-circle-outlined" style="vertical-align: middle" />
            </span>
          </el-tooltip>
        </div>
        <span class="sub-title">项目名称(已添加二级项目个数)</span>

        <el-tabs tab-position="left" v-model="currentMenu" class="demo-tabs">
          <el-tab-pane v-for="(item, index) in projectList" :key="item.parentKey" :name="item.parentKey">
            <template #label>
              <span class="custom-tabs-label">
                <span style="margin-right: 24px">{{ index + 1 }}</span>
                <span>
                  {{ item.parentLabel }}
                  (<span v-if="item.parentKeySum" class="orange">{{ item.parentKeySum }}</span> <span v-else>0</span>)
                </span>
              </span>
            </template>
          </el-tab-pane>
        </el-tabs>
      </div>
      <div class="right">
        <div class="lower-title">
          订单归属项目(二级)
          <el-tooltip effect="dark" placement="right">
            <template #content> 各个分公司根据当地业务规则自行添加，也可以不添加。不添加时，<br />仅需选择订单归属项目一级。 </template>
            <span class="about">
              <Icon icon="ant-design:question-circle-outlined" style="vertical-align: middle" />
            </span>
          </el-tooltip>
        </div>
        <span class="sub-title"
          >当前选中的一级归属项目为：
          <span class="orange">
            {{ projectList.find((item) => item.parentKey === currentMenu)?.parentLabel }}
          </span>
        </span>
        <el-space :size="12" class="r-m-t-20 flex">
          <el-button type="primary" @click="add()" :disabled="!leafAreaFlag || getAuth('filialeLabel:index:add')"> 添加 </el-button>
          <el-input clearable v-model="queryForm.name" style="width: 250px" placeholder="请输入项目名称" @change="getTableList">
            <template #suffix>
              <el-icon @click="getTableList"><search /></el-icon>
            </template>
          </el-input>
          <DictSelect v-model="queryForm.deleted" :distList="deletedList" placeholder="状态" @change="getTableList" />
        </el-space>
        <el-table
          style="height: calc(100vh - 375px); margin-top: 10px"
          :data="listData"
          ref="tableRef"
          row-key="id"
          default-expand-all
          header-row-class-name="table-header"
          v-loading="loading"
          class-name="table-without-border"
          border
        >
          <el-table-column v-if="leafAreaFlag" label="操作" width="160" fixed="left" type="" class-name="table-operation">
            <template #default="{ row }">
              <el-button :disabled="!leafAreaFlag || getAuth('filialeLabel:index:edit')" link type="primary" @click="edit(row)"> 修改备注 </el-button>
              <el-popconfirm width="200" :title="'请确认是否' + (!row.deleted ? '禁用' : '启用') + '该项目？'" @confirm="operate(row)">
                <template #reference>
                  <el-button :disabled="!leafAreaFlag || getAuth('filialeLabel:index:change')" link type="primary">
                    {{ !row.deleted ? '禁用' : '启用' }}
                  </el-button>
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="name" label="订单归属项目（二级）" />
          <el-table-column show-overflow-tooltip prop="deleted" label="状态">
            <template #default="{ row }">
              <span class="green" v-if="!row.deleted">已启用</span>
              <span class="gary" v-else>已禁用</span>
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
            @size-change="changeSize()"
            @current-change="getTableList()"
          />
        </div>
      </div>
    </div>
  </el-card>

  <el-dialog destroy-on-close v-model="visibleSub" :title="form.id ? '修改备注' : '添加订单归属项目(二级)'" width="500px" @close="onClose" :close-on-press-escape="false" :close-on-click-modal="false">
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
import { onMounted, ref } from 'vue'
import DictSelect from '/@/components/DictSelect/index.vue'
import { useCache } from '@/hooks/web/useCache'
import { getAuth } from '@/utils/export'
import { getBelongProjectList, getBelongItemlabel, saveBelongItemlabel, updateBelongItemlabel, operateBelongItemlabel } from '@/api/filiale'
import { reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { watch } from 'vue'
import { Search } from '@element-plus/icons-vue'

const { wsCache } = useCache()
const leafAreaFlag = ref(wsCache.get('leafAreaFlag'))

const currentMenu = ref('1')

const queryForm = ref({
  name: undefined,
  deleted: undefined,
  pageNum: 1,
  pageSize: 20
})

const deletedList = ref([
  { value: 'false', label: '已启用' },
  { value: 'true', label: '已禁用' }
])

const loading = ref(false)

const total = ref(0)

const listData = ref([])

const projectList = ref<any>([])

const getList = async () => {
  projectList.value = []
  const res = await getBelongProjectList({ labelType: 'belong_project' })
  projectList.value = res.data
}

const getTableList = async () => {
  loading.value = true
  try {
    const { data } = await getBelongItemlabel({
      labelType: 'belong_project',
      parentKey: currentMenu.value,
      ...queryForm.value
    })
    listData.value = data.list
    total.value = data.total
  } finally {
    loading.value = false
  }
}

const changeSize = () => {
  queryForm.value.pageNum = 1
  getTableList()
}

const edit = (row) => {
  Object.assign(form, row)
  visibleSub.value = true
}

const add = () => {
  visibleSub.value = true
  form.parentKey = currentMenu.value
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
    if (form.id) {
      const { msg } = await updateBelongItemlabel({
        labelType: 'belong_project',
        ...form
      })
      ElMessage.success(msg)
    } else {
      const { msg } = await saveBelongItemlabel({ labelType: 'belong_project', ...form })
      ElMessage.success(msg)
    }
    submiting.value = false
    getTableList()
    getList()
    onClose()
  } catch (error) {
    submiting.value = false
  }
}

const operate = async (row) => {
  const res = await operateBelongItemlabel({ ...row, deleted: !row.deleted })
  ElMessage.success(res.msg)
  getTableList()
}

watch(
  () => currentMenu.value,
  () => {
    getTableList()
  }
)

onMounted(() => {
  getList()
  getTableList()
})
</script>

<style lang="less" scoped>
:deep(.el-card__header) {
  margin-bottom: 0 !important;
}
:deep(.el-menu-item) {
  height: 44px !important;
  padding-left: 28px !important;
}
:deep(.el-tabs--left .el-tabs__item.is-left) {
  width: 243px;
  height: 44px;
  font-size: 16px;
  justify-content: flex-start;
  padding-left: 40px;
}
:deep(.el-tabs__item.is-active),
:deep(.el-menu-item.is-active) {
  font-size: var(--el-font-size-base);
  background: #fff9f0;
  border-radius: 4px;
  width: 230px !important;
}
:deep(.el-tabs__active-bar) {
  top: 6px !important;
  right: 1px !important;
  height: 27px !important;
}
:deep(.el-tabs--left .el-tabs__nav-wrap.is-left::after) {
  width: 0;
}
.left {
  width: 243px;
  height: calc(100vh - 200px);
  border-right: 1px solid #ebe9e6;
}
.right {
  padding-left: 40px;
  width: calc(100% - 243px);
  // margin-top: -24px;
}
.lower-title {
  margin-top: 20px;
  font-weight: bold;
  font-size: 16px;
  color: var(--main-text-color);
}
.sub-title {
  font-size: 14px;
  color: var(--main-text-color);
}
.demo-tabs {
  margin-top: 20px;
}
.custom-tabs-label {
  font-size: 14px;
  color: var(--main-text-color);
}
:deep(.el-tabs__item.is-active > .custom-tabs-label) {
  color: #ff9500 !important;
}
</style>
