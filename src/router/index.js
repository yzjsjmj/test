import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import Backstage from '@/components/Backstage'
import Home from '@/components/Home'
import GoodsAttr from '@/components/GoodsAttr'
import GoodsList from '@/components/GoodsList'
import GoodsListAdd from '@/components/GoodsListAdd'
import GoodsListLook from '@/components/GoodsListLook'
import GoodsStock from '@/components/GoodsStock'
import GoodsType from '@/components/GoodsType'
import GoodsPromotion from '@/components/GoodsPromotion'
import GoodsPromotionEdit from '@/components/GoodsPromotionEdit'
import GoodsPromotionAdd from '@/components/GoodsPromotionAdd'
import AdminList from '@/components/AdminList'
import FreightSetting from '@/components/FreightSetting'
import IncomeDetails from '@/components/IncomeDetails'
import PhoneSetting from '@/components/PhoneSetting'
import MemberLevel from '@/components/MemberLevel'
import MemberList from '@/components/MemberList'
import MemberDetails from '@/components/MemberDetails'
import OperationLog from '@/components/OperationLog'
import OrderList from '@/components/OrderList'
import OrderDetails from '@/components/OrderDetails'
import RoleList from '@/components/RoleList'
import SalesReport from '@/components/SalesReport'
import SetAuthorize from '@/components/SetAuthorize'



Vue.use(Router)

export default new Router({
  routes: [
	//登录组件
	{
		path: '/',
		name:"Login",
		component:Login,
	},
    //后台管理页面
	{
		path: '/',
		name: 'Backstage',
		component: Backstage,
		//redirect:'/home',
		children: [
		//首页组件
		{
			path: '/home',
			name: 'Home',
			component: Home
		},
		//商品属性
		{
			path: '/GoodsAttr',
			name: 'GoodsAttr',
			component: GoodsAttr,
		},
		//商品列表
		{
			path: '/GoodsList',
			name: 'GoodsList',
			component: GoodsList,
		},
		//商品列表添加
		{
			path: '/GoodsListAdd',
			name: 'GoodsListAdd',
			component: GoodsListAdd,
		},
		//商品列表查看
		{
			path: '/GoodsListLook',
			name: 'GoodsListLook',
			component: GoodsListLook,
		},

		//商品库存
		{
			path: '/GoodsStock',
			name: 'GoodsStock',
			component: GoodsStock,
		},
		//商品分类
		{
			path: '/GoodsType',
			name: 'GoodsType',
			component: GoodsType,
		},
		//商品促销
		{
			path: '/GoodsPromotion',
			name: 'GoodsPromotion',
			component: GoodsPromotion,
		},
		//商品促销编辑
		{
			path: '/GoodsPromotionEdit',
			name: 'GoodsPromotionEdit',
			component: GoodsPromotionEdit,
		},
		//商品促销增加
		{
			path: '/GoodsPromotionAdd',
			name: 'GoodsPromotionAdd',
			component: GoodsPromotionAdd,
		},
		//管理员列表 
		{
			path: '/AdminList',
			name: 'AdminList',
			component: AdminList,
		},
		//运费设置  
		{
			path: '/FreightSetting',
			name: 'FreightSetting',
			component: FreightSetting,
		},
		//收入明细  
		{
			path: '/IncomeDetails',
			name: 'IncomeDetails',
			component: IncomeDetails,
		},
		//电话设置  
		{
			path: '/PhoneSetting',
			name: 'PhoneSetting',
			component: PhoneSetting,
		},
		//会员等级  
		{
			path: '/MemberLevel',
			name: 'MemberLevel',
			component: MemberLevel,
		},
		//会员列表 
		{
			path: '/MemberList',
			name: 'MemberList',
			component: MemberList,
		},
		//会员详情
		{
			path: '/MemberDetails',
			name: 'MemberDetails',
			component: MemberDetails,
		},
		//操作日志 
		{
			path: '/OperationLog',
			name: 'OperationLog',
			component: OperationLog,
		},
		//订单列表 
		{
			path: '/OrderList',
			name: 'OrderList',
			component: OrderList,
		},
		//订单详情 
		{
			path: '/OrderDetails',
			name: 'OrderDetails',
			component: OrderDetails,
		},
		//角色列表
		{
			path: '/RoleList',
			name: 'RoleList',
			component: RoleList,
		},
		//角色列表
		{
			path: '/SetAuthorize',
			name: 'SetAuthorize',
			component: SetAuthorize,
		},
		//销售管理
		{
			path: '/SalesReport',
			name: 'SalesReport',
			component: SalesReport,
		},
		]
	},
    
  ]
})
