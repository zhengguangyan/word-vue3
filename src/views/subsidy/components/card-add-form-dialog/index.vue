<template>
  <el-dialog destroy-on-close v-model="visibleFlag" title="新增卡号" width="640px" @close="onClose" :close-on-press-escape="false" :close-on-click-modal="false">
    <el-form class="r-p-b-20" ref="formRef" :model="form" :rules="rules" label-width="100px">
      <el-form-item label="卡类别" prop="type">
        <DictSelect width="100%" v-model="form.type" :distList="filterDict('card_type')" placeholder="卡类别" :clearable="true" />
      </el-form-item>
      <el-form-item label="状态">
        <DictSelect width="100%" v-model="form.status" :distList="filterDict('subsidy_card_using_status')" placeholder="卡类别" :disabled="true" />
      </el-form-item>
      <el-form-item label="卡号、内码" prop="cards">
        <el-input v-model="form.cards" :rows="3" type="textarea" placeholder="每行1个卡号(12位英文、数字)加1个内码(32位英文、数字)，卡号和内码使用英文逗号隔开。均唯一、且一一对应，" @blur="onBlur" />
        <p class="tip" style="color: #999693">
          已添加<span>{{ cardCount }}</span
          >个卡号
        </p>
        <p v-if="errMsg" class="tip link" @click="errVisible = true">{{ errMsg }}</p>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="onClose">取消</el-button>
        <el-button type="primary" :loading="loading" @click="onSubmit">确认</el-button>
      </span>
    </template>
  </el-dialog>

  <el-dialog destroy-on-close v-model="errVisible" title="错误卡号、内码信息" width="640px" :close-on-press-escape="false" :close-on-click-modal="false">
    <div>
      <div v-for="e in errNumber.split('/r/n')" :key="e">{{ e }}</div>
    </div>
  </el-dialog>
</template>
<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import DictSelect from '/@/components/DictSelect/index.vue'
import { saveSubsidyCard } from '@/api/subsidy'

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

const show = async () => {
  visibleFlag.value = true
  errMsg.value = ''
}

const errMsg = ref('')
const errNumber = ref('')
const errVisible = ref(false)

function onClose() {
  Object.assign(form, formDefault)
  cardCount.value = 0
  visibleFlag.value = false
}

const formDefault = reactive({
  id: undefined,
  type: undefined,
  status: '1',
  cards: undefined
})

let form = reactive<any>({ ...formDefault })

const cardCount = ref(0)
const cardValidFlag = ref(true)
const cardList = ref<any>([])
function onBlur() {
  cardCount.value = (form.cards.match(/\n/g) || []).length + 1
  const lines = form.cards.split('\n')
  cardList.value = form.cards.split('\n')
  cardValidFlag.value = lines.every((line) => {
    const [code, internalCode] = line.split(',')

    if (!code || !internalCode) {
      return false
    }

    return code.length === 12 && internalCode.length === 32
  })
}

const rules = reactive({
  type: [{ required: true, message: '请选择卡类别', trigger: 'change' }],
  cards: [
    {
      required: true,
      message: '请输入卡号、内码',
      trigger: ['blur', 'change']
    },
    {
      pattern: /^[A-Za-z0-9\n,]*$/,
      message: '输入格式错误。卡号（12位英文、数字）+内码（32位英文、数字）',
      trigger: ['blur', 'change']
    }
  ]
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
    await saveSubsidyCard({ ...form, cards: cardList.value })
    ElMessage.success('添加成功')
    emits('reload-list')
    onClose()
  } catch (e: string | any) {
    // ElMessage.closeAll()
    if (e?.includes('：')) {
      const [msg, number] = e.split('：')
      errMsg.value = msg
      errNumber.value = number
      loading.value = false
      return
    }
    loading.value = false
    ElMessage.error(e)
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
.tip {
  width: 100%;
  margin: 5px 0;
  line-height: 18px;
  color: #e96848;
}
.tip span {
  color: #ff9500;
}

.link {
  text-decoration: underline;
}
</style>
