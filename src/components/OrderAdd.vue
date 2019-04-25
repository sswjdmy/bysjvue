<template>
  <el-container class="orderadd" v-loading="loading">
    <el-main class="main">
      <el-row style="width: 680px;margin-top: 10px;margin-bottom: 10px;">
        <el-col :span="14">
          <div style="display: flex;justify-content: flex-start">
            <el-input
              placeholder="请输入会员号"
              maxlength="10"
              prefix-icon="el-icon-search"
              v-model="memberId" style="width: 400px">
            </el-input>
            <el-button type="primary" icon="el-icon-search" style="margin-left: 3px" @click="searchMemberClick">搜索
            </el-button>
            <el-button type="warning" plain>{{memberName}}</el-button>
          </div>
        </el-col>
        <el-col :span="5">
          <el-button type="primary" plain @click="openDialog">添加药品到订单</el-button>
        </el-col>
        <el-col :span="5">
          <el-button type="success" plain @click="submitOrder">提交订单</el-button>
        </el-col>
      </el-row>
      <el-table
        :data="subOrders"
        stripe
        border
        height="502">
        <el-table-column
          prop="medicineName"
          label="名称"
          width="150">
        </el-table-column>
        <el-table-column
          prop="charge"
          label="价格"
          width="150">
        </el-table-column>

        <el-table-column
          label="购买数量"
          width="200">
          <template slot-scope="scope">
            <el-input-number :controls="false" v-model.number="scope.row.selectNumber" :min="1"
                             :max="scope.row.medicineNumber"
                             style="display: flex;justify-content: flex-start ;"></el-input-number>
          </template>
        </el-table-column>

        <el-table-column
          prop="operation"
          label="操作"
          width="190">
          <template slot-scope="scope">
            <el-row>
              <el-button @click="deleteClick(scope.row)" type="danger">删除</el-button>
            </el-row>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog title="药品选择" :modal-append-to-body="false" style="width: 110%;" :visible.sync="dialogVisible">
        <div>
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
                <el-button type="primary" icon="el-icon-search" style="margin-left: 3px" @click="searchClick">搜索
                </el-button>
              </div>
            </el-col>
          </el-row>
          <el-table
            :data="medicines"
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
                  disable-transitions>{{scope.row.medicine.prescription?'是':'否'}}
                </el-tag>
              </template>
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
              prop="operation"
              label="操作"
              width="110">
              <template slot-scope="scope">
                <el-row>
                  <el-button @click="pushSelect(scope.row)" type="success" plain>选 择</el-button>
                </el-row>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            background
            :page-size="pageSize"
            layout="prev, pager, next"
            :total="totalCount" @current-change="currentChange" v-show="this.medicines.length>0">
          </el-pagination>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">关 闭</el-button>
        </div>
      </el-dialog>
      <el-dialog title="订单确认" :modal-append-to-body="false" style="width: 100%;" :visible.sync="payDialogVisible">
        <div>
          <el-row style="width: 640px;margin-top: 10px;margin-bottom: 10px;">
            <el-col :span="12"><div>订单号：{{orderinfo.orderNumber}}</div></el-col>
            <el-col :span="6" :offset="4"><div>姓名：{{memberName}}</div></el-col>
          </el-row>
          <el-row style="width: 640px;margin-top: 10px;margin-bottom: 10px;">
            <el-col :span="6" :offset="2"><div>订单状态：{{orderinfo.status==1?'已完成':'待支付'}}</div></el-col>
            <el-col :span="6" :offset="1"><div>总金额：{{orderinfo.totalAmount}}元</div></el-col>
            <el-col :span="6" :offset="1"><div>应收：{{orderinfo.totalAmount}}元</div></el-col>
          </el-row>
          <el-table
            :data="payList"
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
          <label>(待顾客付款完成后点击确认)</label>
          <el-button type="primary" @click="payOrder">确 认</el-button>
          <el-button type="info" @click="cancleOrder">取 消</el-button>
        </div>
      </el-dialog>
    </el-main>
  </el-container>
</template>

