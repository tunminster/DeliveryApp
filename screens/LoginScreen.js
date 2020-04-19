
import * as React from 'react';
import { View, Text, StyleSheet, Button } from "react-native";

import { AuthContext } from '../constants/Context';

export const SignIn = ({navigation}) => {
    const {signIn} = React.useContext(AuthContext);

    return(
        <ScreenContainer>
            <Text>Sign In Screen</Text>
            <Button title="Sign In" onPress={() => signIn()} />
            <Button
                title="Create Account"
                onPress={() => navigation.push("CreateAccount")}
            />
        </ScreenContainer>
    );

};

export const CreateAccount = () => {
    const { signUp} = React.useContext(AuthContext);

    return (
        <ScreenContainer>
            <Text> Create Account Screen</Text>
            <Button title="Sign Up" onPress={ () => signUp()} />
        </ScreenContainer>
    );
};

export const Splash = () => (
    <ScreenContainer>
      <Text>Loading...</Text>
    </ScreenContainer>
  );


  export const Profile = ({ navigation }) => {
    const { signOut } = React.useContext(AuthContext);
  
    return (
      <ScreenContainer>
        <Text>Profile Screen</Text>
        <Button title="Drawer" onPress={() => navigation.toggleDrawer()} />
        <Button title="Sign Out" onPress={() => signOut()} />
      </ScreenContainer>
    );
  };  


  const ScreenContainer = ({ children }) => (
    <View style={styles.container}>{children}</View>
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center"
    },
    button: {
      paddingHorizontal: 20,
      paddingVertical: 10,
      marginVertical: 10,
      borderRadius: 5
    }
  });