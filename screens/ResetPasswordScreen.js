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
import { CommonActions } from "@react-navigation/native";

import { wp, hp, normalize, isX, isIOS, isiPAD } from '../helper/responsiveScreen';
import Custominput from '../components/textinput';
import CustomBackHeader from '../components/header/customBackHeader';
import CustomButton from '../components/loginbutton';
import vars from '../utils/vars';
import { GoogleSignin } from '@react-native-community/google-signin'
import { LoginManager, AccessToken } from 'react-native-fbsdk'
import Loading from '../components/loading';
import Colors from '../constants/Colors'
import SmartScrollView from '../components/SmartScrollView'
import { appleAuth } from '@invertase/react-native-apple-authentication';
import jwt_decode from 'jwt-decode';

export const ResetPasswordScreen = ({ navigation,route }) => {
    const { VerifyOTPResetPassword } = React.useContext(AuthContext);
    const [isLoading, setLoading] = React.useState(false);
    const [password, setPassword] = React.useState("");
    const [confirmPassword, setConfirmPassword] = React.useState("");


    const onClickResetPassword = () => {

        if (password == null || password === '') {

            // setPasswordError("Enter a valid password");
            alert("Enter a password.")
        }
        else if (confirmPassword == null || confirmPassword === '') {
            alert("Enter a Confrim password.")
        }
        else if (confirmPassword !== password) {
            // setPasswordError("confirm password is not match.");
            alert("Password mismatch.");
        }
        else if ( password != null && confirmPassword !== null ) {
            const body= {
                "email": route?.params?.email,
                "code": route?.params?.otpCode,
                "password": password,
                "confirmPassword": confirmPassword
            }
            setLoading(true);
            VerifyOTPResetPassword(body).then((res)=>{
                setLoading(false);
                if(res?.status === 'approved' ){
                    alert('Successfully password changed')
                    navigation.dispatch(
                        CommonActions.reset({
                            index: 0,
                            routes: [{ name: "SignIn" }],
                        })
                    );
                }
                else if(res?.errors[0].message !==''){
                    alert(res.errors[0].message)
                } else  {
                    alert('OTP verification failed')
                }
            }).catch((error)=>{
                alert('OTP verification failed')
                setLoading(false)
            })


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
                <Text style={styles.titleText}>{vars.resetPasswordScreenTitle}</Text>
                <Text style={styles.captionText}>{vars.resetPasswordScreenCaption}</Text>
                <Custominput
                    password
                    placeholder="Password"
                    placeholderTextColor="rgba(0,0,0,0.32)"
                    style
                    icon={require('../assets/images/lock.png')}
                    onChangeText={text => setPassword(text)}
                    autoCorrect={false}
                />

                <Custominput
                    password
                    placeholder="Confirm Password"
                    placeholderTextColor="rgba(0,0,0,0.32)"
                    style
                    icon={require('../assets/images/lock.png')}
                    onChangeText={text => setConfirmPassword(text)}
                    autoCorrect={false}
                />
                <CustomButton
                    onPress={onClickResetPassword}
                    title={'Reset Password'}
                    isDisable={isLoading}
                    isLoading={isLoading}
                />

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



export default ResetPasswordScreen;