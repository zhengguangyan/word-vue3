<template>
  <el-form ref="formRef" :model="careinfo" label-width="102px" :rules="!careinfo.reserveTime ? rules : specRules" :validate-on-rule-change="false">
    <el-form-item label="归属项目" prop="belongProjectType">
      <el-select v-model="careinfo.belongProjectType" placeholder="请选择项目" style="width: 250px" @change="careinfo.belongProjectid = undefined">
        <el-option v-for="item in filterDict('project_type')" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
      <el-button link type="primary" v-if="careinfo.belongProjectType === '9' && !careinfo.orderNumber" style="margin-left: 5px" @click="showOrderDialog"> 选择订单 </el-button>
    </el-form-item>
    <el-form-item label="订单编号" prop="orderNumber" :rules="{ required: true, message: '请选择自建订单', trigger: 'change' }" v-if="careinfo.belongProjectType === '9'">
      <span>{{ careinfo.orderNumber }}</span>
      <el-button link type="primary" v-if="careinfo.orderNumber" style="margin-left: 5px" @click="showOrderDialog"> 修改 </el-button>
    </el-form-item>
    <!-- 归属项目选择了服务包后才有 -->
    <el-form-item label="归属项目名称" prop="belongProjectid" :rules="{ required: true, message: '请选择所属项目名称', trigger: 'change' }" v-if="careinfo.belongProjectType == 2">
      <el-select v-model="careinfo.belongProjectid" placeholder="请选择归属项目名称" style="width: 250px">
        <el-option v-for="item in servePacketList" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
    </el-form-item>
    <!-- 归属项目选择了关怀包后才有 -->
    <el-form-item label="归属项目名称" prop="belongProjectName" :rules="{ required: true, message: '请选择所属项目名称', trigger: 'change' }" v-if="careinfo.belongProjectType == 7">
      <el-select v-model="careinfo.belongProjectName" placeholder="请选择归属项目名称" style="width: 250px">
        <el-option v-for="item in filterDict('carePackage_type')" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
    </el-form-item>
    <el-form-item label="关怀内容" prop="careContent">
      <el-input v-model="careinfo.careContent" type="textarea" style="max-width: 766px" maxlength="1500" show-word-limit />
    </el-form-item>
    <el-form-item label="备注">
      <el-input v-model="careinfo.careComment" type="textarea" style="max-width: 766px" maxlength="300" show-word-limit />
    </el-form-item>
    <!-- <el-form-item label="是否结案" prop="isClosed">
      <el-radio-group v-model="careinfo.isClosed">
        <el-radio :value="1">是</el-radio>
        <el-radio :value="0">否</el-radio>
      </el-radio-group>
    </el-form-item> -->
    <el-form-item label="是否接通" prop="isConnect">
      <el-radio-group v-model="careinfo.isConnect" @change="changeIsCon">
        <el-radio :value="1">是</el-radio>
        <el-radio :value="0">否</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="是否空号" prop="isEmptynumber" v-if="careinfo.isConnect == 0">
      <el-radio-group v-model="careinfo.isEmptynumber">
        <el-radio :value="1">是</el-radio>
        <el-radio :value="0">否</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item prop="isReturnMe" label="是否由我回访" span="3">
      <el-radio-group v-model="careinfo.isReturnMe">
        <el-radio :value="1">是</el-radio>
        <el-radio :value="0">否</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="下次回访日期" prop="reserveTime">
      <el-date-picker value-format="YYYY-MM-DD HH:mm:ss" v-model="careinfo.reserveTime" type="datetime" />
      <!-- <el-checkbox v-model="careinfo.isReturnMe" label="由我访问" style="margin-left: 20px" /> -->
    </el-form-item>
    <h4 class="title" style="margin: 24px 0 16px; font-weight: 600">历史关怀</h4>
    <el-table
      :data="historyCareinfoList"
      header-row-class-name="table-header"
      :style="{
        width: 'calc(100vw - 255px)',
        border: '1px solid #f5f3f0',
        borderRadius: '8px'
      }"
      max-height="200"
    >
      <el-table-column type="index" />
      <el-table-column label="操作" width="100">
        <template #default="{ row }">
          <el-button link type="primary" size="small" @click="detail(row)"> 查看 </el-button>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip prop="careNo" min-width="160" label="关怀编号" />
      <el-table-column show-overflow-tooltip prop="callTime" min-width="170" label="外呼时间" />
      <el-table-column show-overflow-tooltip prop="creatorName" min-width="160" label="归属客服" />
      <el-table-column show-overflow-tooltip prop="isClosed" min-width="100" label="是否结案">
        <template #default="{ row }">
          {{ row.isClosed == null ? '' : row.isClosed == 1 ? '是' : '否' }}
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip prop="reserveTime" min-width="170" label="预定关怀时间">
        <template #default="{ row }">
          {{ formatDateString(row.reserveTime) }}
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip prop="reserveUserName" min-width="180" label="预定关怀客服" />
    </el-table>
  </el-form>
  <div class="button-box">
    <el-button type="primary" @click="submit" :loading="saving">保存</el-button>
    <el-button @click="onBack">取消</el-button>
    <span class="tips">
      <Icon icon="mdi:about-circle-outline" style="vertical-align: middle" />
      若要自动关联通话录音，请在通话挂断后再点击添加（录音在通话挂断后才会生成），通话挂断前点击添加，关联的录音将不正确！
    </span>
  </div>

  <staffappOrderSelectDialog ref="staffappOrderSelectRef" @change="staffappOrderSelectChange" />
