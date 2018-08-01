/** 公共样式表 **/

import {Platform} from 'react-native'
export const commonStyle = {

  /** color **/
  // 常用颜色
  red: '#FF0000',
  orange: '#FFA500',
  yellow: '#FFFF00',
  green: '#00FF00',
  cyan: '#00FFFF',
  blue: '#0000FF',
  purple: '#800080',
  black: '#000',
  white: '#FFF',
  gray: '#808080',
  drakGray: '#A9A9A9',
  lightGray: '#D3D3D3',
  tomato: '#FF6347',
  PeachPuff: '#FFDAB9',
  clear: 'transparent',

  /** 主题色 **/
  themeColor: '#ff4f64',
  // 默认灰色字体颜色
  textGrayColor: '#989898',
  // 默认黑色字体颜色
  textBlockColor: '#333',
  // 默认背景颜色
  bgGrayColor: '#f4f4f4',
  // 默认分割线颜色
  lineColor: '#E6E6E6',
  // 默认placeholder颜色
  placeholderColor: '#c1c1c1',
  // borderColor
  borderColor: '#808080',
  // 导航title 颜色
  navTitleColor: '#262626',
  // 导航左item title color
  navLeftTitleColor: '#333',
  // 导航右item title color
  navRightTitleColor: '#333',
  navThemeColor: '#FEFEFE',
  iconGray: '#989898',
  iconBlack: '#262626',
  width100: require('Dimensions').get('window').width,
  height100: require('Dimensions').get('window').height,

  /** space **/
  // 上边距
  marginTop: 10,
  // 左边距
  marginLeft: 10,
  // 下边距
  marginBotton: 10,
  // 右边距
  marginRight: 10,
  // 内边距
  padding: 10,
  // 导航的leftItem的左间距
  navMarginLeft: 15,
  // 导航的rightItem的右间距
  navMarginRight: 15,

  /** width **/
  // 导航栏左右按钮image宽度
  navImageWidth: 25,
  // 边框线宽度
  borderWidth: 1,
  // 分割线高度
  lineWidth: 0.8,

  /** height **/
  // 导航栏的高度
  navHeight: Platform.OS === 'ios' ? 64 : 56,
  // 导航栏顶部的状态栏高度
  navStatusBarHeight: Platform.OS === 'ios' ? 20 : 0,
  // 导航栏除掉状态栏的高度
  navContentHeight: Platform.OS === 'ios' ? 44 : 56,
  // tabBar的高度
  tabBar: 49,
  // 底部按钮高度
  bottonBtnHeight: 44,
  // 通用列表cell高度
  cellHeight: 44,
  // 导航栏左右按钮image高度
  navImageHeight: 25,

  /** font **/
  // 默认文字字体
  textFont: 14,
  // 默认按钮文字字体
  btnFont: 15,
  // 导航title字体
  navTitleFont: 17,
  // tabBar文字字体
  barBarTitleFont: 12,
  // 占位符的默认字体大小
  placeholderFont: 13,
  // 导航左按钮的字体
  navRightTitleFont: 15,
  // 导航右按钮字体
  navLeftTitleFont: 15,

  /** opacity **/
  // mask
  modalOpacity: 0.3,
  // touchableOpacity
  taOpacity: 0.1,

  /** 定位 **/
  absolute: 'absolute',

  /** flex **/
  around: 'space-around',
  between: 'space-between',
  center: 'center',
  row: 'row',

  //背景颜色
  backgroundColor: '#f7f9f8',

  //页面边宽
  pageSideWidth: 20,


  container: {
    flex: 1,
    // justifyContent: 'center',
    backgroundColor: '#f7f9f8'

  },
  flexDirectionRow: {flexDirection: "row"},
  flexCenter: {
    justifyContent: "center",
    alignItems: "center"
  },
  flexRowSb: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  flexWrapWrap: {
    flexWrap: 'wrap'
  },
  containerWrap: {
    paddingLeft: 20,
    paddingRight: 20,
    backgroundColor: '#fff'
  },
  // 无匹配数据
  nothingImg: {
    width: 120,
    height: 150
  },
  nothingText: {
    fontSize: 10,
    marginTop: 10,
    color: '#9a9a9a'
  },
  page: {
    backgroundColor: '#f7f9f8',
    flex: 1
  },
  padding(){
    if(arguments.length==1){
      return {
        paddingTop:arguments[0],
        paddingBottom:arguments[0],
        paddingLeft:arguments[0],
        paddingRight:arguments[0],
      }
    }else if(arguments.length==2){
      return {
        paddingTop:arguments[0],
        paddingBottom:arguments[0],
        paddingLeft:arguments[1],
        paddingRight:arguments[1],
      }
    }else if(arguments.length==3){
      return {
        paddingTop:arguments[0],
        paddingBottom:arguments[2],
        paddingLeft:arguments[1],
        paddingRight:arguments[1],
      }
    }else if(arguments.length==4){
      return {
        paddingTop:arguments[0],
        paddingRight:arguments[1],
        paddingBottom:arguments[2],
        paddingLeft:arguments[3],
      }
    }
  },
  margin(){
    if(arguments.length==1){
      return {
        marginTop:arguments[0],
        marginBottom:arguments[0],
        marginLeft:arguments[0],
        marginRight:arguments[0],
      }
    }else if(arguments.length==2){
      return {
        marginTop:arguments[0],
        marginBottom:arguments[0],
        marginLeft:arguments[1],
        marginRight:arguments[1],
      }
    }else if(arguments.length==3){
      return {
        marginTop:arguments[0],
        marginBottom:arguments[2],
        marginLeft:arguments[1],
        marginRight:arguments[1],
      }
    }else if(arguments.length==4){
      return {
        marginTop:arguments[0],
        marginRight:arguments[1],
        marginBottom:arguments[2],
        marginLeft:arguments[3],
      }
    }
  },
  border(){
    if(typeof arguments[0]=='number'){
      return {
        borderWidth:1,
        borderColor:arguments[1],
        borderStyle:'solid'
      }
    }else {
      let bw = 'border'+arguments[0]+'Width';
      let bc = 'border'+arguments[0]+'Color';
      return{
        [bw]:arguments[1],
        [bc]:arguments[2],
        borderStyle:'solid'
      }
    }
  },
  iconDefault:{
    width:16,
    height:16
  },
  fontsizeColor(size,color){
    return {
      fontSize:size,
      color:color?color:'#333'
    }
  }
};
