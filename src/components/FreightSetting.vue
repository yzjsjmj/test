<template>
    <div class="freightSetting">
        <div class="pulic-header">
            <i  class="fontFamily icon-ayl-shouye icon-shouye"></i>
            <el-breadcrumb separator-class="el-icon-arrow-right" class="">
                <el-breadcrumb-item :to="{ path: '/Backstage' }" >首页</el-breadcrumb-item>
                <el-breadcrumb-item>运费设置</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="public-box" >
            <div class="public-box-wrap">
                <div class="freightRule-header">
                    <div class="freightRule-title">运费规则</div>
                    <div class="freightRule-textContent">开启运费规则，消费者下单后需要根据相应的消费金额，是否需要给运费</div>
                </div>
                <div class="freightRule-body mt20">
                    <div class="freightRule-body-title mb20">运费规则</div>
                    <el-form  :model="formData" label-width="120px" ref="formData" :rules="rules"
                         class="demo-form"   label-position="left"   >
                        <el-form-item label="开启运费规则" 
                        >
                            <el-switch
                                v-model="formData.swichFreight"
                            >
                            </el-switch>
                        </el-form-item>
                        <el-form-item label="订单金额满" prop="fullAmount"
                        >
                            <el-input class="same-padding"  v-model.number="formData.fullAmount"  size="small"   clearable></el-input>元，可免费包邮
                        </el-form-item>
                        <el-form-item label="订单金额未满" prop="fullAmount"
                        >
                            <el-input class="same-padding" v-model.number="formData.fullAmount"  size="small"    clearable></el-input>元，则需要运费
                        </el-form-item>
                        <el-form-item label="长沙市内" prop="cityInside" 
                        >
                            <el-input class="same-padding" v-model.number="formData.cityInside"  size="small"   clearable></el-input>元
                        </el-form-item>
                        <el-form-item label="长沙市外" prop="cityOutside"
                        >
                            <el-input class="same-padding"   v-model.number="formData.cityOutside"  size="small"   clearable></el-input>元
                        </el-form-item>
                        <el-form-item label="偏远地区运费" prop="remote"
                        >
                            <el-input class="same-padding" v-model.number="formData.remote"  size="small"   clearable></el-input>元
                        </el-form-item>
                        <el-form-item label="选择偏远地区" 
                        >
                            <el-select size="small" class="select-width"
                                v-model="selectProv"  
                                placeholder="请选择偏远地区"  
                               >  
                                <el-option  
                                        v-for="(item,index) in provs" 
                                        :key = index 
                                        :label="item.label"  
                                        :value="item.value">  
                                </el-option>  
                            </el-select>
                            <el-button  class="addRemoteAreaBtn" type="success" size="small"  @click="addRemoteArea">增 加</el-button>  
                        </el-form-item>
                    </el-form> 
                    <div class="remoteAreaBtn-wrap mt30" v-if="remoteAreas.length!=0">
                        <el-button v-for="(item,index) in remoteAreas" 
                            :key="index" size="small"  
                            icon="el-icon-close" 
                            @click="cancelRemoteArea(item)"
                        >{{item}}</el-button>  
                    </div>   
                    <div class="footer-btn-operate " v-if="isSubmitBtn">
                        <el-button type="primary"   @click="submitForm('formData')">保 存</el-button>
                    </div>
                </div>
            </div>    
        </div>
    </div>
