<script setup lang="ts">
import Icon from '@ant-design/icons-vue'

const props = withDefaults(
  defineProps<{
    color: string
    fontSize: number
  }>(),
  {
    fontSize: 20,
  },
)
</script>

<template>
  <span>
    <Icon>
      <template #component>
        <svg
          t="1668511884527"
          class="icon"
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          p-id="6627"
          xmlns:xlink="http://www.w3.org/1999/xlink"
          :width="props.fontSize"
          :height="props.fontSize"
          :fill="props.color"
          :stroke="props.color"
        >
          <path
            d="M752.89 356.741h57.565v97.06L957.44 283.095l-146.939-167.04v110.817h-57.559c-164.813 0-272.317 127.002-354.427 239.053-73.697 100.72-137.492 195.748-240.292 195.748H66.56v129.92h91.617c164.813 0 257.813-135.014 339.968-247.07 73.698-100.773 151.7-187.782 254.746-187.782z m-446.632 74.291l21.335-28.907c17.515-23.803 35.835-49.045 55.777-74.092-59.044-57.267-130.12-99.533-225.193-99.533H66.56v129.874s24.699-1.239 91.617 0c64.784 1.434 105.416 28.954 148.08 72.658zM810.5 666.665h-57.559c-62.766 0-125.42-36.373-170.312-84.629a929.229 929.229 0 0 1-13.557 18.463c-19.702 26.87-40.832 55.824-64.144 84.337 60.585 61.368 148.383 111.703 248.013 111.703h57.56v111.406L957.44 736.947 810.501 570.214v96.451z"
            p-id="6628"
          />
        </svg>
      </template>
    </Icon>
  </span>
</template>
