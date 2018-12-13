<template>
    <div class="home" >
        <div class="pulic-header">
            <i  class="fontFamily icon-ayl-shouye icon-shouye"></i>
            <el-breadcrumb separator-class="el-icon-arrow-right" class="">
                <el-breadcrumb-item :to="{ path: '/Backstage' }" >首页</el-breadcrumb-item>
                <el-breadcrumb-item>当前</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="public-main">
            <div class="home-profit">
                <div class="home-profit-up">
                    <i class="fontFamily icon-ayl-jifen icon-yingli"></i>
                    <span class="profit-title">盈利情况</span>
                </div>
                <div class="home-profit-down">
                    <ul class="profit-ul">
                        <li>
                            <i class="fontFamily icon-ayl-weibiaoti- same-icon-size icon-color-ayl-weibiaoti-" ></i>
                            <div class="profit-ul-li-right">
                                <span class="same-span-title">总销售订单(个)</span>
                                <span class="same-num-price">{{totalCount}}</span>
                            </div>
                        </li>
                        <li>
                            <i class="fontFamily icon-ayl-jinrixiaoshoue1 same-icon-size" style="color:#e4803d"></i>
                            <div class="profit-ul-li-right">
                                <span class="same-span-title">今日销售总额(元)</span>
                                <span class="same-num-price">{{todayTotalSale}}</span>
                            </div>
                        </li>
                        <li>
                            <i class="fontFamily icon-ayl-mdbbzuorixiaoshou same-icon-size" style="color:#efb336"></i>
                            <div class="profit-ul-li-right">
                                <span class="same-span-title">昨日销售总额(元)</span>
                                <span class="same-num-price">{{lastDayTotalSale}}</span>
                            </div>
                        </li>
                        <li>
                            <i class="fontFamily icon-ayl-qitianbanli same-icon-size" style="color:#423fa4"></i>
                            <div class="profit-ul-li-right">
                                <span class="same-span-title">近七天销售总额(元)</span>
                                <span class="same-num-price">{{lastSevenDayTotalSale}}</span>
                            </div>
                        </li>
                        <li>
                            <i class="fontFamily icon-ayl-mdbbbenyuexiaoshou same-icon-size" style="color:#efb336"></i>
                            <div class="profit-ul-li-right">
                                <span class="same-span-title">本月销售总额(元)</span>
                                <span class="same-num-price">{{thisMonthTotalSale}}</span>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="home-profit-chart mt30">
                <ul class="profit-chart-ul">
                    <li>
                        <div class="chart-order">
                            <div class="chart-order-header">
                                <span class="span-today-order">今日订单</span>
                                <router-link class="span-more" :to="{path:'/OrderList'}" tag="span"  >更多<i class="el-icon-arrow-right"></i></router-link>
                            </div>
                            <div class="chart-order-table">
                                <template>
                                    <el-table  
                                        :data="todaySaleList"
                                        style="width: 100%">
                                        <el-table-column
                                            label="序号"
                                            type="index"
                                            width="80"
                                        >
                                        </el-table-column>
                                        <el-table-column
                                            prop="order_id"
                                            label="订单编号"
                                            >
                                        </el-table-column>
                                        <el-table-column
                                            prop="ins_time"
                                            label="下单时间">
                                        </el-table-column>
                                        <el-table-column
                                            prop="customer_name"
                                            label="下单昵称">
                                        </el-table-column>
                                        <el-table-column
                                            prop="total_fee"
                                            label="订单金额(元)">
                                        </el-table-column>
                                    </el-table>
                                </template>
                            </div>     
                        </div>   
                    </li>
                    <li>
                        <div class="chart-order">
                            <div class="chart-order-header">
                                <span class="span-today-order">销售商品数</span>
                            </div>
                            <div class="chart-box-wrap">
                                <div class="same-chart-css" id="orderTotalAmount" :style="{ height: '300px'}"></div>
                                <div class="chart-box-right">
                                    <ul class="contrast-ul">
                                        <li>
                                            <span ><i class="same-i-left">今日</i><i class="same-i-right">{{todaySaleGoodsCount}}</i></span>
                                            <span ><i class="same-i-left">比昨日</i><i class="same-i-right">{{(todaySaleGoodsCount-lastDaySaleGoodsCount).toFixed(2)}}</i></span>
                                        </li>
                                        <li>
                                            <span ><i class="same-i-left">本周</i><i class="same-i-right">{{thisWeekSaleGoodsCount}}</i></span>
                                            <span ><i class="same-i-left">比上周同期</i><i class="same-i-right">{{(thisWeekSaleGoodsCount-thisWeekSaleGoodsCount).toFixed(2)}}</i></span>
                                        </li>
                                        <li>
                                            <span ><i class="same-i-left">本月</i><i class="same-i-right">{{thisMonthSaleGoodsCount}}</i></span>
                                            <span ><i class="same-i-left">比上月同期</i><i class="same-i-right">{{(thisMonthSaleGoodsCount-lastMonthSaleGoodsCount).toFixed(2)}}</i></span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div> 
                    </li>
                    <li>
                        <div class="chart-order">
                            <div class="chart-order-header">
                                <span class="span-today-order">订单金额</span>
                            </div>
                            <div class="chart-box-wrap">
                                <div class="same-chart-css" id="collectAmount" :style="{ height: '300px'}"></div>
                                <div class="chart-box-right">
                                    <ul class="contrast-ul">
                                        <li>
                                            <span ><i class="same-i-left">今日</i><i class="same-i-right">{{todayTotalSale}}</i></span>
                                            <span ><i class="same-i-left">比昨日</i><i class="same-i-right">{{(todayTotalSale-lastDayTotalSale).toFixed(2)}}</i></span>
                                        </li>
                                        <li>
                                            <span ><i class="same-i-left">本周</i><i class="same-i-right">{{thisWeekTotalSale}}</i></span>
                                            <span ><i class="same-i-left">比上周同期</i><i class="same-i-right">{{(thisWeekTotalSale-lastWeekTotalSale).toFixed(2)}}</i></span>
                                        </li>
                                        <li>
                                            <span ><i class="same-i-left">本月</i><i class="same-i-right">{{thisMonthTotalSale}}</i></span>
                                            <span ><i class="same-i-left">比上月同期</i><i class="same-i-right">{{(thisMonthTotalSale-lastMonthTotalSale).toFixed(2)}}</i></span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </li>
                    <li>
                        <div class="chart-order">
                            <div class="chart-order-header">
                                <span class="span-today-order">订单数量</span>
                            </div>
                            <div class="chart-box-wrap">
                                <div class="same-chart-css" id="orderNumber" :style="{ height: '300px'}"></div>
                                <div class="chart-box-right">
                                    <ul class="contrast-ul">
                                        <li>
                                            <span ><i class="same-i-left">今日</i><i class="same-i-right">{{todaySaleCount}}</i></span>
                                            <span ><i class="same-i-left">比昨日</i><i class="same-i-right">{{(todaySaleCount-lastDaySaleCount).toFixed(2)}}</i></span>
                                        </li>
                                        <li>
                                            <span ><i class="same-i-left">本周</i><i class="same-i-right">{{thisWeekSaleCount}}</i></span>
                                            <span ><i class="same-i-left">比上周同期</i><i class="same-i-right">{{(thisWeekSaleCount-lastWeekSaleCount).toFixed(2)}}</i></span>
                                        </li>
                                        <li>
                                            <span ><i class="same-i-left">本月</i><i class="same-i-right">{{thisMonthSaleCount}}</i></span>
                                            <span ><i class="same-i-left">比上月同期</i><i class="same-i-right">{{(thisMonthSaleCount-thisMonthSaleCount).toFixed(2)}}</i></span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </li>
                </ul>    
            </div>
        </div>
        
    </div>
