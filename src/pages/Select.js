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
  ScrollView
} from 'react-native';
import {commonStyle} from '../styles/commonStyle';
import NavigationBar from '../components/common/NavigationBar'
import ajaxUser from '../js/service/ajaxUser';
import info from '../js/utils/Info';
import tool from '../js/utils/Tool';
import ajaxPosition from '../js/service/ajaxPosition';
import Toast, {DURATION} from 'react-native-easy-toast';
const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T',
  'U', 'V', 'W', 'X', 'Y', 'Z'];
export default class CityList extends Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }

  componentDidMount() {
  }
  _keyExtractor = (item, index) => index.toString();
  render() {
    return (
    <View style={commonStyle.container}>
      <NavigationBar
        title="期望职位"
        navigation={this.props.navigation}
      />
      <View style={styles.topBar}>
        <View style={styles.topBarCity}>
          <Text style={styles.topBarText}>深圳</Text>
          <Image source={require('../images/position/arrow.png')} resizeMode={Image.resizeMode.contain} style={styles.topBarCityIcon} />
        </View>
        <TouchableOpacity onPress={()=>{this.props.navigation.navigate('Search')}} activeOpacity={1} style={[styles.topBarSearch,commonStyle.border(1,'#eaeaea')]}>
          <Image source={require('../images/common/search.png')} resizeMode={Image.resizeMode.contain} style={[commonStyle.iconDefault,{marginRight:5}]} />
          <Text  style={styles.searchMsg}>搜索公司/职位</Text>
        </TouchableOpacity>
      </View>
    </View>
    );
  }
}
const styles = StyleSheet.create({
  topBar:{
    flexDirection:'row',
    backgroundColor:'#f7f7f7',
    paddingLeft:commonStyle.pageSideWidth,
    paddingRight:commonStyle.pageSideWidth,
    alignItems:'center',
    paddingTop:10,
    paddingBottom:10,
  },
  topBarCity:{
    flexDirection:'row',
    alignItems:'center',
    marginRight:5
  },
  topBarText:{
    color:'#333'
  },
  topBarCityIcon:{
    width:10,
    marginLeft:5
  },
  topBarSearch:{
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'center',
    flex:1,
    backgroundColor:'#fff',
    borderRadius:20,
    padding:5,
    paddingLeft:10,
    marginLeft:5
  },
  searchMsg:{

  }
});