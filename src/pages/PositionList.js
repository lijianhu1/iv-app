import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  Modal,
  FlatList,
  ScrollView
} from 'react-native';
import NavigationBar from '../components/common/NavigationBar';
import info from '../js/utils/Info';
import ajaxUser from '../js/service/ajaxUser';
import {commonStyle} from '../styles/commonStyle';
import PositionListComponent from '../components/common/PositionListComponent'
const Geolocation = require('Geolocation');
const cityList = info.getCityList();
const salaryList = info.getSalary2(),
 jobYearList = info.getjobYear(),
 educationList = info.getEducation(),
 jobTypeList = info.getWorkType(),
 compNatureList = info.getComProperty(),//公司性质
 compSizeList = info.getCompSize(),//公司规模
 releaseDateList= info.getUpdateTime();//发布日期
export default class PositionList extends Component {
  constructor(props){
    super(props);
    this.state = {
      title:'星球职位',
      positionNum:"",
      modalVisible: false,//模态场景是否可见
      searchCondition: {
        keyWord: '',  //关键字
        page: 1,
        pageSize: 20,
        salaryRange: '',//薪资范围
        compNature: '',//公司性质
        jobYear: '',//工作年限
        education: '',//学历
        city: '',//城市
        compSize: '',//公司规模
        jobType: '',//各种类型
        releaseDate: '',//发布时间
        job: '',//职位id
        recommendJob: 0,  //1、推荐
        matchId:""
      },
      provinceList: [],  //省列表
      cityList: [],    //市列表
      areaList: [],    //区列表
      provinceId: '',
      cityId: '',
      areaId: '',
      cityName: '',
      showArea: false,//判断是否选区
      tabType:''
    }
  }

