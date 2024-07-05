import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
} from 'react-native';
import axios from 'axios';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const PostComments = ({route}) => {
  const {postId} = route.params;
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    try {
      const response = await axios.get(
        `https://qfrj5skv-8080.brs.devtunnels.ms/api/publicaciones/${postId}/comentarios`,
      );
      setComments(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error al cargar los comentarios:', error);
      setError(
        'Error al cargar los comentarios. Por favor, inténtelo de nuevo más tarde.',
      );
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchComments();
    setRefreshing(false);
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity
            onPress={() => navigation.navigate('CreateNewComment', {postId})}>
            <Icon name="add" size={25} color="#000" style={{marginRight: 10}} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleRefresh}>
            <Icon name="refresh" size={25} color="#000" />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation, postId]);

  if (loading) {
    return <Text>Cargando comentarios...</Text>;
  }

  if (error) {
    return <Text>{error}</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Comentarios de la publicación</Text>
      <ScrollView
        contentContainerStyle={styles.commentsContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }>
        {comments.map(comment => (
          <View key={comment.id} style={styles.comment}>
            <Text style={styles.commentName}>{comment.nombre}</Text>
            <Text style={styles.commentText}>{comment.cuerpo}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  commentsContainer: {
    paddingBottom: 20,
  },
  comment: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#fff',
  },
  commentName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  commentText: {
    fontSize: 16,
  },
});

export default PostComments;
