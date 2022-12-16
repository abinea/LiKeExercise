<script lang="ts" setup >
import HeadBar from '@/layout/HeadBar.vue';
import MonacoEditor from '@/components/MonacoEditor.vue';
import problemApi from '@/api/problem';
import solutionApi from '@/api/solution';
import { Solution } from '@/types/store';
import { message } from "ant-design-vue"
import { problemStore, userStore } from '@/store';
import { formatDate } from "@/utils/formatUtils"

const route = useRoute()
const id = Number(route.params.id)

const store = problemStore()
const uid = computed(() => userStore().userInfo.schoolId)
const difficultyArr = store.difficultyArr

const editorProps = reactive({
  width: "60vw",
  height: '70vh',
  theme: 'light',
  language: "javascript"
})

const isSolution = ref(false)
const isCreateSolution = ref(false)

const changeSolution = () => isSolution.value = !isSolution.value


const solutionList = ref<Solution.solution[]>([])
const solutionCount = ref(0)
onBeforeMount(async () => {
  const res = await solutionApi.solutionAll(id)
  solutionList.value = res.solutions
  solutionCount.value = res.solutionsNumber;
  currentId.value = res.solutions[0]?.id || 0;
})

// 难度样式
function difficultyColor(difficulty: number) {
  switch (difficulty) {
    case 1: return "easy"
    case 2: return "medium"
    case 3: return "hard"
  }
}

const currentId = ref(0);
const currentSolution = ref<Solution.solution>(null)
watch(() => currentId.value, async (currentVal) => {
  currentSolution.value = await solutionApi.solutionDetail(id, currentVal)
  console.log(currentSolution.value);
  // commentUser
  currentCommentUser.value = await Promise.all(currentSolution.value.comments.map(async comment => await solutionApi.commentUser(comment.schoolId)))
  currentCommentUser.value.unshift(await solutionApi.commentUser(currentSolution.value.schoolId))
  console.log("评论", currentCommentUser.value);
})

const changeCurrentId = (val: number) => {
  currentId.value = val
}

const problem = reactive({
  id,
  title: '',
  question: "",
  category: "选择",
  courseName: "",
  difficulty: 1,
  tags: [],
  ans: "<p><br></p>",
  Cnt: 0,
  favour: true
})

onBeforeMount(async () => {
  const res = await problemApi.problemDetail(problem.id)
  console.log('题目', res);
  problem.title = res.title
  problem.question = res.question
  problem.category = res.category
  problem.courseName = res.courseName
  problem.difficulty = res.difficulty
  problem.tags = res.tags
  problem.ans = res.ans
  problem.Cnt = res.Cnt
  problem.favour = res.favour
})

// 收藏
async function handleFavour() {
  if (problem.favour) {
    const res = await problemApi.problemCancelFavour(id)
    console.log('取消收藏', res);
    if (res.code == 0) {
      message.success("取消收藏")
      problem.favour = false
    }
  } else {
    const res = await problemApi.problemFavour(id)
    console.log('添加收藏', res);
    if (res.code == 0) {
      message.success("收藏成功")
      problem.favour = true
    }
  }
}

const handleClose = () => {
  if (isCreateSolution.value) {
    isCreateSolution.value = false
    isEditing.value = false
    solution.value.title = ""
    solution.value.content = ""
  } else {
    isSolution.value = false
  }
}

const solution = ref({
  title: "",
  content: ""
})

