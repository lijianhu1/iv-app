/*该组件只能在 react-native中使用
 * 先安装 yarn add  react-native-picker  
 * 然后 链接 react-native link react-native-picker
 * cback -- 选择后的回调方法 返回值
 * type -- 组件类型 看 componentWillMount() 方法定义
 * 还可以定义其他的，自己传数据，需要进行扩展，但是有缺陷，就是 只能按照这种格式，去到的值也是文字，而不能是id，
 * 如果后端需要id就不能用这个组件
 * */
import React, {
	Component
} from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import Info from '../../js/utils/Info';

import Picker from 'react-native-picker';
let _Picker = null;
class pickerDom extends Component {
	constructor(props) {
		super(props);
		this.state = {
			val: this.props.title,
			data: []
		};
	}
	serTitle(data){
		let val = this.state.val = data
		this.setState({
 			val
 		})
	}
	//组件渲染前
	componentWillMount() {}
	//组件渲染后
	componentDidMount() {}
	//组件销毁
	componentWillUnmount() {
//		_Picker.hide();
	}
	pickerType = () => {
		//根据类型判断 要显示的 组件数据
		switch(this.props.type) {
			case 'sex': //时间
				this.getGender();
				break;
			case 'birthYear': //出生年月
				this.birthYear();
				break;
			case 'jobYear': //工作年限
				this.jobYear();
				break;
			case 'education': //学历
				this.education();
				break;
			case 'city': //现居地
				this.city();
				break;
			case 'expectCity': //期望城市
				this.expectCity();
				break;
			case 'expectWorkType': //工作类型
				this.expectWorkType();
				break;
			case 'expectSalary': //期望月薪
				this.expectSalary();
				break;
			case 'salary': //工作薪资
				this.salary();
				break;
			case 'startTime': //开始时间
				this.startTime();
				break;	
			case 'endTime': //结束时间
				this.endTime();
				break;	
			case 'masterDegree': //熟练程度
				this.masterDegree();
				break;	
			case 'jobState': //求职状态
				this.jobState();
				break;
			case 'getTime': //获得时间
				this.getTime();
				break;	
			case 'time': //时间
				this.time();
				break;
			case 'date': //日期
				this.dates();
				break;
			case 'dateMonth': //日期选择年月份
				this.dateMonth();
				break;
			case 'dateYear': //日期选择年份份
				this.dateYear();
				break;
			case 'provincialUrbanArea': //省市区
				this.provincialUrbanArea();
				break;
			case 'provincialUrban': //省市
				this.provincialUrban();
				break;
		}
	}
	//性别
	getGender = () => {
		let gender = [];
		for(let i in Info.getGender()) {
			gender.push(Info.getGender()[i].value)
		}
		gender.shift();
		this.pickerInit(gender, ['男'], '性别');
	}
	//生日
	birthYear = () => {
		let date = new Date();
		let y = date.getFullYear();
		let m = date.getMonth() + 1;
		let maxY = y - 18;
		let minY = y - 99;
		let data = [
			[],
			[],
		]
//		for(let i = maxY; i >= minY; i--) {
//			data[0].push(i + '年');
//		}
//		for(let i = 1; i <= 12; i++) {
//			data[1].push((i < 10 ? '0' + i : i) + '月');
//		}
		for(let i = maxY; i >= minY; i--) {
			data[0].push(i);
		}
		for(let i = 1; i <= 12; i++) {
			data[1].push(i < 10 ? '0' + i : i);
		}
		this.pickerInit(data, [y, m], '出生年月');
	}
	//工作年限
	jobYear = () => {
		const data = []
		for(var i = 0; i <= 50; i++) {
			data.push(i ? (i + '年') : '应届毕业生');
		}
		this.pickerInit(data, ['应届毕业生'], '工作年限');
	}
	//学历
	education = () => {
		let getEducation = [];
		for(let i in Info.getEducation()) {
			getEducation.push(Info.getEducation()[i].value)
		}
		getEducation.shift()
		this.pickerInit(getEducation, ['高中'], '学历');
	}
	//现居地
	city = () => {
		let data = {};
		let getCityList = Info.getCityList();
		for(let i in getCityList) {
			data[getCityList[i].value] = []
			if(getCityList[i].childList.length) {
				for(let j in getCityList[i].childList) {
					data[getCityList[i].value][getCityList[i].childList[j].value] = []
					if(getCityList[i].childList[j].childList.length) {
						for(let c in getCityList[i].childList[j].childList) {
							data[getCityList[i].value][getCityList[i].childList[j].value].push(getCityList[i].childList[j].childList[c].value)
						}
					}
				}
			}
		}

		let datas = [];
		for(let i in data) {
			let datass = [];
			for(let j in data[i]) {
				let objs = new Object();
				objs[j] = data[i][j]
				datass.push(objs);
			}
			data[i] = datass;
			let obj = new Object();
			obj[i] = data[i];
			datas.push(obj);
		}

		this.pickerInit(datas, ['广东省', '深圳市', '福田区'], '现居地');
	}
	
