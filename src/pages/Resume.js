import React, { Component } from 'react';
import {
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
	Switch,
	Image,
	DeviceEventEmitter,
	ScrollView
} from 'react-native';

import { commonStyle } from '../styles/commonStyle';
import Toast, { DURATION } from 'react-native-easy-toast';
import NavigationBar from '../components/common/NavigationBar';
import PopupDialog, {DialogTitle} from 'react-native-popup-dialog';
import _Picker from '../components/common/Picker';
import CameraButton from '../components/common/CameraButton'
import ajaxResume from '../js/service/ajaxResume';
import tool from '../js/utils/Tool'
import info from '../js/utils/Info'
let that;

export default class Resume extends Component {
	constructor(props) {
		super(props);
		this.state = {
			detail: {
				perfect: 0,
				resume: {},
				work_experiences: [],
				projects: [],
				educations: [],
				skills: [],
				trainings: [],
				certificates: [],
			},
			paytyper: 0,
			isStep: '',
			markState: false,
			userInfo: {
				avatarUrl: ''
			},
			showMore: false,
		}
		this.showFadeAnimationDialog = this.showFadeAnimationDialog.bind(this);
		that = this;
	}

	componentWillUnmount() {
		this.subscription.remove();
	};
	showFadeAnimationDialog() {
    this.fadeAnimationDialog.show();
  }
	componentDidMount() {  
		this.subscription = DeviceEventEmitter.addListener('changeAvatar', this.getResumeDeatil);
		this.getResumeDeatil()
	};
	render() {
		return(
			<View>
    		<NavigationBar
          title={'身份完整度：'+(this.state.detail.perfect||0)+'%'}
          navigation={this.props.navigation}
        />
    		<ScrollView style={{marginBottom:55}}>
	    		<View style={styles.switchWrap}>
	    			<Text>{this.state.detail.resume.judgePhone?'星球身份证已公开':'星球身份证未公开'}</Text>
	    			{/*<TouchableOpacity style={styles.button} onPress = {this.showMessage.bind(this)}>
		    			<Switch value={this.state.detail.resume.judgePhone} onValueChange={this.showMessage.bind(this)} />
	    			</TouchableOpacity>*/}
	    			<Switch value={this.state.detail.resume.judgePhone} onValueChange={this.showMessage.bind(this)} />
	    		</View>
	    		<View><Text style={[commonStyle.padding(5,0),{color: '#c0c1c1',marginLeft:15}]}>填写虚假身份信息会直接影响提现</Text></View>
	    		<View style={styles.basicWrap}>
	    			<View style={styles.basicTop}>
		    			<CameraButton style={styles.basicHeadWrap}
	              photos={[]} src={this.state.userInfo.avatarUrl}
	              cback={(data)=>this.headSucces(data)}
	              onFileUpload={this.onFileUpload} />
		    			{/*this.state.userInfo.avatarUrl?
			    				<Image style={styles.basicHead} source={{uri : this.state.userInfo.avatarUrl}}/>:null*/}
	    				<View style={styles.basicRight}>
	    					<View style={styles.basicRightTop}>
	    						{this.state.detail.resume.name?<Text>{this.state.detail.resume.name}</Text>:null}
	    						<TouchableOpacity style={styles.icoWrap} onPress = {()=>{this.props.navigation.navigate('ResumeBasic',{
											isStep:this.state.detail.resume.isStep,
											perfect:this.state.detail.perfect
										})}}>
					    			<Image style={[styles.ico,commonStyle.margin(0,3,0,5)]} source={require('../images/resume/ico-up.png')}/>
					    			<Text style={{color:commonStyle.themeColor}}>编辑</Text>
				    			</TouchableOpacity>
			    			</View>
			  				<View style={styles.basicRightContent}>
			  					{this.state.detail.resume.sex?<Text>{this.state.detail.resume.sex} / </Text>:null}
			  					{this.state.detail.resume.age?<Text>{this.state.detail.resume.age}岁 / </Text>:null}
			  					{this.state.detail.resume.livingCityName?<Text>{this.state.detail.resume.citySuperName?this.state.detail.resume.citySuperName+'，':''}{this.state.detail.resume.livingCityName} / </Text>:null}
			  					{this.state.detail.resume.education?<Text>{this.state.detail.resume.education} / </Text>:null}
			  					{this.state.detail.resume.jobYear?<Text>{this.state.detail.resume.jobYear}</Text>:null}
			    			</View>
			    			<View style={styles.basicRightBottom}>
			    				<Text>完善度：{this.state.detail.perfect||0}%</Text>
			    			</View>
	    				</View>
	    			</View>
	  				<View style={styles.basicContent}>
	  					{this.state.detail.resume.email?<View style={[styles.basicContact,styles.icoWrap,{marginRight: 15}]}>
		  					<Image style={[styles.ico,{marginRight: 3}]} source={require('../images/resume/ico-email.png')}/>
		  					<Text>{this.state.detail.resume.email}</Text>
	  					</View>:null}
	  					{this.state.detail.resume.telephone?<View style={[styles.basicContact,styles.icoWrap]}>
		  					<Image style={[styles.ico,{marginRight: 3}]} source={require('../images/resume/ico-telephone.png')}/>
		  					<Text>{this.state.detail.resume.telephone}</Text>
	  					</View>:null}
	    			</View>
	    			<View style={styles.basicBottom}>
	    				<Text>求职状态</Text>
	    				<_Picker ref="jobState" title='' style={styles.itemPicker}
							    cback={(data)=>this.jobStatueChange('jobState',data)}
							    type="jobState" 
					    />
							<View style={styles.inputMore}></View>
	    			</View>
	    		</View>
	    		{this.state.detail.resume.job_super?<View style={styles.detailItem}>
	    			<View style={styles.detailItemTitle}>
	    				<View style={styles.icoWrap}>
	    					<Image style={[styles.ico,{marginRight: 3}]} source={require('../images/resume/ico-expect.png')}/>
	    					<Text>求职意向</Text>
	    				</View>
	  					<TouchableOpacity onPress = {()=>{this.props.navigation.navigate('ResumeExpect',{
											isStep:this.state.detail.resume.isStep,
											perfect:this.state.detail.perfect
										})}}>
			    			<Text style={{color:commonStyle.themeColor}}>编辑</Text>
		    			</TouchableOpacity>
	    			</View>
	    			<View style={[{borderTopWidth:1,borderTopColor:'#e8e9eb'},commonStyle.padding(15,0)]}>
	    				{this.state.detail.resume.job_super?<View style={[styles.alignItemsFs,{paddingBottom:7}]}>
	    					<Text>职位：</Text>
	    					<Text>{this.state.detail.resume.job_super}</Text>
	    				</View>:null}
	    				{this.state.detail.resume.industryName?<View style={[styles.alignItemsFs,{paddingBottom:7}]}>
	    					<Text>行业：</Text>
	    					<Text>{this.state.detail.resume.industryName}</Text>
	    				</View>:null}
	    				{this.state.detail.resume.expectCityName||this.state.detail.resume.expectWorkType||this.state.detail.resume.expectSalary?<View style={styles.alignItems}>
	    					{this.state.detail.resume.expectCityName?<Text style={{color:'#666'}}>{this.state.detail.resume.expectCityName} / </Text>:null}
	    					{this.state.detail.resume.expectWorkType?<Text style={{color:'#666'}}>{this.state.detail.resume.expectWorkType} / </Text>:null}
	    					{this.state.detail.resume.expectSalary?<Text style={{color:'#666'}}>{this.state.detail.resume.expectSalary}</Text>:null}
	    				</View>:null}
	    			</View>
	    		</View>:null}
	    		{this.state.detail.resume.selfEvaluate?<View style={styles.detailItem}>
	    			<View style={styles.detailItemTitle}>
	    				<View style={styles.icoWrap}>
	    					<Image style={[styles.ico,{marginRight: 3}]} source={require('../images/resume/ico-self.png')}/>
	    					<Text>自我评价</Text>
	    				</View>
	  					<TouchableOpacity onPress = {()=>{this.props.navigation.navigate('ResumeEvaluation',{
											isStep:this.state.detail.resume.isStep,
											perfect:this.state.detail.perfect
										})}}>
			    			<Text style={{color:commonStyle.themeColor}}>编辑</Text>
		    			</TouchableOpacity>
	    			</View>
	    			<View style={[{borderTopWidth:1,borderTopColor:'#e8e9eb'},commonStyle.padding(15,0)]}>
    					<Text>{this.state.detail.resume.selfEvaluate}</Text>
	    			</View>
	    		</View>:null}
	    		{this.state.detail.educations.length?<View style={styles.detailItem}>
	    			<View style={styles.detailItemTitle}>
	    				<View style={styles.icoWrap}>
	    					<Image style={[styles.ico,{marginRight: 3}]} source={require('../images/resume/ico-edu.png')}/>
	    					<Text>教育经历</Text>
	    				</View>
	    			</View>
	    			<View style={styles.timelineWrap}>
    					{
    						this.state.detail.educations.map((item,index) => {
									return 	<View style={styles.timeline} key={item.id}>
														<View style={styles.timelineIcoWrap}>
															<Image style={styles.timelineIco} source={require('../images/resume/timeline-ico.png')}/>
														</View>
														<View style={styles.timelineCon}>
															<View style={[styles.timelineConItemTitle,{paddingBottom:5}]}>
																<Text>{item.startTime}/{item.endTime==0?'至今':item.endTime}</Text>
																<TouchableOpacity onPress = {()=>{this.props.navigation.navigate('ResumeEducation',{
																		itemId:item.id,
																		isStep:this.state.detail.resume.isStep,
																		listlength:this.state.detail.educations.length,
																		perfect:this.state.detail.perfect,
																		jobYear:this.state.detail.resume.jobYear,
																	})}}>
												    			<Text style={{color:commonStyle.themeColor}}>编辑</Text>
											    			</TouchableOpacity>
															</View>
															{item.schoolName?<Text style={{paddingBottom:5}}>学校名称：{item.schoolName}</Text>:null}
															{item.specialty||item.specialty?<View style={styles.alignItems}>
																{item.education?<Text style={{color:'#666'}}>{item.education} / </Text>:null}
																{item.specialty?<Text style={{color:'#666'}}>{item.specialty}</Text>:null}
															</View>:null}
														</View>
													</View>
								})
    					}
	    			</View>
	    			<TouchableOpacity style={styles.addMore} onPress = {()=>{this.props.navigation.navigate('ResumeEducation',{
									isStep:this.state.detail.resume.isStep,
									perfect:this.state.detail.perfect
								})}}>
		    			<Image style={styles.ico} source={require('../images/resume/ico-add.png')}/>
		    			<Text style={styles.addMoreTitle}>添加教育经历</Text>
	    			</TouchableOpacity>
	    		</View>:null}
	    		{this.state.detail.work_experiences.length?<View style={styles.detailItem}>
	    			<View style={styles.detailItemTitle}>
	    				<View style={styles.icoWrap}>
	    					<Image style={[styles.ico,{marginRight: 3}]} source={require('../images/resume/ico-job.png')}/>
	    					<Text>工作经历</Text>
	    				</View>
	    			</View>
	    			<View style={styles.timelineWrap}>
    					{
    						this.state.detail.work_experiences.map((item,index) => {
									return 	<View style={styles.timeline} key={item.id}>
														<View style={styles.timelineIcoWrap}>
															<Image style={styles.timelineIco} source={require('../images/resume/timeline-ico.png')}/>
														</View>
														<View style={styles.timelineCon}>
															<View style={[styles.timelineConItemTitle,{paddingBottom:5}]}>
																<Text>{item.startTime}/{item.endTime==0?'至今':item.endTime}</Text>
																<TouchableOpacity onPress = {()=>{this.props.navigation.navigate('ResumeWork',{
																		itemId:item.id,
																		isStep:this.state.detail.resume.isStep,
																		listlength:this.state.detail.work_experiences.length,
																		perfect:this.state.detail.perfect,
																		jobYear:this.state.detail.resume.jobYear,
																	})}}>
												    			<Text style={{color:commonStyle.themeColor}}>编辑</Text>
											    			</TouchableOpacity>
															</View>
															{item.compName||item.jobTitle||item.salary!=undefined?<View style={[styles.alignItems,{paddingBottom:5}]}>
																{item.compName?<Text>{item.compName} / </Text>:null}
																{item.jobTitle?<Text>{item.jobTitle} / </Text>:null}
																{item.salary!=undefined?<Text style={{color:'#666'}}>{(item.salary=='不限')?'保密':item.salary}</Text>:null}
															</View>:null}
															{item.workDesc?<Text style={{color:'#666'}}>工作描述：{item.workDesc}</Text>:null}
														</View>
													</View>
								})
    					}
	    			</View>
	    			<TouchableOpacity style={styles.addMore} onPress = {()=>{this.props.navigation.navigate('ResumeWork',{
											isStep:this.state.detail.resume.isStep,
											perfect:this.state.detail.perfect
										})}}>
		    			<Image style={styles.ico} source={require('../images/resume/ico-add.png')}/>
		    			<Text style={styles.addMoreTitle}>添加工作经历</Text>
	    			</TouchableOpacity>
	    		</View>:null}
	    		{this.state.detail.projects.length?<View style={styles.detailItem}>
	    			<View style={styles.detailItemTitle}>
	    				<View style={styles.icoWrap}>
	    					<Image style={[styles.ico,{marginRight: 3}]} source={require('../images/resume/ico-obj.png')}/>
	    					<Text>项目经历</Text>
	    				</View>
	    			</View>
	    			<View style={styles.timelineWrap}>
    					{
    						this.state.detail.projects.map((item,index) => {
									return 	<View style={styles.timeline} key={item.id}>
														<View style={styles.timelineIcoWrap}>
															<Image style={styles.timelineIco} source={require('../images/resume/timeline-ico.png')}/>
														</View>
														<View style={styles.timelineCon}>
															<View style={[styles.timelineConItemTitle,{paddingBottom:5}]}>
																<Text>{item.startTime}/{item.endTime==0?'至今':item.endTime}</Text>
																<TouchableOpacity onPress = {()=>{this.props.navigation.navigate('ResumeProject',{
																		itemId:item.id,
																		isStep:this.state.detail.resume.isStep,
																		listlength:this.state.detail.projects.length,
																		perfect:this.state.detail.perfect,
																		jobYear:this.state.detail.resume.jobYear,
																	})}}>
												    			<Text style={{color:commonStyle.themeColor}}>编辑</Text>
											    			</TouchableOpacity>
															</View>
															{item.projectName?<Text style={{paddingBottom:5}}>项目名称：{item.projectName}</Text>:null}
															{item.projectDesc?<Text style={{color:'#666',paddingBottom:5}}>项目描述：{item.projectDesc}</Text>:null}
															{item.responsibilityDesc?<Text style={{color:'#666',paddingBottom:5}}>责任描述：{item.responsibilityDesc}</Text>:null}
															{item.projectUrl?<Text style={{color:'#666'}}>项目连接：{item.projectUrl}</Text>:null}
														</View>
													</View>
								})
    					}
	    			</View>
	    			<TouchableOpacity style={styles.addMore} onPress = {()=>{this.props.navigation.navigate('ResumeProject',{
											isStep:this.state.detail.resume.isStep,
											perfect:this.state.detail.perfect
										})}}>
		    			<Image style={styles.ico} source={require('../images/resume/ico-add.png')}/>
		    			<Text style={styles.addMoreTitle}>添加项目经历</Text>
	    			</TouchableOpacity>
	    		</View>:null}
	    		{this.state.detail.skills.length?<View style={styles.detailItem}>
	    			<View style={styles.detailItemTitle}>
	    				<View style={styles.icoWrap}>
	    					<Image style={[styles.ico,{marginRight: 3}]} source={require('../images/resume/ico-skill.png')}/>
	    					<Text>掌握技能</Text>
	    				</View>
	    			</View>
	    			<View style={styles.timelineWrap}>
    					{
    						this.state.detail.skills.map((item,index) => {
									return 	<View style={styles.timeline} key={item.id}>
														<View style={styles.timelineIcoWrap}>
															<Image style={styles.timelineIco} source={require('../images/resume/timeline-ico.png')}/>
														</View>
														<View style={styles.timelineCon}>
															<View style={[styles.timelineConItemTitle,{paddingBottom:5}]}>
																<View style={styles.alignItems}>
																	{item.skillName?<Text style={{color:'#666'}}>{item.skillName} / </Text>:null}
																	{item.masterDegree?<Text style={{color:'#666'}}>{item.masterDegree}</Text>:null}
																</View>
																<TouchableOpacity onPress = {()=>{this.props.navigation.navigate('ResumeSkill',{
																		itemId:item.id,
																		isStep:this.state.detail.resume.isStep,
																		listlength:this.state.detail.skills.length,
																		perfect:this.state.detail.perfect,
																		jobYear:this.state.detail.resume.jobYear,
																	})}}>
												    			<Text style={{color:commonStyle.themeColor}}>编辑</Text>
											    			</TouchableOpacity>
															</View>
														</View>
													</View>
								})
    					}
	    			</View>
	    			<TouchableOpacity style={styles.addMore} onPress = {()=>{this.props.navigation.navigate('ResumeSkill',{
											isStep:this.state.detail.resume.isStep,
											perfect:this.state.detail.perfect
										})}}>
		    			<Image style={styles.ico} source={require('../images/resume/ico-add.png')}/>
		    			<Text style={styles.addMoreTitle}>添加掌握技能</Text>
	    			</TouchableOpacity>
	    		</View>:null}
	    		{this.state.detail.trainings.length?<View style={styles.detailItem}>
	    			<View style={styles.detailItemTitle}>
	    				<View style={styles.icoWrap}>
	    					<Image style={[styles.ico,{marginRight: 3}]} source={require('../images/resume/ico-edu.png')}/>
	    					<Text>培训经历</Text>
	    				</View>
	    			</View>
	    			<View style={styles.timelineWrap}>
    					{
    						this.state.detail.trainings.map((item,index) => {
									return 	<View style={styles.timeline} key={item.id}>
														<View style={styles.timelineIcoWrap}>
															<Image style={styles.timelineIco} source={require('../images/resume/timeline-ico.png')}/>
														</View>
														<View style={styles.timelineCon}>
															<View style={[styles.timelineConItemTitle,{paddingBottom:5}]}>
																<Text>{item.startTime}/{item.endTime==0?'至今':item.endTime}</Text>
																<TouchableOpacity onPress = {()=>{this.props.navigation.navigate('ResumeTrain',{
																		itemId:item.id,
																		isStep:this.state.detail.resume.isStep,
																		listlength:this.state.detail.trainings.length,
																		perfect:this.state.detail.perfect,
																		jobYear:this.state.detail.resume.jobYear,
																	})}}>
												    			<Text style={{color:commonStyle.themeColor}}>编辑</Text>
											    			</TouchableOpacity>
															</View>
															{item.trainName?<Text style={{paddingBottom:5}}>培训项目：{item.trainName}</Text>:null}
															{item.certificateName?<Text style={{color:'#666',paddingBottom:5}}>培训机构：{item.certificateName}</Text>:null}
															{item.address?<Text style={{color:'#666'}}>培训地点：{item.address}</Text>:null}
														</View>
													</View>
								})
    					}
	    			</View>
	    			<TouchableOpacity style={styles.addMore} onPress = {()=>{this.props.navigation.navigate('ResumeTrain',{
											isStep:this.state.detail.resume.isStep,
											perfect:this.state.detail.perfect
										})}}>
		    			<Image style={styles.ico} source={require('../images/resume/ico-add.png')}/>
		    			<Text style={styles.addMoreTitle}>添加培训经历</Text>
	    			</TouchableOpacity>
	    		</View>:null}
	    		{this.state.detail.certificates.length?<View style={styles.detailItem}>
	    			<View style={styles.detailItemTitle}>
	    				<View style={styles.icoWrap}>
	    					<Image style={[styles.ico,{marginRight: 3}]} source={require('../images/resume/ico-edu.png')}/>
	    					<Text>所获证书</Text>
	    				</View>
	    			</View>
	    			<View style={styles.timelineWrap}>
    					{
    						this.state.detail.certificates.map((item,index) => {
									return 	<View style={styles.timeline} key={item.id}>
														<View style={styles.timelineIcoWrap}>
															<Image style={styles.timelineIco} source={require('../images/resume/timeline-ico.png')}/>
														</View>
														<View style={styles.timelineCon}>
															<View style={[styles.timelineConItemTitle,{paddingBottom:5}]}>
																<Text>{item.getTime}</Text>
																<TouchableOpacity onPress = {()=>{this.props.navigation.navigate('ResumeCertificate',{
																		itemId:item.id,
																		isStep:this.state.detail.resume.isStep,
																		listlength:this.state.detail.certificates.length,
																		perfect:this.state.detail.perfect,
																		jobYear:this.state.detail.resume.jobYear,
																	})}}>
												    			<Text style={{color:commonStyle.themeColor}}>编辑</Text>
											    			</TouchableOpacity>
															</View>
															{item.certName?<Text style={{paddingBottom:5}}>证书：{item.certName}</Text>:null}
														</View>
													</View>
								})
    					}
	    			</View>
	    			<TouchableOpacity style={styles.addMore} onPress = {()=>{this.props.navigation.navigate('ResumeCertificate',{
								isStep:this.state.detail.resume.isStep,
								perfect:this.state.detail.perfect
							})}}>
		    			<Image style={styles.ico} source={require('../images/resume/ico-add.png')}/>
		    			<Text style={styles.addMoreTitle}>添加所获证书</Text>
	    			</TouchableOpacity>
	    		</View>:null}
    			{!this.state.detail.resume.job_super?<TouchableOpacity style={styles.detailAddMore} onPress = {()=>{this.props.navigation.navigate('ResumeExpect',{
							isStep:this.state.detail.resume.isStep,
							perfect:this.state.detail.perfect
						})}}>
	    			<Image style={styles.ico} source={require('../images/resume/ico-add.png')}/>
	    			<Text style={styles.addMoreTitle}>编辑求职意向</Text>
    			</TouchableOpacity>:null}
    			{this.state.showMore&&!this.state.detail.resume.selfEvaluate?<TouchableOpacity style={styles.detailAddMore} onPress = {()=>{this.props.navigation.navigate('ResumeEvaluation',{
							isStep:this.state.detail.resume.isStep,
							perfect:this.state.detail.perfect
						})}}>
	    			<Image style={styles.ico} source={require('../images/resume/ico-add.png')}/>
	    			<Text style={styles.addMoreTitle}>编辑自我评价</Text>
    			</TouchableOpacity>:null}
    			{!this.state.detail.educations.length?<TouchableOpacity style={styles.detailAddMore} onPress = {()=>{this.props.navigation.navigate('ResumeEducation',{
							isStep:this.state.detail.resume.isStep,
							perfect:this.state.detail.perfect
						})}}>
	    			<Image style={styles.ico} source={require('../images/resume/ico-add.png')}/>
	    			<Text style={styles.addMoreTitle}>添加教育经历</Text>
    			</TouchableOpacity>:null}
    			{!this.state.detail.work_experiences.length?<TouchableOpacity style={styles.detailAddMore} onPress = {()=>{this.props.navigation.navigate('ResumeWork',{
							isStep:this.state.detail.resume.isStep,
							perfect:this.state.detail.perfect
						})}}>
	    			<Image style={styles.ico} source={require('../images/resume/ico-add.png')}/>
	    			<Text style={styles.addMoreTitle}>添加工作经历</Text>
    			</TouchableOpacity>:null}
    			{this.state.showMore&&!this.state.detail.projects.length?<TouchableOpacity style={styles.detailAddMore} onPress = {()=>{this.props.navigation.navigate('ResumeProject',{
							isStep:this.state.detail.resume.isStep,
							perfect:this.state.detail.perfect
						})}}>
	    			<Image style={styles.ico} source={require('../images/resume/ico-add.png')}/>
	    			<Text style={styles.addMoreTitle}>添加项目经历</Text>
    			</TouchableOpacity>:null}
    			{this.state.showMore&&!this.state.detail.skills.length?<TouchableOpacity style={styles.detailAddMore} onPress = {()=>{this.props.navigation.navigate('ResumeSkill',{
							isStep:this.state.detail.resume.isStep,
							perfect:this.state.detail.perfect
						})}}>
	    			<Image style={styles.ico} source={require('../images/resume/ico-add.png')}/>
	    			<Text style={styles.addMoreTitle}>添加掌握技能</Text>
    			</TouchableOpacity>:null}
    			{this.state.showMore&&!this.state.detail.trainings.length?<TouchableOpacity style={styles.detailAddMore} onPress = {()=>{this.props.navigation.navigate('ResumeTrain',{
							isStep:this.state.detail.resume.isStep,
							perfect:this.state.detail.perfect
						})}}>
	    			<Image style={styles.ico} source={require('../images/resume/ico-add.png')}/>
	    			<Text style={styles.addMoreTitle}>添加培训经历</Text>
    			</TouchableOpacity>:null}
    			{this.state.showMore&&!this.state.detail.certificates.length?<TouchableOpacity style={styles.detailAddMore} onPress = {()=>{this.props.navigation.navigate('ResumeCertificate',{
							isStep:this.state.detail.resume.isStep,
							perfect:this.state.detail.perfect
						})}}>
	    			<Image style={styles.ico} source={require('../images/resume/ico-add.png')}/>
	    			<Text style={styles.addMoreTitle}>添加所获证书</Text>
    			</TouchableOpacity>:null}
    			{!this.state.detail.projects.length||!this.state.detail.skills.length||!this.state.detail.trainings.length||!this.state.detail.certificates.length||!this.state.detail.resume.selfEvaluate?<TouchableOpacity style={styles.showMore} onPress = {()=>{this.setState({showMore:!this.state.showMore})}}>
	    			{
	    				this.state.showMore?
	    				<Image style={styles.ico} source={require('../images/resume/ico-more.png')}/>:
	    				<Image style={styles.ico} source={require('../images/resume/ico-less.png')}/>
	    			}
	    			<Text style={{color:'#fff',marginLeft:5}}>{this.state.showMore?'收起更多模块':'展开更多模块'}</Text>
    			</TouchableOpacity>:null}
	    	</ScrollView>
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
	    	<PopupDialog
          ref={(fadeAnimationDialog) => {
            this.fadeAnimationDialog = fadeAnimationDialog;
          }}
          dialogTitle={<DialogTitle title={
          	this.state.detail.resume.judgePhone?
          	'关闭公开星球身份证，少了一种收入来源哦，你确定吗？':
          	'公开星球身份证，星球企业可以主动搜索到你，信息查看产生的费用会自动转入你的资产!'
          } />}
          width={280}
          height={this.state.detail.resume.judgePhone?35+90:35+110}
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
							onPress = {this.setStateJudgePhone.bind(this)}>
		          <Text style={{color: commonStyle.themeColor}}>确定</Text>
		        </TouchableOpacity>
          </View> 
          
        </PopupDialog>
      </View>
		);
	}
	getResumeDeatil() {
		const config = {
			Type: 1
		}
		ajaxResume.getResumeDeatil(config, res => {
			if(res.code == 200) {
				if(res.resume) {
					res = that._fomartResume(res); //格式化简历信息
				}
				that.setState({
					perfect: res.perfect,
					standard: res.standard ? res.standard : 70,
					detail: res,
					isStep: res.resume.isStep,
					jobYear: res.resume.jobYear
				});
				that.refs.jobState.serTitle(tool._match('jobState', res.resume.jobState));
			} else {
				that.refs.toast.show(res.message)
			}
		})
	}
	_fomartResume(data) {
		if(data.resume.sex) {
			data.resume.sex = tool._match('sex', data.resume.sex);
		}
		if(data.resume.education) {
			data.resume.education = tool._match('edu', data.resume.education);
		}
		data.resume.jobYear = !data.resume.jobYear ? '应届毕业生' : data.resume.jobYear + '年工作经验'
		if(data.resume.maritalStatus) {
			data.resume.maritalStatus = tool._match('marital', data.resume.maritalStatus);
		}
		if(data.resume.industryName) {
			data.resume.industryName = data.resume.industryName.split(',').join(' ，');
		}
		if(data.resume.job_super) {
			data.resume.job_super = data.resume.job_super.split(',').join(' ，');
		}
		if(data.resume.expectWorkType) {
			data.resume.expectWorkType = tool._match('workType', data.resume.expectWorkType);
		}
		if(data.resume.expectSalary) {
			data.resume.expectSalary = tool._match('salary', data.resume.expectSalary);
		}
		data.resume.judgePhone = !data.resume.judgePhone
		if(data.work_experiences && data.work_experiences.length) {
			for(let i in data.work_experiences) {
				data.work_experiences[i].salary = tool._match('salary', data.work_experiences[i].salary);
			}
		} else {
			data.work_experiences = []
		}
		if(data.educations && data.educations.length) {
			for(let i in data.educations) {
				data.educations[i].education = tool._match('edu', data.educations[i].education);
			}
		} else {
			data.educations = []
		}
		if(!data.projects) {
			data.projects = []
		}
		if(data.skills && data.skills.length) {
			for(let i in data.skills) {
				data.skills[i].masterDegree = tool._match('master', data.skills[i].masterDegree);
			}
		} else {
			data.skills = []
		}
		if(!data.trainings) {
			data.trainings = []
		}
		if(!data.certificates) {
			data.certificates = []
		}
		if(!data.resume.headImg) {
			const config = {
				avatarUrl: ''
			}
			config.avatarUrl = 'https://www.ivvajob.com/img/wxMin/user/user_default.png'
			this.setState({
				hasUserInfo: true,
				userInfo: config
			})
		} else {
			const config = {
				avatarUrl: ''
			}
			if(data.resume.headImg.indexOf('http') > -1) {
				config.avatarUrl = data.resume.headImg
			} else {
				config.avatarUrl = 'https://www.ivvajob.com/resumeControllOperation/getHeadImg?headImg=' + data.resume.headImg + '&v=' + (new Date().getTime()) + '&rd_session=594cbb19-cfa4-4965-a594-81767b0ae8c1';
			}
			this.setState({
				hasUserInfo: true,
				userInfo: config
			})
		}
		return data
	}
	showMessage(){
		if (this.state.detail.perfect < this.state.standard) {
			this.refs.toast.show('完整度达到'+this.data.standard+'%才能公开')
      let key = this.state.detail.resume.judgePhone
      this.setData({
        key: 0
      })
      return
    }else{
    	this.showFadeAnimationDialog();
    }
		
	}
	setStateJudgePhone() {
		that.fadeAnimationDialog.dismiss();
		const config = {
			type: 2,
			judgePhone: that.state.detail.resume.judgePhone?1:0
		};
		ajaxResume.updateSelfEvaluate(config, res => {
			if(res.code == 200) {
				that.getResumeDeatil();
			}
//			that.refs.toast.show(res.message)
		})
	}

