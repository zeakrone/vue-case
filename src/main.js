import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// 引入element-UI
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);
// 注册请求插件
import httpHelper from './api/http.js'
Vue.use(httpHelper)

Vue.config.productionTip = false


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
