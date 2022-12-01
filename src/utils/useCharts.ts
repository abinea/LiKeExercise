import { problemStore } from '@/store';
import { Problem } from '@/types/store';
import { ECharts, EChartsOption, init } from 'echarts';

/**
 * 定义引入Echart饼图及统计数据的hook函数，抽离这部分业务逻辑
 */
export function useCharts() {
  // 图表数据
  let chartData = {
    difficulty: [{
      value: 0, name: '简单'
    }, {
      value: 0, name: '中等'
    }, {
      value: 0, name: '困难'
    }],
    category: [{
      value: 0, name: '选择',
    }, {
      value: 0, name: '填空',
    }, {
      value: 0, name: '大题',
    }, {
      value: 0, name: '代码',
    }]
  }

  const store = problemStore()
  const { categoryArr } = store

  const chartEle = ref(null)
  let chartEch: ECharts
  const option: EChartsOption = {
    legend: {
      left: "center",
    },
    series: [{
      name: '难度及类型统计饼图',
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
    }]
  };
  onMounted(() => {
    chartEch = init(chartEle.value);
    // 加载数据
    chartEch.setOption(option as unknown, true);
  })

  const cardActiveKey = ref('difficulty')
  function changeChart(val: any) {
    // @ts-ignore
    option.series[0].data = chartData[val]
    chartEch.setOption(option as unknown, true);
  }

  function evaluteChartData(problemList: Problem.problem[]) {
    problemList.forEach((item) => {
      const idx1 = item.difficulty
      const idx2 = categoryArr.indexOf(item.category)
      chartData.difficulty[idx1 - 1].value++
      chartData.category[idx2 - 1].value++
    })
    chartEch.setOption(option as unknown, true);
  }
  return {
    chartEle,
    changeChart,
    cardActiveKey,
    evaluteChartData
  }
}