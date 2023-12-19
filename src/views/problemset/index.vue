<script setup lang="ts">
import { message } from 'ant-design-vue'
import type { TableProps } from 'ant-design-vue/lib/table'
import type { ColumnsType, SorterResult, TablePaginationConfig } from 'ant-design-vue/lib/table/interface'
import type { Problem } from '@/types/store'
import { problemStore, userStore } from '@/store'

const router = useRouter()
const store = problemStore()
const { difficultyArr, categoryArr } = store
const problemList = computed(() => store.problemList)
const tags = computed(() => store.tags.map(tag => tag.tagName))
const courses = computed(() => store.courses)
const hotList = ref<Problem.problem[]>([])
const pagination = reactive<TablePaginationConfig>({
  pageSize: 10, // 默认每页显示数量
  showSizeChanger: true, // 显示可改变每页数量
  pageSizeOptions: ['10', '20', '30', '40'], // 每页数量选项
  current: 1,
  total: 0,
  showTotal: (total) => {
    return `共 ${total} 条`
  },
})
// Echart饼图
const { chartEle, changeChart, cardActiveKey, evaluteChartData } = useCharts()
// 初始化数据
onBeforeMount(async () => {
  const { problems: problemList, problemsNumber } = await getProblemList()
  pagination.total = problemsNumber
  store.setProblemList(problemList)
  evaluteChartData(problemList)
  const tags = await getProblemTags()
  store.setTags(tags)
  hotList.value = (await getProblemList({
    orders: [{
      orderBy: 'cnt', // 按通过数排序
      sortOrder: 'DESC', // 降序
    }],
    offset: 0, // 偏移
    limit: 10, // 分页大小
  })).problems
})

// 筛选参数
const filters = reactive<Problem.filters>({
  category: '', // 题目类型
  courseName: '', // 课程
  searcherKeyWords: '', // 题目 或 题目id
  orders: [{
    orderBy: 'id', // 按通过数排序
    sortOrder: 'ASC', // 降序
  }, {
    orderBy: 'id', // 按通过数排序
    sortOrder: '',
  }],
  tag: '', // 标签
  offset: 0, // 偏移
  limit: 10, // 分页大小
})
watch(() => filters, () => {
  getProblemList(filters).then((res) => {
    store.setProblemList(res.problems)
    pagination.total = res.problemsNumber
  })
}, { deep: true })

function handleFilters(type: string, value: any) {
  value = value || ''
  switch (type) {
    case 'search':
      filters.searcherKeyWords = value
      break
    case 'difficulty':
      if (value === '')
        filters.difficulty = 0
      else filters.difficulty = difficultyArr.indexOf(value)
      break
    case 'tag':
      filters.tag = value
      break
    case 'courseName':
      filters.courseName = value
      break
  }
}

// 课程类型选择
const currentCategory = ref('全部')
function changeCategory(category: string) {
  if (category === '全部')
    filters.category = ''
  else
    filters.category = category
}
// 难度样式
function difficultyColor(difficulty: number) {
  switch (difficulty) {
    case 1: return 'easy'
    case 2: return 'medium'
    case 3: return 'hard'
  }
}

// 表格列配置
const role = userStore().userInfo.role

const columns: ColumnsType = [{
  title: '编号',
  dataIndex: 'id',
  width: '100px',
}, {
  title: '题目',
  dataIndex: 'title',
  width: '20%',
}, {
  title: '课程',
  dataIndex: 'courseName',
  width: '180px',
}, {
  title: '类型',
  dataIndex: 'category',
  width: '120px',
}, {
  title: '通过人数',
  dataIndex: 'Cnt',
  width: '120px',
  sorter: true,
}, {
  title: '难度',
  dataIndex: 'difficulty',
  width: '100px',
}]
if (role === 1) {
  columns.push({
    title: '状态',
    dataIndex: 'pass',
    width: '90px',
    align: 'center',
  }, {
    title: '收藏',
    dataIndex: 'favour',
    width: '90px',
    align: 'center',
  })
}
else {
  columns.push({
    title: '操作',
    dataIndex: 'actions',
    width: '180px',
    align: 'center',
  })
}