</template>

<script lang="ts" setup>
import { saveCareinfo, getCareinfoList } from '@/api/careinfo'
import { onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { reactive } from 'vue'
import { formatDateString } from '@/utils'
import staffappOrderSelectDialog from './staffapp-order-select-dialog.vue'
import { filterDict } from '@/hooks/web/useDict'
import { servePacketCustomerList } from '@/api/servePacket'
const props = defineProps({
  customerId: {
    type: Number,
    default: null
  },
  serviceType: {
    type: String,
    default: 'consult'
  }
})

const emits = defineEmits(['clear-phone'])

const { back, push } = useRouter()

function onBack() {
  onClear()
  back()
}

const onClear = () => {
  careinfo.value = { customerId: props.customerId }
  formRef.value?.resetFields()
  // emits('clear-phone')
}

function detail(row) {
  push(`/careinfo/detail?id=${row.id}`)
}
// 服务包数据
const servePacketList = ref<any>([])
const getServePacketList = async () => {
  const { data } = await servePacketCustomerList({
    customerId: props.customerId,
    // servePacketFinishStatusList: ['1', '2'],
    usingStatusList: ['1', '2']
  })
  servePacketList.value = data.map((item) => {
    return {
      value: item.servePacketId,
      label: item.servePacketName
    }
  })
}
const saving = ref(false)

const careinfo = ref<any>({})

const formRef = ref()

const rules = reactive<any>({
  phone: [
    {
      required: true,
      pattern: /^(1[3-9]\d{9}|0\d{2,3}-\d{7,8}|0\d{2,3}\d{7,8})$/,
      message: '请填写正确联系电话',
      trigger: 'blur'
    }
  ],
  belongProjectType: [{ required: true, message: '请选择所属项目', trigger: 'change' }],
  careContent: [{ required: true, message: '请填写关怀内容', trigger: 'blur' }],
  isConnect: [{ required: true, message: '请选择是否接通', trigger: 'change' }],
  isClosed: [{ required: true, message: '请选择是否接通', trigger: 'change' }],
  isEmptynumber: [{ required: true, message: '请选择是否空号', trigger: 'change' }]
})

const specRules = reactive<any>({
  phone: [
    {
      required: true,
      pattern: /^(1[3-9]\d{9}|0\d{2,3}-\d{7,8}|0\d{2,3}\d{7,8})$/,
      message: '请填写正确联系电话',
      trigger: 'blur'
    }
  ],
  belongProjectType: [{ required: true, message: '请选择所属项目', trigger: 'change' }],
  careContent: [{ required: true, message: '请填写关怀内容', trigger: 'blur' }],
  isConnect: [{ required: true, message: '请选择是否接通', trigger: 'change' }],
  isClosed: [{ required: true, message: '请选择是否接通', trigger: 'change' }],
  isEmptynumber: [{ required: true, message: '请选择是否空号', trigger: 'change' }],
  isReturnMe: [{ required: true, message: '请选择是否由我回访', trigger: 'blur' }]
})

const historyCareinfoList = ref([])

const submit = async () => {
  await formRef.value.validate((valid) => {
    if (valid) {
      save()
    } else {
      ElMessage.error('请确认必填参数填写正确')
    }
  })
}

const save = async () => {
  saving.value = true
  try {
    await saveCareinfo(careinfo.value)
    ElMessage.success('新增成功')
    onClear()
    getHistoryCareinfoList()
  } finally {
    saving.value = false
  }
}

const changeIsCon = (data) => {
  if (data) {
    careinfo.value.isEmptynumber = null
  }
}

async function getHistoryCareinfoList() {
  const result: any = await getCareinfoList({ customerId: props.customerId })
  historyCareinfoList.value = result.data
}

const staffappOrderSelectRef = ref()
const showOrderDialog = () => {
  staffappOrderSelectRef.value?.show(props.customerId)
}

const staffappOrderSelectChange = (orderNumber) => {
  careinfo.value.orderNumber = orderNumber
}

watch(
  () => [{ ...props }],
  () => {
    careinfo.value.customerId = props.customerId
    getHistoryCareinfoList()
  },
  { immediate: true }
)

onMounted(() => {
  getServePacketList()
})
</script>

<style scoped lang="less">
.tips {
  margin-left: 40px;
  color: #e96848;
  font-size: 14px;
}
.button-box {
  margin: 20px 0;
  display: flex;
  align-items: center;
}
:deep(.el-form-item--default .el-form-item__label) {
  white-space: nowrap;
}
</style>
