<template>
    <div class="salesReport">
        <div class="pulic-header">
            <i  class="fontFamily icon-ayl-shouye icon-shouye"></i>
            <el-breadcrumb separator-class="el-icon-arrow-right" class="">
                <el-breadcrumb-item :to="{ path: '/Backstage' }" >首页</el-breadcrumb-item>
                <el-breadcrumb-item>销售报表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="public-box" v-loading="loading" >
            <el-form   class="demo-form-inline" :inline="true"  ref="formInline"
                :model="formInline" :rules="rules">
                <div class="inline-form-wrap">
                    <el-form-item label="">
                        <el-radio-group v-model="formInline.selectTimeStr" @change="selectTimeBtn">
                            <el-radio-button label="thisWeek" >本周</el-radio-button>
                            <el-radio-button label="lastWeek">上周</el-radio-button>
                            <el-radio-button label="thisMonth">本月</el-radio-button>
                            <el-radio-button label="lastMonth">上月</el-radio-button>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="" required>
                        <el-form-item prop="date1">
                            <el-date-picker 
                                type="month" placeholder="开始时间"
                                v-model="formInline.date1" >
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item prop="date2">
                            <el-date-picker 
                                type="month" placeholder="结束时间"
                                v-model="formInline.date2" >
                            </el-date-picker>
                        </el-form-item>    
                    </el-form-item>
                    <el-form-item label="">
                       <el-button type="primary" icon="el-icon-search"
                         @click="timeSearchData('formInline')"
                       >搜 索</el-button>
                    </el-form-item>
                    <div class="other-operate-btn">
                        <form name="formExcle"
                        :action="importUrl+'status='+status+'&beginTime='+beginTime+'&endTime='+ endTime"
                         method="post" enctype="multipart/form-data"  >
                            <el-button type="success" icon="el-icon-upload2" @click="exportData">导出</el-button>
                        </form>
                    </div>   
                </div>
                <div class="public-box-wrap mt30">
                    <div class="queryOrderInfo-header">
                        <ul class="queryOrderInfo-ul">
                            <li>
                                <span>订单</span>
                                <span>{{allOrderStatisticalInfo.order_num}}笔</span>
                            </li>
                            <li>
                                <span>优惠金额</span>
                                <span>-¥{{allOrderStatisticalInfo.total_discount_fee}}</span>
                            </li>
                            <li>
                                <span>实际总金额</span>
                                <span>¥{{allOrderStatisticalInfo.all_fee}}</span>
                            </li>
                            <li>
                                <span>最高总金额</span>
                                <span>¥{{allOrderStatisticalInfo.max_fee}}</span>
                            </li>
                            <li>
                                <span>最低总金额</span>
                                <span>¥{{allOrderStatisticalInfo.min_fee}}</span>
                            </li>
                        </ul>
                    </div>
                    <div class="queryOrderInfo-chart-table">
                        <div class="queryOrderInfo-tabs">
                            <el-tabs type="card" v-model="activeName" @tab-click="switchTabs">
                                <el-tab-pane label="按订单统计"  name="first">
                                    <span slot="label"><i class="fontFamily icon-ayl-dingdanguanli"></i> 按订单统计</span>
                                    <div class="inline-form-wrap mt10">
                                        <el-form-item label="">
                                            <el-select v-model="formInline.typeTotal" @change="changeTotalType" >
                                                <el-option label="按金额合计" value="amountTotal">按金额合计</el-option>
                                            </el-select>
                                        </el-form-item>
                                        <div class="other-operate-btn ">
                                            <el-form-item label="">
                                                <el-radio-group v-model="formInline.selectCycle" @change="changeCycle">
                                                    <div v-if="dayif<=31">
                                                        <el-radio-button label="day" >按天</el-radio-button>
                                                        <el-radio-button label="week" >按周</el-radio-button>
                                                        <el-radio-button label="month">按月</el-radio-button>
                                                    </div>
                                                    <div v-else-if="31<dayif && dayif<=61 ">
                                                        <el-radio-button label="week">按周</el-radio-button>
                                                        <el-radio-button label="month" >按月</el-radio-button>
                                                    </div>
                                                    <div  v-else>
                                                        <el-radio-button label="month" >按月</el-radio-button>
                                                    </div>
                                                </el-radio-group>
                                            </el-form-item>
                                        </div>   
                                    </div>
                                    <div class="same-chart-css" ref="secondTab" id="orderTotalChart" :style="{ height:'400px'}"></div>
                                    <template>
                                        <el-table
                                            ref="multipleTable"  
                                            :data="statisticsTableData.rows"
                                            border
                                            :header-row-style="headerColor"
                                            tooltip-effect="dark"
                                            style="width: 100%;"
                                        >
                                            <el-table-column
                                                label='日期' align="center"
                                                prop="count_time"
                                                >
                                            </el-table-column>
                                            <el-table-column
                                                label="订单数量" align="center"    width="180"
                                                prop="order_num"
                                            >
                                            </el-table-column>
                                            <el-table-column
                                                label="订单客户数" align="center"  width="180"
                                                prop="customer_num"
                                                >
                                            </el-table-column>
                                            <el-table-column
                                                label="优惠金额(元)" align="center"  width="180"
                                                prop="total_discount_fee"
                                                >
                                            </el-table-column>
                                            <el-table-column
                                                label="实际总金额(元)" align="center"  width="180"
                                                prop="all_fee"
                                                >
                                            </el-table-column>
                                            <el-table-column
                                                label="最高总金额(元)" align="center"  width="180"
                                                prop="max_fee"
                                                >
                                            </el-table-column>
                                            <el-table-column
                                                label="最低总金额(元)" align="center"  width="180"
                                                prop="min_fee"
                                                >
                                            </el-table-column>
                                        </el-table>
                                        <div class="pagination-wrap">
                                            <el-pagination
                                                @current-change="handleCurrentChange1"
                                                background
                                                :current-page="crrentPage"
                                                :page-size="pageCount"
                                                layout="total,prev, pager, next, jumper"
                                                :total="total" >
                                            </el-pagination>
                                        </div> 
                                    </template>
                                </el-tab-pane>
                                 <!-- 按商品统计 -->
                                <el-tab-pane  label="按商品统计" name="second" style="width:100%">
                                    <span slot="label"><i class="fontFamily icon-ayl-shangpinguanli "></i> 按商品统计</span>
                                    <div class="inline-form-wrap mt10">
                                        <el-form-item label="">
                                            <el-select v-model="formInline.typeTotal" @change="changeTotalType" >
                                                <el-option label="按金额合计" value="amountTotal">按金额合计</el-option>
                                            </el-select>
                                        </el-form-item>
                                        <el-form-item label="">
                                            <el-radio-group v-model="formInline.selectField" @change="changeField">
                                                <el-radio label="fieldGoodsName">按商品名称统计</el-radio>
                                                <el-radio label="fieldGoodsType">按商品分类统计</el-radio>
                                            </el-radio-group>
                                        </el-form-item>   
                                    </div>
                                    <div class="same-chart-css mt20"  id="goodsTotalChart" :style="{width:chartWidth,height:'400px'}"></div>
                                     <template>
                                        <el-table
                                            ref="multipleTable"  
                                            :data="status=='2-type'?statisticsTableGoodsArr:statisticsTableData.rows"
                                            border
                                            :header-row-style="headerColor"
                                            tooltip-effect="dark"
                                            style="width: 100%;margin-top:40px"
                                        >
                                            <el-table-column
                                                :label="status=='2-name'?'商品名称':'商品分类'" align="center"
                                                :prop="status=='2-name'?'goods_name':'goods_type'"
                                                >
                                            </el-table-column>
                                            <el-table-column
                                                label="订单" align="center"    width="180"
                                                prop="order_num"
                                            >
                                            </el-table-column>
                                            <el-table-column
                                                label="订货数量" align="center"    width="180"
                                                prop="goods_count"
                                            >
                                            </el-table-column>
                                            
                                            <el-table-column
                                                label="优惠金额(元)" align="center"  width="180"
                                                prop="discount_fee"
                                                >
                                            </el-table-column>
                                            <el-table-column
                                                label="实际总金额(元)" align="center"  width="180"
                                                prop="goods_total_fee"
                                                >
                                            </el-table-column>
                                        </el-table>
                                        <div class="pagination-wrap" v-if="status=='2-name'">
                                            <el-pagination
                                                @current-change="handleCurrentChange2"
                                                background
                                                :current-page="crrentPage"
                                                :page-size="pageCount"
                                                layout="total,prev, pager, next, jumper"
                                                :total="total" >
                                            </el-pagination>
                                        </div>  
                                    </template>
                                </el-tab-pane>
                            </el-tabs>
                        </div>
                    </div>
                </div>
             </el-form>    
        </div>
    </div>
