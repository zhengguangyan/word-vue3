<script setup lang="ts">
import { PropType } from 'vue'
import type { TableData } from '@/api/table/types'
import { Descriptions } from '@/components/Descriptions'
import { useI18n } from '@/hooks/web/useI18n'
import { ElTag } from 'element-plus'
import { DescriptionsSchema } from '@/types/descriptions'

const { t } = useI18n()

defineProps({
  currentRow: {
    type: Object as PropType<Nullable<TableData>>,
    default: () => null
  },
  detailSchema: {
    type: Array as PropType<DescriptionsSchema[]>,
    default: () => []
  }
})
</script>

<template>
  <Descriptions :schema="detailSchema" :data="currentRow || {}">
    <template #businessType="{ row }: { row: TableData }">
      <ElTag :type=" 'success' ">
        {{
        row.businessType == 0
        ? t('其他')
        : row.businessType == 1
        ? t('新增') : row.businessType == 2 ?
        t('修改') : row.businessType == 3 ?
        t('删除') : row.businessType == 4 ?
        t('授权') : row.businessType == 5 ?
        t('导出') : row.businessType == 6 ?
        t('导入') : row.businessType == 7 ?
        t('强退') : row.businessType == 8 ?
        t('生成代码') : row.businessType == 9 ?
        t('清空数据') : ''
        }}
      </ElTag>
    </template>
    <template #costTime=" { row }: { row: TableData } ">
      <span>{{ row.costTime }}毫秒</span>

    </template>
    <template #status=" { row }: { row: TableData } ">
      <ElTag :type=" 'success' ">
        {{
        row.status == 0
        ? t('启用')
        : t('停用')

        }}
      </ElTag>
    </template>
    <template #content=" { row }: { row: TableData } ">
      <div v-html=" row.content "></div>
    </template>
  </Descriptions>
</template>
