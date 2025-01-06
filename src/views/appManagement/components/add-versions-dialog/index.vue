<template>
  <el-dialog
    destroy-on-close
    v-model="visibleFlag"
    :title="form.id ? '编辑APP版本信息' : '添加APP版本信息'"
    width="508px"
    @close="onClose"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
  >
    <el-form ref="formRef" :model="form" :rules="rules" label-width="120px">
      <!-- <el-form-item label="APP" prop="versionType" v-if="!form.id">
        <DictSelect
          v-model="form.versionType"
          placeholder="请选择APP"
          :distList="filterDict('version_type')"
        />
      </el-form-item> -->
      <el-form-item label="系统" prop="osType">
        <DictSelect width="100%" v-model="form.osType" placeholder="请选择系统" :distList="filterDict('os_type')" :disabled="form.id" />
      </el-form-item>
      <el-form-item label="版本号" prop="versionCode">
        <el-input v-model="form.versionCode" placeholder="请输入版本号" :disabled="form.id" />
      </el-form-item>
      <el-form-item label="更新说明" prop="instruction">
        <el-input v-model="form.instruction" maxlength="300" show-word-limit type="textarea" :autosize="{ minRows: 3 }" placeholder="请输入更新说明" />
      </el-form-item>
      <el-form-item label="下载地址" prop="url">
        <el-input v-model="form.url" placeholder="请输入下载地址" />
      </el-form-item>
      <el-form-item label="是否强制更新" prop="isUpdate">
        <el-radio-group v-model="form.isUpdate">
          <el-radio value="1" size="large">是</el-radio>
          <el-radio value="0" size="large">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <div class="isShow">
        <el-form-item label="是否有更新范围" prop="isRange">
          <el-radio-group v-model="form.isRange" @change="changeIsRange">
            <el-radio value="1" size="large">是</el-radio>
            <el-radio value="0" size="large">否</el-radio>
          </el-radio-group>
        </el-form-item>
      </div>
      <el-form-item label="更新范围" prop="areaProjectCodeList" v-if="form.isRange === '1'">
        <el-input v-model="form.areaProjectNames" disabled />
        <el-button link type="primary" @click="openServe"> 选择 </el-button>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="onClose">取消</el-button>
        <el-button type="primary" @click="onSubmit" :loading="loading">确认</el-button>
      </span>
    </template>
  </el-dialog>

  <el-dialog destroy-on-close v-model="visibleServe" title="选择更新范围" width="508px" @close="closeServe" :close-on-press-escape="false" :close-on-click-modal="false">
    <div>
      <el-table
        class="r-m-b-20"
        :data="tableData"
        ref="tableRef"
        header-row-class-name="table-header"
        style="height: 400px"
        @selection-change="handleSelectionChange"
        v-loading="loadingRange"
        class-name="table-without-border"
        border
      >
        <el-table-column type="selection" width="40" />
        <el-table-column label="操作" width="70">
          <template #default="{ row }">
            <el-button link type="primary" @click="changeOneService(row)"> 选择 </el-button>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="name" label="项目名称" />
        <el-table-column show-overflow-tooltip prop="regionName" label="所属区域" />
      </el-table>
      <!-- <div style="margin-top: 20px">
        <el-pagination
          v-model:current-page="queryForm.pageNum"
          v-model:page-size="queryForm.pageSize"
          :page-sizes="[10, 20, 50, 100, 200, 500]"
          layout="total, sizes, prev, pager, next"
          :total="total"
          @size-change="changeSize"
          @current-change="getTableList"
        />
      </div> -->
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="closeService">取消</el-button>
        <el-button type="primary" @click="changeService">确认</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script lang="ts" setup>
import DictSelect from '@/components/DictSelect/index.vue'
import { ref, reactive } from 'vue'
import { ElMessage, ElTable } from 'element-plus'
import { appInfoCategoryList, saveAppVersion, updateAppVersion, getAreaList } from '@/api/appManagement'

const props = defineProps({
  dict: {
    type: Array,
    default: null
  }
})

const filterDict = (key: any) => {
  return (props.dict.find((item: any) => item.type == key) as any)?.list
}

const emits = defineEmits(['reload-list'])

const visibleFlag = ref(false)

const loading = ref(false)

function show(rowData) {
  getList()
  if (rowData) {
    Object.assign(form, rowData)
    form.areaProjectCodeList = rowData.areaProjectCodes ? rowData.areaProjectCodes.split(',') : []
    rules.areaProjectCodeList[0].required = form.isRange === '1'
  }
  visibleFlag.value = true
}

function onClose() {
  Object.assign(form, formDefault)
  visibleFlag.value = false
}

