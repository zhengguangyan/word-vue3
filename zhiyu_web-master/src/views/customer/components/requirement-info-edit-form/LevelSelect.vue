<template>
  <el-select
    :style="`width: ${width}`"
    v-model="selectValue"
    :placeholder="props.placeholder"
    multiple
    clearable
    @change="onChange"
  >
    <template #tag>
      <template v-for="(item, index) in selectValue">
        <el-tag :key="item" type="info" v-if="index < props.tags">
          {{ `${index + 1}. ${radioDict(item, distList)}` }}
        </el-tag>
      </template>
      <el-tooltip effect="light" v-if="selectValue.length > props.tags">
        <template #content>
          <el-space wrap :size="12">
            <template v-for="(item, index) in selectValue">
              <el-tag :key="item" type="info" v-if="index > props.tags - 1">
                {{ `${index + 1}. ${radioDict(item, distList)}` }}
              </el-tag>
            </template>
          </el-space>
        </template>
        <el-tag type="info"> +{{ selectValue.length - props.tags }} </el-tag>
      </el-tooltip>
    </template>
    <el-option
      v-for="item in distList"
      :key="(item as any).value"
      :value="(item as any).value"
      :label="(item as any).label"
    />
  </el-select>
</template>

<script lang="ts" setup>
import { ref, watch } from "vue";

const props = defineProps({
  value: [Array],
  distList: [Array],
  multiple: {
    type: Boolean,
    default: true,
  },
  width: {
    type: String,
    default: "100%",
  },
  placeholder: {
    type: String,
    default: "请选择",
  },
  size: {
    type: String,
    default: "default",
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  clearable: {
    type: Boolean,
    default: false,
  },
  zero: {
    type: Boolean,
    default: false,
  },
  tags: {
    type: Number,
    default: 1,
  },
});

const selectValue = ref<any>(props.value);
watch(
  () => props.value,
  (value) => {
    selectValue.value = value;
  }
);

const radioDict = (key: any, dict: any) => {
  if (!key) {
    return;
  }
  return dict
    ?.filter((item: any) => item.value == key)
    .map((item: any) => item?.label)
    .join("，");
};

const emit = defineEmits(["update:modelValue", "change"]);
function onChange(value) {
  let selected = undefined;
  if (!value) {
    emit("update:modelValue", selected);
    emit("change", selected);
    return selected;
  }
  if (props.multiple && value.includes("0")) {
    emit("update:modelValue", ["0"]);
    emit("change", ["0"]);
    return;
  }
  emit("update:modelValue", value);
  emit("change", value);
}
</script>
