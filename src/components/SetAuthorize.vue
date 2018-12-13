<template>
    <div class="salesReport">
        <div class="pulic-header">
            <i  class="fontFamily icon-ayl-shouye icon-shouye"></i>
            <el-breadcrumb separator-class="el-icon-arrow-right" class="">
                <el-breadcrumb-item :to="{ path: '/Backstage' }" >首页</el-breadcrumb-item>
                <el-breadcrumb-item :to="{ path: '/RoleList' }">角色列表</el-breadcrumb-item>
                <el-breadcrumb-item>设置权限</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="public-box" >
            <div class="public-box-wrap">
                <div class="setAuthorize-wrap" v-loading="loading">
					<ul class="setAuthorize-ul">
						<li>
                            <el-checkbox :indeterminate="goodsAuthorizeObj.isIndeterminate"
							    v-model="goodsAuthorizeObj.checkAll" @change="goodsCheckAllChange"
							 >商品管理
							</el-checkbox>
							<el-checkbox-group class="same-margin"
								v-model="goodsAuthorizeObj.checkedArr" 
								@change="goodsCheckedChange">
								<el-checkbox 
								    v-for="(item,index) in goodsAuthorizeObj.optionsArr" 
									:label="item" :key="index"
							    >{{item}}
							    </el-checkbox>
							</el-checkbox-group>
						</li>
						<li>
                            <el-checkbox :indeterminate="memberAuthorizeObj.isIndeterminate"
							    v-model="memberAuthorizeObj.checkAll" @change="memberCheckAllChange"
							 >会员管理
							</el-checkbox>
							<el-checkbox-group class="same-margin"
								v-model="memberAuthorizeObj.checkedArr" 
								@change="memberCheckedChange">
								<el-checkbox 
								    v-for="(item,index) in memberAuthorizeObj.optionsArr" 
									:label="item" :key="index"
							    >{{item}}
							    </el-checkbox>
							</el-checkbox-group>
						</li>
						<li>
                            <el-checkbox :indeterminate="orderAuthorizeObj.isIndeterminate"
							    v-model="orderAuthorizeObj.checkAll" @change="orderCheckAllChange"
							 >订单管理
							</el-checkbox>
							<el-checkbox-group class="same-margin"
								v-model="orderAuthorizeObj.checkedArr" 
								@change="orderCheckedChange">
								<el-checkbox 
								    v-for="(item,index) in orderAuthorizeObj.optionsArr" 
									:label="item" :key="index"
							    >{{item}}
							    </el-checkbox>
							</el-checkbox-group>
						</li>
						<li>
                            <el-checkbox :indeterminate="statisticsAuthorizeObj.isIndeterminate"
							    v-model="statisticsAuthorizeObj.checkAll" @change="statisticsCheckAllChange"
							 >统计管理
							</el-checkbox>
							<el-checkbox-group class="same-margin"
								v-model="statisticsAuthorizeObj.checkedArr" 
								@change="statisticsCheckedChange">
								<el-checkbox 
								    v-for="(item,index) in statisticsAuthorizeObj.optionsArr" 
									:label="item" :key="index"
							    >{{item}}
							    </el-checkbox>
							</el-checkbox-group>
						</li>
						<li>
                            <el-checkbox :indeterminate="basicAuthorizeObj.isIndeterminate"
							    v-model="basicAuthorizeObj.checkAll" @change="basicCheckAllChange"
							 >基础设置
							</el-checkbox>
							<el-checkbox-group class="same-margin"
								v-model="basicAuthorizeObj.checkedArr" 
								@change="basicCheckedChange">
								<el-checkbox 
								    v-for="(item,index) in basicAuthorizeObj.optionsArr" 
									:label="item" :key="index"
							    >{{item}}
							    </el-checkbox>
							</el-checkbox-group>
						</li>
						<li>
                            <el-checkbox :indeterminate="promotionAuthorizeObj.isIndeterminate"
							    v-model="promotionAuthorizeObj.checkAll" @change="promotionCheckAllChange"
							 >营销
							</el-checkbox>
							<el-checkbox-group class="same-margin"
								v-model="promotionAuthorizeObj.checkedArr" 
								@change="promotionCheckedChange">
								<el-checkbox 
								    v-for="(item,index) in promotionAuthorizeObj.optionsArr" 
									:label="item" :key="index"
							    >{{item}}
							    </el-checkbox>
							</el-checkbox-group>
						</li>
						<li>
                            <el-checkbox :indeterminate="systemAuthorizeObj.isIndeterminate"
							    v-model="systemAuthorizeObj.checkAll" @change="systemCheckAllChange"
							 >系统设置
							</el-checkbox>
							<el-checkbox-group class="same-margin"
								v-model="systemAuthorizeObj.checkedArr" 
								@change="systemCheckedChange">
								<el-checkbox 
								    v-for="(item,index) in systemAuthorizeObj.optionsArr" 
									:label="item" :key="index"
							    >{{item}}
							    </el-checkbox>
							</el-checkbox-group>
						</li>
					</ul>
					<div class="footer-btn-operate">
						<el-button type="primary" @click="submitForm">保 存</el-button>
						<el-button @click="cancelForm">取 消</el-button>
					</div>
				</div>
            </div>    
        </div>
    </div>
