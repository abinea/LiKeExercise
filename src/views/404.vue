<template>
  <div class="page">
    <AResult status="404" title="404" sub-title="抱歉，您访问的页面不存在">
      <template #extra>
        <AButton type="primary">
          <RouterLink to="/home">
            回到主页
          </RouterLink>
        </AButton>
      </template>
    </AResult>
  </div>
</template>
