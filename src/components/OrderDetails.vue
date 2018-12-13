<template>
    <div class="salesReport">
        <div class="pulic-header">
            <i  class="fontFamily icon-ayl-shouye icon-shouye"></i>
            <el-breadcrumb separator-class="el-icon-arrow-right" class="">
                <el-breadcrumb-item :to="{ path: '/Backstage' }" >首页</el-breadcrumb-item>
                <el-breadcrumb-item :to="{ path: '/OrderList' }">订单列表</el-breadcrumb-item>
                <el-breadcrumb-item>订单详情</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="public-box" v-loading="loading">
            <div class="public-box-wrap">
                <div class="sameInfo">
                    <div class="same-header">
                        <span class="same-header-left">交易状态</span>
                        <el-button type="default" size="small" icon="el-icon-back" @click="backPage" >返回</el-button>
                    </div>
                    <div class="sameInfo-wrap">
                        <div class="currnet-status">当前状态：{{orderInfo.status}}</div>
                        <div class="status-progress mt20">
                           <span :class="[orderInfo.status=='待发货'?'active':'','same-progress-css' ] ">待发货</span>
                           <span :class="[orderInfo.status=='已发货'?'active':'','same-progress-css' ]">已发货</span>
                           <span :class="[orderInfo.status=='已完成'?'active':'','same-progress-css' ]">已完成</span>    
                        </div> 
                    </div>
                </div>
                <div class="sameInfo" v-if="orderInfo.status=='待发货'">
                    <div class="same-header">
                        <span class="same-header-left">物流信息</span>
                    </div>
                    <div class="sameInfo-wrap" >
                        <el-button size="small" type="primary" @click="seedGoods('addForm')">发 货</el-button>
                    </div>
                </div>
                <div class="sameInfo">
                    <div class="same-header">
                        <span class="same-header-left">订单信息</span>
                    </div>
                    <div class="sameInfo-wrap">
                        <ul class="addressInfo-ul">
                            <li>收货人：{{orderInfo.customer_name}}</li>
                            <li>联系电话：{{orderInfo.customer_tel}} </li>
                            <li>收货地址：{{orderInfo.customer_pro}}{{orderInfo.customer_city}}{{orderInfo.customer_add}}</li>
                        </ul>
                    </div>
                </div>
                <div class="sameInfo">
                    <div class="same-header">
                        <span class="same-header-left">商品信息</span>
                    </div>
                    <div class="otherInfo mt30">
                        <ul class="otherInfo-ul">
                            <li>订单编号：{{orderInfo.order_id}}</li>
                            <li>下单时间：{{orderInfo.ins_time}}</li>
                            <li>付款时间：{{orderInfo.pay_time}}</li>
                            <li>商品金额<span class="same-price-color">{{orderInfo.totalPrice}}元</span> + 运费<span class="same-price-color">{{orderInfo.freight}}元</span> - 会员优惠<span class="same-price-color">{{orderInfo.count}}元</span></li>
                            <li>商品总价：<span class="goodsTotalPrice">{{orderInfo.total_fee}}元</span></li>
                        </ul>
                    </div>
                     <template >
                        <el-table class="mt30"
                            :data="goodsInfoArr"
                            :header-row-style="headerColor"
                            style="width: 60%">
                            <el-table-column  label="商品信息"  >
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
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column
                                label="实际支付(元)" align="center"
                                 width="110"
                                prop="total_fee">
                            </el-table-column>
                            <el-table-column
                                width="100"
                                label="订单状态" align="center"
                                prop="status">
                            </el-table-column>
                        </el-table>
                    </template>
                    
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
    </div>
</template>
<script>
    export default{
        data(){
            return{
                loading:true,
                orderId:'',
                goodsInfoArr:[],     //商品信息列表
                orderInfo:{},       //订单信息
                imgApi:this.globalData.imgApi, //图片前缀路径
                formLabelWidth: '120px',
                expressCompany:[
                  '京东','韵达','顺丰','中通','圆通','天天','EMS','汇通','优速',
                  '宅急送'  
                ],
                addForm:{
                    expressUnit:'',          //快递单位
                    expressNumber:'',        //快递单号
                },
                addDialogFormVisible:false,
                oper_person:'',//用户id
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
                            var  params = this.$route.params; 
                            //请求数据商品详情
                            if(params.orderId!=undefined){
                                this.requestData(params.orderId);
                            }else{
                                this.$message({
                                    type:'warning',
                                    message:'无订单id,已返回上一页'
                                })
                                setTimeout(()=>{
                                    this.$router.go(-1);
                                },500)
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
            requestData(orderId){
                this.$http.post(
                    ""+this.globalData.api+"/ayl_weshopManage/orderDetail",
                    // "http://172.16.1.41:8080/ayl_weshopManage/orderDetail",
                    {   
                        orderId:orderId
                    },{emulateJSON:true})
                    .then( (res) => {  
                        console.log(res)
                        // 处理成功的结果 
                        var res =   res.body;
                        if(res.error_code==0){
                            var tempArr =  res.order;
                            this.loading = false;
                            this.orderId = orderId;
                            this.orderInfo = res.order[0];
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
                            this.goodsInfoArr = tempArr; 
                        }else{
                            this.loading = false;
                            console.log('查无数据')
                        }   
                    }).catch(function(res) {  
                        //捕捉异常
                        this.loading = false;                 
                        console.log(res);         
                    }
                );
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
                                setTimeout((v,i)=>{
                                   this.$router.go(-1);
                                },1000) 
                                this.$message({
                                    type:'success',
                                    message:'发货成功'
                                })
                                
                            }else{
                                this.$message({
                                    type:'error',
                                    message:'发货提交失败'
                                })
                                // console.log(res.message)
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
           //事件-返回上一页
            backPage(){
                this.$router.go(-1)
            },
            //事件-发货
            seedGoods(formName){
                //重置表单状态
                if( this.$refs[formName]!=undefined){
                    this.$refs[formName].resetFields();
                }
                this.addDialogFormVisible = true;
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
            //对话框关闭
            handleClose(done) {
                done();
            },
            //表头颜色
            headerColor({row, rowIndex}){
                return  this.globalMethods.tabelHeaderColor();
            }, 
        }
    }
</script>
<style scoped>
    .sameInfo{
        padding-bottom:30px;
    }
    .sameInfo:last-of-type{
        padding-bottom:0px;
    }
    .same-header{
        display: flex;
        align-items:center;
        padding-bottom:12px;
        border-bottom:1px solid rgba(0,0,0,.1);
    }
    .same-header-left::before{
        content:'';
        display: inline-flex;
    }
    .same-header-left{
        flex:1;
        border-left:3px solid #409EFF;
        padding-left:10px;
        color: #409EFF;
    }
    .sameInfo-wrap{
        padding:20px 0 0  15px;
    }
    .currnet-status{
        font-size:14px;
    }
    .addressInfo-ul>li{
        font-size:14px;
    }
    .addressInfo-ul>li + li{
        margin-top:10px;
    }
    .el-input{
        width:300px;
    }
    .el-select{
        width:300px;
    }
    .otherInfo-ul{
        padding-left:10px;
    }
    .otherInfo-ul>li{
        font-size:14px;
    }
    .otherInfo-ul>li+li{
        margin-top:10px;
    }
    .same-price-color{
        color:#F62D2D;
        padding-left:4px;
    }
    .goodsTotalPrice{
        color:#F62D2D;
        font-size:20px;
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
        /* content: '';
        position: absolute; */
        width:0;
    }
    /* .same-time-orderNum{
        color: #333;
    } */
    /* 商品共用css */
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
</style>

