import React, { Component } from 'react';
import { Text, Image, TouchableOpacity, View, Modal, ImageBackground, TouchableWithoutFeedback, ScrollView } from 'react-native';
import styles from './styles';
import { wp, hp, normalize } from '../../helper/responsiveScreen'
import Colors from '../../constants/Colors'
import Button from '../../components/button';
import vars from '../../utils/vars';
import Store from "../../config/store";
import CheckBoxView from '../checkBoxView';

class MenuDetailView extends Component {
    constructor (props){
        super(props)
        this.state={
            productMeatOptions: [],
        }
    }
    render() {
        const { menuDetailVisible, onMenuDetailCancelPress, menuDetaildata, menuDetailCount,
            onUpdateCountPress, onAddBasketPress, onUpdateMeatOptionPress } = this.props;
        return (
            <Modal
                transparent={true}
                animationType={'none'}
                visible={menuDetailVisible} >
                <View style={styles.modelContainer}>
                    <View style={styles.modelChildContainer}>
                        <View style={{ flex: 1, marginTop: hp(0.7),paddingHorizontal: wp(4), marginBottom: hp(9) }} showsVerticalScrollIndicator={false}>
                        <ImageBackground
                                    source={{ uri: menuDetaildata.productImageUrl }}
                                    resizeMode='cover'
                                    style={styles.modalRestaurantImage} 
                                    imageStyle={{ borderRadius: wp(2) }}>
                                    <TouchableOpacity onPress={() => onMenuDetailCancelPress()}
                                        style={styles.modalCancelView} >
                                        <Image source={require('../../assets/images/close_fill_icon.png')}
                                            style={{
                                                width: wp(7.5),
                                                height: wp(7.5), 
                                            }} />
                                    </TouchableOpacity>
                                </ImageBackground>   
                        <ScrollView
                            style={styles.optionsView}>
                            <View>
                                <View style={{ flexDirection: 'row', marginVertical: hp(1), justifyContent: 'space-between' }}>
                                    <Text style={{ ...styles.restaurantTitle, fontWeight: 'bold' }}>
                                        {menuDetaildata.productName}</Text>
                                    <Text style={{ ...styles.restaurantSubTitle, color: Colors.gray, marginRight: wp(2), fontWeight: '700' }}>
                                        {`${Store?.remoteConfig?.currency} ${(menuDetaildata.unitPrice / 100).toFixed(2)}`}</Text>
                                </View>
                                <Text style={{ ...styles.restaurantSubTitle, color: Colors.gray }}>{menuDetaildata.description}</Text>
                            </View>
                            <View>
                            {menuDetaildata.productMeatOptions.map((item, index) =>
                                    <View key={index}>
                                        
                                            <View style={styles.modalMenuTitle}>
                                                <Text style={{ ...styles.mainOptionTitle }}>{item.optionText}</Text> 
                                                {item.optionControl==1&&<Text style={{ ...styles.mainOptionRequired }}>{"Required*"}</Text>}
                                            </View>
                                        {
                                            item.productMeatOptionValues.map((valueItem, valueIndex)=>
                                            <View key={valueItem.meatOptionValueId}>
                                            <TouchableWithoutFeedback
                                              onPress={() => onUpdateMeatOptionPress(!valueItem?.selected, item.meatOptionId, valueItem.meatOptionValueId)} >
                                              <View style={styles.mainOptionView}>
                                                <Text style={{ ...styles.mainOptionTitle,flex:0.7, color: Colors.light_text_color}}>{valueItem.optionValueText}</Text>
                                                <CheckBoxView
                                                active={valueItem?.selected}
                                                image={''}
                                                title={'$'+valueItem.additionalPrice}
                                                isCheckBox={item.optionControl==2}
                                                container={{paddingHorizontal: wp(1), paddingVertical: wp(1.5), flex:0.2}}
                                                  onPress={() => onUpdateMeatOptionPress(!valueItem?.selected, item.meatOptionId, valueItem.meatOptionValueId)} 
                                              />
                                              </View>
                                            </TouchableWithoutFeedback>
                                            </View>
                                            
                                            )
                                        }
                                        
                                    </View>
                            )}
                            </View>
                            </ScrollView>

                        </View>
                        <View style={styles.btnCountContainer}>
                                <TouchableOpacity onPress={() => menuDetailCount > 1 && onUpdateCountPress(-1)} >
                                    <Image source={require('../../assets/images/minus_icon.png')}
                                        style={styles.modelPlusIcon} />
                                </TouchableOpacity>
                                <Text style={styles.modelCountText}>{menuDetailCount}</Text>
                                <TouchableOpacity onPress={() => onUpdateCountPress(1)}>
                                    <Image source={require('../../assets/images/plus_icon.png')}
                                        style={styles.modelPlusIcon} />
                                </TouchableOpacity>
                            </View>            
                        <View style={styles.btnContainer}>
                            <View style={{ ...styles.modelSeperateLine, marginBottom: hp(1) }} />
                            <Button
                                onPress={() => onAddBasketPress(menuDetaildata)}
                                title={'Add to Basket'}
                                style={styles.btn}
                            />
                        </View>
                    </View>
                </View>
            </Modal>

        )
    }
}

export default MenuDetailView;
