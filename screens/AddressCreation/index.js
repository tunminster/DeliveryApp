import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator, Modal, Dimensions } from 'react-native';
import Button from '../../components/button';
import { post } from '../../utils/helpers';
import AuthStore from '../../config/store/auth';
import { storeData, retrieveData, storeUser } from '../../components/AuthKeyStorageComponent';
import { wp, hp, normalize } from '../../helper/responsiveScreen'
import { AutoCompleteComponent } from '../../components/AutoCompleteComponent'
import { GetLocationComponent } from '../../components/GetLocationComponent'
import Colors from '../../constants/Colors'
import MapView from 'react-native-maps';
import Custominput from '../../components/textinput';
import SmartScrollView from '../../components/SmartScrollView'
import { Platform } from 'react-native';
import BackIcon from '../../components/backIcon';

class AddressCreation extends Component {

    constructor(props) {
        super(props)
        this.state = {
            customerId: AuthStore.user.id,
            addressLine: '',
            description: '',
            city: '',
            postCode: '',
            lat: '',
            lng: '',
            country: '',
            disabled: false,
            addressDto: {},
            searchName: '',
            addressData: [],
            isMap: true,
            isAddress: false,
            loading: false,
            latDelta: 0.1,
            lngDelta: 0.1
        }
    }

    componentDidMount = () => {
        if (this.props.route.params && this.props.route.params.curLatitude) {
            this.setState({
                lat: this.props.route.params.curLatitude,
                lng: this.props.route.params.curLongitude
            })
            this.sortAddress("", this.props.route.params.curLatitude, this.props.route.params.curLongitude)
        }
    }

    handleAddressLine = (event) => {
        const addressLine = event.target.value
        this.setState({ addressLine: addressLine })
    }

    submit() {
        const { addressLine, city, postCode, country, lat, lng, disabled, description, customerId } = this.state

        if (addressLine == '') {
            // setEmailError("Enter a valid email.");
            alert("Please enter address");
        }
        else if (city == '') {
            alert("Please enter city")
        }
        else if (postCode == '') {
            // setPasswordError("Enter a valid password");
            alert("Please enter postal code")
        }
        else if (country == '') {
            // setPasswordError("Enter a valid password");
            alert("Please enter country")
        }

        else {
            this.state.addressDto = {
                customerId: customerId,
                addressLine: addressLine,
                description: description,
                city: city,
                postCode: postCode,
                lat: lat,
                lng: lng,
                country: country,
                disabled: disabled
            }

            const { addressDto } = this.state;

            this.setState({ loading: true })

            console.log(addressDto);
            post('/address/create', addressDto, res => {
                this.setState({ loading: false })
                console.log(res);
                var STORAGE_KEY = 'id_token';
                retrieveData(STORAGE_KEY)
                    .then((responseData) => {
                        storeUser(responseData).then((data) => {
                            console.log("user stored... " + data);
                        });
                    });
                // this.props.navigation.navigate('AddressDetail');
                this.props.navigation.goBack()
                this.props.route.params.onGoBack()
            }, err => {
                console.log('err', err)
                this.setState({ loading: false })
            });
        }
    }

    onChangeText = (value) => {
        this.setState({ searchName: value })
        const body = {
            location: value
        }
        AutoCompleteComponent(body)
            .then((res) => {
                console.log("Auto complete response ===> ", res)
                this.setState({ addressData: res.predictions, isMap: true, isAddress: false })

            }).catch((error) => {
                console.log('error', error)
            });
    };

    sortAddress = async (description, lat, lng) => {

        try {
            // this.setState({ isLoading: true });
            GetLocationComponent({
                location: description
            }, lat, lng)
                .then((res) => {
                    console.log("get location response ===> ", res)
                    const location = res && res.results && res.results.length ? res.results[0] : {};
                    const address_components = location.address_components;

                    console.log("address_components", JSON.stringify(address_components))

                    const streetNumber = address_components.filter(ele => ele.types.indexOf("street_number") !== -1);
                    const streetAddress = address_components.filter(ele => ele.types.indexOf("route") !== -1);
                    const state = address_components.filter(ele => ele.types.indexOf("administrative_area_level_1") !== -1);
                    const city = address_components.filter(ele => ele.types.indexOf("locality") !== -1);
                    const zipCode = address_components.filter(ele => ele.types.indexOf("postal_code") !== -1);
                    const area = address_components.filter(ele => ele.types.indexOf("neighborhood") !== -1);
                    const country = address_components.filter(ele => ele.types.indexOf("country") !== -1);
                    const city1 = address_components.filter(ele => ele.types.indexOf("postal_town") !== -1);

                    let address = location && location.formatted_address ? location.formatted_address : ""

                    this.setState({
                        addressLine: address.split(",").slice(0, -2).join(","),
                        city: city && city.length ? city[0].long_name : city1 && city1.length ? city1[0].long_name : "",
                        postCode: zipCode && zipCode.length ? zipCode[0].long_name : "",
                        lat: location && location.geometry && location.geometry.location && location.geometry.location.lat ? location.geometry.location.lat : null,
                        lng: location && location.geometry && location.geometry.location && location.geometry.location.lng ? location.geometry.location.lng : null,
                        country: country && country.length ? country[0].long_name : "",
                        isMap: false,
                        searchName: address.split(",").slice(0, -2).join(",")
                    })

                }).catch((error) => {
                    console.log('error', error)
                });

        } catch (error) {
            console.log("error ===> ", error);
        }
    }