const parentIdList = ref<any>([])

const getList = async () => {
  const { data } = await appInfoCategoryList()
  parentIdList.value = data.map((i) => {
    return {
      value: i.id,
      label: i.name
    }
  })
}

const formDefault = reactive({
  // versionType: undefined,
  id: undefined,
  versionCode: undefined,
  osType: undefined,
  url: undefined,
  isUpdate: undefined,
  isRange: undefined,
  enabled: undefined,
  instruction: undefined,
  areaProjectNames: undefined,
  areaProjectCodeList: []
})

let form = reactive<any>({ ...formDefault })

const validateVersionCode = (rule: any, value: any, callback: any) => {
  const length = value && value.split('').filter((i) => i === '.').length
  if (form.osType === 'ios' && length !== 2) {
    callback(new Error('ios版本号为三位，例如1.0.0'))
  } else if (form.osType === 'android' && length !== 3) {
    callback(new Error('安卓版本号为四位，例如1.0.0.0'))
  } else {
    callback()
  }
}

const rules = reactive({
  // versionType: [{ required: true, message: '请选择APP', trigger: 'change' }],
  osType: [{ required: true, message: '请选择系统', trigger: 'change' }],
  versionCode: [
    { required: true, message: '请输入版本号', trigger: 'blur' },
    { validator: validateVersionCode, trigger: 'blur' }
  ],
  instruction: [{ required: true, message: '请输入更新说明', trigger: 'blur' }],
  url: [{ required: true, message: '请输入下载链接', trigger: 'blur' }],
  isUpdate: [{ required: true, message: '请选择', trigger: 'blur' }],
  isRange: [{ required: true, message: '请选择', trigger: 'change' }],
  areaProjectCodeList: [{ required: false, message: '请选择', trigger: 'change' }]
})
const formRef = ref()

const onSubmit = async () => {
  try {
    await formRef.value.validate()
    save()
  } catch (err) {
    ElMessage.error('参数验证错误，请仔细填写表单数据!')
  }
}

const save = async () => {
  try {
    loading.value = true
    if (!form.id) {
      await saveAppVersion(form)
    } else {
      await updateAppVersion(form)
    }
    ElMessage.success('操作成功')
    emits('reload-list')
    onClose()
  } finally {
    loading.value = false
  }
}

const changeIsRange = () => {
  rules.areaProjectCodeList[0].required = form.isRange === '1'
  setTimeout(() => {
    formRef.value.clearValidate()
  }, 10)
}

const visibleServe = ref(false)
const tableData = ref<any>([])

const loadingRange = ref(false)

const multipleSelection = ref<any>([])

const handleSelectionChange = (val: any) => {
  multipleSelection.value = val
}

const closeService = () => {
  visibleServe.value = false
  multipleSelection.value = []
}

const changeService = () => {
  form.areaProjectCodeList = multipleSelection.value.map((item) => item.code)
  form.areaProjectNames = multipleSelection.value.map((item) => item.name).join(',')
  closeService()
}

const changeOneService = (row) => {
  form.areaProjectCodeList = [row.code]
  form.areaProjectNames = row.name
  closeService()
}

// const total = ref(0)

// const queryFormDefault = {
//   name: undefined,
//   pageNum: 1,
//   pageSize: 20,
//   orderByColumn: undefined,
//   asc: undefined
// }
// const queryForm = reactive<any>({ ...queryFormDefault })

// async function getTableList() {
//   loading.value = true
//   const res = await getAreaList()
//   tableData.value = res.data
//   loading.value = false
// }

const tableRef = ref<InstanceType<typeof ElTable>>()

async function getInitialTableList() {
  loading.value = true
  try {
    const res = await getAreaList()
    tableData.value = res.data

    if (form.areaProjectCodeList.length) {
      let initialArr = tableData.value.filter((item) => form.areaProjectCodeList.includes(item.code))
      setTimeout(() => {
        initialArr.forEach((row) => {
          tableRef.value!.toggleRowSelection(row, true)
        })
      }, 0)
    }
  } finally {
    loading.value = false
  }
}

// const changeSize = () => {
//   queryForm.pageNum = 1
//   getTableList()
// }

const closeServe = () => {
  visibleServe.value = false
}

const openServe = () => {
  visibleServe.value = true
  getInitialTableList()
}

defineExpose({
  show
})
</script>

<style scoped lang="less">
.item {
  width: 50%;
  padding-right: 40px;
}
.flex {
  flex-wrap: wrap;
}
:deep(.isShow .el-form-item--default .el-form-item__label) {
  line-height: normal;
}
</style>
