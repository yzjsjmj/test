<template>
    <div class="freightSetting">
        <div class="pulic-header">
            <i  class="fontFamily icon-ayl-shouye icon-shouye"></i>
            <el-breadcrumb separator-class="el-icon-arrow-right" class="">
                <el-breadcrumb-item :to="{ path: '/Backstage' }" >首页</el-breadcrumb-item>
                <el-breadcrumb-item :to="{ path: '/GoodsList' }">商品列表</el-breadcrumb-item>
                <el-breadcrumb-item>商品添加</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
         <div class="public-box" >
            <div class="public-box-wrap">
                <el-form   label-width="100px" label-position="left" id="myForm"
                        :model="goodsAllInfo" :rules="rules"  ref="goodsAllInfo">
                    <div class="goodsBasicInfo">
                        <div class="same-header">
                            <span class="same-header-left">基本信息</span>
                            <el-button type="default" size="small" icon="el-icon-back" @click="backPage" >返回</el-button>
                        </div>
                        <div class="goodsBasicInfo-wrap">
                            <div class="goodsBasicInfo-left">
                                    <el-form-item label="商品货号" prop="goodsArtNum">
                                        <el-input v-model="goodsAllInfo.goodsArtNum"></el-input>
                                    </el-form-item>
                                    <el-form-item label="商品名称" prop="goodsName">
                                        <el-input v-model="goodsAllInfo.goodsName"></el-input>
                                    </el-form-item>
                                    <el-form-item label="商品分类" prop="goodsType">
                                        <el-select v-model="goodsAllInfo.goodsType" placeholder="请选择商品单位">
                                            <el-option 
                                                v-for="(item,index) in allType "
                                                :key = "index"
                                                :label="item"
                                                :value="item"
                                            ></el-option>
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item label="商品单位" prop="goodsUnit">
                                        <el-select v-model="goodsAllInfo.goodsUnit" placeholder="请选择商品单位">
                                            <el-option 
                                                v-for="(item,index) in allUnit "
                                                :key = "index"
                                                :label="item"
                                                :value="item"
                                            ></el-option>
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item label="销售价格" prop="salesPrice" class="cc">
                                        <el-input type="number" v-model="goodsAllInfo.salesPrice"></el-input>
                                        <span class="same-unit">元</span>
                                    </el-form-item>
                                    <el-form-item label="是否上架" prop="isUpShelves">
                                        <el-radio-group v-model="goodsAllInfo.isUpShelves">
                                            <el-radio label="是"></el-radio>
                                            <el-radio label="否"></el-radio>
                                        </el-radio-group>
                                    </el-form-item>
                            </div>
                            <div class="goodsBasicInfo-right">
                                <div class="show-mainPicture">
                                    <span class="show-mainPicture-left">展示主图<br>(最多4张)</span>
                                    <el-upload  class="show-mainPicture-right"
                                    :action="imgUploadApi"
                                        list-type="picture-card"
                                        multiple
                                        :disabled="wordBool"
                                        :limit="4"
                                        :on-success="mainPictrueUploadSuccess"
                                        :on-error="mainPictrueUploadError"
                                        :on-remove="mainPictrueRemove">
                                        <i class="el-icon-plus"></i>
                                    </el-upload>
                                </div>
                                <span class="errorInfo-tip" v-if="mainPictureBool">请至少选择一张主图</span>
                                <div class="show-mainPicture mt40">
                                    <span class="show-mainPicture-left">详情图<br>(最多15张)</span>
                                    <el-upload class="show-mainPicture-right"
                                    :action="imgUploadApi"
                                        list-type="picture-card"
                                        multiple
                                        :disabled="wordBool"
                                        :limit="15"
                                        :on-success="detailsPictureUploadSuccess"
                                        :on-error="detailsPictureUploadError"
                                        :on-remove="detailsPictureRemove">
                                        <i class="el-icon-plus"></i>
                                    </el-upload>
                                </div>
                                <span class="errorInfo-tip" v-if="detailsPictureBool" >请至少选择一张详情图</span>
                                
                            </div>
                        </div>
                    </div>
                    <div class="goodsStockInfo mt20">
                        <div class="same-header">
                            <span class="same-header-left">库存信息</span>
                        </div>
                        <div class="goodsStockInfo-wrap">
                            <el-form-item  label="期初库存数" prop="stockNum">
                                <el-input type="number" v-model="goodsAllInfo.stockNum" ></el-input>
                                <span class="same-unit">期初库存数，是您在添加该商品时，商品的数量</span>
                            </el-form-item>
                            <el-form-item label="库存预警" prop="stockWarn">
                                <el-input type="number" v-model="goodsAllInfo.stockWarn" ></el-input>
                                <span class="same-unit">设置最低库存，当低于该库存数时，会消息提醒</span>
                            </el-form-item>
                        </div>
                    </div>
                    <div class="goodsAttr mt30">
                        <div class="same-header">
                            <span class="same-header-left">商品属性</span>
                        </div>
                        <div class="goodsStockInfo-wrap">
                            <el-form-item label="商品颜色" prop="goodsColors">
                                <el-checkbox-group v-model="goodsAllInfo.goodsColors">
                                    <el-checkbox 
                                       v-for="(item,index) in allColor"
                                       :key= "index"
                                       :label="item"
                                       name="color"
                                    ></el-checkbox>
                                </el-checkbox-group>
                            </el-form-item>
                            <el-form-item label="商品材质" prop="goodsCaiZhi">
                                <el-radio-group v-model="goodsAllInfo.goodsCaiZhi">
                                    <el-radio 
                                       v-for="(item,index) in allMaterial"
                                       :key= "index"
                                       :label="item"
                                       :value="item"
                                    >{{item}}</el-radio>
                                </el-radio-group>
                            </el-form-item>
                            <el-form-item label="商品克重" prop="goodsWeight">
                                <el-input type='number'  v-model="goodsAllInfo.goodsWeight" ></el-input>
                                <span class="same-unit">g</span>
                            </el-form-item>
                            <el-form-item  label="商品尺寸长" prop="goodsLong">
                                <el-input type= 'number' v-model="goodsAllInfo.goodsLong" ></el-input>
                                <span class="same-unit">cm</span>
                            </el-form-item>
                            <el-form-item label="商品尺寸高" prop="goodsHigh">
                                <el-input type= 'number'  v-model="goodsAllInfo.goodsHigh" ></el-input>
                                <span class="same-unit">cm</span>
                            </el-form-item>
                        </div>
                    </div>
                    <div class="other-operate-btn mt30" v-if="!wordBool">
                        <el-button type="primary" @click="submitForm('goodsAllInfo')">保 存</el-button>
                        <el-button @click="resetForm('goodsAllInfo')" >取 消</el-button>
                    </div> 
                </el-form>      
            </div>    
        </div>
    </div>
