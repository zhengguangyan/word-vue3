<template>
  <el-dialog destroy-on-close v-model="visibleFlag" :title="form.id ? '编辑服务子项' : '添加服务子项'" width="1000px" @close="onClose" :close-on-press-escape="false" :close-on-click-modal="false">
    <el-form ref="formRef" v-loading="detailLoading" :model="form" :rules="rules" label-width="150px">
      <div class="form-item item-left">
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入名称" />
        </el-form-item>
      </div>
      <div class="form-item item-right">
        <el-form-item label="标识码" prop="code">
          <el-input v-model="form.code" placeholder="请输入标识码" />
        </el-form-item>
      </div>
      <div class="form-item item-left">
        <el-form-item label="工时（小时）">
          <el-input-number class="numberInput" v-model="form.hoursSubsidy" :controls="false" :min="0.5" :max="15" :precision="1" placeholder="工时补贴系统专用字段" />
          <p class="el-form-item__error" style="color: #ccc">输入范围0.5~15，若输入小数只允许X.5，X=0~14</p>
        </el-form-item>
      </div>
      <div class="form-item item-right">
        <el-form-item label="项目工时（小时）">
          <el-input-number class="numberInput" v-model="form.serveitemHours" :controls="false" :min="0.5" :max="15" :precision="1" placeholder="自建订单系统调用" />
          <p class="el-form-item__error" style="color: #ccc">输入范围0.5~15，若输入小数只允许X.5，X=0~14</p>
        </el-form-item>
      </div>
      <div class="form-item item-left">
        <el-form-item label="预计时长（小时）" prop="serviceTime">
          <el-input-number class="numberInput" v-model="form.serviceTime" :controls="false" :min="0.5" :max="15" :precision="1" placeholder="输入范围0.5~15" />
          <!-- <p class="el-form-item__error" style="color: #ccc;" >输入范围0.5~15，若输入小数只允许X.5，X=0~14</p> -->
        </el-form-item>
      </div>
      <div class="form-item item-right">
        <el-form-item label="服务子项市场价" prop="marketPrice">
          <el-input-number class="numberInput" v-model="form.marketPrice" :controls="false" :min="0" :precision="2" />
        </el-form-item>
      </div>
      <div class="form-item item-left">
        <el-form-item label="服务子项(中心价)" prop="price">
          <el-input-number class="numberInput" v-model="form.price" :controls="false" :min="0" :precision="2" />
        </el-form-item>
      </div>
      <div class="form-item item-right">
        <el-form-item label="服务最小数量" prop="minCount">
          <el-input-number class="numberInput" v-model="form.minCount" :controls="false" :min="1" :precision="0" />
        </el-form-item>
      </div>
      <div class="form-item item-left">
        <el-form-item label="服务最大数量" prop="maxCount">
          <el-input-number class="numberInput" v-model="form.maxCount" :controls="false" :min="1" :precision="0" />
        </el-form-item>
      </div>
      <div class="form-item item-right">
        <el-form-item label="服务最低价" prop="minCountPrice">
          <el-input-number class="numberInput" v-model="form.minCountPrice" :controls="false" :min="0" :precision="2" />
        </el-form-item>
      </div>
      <div class="form-item item-left">
        <el-form-item label="服务价格单位" prop="unit">
          <el-input v-model="form.unit" placeholder="请输入单位" />
        </el-form-item>
      </div>
      <div class="form-item item-right">
        <el-form-item label="365服务子项价格" prop="optionPrice">
          <el-input-number class="numberInput" v-model="form.optionPrice" :controls="false" :min="0" :precision="2" />
        </el-form-item>
      </div>
      <div class="form-item item-left">
        <el-form-item label="365服务子项最低价" prop="minOptionPrice">
          <el-input-number class="numberInput" v-model="form.minOptionPrice" :controls="false" :min="0" :precision="2" />
        </el-form-item>
      </div>
      <div class="form-item item-100">
        <el-form-item label="在 APP 显示">
          <el-radio-group v-model="form.showOnApp">
            <el-radio value="1">是</el-radio>
            <el-radio value="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
      </div>
      <div class="form-item item-100">
        <el-form-item label="图片" prop="appPhotoUrl">
          <div class="flex col-bottom" style="width: 100%">
            <ImgUpload v-model="form.appPhotoUrl" show-limit @success="handleImgSuccess" @remove="handleImgRemove" />
            <div class="gray-tip r-m-l-40" style="left: 130px">请上传宽高比例为1:1的图片</div>
          </div>
        </el-form-item>
      </div>
      <div class="form-item item-100">
        <el-form-item label="服务介绍" prop="content">
          <Editor v-model="form.content" ref="editorRef" style="width: 100%" :height="300" />
        </el-form-item>
      </div>
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
import { config } from '@/config/axios/config'
import Editor from '../../../Components/Editor/Editor.vue'
import { addOption, updateOption, getOptionDetail } from '@/api/serviceProject'
import ImgUpload from '../img-upload/index.vue'

