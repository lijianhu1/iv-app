import React, {Component} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
  FlatList,
  ActivityIndicator
} from 'react-native';
import NavigationBar from '../components/common/NavigationBar';
import {commonStyle} from '../styles/commonStyle';
import Echarts from 'native-echarts';
import ajaxUser from '../js/service/ajaxUser'
export default class User extends Component {

  constructor(props) {
    super(props)
    this.state = {
      isLogin: true,
      nickName: "昵称",
      perfect: 70,
      avatarUrl: 'https://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83eqepnians7WhG9B9iaRWs45iaFBR8WAl8r4qgamZ5fVbHXHec0jZsmKIIkcyCXMd8xrhD4VRJX58RyZw/132',
      echartsOptions: {
        backgroundColor: "#f3f4f8",
        color: ["#fd5064"],
        tooltip: {
          trigger: 'none',
          show: false
        },
        legend: {
          // data: ['A商品']
        },
        grid: {
          containLabel: true,
          left: 10,
          right: 20,
          bottom: 20,
          top: 30,
        },
        xAxis: {
          type: 'category',
          boundaryGap: true,
          data: [this.date_fun(-6).md, this.date_fun(-5).md, this.date_fun(-4).md, this.date_fun(-3).md, this.date_fun(-2).md, this.date_fun(-1).md, this.date_fun().md,],
          minInterval: 1,
          splitLine: {
            show: true,
            lineStyle: {
              color: '#fff'
            }
          },
          axisTick: {
            show: false,

          },
          axisLine: {
            show: false
          },
          axisLabel: {
            show: true,
            interval: 0,
          },
          interval: 1,
        },
        yAxis: {
          x: 'center',
          type: 'value',
          min: 0,
          minInterval: 1,
          splitLine: {
            show: true,
            lineStyle: {
              color: '#fff'
            }
          },
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            formatter: function () {
              return "";
            }
          }
        },
        series: [{
          // name: '过去7日零钱收益',
          type: 'line',
          smooth: false,  //平滑度
          data: [0,0,0,0,0,0,],
          symbolSize: 4,//拐点大小
          symbol: 'circle',//拐点样式
          color: '#ff4f66',
          areaStyle: {
            color: '#f9eaed',
            shadowColor: '#f9eaed'
          },
          itemStyle: {
            normal: {
              label: {show: true, formatter: '+{c}', color: '#ff4f66'},
              color: '#ff4f66',
              borderColor: '#ff4f66',
              borderWidth: 1,
              shadowColor: '#fff',
              shadowBlur: 0,
              lineStyle: {
                width: 1,//折线宽度
                color: "#ff4f66"//折线颜色
              }
            },
          },

        }]
      },
      searchResult: [],
      isLoading: false,
      isMoreLoad: false,
      updataEnd: false,
      searchCondition: {
        page: 1,
        pageSize: 20
      },
      goldData: {
        balance: '',
        totalGold: '',
        yesterdayGold: ''
      },
    }
  }

  componentDidMount() {
    this.echartsInit();
    this.getPersonalGoldLogs();
    this.getPesonalGoldLogs();

  }

  userInfo() {
    return this.state.isLogin ? <View style={styles.userInfoLogined}>
      <View style={styles.userInfo}>
        <Image style={styles.avatar}
               source={ this.state.avatarUrl ? {uri: this.state.avatarUrl} : require('../images/user/user_default.png')}/>
        <View style={styles.userInfoMain}>
          <View style={commonStyle.flexDirectionRow}>
            <Text style={styles.userInfoLogin}>{this.state.nickName}</Text>
            <TouchableOpacity style={[commonStyle.flexDirectionRow, {marginTop: 4, marginLeft: 10}]} activeOpacity={.8}
                              onPress={() => {
                              }}>
              <Image style={styles.edit} source={require('../images/user/edit.png')}/>
              <Text style={styles.userInfoMsg}>编辑</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.userInfoMsg}>星球身份完善度 {this.state.perfect}%</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.logout} activeOpacity={.8} onPress={() => {
        console.log('退出')
      }}>
        <Text style={styles.userInfoMsg}>退出</Text>
      </TouchableOpacity>
    </View>
      :
      <View style={styles.userInfo}>
        <Image style={styles.avatar} source={require('../images/user/user_default.png')}/>
        <View style={styles.userInfoMain}>
          <Text style={styles.userInfoLogin} onPress={() => {
            console.log('12333')
          }}>点击登录</Text>
          <Text style={styles.userInfoMsg}>登陆后填写星球身份证信息</Text>
        </View>
      </View>
  }

  _renderItem(data) {
    let item = data.item;
    if (item.status == 5) {
      return <View style={styles.billItem}>
        <View style={[styles.billItemRow, {marginBottom: 5}]}>
          <Text style={styles.billItemTitle}>主动投递-{item.jobName}</Text>
          <Text
            style={styles.billItemSalary}>{item.symbol == 0 ? '-' : item.symbol == 1 ? '+' : ''}{item.gainNum}元</Text>
        </View>
        <View style={styles.billItemRow}>
          <View style={commonStyle.flexDirectionRow}>
            <Text numberOfLines={1} style={styles.billItemOther}>{item.compName}</Text>
            <Text numberOfLines={1} style={styles.billItemOther}>{item.compProperty}</Text>
            <Text numberOfLines={1} style={styles.billItemOther}>{item.compSize}</Text>
          </View>
          <Text style={[styles.billItemOther, {marginRight: 0}]}>{item.commitTime}</Text>
        </View>
      </View>
    } else if (item.status == 6) {
      return <View style={styles.billItem}>
        <View style={[styles.billItemRow, {marginBottom: 5}]}>
          <Text style={styles.billItemTitle}>被下载-{item.compName}</Text>
          <Text
            style={styles.billItemSalary}>{item.symbol == 0 ? '-' : item.symbol == 1 ? '+' : ''}{item.gainNum}元</Text>
        </View>
        <View style={styles.billItemRow}>
          <View style={commonStyle.flexDirectionRow}>
            <Text numberOfLines={1} style={styles.billItemOther}>{item.areasName}</Text>
            <Text numberOfLines={1} style={styles.billItemOther}>{item.compProperty}</Text>
            <Text numberOfLines={1} style={styles.billItemOther}>{item.compSize}</Text>
          </View>
          <Text style={[styles.billItemOther, {marginRight: 0}]}>{item.commitTime}</Text>
        </View>
      </View>
    } else {
      let title = item.status == 7 ? "零钱提现" : item.status == 9 ? "邀请好友" : item.status == 10 ? "被好友邀请" : item.status == 11 ? "星球身份证完善" : item.status == 12 ? "公众号绑定" : item.status == 13 ? "被星球居民膜拜" : item.status == 14 ? "膜拜星球居民" : '';
      let status = item.status == 7 ? "成功提现" : item.status == 9 ? "已成功邀请好友" : item.status == 10 ? "已成功注册ivva" : item.status == 11 ? "星球身份证完善70%以上奖励" : item.status == 12 ? "已成功绑定公众号" : item.status == 13 ? "成功被膜拜" : item.status == 14 ? "成功膜拜" : ''
      return <View style={styles.billItem}>
        <View style={[styles.billItemRow, {marginBottom: 5}]}>
          <Text style={styles.billItemTitle}>{title}</Text>
          <Text
            style={styles.billItemSalary}>{item.symbol == 0 ? '-' : item.symbol == 1 ? '+' : ''}{item.gainNum}元</Text>
        </View>
        <View style={styles.billItemRow}>
          <View style={commonStyle.flexDirectionRow}>
            <Text numberOfLines={1} style={{color: '#999', fontSize: 12}}>{status}</Text>
          </View>
          <Text style={{color: '#999', fontSize: 12}}>{item.commitTime}</Text>
        </View>
      </View>
    }
  }

  _keyExtractor = (item, index) => index.toString();

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

  _createEmptyView() {
    return <View style={[commonStyle.flexCenter, styles.nothingBox]}>
      <Image source={require('../images/common/nothing2.png')} style={styles.nothingImg}/>
      <Text style={commonStyle.nothingText}>还没收益哦~</Text>
      <Text style={[commonStyle.nothingText, {marginTop: 0}]} onPress={() => {
        this.props.navigation.navigate('Index')
      }}>去赚钱</Text>
    </View>
  }

  loadMore() {
    let searchCondition = this.state.searchCondition;
    searchCondition.page = searchCondition.page + 1;
    this.setState({
      isMoreLoad: true,
      searchCondition
    }, () => {
      this.getPersonalGoldLogs('more')
    });
  }
  cartRender(){
    return  <View style={styles.cartWrap}>
      <ImageBackground style={styles.cart} source={require("../images/user/user-cart-banner.png")}
                       resizeMode='stretch'>
        <View style={styles.cartBox}>
          <View style={styles.cartItem}>
            <View>
              <Text style={styles.cartMesTitle}>当前余额</Text>
              <View style={commonStyle.flexDirectionRow}>
                <Text style={styles.cart$}>￥</Text>
                <Text style={styles.cartGold}>{this.state.goldData.balance || '00'}</Text>
              </View>
            </View>
            <View style={styles.cartWithdraw}>
              <Text style={styles.cartWithdrawText}>提现</Text>
            </View>

          </View>
          <View style={styles.cartItem}>
            <View style={commonStyle.flexDirectionRow}>
              <View >
                <Text style={styles.cartMesTitle}>已累积赚取</Text>
                <View style={commonStyle.flexDirectionRow}>
                  <Text style={styles.cart$}>￥</Text>
                  <Text style={styles.cartGold}>{this.state.goldData.totalGold || '00'}</Text>
                </View>
              </View>
              <View style={{marginLeft: 30}}>
                <Text style={styles.cartMesTitle}>今日赚取零钱</Text>
                <Text style={styles.cartGold}>{this.state.goldData.yesterdayGold || '00'}</Text>
              </View>
            </View>
            <Text style={styles.cartWithdrawList} onPress={()=>{this.props.navigation.navigate('WithdrawList')}}>提现记录</Text>
          </View>
          <View style={styles.cartMessage}>
            <Text style={styles.cartMessageText}>填写虚假身份信息会直接影响现金提现</Text>
          </View>
        </View>
      </ImageBackground>
    </View>
  }
  echartBox(){
    return <View style={styles.echart}>
      <View style={styles.echartsHeader}>
        <View style={[styles.echartsLine, styles.echartsLineLeft]}></View>
        <View style={[styles.echartsLine, styles.echartsLineRight]}></View>
        <View style={styles.echartsIcon}></View>
        <Text style={styles.echartstitle}>过去7天现金收益</Text>
      </View>
      {/*{this.echartsInit('111')}*/}
      <Echarts ref="echart" option={this.state.echartsOptions} width={commonStyle.width100 - commonStyle.pageSideWidth * 2}
      height={200}/>
    </View>
  }
  render() {
    return (
      <View style={commonStyle.container}>
        <NavigationBar
          title='我的资产'
          leftButtonHide = {true}
        />
        <ScrollView>
          <View style={styles.userInfoWrap}>
            {this.userInfo()}
          </View>
          {this.cartRender()}
          {this.echartBox()}
          <View style={styles.bill}>
            <Text style={styles.billTitle}>账单流水（{this.state.searchResult.length || 0}）</Text>
            <View style={styles.billList}>
              <FlatList data={this.state.searchResult}
                        renderItem={(data) => this._renderItem(data)} keyExtractor={this._keyExtractor}
                        ListFooterComponent={this._footer.bind(this)}
                        ListEmptyComponent={this._createEmptyView()}
              />
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }

  //获取流水账单
  getPersonalGoldLogs(type) {
    
    ajaxUser.getPersonalGoldLogs(this.state.searchCondition, res => {
      console.log(res)
      if (res.code == 200) {
        let result = [];
        let updateEnd = false;
        if (type) {
          result = this.state.searchResult.concat(res.resultList)
        } else {
          result = res.resultList
        }
        if (this.state.searchCondition.page >= res.totalPage) {
          updateEnd = true
        }
        this.setState({
          searchResult: result,
          isLoading: false,
          isMoreLoad: false,
          updataEnd: updateEnd
        })
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
          goldData: res.resultMap?res.resultMap:[]
        })
      }
    })
  }

  //图表初始化
  echartsInit(e) {
    let echartsOptions = this.state.echartsOptions;
    console.log('echartsOptions',echartsOptions)
    let day7 = this.date_fun(-6);
    let reqdata = {
      startTime: day7.start,
      endTime: day7.end,
    };
    ajaxUser.incomeStatistics(reqdata, res => {
      let dateArr = [];
      let valArr = [];
      if (res.code == 200) {
        for (let i = 0; i < res.resultList.length; i++) {
          let dateItemArr = res.resultList[i].incomeTime.split('-');
          let dateItem = dateItemArr[1] + '.' + dateItemArr[2];
          dateArr.push(dateItem);
          valArr.push(res.resultList[i].gainNum)
        }
      } else {
        dateArr = [this.date_fun(-6).md, this.date_fun(-5).md, this.date_fun(-4).md, this.date_fun(-3).md, this.date_fun(-2).md, this.date_fun(-1).md, this.date_fun().md,];
        valArr = [0, 0, 0, 0, 0, 0, 0];
      }
      echartsOptions.xAxis.data = dateArr;
      echartsOptions.series[0].data = valArr;
      //
      this.setState({
        echartsOptions:echartsOptions
      });
      // return <Echarts ref="echart" option={echartsOptions} width={commonStyle.width100 - commonStyle.pageSideWidth * 2}
      //                 height={200}/>
    });
    // let dateArr = [];
    // let valArr = [];
    // dateArr = [this.date_fun(-6).md, this.date_fun(-5).md, this.date_fun(-4).md, this.date_fun(-3).md, this.date_fun(-2).md, this.date_fun(-1).md, this.date_fun().md,];
    // valArr = [0, 0, 0, 0, 0, 0, 0];
    // let echartsOptions = this.state.echartsOptions;
    // echartsOptions.xAxis.data = dateArr;
    // echartsOptions.series[0].data = valArr;
    // return <Echarts ref="echart" option={echartsOptions} width={commonStyle.width100 - commonStyle.pageSideWidth * 2}
    //                 height={200}/>
  }
  date_fun(day) {
    let time = new Date();
    let year_end = time.getFullYear();
    let mouth_end = (time.getMonth() + 1) >= 10 ? time.getMonth() + 1 : '0' + (time.getMonth() + 1);
    let day_end = time.getDate() >= 10 ? time.getDate() : '0' + time.getDate();
    let endDate = year_end + '-' + mouth_end + '-' + day_end;
    let time2 = new Date();
    day = day || 0;
    time2.setTime(time2.getTime() + (24 * 60 * 60 * 1000 * day));
    let year_start = time2.getFullYear();
    let mouth_start = (time2.getMonth() + 1) >= 10 ? time2.getMonth() + 1 : '0' + (time2.getMonth() + 1);
    let day_start = time2.getDate() >= 10 ? time2.getDate() : '0' + time2.getDate();
    let startDate = year_start + '-' + mouth_start + '-' + day_start;
    let md = mouth_start + '.' + day_start;
    return {
      end: endDate,
      start: startDate,
      md: md
    }
  }
}