const handleSolution = async () => {
  if (solution.value.title.trim() == "" || solution.value.content.trim() == "") {
    message.error("标题或内容不能为空")
    return
  } else {
    if (!isEditing.value) {
      console.log('create');
      await solutionApi.solutionCreate(id, solution.value)
    } else {
      console.log("update");
      await solutionApi.solutionUpdate(id, currentId.value, { ...solution.value, schoolId: uid.value })
    }
    const res = await solutionApi.solutionAll(id)
    if (solutionCount.value == 0) {
      currentId.value = res.solutions[0]?.id || 0
    }
    solutionList.value = res.solutions
    solutionCount.value = res.solutionsNumber;
    currentSolution.value = await solutionApi.solutionDetail(id, currentId.value)
    currentCommentUser.value = await Promise.all(currentSolution.value.comments.map(async comment => await solutionApi.commentUser(comment.schoolId)))
    currentCommentUser.value.unshift(await solutionApi.commentUser(currentSolution.value.schoolId))
    isCreateSolution.value = false
    isEditing.value = false
    solution.value.title = ""
    solution.value.content = ""
    message.success("提交成功")
  }
}

const answer = ref("")
const submitCode = async () => {
  console.log(answer.value);
  if (answer.value.trim() == "") {
    message.error("答案不能为空")
    return
  }
  await problemApi.problemCommit(id)
  message.success("提交成功")
  if (problem.ans) ansVisible.value = true
}


// 评论
const currentCommentUser = ref<Solution.CommentUser[]>([])
watch(() => currentCommentUser.value, (newVal) => {
  console.log("评论", newVal);
})
const comment = ref("")
const handleComment = async () => {
  if (comment.value.trim() == "") {
    message.error("评论不能为空")
    return
  }
  await solutionApi.commentCreate(id, currentId.value, comment.value)
  message.success("评论成功")
  currentSolution.value = await solutionApi.solutionDetail(id, currentId.value)
  currentCommentUser.value = await Promise.all(currentSolution.value.comments.map(async comment => await solutionApi.commentUser(comment.schoolId)))
  currentCommentUser.value.unshift(await solutionApi.commentUser(currentSolution.value.schoolId))
  comment.value = ""
}

const currentCommentLength = ref(0)
watch(() => currentSolution.value, (newVal) => {
  currentCommentLength.value = newVal.comments.length
})


const selectedAnswer = ref([])
const selectedOptions = ref([{
  label: 'A. 与目标系统有关的物理实体',
  value: 'A'
}, {
  label: 'B. 与目标系统发生作用和人或组织的角色',
  value: 'B'
}, {
  label: 'C. 目标系统运行中需记忆的事件',
  value: 'C'
}, {
  label: 'D. 目标系统中环境场所的状态',
  value: 'D'
}])
const submitSelect = async () => {
  if (selectedAnswer.value.length == 0) {
    message.error("请选择答案")
    return
  }
  message.success("提交成功")
  if (problem.ans) ansVisible.value = true
}

const ansVisible = ref(false)
const handleAnsVisible = () => ansVisible.value = false

const isRightShow = computed(() => {
  if (problem.category === '选择' || problem.category === '填空') {
    if (isSolution.value) {
      if (isCreateSolution.value) return true
      else {
        if (solutionList.value.length == 0) return false
        else return true
      }
    } else {
      return false
    }
  } else {
    return true
  }
})

const isEditing = ref(false)
const handleEdit = () => {
  solution.value.title = currentSolution.value.title
  solution.value.content = currentSolution.value.content
  isCreateSolution.value = true
  isEditing.value = true
}

const handleDelete = async () => {
  await solutionApi.solutionDetele(id, currentId.value)
  const res = await solutionApi.solutionAll(id)
  solutionList.value = res.solutions
  solutionCount.value = res.solutionsNumber;
  changeCurrentId(res.solutions[0]?.id || 0)
  message.success("删除成功")
}

