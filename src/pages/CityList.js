import React, {Component, PropTypes} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  TextInput,
  SectionList,
  ScrollView,
  FlatList
} from 'react-native';
import {commonStyle} from '../styles/commonStyle';
import NavigationBar from '../components/common/NavigationBar'
import ajaxUser from '../js/service/ajaxUser';
import info from '../js/utils/Info';
import tool from '../js/utils/Tool';
import ajaxPosition from '../js/service/ajaxPosition';
  const dismissKeyboard = require('dismissKeyboard');
import Toast, {DURATION} from 'react-native-easy-toast';
const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T',
  'U', 'V', 'W', 'X', 'Y', 'Z'];
export default class CityList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchText: "",
      hotCity: [
        {id: "765", value: "深圳", superId: "548"},
        {id: "530", value: "北京", superId: "5300"},
        {id: "538", value: "上海", superId: "5380"},
        {id: "763", value: "广州", superId: "548"},
        {id: "653", value: "杭州", superId: "540"},
        {id: "635", value: "南京", superId: "539"},
        {id: "736", value: "武汉", superId: "546"},
        {id: "801", value: "成都", superId: "552"},
        {id: "551", value: "重庆", superId: "5510"},
        {id: "531", value: "天津", superId: "5310"},
        {id: "682", value: "厦门", superId: "542"},
      ],
      cityList:info.getCityList2(),
      selectType:false,
      isSearching:false,
      testText:""
    }
  }

  componentDidMount() {
  }
  _keyExtractor = (item, index) => index.toString();
  _renderItem(data){
    let item = data.item;
    return <TouchableOpacity activeOpacity={.8} onPress={this.citySelect.bind(this,item.id)} style={[commonStyle.border('Bottom',1,'#F4F4F4'),commonStyle.padding(0,commonStyle.pageSideWidth),styles.listItem]}><Text style={{color:commonStyle.textBlockColor}}>{item.value}</Text></TouchableOpacity>
  }
  _renderSectionHeader(data){
    let title = data.section.title;
    return <View style={styles.sectionTitle}><Text style={{color:'#bababa'}}>{title}</Text></View>
  }
  citySelect(id){
    console.log(id)
  }
  letterItem(item){
    // this.refs.toast.show(item,100);
    let index = this.state.cityList.findIndex(o=>{
      return o.title ==item;
    });
    if(index!==-1){
      console.log(index);
      this.refs.sectionlist.scrollToLocation({
        animated:true,
        itemIndex:0,
        sectionIndex:index,
        viewPosition:0,
      })
    }

  }
  renderLetters(){
    return !this.state.selectType?<View style={styles.letters}>
      {letters.map((item,index)=>{
        return <Text onPress={this.letterItem.bind(this,item,index)} key={item}>{item}</Text>
      })}
    </View>:null
  }
  clearSearch(){
    dismissKeyboard()
    this.setState({
      selectType:false,
      searchText:''
    })
  }
  handleChangeText(searchText){
    this.setState({searchText});
    if(searchText){
      clearTimeout(this.timeOut);
      this.timeOut = setTimeout(()=>{
        this.setState({
          searchResult:tool.searchList('北',this.state.cityList)
        },()=>{
          console.log(this.state.searchResult)
        });
     // console.log(tool.searchList('北',this.state.cityList))
//         console.log(tool.searchListJob('销',info.getJobList()))
      },1000)
    }

  }
  _header(){
    return <View ref="header">

      <View style={styles.search}>
        <TextInput
          style={[styles.searchInput, commonStyle.border(1, '#eaeaea')]}
          onChangeText={this.handleChangeText.bind(this)}
          value={this.state.searchText}
          onFocus={()=>{ this.setState({selectType:true})}}
          placeholder={'请输入城市名'}
          placeholderTextColor={commonStyle.placeholderColor}
          underlineColorAndroid='transparent'/>
          <TouchableOpacity onPress={this.clearSearch.bind(this)}>
            <Text >取消</Text>
          </TouchableOpacity>
      </View>
      <View style={styles.hotCity}>
        <Text style={styles.hotTitle}>热门城市</Text>
        <View style={styles.hotList}>
          {this.state.hotCity.map((item)=>(
            <TouchableOpacity   activeOpacity={.8} onPress={this.citySelect.bind(this,item.id)} style={[styles.hotItem, commonStyle.border(1, '#E6E6E6')]} key={item.id}><Text
              style={styles.hotText}>{item.value}</Text></TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  }
  _renderSearchItem(data){
    let item = data.item;
    return <TouchableOpacity activeOpacity={.8} onPress={this.citySelect.bind(this,item.id)} style={[commonStyle.border('Bottom',1,'#E6E6E6'),styles.selectItem]}>
      <Text style={{color:commonStyle.textBlockColor}}>{item.value}</Text>
    </TouchableOpacity>
  }
  render() {
    return (
    <View style={commonStyle.container}>
      <NavigationBar
        title="选择城市"
        navigation={this.props.navigation}
      />
        <View style={styles.cityList}>
          <SectionList
            keyboardShouldPersistTaps={'always'}
            renderItem={(data) => this._renderItem(data)}
            sections={this.state.cityList}
            keyExtractor={this._keyExtractor}
            renderSectionHeader={this._renderSectionHeader.bind(this)}
            getItemLayout={(data,index)=>({length:40,offset: 40 * index, index})}
            ref="sectionlist"
             ListHeaderComponent={this._header()}
          />
        </View>
      {this.renderLetters()}
      <Toast
        ref="toast"
        style={{backgroundColor:'#000'}}
        position='top'
        positionValue={250}
        fadeInDuration={100}
        fadeOutDuration={500}
        opacity={0.8}
        textStyle={{color:'#fff'}}
      />
      {this.state.selectType?<View style={styles.selectSearch} >
        <FlatList data={this.state.searchResult}
          renderItem={(data) => this._renderSearchItem(data)} keyExtractor={this._keyExtractor}
        />
      </View>:null}

    </View>
    );
  }
}
const styles = StyleSheet.create({
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: commonStyle.pageSideWidth,
    paddingRight: commonStyle.pageSideWidth,
    paddingTop: 10,
    backgroundColor:'#f7f9f8'
  },
  searchInput: {
    flex: 1,
    padding: 0,
    height: 40,
    justifyContent: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    marginRight: 10,

  },
  hotCity: {
    paddingLeft: commonStyle.pageSideWidth,
    paddingRight: commonStyle.pageSideWidth,
    paddingTop: 30,
    backgroundColor:'#f7f9f8'
  },
  hotTitle: {
    color: '#bfbfbf',
  },
  hotList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10
  },
  hotItem: {
    width: (commonStyle.width100 - commonStyle.pageSideWidth * 2) / 3 - 15,
    marginRight: 15,
    marginBottom: 15,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff'
  },
  hotText: {
    color: '#333',
  },
  cityList:{
    backgroundColor:'#fff',
  },
  sectionTitle:{
    backgroundColor:'#f7f9f8',
    height:40,
    justifyContent:'center',
    paddingLeft:commonStyle.pageSideWidth,
    paddingRight:commonStyle.pageSideWidth,
  },
  letters:{
    position:'absolute',
    bottom:20,
    right:5,
    zIndex:9,
    justifyContent:'center',
    alignItems:'center'
  },
  listItem:{
    height:40,
    justifyContent:'center'
  },
  selectSearch:{
    position:'absolute',
    backgroundColor: '#f7f9f8',
    width:commonStyle.width100,
    bottom:0,
    top:110,
    paddingLeft:commonStyle.pageSideWidth,
    paddingRight:commonStyle.pageSideWidth,
  },
  selectItem:{
    height:40,
    justifyContent:'center',
  }
});