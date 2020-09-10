<template>
  <div class="post-detail">
	<div class="header">
	  <div class="left" @click="$router.back()">
		<span class="iconfont iconjiantou2"></span>
	  </div>
	  <div class="center">
		<span class="iconfont iconnew"></span>
	  </div>
	  <div class="right">
		<div class="follwed" v-if="post.has_follow" @click="unfollow">已关注</div>
		<div class="follow" v-else @click="follow">关注</div>
	  </div>
	</div>
	<div class="content">
	  <div class="title">{{post.title}}</div>
	  <div class="name">
		<span>{{post.user.nickname}}</span>
		<span>{{post.create_date | time}}</span>
	  </div>
	  <div v-if="post.type === 1" class="info" v-html="post.content"></div>
	  <video v-else :src="getUrl(post.content)" controls autoplay muted></video>
	</div>
	<div class="buttons">
	  <div class="good" @click="like" :class="{active: post.has_like}">
		<span class="iconfont icondianzan"></span>
		<span>{{post.like_length || 0}}</span>
	  </div>
	  <div class="share">
		<span class="iconfont iconweixin"></span>
		<span>微信</span>
	  </div>
	</div>
	<!-- 评论 -->
	<div class="comment-list">
	  <h3>精彩跟帖</h3>
	  <hm-comment @reply="onReply" :comment="comment" v-for="comment in commentList" :key="comment.id"></hm-comment>
	</div>
	<div class="footer-textarea"  v-if="isShowTextarea">
	  <textarea ref="textarea" :placeholder="'回复:' + nickname" v-model="content"></textarea>
	  <van-button type="primary" @click="publish">发送</van-button>
	</div>
	<div class="footer-input" v-else>
	  <div class="search">
		<input type="text" placeholder="回复" @focus="onFocus">
	  </div>
	  <span class="iconfont iconpinglun-"><i>20</i></span>
      <span class="iconfont iconshoucang" :class="{now: post.has_star}" @click="star"></span>
      <span class="iconfont iconfenxiang"></span>
	</div>
  </div>
</template>

<script>
export default {
  data () {
	return {
	  post: {
		user: {}
	  },
	  commentList: [],
	  isShowTextarea: false,
	  content: '',
	  nickname: '',
	  replyId: ''
	}
  },
  created () {
	this.getInfo()
	// 获取文章评论列表
	this.getCommentList()

	// 给bus注册自定义事件
	this.$bus.$on('reply', this.onReply)
  },
  destroyed () {
	  console.log('detail销毁')
	  this.$bus.$off('reply', this.onReply)
  },
  methods: {
	noLogin () {
	  // 判断是否登录
	  const token = localStorage.getItem('token')
	  if (!token) {
		this.$router.push({
		  path: '/login',
		  query: {
			  back: true
		  }
		})
		// 代表没有登录
		return true
	  } else {
		// 代表登录了
		return false
	  }
	},
	async getInfo () {
	  // 需要 id
	  const { id } = this.$route.params
	  const res = await this.$axios.get(`/post/${id}`)
	  const { statusCode, data } = res.data
	  if (statusCode === 200) {
		  this.post = data
		  console.log(this.post)
	  }
	},
	getUrl (url) {
	  const div = document.createElement('div')
	  div.innerHTML = url
	  return div.innerText
	},
	async follow () {
      if (this.noLogin()) return
	  // 发送ajax，进行关注
	  console.log('请求关注')
	  const res = await this.$axios.get(`/user_follows/${this.post.id}`)
	  console.log(res.data)
	  if (res.data.statusCode === 200) {
		this.$toast.success('关注成功')
		this.getInfo()
	  }
	},
	async unfollow () {
	  // 发送ajax，进行关注
	  console.log('请求关注')
	  const res = await this.$axios.get(`/user_unfollow/${this.post.id}`)
	  console.log(res.data)
	  if (res.data.statusCode === 200) {
		this.$toast.success('取消关注成功')
		this.getInfo()
	  }
	},
	async like () {
	  // 判断是否登录
	  // 没有登录跳转至登录页面
	  // 登录了，发送请求进行点赞
      if (this.noLogin()) return
	  const res = await this.$axios.get(`/post_like/${this.post.id}`)
	  console.log(res.data)
	  const { statusCode, message } = res.data
	  if (statusCode === 200) {
		this.$toast.success(message)
		this.getInfo()
	  } 
	},
	async star () {
	  if (this.noLogin()) return
	  const res = await this.$axios.get(`/post_star/${this.post.id}`)
      const { statusCode, message } = res.data
      if (statusCode === 200) {
        this.$toast.success(message)
        this.getInfo()
      }
	},
	async getCommentList () {
	  const id = this.$route.params.id
	  const res = await this.$axios.get(`/post_comment/${id}`)
	  const { statusCode, data } = res.data
	  if (statusCode === 200) {
		this.commentList = data
		console.log(this.commentList)
	  }
	},
	async onFocus () {
	  this.isShowTextarea = true
      // 等待DOM更新
      await this.$nextTick()
      // 让textarea自动获取焦点
      console.log(this.$refs.textarea)
      this.$refs.textarea.focus()
	},
	async publish () {
	  const res = await this.$axios.post(`/post_comment/${this.post.id}`, {
		content: this.content,
		parent_id: this.replyId
	  })
	  console.log(res)
	  const { statusCode, message } = res.data
	  if (statusCode === 200) {
		this.$toast.success(message)
		this.getCommentList()
		this.content = ''
		this.replyId = ''
		this.nickname = ''
		this.isShowTextarea = false
	  }
	},
	async onReply (id, nickname) {
	  console.log('父组件', id, nickname)
	    this.isShowTextarea = true
	    await this.$nextTick()
	    this.$refs.textarea.focus()
	     // 回显 nickname
	     this.nickname = '@' + nickname
	     this.replyId = id
	}
  }
}
</script>

