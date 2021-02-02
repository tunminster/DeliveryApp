import React, { Component } from 'react';
import { FlatList, Image, Platform, StyleSheet, Text, TouchableOpacity, View, Modal, TextInput, ImageBackground, ActivityIndicator } from 'react-native';
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
import { titleCase } from '../utils/helpers'
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
      filterModelVisible: false,
      filterValue: '',
    }
  }

  componentDidMount = async () => {
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

  getCategories() {
    retrieveData(STORAGE_KEY)
      .then((data) => {
        const config = {
          headers: { Authorization: 'Bearer ' + data, 'Request-Id': guid }
        };

        console.log('config', config)
        Api.get('/v1/StoreType/GetAllStoreTypes', config).then(res => {
          console.log('GetAllStoreTypes res', res);
          this.setState({ categoriesData: res })
        }).catch(err => {
          console.log("Error ", err);
        });
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
    this.forceUpdate()
    this.setState({ isModalVisible: true });
    setTimeout(() => {
      this.setState({ isModalVisible: true });
    }, 1000)

    console.log('refresh...', 1)
  }

  onDonePressHandler() {
    this.setState({ filterModelVisible: false })
    console.log('storetypes', this.state.storeType)
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
      <View style={{ ...styles.searchContainer, marginBottom: hp(1), marginTop: hp(0.5), marginLeft: 1 }}>
        <Image
          source={{ uri: item.item.imageUri }}
          resizeMode='cover'
          style={styles.restaurantImage} />
        <Text style={styles.restaurantTitle}>{item.item.storeName}</Text>
        {item.item.storeType != null &&
          <Text style={styles.restaurantSubTitle}>{item.item.storeType}</Text>
        }
        <Text style={styles.restaurantSubTitle}>{` ${item.item.distance.toFixed(2)} miles away`}</Text>
      </View>
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

  render() {
    const { headerTitle, isModalVisible, addressesId, curLatitude, curLongitude, search,
      categoriesData, restaurantData, isSearching, fottorLoading, isLoading, isRestaurantLoading,
      filterModelVisible, filterValue } = this.state
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
                      <Image source={require('../assets/images/close-icon.png')} style={styles.modelIcon} />
                    </TouchableOpacity>
                    <Text style={styles.modelHeaderTitle}>Select Location</Text>
                  </View>
                  <View style={styles.modelSeperateLine} />

                  <TouchableOpacity style={styles.modelHeaderView} onPress={() => {
                    this.setState({ isModalVisible: false }),
                      this.props.navigation.navigate('CreateAddress', {
                        onGoBack: () => this.refresh(),
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
                      {Object.entries(AuthStore.user).length != 0 && AuthStore.isLogin && AuthStore.user.addresses.reverse().map((item, i) =>
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
              <TouchableOpacity onPress={() => this.setState({ filterModelVisible: true })} >
                <Image source={require('../assets/images/filter.png')} style={styles.filter} />
              </TouchableOpacity>
            </View>

            <ScrollView
              style={{ flex: 1, marginLeft: wp(5) }}
              showsVerticalScrollIndicator={false}>

              <Text style={styles.headerTitle}>Categories</Text>

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

              <Text style={styles.headerTitle}>Nearby Restaurants</Text>

              {isRestaurantLoading ?
                <View style={{ padding: wp(5) }}>
                  <ActivityIndicator
                    size={"large"}
                    color={Colors.light_text_color}
                    animating={true}
                  />
                </View> :

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

            <View style={styles.basketContainer}>
              <Text style={{ ...styles.basketTitle, fontSize: normalize(18) }}>View Basket</Text>
              <View style={styles.basketCount}>
                <Text style={{ ...styles.basketTitle, fontSize: normalize(15), marginHorizontal: wp(2), marginVertical: hp(0.3) }}>1</Text>
              </View>
              <Text style={{ ...styles.basketTitle, position: 'absolute', right: 0, alignSelf: 'center', marginRight: wp(4), fontSize: normalize(19) }}>£5.50</Text>
            </View>

            <Modal
              transparent={true}
              animationType={'none'}
              visible={filterModelVisible}
            >
              <View style={styles.modelContainer}>
                <View style={styles.modelChildContainer}>
                  <View style={styles.modelHeaderView}>
                    <TouchableOpacity onPress={() => this.setState({ filterModelVisible: false })} style={{ alignSelf: 'center' }} >
                      <Image source={require('../assets/images/close-icon.png')} style={styles.modelIcon} />
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

                  <ScrollView style={{ flex: 1, marginBottom: hp(8) }} showsVerticalScrollIndicator={false}>
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
    paddingBottom: hp(2.5),
    borderRadius: wp(5)
  },
  modelHeaderView: {
    flexDirection: 'row',
    padding: wp(4)
  },
  modelIcon: {
    width: wp(4),
    height: wp(4),
    alignSelf: 'center',
    tintColor: Colors.black
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
    marginTop: hp(1.5)
  },
  restaurantSubTitle: {
    fontSize: normalize(15),
    fontFamily: 'Roboto-Regular',
    color: Colors.gray,
    fontWeight: '400',
    alignItems: 'center',
    marginTop: hp(0.5)
  },
  basketContainer: {
    flexDirection: 'row',
    position: 'absolute',
    left: wp(5),
    right: wp(5),
    bottom: 0,
    marginBottom: hp(2),
    paddingVertical: hp(2),
    paddingHorizontal: wp(4),
    backgroundColor: Colors.tabIconSelected,
    borderRadius: wp(2),
  },
  basketCount: {
    backgroundColor: '#FF7D81',
    borderRadius: wp(1),
    marginLeft: wp(2),
    alignItems: 'center'
  },
  basketTitle: {
    fontFamily: 'Roboto-Regular',
    color: Colors.white,
    alignItems: 'center',
  },
  btnContainer: {
    position: 'absolute',
    bottom: 0,
    height: hp(9),
    width: '100%'
  },
  btn: {
    marginHorizontal: wp(5),
    marginBottom: hp(2)
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
  }
});

export default HomeScreen;