import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import NavigationBar from '../components/common/NavigationBar';
import {commonStyle} from '../styles/commonStyle';
import ajaxPosition from '../js/service/ajaxPosition'
export default class Search extends Component {
  constructor(props){
    super(props)
    this.state = {
      searchText:'',
      searchButton:"取消",
      hotList:[],
      historyList:[],
    }
  }

  componentDidMount() {
    this.loadHistoryLogs();
    this.hotSearch();
  }
  hotSearch(){
    ajaxPosition.hotSearch(res=>{
      if(res.code==200){
        this.setState({
          hotList:res.resultList
        })
      }
      // storage.save({
      //   key: 'loginState',  // 注意:请不要在key中使用_下划线符号!
      //   data: {
      //     userid: '888888',
      //     token: 'test'
      //   },
      //   // 如果不指定过期时间，则会使用defaultExpires参数
      //   // 如果设为null，则永不过期
      //   expires: 1000 * 3600
      // });
      

    })
  }
  loadHistoryLogs(){
    //读取历史搜索
    storage.load({
      key: 'historyLogs',
      autoSync: false,
      syncInBackground: true,
    }).then(res => {
      console.log('load',res)
      this.setState({
        historyList:res,
      })
    }).catch(err => {
      console.log(err)
    })
  }
  searchSubmit(){
    let history = this.state.historyList;
    let searchText = this.state.searchText;
    if(history.indexOf(searchText)==-1){
      history.unshift(searchText);
      if(history.length>10){
        history = history.slice(0,10)
      }
    }
    storage.save({
      key: 'historyLogs',
      data: history,
      // 如果不指定过期时间，则会使用defaultExpires参数
      // 如果设为null，则永不过期
      // expires: null
    });
    this.setState({
      historyList:history
    });
    this.props.navigation.navigate('PositionList',{keyWord:searchText})
  }
  removeHistory(){
    storage.remove({key:'historyLogs'});
    this.setState({
      historyList:[]
    })
  }
  render() {
    return (
      <View style={{flex:1,backgroundColor:'#fff'}}>
        <NavigationBar
          title='搜索'
          navigation={this.props.navigation}
        />
        <View style={[styles.srarchBox,commonStyle.border('Bottom',1,'#ddd')]}>
          <View style={styles.srarchWrap}>
            <Image source={require('../images/common/search.png')} style={styles.searchIcon}/>
            <TextInput
              style={styles.searchInput}
              onChangeText={(searchText) => this.setState({searchText})}
              value={this.state.searchText}
              placeholder={'输入多个关键字，空格隔开'}
              placeholderTextColor={commonStyle.placeholderColor}
              underlineColorAndroid='transparent' />
          </View>
          <TouchableOpacity>
            {this.state.searchText?<Text onPress={this.searchSubmit.bind(this)}>完成</Text>:<Text onPress={()=>{this.props.navigation.pop()}}>取消</Text>}

          </TouchableOpacity>
        </View>
        <View style={commonStyle.padding(20)}>
          <View style={commonStyle.flexRowSb}>
            <Text>历史记录</Text>
            <TouchableOpacity activeOpacity={.7} onPress={this.removeHistory.bind(this)}>
              <Image source={require('../images/common/delete.png')} style={commonStyle.iconDefault}/>
            </TouchableOpacity>
          </View>
          <View style={styles.list}>
            {this.state.historyList.map((item,index)=>(
                <TouchableOpacity activeOpacity={.8} onPress={()=>{this.props.navigation.navigate('PositionList',{keyWord:item})}} style={[styles.listItem,commonStyle.padding(2,13)]} key={index}>
                  <Text style={styles.listItemText}>{item}</Text>
                </TouchableOpacity>
              )
            )}
          </View>
        </View>
        <View style={commonStyle.padding(20)}>
          <View style={commonStyle.flexRowSb}>
            <Text>热门搜索</Text>
          </View>
          <View style={styles.list}>
            {this.state.hotList.map((item)=>(
              <TouchableOpacity activeOpacity={.8} onPress={()=>{this.props.navigation.navigate('PositionList',{keyWord:item.jobName})}} style={[styles.listItem,commonStyle.padding(2,13)]} key={item.id}>
                <Text style={styles.listItemText}>{item.jobName}</Text>
              </TouchableOpacity>
              )
            )}
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  searchIcon: {
    width: 16,
    height: 16,
    marginRight: 5
  },
  srarchBox:{
    flexDirection:'row',
    alignItems:'center',
    paddingRight:commonStyle.pageSideWidth,
    paddingLeft:commonStyle.pageSideWidth,
    backgroundColor:'#fff',
    paddingBottom:10,
  },
  srarchWrap:{
    flexDirection:'row',
    flex:1,
    alignItems:'center',
    backgroundColor:'#f0eff5',
    borderRadius:20,
    paddingLeft:10,
    height:38,
    marginRight:10
  },
  searchInput:{
    flex:1,
    height:38
  },
  list:{
    flexDirection:'row',
    flexWrap:'wrap',
    marginTop:10
  },
  listItem:{
    backgroundColor:'#f0eff5',
    borderRadius:10,
    alignItems:'center',
    marginRight:10,
    marginBottom:10
  },
  listItemText:{
    fontSize:12,
    color:'#666'
  }
});