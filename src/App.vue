<template>
    <div id="app"  >	
        <router-view></router-view>
    </div>
</template>

<script>
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
            username:'tom',
            position:'管理员',
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
    methods:{
        //事件-退出
        exit(){
           this.exitDialogVisible = true;
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
                    console.log('submit!');
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
    mounted () { 
    },
    components:{
        
    }
}
</script>
<style >
    #app {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        color: #2c3e50;
    }
	.el-aside, .el-main{
		overflow: hidden;
	}
    .home-header{
        height:60px;
        line-height:60px;
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
    .menu-aside{
        text-align:left;
        border-right:1px solid #e6e6e6;
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


w