	/*期望城市*/
	expectCity(){
		let data = {};
		let getCityList = Info.getCityList();
		for(let i in getCityList) {
			data[getCityList[i].value] = []
			if(getCityList[i].childList.length) {
				for(let j in getCityList[i].childList) {
					data[getCityList[i].value].push(getCityList[i].childList[j].value)
				}
			}
		}

		let datas = [];
		for(let i in data) {
			let obj = new Object();
			obj[i] = data[i];
			datas.push(obj);
		}

		this.pickerInit(datas, ['广东省', '深圳市'], '期望城市');
	}
	//工作性质
	expectWorkType = () => {
		let getWorkType = [];
		for(let i in Info.getWorkType()) {
			getWorkType.push(Info.getWorkType()[i].value)
		}
		this.pickerInit(getWorkType, ['全职'], '工作性质');
	}
	//期望月薪
	expectSalary = () => {
		let getSalary = [];
		for(let i in Info.getSalary()) {
			getSalary.push(Info.getSalary()[i].value)
		}
		getSalary.shift()
		this.pickerInit(getSalary, ['1000元/月以下'], '期望月薪');
	}
	//工作薪资
	salary = () => {
		let getSalary = [];
		for(let i in Info.getSalary()) {
			getSalary.push(Info.getSalary()[i].value)
		}
		getSalary[0]='保密';
		getSalary.pop();
		this.pickerInit(getSalary, ['保密'], '工作薪资');
	}
	//开始时间
	startTime = () => {
		let date = new Date();
		let y = date.getFullYear();
		let m = date.getMonth() + 1;
		let endTime = [0,m]
		if(this.props.endTime){
			endTime[0] = y - this.props.endTime.split('-')[0];
			endTime[1] = parseInt(this.props.endTime.split('-')[1]);
		}
		let maxY = y - endTime[0];
		let minY = y - 50;
		let maxM = parseInt(endTime[1]);
		let data = [];
		for(let i = maxY; i >= minY; i--) {
			data[i] = []
			if(maxY == i) {
				for (let j = 1; j <= maxM; j++) {
					data[i].push(j < 10 ? '0' + j : j)
				}
			}else{
				for (let j = 1; j <= 12; j++) {
					data[i].push(j < 10 ? '0' + j : j)
				}
			}
		}

		let datas = [];
		for(let i in data) {
			let obj = new Object();
			obj[i] = data[i];
			datas.push(obj);
		}
		
		datas = datas.reverse()

		this.pickerInit(datas, [y, m], '开始时间');
	}
	//结束时间
	endTime = () => {
		let date = new Date();
		let y = date.getFullYear();
		let m = date.getMonth() + 1;
		let startTime = [50, 1]
		if(this.props.startTime){
			startTime[0] = y - this.props.startTime.split('-')[0];
			startTime[1] = parseInt(this.props.startTime.split('-')[1]);
		}
		let maxY = y;
		let minY = y - startTime[0];
		let maxM = m;
		let minM = parseInt(startTime[1]);
		let data = [];
		data['至今'] = [''];
		for(let i = maxY; i >= minY; i--) {
			data[i] = []
			if(maxY == minY){
				for (let j = minM; j <= maxM; j++) {
					data[i].push(j < 10 ? '0' + j : j)
				}
			}else{
				if(maxY == i) {
					for (let j = 1; j <= maxM; j++) {
						data[i].push(j < 10 ? '0' + j : j)
					}
				}else if(minY == i) {
					for (let j = minM; j <= 12; j++) {
						data[i].push(j < 10 ? '0' + j : j)
					}
				}else{
					for (let j = 1; j <= 12; j++) {
						data[i].push(j < 10 ? '0' + j : j)
					}
				}
			}
		}

		let datas = [];
		for(let i in data) {
			let obj = new Object();
			obj[i] = data[i];
			datas.push(obj);
		}
		
		datas = datas.reverse()

		this.pickerInit(datas, [y, m], '结束时间');
	}
	
