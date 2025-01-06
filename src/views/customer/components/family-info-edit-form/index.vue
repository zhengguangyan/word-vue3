<template>
  <el-row style="margin-bottom: 10px">
    <el-checkbox v-model="checkedExist" true-label="1" false-label="0" label="无家庭成员" :disabled="tableData.length || deathFlag == '0'" @change="exist" />
    <div class="about">
      <Icon icon="ant-design:question-circle-outlined" style="vertical-align: middle" />
      如无家庭成员，请选择
    </div>
  </el-row>
  <div v-if="checkedExist == '0'">
    <el-table
      :data="tableData"
      header-row-class-name="table-header"
      :style="{
        border: '1px solid #f5f3f0',
        borderRadius: '8px'
      }"
    >
      <el-table-column fixed="left" label="操作" width="110">
        <template #default="{ row }">
          <el-button link type="primary" size="small" @click="openEdit(row)" :disabled="deathFlag == '0'">修改</el-button>
          <el-popconfirm title="请确认是否永久删除该记录？" @confirm="delFamily(row.id)" :disabled="deathFlag == '0'">
            <template #reference>
              <el-button link type="primary" size="small">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip prop="name" label="姓名" width="150" fixed="left" />
      <el-table-column show-overflow-tooltip prop="sex" label="性别" width="100">
        <template #default="{ row }">
          {{ filterDict('vols_sex').find((item) => item.value == row.sex)?.label }}
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip prop="role" label="角色" width="150">
        <template #default="{ row }">
          {{ filterDict('family_role').find((item) => item.value == row.role)?.label }}
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip prop="phone" label="电话" width="180" />
      <el-table-column show-overflow-tooltip prop="age" label="年龄" width="150" />
      <el-table-column show-overflow-tooltip prop="workProperty" label="工作性质" width="180">
        <template #default="{ row }">
          <div class="line-1">{{ filterDict('work_Property').find((item) => item.value == row.workProperty)?.label }}</div>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip prop="workCompany" label="工作单位">
        <template #default="{ row }">
          {{ filterDict('work_unit').find((item) => item.value == row.workCompany)?.label }}
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip prop="incomeRange" label="收入范围" width="150">
        <template #default="{ row }">
          {{ filterDict('income_month').find((item) => item.value == row.incomeRange)?.label }}
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip prop="relation" label="与老人关系" width="150">
        <template #default="{ row }">
          {{ filterDict('elder_relation').find((item) => item.value == row.relation)?.label }}
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip prop="gohomeBend" label="回家频率" width="150">
        <template #default="{ row }">
          {{ filterDict('gohome_bend').find((item) => item.value == row.gohomeBend)?.label }}
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip prop="isRegister" label="在平台做过登记" width="150">
        <template #default="{ row }">
          {{ row.isRegister == '1' ? '是' : '否' }}
        </template>
      </el-table-column>
    </el-table>
    <p class="w-full mt-10px">
      <el-button :icon="Plus" type="primary" link @click="openAdd" :disabled="deathFlag == '0'"> 添加家庭成员 </el-button>
    </p>
  </div>

  <!-- 新增修改弹窗 -->
  <el-dialog
    destroy-on-close
    center
    v-model="addFamilyVisible"
    :title="isAdd ? '添加家庭信息' : '修改家庭信息'"
    width="500px"
    @close="closeAdd"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
  >
    <el-form ref="formRef" :model="form" :rules="xiamenFlag ? rules : rulesNotXiamen" label-width="130px">
      <el-form-item label="姓名" prop="name">
        <el-input v-model="form.name" placeholder="请输入姓名" clearable />
      </el-form-item>
      <el-form-item label="性别" prop="sex">
        <el-radio-group v-model="form.sex">
          <el-radio v-for="(item, index) in filterDict('vols_sex')" :key="index" :value="item.value">{{ item.label }} </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="角色" prop="role">
        <DictSelect v-model="form.role" placeholder="请选择角色" :distList="filterDict('family_role')" />
      </el-form-item>
      <el-form-item label="电话" prop="phone">
        <el-input v-model="form.phone" placeholder="请输入电话" clearable />
      </el-form-item>
      <el-form-item label="年龄" prop="age">
        <el-input v-model="form.age" placeholder="请输入年龄" clearable />
      </el-form-item>
      <el-form-item label="工作性质" prop="workProperty">
        <DictSelect v-model="form.workProperty" placeholder="请选择工作性质" :distList="filterDict('work_Property')" />
      </el-form-item>
      <el-form-item label="工作单位" prop="workCompany">
        <DictSelect v-model="form.workCompany" placeholder="请选择工作单位" :distList="filterDict('work_unit')" />
      </el-form-item>
      <el-form-item label="收入范围" prop="incomeRange">
        <DictSelect v-model="form.incomeRange" placeholder="请选择收入范围" :distList="filterDict('income_month')" />
      </el-form-item>
      <el-form-item label="与老人关系" prop="relation">
        <DictSelect v-model="form.relation" placeholder="请选择与老人关系" :distList="filterDict('elder_relation')" />
      </el-form-item>
      <el-form-item label="回家频率" prop="gohomeBend">
        <DictSelect v-model="form.gohomeBend" placeholder="请选择回家频率" :distList="filterDict('gohome_bend')" />
      </el-form-item>
      <el-form-item label="在平台做过登记" prop="isRegister">
        <el-radio-group v-model="form.isRegister">
          <el-radio value="1">是</el-radio>
          <el-radio value="2">否</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="closeAdd">取消</el-button>
        <el-button color="#ff9500" style="color: #fff" @click="submit" :loading="addFamilyLoading"> 确认{{ isAdd ? '新增' : '修改' }} </el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script lang="ts" setup>
