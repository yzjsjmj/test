<template>
    <div class="roleList">
        <div class="pulic-header">
            <i  class="fontFamily icon-ayl-shouye icon-shouye"></i>
            <el-breadcrumb separator-class="el-icon-arrow-right" class="">
                <el-breadcrumb-item :to="{ path: '/Backstage' }" >首页</el-breadcrumb-item>
                <el-breadcrumb-item>角色列表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="public-box" >
            <div class="public-box-wrap">
                 <div class="batch-operate-btn"  >
                    <el-button type="primary"  size="medium"  icon="el-icon-circle-plus-outline"  @click="openDialog('addbtn','addForm')">添加</el-button>
                </div>
                <template>
                    <el-table
                        ref="multipleTable"  
                        :data="RoleListArr"
                        border
                        v-loading= "loading"
                        :header-row-style="headerColor"
                        tooltip-effect="dark"
                        style="width: 80%"
                      >
                        <el-table-column
                        label="序号" align="center"
                        type="index"
                        width="80">
                        </el-table-column>
                        <el-table-column
                            prop="rolename"  width="160"
                            label="角色名称" align="center">
                        </el-table-column>
                        <el-table-column
                            prop="desc"  width=""
                            label="描述" align="center"
                        >
                        </el-table-column>
                        <el-table-column
                            prop="ins_time"  width="220"
                            label="创建日期" align="center"
                        >
                        </el-table-column>
                        <el-table-column label="操作"  width="320" align="center">
                            <template slot-scope="scope">
                                <el-button
                                size="mini"
                                icon="el-icon-setting"
                                type="info"
                                @click="linkSetAuthorize(scope.$index, scope.row,'editForm')">设置权限</el-button>
                                <el-button
                                size="mini"
                                icon="el-icon-edit"
                                @click="handleEdit(scope.$index, scope.row,'editbtn','editForm')">编辑</el-button>
                                <el-button
                                size="mini"
                                type="danger"
                                icon="el-icon-delete"
                                @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table> 
                </template>    
            </div>    
        </div>
        <!-- 对话框 -->
        <el-dialog
            title="添加角色"
            :visible.sync="addDialogFormVisible"
            width="30%"
            center
            :before-close="handleClose">
            <el-form :model="addForm" label-position="left" 
            ref="addForm"  :rules="rules">
                <el-form-item label="角色名称" 
                    :label-width="formLabelWidth"
                     prop="roleName"
                >
                    <el-input v-model="addForm.roleName" clearable auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="描述" 
                    :label-width="formLabelWidth"
                     prop="describe"
                >
                    <el-input  type="textarea" v-model="addForm.describe" clearable auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer ">
                <el-button type="primary" @click="diffParamsSubmit('addForm')">确 定</el-button>
                <el-button @click="cancelForm('addReset','addForm')">重 置</el-button>
            </span>
        </el-dialog>
        <el-dialog
            title="编辑角色"
            :visible.sync="editDialogFormVisible"
            width="30%"
            center
            :before-close="handleClose">
            <el-form :model="editForm" label-position="left" 
               ref="editForm"  :rules="rules">
                <el-form-item label="角色名称" 
                    :label-width="formLabelWidth"
                     prop="roleName"
                >
                    <el-input v-model="editForm.roleName" clearable auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="描述" 
                    :label-width="formLabelWidth"
                   
                    prop="describe"
                >
                    <el-input  type="textarea" v-model="editForm.describe" clearable auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer ">
                <el-button type="primary" @click="diffParamsSubmit('editForm')">确 定</el-button>
                <el-button @click="cancelForm('editRset','editForm')">重 置</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
     export default {
        data(){
            return{
                loading:true,
                //相同角色名的数量
                sameCount:0,
                //角色名数组
                RoleListArr: [],
                //验证规则
                rules:{
                    roleName:[
                        { required: true, message: '请输入角色名称', trigger: 'blur'},
                    ],
                    describe:[
                        { required: true, message: '请输入描述', trigger: 'blur'  },
                        {  max: 50, message: '长度在50以内', trigger: 'blur' }
                    ]
                },
                //对话框数据
                addDialogFormVisible: false,   //添加对话框
                addForm: {
                    roleName:'',
                    describe:'',
                    createDate:''
                },
                editDialogFormVisible: false,   //编辑对话框
                editForm: {
                    roleName:'',
                    describe:'',
                    createDate:''
                },
                formLabelWidth: '120px',
                oper_person:'',//用户id
                // multipleSelectArr: [],     //接收复选框选择的数据
                editIndex:-1,
            }
        },
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
                        priv_id:'14',
                    },{emulateJSON:true})
                    .then( (res) => {  
                        console.log(res)
                        // 处理成功的结果 
                        var res =   res.body;
                        if(res.error_code==0){
                            this.getRolelist();
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
            //获取角色列表
            getRolelist () {
                this.$http.post(""+this.globalData.api+"/ayl_weshopManage/getUserRoleList",{},{emulateJSON: true}).then(res=>{
                    res = res.body
                    if(res.error_code == 0 ){
                        this.RoleListArr = res.list;
                        this.loading = false;
                    }else{
                        this.RoleListArr = [];
                        this.loading = false;
                    } 
                }).catch(res=>{
                    this.loading = false;
                })  
            },
            //链接设置权限
            linkSetAuthorize(index,row){
                // console.log(row);
                this.$router.push({name:'SetAuthorize',params:{role_id:row.id}})
            },

            //单个删除
            handleDelete(index, row) {
                this.$confirm('确认删除选择的信息?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                    }).then(() => {
                        this.$http.post(""+this.globalData.api+"/ayl_weshopManage/deleteOneUserRole",{
                            id:row.id,
                            oper_person:this.oper_person,            //用户id
                        },{emulateJSON: true}).then(res=>{
                            res = res.body
                            if(res.error_code == 0) {
                                this.RoleListArr = []
                                this.getRolelist();
                                this.$message({
                                    type:'success',
                                    message:'删除成功'
                                })
                            } else {
                                this.$message.error({
                                    message: res.error_message
                                })
                            }
                        })       
                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消删除'
                        });          
                });
            },
            //打开添加对话框，根据参数的不同
            openDialog(name,formName){
                //重置表单状态
                if( this.$refs[formName]!=undefined){
                    this.$refs[formName].resetFields();
                }
                switch(name){
                    //添加商品分类对话框
                    case 'addbtn':
                        this.addDialogFormVisible  = true;
                        break;       
                }
            },
            //单个编辑
            handleEdit(index, row,name,formName) {
                console.log(index, row);
                //打开对话框清除重置
                if(this.$refs[formName]!=undefined){
                    this.$refs[formName].resetFields();
                }
                if(name=='editbtn'){
                    this.editIndex = row.id;    //将索引存到data里面
                    this.editForm.roleName = row.rolename
                    this.editForm.describe = row.desc
                    this.editDialogFormVisible  = true;
                }
            },
            //取消对话框，并重置
            cancelForm(name,formName){
                switch(name){
                    //新增对话框关闭
                    case 'addReset':
                        this.$refs[formName].resetFields();
                        break;
                    //编辑对话框关闭   
                    case 'editRset':
                        this.$refs[formName].clearValidate();
                        break;      
                }
            },
             //优化代码
            add(model) {
                this.$http.post(""+this.globalData.api+"/ayl_weshopManage/addOneUserRole",{
                    rolename:model.roleName, //角色名称
                    desc: model.describe,//角色描述
                    oper_person:this.oper_person,            //用户id
                    },{emulateJSON: true}).then(res=>{
                           res = res.body
                        if(res.error_code == 0) {
                            this.getRolelist()
                            this.$message({
                                type:'success',
                                message:'添加成功'
                            })
                        } else {
                            this.$message.error({
                                message:res.error_message
                            })
                        }
                    })
            },
            //事件-提交表单，根据参数不同来提交
            diffParamsSubmit(formName){
                console.log(formName)
                switch(formName){
                    //添加提交
                    case 'addForm':
                        this.$refs[formName].validate((valid) => {
                            if (valid) {
                                this.addDialogFormVisible = false; 
                                var model = this.$refs[formName].model
                                model.roleName = model.roleName.trim()
                               if(this.RoleListArr == undefined) {
                                    this.add(model)
                                } else {
                                    this.RoleListArr.forEach((item)=>{
                                    if(item.rolename == model.roleName){                                                            
                                        this.sameCount ++
                                    } 
                                    })
                                    if(this.sameCount == 0){
                                        this.add(model)
                                    } else {    
                                        this.sameCount = 0
                                        this.$message({
                                            message: '角色名已存在',
                                            type: 'error'
                                        })
                                    }
                                }   
                            } else {
                                console.log('error submit!!');
                                return false;
                            }
                        });
                        break;
                    //编辑提交
                    case 'editForm':
                        this.$refs[formName].validate((valid) => {
                            if (valid) {
                                var model = this.$refs[formName].model
                                 model.roleName = model.roleName.trim()
                                //替换
                                this.$http.post(""+this.globalData.api+"/ayl_weshopManage/updOneUserRole",{
                                    id: this.editIndex,//用户角色id
                                    rolename: model.roleName,       //角色名称
                                    oper_person:this.oper_person,            //用户id
                                    desc: model.describe,//角色描述
                                    },{emulateJSON: true}).then(res=>{
                                            console.log(res);
                                            res = res.body
                                        if(res.error_code == 0) {
                                            this.getRolelist()
                                            this.editDialogFormVisible  = false
                                            this.$message({
                                                type:'success',
                                                message:'修改成功'
                                            })
                                        }else {
                                             this.$message.error({
                                                message:res.error_message
                                            })
                                        }
                                    })
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
        }
        
    }
</script>
<style scoped>
    .batch-operate-btn{
        width:80%;
        margin-bottom: 20px;
        text-align:right;
    }
    .el-input,
    .el-textarea{
        width:340px;
    }
</style>

