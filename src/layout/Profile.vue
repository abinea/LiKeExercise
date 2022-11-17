<template>
  <div class="profile">
    <img :src="avatar" alt="用户头像" class="avatar">
    <p>{{ username }}</p>
  </div>
  <ADivider />
</template>

<script setup lang="ts">
const avatar = ref('./src/assets/default.png')
const username = ref('老师')
</script>

<style scoped>
.profile {
  width: 208px;
  height: 200px;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: space-between;
  margin-top: 20px;
  margin-left: -6px;
}

.avatar {
  height: 89px;
  object-fit: contain;
  display: inline-block;
  border-radius: 50%;
}
</style>