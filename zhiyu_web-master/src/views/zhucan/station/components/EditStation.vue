<template>
  <el-dialog v-model="visible" :title="form.id ? '编辑站点' : '添加站点'" append-to-body width="600px" :close-on-click-modal="false" draggable @close="handleClose" class="edit-station-dialog">
    <el-form :model="form" :rules="formRules" ref="formRef" label-width="100px">
      <el-form-item label="站点来源" prop="source">
        <DictSelect v-model="form.source" :distList="filterDict('station_source')" placeholder="请选择站点来源" style="width: 100%" :clearable="false" />
      </el-form-item>
      <el-form-item label="站点名称" prop="source">
        <el-input v-model="form.stationName" placeholder="请输入站点名称" maxlength="20" :disabled="Boolean(form.id)"></el-input>
      </el-form-item>
      <el-form-item label="所属区域" prop="regionCode">
        <Cascader placeholder="请选择所属区域" check v-model="form.regionCode" style="width: 100%" @get-selected-text="getBelongSelectedText" :disabled="Boolean(form.id)" />
      </el-form-item>
      <el-form-item label="站点地址" prop="stationAddress" class="station-form-item">
        <Cascader placeholder="请选择站点区域" v-model="form.stationCode" style="width: 100%" :disabled="Boolean(form.id)" />
        <el-input v-model="form.stationAddress" placeholder="请输入站点详细地址" maxlength="64" class="r-m-t-4" :disabled="Boolean(form.id)"></el-input>
      </el-form-item>
      <el-form-item label="站点人员" prop="operatorNames" v-if="form.source === '1'">
        <!-- 请选择站点人员(可多选，该成员可见该站点下的菜单) -->
        <div class="user-box" @click="handleChooseUser">
          <span class="placeholder-color" v-if="!form.operatorNames.length">请选择站点人员(可多选，该成员可见该站点下的菜单)</span>
          <div v-for="(item, index) in form.operatorNames" :key="item" class="user-item">
            <span class="r-m-r-4">{{ item }}</span>
            <Icon icon="ep:circle-close-filled" color="#999693" @click.stop="handleRemoveUser(index)" />
          </div>
        </div>
      </el-form-item>
    </el-form>
    <div class="error-color r-font-12 r-m-b-20">
      <div>注意:</div>
      <div>1. 站点创建后，只能修改“站点人员”（“站点人员”可以在后台查看“就餐订单记录”、“就餐订单统计”，在APP可进行点餐操作）；</div>
      <div>2. 若站点已生成订单，该站点不可删除。</div>
    </div>
    <template #footer>
      <el-button plain @click="handleClose">取消</el-button>
      <el-button type="primary" @click="handleSave">保存</el-button>
    </template>
    <ChooseUser ref="chooseUserRef" @update-users="updateUsers" />
  </el-dialog>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { FormRules, FormInstance, ElLoading, ElMessage } from 'element-plus'
import { resetQueryForm } from '@/utils'
import Cascader from '/@/components/Cascader/index.vue'
import DictSelect from '/@/components/DictSelect/index.vue'
import ChooseUser from './ChooseUser.vue'
import { siteSave, siteDetail } from '@/api/zhucan/station'
import { nextTick } from 'vue'
import { filterDict } from '@/hooks/web/useDict'

const visible = ref(false)
const open = (id?: string) => {
  visible.value = true
  if (id) {
    nextTick(() => {
      loadData(id)
    })
  }
}
defineExpose({ open })

const loadData = async (id: string) => {
  const loading = ElLoading.service({
    target: '.edit-station-dialog',
    text: '加载中，请稍候...'
  })
  const { data } = await siteDetail(id)
  form.stationCode = [data.stationProvince, data.stationCity, data.stationCounty, data.stationStreet, data.stationCommunity]
  form.address = data.address
  form.city = data.city
  form.community = data.community
  form.county = data.county
  form.displayQr = data.displayQr
  form.id = data.id
  form.operatorIds = data.operatorIds ? data.operatorIds.split(',') : []
  form.operatorNames = data.operatorNames ? data.operatorNames.split(',') : []
  form.province = data.province
  form.source = data.source
  form.stationAddress = data.stationAddress
  form.stationCity = data.stationCity
  form.stationCommunity = data.stationCommunity
  form.stationCounty = data.stationCounty
  form.stationName = data.stationName
  form.stationProvince = data.stationProvince
  form.stationStreet = data.stationStreet
  form.street = data.street
  form.supplierId = data.supplierId
  const keys = ['province', 'city', 'county', 'street', 'community']
  keys.forEach((key, index) => {
    if (data[key]) {
      form.regionCode[index] = data[key]
    }
  })
  oldOperatorIds = [...form.operatorIds]
  loading.close()
}

const handleClose = () => {
  visible.value = false
  resetQueryForm(form, null)
  const timeId = window.setTimeout(() => {
    formRef.value?.clearValidate()
    window.clearTimeout(timeId)
  }, 200)
}

