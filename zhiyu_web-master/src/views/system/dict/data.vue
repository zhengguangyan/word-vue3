<template>
  <el-card shadow="never" class="card">
    <template #header>
      <div class="card-header">
        <span class="title">字典管理</span>
      </div>
    </template>

    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch">
      <el-form-item label="字典名称" prop="type">
        <el-select clearable v-model="queryParams.type" style="width: 200px" disabled="true">
          <el-option v-for="(item, index) in typeOptions" :key="index" :label="item.name" :value="item.type" />
        </el-select>
      </el-form-item>

      <el-form-item label="字典标签" prop="label">
        <el-input v-model="queryParams.label" @keyup.enter="handleQuery()" placeholder="请输入字典标签" clearable style="width: 200px" />
      </el-form-item>

      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="数据状态" clearable style="width: 200px">
          <el-option label="正常" value="0" />
          <el-option label="停用" value="1" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleQuery">搜索</el-button>
        <el-button :icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>

      <!-- 按钮 -->
      <div class="mb-12px">
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button type="primary" :icon="Plus" @click="handleAdd">新增</el-button>
            <el-button :icon="Delete" @click="handleDelete(null, false)" plain>删除</el-button>
          </el-col>
          <!-- <el-col :span="1.5">
            <el-button type="warning" plain :icon="Download">导出</el-button>
          </el-col> -->
          <!-- <el-col :span="1.5">
            <router-link to="/index"> -->
          <!-- <el-button type="warning" plain :icon="Close" @click="handleClose">关闭</el-button> -->
          <!-- </router-link> -->
          <!-- </el-col>  -->
        </el-row>
      </div>
      <!-- 表格 -->
      <el-table :data="dataList" @selection-change="handleSelectionChange" style="height: calc(100vh - 330px)" header-row-class-name="table-header" class-name="table-without-border" border>
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="字典编号" width="85" show-overflow-tooltip align="center" prop="id" />
        <el-table-column show-overflow-tooltip label="字典标签" align="center" prop="label">
          <template #default="scope">
            <span v-if="scope.row.listClass == '' || scope.row.listClass == 'default'">{{ scope.row.label }}</span>
            <span v-else :type="scope.row.listClass == 'primary' ? '' : scope.row.listClass">{{ scope.row.label }}</span>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip label="字典键值" align="center" prop="value" />
        <el-table-column show-overflow-tooltip label="字典排序" align="center" prop="sort" />
        <el-table-column show-overflow-tooltip label="状态" align="center" prop="status">
          <template #default="scope">
            <span>{{ scope.row.status == 0 ? '正常' : '停用' }}</span>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip label="备注" align="center" prop="remark" />
        <el-table-column show-overflow-tooltip label="创建时间" align="center" prop="createTime" width="180">
          <template #default="scope">
            <span>{{ scope.row.createTime }}</span>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip label="操作" align="center" width="160" class-name="small-padding fixed-width" fixed="left">
          <template #default="scope">
            <el-link class="links" link type="primary" @click="handleUpdate(scope.row)">修改</el-link>
            <el-link class="links" link type="primary" @click="handleDelete(scope.row, true)">删除</el-link>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        v-show="total > 0"
        v-model:page="queryParams.pageNum"
        v-model:limit="queryParams.pageSize"
        :total="total"
        :page-sizes="[10, 20, 30, 50]"
        :small="small"
        :disabled="disabled"
        :background="background"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        style="margin-top: 20px"
        @pagination="getTypes"
      />
    </el-form>
  </el-card>
  <el-dialog :title="title" v-model="open" width="500px" append-to-body :close-on-click-modal="false">
    <el-form ref="dataRef" :model="form" :rules="rules" label-width="80px">
      <el-form-item label="字典类型">
        <el-input clearable v-model="form.type" :disabled="true" />
      </el-form-item>
      <el-form-item label="数据标签" prop="label">
        <el-input clearable v-model="form.label" placeholder="请输入数据标签" />
      </el-form-item>
      <el-form-item label="数据键值" prop="value">
        <el-input clearable v-model="form.value" placeholder="请输入数据键值" />
      </el-form-item>
      <el-form-item label="样式属性" prop="cssClass">
        <el-input clearable v-model="form.cssClass" placeholder="请输入样式属性" />
      </el-form-item>
      <el-form-item label="显示排序" prop="sort">
        <el-input-number v-model="form.sort" controls-position="right" :min="0" :precision="0" />
      </el-form-item>
      <el-form-item label="回显样式">
        <el-select v-model="form.listClass" prop="listClass" clearable>
          <el-option label="默认(default)" value="default" />
          <el-option label="主要(primary)" value="primary" />
          <el-option label="成功(success)" value="success" />
          <el-option label="信息(info)" value="info" />
          <el-option label="警告(warning)" value="warning" />
          <el-option label="危险(danger)" value="danger" />
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-radio-group v-model="form.status" clearable>
          <el-radio value="0">正常</el-radio>
          <el-radio value="1">停用</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input clearable v-model="form.remark" :autosize="{ minRows: 2, maxRows: 4 }" type="textarea" placeholder="请输入内容" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, toRefs } from 'vue'
import { useRoute } from 'vue-router'
import { Plus, Delete, Refresh } from '@element-plus/icons-vue'
import { listData, getData, addData, updateData, delData } from '@/api/sys/data' //引入数据
import { getType, optionselect } from '@/api/sys/Dictionary'
import { ElMessage, ElMessageBox } from 'element-plus'
// import { type } from 'os';

