import vars from "./vars";

export default {
    container: {
        padding: 9,
        paddingVertical: 15,
        flex: 1,
        backgroundColor: vars.bgColor
    },
    wrapper: {
        backgroundColor: vars.bgColor,
        flex: 1
    },
    shadow: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        elevation: 3,
    },
    avatar: {width: 70, height: 70, resizeMode: 'cover', borderRadius: 35},
    section: {
        height: 'auto',
        margin: 15,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        elevation: 3,
        backgroundColor: '#fff',
    },
    li: {
        height: 45,
        borderBottomWidth: 1,
        borderColor: 'rgba(0,0,0,0.2)',
        padding: 10,
        alignItems: 'center',
        flexDirection: 'row',
        backgroundColor: '#fff'
    },
    txt: {
        fontSize: 16,
        //fontFamily: vars.bold,
        fontWeight: '500',
        color: '#333'
    },
    subTitle: {
        fontSize: 16,
        fontFamily: vars.bold,
        fontWeight: '500',
        color: vars.txtColor,
        marginTop: 5,
        marginLeft: 15
    },
    stars: {
        flexDirection: 'row'
    }
}