	/*熟练程度*/
	masterDegree(){
		let getProficiency = [];
		for(let i in Info.getProficiency()) {
			getProficiency.push(Info.getProficiency()[i].value)
		}
		this.pickerInit(getProficiency, ['一般'], '熟练程度');
	}
	
	/*求职类型*/
	jobState(){
		let getJobStatus = [];
		for(let i in Info.getJobStatus()) {
			getJobStatus.push(Info.getJobStatus()[i].value)
		}
		this.pickerInit(getJobStatus, ['已离职，可立即上岗'], '熟练程度');
	}
	
	/*证书获得时间*/
	getTime(){
		let date = new Date();
		let y = date.getFullYear();
		let m = date.getMonth() + 1;
		let endTime = [0,m]
		let maxY = y - endTime[0];
		let minY = y - 50;
		let maxM = parseInt(endTime[1]);
		let data = [];
		for(let i = maxY; i >= minY; i--) {
			data[i] = []
			if(maxY == i) {
				for (let j = 1; j <= maxM; j++) {
					data[i].push(j < 10 ? '0' + j : j)
				}
			}else{
				for (let j = 1; j <= 12; j++) {
					data[i].push(j < 10 ? '0' + j : j)
				}
			}
		}

		let datas = [];
		for(let i in data) {
			let obj = new Object();
			obj[i] = data[i];
			datas.push(obj);
		}
		
		datas = datas.reverse()

		this.pickerInit(datas, [y, m], '获得时间');
	}
	
