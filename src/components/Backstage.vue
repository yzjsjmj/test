<template>
    <div >	
        <div class="home-header clearFloat" >
            <div class="home-header-left">
                <img class="img-logo" src="../assets/images/aiyilai_logo.png">
                <span class="span-title">长沙艾依莱小程序商城管理后台</span>
            </div>
            <div class="home-header-right">
                <span class="user-login-word">{{userName}},欢迎您登陆!</span>
                <span class="modify-password" @click="modifyPassword('modifyPasswordForm')"><i class="fontFamily icon-ayl-xiugaimima"></i>修改密码</span>
                <!-- <span class="message-tip"><el-badge is-dot class="item"><span class="padding-right-10">消息提醒</span><i class="el-icon-message"></i></el-badge></span> -->
                <span class="exit" @click="exit" ><i class="fontFamily icon-ayl-fankui icon-ayl-xiugaimima"></i>退出</span>
            </div>
        </div>
        <div class="home-body">
            <div class="menu-aside" >
                <div class="userInfo-wrap">
                    <img class="img-userDefault" src="../assets/images/defaultHead.png" >
                    <div class="userInfo-wrap-right">
                        <span class="user-position">姓名：{{userName}}</span>
                        <span class="user-position">角色：{{roleName}}</span>
                    </div>
                </div>
                <el-menu class="menu" >
                    <router-link :to="{path:'/home'}" tag="div" class="link-home fontFamily icon-ayl-shouye" ><span class="same-size-padding">首页</span></router-link>
                    <el-collapse  accordion>
                        <el-collapse-item  title="商品管理" name="1">
                            <template slot="title"><i class="fontFamily icon-ayl-shangpinguanli "></i><span class="same-size-padding">商品管理</span></template>
                            <router-link :to="{path:'/GoodsType'}" tag="div" >
                                <el-menu-item index="1-1">商品分类</el-menu-item>
                            </router-link>
                            <router-link :to="{path:'/GoodsList'}" tag="div" >
                                <el-menu-item index="1-2">商品列表</el-menu-item>
                            </router-link>
                            <router-link :to="{path:'/GoodsAttr'}" tag="div" >
                                <el-menu-item index="1-3">商品属性</el-menu-item>
                            </router-link>
                            <router-link :to="{path:'/GoodsStock'}" tag="div" >
                                <el-menu-item index="1-4">商品库存</el-menu-item>
                            </router-link>
                        </el-collapse-item>
                        <el-collapse-item title="会员管理" name="2">
                            <template slot="title"><i class="fontFamily icon-ayl-huiyuanguanli"></i><span class="same-size-padding">会员管理</span></template>
                            <router-link :to="{path:'/MemberList'}" tag="div" >
                                <el-menu-item index="2-1">会员列表</el-menu-item>
                            </router-link>
                            <router-link :to="{path:'/MemberLevel'}" tag="div" >
                                <el-menu-item index="2-2">会员等级</el-menu-item>
                            </router-link>
                        </el-collapse-item>
                        <el-collapse-item title="订单管理" name="3">
                            <template slot="title"><i class="fontFamily icon-ayl-dingdanguanli"></i><span class="same-size-padding">订单管理</span></template>
                            <router-link :to="{path:'/OrderList'}" tag="div" >
                                <el-menu-item index="3-1">订单列表</el-menu-item>
                            </router-link>
                        </el-collapse-item>
                        <el-collapse-item title="统计管理" name="4">
                            <template slot="title"><i class="fontFamily icon-ayl-tongjiguanli1"></i><span class="same-size-padding">统计管理</span></template>
                            <router-link :to="{path:'/SalesReport'}" tag="div" >
                                <el-menu-item index="4-1">销售报表</el-menu-item>
                            </router-link>
                            <router-link :to="{path:'/IncomeDetails'}" tag="div" >
                                <el-menu-item index="4-2">收入明细</el-menu-item>
                            </router-link>
                        </el-collapse-item>
                        <el-collapse-item title="基础设施" name="5">
                            <template slot="title"><i class="fontFamily icon-ayl-ruiyanshicai07"></i><span class="same-size-padding">基础设置</span></template>
                            <router-link :to="{path:'/FreightSetting'}" tag="div" >
                                <el-menu-item index="5-1">运费设置</el-menu-item>
                            </router-link>
                            <router-link :to="{path:'/PhoneSetting'}" tag="div" >
                                <el-menu-item index="5-2">电话设置</el-menu-item>
                            </router-link>
                        </el-collapse-item>
                        <el-collapse-item title="营销" name="6">
                            <template slot="title" ><i class="fontFamily icon-ayl-yingxiao1"></i><span class="same-size-padding">营销</span></template>
                            <router-link :to="{path:'/GoodsPromotion'}" tag="div" >
                                <el-menu-item index="6-1">商品促销</el-menu-item>
                            </router-link>
                        </el-collapse-item>
                        <el-collapse-item title="营销" name="7">
                            <template slot="title"><i class="fontFamily icon-ayl-richangshiwu"></i><span class="same-size-padding">系统管理</span></template>
                            <router-link :to="{path:'/AdminList'}" tag="div" >
                                <el-menu-item index="7-1">管理员列表</el-menu-item>
                            </router-link>
                            <router-link :to="{path:'/RoleList'}" tag="div" >
                                <el-menu-item index="7-2">角色列表</el-menu-item>
                            </router-link>
                            <router-link :to="{path:'/OperationLog'}" tag="div" >
                                <el-menu-item index="7-3">操作日志</el-menu-item>
                            </router-link>
                        </el-collapse-item>
                    </el-collapse>
                </el-menu>
            </div>
            <div class="home-body-right" >
                <router-view></router-view>	
            </div>
        </div>
        <!-- 对话框 -->
        <el-dialog
            title="提示"
            :visible.sync="exitDialogVisible"
            width="30%"
            :before-close="handleClose">
            <span>确认退出后台管理系统?</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="exitDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="confirmExit">确 定</el-button>
            </span>
        </el-dialog>
         <el-dialog
            title="修改密码"
            :visible.sync="modifyPasswordDialog"
            width="30%"
            :before-close="handleClose">
            <el-form :model="modifyPasswordForm"
                label-position="left"
                ref="modifyPasswordForm"
                :rules="rules"
            >
                <el-form-item label="原密码" prop="oldPassword" :label-width="formLabelWidth">
                    <el-input type="password" v-model="modifyPasswordForm.oldPassword" auto-complete="off" clearable></el-input>
                </el-form-item>
                <el-form-item label="新密码" prop="newPassword" :label-width="formLabelWidth" required>
                    <el-input type="password" v-model="modifyPasswordForm.newPassword" auto-complete="off" clearable></el-input>
                </el-form-item>
                <el-form-item label="确认密码"  prop="comfirmPassword" :label-width="formLabelWidth" required>
                    <el-input type="password" v-model="modifyPasswordForm.comfirmPassword" auto-complete="off"  clearable @keyup.enter.native="modifyPasswordSubmit('modifyPasswordForm')"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="modifyPasswordCancel('modifyPasswordForm')">取 消</el-button>
                <el-button type="primary" @click="modifyPasswordSubmit('modifyPasswordForm')">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { Message } from 'element-ui'
