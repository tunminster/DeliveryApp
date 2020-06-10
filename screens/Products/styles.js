import vars from "../../utils/vars";

export default {
    container: {
        flex: 1,
        backgroundColor: vars.bgColor
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        flexWrap: 'wrap'
    },
    filterIcon: {
        width: 35,
        height: 35,
        resizeMode: 'contain',
        marginRight: 15,
        top: 15
    },
    filterContainer: {
        flexDirection: 'row',
        paddingBottom: 3,
        height: 55,
    }
}