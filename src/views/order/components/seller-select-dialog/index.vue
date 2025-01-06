<template>
  <el-dialog destroy-on-close v-model="visibleFlag" title="选择服务商" width="888px" @close="onClose" :close-on-press-escape="false" :close-on-click-modal="false">
    <!-- 补录历史订单才有 (派单时间) -->
    <el-form class="flex" v-if="orderType === '3'" ref="formRef" :model="ruleForm" label-width="80px" :rules="rules">
      <el-form-item label="派单时间" prop="sendOrder">
        <el-date-picker v-model="ruleForm.sendOrder" type="datetime" placeholder="请选择派单时间" value-format="YYYY-MM-DD HH:mm" format="YYYY-MM-DD HH:mm" />
      </el-form-item>
      <el-form-item label="服务时间：" class="r-m-l-10">
        <div>{{ serveTime }}</div>
      </el-form-item>
    </el-form>

    <div style="margin-bottom: 10px" class="flex">
      <div class="flex row-between flex-wrap r-p-r-24">
        <el-input class="r-m-b-12" v-model="form.keyword" placeholder="搜索服务商名称/编号" clearable style="width: 420px">
          <template #suffix>
            <el-icon @click="getTableList"><search /></el-icon>
          </template>
        </el-input>
        <DictSelect class="r-m-b-12" width="240px" v-model="form.serveCategoryId" :distList="typeList" placeholder="服务类别" :clearable="true" @change="changeServeCategoryId" />
        <DictSelect width="330px" v-model="form.serveId" :distList="serveList" placeholder="服务项目" :clearable="true" @change="changeServeId" :disabled="!serveList.length" />
        <DictSelect width="330px" v-model="form.serveOptionId" :distList="serveOptionList" placeholder="服务子项" :disabled="!serveOptionList.length" :clearable="true" />
      </div>
      <div class="flex-col manual-button row-right col-bottom r-p-l-12">
        <el-button class="r-m-b-12" type="primary" @click="getTableList" style="width: 88px">查询</el-button>
        <el-button type="reset" @click="reset" style="width: 88px">重置</el-button>
      </div>
    </div>
    <el-table :data="tableData" v-loading="loading" header-row-class-name="table-header" style="max-height: calc(100vh - 500px); margin-bottom: 5px">
      <el-table-column fixed="left" label="序号" type="index" width="60" />
      <el-table-column fixed="left" label="操作" min-width="30" class-name="table-operation">
        <template #default="{ row }">
          <el-button link type="primary" @click="changeSeller(row.sellerId)"> 选择 </el-button>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip prop="sellerId" label="商户编号" min-width="70" />
      <el-table-column show-overflow-tooltip prop="sellerName" min-width="120" label="商户名称" />
    </el-table>
    <el-pagination
      class="r-m-t-20"
      v-model:current-page="form.pageNum"
      v-model:page-size="form.pageSize"
      :page-sizes="[10, 20, 50, 100, 200, 500]"
      layout="total, sizes, prev, pager, next"
      :total="total"
      @size-change="getTableList"
      @current-change="getTableList"
    />
  </el-dialog>
</template>
<script lang="ts" setup>
import { ref, reactive } from 'vue'
import DictSelect from '/@/components/DictSelect/index.vue'
import { getSellerInServePage, getServeTypeList } from '@/api/serviceProvider'
import { Search } from '@element-plus/icons-vue'
import { getOptionList, getServeInfoList } from '@/api/serviceProject'
import { setServeorderstatus } from '@/api/order'
import { resetQueryForm } from '@/utils'
import { ElMessageBox, ElMessage, FormRules } from 'element-plus'
import { getSystemTime } from '@/api'
import { formatTime } from '@/utils'
const emits = defineEmits(['reload-list'])
const visibleFlag = ref(false)
const loading = ref(false)
const serveorderId = ref()

const orderType = ref() //订单类型：3（补录历史订单）
const ruleForm = reactive<any>({ sendOrder: '' }) //派单时间
const serveTime = ref() // 服务时间