const form = reactive({
  regionCode: [] as string[], // 前端自定义字段，所属区域
  stationCode: [] as string[], // 前端自定义字段，站点区域
  address: '',
  city: '',
  community: '',
  county: '',
  displayQr: '', // 是否显示二维码菜单
  id: '',
  operatorIds: [] as string[],
  operatorNames: [] as string[],
  province: '',
  source: '',
  stationAddress: '',
  stationCity: '',
  stationCommunity: '',
  stationCounty: '',
  stationName: '',
  stationProvince: '',
  stationStreet: '',
  street: '',
  supplierId: ''
})

let oldOperatorIds: string[] = [] // 存储详情接口返回的站点人员id列表，避免出现在外层删除站点人员后，打开选择人员弹窗，再也选不了这个在外层被删除的人员

const validateStationAddress = (_rule: any, value: any, callback: any) => {
  if (!(form.stationCode && form.stationCode.length)) return callback(new Error('请选择站点所属区域'))
  if (!value) return callback(new Error('请输入站点详细地址'))
  callback()
}
const validateBelongAddress = (_rule: any, _value: any, callback: any) => {
  if (!form.regionCode) return callback(new Error('请选择所属区域'))
  if (!form.regionCode.length) return callback(new Error('请选择所属区域'))
  if (form.regionCode.length < 3) return callback(new Error('请完善区域至市/区层级'))
  callback()
}
const formRules = reactive<FormRules>({
  source: { required: true, message: '请选择站点来源', trigger: 'change' },
  stationName: { required: true, message: '请输入站点名称', trigger: 'blur' },
  regionCode: { required: true, validator: validateBelongAddress, trigger: 'change' },
  stationAddress: { required: true, validator: validateStationAddress, trigger: 'blur' },
  operatorNames: { required: true, type: 'array', message: '请选择站点人员', trigger: 'none' }
})

// 获取所属区域字符串拼接
const getBelongSelectedText = (val: string) => {
  if (val) {
    form.address = val.replace(/\//g, '')
  }
}

const formRef = ref<FormInstance>()
const emit = defineEmits(['loadData'])
const handleSave = () => {
  formRef.value?.validate(async (val) => {
    if (!val) return
    const loading = ElLoading.service({
      target: '.edit-station-dialog',
      text: '保存中，请稍候...'
    })
    try {
      await siteSave({
        address: form.regionCode ? form.address : '',
        city: form.regionCode[1],
        community: form.regionCode[4],
        county: form.regionCode[2],
        displayQr: form.displayQr,
        id: form.id,
        operatorIds: form.source === '1' ? form.operatorIds.join(',') : '',
        operatorNames: form.source === '1' ? form.operatorNames.join(',') : '',
        province: form.regionCode[0],
        source: form.source,
        stationAddress: form.stationAddress,
        stationCity: form.stationCode[1],
        stationCommunity: form.stationCode[4],
        stationCounty: form.stationCode[2],
        stationName: form.stationName,
        stationProvince: form.stationCode[0],
        stationStreet: form.stationCode[3],
        street: form.regionCode[3],
        supplierId: form.supplierId
      })
      loading.close()
      handleClose()
      ElMessage.success('保存成功')
      form.id ? emit('loadData') : emit('loadData', true)
    } catch {
      loading.close()
    }
  })
}

const chooseUserRef = ref<InstanceType<typeof ChooseUser>>()
const handleChooseUser = () => {
  chooseUserRef.value?.open(form.operatorIds, oldOperatorIds)
}
const handleRemoveUser = (index: number) => {
  form.operatorIds.splice(index, 1)
  form.operatorNames.splice(index, 1)
}
const updateUsers = (list: any[]) => {
  if (list.length) {
    list.forEach((item) => {
      const index = form.operatorIds.findIndex((id) => id === String(item.id))
      if (index === -1) {
        form.operatorIds.push(item.id)
        form.operatorNames.push(item.name)
      }
    })
    return
  }

  form.operatorIds = []
  form.operatorNames = []
}
</script>

<style lang="less">
.edit-station-dialog {
  .pointer-input {
    .el-input__wrapper {
      cursor: pointer;
    }
    .el-input__inner {
      cursor: pointer;
    }
  }
  .user-box {
    cursor: pointer;
    box-shadow: 0 0 0 1px var(--el-border-color) inset;
    border-radius: 4px;
    padding: 4px 12px 0 12px;
    background-color: #fff;
    display: flex;
    flex-wrap: wrap;
    flex: 1;
    min-height: 32px;
  }
  .user-item {
    display: flex;
    align-items: center;
    height: 24px;
    padding: 0 6px;
    border-radius: 4px;
    background-color: #f5f3f0;
    margin: 0 8px 4px 0;
  }
  .placeholder-color {
    color: #ccc;
    line-height: 32px;
    transform: translateY(-2px);
  }
}
</style>
