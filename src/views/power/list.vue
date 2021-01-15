<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-table :data="tableData">
      <el-table-column type="index" width="40"></el-table-column>
      <el-table-column prop="authName" label="权限名称" width="180"></el-table-column>
      <el-table-column prop="path" label="路径" width="180"></el-table-column>
      <el-table-column prop="level" width="180" label="层级">
        <template slot-scope="scope">
          <span v-if="scope.row.level === '0'">一级</span>
          <span v-if="scope.row.level === '1'">二级</span>
          <span v-if="scope.row.level === '2'">三级</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: []
    };
  },
  methods: {
    async getdata() {
      const response = await this.$http.get("/rights/list");
      console.log(response.data);
      let { data, meta } = response.data;
      if (meta.status === 200) {
        this.$message.success(meta.msg);
        this.tableData = data;
        // console.log(this.tableData)
      } else {
        this.$message.error(meta.msg);
      }
    }
  },
  mounted() {
    this.getdata();
  }
};
</script>

<style lang="less" scoped>
.nav[data-v-5d52c502] {
  min-width: 100px !important;
  min-height: 100px !important;
  margin-bottom: 10px;
}
</style>