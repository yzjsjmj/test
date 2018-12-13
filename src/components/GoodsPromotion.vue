<template>
    <div class="goodsPromotion">
        <div class="pulic-header">
            <i  class="fontFamily icon-ayl-shouye icon-shouye"></i>
            <el-breadcrumb separator-class="el-icon-arrow-right" class="">
                <el-breadcrumb-item :to="{ path: '/Backstage' }" >首页</el-breadcrumb-item>
                <el-breadcrumb-item>商品促销</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="public-box" >
            <div class="public-box-wrap">
                <div class="inline-form-wrap">
                    <el-form :inline="true" :model="formInline" class="demo-form-inline">
                        <el-form-item label="商品分类">
                            <el-select v-model="formInline.goods_type" placeholder="请选择商品分类" @change="handleClassifytionChange">
                                <el-option label="全部" value=""></el-option>
                                <el-option   v-for="(item,index) in allTpye"
                                            :key="index"
                                            :label="item"
                                            :value="item">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="">
                            <el-input clearable v-model="formInline.goodsKeywords" placeholder="商品关键字"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" icon="el-icon-search"  @click="goodsSearch">搜索</el-button>
                        </el-form-item>
                    </el-form>
                    <div class="other-operate-btn">
                        <!-- <el-button type="danger" icon="el-icon-delete"  @click="batchDel" >删除</el-button> -->
                        <el-button type="success" icon="el-icon-circle-plus-outline" @click="add">新增促销</el-button>
                    </div>   
                </div>
                <template>
                    <el-table
                        ref="multipleTable"  
                        :data="goodsListArr"
                        border
                        v-loading = "loading"
                        :header-row-style="headerColor"
                        tooltip-effect="dark"
                        style="width: 100%;"
                        >
                        <el-table-column
                            label="商品货号" align="center" width="100"
                            prop="goods_id"
                            >
                        </el-table-column>
                        <el-table-column
                            label="图片" align="center"  width="120"
                            prop="goodsImg"
                           >
                            <template slot-scope="scope">
                                <img class="img-same-css" :src="imgApi + scope.row.image" />
                            </template>
                        </el-table-column>
                        <el-table-column
                            label="商品名称" align="center" 
                            prop="goods_name"
                            >
                        </el-table-column>
                        <el-table-column
                            label="商品分类" align="center"  width="100"
                            prop="goods_type"
                            >
                        </el-table-column>
                        <el-table-column
                            label="促销时间" align="center" 
                            prop="time"
                            >
                        </el-table-column>
                        <el-table-column
                            label="促销规则" align="center"  width="160"
                            prop="promotion_type"
                           >
                        </el-table-column>
                        <el-table-column
                            label="促销状态" align="center"  width="130"
                            prop="STATUS"
                             >
                        </el-table-column>
                        <el-table-column label="操作"  width="200" align="center">
                            <template slot-scope="scope">
                                <el-button
                                   size="mini" 
                                    icon="el-icon-edit"
                                @click="linkEditGoodsPromotion(scope.$index, scope.row,'edit')">编辑</el-button>
                                <el-button
                                   size="mini" type="danger"
                                   icon="el-icon-delete"
                                @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table> 
                </template>
                <div class="pagination-wrap">
                    <el-pagination
                        @current-change="handleCurrentChange"
                        background
                        :current-page="currentPage"
                        :page-size="pageSize"
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
                //页面商品数量
                pageSize:  10,
                //当前页，默认值为1
                currentPage:1  , 
                //所有分类
                allTpye:[],
                //商品总数
                total:0,   
                loading:true,
                imgApi:this.globalData.imgApi,
                //行内元素表单数据
                formInline: {
                    goods_type: '',                        //商品分类
                    goodsKeywords: '',                    //商品关键字
                },
                //商品列表数据
                goodsListArr: [],
                multipleSelectArr:[],                   //多选数据数组
                oper_person:'',//用户id
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
                        priv_id:'12',
                    },{emulateJSON:true})
                    .then( (res) => {  
                        console.log(res)
                        // 处理成功的结果 
                        var res =   res.body;
                        if(res.error_code==0){
                            this.getPromotionList (this.formInline.goods_type,this.currentPage,this.pageSize);
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
            //获取促销商品
            getPromotionList (type,currentPage,pageSize) {
                this.$http.post(""+this.globalData.api+"/ayl_weshopManage/goodsPromotion",{
                    type:type,       //商品类型
                    keyWord:this.formInline.goodsKeywords,          //商品关键字
                    currentPage:currentPage ,      //当前页，默认值为1
                    pageSize: pageSize          //每页几个商品，默认值为10
                },{emulateJSON: true}).then(res=>{
                    res = res.body
                    if (res.error_code == 0) {
                         res.rows.forEach((v,i)=>{
                            if(v.promotion_type==0){
                                v.promotion_type = v.promotion_value/10+'折';
                                    if(v.STATUS==0){
                                        v.STATUS = '未开始';
                                    }else if(v.STATUS==1){
                                        v.STATUS = '促销中';
                                    } else {
                                        v.STATUS = '已结束'
                                    }
                            } else {
                                v.promotion_type = '直降'+ v.promotion_value+'元';
                                    if(v.STATUS == 0){
                                        v.STATUS = '未开始';
                                    }else if(v.STATUS==1){
                                        v.STATUS = '促销中';
                                    } else {
                                        v.STATUS = '已结束'
                                    }
                            }
                        })
                        this.goodsListArr = res.rows
                        // console.log(res.rows)
                        this.allTpye = res.allType
                        this.total = res.total
                        this.loading = false;
                    } else {
                        this.loading = false;
                        this.goodsListArr = [];
                        this.total=0; 
                        console.log('查无数据')
                    }
                })
            },
            //事件-分类项发生变化时
            handleClassifytionChange(val) {
                this.loading = true
                this.goodsListArr = []
                this.getPromotionList(val,this.currentPage,this.pageSize)
            },
            //事件-选择项发生变化
            // handleSelectionChange(val) {
            //     this.multipleSelectArr = val;
            //     console.log(val)
            // },
            //事件-搜索
            goodsSearch() {
                this.loading = true
                setTimeout(() => {
                    this.getPromotionList (this.formInline.goods_type,this.currentPage,this.pageSize)
                }, 200);
            },
            //事件-每页size变化
            // handleSizeChange(val) {
            //     this.goodsListArr = []
            //     this.getPromotionList(this.formInline.goods_type,this.currentPage,val)
            // },
            //事件-当前页变化
            handleCurrentChange(val) {
                this.loading = true
                setTimeout(() => {    
                    this.goodsListArr = []
                    this.getPromotionList(this.formInline.goods_type,val,this.pageSize)
                }, 500);
            },
            //事件-批量删除
            // batchDel(){
            //     if(this.multipleSelectArr.length!=0){
            //         this.handleDelete();
            //     }else{
            //         this.delDataTip();
            //     }  
            // },
            //单个删除
            handleDelete(index, row) {
                console.log(row)
                this.$confirm('确认删除选择的信息?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                    }).then(() => {
                        this.$http.post(""+this.globalData.api+"/ayl_weshopManage/deleteGoodsPromotion",{
                            oper_person:this.oper_person,            //用户id
                            goodsId: row.goods_id,   //商品id
                            startTime: row.start_time,   //促销开始时间
                        },{emulateJSON:true}).then(res=>{
                            res = res.body 
                            if (res.error_code == 0) {
                                this.loading = true
                                this.getPromotionList (this.formInline.goods_type,this.currentPage,this.pageSize)
                                this.$message({
                                    type:'success',
                                    message:'删除成功'
                                })
                            } else {
                                this.$message.error({
                                    message:res.message
                                })
                            }                      
                        }) 
                        
                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消删除'
                        });          
                });
            },
            //事件-添加
            add(){
                this.$router.push({path:'/GoodsPromotionAdd'})
            },
            //事件-链接商品列表编辑
            linkEditGoodsPromotion(index,row,word){
                // console.log(row);
                this.$router.push({name:'GoodsPromotionEdit',params:{dataObj: row}}) 
            },
            //对话框关闭
            handleClose(done) {
                done();
            },
            //表头颜色
            headerColor({row, rowIndex}){
                return  this.globalMethods.tabelHeaderColor();
            }
        },
        beforeDestroy () {
            
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
    .el-form-item__content{
        position: relative;
    }
    .same-unit{
        position: absolute;
        top:0;
        left:410px;
        z-index:10;
    }
    .img-same-css{
        width:80px;
        height:80px;
    }
</style>

