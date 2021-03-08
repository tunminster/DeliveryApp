import React, { Component } from 'react';
import { Text, TouchableOpacity, Image, View, Button } from 'react-native';
import styles from './styles';
import sharedStyles from '../../utils/sharedStyles';
import Store from '../../config/store';
import vars from '../../utils/vars';
//import sharedStyles from "../../utils/sharedStyles";
//import {fixImgPath} from '../../utils/helpers';

class ProductCard extends Component {
    render() {
        const { id, productName, unitPrice, description, productImageUrl } = this.props.data;
        // const id = 1;
        // const productName = "test";

        return (

            <View style={styles.card, sharedStyles.shadow, this.props.style}>
                <View style={{ alignItems: 'center', marginBottom: 15, marginTop: 15 }}>
                    <Image source={{ uri: productImageUrl }} style={styles.img} />
                </View>
                <Text style={styles.itemName} numberOfLines={2}>{productName}</Text>
                <Text style={styles.itemDesc} numberOfLines={5}>{description}</Text>
                <Text style={[styles.itemName, { marginTop: 10, fontWeight: '800' }]}>
                    <Text>
                        <Text>{vars.currency (unitPrice / 100).toFixed(2)}</Text>
                    </Text>
                </Text>

                <View>
                    <TouchableOpacity style={sharedStyles.shadow, this.props.style} onPress={() => {Store.addToCart(this.props.data)}}>
                        <View style={styles.button}>
                            <Text style={styles.buttonText} >
                                Add to Cart
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>




            // <TouchableOpacity style={styles.card, sharedStyles.shadow, this.props.style}>
            //     <View style={{alignItems: 'center', marginBottom:15, marginTop:15}}>
            //         <Image source={{uri: 'https://static.wixstatic.com/media/71ac99_cf0381fa9e3343a69c047e2b7f5f59ce~mv2_d_2668_2648_s_4_2.png'}} style={styles.img} />
            //     </View>
            //     <Text style={styles.itemName} numberOfLines={2}>{productName}</Text>
            //     <Text style={styles.itemDesc} numberOfLines={5}>{description}</Text>
            //     <Text style={[styles.itemName, {marginTop: 10, fontWeight: '800'}]}>
            //         <Text>
            //             <Text>£{unitPrice}</Text>
            //         </Text>
            //     </Text>



            //     <View>
            //         <TouchableOpacity style={sharedStyles.shadow, this.props.style} onPress={() => Store.addToCart(this.props.data)}>
            //             <View style={styles.button}>
            //                 <Text style={styles.buttonText} >
            //                     Add to Cart
            //                 </Text>
            //             </View>
            //         </TouchableOpacity>
            //     </View>
            // </TouchableOpacity>



            // <TouchableOpacity 
            //     // onPress={() => {
            //     //     this.props.onPress && this.props.onPress();
            //     //     this.props.navigation.navigate({
            //     //         routeName: 'ProductDetail',
            //     //         params: { id: _id},
            //     //         key: 'ProductDetail' + id
            //     //     })
            //     // }}
            //     //style={[styles.card, sharedStyles.shadow, this.props.style]} 
            //     >

            //     <Text style={styles.itemName} numberOfLines={2}>{productName}</Text>


            // </TouchableOpacity>
        )
    }


}

export default ProductCard;