import React, { Component } from 'react';
import { FlatList, Image, Platform, StyleSheet, Text, TouchableOpacity, View, Modal, TextInput, ImageBackground, ActivityIndicator } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { wp, hp, normalize } from '../helper/responsiveScreen'
import Colors from '../constants/Colors'
import Header from '../components/header'
import Geolocation from '@react-native-community/geolocation'
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
import AuthStore from '../config/store/auth';
import vars from '../utils/vars';
import AddressList from '../components/addressList';
import { GetLocationComponent } from '../components/GetLocationComponent'
import { retrieveData } from '../components/AuthKeyStorageComponent';
import Api from '../config/api';
import Loading from '../components/loading';
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
      storeType: '',
      isLoading: true,
      isRestaurantLoading: false
    }
  }

  componentDidMount = async () => {
    this.getCategories()

    if (Platform.OS === 'android') {
      RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({ interval: 10000, fastInterval: 5000 })
        .then(data => {
          console.log('data...', data)

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
    const { latitude, longitude, page, search, storeType } = this.state
    console.log('location', latitude, longitude)
    if (page == 1) {
      this.setState({ isRestaurantLoading: true })
    }

    retrieveData(STORAGE_KEY)
      .then((data) => {
        const config = {
          headers: { Authorization: 'Bearer ' + data, 'Request-Id': guid }
        };

        const value = 'searchQuery=' + search + '&filters=' + '' +
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

  renderCategories = (item, index) => {
    return (
      <TouchableOpacity onPress={() => this.setState({ storeType: item.item.storeTypeId, restaurantData: [], page: 1 }
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

  render() {
    const { headerTitle, isModalVisible, addressesId, curLatitude, curLongitude, search,
      categoriesData, restaurantData, isSearching, fottorLoading, isLoading, isRestaurantLoading } = this.state
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

                  <AddressList
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
                      {Object.entries(AuthStore.user).length != 0 && AuthStore.isLogin && AuthStore.user.addresses.map((item, i) =>
                        <View>
                          <AddressList
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
              <Image source={require('../assets/images/filter.png')} style={styles.filter} />
            </View>

            <ScrollView
              style={{ flex: 1, marginLeft: wp(5) }}
              showsVerticalScrollIndicator={false}>

              <Text style={styles.headerTitle}>Categories</Text>

              <FlatList
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                data={categoriesData}
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
              <Text style={{ ...styles.basketTitle, fontSize: normalize(22) }}>View Basket</Text>
              <View style={styles.basketCount}>
                <Text style={{ ...styles.basketTitle, fontSize: normalize(16), marginHorizontal: wp(2.5), marginVertical: hp(0.5) }}>1</Text>
              </View>
              <Text style={{ ...styles.basketTitle, position: 'absolute', right: 0, alignSelf: 'center', marginRight: wp(4), fontSize: normalize(22) }}>£5.50</Text>
            </View>

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
    fontSize: normalize(20),
    fontFamily: 'Roboto-Regular',
    color: Colors.black,
    alignItems: 'center',
    marginLeft: wp(5)
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
    fontSize: normalize(22),
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
    fontSize: normalize(20),
    fontFamily: 'Roboto-Regular',
    color: Colors.black,
    fontWeight: '400',
    alignItems: 'center',
    marginTop: hp(1.5)
  },
  restaurantSubTitle: {
    fontSize: normalize(16),
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
    paddingVertical: hp(2.5),
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
});

export default HomeScreen;


