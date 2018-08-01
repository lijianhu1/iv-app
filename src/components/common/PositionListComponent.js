import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  RefreshControl,
  ActivityIndicator
} from 'react-native';
import PropTypes from 'prop-types';
import ajaxPosition from '../../js/service/ajaxPosition'
import {commonStyle} from '../../styles/commonStyle';
export default class PositionListComponent extends Component{
  static propTypes = {
    searchCondition:PropTypes.object,
    positionNum:PropTypes.func,
    header:PropTypes.func,
    refreshing:PropTypes.bool
  };
  constructor(props){
    super(props);
    this.state = {
      searchResult: [],
      isLoading: false,
      isMoreLoad: false,
      updataEnd: false,
      searchCondition: {
        page: 15,
        pageSize: 20
      },
      getTime: new Date().getTime()
    }
  }

  componentDidMount() {
    // this.jobsearch()
  }
  _keyExtractor = (item, index) => index.toString();

  _footer() {
    let foot = null;
    if (this.state.updataEnd) {
      foot = <Text >我是有底线的</Text>
    } else {
      if (this.state.isMoreLoad) {
        foot = <ActivityIndicator color='#666' animating={true}></ActivityIndicator>
      } /*else {
        foot =
          <TouchableOpacity onPress={this.loadMore.bind(this)} activeOpacity={.8}><Text>点击加载更多</Text></TouchableOpacity>
      }*/
    }
    return <View style={[styles.footer, {display: this.state.searchResult.length > 0 ? 'flex' : 'none'}]}>
      {foot}
    </View>
  }
  _createEmptyView() {
    return <View style={[commonStyle.flexCenter, styles.nothingBox]}>
      <Image source={require('../../images/common/nothing.png')} style={commonStyle.nothingImg}/>
      <Text style={commonStyle.nothingText}>根据您的求职意向和简历信息~</Text>
      <Text style={commonStyle.nothingText}>无法为您匹配上合法的职位</Text>
    </View>
  }
  handleItem(item) {
    // this.props.navigation.navigate('PositionDetail', {key: '传递的标题'})
  }
  _renderItem(data) {
    // const deliveryed = (data.item.jobGold=='0.00'&&data.item.isDelivery>0)?'<Text style={styles.positionDelivery} >（已投递）</Text>':''
    return <View style={styles.positionItem}>
      <TouchableOpacity style={styles.positionItemWrap} onPress={this.handleItem.bind(this)} activeOpacity={.8}>
        <Image
          source={ data.item.compLogoName ? {uri: 'https://www.ivvajob.com/download/getCompanyIcon/companyLogo/' + data.item.compLogoName + '?v=' + this.state.getTime} : require('../../images/position/company_default.png')}
          style={styles.companyLogo}/>
        <View style={{flex: 1}}>
          <View style={commonStyle.flexRowSb}>
            <View style={commonStyle.flexDirectionRow}>
              <Text style={styles.positionItemTitle}>{data.item.jobTitle}</Text>
              <Text
                style={styles.positionDelivery}>{(data.item.jobGold == '0.00' && data.item.isDelivery > 0) ? '（已投递）' : ''}</Text>
            </View>
            <Text
              style={styles.positionItemSalary}>{data.item.salaryFrom == "0" ? '不限' : data.item.salaryFrom + "-" + data.item.salaryTo + "k"}</Text>
          </View>
          <View>
            <Text style={styles.positionItemComp} numberOfLines={1}>{data.item.compName}</Text>
          </View>
          <View style={commonStyle.flexRowSb}>
            <View style={commonStyle.flexDirectionRow}>
              <Text style={[styles.positionItemMeg]} numberOfLines={1}>{data.item.workCity} </Text>
              <Text style={[styles.positionItemMeg]} numberOfLines={1}>{data.item.jobYear}</Text>
              <Text style={[styles.positionItemMeg]} numberOfLines={1}>{data.item.education}</Text>
            </View>
            <Text style={styles.positionItemMeg}>{data.item.postDate}</Text>
          </View>
        </View>
        {data.item.jobGold ? <View>
          <View style={styles.receive}>
            <Text style={styles.receiveText}>最高可得</Text>
            <Text style={styles.receiveGold}><Text>{data.item.jobGold || 0}</Text> <Text>元</Text></Text>
            <Text style={styles.receiveText}>{data.item.isDelivery > 0 ? '已投递' : '立即领取'}</Text>
          </View>
          <View style={[styles.receiveIcon, styles.receiveIconTop]}/>
          <View style={[styles.receiveIcon, styles.receiveIconBottom]}/>
        </View> : null}
      </TouchableOpacity>
    </View>
  }
  refreshData() {
    let searchCondition = {
      page: 1,
      pageSize: 20
    }
    this.setState({
      isLoading: true,
      searchCondition:searchCondition
    },()=>{this.jobsearch()});

  }
  receive(item) {
    return (<View>
      <View style={styles.receive}>
        <Text style={styles.receiveText}>最高可得</Text>
        <Text style={styles.receiveGold}><Text>{item.jobGold || 0}</Text> <Text>元</Text></Text>
        <Text style={styles.receiveText}>{item.isDelivery > 0 ? '已投递' : '立即领取'}</Text>
      </View>
      <View style={[styles.receiveIcon, {top: -5}]}/>
      <View style={[styles.receiveIcon, {bottom: -5}]}/>
    </View>)
  }

