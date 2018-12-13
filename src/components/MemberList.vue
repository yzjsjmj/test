<template>
    <div class="memberList">
        <div class="pulic-header">
            <i  class="fontFamily icon-ayl-shouye icon-shouye"></i>
            <el-breadcrumb separator-class="el-icon-arrow-right" class="">
                <el-breadcrumb-item :to="{ path: '/Backstage' }" >首页</el-breadcrumb-item>
                <el-breadcrumb-item>会员列表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="public-box" >
            <div class="public-box-wrap">
                <div class="inline-form-wrap">
                    <el-form :inline="true" 
                    :model="formInline" class="demo-form-inline">
                        <el-form-item label="" >
                            <el-input  v-model="formInline.nickNameKeywords"   placeholder="昵称关键字" clearable></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" icon="el-icon-search"  @click="goodsSearch">搜索</el-button>
                        </el-form-item>
                    </el-form>  
                </div>
                <template>
                    <el-table
                        ref="multipleTable"  
                        :data="memberListArr"
                        border
                        v-loading="loading"
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
                            label="微信名称" align="center" 
                            prop="wx_nickname"
                            >
                        </el-table-column>
                        <el-table-column
                            label="等级" align="center"  width="120"
                            prop="level"
                            >
                        </el-table-column>
                        <el-table-column
                            label=" 折扣(%)" align="center"  width="120"
                            prop="rebate"
                            >
                        </el-table-column>
                        <el-table-column
                            label="销售数量" align="center"  width="120"
                            prop="goods_count"
                            >
                        </el-table-column>
                        <el-table-column
                            label="总销售价格(元)" align="center"  width="160"
                            prop="total_fee"
                            >
                        </el-table-column>
                        <el-table-column
                            label="首次授权时间" align="center"  
                            prop="first_accredit_time"
                            >
                        </el-table-column>
                        <el-table-column label="操作"  width="180" align="center">
                            <template slot-scope="scope">
                                <el-button
                                   size="mini" type="text"
                                @click="linkMemberDetais(scope.$index, scope.row)">查看详情</el-button>
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
                    nickNameKeywords: '',                    //商品关键字
                },
                 //会员列表数据
                memberListArr: [
                ],
            }
        },
        //vue创建实例后，还没有挂载在元素上 ,预先请求ajsx数据
        created () {
            //权限判断
            var  roleId  = this.globalMethods.getCookie('roleId');
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
                        priv_id:'5',
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
            //请求会员列表数据加载
            requestData(){
                this.$http.post(
                    ""+this.globalData.api+"/ayl_weshopManage/queryMemberList",
                    {
                        customer_name:this.formInline.nickNameKeywords,
                        currentPage:this.crrentPage,
                        pageSize:this.pageCount,
                    },{emulateJSON:true})
                    .then( (res) => {  
                        console.log(res)
                        // 处理成功的结果 
                        var res =   res.body;
                        if(res.error_code==0){
                            this.loading = false;
                            this.memberListArr = res.rows;
                            this.total = res.total;
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
            //事件-当前页变化
            handleCurrentChange(val) {
                // console.log(`当前页: ${val}`);
                this.crrentPage = val;
                this.requestData();
            },
             //事件-搜索
            goodsSearch() {
                this.requestData();
            },
            //事件-链接查看详情组件
            linkMemberDetais(index,row){
                this.$router.push({name:'MemberDetails',params:{openid:row.wx_openid}})
            },
            //表头颜色
            headerColor({row, rowIndex}){
                return  this.globalMethods.tabelHeaderColor();
            },
        }
    }
</script>
<style scoped>
    .el-input{
        width:300px;
    }
    .pagination-wrap{
        margin-top:40px;
        text-align: center;
    }
</style>

