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
import OTPInputView from '@twotalltotems/react-native-otp-input'
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
import {RequestEmailOTP} from "../components/RequestEmailOTP";

export const OtpVerificationScreen = ({ navigation,route = {} }) => {
    const { VerifyEmailOTP,signUp,ForgotPasswordOTP } = React.useContext(AuthContext);
    const [OTPCode, setOTPCode] = React.useState("");
    const [isLoading, setLoading] = React.useState(false);

    const clickOnOTPVerify = () => {

        if (OTPCode === null || OTPCode === '') {
            // setEmailError("Enter a valid email.");
            alert("Enter an OTP Code");
        } else if (OTPCode.length !== 6) {
            alert("Enter a valid email.")
        } else {
            if(route?.params?.isRegister){

                const body= {
                    "email": route?.params?.registerData?.email,
                    "code": OTPCode
                }
                setLoading(true);
                VerifyEmailOTP(body).then((res)=> {
                    setLoading(false);

                    if(res?.status === "approved"){
                        signUp(body.email, route?.params?.registerData?.password, route?.params?.registerData?.confirmPassword);
                    } else {
                        alert('OTP verification failed')
                    }

                }).catch(()=>setLoading(false));
                // navigation.navigate('SignIn')
            } else {
                navigation.navigate('ResetPassword',{email:route?.params?.email,otpCode:OTPCode})
            }

        }

    }
    console.log(OTPCode.length !== 6)

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
            <View style={{  alignItems: 'center' }}>
                <Text style={styles.titleText}>{vars.otpScreenTitle}</Text>
                <Text style={styles.captionText}>{vars.otpScreenCaption}</Text>
                {/*<Custominput*/}
                {/*    placeholder="Email Address"*/}
                {/*    placeholderTextColor="rgba(0,0,0,0.32)"*/}
                {/*    style*/}
                {/*    icon={require('../assets/images/mail.png')}*/}
                {/*    onChangeText={text => setEmail({ email: text })}*/}
                {/*    autoCorrect={false}*/}
                {/*/>*/}
                <OTPInputView
                    style={{width: '90%', height: '15%'}}
                    pinCount={6}
                    code={OTPCode}
                    keyboardType={"number-pad"}
                    // code={this.state.code} //You can supply this prop or not. The component will be used as a controlled / uncontrolled component respectively.
                    // onCodeChanged = {code => { this.setState({code})}}
                    autoFocusOnLoad
                    codeInputFieldStyle={styles.underlineStyleBase}
                    codeInputHighlightStyle={styles.underlineStyleHighLighted}
                    onCodeChanged={(text) =>setOTPCode(text)}
                    // onCodeFilled={() =>
                    //     this.setState({
                    //         isDisable: false,
                    //     })
                    // }
                />

                <Text style={[styles.account,{marginVertical:'5%'}]}>Didn't get the Code?
                    <TouchableOpacity onPress={() =>{
                        if(route?.params?.isRegister){
                            RequestEmailOTP(route?.params?.email).then(()=>{
                                alert('Successfully Resent otp.')
                            })
                        } else {
                            ForgotPasswordOTP(route?.params?.email).then(()=>{
                                alert('Successfully Resent otp.')
                            })
                        }
                    }}>

                        <Text style={styles.signup}> Resend</Text>
                    </TouchableOpacity>
                </Text>

                <CustomButton
                    onPress={clickOnOTPVerify}
                    title={'Verify'}
                    isDisable={isLoading || OTPCode.length !== 6}
                    isLoading={isLoading}
                />

            </View>
            <View style={{flex:1}}/>
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
    borderStyleBase: {
        width: 30,
        height: 45
    },

    borderStyleHighLighted: {
        borderColor: "#03DAC6",
    },
    underlineStyleBase: {
        height: wp(12),
        width: wp(12.5),
        borderBottomWidth: 1,
        borderTopWidth: 0,
        borderLeftWidth: 0,
        borderRightWidth: 0,
        color : '#363636',
        fontWeight: '700',
        fontSize : 18
    },

    underlineStyleHighLighted: {
        borderColor: "#03DAC6",
    },
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



export default OtpVerificationScreen;