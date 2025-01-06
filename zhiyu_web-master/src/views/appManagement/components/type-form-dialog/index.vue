<template>
  <el-dialog
    destroy-on-close
    v-model="visibleFlag"
    :title="form.id ? '编辑APP基本信息类别' : '添加APP基本信息类别'"
    width="500px"
    @close="onClose"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
  >
    <el-form ref="formRef" :model="form" :rules="rules" label-width="110px">
      <!-- <el-form-item label="APP" prop="versionType">
        <DictSelect
          v-model="form.versionType"
          placeholder="请选择APP"
          :distList="filterDict('version_type')"
        />
      </el-form-item> -->
      <el-form-item label="基本信息名称" prop="name">
        <el-input v-model="form.name" placeholder="请输入名称"/>
      </el-form-item>
      <el-form-item label="标识码" prop="code">
        <el-input v-model="form.code" placeholder="请输入标识码"/>
      </el-form-item>
      <el-form-item label="描述">
        <el-input v-model="form.remark" placeholder="请输入描述" maxlength="300" show-word-limit type="textarea" :autosize="{ minRows: 3 }" />
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
// import DictSelect from '@/components/DictSelect/index.vue'
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { saveAppInfoCategory, updateAppInfoCategory } from '@/api/appManagement'

// const props = defineProps({
//   dict: {
//     type: Array,
//     default: null
//   }
// })

// const filterDict = (key: any) => {
//   return (props.dict.find((item: any) => item.type == key) as any)?.list
// }

const emits = defineEmits(['reload-list'])

const visibleFlag = ref(false)

const loading = ref(false)

function show(rowData) {
  if (rowData) {
    Object.assign(form, rowData)
  }
  visibleFlag.value = true
}

function onClose() {
  Object.assign(form, formDefault)
  visibleFlag.value = false
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
  remark: undefined
})

let form = reactive({ ...formDefault })

const rules = reactive({
  name: [{ required: true, message: '请输入分类名称', trigger: 'change' }],
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
      await saveAppInfoCategory(form)
    } else {
      await updateAppInfoCategory(form)
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