// 收藏
async function handleFavour(row: any) {
  const id = row.id
  if (row.favour) {
    const res = await cancelFavourProblem(id)
    if (res.code === 0) {
      message.success('取消收藏')
      row.favour = false
    }
  }
  else {
    const res = await favourProblem(id)
    if (res.code === 0) {
      message.success('收藏成功')
      row.favour = true
    }
  }
}

// [老师] 操作
async function handleDelete(id: number) {
  const res = await deleteProblem(id)
  if (res.code === 0) {
    const { problems: problemList, problemsNumber } = await getProblemList(filters)
    pagination.total = problemsNumber
    evaluteChartData(problemList)
    store.setProblemList(problemList)
    message.success('删除成功')
  }
  else {
    message.error(`删除失败，${res.message}`)
  }
}

// 标签展示
// const tagsFilter = ref<string[]>([])
// watch(() => filters, (newVal, oldVal) => {
//   console.log(newVal);
//   console.log(oldVal);
//   tagsFilter.value = [...Object.values(newVal)]
// }, { deep: true })

// const closeTag = (condition: string) => {
//   tagsFilter.value = tagsFilter.value.filter(item => item !== condition)
//   // for (const p in Object.keys(filters)) {
//   //   if (filters[p] == condition) {
//   //     filters[p] = ''
//   //   }
// };

// 分页控制

// 表格分页、筛选、排序处理
const handleTableChange: TableProps['onChange'] = (pag, filter, sorter) => {
  // pagination
  const { current, pageSize } = pag
  if (filters.offset !== current) {
    pagination.current = current
    filters.offset = (current - 1) * pageSize
  }
  if (filters.limit !== pageSize) {
    pagination.pageSize = pageSize
    filters.limit = pageSize
  }
  // sorter
  const order = (sorter as SorterResult<any>).order
  switch (order) {
    case 'ascend':
      filters.orders[0] = {
        orderBy: 'cnt',
        sortOrder: 'ASC',
      }
      break
    case 'descend':
      filters.orders[0] = {
        orderBy: 'cnt',
        sortOrder: 'DESC',
      }
      break
    default:
      filters.orders[0] = {
        orderBy: 'id',
        sortOrder: 'ASC',
      }
  }
}

function randomProblem() {
  if (problemList.value.length > 0) {
    const randomIndex = Math.floor(Math.random() * problemList.value.length)
    const randomProblem = problemList.value[randomIndex]
    router.push({
      path: `/problem/${randomProblem.id}`,
    })
  }
}
</script>

