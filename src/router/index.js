import Vue from 'vue'
import VueRouter from 'vue-router'
// 导入组件
const Login = () => import(/* webpackChunkName: "user" */ '../views/user/Login.vue')
const Register = () => import(/* webpackChunkName: "user" */'../views/user/Register.vue')
const User = () => import(/* webpackChunkName: "user" */'../views/user/User.vue')
const UserEdit = () => import(/* webpackChunkName: "user" */'../views/user/UserEdit.vue')
const Demo = () => import(/* webpackChunkName: "user" */'../views/user/Demo.vue')
const MyFollow = () => import(/* webpackChunkName: "user" */'../views/user/MyFollow.vue')
const MyComment = () => import(/* webpackChunkName: "user" */'../views/user/MyComment.vue')
const MyStar = () => import(/* webpackChunkName: "user" */'../views/user/MyStar.vue')
const Index = () => import(/* webpackChunkName: "index" */'../views/news/Index.vue')
const Manage = () => import(/* webpackChunkName: "news" */'../views/news/Manage.vue')
const PostDetail = () => import(/* webpackChunkName: "news" */'../views/news/PostDetail.vue')
const Search = () => import(/* webpackChunkName: "news" */'../views/news/Search.vue')
Vue.use(VueRouter)

const routes = [
  { path: '/login', component: Login, name: 'login' },
  { path: '/register', component: Register, name: 'register' },
  { path: '/user', component: User, name: 'user' },
  { path: '/user-edit', component: UserEdit, name: 'user-edit' },
  { path: '/demo', component: Demo, name: 'demo' },
  { path: '/myfollow', component: MyFollow, name: 'myfollow' },
  { path: '/mycomment', component: MyComment, name: 'mycomment' },
  { path: '/mystar', component: MyStar, name: 'mystar' },
  { path: '/', component: Index, name: 'index' },
  { path: '/manage', component: Manage, name: 'manage' },
  { path: '/post-detail/:id', component: PostDetail, name: 'post-detail' },
  { path: '/search', component: Search, name: 'search' }
]
// 全局的把push的异常给处理了
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}
const router = new VueRouter({
  mode: 'history',
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
  const authUrls = ['/user', '/user-edit', './myfollow', './mycomment', './mystar']
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
