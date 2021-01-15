<template>
  <div>
    <!-- 添加角色按钮 -->
      <el-row :class="{addbtn:true}">
        <el-col :span="2">
          <!-- 添加角色 -->
          <el-button @click="addFormVisible = true;">添加角色</el-button>
          <el-dialog title="添加角色" :visible.sync="addFormVisible">
            <el-form :model="addform" :rules="addrules" ref="addform">
              <el-form-item label="角色名称" :label-width="formLabelWidth" prop="roleName">
                <el-input v-model="addform.roleName" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="角色描述" :label-width="formLabelWidth" prop="roleDesc">
                <el-input v-model="addform.roleDesc" autocomplete="off"></el-input>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="addFormVisible = false">取 消</el-button>
              <!-- 在template的孙子好像不能使用scope.row了 -->
              <el-button type="primary" @click="addrole">确 定</el-button>
            </div>
          </el-dialog>
        </el-col>
      </el-row>
    <!-- 角色列表 -->
    <el-table :data="tableData" style="width: 100%" :class="{level1:true}" v-loading="loading">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <!-- 第一级 -->
            <el-row class="level1-row" v-for="level1 in props.row.children" :key="level1.id">
              <el-col :span="4">
                <el-tag :closable='true' type @close="level1close(props.row,level1)">{{level1.authName}}</el-tag>
                <i class="el-icon-arrow-right"></i>
              </el-col>
              <!-- 第二级 -->
              <el-col :span="20" class="level2">
                <el-row class="level2-row" v-for="level2 in level1.children" :key="level2.id">
                  <el-col :span="5" :class="{level2_col:true}">
                    <el-tag closable type="success" @close="level1close(props.row,level2)">{{level2.authName}}</el-tag>
                    <i class="el-icon-arrow-right"></i>
                  </el-col>
                  <el-col :span="19" :class="{level3_col:true}">
                    <el-tag
                      closable
                      @close="level1close(props.row,level3)"
                      type="warning"
                      v-for="level3 in level2.children"
                      :key="level3.id"
                    >{{level3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </el-form>
        </template>
      </el-table-column>
      <!-- prop的值要与请求的数据的属性名相对应 其实就是与tableData里的属性名相对应 -->
      <el-table-column label="角色ID" prop="id"></el-table-column>
      <el-table-column label="角色名称" prop="roleName"></el-table-column>
      <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <!-- 编辑角色 -->
          <el-button type="primary" plain icon="el-icon-edit" @click="edithandler(scope.row)"></el-button>
          <el-dialog title="编辑角色" :visible.sync="editFormVisible">
            <el-form :model="editform" :rules="editrules" ref="Editform">
              <el-form-item label="角色名称" :label-width="formLabelWidth" prop="roleName">
                <el-input v-model="editform.roleName" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="角色描述" :label-width="formLabelWidth" prop="roleDesc">
                <el-input v-model="editform.roleDesc" autocomplete="off"></el-input>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="editFormVisible = false">取 消</el-button>
              <!-- 在template的孙子好像不能使用scope.row了 -->
              <el-button type="primary" @click="sureEditrole">确 定</el-button>
            </div>
          </el-dialog>

          <!-- 分配权限 -->
          <!-- default-expand-all 展开所有节点;default-checked-keys 默认选中的节点 show-checkbox 节点是否可被选择 
          node-key 每个树节点用来作为唯一标识的属性，整棵树应该是唯一的； props 配置选项-->
          <el-button type="warning" plain icon="el-icon-check" @click="righthandler(scope.row)"></el-button>
          <el-dialog title="权限分配" :visible.sync="rightVisible">
            <el-tree
              :data="rightsData"
              ref="tree"
              default-expand-all
              :default-checked-keys="checkedKeys"
              show-checkbox
              node-key="id"
              :props="defaultProps"
            ></el-tree>
            <span slot="footer" class="dialog-footer">
              <el-button @click="rightVisible = false">取 消</el-button>
              <el-button type="primary" @click="sureRightsHandler">确 定</el-button>
            </span>
          </el-dialog>

          <!-- 删除角色 -->
          <el-button type="danger" plain icon="el-icon-delete" @click="deletehandler(scope.row)"></el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
        

<script>
const qs = require("qs");
export default { 
  data() {
    return {
      // 是否显示加载
      loading:true,
      //   角色列表数据
      tableData: [],
      //是否显示编辑角色框
      editFormVisible: false,
      // 编辑框数据
      editform: {
        roleId: "",
        roleName: "",
        roleDesc: ""
      },
      formLabelWidth: "120px",
      // 编辑框验证规则
      editrules: {
        roleName: [
          { required: true, message: "请输入角色名", trigger: "blur" }
        ],
        roleDesc: [
          { required: true, message: "请输入描述信息", trigger: "blur" }
        ]
      },
      //是否显示添加角色框
      addFormVisible: false,
      // 添加角色框数据
      addform: {
        roleName: "",
        roleDesc: ""
      },
      formLabelWidth: "120px",
      // 编辑框验证规则
      addrules: {
        roleName: [
          { required: true, message: "请输入角色名", trigger: "blur" }
        ],
        roleDesc: [
          { required: true, message: "请输入描述信息", trigger: "blur" }
        ]
      },
      // 权限分配数据
      rightsData: [],
      // 默认选中的节点
      checkedKeys: [],
      // 是否显示分配权限框
      rightVisible: false,
      // 点击授权的时候记录下来当前的角色
      currentRole: {},
      // 设置权限分配对话框配置项
      defaultProps: {
        // 指定子树为节点对象的某个属性值
        children: "children",
        // 指定节点显示内容为节点对象的某个属性值
        label: "authName"
      }
    };
  },
  methods: {
    // 获取角色列表数据
    async getroledata() {
      // await this.$http
      //   .get("/roles")
      //   .then(response => {
      //     // console.log(response.data);
      //     let { data, meta } = response.data;
      //     if (meta.status === 200) {
      //       this.$message.success("列表获取成功");
      //       this.tableData = data;
      //     }
      //   })
      //   .catch(error => {
      //     this.$message.error(error);
      //   });
      const response = await this.$http.get("/roles");
      console.log(response.data);
      let { data, meta } = response.data;
      if (meta.status === 200) {
        this.$message.success("列表获取成功");
        this.tableData = data;
        this.loading = false;
      } else {
        this.$message.error(meta.msg);
      }
    },
    // 编辑角色
    edithandler(scopedata) {
      console.log(scopedata);
      this.editFormVisible = true;
      this.editform.roleId = scopedata.id;
      this.editform.roleName = scopedata.roleName;
      this.editform.roleDesc = scopedata.roleDesc;
      // const response
    },
    //编辑框确定按钮
    async sureEditrole() {
      this.$refs.Editform.validate(async valid => {
        if (!valid) {
          this.$message.error("请填写正确的信息");
          return;
        }
        console.log(this.editform);
        const response = await this.$http.put(
          `/roles/${this.editform.roleId}`,
          this.editform
        );
        console.log(response.data);
        let { data, meta } = response.data;
        if (meta.status === 200) {
          this.tableData.roleDesc = data.roleDesc;
          this.tableData.roleName = data.roleName;
          this.getroledata();
          this.$message.success(meta.msg);
        } else {
          this.$message.error(meta.msg);
        }
        this.editFormVisible = false;
      });
    },
    // 删除角色按钮
    async deletehandler(scopedata) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          // console.log(scopedata)
          const response = await this.$http.delete(`/roles/${scopedata.id}`);
          console.log(response.data);
          this.getroledata();
          this.$message({
            type: "success",
            message: "删除成功!"
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    // 分配权限对话框
    async righthandler(scopedata) {
      console.log(scopedata);
      this.rightVisible = true;
      const response = await this.$http.get("rights/tree");
      // console.log(response.data)
      let { data, meta } = response.data;
      if (meta.status === 200) {
        this.rightsData = data;
        // console.log(this.rightsData)
        this.currentRole = scopedata;
        // 获得目前角色得到的权限id
        function getrightsId(rightslist) {
          const arr = [];
          var fn = function(list) {
            list.forEach(function(value) {
              //如果这一层没有children，说明是最后一层
              if (!value.children) {
                arr.push(value.id);
              } else {
                fn(value.children);
              }
            });
          };
          fn(rightslist);
          return arr;
        }
        // 默认选择的权限
        this.checkedKeys = getrightsId(scopedata.children);
        console.log(scopedata.children);
      } else {
        this.$message.error(meta.msg);
      }
    },
    // 分配权限确定按钮
    async sureRightsHandler() {
      //获取该角色所有权限信息
      const nodes = this.$refs.tree.getCheckedNodes();
      // console.log(nodes);
      let arr = [];
      // 获得所有权限的id
      nodes.forEach(value => {
        arr.push(value.id.toString());
        if (typeof value.pid === "number") {
          arr.push(value.pid.toString());
        } else {
          arr = arr.concat(value.pid.split(","));
        }
      });
      // console.log(arr);
      // 数组去重
      const newarr = new Set(arr);
      // 这里注意 set的数组注意和普通数组不一样
      // console.log([...newarr]);
      const ids = [...newarr].join(",");
      // console.log(ids);
      let obj = { rids:ids };
      // console.log(obj)
      let idsString = qs.stringify(obj);
      const response = await this.$http.post(
        `/roles/${this.currentRole.id}/rights`,
        idsString
      );
      console.log(response.data);
      let { data, meta } = response.data;
      if (meta.status === 200) {
        this.$message.success(meta.msg);
        this.getroledata();
        console.log(this.tableData);
        this.rightVisible = false;
      } else {
        this.$message.error(meta.msg);
      }
    },
    // 添加角色
    async addrole() {
      this.$refs.addform.validate(async (valid) => {
        if(!valid){
          return;
        }
        console.log(this.addform);
        let addformString = qs.stringify(this.addform);
        console.log(addformString)
        // 注意请求头用了"Content-Type":"application/x-www-form-urlencoded" 一定要用key=value&key1=value1;的形式！！！！
        const response = await this.$http.post('/roles',addformString);
        console.log(response.data);
        let {data,meta} = response.data;
        if(meta.status === 201){
          this.$message.success(meta.msg);
          this.addFormVisible = false;
          this.getroledata();
        }else{
          this.$message.error(meta.msg);
        }
        
      })
    },

    // 关闭第一级标签
    async level1close(scopedata,level) {
      console.log(scopedata,level);
      const response = await this.$http.delete(`/roles/${scopedata.id}/rights/${level.id}`);
      console.log(response.data);
      let {data,meta} = response.data;
      if(meta.status === 200){
        this.$message.success(meta.msg);
        // this.getroledata();  // 这里不用这个是因为数据重新渲染后会关闭展开内容
        scopedata.children = data;
        console.log(level.children);
        console.log(this.tableData);
      }else{
        this.$message.error(meta.msg);
      }
    },
  },
  mounted() {
    this.getroledata();
  }
};
</script>

<style lang="less" scoped>
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
//添加角色按钮样式
.addbtn {
  height: 50px;
  .el-col {
    max-height: 50px;
    display: flex;
  }
}

.level2 {
  height: 160px;
}
.level2-row {
  display: flex;
}
.level2_col {
  display: flex;
  justify-content: center;
  align-items: center;
}
.level3_col {
  display: flex;
  flex-wrap: wrap;
}
</style>