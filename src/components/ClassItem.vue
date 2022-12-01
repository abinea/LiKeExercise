<script lang="ts" setup>
import { PropType } from 'vue';

const router = useRouter()

interface ClassInfo {
  title: string,
  studentNum: number
  term: string
}
const props = defineProps({
  classInfo: {
    type: Object as PropType<ClassInfo>,
    required: true
  }
})
const classInfo = props.classInfo

const navigateToClassDetail = () => { }

function formatTerm(term: string) {
  let [year1, year2, semester] = term.split('-')
  semester = semester === '1' ? '一' : '二'
  return `${year1}-${year2}学年 第${semester}学期`
}

const now = '2022-2023-1'
const isEnded = computed(() => {
  return classInfo.term < now
})
</script>
    
<template>
  <div class="classInfo" :class="isEnded ? 'ended' : ''">
    <p class="title">
      班级：{{ classInfo.title }}
    </p>
    <p class="title">
      开课时间：{{ formatTerm(classInfo.term) }}
    </p>
    <p class="title">
      学生人数: {{ classInfo.studentNum }}
    </p>
  </div>
</template>


<style scoped lang="less">
.classInfo {
  height: 200px;
  background-color: @light-gray;
  box-shadow: 0 0 20px 0 rgba(175, 187, 204, 0.2);
  border: 1px solid #efefef;
  border-radius: 8px;

  &:hover {
    color: @bold-gray;
    transition: all .2s ease-in-out 0s;
    box-shadow: 0 0.125rem 0.625rem rgba(175, 187, 204, 0.5);
  }
}

.title {
  margin-top: 24px;
  margin-left: 26px;
  text-overflow: ellipsis;
  line-height: 25px;
}

.ended {
  background: rgba(0, 0, 0, 0.1);
}
</style>