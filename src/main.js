import '@babel/polyfill'

import Vue from 'vue'
import App from './App.vue'
import router from './router'
import {store} from './store'

import './permission'
import importDirective from '@/directive'

Vue.config.productionTip = false
import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';

import VModal from 'vue-js-modal'

import SlideOut from '@hyjiacan/vue-slideout'
import '@hyjiacan/vue-slideout/lib/slideout.css'


//import './vxeTable'

import i18n from '@/locale'

//import './element'
import {constant,hasPermission} from '@/utils'

let {config: {baseUrl: {domainURL, staticDomainURL, pdfDomainURL,proxyURL,casPrefixUrl,onlinePreviewDomainURL}}} = constant

window._CONFIG = {
    domainURL, staticDomainURL, pdfDomainURL,proxyURL,casPrefixUrl,onlinePreviewDomainURL
};

/*
 *
 * 注册指令
 */
importDirective(Vue)

Vue.use(Element, {
    size: 'medium',
    zIndex: 2000,
    i18n: (key, value) => i18n.t(key, value)
});

Vue.use(hasPermission)

Vue.use(VModal, {
    dialog: true,
    dynamic: true,
    injectModalsContainer: true,
    dynamicDefaults: {
        clickToClose: false
    }
})

Vue.use(SlideOut, {
    // set props here
})

new Vue({
    router,
    store,
    i18n,
    render: h => h(App)
}).$mount('#app')
