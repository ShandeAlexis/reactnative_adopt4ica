import AsyncStorage from '@react-native-async-storage/async-storage';

export const guardarTokenDeAcceso = async (token: string) => {
  try {
    await AsyncStorage.setItem('@tokenDeAcceso', token);
  } catch (error) {
    console.error('Error al guardar el token de acceso:', error);
  }
};

export const obtenerTokenDeAcceso = async () => {
  try {
    const token = await AsyncStorage.getItem('@tokenDeAcceso');
    return token;
  } catch (error) {
    console.error('Error al obtener el token de acceso:', error);
    return null;
  }
};

export const eliminarTokenDeAcceso = async () => {
  try {
    await AsyncStorage.removeItem('@tokenDeAcceso');
  } catch (error) {
    console.error('Error al eliminar el token de acceso:', error);
  }
};

export const decodificarToken = (token: string) => {
  try {
    const [headerEncoded, payloadEncoded, signature] = token.split('.');
    const payload = JSON.parse(atob(payloadEncoded));
    return payload;
  } catch (error) {
    console.error('Error al decodificar el token:', error);
    return null;
  }
};

export const obtenerYDecodificarToken = async () => {
  try {
    const token = await obtenerTokenDeAcceso();
    if (token) {
      const userData = decodificarToken(token);
      return userData;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error al obtener y decodificar el token:', error);
    return null;
  }
};