const validateSendOrder = (rule: any, value: any, callback: any) => {
  if (new Date(value).getTime() < new Date(serveTime.value).getTime()) {
    return callback()
  }
  return callback(new Error('派单时间需早于服务时间'))
}
const rules = reactive<FormRules>({
  sendOrder: [
    { required: true, message: '请选择派单时间', trigger: 'change' },
    { validator: validateSendOrder, trigger: 'change' }
  ]
})
const statusId = ref()
async function show(data, status) {
  getTypeList()

  orderType.value = data.orderType //订单类型
  serveTime.value = data.serveTime // 服务时间
  serveorderId.value = data.id
  statusId.value = status.id
  if (data.categoryId) {
    form.serveCategoryId = data.categoryId
    form.serveId = data.serveId
    form.serveOptionId = data.serveOptionId
    getServeList()
    getServeOptionList()
    getTableList()
    setTimeout(async () => {
      if (!tableData.value.length) {
        await ElMessageBox.confirm('当前服务暂无关联服务商，请手动搜索服务商名称，或联系招商部添加关联服务商!', '提示', {
          type: 'warning',
          showClose: false,
          closeOnClickModal: false,
          closeOnPressEscape: false
        }).finally(() => {
          resetQueryForm(form, { pageNum: 1, pageSize: 10 }, getTableList)
          serveList.value = []
          serveOptionList.value = []
          visibleFlag.value = true
        })
      } else {
        visibleFlag.value = true
      }
    }, 500)
  } else {
    getTableList()
    visibleFlag.value = true
  }

  const { data: systemTime } = await getSystemTime()
  ruleForm.sendOrder = formatTime(systemTime, 'yyyy-MM-dd HH:mm')
}

function onClose() {
  Object.assign(form, formDefault)
  serveorderId.value = undefined
  statusId.value = undefined
  visibleFlag.value = false
}

const formDefault = reactive({
  keyword: undefined,
  serveCategoryId: undefined,
  serveId: undefined,
  serveOptionId: undefined,
  pageNum: 1,
  pageSize: 10
})

let form = reactive<any>({ ...formDefault })

const tableData = ref([])
const total = ref(0)

async function getTableList() {
  loading.value = true
  const res = await getSellerInServePage(form)
  tableData.value = res.data.list
  total.value = res.data.total
  loading.value = false
}

// 服务类别
const typeList = ref<any>([])

const getTypeList = async () => {
  const res = await getServeTypeList()
  typeList.value = res.data.map((item) => {
    return {
      value: item.id,
      label: item.name
    }
  })
}

// 服务项目下拉数据
const serveList = ref<any>([])

const getServeList = async () => {
  if (!form.serveCategoryId) return
  const res = await getServeInfoList({ categoryId: form.serveCategoryId })
  serveList.value = res.data.map((item) => {
    return {
      value: item.id,
      label: item.name
    }
  })
}

// 服务子项下拉数据
const serveOptionList = ref<any>([])

const getServeOptionList = async () => {
  if (!form.serveId) return
  const res = await getOptionList({ serveId: form.serveId })
  serveOptionList.value = res.data.map((item) => {
    return {
      value: item.id,
      label: item.name
    }
  })
}

const changeServeCategoryId = () => {
  form.serveId = undefined
  form.serveOptionId = undefined
  serveList.value = []
  serveOptionList.value = []
  getServeList()
}

const changeServeId = () => {
  form.serveOptionId = undefined
  serveOptionList.value = []
  getServeOptionList()
}

const reset = () => {
  resetQueryForm(form, { pageNum: 1, pageSize: 10 }, getTableList)
}
const formRef = ref()
const changeSeller = async (sellerId) => {
  //判断是否选择了订单时间
  if (orderType.value === '3') {
    await formRef.value.validate()
    change(sellerId)
    return
  }
  change(sellerId)
}
const change = async (sellerId) => {
  const res: any = await setServeorderstatus({
    sendOrder: ruleForm.sendOrder || undefined,
    sellerId: sellerId,
    serveorderId: serveorderId.value,
    id: statusId.value
  })
  if (res.code == 200) {
    ElMessage.success('操作成功')
    emits('reload-list')
    onClose()
  } else {
    ElMessage.error(res.msg)
  }
}

defineExpose({
  show
})
</script>
<style lang="less" scoped>
.manual-button {
  border-left: 1px solid #ebe9e6;
}
</style>