</template>
<script>
export default {	 
	data() {
		return {
			//提交数据
			retrunIndex:-1,
			// submitDataArr:[],
			//接收数据
			goodsAuthorizeArr:[], //商品权限
			memberAuthorizeArr:[], //会员权限
			orderAuthorizeArr:[], //订单权限
			statisticsAuthorizeArr:[], //统计权限
			basicAuthorizeArr:[], //基础权限
			promotionAuthorizeArr:[], //营销权限
			systemAuthorizeArr:[], //系统权限
			//商品权限对象
			goodsAuthorizeObj:{
                checkAll: false,    //权限属性
				checkedArr: [],    //已选数据
				optionsArr: [], //选项数据
				isIndeterminate: true,   //是否为全选
				storeArr:[],
			},
			//会员权限对象
			memberAuthorizeObj:{
                checkAll: false,    //权限属性
				checkedArr: [],    //已选数据
				optionsArr: [], //选项数据
				isIndeterminate: true,   //是否为全选
				storeArr:[],
			},
			//订单权限对象
			orderAuthorizeObj:{
                checkAll: false,    //权限属性
				checkedArr: [],    //已选数据
				optionsArr: [], //选项数据
				isIndeterminate: true,   //是否为全选
				storeArr:[],
			},
			//统计权限对象
			statisticsAuthorizeObj:{
                checkAll: false,    //权限属性
				checkedArr: [],    //已选数据
				optionsArr: [], //选项数据
				isIndeterminate: true,   //是否为全选
				storeArr:[],
			},
			//基础设置权限对象
			basicAuthorizeObj:{
                checkAll: false,    //权限属性
				checkedArr: [],    //已选数据
				optionsArr: [], //选项数据
				isIndeterminate: true,   //是否为全选
				storeArr:[],
			},
			//营销权限对象
			promotionAuthorizeObj:{
                checkAll: false,    //权限属性
				checkedArr: [],    //已选数据
				optionsArr: [], //选项数据
				isIndeterminate: true,   //是否为全选
				storeArr:[]
			},
			//系统设置权限对象
			systemAuthorizeObj:{
                checkAll: false,    //权限属性
				checkedArr: [],    //已选数据
				optionsArr: [], //选项数据
				isIndeterminate: true,   //是否为全选
				storeArr:[]
			},
			oper_person:'',//用户id
			loading:true
			
		};
	},
	created() {
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
                        priv_id:'14',
                    },{emulateJSON:true})
                    .then( (res) => {  
                        console.log(res)
                        // 处理成功的结果 
                        var res =   res.body;
                        if(res.error_code==0){
                            var role_id = this.$route.params.role_id;
							if(role_id){
								this.role_id = role_id;
								this.requestData(role_id);
							}else{
								this.$message({
									type:'warning',
									message:'无角色id,已返回上一页'
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
		requestData(role_id){
            this.$http.post(
				""+this.globalData.api+"/ayl_weshopManage/getUserRoleAuthority",
				// "http://172.16.1.39:8080/ayl_weshopManage/getUserRoleAuthority",
				{   
					role_id:role_id
				},{emulateJSON:true})
				.then( (res) => {  
					console.log(res)
					// 处理成功的结果 
					var res =   res.body;
					if(res.error_code==0){
						var tempArr1 = this.goodsAuthorizeArr = res.good_management_priv;//商品权限
						var tempArr2 = this.memberAuthorizeArr = res.member_management_priv;//会员权限
						var tempArr3 = this.orderAuthorizeArr = res.order_management_priv;//订单权限
						var tempArr4 = this.statisticsAuthorizeArr = res.Statistics_management_priv;//统计权限
						var tempArr5 = this.basicAuthorizeArr = res.Basic_setting_priv;//基础权限
						var tempArr6 = this.promotionAuthorizeArr = res.Marketing_priv;//营销权限
						var tempArr7 = this.systemAuthorizeArr = res.system_management_priv;//系统权限
						// console.log(tempArr1)
						//商品权限 选项数据
						if(tempArr1.length!=0){
							var tempObj = this.goodsAuthorizeObj;
							tempArr1.forEach((v,i)=>{
								tempObj.optionsArr.push(v.authorityName);
								if(v.status==0){
									tempObj.checkedArr.push(v.authorityName);
									tempObj.storeArr.push({
										priv_id:v.priv_id,
						                status:v.status,
									})
								}else{
									tempObj.storeArr.push({
										priv_id:v.priv_id,
						                status:v.status,
									})
								}
							})
						}
						//会员权限 选项数据
						if(tempArr2.length!=0){
							var tempObj = this.memberAuthorizeObj;
							tempArr2.forEach((v,i)=>{
								tempObj.optionsArr.push(v.authorityName);
								if(v.status==0){
									tempObj.checkedArr.push(v.authorityName);
									tempObj.storeArr.push({
										priv_id:v.priv_id,
						                status:v.status,
									})
								}else{
									tempObj.storeArr.push({
										priv_id:v.priv_id,
						                status:v.status,
									})
								}
							})
						}
						//订单权限 选项数据
						if(tempArr3.length!=0){
							var tempObj = this.orderAuthorizeObj;
							tempArr3.forEach((v,i)=>{
								tempObj.optionsArr.push(v.authorityName);
								if(v.status==0){
									tempObj.checkedArr.push(v.authorityName);
									tempObj.storeArr.push({
										priv_id:v.priv_id,
						                status:v.status,
									})
								}else{
									tempObj.storeArr.push({
										priv_id:v.priv_id,
						                status:v.status,
									})
								}
							})
						}
						//统计权限 选项数据
						if(tempArr4.length!=0){
							var tempObj = this.statisticsAuthorizeObj;
							tempArr4.forEach((v,i)=>{
								tempObj.optionsArr.push(v.authorityName);
								if(v.status==0){
									tempObj.checkedArr.push(v.authorityName);
									tempObj.storeArr.push({
										priv_id:v.priv_id,
						                status:v.status,
									})
								}else{
									tempObj.storeArr.push({
										priv_id:v.priv_id,
						                status:v.status,
									})
								}
							})
						}
						//基础权限 选项数据
						if(tempArr5.length!=0){
							var tempObj = this.basicAuthorizeObj;
							tempArr5.forEach((v,i)=>{
								tempObj.optionsArr.push(v.authorityName);
								if(v.status==0){
									tempObj.checkedArr.push(v.authorityName);
									tempObj.storeArr.push({
										priv_id:v.priv_id,
						                status:v.status,
									})
								}else{
									tempObj.storeArr.push({
										priv_id:v.priv_id,
						                status:v.status,
									})
								}
							})
						}
						//营销权限 选项数据
						if(tempArr6.length!=0){
							var tempObj = this.promotionAuthorizeObj;
							tempArr6.forEach((v,i)=>{
								tempObj.optionsArr.push(v.authorityName);
								if(v.status==0){
									tempObj.checkedArr.push(v.authorityName);
									tempObj.storeArr.push({
										priv_id:v.priv_id,
						                status:v.status,
									})
								}else{
									tempObj.storeArr.push({
										priv_id:v.priv_id,
						                status:v.status,
									})
								}
							})
						}
						//系统权限 选项数据
						if(tempArr7.length!=0){
							var tempObj = this.systemAuthorizeObj;
							tempArr7.forEach((v,i)=>{
								tempObj.optionsArr.push(v.authorityName);
								if(v.status==0){
									tempObj.checkedArr.push(v.authorityName);
									tempObj.storeArr.push({
										priv_id:v.priv_id,
						                status:v.status,
									})
								}else{
									tempObj.storeArr.push({
										priv_id:v.priv_id,
						                status:v.status,
									})
								}
							})
						}
						this.loading = false;
					}else{
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
		//商品权限选择
		goodsCheckAllChange(val) {
			//val true ,false
			var tempArr = [];
			var  arr =  this.goodsAuthorizeArr;
			if(val){
				arr.forEach((v,i)=>{
					tempArr.push({
						priv_id:v.priv_id,
						status:0,
						authorityName:v.authorityName
					})
				})
			}else{
				var index = -1;
				arr.forEach((v,i)=>{
					index = arr.indexOf(v);
					if(index!=-1){
						tempArr.push({
							priv_id:v.priv_id,
							status:1,
							authorityName:v.authorityName
						})
					}
				})
			}
			this.goodsAuthorizeObj.storeArr = tempArr;
			this.goodsAuthorizeObj.checkedArr = val ? this.goodsAuthorizeObj.optionsArr : [];
			this.goodsAuthorizeObj.isIndeterminate = false;	
		},
		goodsCheckedChange(strArr) {
			let checkedCount = strArr.length;
			var tempArr = [];
			var  arr =  this.goodsAuthorizeArr;
			arr.forEach((v,i)=>{
				tempArr.push({
					priv_id:v.priv_id,
					status:1,
					authorityName:v.authorityName
				})
			})
			tempArr.forEach((v,i)=>{
				strArr.forEach((item,j)=>{
					if(item == v.authorityName){
						v.status = 0;
					}
				})
			})
			this.goodsAuthorizeObj.storeArr = tempArr;
			this.goodsAuthorizeObj.checkAll = checkedCount === this.goodsAuthorizeObj.optionsArr.length;
			this.goodsAuthorizeObj.isIndeterminate = checkedCount > 0 && checkedCount < this.goodsAuthorizeObj.optionsArr.length;
		},
		//会员全选选择
		memberCheckAllChange(val) {
			//val true ,false
			var tempArr = [];
			var  arr =  this.memberAuthorizeArr;
			if(val){
				arr.forEach((v,i)=>{
					tempArr.push({
						priv_id:v.priv_id,
						status:0,
						authorityName:v.authorityName
					})
				})
			}else{
				var index = -1;
				arr.forEach((v,i)=>{
					index = arr.indexOf(v);
					if(index!=-1){
						tempArr.push({
							priv_id:v.priv_id,
							status:1,
							authorityName:v.authorityName
						})
					}
				})
			}
			this.memberAuthorizeObj.storeArr = tempArr;
			this.memberAuthorizeObj.checkedArr = val ? this.memberAuthorizeObj.optionsArr : [];
			this.memberAuthorizeObj.isIndeterminate = false;
		},
		memberCheckedChange(strArr) {
			let checkedCount = strArr.length;
			var tempArr = [];
			var  arr =  this.memberAuthorizeArr;
			arr.forEach((v,i)=>{
				tempArr.push({
					priv_id:v.priv_id,
					status:1,
					authorityName:v.authorityName
				})
			})
			tempArr.forEach((v,i)=>{
				strArr.forEach((item,j)=>{
					if(item == v.authorityName){
						v.status = 0;
					}
				})
			})
			this.memberAuthorizeObj.storeArr = tempArr;
			this.memberAuthorizeObj.checkAll = checkedCount === this.memberAuthorizeObj.optionsArr.length;
			this.memberAuthorizeObj.isIndeterminate = checkedCount > 0 && checkedCount < this.memberAuthorizeObj.optionsArr.length;
		},
		//订单全选选择
		orderCheckAllChange(val) {
			//val true ,false
			var tempArr = [];
			var  arr =  this.orderAuthorizeArr;
			if(val){
				arr.forEach((v,i)=>{
					tempArr.push({
						priv_id:v.priv_id,
						status:0,
						authorityName:v.authorityName
					})
				})
			}else{
				var index = -1;
				arr.forEach((v,i)=>{
					index = arr.indexOf(v);
					if(index!=-1){
						tempArr.push({
							priv_id:v.priv_id,
							status:1,
							authorityName:v.authorityName
						})
					}
				})
			}
			this.orderAuthorizeObj.storeArr = tempArr;
			this.orderAuthorizeObj.checkedArr = val ? this.orderAuthorizeObj.optionsArr : [];
			this.orderAuthorizeObj.isIndeterminate = false;
		},
		orderCheckedChange(strArr) {
			let checkedCount = strArr.length;
			var tempArr = [];
			var  arr =  this.orderAuthorizeArr;
			arr.forEach((v,i)=>{
				tempArr.push({
					priv_id:v.priv_id,
					status:1,
					authorityName:v.authorityName
				})
			})
			tempArr.forEach((v,i)=>{
				strArr.forEach((item,j)=>{
					if(item == v.authorityName){
						v.status = 0;
					}
				})
			})
			this.orderAuthorizeObj.storeArr = tempArr;
			this.orderAuthorizeObj.checkAll = checkedCount === this.orderAuthorizeObj.optionsArr.length;
			this.orderAuthorizeObj.isIndeterminate = checkedCount > 0 && checkedCount < this.orderAuthorizeObj.optionsArr.length;
		},
		//统计全选选择
		statisticsCheckAllChange(val) {
			//val true ,false
			var tempArr = [];
			var  arr =  this.statisticsAuthorizeArr;
			if(val){
				arr.forEach((v,i)=>{
					tempArr.push({
						priv_id:v.priv_id,
						status:0,
						authorityName:v.authorityName
					})
				})
			}else{
				var index = -1;
				arr.forEach((v,i)=>{
					index = arr.indexOf(v);
					if(index!=-1){
						tempArr.push({
							priv_id:v.priv_id,
							status:1,
							authorityName:v.authorityName
						})
					}
				})
			}
			this.statisticsAuthorizeObj.storeArr = tempArr;
			this.statisticsAuthorizeObj.checkedArr = val ? this.statisticsAuthorizeObj.optionsArr : [];
			this.statisticsAuthorizeObj.isIndeterminate = false;
		},
		statisticsCheckedChange(strArr) {
			let checkedCount = strArr.length;
			var tempArr = [];
			var  arr =  this.statisticsAuthorizeArr;
			arr.forEach((v,i)=>{
				tempArr.push({
					priv_id:v.priv_id,
					status:1,
					authorityName:v.authorityName
				})
			})
			tempArr.forEach((v,i)=>{
				strArr.forEach((item,j)=>{
					if(item == v.authorityName){
						v.status = 0;
					}
				})
			})
			this.statisticsAuthorizeObj.storeArr = tempArr;
			this.statisticsAuthorizeObj.checkAll = checkedCount === this.statisticsAuthorizeObj.optionsArr.length;
			this.statisticsAuthorizeObj.isIndeterminate = checkedCount > 0 && checkedCount < this.statisticsAuthorizeObj.optionsArr.length;
		},
		//基础全选选择
		basicCheckAllChange(val) {
			//val true ,false
			var tempArr = [];
			var  arr =  this.basicAuthorizeArr;
			if(val){
				arr.forEach((v,i)=>{
					tempArr.push({
						priv_id:v.priv_id,
						status:0,
						authorityName:v.authorityName
					})
				})
			}else{
				var index = -1;
				arr.forEach((v,i)=>{
					index = arr.indexOf(v);
					if(index!=-1){
						tempArr.push({
							priv_id:v.priv_id,
							status:1,
							authorityName:v.authorityName
						})
					}
				})
			}
			this.basicAuthorizeObj.storeArr = tempArr;
			this.basicAuthorizeObj.checkedArr = val ? this.basicAuthorizeObj.optionsArr : [];
			this.basicAuthorizeObj.isIndeterminate = false;
		},
		basicCheckedChange(strArr) {
			let checkedCount = strArr.length;
			var tempArr = [];
			var  arr =  this.basicAuthorizeArr;
			arr.forEach((v,i)=>{
				tempArr.push({
					priv_id:v.priv_id,
					status:1,
					authorityName:v.authorityName
				})
			})
			tempArr.forEach((v,i)=>{
				strArr.forEach((item,j)=>{
					if(item == v.authorityName){
						v.status = 0;
					}
				})
			})
			this.basicAuthorizeObj.storeArr = tempArr;
			this.basicAuthorizeObj.checkAll = checkedCount === this.basicAuthorizeObj.optionsArr.length;
			this.basicAuthorizeObj.isIndeterminate = checkedCount > 0 && checkedCount < this.basicAuthorizeObj.optionsArr.length;
		},
		//营销全选选择
		promotionCheckAllChange(val) {
			//val true ,false
			var tempArr = [];
			var  arr =  this.promotionAuthorizeArr;
			if(val){
				arr.forEach((v,i)=>{
					tempArr.push({
						priv_id:v.priv_id,
						status:0,
						authorityName:v.authorityName
					})
				})
			}else{
				var index = -1;
				arr.forEach((v,i)=>{
					index = arr.indexOf(v);
					if(index!=-1){
						tempArr.push({
							priv_id:v.priv_id,
							status:1,
							authorityName:v.authorityName
						})
					}
				})
			}
			this.promotionAuthorizeObj.storeArr = tempArr;
			this.promotionAuthorizeObj.checkedArr = val ? this.promotionAuthorizeObj.optionsArr : [];
			this.promotionAuthorizeObj.isIndeterminate = false;
		},
		promotionCheckedChange(strArr) {
			let checkedCount = strArr.length;
			var tempArr = [];
			var  arr =  this.promotionAuthorizeArr;
			arr.forEach((v,i)=>{
				tempArr.push({
					priv_id:v.priv_id,
					status:1,
					authorityName:v.authorityName
				})
			})
			tempArr.forEach((v,i)=>{
				strArr.forEach((item,j)=>{
					if(item == v.authorityName){
						v.status = 0;
					}
				})
			})
			this.promotionAuthorizeObj.storeArr = tempArr;
			this.promotionAuthorizeObj.checkAll = checkedCount === this.promotionAuthorizeObj.optionsArr.length;
			this.promotionAuthorizeObj.isIndeterminate = checkedCount > 0 && checkedCount < this.promotionAuthorizeObj.optionsArr.length;
		},
		//系统全选选择
		systemCheckAllChange(val) {
			//val true ,false
			var tempArr = [];
			var  arr =  this.systemAuthorizeArr;
			if(val){
				arr.forEach((v,i)=>{
					tempArr.push({
						priv_id:v.priv_id,
						status:0,
						authorityName:v.authorityName
					})
				})
			}else{
				var index = -1;
				arr.forEach((v,i)=>{
					index = arr.indexOf(v);
					if(index!=-1){
						tempArr.push({
							priv_id:v.priv_id,
							status:1,
							authorityName:v.authorityName
						})
					}
				})
			}
			this.systemAuthorizeObj.storeArr = tempArr;
			this.systemAuthorizeObj.checkedArr = val ? this.systemAuthorizeObj.optionsArr : [];
			this.systemAuthorizeObj.isIndeterminate = false;
		},
		systemCheckedChange(strArr) {
			let checkedCount = strArr.length;
			var tempArr = [];
			var  arr =  this.systemAuthorizeArr;
			arr.forEach((v,i)=>{
				tempArr.push({
					priv_id:v.priv_id,
					status:1,
					authorityName:v.authorityName
				})
			})
			tempArr.forEach((v,i)=>{
				strArr.forEach((item,j)=>{
					if(item == v.authorityName){
						v.status = 0;
					}
				})
			})
			this.systemAuthorizeObj.storeArr = tempArr;
			this.systemAuthorizeObj.checkAll = checkedCount === this.systemAuthorizeObj.optionsArr.length;
			this.systemAuthorizeObj.isIndeterminate = checkedCount > 0 && checkedCount < this.systemAuthorizeObj.optionsArr.length;
		},
		//事件-提交表单
		submitForm() {
			var submitDataArr = [];
			// console.log(this.goodsAuthorizeObj.storeArr)
			// console.log(this.memberAuthorizeObj.storeArr)
			// console.log(this.orderAuthorizeObj.storeArr)
			// console.log(this.statisticsAuthorizeObj.storeArr)
			// console.log(this.basicAuthorizeObj.storeArr)
			// console.log(this.promotionAuthorizeObj.storeArr)
			// console.log(this.systemAuthorizeObj.storeArr)
			submitDataArr = submitDataArr.concat(
				this.goodsAuthorizeObj.storeArr,
				this.memberAuthorizeObj.storeArr,
				this.orderAuthorizeObj.storeArr,
				this.statisticsAuthorizeObj.storeArr,
				this.basicAuthorizeObj.storeArr,
				this.promotionAuthorizeObj.storeArr,
				this.systemAuthorizeObj.storeArr,
			);
			console.log(submitDataArr)
			if(submitDataArr.length!=0){
                this.$http.post(
					""+this.globalData.api+"/ayl_weshopManage/setUserRoleAuthority",
					// "http://172.16.1.39:8080/ayl_weshopManage/setUserRoleAuthority",
					{   
						oper_person:this.oper_person,            //用户id
						role_id:this.role_id,
						authoritylist:JSON.stringify(submitDataArr)
					},{emulateJSON:true})
					.then( (res) => {  
						console.log(res)
						// 处理成功的结果 
						var res =   res.body;
						if(res.error_code==0){
							this.$message({
								type:'success',
								message:'设置成功'
							})
							setTimeout(()=>{
								this.$router.go(-1);
							},1000)
							
						}else{
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
		//取消表单，回上一级
		cancelForm() {
		    this.$router.go(-1);
		},
	}
}	
</script>
<style scoped>
	.footer-btn-operate {
		text-align: center;
		margin-top: 30px;
	}
	.public-box-wrap {
	    padding-bottom: 30px;
	}
	.same-margin{
		margin: 15px 0;
		padding-left:40px;
	}
	.setAuthorize-wrap{
		padding:15px 20px 0;
	}
	.setAuthorize-ul>li +li{
		margin-top: 40px;
	}
</style>