</template>
<script>
    // 引入基本模板
    let echarts = require('echarts/lib/echarts')
    // 引入线组件
    require("echarts/lib/chart/bar");
    // 引入提示框和title组件
    require('echarts/lib/component/tooltip')
    require('echarts/lib/component/title') 
    export default {
        name: "home",
        data() {
            return {
                roleId:'',  //用户角色id
                roleName:'',//角色名
                roleDesc:'',   //角色描述
                totalCount:'',//总销售订单数 
                todayTotalSale:'',//今日销售总额
                lastDayTotalSale:'',//昨日销售总额
                lastSevenDayTotalSale:'',//近七天销售总额
                thisMonthTotalSale:'',//本月销售总额
                todaySaleList:[],//今日订单详情
                thisWeekTotalSale:'',//本周销售总额
                lastWeekTotalSale:'',//上周销售总额
                thisMonthTotalSale:'',//本月销售总额
                lastMonthTotalSale:'',//上月销售总额
                todaySaleCount:'',//今日订单数
                lastDaySaleCount:'',//昨日订单数
                thisWeekSaleCount:'',//本周订单数
                lastWeekSaleCount:'',//上周订单数
                thisMonthSaleCount:'',//本月订单数
                lastMonthSaleCount:'',//上月订单数
                todaySaleGoodsCount:'',//今日销售商品数
                lastDaySaleGoodsCount:'',//昨日销售商品数
                thisWeekSaleGoodsCount:'',//本周销售商品数
                lastWeekSaleGoodsCount:'',//上周销售商品数
                thisMonthSaleGoodsCount:'',//本月销售商品数
                lastMonthSaleGoodsCount:'',//上月销售商品数
                loading:true,
            }
        },
        //vue创建实例后，还没有挂载在元素上 ,预先请求ajsx数据
        created() {
            //权限判断
            // var  roleId  = this.globalMethods.getCookie('roleId');
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
        //vue创建实例后，已经挂载在元素上
        mounted() {
            this.loading = false;
            this.requestData();
        },
        //方法
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
            //请求数据
            requestData(){
                this.$http.post(
                    ""+this.globalData.api+"/ayl_weshopManage/portal",    
                    // "http://172.16.1.41:8080/ayl_weshopManage/portal",
                    {   
                        
                    },{emulateJSON:true})
                    .then( (res) => {  
                        console.log(res)
                        // 处理成功的结果 
                        var res =   res.body;
                        if(res.error_code==0){
                            this.totalCount = res.totalCount;  //总销售订单数 
                            this.todayTotalSale = res.todayTotalSale;  //今日销售总额
                            this.lastDayTotalSale = res.lastDayTotalSale;  //昨日销售总额
                            this.lastSevenDayTotalSale = res.lastSevenDayTotalSale;  //近七天销售总额
                            this.thisMonthTotalSale = res.thisMonthTotalSale;  //本月销售总额
                            this.todaySaleList = res.todaySaleList //今日订单详情
                            this.thisWeekTotalSale = res.thisWeekTotalSale;//本周销售总额
                            this.lastWeekTotalSale = res.lastWeekTotalSale;//上周销售总额
                            this.thisMonthTotalSale = res.thisMonthTotalSale; //本月销售总额
                            this.lastMonthTotalSale = res.lastMonthTotalSale; //本月销售总额
                            this.todaySaleCount = res.todaySaleCount; //今日订单数
                            this.lastDaySaleCount = res.lastDaySaleCount; //昨日订单数
                            this.thisWeekSaleCount = res.thisWeekSaleCount; //本周订单数
                            this.lastWeekSaleCount = res.lastWeekSaleCount; //上周订单数
                            this.thisMonthSaleCount = res.thisMonthSaleCount; //本月订单数
                            this.lastMonthSaleCount = res.lastMonthSaleCount; //上月订单数
                            this.todaySaleGoodsCount = res.todaySaleGoodsCount; //今日销售商品数
                            this.lastDaySaleGoodsCount = res.lastDaySaleGoodsCount; //昨日销售商品数
                            this.thisWeekSaleGoodsCount = res.thisWeekSaleGoodsCount; //本周销售商品数
                            this.lastWeekSaleGoodsCount = res.lastWeekSaleGoodsCount; //上周销售商品数
                            this.thisMonthSaleGoodsCount = res.thisMonthSaleGoodsCount; //本月销售商品数
                            this.lastMonthSaleGoodsCount = res.lastMonthSaleGoodsCount; //上月销售商品数

                            //画销售商品数图
                            this.drawGoodsCountList(res.goodsCountList); 
                            //画订单金额 
                            this.drawOrderAmount(res.totalFeeList);
                            //画订单数量图
                            this.drawOrderNumber(res.orderCountList);     
                            
                        }else{
                            this.$message({
                                type:'info',
                                message:'数据查询失败'
                            })
                            console.log('查无数据')
                        }   
                    }).catch(function(res) {  
                        //捕捉异常                 
                        console.log(res);
                        this.loading = false;               
                    }
                );
            },
            //画销售商品数
            drawGoodsCountList(obj){
                // 基于准备好的dom，初始化echarts实例
                let myChart = echarts.init(document.getElementById('orderTotalAmount'))
                // 绘制图表
                myChart.setOption({
                    title : {
                        text: '',
                    },
                    tooltip : {
                        trigger: 'axis'
                    },
                    legend: {
                        data:['销售商品数']
                    },
                    calculable : true,
                    xAxis : [
                        {
                            type : 'category',
                            boundaryGap : false,
                            // data : ['周一','周二','周三','周四','周五','周六','周日']
                            data : obj.x
                        }
                    ],
                    yAxis : [
                        {
                            type : 'value'
                        }
                    ],
                    series : [
                        {
                            name:'销售商品数',
                            type:'line',
                            smooth:true,
                            itemStyle: {normal: {areaStyle: {type: 'default'}}},
                            data:obj.y
                        },
                    ],
                    color:['#409EFF','#67c23a']
                });
            },
            //画订单金额
            drawOrderAmount(obj){
                // 基于准备好的dom，初始化echarts实例
                let myChart = echarts.init(document.getElementById('collectAmount'))
                // 绘制图表
                myChart.setOption({
                    title : {
                        text: '',
                    },
                    tooltip : {
                        trigger: 'axis'
                    },
                    legend: {
                        data:['订单金额']
                    },
                    calculable : true,
                    xAxis : [
                        {
                            type : 'category',
                            boundaryGap : false,
                            data : obj.x
                            // data : ['周一','周二','周三','周四','周五','周六','周日']
                        }
                    ],
                    yAxis : [
                        {
                            type : 'value'
                        }
                    ],
                    series : [
                        {
                            name:'订单金额',
                            type:'line',
                            smooth:true,
                            itemStyle: {normal: {areaStyle: {type: 'default'}}},
                            data:obj.y,
                            //  data:[10, 12, 21, 54, 260, 830, 710]
                        },
                    ],
                    color:['#67c23a']
                });
            },
            //画订单数量图
            drawOrderNumber(obj){
                // 基于准备好的dom，初始化echarts实例
                let myChart = echarts.init(document.getElementById('orderNumber'))
                // 绘制图表
                myChart.setOption({
                    title : {
                        text: '',
                    },
                    tooltip : {
                        trigger: 'axis'
                    },
                    legend: {
                        data:['订单数量']
                    },
                    calculable : true,
                    xAxis : [
                        {
                            type : 'category',
                            boundaryGap : false,
                            data : obj.x,
                            // data : ['周一','周二','周三','周四','周五','周六','周日']
                        }
                    ],
                    yAxis : [
                        {
                            type : 'value'
                        }
                    ],
                    series : [
                        {
                            name:'订单数量',
                            type:'line',
                            smooth:true,
                            itemStyle: {normal: {areaStyle: {type: 'default'}}},
                            data:obj.y,
                            // data:[10, 12, 21, 54, 260, 830, 710]
                        },
                    ]
                });
            }
        }
    };
