import React, { Component } from 'react';
import {
  FlatList, Image, Platform, StyleSheet, Text, TouchableOpacity, View, Modal, TextInput,
  ImageBackground, ActivityIndicator,
} from 'react-native';
import { wp, hp, normalize } from '../helper/responsiveScreen'
import Colors from '../constants/Colors'
import { retrieveData } from '../components/AuthKeyStorageComponent';
import Api from '../config/api';
import Loading from '../components/loading';
import { lowerCase, getTotalPrice } from '../utils/helpers'
import BasketView from '../components/basketView';
import Store from '../config/store';
import MenuView from "../components/menuView"
import FullScreenLoader from "../components/fullScreenLoader"
import MenuDetailView from "../components/menuDetailView"
import FilterView from "../components/filterView"
import moment from 'moment';
import vars from '../utils/vars';

var uuid = require('react-native-uuid');
let guid = uuid.v1();
var STORAGE_KEY = 'id_token';

class SearchScreen extends Component {

  constructor(props) {
    super(props)
    this.state = {
      isModalVisible: false,
      search: '',
      page: 1,
      restaurantData: [],
      categoriesData: [],
      fottorLoading: false,
      storeType: [],
      isRestaurantLoading: false,
      filterModalVisible: false,
      filterValue: '',
      isMenuLoading: false,
      menuModelVisible: false,
      menuData: [],
      menuDetailVisible: false,
      menuDetaildata: null,
      menuDetailIndex: -1,
      menuDetailCount: 0,
      newOrderModelVisible: false,
      newStoreName: '',
      onEndReachedCalledDuringMomentum: true,
      storeOpeningHours: null
    }
  }

  componentDidMount = async () => {
    this.focusListener = this.props.navigation.addListener("focus", () => {
      this.forceUpdate()
      this.getRestaurant()
    })
    this.getCategories()
  }

  componentWillUnmount() {
    this.focusListener();
  }

  getCategories() {
    retrieveData(STORAGE_KEY)
      .then((data) => {
        const config = {
          headers: { Authorization: 'Bearer ' + data, 'Request-Id': guid }
        };
        Api.get('/v1/StoreType/GetAllStoreTypes', config).then(res => {
          console.log('GetAllStoreTypes res', res);
          this.setState({ categoriesData: res })
        }).catch(err => {
          console.log("Error ", err);
        });
      }).catch(err => {
        console.log("Error ", err);
      });
  }

  getRestaurant() {
    const { page, search, storeType, filterValue } = this.state
    if (page == 1) {
      this.setState({ isRestaurantLoading: true, fottorLoading: false })
    }

    retrieveData(STORAGE_KEY)
      .then((data) => {
        const config = {
          headers: { Authorization: 'Bearer ' + data, 'Request-Id': guid }
        };

        const value = 'searchQuery=' + search + '&filters=' + filterValue +
          '&storetypes=' + storeType + '&latitude=' + Store.deliverAddress.lat + '&longitude=' + Store.deliverAddress.lng +
          '&page=' + page + '&pagesize=' + 20

        console.log('value', value)

        Api.get('/V1/Store/Stores-Search?' + value, config).then(res => {
          console.log('restaurant res', JSON.stringify(res));
          if (res.length != 0) {
            this.setState({
              restaurantData: [...this.state.restaurantData, ...res],
              isRestaurantLoading: false
            })
          } else {
            this.setState({ onEndReachedCalledDuringMomentum: true, fottorLoading: false, isRestaurantLoading: false })
          }
        }).catch(err => {
          this.setState({ isRestaurantLoading: false })
          console.log("Error ", err);
        });
      }).catch(err => {
        this.setState({ isRestaurantLoading: false })
      });
  }

  getMenu(storeId) {
    this.setState({ isMenuLoading: true })
    retrieveData(STORAGE_KEY)
      .then((data) => {
        const config = {
          headers: { Authorization: 'Bearer ' + data, 'Request-Id': guid }
        };

        console.log('config', config)
        Api.get('V1/Store/Store-Details?storeId=' + storeId, config).then(res => {
          console.log('Store details res', JSON.stringify(res));
          this.setState({ isMenuLoading: false, menuModelVisible: true, menuData: res })
        }).catch(err => {
          console.log("Error ", err);
          this.setState({ isMenuLoading: false })
        });
      }).catch(err => {
        this.setState({ isMenuLoading: false })
      });
  }

  onDonePressHandler() {
    this.setState({ filterModalVisible: false })
    this.setState({ restaurantData: [], page: 1 },
      () => { this.getRestaurant() })
  }

