<template>
  <el-container class="home-container">
    <el-header>
      <div class="header">
        <img src="../assets/logo.png" alt="" />
        <span> &nbsp; &nbsp;&nbsp; 后台管理系统</span>
      </div>
      <el-button type="info" @click="out">退出</el-button>
    </el-header>
    <el-container>
      <el-aside :width="isMenuColl ? '64px' : '200px'">
        <div class="coll" @click="iscoll">|||</div>
        <el-menu
          background-color="#313743"
          text-color="#ffffff"
          class="el-menu-vertical-demo"
          :collapse="isMenuColl"
          :collapse-transition="false"
          router
          default-active="['1-1']"
        >
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-s-shop"></i>
              <span>商家管理</span>
            </template>
            <el-menu-item index="/storeInfo">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>商家信息</span>
              </template></el-menu-item
            >
          </el-submenu>
          <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-goods"></i>
              <span>商品管理</span>
            </template>
            <el-menu-item index="/goodslist">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>商品列表</span>
              </template></el-menu-item
            >
            <el-menu-item index="/propertylist">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>属性列表</span>
              </template></el-menu-item
            >
            <el-menu-item index="/goodsclassify">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>商品分类</span>
              </template></el-menu-item
            >
          </el-submenu>
          <el-submenu index="3">
            <template slot="title">
              <i class="el-icon-s-order"></i>
              <span>订单管理</span>
            </template>
            <el-menu-item index="/orderlist">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>订单列表</span>
              </template></el-menu-item
            >
          </el-submenu>
          <el-submenu index="4">
            <template slot="title">
              <i class="el-icon-s-comment"></i>
              <span>评价管理</span>
            </template>
            <el-menu-item index="/evaluate">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>评价列表</span>
              </template></el-menu-item
            >
          </el-submenu>
          <el-submenu index="5">
            <template slot="title">
              <i class="el-icon-bank-card"></i>
              <span>优惠券管理</span>
            </template>
            <el-menu-item index="/couponlist">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>优惠券列表</span>
              </template></el-menu-item
            >
          </el-submenu>
          <el-submenu index="6">
            <template slot="title">
              <i class="el-icon-user"></i>
              <span>用户管理</span>
            </template>
            <el-menu-item index="/userlist">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>用户列表</span>
              </template></el-menu-item
            >
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
// unique-opened
export default {
  components: {},
  props: {},
  data() {
    return {
      isMenuColl: false,
      activePath: "",
    };
  },
  created() {
    // this.getMenuList();
    // this.activePath = window.sessionStorage.getItem("activePath");
  },
  computed: {},
  methods: {
    out() {
      window.localStorage.ADMIN_TOKEN = "";
      this.$message.success("退出成功");
      this.$router.replace("/login");
    },
    iscoll() {
      this.isMenuColl = !this.isMenuColl;
    },
    // savePath(activePath) {
    //   window.sessionStorage.setItem("activePath", activePath);
    //   this.activePath = activePath;
    // },
  },
  watch: {},
};
</script>

<style  scoped lang='less'>
.home-container {
  height: 100%;
  .el-header {
    background: #363d3f;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .header {
      height: 100%;
      img {
        height: 100%;
      }
      span {
        color: white;
      }
    }
  }
  .el-aside {
    background: #313743;
    .coll {
      background: #465262;
      color: white;
      text-align: center;
      line-height: 24px;
      cursor: pointer;
      letter-spacing: 0.2em;
    }
    .el-menu {
      border-right: 0;
    }
  }
  .el-main {
    background: #e9edf0;
  }
}
.iconfont {
  padding-right: 5px;
}
</style>