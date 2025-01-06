<template>
  <el-dialog
    v-model="visibleFlag"
    title="修改订单归属项目（二级）"
    width="700px"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    destroy-on-close
    @close="onClose"
  >
    <div>
      <div class="tip">当前选中的归属项目(一级)为：{{ belongProjectName }}</div>
      <el-input v-model="search" placeholder="搜索项目名称">
        <template #suffix><Icon icon="ep:search" color="#ff9500" /></template>
      </el-input>

      <el-table ref="multipleRef" :data="tableData" class="mt-15px">
        <el-table-column type="index" label="序号" align="center" width="60" />
        <el-table-column label="操作" align="center" width="100">
          <template #default="{ row }">
            <el-button link type="primary" @click="onSubmit(row.id)"> 选择 </el-button>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="name" label="订单归属项目(二级) " />
        <el-table-column show-overflow-tooltip prop="remark" label="备注" />
      </el-table>
    </div>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref, reactive, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { updateBasicInfo } from '@/api/serviceStaffAPP'
import { getBelongItemlabelList } from '@/api/filiale'

defineProps({
  belongProjectName: {
    type: String,
    default: ''
  }
})

const emits = defineEmits(['reload'])

const visibleFlag = ref(false)

const loading = ref(false)
const search = ref('')
const belongItemList = ref([])

const tableData = computed(() => {
  if (!search.value) {
    return belongItemList.value
  }
  return belongItemList.value.filter((l: any) => l.name.includes(search.value))
})

const getBelongList = async () => {
  const { data } = await getBelongItemlabelList({
    labelType: 'belong_project',
    deleted: 0,
    parentKey: form.belongProject
  })
  belongItemList.value = data
}

function show(data) {
  form.id = data.id
  form.serveTime = data.serveTime
  form.startOrderTime = data.startOrderTime
  form.finishOrderTime = data.finishOrderTime
  form.belongProject = data.belongProject
  form.secondBelongProject = data.secondBelongProject
  visibleFlag.value = true
  getBelongList()
}

function onClose() {
  visibleFlag.value = false
}

const formDefault = reactive({})
let form = reactive<any>({ ...formDefault })

const onSubmit = async (secondBelongProject: string | number) => {
  loading.value = true
  form.secondBelongProject = secondBelongProject
  try {
    await updateBasicInfo(form)
    ElMessage.success('操作成功')
    emits('reload')
    onClose()
  } finally {
    loading.value = false
  }
}

defineExpose({
  show
})
</script>

<style scoped>
.tip {
  color: var(--main-text-color);
  line-height: 16px;
  margin-bottom: 15px;
}
</style>
