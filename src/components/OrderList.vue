<template>
    <div class="orderManage">
        <div class="pulic-header">
            <i  class="fontFamily icon-ayl-shouye icon-shouye"></i>
            <el-breadcrumb separator-class="el-icon-arrow-right" class="">
                <el-breadcrumb-item :to="{ path: '/Backstage' }" >首页</el-breadcrumb-item>
                <el-breadcrumb-item>订单列表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="public-box" >
            <div class="public-box-wrap">
                <div class="orderList">
                    <el-tabs  v-model="activeName" @tab-click="switchTabs">
                        <div class="orderListHeader mb20">
                            <el-input v-model="goodsKeywords" placeholder="商品关键字" clearable></el-input>
                            <el-button class="search-btn" type="primary" icon="el-icon-search" @click="goodsSearch">搜索</el-button>
                        </div>
                        <el-table
                            :data="orderList"
                            v-loading = "loading"
                            style="width: 100%">
                            <el-table-column type="expand" >
                                <template slot-scope="props">
                                    <div class="goodsDetails-box">
                                        <div class="goodsInfo-wrap"  >
                                            <div class="goodsInfo-li" v-for="(item,index) in props.row.goods_list" :key="index">
                                                <img class="same-img-css" :src="imgApi+item.image" >
                                                <div class="goodsName-color">
                                                    <span class="goodsName">{{item.goods_name}}</span>
                                                    <span class="goodsColor">颜色：{{item.goods_color_attr}}</span>
                                                </div>
                                                <div class="goodsPrice">
                                                    <i >¥</i>{{item.goods_price}}
                                                </div>
                                                <div class="goodsNumber">
                                                    {{item.goods_num}}
                                                </div>   
                                            </div>   
                                        </div>
                                        <div class="otherInfo">
                                            <span class="same-layer"><span>运费：</span><i >¥</i>{{props.row.freight}}</span>
                                            <span class="same-layer"><span>折扣：</span><i >¥</i>{{props.row.count}}</span>
                                            <span class="same-layer"><span>合计：</span><i >¥</i>{{props.row.total_fee}}</span>
                                        </div>
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column
                                label="订单编号" align="center"
                                prop="order_id">
                            </el-table-column>
                            <el-table-column
                                label="下单时间" align="center"
                                prop="ins_time">
                            </el-table-column>
                            <el-table-column
                                label="合计金额(元)" align="center"
                                prop="total_fee">
                            </el-table-column>
                            <el-table-column
                                label="交易状态"  align="center"
                                prop="status">
                            </el-table-column>
                            <el-table-column
                                label="操作" align="center"
                                prop="desc">
                                <template slot-scope="scope">
                                    <el-button
                                    size="mini" type="text"
                                    @click="linkOrderDetails(scope.$index, scope.row)"
                                    >查看详情</el-button>
                                    <el-button v-if="scope.row.status=='待发货'"
                                    size="mini" type="text"
                                    @click="seedGoods(scope.$index, scope.row,'addForm')">发货</el-button>
                                    <el-button v-else-if="scope.row.status=='已取消'?false:true"
                                    size="mini" type="text" 
                                    @click="lookLogistics(scope.$index, scope.row)">查看物流</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                        <div class="pagination-wrap" >
                            <el-pagination
                                @current-change="handleCurrentChange"
                                background
                                :current-page="crrentPage"
                                :page-size="pageCount"
                                layout="total,prev, pager, next, jumper"
                                :total="total" >
                            </el-pagination>
                        </div>
                        <el-tab-pane :label="allOrderNumber"  name="first">
                            
                        </el-tab-pane>
                        
                        <el-tab-pane  :label="waitSeedGoodsNumber" name="second" style="width:100%">
                            
                        </el-tab-pane>
                        <el-tab-pane :label="seedGoodsNumber"  name="third">
                            
                        </el-tab-pane>
                        
                        <el-tab-pane  :label="finishedNumber" name="fourth" style="width:100%">
                            
                        </el-tab-pane>
                    </el-tabs>
                </div>
            </div>    
        </div>
        <!-- 对话框 -->
        <el-dialog
            title="添加快递信息"
            :visible.sync="addDialogFormVisible"
            center
            width="30%"
            :before-close="handleClose">
            <el-form :model="addForm" label-position="left" ref="addForm">
                <el-form-item label="快递单位" 
                    :label-width="formLabelWidth"
                    prop="expressUnit"
                    :rules="{required: true, message: '请选择快递单位', trigger: 'blur'}"   
                >
                    <el-select v-model="addForm.expressUnit"  placeholder="请选择快递单位">
                        <el-option 
                            v-for="(item,index) in expressCompany"
                            :key="index"
                            :label="item"
                            :value="item"
                            ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="快递单号"
                    :label-width="formLabelWidth"
                    prop="expressNumber"
                    :rules="{required: true, message: '请填写快递单号', trigger: 'blur'}"   
                >
                    <el-input v-model="addForm.expressNumber"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="cancelForm('addForm')">取 消</el-button>
                <el-button type="primary" @click="diffParamsSubmit('addForm')">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 查看物流 -->
        <el-dialog
            title="查看物流信息"
            :visible.sync="logisticsInfoVisible"
            center
            width="40%"
            :before-close="handleClose">
            <div class="logisticsInfo-header">
                <div class="status-progress mt20">
                    <span :class="[deliverystatus=='1'?'active':'','same-progress-css' ] ">待发货</span>
                    <span :class="[deliverystatus=='2'?'active':'','same-progress-css' ]">已发货</span>
                    <span :class="[deliverystatus=='3'?'active':'','same-progress-css' ]">已完成</span>
                </div>  
            </div>
            <div class="logisticsInfo-wrap mt20">
                <ul class="logisticsInfo-details-ul">
                    <li :class="index==0?'active':''" 
                       v-for="(item,index) in logisticsList"
                       :key="index"
                    >
                        <span class="show-logistics-time">{{item.time}}</span>
                        <span class="show-logistics-addr">{{item.status}}</span>
                    </li>
                </ul>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="closeLogistics()">关 闭</el-button>
            </span> 
        </el-dialog>
    </div>
