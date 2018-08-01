import React, {Component} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import NavigationBar from '../components/common/NavigationBar';
import {commonStyle} from '../styles/commonStyle'
import ajaxPosition from '../js/service/ajaxPosition'
import tool from '../js/utils/Tool'
export default class WithdrawList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchCondition:{
        page:1,
        pageSize:20,
        compId:'107264',
        status:1,
        source:0
      },
      searchResult:[],
      tabType:0,
      companyData:{
        talentId:'228001',
        compId:'107264',
      },
      isLoading: false,
      isMoreLoad: false,
      updataEnd: false,
      companyInfo:{},
      getTime:new Date().getTime()
    };
  }

  componentDidMount() {
    this.getCompInfo();
    this.getTalentDemandList()
  }
  handleTab(type){
    this.setState({
      tabType:type
    })
  }
  _createEmptyView() {
    return <View style={[commonStyle.flexCenter, styles.nothingBox]}>
      <Image source={require('../images/common/nothing.png')} style={commonStyle.nothingImg}/>
      <Text style={commonStyle.nothingText}>暂无提现记录~</Text>
    </View>
  }
  _footer() {
    let foot = null;
    if (this.state.updataEnd) {
      foot = <Text >我是有底线的</Text>
    } else {
      if (this.state.isMoreLoad) {
        foot = <ActivityIndicator color='#666' animating={true}></ActivityIndicator>
      } else {
        foot =
          <TouchableOpacity onPress={this.loadMore.bind(this)} activeOpacity={.8}><Text>点击加载更多</Text></TouchableOpacity>
      }
    }
    return <View style={[styles.footer, {display: this.state.searchResult.length > 0 ? 'flex' : 'none'}]}>
      {foot}
    </View>
  }
  _keyExtractor = (item, index) => index.toString();
  _renderItem(data){
    let item = data.item;
    return  <View style={[commonStyle.padding(10,0),commonStyle.border('Bottom',1,'#e8e9eb')]}>
      <View style={commonStyle.flexRowSb}>
        <Text style={commonStyle.fontsizeColor(14,'#333')}>{item.jobName}</Text>
        <Text style={commonStyle.fontsizeColor(14,'#ff4f64')}>{item.jobSalaryFrom} - {item.jobSalaryTo}k</Text>
      </View>
      <View  style={commonStyle.flexRowSb}>
        <View style={commonStyle.flexDirectionRow}>
          <Text style={styles.companyBase}  numberOfLines={1}>{item.cityName}</Text>
          <Text style={styles.companyBase}  numberOfLines={1}>{item.workYear}</Text>
          <Text style={styles.companyBase}  numberOfLines={1}>{item.jobEducation}</Text>
        </View>
        <Text style={[commonStyle.fontsizeColor(12,'#999'),{marginTop:5}]}>{item.releaseTime}</Text>
      </View>
    </View>
  }
  loadMore(){}
  getCompInfo(){
    ajaxPosition.getTalentDemand(this.state.companyData, res=>{
      if(res.code==200){
        this.setState({
          companyInfo:res.talentInfo
        })
      }
    })
  }
  getTalentDemandList(type) {
    ajaxPosition.getTalentDemandList(this.state.searchCondition, res => {
      if (res.code == 200) {
        let result = [];
        let updateEnd = false
        if (type) {
          result = this.state.searchResult.concat(res.talentList)
        } else {
          result = res.talentList
        }
        if(this.state.searchCondition.page>=res.totalPage){
          updateEnd = true
        }
        this.setState({
          searchResult: result,
          isLoading: false,
          isMoreLoad: false,
          updataEnd: updateEnd
        });
        this.props.positionNum?this.props.positionNum(res.rowCount):null
      }else {
        this.setState({
          searchResult:[],
          updateEnd:true
        });
        this.props.positionNum?this.props.positionNum(0):null
      }
    })
  }
  render() {
    return <View style={{backgroundColor:'#fff',flex:1}}>
      <NavigationBar
        title='公司详情'
        navigation={this.props.navigation} />
      <View style={styles.companyTop}>
        <View style={styles.companyTopWrap}>
          <View>
            <Text style={styles.companyTitle} numberOfLines={1}>{this.state.companyInfo.compName}</Text>
            <View style={commonStyle.flexDirectionRow}>
              <Text style={styles.companyBase}  numberOfLines={1}>{this.state.companyInfo.areaName}</Text>
              <Text style={styles.companyBase}  numberOfLines={1}>{this.state.companyInfo.compProperty}</Text>
              <Text style={styles.companyBase}  numberOfLines={1}>{this.state.companyInfo.compSize}</Text>
            </View>
          </View>
          <Image style={styles.companyLogo} source={this.state.companyInfo.logoName?{uri:`https://www.ivvajob.com/download/getCompanyIcon/companyLogo/'${this.state.companyInfo.logoName}?v=${this.state.getTime}`}:require('../images/position/company_default.png')}/>
        </View>
      </View>
      <View style={styles.companyMain}>
        <View style={[styles.tabNav,commonStyle.border('Bottom',1,'#e8e9eb')]}>
          <TouchableOpacity onPress={this.handleTab.bind(this,0)} style={[styles.tabNavItem,commonStyle.border('Right',1,'#e8e9eb')]} activeOpacity={1}><Text style={[styles.tabNavItemText,!this.state.tabType?styles.tabNavItemTextActive:null]}>公司主页</Text></TouchableOpacity>
          <TouchableOpacity onPress={this.handleTab.bind(this,1)} style={styles.tabNavItem} activeOpacity={1}><Text style={[styles.tabNavItemText,this.state.tabType?styles.tabNavItemTextActive:null]}>在招职位</Text></TouchableOpacity>
        </View>
        <View style={styles.tabMain}>
          {!this.state.tabType?<View style={styles.companyInfo}>
            <View>
              <View style={styles.companyInfoItemTit}>
                <View style={[styles.line,{left:50}]}></View>
                <View style={[styles.line,{right:50}]}></View>
                <Text>公司介绍</Text>
              </View>
              <View>
                <Text style={commonStyle.fontsizeColor(12,'#999')}>
                  {this.state.companyInfo.companyIntro}
                </Text>
              </View>
            </View>
            <View>
              <View style={styles.companyInfoItemTit}>
                <View style={[styles.line,{left:50}]}></View>
                <View style={[styles.line,{right:50}]}></View>
                <Text>公司地址</Text>
              </View>
              <View>
                <Text style={commonStyle.fontsizeColor(12,'#666')}>
                  {this.state.companyInfo.addr}
                </Text>
              </View>
            </View>
          </View>: <View>

            <FlatList data={this.state.searchResult}
                      renderItem={(data) => this._renderItem(data)} keyExtractor={this._keyExtractor}
                      ListFooterComponent={this._footer.bind(this)}
                      ListEmptyComponent={this._createEmptyView()}
            />
          </View>}


        </View>
      </View>
    </View>
  }
}

