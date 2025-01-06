<template>
  <el-dialog v-model="visibleFlag" title="请选择要分析的表格条目" width="500px" :close-on-press-escape="false" :close-on-click-modal="false" destroy-on-close>
    <el-form ref="formRef" :model="form">
      <el-form-item label="" prop="keywords">
        <el-input v-model="form.keywords" placeholder="条目名称" @change="search">
          <template #append>
            <ElButton :icon="searchIcon" @click="search" />
          </template>
        </el-input>
      </el-form-item>
      <el-form-item>
        <!-- @row-click="handleRowChange" -->
        <el-table ref="multipleRef" :data="tableData" @selection-change="selectionChange" style="height: 400px" size="small">
          <el-table-column type="selection" width="55" />
          <el-table-column property="option" label="条目名称" />
        </el-table>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="onClose">取消</el-button>
        <el-button type="primary" @click="onSubmit" :disabled="!multipleSelection.length">分析</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { useIcon } from '@/hooks/web/useIcon'
const searchIcon = useIcon({ icon: 'ant-design:search-outlined' })
import { useRouter } from 'vue-router'
const { push } = useRouter()

const visibleFlag = ref(false)

const props = defineProps({
  type: {
    type: String,
    default: null
  },
  params: {
    type: Object,
    default: () => {
      return {}
    }
  }
})

const emits = defineEmits(['reload'])

function show() {
  visibleFlag.value = true
}

const formDefault = {
  keywords: undefined
}
const form = reactive({ ...formDefault })

const tableDefault = [
  {
    option: '年龄段',
    value: 'age'
  },
  {
    option: '居住情况',
    value: 'oldmanLive'
  },
  {
    option: '补偿类型',
    value: 'compensationType'
  },
  {
    option: '老人分类',
    value: 'elderClassify'
  },
  {
    option: '主要经济来源',
    value: 'mainFinancially'
  },
  {
    option: '符合政府补助标准',
    value: 'subsidyStandard'
  },
  {
    option: '文化程度',
    value: 'educationLevel'
  },
  {
    option: '职业',
    value: 'profession'
  },
  {
    option: '月收入范围',
    value: 'incomeRange'
  },
  {
    option: '服务需求（家政）',
    value: 'domesticDemand'
  },
  {
    option: '服务需求（生活）',
    value: 'livingDemand'
  },
  {
    option: '服务需求（医疗）',
    value: 'medicalDemand'
  },
  {
    option: '证件类型',
    value: 'idType'
  },
  {
    option: '婚姻状况',
    value: 'maritalStatus'
  },
  {
    option: '养老方式',
    value: 'pensionMode'
  },
  {
    option: '保险',
    value: 'insurance'
  },
  {
    option: '老人类型',
    value: 'oldmanType'
  },
  {
    option: '老人群体',
    value: 'oldmanGroup'
  },
  {
    option: '老人性格',
    value: 'personality'
  },
  {
    option: '老人爱好',
    value: 'oldmanHobby'
  },
  {
    option: '上网方式',
    value: 'internetMode'
  },
  {
    option: '上网目的',
    value: 'internetAim'
  }
]

const tableData = ref([...tableDefault])
const onClose = () => {
  multipleSelection.value = []
  visibleFlag.value = false
}

const multipleSelection = ref<any>([])
const multipleRef = ref()

// 行点击的回调
const handleRowChange = (val: any) => {
  multipleRef.value.toggleRowSelection(val)
  if (multipleSelection.value.includes(val)) {
    // 如果元素存在于数组中，删除该元素
    multipleSelection.value.splice(multipleSelection.value.indexOf(val), 1)
  } else {
    // 如果元素不存在于数组中，添加该元素
    multipleSelection.value.push(val)
  }
}
const selectionChange = (selection: any) => {
  multipleSelection.value = selection
}

const onSubmit = () => {
  localStorage.setItem('analyzeData', JSON.stringify(multipleSelection.value))
  onClose()
  setTimeout(() => {
    if (props.type) {
      emits('reload')
    } else {
      const { deathFlag, type } = props.params
      push(`/customer/data?deathFlag=${deathFlag}&type=${type}`)
      // push({
      //   path: '/customer/data',
      //   query: props.params
      // })
    }
  }, 100)
}
const search = () => {
  multipleSelection.value = []
  tableData.value = fuzzySearch(tableData.value, form.keywords)
}

const fuzzySearch = (arr, keyword) => {
  if (!keyword) {
    return tableDefault
  }
  // 使用 filter 方法筛选数组
  return arr.filter((item) => {
    // 遍历每个对象的属性值
    for (let key in item) {
      // 判断属性值是否包含关键字
      if (typeof item[key] === 'string' && item[key].includes(keyword)) {
        return true // 包含关键字，保留该对象
      }
    }
    return false // 不包含关键字，过滤该对象
  })
}
defineExpose({
  show
})
</script>
