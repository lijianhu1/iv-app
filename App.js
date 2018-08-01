import React, {Component} from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View
} from 'react-native';
import './src/js/utils/storage'
import {AppStackNavigator} from './src/components/common/AppNavigation'

type Props = {};
export default class App extends Component<Props> {
  render() {
    return (
        <AppStackNavigator/>
    );
  }
}

