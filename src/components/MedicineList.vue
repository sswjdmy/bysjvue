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
        height="500">
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
          show-overflow-tooltip

          prop="medicine.medicineDescribe"
          label="描述"
          max-length="10"
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
          width="160">
        </el-table-column>
        <el-table-column
          prop="operation"
          label="操作"
          width="190">
          <template slot-scope="scope">
            <el-row>
              <el-button @click="deleteClick(scope.row)" type="danger">删除</el-button>
              <el-button @click="showDialog(scope.row)" type="primary">修改</el-button>

            </el-row>

            <el-dialog title="药品修改" :modal-append-to-body="false" :visible.sync="dialogVisible">
              <el-form ref="form" :rules="rules" :model="form" class="medicine-add-container" label-position="left"
                       label-width="80px" v-loading="loading">
                <el-form-item label="药品名称" prop="medicineName">
                  <el-input v-model="form.medicineName" max_length="20"
                            style="display: flex;justify-content: flex-start ;"></el-input>
                </el-form-item>
                <el-form-item label="药品类型">
                  <span>{{form.selectType}}</span>
                </el-form-item>
                <el-form-item label="处方药" prop="prescription">
                  <el-switch v-model="form.prescription"
                             style="display: flex;justify-content: flex-start; margin-top:10px;"></el-switch>
                </el-form-item>
                <el-form-item label="价格" prop="charge">
                  <el-input-number v-model.number="form.charge" :precision="2" :min="0" :max="100000"
                                   style="display: flex;justify-content: flex-start ;"></el-input-number>
                </el-form-item>
                <el-form-item label="数量" prop="medicineNumber">

                  <el-input-number v-model.number="form.medicineNumber" :min="0" :max="100000"
                                   style="display: flex;justify-content: flex-start ;"></el-input-number>
                </el-form-item>
                <el-form-item label="药品描述" prop="medicineDescribe">
                  <el-input type="textarea" v-model="form.medicineDescribe"
                            :autosize="{ minRows: 4, maxRows: 4}"></el-input>
                </el-form-item>
              </el-form>
              <div slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="submitForm('form')">确 定</el-button>
              </div>
            </el-dialog>

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
        rules: {
          medicineName: [
            {required: true, message: '请输入药品名称', trigger: 'blur'},
            {max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur'}
          ],
          charge: [
            {required: true, message: '请输入价格', trigger: 'change'},
          ],
          medicineNumber: [
            {required: true, message: '请输入数量', trigger: 'change'},
          ],
          medicineDescribe: [
            {required: true, message: '请输入药品描述', trigger: 'blur'},
          ]
        },
        //update form
        form: {
          id: '',
          medicineName: '',
          prescription: '',
          selectType: '',
          charge: '',
          medicineNumber: '',
          medicineDescribe: ''
        },
        formLabelWidth: '120px',
        dialogVisible: false,
        loading: false,
        medicines: [],
        types: [],
        keywords: '',
        selectType: '',
        pageSize: 6,
        totalCount: -1,
        currentPage: 1
      };
    },
    mounted() {
      this.loading = true
      this.loadTypes()
      this.loadMedicine(1, this.pageSize)
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.dialogVisible = false;
            this.updateMedicine(formName);
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      updateMedicine(formName) {
        let _this = this;
        _this.loading = true;
        console.log(_this.form.prescription)
        putRequest('medicine/update', {
          id: _this.form.id,
          medicineName: _this.form.medicineName,
          prescription: _this.form.prescription,
          charge: _this.form.charge,
          medicineNumber: _this.form.medicineNumber,
          medicineDescribe: _this.form.medicineDescribe
        }).then(resp => {
          this.loading = false
          if (resp.status == 200) {
            _this.currentChange(_this.currentPage);
            let json = resp.data;
            if (json.status == 'success') {
              this.$message({
                message: '修改成功！',
                type: 'success'
              });
            } else {
              this.$message.error(json.msg);
            }
          }
        }, resp => {
          this.loading = false;
          this.$message.error('修改失败！找不到服务器⊙﹏⊙∥!');
        })
      },
      showDialog(row) {
        let _this = this;
        _this.form.id = row.medicine.id;
        _this.form.medicineName = row.medicine.medicineName;
        _this.form.selectType = row.mType.cateName;
        _this.form.prescription = row.medicine.prescription;
        _this.form.charge = row.medicine.charge;
        _this.form.medicineNumber = row.medicine.medicineNumber;
        _this.form.medicineDescribe = row.medicine.medicineDescribe;
        _this.dialogVisible = true;
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
      serchClick() {
        this.loadMedicine(1, this.pageSize);
      },
      currentChange(currentPage) {
        this.currentPage = currentPage;
        this.loading = true;
        this.loadMedicine(currentPage, this.pageSize);
      }
    },
  }
</script>


<!--element ui table的show-overflow-tooltip属性以及设置其宽度-->
<!--https://blog.csdn.net/scy_fighting/article/details/87795216   -->
<style>
  .el-tooltip__popper {
    max-width: 800px;
    line-height: 180%;
  }
</style>
<style scoped>

</style>
