<template>
    <div class="goodsType">
        <div class="pulic-header">
            <i  class="fontFamily icon-ayl-shouye icon-shouye"></i>
            <el-breadcrumb separator-class="el-icon-arrow-right" class="">
                <el-breadcrumb-item :to="{ path: '/Backstage' }" >首页</el-breadcrumb-item>
                <el-breadcrumb-item>商品分类</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="public-box" >
            <div class="public-box-wrap">
                <div class="batch-operate-btn"  >
                    <el-button type="danger" size="medium"  icon="el-icon-delete"   @click="batchDel()">删除</el-button>
                    <el-button type="primary"  size="medium"  icon="el-icon-circle-plus-outline"  @click="openDialog('addbtn','addForm')">添加</el-button>
                </div>
                <template>
                    <el-table
                        ref="multipleTable"  
                        :data="goodsTypeArr"
                        border
                        v-loading="loading"
                        :header-row-style="headerColor"
                        tooltip-effect="dark"
                        style="width: 60%"
                        @selection-change="handleSelectionChange">
                        <el-table-column
                        type="selection"  align="center"
                        width="100" >
                        </el-table-column>
                        <el-table-column
                        label="序号" align="center"
                        type="index"
                        width="100">
                        </el-table-column>
                        <el-table-column
                            prop="attr_value"
                            label="分类名称" align="center">
                            <template slot-scope="scope">{{ scope.row.attr_value }}</template>
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
            </div>    
        </div>
        <!-- 对话框 -->
        <el-dialog
            title="添加商品分类"
            :visible.sync="addDialogFormVisible"
            width="30%"
            :before-close="handleClose">
            <el-form :model="addForm" label-position="left" ref="addForm">
                <el-form-item label="名称" 
                   :label-width="formLabelWidth"
                   prop="attr_value"
                   :rules="{required: true, message: '请输入商品名称', trigger: 'blur'}"   
                >
                    <el-input v-model="addForm.attr_value" clearable auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="cancelForm('addGoodsType','addForm')">取 消</el-button>
                <el-button type="primary" @click="diffParamsSubmit('addForm')">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog
            title="编辑商品分类"
            :visible.sync="editDialogFormVisible"
            width="30%"
            :before-close="handleClose">
            <el-form :model="editForm" label-position="left" ref="editForm">
                <el-form-item label="名称" 
                    :label-width="formLabelWidth"
                     prop="attr_value"
                    :rules="{required: true, message: '请输入商品名称', trigger: 'blur'}" 
                >
                    <el-input v-model="editForm.attr_value" clearable auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="cancelForm('editGoodsType','editForm')">取 消</el-button>
                <el-button type="primary" @click="diffParamsSubmit('editForm')">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
