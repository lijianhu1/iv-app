import React, {Component} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  ActivityIndicator
} from 'react-native';
import NavigationBar from '../components/common/NavigationBar';
import {commonStyle} from '../styles/commonStyle';
import ajaxPosition from '../js/service/ajaxPosition'
import tool from '../js/utils/Tool'
import PositionListComponent from '../components/common/PositionListComponent'
export default class Position extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchResult: [],
      isLoading: false,
      isMoreLoad: false,
      updataEnd: false,
      searchCondition: {
        page: 1,
        pageSize: 20,
        recommendJob:2
      },
      getTime: new Date().getTime()
    };
  }

  componentDidMount() {
    this.refs.childPositionList.handleSearch(this.state.searchCondition)
  }
  _header() {
    return <View>
      <Image source={require('../images/position/positionIndex-banner.png')} style={styles.banner}/>
    </View>
  }
  render() {
    return (
      <View style={{flex: 1, backgroundColor: '#fff'}}>
        <NavigationBar
          title='星球职位'
          navigation={this.props.navigation}
        />
        <View style={styles.positionWrap}>
          <View style={styles.positionListBox}>
            <PositionListComponent ref="childPositionList" refresh={true} header={this._header.bind(this)} searchCondition={this.state.searchCondition} />
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  banner: {
    width: commonStyle.width100,
    height: 120
  },
  searchBox: {
    backgroundColor: commonStyle.bgGrayColor,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    marginTop: 10,
    marginBottom: 10,
    flexDirection: 'row'
  },
  searchText: {
    color: '#c1c1c1'
  },
  searchIcon: {
    width: 16,
    height: 16,
    marginRight: 5
  },


});