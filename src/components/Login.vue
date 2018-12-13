<template>
  <div class="login">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-position="left" label-width="0px" class="demo-ruleForm login-container">
        <div class="logo">
            <img src="../assets/images/login/wx_img_20171222115118.png" >
        </div>
        <p class="title">用户登录</p>
        <el-form-item prop="account">
        <div class="user-icon"></div> 
        <el-input type="text" v-model="ruleForm.account"  clearable placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item prop="checkPass">
            <div class="pw-icon"></div>
        <el-input type="password" v-model="ruleForm.checkPass"  clearable placeholder="请输入密码" @keyup.enter.native="handleSubmit2"></el-input>
        </el-form-item>
        <el-form-item >
        <el-button class="submit" style="width:100%;" @click.native.prevent="handleSubmit2" :loading="logining">登录</el-button>
        </el-form-item>
    </el-form>
    <i class="line"></i>
    <div class="copyright">
        <p class="copyright-up">本服务由长沙公信诚丰信息技术服务有限公司提供技术支持</p>
        <p class="copyright-down">热线电话：0731-8873 0000</p>
    </div>
 </div>
</template>
<script>
    export default {
        data() {
          return {
            logining: false,
            ruleForm: {
                account: '',
                checkPass: ''
            },
            rules: {
            account: [
                { required: true, message: '请输入账号', trigger: 'blur' },
            ],
            checkPass: [
                { required: true, message: '请输入密码', trigger: 'blur' },
            ]
            },
          }
        },
        methods: {
            handleSubmit2 () {
                this.$refs["ruleForm"].validate((valid) => {
                    if (valid) {
                        let model = this.$refs["ruleForm"].model
                        this.$http.post(""+this.globalData.api+"/ayl_weshopManage/userLogin",{
                            userid:model.account.trim(),//用户名
                            password:model.checkPass //用户密码
                        },{emulateJSON: true}).then(res =>{
                            console.log(res)
                            res = res.body; 
                          if(res.eror_code == 0) {
                                // console.log(res)
                                this.globalMethods.setCookie('userName',res.user.username,0.5);
                                this.globalMethods.setCookie('roleName',res.user.rolename,0.5);
                                this.globalMethods.setCookie('roleId',res.user.userrole,0.5);
                                this.globalMethods.setCookie('userId',res.user.userid,0.5);
                                this.$router.push({ path: '/Backstage'}); 
                            }else {
                                this.$message.error({
                                    message:res.error_message
                                })
                            }  
                        }).catch(res=>{
                            console.log(res);
                        })
                    }
                }
            )}
        }
    }
</script>
<style scoped>
    .login{
        height: 100vh;
        background:url(../assets/images/login/bg.png) no-repeat;
        background-size: cover;
    }
    .login-container {
        -webkit-border-radius: 5px;
        border-radius: 5px;
        -moz-border-radius: 5px;
        background-clip: padding-box;
        position: absolute;
        right: 16%;
        bottom: 18%;
        width: 500px;
        height: 580px;
        background: #fffffd;
        border: 1px solid #E3E3E3;
    }
    .logo {
        text-align: center;
        margin-top: 53px
    }
    .logo img {
        width: 217px;
        height: 186px;
    }
    .el-form-item {
       margin: 0px 0 8% 10%;
       width: 420px;
       height: 40px;
    }
    .pw-icon {
        float: left;
        width: 40px;
        height: 40px;
       background: url(../assets/images/login/passwd.png) no-repeat;
       background-size:100% 100%
    }
    .user-icon{
         float: left;
        width: 40px;
        height: 40px;
       background: url(../assets/images/login/username.png) no-repeat;
       background-size:100% 100%
    }
    .el-input {
        width: 370px;
        float: left;
        height:40px;
    }
    .title {
      margin: 0px auto 5% 10%;
      color: #FD5690;
    }
    .submit{
        background-color: #FD5690;
        color: #fff;
    }
    .line{
        display: block;
        position: absolute;
        bottom: 50px;
        width: 100%;
        height: 1px;
        margin-bottom: 30px;
        background:#E3E3E3
    }
    .copyright {
        width: 30%;
        height: 37px;
        left:35%;
        line-height: 24px;
        position: absolute;
        bottom: 40px;
        text-align: center;
        font-size: 14px;
        color: #FFF9FE;
    }
    .copyright p {
        margin: 10px 0 10px 0 
    }
</style>

