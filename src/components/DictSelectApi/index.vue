<template>
  <el-select
    v-model="selectValue"
    :style="`width: ${width}`"
    :placeholder="props.placeholder"
    :clearable="true"
    :size="size"
    :multiple="multiple"
    @change="onChange"
    :disabled="disabled"
  >
    <el-option
      v-for="item in dictValueList"
      :key="item.value"
      :value="item.value"
      :label="item.label"
    />
  </el-select>
</template>

<script setup>
import { computed, onMounted, ref, watch } from "vue";
import { getDictData } from "@/api/sys/Dictionary";

const props = defineProps({
  keyCode: String,
  value: [Array, String],
  multiple: {
    type: Boolean,
    default: false,
  },
  width: {
    type: String,
    default: "200px",
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
});

const dictValueList = ref([]);
async function queryDict() {
  let res = await getDictData(props.keyCode);
  dictValueList.value = res.data;
}

const values = computed(() => {
  if (!props.value) {
    return undefined;
  }
  if (!Array.isArray(props.value)) {
    console.error("valueList is not array!!!");
    return undefined;
  }
  let res = [];
  if (props.value && props.value.length > 0) {
    props.value.forEach((element) => {
      res.push(element.value);
    });
    return res;
  }
  return undefined;
});

onMounted(queryDict);

const selectValue = ref(props.value);
watch(
  () => props.value,
  (value) => {
    selectValue.value = value;
  }
);

const emit = defineEmits(["update:modelValue", "change"]);
function onChange(value) {
  let selected = undefined;
  if (!value) {
    emit("update:modelValue", selected);
    emit("change", selected);
    return selected;
  }
  if (Array.isArray(props.value)) {
    let valueList = dictValueList.value.filter((e) => value.includes(e.value));
    valueList = valueList.map((e) => e.value);
    emit("update:modelValue", valueList);
    emit("change", valueList);
  } else {
    let findValue = dictValueList.value.find((e) => e.value == value);
    emit("update:modelValue", findValue.value);
    emit("change", findValue.value);
  }
}
</script>
