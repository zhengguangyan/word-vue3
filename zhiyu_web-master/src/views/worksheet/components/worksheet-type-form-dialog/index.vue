<template>
  <el-dialog destroy-on-close v-model="visibleFlag" :title="form.id ? '编辑工单分类' : '添加工单分类'" width="500px" :close-on-press-escape="false" :close-on-click-modal="false">
    <el-form ref="formRef" :model="form" :rules="rules" label-width="100px" class="r-p-b-20">
      <el-form-item label="上级分类" prop="parentId">
        <el-tree-select v-model="form.parentId" placeholder="请选择上级分类" :data="parentIdList" node-key="value" check-strictly :render-after-expand="false" filterable clearable>
          <!-- <template #default="{ data }">
            <span>{{ data.worksheetTypeName }} </span>
          </template> -->
        </el-tree-select>
      </el-form-item>
      <el-form-item label="分类名称" prop="worksheetTypeName">
        <el-input v-model="form.worksheetTypeName" placeholder="请输入分类名称" clearable />
      </el-form-item>
      <el-form-item label="标识码" prop="worksheetTypeCode">
        <el-input v-model="form.worksheetTypeCode" placeholder="请输入标识码" clearable />
      </el-form-item>
      <el-form-item label="分类" prop="worksheetType">
        <el-select v-model="form.worksheetType" placeholder="请选择分类" filterable clearable>
          <el-option key="2" value="2" label="工单类别">工单类别</el-option>
          <el-option key="3" value="3" label="工单子类">工单子类</el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="排序码">
        <el-input v-model="form.worksheetTypeSort" placeholder="请输入排序码" clearable />
      </el-form-item>
      <el-form-item label="描述说明">
        <el-input v-model="form.worksheetTypeDesc" :rows="3" type="textarea" placeholder="请输入描述说明" clearable maxlength="300" show-word-limit />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="onClose">取消</el-button>
        <el-button type="primary" @click="onSubmit" :loading="loading">确认</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { saveWorksheetType, updateWorksheetType, getWorksheetTree } from '@/api/worksheet'

const emits = defineEmits(['reload-list'])

const visibleFlag = ref(false)

const loading = ref(false)

function show(rowData) {
  getList()
  if (rowData) {
    Object.assign(form, rowData)
  }
  visibleFlag.value = true
}

function onClose() {
  Object.assign(form, formDefault)
  visibleFlag.value = false
}

const parentIdList = ref<any>([])

const getList = async () => {
  const res = await getWorksheetTree()
  parentIdList.value = mapList(res.data)
}

const mapList = (data: any) => {
  return data.map((item: any) => {
    if (item.children && item.worksheetType == '1') {
      return {
        value: item.id,
        label: item.worksheetTypeName,
        children: mapList(item.children)
      }
    } else {
      return {
        value: item.id,
        label: item.worksheetTypeName
      }
    }
  })
}

const formDefault = reactive({
  id: undefined,
  areaProjectCode: undefined,
  parentId: undefined,
  worksheetType: undefined,
  worksheetTypeCode: undefined,
  worksheetTypeDesc: undefined,
  worksheetTypeName: undefined,
  worksheetTypeSort: undefined
})

let form = reactive({ ...formDefault })

const rules = reactive({
  parentId: [{ required: true, message: '请选择上级分类', trigger: 'blur' }],
  worksheetTypeName: [{ required: true, message: '请输入分类名称', trigger: 'change' }],
  worksheetTypeCode: [{ required: true, message: '请输入标识码', trigger: 'change' }],
  worksheetType: [{ required: true, message: '请选择分类', trigger: 'blur' }]
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
      await saveWorksheetType(form)
    } else {
      await updateWorksheetType(form)
    }
    ElMessage.success('操作成功')
    emits('reload-list')
    onClose()
  } finally {
    loading.value = false
    // ElMessage.error(err.message)
  }
}

const setDefault = (data: any) => {
  form.parentId = data.id
}
defineExpose({
  show,
  setDefault
})
</script>
