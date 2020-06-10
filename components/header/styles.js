import vars from '../../utils/vars';

export default {
    header: {
        height: vars.isIos ? 65  : 55,
        backgroundColor: '#fff',
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
        shadowOpacity: 0.2,
        shadowOffset: {x: 0, y: 2},
        shadowRadius: 4,
        elevation: 3
    },
    title: {
        fontFamily: vars.bold,
        fontSize: 24,
        color: vars.txtColor,
        flex: 1,
        marginLeft: 9
    },
    close: {
        width: 25, height: 25,
        marginLeft: 15
    }
}