import tool from '../utils/Tool'

export default {
	//获取secction
	getSessionKey(data, success) {
		tool.ajax({
			url: tool.serviceUrl2 + '/common/getSessionKey',
			data,
			loading: false,
			type: 'GET',
			success
		})
	},
	//wx登录
	wxLogin(data, success) {
		tool.ajax({
			url: tool.serviceUrl2 + '/login/wxLogin',
			type: 'POST',
			data,
			success
		})
	},
	// 发送短信验证码接口
	wxSendSMS(data, success) {
		tool.ajax({
			url: tool.serviceUrl + '/miniLogin/wxSendSMS',
			data,
			success,
			type: 'GET'
		})
	},
	//手机号码登录
	telephoenLogin(data, success) {
		tool.ajax({
			url: tool.serviceUrl2 + '/login/telephoenLogin',
			data,
			success
		})
	},
	//手机号码注册
	telephoenRegister(data, success) {
		tool.ajax({
			url: tool.serviceUrl2 + '/register/telephoenRegister',
			data,
			success
		})
	},
	//获取个人金币记录（账户余额、总计收益、昨日收益）
	getPesonalGlodLogs(data, success) {
		tool.ajax({
			url: tool.serviceUrl + '/personalRecord/getPesonalGoldLogs',
			data,
			type: 'GET',
			success
		})
	},
	//主动投递获取金币记录
	getDeliveryGoldLogs(data, success) {
		tool.ajax({
			url: tool.serviceUrl + '/personalRecord/getDeliveryGoldLogs',
			data,
			type: 'POST',
			success
		})
	},
	//获取被企业下载获得金币记录
	getDownloadGoldLogs(data, success) {
		tool.ajax({
			url: tool.serviceUrl + '/personalRecord/getDownloadGoldLogs',
			data,
			type: 'POST',
			success
		})
	}, //获取被企业下载获得金币记录
	baiduCity(data, success) {
		tool.ajax({
			url: 'https://api.map.baidu.com/geocoder/v2/',
			data,
			type: 'GET',
			success
		})
	},
	//最近7天受益
	incomeStatistics(data, success) {
		tool.ajax({
			url: tool.serviceUrl + '/personalRecord/incomeStatistics',
			data,
			type: 'POST',
			success
		})
	},
	//提现
	transferPayment(data, success) {
		tool.ajax({
			url:tool.serviceUrl+'/miniLogin/paymentApply',  //提现申请
			// url: tool.serviceUrl + '/miniLogin/transferPayment',		//立即到帐
			data,
			type: 'GET',
			success
		})
	},
	//保存个人信息
	savePersonalInfo(data, success) {
		tool.ajax({
			url: tool.serviceUrl + '/personalSet/savePersonalInfo',
			data,
			type: 'POST',
			success
		})
	},
	//简历完善度
	countType(success) {
		tool.ajax({
			url: tool.serviceUrl + '/resumeControllOperation/countType',
			type: 'GET',
			success
		})
	},
	wxSignOut(data, success) {
		tool.ajax({
			data,
			url: tool.serviceUrl + '/miniLogin/wxSignOut',
			type: 'GET',
			success
		})
	},
	updatetelephone(data, success) {
		tool.ajax({
			data,
			url: tool.serviceUrl + '/resumeControllOperation/updatetelephone',
			type: 'POST',
			success
		})
	},
	updateSelfEvaluate(data, success) {
		tool.ajax({
			data,
			url: tool.serviceUrl + '/resumeControllOperation/updateSelfEvaluate',
			type: 'POST',
			success
		})
	},
	//提现记录
	getPaymentApplyLogs(data, success) {
		tool.ajax({
			data,
			url: tool.serviceUrl + '/miniLogin/getPaymentApplyLogs',
			type: 'GET',
			success
		})
	},
	//獲取unionId
	getUnionId(data, success) {
		tool.ajax({
			data,
			url: tool.serviceUrl2 + '/common/getUnionId',
			type: 'GET',
			success
		})
	},
	//获取是否为绑定激活用户
	getoperatebind(success) {
		tool.ajax({
			url: tool.serviceUrl + '/resumeControllOperation/getoperatebind',
			type: 'get',
			success
		})
	},
	//获取待领取的红包列表
	getRedPacketsList(data,success) {
		tool.ajax({
		  data,
			url: tool.serviceUrl2 + '/redPackets/getRedPacketsList',
			type: 'get',
			success
		})
	},
	//红包领取
	receiveRedPackets(success) {
		tool.ajax({
			url: tool.serviceUrl2 + '/redPackets/receiveRedPackets',
			type: 'get',
			success
		})
	},
	//判断是否显示红包弹框
	isShowRedPackets(success) {
		tool.ajax({
			url: tool.serviceUrl2 + '/redPackets/isShowRedPackets',
			type: 'get',
			success
		})
	},
	//获取已邀请注册成功的人数和已得到的钱数
	getRecommendNum(success) {
		tool.ajax({
			url: tool.serviceUrl2 + '/redPackets/getRecommendNum',
			type: 'get',
			success
		})
	},
	//获取金币流水
	getPersonalGoldLogs(data, success) {
		tool.ajax({
			url: tool.serviceUrl + '/personalRecord/getPersonalGoldLogs',
			data,
			type: 'POST',
			success
		})
	},
	//任务完成状况
	getGoldTask(success) {
		tool.ajax({
			url: tool.serviceUrl + '/resumeControllOperation/getGoldTask',
			type: 'GET',
			success
		})
	},
	//是否能提现
  isAllowferPayment(success) {
		tool.ajax({
			url: tool.serviceUrl + '/miniLogin/isAllowferPayment',
			type: 'GET',
			success
		})
	},
	//是否能提现
  getUnreceivedCount(success) {
		tool.ajax({
			url: tool.serviceUrl2 + '/redPackets/getUnreceivedCount',
			type: 'GET',
			success
		})
	},
	//微信小程序中 金币排行榜列表
  getRankingList(success) {
		tool.ajax({
			url: tool.serviceUrl2 + '/ranking/getRankingList',
			type: 'GET',
			success
		})
	},
	//微信小程序中 用户膜拜
  userWorship(data,success) {
		tool.ajax({
			url: tool.serviceUrl2 + '/ranking/userWorship',
			type: 'GET',
			data,
			success
		})
	},
};