<script lang="ts" setup>
const router = useRouter()
const props = defineProps({
  classIndex: Number
})
const classInfo = {
  title: `软件工程${props.classIndex}班`,
  grade: '2020',
  classId: "2021-01-01-01",
  studentNum: 30,
}
const navigateToClassDetail = () => { }
</script>
    
<template>
  <div class="classInfo">
    <p class="title">
      班级：{{ classInfo.title }}
    </p>
    <p class="title">
      年级：{{ classInfo.grade }}
    </p>
    <p class="title">
      选课人数: {{ classInfo.studentNum }}
    </p>
  </div>
</template>


<style scoped lang="less">
.classInfo {
  height: 200px;
  background-color: @light-gray;
  box-shadow: 0px 0px 20px 0px rgba(175, 187, 204, 0.2);
  ;
  border-radius: 8px;
}

.title {
  margin-top: 24px;
  margin-left: 26px;
  text-overflow: ellipsis;
  color: @bold-gray;
  line-height: 25px;
}
</style>