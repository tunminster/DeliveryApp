import Api from '../api';
import AuthStore from '../store/auth';
import {AsyncStorage} from 'react-native';
// import NavigationService from '../../utils/navigationService';

function loginSuccess(data){
    console.log(data);
    AuthStore.setUser(data);
    AsyncStorage.setItem('token', data.token.toString());
    // NavigationService.navigate('Home');
    AuthStore.setIsLogin(true);
}

function register(data){
    const {email, name, password} = data;
    if(email && name && password){
        Api.post('/auth/register', data)
            .then(res => loginSuccess({...res.user, token: res.token}))
            .catch(err => {
                console.log(err.response.data);
                if(err.response.data.msg.code == 11000)
                    return alert('This email already registered');
                return alert('Error');
            });
    }else{
        alert('Warning');
    }
}

function login(data){
    Api.post('/auth/login', data).then(res => loginSuccess({...res.user, token: res.token}))
        .catch(err => alert('Check email or password'));
}

export default{
    register,
    login,
    loginSuccess
}