  renderRestaurant = (item, index) => {
    let isClosed;
    if (item.item.storeOpeningHours.find(x => x.dayOfWeek == moment().isoWeekday()).open == "00:00") {
      isClosed = true
    } else {
      isClosed = false
    }

    return (
      <TouchableOpacity
        style={{ ...styles.searchContainer, marginBottom: hp(1), marginTop: hp(0.5), marginLeft: 1 }}
        onPress={() => {
          isClosed ? null :
            this.getMenu(item.item.storeId)
          this.setState({ storeOpeningHours: item.item.storeOpeningHours })

        }}>
        <ImageBackground
          source={{ uri: item.item.imageUri }}
          resizeMode='cover'
          imageStyle={{ borderRadius: wp(2) }}
          style={styles.restaurantImage} >
          {isClosed &&
            <View style={styles.restaurantImageView}>
              <Text style={{ ...styles.restaurantTitle, color: Colors.white }}>{'Closed'}</Text>
            </View>
          }
        </ImageBackground>
        <Text style={{ ...styles.restaurantTitle, marginTop: hp(1.5) }}>{item.item.storeName}</Text>
        {item.item.storeType != null &&
          <Text style={{ ...styles.restaurantSubTitle, color: Colors.gray }}>{item.item.storeType}</Text>
        }
        <Text style={{ ...styles.restaurantSubTitle, color: Colors.gray }}>{` ${item.item.distance.toFixed(2)} miles away`}</Text>
      </TouchableOpacity>
    )
  }

  onCategoryPress = (item) => {
    let exist = this.state.storeType.includes(item)
    if (!exist) {
      this.state.storeType.push(item);
      this.forceUpdate();
    }
    else {
      var removeIndex = this.state.storeType.indexOf(item)
      this.state.storeType.splice(removeIndex, 1);
      this.forceUpdate();
    }
  }

  onMenuPress = (value) => {

    if (Store.cart.length != 0) {
      let existData = Store.cart.find(x => x.storeId === value.storeId);
      if (existData) {
        Store.addToCart(value)
        Store.cart.map((item, i) => {
          if (value.id == item.id) {
            this.setState({
              menuModelVisible: false,
              menuDetailVisible: true,
              menuDetaildata: item,
              menuDetailIndex: i,
              menuDetailCount: item.count
            })
          }
        })
      } else {
        if (Store.restaurantData) {
          this.setState({ newOrderModelVisible: true, newStoreName: Store.restaurantData.storeType })
        }
      }
    } else {
      Store.addToCart(value)
      Store.cart.map((item, i) => {
        if (value.id == item.id) {
          this.setState({
            menuModelVisible: false,
            menuDetailVisible: true,
            menuDetaildata: item,
            menuDetailIndex: i,
            menuDetailCount: item.count
          })
        }
      })
    }
  }

  onMenuDetailCancelPress = () => {
    let existData = Store.addBasket.find(x => x.id === this.state.menuDetaildata.id);
    if (!existData) {
      Store.removeFromCart(this.state.menuDetailIndex)
    }
    this.setState({ menuModelVisible: true, menuDetailVisible: false })
  }

  onUpdateCountPress = (value) => {
    Store.updateCardItem(this.state.menuDetailIndex, value)
    Store.cart.map((item, i) => {
      if (this.state.menuDetaildata.id == item.id) {
        this.setState({ menuDetailCount: item.count })
      }
    })
  }

  onAddBasketPress = (menuDetaildata) => {
    let restaurantData = this.state.restaurantData.find(x => x.storeId === menuDetaildata.storeId)
    this.setState({ menuModelVisible: true, menuDetailVisible: false })
    Store.addBasket.push(menuDetaildata)
    Store.restaurantData = restaurantData
  }

  onConfirmPress = () => {
    this.setState({ newOrderModelVisible: false })
    Store.setCart([]);
    Store.resetCartCount();
  }

  basketRefresh = () => {
    this.forceUpdate()
  }

  onBasketViewPress = () => {
    this.setState({ menuModelVisible: false })
    // this.props.navigation.navigate('Cart')
    this.props.navigation.navigate('Cart', { onGoBack: () => this.basketRefresh() });
  }

