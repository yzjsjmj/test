<template>
    <div class="salesReport">
        <div class="pulic-header">
            <i  class="fontFamily icon-ayl-shouye icon-shouye"></i>
            <el-breadcrumb separator-class="el-icon-arrow-right" class="">
                <el-breadcrumb-item :to="{ path: '/Backstage' }" >首页</el-breadcrumb-item>
                <el-breadcrumb-item :to="{ path: '/GoodsPromotion' }">商品促销</el-breadcrumb-item>
                <el-breadcrumb-item >商品促销新增</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="public-box" >
            <div class="public-box-wrap">
                <el-form  class="demo-dynamic" :model="dynamicForm" 
                    label-position="left" :rules="rules"
                    ref="dynamicForm" label-width="100px" >
                    <el-form-item
                        label="商品货号"
                        prop="goodsKeywordArr"
                    >
                        <el-select
                            v-model="dynamicForm.goodsKeywordArr"
                            filterable
                            remote
                            reserve-keyword
                            multiple
                            placeholder="请输入关键词"
                            :remote-method="remoteMethod"
                            :loading="loading">
                            <el-option
                            v-for="item in selectDataArr"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                        <span class="allow-multiple">(支持多选)</span>
                    </el-form-item>
                    <el-form-item label="促销时间" required >
                        <el-col :span="3">
                            <el-form-item prop="date1" >
                                <el-date-picker type="date" placeholder="选择日期"   v-model="dynamicForm.date1"></el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col class="line" :span="1">-</el-col>
                        <el-col :span="3">
                            <el-form-item prop="date2">
                                <el-date-picker type="date" placeholder="选择日期"  v-model="dynamicForm.date2" ></el-date-picker>
                            </el-form-item>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="促销规则" required >
                        <el-col :span="24">
                            <el-radio-group v-model="dynamicForm.selectRadio">
                                <el-radio label="直降"></el-radio>
                                <el-radio label="打折">打折（现价=原价x促销折扣）</el-radio>
                            </el-radio-group>
                        </el-col>
                        <el-col :span="24" v-if="dynamicForm.selectRadio=='直降'">
                            <el-form-item 
                                 prop="straightDown"                                
                                >
                                <el-input type='number' v-model="dynamicForm.straightDown" auto-complete="off"></el-input>
                                <span class="same-unit">元</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="24" v-else>
                            <el-form-item 
                              prop="discount"
                            >
                                <el-input type='number' v-model="dynamicForm.discount" auto-complete="off"></el-input>
                                <span class="same-unit">(请输入0-10,例如9.8表示打9.8折)</span>
                            </el-form-item>
                        </el-col>
                    </el-form-item>
                    <div class="footer-btn-operate">
                        <!-- <el-button type="success"  @click="addInput()">新增</el-button> -->
                        <el-button type="primary"  @click="submitForm('dynamicForm')">保 存</el-button>
                    </div>  
                </el-form>
            </div>    
        </div>
    </div>
