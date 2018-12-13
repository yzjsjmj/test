<template>
    <div class="incomeDetails">
        <div class="pulic-header">
            <i  class="fontFamily icon-ayl-shouye icon-shouye"></i>
            <el-breadcrumb separator-class="el-icon-arrow-right" class="">
                <el-breadcrumb-item :to="{ path: '/Backstage' }" >首页</el-breadcrumb-item>
                <el-breadcrumb-item>收入明细</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="public-box" >
            <div class="public-box-wrap">
                <div class="inline-form-wrap">
                    <el-form :inline="true"   :model="formInline" :rules="rules"
                        class="demo-form-inline" ref="formInline">
                        <el-form-item label=""
                           prop="date"
                           >
                            <el-date-picker
                                v-model="formInline.date"
                                type="daterange"
                                range-separator="-"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                                @change="selectTime">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label="">
                            <el-input clearable v-model="formInline.orderId" placeholder="订单号"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" icon="el-icon-search"  @click="goodsSearch">搜索</el-button>
                        </el-form-item>
                    </el-form>
                    <div class="other-operate-btn">
                        <form name="formExcle"
                        :action="importUrl+'order_id='+formInline.orderId+'&beginTime='+formInline.beginTime+'&endTime='+ formInline.endTime"
                         method="post" enctype="multipart/form-data"  >
                            <el-button type="success" icon="el-icon-upload2" @click="exportData('formInline')">导出</el-button>
                        </form>
                    </div>   
                </div>
                <template>
                    <el-table
                        ref="multipleTable"  
                        :data="goodsListArr"
                        border
                        v-loading="loading"
                        :header-row-style="headerColor"
                        tooltip-effect="dark"
                        style="width: 100%;"
                       >
                        <el-table-column
                            label="序号" align="center"
                            type="index"
                            width="80">
                        </el-table-column>
                        <el-table-column
                            label="支付流水号" align="center" width="240"
                            prop="transaction_id"
                            >
                        </el-table-column>
                        <el-table-column
                            label="订单号" align="center"  
                            prop="order_id"
                           >
                        </el-table-column>
                        <el-table-column
                            label="支付时间" align="center"  width="260"
                            prop="pay_time"
                            >
                        </el-table-column>
                        <el-table-column
                            label="下单昵称" align="center"  width="220"
                            prop="wx_nickname"
                            >
                        </el-table-column>
                        <el-table-column
                            label="金额(元)" align="center"  width="180"
                            prop="all_fee"
                            >
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
    var now = new Date(); //当前日期 
    var nowDay = now.getDate(); //当前日 
    var nowMonth = now.getMonth(); //当前月 
    var nowYear = now.getYear(); //当前年
     nowYear += (nowYear < 2000) ? 1900 : 0; //
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
export default{
    data(){
        return{
            importUrl:this.globalData.api+'/ayl_weshopManage/getIncomeDetailByExcle?',
            order_id:'',  //订单编号
            loading:true,
            crrentPage:1,              //当前页码
            pageCount:10,              //当前页面显示条数
            total:0,                   //总数据条数
            //行内元素表单数据
            formInline: {
                date:[],//日期格式
                beginTime:'',         //开始时间
                endTime:'',           //结束时间
                orderId: '',          //订单号
            },
            //商品列表数据
            goodsListArr: [
                
            ],
            rules: {
                date: [
                    { required: true, message: '请选择时间', trigger: 'change' },
                ],
                
            }
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
                    priv_id:'9',
                },{emulateJSON:true})
                .then( (res) => {  
                    console.log(res)
                    // 处理成功的结果 
                    var res =   res.body;
                    if(res.error_code==0){
                        var tempArr = [];
                        tempArr.push(getMonthStartDate(),getMonthEndDate());
                        this.formInline.date = tempArr;
                        this.formInline.beginTime =  getMonthStartDate();
                        this.formInline.endTime =  getMonthEndDate();
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
                ""+this.globalData.api+"/ayl_weshopManage/getIncomeDetail",    
                // "http://172.16.1.39:8080/ayl_weshopManage/getIncomeDetail",
                {   
                    currentPage:this.crrentPage,
                    pageSize:this.pageCount,
                    beginTime:this.formInline.beginTime,
                    endTime:this.formInline.endTime,
                    order_id:this.formInline.orderId,
                },{emulateJSON:true})
                .then( (res) => {  
                    console.log(res)
                    // 处理成功的结果 
                    var res =   res.body;
                    if(res.error_code==0){
                        this.loading = false;
                        this.goodsListArr = res.rows;
                        this.total = res.total;    
                    }else{
                        //清零置空
                        this.loading = false;
                        this.goodsListArr = [];
                        this.total=0; 
                        console.log('查无数据')
                    }   
                }).catch(function(res) {  
                    //捕捉异常                 
                    console.log(res);
                    this.loading = false;               
                }
            );
        },
        //事件-时间选择
        selectTime(timeArr){
            var beginTime = this.globalMethods.formatTimeArr(timeArr[0]),
                endTime = this.globalMethods.formatTimeArr(timeArr[1]); 
            this.formInline.date = timeArr;   
            console.log(timeArr) 
            if(beginTime!=undefined && endTime!=undefined ){
                this.formInline.beginTime = beginTime;
                this.formInline.endTime = endTime;
                this.requestData();
            }
        },
        //事件-搜索
        goodsSearch(){
            console.log(this.formInline.orderId);
            this.requestData();
        },
        //事件-导出
        exportData(formName){
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    var beginTime = this.formInline.beginTime,
                        endTime = this.formInline.endTime;
                        console.log(beginTime,endTime )
                        if(this.goodsListArr.length!=0){
                            this.formInline.beginTime = beginTime;
                            this.formInline.endTime = endTime;
                            document.forms['formExcle'].submit();
                        }else{
                            this.$message({
                                type:'warning',
                                message:'无数据可导出'
                            })
                        }   
                }else {
                    console.log('搜索失败');
                    return false;
                }
            });    
            
            

        },
        //事件-当前页变化
        handleCurrentChange(val) {
            console.log(`当前页: ${val}`);
            this.crrentPage = val;
            this.requestData();
        },
        //表头颜色
        headerColor({row, rowIndex}){
            return  this.globalMethods.tabelHeaderColor();
        }
    }
}
</script>
<style scoped>
    .other-operate-btn{
        flex: 1;
        text-align:right;
        padding-right:50px;
    }
    .pagination-wrap{
        margin-top:20px;
        text-align: center;
    }
</style>

