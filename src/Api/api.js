import axios from 'axios';
import {Alert} from 'react-native';

const api = axios.create({
  baseURL: 'https://qfrj5skv-8080.brs.devtunnels.ms/api/',
  headers: {
    'Content-Type': 'application/json',
  },
});

const handleAxiosError = error => {
  Alert.alert('Error', 'Las credenciales son incorrectas', [
    {text: 'OK', onPress: () => console.log(error)},
  ]);
};

export const getImageUrl = imagePath => {
  return `https://qfrj5skv-8080.brs.devtunnels.ms/api/mascotas/images/${imagePath}`;
};

export const createData = async (endpoint, data) => {
  try {
    const response = await api.post(endpoint, data);
    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
};

export const getData = async endpoint => {
  try {
    const response = await api.get(endpoint);
    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
};

export const updateData = async (endpoint, data, config) => {
  try {
    const response = await api.put(endpoint, data, config);
    return response.data;
  } catch (error) {
    console.error('Error en la solicitud PUT:', error);
    handleAxiosError(error);
  }
};

export const deleteData = async endpoint => {
  try {
    const response = await api.delete(endpoint);
    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
};

export const getComments = async postId => {
  if (!postId) {
    console.error('Error: postId is null or undefined');
    return;
  }

  try {
    const response = await api.get(`publicaciones/${postId}/comentarios`);
    return response.data;
  } catch (error) {
    console.error(`Error en la solicitud GET:`, error.message);
    if (error.response) {
      console.log('Error Response Data:', error.response.data);
    }
    handleAxiosError(error);
  }
};

export const addComment = async (postId, cuerpo, email, nombre, config) => {
  try {
    const response = await api.post(
      `publicaciones/${postId}/comentarios`,
      {cuerpo, email, nombre},
      config,
    );
    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
};

export default api;
