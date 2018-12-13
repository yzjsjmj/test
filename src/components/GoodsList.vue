<template>
    <div class="goodsList">
        <div class="pulic-header">
            <i  class="fontFamily icon-ayl-shouye icon-shouye"></i>
            <el-breadcrumb separator-class="el-icon-arrow-right" class="">
                <el-breadcrumb-item :to="{ path: '/Backstage' }" >首页</el-breadcrumb-item>
                <el-breadcrumb-item>商品列表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="public-box" >
            <div class="public-box-wrap">
                <div class="inline-form-wrap">
                    <el-form :inline="true" :model="formInline" class="demo-form-inline">
                        <el-form-item label="商品分类">
                            <el-select v-model="formInline.goodsType" placeholder="请选择商品分类">
                               <el-option
                                    v-for="(item,index) in goodsTypeArr"
                                    :key="index"
                                    :label="item"
                                    :value="item"
                                >
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="是否上架">
                            <el-select v-model="formInline.upShelvesStatus"  placeholder="请选择">
                                <el-option label="上架" value="0"></el-option>
                                <el-option label="下架" value="1"></el-option>
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
                        <el-button type="danger" icon="el-icon-delete"  @click="batchDel" >删除</el-button>
                        <el-button type="primary" icon="el-icon-circle-plus-outline"  @click="add">新增</el-button>
                        <el-upload
                            class="upload-importData"
                            :data="importParams"
                            :action="addGoodsByModel"
                            :on-success="importSuccess"
                            :on-error="importError"
                            :show-file-list="false"
                            :beforeUpload="beforeAvatarUpload"
                            >
                            <el-button type="success" icon="el-icon-download" @click="importData">导入</el-button>
                        </el-upload>
                        <form :action="downloadTemplateUrl" method="post" enctype="multipart/form-data" >
                            <input class="el-button downloadTemplate el-button--text" type="submit"   value="下载模板">
                        </form>
                    </div>   
                </div>
                <div class="upload-wrap inline-form-wrap">
                    
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
                        @selection-change="handleSelectionChange">
                        <el-table-column
                            type="selection"  align="center"  width="80"
                            label="全选"
                            >
                        </el-table-column>
                        <el-table-column
                            label="商品货号" align="center" width="90"
                            prop="goods_id"
                            >
                        </el-table-column>
                        <el-table-column
                            label="图片" align="center"  width="140"
                            prop="goodsImg"
                           >
                            <template slot-scope="scope" >
                                <img class="img-same-css" :src="imgApi + scope.row.image" >
                            </template>
                        </el-table-column>
                        <el-table-column
                            label="商品名称" align="center" 
                            prop="goods_name"
                            >
                        </el-table-column>
                        <el-table-column
                            label="商品分类" align="center"  width="120"
                            prop="goods_type"
                            >
                        </el-table-column>
                        <el-table-column
                            label="销售价格(元)" align="center"  width="120"
                            prop="price"
                            >
                        </el-table-column>
                        <el-table-column
                            label="是否上架" align="center"  width="90"
                            prop="status"
                           >
                        </el-table-column>
                        <el-table-column
                            label="添加时间" align="center"  width="130"
                            prop="ins_time"
                             >
                        </el-table-column>
                        <el-table-column label="操作"  width="180" align="center">
                            <template slot-scope="scope">
                                <el-button
                                   size="mini" type="text"
                                   @click="linkGoodsListLook(scope.$index, scope.row,'look')"
                                >查看</el-button>
                                <el-button
                                   size="mini" type="text"
                                @click="linkGoodsListLook(scope.$index, scope.row,'edit')">编辑</el-button>
                                <el-button
                                   size="mini" type="text"
                                @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table> 
                </template>
                <div class="pagination-wrap">
                    <el-pagination
                        @current-change="handleCurrentChange"
                        background
                        :current-page="crrentPage"
                        :page-size="pageCount"
                        layout="total,prev, pager, next, jumper"
                        :total="total" >
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
            downloadTemplateUrl:this.globalData.api+'/ayl_weshopManage/downloadModel',
            imgApi:this.globalData.imgApi,
            addGoodsByModel:this.globalData.api+'/ayl_weshopManage/addGoodsByModel',
            loading:true,
            crrentPage:1,              //当前页码
            pageCount:10,              //当前页面显示条数
            total:0,                   //总数据条数
            //行内元素表单数据
            formInline: {
                goodsType: '',                        //商品分类
                upShelvesStatus:'',                   //上架状态
                goodsKeywords: '',                    //商品关键字
            },
            //商品列表数据
            goodsListArr: [
                
            ],
            //商品分类
            goodsTypeArr:[],
            multipleSelectArr:[],                   //多选数据数组
            oper_person:'',//用户id
            importParams:{},  //导入传参
            
        }
    },
    //vue创建实例后，还没有挂载在元素上 ,预先请求ajsx数据
    created() {
        //权限判断
        var  roleId  = this.globalMethods.getCookie('roleId');
        this.importParams.oper_person = this.oper_person  = this.globalMethods.getCookie('userId');
        //验证cookie是否失效，验证用户是否存在，最后权限判断
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
                ""+this.globalData.api+"/ayl_weshopManage/goodsList",
                {   
                    currentPage:this.crrentPage,
                    pageSize:this.pageCount,
                    goodsType:this.formInline.goodsType,
                    status:this.formInline.upShelvesStatus,
                    goodsName:this.formInline.goodsKeywords,
                },{emulateJSON:true})
                .then( (res) => {  
                    console.log(res)
                    // 处理成功的结果 
                    var res =   res.body;
                    if(res.error_code==0){
                        var tempArr = res.allType;
                        this.loading = false;
                        res.rows.forEach((v,i)=>{
                            if(v.status==0){
                                v.status = '是';
                            }else{
                                v.status = '否';
                            }
                        })
                        this.goodsListArr = res.rows;
                        tempArr.unshift('全部');
                        this.goodsTypeArr = tempArr;
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
        //删除提交
        delSubmit(goodsIdArr){
            console.log(goodsIdArr )
            this.$http.post(
                ""+this.globalData.api+"/ayl_weshopManage/deleteGoods",
                // "http://172.16.1.41:8080/ayl_weshopManage/deleteGoods",
                {
                   oper_person:this.oper_person,            //用户id
                   goodsId:JSON.stringify(goodsIdArr)
                },{emulateJSON:true})
                .then( (res) => {  
                    console.log(res)
                    // 处理成功的结果 
                    var res =   res.body;
                    if(res.error_code==0){
                        this.requestData();    //刷新数据
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                    }else{
                        this.$message({
                            message: '删除失败',
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
        
        //事件-选择项发生变化时
        handleSelectionChange(val) {
            this.multipleSelectArr = val;
        },
        //事件-搜索
        goodsSearch() {
            if(this.formInline.goodsType=='全部'){
                this.formInline.goodsType='';
            }
            this.requestData();
        },
        //事件-当前页变化
        handleCurrentChange(val) {
            console.log(`当前页: ${val}`);
            this.crrentPage = val;
            this.requestData();
        },
        //事件-批量删除
        batchDel(){
            if(this.multipleSelectArr.length!=0){
                this.handleDelete();
            }else{
                this.delDataTip();
            }  
        },
        //单个删除
        handleDelete(index, row) {
            this.$confirm('确认删除选择的信息?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }).then(() => {
                    var item = this.multipleSelectArr,
                     tempArr = this.goodsListArr,
                     strArr = [];
                    //不勾选单个删除
                    if(index!=undefined){
                        strArr.push(tempArr[index].goods_id);
                        this.delSubmit(strArr);

                    }else{    //勾选批量删除
                        item.forEach((v,i)=>{
                            var jIndex = tempArr.indexOf(v);
                            if(jIndex !== -1){
                                strArr.push(tempArr[jIndex].goods_id);
                            }
                        }) 
                        //批量删除
                        if(strArr.length!=0){
                            this.delSubmit(strArr); 
                        }
                         
                    }
                    
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });          
            });
        },
        //事件-删除消息提示
        delDataTip() {
            var tempArr = this.goodsListArr;
            if(tempArr.length!=0){
                this.$message({
                    message: '没有勾选数据哦',
                    type: 'warning'
                });
            }else{
                this.$message({
                    message: '暂无数据',
                    type: 'warning'
                });
            }
        },
        //事件-添加
        add(){
          this.$router.push({path:'/GoodsListAdd'})
        },
        //事件-链接商品列表查看
        linkGoodsListLook(index,row,word){
            // console.log(index, row,word);
            if(word=='look'){
                this.$router.push({name:'GoodsListLook',params:{word:'look',goodsId:row.goods_id}})
            }else{
                this.$router.push({name:'GoodsListLook',params:{word:'edit',goodsId:row.goods_id}})
            }
            
        },
        //事件-导入
        importData(){
            console.log('导入数据')
        },
        //事件-导入成功
        importSuccess(response,res, file) {
            if(res){
               var data = res.response;
                if(data.error_code==0){
                    this.$message({
                        type:'success',
                        message:'导入成功'
                    })
                }else{
                    this.$message({
                        type:'warning',
                        message:data.error_message
                    })
                }
            }
        },
        //事件-导入失败
        importError(err, file, fileList){
            console.log(err, file, fileList)
        },
        // 上传前对文件的大小的判断
        beforeAvatarUpload (file) {
            // console.log(file)
            const extension = file.name.split('.')[1] === 'xls';
            const isLt2M = file.size / 1024 / 1024 < 10;
            if (!extension ) {
                this.$message({
                    type:'warning',
                    message:'上传模板只能是 xls'
                })
            }
            if (!isLt2M) {
                this.$message({
                    type:'warning',
                    message:'上传模板大小不能超过 10MB!'
                })
            }
            return extension  && isLt2M ;
        },    
        //事件-下载模板
        downloadTemplate(){
            // console.log('下载模板');
        },
        //对话框关闭
        handleClose(done) {
            done();
        },
        //表头颜色
        headerColor({row, rowIndex}){
            return  this.globalMethods.tabelHeaderColor();
        }
    }
}
</script>
<style scoped>
    .inline-form-wrap{
        align-items:stretch;
    }
    .other-operate-btn{
        flex: 1;
        align-self:flex-start;
        justify-content: flex-end;
        display: flex;
        text-align:right;
        
    }
    .upload-importData{
        margin-left:10px;
    }
    .downloadTemplate{
        margin-left:10px;
    }
    .other-operate-btn{
        flex: 1;
        text-align:right;
        padding-right:50px;
    }
    .pagination-wrap{
        margin-top:30px;
        text-align: center;
    }
    .img-same-css{
        width:80px;
        height:80px;
    }
    .upload-wrap{
        padding:0 40px 20px 0;
    }
</style>