<script>
  import {getRequest, postRequest, putRequest} from "@/utils/api";

  export default {
    name: "OrderAdd",
    data() {
      return {
        loading: false,
        dialogVisible: false,
        payDialogVisible:false,
        memberId: '',
        memberPhone: '',
        memberName: '非会员',
        subOrders: [],//订单药品列表
        medicines: [], //所有药品列表
        payList:[], //确认订单 药品列表
        orderinfo:'',
        member: '',
        selectNumber: '',
        types: [],
        keywords: '',
        selectType: '',
        pageSize: 7,
        totalCount: -1,
        currentPage: 1
      }
    },
    mounted() {
    },
    methods: {
      deleteClick(row) {

        let index = this.subOrders.indexOf(row);
        if (index > -1) {
          this.subOrders.splice(index, 1);
        }
      },
      searchMemberClick() {
        let _this = this;
        putRequest('/member/id', {id: _this.memberId}).then(resp => {
          _this.loading = false;
          if (resp.status == 200) {
            if (resp.data==''){
              _this.memberName ='非会员';
              _this.$message({type: 'warning', message: '未找到该会员!!'});
              return;
            }
            _this.member = resp.data;
            _this.memberName = resp.data.name
          } else {
            _this.$message({type: 'error', message: '失败!'});
          }
        }, resp => {
          _this.loading = false;
          if (resp.response.status == 403) {
            _this.$message({type: 'error', message: resp.response.data});
          } else {
            _this.loading = false;
            _this.memberName = '非会员';
            _this.member = '';
            _this.$message({type: 'info', message: '未找到该会员!'});
          }
        }).catch(resp => {
          _this.loading = false;
          _this.memberName = '非会员';
          _this.member = '';
        })
      },
      openDialog() {
        this.dialogVisible = true;
        this.loadTypes();
        this.loadMedicine(1, 7);
      },
      submitOrder() {
        let _this = this
        _this.loading = true;
        if (_this.subOrders == '') {
          _this.$message({type: 'warning', message: '请先选择药品!'});
          _this.loading=false;
          return;
        }
        if (_this.memberId == '') {
          _this.memberId = 0;
        }
        let AddOrderBean={
          mid:_this.memberId,
          subOrders:[],
        }
        for (const item of _this.subOrders) {
          let subOrder = {
            mid: item.id,
            charge: item.charge,
            saleNumber: item.selectNumber,
            mname: item.medicineName
          };
          AddOrderBean.subOrders.push(subOrder);
        }
        _this.dialogVisible = false;
        postRequest('order/add',{
          mid:AddOrderBean.mid,
          json:JSON.stringify(AddOrderBean.subOrders)
        }).then(resp => {
          console.log(resp);
          this.loading = false
          if (resp.status == 200) {
            let json = resp.data;
            if (json.status == 'success') {
              this.$message({
                message: '添加成功！',
                type: 'success'
              });
              _this.orderinfo = json.order;
              _this.payList = json.order.subOrders;
              _this.payDialogVisible = true;
              _this.subOrders = '';
            } else {
              this.$message.error('添加失败！' + "");
            }
          }
        }, resp => {
          this.loading = false;
          this.$message.error('添加失败！找不到服务器⊙﹏⊙∥!');
        })
      },
      payOrder(){
        let _this = this;
        putRequest('/order/pay', {
          memberid: _this.memberId,
          orderNumber: _this.orderinfo.orderNumber,
          realAmount: _this.orderinfo.totalAmount
        }).then(resp => {
          _this.loading = false;
          if (resp.status == 200) {
            _this.payDialogVisible = false;
            if (resp.data.status=='success'){
              this.$message({
                message: '操作成功！',
                type: 'success'
              });
              this.$router.replace({path : '/orderlist'});
            } else {
              this.$message({
                message: '操作失败！',
                type: 'success'
              });
            }
          } else {
            _this.$message({type: 'error', message: '失败!'});
          }
        }, resp => {
          _this.loading = false;
          if (resp.response.status == 403) {
            _this.$message({type: 'error', message: resp.response.data});
          } else {
            _this.loading = false;
            _this.memberName = '非会员';
            _this.member = '';
            _this.$message({type: 'info', message: '未找到该会员!'});
          }
        }).catch(resp => {
          _this.loading = false;
          _this.memberName = '非会员';
          _this.member = '';
        })
      },
      cancleOrder(){
        let _this = this;
        _this.loading = true;
        let url = "/order/del" + "?orderNumber="+_this.orderinfo.orderNumber;
        getRequest(url).then(resp => {
            _this.loading = false;
          if (resp.status == 200) {
            _this.payDialogVisible = false;
            let data = resp.data;
            _this.$message({type: data.status, message: data.msg});
          } else {
            _this.$message({type: 'error', message: '删除失败!'});
          }
          _this.loading = false;
        }, resp => {
          _this.payDialogVisible = false;
          _this.loading = false;
          _this.$message({type: 'error', message: '删除失败!'});
        });
      },
      pushSelect(row) {
        let _this = this;
        let id = row.medicine.id;
        if (!row.medicine.medicineNumber > 0) {
          _this.$message({type: 'warning', message: '库存已空，无法添加！'});
          return;
        }
        for (const subOrder of _this.subOrders) {
          if (subOrder.id == id) {
            _this.$message({type: 'warning', message: '不能重复添加！'});
            return;
          }
        }
        let subOrder = row.medicine;
        subOrder.selectNumber = '';
        this.subOrders.push(subOrder);
      },
      searchClick() {
        this.loadMedicine(1, this.pageSize);
      },
      loadTypes() {
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
      loadMedicine(page, count) {
        let _this = this;
        let url = '';
        if (this.selectType == '') {
          url = "/medicine/all" + "?page=" + page + "&count=" + count + "&keywords=" + this.keywords;
        } else {
          url = "/medicine/getByType" + "?tid=" + _this.selectType + "&page=" + page + "&count=" + count + "&keywords=" + this.keywords;
        }
        getRequest(url).then(resp => {
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
      },
      currentChange(currentPage) {
        this.currentPage = currentPage;
        this.loading = true;
        this.loadMedicine(currentPage, this.pageSize);
      }
    },

  }
</script>

<style scoped>

</style>
