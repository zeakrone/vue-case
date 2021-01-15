<template>
  <div class=" wrapper">
    <el-form
      :model="ruleForm"
      status-icon
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm loginform"
    >
      <el-form-item label="用户名" prop="username">
        <el-input type="text" v-model="ruleForm.username" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input type="password" v-model="ruleForm.password" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item class="el-btn">
        <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import {checklogin} from '../../api/login.js'
export default {
    data() {
      return {
        ruleForm: {
          username: '',
          password: '',
        },
        rules: {
          username: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
            { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
          ],
          password:[
            { required: true, message: '请输入密码', trigger: 'blur' },
          ]
        }
      };
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            checklogin(this.ruleForm).then(response => {
              console.log(response.data);
              let {data,meta} = response.data;
              if(meta.status === 200){
                this.$message({message: '恭喜你，登录成功！',type: 'success'});
                localStorage.setItem("token",data.token);
                this.$router.push("/home");
              }else{
                this.$message.error(meta.msg);
              }
            }).catch(error => {
              console.log(error);
            })
            
          } else {
            this.$message.error('请填写完整的信息');
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    }
  };
</script>

<style lang="less" scoped>
    .wrapper{
      height: 100%; 
      display: flex;
      justify-content: center;
      align-items: center; 
      background-color: #324152; 
      .loginform{
          width: 500px;
          height: 300px;
          background-color: rgb(214, 206, 88);
          padding: 50px;
          border-radius: 5px;
          .el-btn{
            display: flex;
            justify-content: center;
            align-items: center;
          }
      }
    }
</style>