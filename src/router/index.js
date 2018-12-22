import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/views/Login'
import Register from '@/views/Register'
import ForgetPwd from '@/views/ForgetPassword'
import Chat from '@/views/Chat'

Vue.use(Router)

export default new Router({
  mode: 'hash',
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
    path: '/chat',
    name: 'Chat',
    component: Chat
  }]
})
