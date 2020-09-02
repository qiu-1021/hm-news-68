<template>
  <div class="myfollow">
    <hm-header>我的关注</hm-header>
    <div class="list">
      <div class="item" v-for="item in list" :key="item.id">
        <div class="left">
          <img :src="$base + item.head_img" alt="">
        </div>
        <div class="center">
            <p>{{item.nickname}}</p>
            <p>{{item.create_date | time('YYYY-MM-DD hh:mm')}}</p>
        </div>
        <div class="right">
          <van-button type="primary" round size="small" @click="unfollow(item.id)">取消关注</van-button>
        </div>
    </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      list: []
    }
  },
  created () {
    this.getFollowList()
  },
  methods: {
    async getFollowList () {
      const res = await this.$axios.get('/user_follows')
      console.log(res.data)
      const { statusCode, data } = res.data
      if (statusCode === 200) {
        this.list = data
        console.log(this.list)
      }
    },
    async unfollow (id) {
      try {
        await this.$dialog.confirm({
          title: '温馨提示',
          message: '你确定取关该用户嘛？'
        })
      } catch {
        return this.$toast('取消操作')
      }
      const res = await this.$axios.get(`/user_unfollow/${id}`)
      if (res.data.statusCode === 200) {
        this.$toast.success('取消关注成功')
        this.getFollowList()
      }
    }
  }
}
</script>

<style lang="less" scoped>
.item {
  display: flex;
  height: 100px;
  border-bottom: 1px solid #ccc;
  align-items: center;
  padding: 0 20px;
  .left {
    img {
      width: 50px;
      height: 50px;
      border-radius: 50%;
    }
  }
  .center {
    flex: 1;
    font-size: 14px;
    padding: 0 20px;
  }
}
</style>