	//求职状态选中后执行
	jobStatueChange(name, data) {
		const config = {
			type: 3,
			jobState: info.getJobStatus()[data].id || 0,
			isStep: this.state.isStep
		}
		ajaxResume.updateSelfEvaluate(config, res => {
			if(res.code == 200) {
				this.getResumeDeatil();
			}
			this.refs.toast.show(res.message)
		})
	}
	
	/*头像上传后回调*/
	headSucces(res){
		if(res.code == 200) {
			this.getResumeDeatil();
		}
		this.refs.toast.show(res.message)
	}

	setForm(name, data) {
		let key = this.state.formInfo[name] = data
		this.setState({
			key
		})
	}
}

const styles = StyleSheet.create({
	alignItems: {
		alignItems: 'center',
		flexDirection: 'row',
	},
	alignItemsFs: {
		alignItems: 'flex-start',
		flexDirection: 'row',
	},
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#F5FCFF',
		color: '#333'
	},
	switchWrap: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		backgroundColor: '#fff',
		borderTopWidth: 1,
		borderTopColor: '#e8e9eb',
		paddingLeft: 15,
		paddingRight: 15,
		height: 50,
	},
	button: {
		width: 120,
		height: 45,
		borderRadius: 5,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#4398ff',
	},
	icoWrap: {
		alignItems: 'center',
		flexDirection: 'row',
	},
	ico: {
		width: 14,
		height: 14,
	},
	basicWrap: {
		paddingLeft: 15,
		paddingRight: 15,
		backgroundColor: '#fff',
	},
	basicTop: {
		alignItems: 'center',
		flexDirection: 'row',
		paddingTop: 15,
		paddingBottom: 15
	},
	basicHeadWrap:{
		width: 64,
		height: 64,
	},
	basicHead: {
		width: 64,
		height: 64,
		borderRadius: 100,
	},
	basicRight: {
		marginLeft: 5
	},
	basicRightTop: {
		alignItems: 'center',
		flexDirection: 'row',
	},
	basicRightContent: {
		width: commonStyle.width100 - 30 - 64 - 5,
		alignItems: 'center',
		flexDirection: 'row',
		flexWrap: 'wrap',
		paddingTop: 7,
		paddingBottom: 7
	},
	basicRightBottom: {
		alignItems: 'center',
		flexDirection: 'row',
	},
	basicContent: {
		borderTopWidth: 1,
		borderTopColor: '#e8e9eb',
		alignItems: 'center',
		flexDirection: 'row',
		paddingTop: 20,
		paddingBottom: 20
	},
	basicBottom: {
		borderTopWidth: 1,
		position: 'relative',
		alignItems: 'center',
		flexDirection: 'row',
		borderTopColor: '#e8e9eb',
		paddingTop: 10,
		paddingRight: 15,
		paddingBottom: 10,
		paddingLeft: 15,
	},
	itemPicker: {
		flex: 1,
		backgroundColor: '#4398ff',
	},
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
		top: 24,
		right: 2,
	},
	detailItem: {
		marginTop: 15,
		paddingLeft: 20,
		paddingRight: 20,
		backgroundColor: '#fff',
	},
	detailItemTitle: {
		paddingTop: 15,
		paddingBottom: 15,
		alignItems: 'center',
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	timelineWrap: {
		paddingTop: 15,
		borderTopWidth: 1,
		borderColor: '#d9d9d9',
	},
	timeline: {
		paddingLeft: 7,
		position: 'relative',
	},
	timelineIcoWrap: {
		width: 13,
		height: 13,
		position: 'absolute',
		top: 0,
		left: .5,
		backgroundColor: '#fff',
		zIndex: 1
	},
	timelineIco: {
		width: 13,
		height: 13,
	},
	timelineCon: {
		paddingLeft: 15,
		paddingBottom: 20,
		borderLeftWidth: 1,
		borderColor: '#D9D9D9'
	},
	timelineConItemTitle: {
		marginTop: -3,
		alignItems: 'center',
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	addMore: {
		borderTopWidth: 1,
		borderColor: '#d9d9d9',
		paddingTop: 15,
		paddingBottom: 15,
		alignItems: 'center',
		flexDirection: 'row',
		justifyContent: 'center',
	},
	addMoreTitle: {
		width: 90,
	},
	detailAddMore: {
		marginTop: 15,
		paddingTop: 15,
		paddingBottom: 15,
		alignItems: 'center',
		flexDirection: 'row',
		justifyContent: 'center',
		backgroundColor: '#fff',
	},
	showMore: {
		marginTop: 15,
		paddingTop: 15,
		paddingBottom: 15,
		alignItems: 'center',
		flexDirection: 'row',
		justifyContent: 'center',
		backgroundColor: commonStyle.themeColor,
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