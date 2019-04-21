<template>
  <el-container v-loading="loading">
    <el-main class="main">
      <div style="display: flex;justify-content: flex-start;margin-top: 20px;margin-bottom: 20px">
        <el-input
          placeholder="输入名字(长度小于10)"
          maxlength="10"
          v-model="memberName" style="width: 250px">
        </el-input>
        <el-input
          placeholder="输入手机号"
          type="tel"
          maxlength="11"
          v-model="phone" style="width: 250px">
        </el-input>
        <el-button type="primary" icon="el-icon-circle-plus-outline" style="margin-left: 5px" @click="addClick">添加
        </el-button>
      </div>

      <el-table
        :data="members"
        stripe
        border
        height="520"
        style="width:90%">
        <el-table-column
          type="index"
          label="编号"
          width="220">
        </el-table-column>
        <el-table-column
          prop="id"
          label="会员号"
          width="220">
        </el-table-column>
        <el-table-column
          prop="name"
          label="姓名"
          width="220">
        </el-table-column>
        <el-table-column
          prop="phone"
          label="手机号"
          width="220">
        </el-table-column>
        <el-table-column
          prop="totalAmount"
          label="总积分"
          width="220">
        </el-table-column>
      </el-table>
      <el-pagination
        background
        :page-size="pageSize"
        layout="prev, pager, next"
        :total="totalCount" @current-change="currentChange" v-show="this.members.length>0">
      </el-pagination>
    </el-main>
  </el-container>
</template>

<script>
  import {getRequest, postRequest} from "@/utils/api";

  export default {
    name: "MemberList",
    data() {
      return{
        loading: false,
        memberName:'',
        phone:'',
        pageSize: 10,
        totalCount: -1,
        currentPage: 1,
        members:[],
      }
    },
    mounted(){
      this.loadMembers(1,this.pageSize)
    },
    methods: {
      loadMembers(page, count) {
        let _this = this;
        let url = "/member/all" + "?page=" + page + "&count=" + count;
        getRequest(url).then(resp => {
          _this.loading = false;
          if (resp.status == 200) {
            // let meds = [];
            //
            // for ( let item in resp.data.medicines.medicine){
            //   meds.push(item)
            // }
            _this.members = resp.data.members;
            _this.totalCount = resp.data.totalCount;
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
      currentChange(currentPage) {
        this.currentPage = currentPage;
        this.loading = true;
        this.loadMembers(currentPage, this.pageSize);
      },
      addClick(){
        if (this.memberName==''){
          this.$message({type: 'error', message: '请输入名字!'});
          return;
        } else if(this.phone==''){
          this.$message({type: 'error', message: '请输入手机号!'});
          return;
        }else {
          this.submit();
        }

      },
      submit() {
        let _this = this
        _this.loading = true;
        postRequest('member/add', {
          name:_this.memberName,
          phone:_this.phone
        }).then(resp => {
          _this.loading = false
          if (resp.status == 200) {
            let json = resp.data;
            if (json.status == 'success') {
              _this.$message({
                message: '添加成功！',
                type: 'success'
              });
              _this.currentChange(_this.currentPage)
            } else {
              this.$message.error('添加失败！'+json.msg);
            }
            _this.memberName='';
            _this.phone ='';
          }
        }, resp => {
          _this.loading = false;
          this.$message.error('添加失败！找不到服务器⊙﹏⊙∥!');
        })
      },
    },
  }
</script>

<style scoped>

</style>
