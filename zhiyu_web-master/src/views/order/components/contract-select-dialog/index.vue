<template>
  <el-dialog
    v-model="visibleFlag"
    title="选择合同"
    width="500px"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
  >
    <el-form ref="formRef" :model="form">
      <el-form-item label="" prop="keywords">
        <el-input
          v-model="form.keywords"
          placeholder="搜索合同ID/合同名称/合同编号/业务负责人"
          @change="search"
          clearable
        >
          <template #append>
            <ElButton :icon="searchIcon" @click="search" />
          </template>
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-table ref="multipleRef" :data="tableData" size="small">
          <el-table-column label="操作" width="50">
            <template #default>
              <el-button link type="primary" size="small"> 选择 </el-button>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="usingStatus" min-width="150" label="合同ID" />
          <el-table-column show-overflow-tooltip prop="name" min-width="150" label="合同名称" />
          <el-table-column show-overflow-tooltip prop="sex" min-width="150" label="业务负责人" />
        </el-table>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
// import { ElMessage } from 'element-plus'
import { useIcon } from '@/hooks/web/useIcon'
const searchIcon = useIcon({ icon: 'ant-design:search-outlined' })

const visibleFlag = ref(false)
// const loading = ref(false)

function show() {
  visibleFlag.value = true
}

const queryFormDefault = {
  keywords: undefined,
  visitDate: undefined
}
const form = reactive({ ...queryFormDefault })

const tableData = ref([])

function search() {}

defineExpose({
  show
})
</script>
<style scoped lang="less">
.tips {
  color: red;
  font-size: 12px;
  padding-left: 70px;
}
</style>
