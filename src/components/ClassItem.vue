<script setup lang="ts">
import type { PropType } from 'vue'
import type { Class } from '@/types/store'
import { formatTerm } from '@/utils/formatUtils'

const props = defineProps({
  classInfo: {
    type: Object as PropType<Class.ClassInfo>,
    required: true,
  },
})

const now = '2022-2023-1'
const isEnded = computed(() => {
  return props.classInfo.term < now
})
</script>

<template>
  <div class="class-info" :class="{ ended: isEnded }">
    <p class="class-item">
      班级：{{ props.classInfo.title }}
    </p>
    <p class="class-item">
      开课时间：{{ formatTerm(props.classInfo.term) }}
    </p>
    <p class="class-item">
      学生人数: {{ props.classInfo.studentNum }}
    </p>
  </div>
</template>

<style scoped lang="less">
.class-info {
  height: 200px;
  background-color: @light-gray;
  box-shadow: 0 0 20px 0 rgba(175, 187, 204, 0.2);
  border: 1px solid #efefef;
  border-radius: 8px;

  &:hover {
    color: @bold-gray;
    transition: all 0.2s ease-in-out 0s;
    box-shadow: 0 0.125rem 0.625rem rgba(175, 187, 204, 0.5);
  }

  .class-item {
    margin-top: 24px;
    margin-left: 26px;
    text-overflow: ellipsis;
    line-height: 25px;
  }
}

.ended {
  background: rgba(0, 0, 0, 0.1);
}
</style>
