<template>
  <div class="index">
    <div class="header">
      <div class="logo">
        <span class="iconfont iconnew"></span>
      </div>
      <div class="search" @click="$router.push('/search')">
        <div class="search-box">
          <span class="iconfont iconsearch"></span>
          <span>搜索新闻</span>
        </div>
      </div>
      <div class="user" @click="$router.push('/user')">
        <span class="iconfont iconwode"></span>
      </div>
    </div>

    <!-- tab栏效果 -->
    <van-sticky class="more-sticky">
      <div class="more" @click="$router.push('/manage')">
        <span class="iconfont iconlianjie"></span>
      </div>
    </van-sticky>
    <van-tabs v-model="active" sticky animated swipeable >
      <van-tab :title="tab.name" v-for="tab in tabList" :key="tab.id">
        <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
          <van-list
            v-model="loading"
            :finished="finished"
            finished-text="没有更多了"
            :immediate-check="false"
            offset="10"
            @load="onLoad"
          >
          <hm-post :post="item" v-for="item in newsList" :key="item.id"></hm-post>
          </van-list>
        </van-pull-refresh>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
export default {
  name: 'index',
  data () {
    return {
	  active: 0,
	  newsList: [],
	  tabList: [],
	  pageIndex: 1,
    pageSize: 5,
    refreshing: false,
    loading: false,
    finished: false
    }
  },
  // 缓存组件激活的时候触发
  activated () {
    console.log('activated')
  },
  // 缓存组件不激活的时候触发
  deactivated () {
    console.log('deactivated')
  },
  created () {
    console.log('index创建')
    this.getTabList()
  },
  destroyed () {
    console.log('index销毁')
  },
  methods: {
    async getTabList () {
      // 判断缓存中是否存在
      const activeList = JSON.parse(localStorage.getItem('activeList'))
      if (activeList) {
        this.tabList = activeList
        // 发送请求获取第一个tab栏数据
        this.getNewsList(this.tabList[0].id)
        return
      }
	    const res = await this.$axios.get('/category')
	    const { statusCode, data } = res.data
	    if (statusCode === 200) {
		    this.tabList = data
		    console.log(res.data)
        this.getNewsList(this.tabList[0].id)
      }
    },
    // 获取新闻列表
	  async getNewsList (id) {
      const res = await this.$axios.get('/post', {
        params: {
		      category: id,
		      pageIndex: this.pageIndex,
		      pageSize: this.pageSize
	      }
	    })
	    const { statusCode, data } = res.data
	    if (statusCode === 200) {
        if (this.pageIndex === 1) {
          this.newsList = []
        }
        this.newsList = [...this.newsList, ...data]
        console.log(this.newsList)
        // 数据加载完成，需要把loading改为false
        this.loading = false
        this.refreshing = false
        // 判断是否还有更多数据
        if (data.length < this.pageSize) {
          this.finished = true
        }
	    }
    },
    onLoad () {
      setTimeout(() => {
        // 加载下一页数据
        this.pageIndex++
        this.getNewsList(this.tabList[this.active].id)
      }, 1000)
    },
    onRefresh () {
      setTimeout(() => {
        this.pageIndex = 1
        this.loading = true
        this.finished = false
        this.newsList = []
        this.getNewsList(this.tabList[this.active].id)
      }, 1000)
    }
  },
  watch: {
    // 监听变化
    active (value) {
      // 清空原来栏目下的数据
      this.newsList = []
      this.pageIndex = 1
      this.finished = false
      this.loading = true
      setTimeout(() => {
        // 加载当前栏目数据
        this.getNewsList(this.tabList[value].id)
      }, 1000)
    }
  }
}
</script>

<style lang="less" scoped>
.header {
  display: flex;
  height: 50px;
  background-color: #ff0000;
  line-height: 50px;
  text-align: center;
  color: #fff;
  .logo,
  .user {
    width: 70px;
  }
  .logo {
    span {
      font-size: 50px;
    }
  }
  .user {
    span {
      font-size: 24px;
    }
  }
  .search {
    flex: 1;
    .search-box {
      height: 34px;
      line-height: 34px;
      background-color: rgba(255, 255, 255, .5);
      margin-top: 8px;
      border-radius: 17px;
      font-size: 14px;
      span:first-child {
        margin-right: 5px;
      }
    }
  }
}
/deep/ .van-tabs__wrap {
  width: 85%;
}
.more {
  width: 15%;
  height: 44px;
  position: absolute;
  right: 0;
  z-index: 999;
  background-color: #fff;
  text-align: center;
  line-height: 44px;
}
.more-sticky {
  /deep/ .van-sticky--fixed {
    z-index: 100;
  }
}
</style>