</script>    
<template >
  <HeadBar :isSingle="true" style="background-color: #f2f4f7;"></HeadBar>
  <div class="detail-page">
    <!-- 题目描述 -->
    <div class="flex-left" :style="problem?.category === '选择' || problem?.category === '填空' ? 'max-width:60vw' : ''">
      <section class="widget" style="margin-bottom: 16px;">
        <div>
          <h1 style="display:inline-block;">
            <span style="margin-right: 10px;">{{ problem?.id }}</span>
            <span>{{ problem?.title }}</span>
          </h1>
          <AButton class="right" style="margin-right: 10px;" @click="changeSolution">{{ isSolution ? "返回题目" : "查看题解" }}
          </AButton>
        </div>
        <div class="stat">
          <ASpace size="large">
            <span :class="difficultyColor(problem?.difficulty)">{{ difficultyArr[problem?.difficulty] }}</span>
            <span>题型：{{ problem.category }}</span>
            <span>课程：{{ problem?.courseName }}</span>
            <span>通过人数：{{ problem.Cnt }}</span>
            <span @click="handleFavour()">
              <StarFilled class="favour icon" v-if="problem.favour" />
              <StarOutlined class="favour icon" v-else />
            </span>
          </ASpace>
        </div>
      </section>
      <div v-if="isSolution">
        <section class="widget description">
          <div class="title">已有题解
            <span style="margin-right: 20px;font-size: 14px;" @click="() => { isCreateSolution = true }">
              <PlusCircleOutlined /> 写题解
            </span>
          </div>
          <AList :data-source="solutionList" style="width: 100%;">
            <template #renderItem="{ item }">
              <AListItem class="solution content" @click="changeCurrentId(item.id)" style="cursor: pointer;">
                <h3 style="font-size:16px;font-weight:500;">{{ item.title }}</h3>
                <div class="solution-preview">{{ item.content.slice(0, 300).replace(new RegExp(`<\ /?.+?>`, 'g'), ' ')
                }}
                </div>
              </AListItem>
            </template>
          </AList>
        </section>
      </div>
      <div v-else>
        <section class="widget description">
          <div>
            <div class="title">题目描述</div>
            <RichTextEditor class="content" v-model="problem.question" :readonly="true" :scroll="false" />
          </div>
          <div v-if="problem?.category === '选择'">
            <div class="title">题目选项</div>
            <div class="content">
              <AFormItem>
                <ACheckboxGroup v-model:value="selectedAnswer" :options="selectedOptions"
                  style="display: grid;gap: 24px;">
                </ACheckboxGroup>
              </AFormItem>
              <div style="display: flex;justify-content: flex-end;">
                <AButton type="primary" class="submit-green" @click="submitSelect">提交</AButton>
              </div>
            </div>
          </div>
          <div v-else-if="problem?.category === '填空'">
            <div class="title">题目答案</div>
            <div class="content">
              <AFormItem>
                <AInput v-model:value="selectedAnswer" placeholder="请输入答案" />
              </AFormItem>
              <div style="display: flex;justify-content: flex-end;">
                <AButton type="primary" class="submit-green" @click="submitSelect">提交</AButton>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
    <!-- TODO: 可拖拽变更左右flex-grow -->
    <!-- <div data-is-collapsed="false" class="resizeBar" style="position: relative; flex: 0 0 12px;">
      <div
        style="position: absolute; inset: 0px; cursor: col-resize; -webkit-tap-highlight-color: transparent; user-select: none;">
      </div>
    </div> -->
    <!-- 题目代码 -->
    <div class="flex-right" v-if="isRightShow">
      <section v-if="isCreateSolution" class="widget ">
        <div class="code">
          <AButton @click="handleClose">关闭</AButton>
          <AButton type="primary" danger @click="handleSolution()" class="right">
            发布题解</AButton>
          <AInput size="large" v-model:value="solution.title" placeholder="请输入题解标题" style="margin-top: 30px;" />
          <RichTextEditor style="margin-top: 24px;" placeholder="请输入题解内容" v-model="solution.content" />
        </div>
      </section>
      <section v-else class="widget">
        <div class="code">
          <div v-if="isSolution" class="answer">
            <h2>{{ currentSolution?.title }}</h2>
            <ASpace class="subtitlte">
              {{ currentCommentUser[0]?.username }}
              <ATag v-if="currentCommentUser[0]?.role == 1" color="green" style="font-weight:700;border-radius:10px"> 学生
              </ATag>
              <ATag v-else color="blue" style="font-weight:700;border-radius:10px"> 老师 </ATag>
              &nbsp;发布于 {{
                  formatDate(currentSolution?.createdAt)
              }}
            </ASpace>
            <ASpace class="right" size="large" style="font-size:12px;color:#8e8e8e"
              v-if="uid === currentSolution?.schoolId">
              <span @click="handleEdit">
                <EditOutlined class="icon" />修改
              </span>
              <span>
                <APopconfirm title="确定删除该题解?" ok-text="是" cancel-text="否" @confirm="handleDelete"><delete-outlined
                    class="icon" />删除</APopconfirm>
              </span>
            </ASpace>
            <ADivider style="margin:16px 0"> </ADivider>
            <RichTextEditor class="solution-content" v-model="currentSolution.content" :readonly="true"
              :scroll="false" />
            <ADivider style="margin:16px 0"> </ADivider>
            <h3 class="title"><span style="font-size: 20px;">{{
                currentSolution?.comments?.length ? currentSolution?.comments?.length : 0
            }}</span> 条评论</h3>
            <div class="comment">
              <ATextarea v-model:value="comment" placeholder="请输入评论内容" :auto-size="{ minRows: 4, maxRows: 7 }" />
              <div style="display:flex;justify-content: flex-end;">
                <AButton size="small" type="primary" @click="handleComment"
                  style="margin-top: 20px;margin-bottom: 20px;" class="submit-green">评论
                </AButton>
              </div>
              <div v-if="!currentSolution?.comments.length"
                style="text-align: center;margin-bottom: 20px;color: #bfbfbf; font-size: 24px;">
                <span>暂无评论</span>
              </div>
              <AList v-else>
                <template v-for="item, index in currentSolution.comments">
                  <AListItem style="flex-direction: column;align-items: flex-start;color: #595959;">
                    <div style="display:flex;justify-content: space-between;width:100%;">
                      <ASpace style="font-weight: 500;">
                        {{ currentCommentUser[index + 1]?.username }}
                        <ATag v-if="currentCommentUser[index + 1]?.role == 1" color="green"
                          style="font-weight:700;border-radius:10px"> 学生 </ATag>
                        <ATag v-else color="blue" style="font-weight:700;border-radius:10px"> 老师 </ATag>
                      </ASpace>

                      <span style="color: #bfbfbf;display: flex;align-items: center;">
                        评论于
                        <div class="dot"></div>
                        {{ formatDate(item.createdAt)
                        }}
                      </span>
                    </div>
                    <div>
                      <div class="comment-content">
                        {{ item.content }}
                      </div>
                    </div>
                  </AListItem>
                </template>
              </AList>
            </div>
          </div>
          <div v-else class="code-content">
            <div v-if="problem?.category == '代码'">
              <div class=" code-editor-title">
                <span style="margin-left:26px">
                  <label>语言：</label>
                  <ASelect v-model:value="editorProps.language" style=" margin-right:30px">
                    <ASelectOption value="c">C</ASelectOption>
                    <ASelectOption value="cpp">C++</ASelectOption>
                    <ASelectOption value="python">Python</ASelectOption>
                    <ASelectOption value="javascript">JavaScript</ASelectOption>
                    <ASelectOption value="typescript">TypeScript</ASelectOption>
                  </ASelect>
                </span>
                <span style="margin-left:26px">
                  <label>主题：</label>
                  <ASelect v-model:value="editorProps.theme" style="width: 160px">
                    <ASelectOption value="light">Visual Studio</ASelectOption>
                    <ASelectOption value="vs-dark">Visual Studio Dark</ASelectOption>
                  </ASelect>
                </span>
              </div>
              <div class="code-editor">
                <MonacoEditor :theme="editorProps.theme" :width="editorProps.width" :height="editorProps.height"
                  :language="editorProps.language" v-model:value="answer" />
                <ADivider style="margin:16px 0"> </ADivider>
                <div style="display: flex;justify-content:end;">
                  <AButton type="primary" @click="submitCode" class="submit-green">
                    提交</AButton>
                </div>
              </div>
            </div>
            <div v-else>
              <h3>题目答案</h3>
              <RichTextEditor v-model="answer" placeholder="请输入答案" style="margin-top: 20px;" />
              <ADivider style="margin:16px 0"> </ADivider>
              <div style="display: flex;justify-content:end;">
                <AButton type="primary" @click="submitCode" class="submit-green">
                  提交</AButton>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
  <!-- 题目答案 -->
  <AModal v-if="problem.ans != '<p><br></p>' && problem.ans != ''" v-model:visible="ansVisible" @ok="handleAnsVisible"
    :cancelable="false" title="本题参考答案" :keyboard="true" width="38vw">
    <RichTextEditor v-model="problem.ans" :readonly="true" />
  </AModal>
