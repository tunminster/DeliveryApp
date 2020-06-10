import React, {Component} from 'react';
import {View, ScrollView, Text, Image} from 'react-native';
import styles from './styles';
import Swiper from 'react-native-swiper'
import { BackIcon, Button, Loading } from '../../components';
import Store from '../../config/store';
import Api from '../../config/api';
import {fixImgPath, getDiscountPrice, renderStar} from '../../utils/helpers';

class ProductDetail extends Component {
    static navigationOptions = ({navigation}) => ({
        headerLeft: <BackIcon navigation={navigation} />
    });

    state = {
        loading: true,
        data: {},
        comments: [],
        starAvg: 0
    };

    componentDidMount() {
        const id = this.props.navigation.getParam('id');
        Api.get('/product/getById' + id).then(res => {
            this.setState({data: res, loading: false});
        });
    }

    render(){
        const swiperOptions = {
            paginationStyle: {bottom: 0},
            containerStyle: {height: 240},
            dotStyle: styles.dot,
            activeDotStyle: {...styles.dot, ...styles.activeDot},
            showButtons: true,
            nextButton: <Image source={require('../../assets/images/right-chevron.png')} style={styles.chevron} />,
            prevButton: <Image source={require('../../assets/images/left-chevron.png')} style={styles.chevron} />
        };

        const {id, productName, description, unitPrice } = this.state.data;

        return (
            <View style={styles.container}>
                {this.state.loading ?
                 <Loading />
                 :
                 <React.Fragment>
                     <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{padding: 10}}>
                        <View style={styles.card}>
                            <Swiper {...swiperOptions}>
                                <View style={styles.swiperItem}>
                                    <Image source={{uri: 'https://static.wixstatic.com/media/71ac99_cf0381fa9e3343a69c047e2b7f5f59ce~mv2_d_2668_2648_s_4_2.png'}} style={styles.img} />
                                </View>
                            </Swiper>
                            
                            <View style={styles.cardFooter}>
                                <View style={{flex:1}}>
                                    <Text style={styles.title}>{productName}</Text>
                                    <Text style={[styles.title, {marginTop: 5}]}>£{unitPrice}</Text>
                                </View>

                                <View style={{width: 65}}>
                                    <View style={styles.badgeContainer}>
                                        <Image source={require('../../assets/images/eye-icon.png')} style={[styles.badgeIcon, {height: 10}]} />
                                        <Text style={styles.badgeTxt}>{views}</Text>
                                    </View>
                                    <View style={styles.badgeContainer}>
                                        <Image source={require('../../assets/images/white-star.png')} style={styles.badgeIcon} />
                                        <Text style={styles.badgeTxt}>{this.state.starAvg}</Text>
                                    </View>
                                </View>

                            </View>

                            
                        </View>

                        <View style={styles.card}>
                            <Text style={styles.description}>
                                {description}
                            </Text>
                            {this.state.comments.length > 0 ?
                                <Swiper {...swiperOptions} containerStyle={{height: 165}}>
                                    {this.state.comments.map((item, i) =>
                                        <View style={[styles.swiperItem, {justifyContent: 'center', height: 165}]} key={i}>
                                            {renderStar(item.star)}
                                            <Text style={[styles.description, {marginHorizontal: 35, textAlign:'center'}]} numberOfLines={3}>{item.comment}</Text>
                                        </View>
                                    )}
                                </Swiper>
                                : null
                            }

                        </View>

                     </ScrollView>
                    <Button 
                        title={'Add To Cart'} 
                        txtStyle={{top:2}}
                        onPress={() => Store.addToCart(this.state.data)} />

                 </React.Fragment>
                }

            </View>
        )

    }

}

export default ProductDetail;