</template>
<script>
    export default {
        data() {
            var checkPrice = (rule, value, callback) => {
                let reg=/^[0-9]*(\.[0-9]{1,2})?$/;
                if(!reg.test(value)) {
                    callback(new Error('输入格式不正确!'));
                } else {
                    callback();
                }
            }
             var checkDiscount = (rule, value, callback) => {
            let reg=/^[0-9]{1}(.[0-9]{1,2})?$/;
            if(!reg.test(value)) {
                callback(new Error('输入格式不正确!'));
            } else {
                callback();
            }
            }
            return {
                oper_person:'',//用户id
                selectDataArr: [],   //选项数据
                queryDataArr: [],   //查询服务器数据
                loading: false,
                //动态表单
                dynamicForm: {
                    goodsKeywordArr: [], //选择商品关键字数据
                    date1: '',
                    date2: '',
                    selectRadio:'直降',
                    straightDown:'',               //直降
                    discount:'',                   //打折
                    caizhi:'',
                },
                //表单验证规则
                rules:{
                    goodsKeywordArr: [
                        { required: true, message: '请输入关键字', trigger: 'change' }
                    ],
                    date1: [
                        { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
                    ],
                    date2: [
                        { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
                    ],
                    straightDown: [
                        { required: true, message: '不能为空'},
                        { validator:checkPrice,trigger:'blur',message:'请输入正确的数值'}
                    ],
                    discount: [
                        { required: true, message: '不能为空'},
                        { validator:checkDiscount,trigger:'blur',message:'请输入正确的数值'}
                    ]
                }
            }
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
                        priv_id:'12',
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
            //请求查询数据
            requestData(keyword){
                this.$http.post(
                    ""+this.globalData.api+"/ayl_weshopManage/searchGoodsByNameOrId",
                    // "http://172.16.1.41:8080/ayl_weshopManage/searchGoodsByNameOrId",
                    {   
                        keyWord:keyword
                    },{emulateJSON:true})
                    .then( (res) => {  
                        console.log(res)
                        // 处理成功的结果 
                        var res =   res.body;
                        if(res.error_code==0){
                            var tempArr = res.result;
                            //输入关键字查询不到error_cod=0，空数组
                            if(tempArr.length!=0){
                                tempArr.forEach(item=>{
                                    this.queryDataArr.push({value:item.goods_id,label:item.goods_id })
                                })
                                this.loading = false;
                                this.selectDataArr = this.queryDataArr;
                            }else{
                                this.queryDataArr=[];
                            }
                        }else{
                            console.log('查无数据')
                        }   
                    }).catch(function(res) {  
                        //捕捉异常                 
                        console.log(res);        
                    }
                );
            },
            //向服务器发送请求
            remoteMethod(query) {
                if (query !== '') {
                    this.loading = true;
                    this.requestData(query);  //向服务器请求数据
                    
                } else {
                    this.selectDataArr = [];
                }

            },
            //提交表单
            submitForm(formName) {
                // console.log(this.dynamicForm.selectRadio )
                this.$refs[formName].validate((valid) => {
                if (valid) {
                    var model = this.$refs[formName].model,
                    promotionType = '',
                    promotionValue = '',
                    beginTime = this.globalMethods.formatTimeArr(model.date1),
                    endTime = this.globalMethods.formatTimeArr(model.date2),
                    timestampBegin = 0, timestampEnd = 0
                    // console.log(beginTime,endTime)
                    if (model.selectRadio == "直降") {
                        promotionType = "1"
                        promotionValue = model.straightDown 
                    }else{
                        promotionType = '0'
                        promotionValue = model.discount*10
                    }
                    timestampBegin = Date.parse(new Date(beginTime));
                    timestampEnd = Date.parse(new Date(endTime));
                    //比较选择的先后时间
                    if(timestampBegin>=timestampEnd){
                        this.$message({
                            type:'warning',
                            message:'开始时间不能大于结束时间'
                        })
                    } else {                
                        this.$http.post(""+this.globalData.api+'/ayl_weshopManage/addGoodsPromotion',{
                            oper_person:this.oper_person,            //用户id
                            goods_id: model.goodsKeywordArr.join(","),		 //商品货号，多个用数组
                            promotionType: promotionType,      //促销活动类型，0是打折，1是直降
                            promotionValue:promotionValue.toString(),      //打折时是折扣，直降时是直降金额
                            startTime:this.globalMethods.formatTimeArr(model.date1),          //促销开始时间
                            endTime:this.globalMethods.formatTimeArr(model.date2)            //促销结束时间
                        },{emulateJSON:true}).then(res=>{
                            res = res.body 
                            console.log(res)
                            if (res.error_code == 0 ) {
                                 setTimeout(()=>{
                                     this.$router.push({path:'/GoodsPromotion'});
                                 },300)
                            } else {
                                this.$message.error({
                                    message:res.error_message
                                })
                            }
                        })
                    }
                } else {
                    console.log('error submit!!');
                    return false;
                }
                });
            },
        }
    }
</script>
<style scoped>
    .demo-dynamic{
        margin-top:30px;
        padding-left:20px;
    }
    .footer-btn-operate {
        padding-left:100px;
        margin-top: 40px;
    }
    .el-input,.el-select{
        width:429px;
    }
    .el-date-editor{
        width:185px;
    }
    .line{
        text-align:center;
    }
    .same-unit{
        padding-left:10px;
    }
    .allow-multiple{
        color: #999;
        padding-left:20px;
    }
</style>

