<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right" class="elbreadcrumb">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="dflex">
      <el-card class="w">
        <div class="dflex">
          <div class="icon">
            <i class="el-icon-s-custom size"></i> <span>用户</span>
          </div>

          <span class="text">{{ userNum }}人</span>
        </div>
      </el-card>
      <el-card class="w">
        <div class="dflex">
          <div class="icon">
            <i class="el-icon-money size"></i><span>流水</span>
          </div>
          <span class="text">￥{{ totalMoney }}</span>
        </div>
      </el-card>
    </div>

    <div id="main" style="width: 600px; height: 400px"></div>
  </div>
</template>

<script>
import echarts from "echarts";
export default {
  components: {},
  props: {},
  data() {
    return {
      userNum: 0,
      totalMoney: 0,
    };
  },
  created() {
    this.getUsersNum();
    this.getMoneyNum();
  },
  mounted() {
    // var myChart = echarts.init(document.getElementById("main"));
    // myChart.setOption(options);
  },
  computed: {},
  methods: {
    async getUsersNum() {
      const res = await this.$http.get("users");
      console.log(res);
      this.userNum = res.data.length;
    },
    async getMoneyNum() {
      const res = await this.$http.get("orders");

      let total = res.data.reduce(
        (total, goods) => (total += goods.priceTotal),
        0
      );
      this.totalMoney = total;
      console.log(total);
    },
  },
  watch: {},
};
</script>

<style  scoped lang='less'>
.dflex {
  display: flex;
  justify-content: space-around;
  align-items: center;
}
.w {
  width: 40%;
  height: 150px;
}
.size {
  font-size: 80px;
  color: #409eff;
}
.icon {
  display: flex;
  flex-direction: column;
  text-align: center;
}
.text {
  font-size: 30px;
}
</style>