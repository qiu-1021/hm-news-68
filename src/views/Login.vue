<template>
  <div>
    <hm-header>登陆</hm-header>
    <hm-logo></hm-logo>

    <!-- 登陆表单 -->
    <van-form @submit="login">
      <van-field
        v-model="username"
        label="账户"
        placeholder="请输入账号"
        :rules="rules.username"
      />
      <van-field
        v-model="password"
        type="password"
        name="密码"
        label="密码"
        placeholder="密码"
        :rules="rules.password"
      />
      <div style="margin: 16px;">
        <van-button round block type="info" native-type="submit">
          登陆
        </van-button>
      </div>
      <p class="tips">没有账号？去<router-link to="/register">注册</router-link></p>
    </van-form>
  </div>
</template>

<script>
// import axios from 'axios'
export default {
  methods: {
    async login () {
      const res = await this.$axios.post('/login', {
        username: this.username,
        password: this.password
      })
      console.log(res.data)
      const { statusCode, message } = res.data
      if (statusCode === 200) {
        this.$toast.success(message)
        this.$router.push('/user')
      } else {
        this.$toast.fail('登陆失败')
      }
    }
  },
  data () {
    return {
      username: '',
      password: '',
      rules: {
        username: [
          { required: true, message: '请输入账号', trigger: 'onChange' },
          { pattern: /^\d{5,11}$/, message: '账号长度为5-11位数字', trigger: 'onChange' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'onChange' },
          { pattern: /^\d{3,9}$/, message: '密码长度为3-9位数字', trigger: 'onChange' }
        ]
      }
    }
  }
}
</script>

<style lang="less">
// // 如果是750的设计稿  所有的px/75 得到rem
// .box {
//   width: 200px;
//   height: 200px;
//   background-color: pink;
// }
.tips {
  padding: 15px;
  font-size: 16px;
  text-align: right;
  a {
    color: yellow;
  }
}
</style>
