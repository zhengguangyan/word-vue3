<template>
  <el-dialog destroy-on-close v-model="visibleFlag" title="挂失/解除绑定" width="508px" @close="onClose" :close-on-press-escape="false" :close-on-click-modal="false">
    <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
      <el-form-item label="卡号">
        <span>{{ form.code }}</span>
      </el-form-item>
      <el-form-item label="状态" prop="lossStatus">
        <DictSelect width="195px" v-model="form.lossStatus" :distList="statusList" :clearable="false" />
        <span class="statusTip">(现为“{{ renderDict(form.status, 'subsidy_card_using_status') }}”状态)</span>
      </el-form-item>
      <el-form-item label="卡类别">
        {{ renderDict(form.type, 'card_type') }}
      </el-form-item>
      <el-form-item label="内码">
        <span>{{ form.internalCode }}</span>
      </el-form-item>
      <el-form-item label="图片">
        <el-image
          v-for="(item, index) in imgList"
          :key="index"
          :src="item"
          :initial-index="index"
          :preview-src-list="imgList"
          fit="fill"
          preview-teleported
          class="img-size"
        ></el-image>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="form.remark" :rows="3" type="textarea" placeholder="请输入挂失/解除绑定说明" />
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
import { ref, reactive, computed } from 'vue'
import { ElMessage, FormRules } from 'element-plus'
import { lossOrRemoveCard } from '@/api/subsidy'
import DictSelect from '/@/components/DictSelect/index.vue'
import { renderDict } from '@/hooks/web/useDict'

const statusList = ref([
  { value: '3', label: '挂失' },
  { value: '1', label: '解除绑定' }
])

const emits = defineEmits(['reload-list'])

const visibleFlag = ref(false)

const loading = ref(false)

const show = async (data) => {
  Object.assign(form, data)
  visibleFlag.value = true
}

const rules = reactive<FormRules>({
  lossStatus: [{ required: true, message: '请选择状态', trigger: 'change' }],
  remark: [{ required: true, message: '请输入挂失/解除绑定说明', trigger: 'change' }]
})

function onClose() {
  Object.assign(form, formDefault)
  visibleFlag.value = false
}

const formDefault = reactive({
  code: undefined,
  lossStatus: '3',
  attachList: [],
  type: undefined,
  customerId: undefined,
  remark: undefined,
  status: undefined,
  subsidyCustomerId: undefined,
  subsidyInfoId: undefined
})

const form = reactive<any>({ ...formDefault })

const imgList = computed(() => {
  if (!(form.attachList && form.attachList.length)) return []
  return form.attachList.map((item) => item.url)
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
    await lossOrRemoveCard({
      cardId: form.cardId,
      customerId: form.customerId,
      subsidyCustomerId: form.subsidyCustomerId,
      subsidyInfoId: form.id,
      remark: form.remark,
      status: form.lossStatus
    })
    ElMessage.success(form.lossStatus == '1' ? '解除绑定成功' : '挂失成功')
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
:deep(.el-dialog__body) {
  padding-top: 10px !important;
}
:deep(.el-input-group__prepend) {
  background: none !important;
  border: 0 !important;
  box-shadow: none !important;
  padding: 0 40px 0 0 !important;
  color: #666462;
}
.statusTip {
  padding-left: 8px;
  font-size: 14px;
  color: #999693;
}
.img-size {
  display: inline-block;
  height: 80px;
  width: 80px;
  border: 1px solid #eceaea;
  margin: 0 10px 10px 0;
  border-radius: 4px;
}
</style>
