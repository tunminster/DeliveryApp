import {observable, action, toJS} from 'mobx';
import {cacheCart} from '../../utils/helpers';

class Store{
    @observable productCategories = [];
    @observable currentRoute = '';
    @observable cart = [];
    @observable cartCount = 0;
    @observable popularProducts = [];
    @observable allProducts = [];
    @observable addBasket = [];

    @action setCurrentRoute(route) {
        this.currentRoute = route;
    }

    @action addToCart(data) {
        let existData = this.cart.find(x => x.id === data.id);
        if (existData) {
            // existData.count += 1;
        } else {
            data.count = 1;
            this.cart.push(data);
        }
        this.setCartCount(1);
        cacheCart(this.cart, this.cartCount);
    }

    @action removeFromCart(index) {
        this.setCartCount(-this.cart[index].count);
        this.cart.splice(index, 1);
        cacheCart(this.cart, this.cartCount);
    }
    @action setCart(data) {
        this.cart = data;
    }
    @action setCartCount(count) {
        this.cartCount += count;
    }
    @action updateCardItem(i, val) {
        this.cart[i].count += val;
        this.setCartCount(val);
    }
    @action resetCartCount() {
        this.cartCount = 0;
    }

    @action setPopularProducts(data) {
        this.popularProducts = data;
    }
    @action setProductCategories(data) {
        this.productCategories = data;
    }
    @action setAllProducts(data) {
        this.allProducts = data;
    }

}
 
export default new Store();