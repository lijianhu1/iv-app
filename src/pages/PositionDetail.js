import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import NavigationBar from '../components/common/NavigationBar';
export default class User extends Component {
  constructor(props){
    super(props)
  }
  // static navigationOptions = {
  //   headerTitle: 'List实现多选',
  //   headerTitleStyle: {
  //     color: '#f00'
  //   },
  //   headerStyle: {
  //     backgroundColor: '#ff0' //
  //   },
  // }
  renderButton(image){
    return <TouchableOpacity
      style={{padding: 8}}
      onPress={()=>{
        console.log('回退按钮')
      }}>
      <Image
        style={{width: 26, height: 26,tintColor:'yellow'}}
        source={image}/>
    </TouchableOpacity>;
  }

  render() {
    return (
      <View >
        <NavigationBar
          title='职位详情'
          navigation={this.props.navigation}
          leftButton={this.renderButton(require('../images/common/back.png'))}
        />
        <TouchableOpacity style={styles.button} activeOpacity={0.5} >
          <Text style={{color: 'white'}}>详情</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  button: {
    width: 120,
    height: 45,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4398ff',
  }
});