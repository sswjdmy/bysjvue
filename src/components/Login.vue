<template>
  <div>
  <div>#############</div>
  <el-form :rules="rules" :model="loginForm" class="login-container" label-position="left"
           label-width="0px" v-loading="loading">
    <h3 class="login_title">系统登录</h3>
    <el-form-item prop="username">
      <el-input v-model="loginForm.username" maxlength="10" auto-complete="off" placeholder="账号"></el-input>
    </el-form-item>
    <el-form-item prop="password">
      <el-input type="password" v-model="loginForm.password"  maxlength="16" auto-complete="off" placeholder="密码"></el-input>
    </el-form-item>
    <!--<el-button position="left" type="text">忘记密码</el-button>-->
    <el-form-item style="width: 100%" >
        <el-button type="primary" @click.native.prevent="submitClick" style="width: 45%" >登录</el-button>
        <el-button  @click="toRegClick" style="width: 45%">注册</el-button>
    </el-form-item>
  </el-form>
  </div>
</template>
<script>
  import {postRequest} from '../utils/api'
  export default{
    data(){
      return {
        rules: {
          username: [{required: true, message: '请输入用户名', trigger: 'blur'}],
          password: [{required: true, message: '请输入密码', trigger: 'blur'}]
        },
        loginForm: {
          username: '',
          password: ''
        },
        loading: false
      }
    },
    methods: {
      submitClick: function () {
        if (this.loginForm.username===''||this.loginForm.password===''){
          this.$alert('请输入用户名和密码','失败!');
          return false;
        }
        let _this = this;
        this.loading = true;
        postRequest('/login', {
          username: this.loginForm.username,
          password: this.loginForm.password
        }).then(resp=> {
          _this.loading = false;
          if (resp.status == 200) {
            //成功
            var json = resp.data;
            if (json.status == 'success') {
              _this.$router.replace({path: '/home'});
            } else {
              _this.$alert('登录失败!', '失败!');
            }
          } else {
            //失败
            _this.$alert('登录失败!', '失败!');
          }
        }, resp=> {
          _this.loading = false;
          _this.$alert('找不到服务器⊙﹏⊙∥!', '失败!');
        })
      },
      toRegClick: function () {
        this.$router.replace({path : '/reg'});
      }
    }
  }
</script>
<style>
  .login-container {
    border-radius: 15px;
    background-clip: padding-box;
    margin: 180px auto;
    width: 350px;
    padding: 35px 35px 15px 35px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
  }

  .login_title {
    margin: 0px auto 40px auto;
    text-align: center;
    color: #505458;
  }

  .login_remember {
    margin: 0px 0px 35px 0px;
    text-align: left;
  }

  .header{
    content: 'ture';
  }
</style>