    AddressItem = ({ item }) => {

        return (
            <TouchableOpacity onPress={this.sortAddress.bind(this, item.description, '', '')}>
                <View style={styles.itemContainerStyle}  >
                    <Text style={{ fontFamily: 'Roboto-Regular', fontSize: normalize(14), fontWeight: '500', color: Colors.dark_text_color }} numberOfLines={0}>
                        {item.structured_formatting.main_text}</Text>
                    <Text style={{ fontFamily: 'Roboto-Regular', fontSize: normalize(12), fontWeight: '400', color: Colors.light_text_color }} numberOfLines={0}>
                        {item.structured_formatting.secondary_text}</Text>
                </View>
            </TouchableOpacity>
        )
    }

    onMapPress = (coordinate) => {
        console.log('coordinate', coordinate)
        this.setState(
            {
                lat: coordinate.latitude,
                lng: coordinate.longitude,
            })
        this.sortAddress("", coordinate.latitude, coordinate.longitude)
    }

    handleRegionChange = (coordinate) => {
        console.log('coordinate', coordinate)
        this.setState({
            lat: coordinate.latitude,
            lng: coordinate.longitude
        })
        setTimeout(() => {
            this.sortAddress("", coordinate.latitude, coordinate.longitude)
        }, 300)
    }