const styles = StyleSheet.create({
  userInfoWrap: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderStyle: 'solid',
    borderTopColor: '#efefef',
  },
  userInfo: {
    flexDirection: 'row',
    paddingLeft: commonStyle.pageSideWidth,
    paddingTop: 15,
    paddingBottom: 15,
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25,
    marginRight: 15
  },
  userInfoMain: {
    justifyContent: 'center'
  },
  userInfoLogin: {
    color: '#333',
    fontSize: 16
  },
  userInfoMsg: {
    fontSize: 12,
    color: '#333',
    // marginTop:5
  },
  edit: {
    width: 10,
    height: 10,
    marginTop: 4,
    marginRight: 5
  },
  logout: {
    marginRight: commonStyle.pageSideWidth
  },
  userInfoLogined: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  cartWrap: {
    backgroundColor: '#fff',
    paddingLeft: commonStyle.pageSideWidth,
    paddingRight: commonStyle.pageSideWidth,
    marginTop: 10,
    paddingTop: 15,
    paddingBottom: 15,
  },
  cart: {
    width: commonStyle.width100 - commonStyle.pageSideWidth * 2,
  },
  cartBox: {
    paddingTop: 20,
    paddingBottom: 20
  },
  cartItem: {
    flexDirection: 'row',
    justifyContent: "space-between",
    alignItems: 'center',
    paddingLeft: 10,
    paddingRight: 10
  },
  cartMesTitle: {
    fontSize: 10,
    color: '#fff'
  },
  cartGold: {
    fontWeight: '600',
    color: '#fff',
    fontSize: 22
  },
  cart$: {
    color: '#fff',
    fontSize: 12,
    alignSelf: "flex-end",
    marginBottom: 3,
    marginLeft: 5
  },
  cartWithdrawList: {
    alignSelf: 'flex-start',
    color: '#fff',
    fontSize: 10
  },
  cartMessage: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    paddingLeft: 10
  },
  cartMessageText: {
    color: "#fde0e5",
    fontSize: 12,
    paddingTop: 5,
    paddingBottom: 5
  },
  cartWithdraw: {
    backgroundColor: '#fff',
    borderRadius: 15,
    paddingTop: 2,
    paddingBottom: 2,
    paddingLeft: 12,
    paddingRight: 12
  },
  cartWithdrawText:{
    color: "#FF4F64",
    fontSize: 10,
  },
  echart: {
    width: commonStyle.width100,
    paddingRight: commonStyle.pageSideWidth,
    paddingLeft: commonStyle.pageSideWidth,
    marginTop: 10,
    height: 250,
    backgroundColor: '#fff'
  },
  echartsHeader: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row'
  },
  echartsLine: {
    position: "absolute",
    height: 1,
    width: 30,
    backgroundColor: '#d9d9d9',
  },
  echartsLineLeft: {
    left: 60
  },
  echartsLineRight: {
    right: 60
  },
  echartsIcon: {
    width: 10,
    height: 10,
    borderWidth: 3,
    borderColor: '#FF4F64',
    borderStyle: 'solid',
    borderRadius: 5,
    marginRight: 10
  },
  echartstitle: {
    color: '#999',
    fontSize: 12,
    marginTop: 10,
    marginBottom: 10
  },
  bill: {
    paddingRight: commonStyle.pageSideWidth,
    paddingLeft: commonStyle.pageSideWidth,
    backgroundColor: '#fff',
    marginTop: 10
  },
  billTitle: {
    color: '#333',
    borderBottomWidth: 1,
    borderStyle: 'solid',
    borderBottomColor: '#e8e9eb',
    paddingBottom: 5,
    paddingTop: 10
  },
  billList: {},
  billItem: {
    paddingTop: 5,
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderStyle: 'solid',
    borderBottomColor: '#e8e9eb',
  },
  billItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  billItemTitle: {
    fontSize: 12,
    color: '#333'
  },
  billItemSalary: {
    fontSize: 12,
    color: commonStyle.themeColor
  },
  billItemOther: {
    fontSize: 12,
    color: '#999',
    marginRight: 5,
    maxWidth: 80
  },
  footer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 10
  },
  // 无匹配数据
  nothingImg: {
    width: 80,
    height: 50,
  },
  nothingBox: {
    marginTop: 40,
    marginBottom: 40
  },

});