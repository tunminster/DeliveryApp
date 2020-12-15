import React, {Component} from 'react';
import {StyleSheet,TouchableOpacity,Text} from 'react-native';
import {wp,hp,normalize} from '../../helper/responsiveScreen'


export default class CustomButton extends Component{
    render(){
        const {onPress,title}=this.props;
        return(
            <TouchableOpacity onPress={onPress} style={styles.btn}>
                <Text style={styles.loginText}>{title}</Text>
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