</template>
<script>
    export default{
        data(){
            return{
                orderId:'',
                loading:true,
                imgApi:this.globalData.imgApi,
                crrentPage:1,              //当前页码
                pageCount:10,              //当前页面显示条数
                total:0,                   //总数据条数
                orderStatus:'',        //订单状态
                activeName: 'first',    //当前选项卡
                allOrderNumber:'全部订单(27)',                    //全部订单
                waitSeedGoodsNumber:'待发货订单(10)',             //待发货订单
                seedGoodsNumber:'已发货订单(7)',                  //已发货订单
                finishedNumber:'已完成订单(10)',                  //已完成订单
                goodsKeywords:'',                                //关键字搜索
                orderList: [
                ],
                formLabelWidth: '120px',
                expressCompany:[
                  '京东','韵达','顺丰','中通','圆通','天天','EMS','汇通','优速',
                  '宅急送'  
                ],
                addForm:{
                    expressUnit:'',          //快递单位
                    expressNumber:'',        //快递单号
                },
                oper_person:'',//用户id
                logisticsList:[],   //物流信息
                deliverystatus:'',//物流状态
                addDialogFormVisible:false,
                logisticsInfoVisible:false    //物流对话框
            }
        },
        created(){
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
                        priv_id:'7',
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
                    ""+this.globalData.api+"/ayl_weshopManage/orderList",
                    // "http://172.16.1.41:8080/ayl_weshopManage/orderList",
                    {   
                        currentPage:this.crrentPage,
                        pageSize:this.pageCount,
                        keyWord:this.goodsKeywords,  //商品关键字
                        status:this.orderStatus,   //订单状态
                    },{emulateJSON:true})
                    .then( (res) => {  
                        console.log(res)
                        // 处理成功的结果 
                        var res =   res.body;
                        if(res.error_code==0){
                            var tempArr = res.rows;
                            this.loading = false;
                            this.orderList = [];
                            tempArr.forEach((v,i)=>{
                                switch(v.status){
                                    case 1:
                                    v.status = '待付款';
                                    break;
                                    case 2:
                                    v.status = '待发货';
                                    break;
                                    case 3:
                                    v.status = '已发货';
                                    break;
                                    case 4:
                                    v.status = '已完成';
                                    break;
                                    case 5:
                                    v.status = '已取消';
                                    break;            
                                }
                            })
                            this.allOrderNumber = '全部订单('+res.all+')';
                            this.waitSeedGoodsNumber = '待发货订单('+res.notSend+')';
                            this.seedGoodsNumber='已发货订单('+res.send+')';
                            this.finishedNumber='已完成订单('+res.completed+')';
                            this.orderList = tempArr;
                            this.total = res.total;
                        }else{
                            //清零置空
                            this.orderList = [];
                            this.total=0; 
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
            //事件-切换选项卡
            switchTabs(){
                var activeName = this.activeName;
                switch(activeName){
                    //全部
                    case 'first':
                        this.orderStatus = '';
                        this.crrentPage = 1;
                        this.loading = true;
                        this.requestData();
                        break;
                    //待发货    
                    case 'second':
                        this.crrentPage = 1;
                        this.loading = true;
                        this.orderStatus = '2';
                        this.requestData();
                        break;
                    //已发货    
                    case 'third':
                        this.loading = true;
                        this.orderStatus = '3';
                        this.crrentPage = 1;
                        this.requestData();
                        break;
                    //已完成      
                    case 'fourth':
                        this.loading = true;
                        this.orderStatus = '4';
                        this.crrentPage = 1;
                        this.requestData();
                        break;                      
                }
            },
            //事件-商品关键字搜索
            goodsSearch() {
                this.requestData();
            },
            //事件-查看链接订单详情
            linkOrderDetails(index,row){
                this.$router.push({name:'OrderDetails',params:{orderId:row.order_id}});
            },
            //事件-发货
            seedGoods(index,row,formName){
                //重置表单状态
                if( this.$refs[formName]!=undefined){
                    this.$refs[formName].resetFields();
                }
                this.addDialogFormVisible = true;
                this.orderId = row.order_id;
            },
            //发货请求提交
            seedGoodsRequestSubmit(){
                if(this.orderId!=''){
                   this.$http.post(
                        ""+this.globalData.api+"/ayl_weshopManage/mailGoods",
                        // "http://172.16.1.41:8080/ayl_weshopManage/mailGoods",
                        {   
                            oper_person:this.oper_person,            //用户id
                            order_id:this.orderId,
                            logistics_name:this.addForm.expressUnit,
                            logistics_no:this.addForm.expressNumber,
                        },{emulateJSON:true})
                        .then( (res) => {  
                            console.log(res)
                            // 处理成功的结果 
                            var res =   res.body;
                            if(res.error_code==0){
                               this.requestData();//刷新页面
                                this.$message({
                                    type:'success',
                                    message:'发货成功'
                                }) 
                            }else{
                                this.$message({
                                    type:'error',
                                    message:'发货提交失败'
                                })    
                            }   
                        }).catch(function(res) {  
                            //捕捉异常                 
                            console.log(res);         
                        }
                    );
                }else{
                    this.$message({
                        type:'error',
                        message:'请求失败，无订单编号'
                    })
                }   
            },
            //事件-查看物流
            lookLogistics(index,row){
                this.logisticsInfoVisible = true;
                console.log( row);
                var order_id = row.order_id;
                if(order_id && order_id!=''){
                    this.$http.post(
                        ""+this.globalData.api+"/ayl_weshopManage/queryLogistics",
                        // "http://172.16.1.39:8080/ayl_weshopManage/getLogisticsDetail",
                        {   
                        order_id:order_id,     //订单id
                        },{emulateJSON:true})
                        .then( (res) => {  
                            console.log(res)
                            // 处理成功的结果 
                            var res =   res.body;
                            if(res.error_code==0){
                                this.logisticsList = res.logisticsList;
                                this.deliverystatus = res.deliverystatus;
                            }else{
                                //清零置空
                                this.$message({
                                    type:'error',
                                    message:res.error_message
                                })
                                console.log('查无数据')
                            }   
                        }).catch(function(res) {  
                            //捕捉异常                 
                            console.log(res);  
                            this.loading = false;       
                        }
                    );
                }   
            },
            //事件-当前页变化
            handleCurrentChange(val){
                console.log(`当前页：${val}`)
                this.crrentPage = val;
                this.requestData();
            },
            //事件-快递信息提交
            diffParamsSubmit(formName){
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        console.log('submit!');
                        this.seedGoodsRequestSubmit();
                        this.addDialogFormVisible = false;
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            //事件-对话框取消
            cancelForm(formName){
                this.addDialogFormVisible = false;
            },
            //关闭物流对话框
            closeLogistics(){
                this.logisticsInfoVisible = false;
            },
            //对话框关闭
            handleClose(done) {
                done();
            },
        }
    }
</script>
<style scoped>
    .orderList{
        margin-top:10px;
    }
    .orderListHeader{
        display: flex;
    }
    .el-input{
        width:300px;
    }
    .search-btn{
        margin-left:20px;
    }
    .demo-table-expand {
        font-size: 0;
    }
    .demo-table-expand label {
        width: 90px;
        color: #99a9bf;
    }
    .demo-table-expand .el-form-item {
        margin-right: 0;
        margin-bottom: 0;
        width: 50%;
    }
    .goodsDetails-box{
        display: flex;
        align-items:center;
    }
    .goodsInfo-wrap{
        flex:1;
    }
    .goodsInfo-li{
        display: flex;
        align-items:center;
        width:100%;
        padding:10px  0;
    }
    .same-img-css{
        width:80px;
        height:80px;
    }
    .goodsName-color{
        flex:1;
        margin-left:10px;
    }
    .goodsName{
        display: block;
    }
    .goodsColor{
        display: block;
        margin-top:5px;
    }
    .goodsPrice, .goodsNumber{
        flex-basis:120px;
        text-align: center;
        margin-left:10px;

    }
    .goodsPrice>i{
        font-size:12px;
    }
    .otherInfo{
        flex:1;
        padding-left:20px;
    }
    .same-layer{
        display: block;
    }
    .same-layer>i{
        font-size:12px;
    }
    .same-layer + .same-layer{
        margin-top:10px;
    }
    .same-layer>span{
        color:#99a9bf;
        display:inline-block;
        width:90px;
    }
    .pagination-wrap{
        margin-top:30px;
        text-align: center;
    }
    .el-select{
        width:300px;
    }
    .status-progress{
        text-align:center;
        padding-top:20px;
    }
    .same-progress-css{
        font-size:14px;
        position: relative;
        display: inline-block;
        width:200px;
    }
    .same-progress-css.active{
       color:#F62D2D;
    }
    .same-progress-css.active::before{
       border:1px solid  #F62D2D;
    }
    .same-progress-css::before{
        content: '';
        position: absolute;
        top:-15px;
        left: 50%;
        z-index: 1;
        width:6px;
        height:6px;
        border:1px solid  rgba(0,0,0,.2);
        border-radius:50%;
    }
    .same-progress-css::after{
        content: '';
        position: absolute;
        top:-11px;
        left:108px;
        width:197px;
        height:1px;
        border-top:1px solid  rgba(0,0,0,.2);
    }
    .same-progress-css:nth-last-child(1)::after{
        width:0;
    }
    .logisticsInfo-details-ul{
        margin-top:10px;
        padding:0 10px;
    }
    .logisticsInfo-details-ul>li{
        position:relative;
        padding-left:15px;
        padding-bottom:20px;
        border-left:2px solid #ededed;
    }
    .logisticsInfo-details-ul>li::before{
        content:'';
        position: absolute;
        top:0px;
        left:-5px;
        z-index:1;
        width:6px;
        height:6px;
        border-radius:4px;
        background:#fff;
        border:1px solid #dedede;
    }
    .logisticsInfo-details-ul>li.active::before{
        border-color: #F62D2D;
    }
    .logisticsInfo-details-ul>li.active>.show-logistics-addr{
      color:#333;
    }
    .show-logistics-addr{
        color:#999;
        font-size:14px;
        line-height:21px;
        padding-left:30px;
    }
    .show-logistics-time{
        color:#999;
        font-size:12px;
        margin-top:7px;
    }
    
</style>

