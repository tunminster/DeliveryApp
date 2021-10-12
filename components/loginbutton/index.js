import React, {Component} from 'react';
import {StyleSheet,TouchableOpacity,Text,ActivityIndicator} from 'react-native';
import {wp,hp,normalize} from '../../helper/responsiveScreen'


export default class CustomButton extends Component{
    render(){
        const {onPress,title, isDisable = false,isLoading = false }=this.props;
        return(
            <TouchableOpacity disabled={isDisable} onPress={onPress} style={[styles.btn,isDisable && {opacity:0.5}]}>
                {(isLoading && isDisable) ?  <ActivityIndicator color={'white'} size={'large'}/>  : <Text style={styles.loginText}>{title}</Text>}
            </TouchableOpacity>
        )
    }
}

const styles=StyleSheet.create({
    btn:{
      width:wp(90),
      backgroundColor:"#FE595E",
      borderRadius:normalize(6),
      alignItems:"center",
      justifyContent:"center",
      padding:wp(1),
      marginBottom:hp(1)
    },
    loginText:{
        fontSize:normalize(29),
        fontFamily:'Roboto-Bold',
        color:'#FFFFFF'
      },
})