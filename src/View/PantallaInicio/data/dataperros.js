import {useState, useEffect} from 'react';
import {getData, getImageUrl} from '../../../Api/api';

export const usePets = () => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const data = await getData('publicaciones');
        if (data && data.contenido) {
          setPets(
            data.contenido.map(item => ({
              id: item.id,
              name: item.mascota.nombre,
              source: {uri: getImageUrl(item.mascota.imagenPath)},
            })),
          );
        } else {
          throw new Error(
            'Error',
            'Estructura de datos inesperada en la respuesta',
          );
        }
      } catch (error) {
        console.error('Error al obtener los datos:', error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchPets();
  }, []);

  return {pets, setPets, loading, error};
};
