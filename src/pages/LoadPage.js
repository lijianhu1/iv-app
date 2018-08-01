import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

export default class LoadPage extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text>首屏加载</Text>
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
    width: 240,
    height: 45,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4398ff',
  },
  headerStyle: {
    backgroundColor: '#4398ff',
  },
  headerTitleStyle: {
    //标题的文字颜色
    color: 'white',
    //设置标题的大小
    fontSize: 18,
    //居中显示
    alignSelf: 'center',
  },
});