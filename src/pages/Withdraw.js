import React, {Component} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import NavigationBar from '../components/common/NavigationBar';
import {commonStyle} from '../styles/commonStyle'
import ajaxUser from '../js/service/ajaxUser'
import tool from '../js/utils/Tool'
import Toast, {DURATION} from 'react-native-easy-toast';
import PopupDialog, {
  DialogTitle,
  DialogButton,
  SlideAnimation,
} from 'react-native-popup-dialog';
const slideAnimation = new SlideAnimation({
  slideFrom: 'bottom',
});
export default class Withdraw extends Component {
  constructor(props) {
    super(props);
    this.state = {
      disabled:false,
      gold:'',
      totalGold:'',
      tomorrow:'',
      buttonText:'',
      modalHasConfig:false
    };
  }

  componentDidMount() {
    this.isAllowferPayment();
    this.getPesonalGoldLogs();
    let today = new Date();
    let tomorrow = new Date(today.getTime()+24*60*60*1000);
    this.setState({
      tomorrow:tool.formatDate(tomorrow,'MM月dd日'),
    });
    // this.showFadeAnimationDialog()
  }

  isAllowferPayment() {
    ajaxUser.isAllowferPayment(res => {
     if(res.code!=200){
       this.setState({
         buttonText:res.messge,
         disabled:true,
         modalHasConfig:false
       },()=>{ this.fadeAnimationDialog.show()});
     }else {
       this.setState({
         buttonText:'微信提现',
         disabled:false
       });
     }
    })
  }
  //获取金币余额等信息
  getPesonalGoldLogs() {
    let date = new Date();
    let year = date.getFullYear();
    let mouth = date.getMonth() + 1;
    let day = date.getDate();
    mouth = mouth < 10 ? '0' + mouth : mouth;
    day = day < 10 ? '0' + day : day;
    let reqdata = {
      yesterday: year + '-' + mouth + '-' + day
    };
    ajaxUser.getPesonalGlodLogs(reqdata, res => {
      if (res.code == 200) {
        this.setState({
          totalGold: res.resultMap?res.resultMap.balance:0
        })
      }
    })
  }

  withdraw() {
    this.setState({
      disabled:true
    });
    let reqdata={
      gold:this.state.gold
    };
    ajaxUser.transferPayment(reqdata,res=>{
      if(!res.success){
        this.setState({
          modalHasConfig:true
        },()=>{this.fadeAnimationDialog.show();});
      }else {
        setTimeout(()=>{
          this.props.navigation.navigate('User');
          this.setState({
            totalGold:(this.state.totalGold-0) - (this.state.gold-0)
          })
        },3000)
      }
      tool.showToastText(res.messge);
      this.refs.toast.show(res.messge,3000);
      this.setState({
        disabled:false
      });
    })
  }

