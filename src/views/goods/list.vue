<template>
  <div>
    <!-- 添加用户 -->
    <el-row>
      <el-col :span="7">
        <el-input placeholder="请输入内容" v-model="search" clearable></el-input>
      </el-col>
      <el-col :span="1">
        <div>
          <el-button slot="append" icon="el-icon-search"></el-button>
        </div>
      </el-col>
      <el-col :span="2" :class="{search:true}">
        <el-button type="success" plain @click="$router.push({path:'add'})">添加商品</el-button>
      </el-col>
    </el-row>
    <!-- 商品列表 -->
    <el-table :data="tableData" style="width: 100%" stripe fit v-loading="loading">
      <el-table-column type="index" label="#" width="50"></el-table-column>
      <el-table-column prop="goods_name" label="商品名称" width="350"></el-table-column>
      <el-table-column prop="goods_price" label="商品价格(元)" width="150"></el-table-column>
      <el-table-column prop="goods_weight" label="商品重量" width="100"></el-table-column>
      <el-table-column label="创建时间" width="150">
        <template slot-scope="scope">{{scope.row.add_time}}</template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <!-- 编辑 -->
          <el-button type="primary" size="mini" icon="el-icon-edit" @click="editHandler(scope.row)"></el-button>
          <!-- 编辑对话框 -->
          <el-dialog title="修改商品信息" :visible.sync="EditdialogFormVisible">
            <el-form :model="Editform" :rules="Editrules">
              <el-form-item label="商品名称" label-width="120" prop="goods_name">
                <el-input v-model="Editform.goods_name" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="商品价格" label-width="120" prop='goods_price'>
                <el-input v-model="Editform.goods_price" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="商品数量" label-width="120" prop='goods_number'>
                <el-input v-model="Editform.goods_number" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="商品重量" label-width="120" prop='goods_weight'>
                <el-input v-model="Editform.goods_weight" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="商品介绍" label-width="120">
                <el-input v-model="Editform.goods_introduce" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="上传图片" label-width="120">
                <el-input v-model="Editform.pics" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="商品参数" label-width="120">
                <el-input v-model="Editform.attrs" autocomplete="off"></el-input>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="EditdialogFormVisible = false">取 消</el-button>
              <el-button type="primary" @click="surEditHandler">确 定</el-button>
            </div>
          </el-dialog>
          <!-- 删除 -->
          <el-button
            type="danger"
            size="mini"
            icon="el-icon-delete"
            @click="deleteHandler(scope.row)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 是否加载
      loading: true,
      // 搜索框
      search: "",
      // 列表数据
      tableData: [],
      // 获取当前第几页
      pagenum: 1,
      // 每页显示条数
      pagesize: 10,
      // 编辑框
      Editform:{
        goods_name:'',
        goods_price:'',
        goods_number:'',
        goods_weight:'',
        goods_introduce:'',
        pics:'',
        attrs:''
      },
      // 编辑表单验证
      Editrules:{
        goods_name:[{ required: true, message: '请输入商品名称', trigger: 'blur' }],
        goods_price:[{ required: true, message: '请输入活动价格', trigger: 'blur' }],
        goods_number:[{ required: true, message: '请输入活动数量', trigger: 'blur' }],
        goods_weight:[{ required: true, message: '请输入活动重量', trigger: 'blur' }],
      },
      // 控制编辑框显示
      EditdialogFormVisible:false
    };
  },
  mounted() {
    this.getgoodsList();
    console.log(this.$router);
  },
  methods: {
    //   获取列表数据
    async getgoodsList() {
      const response = await this.$http.get(
        `/goods?pagenum=${this.pagenum}&pagesize=${this.pagesize}`
      );
      console.log(response.data);
      let { data, meta } = response.data;
      if (meta.status === 200) {
        this.$message.success(meta.msg);
        this.tableData = data.goods;
        this.loading = false;
      } else {
        this.$message.error(meta.msg);
      }
    },
    // 编辑商品信息
    editHandler(scope) {
      console.log(scope);
      this.EditdialogFormVisible = true;

    },
    // 提交编辑信息
    surEditHandler(){
      this.EditdialogFormVisible = false;
    },
    // 删除商品
    deleteHandler(scopedata) {
      console.log(scopedata);
      this.$confirm("是否要删除该商品?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          this.$message({
            type: "success",
            message: "删除成功!"
          });
          const response = await this.$http.delete(
            `/goods/${scopedata.goods_id}`
          );
          console.log(response.data);
          let { data, meta } = response.data;
          if (meta.status === 200) {
            this.$message.success(meta.msg);
            this.getgoodsList();
          } else {
            this.$message.error(meta.msg);
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    }
  }
};
</script>

<style lang="less" scoped>
.search {
  margin-left: 20px;
}
</style>
