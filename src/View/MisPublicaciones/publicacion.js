import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {getImageUrl} from '../../Api/api';
import {
  obtenerTokenDeAcceso,
  obtenerYDecodificarToken,
} from '../../Models/token';

const PostListScreen = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const userData = await obtenerYDecodificarToken();
      const userId = userData ? userData.id : null;

      if (!userId) {
        setError('Error: No se pudo obtener el ID de usuario');
        setLoading(false);
        return;
      }

      const response = await axios.get(
        `https://qfrj5skv-8080.brs.devtunnels.ms/api/usuarios/${userId}/publicaciones`,
      );
      const data = response.data;

      if (data && Array.isArray(data)) {
        setPosts(
          data.map(item => ({
            ...item,
            source: {uri: getImageUrl(item.mascota.imagenPath)},
          })),
        );
        setLoading(false);
      } else {
        setError('Error: Formato de respuesta incorrecto');
        setLoading(false);
      }
    } catch (error) {
      console.error('Error al cargar las publicaciones:', error);
      setError(
        'Error al cargar las publicaciones. Por favor, inténtelo de nuevo más tarde.',
      );
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, []),
  );

  const handleRefresh = () => {
    setLoading(true);
    fetchData();
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity onPress={handleRefresh}>
            <Image
              source={require('../Navigation/icons/comentar.png')}
              style={{width: 30, height: 30, right:20}}
            />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation]);

  if (loading) {
    return <Text style={styles.loadingText}>Cargando...</Text>;
  }

  if (error) {
    return <Text style={styles.errorText}>{error}</Text>;
  }

  const renderItem = ({item}) => (
    <View style={styles.postContainer}>
      <Text style={styles.postTitle}>{item.titulo}</Text>
      <Text style={styles.postDescription}>{item.descripcion}</Text>
      <Image source={item.source} style={styles.postImage} />
      <Text style={styles.postContent}>{item.contenido}</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() =>
            navigation.navigate('PostComments', {postId: item.id})
          }>
          <Text style={styles.buttonText}>Comentarios</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() =>
            navigation.navigate('SeeAdoptersScreen', {postId: item.id})
          }>
          <Text style={styles.buttonText}>Adoptantes</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {posts.length > 0 ? (
        <FlatList
          data={posts}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.flatListContent}
        />
      ) : (
        <Text style={styles.noPostsText}>No hay publicaciones</Text>
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
  postContainer: {
    borderWidth: 1,
    borderColor: '#c0b0fa',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  postTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  postDescription: {
    fontSize: 16,
    marginBottom: 10,
  },
  postImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  postContent: {
    fontSize: 14,
    color: '#555',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    backgroundColor: '#6b61fc',
    padding: 10,
    borderRadius: 5,
    width: '48%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
  },
  noPostsText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
  },
});

export default PostListScreen;
