import  {createApp}  from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import axios from './http/http'
import router from './router'
import store from './store'
// import Vue from 'vue'
// const app = createApp(App)
// app.use(ElementPlus)

const app=createApp(App);
// app.mount('#app')
app.use(ElementPlus).use(store).use(router).mount('#app')
// createApp().prototype.$axios=axios;

// app.use(ElementPlus);
// Vue.config.productionTip = false
app.config.globalProperties.$axios=axios
// new Vue({
//     router,
//     store,
//     render: h => h(App)
//   }).$mount('#app')