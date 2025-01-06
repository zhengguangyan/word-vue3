<template>
  <div class="top-box">
    <h2 class="title"> 服务属性 </h2>
    <el-button v-if="!isEdit" class="ml-2 edit" @click="edit">修改</el-button>
    <!-- <el-button v-else class="ml-2 edit" @click="detail">详情</el-button> -->
  </div>
  <div class="info-box main-text-color" v-if="!isEdit">
    <div class="info-item item-100">
      <span class="item-label">服务内容(服务子项)</span>
      <span class="item-content">{{ baseInfo?.serveOptionNames }}</span>
    </div>
    <div class="info-item item-100">
      <span class="item-label">服务范围</span>
      <span class="item-content">{{ baseInfo?.serveRange }}</span>
    </div>
    <div class="info-item item-100">
      <span class="item-label">常驻地址</span>
      <span class="item-content">{{ baseInfo?.resiCompleAddr }}</span>
    </div>
  </div>
  <el-form ref="formRef" v-else :model="baseInfo" label-width="145px" :validate-on-rule-change="false">
    <el-row>
      <el-col :span="24">
        <el-form-item prop="serviceSub" label="服务内容(服务子项)：">
          <el-input v-model="serviceSub" type="textarea" :rows="4" show-word-limit readonly />
          <el-button link type="primary" @click="openServe"> 选择 </el-button>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item prop="rangeCompleAddrList" label="服务范围：">
          <Cascader style="width: 100%" v-model="baseInfo.rangeCompleAddrList" check multiple placeholder="请选择服务范围" />
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="常驻地址：">
          <div class="flex" style="width: 100%">
            <Cascader class="r-m-r-10" v-model="baseInfo.resiList" width="calc(50% - 70px)" placeholder="请选择常驻地址" />
            <el-input class="r-m-r-10" style="width: calc(50% - 70px)" v-model="baseInfo.resiDetailAddr" placeholder="详细地址" />
            <div class="flex" style="height: 33.22px; width: 130px">
              <el-button link type="primary"> 获取位置 </el-button>
              <el-button link type="primary"> 预览位置 </el-button>
            </div>
          </div>
        </el-form-item>
      </el-col>
    </el-row>

    <el-space :size="12" class="r-m-t-20">
      <el-button type="primary" @click="save" :loading="saving"> 保存 </el-button>
      <el-button @click="cancel"> 取消 </el-button>
    </el-space>
  </el-form>

  <el-dialog destroy-on-close v-model="visibleServe" title="选择服务内容" width="700px" @close="onClose" :close-on-press-escape="false" :close-on-click-modal="false">
    <div>
      <el-input v-model="queryForm.keyword" style="width: 100%; margin-bottom: 12px" placeholder="模糊搜索服务类型/服务项目/服务子项" clearable @change="changeSize">
        <template #suffix>
          <el-icon><search /></el-icon>
        </template>
      </el-input>

      <el-table :data="tableData" ref="tableRef" header-row-class-name="table-header" style="height: 400px" @selection-change="handleSelectionChange" v-loading="loading" class-name="table-without-border" border>
        <el-table-column type="selection" width="40" />
        <el-table-column show-overflow-tooltip prop="serveCategoryName" label="服务类别" />
        <el-table-column show-overflow-tooltip prop="serveName" label="服务项目" />
        <el-table-column show-overflow-tooltip prop="name" label="服务子项" />
        <el-table-column show-overflow-tooltip prop="price" label="中心价格" />
      </el-table>
      <div style="margin: 20px 0">
        <el-pagination v-model:current-page="queryForm.pageNum" v-model:page-size="queryForm.pageSize" :page-sizes="[10, 20, 50, 100, 200, 500]" layout="total, sizes, prev, pager, next, jumper" :total="total" @size-change="changeSize" @current-change="getTableList" />
      </div>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="closeService">取消</el-button>
        <el-button type="primary" @click="changeService">添加</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script lang="ts" setup>
import Cascader from '/@/components/Cascader/index.vue'
import { Search } from '@element-plus/icons-vue'
import { ref, watch } from 'vue'
import { reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { getOperatorDetail, updateOperatorService } from '@/api/servicePersonnel'
import { computed } from 'vue'
import { getOptionPage } from '@/api/serviceProject'

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

const serviceSub = computed(() => {
  if (baseInfo.value.serveOptionList) {
    let str = ''
    baseInfo.value.serveOptionList.forEach((item) => {
      str += item.serveName + '-' + item.name + ';\n'
    })
    return str
  }
  return ''
})

const visibleServe = ref(false)

const tableData = ref([])

const loading = ref(false)

const multipleSelection = ref<any>([])

const handleSelectionChange = (val: any) => {
  multipleSelection.value = val
}

const closeService = () => {
  visibleServe.value = false
  multipleSelection.value = []
}

const changeService = () => {
  baseInfo.value.serveOptionList = [...multipleSelection.value]
  closeService()
}

const total = ref(0)

const queryFormDefault = {
  keyword: undefined,
  pageNum: 1,
  pageSize: 20,
  orderByColumn: undefined,
  asc: undefined
}
const queryForm = reactive<any>({ ...queryFormDefault })

async function getTableList() {
  loading.value = true
  const res = await getOptionPage(queryForm)
  tableData.value = res.data.list
  total.value = res.data.total
  loading.value = false
}

const changeSize = () => {
  queryForm.pageNum = 1
  getTableList()
}

const onClose = () => {
  visibleServe.value = false
}

const openServe = () => {
  visibleServe.value = true
  multipleSelection.value = [...baseInfo.value.serveOptionList]
  getTableList()
}

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
  if (!data.serveOptionList) {
    baseInfo.value.serveOptionList = []
  }
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

// const filterDict = (key: any) => {
//   return (props.dict.find((item: any) => item.type == key) as any)?.list
// }

// const renderDict = (key: any, dict: any) => {
//   if (!key) {
//     return
//   }
//   return filterDict(dict)
//     ?.filter((item: any) => key.includes(item.value))
//     .map((item: any) => item?.label)
//     .join('，')
// }

const save = async () => {
  saving.value = true
  try {
    const { msg } = await updateOperatorService(baseInfo.value)
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
  width: 100%;
  line-height: 23px;
  font-size: 14px;
  margin-bottom: 20px;
  display: flex;
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
</style>
