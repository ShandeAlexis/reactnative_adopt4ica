import React from 'react';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {StyleSheet, View, Text, Image} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {drawerStyles} from './styles';
import LoginScreen from '../Login/LoginScreen';
import RegisterScreen from '../Register/RegisterScreen';
import Main from '../PantallaInicio/Main/index';
import FavoritePetsScreen from '../Favoritos/Favorite';
import Profile from '../Perfil/perfil';
import CreatePostScreen from '../MisPublicaciones/publicacion';
import CreateNewPost from '../Crear_Publicacion/createNewPost';
import {eliminarTokenDeAcceso} from '../../Models/token';
import PostComments from '../MisPublicaciones/postComments';
import CreateNewComment from '../MisPublicaciones/createNewComment';
import MisSolicitudes from '../MisSolicitudes/misSolicitudes';
import SeeAdoptersScreen from '../MisPublicaciones/seeAdopters';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

function CustomDrawerContent(props) {
  return (
    <DrawerContentScrollView {...props}>
      <View style={drawerStyles.drawerHeader}>
        <Image
          source={require('../../../assets/Logo-drawer.png')}
          style={drawerStyles.drawerHeaderImage}
        />
      </View>
      <DrawerItemList {...props} />
      <DrawerItem
        label="Cerrar sesión"
        onPress={() => handleLogout(props.navigation)}
        icon={({focused, color, size}) => (
          <Image
            source={require('./icons/cerrar.png')}
            style={{width: 30, height: 30}}
          />
        )}
      />
    </DrawerContentScrollView>
  );
}

const handleLogout = navigation => {
  eliminarTokenDeAcceso()
    .then(() => {
      navigation.navigate('Login');
    })
    .catch(error => {
      console.error('Error al cerrar sesión:', error);
    });
};

function DrawerNavigator() {
  return (
    <Drawer.Navigator
      initialRouteName="Main"
      drawerContent={props => <CustomDrawerContent {...props} />}>
      <Drawer.Screen
        name="Inicio"
        component={Main}
        options={{
          drawerIcon: ({focused, color, size}) => (
            <Image
              source={require('./icons/main.png')}
              style={{width: 30, height: 30}}
            />
          ),
          ...drawerStyles.drawerHeaderOptions,
        }}
      />
      <Drawer.Screen
        name="Perfil"
        component={Profile}
        options={{
          drawerIcon: ({focused, color, size}) => (
            <Image
              source={require('./icons/editar.png')}
              style={{width: 30, height: 30}}
            />
          ),
          ...drawerStyles.drawerHeaderOptions,
        }}
      />
      <Drawer.Screen
        name="Mis publicaciones"
        component={CreatePostScreen}
        options={{
          drawerIcon: ({focused, color, size}) => (
            <Image
              source={require('./icons/publicaciones.png')}
              style={{width: 30, height: 30}}
            />
          ),
          ...drawerStyles.drawerHeaderOptions,
        }}
      />
      <Drawer.Screen
        name="Nueva Publicación"
        component={CreateNewPost}
        options={{
          drawerIcon: ({focused, color, size}) => (
            <Image
              source={require('./icons/agregar.png')}
              style={{width: 30, height: 30}}
            />
          ),
          ...drawerStyles.drawerHeaderOptions,
        }}
      />
      <Drawer.Screen
        name="Favoritos"
        component={FavoritePetsScreen}
        options={{
          drawerIcon: ({focused, color, size}) => (
            <Image
              source={require('./icons/favorito.png')}
              style={{width: 30, height: 30}}
            />
          ),
          ...drawerStyles.drawerHeaderOptions,
        }}
      />

      <Drawer.Screen
        name="Mis solicitudes"
        component={MisSolicitudes}
        options={{
          drawerIcon: ({focused, color, size}) => (
            <Image
              source={require('./icons/enviar.png')}
              style={{width: 30, height: 30}}
            />
          ),
          ...drawerStyles.drawerHeaderOptions,
        }}
      />
    </Drawer.Navigator>
  );
}

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerStyle: drawerStyles.drawerHeaderOptions.headerStyle,
          headerTintColor: drawerStyles.drawerHeaderOptions.headerTintColor,
          headerTitleStyle: drawerStyles.drawerHeaderOptions.headerTitleStyle,
        }}>
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Main"
          component={DrawerNavigator}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="PostComments"
          component={PostComments}
          options={{title: false}}
        />
        <Stack.Screen
          name="CreateNewComment"
          component={CreateNewComment}
          options={{title: false}}
        />
        <Stack.Screen
          name="SeeAdoptersScreen"
          component={SeeAdoptersScreen}
          options={{title: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