</template>
<script>
   /**
    * 获取本周、本季度、本月、上月的开始日期、结束日期
    */
    var now = new Date(); //当前日期 
    var nowDayOfWeek = now.getDay(); //今天本周的第几天 
    var nowDay = now.getDate(); //当前日 
    var nowMonth = now.getMonth(); //当前月 
    var nowYear = now.getYear(); //当前年 
    nowYear += (nowYear < 2000) ? 1900 : 0; //

    var lastMonthDate = new Date(); //上月日期
    lastMonthDate.setDate(1);
    lastMonthDate.setMonth(lastMonthDate.getMonth()-1);
    var lastYear = lastMonthDate.getYear();
    var lastMonth = lastMonthDate.getMonth();

    //格式化日期：yyyy-MM-dd 
    function formatDate(date) { 
        var myyear = date.getFullYear(); 
        var mymonth = date.getMonth()+1; 
        var myweekday = date.getDate(); 
        if(mymonth < 10){ 
        mymonth = "0" + mymonth; 
        } 
        if(myweekday < 10){ 
        myweekday = "0" + myweekday; 
        } 
        return (myyear+"-"+mymonth + "-" + myweekday); 
    }
    //获得某月的天数 
    function getMonthDays(myMonth){ 
        var monthStartDate = new Date(nowYear, myMonth, 1); 
        var monthEndDate = new Date(nowYear, myMonth + 1, 1); 
        var days = (monthEndDate - monthStartDate)/(1000 * 60 * 60 * 24); 
        return days; 
    }
    //获得本周的开始日期 
    function getWeekStartDate() { 
        var weekStartDate = new Date(nowYear, nowMonth, nowDay - nowDayOfWeek+1); 
        return formatDate(weekStartDate); 
    } 

    //获得本周的结束日期 
    function getWeekEndDate() { 
        var weekEndDate = new Date(nowYear, nowMonth, nowDay + (6 - nowDayOfWeek+1)); 
        return formatDate(weekEndDate); 
    }
    //获得上周的开始日期
    function getLastWeekStartDate() {
        var weekStartDate = new Date(nowYear, nowMonth, nowDay - nowDayOfWeek - 7+1);
        return formatDate(weekStartDate);
    }
    //获得上周的结束日期
    function getLastWeekEndDate() {
        var weekEndDate = new Date(nowYear, nowMonth, nowDay - nowDayOfWeek - 1+1);
        return formatDate(weekEndDate);
    } 
    //获得本月的开始日期 
    function getMonthStartDate(){ 
        var monthStartDate = new Date(nowYear, nowMonth, 1); 
        return formatDate(monthStartDate); 
    } 

    //获得本月的结束日期 
    function getMonthEndDate(){ 
        var monthEndDate = new Date(nowYear, nowMonth, getMonthDays(nowMonth)); 
        return formatDate(monthEndDate); 
    }

    //获得上月开始时间
    function getLastMonthStartDate(){
        var tempYear = new Date().getFullYear();
        if(nowMonth==0){
            tempYear = tempYear -1;   
        }
        var lastMonthStartDate = new Date(tempYear, lastMonth, 1); 
        return formatDate(lastMonthStartDate); 
    }

    //获得上月结束时间
    function getLastMonthEndDate(){
        var tempYear = new Date().getFullYear();
        if(nowMonth==0){
            tempYear = tempYear -1;   
        }
        var lastMonthEndDate = new Date(tempYear, lastMonth, getMonthDays(lastMonth));
        return formatDate(lastMonthEndDate); 
    }
    // 引入基本模板
    let echarts = require('echarts/lib/echarts')
    // 引入线组件
    require("echarts/lib/chart/bar");
    // 引入饼组件
    require("echarts/lib/chart/pie");
    // 引入提示框和title组件
    require('echarts/lib/component/tooltip')
    require('echarts/lib/component/title') 
    export default{
        data(){
            return{
                importUrl:this.globalData.api+'/ayl_weshopManage/getStatisticalInfoByExcle?',
                loading:true,
                crrentPage:1,   //当前页码
                pageCount:10,   //当前页面显示条数
                total:0,         //总数据条数
                beginTime:'',     //请求参数开始时间
                endTime:'',       //请求参数结束时间
                status:'1-day',       //按参数状态请求
                chartWidth:'',            //图表宽度
                activeName:'first',
                dayif:0,    //判断结束时间大于开始时间多少
                allOrderStatisticalInfo:{},//时间段内总订单统计数据
                statisticsChartData:{},   //统计图数据
                statisticsTableData:{}, //订单统计表格
                statisticsTableGoodsArr:[], //订单表格商品统计
               //行内元素表单数据
                formInline: {
                    date1:'',                         //时间1
                    date2:'',                         //时间2
                    selectTimeStr:'thisMonth',       //strBtn 本周，上周，本月，上月
                    typeTotal:'按金额统计',             // 按类型统计，默认按金额统计
                    selectCycle:'day',               //按天，周，月筛选
                    selectField:'fieldGoodsName',         //按什么字段统计，默认按商品名字
                },
                rules:{
                    date1: [
                        { required: true, message: '请选择开始时间', trigger: 'change' }
                    ],
                    date2: [
                        {  required: true, message: '请选择结束时间', trigger: 'change' }
                    ],
                }
            }
            
        },
        created(){
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
        //vue创建实例后，已经挂载在元素上
        mounted() {
            //将第一个选项卡元素的宽度赋给你个变量
            this.chartWidth = this.$refs.secondTab.getBoundingClientRect().width+'px';
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
                        priv_id:'8',
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
            requestData(beginTime,endTime,status){
                this.$http.post(
                    ""+this.globalData.api+"/ayl_weshopManage/getStatisticalInfo",
                    // "http://172.16.1.39:8080/ayl_weshopManage/getStatisticalInfo",
                    {   
                        currentPage:this.crrentPage,
                        pageSize:this.pageCount,
                        beginTime:beginTime!=undefined?beginTime:this.beginTime, //开始时间
                        endTime:endTime!=undefined?endTime:this.endTime,  //结束时间
                        status:status!=undefined?status:this.status,   //参数不同状态
                    },{emulateJSON:true})
                    .then( (res) => {  
                        console.log(res)
                        // 处理成功的结果 
                        var res =   res.body;
                        if(res.error_code==0){
                            this.loading = false;
                            this.allOrderStatisticalInfo = res.allOrderStatisticalInfo;
                            this.statisticsChartData = res.statisticsChartData;
                            //如果是按商品类型统计变量statisticsTableGoodsArr接收，反之
                            if(this.status == '2-type'){
                                this.statisticsTableGoodsArr = res.statisticsTableData
                            }else{
                                this.statisticsTableData = res.statisticsTableData;
                            }
                            this.total = res.statisticsTableData.total;
                            if(this.status =='2-name' || this.status =='2-type'){
                                 //画商品统计饼图
                                 switch(this.status){
                                    case '2-name':
                                        if(this.crrentPage==1){
                                           this.drawGoodsTotalPie(this.statisticsChartData,'name');
                                        }
                                        break;
                                    case '2-type':
                                        if(this.crrentPage==1){
                                            this.drawGoodsTotalPie(this.statisticsChartData,'type');
                                        }
                                        break;      
                                 }    
                            }else{
                                //订单统计线性图                           
                                this.drawOrderTotalLine(this.statisticsChartData,'name');         
                            }
                            
                            
                        }else{
                            //清零置空
                            this.$message({
                                type:'error',
                                message:'数据查询失败'
                            })
                            this.total= 0;
                            this.allOrderStatisticalInfo={};  //时间段内总订单统计数据  
                            this.statisticsChartData={}; //统计图数据
                            this.statisticsTableData={};  //订单统计表格
                            this.loading = false;
                            console.log('查无数据')
                        }   
                    }).catch(function(res) {  
                        //捕捉异常                 
                        console.log(res);  
                        this.loading = false;       
                    }
                );
            },
            //事件-选择本周，本月，上周，上月  默认切换到原始加载
            selectTimeBtn(val){
                switch(val){
                    //本周 
                    case 'thisWeek':
                        console.log(getWeekStartDate(),getWeekEndDate());
                        this.beginTime = getWeekStartDate();
                        this.endTime = getWeekEndDate();
                        this.formInline.date1 = '';
                        this.formInline.date2 = '';
                        this.status="1-day";
                        this.dayif = 0;
                        this.activeName = 'first';
                        this.formInline.selectCycle = 'day';
                        this.crrentPage = 1;
                        this.loading = true;
                        this.requestData();
                        break;
                    //上周    
                    case 'lastWeek':
                        console.log(getLastWeekStartDate(),getLastWeekEndDate());
                        this.beginTime = getLastWeekStartDate();
                        this.endTime = getLastWeekEndDate();
                        this.formInline.date1 = '';
                        this.formInline.date2 = '';
                        this.status="1-day";
                        this.activeName = 'first';
                        this.formInline.selectCycle = 'day';
                        this.dayif = 0;
                        this.crrentPage = 1;
                        this.loading = true;
                        this.requestData();
                        break;
                    //本月        
                    case 'thisMonth':
                        console.log(getMonthStartDate(),getMonthEndDate());
                        this.beginTime = getMonthStartDate();
                        this.endTime = getMonthEndDate();
                        this.formInline.date1 = '';
                        this.formInline.date2 = '';
                        this.status="1-day";
                        this.activeName = 'first';
                        this.formInline.selectCycle = 'day';
                        this.dayif = 0;
                        this.crrentPage = 1;
                        this.loading = true;
                        this.requestData();
                        break;
                    //上月     
                    case 'lastMonth':
                        console.log(getLastMonthStartDate(),getLastMonthEndDate());
                        this.beginTime = getLastMonthStartDate();
                        this.endTime = getLastMonthEndDate();
                        this.formInline.date1 = '';
                        this.formInline.date2 = '';
                        this.status="1-day";
                        this.activeName = 'first';
                        this.formInline.selectCycle = 'day';
                        this.dayif = 0;
                        this.crrentPage = 1;
                        this.loading = true;
                        this.requestData();
                        break;       
                }
            },
            //按时间搜索
            timeSearchData(formName){
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        var beginTime = this.formInline.date1,
                        endTime = this.formInline.date2,
                        timestampBegin = 0, timestampEnd = 0;
                        timestampBegin = Date.parse(new Date(beginTime));
                        timestampEnd = Date.parse(new Date(endTime));
                        // console.log(beginTime,endTime )
                        // console.log(timestampBegin,timestampEnd ) 
                        //比较选择的先后时间
                        if(timestampBegin>=timestampEnd){
                            this.$message({
                                type:'warning',
                                message:'开始时间不能大于结束时间'
                            })
                        }else{
                            // console.log('搜索成功!');
                            //格式化处理选择时间
                            beginTime = this.globalMethods.formatTimeYearMonth(beginTime);
                            endTime = this.globalMethods.formatTimeYearMonth(endTime);
                            console.log(beginTime,endTime);
                            this.beginTime = beginTime;
                            this.endTime = endTime;
                            this.crrentPage = 1;
                            this.loading = true;
                            this.formInline.selectTimeStr = '';
                            if(typeof beginTime == Object){
                               timestampBegin = new Date(beginTime); 
                            }
                            if(typeof endTime == Object){
                               timestampEnd = new Date(endTime); 
                            }
                            var dayif = (timestampEnd - timestampBegin)/(1000*3600*24);
                            this.activeName = 'first';
                            console.log(dayif);
                            if(dayif<=31){
                                console.log("1-day");
                                this.dayif = dayif;
                                this.status = '1-day';
                                this.formInline.selectCycle = 'day';
                                this.requestData();
                            }else if( 31<dayif && dayif<=61 ){
                                console.log("1-week");
                                this.dayif = dayif;
                                this.status = '1-week';
                                this.formInline.selectCycle = 'week';
                                this.requestData();
                            }else {
                                console.log("1-month");
                                this.dayif = dayif;
                                this.status = '1-month';
                                this.formInline.selectCycle = 'month';
                                this.requestData();
                            }
                        } 
                    } else {
                        console.log('搜索失败');
                        return false;
                    }
                });
            },
            //事件-导出
            exportData(){
                var beginTime = this.formInline.date1,
                    endTime = this.formInline.date2,
                    timestampBegin = 0, timestampEnd = 0;
                console.log(this.beginTime,this.endTime );
                if( beginTime!='' && endTime!='' ){
                   timestampBegin = Date.parse(new Date(beginTime));
                   timestampEnd = Date.parse(new Date(endTime));
                }else{
                   var value = this.formInline.selectTimeStr;
                   switch(value){
                       case 'thisWeek':
                            //数据变化之后立即使用 
                            this.$nextTick(function () {
                               this.beginTime  = getWeekStartDate();
                               this.endTime  = getWeekEndDate();
                            })
                            beginTime = getWeekStartDate();
                            endTime = getWeekEndDate();
                            timestampBegin = Date.parse(new Date(beginTime));
                            timestampEnd = Date.parse(new Date(endTime));
                            break;
                        case 'lastWeek':
                            //数据变化之后立即使用 
                            this.$nextTick(function () {
                               this.beginTime  = getLastWeekStartDate();
                               this.endTime  = getLastWeekEndDate();   
                            })
                            beginTime = getLastWeekStartDate();
                            endTime = getLastWeekEndDate();
                            timestampBegin = Date.parse(new Date(beginTime));
                            timestampEnd = Date.parse(new Date(endTime));
                            break;
                        case 'thisMonth':
                            //数据变化之后立即使用 
                            this.$nextTick(function () {
                               this.beginTime  = getMonthStartDate();
                               this.endTime  = getMonthEndDate(); 
                            })
                            beginTime = getMonthStartDate();
                            endTime = getMonthEndDate();
                            timestampBegin = Date.parse(new Date(beginTime));
                            timestampEnd = Date.parse(new Date(endTime));
                            break;
                        case 'lastMonth':
                            //数据变化之后立即使用 
                            this.$nextTick(function () {
                               this.beginTime  = getLastMonthStartDate();
                               this.endTime  = getLastMonthEndDate();
                            })
                            beginTime = getLastMonthStartDate();
                            endTime = getLastMonthEndDate();
                            timestampBegin = Date.parse(new Date(beginTime));
                            timestampEnd = Date.parse(new Date(endTime));
                            break;    
                   }
                }
                //比较选择的先后时间
                if(timestampBegin>=timestampEnd){
                    this.$message({
                        type:'warning',
                        message:'开始时间不能大于结束时间'
                    })
                }else{
                    
                    var tempArr1 = this.statisticsTableData.rows,
                     tempArr2 = this.statisticsTableGoodsArr;
                    if(tempArr1.length!=0 || tempArr2.length!=0){
                        
                        document.forms['formExcle'].submit();
                    }else{
                        this.$message({
                            type:'warning',
                            message:'无数据可导出'
                        })
                    }  
                }    
            },
            //事件-切换选项卡
            switchTabs(val){
                if(this.activeName =='first'){
                    this.status= '1-day';
                    this.crrentPage = 1;
                    this.loading = true;
                    this.requestData();
                }else{
                    this.status="2-name";
                    this.formInline.selectField = 'fieldGoodsName';
                    this.crrentPage = 1;
                    this.loading = true;
                    this.requestData();
                }
            },
            //按类型统计
            changeTotalType(value){
                console.log(value)
            },
            //事件-按周期选择(按天，周，月)
            changeCycle(val){
                console.log(val)
                switch(val){
                    //按天
                    case 'day':
                        this.status = '1-day';
                        this.crrentPage =1;
                        this.loading = true;
                        this.requestData();
                        break;
                    //按周    
                    case 'week':
                        this.status = '1-week';
                        this.crrentPage =1;
                        this.loading = true;
                        this.requestData();
                        break;
                    //按月        
                    case 'month':
                        this.status = '1-month';
                        this.crrentPage =1;
                        this.loading = true;
                        this.requestData();
                        break;
                }
            },
            //按字段统计(商品名称，分类)
            changeField(value){
                switch(value){
                    case 'fieldGoodsName':
                        this.status = '2-name';
                        this.crrentPage =1;
                        this.loading = true;
                        console.log(this.status)
                        this.requestData();
                        break;
                    case 'fieldGoodsType':
                        this.crrentPage =1;
                        this.status = '2-type';
                        this.loading = true;
                        console.log(this.status)
                        this.requestData();
                        break;    
                }
                console.log(value)
            },
            //表头颜色
            headerColor({row, rowIndex}){
                return  this.globalMethods.tabelHeaderColor();
            },
            //事件-当前页变化
            handleCurrentChange1(val) {
                if(this.status=='1-day' ||this.status=='1-week' ||this.status=='1-month' ){
                    console.log(`当前页: ${val}`);
                    this.crrentPage = val;
                    this.loading = true;
                    this.requestData();
                }    
            },
            handleCurrentChange2(val) {
                if(this.status=='2-name' || this.status == '2-type' ){
                    console.log(`当前页: ${val}`);
                    this.crrentPage = val;
                    this.loading = true;
                    this.requestData();
                }
            },
            //画订单统计线性图
            drawOrderTotalLine(obj){
                // 基于准备好的dom，初始化echarts实例
                // console.log(obj)
                let myChart = echarts.init(document.getElementById('orderTotalChart'))
                // 绘制图表
                myChart.setOption({
                    title : {
                        text: '',
                    },
                    tooltip : {
                        trigger: 'axis'
                    },
                    legend: {
                        data:['按天']
                    },
                    calculable : true,
                    xAxis : [
                        {
                            type : 'category',
                            boundaryGap : false,
                            data : obj.abscissa
                        }
                    ],
                    yAxis : [
                        {
                            type : 'value'
                        }
                    ],
                    series : [
                        {
                            name:'实际总金额',
                            type:'line',
                            smooth:true,
                            // itemStyle: {normal: {areaStyle: {type: 'default'}}},
                            data:obj.ordinate
                        },
                    ]
                });
            },
            //画商品统计饼图
            drawGoodsTotalPie(arrData,str){
                // 基于准备好的dom，初始化echarts实例
                let myChart = echarts.init(document.getElementById('goodsTotalChart'))
                // 绘制图表
                var nameArr = [];
                if(arrData!=undefined){
                    arrData.forEach((v,i)=>{
                        if(v.name.length>10){
                           v.name =  v.name.substr(0,12)
                        }
                        nameArr.push(v.name);
                    })
                }
                myChart.setOption({
                    title : {
                        text: str=='name'?'商品名称':'商品分类',
                        x:'center'
                    },
                    tooltip : {
                        trigger: 'item',
                        formatter: "{a} <br/>{b} : {c} ({d}%)"
                    },
                    legend: {
                        orient: 'vertical',
                        left: 'right',
                        data: nameArr
                        // data: ['直接访问','邮件营销','联盟广告','视频广告','搜索引擎']
                    },
                    series : [
                        {
                            name: '商品',
                            type: 'pie',
                            radius : '80%',
                            center: ['50%', '60%'],
                            // data:[
                            //     {value:335, name:'直接访问'},
                            //     {value:310, name:'邮件营销'},
                            //     {value:234, name:'联盟广告'},
                            //     {value:135, name:'视频广告'},
                            //     {value:1548, name:'搜索引擎'},
                            //     {value:200,name:'其他'}
                            // ],
                            data:arrData,
                            itemStyle: {
                                emphasis: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                }
                            }
                        }
                    ]
                });
            }
        }
    }
</script>
<style  scoped>
    .el-form-item{
        margin-bottom:0;
    }
    .el-date-editor.el-input, .el-date-editor.el-input__inner{
        width:180px;
    }
    .other-operate-btn{
        flex: 1;
        text-align:right;
    }
    .queryOrderInfo-header{
        border-bottom:1px solid rgba(0,0,0,.1);
    }
    .queryOrderInfo-ul{
        display: flex;
        padding:25px 0;
        background: #f5f7fa;
        
    }
    .queryOrderInfo-ul>li{
        flex:1;
        text-align:center;
    }
    .queryOrderInfo-ul>li>span{
        display:block;
        font-size:14px;
    }
    .queryOrderInfo-ul>li>span+span{
        margin-top:10px;
    }
    .queryOrderInfo-ul>li>span:nth-last-child(1){
        color: #F62D2D;
    }
    .public-box-wrap{
        padding:0;
    }
    .queryOrderInfo-chart-table{
        padding: 20px  20px 35px 20px;
    }
    .goodsTotalChart>canvas{
        width:100%;
    }
</style>

