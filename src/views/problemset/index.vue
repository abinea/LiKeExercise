<script setup lang="ts">
import Random from '@/components/Random.vue';
import { message } from "ant-design-vue"
import { ECharts, EChartsOption, init, registerCoordinateSystem } from 'echarts';
import { difficultyArr, problemStore } from '@/store/problem';
import { Problem } from "@/types/store"
import type { ColumnsType } from 'ant-design-vue/es/table/interface';
import { userStore } from '@/store/user';

const store = problemStore()
// const router = useRouter()
const role = userStore().userInfo.role || 1
console.log("role", role);


const problemList = ref<Problem.problem[]>([])

// 表格列配置
const columns: ColumnsType = [{
  title: '编号',
  dataIndex: 'id',
  width: '100px',
}, {
  title: '题目',
  dataIndex: 'title',
  width: "20%"
}, {
  title: '课程',
  dataIndex: 'courseName',
  width: "180px"
}, {
  title: '类型',
  dataIndex: 'category',
  width: "120px"
}, {
  title: '通过人数',
  dataIndex: 'Cnt',
  width: "120px"
}, {
  title: '难度',
  dataIndex: 'difficulty',
  width: "100px"
}]
if (role === 2) {
  columns.push({
    title: '状态',
    dataIndex: 'pass',
    width: "90px",
    align: "center"
  }, {
    title: '收藏',
    dataIndex: 'favour',
    width: "90px",
    align: "center"
  },)
} else {
  columns.push({
    title: "操作",
    dataIndex: "actions",
    width: "180px",
    align: "center"
  })
}

// 筛选参数
// TODO: 修复筛选
const filters = reactive({
  "category": "", // 题目类型
  "courseName": "", // 课程
  "searcherKeyWords": "", // 题目 或 题目id
  "orders": [{
    "orderBy": "cnt", // 按通过数排序
    "sortOrder": "DESC" // 降序
  }],
  "tag": "", // 标签
  "offset": 0, // 偏移
  "limit": 20 // 分页大小
})
watch(() => filters, () => {
  store.list(filters).then(res => {
    problemList.value = res
  })
}, { deep: true })

// 搜索框
function onSearch(value: string) {
  filters.searcherKeyWords = value
}

// 排序
const orders = ref([

])

// TODO: 修复difficulty筛选（后端）
const difficultyFilter = ref('')
watch(difficultyFilter, (val) => {
  store.filter(val).then(res => {
    problemList.value = res
  })
})
function difficultyColor(difficulty: string) {
  switch (difficulty) {
    case "简单": return "easy"
    case "中等": return "medium"
    case "困难": return "hard"
  }
}

// 分页控制
// const pagination = {
//   pageSize: 20, // 默认每页显示数量
//   showQuickJumper: true,
//   showSizeChanger: true, // 显示可改变每页数量
//   pageSizeOptions: ["10", "20", "30", "40"], // 每页数量选项
//   showSizeChange: (current: number, pageSize: number) => {
//     console.log(current, pageSize)
//   } // 改变每页数量时更新显示
// }

// 课程类型选择
const categoryArr: string[] = ["全部", "代码", "选择", "填空", "大题"]
const currentCategory = ref("全部")
function changeCategory(category: string) {
  console.log(category);
  if (category === "全部") {
    filters.category = ""
  } else {
    filters.category = category
  }
}

// 标签选择
const tags = reactive({
  tag: [],
  // TODO: 获取课程列表
  courseName: ['软件工程', '数据结构', '程序设计', '计算机网络']
})
onBeforeMount(async () => {
  const tag: any = await store.tags()
  tags.tag = tag?.map((item: any) => item["tagName"])
})

const handleChange = (type: string, value: any) => {
  console.log(`${type},selected ${value}`);
  value = value || ''
  switch (type) {
    case 'difficulty':
      difficultyFilter.value = value;
      break;
    case 'tag':
      filters.tag = value;
      break;
    case 'courseName':
      filters.courseName = value;
      break;
  }
};

// 收藏
function handleFavour(row: any) {
  console.log(row.id);
  const id = row.id

  if (row.favour) {
    store.cancelFavour(id).then(res => {
      console.log(res);
      message.success("取消收藏", 0.5)
    })
  } else {
    store.favour(id).then(res => {
      console.log(res);
      message.success("收藏成功", 0.5)
    })
  }
  row.favour = !row.favour
}

// [老师] 操作
function handleDelete(id: number) {
  store.delete(id).then(async res => {
    problemList.value = await store.list(filters)
    message.success("删除成功")
  }).catch(err => {
    message.error("删除失败，" + err);
  })
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

// ECharts图表
const chartData = {
  difficulty: [{
    value: 0, name: '简单'
  }, {
    value: 0, name: '中等'
  }, {
    value: 0, name: '困难'
  },],
  category: [{
    value: 0, name: '选择',
  }, {
    value: 0, name: '填空',
  }, {
    value: 0, name: '大题',
  }, {
    value: 0, name: '代码',
  },
  ]
}
const chartEle = ref(null)
const option: EChartsOption = {
  legend: {
    left: "center",
  },
  series: [
    {
      name: 'ProblemSet Charts',
      type: 'pie',
      radius: ['40%', '70%'],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 6,
        borderWidth: 2,
        borderColor: '#fff',
      },
      label: {
        show: false,
        position: 'center'
      },
      labelLine: {
        show: false
      },
      emphasis: {
        label: {
          show: true,
          formatter: `{b}\n{c}`,
          fontSize: '16px',
          lineHeight: 30,
          fontWeight: 'bold'
        },
      },
      data: chartData.difficulty
    }
  ]
};
const cardActiveKey = ref('difficulty')
let chartEch: ECharts
const changeChart = (val: any) => {
  console.log(val);
  // @ts-ignore
  option.series[0].data = chartData[val]
  chartEch.setOption(option as unknown, true);
}
// 加载数据
onBeforeMount(async () => {
  problemList.value = await store.list() as any
  message.success("请求成功", 2)
  hotProblemList.value = getStorage('problem') || []
  problemList.value.forEach((item: any) => {
    const dindex = difficultyArr.indexOf(item.difficulty)
    if (dindex === -1) return
    chartData.difficulty[dindex].value++
    const cindex = chartData.category.map((cate: any) => cate['name']).indexOf(item.category)

    if (cindex === -1) return
    chartData.category[cindex].value++
  })
  chartEch = init(chartEle.value);
  chartEch.setOption(option as unknown, true);
})