  setPositionNum(num){
    this.setState({
      positionNum:num
    })
  }
  componentDidMount() {
    let searchCondition = this.state.searchCondition;
    searchCondition.keyWord = this.props.navigation.state.params?this.props.navigation.state.params.keyWord:'';
    this.setState({searchCondition},()=>{this.refs.childPositionList.handleSearch(searchCondition)})
    this.getLocation()
  }
  _keyExtractor = (item, index) => index.toString()
  _renderItem(data){
    return <View>
      <TouchableOpacity><Text>{data.item.value}</Text></TouchableOpacity>
    </View>
  }
  handleCity(type,id,childList,name){
    let searchCondition = this.state.searchCondition;
    if(type=='province'){
      if(id){
        this.setState({
          [type+'Id']:id,
          cityList:childList,
        });
      }else {
        searchCondition.city = '';
        this.setState({
          searchCondition,
          modalVisible:false,
          cityName:'全国'
        },()=>{
          this.refs.childPositionList.handleSearch(this.state.searchCondition)
        })
      }
     
    }else if(type=='city'){
      searchCondition.city = id;
      this.setState({
        [type+'Id']:id,
        areaList:childList,
        showArea:true,
        cityName:name,
        modalVisible:false,
        searchCondition
      },()=>{
        this.refs.childPositionList.handleSearch(this.state.searchCondition)
      })
    }else if(type=='area'){
      if(id){
        searchCondition.city = id;
      }else {
        searchCondition.city = this.state.cityId;
      }
      this.setState({
        [type+'Id']:id,
        searchCondition,
        modalVisible:false,
      },()=>{
        this.refs.childPositionList.handleSearch(this.state.searchCondition)
      })
    }
  }
  closeModal(){
    this.setState({
      modalVisible:false
    })
  }
  cityRender(){
    return !this.state.showArea?<View style={styles.cityMain}>
      <ScrollView style={styles.cityList}>
        <TouchableOpacity style={styles.cityTouch} onPress={this.handleCity.bind(this,'province',0)}
                          activeOpacity={.8}>
          <Text style={[styles.cityName,!this.state.provinceId?styles.cityTouchProvinceActive:null]}>全国</Text>
        </TouchableOpacity>
        {cityList.map((item,index)=>{
          return <TouchableOpacity style={styles.cityTouch} key={item.id} onPress={this.handleCity.bind(this,'province',item.id,item.childList)}
                                   activeOpacity={.8}>
            <Text style={[styles.cityName,this.state.provinceId==item.id?styles.cityTouchProvinceActive:null]}>{item.value}</Text>
          </TouchableOpacity>
        })}
      </ScrollView>
      <ScrollView style={[styles.cityList,{backgroundColor:'#fff'}]}>
        {this.state.cityList.map((item,index)=>{
          return <TouchableOpacity  key={item.id} onPress={this.handleCity.bind(this,'city',item.id,item.childList,item.value)} activeOpacity={.8}>
            <Text style={[styles.cityName,this.state.cityId==item.id?styles.cityTouchCityActive:null]} >{item.value}</Text>
          </TouchableOpacity>
        })}
      </ScrollView>
    </View>: <View style={styles.itemWrap}>
      <ScrollView style={{maxHeight:300,paddingBottom:10}}>
        <View style={styles.conditionItemCon}>
          <TouchableOpacity onPress={this.handleCity.bind(this,'area',0)} activeOpacity={.8}><Text style={[styles.itemText,!this.state.areaId?styles.itemTextActive:null]} >全部</Text></TouchableOpacity>
          {this.state.areaList.map((item)=>{
            return <TouchableOpacity onPress={this.handleCity.bind(this,'area',item.id)} activeOpacity={.8} key={item.id}><Text style={[styles.itemText,this.state.areaId==item.id?styles.itemTextActive:null]}>{item.value}</Text></TouchableOpacity>
          })}
        </View>
      </ScrollView>
      <View style={commonStyle.flexCenter}>
        <TouchableOpacity style={styles.switch} onPress={()=>{this.setState({showArea:false})}}>
          <Image source={require('../images/position/switch.png')} style={commonStyle.iconDefault}/>
          <Text style={styles.switchText}>切换城市</Text>
        </TouchableOpacity>
      </View>
    </View>
  }
  handleConditionItem(type,id){
    let searchCondition = this.state.searchCondition;
     searchCondition.page = 1;
    searchCondition[type] = id;
    this.setState({
      searchCondition,
      modalVisible:false,
    },()=>{
      this.refs.childPositionList.handleSearch(searchCondition)
    })
  }
  modalItemRender(){
    if(this.state.tabType==1){
      return <View style={styles.cityWrap}>
        {this.cityRender()}
      </View>
    }else if(this.state.tabType==2){
      return <View style={styles.itemWrap}>
        <ScrollView style={{maxHeight:400,marginBottom:20}}>
          <Text style={styles.conditionItemTitle}>月薪范围</Text>
          <View style={styles.conditionItemCon}>
            <TouchableOpacity onPress={this.handleConditionItem.bind(this,'salaryRange','')} activeOpacity={.8}><Text style={[styles.itemText,!this.state.searchCondition.salaryRange?styles.itemTextActive:null]} >全部</Text></TouchableOpacity>
            {salaryList.map((item)=>{
              return <TouchableOpacity onPress={this.handleConditionItem.bind(this,'salaryRange',item.id)} activeOpacity={.8}
                                       key={item.id}>
                <Text style={[styles.itemText,this.state.searchCondition.salaryRange==item.id?styles.itemTextActive:null]}>{item.value}</Text>
              </TouchableOpacity>
            })}
          </View>

          <Text style={styles.conditionItemTitle}>工作经验</Text>
          <View style={styles.conditionItemCon}>
            <TouchableOpacity onPress={this.handleConditionItem.bind(this,'jobYear','')} activeOpacity={.8}><Text style={[styles.itemText,!this.state.searchCondition.jobYear?styles.itemTextActive:null]} >全部</Text></TouchableOpacity>
            {jobYearList.map((item)=>{
              return <TouchableOpacity onPress={this.handleConditionItem.bind(this,'jobYear',item.id)} activeOpacity={.8} key={item.id}>
                <Text style={[styles.itemText,this.state.searchCondition.jobYear==item.id?styles.itemTextActive:null]}>{item.value}</Text>
              </TouchableOpacity>
            })}
          </View>
          <Text style={styles.conditionItemTitle}>学历</Text>
          <View style={styles.conditionItemCon}>
            <TouchableOpacity onPress={this.handleConditionItem.bind(this,'education','')} activeOpacity={.8}><Text style={[styles.itemText,!this.state.searchCondition.education?styles.itemTextActive:null]} >全部</Text></TouchableOpacity>
            {educationList.map((item)=>{
              return <TouchableOpacity onPress={this.handleConditionItem.bind(this,'education',item.id)} activeOpacity={.8} key={item.id}><Text style={[styles.itemText,this.state.searchCondition.education==item.id?styles.itemTextActive:null]}>{item.value}</Text></TouchableOpacity>
            })}
          </View>
          <Text style={styles.conditionItemTitle}>工作类型</Text>
          <View style={styles.conditionItemCon}>
            <TouchableOpacity  onPress={this.handleConditionItem.bind(this,'jobType','')} activeOpacity={.8}><Text style={[styles.itemText,!this.state.searchCondition.jobType?styles.itemTextActive:null]} >全部</Text></TouchableOpacity>
            {jobTypeList.map((item)=>{
              return <TouchableOpacity onPress={this.handleConditionItem.bind(this,'jobType',item.id)} activeOpacity={.8} key={item.id}><Text style={[styles.itemText,this.state.searchCondition.jobType==item.id?styles.itemTextActive:null]}>{item.value}</Text></TouchableOpacity>
            })}
          </View>
        </ScrollView>
      </View>
    }else if(this.state.tabType==3){
      return <View style={styles.itemWrap}>
        <ScrollView style={{maxHeight:400,marginBottom:20}}>
          <Text style={styles.conditionItemTitle}>公司性质</Text>
          <View style={styles.conditionItemCon}>
            <TouchableOpacity onPress={this.handleConditionItem.bind(this,'compNature','')}  activeOpacity={.8}><Text style={[styles.itemText,!this.state.searchCondition.compNature?styles.itemTextActive:null]} >全部</Text></TouchableOpacity>
            {compNatureList.map((item)=>{
              return <TouchableOpacity onPress={this.handleConditionItem.bind(this,'compNature',item.id)} activeOpacity={.8} key={item.id}><Text style={[styles.itemText,this.state.searchCondition.compNature==item.id?styles.itemTextActive:null]}>{item.value}</Text></TouchableOpacity>
            })}
          </View>

          <Text style={styles.conditionItemTitle}>公司规模</Text>
          <View style={styles.conditionItemCon}>
            <TouchableOpacity onPress={this.handleConditionItem.bind(this,'compSize','')} activeOpacity={.8}><Text style={[styles.itemText,!this.state.searchCondition.compSize?styles.itemTextActive:null]} >全部</Text></TouchableOpacity>
            {compSizeList.map((item)=>{
              return <TouchableOpacity onPress={this.handleConditionItem.bind(this,'compSize',item.id)} activeOpacity={.8} key={item.id}><Text style={[styles.itemText,this.state.searchCondition.compSize==item.id?styles.itemTextActive:null]}>{item.value}</Text></TouchableOpacity>
            })}
          </View>
          <Text style={styles.conditionItemTitle}>发布日期</Text>
          <View style={styles.conditionItemCon}>
            <TouchableOpacity onPress={this.handleConditionItem.bind(this,'releaseDate','')} activeOpacity={.8}><Text style={[styles.itemText,!this.state.searchCondition.releaseDate?styles.itemTextActive:null]} >全部</Text></TouchableOpacity>
            {releaseDateList.map((item)=>{
              return <TouchableOpacity  onPress={this.handleConditionItem.bind(this,'releaseDate',item.id)} activeOpacity={.8} key={item.id}><Text style={[styles.itemText,this.state.searchCondition.releaseDate==item.id?styles.itemTextActive:null]}>{item.value}</Text></TouchableOpacity>
            })}
          </View>
        </ScrollView>
      </View>
    }else if(this.state.tabType==4){
      return <View style={styles.itemWrap}>
        <TouchableOpacity activeOpacity={.8} style={styles.recommendJob} onPress={this.handleConditionItem.bind(this,'recommendJob',1)}>
          <Text style={[styles.recommendJobText,this.state.searchCondition.recommendJob?styles.recomendActive:null]}>推荐的职位</Text>
          {this.state.searchCondition.recommendJob?<Image source={require('../images/position/gou.png')} style={{width:10,height:7}}/>:null}
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={.8} style={styles.recommendJob} onPress={this.handleConditionItem.bind(this,'recommendJob',0)}>
          <Text style={[styles.recommendJobText,!this.state.searchCondition.recommendJob?styles.recomendActive:null]}>最新的职位</Text>
          {!this.state.searchCondition.recommendJob?<Image source={require('../images/position/gou.png')} style={{width:10,height:7}}/>:null}
        </TouchableOpacity>
      </View>
    }
  }
  modalRender(){
    return this.state.modalVisible?<View style={styles.modal}>
      <TouchableOpacity style={styles.modalbg} activeOpacity={1} onPress={this.closeModal.bind(this)}></TouchableOpacity>
      <View style={styles.modalMain}>
        {this.modalItemRender()}
      </View>
    </View>:null
  }
  searchTab(type){
    this.setState({
      modalVisible:true,
      tabType:type
    })
  }
    render() {
    return (
      <View  style={{flex: 1, backgroundColor: '#fff',marginBottom:-40}}>
        <NavigationBar
          title={this.state.title+`（${this.state.positionNum||0}）`}
          navigation={this.props.navigation}
        />
        <View style={commonStyle.padding(0,commonStyle.pageSideWidth)}>
          <View style={[styles.srarchWrap,commonStyle.border(1,'#e8e8e8')]}>
            <Image source={require('../images/common/search.png')} style={styles.searchIcon}/>
            <TextInput
               style={[styles.searchInput,commonStyle.padding(0)]}
              onChangeText={(val) => {
                let searchCondition = this.state.searchCondition;
                searchCondition.keyWord = val;
                this.setState({searchCondition})
              }}
              value={this.state.searchCondition.keyWord}
              placeholder={'输入多个关键字，空格隔开'}
              placeholderTextColor={commonStyle.placeholderColor}
              underlineColorAndroid='transparent' />
          </View>
          <View style={styles.conditionTab}>
            <TouchableOpacity style={[styles.conditionTabTouch,{justifyContent:'flex-start'}]} onPress={this.searchTab.bind(this,1)}>
              <Text style={[styles.conditionTabTitle,this.state.tabType==1?styles.conditionTabTitleActive:null]}>{this.state.cityName||'城市'}</Text>
              <Image source={this.state.tabType==1?require('../images/position/arrow_down_sel.png'):require('../images/position/arrow_down.png')} style={styles.conditionTabIcon} />
            </TouchableOpacity>
            <TouchableOpacity  style={[styles.conditionTabTouch,{marginRight:10}]} onPress={this.searchTab.bind(this,2)}>
              <Text style={[styles.conditionTabTitle,this.state.tabType==2?styles.conditionTabTitleActive:null]}>职位</Text>
              <Image source={this.state.tabType==2?require('../images/position/arrow_down_sel.png'):require('../images/position/arrow_down.png')} style={styles.conditionTabIcon} />
            </TouchableOpacity>
            <TouchableOpacity  style={[styles.conditionTabTouch,{marginRight:10}]} onPress={this.searchTab.bind(this,3)}>
              <Text style={[styles.conditionTabTitle,this.state.tabType==3?styles.conditionTabTitleActive:null]}>公司</Text>
              <Image source={this.state.tabType==3?require('../images/position/arrow_down_sel.png'):require('../images/position/arrow_down.png')} style={styles.conditionTabIcon} />
            </TouchableOpacity>
            <TouchableOpacity  style={[styles.conditionTabTouch,{justifyContent:'flex-end'}]} onPress={this.searchTab.bind(this,4)}>
              <Text style={[styles.conditionTabTitle,this.state.tabType==4?styles.conditionTabTitleActive:null]}>{this.state.searchCondition.recommendJob?'推荐':'最新'}</Text>
              <Image source={this.state.tabType==4?require('../images/position/arrow_down_sel.png'):require('../images/position/arrow_down.png')} style={styles.conditionTabIcon} />
            </TouchableOpacity>
          </View>
        </View>

          <PositionListComponent  ref="childPositionList" searchCondition={this.state.searchCondition} positionNum= {this.setPositionNum.bind(this)} />
        {this.modalRender()}
      </View>
    )
  }
  /** 获取地理位置 */
  getLocation() {
    Geolocation.getCurrentPosition(
      location => {
        let longitude = location.coords.longitude; //经度
        let latitude = location.coords.latitude;  //维度
        let reqdata = {
          ak: 'cGICkI5AgtrQfR8MYAZggRvEakMQ5tdf',
          location: latitude + ',' + longitude,
          output: 'json'
        };
        ajaxUser.baiduCity(reqdata, cityres => {
          if(cityres.status == 0) {
            let cityName = cityres.result.addressComponent.city.split('市')[0];
            let allCityList = cityList;
            for(let i in allCityList) {
              let cityList = allCityList[i].childList;
              for(let j in cityList) {
                if(cityList[j].value == cityName) {
                  console.log(cityList[j])
                  // app.globalData.city = {
                  //   cityName: cityName,
                  //   cityId: cityList[j].id,
                  //   superId: cityList[j].superId,
                  //   areaList: cityList[j].childList,
                  // };
                  break;
                }
              }
            }
          }
          console.log('cityres',cityres)
        });
      },
      error => {
        alert("获取位置失败："+ error)
      }
    );
  }
}

