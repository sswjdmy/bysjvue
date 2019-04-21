<template>
  <el-form ref="form" :rules="rules" :model="form" class="medicine-add-container" label-position="left"
           label-width="80px" v-loading="loading">
    <h3 class="add-title">药品添加</h3>
    <el-form-item label="药品名称" prop="medicineName">
      <el-input v-model="form.medicineName"  max_length="20" style="display: flex;justify-content: flex-start ;"></el-input>
    </el-form-item>
    <el-form-item label="药品类型" prop="selectType">
      <el-select v-model="form.selectType" style="display: flex;justify-content: flex-start ;width: 50%" clearable
                 placeholder="请选择">
        <el-option
          v-for="item in types"
          :key="item.id"
          :label="item.cateName"
          :value="item.id">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="处方药" prop="prescription">
      <el-switch v-model="form.prescription" style="display: flex;justify-content: flex-start; margin-top:10px;"></el-switch>
    </el-form-item>
    <el-form-item label="价格" prop="charge">
      <el-input-number v-model.number="form.charge" :precision="2" :min="0" :max="100000" style="display: flex;justify-content: flex-start ;"></el-input-number>
    </el-form-item>
    <el-form-item label="数量" prop="medicineNumber">

      <el-input-number v-model.number="form.medicineNumber" :min="0" :max="1000" style="display: flex;justify-content: flex-start ;"></el-input-number>
    </el-form-item>
    <el-form-item label="药品描述" prop="medicineDescribe">
      <el-input type="textarea" v-model="form.medicineDescribe" :autosize="{ minRows: 4, maxRows: 10}"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitForm('form')">立即创建</el-button>
      <el-button @click="resetForm('form')">重置</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
  import {getRequest, postRequest} from "@/utils/api";

  export default {
    name: "AddMedicine",
    data() {
      return {
        loading: true,
        types: [],
        rules: {
          medicineName: [
            {required: true, message: '请输入药品名称', trigger: 'blur'},
            {max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur'}
          ],
          selectType: [
            {required: true, message: '请选择药品类型', trigger: 'change'}
          ],
          charge: [
            {required: true, message: '请输入价格', trigger: 'change'},
          ],
          medicineNumber:[
            {required: true, message: '请输入数量', trigger: 'change'},
          ],
          medicineDescribe: [
            {required: true, message: '请输入药品描述', trigger: 'blur'},
          ]
        },
        form: {
          medicineName: '',
          prescription: true,
          selectType: '',
          charge: '',
          medicineNumber:'',
          medicineDescribe: ''
        },
      }
    },
    mounted() {
      this.loadTypes()
    },
    methods: {
      submit(formName) {
        let _this = this
        _this.loading = true;
        console.log(_this.form.prescription)
        postRequest('medicine/add', {
          medicineName: _this.form.medicineName,
          prescription:_this.form.prescription,
          tid:_this.form.selectType,
          charge:_this.form.charge,
          medicineNumber:_this.form.medicineNumber,
          medicineDescribe:_this.form.medicineDescribe
        }).then(resp => {
          this.loading = false
          if (resp.status == 200) {
            let json = resp.data;
            if (json.status == 'success') {
              this.$message({
                message: '添加成功！',
                type: 'success'
              });
              this.resetForm(formName);
            } else {
              this.$message.error('添加失败！'+json.msg);
            }
          }
        }, resp => {
          this.loading = false;
          this.$message.error('添加失败！找不到服务器⊙﹏⊙∥!');
        })
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.submit(formName)
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
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
    },
  }
</script>

<style scoped>
  .medicine-add-container {
    border-radius: 15px;
    background-clip: padding-box;
    margin: 50px auto;
    width: 450px;
    padding: 35px 35px 15px 35px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
  }

  .add-title {
    margin: 0px auto 40px auto;
    text-align: center;
    color: #272b32;
  }
</style>
