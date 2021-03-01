import React, { Component } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, ScrollView, ActivityIndicator } from 'react-native';
import styles from './styles';
import Api from '../../config/api';
import AuthStore from '../../config/store/auth';
import moment from 'moment';
import vars from '../../utils/vars';
import { retrieveData } from '../../components/AuthKeyStorageComponent';
import BackIcon from '../../components/backIcon';
import Loading from '../../components/loading';
import { wp, hp, normalize } from '../../helper/responsiveScreen';
import Colors from '../../constants/Colors'

var uuid = require('react-native-uuid');

class Orders extends Component {
    state = {
        completeData: [],
        preparingData: [],
        loading: false,
        page: 1,
        fottorLoading: false,
        onEndReachedCalledDuringMomentum: true
    };

    componentDidMount() {
        this.focusListener = this.props.navigation.addListener("focus", () => {
            this.setState({ completeData: [], preparingData: [], loading: false, page: 1, fottorLoading: false },
                () => {
                    this.getOrder()
                })
        })
    }

    componentWillUnmount() {
        this.focusListener();
    }

    getOrder = () => {
        var STORAGE_KEY = vars.idToken;

        const { page } = this.state

        if (page == 1) {
            this.setState({ loading: true })
        }

        retrieveData(STORAGE_KEY)
            .then((data) => {
                let guid = uuid.v1();
                console.log('uuid.....order', guid, page)
                const config = {
                    headers: { Authorization: 'Bearer ' + data, 'Request-Id': guid }
                };

                Api.get('/order/getByUserId/' + AuthStore.user.id + '?page=' + page + '&pagesize=' + 10, config).then(res => {
                    console.log('order res', JSON.stringify(res));
                    let preparingData = res.filter(element => {
                        let data = element.orderStatus == 'Preparing';
                        return data;
                    });

                    let completeData = res.filter(element => {
                        let data = element.orderStatus == 'succeeded';
                        return data;
                    });

                    if (res.length != 0) {
                        this.setState({
                            loading: false,
                            preparingData: [...this.state.preparingData, ...preparingData],
                            completeData: [...this.state.completeData, ...completeData]
                        });
                    } else {
                        this.setState({ fottorLoading: false, loading: false, onEndReachedCalledDuringMomentum: true })
                    }
                }).catch((error) => {
                    console.error(error);
                    this.setState({ loading: false })
                });
            }).catch(err => {
                console.log('err', err)
                this.setState({ loading: false })
            });
    }

    renderItem = (item, index) => {
        let status = '';
        if (item.orderStatus == 'succeeded') {
            status = 'Delivered'
        } else if (item.orderStatus == 'Preparing') {
            status = 'Preparing'
        }
        return (
            <View style={{ marginBottom: hp(3) }}>
                <View style={styles.seperateLine} />
                <TouchableOpacity style={styles.rowContainer}
                    onPress={() => this.props.navigation.navigate('OrderDetail', { order: item })}>
                    <View style={{ flexDirection: 'row', width: wp(85), }}>
                        <Image
                            source={{ uri: item.imageUri }}
                            resizeMode='cover'
                            style={styles.image} />

                        <View style={{ marginLeft: wp(5), width: wp(65), alignContent: 'center', justifyContent: 'center' }}>
                            <Text style={{ ...styles.subTitle, color: Colors.gray, }}>{status}</Text>
                            {item.storeName && <Text numberOfLines={1} style={{ ...styles.subTitle, color: Colors.black, fontWeight: 'bold' }}>{item.storeName}</Text>}
                            <Text numberOfLines={1} style={{ ...styles.subTitle, color: Colors.black, }}>
                                {`${vars.currency} ${(item.totalAmount / 100).toFixed(2)} - ${moment(item.dateCreated).format('DD MMM YYYY')}`}</Text>
                        </View>
                        {/* <Text numberOfLines={1} style={styles.title}>{title}</Text> */}
                    </View>
                    <Image source={require('../../assets/images/right_arrow.png')} style={styles.rightIcon} />
                </TouchableOpacity>
                <View style={styles.seperateLine} />
            </View>
        )
    }

    render() {
        const { loading, preparingData, completeData, page, fottorLoading, onEndReachedCalledDuringMomentum } = this.state;
        return (
            <View style={styles.container}>

                <View style={styles.header}>
                    <BackIcon
                        onPress={() => this.props.navigation.goBack()} />
                    <Text style={styles.headerTitle}>{'My Orders'}</Text>
                </View>
                <View style={styles.seperateLine} />

                {loading ?
                    <Loading /> :
                    preparingData.length > 0 || completeData.length > 0 ?
                        <FlatList
                            data={completeData}
                            showsVerticalScrollIndicator={false}
                            ListFooterComponent={
                                fottorLoading &&
                                <View style={{ padding: wp(3) }}>
                                    <ActivityIndicator
                                        size={"large"}
                                        color={Colors.light_text_color}
                                        animating={true}
                                    />
                                </View>
                            }
                            ListHeaderComponent={
                                preparingData.length > 0 &&
                                <View>
                                    <Text style={styles.title}>{`Preparing (${preparingData.length})`}</Text>
                                    <FlatList
                                        data={preparingData}
                                        renderItem={({ item, index }) => this.renderItem(item, index)}
                                        keyExtractor={(item, index) => index.toString()}
                                    />
                                    {completeData.length != 0 &&
                                        <Text style={styles.title}>{`Completed (${completeData.length})`}</Text>
                                    }
                                </View>

                            }

                            onEndReachedThreshold={0.1}
                            onMomentumScrollBegin={() => this.setState({ onEndReachedCalledDuringMomentum: false })}
                            onEndReached={() => {
                                if (!onEndReachedCalledDuringMomentum) {
                                    console.log("response onEndReached")
                                    this.setState({ page: page + 1, fottorLoading: true, onEndReachedCalledDuringMomentum: false }, () => {
                                        this.getOrder();
                                    })
                                }
                            }}
                            renderItem={({ item, index }) => this.renderItem(item, index)}
                            keyExtractor={(item, index) => index.toString()}
                        />
                        :
                        <View style={styles.emptyView}>
                            <Text style={styles.headerTitle}>You have no orders</Text>
                        </View>
                }

            </View>
        )
    }
}

export default Orders;