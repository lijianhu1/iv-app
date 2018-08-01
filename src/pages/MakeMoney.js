import React, {Component, PropTypes} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import {commonStyle} from '../styles/commonStyle';
import NavigationBar from '../components/common/NavigationBar'


export default class Index extends Component {
  constructor(props) {
    super(props);
    this.state={
      resumeComplete:false, //星球身份验证
      bindType:false  //公众号bind
    }
  }

  itemRender(status,text){
    return status?<View style={styles.itemDesc}>
      <Image style={styles.descIcon} source={require('../images/common/correct-ico.png')}/>
      <Text style={styles.itemTextDesc}>{text}</Text>
    </View>:<View style={styles.itemDesc}>
      <Text style={styles.itemTextDesc}>{text}</Text>
    </View>
  }
  render() {

    return (
      <View style={commonStyle.container}>
        <NavigationBar
          title='任务'
          leftButtonHide = {true}
        />
        <View style={styles.topBox}>
          <Image source={require('../images/makeMoney/makeMoney-banner.png')} style={styles.topBoxImg}/>
        </View>

        <View style={styles.mainBox}>
          <View style={[styles.mainBoxTitle,styles.mainItemBorderBottem]}>
            <Text >基础任务</Text>
          </View>
          <View style={styles.mainBoxList}>
            <TouchableOpacity style={[styles.mainItemStyle, styles.mainItemBorderRight]} activeOpacity={1}>
              <Image source={require('../images/makeMoney/invitation-ico.png')}
                     style={styles.iconWidth} resizeMode={Image.resizeMode.contain}/>
              <Text style={styles.itemText}>
                邀请好友
              </Text>
              <View><Text style={styles.itemTextDesc}>奖励2元</Text></View>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.mainItemStyle, styles.mainItemBorderRight]} activeOpacity={1}
                              onPress={() => {
                                this.props.navigation.navigate('MakeMoney')
                              }}>
              <Image source={require('../images/index/resume-ico.png')}
                     style={styles.iconWidth} resizeMode={Image.resizeMode.contain}/>
              <Text style={styles.itemText}>
                星球身份验证
              </Text>
              {this.itemRender(this.state.resumeComplete,this.state.resumeComplete?'已完成':'70%以上奖励1元')}
            </TouchableOpacity>
            <TouchableOpacity style={[styles.mainItemStyle]} activeOpacity={1}>
              <Image source={require('../images/makeMoney/wxFollow-ico.png')}
                     style={styles.iconWidth} resizeMode={Image.resizeMode.contain}/>
              <Text style={styles.itemText}>
                绑定微信公众号
              </Text>
              {this.itemRender(this.state.bindType,this.state.bindType?'已完成':'奖励1元')}
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.mainBox}>
          <View style={[styles.mainBoxTitle,styles.mainItemBorderBottem]}>
            <Text >独家任务</Text>
          </View>
          <View style={styles.mainBoxList}>
            <TouchableOpacity style={[styles.mainItemStyle, styles.mainItemBorderRight]} activeOpacity={1}>
              <Image source={require('../images/makeMoney/default-ico.png')}
                     style={styles.iconWidth} resizeMode={Image.resizeMode.contain}/>
              <Text style={styles.itemTextDesc}>
                敬请期待
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.mainItemStyle, styles.mainItemBorderRight]} activeOpacity={1}>
              <Image source={require('../images/makeMoney/default-ico.png')}
                     style={styles.iconWidth} resizeMode={Image.resizeMode.contain}/>
              <Text style={styles.itemTextDesc}>
                敬请期待
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.mainItemStyle, styles.mainItemBorderRight]} activeOpacity={1}>
              <Image source={require('../images/makeMoney/default-ico.png')}
                     style={styles.iconWidth} resizeMode={Image.resizeMode.contain}/>
              <Text style={styles.itemTextDesc}>
                敬请期待
              </Text>
            </TouchableOpacity>
          </View>
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
  mainBox: {
    backgroundColor: '#fff',
    marginTop: 15
  },
  mainBoxTitle:{
    paddingLeft:20,
    paddingTop:10,
    paddingBottom:10
  },
  mainBoxList:{
    flexWrap: 'wrap',
    flexDirection: 'row',
  },
  mainItemStyle: {
    width: width / 3-1,
    height: width / 3,
    justifyContent: 'center',
    alignItems: 'center'
  },
  mainItemBorderBottem: {
    borderBottomWidth: 1,
    borderBottomColor: '#e8e9eb',
    borderStyle: 'solid',
  },
  mainItemBorderRight: {
    borderRightWidth: 1,
    borderRightColor: '#e8e9eb',
    borderStyle: 'solid',
  },
  itemText:{
    color:'#333',
    marginTop:10,
    fontSize:14
  },
  itemTextDesc:{
    color:'#999',
    fontSize:12,
    marginTop:5
  },
  descIcon:{
    width:12,
    height:12,
    marginTop:5,
    marginRight:5
  },
  itemDesc:{
    flexDirection:'row',
    justifyContent:'center',
    alignItems:'center'
  }
});