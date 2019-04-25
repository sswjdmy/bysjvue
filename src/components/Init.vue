<template>
  <el-carousel :interval="4000" type="card" height="550px">
    <el-carousel-item >
      <div>
        1  欢迎使用
      </div>
    </el-carousel-item>
    <el-carousel-item >
      <div>
      2   简介
      </div>
    </el-carousel-item>
    <el-carousel-item >
      <div>
      3   操作指南
      </div>
    </el-carousel-item>
    <el-carousel-item >
      <div>
        4  其他
      </div>
    </el-carousel-item>
  </el-carousel>
</template>

<script>
    export default {
        name: "Init"
    }
</script>


<style>
  .el-carousel__item h3 {
    color: #475669;
    font-size: 14px;
    opacity: 0.75;
    line-height: 200px;
    margin: 0;
  }

  .el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
  }

  .el-carousel__item:nth-child(2n+1) {
    background-color: #d3dce6;
  }
</style>
<style scoped>

</style>
