import * as React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Button,
    TouchableOpacity,
    Image,
    TouchableWithoutFeedback,
    Keyboard,
    Dimensions,
    Platform
} from "react-native";
import { AuthContext } from '../constants/Context';
import { UserInterfaceIdiom } from 'expo-constants';
import { wp, hp, normalize, isX, isIOS, isiPAD } from '../helper/responsiveScreen';
import Custominput from '../components/textinput';
import CustomButton from '../components/loginbutton';
import vars from '../utils/vars';
import { GoogleSignin } from '@react-native-community/google-signin'
import { LoginManager, AccessToken } from 'react-native-fbsdk'
import Loading from '../components/loading';
import Colors from '../constants/Colors'
import SmartScrollView from '../components/SmartScrollView'
import { appleAuth } from '@invertase/react-native-apple-authentication';
import jwt_decode from 'jwt-decode';
import CustomBackHeader from "../components/header/customBackHeader";

export const ForgotPasswordScreen = ({ navigation }) => {

    const [email, setEmail] = React.useState("");


    const clickOnSendOTP = () => {
        var pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);

        if (email === null || email === '') {
            // setEmailError("Enter a valid email.");
            alert("Enter an email.");
        }
        else if (!pattern.test(email)) {
            alert("Enter a valid email.")
        } else {
            navigation.navigate('OtpVerification')
        }

    }

    return (
        <SmartScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.mainContainer}
            applyKeyboardCheck={Platform.OS === 'ios'}
            disabled={false}
            alwaysBounceVertical={false} >
            <CustomBackHeader navigation={navigation}/>
            <View style={{ marginVertical: isiPAD ? hp(3) : hp(4), alignItems: 'center' }}>
                <Image source={require('../assets/images/logo.png')} style={styles.logo} />
            </View>
            <View style={{ justifyContent: 'center', alignItems: 'center', }}>
                <Text style={styles.titleText}>{vars.forgotScreenTitle}</Text>
                <Text style={styles.captionText}>{vars.forgotScreenCaption}</Text>
                <Custominput
                    placeholder="Email Address"
                    placeholderTextColor="rgba(0,0,0,0.32)"
                    style
                    icon={require('../assets/images/mail.png')}
                    onChangeText={text => setEmail( text )}
                    autoCorrect={false}
                />

                <CustomButton
                    onPress={clickOnSendOTP}
                    title={'Send OTP'}
                />
                {/*<Text style={styles.account}>Already have an Account?*/}
                {/*    <TouchableOpacity onPress={() => navigation.push("SignIn")}>*/}

                {/*        <Text style={styles.signup}> Sign In</Text>*/}
                {/*    </TouchableOpacity>*/}
                {/*</Text>*/}

            </View>
            <Image source={require('../assets/images/Background.png')} resizeMode='stretch' style={isX ? isiPAD ? styles.backgroundimg : styles.backgroundimg1 : styles.backgroundimg} />
        </SmartScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    button: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        marginVertical: 10,
        borderRadius: 5
    },
    titleText:{
        marginTop:'3%',
        width:'90%',
        fontSize:normalize(22),
        fontWeight:'bold'
    },
    captionText:{
        //marginTop:'3%',
        width:'90%',
        fontSize:normalize(14),
        opacity:0.5,
        marginVertical:'3%'
    },
    mainContainer: {
        flex: 1,
        backgroundColor: Colors.white,
        paddingTop: isX ? isiPAD ? hp(0) :  hp(4) : hp(0),
        minHeight: Dimensions.get('window').height - hp(4)
    },
    account: {
        fontFamily: 'Roboto-Regular',
        fontSize: normalize(14),
        color: '#777777',

    },
    signup: {
        fontSize: normalize(14),
        fontFamily: 'Roboto-Medium',
        color: '#FE595E',
        top: 3,
    },
    logo: {
        resizeMode: 'stretch',
        width: wp(30),
        height: wp(30)
    },
    backgroundimg: {
        width: wp(100),
        height: hp(22),
    },
    backgroundimg1: {
        width: wp(100),
        height: hp(22),
        position: 'absolute',
        bottom: 0
    },
});



export default ForgotPasswordScreen;