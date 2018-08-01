import React, {Component} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  ActivityIndicator
} from 'react-native';
import NavigationBar from '../components/common/NavigationBar';
import {commonStyle} from '../styles/commonStyle'
import ajaxUser from '../js/service/ajaxUser'
import tool from '../js/utils/Tool'
export default class WithdrawList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchCondition:{
        page:1,
        pageSize:20
      },
      searchResult:[],
      isLoading:false,
      isMoreLoad:false,
      updataEnd:false,
    };
  }

  componentDidMount() {
    this.getPaymentApplyLogs()
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
    return <View style={styles.listItem}>
      <View  style={styles.listItemTouch}>
        <View style={commonStyle.flexRowSb}>
          <Text style={commonStyle.fontsizeColor(14,'#333')}>{item.status==0?'提现申请中':item.status==1?'提现成功':'提现失败'}</Text>
          <Text style={commonStyle.fontsizeColor(14,'#ff4f64')}>{item.gold}.00元</Text>
        </View>
        <View style={{marginTop:5}}>
          <Text style={commonStyle.fontsizeColor(12,'#999')}>{item.creatTime}</Text>
        </View>
      </View>
    </View>
  }
  loadMore() {
    let searchCondition = this.state.searchCondition;
    searchCondition.page = searchCondition.page + 1;
    this.setState({
      isMoreLoad: true,
      searchCondition
    }, () => {
      this.getPaymentApplyLogs(true)
    });
  }
  getPaymentApplyLogs(type) {
    ajaxUser.getPaymentApplyLogs(this.state.searchCondition, res => {
      if (res.success) {
        let result = [];
        let updateEnd = false;
        if (type) {
          result = this.state.searchResult.concat(res.data)
        } else {
          result = res.data
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
      }else {
        this.setState({
          searchResult:[],
          updateEnd:true
        });
      }
    })
  }
  render() {
    return <View style={{backgroundColor:'#fff',flex:1}}>
      <NavigationBar
        title='提现记录'
        navigation={this.props.navigation} />
      <FlatList data={this.state.searchResult}
                renderItem={(data) => this._renderItem(data)} keyExtractor={this._keyExtractor}
                ListFooterComponent={this._footer.bind(this)}
                ListEmptyComponent={this._createEmptyView()}
      />
    </View>

  }


}

const styles = StyleSheet.create({
  listItem:{
    marginRight:commonStyle.pageSideWidth,
    marginLeft:commonStyle.pageSideWidth,

  },
  listItemTouch:{
    borderStyle:'solid',
    borderBottomColor:'#E8E9EB',
    borderBottomWidth:1,
    paddingTop:10,
    paddingBottom:10
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