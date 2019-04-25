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
        :data="salesList"
        height="510">
        <el-table-column
          fixed
          type="index"
          label="编号"
          width="90">
        </el-table-column>
        <el-table-column
          prop="mname"
          label="药名"
          width="180">
        </el-table-column>
        <el-table-column
          prop="saleNumber"
          label="销量"
          width="150">
        </el-table-column>
      </el-table>
      <el-pagination
        background
        :page-size="pageSize"
        layout="prev, pager, next"
        :total="totalCount" @current-change="currentChange" v-show="this.salesList.length>0">
      </el-pagination>
    </el-main>
  </el-container>
</template>

<script>
    import {getRequest} from "@/utils/api";

    export default {
        name: "SalesStatistics",
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

          salesList:[], //table data
          dialogInfo:'', // dialog
          dialogVisible:false,
          loading:false,
          pageSize: 10,
          totalCount: -1,
          currentPage: 1
        };
      },
      mounted() {
        this.loading = true
        this.loadOrders(1, this.pageSize,0,new Date().getTime())  //初始化加载全部
      },
      methods: {
        loadOrders(page, count , start,end) {
          let _this = this;
          _this.loading = true;
          let url = "/medicine/sales" + "?page=" + page + "&count=" + count +"&startDate=" + start +"&endDate="+end;
          getRequest(url).then(resp => {
            _this.loading = false;
            if (resp.status == 200) {
              _this.salesList = resp.data.salesList;
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
