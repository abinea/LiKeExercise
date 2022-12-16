<script lang="ts">
import { defineComponent, h, onUnmounted, PropType } from 'vue'
import Editor, { useMonaco } from '@guolao/vue-monaco-editor'

export default defineComponent({
  props: {
    height: {
      type: String,
      default: '80vh'
    },
    theme: {
      type: String,
      default: 'light'
    },
    language: {
      type: String,
      default: 'python'
    },
    style: {
      type: String,
      default: ''
    }
  },
  render() {
      const { monacoRef, unload } = useMonaco()
      /* 当组件被卸载时, 如果 monaco 实例没有加载完, 你需要手动取消加载。*/
      onUnmounted(() => !monacoRef.value && unload())

      return h(Editor, {
        height: this.height,
        theme: this.theme,
        language: this.language,
        style: this.style,
        onMount: (editor, monaco) => {
          console.log('代码编辑器 Mounted', editor, monaco)
        },
      })
  }
})
</script>

