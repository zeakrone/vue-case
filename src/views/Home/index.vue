<template>
  <div class="home">
    <el-container>
      <el-header>
        <el-col :span="3" class="backname">后台管理系统</el-col>
        <el-col :span="2" :offset="19">
          <el-button type="primary" plain @click="exit">退出</el-button>
        </el-col>
      </el-header>
      <el-container>
        <el-aside width="200px">
          <!-- 导航菜单 -->
          <el-col :span="24" class="menu">
            <el-menu
              default-active="1"
              class="el-menu-vertical-demo"
              background-color="#545c64"
              text-color="#fff"
              active-text-color="#ffd04b"
              :router="true"
            >
              <!-- 用户管理 -->
              <el-submenu index="1">
                <template slot="title">
                  <i class="el-icon-location"></i>
                  <span>用户管理</span>
                </template>
                <el-menu-item-group>
                  <!-- 路由跳转只有el-menu-item标签才行 -->
                  <el-menu-item index="/user/list">用户列表</el-menu-item>
                </el-menu-item-group>
              </el-submenu>

              <!-- 权限管理 -->
              <el-submenu index="2">
                <template slot="title">
                  <i class="el-icon-location"></i>
                  <span>权限管理</span>
                </template>
                <el-menu-item-group>
                  <!-- 路由跳转只有el-menu-item标签才行 -->
                  <el-menu-item index="/power/role">角色列表</el-menu-item>
                  <el-menu-item index="/power/list">权限列表</el-menu-item>
                </el-menu-item-group>
              </el-submenu>

              <!-- 商品管理 -->
              <el-submenu index="3">
                <template slot="title">
                  <i class="el-icon-location"></i>
                  <span>商品管理</span>
                </template>
                <el-menu-item-group>
                  <!-- 路由跳转只有el-menu-item标签才行 -->
                  <el-menu-item index="/goods/list">商品列表</el-menu-item>
                  <el-menu-item index="/goods/params">分类参数</el-menu-item>
                  <el-menu-item index="/goods/sort">商品分类</el-menu-item>
                  <!-- 如果路由映射表不把路由写到children，就不会在当前路由容器里显示，会忘上一级找路由容器并覆盖原来的内容 -->
                  <!-- <el-menu-item index="/goods/sort1">商品分类1</el-menu-item> -->
                </el-menu-item-group>
              </el-submenu>

              <!-- 商品管理 -->
              <el-submenu index="4">
                <template slot="title">
                  <i class="el-icon-location"></i>
                  <span>订单管理</span>
                </template>
                <el-menu-item-group>
                  <!-- 路由跳转只有el-menu-item标签才行 -->
                  <el-menu-item index="/order/list">订单列表</el-menu-item>
                </el-menu-item-group>
              </el-submenu>

              <!-- 商品管理 -->
              <el-submenu index="5">
                <template slot="title">
                  <i class="el-icon-location"></i>
                  <span>数据统计</span>
                </template>
                <el-menu-item-group>
                  <!-- 路由跳转只有el-menu-item标签才行 -->
                  <el-menu-item index="/data/list">数据报表</el-menu-item>
                </el-menu-item-group>
              </el-submenu>
            </el-menu>
          </el-col>
        </el-aside>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  methods: {
    exit() {
      console.log("exit");
      localStorage.removeItem("token");
      this.$router.push("/login");
    }
  }
};
</script>

<style lang="less" scoped>
.home,
.el-container {
  width: 100%;
  height: 100%;
}

.el-header,
.el-footer {
  background-color: #b3c0d1;
  color: #333;
  text-align: center;
  line-height: 60px;
  .backname {
    color: #fff;
    font-size: 20px;
    font-weight: 700;
  }
}

.el-aside {
  background-color: #d3dce6;
  color: #333;
  text-align: center;
  line-height: 200px;
  height: 100%;
}

.el-main {
  background-color: #e9eef3;
  color: #333;
  text-align: center;
  line-height: 160px;
}

body > .el-container {
  margin-bottom: 40px;
}

.el-container:nth-child(5) .el-aside,
.el-container:nth-child(6) .el-aside {
  line-height: 260px;
}

.el-container:nth-child(7) .el-aside {
  line-height: 320px;
}

// 导航菜单
.menu {
  height: 100%;
}
ul {
  height: 100%;
}

.el-main{
  line-height: 0px !important;
  text-align: left;
}
</style>