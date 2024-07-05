import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  image: {
    width: '100%',
    height: 200,
    margin: 20,
    alignSelf: 'center',
    borderWidth: 2,
    borderColor: '#c0b0fa',
    borderRadius: 10,
  },
  imagePickerButton: {
    backgroundColor: '#7d6cba',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    margin: 10,
  },
  imagePickerButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  successText: {
    color: '#2ecc71',
    textAlign: 'center',
    marginTop: 10,
    fontWeight: 'bold',
  },
  buttonContainer: {
    marginTop: 20,
  },
  saveButton: {
    backgroundColor: '#52408d',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    margin: 10,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
});
