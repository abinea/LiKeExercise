<script lang="ts" setup>
import locale from "ant-design-vue/es/locale/zh_CN"
</script>

<template>
  <AConfigProvider :locale="locale">
    <RouterView />
  </AConfigProvider>
</template>
<style scoped>

</style>
