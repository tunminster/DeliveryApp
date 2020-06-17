import vars from "../../utils/vars";

export default {
    container: {
        backgroundColor: vars.bgColor,
        flex: 1
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