const styles = StyleSheet.create({
  searchInput:{
    flex:1,
    height:30,
    fontSize:12
  },
  searchIcon: {
    width: 16,
    height: 16,
    marginRight: 5
  },
  srarchWrap:{
    borderRadius:20,
    height:30,
    flexDirection:'row',
    alignItems:'center',
    paddingLeft:10
  },
  conditionTab:{
    flexDirection:'row',
    marginTop:20,
    marginBottom:20,
    justifyContent:'space-around'
  },
  conditionTabTouch:{
    flex:1,
    justifyContent:'center',
    alignItems:'center',
    flexDirection:"row",
  },
  conditionTabTitle:{
    fontSize:13,
    color:'#333'
  },
  conditionTabTitleActive:{
    color:'#ff4f64'
  },
  conditionTabIcon:{
    width:10,
    height:6,
    marginLeft:5
  },
  modal:{
    position:'absolute',
    bottom:0,
    left:0,
    right:0,
    top:135,

  },
  modalbg:{
    backgroundColor:'rgba(0,0,0,.5)',
    flex:1
  },
  modalMain:{
    position:'absolute',
    top:0,
    zIndex:10,
  },
  cityMain:{
    flexDirection:'row',
    // flex:1
  },
  cityList:{
    width:commonStyle.width100/2,
    maxHeight:400,
    backgroundColor:'#f7f7f7',
    paddingBottom:10,
  },
  cityTouch:{
    justifyContent:'center'
  },
  cityName:{
    color:'#333',
    fontSize:12,
    paddingLeft:20,
    paddingTop:6,
    paddingBottom:6
  },
  cityTouchProvinceActive:{
    backgroundColor:'#fff',
    color:'#ff4f64'
  },
  cityTouchCityActive:{
    backgroundColor:'#f7f7f7',
    color:'#ff4f64'
  },
  conditionItemCon:{
    flexDirection:'row',
    flexWrap:'wrap',
  },
  itemWrap:{
    backgroundColor:'#fff',
    paddingLeft:commonStyle.pageSideWidth-8,
    paddingRight:commonStyle.pageSideWidth-8,
    width:commonStyle.width100
  },
  itemText:{
    color:'#333',
    borderStyle:'solid',
    borderWidth:1,
    borderColor:'#f1eff0',
    justifyContent:'center',
    alignItems:'center',
    fontSize:12,
    minWidth:68,
    textAlign:'center',
    marginRight:8,
    marginLeft:8,
    marginTop:6,
    marginBottom:6,
    paddingBottom:2,
    paddingTop:2,
    borderRadius:1,
    paddingLeft:3,
    paddingRight:3
  },
  switch:{
    width:65,
    flexDirection:'row',
    marginTop:10,
    marginBottom:10
  },
  switchText:{
    fontSize:12,
    color:'#333',
  },
  itemTextActive:{
    backgroundColor:'#ff4f64',
    color:'#fff',
    borderWidth:0
  },
  conditionItemTitle:{
    color:'#333',
    marginLeft:8,
    marginTop:10
  },
  recommendJob:{
    flexDirection:'row',
    alignItems:'center'
  },
  recommendJobText:{
    color:'#333',
    marginRight:10,
    marginLeft:8,
    fontSize:12,
    paddingTop:5,
    paddingBottom:5
  },
  recomendActive:{
    color:'#ff4f64'
  }
});