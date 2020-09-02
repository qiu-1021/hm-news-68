import Vue from 'vue'
import VueRouter from 'vue-router'
// 导入组件
import Login from '../views/user/Login.vue'
import Register from '../views/user/Register.vue'
import User from '../views/user/User.vue'
import UserEdit from '../views/user/UserEdit.vue'
import Demo from '../views/user/Demo.vue'
import MyFollow from '../views/user/MyFollow.vue'
import MyComment from '../views/user/MyComment.vue'
Vue.use(VueRouter)

const routes = [
  { path: '/login', component: Login, name: 'login' },
  { path: '/register', component: Register, name: 'register' },
  { path: '/user', component: User, name: 'user' },
  { path: '/user-edit', component: UserEdit, name: 'user-edit' },
  { path: '/demo', component: Demo, name: 'demo' },
  { path: '/myfollow', component: MyFollow, name: 'myfollow' },
  { path: '/mycomment', component: MyComment, name: 'mycomment' }
]
// 全局的把push的异常给处理了
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}
const router = new VueRouter({
  routes
})
// 配置全局导航卫士
router.beforeEach(function (to, from, next) {
  // to:表示去哪里
  // from：表示从哪来
  // next:表示是否放行
  // 只要路由发生跳转，跳转之前执行这个函数
  // 判断to的path是否为/user 是否去用户中心，如果不是next()放行
  // 如果去用户中心，判断是否有token，有放行，没有跳转至登陆
  // if (to.name === 'user') {
  //   if (token) {
  //     next()
  //   } else {
  //     router.push('./login')
  //   }
  // } else {
  //   next()
  // }
  const token = localStorage.getItem('token')
  const authUrls = ['/user', '/user-edit', './myfollow', './mycomment']
  if (!authUrls.includes(to.path) || token) {
    next()
  } else {
    router.push('./login')
  }
})
// router.afterEach(function(to, from) {
//   console.log('后置导航执行');
// })
export default router
