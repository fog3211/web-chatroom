import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/views/Login'
import Register from '@/views/Register'
import ForgetPwd from '@/views/ForgetPassword'
import Identify from '_c/Identify'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [{
    path: '/',
    name: 'home',
    redirect: "/login"
  }, {
    path: '/login',
    name: 'Login',
    component: Login
  }, {
    path: '/register',
    name: 'Register',
    component: Register
  }, {
    path: '/forgetpwd',
    name: 'ForgetPwd',
    component: ForgetPwd
  }, {
    path: '/identify',
    name: 'Identify',
    component: Identify
  }]
  
})
