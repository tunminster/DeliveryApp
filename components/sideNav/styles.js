import vars from "../../utils/vars";

export default {
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    li: {
        height: 55,
        borderBottomWidth: 1,
        borderColor: 'rgba(0,0,0,0.1)',
        justifyContent: 'center',
        marginHorizontal: 15
    },
    txt: {
        color: vars.txtColor,
        fontSize: 17,
        fontFamily: vars.bold,
        fontWeight: '600'
    },
    head: {
        height: 170,
        backgroundColor: vars.baseColor,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20
    },
    name: {
        fontSize: 17,
        fontFamily: vars.bold,
        fontWeight: '600',
        color: '#fff',
        marginTop: 10
    }
}