<style lang="less" scoped>
.header {
  display: flex;
  padding: 0 10px;
  border-bottom: 1px solid #ccc;
  height: 50px;
  align-items: center;
  .left {
    span {
      line-height: 50px;
    }
  }
  .center {
    flex: 1;
    span {
      font-size: 50px;
    }
  }
  .right {
    font-size: 14px;
    div {
      width: 60px;
      height: 30px;
      text-align: center;
      line-height: 30px;
	  border-radius: 15px;
	  border: 1px solid #666;
    }
    .followed {
      border: 1px solid #ccc;

    }
    .follow {
      color: #fff;
      background-color: #f00;
    }
  }
}
.content {
  padding: 10px;
  .title {
	font-weight: 700;
	font-size: 18px;
  }
  .name {
	font-size: 14px;
	color: #666;
	margin-top: 10px 0;
	span:first-child {
		margin-right: 30px;
	}
  }
  .info {
	/deep/ img {
	  width: 100%;
	  padding: 5px;
	}
  }
  video {
	width: 100%;
  }

}
  .buttons {
    padding: 20px 0;
    justify-content: space-around;
    display: flex;
    > div {
	  width: 120px;
	  height: 40px;
	  line-height: 40px;
	  border-radius: 40px;
	  border: 1px solid #ccc;
	  text-align: center;
	  font-size: 16px;
	  .iconfont {
	  font-size: 18px;
	  margin-right: 5px;
	  }
	  .iconweixin {
	  color: lime;
	  }
	}
	.active {
      border-color: red;
      color: red;
    }
  }
.footer-input{
  background-color: #fff;
  width: 100%;
  height: 50px;
  display: flex;
  border-top: 1px solid #ccc;
  position: fixed;
  bottom: 0;
  align-items: center;
  justify-content: space-around;
  padding: 0 10px;
  .iconfont {
    font-size: 24px;
  }
  .now {
    color: red;
  }
  .iconpinglun- {
    position: relative;
    i {
      position: absolute;
      right: 0;
      top: 0;
      background-color: red;
      font-size: 10px;
      color: #fff;
      padding: 0 3px;
      right: -5px;
      border-radius: 5px;
      font-style: normal;
    }
  }
  .search {
    width: 180px;
    padding-right: 10px;
    input {
      height: 30px;
      background-color: #ddd;
      border-radius: 15px;
      width: 100%;
      border: none;
      font-size: 14px;
      padding-left: 20px;
    }
  }
}
.footer-textarea {
  width: 100%;
  height: 100px;
  display: flex;
  position: fixed;
  z-index: 999;
  bottom: 0;
  padding: 10px;
  align-items: flex-end;
  background-color: #fff;
  border-top: 1px solid #ccc;
  justify-content: space-around;
  textarea {
    width: 260px;
    height: 80px;
    background-color: #ccc;
    border-radius: 5px;
    border: none;
    padding: 10px;
    font-size: 14px;
  }
}
</style>
