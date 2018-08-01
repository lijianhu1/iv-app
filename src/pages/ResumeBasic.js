import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  TouchableHighlight
} from 'react-native';
import {commonStyle} from '../styles/commonStyle';
import Toast, {DURATION} from 'react-native-easy-toast';
import NavigationBar from '../components/common/NavigationBar';
import _Picker from '../components/common/Picker';
import ajaxResume from '../js/service/ajaxResume';
import tool from '../js/utils/Tool'
import info from '../js/utils/Info'

export default class User extends Component {
	constructor(props) {
    super(props);
  	this.state = {
  		formInfo : {
	  		name:'',
	  		sex:'',
	  		birthYear:'',
	  		jobYear:'',
	  		education:'',
	  		city:'',
	  		email:'',
	  		telephone:''
	   },
	   paytyper:0,
	   isStep:'',
	   markState:false
  	}
  }
	componentDidMount() {
    this.getResumeDeatil();
  }
  render() {
    return (
    	<View>
    		<NavigationBar
          title='基本信息'
          navigation={this.props.navigation}
        />
	      <View style={styles.container}>
	      	<View style={styles.formWrap}>
						<View style={[styles.base,styles.baseTop]}>
							<View style={[styles.item,styles.itemTop]}>
								<View style={styles.itemTitle}>
									<Text style={styles.itemTitleText}>姓名</Text>
								</View>
								<TextInput style={styles.itemInput} maxlength={20} 
								onChangeText={(data) => this.setForm('name',data)}
								value={this.state.formInfo.name} placeholder="请填写真实姓名便于提现" 
								underlineColorAndroid='transparent'/>
							</View>
							<View style={styles.item}>
								<View style={styles.itemTitle}>
									<Text style={styles.itemTitleText}>性别</Text>
								</View>
								<_Picker ref="sexPicker" title='' style={styles.itemPicker}
								    cback={(index)=>this.setForm('sex',index)} onPress = {this.showMark}
								    type="sex"
								/>
								<View style={styles.inputMore}></View>
							</View>
							<View style={styles.item}>
								<View style={styles.itemTitle}>
									<Text style={styles.itemTitleText}>出生年月</Text>
								</View>
								<_Picker ref="birthYearPicker" title='' style={styles.itemPicker}
								    cback={(data)=>this.setForm('birthYear',data)} 
								    type="birthYear"
								/>
								<View style={styles.inputMore}></View>
							</View>
							<View style={styles.item}>
								<View style={styles.itemTitle}>
									<Text style={styles.itemTitleText}>工作年限</Text>
								</View>
								<_Picker ref="jobYearPicker" title='' style={styles.itemPicker}
								    cback={(data)=>this.setForm('jobYear',data)}
								    type="jobYear"
								/>
								<View style={styles.inputMore}></View>
							</View>
							<View style={styles.item}>
								<View style={styles.itemTitle}>
									<Text style={styles.itemTitleText}>学历</Text>
								</View>
								<_Picker ref="eduPicker" title='' style={styles.itemPicker}
								    cback={(data)=>this.setForm('education',data)}
								    type="education"
								/>
								<View style={styles.inputMore}></View>
							</View>
							<View style={styles.item}>
								<View style={styles.itemTitle}>
									<Text style={styles.itemTitleText}>现居地</Text>
								</View>
								<_Picker ref="cityPicker" title='' style={styles.itemPicker}
								    cback={(data,index)=>this.setCityForm('city',data,index)}
								    type="city"
								/>
								<View style={styles.inputMore}></View>
							</View>
						</View>
						
						<View style={styles.base}>
							<View style={[styles.item,styles.itemTop]}>
								<View style={styles.itemTitle}>
									<Text style={styles.itemTitleText}>电子邮箱</Text>
								</View>
								<TextInput style={styles.itemInput}
								onChangeText={(data) => this.setForm('email',data)}
								value={this.state.formInfo.email} placeholder="请填写" 
								underlineColorAndroid='transparent'/>
							</View>
							<View style={styles.item}>
								<View style={styles.itemTitle}>
									<Text style={styles.itemTitleText}>手机号码</Text>
								</View>
								<TextInput style={styles.itemInput} editable={false}
								value={this.state.formInfo.telephone} placeholder="请填写" 
								underlineColorAndroid='transparent'/>
								<View style={styles.inputMore}></View>
							</View>
						</View>
						<View style={styles.submitWrap}>
							<TouchableOpacity style={styles.submit}
								onPress = {this.basicSubmit.bind(this)}>
			          <Text style={{color: 'white'}}>保 存</Text>
			        </TouchableOpacity>
						</View>
	      	</View>
				</View>	
				{
					this.state.markState?<View style={styles.mark}></View>: null
				}
	    	<Toast
	        ref="toast"
	        style={{backgroundColor:'#000'}}
	        position='top'
	        positionValue={200}
	        fadeInDuration={750}
	        fadeOutDuration={1000}
	        opacity={0.8}
	        textStyle={{color:'#fff'}}
	      />
    	</View>
    );
 	};
 	selectPicker(data){
 		console.log(data)
 	}
 	getResumeDeatil(){
 		ajaxResume.getResumeDeatil({},res=>{
 			if(res.code == 200){
 				let resume = res.resume;
 				let formInfo = this.state.formInfo
 				let cityIndex = tool._matchCity([resume.province,resume.citySuperId,resume.city]);
 				formInfo.name = resume.name;
 				formInfo.sex = resume.sex?resume.sex-1:'';
 				formInfo.birthYear = resume.birthYear||'';
 				formInfo.jobYear = resume.jobYear==undefined?'':resume.jobYear;
 				formInfo.education = resume.education ? tool._match('edu', resume.education, true) - 1 + '' : '';
 				formInfo.province = cityIndex[0]||'';
 				formInfo.citySuperId = cityIndex[1]||'';
 				formInfo.city = cityIndex[2]||'';
 				formInfo.email = resume.email;
 				formInfo.telephone = resume.telephone;
 				this.setState({
		 			formInfo,
		 			paytyper:res.paytyper,
		 			isStep:resume.isStep,
		 		})
 				this.refs.sexPicker.serTitle(tool._match('sex',resume.sex));
 				this.refs.birthYearPicker.serTitle(resume.birthYear);
 				this.refs.jobYearPicker.serTitle(resume.jobYear==undefined?'':resume.jobYear?resume.jobYear+'年':'应届毕业生');
 				this.refs.eduPicker.serTitle(tool._match('edu',resume.education));
 				let cityName = []
 				if(resume.provinceName){
 					cityName.push(resume.provinceName)
 				}
 				if(resume.citySuperName){
 					cityName.push(resume.citySuperName)
 				}
 				if(resume.livingCityName){
 					cityName.push(resume.livingCityName)
 				}
 				this.refs.cityPicker.serTitle(cityName.join('-'));
 			}else{
 				this.refs.toast.show(res.message);
 			}
 		})
 	}
 	showMark(){
 		this.setState({
 			mark:true
 		})
 	}
 	setForm(name,data){
 		let key = this.state.formInfo[name] = data
 		this.setState({
 			key
 		})
 	}
 	setCityForm(name,data,index){
 		let formInfo = this.state.formInfo
 		formInfo[name] = data;
 		formInfo.province = index[0];
 		formInfo.citySuperId = index[1];
 		formInfo.city = index[2];
 		this.setState({
 			formInfo
 		})
 	}
 	basicSubmit(){
 		let that = this;
 		if(!this._checkForm(this.state.formInfo)) return
 		const config = {
 			name:this.state.formInfo.name,
 			sex:info.getGender()[this.state.formInfo.sex+1].id,
 			birthYear:this.state.formInfo.birthYear,
  		jobYear:this.state.formInfo.jobYear,
  		education:info.getEducation()[parseInt(this.state.formInfo.education)+1].id,
  		province: info.getCityList()[this.state.formInfo.province].id,
  		citySuperId: info.getCityList()[this.state.formInfo.province].childList[this.state.formInfo.citySuperId].id,
  		city:info.getCityList()[this.state.formInfo.province].childList[this.state.formInfo.citySuperId].childList[this.state.formInfo.city].id,
  		email:this.state.formInfo.email,
  		telephone:this.state.formInfo.telephone,
  		paytyper:this.state.paytyper,
  		isStep:this.state.isStep,
 		}
 		ajaxResume.addBaseInfo(config, res => {
			if(res.code == 200) {
				setTimeout(function() {
					that.props.navigation.pop()
				}, 1000)
			}else{
				this.refs.toast.show(res.message);
			}
//			tool.showToastText(res.message, res.code == 200)
		})
 	}
 	_checkForm(data){
 		if(!data.name) {
			this.refs.toast.show('请输入姓名');
			return false
		} else if(data.sex==='') {
			this.refs.toast.show('请选择性别');
			return false
		} else if(!data.birthYear) {
			this.refs.toast.show('请选择出生日期');
			return false
		} else if(data.jobYear===''||data.jobYear==undefined) {
			this.refs.toast.show('请选择工作年限');
			return false
		} else if(data.education==='') {
			this.refs.toast.show('请选择学历');
			return false
		} else if(data.city===''||data.city==undefined) {
			this.refs.toast.show('请选择现居地');
			return false
		}/* else if(data.hukouCityIndex[0] === '') {
			this.refs.toast.show('请选择户口所在地');
			return false
		} else if(!data.currentJobTitle) {
			this.refs.toast.show('请选择当前职位');
			return false
		}*/ else if(!tool.verifyEmail(data.email).flag) {
			this.refs.toast.show(tool.verifyEmail(data.email).message);
			return false
		}
		/* else if(!tool.verifyMobile(data.telephone).flag) {
					this.refs.toast.show(tool.verifyMobile(data.telephone).message);
					return false
				}*/
		return true
 	}
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 25,
        paddingTop:1,
    },
    headerStyle: {
        backgroundColor: '#ffffff',
    },
    headerTitleStyle: {
        color: 'black',
        //设置标题的大小
        fontSize: 16,
        //居中显示
        alignSelf: 'center',
    },
    formWrap:{
    	display:'flex',
    	flexDirection:'column',
    },
    base:{
    	marginTop:15,
    	paddingLeft:20,
    	paddingRight:20,
    	backgroundColor:'#FFFFFF',
    },
    baseTop:{
    	marginTop:0,
    },
    item:{
    	position:'relative',
    	display:'flex',
    	flexDirection:'row',
    	alignItems:'center',
    	backgroundColor:'#FFFFFF',
    	borderTopWidth:1,
    	borderTopColor:'#e8e9eb',
    	paddingTop: 0,
    	paddingBottom: 0,
    },
    itemTop:{
    	borderTopWidth:0,
    },
    itemTitle:{
    	flexBasis: 60,
	    justifyContent: 'space-around',
    },
    itemTitleText:{
    	color: '#333'
    },
    itemInput:{
    	flex:1,
    	textAlign:'right',
    	height:40,
    	paddingRight: 15,
    	borderWidth:0,
    	color: '#666'
    },
    itemPicker:{},
    inputMore:{
      height: 9,
      width: 9,
      borderTopWidth: 1,
      borderRightWidth:1,
      borderColor: '#d9d9d9',
      borderStyle: 'solid',
      transform: [{rotateZ:'45deg'}],
      position: 'absolute',
      top: 15,
      right: 2,
    },
    itemTouchableHighlight:{
    	flex:1
    },
    submitWrap:{
    	marginTop:15,
    	paddingLeft:20,
    	paddingRight:20,
    },
    submit:{
    	paddingTop:8,
    	paddingBottom:8,
    	backgroundColor:'#ff4f64',
			borderRadius:50,
			alignItems: 'center',
    	justifyContent: 'center',
    },
    mark:{
    	position:'absolute',
    	left:0,
    	top:0,
    	width:commonStyle.width100,
    	height:commonStyle.height100,
    	backgroundColor:'rgba(0, 0, 0, 0.5)',
    }
});