  render(){
    return  <FlatList data={this.state.searchResult}
                      extraData={this.state}
                      onScroll={this.props.onScrollChange}
                       renderItem={(data) => this._renderItem(data)} keyExtractor={this._keyExtractor}
                       ListFooterComponent={this._footer.bind(this)}
                       ListEmptyComponent={this._createEmptyView()}
                      ListHeaderComponent={this.props.header?this.props.header:null}
                      onEndReached={()=>{this.loadMore()}}
                      onEndReachedThreshold={0.1}
                      refreshControl={ this.props.refresh?
                        <RefreshControl title={'loading'} titleColor={'#666'} colors={['#666']} tintColor={'#666'}
                                        refreshing={this.state.isLoading} onRefresh={() => {
                          this.refreshData()
                        }}/>:null
                      }
    />
  }
  loadMore() {
    if(!this.state.isMoreLoad){
      let searchCondition = this.state.searchCondition;
      searchCondition.page = searchCondition.page + 1;
      this.setState({
        isMoreLoad: true,
        searchCondition
      },()=>{this.jobsearch('more')});
    }

  }
  jobsearch(type) {
    ajaxPosition.jobsearch(this.state.searchCondition, res => {
      if (res.code == 200) {
        let result = [];
        let updateEnd = false;
        let isMoreLoad = false;
        if (type) {
          result = this.state.searchResult.concat(res.jobList)
        } else {
          result = res.jobList
        }
        if(this.state.searchCondition.page>=res.totalPage){
          updateEnd = true;
          isMoreLoad = true;
        }
        this.setState({
          searchResult: result,
          isLoading: false,
          isMoreLoad: isMoreLoad,
          updataEnd: updateEnd
        });
        this.props.positionNum?this.props.positionNum(res.rowCount):null
      }else {
        this.setState({
          updateEnd:true
        });
        if(!type){
          this.setState({
            searchResult:[],
          });
          this.props.positionNum?this.props.positionNum(0):null
        }

      }
    })
  }
  handleSearch(condition){
    this.setState({
      searchCondition:condition
    },()=>{this.jobsearch()})
  }
}
const styles = StyleSheet.create({
  banner: {
    width: commonStyle.width100,
    height: 120
  },
  searchBox: {
    backgroundColor: commonStyle.bgGrayColor,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    marginTop: 10,
    marginBottom: 10,
    flexDirection: 'row'
  },
  searchText: {
    color: '#c1c1c1'
  },
  searchIcon: {
    width: 16,
    height: 16,
    marginRight: 5
  },
  nothingBox: {
    marginTop: 40,
    marginBottom:40
  },
  companyLogo: {
    width: 30,
    height: 30,
    marginRight: 10,
    resizeMode: Image.resizeMode.contain,
  },
  positionListBox: {
    paddingBottom: 50
  },
  positionWrap: {
    // backgroundColor:'#f7f9f8'
  },
  positionItem: {
    paddingTop: 10,
    backgroundColor: '#f7f9f8',
  },
  positionItemWrap: {
    backgroundColor: '#fff',
    flex: 1,
    paddingRight: 20,
    paddingLeft: 20,
    // paddingBottom:10,
    flexDirection: 'row',
    alignItems: 'center',
    // paddingTop:10,
    height: 80
  },
  positionItemTitle: {
    fontSize: 14,
    color: '#555'
  },
  positionItemComp: {
    color: '#666',
    fontSize: 13,
    maxWidth: 200,
    marginTop:5,
    marginBottom:5
    // textOverflow:'ellipsis',
    // whiteSpace: 'nowrap'
  },
  positionItemMeg: {
    fontSize: 12,
    color: '#999',
    marginRight: 5,
    alignItems: 'center',
    justifyContent: 'center'
  },
  positionItemSalary: {
    fontSize: 13,
    color: '#ff4f64'
  },
  positionDelivery: {
    fontSize: 12,
    color: '#999'
  },
  itemDivide: {
    backgroundColor: '#f7f9f8',
    paddingTop: 10
  },
  footer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 20,
    backgroundColor: '#f7f9f8',
    paddingBottom: 20,
    marginBottom:40
  },
  line: {
    // marginLeft:5,
    // marginRight:5,
    width: 5,
    height: 20,
    display: 'flex',
    backgroundColor: '#333'
  },
  receive: {
    width: 60,
    backgroundColor: '#ff4f64',
    borderRadius: 4,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10
  },
  receiveGold: {
    color: '#fff',
    fontSize: 16
  },
  receiveText: {
    color: '#fff',
    fontSize: 12
  },
  receiveIcon: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#f7f9f8',
    position: 'absolute',
    right: 55,
  },
  receiveIconTop: {
    top: -5
  },
  receiveIconBottom: {
    bottom: -5
  }

});