const emits = defineEmits(['reload-list'])

const visibleFlag = ref(false)

const loading = ref(false)

const detailLoading = ref(false)

const show = async (serveId, data) => {
  form.serveId = serveId
  if (data != null) {
    getDetail(data.id)
  }
  visibleFlag.value = true
}

const getDetail = async (id) => {
  detailLoading.value = true
  try {
    const { data } = await getOptionDetail(id)
    if (!data.content) {
      data.content = ''
    }
    if (data.appPhotoUrl) {
      data.appPhotoUrl = config.base_img.dev + data.appPhotoUrl
    }
    Object.assign(form, data)
  } finally {
    detailLoading.value = false
  }
}

function onClose() {
  Object.assign(form, formDefault)
  visibleFlag.value = false
}

const handleImgSuccess = (data: any) => {
  form.appPhoto = data.id.toString()
}
const handleImgRemove = () => {
  form.appPhoto = ''
}

const formDefault = reactive({
  id: undefined,
  serveId: undefined,
  name: undefined,
  code: undefined,
  hoursSubsidy: undefined,
  serveitemHours: undefined,
  serviceTime: undefined,
  marketPrice: undefined,
  price: undefined,
  maxCount: undefined,
  minCount: undefined,
  minCountPrice: undefined,
  unit: undefined,
  optionPrice: undefined,
  minOptionPrice: undefined,
  showOnApp: undefined,
  appPhoto: '',
  appPhotoUrl: '',
  content: undefined
})

let form = reactive({ ...formDefault })

const rules = reactive({
  name: [
    {
      required: true,
      pattern: /^[\u4e00-\u9fa5a-zA-Z0-9]{1,15}$/,
      message: '请正确输入名称',
      trigger: 'change'
    }
  ],
  code: [{ required: true, message: '请输入标识码', trigger: 'change' }],
  marketPrice: [{ required: true, message: '请输入服务子项市场价', trigger: 'change' }],
  minCountPrice: [{ required: true, message: '请输入服务最低价', trigger: 'change' }],
  maxCount: [{ required: true, message: '请输入服务最大数量', trigger: 'change' }],
  minCount: [{ required: true, message: '请输入服务最小数量', trigger: 'change' }],
  minOptionPrice: [{ required: true, message: '请输入365服务子项最低价', trigger: 'change' }],
  optionPrice: [{ required: true, message: '请输入365服务子项价格', trigger: 'change' }],
  price: [{ required: true, message: '请输入服务子项(中心价)', trigger: 'change' }],
  unit: [{ required: true, message: '请输入服务价格单位', trigger: 'change' }],
  serviceTime: [{ required: true, message: '预计时长不可为空', trigger: 'change' }]
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
      await addOption(form)
      ElMessage.success('添加成功')
    } else {
      await updateOption(form)
      ElMessage.success('编辑成功')
    }
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
.form-item {
  position: relative;
  width: 50%;
  display: inline-block;
  &.item-left {
    padding-right: 10px;
  }
  &.item-right {
    padding-left: 10px;
  }
}
.item-100 {
  width: 100%;
}
.numberInput {
  width: 100%;
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
:deep(.el-input-number .el-input__inner) {
  text-align: left;
}
:deep(.el-upload-list--picture-card) {
  --el-upload-list-picture-card-size: 80px;
}
:deep(.el-upload--picture-card) {
  --el-upload-picture-card-size: 80px;
}
:deep(.disabled .el-upload--picture-card) {
  display: none;
}
</style>
