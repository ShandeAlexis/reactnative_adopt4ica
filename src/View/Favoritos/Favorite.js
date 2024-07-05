import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { obtenerYDecodificarToken } from '../../Models/token';
import { getImageUrl } from '../../Api/api';
import { obtenerTokenDeAcceso } from '../../Models/token';

const FavoritosScreen = () => {
  const [favoritos, setFavoritos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [usuarioId, setUsuarioId] = useState(null);

  useEffect(() => {
    const obtenerDatosDeUsuario = async () => {
      const userData = await obtenerYDecodificarToken();
      if (userData && userData.id) {
        const idUsuario = userData.id;
        setUsuarioId(idUsuario);
        cargarFavoritos(idUsuario);
      } else {
        console.error('No se pudo obtener el usuario desde el token.');
      }
    };

    obtenerDatosDeUsuario();
  }, []);

  const cargarFavoritos = async idUsuario => {
    try {
      const response = await fetch(
        `https://qfrj5skv-8080.brs.devtunnels.ms/api/favoritos/usuario/${idUsuario}`,
      );
      const data = await response.json();
      setFavoritos(data);
      setLoading(false);
    } catch (error) {
      console.error('Error al cargar favoritos:', error);
      setLoading(false);
    }
  };

  const handleSolicitudAdopcion = async (publicacionId, favoritoId) => {
    try {
      const token1 = await obtenerTokenDeAcceso();
      console.log(
        'Enviando solicitud de adopción para usuarioId:',
        usuarioId,
        'y publicacionId:',
        publicacionId,
      );

      const requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token1}`,
        },
        body: JSON.stringify({
          usuarioId: usuarioId,
          publicacionId: publicacionId,
        }),
      };

      const response = await fetch(
        'https://qfrj5skv-8080.brs.devtunnels.ms/api/adopciones/solicitar',
        requestOptions,
      );

      if (response.ok) {
        console.log('Solicitud de adopción enviada correctamente.');
        Alert.alert('Bien', 'Solicitud enviada correctamente');
        eliminarFavorito(favoritoId); // Llamar al método para eliminar el favorito
      } else {
        throw new Error('Error al enviar la solicitud de adopción.');
      }
    } catch (error) {
      console.error('Error al enviar la solicitud de adopción:', error);
    }
  };

  const eliminarFavorito = async favoritoId => {
    try {
      const token1 = await obtenerTokenDeAcceso();
      console.log('Eliminar favorito con favoritoId:', favoritoId);

      const myHeaders = new Headers();
      myHeaders.append("Authorization", `Bearer ${token1}`);

      const requestOptions = {
        method: "DELETE",
        headers: myHeaders,
        redirect: "follow"
      };

      const response = await fetch(
        `https://qfrj5skv-8080.brs.devtunnels.ms/api/favoritos/eliminar/${favoritoId}`,
        requestOptions
      );

      if (response.ok) {
        console.log('Favorito eliminado correctamente.');
        // Actualizar la lista de favoritos
        setFavoritos(favoritos.filter(fav => fav.id !== favoritoId));
      } else {
        throw new Error('Error al eliminar el favorito.');
      }
    } catch (error) {
      console.error('Error al eliminar el favorito:', error);
    }
  };

  const renderFavoritePetItem = ({ item }) => (
    <TouchableOpacity style={styles.petItemContainer}>
      <Image
        source={{ uri: getImageUrl(item.publicacion.mascota.imagenPath) }}
        style={styles.petImage}
      />
      <Text style={styles.petName}>{item.publicacion.titulo}</Text>
      <Text style={styles.petDescription}>{item.publicacion.descripcion}</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => handleSolicitudAdopcion(item.publicacion.id, item.id)}>
          <Text style={styles.buttonText}>🐾 Solicitar adopción</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => eliminarFavorito(item.id)}>
          <Text style={styles.buttonText}>❌ Eliminar</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Cargando favoritos...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={favoritos}
        renderItem={renderFavoritePetItem}
        keyExtractor={item => item.id.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  petItemContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f0f0',
    padding: 10,
    margin: 5,
    borderRadius: 10,
  },
  petImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 10,
  },
  petName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  petDescription: {
    fontSize: 14,
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 10,
  },
  button: {
    backgroundColor: '#DDDDDD',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 14,
  },
});

export default FavoritosScreen;
