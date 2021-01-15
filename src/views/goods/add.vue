<template>
  <div>
    <!-- 步骤条 -->
    <el-steps :active="active" finish-status="success" align-center>
      <el-step title="基本信息"></el-step>
      <el-step title="商品参数">
        <el-form-item v-for="item in dymanicParams" :key="item.attr_id" :label="item.attr_name">
          <el-checkbox-group v-model="item.attr_vals">
            <el-checkbox v-for="(val, index) in item.attr_vals" border :key="index" :label="val"></el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-step>
      <el-step title="商品属性"></el-step>
      <el-step title="商品图片"></el-step>
      <el-step title="商品内容"></el-step>
    </el-steps>
    <!-- <el-form ref="form" :model="form" label-width="80px"> -->
    <!-- v-model 与 name 绑定 作为显示标签页 -->
    <el-form :model="addruleForm" :rules="addrules" ref="addruleForm" class="demo-ruleForm">
      <el-tabs tab-position="left" v-model="activeName" @tab-click="tabsHandler">
        <el-tab-pane label="基本信息" name="0">
          <el-form-item label="商品名称" prop="goods_name">
            <el-input v-model="addruleForm.goods_name"></el-input>
          </el-form-item>
          <el-form-item label="商品价格" prop="goods_price">
            <el-input v-model="addruleForm.goods_price"></el-input>
          </el-form-item>
          <el-form-item label="商品重量" prop="goods_weight">
            <el-input v-model="addruleForm.goods_weight"></el-input>
          </el-form-item>
          <el-form-item label="商品数量" prop="goods_number">
            <el-input v-model="addruleForm.goods_number"></el-input>
          </el-form-item>
          <el-form-item label="商品分类" prop="goods_cat">
            <!-- value 指定选项的值为选项对象的某个属性值 -->
            <el-cascader
              placeholder="请选择商品分类"
              clearable
              v-model="addruleForm.goods_cat"
              :options="options"
              :props="{ expandTrigger: 'hover',value:'cat_id',label:'cat_name' }"
              @change="sortHandleChange"
              style="width: 250px;"
            ></el-cascader>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品参数" name="1">商品参数</el-tab-pane>
        <el-tab-pane label="商品属性" name="2">商品属性</el-tab-pane>
        <el-tab-pane label="商品图片" name="3">
          <!-- 上传图片 -->
          <el-upload
            class="upload-demo"
            action="http://127.0.0.1:8888/api/private/v1/upload"
            :headers="uploadHeaders"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :before-remove="beforeRemove"
            :on-success="uploadSuccess"
            multiple
            :limit="3"
            :on-exceed="handleExceed"
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-tab-pane>
        <el-tab-pane label="商品内容" name="4">
          <el-button type="primary" @click="addgoods">添加商品</el-button>
          <quillEditor style="height:500px" v-model="addruleForm.goods_introduce"></quillEditor>
        </el-tab-pane>
      </el-tabs>
    </el-form>
    <!-- </el-form> -->
    <div :class="{next:true}">
      <el-button style="margin-top: 12px;" @click="next">下一步</el-button>
    </div>
  </div>
</template>

<script>
const qs = require("qs");

import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
//  引入富文本编辑器
import { quillEditor } from "vue-quill-editor";

