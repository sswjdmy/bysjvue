<template>
  <el-container class="category" v-loading="loading">
    <el-main class="main">
      <div style="display: flex;justify-content: flex-start;margin-top: 20px;margin-bottom: 20px">
        <el-input
          placeholder="输入新类型名(长度小于10)"
          maxlength="10"
          prefix-icon="el-icon-circle-plus-outline"
          v-model="typeName" style="width: 400px">
        </el-input>
        <el-button type="primary" icon="el-icon-circle-plus-outline" style="margin-left: 3px" @click="addClick">添加
        </el-button>
      </div>

      <el-table
        :data="types"
        stripe
        border
        height="500"
        style="width: 100%">
        <el-table-column
          type="index"
          label="编号"
          width="220">
        </el-table-column>
        <el-table-column
          prop="cateName"
          label="名称"
          width="220">
        </el-table-column>
        <el-table-column
          prop="subNumber"
          label="该类型中的药品数"
          width="220">
        </el-table-column>
        <el-table-column
          prop="operation"
          label="操作"
          width="220">
          <template slot-scope="scope">
            <el-popover
              placement="bottom"
              width="300px"
              trigger="manual"
              :ref="'popover-' + scope.row.id">
              <p>修改类型名称:</p>
              <div>
                <el-input
                  placeholder="请输入内容（长度小于10）"
                  v-model="newName"
                  width="120px"
                  maxlength="10"
                  clearable>
                </el-input>
                <el-row style="margin-top: 10px;text-align: right ">
                  <el-button type="primary" @click="updateClick(scope.$index,scope.row)">提交</el-button>
                  <el-button type="info" @click="pCancel(scope.row.id)">取消</el-button>
                </el-row>
              </div>
              <el-button style="margin-left: 15px" type="primary" @click="pOpen(scope.row.id)" slot="reference">修改
              </el-button>
            </el-popover>
            <el-button style="margin-left: 30px" @click="deleteClick(scope.row)" type="danger">删除</el-button>

          </template>
        </el-table-column>
      </el-table>
    </el-main>
  </el-container>
</template>

<script>
  import {postRequest} from '../utils/api'
  import {putRequest} from "../utils/api";
  import {getRequest} from "@/utils/api";

  export default {
    name: "CategoryList",
    data() {
      return {

        showDialog: false,
        types: [],
        typeName: '',
        loading: false,
        newName: ''
      }
    },
    mounted() {
      let _this = this;
      _this.loading = true;
      this.loadTypes();
    },
    methods: {

      addClick() {
        let _this = this
        _this.loading = true;
        if (_this.typeName == '') {
          _this.$message({type: 'error', message: '请输入内容'});
          _this.loading = false
        } else {
          postRequest('type/add', {
            name: this.typeName
          }).then(resp => {
            this.loading = false
            if (resp.status == 200) {
              let json = resp.data;
              if (json.status == 'success') {
                _this.$message({type: json.status, message: json.msg});
                this.typeName = '';
                this.loadTypes()
              } else {
                _this.$message.error(json.msg)
              }
            }
          }, resp => {
            this.loading = false;
            this.$message.error('找不到服务器⊙﹏⊙∥!');
          })
        }

      },
      loadTypes() {
        let _this = this;
        getRequest('/type/getall').then(resp => {
          _this.loading = false;
          if (resp.status == 200) {
            _this.types = resp.data.types
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
          _this.loading = false;
          _this.$message({type: 'error', message: '数据加载失败!'});
        })
      },
      updateClick(index, row) {
        let _this = this
        _this.pClose(row.id)
        _this.loading = true
        if (this.newName == "") {
          _this.$message({type: 'error', message: '请输入内容'});
          _this.loading = false
        } else {
          putRequest('/type/update', {id: row.id, name: _this.newName}).then(resp => {
            if (resp.status == 200) {
              _this.loading = false
              let data = resp.data;
              _this.$message({type: data.status, message: data.msg});
              if (data.status == 'success') {
                _this.loadTypes()
              }
            } else {
              _this.$message({type: 'error', message: '修改失败!'});
            }
            _this.loading = false;
          }, resp => {
            _this.loading = false;
            _this.$message({type: 'error', message: '修改失败!'});
          });
        }
      },
      deleteClick(row) {
        let _this = this
        putRequest('/type/delete', {id: row.id,}).then(resp => {
          if (resp.status == 200) {
            _this.loading = false
            let data = resp.data;
            _this.$message({type: data.status, message: data.msg});
            if (data.status == 'success') {
              _this.loadTypes()
            }
          } else {
            _this.$message({type: 'error', message: '删除失败!'});
          }
          _this.loading = false;
        }, resp => {
          _this.loading = false;
          _this.$message({type: 'error', message: '删除失败!'});
        });
      },
      pCancel(id) {
        this.pClose(id)
      },
      pClose(id) {
        this.$refs[`popover-` + id].doClose()
        this.typeName = ''
      },
      pOpen(id) {
        this.$refs[`popover-` + id].doShow()
      }
    }
  }
</script>

<style scoped>

</style>
