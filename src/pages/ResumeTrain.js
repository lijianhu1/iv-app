import React, { Component } from 'react';
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
import { commonStyle } from '../styles/commonStyle';
import Toast, { DURATION } from 'react-native-easy-toast';
import PopupDialog, {DialogTitle} from 'react-native-popup-dialog';
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
			formInfo: {
				trainName: '',
				certificateName: '',
				startTime: '',
				endTime: '',
				address: '',
			},
			itemId: '',
			isStep: '',
			markState: false,
			projectDescNum: 0,
			responsibilityDescNum: 0,
		}
		this.showFadeAnimationDialog = this.showFadeAnimationDialog.bind(this);
	}
	componentDidMount() {
		if (this.props.navigation.state.params){
      this.setState({
      	itemId : this.props.navigation.state.params.itemId||'',
      	isStep : this.props.navigation.state.params.isStep||'',
      	listlength:this.props.navigation.state.params.listlength||'',
		   	perfect:this.props.navigation.state.params.perfect||'',
		   	jobYear:this.props.navigation.state.params.jobYear||'',
      },()=>{this.getResumeDeatil()})
    };
	}
	showFadeAnimationDialog() {
    this.fadeAnimationDialog.show();
  }
	render() {
		return(
			<View>
	    		<NavigationBar
	          title='培训经历'
	          navigation={this.props.navigation}
	        />
	    		<ScrollView>
			      <View style={styles.container}>
			      	<View style={styles.formWrap}>
								<View style={[styles.base,styles.baseTop]}>
									<View style={[styles.item,styles.itemTop]}>
										<View style={styles.itemTitle}>
											<Text style={styles.itemTitleText}>开始时间</Text>
										</View>
										<_Picker ref="startTime" title='' style={styles.itemPicker}
												endTime={this.state.formInfo.endTime}
										    cback={(data)=>this.setForm('startTime',data)} 
										    type="startTime"
										/>
										<View style={styles.inputMore}></View>
									</View>
									<View style={styles.item}>
										<View style={styles.itemTitle}>
											<Text style={styles.itemTitleText}>结束时间</Text>
										</View>
										<_Picker ref="endTime" title='' style={styles.itemPicker}
												startTime={this.state.formInfo.startTime}
										    cback={(data)=>this.setForm('endTime',data)} 
										    type="endTime"
										/>
										<View style={styles.inputMore}></View>
									</View>
									<View style={styles.item}>
										<View style={styles.itemTitle}>
											<Text style={styles.itemTitleText}>培训项目</Text>
										</View>
										<TextInput style={styles.itemInput}
											onChangeText={(data) => this.setForm('trainName',data)}
											value={this.state.formInfo.trainName} placeholder="请填写" 
											underlineColorAndroid='transparent'/>
									</View>
									<View style={styles.item}>
										<View style={styles.itemTitle}>
											<Text style={styles.itemTitleText}>培训机构</Text>
										</View>
										<TextInput style={styles.itemInput}
											onChangeText={(data) => this.setForm('certificateName',data)}
											value={this.state.formInfo.certificateName} placeholder="请填写" 
											underlineColorAndroid='transparent'/>
									</View>
									<View style={styles.item}>
										<View style={styles.itemTitle}>
											<Text style={styles.itemTitleText}>培训地点</Text>
										</View>
										<TextInput style={styles.itemInput}
											onChangeText={(data) => this.setForm('address',data)}
											value={this.state.formInfo.address} placeholder="请填写" 
											underlineColorAndroid='transparent'/>
									</View>
								</View>
								<View style={styles.submitWrap}>
									<TouchableOpacity style={styles.submit}
										onPress = {this.basicSubmit.bind(this)}>
					          <Text style={{color: 'white'}}>保 存</Text>
					        </TouchableOpacity>
								</View>
								{this.state.itemId?<TouchableOpacity
									style={{alignItems: 'center',justifyContent: 'center',marginTop:20}}
									onPress = {this.showFadeAnimationDialog}>
				          <Text style={{color: commonStyle.themeColor}}>删除此培训经历</Text>
				        </TouchableOpacity>:null}
			      	</View>
						</View>	
	    		</ScrollView>
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
	    	{this.state.itemId?<PopupDialog
          ref={(fadeAnimationDialog) => {
            this.fadeAnimationDialog = fadeAnimationDialog;
          }}
          dialogTitle={<DialogTitle title='是否确认删除该培训经历' />}
          width={280}
          height={35+50}
        >
          <View style={styles.dialogContentView}>
            <TouchableOpacity
							style={styles.dialogBtn}
							onPress={() => {
                this.fadeAnimationDialog.dismiss();
              }}>
		          <Text>取消</Text>
		        </TouchableOpacity>
			      <TouchableOpacity
							style={[styles.dialogBtn,{borderLeftWidth: 1}]}
							onPress = {this.formDelete.bind(this)}>
		          <Text style={{color: commonStyle.themeColor}}>确定</Text>
		        </TouchableOpacity>
          </View>
          
        </PopupDialog>:null}
	  	</View>
		);
	};
	getResumeDeatil() {
		if(this.state.itemId) {
			const config = {
				id: this.state.itemId,
				type: 4
			}
			ajaxResume.getExperience(config, res => {
				if(res.code == 200) {
					let resume = res.resultMap[0];
					let formInfo = this.state.formInfo

					formInfo.startTime = resume.startTime ? resume.startTime : '';
					formInfo.endTime = resume.endTime ? resume.endTime : '';
					formInfo.trainName = resume.trainName;
					formInfo.certificateName = resume.certificateName;
					formInfo.address = resume.address;

					this.setState({
						formInfo
					})

					this.refs.startTime.serTitle(resume.startTime);
					this.refs.endTime.serTitle(resume.endTime === "0" ? '至今' : resume.endTime);
				} else {
					this.refs.toast.show(res.message);
				}
			})
		}
	}
	showMark() {
		this.setState({
			mark: true
		})
	}
	setForm(name, data) {
		let key = this.state.formInfo[name] = data
		this.setState({
			key
		})
	}

	basicSubmit() {
		let that = this;
		if(!this._checkForm(this.state.formInfo)) return
		const config = {
			startTime: this.state.formInfo.startTime,
			endTime: this.state.formInfo.endTime,
			trainName: this.state.formInfo.trainName,
			certificateName: this.state.formInfo.certificateName,
			address: this.state.formInfo.address,
			isStep: this.state.isStep
		}

		if(this.state.itemId) {
			config.id = this.state.itemId;
		}

		ajaxResume.addTrainings(config, res => {
			if(res.code == 200) {
				DeviceEventEmitter.emit('changeAvatar',this.props.navigation.pop());
				that.props.navigation.pop()
			}else{
				this.refs.toast.show(res.message);
			}
		})
	}
	formDelete(){
		const config = {
			id: this.state.itemId,
			type: 4
		};
		ajaxResume.experienceDelete(config, res => {
			if(res.code == 200) {
				this.fadeAnimationDialog.dismiss();
				DeviceEventEmitter.emit('changeAvatar',this.props.navigation.pop());
			}else{
				this.refs.toast.show(res.message);
			}
		})
  }
	_checkForm(data) {
		if(data.startTime === '') {
			this.refs.toast.show('请选择开始时间');
			return false
		} else if(data.endTime === '') {
			this.refs.toast.show('请选择结束时间');
			return false
		}else if(!data.trainName) {
			this.refs.toast.show('请填写项目名称');
			return false
		}else if(!data.certificateName) {
			this.refs.toast.show('请填写项目名称');
			return false
		}else if(!data.address) {
			this.refs.toast.show('请填写项目名称');
			return false
		}
		return true
	}
}