import DictSelect from '@/components/DictSelect/index.vue'
import { Plus } from '@element-plus/icons-vue'
import { watch, ref } from 'vue'
import { getFamilyDetail, saveFamilyDetail, updateFamilyDetail, delFamilyDetailById, updateByIdAndIsLonely } from '@/api/customer/index'
import { reactive } from 'vue'
import { ElMessage, FormRules } from 'element-plus'
import { useCache } from '@/hooks/web/useCache'
const { wsCache } = useCache()

const props = defineProps({
  customer: {
    type: Object,
    default: null
  },
  dict: {
    type: Array,
    default: null
  },
  deathFlag: {
    type: String,
    default: null
  }
})
const xiamenFlag = ref(wsCache.get('xiamenFlag'))

const checkedExist = ref('')

const addFamilyVisible = ref(false)

const isAdd = ref(true)

const addFamilyLoading = ref(false)

const tableData = ref([])

const formRef = ref<any>()

let form = ref<any>({})

const rules = reactive<FormRules>({
  name: [{ required: true, message: '姓名不能为空', trigger: 'blur' }],
  role: [{ required: true, message: '请选择角色', trigger: 'change' }]
})

const rulesNotXiamen = reactive<FormRules>({
  name: [{ required: true, message: '姓名不能为空', trigger: 'blur' }],
  sex: [{ required: true, message: '请选择性别', trigger: 'change' }],
  role: [{ required: true, message: '请选择角色', trigger: 'change' }],
  phone: [{ required: true, message: '电话不能为空', trigger: 'blur' }],
  age: [{ required: true, message: '年龄不能为空', trigger: 'blur' }],
  workProperty: [{ required: true, message: '请选择工作性质', trigger: 'change' }],
  workCompany: [{ required: true, message: '请选择工作单位', trigger: 'change' }],
  incomeRange: [{ required: true, message: '请选择收入范围', trigger: 'change' }],
  relation: [{ required: true, message: '请选择与老人关系', trigger: 'change' }],
  gohomeBend: [{ required: true, message: '请选择回家频率', trigger: 'change' }],
  isRegister: [{ required: true, message: '请选择是否在平台做过登记', trigger: 'change' }]
})

async function queryInfo() {
  const res = await getFamilyDetail({ customerId: props.customer.id, pageSize: 100 })
  if (res) {
    tableData.value = res.data.list
  }
}
watch(
  () => props.customer,
  (e) => {
    if (e) {
      queryInfo()
      checkedExist.value = props.customer.isLonely || false
    }
  },
  { immediate: true }
)

const filterDict = (key: any) => {
  return (props.dict.find((item: any) => item.type == key) as any)?.list
}

// 打开新增弹窗
const openAdd = () => {
  addFamilyVisible.value = true
  form.value.customerId = props.customer.id
}

// 打开编辑弹窗
const openEdit = (data: any) => {
  isAdd.value = false
  form.value = { ...data, customerId: props.customer.id }
  addFamilyVisible.value = true
}

// 关闭新增弹窗
const closeAdd = () => {
  addFamilyVisible.value = false
  setTimeout(() => {
    addFamilyLoading.value = false
    isAdd.value = true
    form.value = {}
  }, 100)
}

// 添加家庭信息
const submit = async () => {
  formRef.value.validate(async (val) => {
    if (!val) return ElMessage.error('请完善必填信息')
    addFamilyLoading.value = true
    try {
      if (isAdd.value) {
        await saveFamilyDetail(form.value)
      } else {
        await updateFamilyDetail(form.value)
      }
      ElMessage.success('保存成功')
      closeAdd()
      queryInfo()
    } finally {
      addFamilyLoading.value = false
    }
  })
}

// 删除家庭信息
const delFamily = async (id: any) => {
  await delFamilyDetailById(id)
  ElMessage.success('删除成功')
  queryInfo()
}

const exist = async () => {
  await updateByIdAndIsLonely({ id: props.customer.id, isLonely: checkedExist.value })
}
</script>

<style scoped lang="less">
// :deep(.el-table__cell) {
//   text-align: center;
// }
.about {
  margin-left: 10px;
  line-height: 32px;
  color: #ccc !important;
}
</style>
