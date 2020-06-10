import vars from "../../utils/vars";

export default {
    card: {
        backgroundColor: '#fff',
        height: 230,
        width: '46%',
        marginVertical: 8,
        marginTop:50,
        justifyContent: 'center'
    },
    title: {
        margin: 10,
        color: vars.txtColor,
        marginBottom: 5
    },
    img: {
        width: 120,
        height: 120,
        resizeMode: 'contain',
    },
    itemName: {
        color: vars.txtColor,
        fontSize: 15,
        marginLeft: 15,
        marginTop: 3,
        fontFamily: vars.bold,
        fontWeight: '500'
    },
    itemDesc:{
        color: vars.txtColor,
        fontSize: 10,
        marginTop: 5,
        marginLeft:15,
        width: 170
    },
    button: {
        backgroundColor: '#ff8c00',
        paddingVertical: 12,
        paddingHorizontal: 25,
        borderRadius: 25,
        marginTop:5,
        width: '80%'
    },
    buttonText: {
        color: '#fff',
        fontSize: 18
    }
}