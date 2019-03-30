<template>
  <el-container class="medicineList" v-loading="loading">
    <el-main class="main">
      <el-row style="width: 540px;margin-top: 10px;margin-bottom: 10px;">
        <el-col :span="10">
          <div style="display: flex;justify-content: flex-start">
            <el-select v-model="selectType" clearable placeholder="全部">
              <el-option
                v-for="item in types"
                :key="item.id"
                :label="item.cateName"
                :value="item.id">
              </el-option>
            </el-select>
          </div>
        </el-col>
        <el-col :span="14">
          <div style="display: flex;justify-content: flex-start">
            <el-input
              placeholder="输入关键字"
              maxlength="10"
              prefix-icon="el-icon-search"
              v-model="keywords" style="width: 400px">
            </el-input>
            <el-button type="primary" icon="el-icon-search" style="margin-left: 3px" @click="serchClick">搜索
            </el-button>
          </div>
        </el-col>
      </el-row>
      <el-table
        :data="medicines"
        stripe
        border
        fit="false"
        height="500"
        style="width: 100%">
        <el-table-column
          fixed
          type="index"
          label="编号"
          width="90">
        </el-table-column>
        <el-table-column
          prop="medicine.medicineName"
          label="名称"
          width="150">
        </el-table-column>
        <el-table-column
          prop="mType.cateName"
          label="类型名"
          width="100">
        </el-table-column>


        <el-table-column
          prop="medicine.prescription"
          label="处方药"
          width="65">
          <template slot-scope="scope">
            <el-tag
              :type="scope.row.medicine.prescription  ? 'danger' : 'success'"
              disable-transitions>{{scope.row.medicine.prescription?'是':'否'}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="medicine.medicineDescribe"
          label="描述"
          max-length ="10"
          width="200">
        </el-table-column>
        <el-table-column
          prop="medicine.charge"
          label="价格"
          width="150">
        </el-table-column>

        <el-table-column
          prop="medicine.medicineNumber"
          label="数量"
          width="150">
        </el-table-column>
        <el-table-column
          prop="addTime"
          label="添加时间"
          width="180">
        </el-table-column>
        <el-table-column
          prop="operation"
          label="操作"
          width="150">
          <template slot-scope="scope">
            <el-button style="margin-left: 30px" @click="deleteClick(scope.row)" type="danger">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        :page-size="pageSize"
        layout="prev, pager, next"
        :total="totalCount" @current-change="currentChange" v-show="this.medicines.length>0">
      </el-pagination>
    </el-main>
  </el-container>
</template>

<script>
  import {getRequest, putRequest} from "@/utils/api";

  export default {
    data() {
      return {
        loading:false,
        medicines:[],
        types:[],
        keywords:'',
        selectType:'',
        pageSize:6,
        totalCount:-1,
        currentPage:1
      };
    },
    mounted() {
      this.loading = true
      this.loadTypes()
      this.loadMedicine(1, this.pageSize)
    },
    methods: {
      loadTypes(){
        {
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
        }
      },
      loadMedicine(page,count){
        let _this = this;
        let url = '';
        if (this.selectType == '') {
          url = "/medicine/all" + "?page=" + page + "&count=" + count + "&keywords=" + this.keywords;
        } else {
          url = "/medicine/getByType"+"?tid="+_this.selectType+"&page=" + page + "&count=" + count + "&keywords=" + this.keywords;
        }
        getRequest(url).then(resp=> {
          _this.loading = false;
          if (resp.status == 200) {
            // let meds = [];
            //
            // for ( let item in resp.data.medicines.medicine){
            //   meds.push(item)
            // }
            _this.medicines = resp.data.medicines;
            _this.totalCount = resp.data.totalCount;
          } else {
            _this.$message({type: 'error', message: '数据加载失败!'});
          }
        }, resp=> {
          _this.loading = false;
          if (resp.response.status == 403) {
            _this.$message({type: 'error', message: resp.response.data});
          } else {
            _this.$message({type: 'error', message: '数据加载失败!'});
          }
        }).catch(resp=> {
          //压根没见到服务器
          _this.loading = false;
          _this.$message({type: 'error', message: '数据加载失败!'});
        })
      },
      deleteClick(row) {
        let _this = this
        putRequest('/medicine/delete', {id: row.medicine.id,}).then(resp => {
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
      serchClick(){
        this.loadMedicine(1, this.pageSize);
      },
      currentChange(currentPage){
        this.currentPage = currentPage;
        this.loading = true;
        this.loadMedicine(currentPage, this.pageSize);
      }
    },

  }
</script>

<style scoped>

</style>
