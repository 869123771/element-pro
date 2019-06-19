import Vue from 'vue'
import App from './App.vue'
import router from './router'
import {store} from './store'
import './permission'

Vue.config.productionTip = false
import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';
import Avue from '@smallwei/avue';
import '@smallwei/avue/lib/index.css';
import importDirective from '@/directive'
//import './element'
import {constant} from '@/utils'

let {config:{baseUrl:{domianURL,imgDomainURL,pdfDomainURL}}} = constant
window._CONFIG = {
    domianURL,imgDomainURL,pdfDomainURL
};

/**
 * 注册指令
 */
importDirective(Vue)

Vue.use(Element, { size: 'small', zIndex: 3000 });
Vue.use(Avue)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
