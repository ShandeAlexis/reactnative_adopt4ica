import React, {useState, useEffect} from 'react';
import {View, Text, FlatList, Image, StyleSheet} from 'react-native';
import {obtenerYDecodificarToken} from '../../Models/token';
import {getImageUrl} from '../../Api/api';
const MisSolicitudes = () => {
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSolicitudes = async () => {
      try {
        const userData = await obtenerYDecodificarToken();
        if (userData && userData.id) {
          const response = await fetch(
            `https://qfrj5skv-8080.brs.devtunnels.ms/api/adopciones/usuario/${userData.id}`,
          );
          const data = await response.json();
          setSolicitudes(data);
        }
      } catch (error) {
        console.error('Error al obtener las solicitudes de adopción:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSolicitudes();
  }, []);

  const renderSolicitud = ({item}) => (
    <View style={styles.solicitudContainer}>
      <Text style={styles.titulo}>{item.publicacion.titulo}</Text>
      <Text style={styles.nombreMascota}>
        {item.publicacion.mascota.nombre}
      </Text>
      <Image
        source={{uri: getImageUrl(item.publicacion.mascota.imagenPath)}}
        style={styles.imagenMascota}
      />
      <Text style={styles.fechaSolicitud}>
        {new Date(item.fechaSolicitud).toLocaleDateString()}
      </Text>
      <Text style={styles.estado}>{item.estado}</Text>
    </View>
  );

  if (loading) {
    return <Text>Cargando...</Text>;
  }

  return (
    <FlatList
      data={solicitudes}
      keyExtractor={item => item.id.toString()}
      renderItem={renderSolicitud}
      contentContainerStyle={styles.container}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  solicitudContainer: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  titulo: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  nombreMascota: {
    fontSize: 16,
  },
  imagenMascota: {
    width: '100%',
    height: 200,
    marginTop: 8,
    marginBottom: 8,
  },
  fechaSolicitud: {
    fontSize: 14,
    color: '#888',
  },
  estado: {
    fontSize: 14,
    color: '#888',
  },
});

export default MisSolicitudes;
