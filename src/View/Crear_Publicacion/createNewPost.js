import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
  ScrollView,
  Platform,
  PermissionsAndroid,
} from "react-native";
import axios from "axios";
import { obtenerTokenDeAcceso } from "../../Models/token";
import { useNavigation } from "@react-navigation/native";
import { styles } from "./styles";
import { launchImageLibrary } from 'react-native-image-picker';

const CreateNewPost = () => {
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [contenido, setContenido] = useState("");
  const navigation = useNavigation();
  const [nombre, setNombre] = useState("");
  const [raza, setRaza] = useState("");
  const [edad, setEdad] = useState("");
  const [especie, setEspecie] = useState("");
  const [imagen, setImagen] = useState(null);
  const [imagenCargada, setImagenCargada] = useState(false);
  const [accessToken, setAccessToken] = useState("");
  const [userId, setUserId] = useState("");

  useEffect(() => {
    obtenerToken();
    requestPermissions();
  }, []);

  const requestPermissions = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          {
            title: "Permiso para acceder a la galería",
            message: "La aplicación necesita acceso a tu galería para seleccionar una imagen.",
            buttonNeutral: "Preguntar luego",
            buttonNegative: "Cancelar",
            buttonPositive: "OK"
          }
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          console.error("Permiso para acceder a la galería denegado");
        }
      } catch (err) {
        console.warn(err);
      }
    }
  };

  const obtenerToken = async () => {
    try {
      const token = await obtenerTokenDeAcceso();
      setAccessToken(token);

      // Decodificar el token manualmente
      const decodedToken = decodeToken(token);
      if (decodedToken) {
        setUserId(decodedToken.id); // Aquí obtienes el id del usuario
      } else {
        console.error("Error al decodificar el token");
      }
    } catch (error) {
      console.error("Error al obtener el token:", error);
    }
  };

  const decodeToken = (token) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error("Error al decodificar el token:", error);
      return null;
    }
  };

  const handlePets = async () => {
    const formDataMascota = new FormData();
    formDataMascota.append("nombre", nombre);
    formDataMascota.append("raza", raza);
    formDataMascota.append("edad", edad);
    formDataMascota.append("especie", especie);
  
    if (imagen) {
      formDataMascota.append("foto", {
        uri: imagen.uri,
        name: imagen.uri.split("/").pop(),
        type: "image/jpeg",
      });
    }
  
    try {
      // Primero, creamos la mascota
      const responseMascota = await axios.post(
        "https://qfrj5skv-8080.brs.devtunnels.ms/api/mascotas",
        formDataMascota,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
  
      const idMascota = responseMascota.data.id;
  
      // Luego, creamos la publicación usando el ID de la mascota creada
      const responsePublicacion = await axios.post(
        "https://qfrj5skv-8080.brs.devtunnels.ms/api/publicaciones/guardar",
        {
          titulo,
          descripcion,
          contenido,
          mascotaId: idMascota,
          usuarioId: userId,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
  
  
      clearData();
  
      Alert.alert(
        "Publicación Creada",
        "La publicación se ha creado correctamente"
      );
      
      navigation.navigate("Main");
    } catch (error) {
      console.error("Error al crear la publicación:", error);
      Alert.alert("Error", "Hubo un error al crear la publicación");
    }
  };
  
  const handleImagePicker = async () => {
    try {
      const result = await launchImageLibrary({ mediaType: 'photo' });
      if (!result.cancelled) {
        setImagen(result.assets[0]);
        setImagenCargada(true);
      }
    } catch (error) {
      console.error("Error al seleccionar la imagen:", error);
    }
  };
  
  const clearData = () => {
    setTitulo("");
    setDescripcion("");
    setContenido("");
    setNombre("");
    setRaza("");
    setEdad("");
    setEspecie("");
    setImagen(null);
    setImagenCargada(false);
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContent}>
      <View style={styles.container}>
        <Text style={styles.title}>Crear Publicación</Text>
        <TextInput
          style={styles.input}
          placeholder="Título"
          value={titulo}
          onChangeText={setTitulo}
        />
        <TextInput
          style={styles.input}
          placeholder="Descripción"
          value={descripcion}
          onChangeText={setDescripcion}
        />
        <TextInput
          style={[styles.input, { height: 100 }]}
          placeholder="Contenido"
          multiline
          value={contenido} 
          onChangeText={setContenido}
        />
        <TextInput
          style={styles.input}
          placeholder="Nombre de la mascota"
          value={nombre}
          onChangeText={setNombre}
        />
        <TextInput
          style={styles.input}
          placeholder="Raza"
          value={raza}
          onChangeText={setRaza}
        />
        <TextInput
          style={styles.input}
          placeholder="Especie"
          value={especie}
          onChangeText={setEspecie}
        />
        <TextInput
          style={styles.input}
          placeholder="Edad"
          value={edad}
          onChangeText={setEdad}
          keyboardType="numeric"
        />
        <TouchableOpacity
          style={styles.imagePickerButton}
          onPress={handleImagePicker}
        >
          <Text style={styles.imagePickerButtonText}>Seleccionar Imagen</Text>
        </TouchableOpacity>
        {imagen && <Image source={{ uri: imagen.uri }} style={styles.image} />}
        {imagenCargada && (
          <Text style={styles.successText}>
            ¡La imagen se ha cargado correctamente!
          </Text>
        )}
        <TouchableOpacity style={styles.saveButton} onPress={handlePets}>
          <Text style={styles.saveButtonText}>Publicar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default CreateNewPost;
