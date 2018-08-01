import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  ScrollView,
  TouchableHighlight,
  DeviceEventEmitter
} from 'react-native';
import {commonStyle} from '../styles/commonStyle';
import Toast, {DURATION} from 'react-native-easy-toast';
import _ from 'lodash'
import NavigationBar from '../components/common/NavigationBar';
import ajaxResume from '../js/service/ajaxResume';
import tool from '../js/utils/Tool'
import info from '../js/utils/Info'

export default class User extends Component {
	constructor(props) {
    super(props);
  	this.state = {
  		formInfo : {
  			compName:'',
	  		jobTitle:'',
	  		salary:'',
	  		startTime:'',
  			endTime:'',
  			workDesc:''
	   	},
	   	itemId: '',
	   	paytyper:0,
	   	isStep:'',
	   	markState:false,
	   	num:0
  	}
  }
	componentDidMount() {
    this.getResumeDeatil();
  }
  render() {
    return (
    	<View>
	    		<NavigationBar
	          title='自我评价'
	          navigation={this.props.navigation}
	        />
		      <View style={styles.container}>
		      	<View style={styles.formWrap}>
							<View style={[styles.base,styles.baseTop]}>
								<View style={[styles.item,styles.itemTop,styles.itemTextareaWrap]}>
									<TextInput style={styles.itemTextarea} maxlength={1500}
										onChangeText={(data) => this.setForm('selfEvaluate',data)}
										multiline={true}
										value={this.state.formInfo.selfEvaluate} placeholder="简单介绍一下自己，字数控制在1500字以内" 
										underlineColorAndroid='transparent'/>
									<Text style={styles.itemTextareaNum}>{this.state.num}/1500</Text>
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
 	getResumeDeatil(){
 		ajaxResume.getResumeDeatil({},res=>{
 			if(res.code == 200){
 				let resume = res.resume;
 				let formInfo = this.state.formInfo
 				let num = this.state.num
 				
 				formInfo.selfEvaluate = resume.selfEvaluate;
 				num = resume.selfEvaluate?resume.selfEvaluate.length:0;
 				this.setState({
		 			formInfo,
		 			paytyper:res.paytyper,
		 			isStep:resume.isStep,
		 			num
		 		})
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
 			key,
 			num:data.length
 		})
 	}
 	
 	basicSubmit(){
 		let that = this;
 		if(!this._checkForm(this.state.formInfo)) return
 		const config = {
 			selfEvaluate:this.state.formInfo.selfEvaluate,
 			type:1,
  		isStep:this.state.isStep
 		}
 		ajaxResume.updateSelfEvaluate(config, res => {
			if(res.code == 200) {
				DeviceEventEmitter.emit('changeAvatar',this.props.navigation.pop());
				that.props.navigation.pop()
			}else{
				this.refs.toast.show(res.message);
			}
		})
 	}
 	_checkForm(data){
 		if(!data.selfEvaluate) {
			this.refs.toast.show('请填写自我评价');
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
    itemTextareaWrap:{
    	justifyContent: 'flex-start',
    	alignItems:'flex-start',
    	flexDirection:'row',
    	flexWrap:'wrap'
    },
    itemTextareaTitleWrap:{
    	width:commonStyle.width100-30,
    },
    itemTextareaTitle:{
    	flexDirection:'row',
    	paddingTop: 10,
    	paddingBottom: 10,
    },
    itemTextarea:{
    	flex:1,
    	textAlign:'left',
    	textAlignVertical: 'top',
    	height:250,
    	paddingTop:15,
	    paddingBottom:20,
    	borderWidth:0,
    	color: '#666',
    },
    itemTextareaNum:{	
    	position: 'absolute',
      bottom: 5,
      right: 10,
      fontSize: 12,
      color: '#999',
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
    },
});
