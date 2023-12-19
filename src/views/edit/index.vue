<script setup lang="ts">
import { message } from 'ant-design-vue'
import { problemStore } from '@/store'

const router = useRouter()
const id = useRoute().query?.id

const store = problemStore()
const { difficultyArr, categoryArr, courses } = store
const tags = computed(() => store.tags.map(tag => tag.tagName))
const problem = reactive({
  title: '',
  question: '',
  category: '选择',
  courseName: '',
  difficulty: 1,
  tags: [],
  ans: '',
})

const showTags = ref([])

onBeforeMount(async () => {
  const tags = await getProblemTags()
  store.setTags(tags)
  if (id !== undefined) {
    const res = await getProblemDetail(Number(id))
    problem.title = res.title
    problem.question = res.question
    problem.category = res.category
    problem.courseName = res.courseName
    problem.difficulty = res.difficulty
    problem.tags = res.tags
    problem.ans = res.ans
    showTags.value = res.tags.map(tag => tag.tagName)
  }
})

const options = ref([])
function onSearch(searchText: string) {
  options.value = !searchText
    ? []
    : courses.map(course => (course.includes(searchText) ? { value: course } : '')).filter(Boolean)
}
function onSelect(value: string) {
  problem.courseName = value
}
function onChange(value: string) {
  problem.courseName = value
}
function selectTags(tags: any[]) {
  problem.tags = tags.map(val => ({ tagName: val }))
}

const isSelectProblem = computed(() => {
  return problem.category === categoryArr[1]
})

// 多选开关
const checked = ref<boolean>(false)
const ansNum = ref(4)
function addAns() {
  ansNum.value++
}
function delAns() {
  ansNum.value--
}

async function handleEdit() {
  const isFinish = Object.values(problem).every(Boolean)
  if (isFinish) {
    if (id !== undefined) {
      const res: any = await updateProblem(Number(id), problem)
      if (res.code === 0) {
        message.success('修改成功')
        router.push('/problem')
      }
    }
    else {
      const res: any = await createProblem(problem)
      if (res.code === 0) {
        message.success('新建题目')
        router.push('/problem')
      }
    }
  }
  else {
    message.error('数据缺失，无法新建题目')
  }
}
</script>

<template>
  <div class="edit">
    <section>
      <ASelect v-model:value="problem.category" style="width: 120px" size="large" class="tagSelect">
        <ASelectOption v-for="(item, index) in categoryArr.slice(1)" :key="index" :value="item" />
      </ASelect>
    </section>
    <ADivider />
    <main style="width: 80%" class="edit-problem">
      <div style="box-sizing: border-box; width: 70%">
        <AInput v-model:value="problem.title" size="large" placeholder="请输入题目标题" />
        <RichTextEditor v-model="problem.question" placeholder="请输入题目描述，如需填空请使用下划线替代" style="margin-top: 30px" />
        <div v-if="isSelectProblem" class="font-strong" style="margin-top: 20px">
          <div v-if="problem.category === '选择'">
            <label>多选：</label>
            <ASwitch v-model:checked="checked" />
          </div>

          <!-- <div class="font-strong" style="margin-top:20px">
          <span> {{ isSelectProblem ? "选项" : isDati ? problem.category == categoryArr[4] ? "代码题解" : "大题答案" : "填空答案" }}
          </span>
          <span v-show="isSelectProblem" class="right" style="margin-right: 30px;">正确答案</span>
        </div> -->
          <div v-for="(_, index) in ansNum" :key="index" class="flex-center" style="margin: 20px 0">
            <span style="width: 30px">{{ index + 1 }}.</span>
            <AInput style="background-color: #fafafa" />
            <ACheckbox v-if="isSelectProblem" style="transform: scale(1.2); margin-left: 30px" />
            <MinusOutlined style="margin-left: 30px" @click="delAns" />
          </div>
          <PlusOutlined @click="addAns" />
        </div>
        <!-- 因无判题故修改 -->
        <div class="font-strong" style="margin-top: 20px">
          题目答案
        </div>
        <RichTextEditor v-model="problem.ans" placeholder="请输入题目答案" style="margin: 20px 0" />
        <ADivider />
      </div>
      <div class="property">
        <p class="property-title">
          属性（必填）
        </p>
        <AForm name="Property">
          <AFormItem name="难度" label="难度">
            <ASelect v-model:value="problem.difficulty" placeholder="请选择难度">
              <ASelectOption v-for="(item, index) in difficultyArr.slice(1)" :key="index" :value="index + 1">
                {{ item }}
              </ASelectOption>
            </ASelect>
          </AFormItem>
          <AFormItem name="课程" label="课程">
            <AAutoComplete
              v-model:value="problem.courseName" :options="options" allow-clear default-open
              placeholder="请输入课程" @select="onSelect" @search="onSearch" @change="onChange"
            />
          </AFormItem>
          <AFormItem name="标签" label="标签">
            <ASelect v-model:value="showTags" mode="tags" placeholder="请输入标签" @change="selectTags">
              <ASelectOption v-for="(tag, index) in tags" :key="index" :value="tag">
                {{ tag }}
              </ASelectOption>
            </ASelect>
          </AFormItem>
        </AForm>
      </div>
    </main>
    <div>
      <!-- <AButton type="default" class="shadow" style="margin-right:1rem;border-radius: 8px;">保存草稿</AButton> -->
      <AButton type="primary" class="shadow" style="border-radius: 8px" @click="handleEdit">
        发布题目
      </AButton>
    </div>
  </div>
</template>

<style scoped lang="less">
.edit {
  padding: 50px;
}

.edit-problem {
  display: flex;
  width: 100%;
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
