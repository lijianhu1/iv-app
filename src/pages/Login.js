import React, {Component} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ImageBackground,
  Keyboard
} from 'react-native';
import {commonStyle} from '../styles/commonStyle'
import ajaxUser from '../js/service/ajaxUser'
import Toast, {DURATION} from 'react-native-easy-toast';
import tool from '../js/utils/Tool'
export default class WithdrawList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formData:{
        telephone:'',
        code:'',
        imgCode:''
      },
      getTime:new Date().getTime(),
      type:1,
      val:0,
      imgCodeError:false,
      modal:false,
      getCodeType:false,
      time:60,
      topMargin:100
    };
  }

  componentWillMount () {
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', ()=>{this.setState({topMargin:75})});
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', ()=>{this.setState({topMargin:100})});
  }
  inputChange(type,value){
    let formData = this.state.formData;
    formData[type]=value;
    this.setState({
      formData
    });
  }
  modalCancel(){
    this.setState({
      modal:false
    })
  }
  modalConfirm(){
    this.setState({
      modal:false,
      getCodeType:true
    });
    this.setIntervalTime()
  }
  setIntervalTime(){
    let time = 60;
    let timer = setInterval(()=>{
      time-=1;
      this.setState({
        time,
      });
      if(time<=0){
        clearInterval(timer);
        this.setState({
          getCodeType:false,
        })
      }
    },1000)
  }
  modalRender(){
    return this.state.modal?<View style={styles.modal}>
      <View style={styles.modalbg}></View>
      <View style={styles.modalMain}>
        <Text style={{color:commonStyle.textBlockColor}}>图形验证码</Text>
        <View style={commonStyle.margin(15,0)}>
          <View  style={[commonStyle.border(1,'#dbdbdb'),styles.inputView]}>
            <TextInput
              onChangeText={(searchText) => this.inputChange('imgCode',searchText)}
              value={this.state.formData.imgCode}
              placeholder={'输入红色验证码'}
              placeholderTextColor={'#9a9a9a'}
              keyboardType={'numeric'}
              style={styles.imgCodeInput}
              underlineColorAndroid='transparent'/>
            <TouchableOpacity onPress={()=>{this.setState({getTime:new Date().getTime()})}} activeOpacity={1} style={[commonStyle.border('Left',1,'#dbdbdb'),styles.imgCodeView]}>
              <Image  source={{uri:'https://cv.ivvajob.com/img/getDrawImage?v='+this.state.getTime}} resizeMode={Image.resizeMode.contain} style={styles.imgCode}/>
            </TouchableOpacity>
          </View>
          <View>{this.state.imgCodeError?<Text style={{color:commonStyle.themeColor}}>  错误提示</Text>:null}</View>
        </View>
        <View style={[styles.modalBtn,commonStyle.border('Top',1,'#dedede')]}>
          <TouchableOpacity onPress={this.modalCancel.bind(this)} style={styles.modalBtnTouch} activeOpacity={1}>
            <Text>取消</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.modalConfirm.bind(this)} activeOpacity={1} style={[styles.modalBtnTouch,commonStyle.border('Left',1,'#dedede')]}>
            <Text style={{color:commonStyle.themeColor}}>确认</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>:null
  }

  getCode(){
    let verify = tool.verifyMobile(this.state.formData.telephone);
    if(!verify.flag){
      this.refs.toast.show(verify.message,2000);
      return
    }else {
      this.setState({
        modal:true
      })
    }
  }
  handleSubmit(){

  }
  typeSwitch(){
    this.setState({
      type:!this.state.type,
      formData:{}
    });
  }
  matchForm(type){
    if(type=='telephone'){
      let verify = tool.verifyMobile(this.state.formData.telephone);
      if(!verify.flag){
        this.refs.toast.show(verify.message,2000);
      }
    }
  }
  render() {
    return <View style={{flex:1}}>
      <ImageBackground style={styles.bg} source={require("../images/user/loginbg.jpg")} resizeMode='stretch'>
        <View style={styles.titleView}>
          <Text style={styles.titleText}>{this.state.type?'登录':'注册'}</Text>
        </View>
        <View style={[styles.form,{marginTop:this.state.topMargin}]}>
          <View style={[commonStyle.border('Bottom',1,'#756d92'),styles.telephoneView]}>
            <TextInput
              onChangeText={(searchText) => this.inputChange('telephone',searchText)}
              value={this.state.formData.telephone}
              placeholder={'请输入手机号'}
              keyboardType={'numeric'}
              placeholderTextColor={commonStyle.white}
              underlineColorAndroid='transparent'
              onBlur={this.matchForm.bind(this,'telephone')}
              style={[styles.input]}/>
          </View>
          <View style={[styles.codeView,commonStyle.border('Bottom',1,'#756d92'),{height:40}]}>
            <TextInput
              onChangeText={(searchText) => this.inputChange('code',searchText)}
              value={this.state.formData.code}
              placeholder={'请输入验证码'}
              keyboardType={'numeric'}
              placeholderTextColor={commonStyle.white}
              underlineColorAndroid='transparent'
              style={[styles.inputCode]}/>
            {this.state.getCodeType?<View style={styles.codeBtn}>
              <Text style={{color:"#bcbac6"}}>{this.state.time}秒后重新获取</Text>
            </View>:<TouchableOpacity activeOpacity={1} onPress={this.getCode.bind(this)} style={styles.codeBtn}>
              <Text style={{color:"#bcbac6"}}>获取验证码</Text>
            </TouchableOpacity>}
          </View>
          <TouchableOpacity onPress={this.handleSubmit.bind(this)} activeOpacity={.8} style={styles.submitBtn}>
            <Text style={styles.submitBtnText}>立即{this.state.type?'登录':'注册'}</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={this.typeSwitch.bind(this)} style={styles.typeSwitch}>
          <Text style={styles.submitBtnText}>立即{this.state.type?'注册':'登录'}</Text>
        </TouchableOpacity>
        <View style={styles.otherType}>
          <Text style={styles.otherTypeTitle}>其他登录方式</Text>
          <View style={styles.otherList}>
            <TouchableOpacity style={styles.otherItem} activeOpacity={.7}>
              <Image source={require('../images/makeMoney/wxFollow-ico.png')} resizeMode={Image.resizeMode.contain} style={styles.otherItemImg} />
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
      {this.modalRender()}

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
  }
}

