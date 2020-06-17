import vars from "../../utils/vars";

export default {
    item: {
        height: 95,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderColor: 'rgba(0,0,0,0.2)',
        padding: 8,
        paddingLeft: 15
    },
    title: {
        fontSize: 20,
        fontFamily: vars.bold,
        color: '#333',
        fontWeight: '500',
        marginBottom: 3
    },
    description: {
        fontSize: 15,
        fontFamily: vars.bold,
        color: '#333',
        fontWeight: '300'
    },
    check: {
        width: 15, height: 15,
        position: 'absolute',
        top: 10, right: 15
    }
}