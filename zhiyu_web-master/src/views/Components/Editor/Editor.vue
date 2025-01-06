<script setup lang="ts">
import { Editor, EditorExpose } from '@/components/Editor'
import { ref, onMounted, unref } from 'vue'

const editorRef = ref<typeof Editor & EditorExpose>()

const defaultHtml = ref('')

onMounted(async () => {
  await unref(editorRef)?.getEditorRef()
})

setTimeout(() => {
  defaultHtml.value = '<p>hello <strong>world</strong></p>'
}, 3000)
</script>

<template>
  <Editor v-model="defaultHtml" ref="editorRef" />
</template>