// 热门题目
const hotProblemList = ref([])
</script>

<template>
  <div class="problemset">
    <section>
      <AInputSearch placeholder="搜索题目名称" allowClear style="width:20em" @search="onSearch" />
      <ASpace style="margin-left: 20px;">
        <a-select allowClear placeholder="难度" @change="handleChange('difficulty', $event)" class="tagSelect">
          <a-select-option v-for="difficulty in difficultyArr" :value="difficulty">{{ difficulty }}
          </a-select-option>
        </a-select>
        <a-select allowClear placeholder="标签" @change="handleChange('tag', $event)" class="tagSelect">
          <a-select-option v-for="tag in tags.tag" :value="tag">{{ tag }}</a-select-option>
        </a-select>
        <a-select allowClear placeholder="课程" @change="handleChange('courseName', $event)" class="tagSelect">
          <a-select-option v-for="courseName in tags.courseName" :value="courseName">{{ courseName }}
          </a-select-option>
        </a-select>
      </ASpace>
      <!-- <span v-for="condition in filters">
        <a-tag closable @close="closeTag(condition)" v-if="condition" class="tags">
          {{ condition }}
        </a-tag>
      </span> -->
    </section>
    <div style="display: flex;">
      <div style="margin-top: 20px;  flex:1 0 auto;margin-right: 30px;">
        <a-tabs v-model:activeKey="currentCategory" @change="changeCategory" style="display:inline-block;">
          <a-tab-pane v-for="category in categoryArr" :key="category" :tab="category">
          </a-tab-pane>
        </a-tabs>
        <span class="right" style="display:flex;align-items: center;margin-top:5px; margin-right:60px;color:#7B88FF;">
          <span class="random shadow">
            <Random color="#fff" />
          </span>随机一题
        </span>
        <a-table :columns="columns" :data-source="problemList">
          <template #bodyCell="{ column, record }">
            <template v-if="column.dataIndex === 'difficulty'">
              <div :class="difficultyColor(record.difficulty)">
                {{ record.difficulty }}
              </div>
            </template>
            <template v-else-if="column.dataIndex === 'pass'">
              <check-outlined v-if="record.pass" style="color: #81B337" />
            </template>
            <template v-else-if="column.dataIndex === 'favour'">
              <div @click="handleFavour(record)">
                <StarFilled class="favour icon" v-if="record.favour" />
                <StarOutlined class="favour icon" v-else />
              </div>
            </template>
            <template v-else-if="column.dataIndex === 'actions'">
              <RouterLink :to="{ name: 'EditProblem', query: { id: record.id, title: record.title } }">修改</RouterLink>
              <ADivider type="vertical" />
              <a-popconfirm v-if="problemList.length" title="确定删除？" @confirm="handleDelete(record.id)">
                <a>删除</a>
              </a-popconfirm>
            </template>
          </template>
        </a-table>
      </div>
      <div class="card-container">
        <div class=" top card shadow">
          <div class="align-center">
            <CarryOutOutlined class="icon" style="color: #27BD9E;" />
            <div style="margin-left: 5px;">我的题库</div>
          </div>
          <RightOutlined style="font-size:14px" />
        </div>
        <div class="statistics card shadow">
          <p>题型</p>
          <a-tabs v-model:activeKey="cardActiveKey" @change="changeChart" class="problemTabs">
            <a-tab-pane key="difficulty" tab="难度">
            </a-tab-pane>
            <a-tab-pane key="category" tab="类型">
            </a-tab-pane>
            <!-- <a-tab-pane key="3" tab="已完成">
            </a-tab-pane> -->
          </a-tabs>
          <div ref="chartEle" style="width: 100%; height: 160px;"></div>
        </div>
        <div class="hot card shadow">
          <p>
            <FireOutlined class="icon" style="color: #BD3124 ;" /> 热门题目
          </p>
          <a-list :data-source="hotProblemList" class="hotProblemList">
            <template #renderItem="{ item, index }">
              <a-list-item>
                {{ index + 1 }}. {{ item.title }}
              </a-list-item>
            </template>
          </a-list>
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
  display: inline-flex;
  height: 500px;
  flex-direction: column;
}

.card {
  box-sizing: border-box;
  width: 240px;
  padding: 20px;
  border-radius: 16px;
  margin-bottom: 14px;
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


// 难度颜色
.easy {
  color: #81B337
}

.medium {
  color: #E99D42
}

.hard {
  color: #BD3124
}

.favour {
  color: #FFBF6B;
}
</style>