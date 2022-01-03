import {Dimensions, Image, Platform, StyleSheet, TouchableOpacity, View} from "react-native";
import * as React from "react";
import {hp, isiPAD, isX, normalize, wp} from "../../helper/responsiveScreen";
import Colors from "../../constants/Colors";

const customBackHeader = ({navigation =null}) => {
    return (
        <View style={styles.headerConatinerStyle}>
            <TouchableOpacity onPress={() => navigation && navigation.goBack()}>
                <View style={styles.backBtnContainer}>
                    <Image
                        source={require("../../assets/images/back-icon.png")}
                        style={styles.backIcon}
                    />
                </View>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    backBtnContainer:{
        borderColor: '#E8E8E8',
        borderWidth: 1,
        width: wp(6),
        height: wp(6),
        justifyContent: 'center',
        alignItems: 'center',
    },
    backIcon:{
        width: wp(4),
        height: wp(6),
        resizeMode:'contain'
    },
    headerConatinerStyle: {
        marginTop: Platform.OS === 'ios' ? hp(5) : hp(3),
        marginHorizontal: hp(2),
    },
});

export default React.memo(customBackHeader);