</template>
<script>
    export default{
        data(){
            var validateNumber = (rule, value, callback) => {
                setTimeout(() => {
                    if ( isNaN(value)) {
                        callback(new Error('请输入数字值'));
                    }else{
                        callback();
                    }
                }, 200);
            };
            return{
                isSubmitBtn:true,    //是否显示提交按钮
                formData:{
                    swichFreight:false,  //是否开启运费规则 
                    fullAmount:'',                            //运费设置，满金额包邮
                    notFullAmount:'',                        //运费设置，未满金额
                    cityInside:'',                            //市内运费
                    cityOutside:'',                            //市外运费
                    remote:''                                 //偏远地区运费
                },
                //验证规则
                rules:{
                    fullAmount:[
                        { required: true, message: '请设置金额', trigger: 'blur' },
                        { validator: validateNumber, trigger: 'blur' }
                    ],
                    notFullAmount:[
                        { required: true, message: '请设置金额', trigger: 'blur' },
                        { validator: validateNumber, trigger: 'blur' }
                    ],
                    cityInside:[
                        { required: true, message: '请设置市内运费', trigger: 'blur' },
                        { validator: validateNumber, trigger: 'blur' }
                    ],
                    cityOutside:[
                        { required: true, message: '请设置市外运费', trigger: 'blur' },
                        { validator: validateNumber, trigger: 'blur' }
                    ],
                    remote:[
                        { required: true, message: '请设置偏远地区运费', trigger: 'blur' },
                        { validator: validateNumber, trigger: 'blur' }
                    ]   
                },
                oper_person:'',//用户id
                selectProv:'',       //选择省份
                provs: this.globalData.provs,
                remoteAreas:[       //偏远地区
                    // '新疆维吾尔自治区','西藏自治区','内蒙古自治区','青海省','香港特别行政区','澳门特别行政区',
                    // '台湾省','广西壮族自治区','海南省','甘肃省'
                ],     
            }
        },
        created () {
            //验证cookie是否失效，验证用户是否存在，最后权限判断
            var  roleId  = this.globalMethods.getCookie('roleId');
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
                        priv_id:'10',
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
                    ""+this.globalData.api+"/ayl_weshopManage/getFreightSetting",
                    // "http://172.16.1.39:8080/ayl_weshopManage/getFreightSetting",
                    {   
                       
                    },{emulateJSON:true})
                    .then( (res) => {  
                        console.log(res)
                        // 处理成功的结果 
                        var res =   res.body;
                        if(res.error_code==0){
                            var str = res.faraway_prolist_array;  //偏远地区数据
                            this.remoteAreas = str.split(',');
                            this.formData = {
                                swichFreight:res.free_logistics_flag==0?false:true, //是否开启运费规则  
                                fullAmount: res.free_logistics_fee,//运费设置，满金额包邮
                                // notFullAmount:res.free_logistics_fee, //运费设置，满金额包邮
                                cityInside:res.logistics_incity,   //市内运费
                                cityOutside:res.logistics_outcity, //市外运费
                                remote:res.logistics_faraway, //偏远地区运费
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
            //编辑提交数据
            editRequestSubmit(){
                this.isSubmitBtn = false;
                this.$http.post(
                    ""+this.globalData.api+"/ayl_weshopManage/updateFreightSetting",
                    // "http://172.16.1.39:8080/ayl_weshopManage/updateFreightSetting",
                    {   
                       free_logistics_flag:this.formData.swichFreight?'1':'0',  //是否开启运费规则  
                       free_logistics_fee:this.formData.fullAmount,  //运费设置，满金额包邮
                       logistics_incity:this.formData.cityInside,    //市内运费
                       logistics_outcity:this.formData.cityOutside,    //市外运费
                       logistics_faraway:this.formData.remote,      //偏远地区运费
                       faraway_prolist_array:this.remoteAreas.join(','),  //偏远地区数据
                       oper_person:this.oper_person,            //用户id
                    },{emulateJSON:true})
                    .then( (res) => {  
                        console.log(res)
                        // 处理成功的结果 
                        var res =   res.body;
                        if(res.error_code==0){
                            this.isSubmitBtn = true;
                            this.requestData(); //更新数据
                            this.$message({
                                type:'success',
                                message:'更新成功'
                            })
                            
                        }else{
                            this.$message({
                                type:'error',
                                message:'更新失败'
                            })
                            console.log('查无数据')
                        }   
                    }).catch(function(res) {  
                        //捕捉异常                 
                        console.log(res);         
                    }
                );
            },
            //事件-提交表单
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        console.log('submit!');
                        this.editRequestSubmit();
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            //增添偏远地区
            addRemoteArea(){
                var tempStr = this.selectProv;
                var tempArr = [];
                if(tempStr!=''){
                    this.remoteAreas.forEach((v,i)=>{
                        if(v==tempStr){
                            this.$message({
                                type:'warning',
                                message:'偏远地区不能重复添加'
                            })
                        }else{
                            tempArr.push(i);
                        }
                    })
                    if(tempArr.length==this.remoteAreas.length){
                        this.remoteAreas.push(tempStr);
                    }  
                }else{
                    this.$message({
                        message: '请选择偏远地区',
                        type: 'warning'
                    });
                }
            },
            //取消偏远地区
            cancelRemoteArea(item){
                var tempArr = this.remoteAreas,
                   index = tempArr.indexOf(item);
                if(index!=-1){
                    tempArr.splice(index,1);
                }
            },
            

        }
    }
</script>
<style scoped>
    .freightRule-header{
        padding:20px 15px;
        background: #f5f7fa;
    }
    .freightRule-textContent{
        margin-top:15px;
        font-size:14px;
    }
    .freightRule-body-title{
        font-size:14px;
    }
    .demo-form{
        padding-left:15px;
    }
    .el-input,.select-width{
        width:160px;
    }
    .same-width{
        display:inline-block;
        width:100px;
    }
    .same-padding{
        padding-right:  10px;
    }
    .remoteAreaBtn-wrap{
        padding-left:135px; 
    }
    .footer-btn-operate {
        text-align: center;
        margin-top: 50px;
    }
    .el-button+.el-button{
        margin-bottom:10px;
    }
    .addRemoteAreaBtn{
        margin-left:30px;
    }
</style>

