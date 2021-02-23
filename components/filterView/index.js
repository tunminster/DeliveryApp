import React, { Component } from 'react';
import { Text, Image, TouchableOpacity, View, Modal, ScrollView } from 'react-native';
import styles from './styles';
import { wp, hp, normalize } from '../../helper/responsiveScreen'
import Colors from '../../constants/Colors'
import Button from '../../components/button';
import CheckBoxView from '../../components/checkBoxView';
import { lowerCase } from '../../utils/helpers'

class FilterView extends Component {

    render() {
        const { filterModalVisible, onFilterCancelPress, onClearPress, filterValue, onRadioBtnPress,
            categoriesData, storeType, onCategoryPress, onDonePressHandler } = this.props;
        return (
            <Modal
                transparent={true}
                animationType={'none'}
                visible={filterModalVisible}>
                <View style={styles.modelContainer}>
                    <View style={styles.modelChildContainer}>
                        <TouchableOpacity onPress={() => onFilterCancelPress()} style={styles.closeView} >
                            <Image source={require('../../assets/images/close_fill_icon.png')}
                                style={styles.closeIcon} />
                        </TouchableOpacity>
                        <View style={styles.modelHeaderView}>

                            <Text style={{ ...styles.modelHeaderTitle, alignSelf: 'center', marginLeft: wp(35) }}>Filters</Text>

                            <View style={styles.clearView} >
                                <Button
                                    onPress={() => onClearPress()}
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
                            onPress={() => onRadioBtnPress('distance')} />
                        <View style={styles.modelSeperateLine} />
                        <CheckBoxView
                            active={filterValue === 'recommended'}
                            image={''}
                            title={'Recommended'}
                            onPress={() => onRadioBtnPress('recommended')} />

                        <Text style={{ ...styles.modelHeaderTitle, marginTop: hp(4), marginBottom: hp(2) }}>Categories</Text>
                        <View style={styles.modelSeperateLine} />

                        <ScrollView style={{ flex: 1, marginBottom: hp(10) }} showsVerticalScrollIndicator={false}>
                            <View style={styles.modelSection}>

                                {categoriesData && categoriesData.map((item, i) =>
                                    <View key={i}>
                                        <CheckBoxView
                                            active={storeType.length != 0 && storeType.includes(lowerCase(item.storeTypeName))}
                                            image={''}
                                            title={item.storeTypeName}
                                            isCheckBox={true}
                                            onPress={() => onCategoryPress(lowerCase(item.storeTypeName))}
                                        />
                                        <View style={styles.modelSeperateLine} />
                                    </View>
                                )}
                            </View>
                        </ScrollView>

                        <View style={styles.btnContainer}>
                            <Button
                                onPress={() => onDonePressHandler()}
                                title={'Done'}
                                style={styles.btn}
                            />
                        </View>

                    </View>
                </View>
            </Modal>

        )
    }
}

export default FilterView;
