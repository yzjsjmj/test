<template>
    <div class="integralRule">
        <div class="pulic-header">
            <i  class="fontFamily icon-ayl-shouye icon-shouye"></i>
            <el-breadcrumb separator-class="el-icon-arrow-right" class="">
                <el-breadcrumb-item :to="{ path: '/Backstage' }" >首页</el-breadcrumb-item>
                <el-breadcrumb-item>电话设置</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="public-box" >
            <div class="public-box-wrap">
                <el-form  :model="formData" label-width="120px" ref="formData" 
                         class="demo-form"   label-position="left"   >
                        <el-form-item label="客服电话：" prop="phone"
                         :rules="[
                           { required: true, message: '请设置客服电话', trigger: 'blur' },
                         ]"
                        >
                        <el-input class="same-padding" v-model.number="formData.phone"     clearable></el-input>
                    </el-form-item>
                </el-form>
                <div class="footer-btn-operate " v-if="isSubmitBtn">
                    <el-button type="primary"   @click="submitForm('formData')">保 存</el-button>
                </div>
            </div>    
        </div>
    </div>
</template>
<script>
    export default{
        data(){
            return{
                oper_person:'',//用户id
                isSubmitBtn:true,  //是否显示提交按钮
                formData:{ 
                    phone:'', 
                },        
            }
        },
        created(){
            //权限判断
            var  roleId  = this.globalMethods.getCookie('roleId');
            this.oper_person  = this.globalMethods.getCookie('userId');
            //验证cookie是否失效，验证用户是否存在，最后权限判断
            if( roleId ){
                //获取管理员列表
                this.__getAdminList();
            }else{
                this.$router.push({name:'Login'});
                this.$message({
                    type:'warning',
                    message:'用户已失效,请重新登录'
                })
            } 
        },
        methods: {
            //用户是否存在
            isUserExist(userList){
                if(userList &&  userList.length!=0){
                    var isUserArr = [],
                        userId  = this.globalMethods.getCookie('userId'),
                        roleId  = this.globalMethods.getCookie('roleId');
                    userList.forEach((v)=>{
                        if(v.userid == userId){
                            isUserArr.push({userid:v.userid});
                        }
                    })
                    //用户不存在返回首页，存在继续验证是否有权限，首页除外
                    if(isUserArr.length==0){
                        this.$message({
                            type:'warning',
                            message:'用户已被管理员移除,请联系管理员'
                        })
                        this.$router.push({name:'Login'}); 
                    }else{
                        this.isAuthority(roleId);
                    }
                }
            },
            //获取管理员列表
            __getAdminList(currentPage,pageSize){
                this.$http.post(""+this.globalData.api+"/ayl_weshopManage/getUserList",{
                    currentPage:1, //当前页码从1开始
                    pageSize:20     //当前页面显示条数
                },{emulateJSON: true}).then(res=>{
                    console.log(res)
                    res = res.body
                    if (res.error_code == 0) {
                        //判断用户是否存在
                        this.isUserExist(res.userList);
                    } else {
                        console.log('查无数据')
                    }
                }) 
            },
            //权限判断
            isAuthority(role_id){
                this.$http.post(
                    ""+this.globalData.api+"/ayl_weshopManage/checkUserAuthority",
                    // "http://172.16.1.39:8080/ayl_weshopManage/checkUserAuthority",
                    {
                        role_id:role_id,
                        priv_id:'11',
                    },{emulateJSON:true})
                    .then( (res) => {  
                        console.log(res)
                        // 处理成功的结果 
                        var res =   res.body;
                        if(res.error_code==0){
                            
                        }else{
                            this.$message({
                            type:'warning',
                                message:res.error_message+''
                            })
                            this.$router.go(-1);
                        }   
                    }).catch(function(res) {  
                        //捕捉异常                 
                        console.log(res);
                    }
                );
            },
            //事件-提交表单
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        console.log('submit!');
                        this.editRequestSubmit();
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            //编辑提交数据
            editRequestSubmit(){
                this.isSubmitBtn = false;
                this.$http.post(
                    ""+this.globalData.api+"/ayl_weshopManage/updServiceTel",
                    // "http://172.16.1.39:8080/ayl_weshopManage/updServiceTel",
                    {   
                       service_tel:this.formData.phone,           //客服电话
                       oper_person:this.oper_person,            //用户id
                    },{emulateJSON:true})
                    .then( (res) => {  
                        console.log(res)
                        // 处理成功的结果 
                        var res =   res.body;
                        if(res.error_code==0){
                            this.isSubmitBtn = true;
                            this.$message({
                                type:'success',
                                message:'更新成功'
                            })
                            
                        }else{
                            this.$message({
                                type:'error',
                                message:'更新失败'
                            })
                            console.log('查无数据')
                        }   
                    }).catch(function(res) {  
                        //捕捉异常                 
                        console.log(res);         
                    }
                );
            },
        }
    }
</script>
<style scoped>
    .footer-btn-operate {
        text-align: center;
        margin-top: 50px;
    }
    .el-input{
        width:300px;
    }
   .same-padding{
        padding-right:  10px;
    }
</style>

