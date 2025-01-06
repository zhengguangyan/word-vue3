<template>
  <div class="top-box">
    <h2 class="title"> 个人信息 </h2>
    <el-button v-if="!isEdit" class="ml-2 edit" @click="edit">修改</el-button>
    <!-- <el-button v-else class="ml-2 edit" @click="detail">详情</el-button> -->
  </div>
  <div class="info-box main-text-color" v-if="!isEdit">
    <div class="info-item">
      <span class="item-label">出生日期</span>
      <span class="item-content">{{ baseInfo.birthday }}</span>
    </div>
    <div class="info-item">
      <span class="item-label">荣誉证书</span>
      <span class="item-content">{{ renderDict(baseInfo?.livingDemand, 'certificate') }}</span>
    </div>
    <div class="info-item item-100">
      <span class="item-label">户籍地址</span>
      <span class="item-content">{{ baseInfo?.address }}</span>
    </div>
    <div class="info-item item-100">
      <span class="item-label">专业技能(特长)</span>
      <span class="item-content">{{ renderDict(baseInfo?.domesticDemand, 'profession_skill') }}</span>
    </div>
    <div class="info-item item-100">
      <span class="item-label">个人备注</span>
      <span class="item-content">{{ baseInfo.remark }}</span>
    </div>
  </div>

  <el-form ref="formRef" v-else :model="baseInfo" label-width="116px" :validate-on-rule-change="false">
    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="出生日期：" prop="birthday">
          <el-date-picker v-model="baseInfo.birthday" type="date" placeholder="出生日期" style="width: 100%" value-format="YYYY-MM-DD" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="荣誉证书：" prop="name">
          <DictSelect width="100%" v-model="baseInfo.livingDemand" placeholder="请选择(多选)" :distList="filterDict('certificate')" :multiple="true" :zero="true" :tags="2" />
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="户籍地址：" prop="domicileList">
          <Cascader width="100%" check v-model="baseInfo.domicileList" placeholder="请选择户籍地址" />
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="专业技能(特长)：" prop="name">
          <DictSelect width="100%" v-model="baseInfo.domesticDemand" placeholder="请选择(多选)" :distList="filterDict('profession_skill')" :multiple="true" :tags="4" :zero="true" />
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="个人备注：" prop="remark">
          <el-input v-model="baseInfo.remark" placeholder="请输入个人备注" type="textarea" :rows="4" maxlength="800" show-word-limit />
        </el-form-item>
      </el-col>
    </el-row>
    <el-space :size="12" class="r-m-t-20">
      <el-button type="primary" @click="save" :loading="saving"> 保存 </el-button>
      <el-button @click="cancel"> 取消 </el-button>
    </el-space>
  </el-form>
</template>
<script lang="ts" setup>
import DictSelect from '/@/components/DictSelect/index.vue'
import Cascader from '/@/components/Cascader/index.vue'
import { ref, watch } from 'vue'
import { getOperatorDetail, updateOperatorPerson } from '@/api/servicePersonnel'
import { ElMessage } from 'element-plus'

const props = defineProps({
  customerId: {
    type: Number,
    default: null
  },
  dict: {
    type: Array,
    default: null
  },
  dataChangeFlag: {
    type: Boolean,
    default: false
  }
})
const isEdit = ref(false)

const saving = ref(false)

const edit = () => {
  isEdit.value = true
}

// const detail = async () => {
//   if (!props.dataChangeFlag) {
//     cancel()
//     return
//   }
//   await ElMessageBox.confirm('存在未保存的修改内容，确认是否跳转至详情页面？', '编辑未保存', {
//     confirmButtonText: '取消跳转',
//     cancelButtonText: '不保存',
//     type: 'warning',
//     distinguishCancelAndClose: true,
//     showClose: false,
//     closeOnClickModal: false,
//     closeOnPressEscape: false
//   })
//     .then((_action) => {
//       return Promise.reject()
//     })
//     .catch((action) => {
//       if (action === 'cancel') {
//         cancel()
//         return true
//       }
//       return Promise.reject()
//     })
// }

const cancel = () => {
  isEdit.value = false
  queryInfo()
}

let baseInfo = ref<any>({})

async function queryInfo() {
  const { data } = await getOperatorDetail(props.customerId)
  baseInfo.value = data
  setTimeout(() => {
    emits('handle-data-change', false)
  }, 10)
}

watch(
  () => props.customerId,
  (e) => {
    if (e) {
      queryInfo()
    }
  },
  { immediate: true }
)

const emits = defineEmits(['handle-data-change'])

watch(
  () => baseInfo.value,
  (_newValue, _oldValue) => {
    emits('handle-data-change', true)
  },
  { deep: true }
)

const filterDict = (key: any) => {
  return (props.dict.find((item: any) => item.type == key) as any)?.list
}

const renderDict = (key: any, dict: any) => {
  if (!key) {
    return
  }
  return filterDict(dict)
    ?.filter((item: any) => key.includes(item.value))
    .map((item: any) => item?.label)
    .join('，')
}

const save = async () => {
  saving.value = true
  try {
    const { msg } = await updateOperatorPerson(baseInfo.value)
    ElMessage.success(msg)
    cancel()
  } finally {
    saving.value = false
  }
}
</script>

<style scoped lang="less">
.top-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  .edit {
    color: var(--el-color-primary-light-3);
    border: 1px solid var(--el-color-primary-light-3);
  }
}
.info-box {
  display: flex;
  flex-wrap: wrap;
}
.info-box:not(:empty) {
  margin-bottom: 10px;
}
.info-item {
  width: 50%;
  line-height: 23px;
  font-size: 14px;
  margin-bottom: 20px;
  padding-right: 30px;
  display: flex;
  align-items: center;

  .item-label {
    text-align: left;
    margin-right: 5px;
    flex-shrink: 0;
    &::after {
      content: ' :';
    }
  }
  .item-content {
    width: calc(100% - 100px);
    padding-right: 40px;
  }
}
.item-100 {
  width: 100% !important;
}
.item-top {
  align-items: start;
}
</style>
