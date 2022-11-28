<script setup lang="ts">
import { difficultyArr, problemStore } from '@/store/problem';
import { message } from 'ant-design-vue';
import { Problem } from "@/types/store"

const store = problemStore()

const type = ['选择', '填空', '大题']
let tags = getStorage('tags') || []
tags = tags.map((item: Problem.Tag) => item['tagName'])


const isSelectProblem = computed(() => {
  return problem.category == type[0]
})
const isDati = computed(() => {
  return problem.category == type[2]
})

const title = useRoute().query?.title as string
let detail
if (title != undefined) {
  store.detail(title).then(res => {
    detail = res
  })
}
const problem = reactive({
  title: '',
  question: "",
  category: "选择",
  courseName: "软件工程",
  difficulty: "简单",
  tags: []
})
const selectTags = (tags: any[]) => {
  // @ts-ignore
  problem.tags = tags.map(val => ({ tagName: val }))
}

const ansContent = ref('')

// 多选开关
const checked = ref<boolean>(false)
const ansNum = ref(4)
const addAns = () => {
  ansNum.value++
}
const delAns = () => {
  ansNum.value--
}

function createProblem() {
  const isFinish = Object.values(problem).some((p: any) => p)
  if (isFinish) {
    store.create(problem)
  }
  else {
    message.error('数据缺失，无法新建题目')
  }
}
</script>
    
<template>
  <div class="edit">
    <section>
      <a-select style="width: 120px;" size="large" v-model:value="problem.category" class="tagSelect">
        <a-select-option v-for="item in type" :value="item"> </a-select-option>
      </a-select>
    </section>
    <a-divider />
    <main style="width:80%" class="edit-problem">
      <div style="flex:1 0 auto;box-sizing:border-box;">
        <AInput size="large" placeholder="请输入题目标题" v-model:value="problem.title" />
        <Tinymce placeholder="请输入题目描述" v-model:value="problem.question" style="margin-top: 30px;" />

        <div v-if="isSelectProblem" class="font-strong" style="margin-top:20px">
          <label>多选：</label>
          <ASwitch v-model:checked="checked">开启</ASwitch>
        </div>

        <div class="font-strong" style="margin-top:20px">
          <span> {{ isSelectProblem ? "选项" : isDati ? "正确答案" : "填空答案" }} </span>
          <span v-show="isSelectProblem" class="right" style="margin-right: 30px;">正确答案</span>
        </div>
        <div v-if="!isDati">
          <div v-for="(_, index) in ansNum" class="flex-center" style="margin:20px 0">
            <span style="width: 30px;">{{ index + 1 }}.</span>
            <AInput style="background-color: #fafafa;" />
            <a-checkbox v-if="isSelectProblem" style="transform: scale(1.2);margin-left:30px;" />
            <MinusOutlined @click="delAns" style="margin-left:30px;" />
          </div>
          <PlusOutlined @click="addAns" />
        </div>
        <Tinymce v-else placeholder="请输入题目答案" v-model:value="ansContent" style="margin: 20px 0;"></Tinymce>
        <ADivider />
      </div>
      <div class="property">
        <p class="property-title">属性（必填）</p>
        <a-form name="Property">
          <a-form-item name="难度" label="难度">
            <a-select placeholder="请选择难度" v-model:value="problem.difficulty">
              <a-select-option v-for="item in difficultyArr" :value="item">{{ item }}</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item name="课程" label="课程">
            <a-select placeholder="请选择课程" v-model:value="problem.courseName">
              <a-select-option value="软件工程">软件工程</a-select-option>
              <a-select-option value="数据结构">数据结构</a-select-option>
              <a-select-option value="计算机组成原理">程序设计</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item name="标签" label="标签">
            <a-select mode="tags" placeholder="请输入标签" @change="selectTags">
              <a-select-option v-for="tag in tags" :value="tag">{{ tag }}</a-select-option>
            </a-select>
          </a-form-item>
        </a-form>
      </div>
    </main>
    <div>
      <!-- <AButton type="default" class="shadow" style="margin-right:1rem;border-radius: 8px;">保存草稿</AButton> -->
      <AButton type="primary" class="shadow" style="border-radius: 8px;" @click="createProblem">发布题目</AButton>
    </div>
  </div>
</template>


<style scoped lang="less">
.edit {
  padding: 50px;
}

.edit-problem {
  display: flex;
}

.property {
  margin-top: 70px;
  border-radius: 10px;
  margin-left: 30px;
  width: 200px;

  &-title {
    font-size: 18px;
    color: @blue;
    font-weight: bold;
  }
}

.font-strong {
  font-size: 16px;
  font-weight: bold;
}
</style>