  render() {
    const { search, categoriesData, restaurantData, onEndReachedCalledDuringMomentum, fottorLoading,
      isRestaurantLoading, filterModalVisible, filterValue, isMenuLoading, menuModelVisible, menuData,
      menuDetaildata, menuDetailVisible, menuDetailCount, newOrderModelVisible, newStoreName,
      page, storeType, storeOpeningHours } = this.state

    return (
      <View style={styles.container}>

        <View style={{ ...styles.searchContainer, flexDirection: 'row', marginTop: hp(3), marginLeft: wp(5) }}>
          <Image source={require('../assets/images/search.png')} style={styles.searchIcon} />
          <TextInput
            value={search}
            style={styles.searchInput}
            onChangeText={text => this.setState({ search: text })}
            autoCorrect={false}
            onSubmitEditing={() =>
              this.setState({ restaurantData: [], page: 1 },
                () => { this.getRestaurant() })} />
          <TouchableOpacity onPress={() => this.setState({ filterModalVisible: true })} >
            <Image source={require('../assets/images/filter.png')} style={styles.filter} />
          </TouchableOpacity>
        </View>

        <Text style={{ ...styles.headerTitle, marginLeft: wp(5) }}>Nearby Restaurants</Text>

        <FlatList
          showsVerticalScrollIndicator={false}
          data={restaurantData}
          renderItem={(item, index) => this.renderRestaurant(item, index)}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={{ paddingLeft: wp(5), }}

          ListFooterComponent={
            fottorLoading &&
            <View style={{ padding: wp(5) }}>
              <ActivityIndicator
                size={"large"}
                color={Colors.light_text_color}
                animating={true}
              />
            </View>
          }

          ListEmptyComponent={
            isRestaurantLoading ? <Loading /> :
              <Text style={styles.txtNoResult}>{'No results found'}</Text>
          }
          onMomentumScrollBegin={() => this.setState({ onEndReachedCalledDuringMomentum: false })}
          onEndReached={() => {
            if (!onEndReachedCalledDuringMomentum) {
              console.log("response onEndReached")
              this.setState({ page: page + 1, fottorLoading: true, onEndReachedCalledDuringMomentum: false }, () => {
                this.getRestaurant();
              })
            }
          }}
          onEndReachedThreshold={0.1}
        />

        {Store.cart.length != 0 &&
          <BasketView
            onPress={() => this.onBasketViewPress()}
            style={{ marginBottom: hp(2) }}
            count={Store.cart.length}
            amount={`${Store?.remoteConfig?.currency} ${(getTotalPrice() / 100).toFixed(2)}`} />
        }

        <FilterView
          filterModalVisible={filterModalVisible}
          onFilterCancelPress={() => this.setState({ filterModalVisible: false })}
          onClearPress={() => this.setState({ filterValue: '', storeType: [] })}
          filterValue={filterValue}
          onRadioBtnPress={(value) => this.setState({ filterValue: value })}
          categoriesData={categoriesData}
          storeType={storeType}
          onCategoryPress={(value) => this.onCategoryPress(value)}
          onDonePressHandler={() => this.onDonePressHandler()} />

        <FullScreenLoader
          loading={isMenuLoading} />

        <MenuView
          menuModelVisible={menuModelVisible}
          onCancelPress={() => this.setState({ menuModelVisible: false })}
          menuData={menuData}
          storeOpeningHours={storeOpeningHours}
          onMenuPress={(item) => this.onMenuPress(item)}
          onBasketViewPress={() => this.onBasketViewPress()}
          getTotalPrice={getTotalPrice()}
          newOrderModelVisible={newOrderModelVisible}
          newStoreName={newStoreName}
          newOrderCancel={() => this.setState({ newOrderModelVisible: false })}
          onConfirmPress={() => this.onConfirmPress()}
        />

        {menuDetaildata != null &&
          <MenuDetailView
            menuDetailVisible={menuDetailVisible}
            onMenuDetailCancelPress={() => this.onMenuDetailCancelPress()}
            menuDetaildata={menuDetaildata}
            menuDetailCount={menuDetailCount}
            onUpdateCountPress={(value) => this.onUpdateCountPress(value)}
            onAddBasketPress={(data) => this.onAddBasketPress(data)}
          />

        }

      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    paddingTop: Platform.OS == 'ios' ? hp(4) : hp(0),
  },
  searchContainer: {
    backgroundColor: Colors.white,
    borderRadius: wp(2),
    padding: wp(2.5),
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.22,
    shadowRadius: wp(1),
    elevation: 2,
    width: wp(90)
  },
  searchIcon: {
    width: wp(6),
    height: wp(6),
    alignSelf: 'center',
    marginRight: wp(0.5),
  },
  searchInput: {
    width: wp(68),
    fontSize: normalize(18),
    color: Colors.black,
    alignItems: 'center',
    fontFamily: 'Roboto-Regular',
    marginHorizontal: wp(1),
    padding: 0
  },
  filter: {
    width: wp(6),
    height: wp(6),
    marginLeft: wp(1.5),
    alignSelf: 'center'
  },
  headerTitle: {
    fontSize: normalize(17),
    fontFamily: 'Roboto-Regular',
    color: Colors.black,
    alignItems: 'center',
    marginVertical: hp(2),
  },
  restaurantImage: {
    width: '100%',
    height: Platform.OS == 'ios' ? hp(24) : hp(28),
    borderRadius: wp(2)
  },
  restaurantTitle: {
    fontSize: normalize(18),
    fontFamily: 'Roboto-Regular',
    color: Colors.black,
    fontWeight: '400',
    alignItems: 'center',
  },
  restaurantSubTitle: {
    fontSize: normalize(15),
    fontFamily: 'Roboto-Regular',
    fontWeight: '400',
    alignItems: 'center',
    marginTop: hp(0.5)
  },
  txtNoResult: {
    marginTop: hp(1),
    fontFamily: 'Roboto-Regular',
    fontSize: normalize(18),
    alignSelf: 'center',
    color: '#777777',
  },
  restaurantImageView: {
    width: '100%',
    height: '100%',
    borderRadius: wp(2),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#00000080',
  }
});

export default SearchScreen;