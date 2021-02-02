import vars from '../../utils/vars';

export default {
    container: {
        flex: 1,
        backgroundColor: vars.bgColor,
    },
    card: {
        borderBottomWidth: 1,
        borderColor: 'rgba(0,0,0,0.2)',
        padding: 10,
        flexDirection: 'row',
        marginBottom: 5
    },
    img: {
        width: 100,
        height: 100,
        borderRadius: 50,
        resizeMode: 'cover',
        marginRight: 15
    },
    section: {
        marginTop: 10
    },
    divider: {
        height: 1,
        backgroundColor: 'rgba(0,0,0,0.2)',
        marginTop: 5
    },
    bold: {
        fontWeight: 'bold'
    },
    padding: {
        padding: 15
    },
    btnContainer: {
        transform: [{scale: 0.7}],
        flex: 1,
        alignItems: 'flex-end'
    }
}