<script setup lang="ts">
import Random from '@/components/Random.vue';
import { ECharts, EChartsOption, init } from 'echarts';
import { difficultyMap, problemStore } from '@/store/problem';

const store = problemStore()
// const router = useRouter()

// 筛选参数
const filters = reactive({
  title: '',
  category: "",
  difficulty: '',
  tags: [],
  courseName: '',
  limit: 20,
  offset: 0
})

watch(() => filters, () => {
  store.filter(filters).then(res => {
    problemList.value = res
  })
}, { deep: true })

// 题目列表展示
const columns = [{
  title: '编号',
  dataIndex: 'id',
  key: 'id',
  width: '100px',

}, {
  title: '题目',
  dataIndex: 'title',
  key: 'title',
  width: "20%"
}, {
  title: '课程',
  dataIndex: 'courseName',
  key: 'courseName',
  width: "180px"
}, {
  title: '类型',
  dataIndex: 'category',
  key: 'category',
  width: "120px"
}, {
  title: '通过人数',
  dataIndex: 'Cnt',
  key: 'Cnt',
  width: "120px"
}, {
  title: '难度',
  dataIndex: 'difficulty',
  key: 'difficulty',
  width: "100px"
},
  // {
  //   title: '状态',
  //   dataIndex: 'status',
  //   key: 'status',
  //   width: "160px"}
]


// const pagination = {
//   pageSize: 20, // 默认每页显示数量
//   showQuickJumper: true,
//   showSizeChanger: true, // 显示可改变每页数量
//   pageSizeOptions: ["10", "20", "30", "40"], // 每页数量选项
//   showSizeChange: (current: number, pageSize: number) => {
//     console.log(current, pageSize)
//   } // 改变每页数量时更新显示
// }
// 搜索框
function onSearch(value: string) {
  filters.title = value
}

// tabs 选项卡
const tabsMap = {
  "1": "全部",
  "2": "代码",
  "3": "选择",
  "4": "填空",
  "5": "大题"
}
const activeKey = ref('1')
function changeActiveKey(activeKey: keyof typeof tabsMap) {
  if (activeKey === "1") {
    filters.category = ""
  } else {
    filters.category = tabsMap[activeKey]
  }
}

// 标签选择
const tags = reactive({
  difficulty: Object.values(difficultyMap),
  tag: [],
  courseName: ['软件工程', '数据结构', '程序设计', '面向对象']
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
      filters.difficulty = value;
      break;
    case 'tag':
      filters.tags = [{ 'tagName': value }];
      break;
    case 'courseName':
      filters.courseName = value;
      break;
  }
};


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
const chartData: any = {
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
let chartEch: any
const changeChart = (val: any) => {
  console.log(val);
  // @ts-ignore
  option.series[0].data = chartData[val]
  chartEch.setOption(option as unknown, true);
}
const problemList = ref<any[]>([])
onBeforeMount(async () => {
  problemList.value = await store.all() as any
  problemList.value.forEach((item: any) => {
    const dindex = Object.values(difficultyMap).indexOf(item.difficulty)
    if (dindex === -1) return
    chartData.difficulty[dindex].value++
    const cindex = chartData.category.map((cate: any) => cate['name']).indexOf(item.category)
    console.log(chartData.category.map((cate: any) => cate['name']), (item.difficulty));

    if (cindex === -1) return
    chartData.category[cindex].value++
  })
  chartEch = init(chartEle.value);
  chartEch.setOption(option as unknown, true);
})

// 热门题目
const hotProblemList = ref([])
hotProblemList.value = getStorage('problem') || []
</script>

<template>
  <div class="problemset">
    <AInputSearch placeholder="搜索题目名称" allowClear style="width:20em" @search="onSearch" />
    <div style="display: flex;">
      <div style="margin-top: 30px;  flex:1 0 auto;margin-right: 20px;">
        <a-tabs v-model:activeKey="activeKey" @change="changeActiveKey" class="problemTabs">
          <a-tab-pane v-for="item, index in tabsMap" :key="index" :tab="item">
          </a-tab-pane>
        </a-tabs>
        <section>
          <a-select allowClear placeholder="难度" @change="handleChange('difficulty', $event)" class="tagSelect">
            <a-select-option v-for="difficulty in tags.difficulty" :value="difficulty">{{ difficulty }}
            </a-select-option>
          </a-select>
          <a-select allowClear placeholder="标签" @change="handleChange('tag', $event)" class="tagSelect">
            <a-select-option v-for="tag in tags.tag" :value="tag">{{ tag }}</a-select-option>
          </a-select>
          <a-select allowClear placeholder="课程" @change="handleChange('courseName', $event)" class="tagSelect">
            <a-select-option v-for="courseName in tags.courseName" :value="courseName">{{ courseName }}
            </a-select-option>
          </a-select>
          <span class="right flex-center" style="color:#7B88FF;margin-right: 40px;">
            <span class="random shadow">
              <Random color="#fff" />
            </span>随机一题
          </span>
          <!-- <span v-for="condition in filters">
            <a-tag closable @close="closeTag(condition)" v-if="condition" class="tags">
              {{ condition }}
            </a-tag>
          </span> -->
        </section>
        <main style="margin-top:20px;">
          <div>
            <a-table :columns="columns" :data-source="problemList">
            </a-table>
          </div>
        </main>
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
</style>