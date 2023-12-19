<script lang="ts" setup>
import '@wangeditor/editor/dist/css/style.css'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import type { IToolbarConfig } from '@wangeditor/editor'

const props = withDefaults(
  defineProps<{
    modelValue: string
    placeholder: string
    readonly: boolean
    scroll: boolean
  }>(),
  {
    modelValue: '',
    placeholder: '请输入内容...',
    readonly: false,
    scroll: true,
  },
)
const emit = defineEmits(['update:modelValue']) // 结合 props.modelValue 实现 v-model 双绑定

const editorRef = shallowRef() // 编辑器实例，必须用 shallowRef
const value = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  },
})
const toolbarConfig: Partial<IToolbarConfig> = {
  toolbarKeys: [
    'headerSelect',
    'blockquote',
    'bold',
    'underline',
    'italic',
    'through',
    'code',
    {
      key: 'group-more-style',
      title: '更多',
      iconSvg:
        '<svg viewBox="0 0 1024 1024"><path d="M204.8 505.6m-76.8 0a76.8 76.8 0 1 0 153.6 0 76.8 76.8 0 1 0-153.6 0Z"></path><path d="M505.6 505.6m-76.8 0a76.8 76.8 0 1 0 153.6 0 76.8 76.8 0 1 0-153.6 0Z"></path><path d="M806.4 505.6m-76.8 0a76.8 76.8 0 1 0 153.6 0 76.8 76.8 0 1 0-153.6 0Z"></path></svg>',
      menuKeys: ['sup', 'sub', 'clearStyle'],
    },
    '|',
    'color',
    'bgColor',
    'bulletedList',
    'numberedList',
    'todo',
    {
      key: 'group-indent',
      title: '缩进',
      iconSvg:
        '<svg viewBox="0 0 1024 1024"><path d="M0 64h1024v128H0z m384 192h640v128H384z m0 192h640v128H384z m0 192h640v128H384zM0 832h1024v128H0z m0-128V320l256 192z"></path></svg>',
      menuKeys: ['indent', 'delIndent'],
    },
    '|',
    'insertTable',
    'codeBlock',
    'insertLink',
    {
      key: 'group-image',
      title: '图片',
      iconSvg:
        '<svg viewBox="0 0 1024 1024"><path d="M959.877 128l0.123 0.123v767.775l-0.123 0.122H64.102l-0.122-0.122V128.123l0.122-0.123h895.775zM960 64H64C28.795 64 0 92.795 0 128v768c0 35.205 28.795 64 64 64h896c35.205 0 64-28.795 64-64V128c0-35.205-28.795-64-64-64zM832 288.01c0 53.023-42.988 96.01-96.01 96.01s-96.01-42.987-96.01-96.01S682.967 192 735.99 192 832 234.988 832 288.01zM896 832H128V704l224.01-384 256 320h64l224.01-192z"></path></svg>',
      menuKeys: ['insertImage', 'uploadImage'],
    },
  ],
}
const editorConfig = { placeholder: props.placeholder, scroll: props.scroll, readOnly: props.readonly }

// 组件销毁时也销毁编辑器
onBeforeUnmount(() => {
  const editor = editorRef.value
  if (editor == null)
    return
  editor.destroy()
})

// 编辑器回调函数
function handleCreated(editor: any) {
  editorRef.value = editor
}
</script>

<template>
  <div>
    <div :style="props.readonly ? '' : 'border: 1px solid #ccc;'">
      <Toolbar
        v-if="!props.readonly"
        :editor="editorRef"
        :default-config="toolbarConfig"
        mode="default"
        style="border-bottom: 1px solid #ccc"
      />
      <Editor
        v-model="value"
        :default-config="editorConfig"
        mode="default"
        :style="props.scroll ? 'height: 400px;overflow-y: hidden' : ''"
        @on-created="handleCreated"
      />
    </div>
  </div>
</template>
