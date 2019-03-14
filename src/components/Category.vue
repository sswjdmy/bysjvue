<template>
  <el-container class="category" v-loading="loading">
    <el-main class="main">
      <div style="display: flex;justify-content: flex-start;margin-top: 20px;margin-bottom: 20px">
        <el-input
          placeholder="输入新类型名"
          prefix-icon="el-icon-circle-plus-outline"
          v-model="typeName" style="width: 400px" >
        </el-input>
        <el-button type="primary" icon="el-icon-circle-plus-outline"  style="margin-left: 3px" @click="addClick">添加
        </el-button>
      </div>
      <el-table
        :data="types"
        stripe
        border
        height="500"
        style="width: 100%">
        <el-table-column
          fixed
          type="index"
          label="编号"
          width="180">
        </el-table-column>
        <el-table-column
          prop="cateName"
          label="名称"
          width="180">
        </el-table-column>
        <el-table-column
          prop="operation"
          label="操作">
          <template slot-scope="scope">
            <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button>
            <el-button type="text" size="small">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
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
            types:[],
            typeName:'',
            loading:false
          }
        },
      mounted(){
        let _this = this;
        _this.loading = true;
        this.loadTypes();
      },
      methods: {
        addClick() {
          this.loading = true;
          postRequest('type/add', {
            name: this.typeName
          }).then(resp => {
            this.loading = false
            if (resp.status == 200) {
              let json = resp.data;
              if (json.status == 'success') {
                this.$alert('添加成功', '成功');
                this.typeName = '';
                this.loadTypes()
              } else {
                this.$alert(json.msg, '失败')
              }
            }
          }, resp => {
            this.loading = false;
            this.$alert('找不到服务器⊙﹏⊙∥!', '失败!');
          })
        },
        loadTypes() {
          let _this = this;
          getRequest('/type/getall').then(resp => {
            _this.loading = false;
            if (resp.status == 200) {
              _this.types = resp.data.types;
            } else {
              _this.$message({type: 'error', message: '数据加载失败!'});
            }
          }, resp => {
            _this.loading = false;
            if (resp.response.status == 403) {
              _this.$message({type: 'error', message: resp.response.data});
            } else {
              _this.$message({type: 'error', message: '数据加载失败!'});
            }
          }).catch(resp => {
            //压根没见到服务器
            _this.loading = false;
            _this.$message({type: 'error', message: '数据加载失败!'});
          })
        }
      }
    }
</script>

<style scoped>

</style>
