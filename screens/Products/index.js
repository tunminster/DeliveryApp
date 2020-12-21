import * as React from 'react';
import { View, Text, StyleSheet, Button, TextInput,Image, Input, TouchableOpacity, Alert, AsyncStorage, ActivityIndicator} from "react-native";
import { AuthContext } from '../../constants/Context';
import {storeData, retrieveData} from '../../components/AuthKeyStorageComponent';
import { GetCategoryByParentId } from '../../components/GetCategoryListComponent'
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import sharedStyles from '../../utils/sharedStyles';
import {BackIcon} from "../../components/backIcon";
import ProductCard from "../../components/productCard";
import { apisAreAvailable } from 'expo';
import Api from '../../config/api';
import { searchFilter } from "../../utils/helpers";
import styles from './styles';
import Loading from '../../components/loading';
var uuid = require('react-native-uuid');


class ProductScreen extends React.Component{

    // static navigationOptions = ({navigation}) => ({
    //     title: 'Hello products',
    //     headerLeft: <BackIcon navigation={navigation} />
       
    // });

   

    state = {
        products: [],
        loading: true,
        modalVisible: false,
        categoryIdId: 0
    };

    // constructor(props){
    //     super(props);
       
    // }

    componentDidMount(){
        console.log("The category Id: " + this.props.route.params.categoryId);
        const categoryId = this.props.route.params.categoryId;
        var STORAGE_KEY = 'id_token';
        
        //const token = AsyncStorage.getItem(STORAGE_KEY);

        

        retrieveData(STORAGE_KEY)
        .then((data) => {
            let guid = uuid.v1();
            console.log('uuid.....order', guid)
            const config = {
                headers: { Authorization: 'Bearer ' + data,'Requested-Id': guid}
            };
    
            if(categoryId){
                Api.get('/product/getProductByCategoryId/' + categoryId, config).then(res => {
                    console.log(res);
                    this.setState({ loading: false, products: res ? res : []});
                });
    
    
            }

        });

        
        
    }

    render() {
        //const { navigate } = this.props.navigation;
        const {products, search} = this.state;
        return (
            
            
            <View style={styles.container}>
                {
                    this.state.loading ?
                        // <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                        //     <ActivityIndicator color={'#fff'} size={'large'} />
                        // </View>
                        <Loading />
                    :
                    <React.Fragment>
                        <ScrollView showsVerticalScrollIndicator={false}>

                            <View style={styles.row}>
                                { this.state.products ? this.state.products.map((product, i) =>
                                    <ProductCard data={product}  />
                                    //<Text>{product.productName}</Text>
                                ): null}
                            </View>

                        </ScrollView>
                    </React.Fragment>
                }
                
            </View>
        )
    }

}

export default ProductScreen;