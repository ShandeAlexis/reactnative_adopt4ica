import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import axios from 'axios';
import {obtenerTokenDeAcceso} from '../../Models/token';

const SeeAdoptersScreen = ({route}) => {
  const {postId} = route.params;
  const [adopters, setAdopters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAdopters();
  }, []);

  const fetchAdopters = async () => {
    try {
      const token = await obtenerTokenDeAcceso();
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.get(
        `https://qfrj5skv-8080.brs.devtunnels.ms/api/adopciones/publicacion/${postId}`,
        config,
      );

      if (response.data && Array.isArray(response.data)) {
        setAdopters(response.data);
      } else {
        setError('Error: Formato de respuesta incorrecto');
      }

      setLoading(false);
    } catch (error) {
      console.error('Error al cargar los adoptantes:', error);
      setError(
        'Error al cargar los adoptantes. Por favor, inténtelo de nuevo más tarde.',
      );
      setLoading(false);
    }
  };

  const handleAccept = async adopcionId => {
    try {
      const token = await obtenerTokenDeAcceso();
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.put(
        `https://qfrj5skv-8080.brs.devtunnels.ms/api/adopciones/${adopcionId}/aceptar`,
        null,
        config,
      );
      if (response.status === 200) {
        Alert.alert('Éxito', 'Solicitud de adopción aceptada correctamente.');
        fetchAdopters();
      } else {
        Alert.alert('Error', 'No se pudo aceptar la solicitud de adopción.');
      }
    } catch (error) {
      console.error('Error al aceptar la solicitud de adopción:', error);
      Alert.alert(
        'Error',
        'Algo salió mal al intentar aceptar la solicitud de adopción.',
      );
    }
  };

  const handleReject = async adopcionId => {
    try {
      const token = await obtenerTokenDeAcceso();
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.put(
        `https://qfrj5skv-8080.brs.devtunnels.ms/api/adopciones/${adopcionId}/rechazar`,
        null,
        config,
      );
      if (response.status === 200) {
        Alert.alert('Éxito', 'Solicitud de adopción rechazada correctamente.');
        fetchAdopters();
      } else {
        Alert.alert('Error', 'No se pudo rechazar la solicitud de adopción.');
      }
    } catch (error) {
      console.error('Error al rechazar la solicitud de adopción:', error);
      Alert.alert(
        'Error',
        'Algo salió mal al intentar rechazar la solicitud de adopción.',
      );
    }
  };

  if (loading) {
    return <Text style={styles.loadingText}>Cargando adoptantes...</Text>;
  }

  if (error) {
    return <Text style={styles.errorText}>{error}</Text>;
  }

  const renderItem = ({item}) => (
    <View style={styles.adopterContainer}>
      <Text>Nombre: {item.usuario.nombre}</Text>
      <Text>Apellidos: {item.usuario.apellidos}</Text>
      <Text>DNI: {item.usuario.dni}</Text>
      <Text>Edad: {item.usuario.edad}</Text>
      <Text>Sexo: {item.usuario.sexo}</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, {backgroundColor: '#2ecc71'}]}
          onPress={() => handleAccept(item.id)}>
          <Text style={styles.buttonText}>Aceptar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, {backgroundColor: '#e74c3c'}]}
          onPress={() => handleReject(item.id)}>
          <Text style={styles.buttonText}>Rechazar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {adopters.length > 0 ? (
        <FlatList
          data={adopters}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={styles.flatListContent}
        />
      ) : (
        <Text style={styles.noAdoptersText}>
          No hay adoptantes para esta publicación
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    paddingTop: 20,
  },
  loadingText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
  },
  errorText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
    color: 'red',
  },
  flatListContent: {
    paddingBottom: 20,
  },
  adopterContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  button: {
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    width: '45%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
  },
  noAdoptersText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
  },
});

export default SeeAdoptersScreen;
