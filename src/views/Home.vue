<script setup lang="ts">
import { DefaultOptionType, SelectValue } from 'ant-design-vue/es/select'
const router = useRouter()

const searchValue = ref('')
const searchOptions = shallowRef<DefaultOptionType[]>([])
const searchCache: Record<string, any> = {}
function searchChange(value: SelectValue) {
  if (!value) {
    searchOptions.value = []
    return
  }
  if (Reflect.has(searchCache, value as string)) {
    searchOptions.value = searchCache[value as string]
    return
  }
  const routes = router.getRoutes()
  const filteredRoutes = routes.filter(route => !route.meta.hidden && (route.meta.title?.includes(value as string) || route.meta.searchKeywords?.some(keyword => keyword.includes(value as string))))
  searchOptions.value = filteredRoutes.map(route => Object.assign(router.resolve(route), { value: route.path }))
  searchCache[value as string] = searchOptions.value
}

function searchSelect(value: any) {
  searchValue.value = ''
  router.push(value)
}


const activeKey = ref('1') // 默认进行中

</script>

<template>
  <div class="home">
    <AAutoComplete v-model:value="searchValue" style="width: 10rem" :dropdownMatchSelectWidth="250"
      :filterOption="false" :options="searchOptions" @change="searchChange" @select="searchSelect">
      <AInputSearch placeholder="搜索班级名称、编号" allowClear style="width:20em" />
      <template #option="item">
        <ABreadcrumb v-if="item.matched.length > 0">
          <template v-for="(route, index) in item.matched" :key="route.path">
            <ABreadcrumbItem v-if="route.meta.breadcrumb !== false && route.meta.title">
              <template v-if="route.meta.icon">
                <SvgIcon v-if="typeof route.meta.icon === 'string'" :iconName="(route.meta.icon as string)"></SvgIcon>
                <component v-else :is="route.meta.icon"></component>
              </template>
              <span>&nbsp;{{ route.meta.title }}</span>
            </ABreadcrumbItem>
          </template>
        </ABreadcrumb>
      </template>
    </AAutoComplete>
    <div style="margin-top:40px;">
      <AButton type="primary">
        添加班级
      </AButton>
    </div>

    <div style="margin-top: 30px;">
      <a-tabs v-model:activeKey="activeKey">
        <a-tab-pane key="1" tab="进行中">
          <div class="class-container">
            <ClassItem v-for="item in 12" :classIndex="item" />
          </div>
        </a-tab-pane>
        <a-tab-pane key="2" tab="已结束">
          <div class="class-container">
            <ClassItem v-for="item in 12" :classIndex="item" />
          </div>
        </a-tab-pane>
        <a-tab-pane key="3" tab="所有班级">
          <div class="class-container">
            <ClassItem v-for="item in 24" :classIndex="item" />
          </div>
        </a-tab-pane>
      </a-tabs>
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
  grid-template-columns: repeat(4, 1fr);
  grid-gap: 24px;
}
</style>