</script>
<style scoped>
    .home{
        color: #2c3e50;
    }
    
    .public-main{
        padding:20px;
    }
    
    .home-profit{
        border:1px solid rgba(0,0,0,.1);
        border-radius:4px;
    }
    .home-profit-up{
        display:flex;
        align-items:center;
        border-bottom:1px solid rgba(0,0,0,.1);
        padding:15px 10px;
    }
    .icon-yingli{
        font-size: 24px;
    }
    .profit-title{
        font-size:18px;
        margin-left:15px;
    }
    .home-profit-down{

    }
    .profit-ul{
        padding:40px 0px;
        display:flex;
        text-align:center;
        align-items:center;
    }
    
    .profit-ul>li{
        flex:1;
        display:flex;
        align-items:center;
        justify-content:center;
        border-right:1px solid rgba(0,0,0,.1);
        
    }
    .profit-ul>li:nth-last-child(1){
       border-right:none;
    }
    .icon-color-ayl-weibiaoti-{
       color:#1195db;
    }
    .profit-ul-li-right{
        margin-left:15px;
    }
    .same-span-title{
        display: block;
        font-size:14px;
    }
    .same-num-price{
        display: block;
        font-size:24px;
        color:#F62D2D;
        text-align:left;
        margin-top:15px;
    }
    .same-icon-size{
        font-size:56px;
    }
    .profit-chart-ul{
        display: flex;
        flex-wrap:wrap;
        align-items:stretch;
        
    }
    .profit-chart-ul>li{
        flex: 0 0 49.3%;
        margin-bottom:20px;
    }
    .profit-chart-ul>li:nth-child(even){
        margin-left:20px;
    }
    .chart-order{
       border:1px solid rgba(0,0,0,.1);
    }
    .chart-order-header{
       display: flex;
       align-items:center;
       padding:12px 20px;
       font-size:15px;
       color: #2d2f33;
       border-bottom:1px solid rgba(0,0,0,.1);
    }
    .span-more{
        cursor: pointer;
        flex:1;
        text-align:right;
    }
    .chart-order-table{
        padding:0 20px 20px;
    }
    .chart-box-wrap{
        display: flex;
        align-items: stretch;
        padding-right:10px;
    }
    .same-chart-css{
        flex:1;
    }
    .chart-box-right{
        flex-basis:150px;
    }
    .contrast-ul>li{
        padding:20px 0;  
    }
    .contrast-ul>li +li{
        border-top:1px dotted rgba(0,0,0,.1);
    }
    .contrast-ul>li>span{
        display: flex;
        font-size:12px;
    }
    .contrast-ul>li>span + span{
       margin-top:20px;
    }
    .same-i-left{
        flex:1;
    }
    .same-i-right{
        color: #de1e47;
    }
</style>