const styles = StyleSheet.create({
  bg:{
    // flex:1
    width:commonStyle.width100,
    height:commonStyle.height100,
  },
  placeholderColor:{
    color:'#C0BDC8'
  },
  titleView:{
    alignItems:'center',
    marginTop:90
  },
  titleText:{
    fontSize:24,
    color:'#fff'
  },
  form:{
    paddingLeft:commonStyle.pageSideWidth,
    paddingRight:commonStyle.pageSideWidth,
  },
  input:{
    color:'#fff',
    padding:0,
    paddingHorizontal: 10
  },
  inputCode:{
    color:'#fff',
    flex:1,
    padding:0,
    paddingHorizontal: 10
  },
  codeView:{
    marginTop:5,
    flexDirection:'row',
    alignItems:'center'
  },
  telephoneView:{
    height:40,
    justifyContent:'center',
  },
  codeBtn:{
    width:120,
    borderLeftColor:'#756d92',
    borderLeftWidth:1,
    borderStyle:'solid',
    height:16,
    alignItems:'center',
    justifyContent:'center'
  },
  submitBtn:{
    backgroundColor:'#746a9a',
    borderRadius:30,
    marginTop:20,
    height:40,
    justifyContent:'center',
    alignItems:'center'
  },
  submitBtnText:{
    color:'#fff'
  },
  typeSwitch:{
    paddingLeft:commonStyle.pageSideWidth*2,
    marginTop:10
  },
  otherType:{
    position:'absolute',
    bottom:40,
    justifyContent:'center',
    alignItems:'center',
    flex:1,
    width:commonStyle.width100
  },
  otherTypeTitle:{
    color:'#fff',
    textAlign:'center'
  },
  otherList:{
    flexDirection:'row',
    marginTop:10
  },
  otherItemImg:{
    width:30,
    height:30
  },
  modal:{
    position:'absolute',
    bottom:0,
    left:0,
    right:0,
    top:0,
  },
  modalbg:{
    backgroundColor:'rgba(0,0,0,.5)',
    flex:1
  },
  modalMain:{
    position:'absolute',
    top:170,
    left:commonStyle.pageSideWidth,
    zIndex:10,
    backgroundColor:'#fff',
    width:commonStyle.width100-commonStyle.pageSideWidth*2,
    padding:20,
    borderRadius:3
  },
  inputView:{
    height:40,
    borderRadius:3,
    paddingLeft:10,
    flexDirection:'row',
    alignItems:'center'
  },
  imgCodeInput:{
    padding:0,
    flex:1,
  },
  imgCode:{
    width:140,
    height:30,
    marginRight:10
  },
  imgCodeView:{
    paddingLeft:10
  },
  modalBtn:{
    flexDirection:'row'
  },
  modalBtnTouch:{
    flex:1,
    justifyContent:'center',
    alignItems:'center',
    marginTop:10
  },

});