import React, {Component} from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import styles from './styles';
import Store from '../../config/store';
import {observer} from 'mobx-react'

@observer
class Card extends Component{
    render(){
        const { index, data } = this.props;
        return (
            <View style={styles.card}>
                <View style={[styles.row, {justifyContent: 'space-between'}]}>
                    <View style={{marginRight: 5}}>
                        {/* <Image source={{uri: data.images[0]}} style={styles.img} /> */}
                        <Image source={{uri: 'https://static.wixstatic.com/media/71ac99_cf0381fa9e3343a69c047e2b7f5f59ce~mv2_d_2668_2648_s_4_2.png'}} style={styles.img} />
                    </View>

                    <View style={{width: '71%'}}>
                        <View>
                            <Text style={styles.txt} numberOfLines={3}>{data.productName}</Text>
                            <View style={[styles.row, {marginTop: 20}]}>
                                <TouchableOpacity onPress={() => data.count > 1 && Store.updateCardItem(index, -1)} style={[styles.incrementBtn, styles.btnLeft]}>
                                    <Text style={styles.whiteTxt}>-</Text>
                                </TouchableOpacity>
                                <Text style={{top:2}}>{data.count}</Text>
                                <TouchableOpacity onPress={() => Store.updateCardItem(index, 1)} style={[styles.incrementBtn, styles.btnRight]}>
                                    <Text style={styles.whiteTxt}>+</Text>
                                </TouchableOpacity>

                            </View>

                        </View>
                        <Text style={styles.price}>
                            £{(data.unitPrice / 100).toFixed(2)}
                        </Text>

                    </View>
                </View>

                <View style={styles.cardFooter}>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate({
                            routeName: 'ProductDetail', params: {id: data.id}, key: 'ProductDetail' + data.id
                        })} style={styles.viewBtn}>
                            <Text style={styles.whiteTxt}>View</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => Store.removeFromCart(index)} style={[styles.viewBtn, styles.delete]}>
                            <Text style={styles.whiteTxt}>Delete</Text>
                        </TouchableOpacity>
                    </View>

            </View>
        )
    }
}

export default Card;
