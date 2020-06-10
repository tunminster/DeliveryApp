import { AsyncStorage } from 'react-native';
import {observable, action} from 'mobx';
import { AuthActions} from '../actions';

class AuthStore{
    @observable isLogin = false;
    @observable user = {};

    @action setIsLogin(val){
        this.isLogin = val;
    }

    @action setUser(data){
        this.user = data;
    }

    @action register(data){
        AuthActions.register(data);
    }

    @action login(data){
        AuthActions.login(data);
    }

    @action addAddress(data){
        this.user.address.push(data);
        AsyncStorage.setItem('user', JSON.stringify(this.user));
    }

    @action removeAddress(id){
        this.user.address = this.user.address.map(x => x.id !== id);
        AsyncStorage.setItem('user', JSON.stringify(this.user));
    }

}

export default new AuthStore();
