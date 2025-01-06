<template>
  <el-dialog
    destroy-on-close
    v-model="visibleFlag"
    title="批量绑定养老卡"
    width="500px"
    @close="onClose"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
  >
    <p style="margin-bottom: 5px; font-size: 14px; color: #999">
      请输入身份证号码、养老卡卡号(每行1个身份证号码、1个养老卡号，中间使用英文逗号隔开，均唯一、且-一对应，单次最多500行)
    </p>
    <el-form ref="formRef" :model="form" :rules="rules" label-width="0px">
      <el-form-item prop="remark">
        <el-input
          v-model="form.remark"
          :rows="10"
          type="textarea"
          placeholder="每行1个身份证号码，养老卡号，中间英文逗号隔开，单次最多500行"
          @blur="onBlur"
        />
        <p class="tip" style="color: #999693">
          已添加<span>{{ cardCount }}</span
          >个卡号
        </p>
        <!-- <p class="tip" v-if="!cardValidFlag">
          部分行格式错误，身份证号码为15或18位，养老卡卡号为12位,请检查已输的内容
        </p> -->
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="onClose">取消</el-button>
        <el-button type="primary" :disabled="!form.remark" :loading="loading" @click="onSubmit">
          确认
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { subsidyCardBatchBind } from '@/api/subsidy'

const emits = defineEmits(['reload-list'])

const props = defineProps({
  id: {
    type: Number,
    default: null
  }
})

const visibleFlag = ref(false)

const loading = ref(false)

const show = async () => {
  // Object.assign(form, rowData)
  visibleFlag.value = true
}

function onClose() {
  Object.assign(form, formDefault)
  visibleFlag.value = false
}

const rules = reactive({
  remark: [
    {
      required: true,
      message: '请输入身份证号码、养老卡卡号',
      trigger: ['blur', 'change']
    },
    {
      pattern: /^[A-Za-z0-9\n,]*$/,
      message: '格式错误，身份证号码为15或18位，养老卡卡号为12位，请检查已输入的内容',
      trigger: ['blur', 'change']
    }
  ]
})

const cardCount = ref(0)
const cardList = ref<any>([])
const cardValidFlag = ref(true)
function onBlur() {
  cardCount.value = (form.remark.match(/\n/g) || []).length + 1
  const lines = form.remark.split('\n')
  cardList.value = form.remark.split('\n')
  cardValidFlag.value = lines.every((line) => {
    const [idcard, subsidyCard] = line.split(',')

    if (!idcard || !subsidyCard) {
      return false
    }

    return (idcard.length === 15 || idcard.length === 18) && subsidyCard.length === 12
  })
}

const formDefault = reactive({
  remark: ''
})

let form = reactive<any>({ ...formDefault })

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
    await subsidyCardBatchBind({
      id: props.id,
      idCardAndSubsidyCards: form.remark.split('\n')
    })
    ElMessage.success('批量添加成功')
    loading.value = false
    emits('reload-list')
    onClose()
  } catch (error) {
    loading.value = false
  }
}

defineExpose({
  show
})
</script>
<style lang="less" scoped>
:deep(.el-dialog__body) {
  padding-top: 10px !important;
}
.tip {
  width: 100%;
  margin: 5px 0;
  line-height: 18px;
  color: #e96848;
}
.tip span {
  color: #ff9500;
}
</style>
