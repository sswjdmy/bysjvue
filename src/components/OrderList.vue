<template>
  <el-container v-loading="loading">
    <el-main class="main">
      <el-row style="width:100% ;margin-top: 10px;margin-bottom: 10px;">
        <el-col :span="8" :offset="3">
          <el-date-picker
            v-model="selectDate"
            type="daterange"
            align="right"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions">
          </el-date-picker>
        </el-col>
        <el-col :span="3">
            <el-button type="primary" icon="el-icon-search" style="margin-left: 3px" @click="serchClick">搜索
            </el-button>
        </el-col>
      </el-row>
      <el-table
        :data="orderList"
        stripe
        border
        height="502">
        <el-table-column
          fixed
          type="index"
          label="编号"
          width="90">
        </el-table-column>
        <el-table-column
          prop="orderNumber"
          label="订单号"
          width="180">
        </el-table-column>
        <el-table-column
          prop="memberName"
          label="会员名"
          width="150">
        </el-table-column>
        <el-table-column
          prop="totalAmount"
          label="总金额"
          width="100">
        </el-table-column>
        <el-table-column
          prop="status"
          label="订单状态"
          width="90">
          <template slot-scope="scope">
            <el-tag
              :type="scope.row.status!=1 ? 'danger' : 'success'"
              disable-transitions>{{scope.row.status!=1 ?'未完成':'已完成'}}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column
          prop="addTimeStr"
          label="添加时间"
          width="160">
        </el-table-column>
        <el-table-column
          prop="operation"
          label="操作"
          width="230">
          <template slot-scope="scope">
            <el-row>
              <el-button @click="deleteClick(scope.row)" :type="scope.row.status !=1 ?'danger':'info'">删 除</el-button>
              <el-button @click="showDetail(scope.row)" type="primary">查看详情</el-button>
            </el-row>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        :page-size="pageSize"
        layout="prev, pager, next"
        :total="totalCount" @current-change="currentChange" v-show="this.orderList.length>0">
      </el-pagination>
        <!--:modal-append-to-body="false"-->
      <el-dialog title="订单详情" style="width: 100%;" :visible.sync="dialogVisible">
        <div>
          <el-row style="width: 640px;margin-top: 10px;margin-bottom: 10px;">
            <el-col :span="12"><div>订单号：{{dialogInfo.orderNumber}}</div></el-col>
            <el-col :span="6" :offset="4"><div>会员号：{{dialogInfo.memberid}}</div></el-col>
          </el-row>
          <el-row style="width: 640px;margin-top: 10px;margin-bottom: 10px;">
            <el-col :span="6" :offset="2"><div>订单状态：{{dialogInfo.status==1?'已完成':'待支付'}}</div></el-col>
            <el-col :span="6" :offset="1"><div>总金额：{{dialogInfo.totalAmount}}元</div></el-col>
            <el-col :span="6" :offset="1"><div>实付：{{dialogInfo.realAmount}}元</div></el-col>
          </el-row>
          <el-table
            :data="dialogInfo.subOrders"
            stripe
            border
            width="500px"
            height="400px">
            <el-table-column
              fixed
              type="index"
              label="编号"
              width="90">
            </el-table-column>
            <el-table-column
              prop="mname"
              label="名称"
              width="150">
            </el-table-column>
            <el-table-column
              prop="charge"
              label="价格"
              width="150">
            </el-table-column>
            <el-table-column
              prop="saleNumber"
              label="数量"
              width="150">
            </el-table-column>
          </el-table>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">关 闭</el-button>
        </div>
      </el-dialog>
    </el-main>
  </el-container>
</template>

<script>
  import {getRequest, putRequest} from "@/utils/api";

  export default {
    data() {
      return {
        pickerOptions: {
          shortcuts: [{
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          },{
            text: '最近半年',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 180);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
        selectDate: '',

        orderList:[], //table data
        dialogInfo:'', // dialog
        dialogVisible:false,
        loading:false,
        pageSize: 7,
        totalCount: -1,
        currentPage: 1
      };
    },
    mounted() {
      this.loading = true
      this.loadOrders(1, this.pageSize,0,new Date().getTime())  //初始化加载全部
    },
    methods: {
      showDetail(row) {
        let _this = this;
        _this.dialogVisible = true;
        let url = "/order/detail" + "?orderNumber="+row.orderNumber;
        getRequest(url).then(resp => {
          _this.loading = false;
          if (resp.status == 200) {
            _this.dialogInfo = resp.data;
          } else {
            _this.$message({type: 'error', message: '数据加载失败!'});
          }
        }, resp => {
          _this.loading = false;
          if (resp.response.status == 403) {
            _this.$message({type: 'error',message: '数据加载失败!'});
          } else {
            _this.$message({type: 'error', message: '数据加载失败!'});
          }
        }).catch(resp => {
          _this.loading = false;
          _this.$message({type: 'error', message: '数据加载失败!'});
        })
      },
      loadOrders(page, count , start,end) {
        let _this = this;
        _this.loading = true;
        let url = "/order/list" + "?page=" + page + "&count=" + count +"&startDate=" + start +"&endDate="+end;
        getRequest(url).then(resp => {
          _this.loading = false;
          if (resp.status == 200) {
            _this.orderList = resp.data.orders;
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
      deleteClick(row) {
        let _this = this
        if(row.status==1){
          _this.$message({type: 'warning', message: '无法删除已完成的订单!'});
          return;
        }
        let url = "/order/del" + "?orderNumber="+row.orderNumber;
        getRequest(url).then(resp => {
          if (resp.status == 200) {
            _this.currentChange(_this.currentPage)
            _this.loading = false;
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
      serchClick() {
        let st;
        let et;
        if (this.selectDate==''){
          st = 0;
          et = new Date().getTime();
        }else {
          st =this.selectDate[0].getTime();
          et =this.selectDate[1].getTime();
        }
        this.loadOrders(1, this.pageSize,st,et);
      },
      currentChange(currentPage) {
        this.currentPage = currentPage;
        this.loading = true;
        let st;
        let et;
        if (this.selectDate==''){
          st = 0;
          et = new Date().getTime();
        }else {
          st =this.selectDate[0].getTime();
          et =this.selectDate[1].getTime();
        }
        this.loadOrders(currentPage, this.pageSize,st,et);
      }
    },
  }
</script>




<style scoped>

</style>
