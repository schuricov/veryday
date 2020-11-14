import Vue from 'vue'
import Router from 'vue-router'
import Admin from '@/views/Admin'
import Welcome from '@/views/Welcome'
// import Schedule from '@/views/Schedule'

// import VueCookie from 'vue-cookie'

Vue.use(Router)
// Vue.use(VueCookie)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Welcome',
      component: Welcome
    },
    {
      path: '/admin',
      name: 'Admin',
      component: Admin
    }
  ]
})