const styles = StyleSheet.create({
  companyTop:{
    backgroundColor:'#f7f9f8',
    paddingBottom:10
  },
  companyTopWrap:{
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',
    backgroundColor:'#fff',
    paddingLeft:commonStyle.pageSideWidth,
    paddingRight:commonStyle.pageSideWidth,
    paddingBottom:10,
    paddingTop:10,
  },
  companyLogo: {
    width: 50,
    height: 50,
    resizeMode: Image.resizeMode.contain,
  },
  companyTitle:{
    maxWidth:220,
    color:'#333'
  },
  companyBase:{
    fontSize:12,
    color:'#999',
    maxWidth:(commonStyle.width100-commonStyle.pageSideWidth*2-74)/3,
    marginRight:8,
    marginTop:5
  },
  tabNav:{
    flexDirection:'row',
  },
  companyMain:{
    paddingRight:commonStyle.pageSideWidth,
    paddingLeft:commonStyle.pageSideWidth,
  },
  tabNavItem:{
    marginTop:10,
    marginBottom:10,
    flex:1
  },
  tabNavItemText:{
    color:'#333',
    textAlign:'center'
  },
  tabNavItemTextActive:{
    color:commonStyle.themeColor
  },
  tabMain:{

  },
  companyInfoItemTit:{
    position:'relative',
    justifyContent:'center',
    alignItems:'center',
    marginTop:25,
    marginBottom:25
  },
  line:{
    position:'absolute',
    width:50,
    height:1,
    backgroundColor:'#e8e9eb'
  },
  footer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 20,
    backgroundColor: '#fff',
    paddingBottom: 20,
  },
  nothingBox: {
    marginTop: 40,
    marginBottom: 40
  },
});