	//时间
	time = () => {
		let date = new Date();
		let h = date.getHours();
		let m = date.getMinutes();
		let data = [
			[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23],
			[]
		]
		for(let i = 0; i < 60; i++) {
			data[1].push(i);
		}
		this.pickerInit(data, [h, m], '时间选择');
	}
	//日期 - 天
	dates = () => {
		let date = new Date();
		let y = date.getFullYear();
		let m = String(date.getMonth() + 1);
		let d = String(date.getDate());
		let data = [];
		let year = null;
		let month = null;
		let maxY = y + 10;
		let minY = y - 10;
		for(let i = minY; i <= maxY; i++) {
			year = new Object();
			year[i] = [];
			for(let j = 1; j <= 12; j++) {
				month = new Object();
				month[j] = [];
				let monthDay = currentMonth(j, i);
				let day = [];
				for(let k = 1; k <= monthDay; k++) {
					month[j].push(k);
				}
				year[i].push(month);
			}
			data.push(year);
		}
		this.pickerInit(data, [y, m, d], '日期选择');
	}
	//日期 - 月份
	dateMonth = () => {
		let date = new Date();
		let y = date.getFullYear();
		let m = date.getMonth() + 1;
		let maxY = y + 10;
		let minY = y - 10;
		let data = [
			[],
			[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
		]
		for(let i = minY; i <= maxY; i++) {
			data[0].push(i);
		}
		this.pickerInit(data, [y, m], '年月选择');
	}
	//日期 - 年份
	dateYear = () => {
		let y = new Date().getFullYear();
		let maxY = y + 10;
		let minY = y - 10;
		let data = []
		for(let i = minY; i <= maxY; i++) {
			data.push(i);
		}
		this.setState({
			data: data
		}, function() {
			this.pickerInit([y], '年份选择');
		}.bind(this));

	}
	//省市区
	provincialUrbanArea = () => {
		let jsonData = require('./area.json');
		let data = [];
		for(let i in jsonData) {
			let obj = new Object();
			obj[i] = jsonData[i];
			data.push(obj);
		}
		this.pickerInit(data, ['北京', '北京', '东城区'], '省市区');
	}
	//省市
	provincialUrban = () => {
		let jsonData = require('./area.json');
		let data = [];
		for(let i in jsonData) {
			let obj = new Object();
			let arr = jsonData[i];
			for(let j in arr) {
				obj[i] = [];
				for(let k in arr[j]) {
					obj[i].push(k);
				}
			}
			data.push(obj);
		}
		this.pickerInit(data, ['北京', '北京'], '省市');
	}
	//显示Picker组件
	onPresss = () => {
		
		this.pickerType();
	}
	render() {
		return(
			<TouchableOpacity 
			style={styles.picker}
			onPress = {this.onPresss}
			>
			<Text style={styles.txt}>
				{this.state.val}
			</Text>
		 </TouchableOpacity>
		);
	}
	//组件初始化
	pickerInit = (data, selectedValue, title) => {
		Picker.init({
			pickerData: data,
			selectedValue: selectedValue,
			pickerTextEllipsisLen: 10,
//			pickerTitleText: title,
			pickerTitleText: '',
			pickerConfirmBtnText: '确定',
			pickerCancelBtnText: '取消',
			pickerConfirmBtnColor:[255,79,101,1],
			pickerCancelBtnColor:[255,79,101,1],
			//确定
			onPickerConfirm : (data,index) => {
				switch(this.props.type) {
					case 'city': //现居地
						data = data.join('-');
						break;
					case 'birthYear': //出生日期
						data = data.join('-');
						break;
					case 'startTime': //开始时间
						data = data.join('-');
						break;
					case 'endTime': //结束时间
						data = data[1]?data.join('-'):data[0];
						break;
					case 'expectCity': //期望城市
						data = data.join('-');
						break;
					case 'getTime': //获得时间
						data = data.join('-');
						break;
					case 'time': //时间
						data = data.join(':');
						break;
					case 'date': //日期
						data = data.join('-');
						break;
					case 'dateMonth': //日期选择年月份
						data = data.join('-');
						break;
					case 'dateYear': //日期选择年份
						this.dateYear();
						break;
					case 'provincialUrbanArea': //省市区
						data = data.join(' ');
						break;
					case 'provincialUrban': //省市
						data = data.join(' ');
						break;
				}
				this.setState({
					val: data
				});
				if(this.props.type == 'birthYear'||this.props.type == 'startTime'||this.props.type == 'getTime'){
					this.props.cback(data);
				}else if(this.props.type == 'endTime'){
					this.props.cback(data==='至今'?0:data);
				}else if (this.props.type == 'city'){
					this.props.cback(data,index);
				}else if (this.props.type == 'expectCity'){
					this.props.cback(data,index);
				}else{
					this.props.cback(index[0]);
				}
			},
			//取消
			onPickerCancel: data => {
				console.log(data);
			},
			//选择
			onPickerSelect: data => {
				console.log(data);
			}
		});
		_Picker = Picker;
		_Picker.show();
	}
}
const styles = StyleSheet.create({
	picker: {
		flex: 1,
		height: 40,
		paddingRight: 15,
	},
	txt: {
		flex: 1,
		lineHeight: 38,
		textAlign: 'right',
		color: '#666',
		fontSize: 15,
	}
});
//计算当月天数
currentMonth = (m, y) => {
	var monthDay = 0;
	switch(m) {
		case 1:
		case 3:
		case 5:
		case 7:
		case 8:
		case 10:
		case 12:
			monthDay = 31;
			break;
		case 4:
		case 6:
		case 9:
		case 11:
			monthDay = 30;
			break;
		case 2:
			if(y % 4 == 0 && y % 100 != 0 || y % 400 == 0) {
				monthDay = 29;

			} else {
				monthDay = 28;
			}
	}
	return monthDay;
}
export default pickerDom;