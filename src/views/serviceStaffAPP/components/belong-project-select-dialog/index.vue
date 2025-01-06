<template>
  <el-dialog
    v-model="visibleFlag"
    title="修改订单归属项目（一级）"
    width="500px"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    destroy-on-close
    @close="onClose"
  >
    <div>
      <el-input v-model="search" placeholder="搜索服务项目">
        <template #suffix><Icon icon="ep:search" color="#ff9500" /></template>
      </el-input>

      <el-table ref="multipleRef" :data="tableData" class="mt-15px">
        <el-table-column type="index" label="序号" align="center" width="60" />
        <el-table-column label="操作" align="center" width="100">
          <template #default="{ row }">
            <el-button link type="primary" @click="onSubmit(row.value)"> 选择 </el-button>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="label" label="服务类别" />
      </el-table>
    </div>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref, reactive, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { updateBasicInfo } from '@/api/serviceStaffAPP'

const props = defineProps({
  list: {
    type: Array,
    default: () => []
  }
})

const emits = defineEmits(['reload'])

const visibleFlag = ref(false)

const loading = ref(false)
const search = ref('')
const tableData = computed(() => {
  if (!search.value) {
    return props.list
  }
  return props.list.filter((l: any) => l.label.includes(search.value))
})

function show(data) {
  form.id = data.id
  form.serveTime = data.serveTime
  form.startOrderTime = data.startOrderTime
  form.finishOrderTime = data.finishOrderTime
  form.belongProject = data.belongProject
  form.secondBelongProject = data.secondBelongProject
  visibleFlag.value = true
}

function onClose() {
  visibleFlag.value = false
}

const formDefault = reactive({})
let form = reactive<any>({ ...formDefault })

const onSubmit = async (belongProject: string | number) => {
  loading.value = true
  form.belongProject = belongProject
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
