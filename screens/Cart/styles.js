import vars from '../../utils/vars';

export default {
    container: {
        flex: 1,
        backgroundColor: vars.bgColor
    },
    card: {
        backgroundColor: '#fff',
        padding: 10,
    },
    cardFooter: {
        height: 45,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: 'rgba(0,0,0,0.19)',
        marginTop: 15,
        justifyContent: 'flex-end',
        flexDirection: 'row',
        alignItems: 'center'
    },
    incrementBtn: {
        backgroundColor: vars.baseColor,
        width: 30,
        height: 21,
        justifyContent: 'center',
        alignItems: 'center'
    },
    btnLeft: {
        borderTopLeftRadius: 15,
        borderBottomLeftRadius: 15,
        marginRight: 10,
    },
    btnRight: {
        borderTopRightRadius: 15,
        borderBottomRightRadius: 15,
        marginLeft: 10
    },
    row: {
        flexDirection: 'row'
    },
    whiteTxt: {
        color: '#fff'
    },
    txt: {
        fontFamily: vars.bold,
        fontSize: 14,
        color: '#333'
    },
    price: {
        fontFamily: vars.bold,
        fontSize: 14,
        color: '#333',
        textAlign: 'right',
        marginRight: 5
    },
    img: {
        width: 80,
        height: 80,
        borderRadius: 40,
        resizeMode: 'cover',
    },
    viewBtn: {
        marginRight: 15,
        backgroundColor: vars.baseColor,
        justifyContent: 'center',
        alignItems: 'center',
        width: 120,
        height: 30
    },
    delete: {
        backgroundColor: '#d63f2f'
    }
}