  render() {
    return <View style={{flex: 1, backgroundColor: '#fafafa'}}>
      <NavigationBar
        title='星球职位'
        navigation={this.props.navigation}
      />
      <View style={styles.top}>
        <Text style={styles.topText}>当前余额</Text>
        <View style={[commonStyle.flexDirectionRow]}>
          <Text style={[styles.topText, {paddingTop: 10}]}>￥</Text>
          <Text style={styles.topGold}>{this.state.totalGold}</Text>
        </View>
      </View>
      <View style={styles.inputGold}>
        <Text>提现金额（元）</Text>
        <View style={styles.inputGoldWrap}>
          <Text style={{fontSize: 30, color: '#333'}}>￥</Text>
          <TextInput
            style={styles.inputVal}
            keyboardType={'numeric'}
            editable={!this.state.disabled}
            onChangeText={(gold) =>{
              let totalGold = this.state.totalGold-0;
              if(gold>0){
                if(gold>2000){
                  gold = 2000;
                  this.refs.toast.show('提现金额不得大于2000');
                }else if(gold>totalGold){
                  gold = totalGold;
                  this.refs.toast.show('提现金额不得大于剩余金额',2000);
                }
                gold=gold+'';
                this.setState({
                  gold:gold,
                })
              }else {
                this.setState({
                  gold:'',
                })
              }
            }}
            value={this.state.gold}
            placeholder={'请输入金额'}
            placeholderTextColor={commonStyle.placeholderColor}
            underlineColorAndroid='transparent'/>
        </View>
        <View style={[commonStyle.flexDirectionRow, {alignItems: 'center'}]}>
          <Text style={commonStyle.fontsizeColor(12)}>预计微信到账时间 </Text>
          <Text style={commonStyle.fontsizeColor(12, '#ff4f64')}>{this.state.tomorrow}</Text>
        </View>
      </View>
      <View style={styles.buttonGold}>
        <View>
          <TouchableOpacity onPress={this.withdraw.bind(this)} activeOpacity={.7} disabled={this.state.gold<1||this.state.disabled}
                            style={[styles.withdrawBtn,(this.state.gold<1||this.state.disabled)?styles.withdrawBtnDisabled:null]}><Text
            style={[styles.withdrawBtnText,(this.state.gold<1||this.state.disabled)?commonStyle.fontsizeColor(14):null]}>微信提现</Text></TouchableOpacity>
        </View>
        <View style={[commonStyle.flexRowSb, {marginTop: 10}]}>
          <TouchableOpacity activeOpacity={.8}><Text
            style={commonStyle.fontsizeColor(12)}>客服中心</Text></TouchableOpacity>
          <TouchableOpacity activeOpacity={.8} onPress={()=>{this.props.navigation.navigate('WithdrawList')}}><Text
            style={commonStyle.fontsizeColor(12)}>提现记录</Text></TouchableOpacity>
        </View>
      </View>
      <View style={styles.messageGold}>
        <Text style={styles.messageTitle}>温馨提示</Text>
        <Text style={styles.messageText}>1.完成星球身份信息70%以上才能提现</Text>
        <Text style={styles.messageText}>2.提现申请将在一个工作日内审批，当天审评，隔天到账</Text>
        <Text style={styles.messageText}>3.为了方便快速提现到账，请填写你的真实信息（星球身份信息）</Text>
      </View>
      <PopupDialog
        ref={(fadeAnimationDialog) => {
          this.fadeAnimationDialog = fadeAnimationDialog;
        }}
        dialogTitle={<DialogTitle title={this.state.buttonText}/>}
        dialogAnimation={slideAnimation}
        dismissOnTouchOutside={true}
        haveOverlay={true}
        width={0.7}
        height={100}
      >
        <View style={styles.dialogContentView}>
          <View style={styles.dialogBtnWrap}>
            <TouchableOpacity
              activeOpacity={.8}
              onPress={()=>{this.fadeAnimationDialog.dismiss();}}
              style={[styles.dialogBtn,styles.dialogBtnCancel]}>
              <Text style={styles.dialogBtnCancelText}>关闭</Text>
            </TouchableOpacity>
            {this.state.modalHasConfig?<TouchableOpacity
              activeOpacity={.8}
              onPress={()=>{this.fadeAnimationDialog.dismiss();}}
              style={[styles.dialogBtn,styles.dialogBtnConfirm]}>
              <Text style={styles.dialogBtnConfirmText}>立即完善</Text>
            </TouchableOpacity>:null}

          </View>

        </View>
      </PopupDialog>
      <Toast
        ref="toast"
        style={{backgroundColor:'#000'}}
        position='top'
        positionValue={200}
        fadeInDuration={300}
        fadeOutDuration={300}
        opacity={0.8}
        textStyle={{color:'#fff'}}
      />
    </View>

  }


}

const styles = StyleSheet.create({
  top: {
    backgroundColor: '#fafafa',
    paddingRight: commonStyle.pageSideWidth,
    paddingLeft: commonStyle.pageSideWidth,
    paddingTop: 10,
  },
  topText: {
    color: '#333'
  },
  topGold: {
    color: '#333',
    fontSize: 40
  },
  inputGold: {
    paddingLeft: commonStyle.pageSideWidth,
    // paddingRight:commonStyle.pageSideWidth,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: '#fff'
  },
  inputGoldWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    borderStyle: 'solid',
    paddingBottom: 10,
    paddingTop: 5,
    marginBottom: 10
  },
  inputVal: {
    flex: 1
  },
  buttonGold: {
    paddingLeft: commonStyle.pageSideWidth,
    paddingRight: commonStyle.pageSideWidth,
    marginTop: 20
  },
  messageGold: {
    marginLeft: commonStyle.pageSideWidth,
    marginRight: commonStyle.pageSideWidth,
    marginTop: 20
  },
  messageText: {
    fontSize: 12,
    color: '#b5b5b5',
    lineHeight: 20
  },
  messageTitle: {
    color: '#b5b5b5',
    marginBottom: 10,
    fontSize: 12,
    fontWeight: '600'
  },
  dialogContentView:{

  },
  dialogBtnWrap:{
    flexDirection:'row',
  },
  dialogBtn:{
    marginLeft:20,
    marginRight:20,
    paddingTop:5,
    paddingBottom:5,
    marginTop:10,
    flex:1
  },
  dialogBtnCancel:{

  },
  dialogBtnConfirm:{

  },
  dialogBtnCancelText:{
    textAlign:'center',
    color:'#333'
  },
  dialogBtnConfirmText:{
    textAlign:'center',
    color:'#ff4f64',
  },
  withdrawBtn:{
    backgroundColor:'#ff4f64',
    paddingTop:8,
    paddingBottom:8,
    borderRadius:1
  },
  withdrawBtnDisabled:{
    backgroundColor:'#ddd',
  },
  withdrawBtnText:{
    textAlign:'center',
    color:'#fff'
  },
  dialogBtnWrap:{
    flexDirection:'row',
  }

});