export default {
    data() {
        return {
            loading:true,
            dialogVisible: false,       //对话框显示与隐藏
            goodsTypeArr: [
                
            ],
            //对话框数据
            addDialogFormVisible: false,   //添加对话框
            addForm: {
                attr_value:''
            },
            editDialogFormVisible: false,   //编辑对话框
            editForm: {
                attr_value:''
            },
            formLabelWidth: '120px',
            oper_person:'',//用户id
            multipleSelectArr: [],     //接收复选框选择的数据
            editIndex:-1,
        }
    },
    //vue创建实例后，还没有挂载在元素上 ,预先请求ajsx数据
    created() {
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
                    priv_id:'1',
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
        //请求数据加载
        requestData(){
            this.$http.post(
                ""+this.globalData.api+"/ayl_weshopManage/listGoodsAttr",
                {
                    attrType:'分类名称',
                },{emulateJSON:true})
                .then( (res) => {  
                    console.log(res)
                    // 处理成功的结果 
                    var res =   res.body;
                    if(res.error_code==0){
                        this.loading = false;
                        this.goodsTypeArr = res.attrValue;    
                    }else{
                        //清零置空
                        this.loading = false;
                        this.goodsTypeArr= [];  
                        console.log('查无数据')
                    }   
                }).catch(function(res) {  
                    //捕捉异常                 
                    console.log(res);
                    this.loading = false;               
                }
            );
        },
        //删除提交
        delSubmit(strId){
            console.log(strId)
            this.$http.post(
                ""+this.globalData.api+"/ayl_weshopManage/deleteGoodsAttr",
                {
                    oper_person:this.oper_person,            //用户id
                    id:strId,
                    attrType:'分类名称'
                },{emulateJSON:true})
                .then( (res) => {  
                    console.log(res)
                    // 处理成功的结果 
                    var res =   res.body;
                    if(res.error_code==0){
                        this.requestData();    //刷新数据
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                    }else{
                        this.$message({
                            message: '删除失败',
                            type: 'error'
                        }); 
                    }   
                }).catch(function(res) {  
                    //捕捉异常                 
                    console.log(res);
                    this.loading = false;               
                }
            );
        },
        //事件-选择项发生变化时
        handleSelectionChange(val) {
            this.multipleSelectArr = val;
            // console.log(val);
        },
        //事件-批量删除
        batchDel(){
            if(this.multipleSelectArr.length!=0){
                this.handleDelete()       //要传参数
            }else{
                this.delDataTip();
            } 
        },
        //单个删除
        handleDelete(index, row) {
            this.$confirm('确认删除选择的信息?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }).then(() => {
                    var item = this.multipleSelectArr,
                     tempArr = this.goodsTypeArr;
                    console.log( item ) 
                    //不勾选单个删除
                    if(index!=undefined){
                        // console.log( index,tempArr[index].id)
                        this.delSubmit(tempArr[index].id);
                    }else{    //勾选批量删除
                        var strId = '';
                        var strArr = [];
                        item.forEach((v,i)=>{
                            var jIndex = tempArr.indexOf(v);
                            if(jIndex !== -1){
                                strArr.push(v.id);
                            }
                        })
                        strId = strArr.join(',');
                        if(strId!=''){
                            this.delSubmit(strId);
                        }
                    }  
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
                var obj =  this.goodsTypeArr[index];
                this.editForm.attr_value = obj.attr_value;
                this.editDialogFormVisible  = true;
                this.editIndex = index;    //将索引存到data里面
            }    
        },
        
        //取消对话框，并重置
        cancelForm(name,formName){
            switch(name){
                //新增对话框关闭
                case 'addGoodsType':
                    this.addDialogFormVisible = false;
                    break;
                //编辑对话框关闭   
                case 'editGoodsType':
                    this.editDialogFormVisible = false;
                    break;      
            }
        },
        //事件-提交表单，根据参数不同来提交
        diffParamsSubmit(formName){
            console.log(formName)
            switch(formName){
                //添加商品分类提交
                case 'addForm':
                    this.$refs[formName].validate((valid) => {
                        if (valid) {
                            console.log('submit!');
                            var  model = this.$refs[formName].model;
                            this.addDialogFormVisible = false;
                            var tempArr = [];
                            tempArr.push(model.attr_value);
                            //新增提交
                            this.$http.post(
                                ""+this.globalData.api+"/ayl_weshopManage/insertGoodsAttr",
                                {
                                    oper_person:this.oper_person,            //用户id
                                    attrType:'分类名称',
                                    attrValue:JSON.stringify(tempArr)
                                },{emulateJSON:true})
                                .then( (res) => {  
                                    console.log(res)
                                    // 处理成功的结果 
                                    var res =   res.body;
                                    if(res.error_code==0){
                                        this.$message({
                                            message: '新增成功',
                                            type: 'success'
                                        });
                                        this.requestData();    //刷新数据
                                    }else{
                                        this.$message({
                                            message: '新增失败',
                                            type: 'error'
                                        });
                                    }   
                                }).catch(function(res) {  
                                    //捕捉异常                 
                                    console.log(res);           
                                }
                            );
                            
                        } else {
                            console.log('error submit!!');
                            return false;
                        }
                    });
                    break;
                //编辑商品分类提交
                case 'editForm':
                    this.$refs[formName].validate((valid) => {
                        if (valid) {
                            console.log('submit!');
                            var model = this.$refs[formName].model,
                                tempArr = this.goodsTypeArr,
                                index = parseFloat(this.editIndex) ;
                            this.editDialogFormVisible = false;
                            if(index!=-1){
                                //编辑提交
                                this.$http.post(
                                    ""+this.globalData.api+"/ayl_weshopManage/updateGoodsAttr",
                                    {
                                        oper_person:this.oper_person,            //用户id
                                        id:tempArr[index].id,
                                        attrValue:model.attr_value,
                                        attrType:'分类名称'
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
                                            this.requestData();    //刷新数据
                                        }else{
                                            this.$message({
                                                message: '更新失败，'+res.error_message,
                                                type: 'error'
                                            });
                                        }   
                                    }).catch(function(res) {  
                                        //捕捉异常                 
                                        console.log(res);           
                                    }
                                );
                            }
                           
                            
                            
                        } else {
                            console.log('error submit!!');
                            return false;
                        }
                    });
                    break;    
            }
        },
        //事件-删除消息提示
        delDataTip() {
            var tempArr = this.goodsTypeArr;
            if(tempArr.length!=0){
                this.$message({
                    message: '没有勾选数据哦',
                    type: 'warning'
                });
            }else{
                this.$message({
                    message: '暂无数据',
                    type: 'warning'
                });
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
};
</script>
<style scoped>
    
    .batch-operate-btn{
        width:60%;
        margin-bottom: 20px;
        text-align:right;
    }
    
    
</style>