const dataList = ref([]) //存放数据列表
const showSearch = ref(true) //搜索
const typeOptions = ref<any>([])
const defaulttypeid = ref(0) //存放字典名称下拉框数据
const defaulttype = ref('') //存放字典名称下拉框数据
const route = useRoute()
const open = ref(false)
const title = ref('')
const ids = ref([])
const single = ref(true)
const multiple = ref(true)
const total = ref(0)
const small = ref(false)
const disabled = ref(false)
const background = ref(false)

const handleSizeChange = (val) => {
  data.queryParams.pageSize = val
  getlistData()
}
const handleCurrentChange = (val) => {
  data.queryParams.pageNum = val
  getlistData()
}

const data: any = reactive({
  form: {
    typeId: undefined,
    type: undefined,
    label: undefined,
    value: undefined,
    cssClass: undefined,
    status: undefined,
    remark: undefined,
    sort: undefined,
    listClass: undefined,
    staformtus: undefined
  },
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    label: undefined,
    typeId: undefined,
    type: undefined,
    status: undefined,
    defaulttypeid: undefined,
    defaulttype: undefined,
    nextTypeId: undefined,
    nextType: undefined
  },
  rules: {
    label: [{ required: true, message: '数据标签不能为空', trigger: 'blur' }],
    value: [{ required: true, message: '数据键值不能为空', trigger: 'blur' }],
    sort: [{ required: true, message: '数据顺序不能为空', trigger: 'blur' }]
  }
})
const { queryParams, form, rules } = toRefs(data)

/** 表单重置 */
function reset() {
  form.value = {
    id: undefined,
    label: undefined,
    value: undefined,
    cssClass: undefined,
    listClass: 'default',
    sort: 0,
    status: '0',
    remark: undefined
  }
}
// 获取数据列表
const getlistData = async () => {
  const result: any = await listData(queryParams.value.nextType)
  if (result.code == 200) {
    dataList.value = result.data
  }
}

/** 查询字典类型列表 */
function getTypeList() {
  optionselect().then((response) => {
    typeOptions.value = response.data
  })
}

function getTypes(dictId) {
  getType(dictId).then((response) => {
    queryParams.value.typeId = response.data.id
    queryParams.value.type = response.data.name
    queryParams.value.nextType = response.data.type
    queryParams.value.nextTypeId = response.data.id
    defaulttype.value = response.data.name
    defaulttypeid.value = response.data.id
    getlistData()
  })
}

//搜索
function handleQuery() {
  getlistData()
}

// 重置
function resetQuery() {
  ;(data.queryParams.label = undefined), (data.queryParams.status = undefined)
  data.queryParams.type = defaulttype.value
  data.queryParams.typeId = defaulttypeid.value
  getlistData()
}

// 返回
// function handleClose() {
// router.push('/system/dict/index')
// push({ path:'/system/dict/index'})

// router.push({ path: '/system/dict' });

// }
// 新增
function handleAdd() {
  reset()
  open.value = true
  title.value = '添加字典数据'
  form.value.type = queryParams.value.nextType
  form.value.typeId = queryParams.value.nextTypeId
}
// 修改
function handleUpdate(row) {
  reset()
  const id = row.id || ids.value
  getData(id).then((response) => {
    form.value = response.data
    open.value = true
    title.value = '修改字典数据'
    form.value.type = queryParams.value.nextType
    form.value.typeId = queryParams.value.nextTypeId
  })
}
// 确定（保存）
const submitForm = async () => {
  if (form.value.id !== undefined) {
    let result: any = await updateData(form.value)
    if (result.code == 200) {
      //关闭对话框
      open.value = false
      //弹出提示信息
      ElMessage({
        type: 'success',
        message: '修改成功'
      })
      //再次发请求获取
      getlistData()
    }
  } else {
    let result: any = await addData(form.value)
    if (result.code == 200) {
      //关闭对话框
      open.value = false
      //弹出提示信息
      ElMessage({
        type: 'success',
        message: '添加成功'
      })
      //再次发请求获取
      getlistData()
    }
  }
}

// 取消
function cancel() {
  open.value = false
}

// 多选
function handleSelectionChange(selection) {
  ids.value = selection.map((item) => item.id)
  single.value = selection.length != 1
  multiple.value = !selection.length
}

// 删除
function handleDelete(row, type) {
  const id = row ? row.id : ids.value
  const tipt = ref('')
  if (type == true) {
    tipt.value = '是否确定删除该数据'
  } else {
    tipt.value = '是否确认删除所选数据'
  }
  ElMessageBox.confirm(tipt.value, '系统提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消'
  }).then(() => {
    delData(id)
      .then(() => {
        ElMessage({
          type: 'success',
          message: '删除成功'
        })
        getlistData()
      })
      .catch(() => {
        ElMessage({
          type: 'info',
          message: '已取消'
        })
        getlistData()
      })
  })
}

getTypes(route.query.id)
getTypeList()
</script>

<style lang="less" scoped>
.app-container {
  padding: 20px;
}

.links {
  margin-right: 15px;
  text-decoration: underline;
}

.el-link:hover {
  color: #ffbf66;
}

.el-link.is-disabled:hover {
  color: #ccc;
}
</style>
