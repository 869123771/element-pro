import Vue from 'vue'
import Router from 'vue-router'
import { routers} from './router'
import {LoadingBar,Message,Spin} from 'iview'

Vue.use(Router)

const router = new Router({
  //mode: 'history',
  routes: routers
})


router.beforeEach((to, from, next) => {
  Spin.show()
  next();
});

router.afterEach((to, from, next) => {
  Spin.hide()
});

export default router