import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import {UseAuth} from '../hooks/UseAuth.ts';
import {Link} from '@react-navigation/native';

export const Register: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] =
    useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState<Date | null>('');
  const [userName, setUserName] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState<JSX.Element | string>('');
  const [loading, setLoading] = useState(false);
  const {register} = UseAuth();

  const handlePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handlePasswordConfirmationVisibility = () => {
    setShowPasswordConfirmation(!showPasswordConfirmation);
  };

  const handleRegister = () => {
    setLoading(true);
    register(
      email,
      password,
      firstName,
      lastName,
      dateOfBirth,
      passwordConfirmation,
      userName,
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.registerCenter}>
        <View style={styles.card}>
          <Text style={styles.title}>Inscription</Text>
          {successMessage && (
            <Text style={styles.successMessage}>{successMessage}</Text>
          )}
          {errorMessage && (
            <Text style={styles.errorMessage}>{errorMessage}</Text>
          )}

          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <View style={styles.row}>
            <TextInput
              style={[styles.input, styles.halfInput]}
              placeholder="Prénom"
              value={firstName}
              onChangeText={setFirstName}
            />
            <TextInput
              style={[styles.input, styles.halfInput]}
              placeholder="Nom"
              value={lastName}
              onChangeText={setLastName}
            />
          </View>

          <TextInput
            style={styles.input}
            placeholder="Pseudo"
            value={userName}
            onChangeText={setUserName}
          />

          <TextInput
            style={styles.input}
            placeholder="Date de naissance"
            value={dateOfBirth}
            onChangeText={setDateOfBirth}
          />
          <View style={styles.row}>
            <View style={styles.passwordInput}>
              <TextInput
                style={styles.input}
                placeholder="Mot de passe"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity onPress={handlePasswordVisibility}>
                <Text>{showPassword ? 'Hide' : 'Show'}</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.passwordInput}>
              <TextInput
                style={styles.input}
                placeholder="Confirmation du mot de passe"
                value={passwordConfirmation}
                onChangeText={setPasswordConfirmation}
                secureTextEntry={!showPasswordConfirmation}
              />
              <TouchableOpacity onPress={handlePasswordConfirmationVisibility}>
                <Text>{showPasswordConfirmation ? 'Hide' : 'Show'}</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.checkboxContainer}>
            <Text>
              J'ai lu et accepte <Link to="/">les Conditions générales</Link> de
              service SplitWise
            </Text>
          </View>

          {loading ? (
            <ActivityIndicator size="large" color="#139194" />
          ) : (
            <Button title="Inscription" onPress={handleRegister} />
          )}

          <Link to="/login">
            <Text>Se connecter</Text>
          </Link>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  registerCenter: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '80%',
  },
  card: {
    width: '100%',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  successMessage: {
    color: 'green',
    marginBottom: 10,
  },
  errorMessage: {
    color: 'red',
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 4,
    paddingLeft: 8,
    marginBottom: 15,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    width: '48%',
  },
  passwordInput: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 4,
    paddingLeft: 8,
    marginBottom: 15,
    width: '48%',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
});
