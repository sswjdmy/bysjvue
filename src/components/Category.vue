<template>
  <el-container class="category" v-loading="loading">
    <el-main class="main">
      <div style="display: flex;justify-content: flex-start;margin-top: 20px">
        <el-input
          placeholder="输入新类型名"
          prefix-icon="el-icon-circle-plus-outline"
          v-model="typeName" style="width: 400px" >
        </el-input>
        <el-button type="primary" icon="el-icon-circle-plus-outline"  style="margin-left: 3px" @click="addClick">添加
        </el-button>
      </div>
      <!--<el-table-->
        <!--:data="tableData"-->
        <!--style="width: 100%">-->
        <!--<el-table-column-->
          <!--label="名称"-->
          <!--width="180">-->
          <!--<template slot-scope="scope">-->
            <!--<el-popover trigger="hover" placement="top">-->
              <!--<p>姓名: {{ scope.row.name }}</p>-->
              <!--<p>住址: {{ scope.row.address }}</p>-->
              <!--<div slot="reference" class="name-wrapper">-->
                <!--<el-tag size="medium">{{ scope.row.name }}</el-tag>-->
              <!--</div>-->
            <!--</el-popover>-->
          <!--</template>-->
        <!--</el-table-column>-->
        <!--<el-table-column label="操作">-->
          <!--<template slot-scope="scope">-->
            <!--<el-button-->
              <!--size="mini"-->
              <!--@click="handleEdit(scope.$index, scope.row)">编辑</el-button>-->
            <!--<el-button-->
              <!--size="mini"-->
              <!--type="danger"-->
              <!--@click="handleDelete(scope.$index, scope.row)">删除</el-button>-->
          <!--</template>-->
        <!--</el-table-column>-->
      <!--</el-table>-->
    </el-main>
  </el-container>
</template>

<script>
    import {postRequest} from '../utils/api'
    import {getRequest} from "@/utils/api";
    export default {
        name: "Category",
        data(){
          return{
            typeName:'',
            loading:false
          }
        },
      methods:{
          addClick(){
            this.loading=true;
            // getRequest('type/add',{
            //  name:this.typeName
            // }).then(resp=>{
            //   this.loading = false
            //   if (resp.status == 200){
            //     let json = resp.data;
            //     if (json.status == 'success') {
            //       this.$alert('添加成功','成功')
            //     }else {
            //       this.$alert(json.msg,'失败')
            //     }
            //   }
            // },resp=>{
            //   this.loading = false;
            //   this.$alert('找不到服务器⊙﹏⊙∥!', '失败!');
            // })
          }
      }
    }
</script>

<style scoped>

</style>
