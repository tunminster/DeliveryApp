import vars from '../../utils/vars';

export default {
    container: {
        backgroundColor: vars.bgColor,
        flex: 1
    },
    head: {
        backgroundColor: vars.baseColor,
        height: 190,
        justifyContent: 'center',
        alignItems: 'center',
    },
    name: {
        color: '#fff',
        fontSize: 23,
        marginTop: 15,
        fontFamily: vars.bold
    },
    btnContainer: {
        height: 130,
        justifyContent: 'center',
        alignItems: 'center'
    },
    btnImg: {
        width: 65,
        height: 65,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: vars.baseColor,
        borderRadius: 35
    },
    btnIcon: {
        fontFamily: vars.bold,
        color: vars.txtColor,
        fontSize: 35
    }
}