export default {
  components: {
    quillEditor
  },
  data() {
    return {
      // 步骤条所在位置，从0开始
      active: 0,
      // 商品分类
      value: [],
      options: [],
      // 高亮标签页
      activeName: "0",
      // 表单信息
      addruleForm: {
        goods_name: "",
        goods_price: "",
        goods_weight: "",
        goods_number: "",
        goods_cat: [],
        // 存放图片列表
        pics: [],
        goods_introduce: ""
      },
      addrules: {
        goods_name: [
          { required: true, message: "请输入商品名称", trigger: "blur" }
        ],
        goods_price: [
          { required: true, message: "请输入商品价格", trigger: "blur" }
        ],
        goods_weight: [
          { required: true, message: "请输入商品重量", trigger: "blur" }
        ],
        goods_number: [
          { required: true, message: "请输入商品数量", trigger: "blur" }
        ],
        goods_cat: [
          { required: true, message: "请输入商品分类", trigger: "blur" }
        ]
      },
      // 配置上传文件请求头
      uploadHeaders: {
        Authorization: localStorage.getItem("token")
      },
      // 动态参数  商品参数
      dymanicParams:[],
      // 静态参数  商品属性
      staticParams: [],
    };
  },
  methods: {
    next() {
      this.$refs.addruleForm.validate(valid => {
        if (!valid) {
          this.$message.error("请输入完整信息！");
          return;
        }
        if (this.active++ > 4) {
          this.active = 0;
        }
        this.activeName = 1 * this.activeName + 1;
        if (this.activeName > 4) {
          this.activeName = "0";
        }
        this.activeName = "" + this.activeName;
      });
    },
    sortHandleChange() {},
    async getGoodsSort() {
      // type = 3表示显示三级分类
      const response = await this.$http.get(`/categories?type=3`);
      console.log(response.data);
      let { data, meta } = response.data;
      if (meta.status === 200) {
        this.$message.success(meta.msg);
        this.options = data;
      } else {
        this.$message.error(meta.msg);
      }
    },
    // 当上传文件超过上限触发
    // files 本次选择的文件 pics 一共上传的文件数组
    handleExceed(files, pics) {
      console.log(files, pics);
      this.$message.warning(
        `当前限制选择 3 个文件，本次选择了 ${
          files.length
        } 个文件，共选择了 ${files.length + pics.length} 个文件`
      );
    },
    // 移除文件时触发
    handleRemove(file, pics) {
      console.log(file, pics);
      const index = this.addruleForm.pics.findIndex(item => {
        return file.response.data.tmp_path == item.pics;
      });
      this.addruleForm.pics.splice(index, 1);
    },
    // 点击文件时触发
    handlePreview(file) {
      console.log(file, "111");
    },
    // 移除文件前触发
    beforeRemove(file, pics) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    // 上传成功后触发
    uploadSuccess(response) {
      console.log(response);
      if (response.meta.status === 200) {
        this.$message.success("图片上传成功！");
        const img = { pics: response.data.tmp_path };
        this.addruleForm.pics.push(img);
      } else {
        this.$message.error("图片上传失败！");
      }
    },
    // 添加商品
    async addgoods() {
      this.$refs.addruleForm.validate(async valid => {
        if (!valid) {
          this.$message.error("请输入完整信息！");
          return;
        }
        console.log(this.addruleForm);
        const newobj = { ...this.addruleForm };
        newobj.goods_cat = newobj.goods_cat.join(",");
        // console.log(newobj)
        let addruleFormString = qs.stringify(newobj);
        console.log(addruleFormString);
        const response = await this.$http.post(`/goods`, addruleFormString);
        console.log(response.data);
        let { data, meta } = response.data;
        if (meta.status === 201) {
          this.$message.success("添加商品成功！");
          this.$router.push("list");
        } else {
          this.$message.error("添加商品失败！");
        }
      });
    },
    // 点击商品参数/商品属性获取对应参数
    async tabsHandler() {
      if (this.activeName === "1" || this.activeName === "2") {
        // console.log(this.addruleForm.goods_cat)
        if (this.addruleForm.goods_cat.length !== 3) {
          this.$message.error("请填写商品分类！");
          return;
        }
        console.log(this.addruleForm.goods_cat[2])
        const response = await this.$http.get(`/categories/${this.addruleForm.goods_cat[2]}/attributes`,{
          params:{
            sel: this.activeName === '1' ? 'many' : 'only'
          }
        });
        console.log(response.data,'参数');
      }
    }
  },
  created() {
    this.getGoodsSort();
  }
};
</script>

<style lang="less" scoped>
.next {
  display: flex;
  justify-content: center;
  align-items: center;
}
.el-cascader {
  display: block;
}
.upload-demo {
  height: 200px;
}
.el-tabs {
  margin-top: 20px;
}
</style>