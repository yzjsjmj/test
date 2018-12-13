<template>
    <div class="goodsAttr">
        <div class="pulic-header">
            <i  class="fontFamily icon-ayl-shouye icon-shouye"></i>
            <el-breadcrumb separator-class="el-icon-arrow-right" class="">
                <el-breadcrumb-item :to="{ path: '/Backstage' }" >首页</el-breadcrumb-item>
                <el-breadcrumb-item>商品属性</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="public-box" >
            <div class="public-box-wrap">
                <template>
                    <el-tabs v-model="activeName" @tab-click="tabsClick">
                        <el-tab-pane label="单位设置" name="first">
                            <div class="unit-wrap">
                                <div class="unitHeader mb20">
                                    <el-button type="primary" size="small" icon="el-icon-circle-plus-outline" @click="openDialog('unit','dynamicUnitForm')">添加单位</el-button>
                                </div>
                                <el-table
                                    :data="diffParamsData"
                                    border
                                    v-loading = "loading"
                                    :header-row-style="headerColor"
                                    style="width: 45%">
                                    <el-table-column
                                        label="序号" align="center"
                                        type="index"
                                        width="100">
                                    </el-table-column>
                                    <el-table-column
                                        prop="attr_value"
                                        label="单位名称"  align="center"
                                       >
                                    </el-table-column>
                                    <el-table-column label="操作"  width="200" align="center">
                                        <template slot-scope="scope">
                                            <el-button
                                            size="mini"
                                            icon="el-icon-edit"
                                            @click="sameEdit(scope.$index, scope.row,'unit','editDynamicUnitForm')">编辑</el-button>
                                            <el-button
                                            size="mini"
                                            type="danger"
                                            icon="el-icon-delete"
                                            @click="sameDelete(scope.$index, scope.row,'unit')">删除</el-button>
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </div>  
                        </el-tab-pane>
                        <el-tab-pane label="颜色设置" name="second">
                            <div class="unit-wrap">
                                <div class="unitHeader mb20">
                                    <el-button type="primary" size="small" icon="el-icon-circle-plus-outline"  @click="openDialog('color','dynamicColorForm')">添加颜色</el-button>
                                </div>
                                <el-table
                                    :data="diffParamsData"
                                    border
                                    :header-row-style="headerColor"
                                    style="width: 45%">
                                    <el-table-column
                                        label="序号" align="center"
                                        type="index"
                                        width="100">
                                    </el-table-column>
                                    <el-table-column
                                        prop="attr_value"
                                        label="颜色名称"  align="center"
                                    >
                                    </el-table-column>
                                    <el-table-column label="操作"  width="200" align="center">
                                        <template slot-scope="scope">
                                            <el-button
                                            size="mini"
                                            icon="el-icon-edit"
                                            @click="sameEdit(scope.$index, scope.row,'color','editDynamicColorForm')">编辑</el-button>
                                            <el-button
                                            size="mini"
                                            type="danger"
                                            icon="el-icon-delete"
                                            @click="sameDelete(scope.$index, scope.row,'color')">删除</el-button>
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </div>
                        </el-tab-pane>
                        <el-tab-pane label="材质设置" name="third">
                            <div class="unit-wrap">
                                <div class="unitHeader mb20">
                                    <el-button type="primary" size="small" icon="el-icon-circle-plus-outline" @click="openDialog('caizhi','dynamicCaizhiForm')">添加材质</el-button>
                                </div>
                                <el-table
                                    :data="diffParamsData"
                                    border
                                    :header-row-style="headerColor"
                                    style="width: 45%">
                                    <el-table-column
                                        label="序号" align="center"
                                        type="index"
                                        width="100">
                                    </el-table-column>
                                    <el-table-column
                                        prop="attr_value"
                                        label="材质名称"  align="center"
                                    >
                                    </el-table-column>
                                    <el-table-column label="操作"  width="200" align="center">
                                        <template slot-scope="scope">
                                            <el-button
                                            size="mini"
                                            icon="el-icon-edit"
                                            @click="sameEdit(scope.$index, scope.row,'caizhi','editDynamicCaizhiForm')">编辑</el-button>
                                            <el-button
                                            size="mini"
                                            type="danger"
                                            icon="el-icon-delete"
                                            @click="sameDelete(scope.$index, scope.row,'caizhi')">删除</el-button>
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </div>
                        </el-tab-pane>
                    </el-tabs>
                </template>   
            </div>    
        </div>
        <!-- 对话框之单位 -->
        <el-dialog class="same-dialog-width" title="添加单位" 
            width="30%"
             :visible.sync="unitDialogFormVisible" >
            <el-form :model="dynamicUnitForm" label-position="left"
            ref="dynamicUnitForm" label-width="90px" class="demo-dynamic">
                <el-form-item
                    prop="name"
                    label="单位"
                    :rules="[
                       { required: true, message: '请输入单位', trigger: 'blur' },
                    ]"
                >
                    <el-input v-model="dynamicUnitForm.name" clearable></el-input>
                </el-form-item>
                <el-form-item
                    v-for="(unit, index) in dynamicUnitForm.names"
                    :label="'单位' + index"
                    :key="unit.key"
                    :prop="'names.' + index + '.value'"
                    :rules="{
                        required: true, message: '请输入单位', trigger: 'blur'
                    }"
                >
                    <el-input v-model="unit.value" clearable></el-input>
                    <el-button  class="same-margin-btn" @click.prevent="removeInput(unit,'unit')">删除</el-button>
                </el-form-item>
                
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="success" @click="addInput('unit')" >新增单位</el-button>
                <el-button @click="cancelForm('dynamicUnitForm')">取 消</el-button>
                <el-button type="primary" @click="diffParamsSubmit('dynamicUnitForm')">保存</el-button>
            </div>
        </el-dialog>
        <el-dialog class="same-dialog-width" title="编辑单位" 
            width="30%"
             :visible.sync="editUnitDialogFormVisible" >
            <el-form :model="editUnitTableObj" label-position="left"
            ref="editDynamicUnitForm" label-width="90px" class="demo-dynamic">
                <el-form-item
                    prop="name"
                    label="单位名称"
                    :rules="[
                       { required: true, message: '请输入单位数量', trigger: 'blur' },
                    ]"
                >
                    <el-input v-model="editUnitTableObj.name" clearable></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancelForm('editDynamicUnitForm')">取 消</el-button>
                <el-button type="primary" @click="diffParamsSubmit('editDynamicUnitForm')">保存</el-button>
            </div>
        </el-dialog>
        <!-- 对话框之颜色 -->
        <el-dialog class="same-dialog-width" title="添加颜色" 
            width="30%"
             :visible.sync="colorDialogFormVisible" >
            <el-form :model="dynamicColorForm" label-position="left"
            ref="dynamicColorForm" label-width="90px" class="demo-dynamic">
                <el-form-item
                    prop="name"
                    label="颜色"
                    :rules="[
                       { required: true, message: '请输入颜色', trigger: 'blur' },
                    ]"
                >
                    <el-input v-model="dynamicColorForm.name" clearable></el-input>
                </el-form-item>
                <el-form-item
                    v-for="(color, index) in dynamicColorForm.names"
                    :label="'颜色' + index"
                    :key="color.key"
                    :prop="'names.' + index + '.value'"
                    :rules="{
                        required: true, message: '请输入颜色', trigger: 'blur'
                    }"
                >
                    <el-input v-model="color.value"></el-input>
                    <el-button  class="same-margin-btn" @click.prevent="removeInput(color,'color')">删除</el-button>
                </el-form-item>
                
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="success" @click="addInput('color')" >新增颜色</el-button>
                <el-button @click="cancelForm('dynamicColorForm')">取 消</el-button>
                <el-button type="primary" @click="diffParamsSubmit('dynamicColorForm')">保存</el-button>
            </div>
        </el-dialog>
        <el-dialog class="same-dialog-width" title="编辑颜色" 
            width="30%"
             :visible.sync="editColorDialogFormVisible" >
            <el-form :model="editColorTableObj" label-position="left"
            ref="editDynamicColorForm" label-width="90px" class="demo-dynamic">
                <el-form-item
                    prop="name"
                    label="颜色"
                    :rules="[
                       { required: true, message: '请输入颜色', trigger: 'blur' },
                    ]"
                >
                    <el-input v-model="editColorTableObj.name" clearable></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancelForm('editDynamicColorForm')">取 消</el-button>
                <el-button type="primary" @click="diffParamsSubmit('editDynamicColorForm')">保存</el-button>
            </div>
        </el-dialog>
        <!-- 对话框之材质 -->
        <el-dialog class="same-dialog-width" title="添加材质" 
            width="30%"
             :visible.sync="caizhiDialogFormVisible" >
            <el-form :model="dynamicCaizhiForm" label-position="left"
            ref="dynamicCaizhiForm" label-width="90px" class="demo-dynamic">
                <el-form-item
                    prop="name"
                    label="材质"
                    :rules="[
                       { required: true, message: '请输入材质', trigger: 'blur' },
                    ]"
                >
                    <el-input v-model="dynamicCaizhiForm.name"></el-input>
                </el-form-item>
                <el-form-item
                    v-for="(caizhi, index) in dynamicCaizhiForm.names"
                    :label="'材质' + index"
                    :key="caizhi.key"
                    :prop="'names.' + index + '.value'"
                    :rules="{
                        required: true, message: '请输入材质', trigger: 'blur'
                    }"
                >
                    <el-input v-model="caizhi.value" clearable></el-input>
                    <el-button  class="same-margin-btn" @click.prevent="removeInput(caizhi,'caizhi')">删除</el-button>
                </el-form-item>  
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="success" @click="addInput('caizhi')" >新增材质</el-button>
                <el-button @click="cancelForm('dynamicCaizhiForm')">取 消</el-button>
                <el-button type="primary" @click="diffParamsSubmit('dynamicCaizhiForm')">保存</el-button>
            </div>
        </el-dialog>
        <el-dialog class="same-dialog-width" title="编辑材质" 
            width="30%"
             :visible.sync="editCaizhiDialogFormVisible" >
            <el-form :model="editCaizhiTableObj" label-position="left"
            ref="editDynamicCaizhiForm" label-width="90px" class="demo-dynamic">
                <el-form-item
                    prop="name"
                    label="材质"
                    :rules="[
                       { required: true, message: '请输入材质', trigger: 'blur' },
                    ]"
                >
                    <el-input v-model="editCaizhiTableObj.name" clearable></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancelForm('editDynamicCaizhiForm')">取 消</el-button>
                <el-button type="primary" @click="diffParamsSubmit('editDynamicCaizhiForm')">保存</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    export default{
        data() {
            return {
                loading:true,
                attrType:'单位',            //请求类型
                activeName: 'first',
                unitDialogFormVisible:false,           //单位对话框
                editUnitDialogFormVisible:false,
                colorDialogFormVisible:false,          //颜色对话框
                editColorDialogFormVisible:false,
                caizhiDialogFormVisible:false,         //材质对话框
                editCaizhiDialogFormVisible:false,           //编辑
                //动态单位表单
                dynamicUnitForm: {
                    names: [],
                    name:''
                },
                //动态颜色表单
                dynamicColorForm: {
                    names: [],
                    name:''
                },
                //动态材质表单
                dynamicCaizhiForm: {
                    names: [],
                    name:''
                },
                //不同参数数据
                diffParamsData:[],
               
                //单位编辑内容
                editUnitTableObj:{
                    name:''
                },
                 //颜色编辑内容
                editColorTableObj:{
                    name:'',
                },
                //材质编辑内容
                editCaizhiTableObj:{
                    name:'',
                },
                oper_person:'',//用户id
                editIndex:-1
            };
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
                        priv_id:'3',
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
            //请求数据
            requestData(){
                this.$http.post(
                    ""+this.globalData.api+"/ayl_weshopManage/listGoodsAttr",
                    {
                        attrType:this.attrType,
                    },{emulateJSON:true})
                    .then( (res) => {  
                        console.log(res)
                        // 处理成功的结果 
                        var res =   res.body;
                        if(res.error_code==0){
                            this.loading = false;
                            this.diffParamsData = res.attrValue;
                        }else{
                            //清零置空
                            this.loading = false;
                            this.diffParamsData= [];  
                            console.log('查无数据')
                        }   
                    }).catch(function(res) {  
                        //捕捉异常                 
                        console.log(res);
                        this.loading = false;               
                    }
                );
            },
            //新增提交
            addRequestSubmit(attrValue){
                this.$http.post(
                    ""+this.globalData.api+"/ayl_weshopManage/insertGoodsAttr",
                    {
                        attrType:this.attrType,
                        attrValue:JSON.stringify(attrValue),
                        oper_person:this.oper_person,            //用户id
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
                            this.requestData();//刷新数据
                        }else{
                            this.$message({
                                message: '新增失败',
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
            //编辑提交
            editRequestSubmit(attrValue,id){
                this.$http.post(
                    ""+this.globalData.api+"/ayl_weshopManage/updateGoodsAttr",
                    {
                        id:id,
                        attrType:this.attrType,
                        attrValue:attrValue,
                        oper_person:this.oper_person,            //用户id
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
                            this.requestData();//刷新数据
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
            },
            //删除提交
            delRequestSubmit(id){
                this.$http.post(
                    ""+this.globalData.api+"/ayl_weshopManage/deleteGoodsAttr",
                    {
                        id:id,
                        attrType:this.attrType,
                        oper_person:this.oper_person,            //用户id
                    },{emulateJSON:true})
                    .then( (res) => {  
                        console.log(res)
                        // 处理成功的结果 
                        var res =   res.body;
                        if(res.error_code==0){
                            this.$message({
                                message: '删除成功',
                                type: 'success'
                            });
                            this.requestData();//刷新数据
                        }else{
                            this.$message({
                                message: res.error_message,
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
            //事件-选项卡点击
            tabsClick(tab, event) {
                var activeName = this.activeName;
                switch(activeName){
                    case 'first':
                        this.attrType = '单位';
                        this.requestData();
                        break;
                    case 'second':
                        this.attrType = '颜色';
                        this.requestData();
                        break;
                    case 'third':
                        this.attrType = '材质';
                        this.requestData();
                        break;        
                }
            },
            //打开添加对话框，根据参数的不同
            openDialog(name,formName){
                //重置表单状态
                if( this.$refs[formName]!=undefined){
                    this.$refs[formName].resetFields();
                }
                switch(name){
                    case 'unit':
                        this.unitDialogFormVisible = true;
                        break;
                    case 'color':
                        this.colorDialogFormVisible = true;
                        break;
                    case 'caizhi':
                        this.caizhiDialogFormVisible = true;
                        break;        
                }
            },
            //事件-相同的删除参数不同
            sameDelete(index, row,name){
                // console.log(index, row,name);
                this.$confirm('确认删除选择的信息?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning', 
                }).then(() => {
                    if(index!=undefined){
                        var obj = this.diffParamsData[index];
                        this.delRequestSubmit(obj.id);
                    }
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });          
                });
            },
            //事件-相同的编辑参数不同
            sameEdit(index, row,name,formName){
                // console.log(index, row);
                if( this.$refs[formName]!=undefined){
                    this.$refs[formName].resetFields();
                }
                this.editIndex = index;    //将索引存到data里面
                switch(name){
                    case 'unit':
                        var obj =  this.diffParamsData[index];
                        this.editUnitTableObj.name = obj.attr_value;
                        this.editUnitDialogFormVisible  = true;
                        break;
                    case 'color':
                        var obj =  this.diffParamsData[index];
                        this.editColorTableObj.name = obj.attr_value;
                        this.editColorDialogFormVisible  = true;
                        break;
                    case 'caizhi':
                        var obj =  this.diffParamsData[index];
                        this.editCaizhiTableObj.name = obj.attr_value;
                        this.editCaizhiDialogFormVisible  = true;
                        break;        
                }
            },
            //移除文本框，根据参数的不同
            removeInput(item,name){
                console.log(item)
                switch(name){
                    case 'unit':
                        var index = this.dynamicUnitForm.names.indexOf(item);
                        if (index !== -1) {
                            this.dynamicUnitForm.names.splice(index, 1);
                        }
                        break;
                    case 'color':
                        var index = this.dynamicColorForm.names.indexOf(item);
                        if (index !== -1) {
                            this.dynamicColorForm.names.splice(index, 1);
                        }
                        break;
                    case 'caizhi':
                        var index = this.dynamicCaizhiForm.names.indexOf(item);
                        if (index !== -1) {
                            this.dynamicCaizhiForm.names.splice(index, 1);
                        }
                        break;        
                } 
            },
            //增加文本框，根据参数不同
            addInput(name){
                switch(name){
                    case 'unit':
                        this.dynamicUnitForm.names.push({
                            value: '',
                            key: Date.now()
                        });
                        break;
                    case 'color':
                         this.dynamicColorForm.names.push({
                            value: '',
                            key: Date.now()
                        });
                        break;
                    case 'caizhi':
                        this.dynamicCaizhiForm.names.push({
                            value: '',
                            key: Date.now()
                        });
                        break;        
                } 
            },
            //事件-取消表单重置
            cancelForm(formName){
                // console.log(formName)
                switch(formName){
                    //新增单位对话框
                    case 'dynamicUnitForm':
                        this.unitDialogFormVisible = false;
                        break;
                    //编辑单位对话框    
                    case 'editDynamicUnitForm':
                        this.editUnitDialogFormVisible = false;
                        break;
                    //新增颜色对话框    
                    case 'dynamicColorForm':
                        this.colorDialogFormVisible = false;
                        break;
                    //编辑颜色对话框     
                    case 'editDynamicColorForm':
                        this.editColorDialogFormVisible = false;
                        break;
                    //新增材质对话框       
                    case 'dynamicCaizhiForm': 
                        this.caizhiDialogFormVisible = false;
                        break;
                    //编辑材质对话框       
                    case 'editDynamicCaizhiForm':
                        this.editCaizhiDialogFormVisible = false;
                        break;        
                }
            },
            //相同的执行代码
            sameExecuteCode(model){
                var  tempStr = '', tempArr = [];
                // console.log( model);
                if(model!=undefined){
                    tempArr.push(model.name);
                    var  tempModel =  model.names;
                    if(tempModel.length!=0){
                        tempModel.forEach((v,i)=>{
                            tempArr.push(v.value)
                        })
                    }
                    // console.log(tempArr);
                    if(tempArr.length!=0){
                        this.addRequestSubmit(tempArr);  //新增提交
                    }
                }
            }, 
            //事件-提交表单，根据参数不同来提交
            diffParamsSubmit(formName) {
                // console.log( this.$refs[formName].model )
                switch(formName){
                    //添加单位提交
                    case 'dynamicUnitForm':
                        this.$refs[formName].validate((valid) => {
                            console.log('submit!');
                                
                            if (valid) {
                                console.log('submit!');
                                var  model = this.$refs[formName].model;
                                //单位，颜色，材质执行代码一致
                                this.sameExecuteCode(model);
                                this.unitDialogFormVisible = false;
                            } else {
                                console.log('error submit!!');
                                return false;
                            }
                        });
                        break;
                    //编辑单位提交    
                    case 'editDynamicUnitForm':
                        this.$refs[formName].validate((valid) => {
                            if (valid) {
                                console.log('submit!');
                                var model = this.$refs[formName].model,
                                    tempArr = this.diffParamsData,
                                    index = this.editIndex,
                                    name ='', id='';
                                name =  model.name;
                                id = tempArr[index].id;
                                if(name!='' && id!=""){
                                    this.editRequestSubmit(name,id); 
                                }         
                                this.editUnitDialogFormVisible = false;
                            } else {
                                console.log('error submit!!');
                                return false;
                            }
                        });
                        break; 
                    //添加颜色提交    
                    case 'dynamicColorForm':
                        this.$refs[formName].validate((valid) => {
                            if (valid) {
                                console.log('submit!');
                                var  model = this.$refs[formName].model;
                                //单位，颜色，材质执行代码一致
                                this.sameExecuteCode(model);
                                this.colorDialogFormVisible = false;
                            } else {
                                console.log('error submit!!');
                                return false;
                            }
                        });
                        break; 
                    //编辑颜色提交    
                    case 'editDynamicColorForm':
                        this.$refs[formName].validate((valid) => {
                            if (valid) {
                                console.log('submit!');
                                var model = this.$refs[formName].model,
                                    tempArr = this.diffParamsData,
                                    index = this.editIndex,
                                    name ='', id='';
                                name =  model.name;
                                id = tempArr[index].id;
                                if(name!='' && id!=""){
                                    this.editRequestSubmit(name,id); 
                                }    
                                this.editColorDialogFormVisible = false;
                            } else {
                                console.log('error submit!!');
                                return false;
                            }
                        });
                        break;
                    //添加材质提交    
                    case 'dynamicCaizhiForm':
                        this.$refs[formName].validate((valid) => {
                            if (valid) {
                                console.log('submit!');
                                var  model = this.$refs[formName].model;
                                //单位，颜色，材质执行代码一致
                                this.sameExecuteCode(model);
                                this.caizhiDialogFormVisible = false;
                            } else {
                                console.log('error submit!!');
                                return false;
                            }
                        });
                        break; 
                    //编辑材质提交    
                    case 'editDynamicCaizhiForm':
                        this.$refs[formName].validate((valid) => {
                            if (valid) {
                                console.log('submit!');
                                var model = this.$refs[formName].model,
                                    tempArr = this.diffParamsData,
                                    index = this.editIndex,
                                    name ='', id='';
                                name =  model.name;
                                id = tempArr[index].id;
                                if(name!='' && id!=""){
                                    this.editRequestSubmit(name,id); 
                                }  
                                this.editCaizhiDialogFormVisible = false;
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
        }
    }
</script>
<style scoped>
    .unit-wrap{
        padding:10px 20px;
    }
    .el-input{
        width:300px;
    }
    .same-margin-btn{
        margin-left:10px;
    }
</style>

