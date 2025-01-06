<template>
  <el-dialog destroy-on-close v-model="visibleFlag" :title="form.id ? '编辑服务商类别' : '添加服务商类别'" width="500px" @close="onClose" :close-on-press-escape="false" :close-on-click-modal="false">
    <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
      <el-form-item label="分类名称" prop="name">
        <el-input v-model="form.name" placeholder="请输入分类名称" :min="4" :max="10" />
      </el-form-item>
      <el-form-item label="上级分类" prop="parentId">
        <el-tree-select style="width: 100%" v-model="form.parentId" :data="parentIdList" node-key="value" check-strictly :render-after-expand="false" placeholder="请选择上级分类" />
      </el-form-item>
      <el-form-item label="标识码" prop="code">
        <el-input v-model="form.code" placeholder="请输入标识码" />
      </el-form-item>
      <el-form-item label="排序码">
        <el-input-number v-model="form.orderCode" :controls="false" precision="0" placeholder="请输入排序码" />
      </el-form-item>
      <el-form-item label="备注">
        <el-input v-model="form.remark" :rows="3" type="textarea" placeholder="请输入备注" :maxlength="300" show-word-limit />
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
import { getProviderTypeTree, saveProviderType, updateProviderType } from '@/api/serviceProvider'

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
  const res = await getProviderTypeTree()
  parentIdList.value = mapList(res.data)
  parentIdList.value.unshift({ value: 0, label: '作为顶级分类' })
}

const mapList = (data: any) => {
  return data.map((item: any) => {
    if (item.children) {
      return {
        value: item.id,
        label: item.name,
        children: mapList(item.children)
      }
    } else {
      return {
        value: item.id,
        label: item.name
      }
    }
  })
}

const formDefault = reactive({
  id: undefined,
  name: undefined,
  parentId: 0,
  code: undefined,
  orderCode: undefined,
  remark: undefined
})

let form = reactive({ ...formDefault })

const rules = reactive({
  parentId: [{ required: true, message: '请选择上级分类', trigger: 'blur' }],
  name: [
    { required: true, message: '请输入分类名称', trigger: 'change' },
    { pattern: /^[\u4e00-\u9fa5]+$/, message: '必须全部使用汉字', trigger: 'change' },
    { min: 4, max: 10, message: '请输入一个4~10字数内的名称', trigger: 'blur' }
  ],
  code: [{ required: true, message: '请输入标识码', trigger: 'change' }]
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
      await saveProviderType(form)
    } else {
      await updateProviderType(form)
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
