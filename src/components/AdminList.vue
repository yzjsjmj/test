<template>
    <div class="adminList">
        <div class="pulic-header">
            <i  class="fontFamily icon-ayl-shouye icon-shouye"></i>
            <el-breadcrumb separator-class="el-icon-arrow-right" class="">
                <el-breadcrumb-item :to="{ path: '/Backstage' }" >首页</el-breadcrumb-item>
                <el-breadcrumb-item>管理员列表</el-breadcrumb-item>
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
                        :data="adminListArr"
                        border
                        v-loading = "loading"
                        :header-row-style="headerColor"
                        tooltip-effect="dark"
                        style="width: 100%"
                      >
                        <el-table-column
                        label="序号" align="center"
                        type="index"
                        width="80">
                        </el-table-column>
                        <el-table-column
                            prop="userid"  width="180"
                            label="用户名" align="center">
                        </el-table-column>
                        <el-table-column
                            prop="username"  width="120"
                            label="姓名" align="center"
                        >
                        </el-table-column>
                        <el-table-column
                            prop="rolename"  width="160"
                            label="部门" align="center"
                        >
                        </el-table-column>
                        <el-table-column
                            prop="last_logintime"  
                            label="最后登录时间" align="center"
                        >
                        </el-table-column>
                        <el-table-column
                            prop="last_loginip"  width="200"
                            label="最后登录ip" align="center"
                        >
                        </el-table-column>
                        <el-table-column
                            prop="status"  width="120"
                            label="状态" align="center"
                        >
                        </el-table-column>
                        <el-table-column
                            prop="ins_time"  
                            label="创建日期" align="center"
                        >
                        </el-table-column>
                        <el-table-column label="操作"  width="200" align="center">
                            <template slot-scope="scope">
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
                 <div class="pagination-wrap">
                    <el-pagination
                        @current-change="handleCurrentChange"
                        background
                        :current-page="currentPage"
                        :page-size="pageSize"
                        layout="total,prev, pager, next, jumper"
                        :total="total">
                    </el-pagination>
                </div>    
            </div>    
        </div>
        <!-- 对话框 -->
        <el-dialog
            title="添加操作用户"
            :visible.sync="addDialogFormVisible"
            width="30%"
            center
            :before-close="handleClose">
            <el-form :model="addForm" label-position="left" 
            ref="addForm"  :rules="rules">
                <el-form-item label="用户名" 
                    :label-width="formLabelWidth"
                     prop="userName"
                >
                    <el-input v-model="addForm.userName" clearable auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="密码" 
                    :label-width="formLabelWidth"
                     prop="password"
                >
                    <el-input v-model="addForm.password" clearable auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="确认密码" 
                    :label-width="formLabelWidth"
                     prop="comfirmPassword"
                >
                    <el-input v-model="addForm.comfirmPassword" clearable auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="姓名" 
                    :label-width="formLabelWidth"
                     prop="name" 
                >
                    <el-input v-model="addForm.name" clearable auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="用户角色"
                    :label-width="formLabelWidth"
                    prop="role">
                    <el-select v-model="addForm.role" placeholder="请选择用户角色" >
                        <el-option
                            v-for="(item,index) in roleList"
                            :key="index"
                            :label="item.rolename"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="是否启用"
                    :label-width="formLabelWidth"
                     prop="isStartUsing">
                    <el-radio-group v-model="addForm.isStartUsing" >
                        <el-radio label="是"></el-radio>
                        <el-radio label="否"></el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer ">
                <el-button type="primary" @click="diffParamsSubmit('addForm')">确 定</el-button>
                <el-button @click="cancelForm('addReset','addForm')">重 置</el-button>
            </span>
        </el-dialog>
        <el-dialog
            title="编辑操作用户"
            :visible.sync="editDialogFormVisible"
            width="30%"
            center
            :before-close="handleClose">
            <el-form :model="editForm" label-position="left" 
            ref="editForm"  :rules="rules">
                <el-form-item label="用户名" 
                    :label-width="formLabelWidth"
                     prop="userName"
                >
                    <el-input v-model="editForm.userName" clearable auto-complete="off" disabled></el-input>
                </el-form-item>
                <el-form-item label="姓名" 
                    :label-width="formLabelWidth"
                     prop="name" 
                >
                    <el-input v-model="editForm.name" clearable auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="用户角色"
                    :label-width="formLabelWidth"
                    prop="role">
                    <el-select v-model="editForm.role"  placeholder="请选择用户角色" @change="rolePick">
                         <el-option
                            v-for="(item,index) in roleList"
                            :key="index"
                            :label="item.rolename"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="是否启用"
                    :label-width="formLabelWidth"
                     prop="isStartUsing">
                    <el-radio-group v-model="editForm.isStartUsing" >
                        <el-radio label="是">是</el-radio>
                        <el-radio label="否">否</el-radio>
                    </el-radio-group>
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
    import { Message } from 'element-ui'
    export default {
        data() {
            var validateComfirmPass = (rule, value, callback) => {
                if (value.trim() !== this.addForm.password.trim()) {
                    callback(new Error('两次输入密码不一致!'));
                } else {
                    callback();
                }
            }
            return {
                sameCount:0,
                //管理员列表
                adminListArr: [],
                //角色列表
                roleList:[],
                rolePicked:'',
                loading:true,
                roleChoice:'',
                 //页面管理员数量
                pageSize:  10,
                //当前页，默认值为1
                currentPage:1,
                //总管理员数
                total:0,  
                //验证规则
                rules:{
                    userName:[
                        { required: true, message: '请输入用户名', trigger: 'blur' },
                    ],
                    password:[
                        { required: true, message: '请输入密码', trigger: 'blur' },
                    ],
                    comfirmPassword:[
                        { required: true, message: '请输入确认密码', trigger: 'blur', validator:validateComfirmPass},
                    ],
                    name:[
                        { required: true, message: '请输入姓名', trigger: 'blur' },
                    ],
                    role:[
                        { required: true, message: '请选择用户角色', trigger: 'blur' },
                    ],
                    isStartUsing:[
                        { required: true, message: '请选择是否启用', trigger: 'blur' },
                    ],
                },
                //对话框数据
                addDialogFormVisible: false,   //添加对话框
                addForm: {
                    userName:'',
                    password:'',
                    comfirmPassword:'',
                    name:'',
                    role:'',
                    isStartUsing:'是'
                },
                editDialogFormVisible: false,   //编辑对话框
                editForm: {
                    userName:'',
                    name:'',
                    role:'',
                    isStartUsing:'是'
                },
                formLabelWidth: '120px',
                oper_person:'',//用户id
                // multipleSelectArr: [],     //接收复选框选择的数据
                editIndex:-1
            }
        },
        created() {
            //权限判断
            var  roleId  = this.globalMethods.getCookie('roleId');
            this.oper_person  = this.globalMethods.getCookie('userId');
            //验证cookie是否失效，验证用户是否存在，最后权限判断
            if( roleId ){
                //获取管理员列表
                this.__getAdminList(this.currentPage,this.pageSize);
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
            //权限判断
            isAuthority(role_id){
                this.$http.post(
                    ""+this.globalData.api+"/ayl_weshopManage/checkUserAuthority",
                    // "http://172.16.1.39:8080/ayl_weshopManage/checkUserAuthority",
                    {
                        role_id:role_id,
                        priv_id:'13',
                    },{emulateJSON:true})
                    .then( (res) => {  
                        console.log(res)
                        // 处理成功的结果 
                        var res =   res.body;
                        if(res.error_code==0){
                            // this.__getAdminList(this.currentPage,this.pageSize);
                            this.__getRoleList();
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
            __getRoleList() {
                   this.$http.post(""+this.globalData.api+"/ayl_weshopManage/getUserRoleList",{},{emulateJSON: true}).then(res=>{
                        // console.log(res)
                        res = res.body
                   if(res.error_code == 0 ) {
                       this.roleList = res.list;
                   }                
                })
            },
            //获取管理员列表
            __getAdminList(currentPage,pageSize){
                this.$http.post(""+this.globalData.api+"/ayl_weshopManage/getUserList",{
                   currentPage:currentPage, //当前页码从1开始
                   pageSize:pageSize     //当前页面显示条数
                },{emulateJSON: true}).then(res=>{
                    console.log(res)
                    res = res.body
                    if (res.error_code == 0) {
                        //判断用户是否存在
                        this.isUserExist(res.userList);
                        this.adminListArr = res.userList;
                        this.total = res.total
                        this.loading = false;
                    } else {
                        this.loading = false;
                        this.adminListArr = [];
                        this.total=0; 
                        console.log('查无数据')
                    }
                }) 
            },
            //单个删除
            handleDelete(index, row) {
                this.$confirm('确认删除选择的信息?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                    }).then(() => {
                        this.$http.post(""+this.globalData.api+"/ayl_weshopManage/deleteOneUser",{
                            userid:row.userid,
                            oper_person:this.oper_person,            //用户id
                        },{emulateJSON: true}).then(res=>{
                            res = res.body
                            if(res.error_code == 0) {
                                this.loading = true
                                this.__getAdminList(this.currentPage,this.pageSize)
                                 Message({
                                    type:'success',
                                    message:'删除成功'
                                })
                            } else {
                                Message.error({
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
                console.log(row);
                //打开对话框清除重置
                if(this.$refs[formName]!=undefined){
                    this.$refs[formName].resetFields();
                }
                if(name=='editbtn'){
                    this.editForm.userName = row.userid;
                    this.editForm.name = row.username;
                    this.editForm.role = row.rolename;                    
                    this.rolePicked = row.userrole; 
                    this.editForm.isStartUsing  = row.status == "0"?"是":"否",                 
                    this.editDialogFormVisible  = true;
                }
            },
            //角色选择变化
            rolePick (val) {
                    console.log(val)
                    return  this.rolePicked = val; 
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
                this.$http.post(""+this.globalData.api+"/ayl_weshopManage/addOneUser",{
                    password: model.password,                //用户登录密码
                    username: model.name,                    //姓名
                    userrole: model.role,                    //用户角色id
                    userid :  model.userName ,               //用户登录名
                    oper_person:this.oper_person,            //用户id
                    status: model.isStartUsing=='是'? 0 : 1  //状态 0：正常1：停用
                    },{emulateJSON: true}).then(res=>{
                            res = res.body
                        if(res.error_code == 0) {
                            this.loading = true;
                            this.__getAdminList(this.currentPage,this.pageSize);
                            this.$message({
                                type:'success',
                                message:'添加成功'
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
                                this.addDialogFormVisible = false
                                var model = this.$refs[formName].model
                                 model.password = model.password.trim()
                                 model.userName = model.userName.trim()
                                if(this.adminListArr == undefined) {
                                    this.add(model)
                                } else {
                                    this.adminListArr.forEach((item)=>{
                                    if(item.userid == model.userName){                                                            
                                        this.sameCount ++
                                    } 
                                    })
                                    if(this.sameCount == 0){
                                        this.add(model);
                                    } else {    
                                     Message({
                                        message: '用户名已存在',
                                        type: 'error'
                                    })
                                        this.sameCount = 0
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
                                console.log(model)
                                this.$http.post(""+this.globalData.api+"/ayl_weshopManage/updOneUser",{
                                    username: model.name,                    //姓名
                                    userrole: this.rolePicked,                //用户角色id
                                    userid :  model.userName ,               //用户登录名
                                    oper_person:this.oper_person,            //用户id
                                    status: model.isStartUsing=='是'? 0 : 1  //状态 0：正常1：停用
                                    },{emulateJSON: true}).then(res=>{
                                            res = res.body
                                            console.log(res)
                                        if(res.error_code == 0) {
                                            this.loading = true
                                            this.__getAdminList(this.currentPage,this.pageSize)
                                            this.editDialogFormVisible  = false
                                            Message({
                                                type:'success',
                                                message:'修改成功'
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
             //事件-当前页变化
            handleCurrentChange(val) {
                this.loading = true
                setTimeout(() => {    
                    this.adminListArr = []
                    this.__getAdminList(val,this.pageSize)
                }, 500);
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
        width:100%;
        margin-bottom: 20px;
        text-align:right;
    }
    .el-input{
        width:340px;
    }
    .pagination-wrap{
        margin-top:20px;
        text-align: center;
    }
</style>

