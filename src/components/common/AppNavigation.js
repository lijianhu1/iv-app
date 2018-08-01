import React, {
	Component
} from 'react';
import { YellowBox } from 'react-native';
YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated', 'Module RCTImageLoader']);
import {
	Image,
} from 'react-native';

//引入react-navigation依赖库
import { createBottomTabNavigator, createStackNavigator } from 'react-navigation';

//展示的页面
import Index from '../../pages/Index'; //首页
import Position from '../../pages/Position'; //职位匹配
import MakeMoney from '../../pages/MakeMoney'; //任务
import User from '../../pages/User'; //钱包
import PositionDetail from '../../pages/PositionDetail'; //职位详情
import PositionList from '../../pages/PositionList'; //职位搜索列表
import LoadPage from '../../pages/LoadPage'; //首屏加载
import Resume from '../../pages/Resume'; //简历基本信息编辑
import Search from '../../pages/Search'; //搜索页面
import ResumeBasic from '../../pages/ResumeBasic'; //简历基本信息编辑
import ResumeExpect from '../../pages/ResumeExpect'; //简历期望信息编辑
import ResumeWork from '../../pages/ResumeWork'; //简历工作经历编辑
import ResumeProject from '../../pages/ResumeProject'; //简历项目经历编辑
import ResumeEducation from '../../pages/ResumeEducation'; //简历教育经历编辑
import ResumeSkill from '../../pages/ResumeSkill'; //简历掌握技能编辑
import ResumeTrain from '../../pages/ResumeTrain'; //简历培训经历编辑
import ResumeCertificate from '../../pages/ResumeCertificate'; //简历所获证书编辑
import ResumeEvaluation from '../../pages/ResumeEvaluation'; //简历自我评价编辑
import PositionMatch from '../../pages/PositionMatch'; //星球职位
import Withdraw from '../../pages/Withdraw'; //提现
import WithdrawList from '../../pages/WithdrawList'; //提现记录
import Company from '../../pages/Company'; //公司详情
import Login from '../../pages/Login'; //登录页面
import CityList from '../../pages/CityList'; //城市列表
import Select from '../../pages/Select'; //城市列表

//Tab
export const AppTabNavigator = createBottomTabNavigator({
	//每一个页面的配置
	Index: {
		screen: Index, //当前选项卡加载的页面
		//配置每一个选项卡的样式
		navigationOptions: {
			tabBarLabel: '星球', //显示的标签文字
			//显示的图片
			tabBarIcon: ({ tintColor, focused }) => ( focused ?
				<Image source = { require('../../images/common/index_sel.png') } style = { [{ height: 24, width: 24 }] } />: 
				<Image source = { require('../../images/common/index.png') } style = { [{ height: 24, width: 24 }] } />
			)
		},
},
	Position: {
		screen: Position,
		navigationOptions: {
			tabBarLabel: '职位',
			tabBarIcon: ({ tintColor, focused }) => ( focused ?
				<Image source = { require('../../images/common/position_sel.png') } style = { [{ height: 24, width: 24 }] } /> :
				<Image source = { require('../../images/common/position.png') } style = { [{ height: 24, width: 24 }] } />
			)
		}
	},
	MakeMoney: {
		screen: MakeMoney,
		navigationOptions: {
			tabBarLabel: '任务',
			tabBarIcon: ({ tintColor, focused }) => ( focused ?
				<Image source = { require('../../images/common/makeMoney_sel.png') } style = { [{ height: 24, width: 24 }] } /> :
				<Image source = { require('../../images/common/makeMoney.png') } style = { [{ height: 24, width: 24 }] } />
			),
		}
	},
	User: {
		screen: User,
		navigationOptions: {
			tabBarLabel: '我的资产',
			tabBarIcon: ({ tintColor, focused }) => ( focused ?
				<Image source = { require('../../images/common/user_sel.png') } style = { [{ height: 24, width: 24 }] } /> :
				<Image source = { require('../../images/common/user.png') } style = { [{ height: 24, width: 24 }] } />
			)
		}
	},

}, {
// initialRouteName:'User',  //设置默认屏幕。必须为路由配置中的某个screen。

	//设置TabNavigator的位置
	tabBarPosition: 'bottom',
	//是否在更改标签时显示动画
	animationEnabled: true,
	//是否允许在标签之间进行滑动
	swipeEnabled: true,
	//按 back 键是否跳转到第一个Tab(首页)， none 为不跳转
	backBehavior: "none",
	//设置Tab标签的属性

	tabBarOptions: {
		//Android属性
		upperCaseLabel: false, //是否使标签大写，默认为true
		//共有属性
		showIcon: true, //是否显示图标，默认关闭
		showLabel: true, //是否显示label，默认开启
		activeTintColor: '#ff4f64', //label和icon的前景色 活跃状态下（选中）
		inactiveTintColor: 'gray', //label和icon的前景色 活跃状态下（未选中）
		style: { //TabNavigator 的背景颜色
			backgroundColor: 'white',
			height: 55,
		},
		indicatorStyle: { //标签指示器的样式对象（选项卡底部的行）。安卓底部会多出一条线，可以将height设置为0来暂时解决这个问题
			height: 0,
		},
		labelStyle: { //文字的样式
			fontSize: 13,
			marginTop: -5,
			marginBottom: 5,
		},
		iconStyle: { //图标的样式
			marginBottom: 5,
		}
	},
});
export const AppStackNavigator = createStackNavigator({
	// LoadPage: {
	//   screen: LoadPage,
	//   navigationOptions:{
	//     header:null
	//   }
	// },
	TabNav: { screen: AppTabNavigator, },
	PositionDetail: { screen: PositionDetail, },
	PositionList: { screen: PositionList },
	Resume: { screen: Resume },
	ResumeBasic: { screen: ResumeBasic },
	ResumeExpect: { screen: ResumeExpect },
	ResumeWork: { screen: ResumeWork },
	ResumeProject: { screen: ResumeProject },
	ResumeEducation: { screen: ResumeEducation },
	ResumeSkill: { screen: ResumeSkill },
	ResumeTrain: { screen: ResumeTrain },
	ResumeCertificate: { screen: ResumeCertificate },
	ResumeEvaluation: { screen: ResumeEvaluation },
	Search: { screen: Search },
  	PositionMatch: { screen: PositionMatch },
  	Withdraw: { screen: Withdraw },
  	WithdrawList: { screen: WithdrawList },
  	Company: { screen: Company },
  	Login: { screen: Login },
  	CityList: { screen: CityList },
  	Select: { screen: Select },
}, {
	initialRouteName: 'Select', //设置默认屏幕。必须为路由配置中的某个screen。
	navigationOptions: {
		headerBackTitle: null,
		headerTintColor: '#333',
	},
	headerMode: "none",
})
