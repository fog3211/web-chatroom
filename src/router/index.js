import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '_c/HelloWorld'
import Login from '@/views/Login'
import Register from '@/views/Register'

Vue.use(Router)

export default new Router({
  routes: [{
    path: '/',
    name: 'HelloWorld',
    component: HelloWorld
  }, {
    path: '/login',
    name: 'Login',
    component: Login
  }, {
    path: '/register',
    name: 'Register',
    component: Register
  }]
})
