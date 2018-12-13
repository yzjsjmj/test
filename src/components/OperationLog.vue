<template>
    <div class="operationLog">
        <div class="pulic-header">
            <i  class="fontFamily icon-ayl-shouye icon-shouye"></i>
            <el-breadcrumb separator-class="el-icon-arrow-right" class="">
                <el-breadcrumb-item :to="{ path: '/Backstage' }" >首页</el-breadcrumb-item>
                <el-breadcrumb-item>操作日志</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="public-box" >
            <div class="public-box-wrap">
                <template>
                    <el-table
                        ref="multipleTable"  
                        :data="logListArr"
                        border
                        v-loading = "loading"
                        :header-row-style="headerColor"
                        tooltip-effect="dark"
                        style="width: 100%;"
                       >
                        <el-table-column
                            label="用户名" align="center" width="160"
                            prop="oper_person"
                            >
                        </el-table-column>
                        <el-table-column
                            label="操作ip-地点" align="center"   width="220"
                            prop="oper_ip"
                           >
                        </el-table-column>
                        <el-table-column
                            label="操作时间" align="center"  width="220"
                            prop="ins_time"
                            >
                        </el-table-column>
                        <el-table-column
                            label="分类" align="center"  width="180"
                            prop="type_value"
                            >
                        </el-table-column>
                        <el-table-column
                            label="行为" align="center"  
                            prop="message"
                            >
                        </el-table-column>
                    </el-table> 
                </template>
                <div class="pagination-wrap ">
                    <el-pagination
                        @current-change="handleCurrentChange"
                        background
                        :current-page="currentPage"
                        layout="total,prev, pager, next, jumper"
                        :total="total">
                    </el-pagination>
                </div>  
            </div>    
             
        </div>
    </div>
</template>
<script>
    export default {
        data(){
            return{
                currentPage: 1,//当前页码
                pageCount: 0,//总页数
                pageSize: 10,    //页面显示条数
                total: 0,       //数据总条数
                //商品列表数据
                logListArr: [
                ],
                loading:true
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
                        priv_id:'15',
                    },{emulateJSON:true})
                    .then( (res) => {  
                        // console.log(res)
                        // 处理成功的结果 
                        var res =   res.body;
                        if(res.error_code==0){
                            this.getLogList(this.currentPage);
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
            getLogList () {
              this.$http.post(
                  ""+this.globalData.api+"/ayl_weshopManage/getLogList",
                //   "http://172.16.1.39:8080/ayl_weshopManage/getLogList",
                {   
                    currentPage: this.currentPage,//当前页码
                    pageSize: this.pageSize,    //页面显示条数
                },{emulateJSON: true}).then(res=>{
                    res = res.body
                    if (res.error_code == 0) {
                        this.total = res.total
                        this.pageCount = res.pageCount
                        this.logListArr = res.logList
                        this.loading = false
                    }else{
                        this.logListArr = [];
                        this.total = 0;
                        this.loading = false;
                    }
                }).catch(res=>{
                    this.loading = false;
                })
            },
            //事件-当前页变化
            handleCurrentChange(val) {
                this.logListArr = [];
                this.currentPage = val;
                this.getLogList();
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
    .other-operate-btn{
        flex: 1;
        text-align:right;
        padding-right:50px;
    }
    .pagination-wrap{
        margin-top:40px;
        text-align: center;
    }
    .public-box-wrap{
        padding-bottom:30px;
    }
</style>

