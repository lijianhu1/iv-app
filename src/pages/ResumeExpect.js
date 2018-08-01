import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  ScrollView,
  TouchableHighlight
} from 'react-native';
import {commonStyle} from '../styles/commonStyle';
import Toast, {DURATION} from 'react-native-easy-toast';
import _ from 'lodash'
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
  			job_super:'',
	  		jobTitle:'',
	  		jobTitleSuperId:'',
	  		expectCity:'',
  			expectCitySuperId:'',
  			industryName:'',
  			expectIndustry:'',
  			industrySuperId:'',
  			expectWorkType:'',
  			expectSalary:''
	   	},
	   	showPage:'page',
	   	paytyper:0,
	   	isStep:'',
	   	markState:false,
	   	sltList:[],
	   	choiceList:[],
	   	jobObj:[],
	   	industryObj:[]
  	}
  }
	componentDidMount() {
    this.getResumeDeatil();
  }
	_keyExtractor = (item, index) => index.toString();
	renderButton(image){
    return <TouchableOpacity
      style={{padding: 8}}
      onPress={()=>{
        if(this.state.showPage=='jobTitle'||this.state.showPage=='industry'){
		 			this.setState({showPage:'page'})
		 		}else{
		 			this.props.navigation.pop()
		 		}
      }}>
      <Image
        style={{width: 26, height: 26,tintColor:'#333'}}
        source={image}/>
    </TouchableOpacity>;
  }
  render() {
    return (
    	<View>
	    		<NavigationBar
	          title={this.state.showPage=='jobTitle'?'选择职位':this.state.showPage=='industry'?'选择行业':'期望信息'}
	          leftButton={this.renderButton(require('../images/common/back.png'))}
	        />
		      <View style={[styles.container,this.state.showPage!='jobTitle'&&this.state.showPage!='industry'?styles.show:styles.hide]}>
		      	<View style={styles.formWrap}>
							<View style={[styles.base,styles.baseTop]}>
								<View style={[styles.item,styles.itemTop]}>
									<View style={styles.itemTitle}>
										<Text style={styles.itemTitleText}>期望职位</Text>
									</View>
									<TouchableOpacity 
										underlayColor="#fff" 
										style={styles.pageChange}
										onPress = {()=> this.setShowPage('jobTitle')}
										>
										<Text style={styles.txt}>
											{this.state.formInfo.job_super}
										</Text>
								 	</TouchableOpacity>
									<View style={styles.inputMore}></View>
								</View>
								<View style={styles.item}>
									<View style={styles.itemTitle}>
										<Text style={styles.itemTitleText}>期望城市</Text>
									</View>
									<_Picker ref="expectCityPicker" title='' style={styles.itemPicker}
									    cback={(data,index)=>this.setCityForm('expectCity',data,index)}
									    type="expectCity"
									/>
									<View style={styles.inputMore}></View>
								</View>
								<View style={styles.item}>
									<View style={styles.itemTitle}>
										<Text style={styles.itemTitleText}>期望行业</Text>
									</View>
									<TouchableOpacity 
										underlayColor="#fff"  
										style={styles.pageChange}
										onPress = {()=> this.setShowPage('industry')}
										>
										<Text style={styles.txt}>
											{this.state.formInfo.industryName}
										</Text>
								 	</TouchableOpacity>
								 	
									<View style={styles.inputMore}></View>
								</View>
								<View style={styles.item}>
									<View style={styles.itemTitle}>
										<Text style={styles.itemTitleText}>工作性质</Text>
									</View>
									<_Picker ref="expectWorkTypePicker" title='' style={styles.itemPicker}
									    cback={(data)=>this.setForm('expectWorkType',data)}
									    type="expectWorkType"
									/>
									<View style={styles.inputMore}></View>
								</View>
								<View style={styles.item}>
									<View style={styles.itemTitle}>
										<Text style={styles.itemTitleText}>期望月薪</Text>
									</View>
									<_Picker ref="expectSalaryPicker" title='' style={styles.itemPicker}
									    cback={(data)=>this.setForm('expectSalary',data)}
									    type="expectSalary"
									/>
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
					<View style={[styles.container,this.state.showPage=='jobTitle'||this.state.showPage=='industry'?styles.show:styles.hide]}>
						<View style={styles.changeTop}>
							<Text>已选{this.state.showPage=='jobTitle'?'职位':'行业'}</Text>
							<TouchableOpacity style={styles.choiceBtn}
								onPress = {this.choiceSubmit.bind(this)}>
			          <Text style={{color: '#333'}}>完成</Text>
			        </TouchableOpacity>
						</View>
						
						<View style={styles.choiceWrap}>
							<View style={styles.choiceCon}>
							{
								this.state.choiceList.map((item,index) => {
									return <View style={styles.choiceItem} key={item.id}>
										<TouchableOpacity style={styles.choiceClose}
											onPress = {this.closeList.bind(this,item,index)}>
						          <Text style={{color: '#333',fontSize:15}}>×</Text>
						        </TouchableOpacity>
										<Text numberOfLines={1}>{item.value}</Text>
									</View>
								})
							}
							</View>
						</View>
						<ScrollView>
							{
								this.state.sltList.map((item,index) => {
									return <View style={styles.listWrap} key={item.id}>
										<TouchableOpacity style={styles.listTitle} onPress = {this.listOpen.bind(this,item,index)}>
											<Text>{item.value}</Text>
											<View style={[styles.pickerMore,item.open ? styles.pickerMoreChange : '']}></View>
										</TouchableOpacity>
										{<View style={[styles.listItemBd]}>
											<View style={[styles.listItemBox ,item.open ?styles.listItemBoxShow : '']}>
												{
													item.open?
													item.childList.map((items,indexs) => {
														return 	<TouchableOpacity style={styles.listText} key={items.id} onPress = {this.sltClick.bind(this,index,indexs)}>
																<Image
													        style={{width: 20, height: 20}}
													        source={items.checked?require('../images/common/ico-ok-active.png'):require('../images/common/ico-ok.png')}/>
																<Text style={styles.listTextSty}>{items.value}</Text>
														</TouchableOpacity>
													}):null
												}
											</View>
										</View>}
									</View>
								})
							}
						</ScrollView>
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
 				let cityIndex = tool._matchCity([resume.expectCitySuperId,resume.expectCity]);
 				formInfo.jobTitle = resume.jobTitle;
 				formInfo.job_super = resume.job_super;
 				formInfo.jobTitleSuperId = resume.jobTitleSuperId;
 				formInfo.expectCitySuperId = cityIndex[0]||'';
 				formInfo.expectCity = cityIndex[1]||'';
 				formInfo.industryName = resume.industryName||'';
 				formInfo.expectIndustry = resume.expectIndustry||'';
 				formInfo.industrySuperId = resume.industrySuperId||'';
 				formInfo.expectWorkType = resume.expectWorkType ? tool._match('workType', resume.expectWorkType, true) + '' : '';
 				formInfo.expectSalary = resume.expectSalary ? tool._match('salary', resume.expectSalary, true) - 1 + '' : '';
 				
 				let jobTitleSuperId = resume.jobTitleSuperId.split(',');
 				let job_super = resume.job_super.split(',');
 				let jobTitle = resume.jobTitle.split(',');
 				let jobObj = [];
 				let getPosition = info.getPosition();
 				for (let i in jobTitleSuperId) {
 					jobObj.push({
 						supId:jobTitleSuperId[i],
 						value:job_super[i],
 						id:jobTitle[i]
 					})
 					for (let j in getPosition) {
 						if(getPosition[j].id==jobTitleSuperId[i]){
 							for (let c in getPosition[j].childList) {
 								if(getPosition[j].childList[c].id==jobTitle[i]){
 									getPosition[j].childList[c].checked=true
 									break
 								}
 							}
 							break
 						}
 					}
 				}
 				
 				let industrySuperId = resume.industrySuperId.split(',');
 				let industryName = resume.industryName.split(',');
 				let expectIndustry = resume.expectIndustry.split(',');
 				let industryObj = [];
 				let getIndustry = info.getIndustry();
 				for (let i in industrySuperId) {
 					industryObj.push({
 						supId:industrySuperId[i],
 						value:industryName[i],
 						id:expectIndustry[i]
 					})
 					for (let j in getIndustry) {
 						if(getIndustry[j].id==industrySuperId[i]){
 							for (let c in getIndustry[j].childList) {
 								if(getIndustry[j].childList[c].id==expectIndustry[i]){
 									getIndustry[j].childList[c].checked=true
 									break
 								}
 							}
 							break
 						}
 					}
 				}
 				
 				this.setState({
		 			formInfo,
		 			paytyper:res.paytyper,
		 			isStep:resume.isStep,
		 			jobObj,
		 			industryObj,
		 			getPosition,
		 			getIndustry
		 		})
 				
 				this.refs.expectWorkTypePicker.serTitle(tool._match('workType',resume.expectWorkType));
 				this.refs.expectSalaryPicker.serTitle(tool._match('salary',resume.expectSalary));
 				let cityName = []
 				if(resume.expectCitySuperId){
 					cityName.push(tool._match('city',resume.expectCitySuperId))
 				}
 				if(resume.expectCity){
 					cityName.push(tool._match('city',resume.expectCity))
 				}
 				this.refs.expectCityPicker.serTitle(cityName.join('-'));
 			}else{
 				this.refs.toast.show(res.message);
 			}
 		})
 	}
 	setShowPage(showPage) {
 		
 		this.setState({
 			showPage,
 			sltList:showPage=='jobTitle'?this.state.getPosition:showPage=='industry'?this.state.getIndustry:'',
 			choiceList:showPage=='jobTitle'?this.state.jobObj:showPage=='industry'?this.state.industryObj:'',
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
 		formInfo.expectCitySuperId = index[0];
 		formInfo.expectCity = index[1];
 		this.setState({
 			formInfo
 		})
 	}
 	listOpen(item,index){
 		let sltList = this.state.sltList
 		for (let i in sltList) {
 			if(i == index){
 				sltList[index].open = !sltList[index].open;
 			}else{
 				sltList[i].open = false
 			}
 		}
 		this.setState({
 			sltList
 		})
 	}
 	closeList(item,index){
 		let sltList = this.state.sltList;
 		let choiceList = this.state.choiceList;
 		for (let i in sltList) {
 			if(sltList[i].id==item.supId){
 				for (let j in sltList[i].childList) {
 					if(sltList[i].childList[j].id==item.id){
 						sltList[i].childList[j].checked = false;
 						break
 					}
 				}
 				break
 			}
 		}
		choiceList.splice(index, 1)
 		this.setState({
 			sltList,
 			choiceList
 		})
 	}
 	sltClick(index,indexs){
 		let sltList = this.state.sltList;
 		let choiceList = this.state.choiceList;
 		if(sltList[index].childList[indexs].checked){
 			for (let i in choiceList) {
	 			if(choiceList[i].id == sltList[index].childList[indexs].id){
	 				choiceList.splice(i, 1)
	 				break
	 			}
	 		}
 		}else{
 			if(choiceList.length>=3){
 				return this.refs.toast.show('最多可选择3个');
 			}
 			choiceList.push({
 				value:sltList[index].childList[indexs].value,
 				id:sltList[index].childList[indexs].id,
 				supId:sltList[index].childList[indexs].superId
 			})
 		}
		sltList[index].childList[indexs].checked = !sltList[index].childList[indexs].checked;
 		this.setState({
 			sltList,
 			choiceList
 		})
 	}
 	choiceSubmit(){
 		let formInfo = this.state.formInfo
 		if(this.state.showPage=='jobTitle'){
	 		formInfo.jobTitle = _.map(this.state.choiceList,'id').join('，');
			formInfo.job_super = _.map(this.state.choiceList,'value').join('');
			formInfo.jobTitleSuperId = _.map(this.state.choiceList,'supId').join(',');
			this.setState({
	 			jobObj:this.state.choiceList
	 		})
 		}else if(this.state.showPage=='industry'){
 			formInfo.industryName = _.map(this.state.choiceList,'value').join('，');
 			formInfo.expectIndustry = _.map(this.state.choiceList,'id').join(',');
 			formInfo.industrySuperId = _.map(this.state.choiceList,'supId').join(',');
 			this.setState({
	 			industryObj:this.state.choiceList
	 		})
 		}
 		this.setState({
 			formInfo,
 			showPage:'page'
 		})
 	}
 	basicSubmit(){
 		let that = this;
 		if(!this._checkForm(this.state.formInfo)) return
 		const config = {
 			jobTitle:this.state.formInfo.jobTitle,
 			expectProvince:info.getCityList()[this.state.formInfo.expectCitySuperId].id,
 			expectCity:info.getCityList()[this.state.formInfo.expectCitySuperId].childList[this.state.formInfo.expectCity].id,
 			expectIndustry:this.state.formInfo.expectIndustry,
 			expectIndustry:this.state.formInfo.expectIndustry,
 			expectWorkType:info.getWorkType()[this.state.formInfo.expectWorkType].id,
 			expectSalary:info.getSalary()[parseInt(this.state.formInfo.expectSalary)+1].id,
  		paytyper:this.state.paytyper,
  		isStep:this.state.isStep
 		}
 		ajaxResume.addJobIntention(config, res => {
			if(res.code == 200) {
				that.props.navigation.pop()
			}else{
				this.refs.toast.show(res.message);
			}
		})
 	}
 	_checkForm(data){
 		if (!data.jobTitle) {
      tool.showToastText('请选择职位');
      return false
    } else if (data.expectCity === '') {
      tool.showToastText('请选择期望城市');
      return false
    } else if (!data.expectIndustry) {
      tool.showToastText('请选择行业');
      return false
    } else if (data.expectWorkType === '') {
      tool.showToastText('请选择工作性质');
      return false
    } else if (!data.expectSalary === '') {
      tool.showToastText('请选择期望月薪');
      return false
    }
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
    pageChange:{
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
		},
    mark:{
    	position:'absolute',
    	left:0,
    	top:0,
    	width:commonStyle.width100,
    	height:commonStyle.height100,
    	backgroundColor:'rgba(0, 0, 0, 0.5)',
    },
    show:{
	    display: 'flex'
    },
    hide:{
	    display: 'none'
    },
    changeTop:{
    	paddingTop:10,
    	paddingLeft: 20,
    	paddingRight: 20,
	    display: 'flex',
	    flexDirection:'row',
	    alignItems: 'center',
	    justifyContent: 'space-between',
	    backgroundColor: '#eee',
    },
    choiceBtn:{},
    choiceWrap:{
    	backgroundColor: '#eee',
   		position: 'relative',
    },
    choiceCon:{
    	display: 'flex',
	    flexDirection: 'row',
	    justifyContent: 'flex-start',
	    alignItems: 'center',
	    flexWrap:'nowrap',
	    paddingTop:10,
	    paddingRight: 10,
	    paddingBottom:10,
    	paddingLeft: 10,
    },
    choiceItem:{
    	paddingTop:0,
	    paddingRight: 10,
	    paddingBottom:0,
    	paddingLeft: 10,
      backgroundColor: '#fff',
      marginTop:5,
	    marginRight: 5,
	    marginBottom:5,
    	marginLeft: 5,
      borderRadius: 2,
      maxWidth: (commonStyle.width100-60)/3,
      display: 'flex',
	    flexDirection: 'row',
      alignItems: 'center',
	    justifyContent: 'flex-start',
    },
    choiceClose:{
    	marginRight: 3,
    },
    listWrap:{
    	backgroundColor: '#FFF',
    },
    listTitle:{
    	paddingTop:10,
	    paddingRight: 15,
	    paddingBottom:10,
    	paddingLeft: 15,
    	position: 'relative',
    	borderTopWidth:1,
    	borderTopColor:'#d9d9d9',
    },
    listItemBd:{
      overflow: 'hidden',
      backgroundColor: '#F8F8FA',
      paddingLeft: 15,
      paddingRight: 15,
    },
    listItemBox:{
    	opacity: 1,
      position: 'relative'
    },
    listText:{
    	paddingTop:7,
	    paddingBottom:7,
	    borderTopWidth:1,
    	borderTopColor:'#d9d9d9',
    	display: 'flex',
    	flexDirection: 'row',
    	justifyContent: 'flex-start',
    	alignItems: 'center',
    },
    listTextSty:{
    	marginLeft:5
    },
    pickerMore:{
    	height: 9,
      width: 9,
      borderRightWidth:1,
      borderBottomWidth: 1,
      borderColor: '#d9d9d9',
      borderStyle: 'solid',
      transform: [{rotateZ:'45deg'}],
      position: 'absolute',
      top: 15,
      right: 15,
    },
    pickerMoreChange:{
    	transform: [{rotateZ:'225deg'}]
    }
});
