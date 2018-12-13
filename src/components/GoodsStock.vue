<template>
    <div class="goodsStock">
        <div class="pulic-header">
            <i  class="fontFamily icon-ayl-shouye icon-shouye"></i>
            <el-breadcrumb separator-class="el-icon-arrow-right" class="">
                <el-breadcrumb-item :to="{ path: '/Backstage' }" >首页</el-breadcrumb-item>
                <el-breadcrumb-item>商品库存</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="public-box" >
            <div class="public-box-wrap">
                <div class="inline-form-wrap">
                    <el-form :inline="true" :model="formInline" class="demo-form-inline">
                        <el-form-item label="商品分类:">
                            <el-select v-model="formInline.goodsType" placeholder="请选择商品分类">
                                <el-option
                                    v-for="(item,index) in goodsTypeArr"
                                    :key="index"
                                    :label="item"
                                    :value="item"
                                >
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="">
                            <el-input clearable v-model="formInline.goodsKeywords" placeholder="商品关键字"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" icon="el-icon-search"  @click="goodsSearch">搜索</el-button>
                        </el-form-item>
                    </el-form>  
                </div>
                <template>
                    <el-table
                        ref="multipleTable"  
                        :data="goodsStockArr"
                        border
                        :header-row-style="headerColor"
                        tooltip-effect="dark"
                        style="width:100%;"
                       >
                       <el-table-column
                            label="序号" align="center"
                            type="index"
                            width="100">
                        </el-table-column>
                       
                        <el-table-column
                            label="商品名称" align="center" 
                            prop="goods_name"
                            >
                        </el-table-column>
                        <el-table-column
                            label="商品分类" align="center"  width="120"
                            prop="goods_type"
                            >
                        </el-table-column>
                        <el-table-column
                            label="颜色" align="center"  width="200"
                            prop="color"
                            >
                        </el-table-column>
                        <el-table-column
                            label="库存数量" align="center"  width="120"
                            prop="count"
                            >
                        </el-table-column>
                        <el-table-column
                            label="销售价格(元)" align="center"  width="140"
                            prop="price"
                            >
                        </el-table-column>
                        <el-table-column label="操作"  width="180" align="center">
                            <template slot-scope="scope">
                                <el-button
                                   size="mini" type="text"
                                @click="editStockNum(scope.$index, scope.row,'editbtn','editForm')">编辑库存数</el-button>
                            </template>
                        </el-table-column>
                    </el-table> 
                </template>
                <div class="pagination-wrap ">
                    <el-pagination
                        @current-change="handleCurrentChange"
                        background
                        :current-page="crrentPage"
                        :page-size="pageCount"
                        layout="total,prev, pager, next, jumper"
                        :total="total">
                    </el-pagination>
                </div>
            </div>    
        </div>
        <!-- 对话框 -->
        <el-dialog
            title="编辑库存数"
            :visible.sync="editDialogFormVisible"
            width="30%"
            :before-close="handleClose">
            <el-form :model="editForm" label-position="left" ref="editForm">
                <el-form-item label="库存数量" 
                    :label-width="formLabelWidth"
                     prop="count"
                    :rules="{required: true, message: '请输入库存数', trigger: 'blur'}" 
                >
                    <el-input v-model="editForm.count" clearable auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="cancelForm('editStockNum')">取 消</el-button>
                <el-button type="primary" @click="diffParamsSubmit('editForm')">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
    export default{
        data(){
            return{
                loading:true,
                crrentPage:1,              //当前页码
                pageCount:10,              //当前页面显示条数
                total:0,                   //总数据条数
                //行内元素表单数据
                formInline: {
                    goodsType: '',                        //商品分类
                    goodsKeywords: '',                    //商品关键字
                },
                //商品分类
                goodsTypeArr:[],
                //商品库存数据
                goodsStockArr: [
                    
                ],
                editDialogFormVisible: false,   //编辑对话框
                editForm: {
                    count: '',
                },
                oper_person:'',//用户id
                formLabelWidth: '120px',
                editIndex:-1
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
                        priv_id:'4',
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
                    ""+this.globalData.api+"/ayl_weshopManage/queryGoodsStock",
                    {    
                        goods_type:this.formInline.goodsType,
                        goods_name:this.formInline.goodsKeywords,
                        currentPage:this.crrentPage,
                        pageSize:this.pageCount,
                    },{emulateJSON:true})
                    .then( (res) => {  
                        console.log(res)
                        // 处理成功的结果 
                        var res =   res.body;
                        if(res.error_code==0){
                            var tempArr = res.allType;
                            this.loading = false;
                            this.goodsStockArr = res.rows;
                            tempArr.unshift('全部');
                            this.goodsTypeArr = tempArr;
                            this.total = res.total; 
                        }else{
                            //清零置空
                            this.loading = false;
                            this.goodsStockArr= [];
                            this.total = 0;  
                            console.log('查无数据');
                        }   
                    }).catch(function(res) {  
                        //捕捉异常                 
                        console.log(res);
                        this.loading = false;               
                    }
                );
            },
            //库存编辑提交
            stockEditRequestSubmit(goodsId,count){
                console.log( goodsId,count)
                this.$http.post(
                    ""+this.globalData.api+"/ayl_weshopManage/updateGoodsStock",
                    // "http://172.16.1.41:8080/ayl_weshopManage/updateGoodsStock",
                    {
                        oper_person:this.oper_person,            //用户id
                        goodsId:goodsId,
                        count:count,
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
            //事件-搜索
            goodsSearch() {
                if(this.formInline.goodsType=='全部'){
                    this.formInline.goodsType='';
                }
                this.requestData();
            },
            //事件-当前页变化
            handleCurrentChange(val) {
                // console.log(`当前页: ${val}`);
                this.crrentPage = val;
                this.requestData();
            },
            //事件-编辑库存数
            editStockNum(index,row,name,formName){
                console.log(index, row);
                //打开对话框清除重置
                if(this.$refs[formName]!=undefined){
                    this.$refs[formName].resetFields();
                }
                if(name=='editbtn'){
                    this.editDialogFormVisible  = true;
                    this.editForm.count = row.count;
                    this.editIndex = index;
                }
            },
            //取消对话框，并重置
            cancelForm(name,formName){
                switch(name){
                    //编辑对话框关闭   
                    case 'editStockNum':
                        this.editDialogFormVisible = false;
                        break;      
                }
            },
            //事件-提交表单，根据参数不同来提交
            diffParamsSubmit(formName){
                console.log(formName)
                switch(formName){
                    //编辑商品分类提交
                    case 'editForm':
                        this.$refs[formName].validate((valid) => {
                            if (valid) {
                                console.log('submit!');
                                var model = this.$refs[formName].model,
                                  tempArr =  this.goodsStockArr,
                                  index = this.editIndex,
                                  count = model.count;
                                  console.log( model)
                                if(index!=-1 &&  count!=undefined){
                                    var obj = tempArr[index];
                                    // console.log( obj)
                                    this.stockEditRequestSubmit(obj.goods_id,count); 
                                    this.editDialogFormVisible = false;
                                }
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
    .el-input{
        width:300px;
    }
</style>
