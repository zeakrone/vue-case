<template>
  <div>
    <!-- <el-main> -->
    <!-- 查询+添加用户 -->
    <el-row>
      <el-col :span="24">
        <div class="search">
          <!-- 搜索框 -->
          <el-input v-model="input" placeholder="请输入内容" clearable></el-input>
          <el-button type="primary" icon="el-icon-search" @click="searchhandler">搜索</el-button>
          <!-- 添加用户 -->
          <el-button type="success" plain @click="addUserFormVisible = true">添加用户</el-button>
          <el-dialog
            title="添加用户"
            :visible.sync="addUserFormVisible"
            @click="addUserFormVisible = true"
          >
            <el-form :model="addform" :rules="addrules" ref="addUserForm">
              <el-form-item label="用户名" :label-width="formLabelWidth" prop="username">
                <el-input
                  v-model="addform.username"
                  autocomplete="off"
                  size="medium"
                  :clearable="true"
                  placeholder="请输入用户名"
                ></el-input>
              </el-form-item>
              <el-form-item label="密码" :label-width="formLabelWidth" prop="password">
                <!-- <el-input v-model="addform.addpassword" autocomplete="off"></el-input> -->
                <el-input placeholder="请输入密码" v-model="addform.password" show-password></el-input>
              </el-form-item>
              <el-form-item label="邮箱" :label-width="formLabelWidth" prop="email">
                <el-input v-model="addform.email" autocomplete="off" placeholder="请输入邮箱"></el-input>
              </el-form-item>
              <el-form-item label="电话" :label-width="formLabelWidth" prop="mobile">
                <el-input v-model="addform.mobile" autocomplete="off" placeholder="请输入电话"></el-input>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="addUserFormVisible = false">取 消</el-button>
              <el-button type="primary" @click="handleaddUser">确 定</el-button>
            </div>
          </el-dialog>
        </div>
      </el-col>
    </el-row>

    <!-- 表格 -->
    <el-table :data="tableData" v-loading="loading">
      <!-- <el-col :span="24" > -->
      <el-table-column prop="username" label="姓名" width="140"></el-table-column>
      <el-table-column prop="email" label="邮箱" width="150"></el-table-column>
      <el-table-column prop="mobile" label="电话"></el-table-column>
      <el-table-column label="用户状态">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.mg_state"  @change="changeState(scope.row)" active-color="#13ce66" inactive-color="#ff4949" />
          <!-- :active-value="1"
          :inactive-value="2"-->
          <!-- @change="changeSwitch(scope.row)" -->
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <!-- 编辑 -->
          <el-button type="success" @click="showEditbox(scope.row)">编辑</el-button>
          <!-- 编辑对话框 -->
          <el-dialog
            title="修改用户"
            :visible.sync="dialogFormVisible"
            @click="dialogFormVisible = true"
          >
            <el-form :model="form" :rules="rules" ref="EditUserForm">
              <el-form-item label="用户名" :label-width="formLabelWidth" prop="username">
                <el-input
                  v-model="form.username"
                  autocomplete="off"
                  :disabled="true"
                  size="medium"
                  :clearable="true"
                ></el-input>
              </el-form-item>
              <el-form-item label="邮箱" :label-width="formLabelWidth" prop="email">
                <el-input v-model="form.email" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="电话" :label-width="formLabelWidth" prop="phone">
                <el-input v-model="form.phone" autocomplete="off"></el-input>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="dialogFormVisible = false">取 消</el-button>
              <el-button type="primary" @click="handleEditUser">确 定</el-button>
            </div>
          </el-dialog>

          <!-- 删除 -->
          <el-button type="danger" @click="removeclick(scope.row)">删除</el-button>
          <!-- 分配角色 -->
          <!-- <el-button type="primary" icon="el-icon-edit" @click="roleclick(scope.row)"></el-button>  该标签会使弹框失效-->
          <el-button type="primary" plain @click="roleclick(scope.row)">分配角色</el-button>
          <el-dialog title="分配角色" :visible.sync="roleFormVisible" @click="roleFormVisible = true">
            <el-form :model="roleform" :rules="rolerules" ref="roleForm">
              <el-form-item label="当前用户" :label-width="formLabelWidth" prop="username">
                <el-input
                  v-model="roleform.username"
                  autocomplete="off"
                  size="medium"
                  :clearable="true"
                  :readonly="true"
                ></el-input>
              </el-form-item>
              <el-form-item label="请选择角色" :label-width="formLabelWidth" prop="region">
                <el-select v-model="roleform.region" placeholder="请选择角色">
                  <el-option label="主管" value="主管"></el-option>
                  <el-option label="测试角色" value="测试角色"></el-option>
                </el-select>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="roleFormVisible = false">取 消</el-button>
              <el-button type="primary" @click="rolehandler(scope.row)">确 定</el-button>
            </div>
          </el-dialog>
        </template>
      </el-table-column>
      <!-- </el-col> -->
    </el-table>

    <!-- 分页 -->
    <el-pagination
      background
      layout="prev, pager, next"
      :total="totalpage"
      :page-size="pagesize"
      @prev-click="leftBtn"
      @next-click="rightBtn"
      @current-change="currentclick"
      :current-page="pagenum"
    ></el-pagination>
    <!-- </el-main> -->
  </div>
