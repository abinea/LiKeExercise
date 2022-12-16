<template>
  <div class="profile">
    <img :src="avatar" alt="用户头像" class="avatar">
    <p>{{ username }}</p>
  </div>
  <span style="padding:0 38px 0 42px">
    <ADivider />
  </span>

</template>

<script setup lang="ts">
import { userStore } from '@/store';

const store = userStore()
const avatar = ref('./src/assets/default.png')
const username = computed<string>(() =>
  store.userInfo.username)
</script>

<style scoped>
.profile {
  height: 200px;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: space-between;
  margin-top: 50px;
  margin-left: -6px;
}

.avatar {
  height: 89px;
  object-fit: contain;
  display: inline-block;
  border-radius: 50%;
}
</style>