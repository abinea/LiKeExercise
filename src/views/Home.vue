<script setup lang="ts">
import { userStore } from '@/store'

const store = userStore()
const role = computed(() => store.userInfo.role)

const searchValue = ref('')

const classList = [{
  title: '软件工程 01',
  classId: '1',
  term: '2022-2023-1',
  studentNum: 33,
}, {
  title: '数据库原理 02',
  classId: '2',
  term: '2022-2023-1',
  studentNum: 34,
}, {
  title: '自动机与形式语言 02',
  term: '2022-2023-1',
  classId: '3',
  studentNum: 46,
}]
const endedClass = [{
  title: '面向对象程序设计 03',
  classId: '1',
  term: '2020-2021-2',
  studentNum: 33,
}, {
  title: '计算机系统2 02',
  classId: '2',
  term: '2021-2022-1',
  studentNum: 34,
}, {
  title: '计算机系统1 03',
  classId: '3',
  term: '2020-2021-1',
  studentNum: 46,
}]

const allClass = [...classList, ...endedClass]

const activeKey = ref('1') // 默认进行中

const modalVisible = ref<boolean>(false)
function hideModal() {
  modalVisible.value = false
}
function showModal() {
  modalVisible.value = true
}

const classInfo = reactive({
  title: '',
  classId: '',
  studentNum: 0,
  term: '2022-2023-1',
  course: '',
  info: '',
})

const inviteCode = ref('')
</script>

<template>
  <div class="home">
    <AModal
      v-model:visible="modalVisible" :title="role === 1 ? '添加班级' : '新建班级'" ok-text="确认" cancel-text="取消"
      @ok="hideModal"
    >
      <AForm v-if="(role === 1)">
        <AFormItem label="邀请码">
          <AInput v-model:value="inviteCode" />
        </AFormItem>
      </AForm>
      <AForm v-else>
        <AFormItem label="班级名称">
          <AInput v-model:value="classInfo.title" placeholder="请输入班级名称" />
        </AFormItem>
        <AFormItem label="课程名称">
          <AInput v-model:value="classInfo.course" placeholder="请输入课程名称" />
        </AFormItem>
        <AFormItem label="课程介绍">
          <ATextarea v-model:value="classInfo.info" placeholder="请输入课程介绍" :maxlength="100" />
        </AFormItem>
        <AFormItem label="开课学期">
          <ASelect v-model:value="classInfo.term" placeholder="请选择学期">
            <ASelectOption value="2022-2023-1">
              2022-2023学年第1学期
            </ASelectOption>
            <ASelectOption value="2022-2023-2">
              2022-2023学年第2学期
            </ASelectOption>
            <ASelectOption value="2023-2024-1">
              2023-2024学年第1学期
            </ASelectOption>
          </ASelect>
        </AFormItem>
      </AForm>
    </AModal>
    <AAutoComplete
      v-model:value="searchValue" style="width: 10rem" :dropdown-match-select-width="250"
      :filter-option="false"
    >
      <AInputSearch placeholder="搜索班级名称" allow-clear style="width:20em" />
    </AAutoComplete>
    <div style="margin-top:40px;">
      <AButton type="primary" @click="showModal">
        {{ role === 1 ? "添加班级" : '新建班级' }}
      </AButton>
    </div>

    <div style="margin-top: 30px;">
      <ATabs v-model:activeKey="activeKey">
        <ATabPane key="1" tab="进行中">
          <div class="class-container">
            <ClassItem v-for="(item, index) in classList" :key="index" :class-info="item" />
          </div>
        </ATabPane>
        <ATabPane key="2" tab="已结束">
          <div class="class-container">
            <ClassItem v-for="(item, index) in endedClass" :key="index" :class-info="item" />
          </div>
        </ATabPane>
        <ATabPane key="3" tab="所有班级">
          <div class="class-container">
            <ClassItem v-for="(item, index) in allClass" :key="index" :class-info="item" />
          </div>
        </ATabPane>
      </ATabs>
    </div>
  </div>
</template>

<style scoped lang="less">
.home {
  padding-top: 40px;
  padding-bottom: 30px;
  padding-left: 50px;
  padding-right: 40px;
}

.class-container {
  margin-top: 10px;
  display: grid;
  justify-content: flex-start;
  grid-template-columns: repeat(auto-fill, 360px);
  grid-gap: 24px;
}
</style>
