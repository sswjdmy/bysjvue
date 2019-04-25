<template>
  <div>
    <h2>个人中心</h2>
    <h3>当前用户为{{currentUserName}}</h3>
    <el-collapse style="width: 60%;margin-left: 20% ; padding-right: 500px" v-model="activeName" accordion>
      <el-collapse-item title="修改用户名" name="1">
        <div><el-input v-model="newName" placeholder="请输入新用户名(10位字符以下)"></el-input></div>
        <div><el-button @click="changeUsername" style="margin-top: 10px" type="primary">确认</el-button></div>
      </el-collapse-item>
      <el-collapse-item title="修改密码" name="2">
        <div><el-input type="password" v-model="newPwd" placeholder="请输入新的密码(6-16位字符)"></el-input></div>
        <div><el-button @click="changPwd" style="margin-top: 10px" type="primary">确认</el-button></div>
      </el-collapse-item>
    </el-collapse>
  </div>

</template>

<script>
  import {getRequest, putRequest} from "@/utils/api";

    export default {
        name: "Personal",
      data() {
        return {
          activeName: '1',
          currentUserName:'',
          newName:'',
          newPwd:''
        };
      },
     methods:{
       getUserName() {
         let _this = this;
         getRequest("/currentUserName").then(function (msg) {
           _this.currentUserName = msg.data;
         }, function () {
           _this.currentUserName = '游客';
         });
       },
       changeUsername(){
         let _this = this;
         if(_this.newName==''){
           _this.$message({type: 'error', message: '用户名不能为空!'});
         }else  if(_this.newName.length>10){
           _this.$message({type: 'error', message: '用户名过长'});
         }else {
           putRequest('/updateUserName', {name: _this.newName}).then(resp => {
             if (resp.status == 200) {
               _this.loading = false;
               let data = resp.data;
               _this.$message({type: data.status, message: data.msg});
               if (data.status == 'success') {
                 _this.getUserName()
               }
             } else {
               _this.$message({type: 'error', message: '修改失败!'});
             }
             _this.loading = false;
           }, resp => {
             _this.loading = false;
             _this.$message({type: 'error', message: '删除失败!'});
           });
         }
       },
       changPwd(){
         let _this = this;
         if(_this.newPwd==''){
           _this.$message({type: 'error', message: '密码不能为空!'});
         }else  if(_this.newPwd.length>16||_this.newPwd.length<6){
           _this.$message({type: 'error', message: '密码长度错误'});
         }else {
           putRequest('/updatePwd', {name: _this.newPwd}).then(resp => {
             if (resp.status == 200) {
               _this.loading = false;
               let data = resp.data;
               _this.$message({type: data.status, message: data.msg});
             } else {
               _this.$message({type: 'error', message: '修改失败!'});
             }
             _this.loading = false;
           }, resp => {
             _this.loading = false;
             _this.$message({type: 'error', message: '删除失败!'});
           });
         }
       }
     },
   mounted: function () {
     var _this = this;
     _this.getUserName();
     // _this.timer();
   }
    }
</script>

<style scoped>

</style>