<template>
  <div class="problemset">
    <section>
      <AInputSearch placeholder="搜索题目名称" allow-clear style="width:20em" @search="handleFilters('search', $event)" />
      <ASpace style="margin-left: 20px;">
        <ASelect placeholder="难度" class="tagSelect" @change="handleFilters('difficulty', $event)">
          <ASelectOption v-for="(difficulty, index) in difficultyArr.slice(1)" :key="index" :value="difficulty">
            {{ difficulty }}
          </ASelectOption>
        </ASelect>
        <ASelect allow-clear placeholder="标签" class="tagSelect" @change="handleFilters('tag', $event)">
          <ASelectOption v-for="(tag, index) in tags" :key="index" :value="tag">
            {{ tag }}
          </ASelectOption>
        </ASelect>
        <ASelect allow-clear placeholder="课程" class="tagSelect" @change="handleFilters('courseName', $event)">
          <ASelectOption v-for="(courseName, index) in courses" :key="index" :value="courseName">
            {{ courseName }}
          </ASelectOption>
        </ASelect>
      </ASpace>
      <!-- <span v-for="condition in filters">
        <ATag closable @close="closeTag(condition)" v-if="condition" class="tags">
          {{ condition }}
        </ATag>
      </span> -->
    </section>
    <div style="display: flex;">
      <div style="margin-top: 20px;  flex:1 0 auto;margin-right: 30px;">
        <ATabs v-model:activeKey="currentCategory" style="display:inline-block;" @change="changeCategory">
          <ATabPane v-for="category in categoryArr" :key="category" :tab="category" />
        </ATabs>
        <span
          class="right" style="display:flex;align-items: center;margin-top:5px; margin-right:60px;color:#7B88FF;"
          @click="randomProblem"
        >
          <span class="random shadow">
            <RandomIcon color="#fff" />
          </span>随机一题
        </span>
        <ATable :columns="columns" :data-source="problemList" :pagination="pagination" @change="handleTableChange">
          <template #bodyCell="{ column, record }">
            <template v-if="column.dataIndex === 'title'">
              <RouterLink :to="{ path: `/problem/${record.id}` }" class="link">
                {{ record.title }}
              </RouterLink>
            </template>
            <template v-else-if="column.dataIndex === 'difficulty'">
              <div :class="difficultyColor(record.difficulty)">
                {{ difficultyArr[record.difficulty] }}
              </div>
            </template>
            <template v-else-if="column.dataIndex === 'pass'">
              <check-outlined v-if="record.pass" style="color: #81B337" />
            </template>
            <template v-else-if="column.dataIndex === 'favour'">
              <div @click="handleFavour(record)">
                <StarFilled v-if="record.favour" class="favour icon" />
                <StarOutlined v-else class="favour icon" />
              </div>
            </template>
            <template v-else-if="column.dataIndex === 'actions'">
              <RouterLink :to="{ name: 'EditProblem', query: { id: record.id, title: record.title } }">
                修改
              </RouterLink>
              <ADivider type="vertical" />
              <APopconfirm v-if="problemList.length" title="确定删除？" @confirm="handleDelete(record.id)">
                <a>删除</a>
              </APopconfirm>
            </template>
          </template>
        </ATable>
      </div>
      <div class="card-container">
        <div v-if="role === 2" class=" top card shadow">
          <div class="align-center">
            <CarryOutOutlined class="icon" style="color: #27BD9E;" />
            <div style="margin-left: 5px;">
              我的题库
            </div>
          </div>
          <RightOutlined style="font-size:14px" />
        </div>
        <div class="statistics card shadow">
          <p>题型</p>
          <ATabs v-model:activeKey="cardActiveKey" class="problemTabs" @change="changeChart">
            <ATabPane key="difficulty" tab="难度" />
            <ATabPane key="category" tab="类型" />
            <!-- <ATabPane key="3" tab="已完成">
            </ATabPane> -->
          </ATabs>
          <div ref="chartEle" style="width: 100%; height: 160px;" />
        </div>
        <div class="hot card shadow">
          <p>
            <FireOutlined class="icon" style="color: #BD3124 ;" /> 热门题目
          </p>
          <AList :data-source="hotList" class="hotProblemList">
            <template #renderItem="{ item }">
              <AListItem>
                {{ item.id }}. {{ item.title }}
              </AListItem>
            </template>
          </AList>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.problemset {
  padding-top: 40px;
  padding-bottom: 30px;
  padding-left: 50px;
  padding-right: 60px;
}

.class-container {
  margin-top: 10px;
  display: grid;
  justify-content: flex-start;
  grid-template-columns: repeat(4, 1fr);
  grid-gap: 24px;
}

.tagSelect {
  margin-right: 10px;
  width: fit-content;
}

.tags {
  margin-right: 10px;
  padding: 6px 10px;
  font-size: 14px;

}

.card-container {
  margin-top: 40px;
  display: flex;
  flex-direction: column;
}

.card {
  box-sizing: border-box;
  width: 240px;
  padding: 20px;
  border-radius: 16px;
  margin-bottom: 14px;
}

.hot {
  padding-bottom: 10px;
}

.top {
  height: 62px;
  line-height: 62px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.random {
  display: inline-block;
  width: 32px;
  height: 32px;
  padding: 6px;
  border-radius: 50%;
  background-color: #7B88FF;
  margin-right: 6px;
}

.link {
  color: #000;

  &:hover {
    color: @blue;
  }
}
</style>
