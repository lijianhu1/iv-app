import React, {Component,PropTypes} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  ScrollView
} from 'react-native';
import {commonStyle} from '../styles/commonStyle';
import NavigationBar from '../components/common/NavigationBar'
import ajaxUser from '../js/service/ajaxUser';
import ajaxPosition from '../js/service/ajaxPosition';
import PositionListComponent from '../components/common/PositionListComponent'

export default class Index extends Component {
  constructor(props){
    super(props);
    this.state = {
      jobsearchType:0,
      welfareType:0,
      gold:0,
      statusBarColor:'#496dc4',
      searchCondition: {
        page: 1,
        pageSize: 20
      },
    }
  }

  componentDidMount() {
    // this.refs.childPositionList.handleSearch(this.state.searchCondition)
    // this.jobsearch();
    // this.getRedPacketsList();
    // this.getPesonalGoldLogs()
  }
  jobsearch(){
    const config={page:1,pageSize:20,recommendJob:2};
    ajaxPosition.jobsearch(config,res=>{
      if(res.code==200){
        this.setState({
          jobsearchType:res.jobList.length
        })
      }
    })
  }
  getRedPacketsList() {
    ajaxUser.getUnreceivedCount(res => {
      if(res.success) {
        if(res.data) {
          this.setState({
            welfareType: !!res.data
          })
        }

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
          gold: res.resultMap?res.resultMap.balance:0
        })
      }
    })
  }
  //滚动事件
  onScrollChange(event){
    // let scrollHeight = event.nativeEvent.contentOffset.y;
    // if(scrollHeight>=128) {
    //   this.setState({
    //     statusBarColor:'#fff'
    //   })
    // }else {
    //   this.setState({
    //     statusBarColor:'#496dc4'
    //   })
    // }
  }
  _header(){
    return <View>
      <View style={styles.topBox}>
        <Image source={require('../images/index/index-banner.png')} style={styles.topBoxImg}/>
        <View style={[commonStyle.flexDirectionRow,commonStyle.flexWrapWrap, styles.topWrap]}>
          <TouchableOpacity style={styles.topItem} activeOpacity={1}>
            <Image source={require('../images/index/money-ico.png')} style={styles.iconWidth}
                   resizeMode={Image.resizeMode.contain}/>
            <View style={[commonStyle.flexCenter, styles.mt10]}>
              <Text style={styles.topItemText}>零钱</Text>
              <Text style={styles.topItemText}>￥{this.state.gold||0}</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.topItem} onPress={()=>{this.props.navigation.navigate('Withdraw')}}   activeOpacity={1}>
            <Image source={require('../images/index/moneyPack-ico.png')}
                   style={styles.iconWidth} resizeMode={Image.resizeMode.contain}/>
            <View style={[commonStyle.flexCenter, styles.mt10]}>
              <Text style={styles.topItemText}>提现</Text>
              <Text style={styles.topItemText}></Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.mainBox}>
        <TouchableOpacity style={[styles.mainItemStyle,styles.mainItemBorderBottem,styles.mainItemBorderRight]} activeOpacity={1} onPress={() => {
          this.props.navigation.navigate('PositionDetail', {key: '传递的标题'})
        }}>
          <Image source={require('../images/index/ivva-about.png')}
                 style={styles.iconWidth} resizeMode={Image.resizeMode.contain}/>
          <Text style={styles.mt10}>
            星球介绍
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.mainItemStyle,styles.mainItemBorderBottem,styles.mainItemBorderRight]}
                          activeOpacity={1} onPress={()=>{this.props.navigation.navigate('PositionMatch')}}>
          <Image source={require('../images/index/redPosition-ico.png')}
                 style={styles.iconWidth} resizeMode={Image.resizeMode.contain}/>
          <Text style={styles.mt10}>
            现金职位
          </Text>
          {this.state.jobsearchType?<View  style={styles.redPoint}/>:null}
        </TouchableOpacity>
        <TouchableOpacity style={[styles.mainItemStyle,styles.mainItemBorderBottem]} activeOpacity={1}onPress={()=>{this.props.navigation.navigate('Resume')}}>
          <Image source={require('../images/index/resume-ico.png')}
                 style={styles.iconWidth} resizeMode={Image.resizeMode.contain}/>
          <Text style={styles.mt10}>
            星球身份
          </Text>
        </TouchableOpacity>
        {/*            <TouchableOpacity style={[styles.mainItemStyle,styles.mainItemBorderBottem,styles.mainItemBorderRight]} activeOpacity={1}>
         <Image source={require('../images/index/unclaimed-ico.png')}
         style={styles.iconWidth} resizeMode={Image.resizeMode.contain}/>
         <Text style={styles.mt10}>
         星球福利
         </Text>
         {this.state.welfareType?<View  style={styles.redPoint}/>:null}
         </TouchableOpacity>*/}
        <TouchableOpacity style={[styles.mainItemStyle,styles.mainItemBorderRight,styles.mainItemBorderBottem]} activeOpacity={1}>
          <Image source={require('../images/index/ranking-ico.png')}
                 style={styles.iconWidth} resizeMode={Image.resizeMode.contain}/>
          <Text style={styles.mt10}>
            收入榜
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.mainItemStyle,styles.mainItemBorderBottem,styles.mainItemBorderRight]} activeOpacity={1} onPress={() => {
          this.props.navigation.navigate('MakeMoney')
        }}>
          <Image source={require('../images/index/makeMoney-ico.png')}
                 style={styles.iconWidth} resizeMode={Image.resizeMode.contain}/>
          <Text style={styles.mt10}>
            任务
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.mainItemStyle,styles.mainItemBorderBottem]} activeOpacity={1}>
          <Image source={require('../images/index/invitation-ico.png')}
                 style={styles.iconWidth} resizeMode={Image.resizeMode.contain}/>
          <Text style={styles.mt10}>
            发送邀请
          </Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity activeOpacity={1}>
        <Image source={require('../images/index/banner2.png')} style={styles.positionBanner}  />
      </TouchableOpacity>
      <View>
        <View style={[commonStyle.padding(10,20),commonStyle.border('Bottom',1,'#e9e9e9')]}>
          <Text>猜你喜欢的职位</Text>
        </View>
      </View>
    </View>
  }
  render() {
    return (
      <View style={commonStyle.container}>
        <NavigationBar
          title='星球'
          style={{backgroundColor:'#496dc4'}}
          titleStyle={{color:'#fff'}}
          leftButtonHide = {true}
          statusBar={{ backgroundColor:this.state.statusBarColor}}
          hide={true}
        />
        <View style={styles.topBar}>
          <View style={styles.topBarCity}>
            <Text style={styles.topBarText}>深圳</Text>
            <Image source={require('../images/index/arrow.png')} resizeMode={Image.resizeMode.contain} style={styles.topBarCityIcon} />
          </View>
          <TouchableOpacity onPress={()=>{this.props.navigation.navigate('Search')}}   activeOpacity={1} style={styles.topBarSearch}>
            <Image source={require('../images/index/search.png')} resizeMode={Image.resizeMode.contain} style={[commonStyle.iconDefault,{marginRight:5}]} />
            <Text  style={styles.topBarText}>搜索公司/职位</Text>
          </TouchableOpacity>
          <View>
            <Image source={require('../images/index/user.png')} resizeMode={Image.resizeMode.contain} style={[commonStyle.iconDefault]} />
          </View>
        </View>
        <View style={{backgroundColor:'#fff'}}>
          <PositionListComponent ref="childPositionList" refresh={true} header={this._header.bind(this)} onScrollChange={this.onScrollChange.bind(this)} searchCondition={this.state.searchCondition} />
        </View>

      </View>
    );
  }
}
const width = Dimensions.get('window').width;
const styles = StyleSheet.create({
  topBox: {},
  topBoxImg: {
    width: width,
    height: 120,
    // resizeMode:Image.resizeMode.contain,
    justifyContent: 'flex-start',
    alignItems: "flex-start"
  },
  topWrap: {
    position: 'absolute',
    top: 0,
    flex: 1,
    height: 120,
    left: 0,
    right: 0,
  },
  topItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop: 20
  },
  iconWidth: {
    width: 30,
    height: 30
  },
  topItemText: {
    color: commonStyle.white,
    fontSize: commonStyle.textFont,
  },
  mt10: {
    marginTop: 10
  },
  mainBox:{
    backgroundColor:'#fff',
    flexWrap:'wrap',
    flexDirection:'row',
    marginTop:15
  },
  mainItemStyle:{
    width:width/3-1,
    height:width/3,
    justifyContent:'center',
    alignItems:'center',
    position:'relative'
  },
  redPoint:{
    position:'absolute',
    width:9,
    height:9,
    borderRadius:5,
    backgroundColor:'#FB434F',
    top:25,
    right:25
  },
  mainItemBorderBottem:{
    borderBottomWidth:1,
    borderBottomColor:'#e8e9eb',
    borderStyle:'solid',
  },
  mainItemBorderRight:{
    borderRightWidth:1,
    borderRightColor:'#e8e9eb',
    borderStyle:'solid',
  },
  topBar:{
    flexDirection:'row',
    backgroundColor:'#496dc4',
    paddingLeft:commonStyle.pageSideWidth,
    paddingRight:commonStyle.pageSideWidth,
    alignItems:'center',
    paddingTop:5,
    paddingBottom:5,
  },
  topBarCity:{
    flexDirection:'row',
    alignItems:'center',
    marginRight:5
  },
  topBarText:{
    color:'#fff'
  },
  topBarCityIcon:{
    width:10,
    marginLeft:5
  },
  topBarSearch:{
    flexDirection:'row',
    alignItems:'center',
    flex:1,
    backgroundColor:'rgba(0,0,0,.2)',
    borderRadius:20,
    padding:5,
    paddingLeft:10,
    marginRight:10,
    marginLeft:5
  },
  positionBanner:{
    width:commonStyle.width100,
    height:90,
    marginTop:15,
    marginBottom:15
  }
});