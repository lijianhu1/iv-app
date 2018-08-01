/**
 * NavigationBar
 * @flow
 */
import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {
  StyleSheet,
  Platform,
  TouchableOpacity,
  Image,
  StatusBar,
  Text,
  View
} from 'react-native'

const StatusBarShape = {
  barStyle: PropTypes.oneOf(['light-content', 'default','dark-content']),
  hidden: PropTypes.bool,
  backgroundColor: PropTypes.string,
  color:PropTypes.string
};
import {commonStyle} from '../../styles/commonStyle';
export default class NavigationBar extends Component {
  static propTypes = {
    style: View.propTypes.style,
    titleStyle: Text.propTypes.style,
    title: PropTypes.string,
    titleView: PropTypes.element,
    hide: PropTypes.bool,
    leftButtonHide: PropTypes.bool,
    statusBar: PropTypes.shape(StatusBarShape),
    rightButton:  PropTypes.element,
    // leftButtonFun: PropTypes.element,
    leftButton: PropTypes.element,
  }
  static defaultProps = {
    statusBar: {
      // translucent:true,
      barStyle: 'light-content',
      hidden: false,
      backgroundColor:'#666'
    },
  }
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      hide: false,
      leftButton:false
    };
  }

  getButtonElement(data) {
    return (
      <View style={styles.navBarButton}>
        {data? data : null}
      </View>
    );
  }
  renderButton(image){
    return <TouchableOpacity
      style={{padding: 8}}
      onPress={()=>{
        this.props.navigation.pop()
      }}>
      <Image
        style={{width: 26, height: 26,tintColor:'#666'}}
        source={image}/>
    </TouchableOpacity>;
  }
  render() {
    let statusBar = !this.props.statusBar.hidden ?
      <View style={styles.statusBar}>
          <StatusBar {...this.props.statusBar} />
      </View>: null;
    let titleView = this.props.titleView ? this.props.titleView :
      <Text style={[styles.title,this.props.titleStyle]}>{this.props.title}</Text>;

    let content = this.props.hide ? null :
      <View style={styles.navBar}>
        {/*{this.props.leftButton=='none'?this.getButtonElement():this.getButtonElement(this.renderButton(require('../../images/common/back.png'),this.props.leftButtonFun))}*/}
        {this.props.leftButtonHide?this.getButtonElement():this.getButtonElement(this.props.leftButton?this.props.leftButton:this.renderButton(require('../../images/common/back.png')))}
          <View style={styles.navBarTitleContainer}>
            {titleView}
          </View>
        {this.getButtonElement(this.props.rightButton)}
      </View>;
    return (
      <View style={[styles.container, this.props.style]}>
        {statusBar}
        {content}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: commonStyle.navContentHeight,
  },
  navBarTitleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    left: 40,
    top: 0,
    right: 40,
    bottom: 0,
  },
  title: {
    fontSize: 16,
    color: '#333',
  },
  navBarButton: {
    alignItems: 'center',
  },
  statusBar: {
    height: commonStyle.navStatusBarHeight,

  },
})
