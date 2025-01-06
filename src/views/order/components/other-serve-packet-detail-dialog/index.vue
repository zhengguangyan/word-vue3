<template>
  <el-dialog v-model="visibleFlag" title="服务包详情" width="500px" :close-on-press-escape="false" :close-on-click-modal="false" destroy-on-close @close="onClose">
    <div class="scrollbarHide">
      <div class="item-box">
        <div class="item-title">编号</div>
        <div class="item-content">{{ form.no }}</div>
      </div>
      <div class="item-box">
        <div class="item-title">服务包名称</div>
        <div class="item-content">{{ form.name }}</div>
      </div>
      <div class="item-box">
        <div class="item-title">排序码</div>
        <div class="item-content">{{ form.sortKey }}</div>
      </div>
      <div class="item-box">
        <div class="item-title">备注</div>
        <div class="item-content">{{ form.remark }}</div>
      </div>
      <div class="item-box">
        <div class="item-title">创建时间</div>
        <div class="item-content"> {{ (form.createTime || '') + ' ' + (form.creatorName || '') }}</div>
      </div>
      <div class="item-box">
        <div class="item-title">更新时间</div>
        <div class="item-content"> {{ (form.updateTime || '') + ' ' + (form.updaterName || '') }}</div>
      </div>
    </div>

    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="onClose">确认</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script lang="ts" setup>
import { ref, reactive } from 'vue'
const emits = defineEmits(['reload-list'])

const visibleFlag = ref(false)

// const loading = ref(false)

function show(data) {
  if (data) {
    Object.assign(form, data)
  }
  visibleFlag.value = true
}

function onClose() {
  visibleFlag.value = false
  Object.assign(form, formDefault)
}

const formDefault = reactive({
  areaProjectCode: undefined,
  id: undefined,
  linkageName: undefined,
  phone: undefined,
  details: undefined
})

let form = reactive<any>({ ...formDefault })

defineExpose({
  show
})
</script>
<style scoped>
.el-upload__tip {
  color: #ccc;
}
</style>
