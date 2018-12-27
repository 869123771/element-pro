import Vue from 'vue'
import App from './App.vue'
import router from './router'
import {store} from './store'

Vue.config.productionTip = false
import 'iview/dist/styles/iview.css';
import 'element-ui/lib/theme-chalk/index.css';
import './iview'

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