</template>

<style scoped lang="less">
.detail-page {
  display: flex;
  justify-content: center;
  min-height: 96vh;
  padding: 20px 40px;
  box-sizing: border-box;
  background-color: #f9f9f9;
  overflow-x: hidden;
}

.flex-left {
  flex: 1 0 0;
  min-width: 480px;
  padding: 10px 6px 10px 10px;
  box-sizing: border-box;
}

.flex-right {
  flex: 1 0 0;
  padding: 10px 10px 10px 6px;
  box-sizing: border-box;

  .code {
    padding: 14px;
    width: 60vw;
  }

  .code-editor {
    margin-top: 14px;
  }
}

.resizeBar {
  z-index: 1;
  background: linear-gradient(to bottom, #f7f7f7, 10%, #ffffff 90%);
  color: #c1c1c1;

  &::before {
    inset: 0px -1px;
    background: #dfdfdf;
    opacity: 0;
    transition: opacity 0.3s ease 0s;
    content: "";
    position: absolute;
    pointer-events: none;
    box-sizing: border-box;

  }

  &:hover {
    &::before {
      opacity: 1;
    }

    color: #fff;
  }

  &::after {

    opacity: 1;
    width: 2px;
    height: 2px;
    border-radius: 100%;
    display: flex;
    flex-direction: column;
    background: currentcolor;
    box-shadow: currentcolor 0px 8px 0px,
      currentcolor 0px 16px 0px,
      currentcolor 0px 24px 0px,
      currentcolor 0px 32px 0px,
      currentcolor 0px 40px 0px;
    transition: background-color 0.3s ease 0s,
      box-shadow 0.3s ease 0s;
    top: 39.7%;
    left: 50%;
    transform: translateX(-50%);
    content: "";
    position: absolute;
    pointer-events: none;
  }
}


.widget {
  background-color: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
}


.description {
  padding: 0;
  border-radius: 4px;

  .title {
    width: 100%;
    border-left: 5px solid #d0d0d0;
    background-color: #f5f7f9;
    padding: 10px;
    font-size: 17px;
    font-weight: 500;
    display: flex;
    align-items: center;
    justify-content: space-between;

  }

  .content {
    padding: 22px;

    h4 {
      font-size: 15px;
      margin-bottom: 14px;
    }
  }

  .solution {
    flex: 1 1 0px;
    min-height: 96px;
    display: block;
    padding: 12px 18px;
    overflow: hidden;

    &:hover {
      background-color: #f7f7f7;
    }

    &-preview {
      font-size: 12px;
      overflow: hidden;
      flex: 1 1 auto;
      line-height: 16px;
      height: 34px;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      display: -webkit-box;
      text-overflow: ellipsis;
    }
  }
}

.answer {
  padding: 0px 30px;
}

.submit-green {
  background-color: #2db55d;
  border: 0px;
}

.subtitlte {
  color: #8c8c8c;
}

.comment-content {
  margin: 10px 0px;
  font-size: 13px;
}

.dot {
  width: 4px;
  height: 4px;
  border-radius: 100%;
  background: #bfbfbf;
  margin: 0px 8px;
  box-sizing: border-box;
}

.solution-content {
  pre {
    background-color: #bfbfbf;
  }
}
</style>

