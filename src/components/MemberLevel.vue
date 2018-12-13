<template>
    <div class="memberLevel">
        <div class="pulic-header">
            <i  class="fontFamily icon-ayl-shouye icon-shouye"></i>
            <el-breadcrumb separator-class="el-icon-arrow-right" class="">
                <el-breadcrumb-item :to="{ path: '/Backstage' }" >首页</el-breadcrumb-item>
                <el-breadcrumb-item>会员等级</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="public-box" >
            <div class="public-box-wrap">
                <template>
                    <el-table
                        ref="multipleTable"  
                        :data="memberLevelArr"
                        border
                        :header-row-style="headerColor"
                        tooltip-effect="dark"
                        style="width: 60%"
                        >
                        <el-table-column
                        label="序号" align="center"
                        type="index"
                        width="100">
                        </el-table-column>
                        <el-table-column
                            prop="level_name"
                            label="会员等级名称" align="center">
                        </el-table-column>
                        <el-table-column
                            prop="total_fee"  width="120"
                            label="所需总消费" align="center"
                        >
                        </el-table-column>
                        <el-table-column
                            prop="rebate"  width="120"
                            label="折扣(%)" align="center"
                        >
                        </el-table-column>
                        <el-table-column label="操作"  width="200" align="center">
                            <template slot-scope="scope">
                                <el-button
                                size="mini"
                                icon="el-icon-edit"
                                @click="handleEdit(scope.$index, scope.row,'editbtn','editForm')">编辑</el-button>
                            </template>
                        </el-table-column>
                    </el-table> 
                </template>    
            </div>    
        </div>
        <!-- 对话框 -->
        <el-dialog
            title="编辑会员等级"
            :visible.sync="editDialogFormVisible"
            width="30%"
            :before-close="handleClose">
            <el-form :model="editForm" label-position="left" ref="editForm">
                <el-form-item label="会员等级名称" 
                    :label-width="formLabelWidth"
                     prop="level_name"
                    :rules="{required: true, message: '请输入会员等级名称', trigger: 'blur'}" 
                >
                    <el-input v-model="editForm.level_name" clearable auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="所需消费" 
                    :label-width="formLabelWidth"
                     prop="total_fee"
                    :rules="{required: true, message: '请设置所需消费金额', trigger: 'blur'}" 
                >
                    <el-input v-model="editForm.total_fee" clearable auto-complete="off"></el-input>
                     <span class="same-unit">元</span>
                </el-form-item>
                <el-form-item label="折扣" 
                    :label-width="formLabelWidth"
                     prop="rebate"
                    :rules="{required: true, message: '请输入折扣', trigger: 'blur'}" 
                >
                    <el-input v-model="editForm.rebate" clearable auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="diffParamsSubmit('editForm')">确 定</el-button>
                <el-button @click="cancelForm('editRset','editForm')">重 置</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
    export default{
        data(){
            return{
                memberLevelArr: [
                    
                ],
                editDialogFormVisible: false,   //编辑对话框
                editForm: {
                    level_name:'',
                    total_fee:'',
                    rebate:''
                },
                oper_person:'',//用户id
                formLabelWidth: '120px',
                editIndex:-1,
            }
        },
        //vue创建实例后，还没有挂载在元素上 ,预先请求ajsx数据
        created () {
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
        methods:{
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
                        priv_id:'6',
                    },{emulateJSON:true})
                    .then( (res) => {  
                        console.log(res)
                        // 处理成功的结果 
                        var res =   res.body;
                        if(res.error_code==0){
                            this.requestData();
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
            //请求列表数据
            requestData(){
                this.$http.post(
                    ""+this.globalData.api+"/ayl_weshopManage/getMemberLevelList",
                    {
                        
                    },{emulateJSON:true})
                    .then( (res) => {  
                        console.log(res)
                        // 处理成功的结果 
                        var res =   res.body;
                        if(res.error_code==0){
                            this.loading = false;
                            this.memberLevelArr = res.memberLevels;
                        }else{
                            //清零置空
                            this.loading = false;
                            this.memberListArr= []; 
                            this.total = 0;   
                            console.log('查无数据')
                        }  
                        
                    }).catch(function(res) {  
                        //捕捉异常                 
                        console.log(res);
                        this.loading = false;               
                    }
                );
            },
            //打开添加对话框，根据参数的不同
            openDialog(name,formName){
                //重置表单状态
                if( this.$refs[formName]!=undefined){
                    this.$refs[formName].resetFields();
                }
                switch(name){
                    //添加商品分类对话框
                    case 'editbtn':
                        this.editDialogFormVisible  = true;
                        break;       
                }
            },
            //单个编辑
            handleEdit(index, row,name,formName) {
                // console.log(index, row);
                //打开对话框清除重置
                if(this.$refs[formName]!=undefined){
                    this.$refs[formName].resetFields();
                }
                if(name=='editbtn'){
                    var obj =  this.memberLevelArr[index];
                    this.editForm.level_name = obj.level_name;
                    this.editForm.total_fee = obj.total_fee;
                    this.editForm.rebate = obj.rebate;
                    this.editIndex = index;    //将索引存到data里面
                    this.editDialogFormVisible  = true;
                }
            },
            //取消对话框，并重置
            cancelForm(name,formName){
                switch(name){
                    //编辑对话框关闭   
                    case 'editRset':
                        this.$refs[formName].clearValidate();
                        break;      
                }
            },
            //事件-提交表单，根据参数不同来提交
            diffParamsSubmit(formName){
                console.log(formName)
                switch(formName){
                    //编辑提交
                    case 'editForm':
                        this.$refs[formName].validate((valid) => {
                            if (valid) {
                                var model = this.$refs[formName].model,
                                  tempArr = this.memberLevelArr,
                                  index = this.editIndex;
                                this.editDialogFormVisible  = false;
                                //替换
                                if(index!=-1){
                                    var obj = tempArr[index];
                                    tempArr.splice(index,1,{
                                       level_name:model.level_name,
                                       total_fee:model.total_fee,
                                       rebate:model.rebate
                                    })
                                    console.log(obj);
                                    console.log(model.rebate)
                                    this.$http.post(
                                        ""+this.globalData.api+"/ayl_weshopManage/updateMemberLevel",
                                        {
                                           oper_person:this.oper_person,            //用户id
                                           level:obj.level,
                                           level_name: model.level_name,
                                           rebate:model.rebate,
                                           total_fee:model.total_fee
                                        },{emulateJSON:true})
                                        .then( (res) => {  
                                            console.log(res)
                                            // 处理成功的结果 
                                            var res =   res.body;
                                            if(res.error_code==0){
                                                this.$message({
                                                    message: '更新成功',
                                                    type: 'success'
                                                });
                                            }else{
                                                this.$message({
                                                    message: '更新失败',
                                                    type: 'error'
                                                });
                                            }
                                        }).catch(function(res) {  
                                            //捕捉异常                 
                                            console.log(res);
                                            this.loading = false;               
                                        }
                                    );
                                    
                                }
                                console.log('submit!');
                            } else {
                                console.log('error submit!!');
                                return false;
                            }
                        });
                        break;    
                }
            },
            //表头颜色
            headerColor({row, rowIndex}){
                return  this.globalMethods.tabelHeaderColor();
            },
            //对话框关闭
            handleClose(done) {
                done();
            }
        },
    }
</script>
<style scoped>
    .batch-operate-btn{
        width:60%;
        margin-bottom: 20px;
        text-align:right;
    }
    .el-form-item__content{
        position: relative;
    }
    .el-input{
        width:340px;
    }
    .same-unit{
        position: absolute;
        top:0;
        left:350px;
        z-index:10;
    }
</style>

