<template>
  <el-form :model="regForm" status-icon :rules="rules" ref="regForm" label-position="left" class="login-container" label-width="0px" v-loading="loading">
    <h3>系统注册</h3>
    <el-form-item  prop="username">
      <el-input  v-model="regForm.username" autocomplete="off" maxlength="10" clearable="" placeholder="账号(10位字符以下)"></el-input>
    </el-form-item>
    <el-form-item  prop="password">
      <el-input type="password" v-model="regForm.password" maxlength="16" minlength="6" autocomplete="off" placeholder="密码(6-16位字符)"></el-input>
    </el-form-item>
    <el-form-item  prop="phone">
      <el-input v-model.number="regForm.phone" maxlength="11" placeholder="常用手机号"></el-input>
    </el-form-item>
    <el-form-item style="width: 100%">
      <el-button type="primary" @click.native.prevent="submitForm('regForm')"  style="width: 45%">注册</el-button>
      <el-button  type="info" @click.native.prevent="toLoginClick" style="width: 45%">去登录</el-button>
    </el-form-item>

  </el-form>
</template>
<script>
  import {postRequest} from '../utils/api'
  export default {
    data() {
      let validatePhone = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('手机号不能为空'));
        }
        setTimeout(() => {
          if (!Number.isInteger(value)) {
            callback(new Error('请输入数字值'));
          } else {
            if (value < 10000000000||value>19999999999) {
              callback(new Error('请输入正确的手机号'));
            } else {
              callback();
            }
          }
        }, 1000);
      };
      let validateUsername = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入用户名'));
        } else {
          if (this.regForm.password !== '') {
            this.$refs.regForm.validateField('password');
          }
          callback();
        }
      };
      let validatePassword = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          if (value.length<6){
            callback(new Error('密码为(6-16位字符)'))
          } else{
            callback();
          }
        }
      };
      return {
        regForm: {
          username: '',
          password: '',
          phone: ''
        },
        rules: {
          username: [
            { validator: validateUsername, trigger: 'blur' }
          ],
          password: [
            { validator: validatePassword, trigger: 'blur' }
          ],
          phone: [
            { validator: validatePhone, trigger: 'blur' }
          ]
        },
        loading:false
      };
    },
    methods: {
      submitForm(formName) {
        this.loading=true;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            postRequest('reg',{
              username:this.regForm.username,
              password:this.regForm.password,
              phone:this.regForm.phone
            }).then(resp=>{
              this.loading = false
              if (resp.status == 200){
                let json = resp.data;
                if (json.status == 'success') {
                  this.$alert('注册成功','成功')
                }else {
                  this.$alert(json.msg,'失败')
                }
              }
            },resp=>{
              this.loading = false;
              this.$alert('找不到服务器⊙﹏⊙∥!', '失败!');
            })
          } else {
            this.loading = false;
            console.log('error submit!!');
            return false;
          }
        });
      },
      toLoginClick() {
        this.$router.replace({path : '/'});
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
</style>
