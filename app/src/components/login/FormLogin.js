import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';

import Colors from '../../constants/colors';
import Ingresar from '../base/CustomButtom';
import MessageBox from '../base/MessageBox';

const styles = StyleSheet.create({
  container: {
    padding: 40,
    paddingTop: 0,
  },
  input: {
    height: 45,
    paddingLeft: 10,
    backgroundColor: Colors.white2,
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    color: Colors.main,
    shadowOpacity: 0.2,
    shadowRadius: 2.22,
    elevation: 1,
    marginBottom: 10,
    borderRadius: 5,
  },
  message: {
    borderRadius: 5,
    marginBottom: 10,
    paddingLeft: 20,
    paddingVertical: 10,
  },
});

function FormLogin({ handleLogin }) {
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const onSubmit = () => {
    setLoading(true);
    setErrorMessage('');
    handleLogin({ user, pass }, setLoading, setErrorMessage, setDone);
  };

  let secondInput = null;

  return (
    <View style={styles.container}>
      <MessageBox
        style={styles.message}
        opacity={errorMessage ? 1 : 0}
        message={errorMessage}
        type={'error'}
      />
      <TextInput
        name="user"
        value={user}
        placeholder="Usuario"
        placeholderTextColor={Colors.main}
        style={styles.input}
        editable={!loading}
        onChangeText={text => setUser(text)}
        returnKeyType={'next'}
        onSubmitEditing={() => {
          secondInput.focus();
        }}
        blurOnSubmit={false}
        autoCapitalize={'none'}
      />

      <TextInput
        name="pass"
        value={pass}
        secureTextEntry={true}
        placeholder={'Contraseña'}
        editable={!loading}
        onChangeText={text => setPass(text)}
        placeholderTextColor={Colors.main}
        style={styles.input}
        ref={input => {
          secondInput = input;
        }}
      />

      <Ingresar
        title={'Ingresar'}
        done={done}
        loading={loading}
        onPress={onSubmit}
        style={{ marginTop: 20 }}
      />
    </View>
  );
}

FormLogin.propTypes = {
  handleLogin: PropTypes.func.isRequired,
};

export default FormLogin;