</template>
<script>
    export default {
        data(){
            var check = (rule, value, callback) => {
               if (value < 0) {
                    callback(new Error('不能为负数!'))
                } else{
                    callback()
                }
            }
            var check2 = (rule, value, callback) => {
                var reg = /^\+?[1-9][0-9]*$/
               if (reg.test(value)) {
                    callback()
                } else{
                    callback(new Error('不能为负数!'))
                }
            }
            return{
                aa:{enctype:'multipart/form-data'},
                imgUploadApi:this.globalData.imgUploadApi,
                preGoodsId:'',//原始商品货号
                word:'',                                   //是编辑还是查看
                allColor:[],     //所有可选的商品颜色
                allUnit:[],      //所有可选的商品单位
                allMaterial:[],  //所有可选的商品材料
                allType:[],     //所有可选的商品类型
                //商品基本信息
                goodsAllInfo:{
                    goodsArtNum:'',                           //商品货号
                    goodsName:'',                             //商品名称
                    goodsType:'',                             //商品分类
                    goodsUnit:'',                             //商品单位
                    salesPrice:'',                            //销售价格
                    isUpShelves:'是',                         //是否上架
                    stockNum:'' ,                              //期初库存数
                    stockWarn:'' ,                              //库存预警
                    goodsColors:[],                            //商品颜色
                    goodsCaiZhi:'',                            //商品材质
                    goodsWeight:'',                            //商品克重
                    goodsLong:'',                              //商品长
                    goodsHigh:''                               //商品高
                },
                rules: {
                    goodsArtNum: [
                        { required: true, message: '请输入商品货号', trigger: 'blur' },
                    ],
                    goodsName: [
                        { required: true, message: '请输入商品名称', trigger: 'blur' },
                    ],
                    goodsType: [
                        { required: true, message: '请输入商品分类', trigger: 'blur' },
                    ],
                    goodsUnit: [
                        { required: true, message: '请输入商品单位', trigger: 'blur' },
                    ],
                    salesPrice: [
                        { required: true, message: '请输入销售价格', trigger: 'change' },
                        { validator:check,trigger:'blur',message:'输入格式不正确'}
                    ],
                    isUpShelves: [
                        { required: true, message: '请选择是否上架', trigger: 'blur' },
                    ],
                    stockNum:[
                        { required:true, message:'请输入期初库存数量', trigger:'blur'},
                        { validator:check2,trigger:'blur',message:'只能输入正整数'}
                    ],
                    stockWarn:[
                        { required:true, message:'请输入库存预警数量', trigger:'blur'},
                        { validator:check2,trigger:'blur',message:'只能输入正整数'}
                    ],
                    goodsColors:[
                        { required:true, message:'请至少选择一个颜色',trigger:'change'}
                    ],
                    goodsCaiZhi:[
                        { required:true, message:'请选择商品材质',trigger:'blur'}
                    ],
                    goodsWeight:[
                        { required: true, message: '不能为空'},
                        { validator:check,trigger:'blur',message:'请输入正确的数值'}
                    ],
                    goodsLong:[
                        { required: true, message: '不能为空'},
                        { validator:check,trigger:'blur',message:'请输入正确的数值'}
                    ],
                    goodsHigh:[
                        { required: true, message: '不能为空'},
                        { validator:check,trigger:'blur',message:'请输入正确的数值'}
                    ]
                },
                mainPictureArr : [     //主图arr
                   
                ],         
                mainPictureBool:false,        //主图提示
                detailsPictureArr:[            //详情图
                    
                ],
                showMainPictureArr:[], //展示主图
                showDetailsPictureArr:[], //展示详情图         
                detailsPictureBool:false,     //详情图提示
                wordBool:false,               //查看为true,编辑为false,默认为false
                oper_person:'',//用户id
                    
            }
        },
        //vue创建实例后，还没有挂载在元素上 ,预先请求ajsx数据
        created () {
            // //权限判断
            // var  roleId  = this.globalMethods.getCookie('roleId');
            // this.oper_person  = this.globalMethods.getCookie('userId');
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
                        priv_id:'2',
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
                    ""+this.globalData.api+"/ayl_weshopManage/listAllGoodsAttr",
                    {   
                        
                    },{emulateJSON:true})
                    .then( (res) => {  
                        console.log(res)
                        // 处理成功的结果 
                        var res =   res.body;
                        this.allColor = res.allColor;
                        this.allMaterial = res.allMaterial;
                        this.allType = res.allType;
                        this.allUnit = res.allUnit;
                        
                    }).catch(function(res) {  
                        //捕捉异常                 
                        console.log(res);
                        this.loading = false;               
                    }
                );
            },
            //事件-返回上一页
            backPage(){
                this.$router.go(-1);
            },
            //新增商品列表请求提交
            addGoodsListRequestSubmit(){
                this.$http.post(
                    ""+this.globalData.api+"/ayl_weshopManage/insertGoods",
                    // "http://172.16.1.41:8080/ayl_weshopManage/insertGoods",
                    {   
                        oper_person:this.oper_person,            //用户id
                        goods:JSON.stringify(
                            {
                                goods_id:this.goodsAllInfo.goodsArtNum,      //商品货号
                                goods_name:this.goodsAllInfo.goodsName,    //商品名称
                                goods_type:this.goodsAllInfo.goodsType,    //商品类型
                                goods_unit:this.goodsAllInfo.goodsUnit,  //商品单位
                                price:this.goodsAllInfo.salesPrice*100,     //价格
                                status:this.goodsAllInfo.isUpShelves=='是'?'0':'1',   //是否上下架
                                count:this.goodsAllInfo.stockNum,    //库存
                                min_count:this.goodsAllInfo.stockWarn,  //库存预警
                                goods_quality:this.goodsAllInfo.goodsCaiZhi,  //商品材质
                                goods_weight:this.goodsAllInfo.goodsWeight,//商品重量
                                goods_long:this.goodsAllInfo.goodsLong,  //商品长度
                                goods_width:this.goodsAllInfo.goodsHigh,  //商品宽度
                                ins_time:this.globalMethods.getCurrentDate,  //添加时间
                                image:this.mainPictureArr[0]!=undefined?this.mainPictureArr[0]:'',      //商品主图
                                image1:this.mainPictureArr[1]!=undefined?this.mainPictureArr[1]:'', 
                                image2:this.mainPictureArr[2]!=undefined?this.mainPictureArr[2]:'', 
                                image3:this.mainPictureArr[3]!=undefined?this.mainPictureArr[3]:'', 
                                goods_desc:'',   //商品描述
                                barcode:''      //商品条形码  
                            }
                        ),
                        color:JSON.stringify(this.goodsAllInfo.goodsColors),   //商品颜色
                        images:JSON.stringify(this.detailsPictureArr),   //商品详情图
                    },{emulateJSON:true})
                    .then( (res) => {  
                        console.log(res)
                        // 处理成功的结果 
                        var res =   res.body;
                        if(res.error_code==0){
                            this.$message({
                                message: '新增成功',
                                type: 'success'
                            });
                            setTimeout(()=>{
                                this.$router.push({path:'/GoodsList'});
                            },300)
                        }else{
                            this.$message({
                                message: '新增失败',
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
            //事件-提交表单
            submitForm(goodsAllInfo){
                // console.log(basicInfo,stockInfo,attrInfo)
                this.$refs[goodsAllInfo].validate((valid) => {
                    if (valid) {
                         //判断主图和详情图有没有上传
                        if(this.mainPictureArr!=0 && this.detailsPictureArr!=0){
                            console.log('on submit!!');
                            this.addGoodsListRequestSubmit();    
                        }else{
                            console.log('error submit!!');
                        }
                    } else {
                        return false;
                    }
                });
                if(this.mainPictureArr==0 ){
                    this.mainPictureBool = true;    //主图提示显示
                }
                if(this.detailsPictureArr==0 ){
                    this.detailsPictureBool = true;   //详情图提示显示
                }
                 
            },
            //事件-取消、重置
            resetForm(goodsAllInfo) {
                this.$refs[goodsAllInfo].resetFields();
                this.mainPictureBool = false;
                this.detailsPictureBool = false;
            },
            //事件-主图上传成功
            mainPictrueUploadSuccess(responseFile,res, file) {
                console.log(res)
                if(res){ 
                    this.mainPictureArr.push(res.response);
                    console.log(this.mainPictureArr)
                }
                if(this.mainPictureArr!=0){
                    this.mainPictureBool = false;
                }
            },
            //事件-主图上传失败
            mainPictrueUploadError(err, file, fileList){
                console.log(err, file, fileList)
            },
            //事件-主图上传删除
            mainPictrueRemove(file, fileList) {
                console.log(file, fileList);
                this.mainPictureArr.forEach((v,i)=>{
                    if(v == file.response){
                        this.mainPictureArr.splice(i,1);
                    }
                })
                console.log(this.mainPictureArr)
                if(this.mainPictureArr==0){
                    this.mainPictureBool = true;
                }
                // console.log(this.mainPictureArr)
            },
            //事件-详情图上传成功
            detailsPictureUploadSuccess(responseFile,res, file) {
                // console.log(res)
                if(res){ 
                    this.detailsPictureArr.push( res.response );
                }
                if(this.detailsPictureArr!=0){
                    this.detailsPictureBool = false;
                }
            },
            //事件-详情图上传失败
            detailsPictureUploadError(err, file, fileList){
                console.log(err, file, fileList)
            },
            //事件-详情图上传删除
            detailsPictureRemove(file, fileList) {
                console.log(file, fileList);
                this.detailsPictureArr.forEach((v,i)=>{
                    if(v == file.response){
                       this.detailsPictureArr.splice(i,1)
                    }
                })
                if(this.detailsPictureArr==0){
                    this.detailsPictureBool = true;
                }
                console.log(this.detailsPictureArr)
            },
        }
    }
</script>
<style scoped>
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
    .goodsBasicInfo-wrap{
        display: flex;
        align-items:stretch;
        padding-top:30px;
    }
    .goodsBasicInfo-left{
        padding:0px 10px 20px 10px;
    }
    .other-operate-btn{
        text-align:center;
    }
    .el-form-item__content{
        position: relative;
    }
    .el-input{
        width:400px;
    }
    .same-unit{
        position: absolute;
        top:0;
        left:410px;
        z-index:10;
    }
    .same-stock-tip{
        position: absolute;
        top:0;
        right:-310px;
        z-index:10;
    }
    .goodsBasicInfo-right{
        flex:1;
        margin-left:100px;
    }
    .show-mainPicture{
        display: flex;
        align-items: stretch;
    }
    .show-mainPicture-left{
        flex-basis:80px;
        font-size:14px;
        margin-right:30px;
    }
    .show-mainPicture-right{
        flex:1;
    }
    .goodsStockInfo-wrap{
        padding:30px 0  0 10px;
    }
    .errorInfo-tip{
        color: #fa5555;
        font-size: 12px;
        line-height: 1;
        padding-top: 4px;
    }
</style>