export default {
    name: 'app',
    data() {
        var validateNewPass = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入新密码'));
            } else {
                if (this.modifyPasswordForm.comfirmPassword !== '') {
                    this.$refs.modifyPasswordForm.validateField('comfirmPassword');
                }
                callback();
            }
       };
        var validateComfirmPass = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请再次输入密码'));
            } else if (value !== this.modifyPasswordForm.newPassword) {
                callback(new Error('两次输入密码不一致!'));
            } else {
                callback();
            }
        };
        return {
            loading:true,
            userName:'',  //姓名
            roleName:'',  //角色名
            userId:'',
            roleId:-1,  //角色id
            exitDialogVisible:false,             //退出对话框
            modifyPasswordDialog:false,           //修改密码对话框
            modifyPasswordForm: {
                oldPassword: '',          //原密码
                newPassword: '',          //新密码
                comfirmPassword:''        //确认密码
                
            },
            rules: {
                oldPassword:[
                    { required:true, message:'请输入原密码',trigger:'blur'},
                ],
                newPassword:[
                    { validator: validateNewPass, trigger: 'blur' }
                ],
                comfirmPassword:[
                    { validator: validateComfirmPass, trigger: 'blur' }
                ]
            },
            formLabelWidth: '120px',
        }
    },
    created(){
        // //设置cookie
        // this.userName  = this.globalMethods.getCookie('userName');
        // this.roleName  = this.globalMethods.getCookie('roleName');
        // var roleId = this.roleId  = this.globalMethods.getCookie('roleId');
        // this.userId  = this.globalMethods.getCookie('userId');
        // //验证cookie是否失效，验证用户是否存在，最后权限判断
        // if( roleId ){
        //     //获取管理员列表
        //     this.__getAdminList();
        // }else{
        //     this.$router.push({name:'Login'});
        //     this.$message({
        //         type:'warning',
        //         message:'用户已失效,请重新登录'
        //     })
        // }   
    },
    methods:{
        //用户是否存在
        isUserExist(userList){
            if(userList &&  userList.length!=0){
                var isUserArr = [],
                    userId  = this.globalMethods.getCookie('userId');
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
        //事件-退出
        exit(){
           this.exitDialogVisible = true;
        },
        //事件-确认退出
        confirmExit(){
           this.$router.push({path:'/'});
           //清除cookie
            var value1 = this.globalMethods.getCookie('userName');
            var value2 = this.globalMethods.getCookie('roleName');
            var value3 = this.globalMethods.getCookie('roleId');
            this.globalMethods.deleteCookie('userName',value1,-1);
            this.globalMethods.deleteCookie('roleName',value2,-1);
            this.globalMethods.deleteCookie('roleId',value3,-1);
        },
        //事件-修改密码
        modifyPassword(formName){
            this.modifyPasswordDialog = true;
            if( this.$refs[formName]!=undefined){
                this.$refs[formName].resetFields();
            }
        },
        //取消修改密码对话框并重置
        modifyPasswordCancel(formName){
            this.modifyPasswordDialog = false;
            this.$refs[formName].resetFields();
        },
        //修改密码提交
        modifyPasswordSubmit(formName){
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.modifyPasswordDialog = false;
                    this.$http.post(
                        // "http://172.16.1.39:8080/ayl_weshopManage/updPassword",
                        ""+this.globalData.api+"/ayl_weshopManage/updPassword",
                        {
                            userid: this.userId,
                            old_password:this.modifyPasswordForm.oldPassword,
                            new_password:this.modifyPasswordForm.newPassword
                        },
                        {emulateJSON: true}, 
                        ).then(res=>{
                            res = res.body
                            if(res.eror_code == 0){
                               Message({
                                    message: '修改成功',
                                    type: 'success'
                               })
                            }else {
                                 Message.error({
                                    message: res.error_message,
                               })
                            }
                        })
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        //对话框关闭
        handleClose(done) {
            done();
        }
    },
   
}
</script>
<style  lang="less">
    .bg-gray{
        background-color: #f0f3f4;
    }
	.el-aside, .el-main{
		overflow: hidden;
	}
    .home-header{
        position:fixed;
        top:0;
        left:0;;
        z-index:999;
        width:100%;
        height:60px;
        line-height:60px;
        background:#fff;
        box-shadow:0 1px 0 rgba(0,0,0,.1);
    }
    .home-header-left{
        float: left;
        height:60px;
        line-height:60px;
    }
    .img-logo{
        width:50px;
        height:50px;
        vertical-align:middle;
        position: relative;
        z-index:1;
    }
    .home-header-right{
        float: right;
    }
    .home-header-right>span{
        padding:0 15px;
        font-size:14px;
        cursor: pointer;
        vertical-align:middle;
    }
    .home-header-right>span:first-child{
        cursor: default;
    }
    .span-title{
        display:inline-block;
        line-height:60px;
        font-size:24px;
        vertical-align: middle;
    }
    .user-login-word,
    .modify-password,
    .message-tip{
        border-right:1px solid #999;
    }
    .img-exit{
       width:16px;
       height:16px;
       vertical-align:middle;
    }
    .el-menu-item-group__title{
        padding:0 0 0 40px !important;
    }
    .userInfo-wrap{
        display: flex;
        align-items:center;
        padding: 20px;
		border-bottom:1px solid #e6e6e6;
    }
    .img-userDefault{
        width:70px;
        height:70px;
    }
    .userInfo-wrap-right{
        flex: 1;
        margin-left:10px;
    }
    .userName{
        display: block;
        
    }
    .user-position{
        display: block;
        font-size:14px;
        margin-top:10px;
    }
    .el-menu{
        border-right:none;
    }
	.el-menu .el-menu-item{
		padding-left:47px !important;
	}
	.el-collapse-item__header{
		font-size:16px;
		padding:0 0 0 20px !important;
	}
	.el-collapse-item__content{
		padding-bottom:0;
    }
    .el-main{
        padding:0 ;
    }
	.same-size-padding{
		font-size:14px;
		padding-left:10px;
	}
	.link-home{
		display: block;
		padding-left:20px;
		height:48px;
		line-height:48px;
		cursor: pointer;
	}
    .padding-right-10{
        padding-right:5px;
    }
    .message-tip .el-badge__content.is-fixed.is-dot{
        top:22px;
    }
    .message-tip .el-badge{
        margin-bottom:3px;
    }
    .home-body{
        position: relative;
        display: flex;
        width:100%;
        margin-top:60px;
        .menu-aside{
            position: fixed;
            top:60px;
            left: 0;
            z-index:100;
            background:#fff;
            width:240px;
            flex-basis:240px;
            overflow:hidden;
            text-align:left;
            .menu{
               border-right:none; 
            }
        }
        .home-body-right{
            margin-left:240px;
            flex:1;
            overflow:hidden;
        }
    }
    /* 共用部分 */
    .pulic-header{
        padding:20px 15px;
        background-color:rgba(240,240,240,.4);
        box-shadow:0 1px 0 rgba(0,0,0,.1);
        display: flex;
        align-items:center;
    }
    .icon-shouye{
        font-size: 20px;
        margin-right:10px;
    }
    .public-box{
        padding:20px;  
    }
    .public-box-wrap{
        border:1px solid rgba(0,0,0,.1);
        border-radius:4px;
        padding:20px  20px 35px 20px; 
    }
    .inline-form-wrap{
        display: flex;
    }
     .pagination-wrap{
        margin-top:40px;
        text-align: center;
    }
    
</style>


