import Vue from 'vue'
import App from './App.vue'
import router from './router'
import {store} from './store'

import './permission'
import importDirective from '@/directive'

Vue.config.productionTip = false
import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';
import Avue from '@smallwei/avue';
import '@smallwei/avue/lib/index.css';

import ELTableBar from 'el-table-bar-base'
import 'el-table-bar-base/lib/ElTableBar.css'

import VModal from 'vue-js-modal'
//import './element'
import {constant,hasPermission} from '@/utils'

let {config: {baseUrl: {domianURL, imgDomainURL, pdfDomainURL,proxyURL}}} = constant

window._CONFIG = {
    domianURL, imgDomainURL, pdfDomainURL,proxyURL
};

/**
 * 注册指令
 */
importDirective(Vue)

Vue.use(Element, {size: 'medium', zIndex: 2000});
Vue.use(Avue)
Vue.use(hasPermission)
Vue.use(ELTableBar)

Vue.use(VModal, {
    dialog: true,
    dynamic: true,
    injectModalsContainer: true,
    dynamicDefaults: {
        clickToClose: false
    }
})

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