</template>

<script>
const qs = require("qs");
import { isvalidPhone } from "../../config/validate.js";
//定义一个全局的变量，谁用谁知道
var validPhone = (rule, value, callback) => {
  if (!value) {
    callback(new Error("请输入电话号码"));
  } else if (!isvalidPhone(value)) {
    callback(new Error("请输入正确的11位手机号码"));
  } else {
    callback();
  }
};

export default {
  data() {
    return {
      tableData: [],
      pagenum: 1,
      pagesize: 2,
      totalpage: 0,
      // get请求用户列表query参数
      query:"",
      // 搜索框
      input: "",
      //用户状态
      userState:true,
      // 是否显示添加对话框
      addUserFormVisible: false,
      // 编辑用户时请求的用户数据 包含data和meta两个对象
      Edituserdata: [],
      // 添加用户时请求的用户数据 包含data和meta两个对象
      adduserdata: [],
      // 是否加载
      loading: true,
      // 是否显示编辑对话框
      dialogFormVisible: false,
      //是否显示分配角色对话框
      roleFormVisible: false,

      // 编辑对话框
      form: {
        name: "",
        region: "",
        date1: "",
        date2: "",
        delivery: false,
        type: [],
        resource: "",
        desc: "",

        username: "",
        email: "",
        phone: ""
      },
      formLabelWidth: "120px",
      // 编辑对话框验证规则
      rules: {
        email: [
          { required: true, message: "请输入邮箱地址", trigger: "blur" },
          {
            type: "email",
            message: "请输入正确的邮箱地址",
            trigger: ["blur", "change"]
          }
        ],
        phone: [
          { required: true, trigger: "blur", validator: validPhone } //这里需要用到全局变量
        ]
      },

      // 添加用户  这里注意属性名要与后端数据的属性名一致，不然请求会出错,prop与也需要与v-model一致，
      addform: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      addrules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, max: 11, message: "长度在 6 到 11 个字符", trigger: "blur" }
        ],
        email: [
          { required: true, message: "请输入邮箱地址", trigger: "blur" },
          {
            type: "email",
            message: "请输入正确的邮箱地址",
            trigger: ["blur", "change"]
          }
        ],
        mobile: [
          { required: true, trigger: "blur", validator: validPhone } //这里需要用到全局变量
        ]
      },

      // 分配角色
      roleform: {
        username: "",
        region: ""
      },
      rolerules:{
        username: [],
        region: []
      }
    };
  },
  methods: {
    // 搜索
    async searchhandler(){
      //数据加载完毕之前出现加载图标
      this.loading = true;
      if(this.input === ""){
        this.$message.error("请输入查询关键字");
        return;
      }
      this.query = this.input;
      let response = await this.$http.get("/users?pagenum=" + 1 + "&pagesize=" + this.pagesize + "&query=" + this.query);
      console.log(response.data);
      //数据加载完毕之后加载图标消失
      this.loading = false;
      let {data,meta} = response.data;
      if(meta.status === 200) {
        if(data.users.length === 0){
          this.$message.error("查无此人！");
          return;
        }
        this.pagenum = 1;
        this.totalpage = data.total;
        this.tableData = data.users;
      }else{
        this.$message.error("查询失败")
      }
    },
    // 改变用户状态
    async changeState(scopedata){
      // console.log(scopedata)
      if(scopedata.mg_state === false){
        scopedata.mg_state === true;
      }
      if(scopedata.mg_state === true){
        scopedata.mg_state === false;
      }
      // console.log(scopedata.mg_state)
      const response = await this.$http.put(`users/${scopedata.id}/state/${scopedata.mg_state}`);
      // console.log(response.data);
      let {data,meta} = response.data;
      if(meta.status === 200){
        this.$message.success(meta.msg);
      }else{
        this.$message.error(meta.msg);
      }
    },
    // 点击分页左键
    leftBtn() {
      this.pagenum--;
      console.log(this.pagenum);
      this.getdata();
    },
    // 点击分页右键
    rightBtn() {
      this.pagenum++;
      console.log(this.pagenum);
      this.getdata();
    },
    // 点击分页当前页
    currentclick(e) {
      // console.log(e);
      this.pagenum = e;
      this.getdata();
    },
    // 请求获取数据
    getdata() {
      this.loading = false;
      let url = "/users?pagenum=" + this.pagenum + "&pagesize=" + this.pagesize;
      if(this.query){
        url += "&query=" + this.query;
      }
      this.$http
        .get(url)
        .then(response => {
          // console.log(response.data);
          let { data, meta } = response.data;
          if (meta.status === 200) {
            this.tableData = data.users;
            this.totalpage = data.total;
            // console.log(this.totalpage)
          } else {
            this.$message.error(meta.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    // 添加用户
    async handleaddUser() {
      // 表单提交前，先进行表单验证
      this.$refs.addUserForm.validate(async valid => {
        //当验证不通过就不会进行下去
        if (!valid) {
          console.log("aaa");
          return;
        }
        this.addUserFormVisible = false;
        console.log(this.addform);
        var addformstring = qs.stringify(this.addform);
        const data = await this.$http.post("/users", addformstring); //注意这里要获取的是修改完的内容
        console.log(data);
        if (data.data.meta.status === 201) {
          this.$message({
            type: "success",
            message: data.data.meta.msg
          });
          // 重新加载数据
          this.getdata();
        } else {
          this.$message({
            type: "error",
            message: data.data.meta.msg
          });
        }
      });
    },
    // 编辑--修改用户信息之前
    async showEditbox(scope) {
      // console.log(scope)
      this.dialogFormVisible = true;
      const data = await this.$http.get(`users/${scope.id}`);
      console.log(data.data);
      this.Edituserdata = data.data;
      // 把获取到的数据放在编辑框里
      if (this.Edituserdata.meta.status === 200) {
        this.form.username = data.data.data.username;
        this.form.email = data.data.data.email;
        this.form.phone = data.data.data.mobile;
      }
    },
    // 编辑--修改用户信息
    async handleEditUser() {
      // 表单提交前，先进行表单验证
      this.$refs.EditUserForm.validate(async valid => {
        //当验证不通过就不会进行下去
        if (!valid) {
          console.log("bbb");
          return;
        }
        this.dialogFormVisible = false;
        console.log(this.Edituserdata.data);
        const data = await this.$http.put(`/users/${this.Edituserdata.data.id}`, {
          email: this.form.email,
          mobile: this.form.phone
        }); //注意这里要获取的是修改完的内容
        console.log(data);
        if (data.data.meta.status === 200) {
          this.$message({
            type: "success",
            message: data.data.meta.msg
          });
          // 重新加载数据
          this.getdata();
        } else {
          this.$message({
            type: "error",
            message: data.data.meta.msg
          });
        }
      })
    },
    // 删除用户
    removeclick(scope) {
      // console.log(scope);
      this.$confirm("确认要删除该用户么？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          const data = await this.$http.delete(`/users/${scope.id}`);
          console.log(data);
          this.$message({
            type: "success",
            message: data.data
          });
        })
        .catch(() => {
          this.$message({
            type: "error",
            message: "取消删除"
          });
        });
    },
    //分配角色
    roleclick(scopedata) {
      this.roleFormVisible = true;
      console.log(scopedata);
      // 将该条记录数据填入分配角色框
      this.roleform.username = scopedata.username;
      
    },
    // 存储分配角色信息
    async rolehandler(scopedata){
      this.roleFormVisible = false;
      console.log(scopedata);
      const response = await this.$http.put(`/users/${scopedata.id}/role`,{rid:this.roleform.region});
      console.log(response.data);
      let {data,meta} = response.data;
      if(meta.status === 200){
        this.$message.success("分配角色成功！");
      }else{
        this.$message.error("分配角色失败！");
      }
      // 按确定后把表单的内容清空
      this.roleform = {
        username: "",
        region: ""
      };
    }
  },
  mounted() {},
  created() {
    // 请求用户列表数据
    this.getdata();
  }
};
</script>

<style lang="less" scoped>
.search {
  height: 100px;
  margin-bottom: 20px;
  text-align: none;
  .el-input {
    width: 300px;
    height: 0px;
  }
}
.is-plain {
  margin-left: 0;
}
.el-dialog__header {
  height: 100px;
}
.dialog-footer {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>