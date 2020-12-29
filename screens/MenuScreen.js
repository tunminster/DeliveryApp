import * as React from 'react';
import { View, Text, StyleSheet, Button, TextInput, TouchableOpacity, Alert } from "react-native";
import { AuthContext } from '../constants/Context';
import {storeData, retrieveData} from '../components/AuthKeyStorageComponent';
import { GetCategoryByParentId } from '../components/GetCategoryListComponent'
import { FlatList } from 'react-native-gesture-handler';
import sharedStyles from '../utils/sharedStyles';
import Loading from '../components/loading';


export const MenuScreen = ({ navigation }) => {
    const { signOut } = React.useContext(AuthContext);
    const  [getCategories, setCategories] = React.useState([]);
    const [getLoading, setLoading] = React. useState(true);
    state = {
      categories: [],
      loading: true
    };
    var STORAGE_KEY = 'id_token';

    // storeData(STORAGE_KEY, "Hello Saved")
    // .then((data) =>{
    //   const result = JSON.stringify(data);
    //   alert (result);
    // });
    
    React.useEffect(() =>{
      retrieveData(STORAGE_KEY)
        .then((data) => {
        
          GetCategoryByParentId(0, data)
          .then((result) => {
            setCategories(result);
            setLoading(false);
          });
          

        });

    }, []);
    
    
    //alert(" out put is: " + getCategories.length);
    // ToDo top categories menu
    return (
      <ScreenContainer>
      {
        getLoading ?
        <Loading />
        :
        <React.Fragment>
          <Text style={styles.headertext}>Menu</Text>
          <FlatList data={getCategories}
            keyExtractor={(item, index) => index.toString()} 
            renderItem={({item}) => 
            <TouchableOpacity style={styles.li} onPress={() => navigation.navigate('Products', {categoryId: item.id})}>
              <Text style={sharedStyles.txt}>{item.categoryName}</Text>
          </TouchableOpacity>
          }
          />
        </React.Fragment>
      }

      </ScreenContainer>

    
    );
  };  

// class MenuScreen extends React.Component{
//   state = {
//     categories: []
//   };

//   componentDidMount(){
//     var STORAGE_KEY = 'id_token';

       
//         retrieveData(STORAGE_KEY)
//         .then((data) => {
         
//           GetCategoryByParentId(0, data)
//           .then((result) => {
//             this.setState({categories: result});
//             })
//           });
//   }

//   render(){
//     <ScreenContainer>
//       <Text>MenuScreen</Text>
//       <FlatList
//           data={this.state.categories}
//           keyExtractor={(item, index) => index.toString()}
//           renderItem={({item}) =>
//               <TouchableOpacity  onPress={() => this.props.navigation.navigate('CategoryDetail', {categoryId: item.Id})}>
//                   <Text >{item.CategoryName}</Text>
//               </TouchableOpacity>
//           }
//       />

//     </ScreenContainer>
//   }

// }

// export default MenuScreen;


  




  const ScreenContainer = ({ children }) => (
    <View style={styles.container}>{children}</View>
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      //alignItems: "center"
    },
    button: {
      paddingHorizontal: 20,
      paddingVertical: 10,
      marginVertical: 10,
      borderRadius: 5
    },
    li: {
      flex: 1,
      height: 55,
      backgroundColor: '#fff',
      borderBottomWidth: 1,
      borderColor: 'rgba(0,0,0,0.3)',
      justifyContent: 'center',
      paddingLeft: 10
    },
    headertext:{
      fontWeight: "bold",
      fontSize:30,
      textAlign: "center",
      marginBottom:10
    }
  });


  const loginstyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#003f5c',
      alignItems: 'center',
      justifyContent: 'center',
    },
    header:{
      fontSize:35,
      color:"#fb5b5a",
      marginBottom:40
    },
    logo:{
      fontWeight:"bold",
      fontSize:50,
      color:"#fb5b5a",
      marginBottom:40
    },
    inputView:{
      width:"80%",
      backgroundColor:"#465881",
      borderRadius:25,
      height:50,
      marginBottom:20,
      justifyContent:"center",
      padding:20
    },
    inputText:{
      height:50,
      color:"white"
    },
    forgot:{
      color:"white",
      fontSize:11
    },
    loginBtn:{
      width:"80%",
      backgroundColor:"#fb5b5a",
      borderRadius:25,
      height:50,
      alignItems:"center",
      justifyContent:"center",
      marginTop:40,
      marginBottom:10
    },
    loginText:{
      color:"white"
    },
    loginError:{
      color: "red",
      marginBottom:10
    }
  });