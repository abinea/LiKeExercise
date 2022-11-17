import App from "./App.vue"
import router from "./router"
import "@/router/permission"

createApp(App).use(router).use(createPinia()).mount("#app")
