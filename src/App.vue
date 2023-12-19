<script lang="ts" setup>
import locale from 'ant-design-vue/es/locale/zh_CN'
</script>

<template>
  <AConfigProvider :locale="locale">
    <RouterView />
  </AConfigProvider>
</template>

<style lang="less">
#app {
  width: 100vw;
  height: 100vh;
  background-color: @login-background-color;
}
</style>
