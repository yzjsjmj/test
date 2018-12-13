<template>
    <div class="roleList">
        <div class="pulic-header">
            <i  class="fontFamily icon-ayl-shouye icon-shouye"></i>
            <el-breadcrumb separator-class="el-icon-arrow-right" class="">
                <el-breadcrumb-item :to="{ path: '/Backstage' }" >首页</el-breadcrumb-item>
                <el-breadcrumb-item :to="{ path: '/MemberList' }">会员列表</el-breadcrumb-item>
                <el-breadcrumb-item>会员详情</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
         <div class="public-box" >
            <div class="public-box-wrap">
                <template>
                    <el-tabs v-model="activeName"  @tab-click="tabsClick">
                        <el-tab-pane label="会员基本信息" name="first">
                            <div class="unit-wrap mt15">
                                <el-table
                                    :data="memberBasicInfoTableArr"
                                    border
                                    v-loading="loading"
                                    :header-row-style="headerColor"
                                    style="width: 100%">
                                    <el-table-column
                                        prop="wx_nickname"  
                                        label="昵称"  align="center"
                                    >
                                    </el-table-column>
                                    <el-table-column
                                        prop="level"  width="200"
                                        label="等级"  align="center"
                                    >
                                    </el-table-column>
                                    <el-table-column
                                        prop="goods_count"  width="140"
                                        label="购买数量"  align="center"
                                    >
                                    </el-table-column>
                                    <el-table-column
                                        prop="total_fee" width="120"
                                        label="总消费金额"  align="center"
                                    >
                                    </el-table-column>
                                    <el-table-column
                                        prop="first_accredit_time"  width="160"
                                        label="注册时间"  align="center"
                                    >
                                    </el-table-column>
                                </el-table>
                            </div>  
                        </el-tab-pane>
                        <el-tab-pane label="购买商品记录" name="second">
                            <div class="unit-wrap mt15">
                                <el-table
                                    :data="buyGoodsTableArr"
                                    border
                                    :header-row-style="headerColor"
                                    v-loading="loading"
                                    style="width: 100%">
                                    <el-table-column
                                        label="订单号" align="center"
                                        prop="order_id"
                                        width="200">
                                    </el-table-column>
                                    <el-table-column
                                        prop="ins_time"  width="200"
                                        label="下单时间"  align="center"
                                    >
                                    </el-table-column>
                                    <el-table-column
                                        prop="goods_name" 
                                        label="商品名称"  align="center"
                                    >
                                   
                                    </el-table-column>
                                    <el-table-column
                                        prop="goods_color_attr" width="120"
                                        label="颜色"  align="center"
                                    >
                                    </el-table-column>
                                    <el-table-column
                                        prop="act_price"  width="140"
                                        label="价格(元)"  align="center"
                                    >
                                    </el-table-column>
                                    <el-table-column
                                        prop="goods_num" width="120"
                                        label="数量"  align="center"
                                    >
                                    </el-table-column>
                                </el-table>
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
                        </el-tab-pane>
                    </el-tabs>
                </template>   
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
                loading:true,           //加载
                activeName: 'first',
                openid:'',                  //用户openid
                //会员基本信息
                memberBasicInfoTableArr:[
                    
                ],
                //商品购买记录
                buyGoodsTableArr:[
                    
                ]
            }
        },
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
                            var openid = this.openid = this.$route.params.openid;
                            if(openid){
                                this.requestData();
                            }else{
                                this.$message({
                                    type:'warning',
                                    message:'无用户id,已返回上一页'
                                })
                                setTimeout(()=>{
                                    this.$router.go(-1);
                                },200)
                            }
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
                    ""+this.globalData.api+"/ayl_weshopManage/getMemberBasicInfo",
                    {
                        openid:this.openid,
                    },{emulateJSON:true})
                    .then( (res) => {  
                        console.log(res)
                        // 处理成功的结果 
                        var res =   res.body;
                        if(res.error_code==0){
                            var tempArr = this.memberBasicInfoTableArr;
                            tempArr = tempArr.push(res.memberInfo);
                            this.loading = false;  
                        }else{
                            console.log('查无数据');
                            this.memberBasicInfoTableArr = [];     
                        }  
                        
                    }).catch(function(res) {  
                        //捕捉异常  
                        this.loading = false;        
                        console.log(res)               
                    }
                );
            },
            //请求商品购买记录数据
            requestGoodsRecordData(){
                this.$http.post(
                    ""+this.globalData.api+"/ayl_weshopManage/getPurchaseRecord",
                    {
                        openid:this.openid,
                        page:this.crrentPage,
                        pageSize:this.pageCount,
                    },{emulateJSON:true})
                    .then( (res) => {  
                        console.log(res)
                        // 处理成功的结果 
                        var res =   res.body;
                        if(res.error_code==0){
                            var tempArr = res.rows;
                            tempArr.forEach((v,i) => {
                                switch(v.status){
                                    case '1':
                                        v.status = '待付款';
                                        break;
                                    case '2':
                                        v.status = '待发货';
                                        break;
                                    case '3':
                                        v.status = '已发货';
                                        break;
                                    case '4':
                                        v.status = '已完成';
                                        break;
                                    case '5':
                                        v.status = '已取消';
                                        break;            
                                }
                            });
                            this.buyGoodsTableArr = tempArr;
                            this.loading = false;  
                            this.total = res.total;
                        }else{
                            console.log('查无数据')
                            this.buyGoodsTableArr = [];
                            this.loading = false;    
                        }  
                        
                    }).catch(function(res) {  
                        //捕捉异常  
                        this.loading = false;                
                        console.log(res)               
                    }
                );
            },
            //事件-选项卡点击
            tabsClick(tab, event) {
                console.log(this.activeName);
                if(this.activeName=='second'){
                    this.requestGoodsRecordData();
                }
            },
            //事件-当前页变化
            handleCurrentChange(val) {
                console.log(`当前页: ${val}`);
                this.crrentPage = val;
                this.requestGoodsRecordData();
            },
            //表头颜色
            headerColor({row, rowIndex}){
                return  this.globalMethods.tabelHeaderColor();
            },    
        }
    }
</script>
<style scoped>

</style>

