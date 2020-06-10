import { NavigationActions } from 'react-native-navigation';

let _navigator;

function setTopLevelNavigator(navigatorRef) {
    _navigator = navigatorRef;
}

function navigate(routeName, params) {
    _navigator.dispatch(
        NavigationActions.navigate({
            routeName,
            params,
        })
    );
}

function goBack(routeName, params) {
    _navigator.dispatch(
        NavigationActions.goBack({
            routeName,
            params,
        })
    );
}

function closeDrawer() {
    _navigator._navigation.closeDrawer();
}

export default {
    navigate,
    setTopLevelNavigator,
    closeDrawer,
    goBack
};