const styles = StyleSheet.create({
	container: {
		marginBottom: 25,
		paddingTop: 1,
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
	formWrap: {
		display: 'flex',
		flexDirection: 'column',
	},
	base: {
		marginTop: 15,
		paddingLeft: 20,
		paddingRight: 20,
		backgroundColor: '#FFFFFF',
	},
	baseTop: {
		marginTop: 0,
	},
	item: {
		position: 'relative',
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: '#FFFFFF',
		borderTopWidth: 1,
		borderTopColor: '#e8e9eb',
		paddingTop: 0,
		paddingBottom: 0,
	},
	itemTop: {
		borderTopWidth: 0,
	},
	itemTitle: {
		justifyContent: 'space-around',
	},
	itemTitleText: {
		color: '#333'
	},
	itemUrl: {
		justifyContent: 'flex-start',
		alignItems: 'flex-start',
		flexDirection: 'row',
		flexWrap: 'wrap'
	},
	itemUrlTitle: {
		display: 'flex',
		justifyContent: 'flex-start',
		flexDirection: 'row',
		alignItems: 'center',
		width: commonStyle.width100 - 30,
	},
	itemUrlTitleText: {
		flexDirection: 'row',
		paddingTop: 10,
		paddingBottom: 10,
	},
	itemProjectUrl: {
		flex: 1,
		textAlign: 'left',
		height: 50,
		paddingTop: 15,
		paddingRight: 15,
		paddingBottom: 15,
		paddingLeft: 15,
		borderWidth: 0,
		color: '#666',
		backgroundColor: '#f7f8fa',
	},
	itemInput: {
		flex: 1,
		textAlign: 'right',
		height: 40,
		paddingRight: 15,
		borderWidth: 0,
		color: '#666'
	},
	itemTextareaWrap: {
		justifyContent: 'flex-start',
		alignItems: 'flex-start',
		flexDirection: 'row',
		flexWrap: 'wrap'
	},
	itemTextareaTitleWrap: {
		width: commonStyle.width100 - 30,
	},
	itemTextareaTitle: {
		flexDirection: 'row',
		paddingTop: 10,
		paddingBottom: 10,
	},
	itemTextarea: {
		flex: 1,
		textAlign: 'left',
		textAlignVertical: 'top',
		height: 150,
		paddingTop: 15,
		paddingRight: 15,
		paddingBottom: 20,
		paddingLeft: 15,
		borderWidth: 0,
		color: '#666',
		backgroundColor: '#f7f8fa',
	},
	itemTextareaNum: {
		position: 'absolute',
		bottom: 5,
		right: 10,
		fontSize: 12,
		color: '#999',
	},
	itemPicker: {},
	inputMore: {
		height: 9,
		width: 9,
		borderTopWidth: 1,
		borderRightWidth: 1,
		borderColor: '#d9d9d9',
		borderStyle: 'solid',
		transform: [{
			rotateZ: '45deg'
		}],
		position: 'absolute',
		top: 15,
		right: 2,
	},
	itemTouchableHighlight: {
		flex: 1
	},
	submitWrap: {
		marginTop: 15,
		paddingLeft: 20,
		paddingRight: 20,
	},
	submit: {
		paddingTop: 8,
		paddingBottom: 8,
		backgroundColor: '#ff4f64',
		borderRadius: 50,
		alignItems: 'center',
		justifyContent: 'center',
	},
	mark: {
		position: 'absolute',
		left: 0,
		top: 0,
		width: commonStyle.width100,
		height: commonStyle.height100,
		backgroundColor: 'rgba(0, 0, 0, 0.5)',
	},
	dialogContentView: {
    flex: 1,
    flexDirection:'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dialogBtn:{
  	height:35,
  	flex:1,
  	alignItems: 'center',
    justifyContent: 'center',
    borderColor: '#d9d9d9',
  }
});