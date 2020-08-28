<template>
  <div>
    <hm-header>注册</hm-header>
    <hm-logo></hm-logo>
    <!-- 注册表单 -->
    <van-form @submit="register">
      <van-field
        v-model="user.username"
        label="账户"
        placeholder="请输入账号"
        :rules="rules.username"
      />
      <van-field
        v-model="user.nickname"
        label="昵称"
        placeholder="请输入昵称"
        :rules="rules.nickname"
      />
      <van-field
        v-model="user.password"
        type="password"
        name="密码"
        label="密码"
        placeholder="密码"
        :rules="rules.password"
      />
      <div style="margin: 16px;">
        <van-button round block type="info" native-type="submit">
          提交
        </van-button>
      </div>
      <p class="tips">已有账号？==><router-link to="/login">登陆</router-link></p>
    </van-form>
  </div>
</template>

<script>
export default {
  data () {
    return {
      user: {
        username: '',
        password: '',
        nickname: ''
      },
      rules: {
        username: [
          { required: true, message: '请填写用户名', trigger: 'onChange' },
          { pattern: /^\d{5,11}$/, message: '账号长度为5-11位数字', trigger: 'onChange' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'onChange' },
          { pattern: /^\d{3,9}$/, message: '密码长度为3-9位数字', trigger: 'onChange' }
        ],
        nickname: [
          { required: true, message: '昵称不能为空', trigger: 'onChange' },
          { pattern: /^[\u4e00-\u9fa5]{2,6}$/, message: '昵称必须是2-6位中文', trigger: 'onChange' }
        ]
      }
    }
  },
  methods: {
    async register () {
      const res = await this.$axios.post('/register', this.user)
      const { statusCode, message } = res.data
      if (statusCode === 200) {
        this.$toast.success(message)
        this.$router.push('/login')
      } else {
        this.$toast.fail(message)
      }
    }
  }
}
</script>

<style>
</style>
