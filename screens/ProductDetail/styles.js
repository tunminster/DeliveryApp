import vars from "../../utils/vars";

export default {
    container: {
        flex: 1,
        backgroundColor: vars.bgColor
    },
    card: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        elevation: 3,
        backgroundColor: '#fff',
        padding: 10,
        marginBottom: 15
    },
    cardFooter: {
        minHeight: 70,
        borderTopWidth: 1,
        borderColor: 'rgba(0,0,0,0.1)',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: 10,
        marginTop: 10,
    },
    title: {
        fontFamily: vars.bold,
        fontWeight: '600',
        color: '#333',
        fontSize: 18
    },
    badgeContainer: {
        width: 65,
        height: 25,
        marginTop: 5,
        borderRadius: 3,
        flexDirection: 'row',
        backgroundColor: vars.baseColor,
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 5
    },
    badgeTxt: {
        color: '#fff',
        fontSize: 13,
        fontFamily: vars.bold,
        fontWeight: '400'
    },
    badgeIcon: {
        width: 25,
        height: 15,
        resizeMode: 'contain'
    },
    productImage: {
        width: 200,
        height: 200,
        resizeMode: 'contain',
    },
    swiperItem: {
        height: 235,
        alignItems: 'center'
    },
    dot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: vars.baseColor,
        backgroundColor: 'transparent'
    },
    activeDot: {
        backgroundColor: vars.baseColor
    },
    chevron: {
        width: 18,
        resizeMode: 'contain',
    },
    star: {
        width: 28,
        height: 28,
        margin: 5
    },
    starContainer: {
        flexDirection: 'row',
        marginBottom: 10,
    },
    description: {
        color: '#333',
        fontSize: 14,
        fontFamily: vars.bold,
        fontWeight: '400',
    }
}