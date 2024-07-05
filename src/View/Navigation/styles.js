import {StyleSheet} from 'react-native';

export const drawerStyles = StyleSheet.create({
  drawerHeader: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  drawerHeaderImage: {
    width: 250,
    height: 140,
    borderRadius: 70,
  },
  drawerHeaderText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  drawerHeaderOptions: {
    headerStyle: {
      backgroundColor: '#6960fc',
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'bold',
    },
  },
});
