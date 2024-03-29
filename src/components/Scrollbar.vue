<script setup lang="ts">
import 'overlayscrollbars/css/OverlayScrollbars.css'
import OverlayScrollbars from 'overlayscrollbars'
import type { Options } from 'overlayscrollbars'

const props = withDefaults(
  defineProps<{
    width?: string | number
    height?: string | number
    tag?: string
    direction?: 'horizontal' | 'vertical'
    initOptions?: Options
    speed?: number
    minHeight?: string | number
  }>(),
  {
    width: '100%',
    height: '100%',
    tag: 'div',
    direction: 'vertical',
    initOptions: undefined,
    speed: 1,
    minHeight: 'unset',
  },
)

const scrollbar = shallowRef<OverlayScrollbars | null>(null)
const scrollbarDom = shallowRef<HTMLElement>(document.createElement(props.tag))

onMounted(() => {
  try {
    scrollbar.value = OverlayScrollbars(
      scrollbarDom.value as HTMLElement,
      Object.assign(getDirectionOptions(), props.initOptions || {}),
    )
    listenWheel()
  }
  catch (e) {
    console.error(e)
  }
})

onBeforeUnmount(() => {
  scrollbar.value?.destroy()
})

defineExpose({
  scrollbar,
})

function listenWheel() {
  scrollbarDom.value.addEventListener('wheel', e => onWheel(e as WheelEvent))
}

function onWheel(e: WheelEvent): void {
  const viewport = scrollbar.value?.getElements().viewport
  const states = scrollbar.value?.getState()

  const horizontalCanScroll
    = states?.hasOverflow.x && props.direction === 'horizontal'
  const verticalCanScroll
    = states?.hasOverflow.y && props.direction === 'vertical'

  if (horizontalCanScroll || verticalCanScroll) {
    // 阻止浏览器默认滚动行为
    e.preventDefault()
  }

  const scrollOffset
    = (viewport
      ? props.direction === 'horizontal'
        ? viewport.scrollLeft
        : viewport.scrollTop
      : 0)
      + ((e.deltaY || 0) / 4) * props.speed
  scrollbar.value?.scroll(
    {
      x: props.direction === 'horizontal' ? scrollOffset : 0,
      y: props.direction === 'vertical' ? scrollOffset : 0,
    },
    30,
  )
}

function getDirectionOptions(): Options {
  let options: Options = {}
  switch (props.direction) {
    case 'vertical':
      options = {
        scrollbars: { autoHide: 'leave', autoHideDelay: 500 },
        overflowBehavior: { x: 'hidden', y: 'scroll' },
      }
      break
    case 'horizontal':
      options = {
        scrollbars: { autoHide: 'leave', autoHideDelay: 500 },
        overflowBehavior: { x: 'scroll', y: 'hidden' },
      }
      break
  }
  return options
}
</script>

<template>
  <component
    :is="props.tag"
    ref="scrollbarDom"
    class="scrollbar"
    :class="[`scrollbar-${props.direction}`]"
    :style="{
      width: props.width,
      height: props.height,
      minHeight: props.minHeight,
    }"
  >
    <slot />
  </component>
</template>

<style lang="less">
.scrollbar {
  .os-scrollbar-handle {
    background: rgba(0, 0, 0, 0.15) !important;

    &:hover,
    &:active {
      background: rgba(0, 0, 0, 0.3) !important;
    }
  }
}
</style>
