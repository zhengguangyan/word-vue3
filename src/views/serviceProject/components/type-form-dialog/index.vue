<template>
  <el-dialog destroy-on-close v-model="visibleFlag" :title="form.id ? '编辑服务类别' : '添加服务类别'" width="500px" @close="onClose" :close-on-press-escape="false" :close-on-click-modal="false">
    <el-form ref="formRef" :model="form" :rules="rules" label-width="135px" class="r-p-b-20">
      <el-form-item label="类别名称" prop="name">
        <el-input v-model="form.name" placeholder="请输入类别名称" />
      </el-form-item>
      <el-form-item label="上级分类">
        <el-tree-select style="width: 100%" v-model="form.parentId" :data="parentIdList" node-key="value" placeholder="请选择上级分类" check-strictly :render-after-expand="false" />
      </el-form-item>
      <el-form-item label="标识码" prop="code">
        <el-input v-model="form.code" placeholder="请输入标识码" />
      </el-form-item>
      <el-form-item label="排序码" prop="sort">
        <el-input v-model="form.sort" placeholder="请输入排序码" />
      </el-form-item>
      <el-form-item label="描述" prop="remark">
        <el-input v-model="form.remark" :rows="3" type="textarea" placeholder="请输入描述" maxlength="300" show-word-limit />
      </el-form-item>
      <el-form-item label="图标" prop="icon">
        <ImgUpload v-model="form.iconUrl" show-limit @success="handleImgSuccess" @remove="handleImgRemove" />
      </el-form-item>
      <el-form-item label="在app中显示">
        <el-radio-group v-model="form.isShowApp">
          <el-radio value="1">是</el-radio>
          <el-radio value="0">否</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="onClose">取消</el-button>
        <el-button type="primary" :loading="loading" @click="onSubmit">确认</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { getServeTypeTree, getUrl, saveServeType, updateServeType } from '@/api/serviceProvider'
import { config } from '@/config/axios/config'
import ImgUpload from '../img-upload/index.vue'

const emits = defineEmits(['reload-list'])

const visibleFlag = ref(false)

const loading = ref(false)

const show = async (rowData) => {
  getList()
  if (rowData) {
    Object.assign(form, rowData)
    const { data } = await getUrl(rowData.icon)
    form.iconUrl = config.base_img.dev + data
  }
  visibleFlag.value = true
}

function onClose() {
  Object.assign(form, formDefault)
  visibleFlag.value = false
}

const parentIdList = ref<any>([])

const getList = async () => {
  const res = await getServeTypeTree()
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
  sort: undefined,
  remark: undefined,
  icon: '',
  iconUrl: '',
  isShowApp: '1'
})

let form = reactive({ ...formDefault })

const rules = reactive({
  parentId: [{ required: true, message: '请选择上级分类', trigger: 'blur' }],
  name: [{ required: true, message: '请输入分类名称', trigger: 'change' }],
  code: [{ required: true, message: '请输入标识码', trigger: 'change' }],
  remark: [{ required: true, message: '请输入描述', trigger: 'change' }],
  icon: [{ required: true, message: '请上传图标', trigger: 'change' }]
})

const handleImgSuccess = (data: any) => {
  form.icon = data.id.toString()
}
const handleImgRemove = () => {
  form.icon = ''
}

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
      await saveServeType(form)
      ElMessage.success('添加成功')
    } else {
      await updateServeType(form)
      ElMessage.success('修改成功')
    }
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
<style lang="less" scoped>
.el-upload__tip {
  color: #ccc;
}
.avatar-uploader-icon {
  background-color: #fff;
  font-size: 28px;
  color: #8c939d;
  width: 80px;
  height: 80px;
  text-align: center;
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
}
.avatar {
  width: 80px;
  height: 80px;
  display: block;
}
:deep(.el-upload-list--picture-card) {
  --el-upload-list-picture-card-size: 64px;
}
:deep(.el-upload--picture-card) {
  --el-upload-picture-card-size: 64px;
}
:deep(.disabled .el-upload--picture-card) {
  display: none;
}
</style>
