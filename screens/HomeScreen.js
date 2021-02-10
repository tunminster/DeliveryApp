import React, { Component } from 'react';
import {
  FlatList, Image, Platform, StyleSheet, Text, TouchableOpacity, View, Modal, TextInput,
  ImageBackground, ActivityIndicator, UIManager, LayoutAnimation, TouchableWithoutFeedback, Alert
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { wp, hp, normalize } from '../helper/responsiveScreen'
import Colors from '../constants/Colors'
import Header from '../components/header'
import Geolocation from '@react-native-community/geolocation'
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
import AuthStore from '../config/store/auth';
import CheckBoxView from '../components/checkBoxView';
import { GetLocationComponent } from '../components/GetLocationComponent'
import { retrieveData } from '../components/AuthKeyStorageComponent';
import Api from '../config/api';
import Loading from '../components/loading';
import Button from '../components/button';
import { titleCase, getTotalPrice } from '../utils/helpers'
import BasketView from '../components/basketView';
import Store from '../config/store';
import vars from "../utils/vars";

var uuid = require('react-native-uuid');
let guid = uuid.v1();
var STORAGE_KEY = 'id_token';

class HomeScreen extends Component {

  constructor(props) {
    super(props)
    this.state = {
      headerTitle: '',
      latitude: '',
      longitude: '',
      isModalVisible: false,
      addressesId: 0,
      curLatitude: '',
      curLongitude: '',
      search: '',
      categoriesData: [],
      page: 1,
      restaurantData: [],
      fottorLoading: false,
      isSearching: false,
      storeType: [],
      isLoading: true,
      isRestaurantLoading: false,
      filterModalVisible: false,
      filterValue: '',
      isMenuLoading: false,
      menuModelVisible: false,
      menuData: [],
      expandeIndex: -1,
      isCategoryLoading: false,
      menuDetailVisible: false,
      menuDetaildata: null,
      menuDetailIndex: -1,
      menuDetailCount: 0,
      newOrderModelVisible: false,
      newStoreName: '',
    }
    if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental(true); // USed for collaps animation
    }
  }

  componentDidMount = async () => {
    this.focusListener = this.props.navigation.addListener("focus", () => {
      this.forceUpdate()
    })
    this.getCategories()

      if (Platform.OS === 'android') {
        RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({ interval: 10000, fastInterval: 5000 })
          .then(data => {
            if (this.state.latitude === '') {
              this.callLocation()
            }

          }).catch(err => {
            console.log("Error " + err.message + ", Code : " + err.code);
            this.gpsDialog()
          });
      } else {
        if (this.state.latitude == '') {
          this.callLocation()
        }
      }
  }

  componentWillUnmount() {
    this.focusListener();
  }

  getCategories() {
    this.setState({ isCategoryLoading: true })
    retrieveData(STORAGE_KEY)
      .then((data) => {
        const config = {
          headers: { Authorization: 'Bearer ' + data, 'Request-Id': guid }
        };

        console.log('config', config)
        Api.get('/v1/StoreType/GetAllStoreTypes', config).then(res => {
          console.log('GetAllStoreTypes res', res);
          this.setState({ categoriesData: res, isCategoryLoading: false })
        }).catch(err => {
          this.setState({ isCategoryLoading: false })
          console.log("Error ", err);
        });
      }).catch(err => {
        this.setState({ isCategoryLoading: false })
      });
  }

  getRestaurant() {
    const { latitude, longitude, page, search, storeType, filterValue } = this.state
    console.log('location', latitude, longitude)
    if (page == 1) {
      this.setState({ isRestaurantLoading: true })
    }

    retrieveData(STORAGE_KEY)
      .then((data) => {
        const config = {
          headers: { Authorization: 'Bearer ' + data, 'Request-Id': guid }
        };

        const value = 'searchQuery=' + search + '&filters=' + filterValue +
          '&storetypes=' + storeType + '&latitude=' + latitude + '&longitude=' + longitude +
          '&page=' + page + '&pagesize=' + 20

        console.log('value', value)

        Api.get('/V1/Store/Stores-Search?' + value, config).then(res => {
          console.log('restaurant res', res);
          if (res.length != 0) {
            this.setState({
              restaurantData: [...this.state.restaurantData, ...res],
              isSearching: true,
              isRestaurantLoading: false
            })
          } else {
            this.setState({ isSearching: false, fottorLoading: false, isRestaurantLoading: false })
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

  gpsDialog = () => {
    if (Platform.OS === 'android') {
      RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({ interval: 10000, fastInterval: 5000 })
        .then(data => {
          console.log('data...', data)
        }).catch(err => {
          console.log("Error " + err.message + ", Code : " + err.code);
          this.gpsDialog()
        });
    }
  }

  callLocation() {
    console.log('callLocation Called')

    Geolocation.getCurrentPosition(
      //Will give you the current location
      position => {
        console.log(
          'Location....',
          position.coords.latitude + ' ' + position.coords.longitude,
        )
        const region = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          latitudeDelta: 0.001,
          longitudeDelta: 0.001,
        }
        this.setState({
          latitude: region.latitude,
          longitude: region.longitude,
          curLatitude: region.latitude,
          curLongitude: region.longitude
        }, () => {
          this.fetchAddress()
        })
      },
      error => {
        console.log('Error...', JSON.stringify(error))
        this.setState({ isLoading: false })
      },
      { enableHighAccuracy: false, timeout: 30000, maximumAge: 5000 },
    )

  }

  fetchAddress = () => {
    GetLocationComponent(null, this.state.latitude, this.state.longitude)
      .then((responseJson) => {
        console.log('userLocation', responseJson)
        const userLocation = responseJson.results[0]
        console.log('userLocation', userLocation.formatted_address)
        this.setState({ headerTitle: userLocation.formatted_address, restaurantData: [], page: 1, isLoading: false },
          () => { this.getRestaurant() })
        this.forceUpdate()
      }).catch((error) => {
        console.log('error', error)
        this.setState({ isLoading: false })
      });
  }

  refresh() {
    this.setState({ isModalVisible: true });
    setTimeout(() => {
      this.forceUpdate()
      this.setState({ isModalVisible: true });
      console.log('refresh...', 1)
    }, 1000)
  }

  onDonePressHandler() {
    this.setState({ filterModalVisible: false })
    this.setState({ restaurantData: [], page: 1 },
      () => { this.getRestaurant() })
  }

  renderCategories = (item, index) => {
    return (
      <TouchableOpacity onPress={() => this.setState({ storeType: titleCase(item.item.storeTypeName), restaurantData: [], page: 1 }
        , () => { this.getRestaurant() })}>
        <ImageBackground
          source={{ uri: item.item.imageUri }}
          resizeMode='cover'
          imageStyle={{ borderRadius: wp(2) }}
          style={styles.categoriesImage} >
          <Text style={styles.categoriesTitle}>{item.item.storeTypeName}</Text>
        </ImageBackground>
      </TouchableOpacity>
    )
  }

  renderRestaurant = (item, index) => {
    const address = item.item.addressLine1
    return (
      <TouchableOpacity
        style={{ ...styles.searchContainer, marginBottom: hp(1), marginTop: hp(0.5), marginLeft: 1 }}
        onPress={() => this.getMenu(item.item.storeId)}>
        <Image
          source={{ uri: item.item.imageUri }}
          resizeMode='cover'
          style={styles.restaurantImage} />
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

  toggleExpand = (index) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    if (this.state.expandeIndex == index) {
      this.setState({ expandeIndex: -1 })
    } else {
      this.setState({ expandeIndex: index })
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
    const { headerTitle, isModalVisible, addressesId, curLatitude, curLongitude, search, categoriesData,
      restaurantData, isSearching, fottorLoading, isLoading, isRestaurantLoading, filterModalVisible,
      filterValue, isMenuLoading, menuModelVisible, menuData, expandeIndex, isCategoryLoading,
      menuDetaildata, menuDetailVisible, menuDetailCount, newOrderModelVisible, newStoreName } = this.state
    return (
      <View style={styles.container}>
        {isLoading ? <Loading /> :
          <View style={{ flex: 1 }}>

            <TouchableOpacity onPress={() => this.setState({ isModalVisible: true })} >
              <Header
                title={headerTitle} />
            </TouchableOpacity>

            <Modal
              transparent={true}
              animationType={'none'}
              visible={isModalVisible}
            >
              <View style={styles.modelContainer}>
                <View style={styles.modelChildContainer}>
                  <View style={styles.modelHeaderView}>
                    <TouchableOpacity onPress={() => this.setState({ isModalVisible: false })} style={{ alignSelf: 'center' }} >
                      <Image source={require('../assets/images/close-icon.png')} style={{
                        ...styles.modelIcon,
                        tintColor: Colors.black
                      }} />
                    </TouchableOpacity>
                    <Text style={styles.modelHeaderTitle}>Select Location</Text>
                  </View>
                  <View style={styles.modelSeperateLine} />

                  <TouchableOpacity style={styles.modelHeaderView} onPress={() => {
                    this.setState({ isModalVisible: false }),
                      this.props.navigation.navigate('CreateAddress', {
                        onGoBack: () => this.refresh(),
                        curLatitude: curLatitude,
                        curLongitude: curLongitude
                      })
                  }}>
                    <Image source={require('../assets/images/add.png')} style={styles.modelAddIcon} />
                    <Text style={styles.modelHeaderTitle}>New Adddress</Text>
                  </TouchableOpacity>

                  <View style={styles.modelSeperateLine} />

                  <CheckBoxView
                    active={addressesId === 0}
                    image={require('../assets/images/navigation.png')}
                    title={'Current Location'}
                    onPress={() =>
                      this.setState({
                        latitude: curLatitude,
                        longitude: curLongitude,
                        isModalVisible: false,
                        addressesId: 0
                      }, () => {
                        this.fetchAddress()
                      })
                    }
                  />

                  <View style={styles.modelSeperateLine} />

                  <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
                    <View style={styles.modelSection}>
                      {Object.entries(AuthStore.user).length != 0 && AuthStore.isLogin && AuthStore.user.addresses.slice(0).reverse().map((item, i) =>
                        <View key={i}>
                          <CheckBoxView
                            active={addressesId === item.id}
                            image={require('../assets/images/location_outline.png')}
                            title={item.addressLine}
                            onPress={() => this.setState({
                              headerTitle: item.addressLine,
                              latitude: item.lat,
                              longitude: item.lng,
                              isModalVisible: false,
                              addressesId: item.id,
                              restaurantData: [],
                              page: 1
                            }, () => {
                              this.getRestaurant()
                            })}
                          />
                          <View style={styles.modelSeperateLine} />
                        </View>
                      )}
                    </View>
                  </ScrollView>
                </View>
              </View>
            </Modal>

            <View style={{ ...styles.shadow, backgroundColor: Colors.border, height: 0.3, marginTop: hp(0.5) }} />

            <View style={{ ...styles.searchContainer, flexDirection: 'row', marginTop: hp(2), marginLeft: wp(5) }}>
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

            <ScrollView
              style={{ flex: 1, marginLeft: wp(5) }}
              showsVerticalScrollIndicator={false}>

              <Text style={styles.headerTitle}>Categories</Text>
              {isCategoryLoading
                ? <Loading /> :
                <FlatList
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ flexGrow: 1 }}
                  data={categoriesData}
                  ListEmptyComponent={
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                      <Text style={styles.txtNoResult}>{'No results found'}</Text>
                    </View>
                  }
                  renderItem={(item, index) => this.renderCategories(item, index)}
                  keyExtractor={(item, index) => index.toString()} />
              }

              <Text style={styles.headerTitle}>Nearby Restaurants</Text>

              {isRestaurantLoading
                ? <Loading /> :
                <FlatList
                  showsVerticalScrollIndicator={false}
                  data={restaurantData}
                  renderItem={(item, index) => this.renderRestaurant(item, index)}
                  keyExtractor={(item, index) => index.toString()}

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
                    !fottorLoading ?
                      <Text style={styles.txtNoResult}>{'No results found'}</Text> : null
                  }

                  onEndReached={() => {
                    console.log("response onEndReached")
                    if (isSearching) {
                      this.setState({ page: this.state.page + 1, fottorLoading: true }, () => {
                        this.getRestaurant();
                      })
                    }
                  }}
                  onEndReachedThreshold={0.1}
                />
              }
            </ScrollView>

            {Store.cart.length != 0 &&
              <BasketView
                onPress={() => this.onBasketViewPress()}
                style={{ marginBottom: hp(2) }}
                count={Store.cart.length}
                amount={`£ ${(getTotalPrice() / 100).toFixed(2)}`} />
            }

            <Modal
              transparent={true}
              animationType={'none'}
              visible={filterModalVisible}
            >
              <View style={styles.modelContainer}>
                <View style={styles.modelChildContainer}>
                  <View style={styles.modelHeaderView}>
                    <TouchableOpacity onPress={() => this.setState({ filterModalVisible: false })} style={{ alignSelf: 'center' }} >
                      <Image source={require('../assets/images/close-icon.png')} style={{
                        ...styles.modelIcon,
                        tintColor: Colors.black
                      }} />
                    </TouchableOpacity>
                    <Text style={styles.modelHeaderTitle}>Filters</Text>

                    <View style={styles.clearView} >
                      <Button
                        onPress={() => this.setState({ filterValue: '', storeType: [] })}
                        title={'Clear'}
                        style={styles.btnClear}
                        txtStyle={{ fontSize: normalize(15), fontWeight: '600' }}
                      />
                    </View>
                  </View>
                  <View style={styles.modelSeperateLine} />

                  <CheckBoxView
                    active={filterValue === 'distance'}
                    image={''}
                    title={'Distance'}
                    onPress={() => this.setState({ filterValue: 'distance' })} />
                  <View style={styles.modelSeperateLine} />
                  <CheckBoxView
                    active={filterValue === 'recommended'}
                    image={''}
                    title={'Recommended'}
                    onPress={() => this.setState({ filterValue: 'recommended' })} />

                  <Text style={{ ...styles.modelHeaderTitle, marginTop: hp(4), marginBottom: hp(2) }}>Categories</Text>
                  <View style={styles.modelSeperateLine} />

                  <ScrollView style={{ flex: 1, marginBottom: hp(10) }} showsVerticalScrollIndicator={false}>
                    <View style={styles.modelSection}>

                      {categoriesData && categoriesData.map((item, i) =>
                        <View key={i}>
                          <CheckBoxView
                            active={this.state.storeType.length != 0 && this.state.storeType.includes(titleCase(item.storeTypeName))}
                            image={''}
                            title={item.storeTypeName}
                            isCheckBox={true}
                            onPress={() => this.onCategoryPress(titleCase(item.storeTypeName))}
                          />
                          <View style={styles.modelSeperateLine} />
                        </View>
                      )}
                    </View>
                  </ScrollView>

                  <View style={styles.btnContainer}>
                    <Button
                      onPress={() => this.onDonePressHandler()}
                      title={'Done'}
                      style={styles.btn}
                    />
                  </View>

                </View>
              </View>
            </Modal>

            <Modal
              transparent={true}
              animationType={'none'}
              visible={isMenuLoading}
              onRequestClose={() => { console.log('close modal') }}>
              <View style={styles.loaderBackground}>
                <ActivityIndicator
                  animating={isMenuLoading} size="large" color='#000000' />
              </View>
            </Modal>

            <Modal
              transparent={true}
              animationType={'none'}
              visible={menuModelVisible} >
              <View style={styles.modelContainer}>
                <View style={styles.modelChildContainer}>
                  <TouchableOpacity onPress={() => this.setState({ menuModelVisible: false })}
                    style={styles.modalCancelView} >
                    <Image source={require('../assets/images/close-icon.png')}
                      style={{ ...styles.modelIcon }} />
                  </TouchableOpacity>

                  <ScrollView style={{ flex: 1, marginHorizontal: wp(4), marginBottom: Store.cart.length != 0 ? hp(8.5) : hp(0) }} showsVerticalScrollIndicator={false}>
                    <Image
                      source={{ uri: menuData.imageUri }}
                      resizeMode='cover'
                      style={styles.modalRestaurantImage} />

                    {menuData.storeType != null &&
                      <Text style={{ ...styles.restaurantSubTitle, color: Colors.orange }}>{menuData.storeType}</Text>
                    }
                    <Text style={{ ...styles.restaurantTitle, marginTop: hp(0.5) }}>{menuData.storeName}</Text>
                    <Text style={{ ...styles.restaurantSubTitle, color: Colors.gray }}>{menuData.addressLine1}</Text>

                    {menuData.storeCategoriesList && menuData.storeCategoriesList.map((item, index) =>
                      <View key={index}>
                        <TouchableWithoutFeedback
                          onPress={() => this.toggleExpand(index)}>
                          <View style={styles.modalMenuTitle}>
                            <Text style={{ ...styles.restaurantTitle, }}>{item.categoryName}</Text>
                            <Image source={expandeIndex == index ? require('../assets/images/down_arrow.png')
                              : require('../assets/images/right_arrow.png')} style={styles.modelIcon} />
                          </View>
                        </TouchableWithoutFeedback>
                        <View style={styles.modelSeperateLine} />
                        {expandeIndex == index &&
                          item.products && item.products.map((item, index) =>
                            <View key={index}>
                              <TouchableOpacity style={{ flexDirection: 'row', flex: 1, marginTop: hp(1) }}
                                onPress={() => this.onMenuPress(item)}>
                                <View style={{ flexDirection: 'column', flex: 0.7 }}>
                                  <Text style={{ ...styles.restaurantSubTitle, color: Colors.gray, fontWeight: 'bold' }}>{item.productName}</Text>
                                  <Text style={{ ...styles.restaurantSubTitle, color: Colors.gray }}>{item.description}</Text>
                                  <Text style={{ ...styles.restaurantSubTitle, color: Colors.gray, fontWeight: '700' }}>{`£ ${(item.unitPrice / 100).toFixed(2)}`}</Text>
                                </View>

                                <Image
                                  source={{ uri: item.productImageUrl }}
                                  resizeMode='cover'
                                  style={{ flex: 0.3, marginLeft: wp(2), height: hp(10), alignSelf: 'center' }} />
                              </TouchableOpacity>
                              <View style={{ ...styles.modelSeperateLine, marginTop: hp(0.5) }} />
                            </View>
                          )
                        }
                      </View>
                    )}
                  </ScrollView>
                  {Store.cart.length != 0 &&
                    <BasketView
                      onPress={() => this.onBasketViewPress()}
                      style={{ marginBottom: hp(1) }}
                      count={Store.cart.length}
                      amount={`£ ${(getTotalPrice() / 100).toFixed(2)}`} />
                  }

                  <Modal
                    transparent={true}
                    animationType={'none'}
                    visible={newOrderModelVisible} >
                    <View style={styles.modelContainer}>
                      <View style={{ backgroundColor: Colors.white, width: wp(70) }}>
                        <Text style={{ ...styles.restaurantTitle, marginVertical: hp(1.5), fontWeight: 'bold', alignSelf: 'center' }}>{'Start new order?'}</Text>
                        <Text style={{ ...styles.restaurantSubTitle, marginHorizontal: wp(7), color: Colors.gray }}>{'Items currently from '}
                          <Text style={{ ...styles.restaurantSubTitle, color: Colors.black }}>{newStoreName}</Text>
                          <Text style={{ ...styles.restaurantSubTitle, color: Colors.gray }}>{' will be removed'}</Text></Text>

                        <View style={{ ...styles.modelSeperateLine, marginTop: hp(1.5) }} />

                        <View style={styles.modelConfirmContainer}>
                          <TouchableOpacity style={{ width: wp(35) }} onPress={() => this.setState({ newOrderModelVisible: false })}>
                            <Text style={{ ...styles.restaurantTitle, textAlign: 'center', }}>{'Cancel'}</Text>
                          </TouchableOpacity>
                          <View style={styles.modelVerticalLine} />
                          <TouchableOpacity style={{ width: wp(35) }} onPress={() => this.onConfirmPress()}>
                            <Text style={{ ...styles.restaurantTitle, textAlign: 'center', }}>{'Confirm'}</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  </Modal>
                </View>
              </View>
            </Modal>

            {menuDetaildata != null &&
              <Modal
                transparent={true}
                animationType={'none'}
                visible={menuDetailVisible} >
                <View style={styles.modelContainer}>
                  <View style={styles.modelChildContainer}>
                    <TouchableOpacity onPress={() => this.onMenuDetailCancelPress()}
                      style={styles.modalCancelView} >
                      <Image source={require('../assets/images/close-icon.png')}
                        style={styles.modelIcon} />
                    </TouchableOpacity>

                    <View style={{ flex: 1, marginHorizontal: wp(4), justifyContent: 'space-between', marginBottom: hp(9) }} showsVerticalScrollIndicator={false}>
                      <View>
                        <Image
                          source={{ uri: menuDetaildata.productImageUrl }}
                          resizeMode='cover'
                          style={styles.modalRestaurantImage} />

                        <View style={{ flexDirection: 'row', marginVertical: hp(1), justifyContent: 'space-between' }}>
                          <Text style={{ ...styles.restaurantTitle, fontWeight: 'bold' }}>
                            {menuDetaildata.productName}</Text>
                          <Text style={{ ...styles.restaurantSubTitle, color: Colors.gray, marginRight: wp(2), fontWeight: '700' }}>
                            {`£ ${(menuDetaildata.unitPrice / 100).toFixed(2)}`}</Text>
                        </View>
                        <Text style={{ ...styles.restaurantSubTitle, color: Colors.gray }}>{menuDetaildata.description}</Text>
                      </View>

                      <View style={styles.btnCountContainer}>
                        <TouchableOpacity onPress={() => menuDetailCount > 1 && this.onUpdateCountPress(-1)} >
                          <Image source={require('../assets/images/minus_icon.png')}
                            style={styles.modelPlusIcon} />
                        </TouchableOpacity>
                        <Text style={styles.modelCountText}>{menuDetailCount}</Text>
                        <TouchableOpacity onPress={() => this.onUpdateCountPress(1)}>
                          <Image source={require('../assets/images/plus_icon.png')}
                            style={styles.modelPlusIcon} />
                        </TouchableOpacity>
                      </View>

                    </View>

                    <View style={styles.btnContainer}>
                      <View style={{ ...styles.modelSeperateLine, marginBottom: hp(1) }} />
                      <Button
                        onPress={() => this.onAddBasketPress(menuDetaildata)}
                        title={'Add to Basket'}
                        style={styles.btn}
                      />
                    </View>
                  </View>
                </View>
              </Modal>
            }

          </View>
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
  modelContainer: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: 'rgba(52, 52, 52, 0.5)',
  },
  modelChildContainer: {
    backgroundColor: Colors.white,
    height: hp(90),
    width: wp(90),
    // paddingBottom: hp(2.5),
    // borderRadius: wp(5)
  },
  modelHeaderView: {
    flexDirection: 'row',
    padding: wp(4)
  },
  modelIcon: {
    width: wp(5),
    height: wp(5),
    alignSelf: 'center',
  },
  modelHeaderTitle: {
    fontSize: normalize(18),
    fontFamily: 'Roboto-Regular',
    color: Colors.black,
    alignItems: 'center',
    marginLeft: wp(4)
  },
  modelSeperateLine: {
    backgroundColor: Colors.border,
    height: wp(0.2),
  },
  modelAddIcon: {
    width: wp(6),
    height: wp(6),
    alignSelf: 'center',
  },
  modelSection: {
    height: 'auto',
    backgroundColor: Colors.white,

  },
  shadow: {
    shadowColor: "#00000012",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.22,
    shadowRadius: 1.22,
    elevation: 1
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
  categoriesImage: {
    height: Platform.OS == 'ios' ? hp(15) : hp(17),
    width: wp(28),
    marginRight: wp(3),
    backgroundColor: '#00000050',
    borderRadius: wp(2),
  },
  categoriesTitle: {
    fontSize: normalize(12),
    fontFamily: 'Roboto-Regular',
    color: Colors.white,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: Platform.OS == 'ios' ? hp(12) : hp(14),
    marginHorizontal: wp(2),
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
  btnContainer: {
    position: 'absolute',
    bottom: 0,
    height: hp(8),
    width: '100%'
  },
  btn: {
    height: hp(6),
    marginHorizontal: wp(5),
    marginBottom: hp(1)
  },
  clearView: {
    position: 'absolute',
    right: 0,
    marginRight: wp(2),
    alignItems: 'center',
    alignSelf: 'center'
  },
  btnClear: {
    marginHorizontal: wp(5),
    height: hp(4.5),
  },
  txtNoResult: {
    marginTop: hp(1),
    fontFamily: 'Roboto-Regular',
    fontSize: normalize(18),
    alignSelf: 'center',
    color: '#777777',
  },
  loaderBackground: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(52, 52, 52, 0.5)'
  },
  modalRestaurantImage: {
    width: '100%',
    alignSelf: 'center',
    marginVertical: hp(1),
    height: Platform.OS == 'ios' ? hp(24) : hp(28),
    borderRadius: wp(2)
  },
  modalCancelView: {
    position: 'absolute',
    left: 0,
    top: 0,
    zIndex: 1,
    marginLeft: wp(5),
    marginTop: hp(2),
  },
  modalMenuTitle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: hp(1.5),
    marginBottom: hp(1),
    alignItems: 'center'
  },
  btnCountContainer: {
    flexDirection: 'row',
    borderWidth: 2,
    borderRadius: wp(1),
    borderColor: Colors.gray,
    marginBottom: hp(1),
    justifyContent: 'center',
    alignItems: 'center',
    padding: wp(2.5),
    marginHorizontal: wp(1)
  },
  modelPlusIcon: {
    width: wp(6),
    height: wp(6),
    alignSelf: 'center',
  },
  modelCountText: {
    fontSize: normalize(18),
    fontFamily: 'Roboto-Regular',
    alignItems: 'center',
    marginHorizontal: wp(7),
    alignSelf: 'center',
    color: Colors.gray,
    fontWeight: '700'
  },
  modelVerticalLine: {
    width: 1,
    backgroundColor: Colors.border,
    height: hp(6)
  },
  modelConfirmContainer: {
    width: wp(70),
    flexDirection: 'row',
    height: hp(6),
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default HomeScreen;