    render() {
        const { addressLine, city, postCode, country, searchName, addressData, isMap, lat, lng,
            isAddress, description, loading, latDelta, lngDelta } = this.state
            console.log("lat....", lat)
        return (
            // <KeyboardAwareScrollView
            //     contentContainerStyle={{
            //         flexGrow: 1, backgroundColor: Colors.white,
            //         padding: 15
            //     }}
            //     bounces={false}
            //     style={{ flex: 1 }}
            //     showsVerticalScrollIndicator={false}
            //     enableOnAndroid={true}>

            <View style={{ flex: 1, paddingTop: Platform.OS == 'ios' ? hp(4) : hp(0), }}>

                <View style={{ flexDirection: 'row',   paddingVertical: wp(3), paddingHorizontal: wp(3), backgroundColor: Colors.white }}>
                    <BackIcon
                        tintColor={Colors.black}
                        onPress={() => {
                            if (isAddress) {
                                this.setState({ isAddress: false, isMap: false })
                            } else {
                                this.props.navigation.goBack()
                            }
                        }} />

                    <Text style={styles.headerText}>{'Address Creation'}</Text>
                </View>

                <View style={styles.seperateLine} />

                <SmartScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.container}
                    applyKeyboardCheck={Platform.OS == 'ios' ? true : false}
                    disabled={false}
                    alwaysBounceVertical={false} >

                    {isMap && !isAddress &&
                        <View style={styles.childContainer}>
                            <FlatList
                                contentContainerStyle={styles.flatListContainer}
                                data={addressData && addressData.length ? addressData : []}
                                keyExtractor={(item, index) => `address-list-${index}`}
                                renderItem={({ item }) => <this.AddressItem item={item} />}
                            />
                        </View>
                    }

                    {/* <Text>Search here:</Text>
                        <TextInput
                            value={searchName}
                            style={styles.inputText}
                            onChangeText={text => this.onChangeText(text)}
                            autoCorrect={false}
                        /> */}
                    {!isAddress &&
                        <View style={{ marginBottom: hp(-1) }}>
                            <Custominput
                                placeholder="Search here"
                                placeholderTextColor="rgba(0,0,0,0.32)"
                                icon={require('../../assets/images/search.png')}
                                style
                                value={searchName}
                                onChangeText={text => this.onChangeText(text)}
                                autoCorrect={false} />
                        </View>
                    }

                    {!isMap &&
                        <View style={{ flex: 1 }}>
                            <MapView
                                ref={r => this.mapRef = r}
                                style={styles.mapView}
                                // provider={'google'}
                                region={{
                                    latitude: lat == '' ? 0.0 : lat,
                                    longitude: lng == '' ? 0.0 : lng,
                                    latitudeDelta: latDelta,
                                    longitudeDelta: lngDelta,
                                }}
                                showsUserLocation={true}
                                // onRegionChangeComplete={this.handleRegionChange}
                                onPress={(event) => this.onMapPress(event.nativeEvent.coordinate)}
                            >
                                <MapView.Marker
                                    coordinate={{
                                        latitude: lat == '' ? 0.0 : lat,
                                        longitude: lng == '' ? 0.0 : lng,
                                    }}
                                    draggable={true}
                                />
                            </MapView>
                            <Button
                                onPress={() => this.setState({ isAddress: true, isMap: true })}
                                title={'Set address'}
                                style={{ marginVertical: hp(2), backgroundColor: Colors.tabIconSelected}}
                            />
                        </View>
                    }

                    {isAddress &&
                        <View>
                            {/* <Text>Address line:</Text>
                                <TextInput
                                    value={addressLine}
                                    style={styles.inputText}
                                    onChangeText={text => this.setState({ addressLine: text })}
                                    editable={false}
                                    autoCorrect={false}
                                /> */}

                            <Custominput
                                placeholder="Address line"
                                placeholderTextColor="rgba(0,0,0,0.32)"
                                style
                                onChangeText={text => this.setState({ addressLine: text })}
                                autoCorrect={false}
                                value={addressLine}
                            />

                            {/* <Text>City:</Text>
                                <TextInput
                                    value={city}
                                    style={styles.inputText}
                                    onChangeText={text => this.setState({ city: text })}
                                    editable={false}
                                    autoCorrect={false}
                                /> */}

                            <Custominput
                                placeholder="City"
                                placeholderTextColor="rgba(0,0,0,0.32)"
                                style
                                onChangeText={text => this.setState({ city: text })}
                                autoCorrect={false}
                                value={city}
                            />

                            {/* <Text>Postal code/Postcode:</Text>
                            <TextInput
                                keyboardType='numeric'
                                value={postCode}
                                style={styles.inputText}
                                onChangeText={text => this.setState({ postCode: text })}
                                autoCorrect={false}
                            /> */}

                            <Custominput
                                placeholder="Postal code/Postcode"
                                placeholderTextColor="rgba(0,0,0,0.32)"
                                style
                                onChangeText={text => this.setState({ postCode: text })}
                                autoCorrect={false}
                                value={postCode}
                            />

                            {/* <Text>Country:</Text>
                            <TextInput
                                value={country}
                                style={styles.inputText}
                                onChangeText={text => this.setState({ country: text })}
                                editable={false}
                                autoCorrect={false}
                            /> */}

                            <Custominput
                                placeholder="Country"
                                placeholderTextColor="rgba(0,0,0,0.32)"
                                style
                                onChangeText={text => this.setState({ country: text })}
                                autoCorrect={false}
                                value={country}
                            />

                            <Button
                                onPress={() => { this.submit() }}
                                title={'Submit'}
                                style={{ marginTop: hp(3), backgroundColor: Colors.tabIconSelected }}
                            />
                        </View>}

                    <Modal
                        transparent={true}
                        animationType={'none'}
                        visible={loading}
                        onRequestClose={() => { console.log('close modal') }}>
                        <View style={styles.loaderBackground}>
                            <ActivityIndicator
                                animating={loading} size="large" color='#000000' />
                        </View>
                    </Modal>

                    {/* </KeyboardAwareScrollView> */}
                </SmartScrollView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white,
        paddingHorizontal: wp(5),
        paddingTop: hp(2),
        minHeight: Dimensions.get('window').height - hp(14)
    },
    inputText: {
        fontSize: normalize(18),
        fontFamily: 'Roboto-Regular',
        borderBottomWidth: 1,
        padding: wp(1),
        marginBottom: hp(2)
    },
    itemContainerStyle: {
        backgroundColor: Colors.seprator_color,
        borderRadius: wp(3),
        padding: wp(3),
        marginHorizontal: wp(5),
        marginVertical: wp(2)
    },
    flatListContainer: {
        flexGrow: 1
    },
    childContainer: {
        marginTop: hp(13),
        position: 'absolute',
        right: 0,
        left: 0,
        // backgroundColor: Colors.white
    },
    mapView: {
        flex: 1,
        width: wp(100),
        alignSelf: 'center'
    },
    loaderBackground: {
        flex: 1,
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'space-around',
        backgroundColor: 'rgba(52, 52, 52, 0.5)'
    },
    headerText: {
        fontSize: normalize(20),
        fontFamily: 'Roboto-Regular',
        color: Colors.black,
        marginLeft: wp(5),
        alignSelf: 'center',
        fontWeight: 'bold'
    },
    seperateLine: {
        backgroundColor: Colors.border,
        height: wp(0.2),
    },
});

export default AddressCreation;