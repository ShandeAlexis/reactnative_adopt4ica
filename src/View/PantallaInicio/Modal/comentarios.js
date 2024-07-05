import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {obtenerYDecodificarToken} from '../../../Models/token';
import {getComments, addComment} from '../../../Api/api';
import {obtenerTokenDeAcceso} from '../../../Models/token';

const CommentsModal = ({visible, postId, onClose}) => {
  const [comments, setComments] = useState([]);
  const [email, setEmail] = useState('');
  const [nombre, setNombre] = useState('');
  const [cuerpo, setCuerpo] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (visible && postId) {
      fetchComments();
    }
  }, [visible, postId]);

  useEffect(() => {
    fetchUserDetails();
  }, []);

  const fetchComments = async () => {
    try {
      const commentsData = await getComments(postId);
      setComments(commentsData);
    } catch (error) {
      console.error('Error fetching comments:', error);
      setError(
        'Error al cargar los comentarios. Por favor, inténtelo de nuevo más tarde.',
      );
    }
  };

  const fetchUserDetails = async () => {
    try {
      const token = await obtenerTokenDeAcceso();
      const userData = await obtenerYDecodificarToken();
      if (userData) {
        setEmail(userData.sub);
        setNombre(userData.nombre);
      } else {
        console.warn('No se obtuvieron datos del usuario.');
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  const handleAddComment = async () => {
    if (!email || !nombre || !cuerpo) {
      console.error('Datos insuficientes para enviar el comentario:', {
        email,
        nombre,
        cuerpo,
      });
      return;
    }

    setLoading(true);
    try {
      const token = await obtenerTokenDeAcceso();
      const config = {
        headers: {Authorization: `Bearer ${token}`},
      };

      await addComment(postId, cuerpo, email, nombre, config);
      setCuerpo('');
      fetchComments();
    } catch (error) {
      console.error('Error adding comment:', error);
      console.error(
        'Error response data:',
        error.response ? error.response.data : 'No response data available',
      );
      setError(
        'Error al agregar el comentario. Por favor, inténtelo de nuevo más tarde.',
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    onClose();
  };

  return (
    <View style={[styles.container, visible ? styles.visible : styles.hidden]}>
      <View style={styles.modal}>
        <Text style={styles.title}>Comentarios</Text>
        <ScrollView style={styles.commentsContainer}>
          {comments.map(comment => (
            <View key={comment.id} style={styles.commentContainer}>
              <View style={styles.commentBody}>
                <Text style={styles.email}>{comment.email}</Text>
                <Text style={styles.commentText}>{comment.cuerpo}</Text>
              </View>
            </View>
          ))}
        </ScrollView>
        <TextInput
          style={styles.input}
          placeholder="Escribe un comentario"
          value={cuerpo}
          onChangeText={text => setCuerpo(text)}
        />
        <TouchableOpacity
          style={[styles.button, {backgroundColor: '#6960fc'}]}
          onPress={handleAddComment}
          disabled={loading}>
          <Text style={styles.buttonText}>
            {loading ? 'Agregando...' : 'Agregar Comentario'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, {backgroundColor: '#6960fc'}]}
          onPress={handleCloseModal}>
          <Text style={styles.buttonText}>Cerrar</Text>
        </TouchableOpacity>
        {error && <Text style={styles.error}>{error}</Text>}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: '#f1f1f1',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    maxHeight: '80%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  email: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  commentContainer: {
    marginBottom: 15,
  },
  commentBody: {
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
  },
  commentText: {
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  button: {
    marginBottom: 10,
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonSpacer: {
    height: 10,
  },
  visible: {
    display: 'flex',
  },
  hidden: {
    display: 'none',
  },
  error: {
    color: 'red',
    marginTop: 10,
  },
  commentsContainer: {
    maxHeight: '50%',
  },
});

export default CommentsModal;
