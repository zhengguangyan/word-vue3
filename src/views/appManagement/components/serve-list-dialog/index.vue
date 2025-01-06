<template>
  <el-dialog
    destroy-on-close
    v-model="visibleFlag"
    :title="form.id ? '编辑APP基本信息' : '添加APP基本信息'"
    width="976px"
    @close="onClose"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
  >
    <el-form ref="formRef" :model="form" :rules="rules" label-width="110px">
      <div class="flex">
        <div class="item">
          <el-form-item label="基本信息名称" prop="title">
            <el-input v-model="form.title" placeholder="请输入基本信息名称" />
          </el-form-item>
        </div>
        <div class="item item-right">
          <el-form-item label="基本信息分类" prop="categoryId">
            <DictSelect
              width="100%"
              v-model="form.categoryId"
              placeholder="请选择基本信息分类"
              :distList="parentIdList"
            />
          </el-form-item>
        </div>
        <div class="item">
          <el-form-item label="标识码" prop="code">
            <el-input v-model="form.code" placeholder="请输入标识码" />
          </el-form-item>
        </div>
        <div class="item isShow">
          <el-form-item label="是否在APP帮助页显示" prop="showHelpNotes">
            <el-radio-group v-model="form.showHelpNotes">
              <el-radio value="1" size="large">是</el-radio>
              <el-radio value="0" size="large">否</el-radio>
            </el-radio-group>
          </el-form-item>
        </div>
      </div>
      <el-form-item label="内容">
        <Editor v-model="form.content" ref="editorRef" style="width: 100%" :height="300" />
      </el-form-item>
      <el-form-item label="其他选项">
        <el-checkbox class="checkbox" v-model="form.enabled" label="马上发布" size="large" />
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
import Editor from '../../../Components/Editor/Editor.vue'
import DictSelect from '@/components/DictSelect/index.vue'
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { appInfoCategoryList, saveAppInfo, updateAppInfo } from '@/api/appManagement'

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
  const { data } = await appInfoCategoryList()
  parentIdList.value = data.map((i) => {
    return {
      value: i.id,
      label: i.name
    }
  })
}

const formDefault = reactive({
  id: undefined,
  title: undefined,
  categoryId: undefined,
  code: undefined,
  showHelpNotes: undefined,
  enabled: undefined,
  content: undefined
})

let form = reactive({ ...formDefault })

const rules = reactive({
  categoryId: [{ required: true, message: '请选择基本信息分类', trigger: 'blur' }],
  title: [{ required: true, message: '请输入基本信息名称', trigger: 'change' }],
  code: [{ required: true, message: '请输入标识码', trigger: 'change' }],
  showHelpNotes: [{ required: true, message: '请选择', trigger: 'change' }]
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
      await saveAppInfo(form)
    } else {
      await updateAppInfo(form)
    }
    ElMessage.success('操作成功')
    emits('reload-list')
    onClose()
  } finally {
    loading.value = false
  }
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
.item-right {
  padding-right: 0;
}
.checkbox {
  margin-top: -4px;
}
.flex {
  flex-wrap: wrap;
}
:deep(.isShow .el-form-item--default .el-form-item__label) {
  line-height: normal;
}
</style>
