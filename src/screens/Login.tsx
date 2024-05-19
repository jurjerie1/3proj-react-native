import React, { useState } from 'react';
import { Alert, Button, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { UseAuth } from '../hooks/UseAuth';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { axiosUtils } from '../Utils/axiosUtils.ts';

// Type pour la navigation
type LoginScreenNavigationProp = NavigationProp<any, 'Register'>;

export const Login = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('mobileMDP1!');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const { ApiPost } = axiosUtils();

  const { login } = UseAuth();
  const navigation = useNavigation<LoginScreenNavigationProp>();

  const handlePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const ForgotPassword = async (email: string) => {
    try {
      console.log('Request Body:', { email });
      return await ApiPost('Users/forgot-password', {
        email: email,
      });
    } catch (error) {
      console.error('An unexpected error occurred:', error);
      return { success: false, message: 'An unexpected error occurred.' };
    }
  };

  const handleLogin = async () => {
    setLoading(true);
    try {
      const result = await login(email, password);
      if (result && result.success) {
        setSuccessMessage(result.message);
        setErrorMessage('');
      } else if (result) {
        setErrorMessage(result.message);
      }
    } catch (error) {
      setErrorMessage('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    setModalVisible(true);
  };

  const sendForgotPasswordRequest = async () => {
    try {
      const result = await ForgotPassword(email);
      if (result.status = 200) {
        Alert.alert('Success', result.message);
      } else {
        Alert.alert('Error', 'An unexpected error occurred.');
      }
    } catch (error) {
      console.error('An unexpected error occurred:', error);
    } finally {
      setModalVisible(false);
    }
  };


  return (
      <View style={styles.container}>
        <Text style={styles.title}>Login</Text>
        {errorMessage && <Text style={styles.error}>{errorMessage}</Text>}
        <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
        />
        <View style={styles.passwordContainer}>
          <TextInput
              style={styles.passwordInput}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
          />
          <TouchableOpacity
              onPress={handlePasswordVisibility}
              style={styles.passwordToggle}>
            <Text style={styles.toggleText}>
              {showPassword ? 'Hide' : 'Show'}
            </Text>
          </TouchableOpacity>
        </View>
        <Button title="Login" onPress={handleLogin} disabled={loading} />
        <View style={styles.buttonContainer}>
          <Button
              title="Forgot Password"
              onPress={handleForgotPassword}
              disabled={loading}
          />
          <Button
              title="Don't have an account? Register"
              onPress={() => navigation.navigate('register')}
          />
        </View>
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              setModalVisible(false);
            }}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Forgot Password</Text>
              <TextInput
                  style={styles.modalInput}
                  placeholder="Email"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
              />
              <View style={styles.modalButtons}>
                <Button title="Cancel" onPress={() => setModalVisible(false)} />
                <Button title="Send" onPress={sendForgotPasswordRequest} />
              </View>
            </View>
          </View>
        </Modal>
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  passwordInput: {
    flex: 1,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 8,
  },
  passwordToggle: {
    padding: 8,
  },
  toggleText: {
    color: 'blue',
  },
  error: {
    color: 'red',
    marginBottom: 12,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 20,
    width: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  modalInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 8,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
