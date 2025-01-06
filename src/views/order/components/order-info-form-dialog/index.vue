<template>
  <el-dialog v-model="visibleFlag" title="编辑订单信息" width="900px" :close-on-press-escape="false" :close-on-click-modal="false" destroy-on-close @close="onClose">
    <el-form ref="formRef" :model="form" label-width="110px" :rules="rules">
      <!-- 已接单的情况下展示才能操作 -->
      <el-form-item label="服务商" v-if="!form.operatorSellerName && form.statusCode === '5'">
        <div class="flex" style="width: 100%">
          <el-input v-model="form.sellerName" placeholder="请选择服务商" readonly clearable></el-input>
          <el-button class="r-m-l-10" type="primary" link @click="selectSellerName">选择</el-button>
        </div>
      </el-form-item>

      <el-form-item label="预约服务时间">
        <el-date-picker
          v-model="form.serveTime"
          type="datetime"
          placeholder="预约服务时间"
          value-format="YYYY-MM-DD HH:mm"
          format="YYYY-MM-DD HH:mm"
          time-format="HH:mm"
          clearable
          style="width: 265px"
        />
      </el-form-item>
      <el-form-item label="上门回访时间">
        <el-space>
          <el-date-picker v-model="form.shangmenTime" type="datetime" placeholder="上门回访时间" value-format="YYYY-MM-DD HH:mm" format="YYYY-MM-DD HH:mm" time-format="HH:mm" style="width: 265px" />
          <el-checkbox v-model="form.isShangMen" label="由我访问" />
        </el-space>
      </el-form-item>
      <el-form-item label="满意度回访时间">
        <el-space>
          <el-date-picker v-model="form.manyiduTime" value-format="YYYY-MM-DD HH:mm" format="YYYY-MM-DD HH:mm" time-format="HH:mm" type="datetime" placeholder="满意度回访时间" style="width: 265px" />
          <el-checkbox v-model="form.isManYiDu" label="由我访问" />
        </el-space>
      </el-form-item>
      <el-form-item label="备注一" class="form-tip-2">
        <el-input v-model="form.remark" placeholder="备注一，APP可见" :rows="3" type="textarea" maxlength="300" show-word-limit />
      </el-form-item>
      <el-form-item label="备注二" class="form-tip-1">
        <el-input v-model="form.remark2" placeholder="备注二，APP不可见" :rows="3" type="textarea" maxlength="300" show-word-limit />
      </el-form-item>
      <div class="serve-flex">
        <div class="item-50">
          <el-form-item label="服务工单号">
            <el-input v-model="form.serveNo" />
          </el-form-item>
        </div>
        <div class="item-50">
          <el-form-item label="是否为代替单" prop="replaceOrder">
            <el-radio-group v-model="form.replaceOrder">
              <el-radio value="1">是</el-radio>
              <el-radio value="0">否</el-radio>
            </el-radio-group>
          </el-form-item>
        </div>
        <div class="item-50">
          <el-form-item label="是否为售后单" prop="afterSaleOrder">
            <el-radio-group v-model="form.afterSaleOrder">
              <el-radio value="1">是</el-radio>
              <el-radio value="0">否</el-radio>
            </el-radio-group>
          </el-form-item>
        </div>
        <div class="item-50">
          <el-form-item label="是否需要发票" prop="offerInvoice">
            <el-radio-group v-model="form.offerInvoice">
              <el-radio value="1">是</el-radio>
              <el-radio value="0">否</el-radio>
            </el-radio-group>
          </el-form-item>
        </div>
        <div class="item-50" v-if="form.offerInvoice === '1'">
          <el-form-item label="发票形式">
            <el-radio-group v-model="form.invoiceType">
              <el-radio value="2">公司</el-radio>
              <el-radio value="1">个人</el-radio>
            </el-radio-group>
          </el-form-item>
        </div>
        <div class="item-50" v-if="form.offerInvoice === '1'">
          <el-form-item label="发票抬头" prop="invoiceHead">
            <el-input v-model="form.invoiceHead" />
          </el-form-item>
        </div>
      </div>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="onClose">取消</el-button>
        <el-button type="primary" @click="onSubmit" :loading="loading">确认</el-button>
      </span>
    </template>
  </el-dialog>
  <SupplierSelectDialog ref="supplierSelectDialogRef" @select-change="selectChange" />
</template>
<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { ElMessage, FormRules, useDisabled } from 'element-plus'
import { getOrderDetail } from '@/api/order'
import { updateOrder } from '@/api/order'
import SupplierSelectDialog from '@/components/supplier-select-dialog.vue'

import { getProviderList } from '@/api/serviceProvider'
const emits = defineEmits(['reload-list'])

const visibleFlag = ref(false)

const loading = ref(false)

// 服务商下拉数据
const sellerList = ref<any>([])

const getSellerList = async () => {
  const res = await getProviderList()
  sellerList.value = res.data.map((item) => {
    return {
      value: item.id,
      label: item.name
    }
  })
}

//选择服务商操作
const supplierSelectDialogRef = ref()
const selectSellerName = () => {
  supplierSelectDialogRef.value.show({})
}
const selectChange = (list) => {
  if (list.length) {
    form.sellerName = list[0].sellerName
    form.sellerId = list[0].sellerId
    return
  }
  form.sellerName = ''
  form.sellerId = ''
}

async function show(row) {
  if (row) {
    const { data } = await getOrderDetail(row.id)
    Object.assign(form, data)
  }
  getSellerList()
  visibleFlag.value = true
}

function onClose() {
  visibleFlag.value = false
  Object.assign(form, formDefault)
}

const formDefault = reactive({
  id: undefined,
  name: undefined,
  replaceOrder: undefined,
  afterSaleOrder: undefined,
  offerInvoice: undefined,
  remark: undefined
})

const rules = reactive<FormRules>({
  replaceOrder: [{ required: true, message: '请选择是否是替代单', trigger: 'change' }],
  afterSaleOrder: [{ required: true, message: '请选择是否是售后单', trigger: 'change' }],
  offerInvoice: [{ required: true, message: '请选择是否需要发票', trigger: 'change' }]
})

let form = reactive<any>({ ...formDefault })

const formRef = ref()

const onSubmit = async () => {
  loading.value = true
  await formRef.value.validate((valid) => {
    if (valid) {
      save()
    } else {
      ElMessage.error('请确认必填参数填写正确')
      loading.value = false
    }
  })
}

const save = async () => {
  try {
    await updateOrder(form)
    ElMessage.success('操作成功')
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
.el-upload__tip {
  color: #ccc;
}
.item-50 {
  width: 50%;
  padding-right: 40px;
}
.serve-flex {
  flex-wrap: wrap;
}
.form-tip-1 {
  position: relative;
  &::after {
    position: absolute;
    content: '(APP不可见)';
    left: 0;
    top: 24px;
    color: #999693;
  }
}
.form-tip-2 {
  position: relative;
  &::after {
    position: absolute;
    content: '(APP可见)';
    left: 0;
    top: 24px;
    color: #999693;
  }
}
</style>
