import Vue from 'vue'
import App from './App.vue'
import router from './router'

// 导入通用样式
import './style/base.less'
import './style/iconfont.css'

// 导入amfe-flexible库
import 'amfe-flexible'
// 全局注册组件引入
import './utils/global'
// 全局配置axios请求
import './utils/request'
// 全局注册过滤器
import './utils/filters'
// 导入vant
import './utils/vant'

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
