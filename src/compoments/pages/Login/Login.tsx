import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { UseAuth } from "../../../hooks/UseAuth.ts";
// Importez d'autres composants React Native selon les besoins

// import { UseAuth } from '../../../hooks/UseAuth.ts'; // Assurez-vous d'importer UseAuth depuis le bon chemin

export const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false);

    // Assurez-vous d'initialiser UseAuth correctement selon votre implémentation
    const { login, loginWithGoogle } = UseAuth();

    const handlePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    // const handleGoogleLogin = async (credentialResponse) => {
    //     setLoading(true);
    //     try {
    //         const result = await loginWithGoogle(credentialResponse.credential);
    //         if (result && result.success) {
    //             setSuccessMessage(result.message);
    //             setErrorMessage("");
    //         } else if (result) {
    //             setErrorMessage(result.message);
    //         }
    //     } catch (error) {
    //         setErrorMessage("An unexpected error occurred during Google login.");
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    const handleLogin = async () => {
        setLoading(true);
        try {
            const result = await login(email, password);
            if (result && result.success) {
                setSuccessMessage(result.message);
                setErrorMessage("");
            } else if (result) {
                setErrorMessage(result.message);
            }
            // Exemple d'alerte pour la démo
        } catch (error) {
            setErrorMessage("An unexpected error occurred.");
        } finally {
            setLoading(false);
        }
    };

    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <Text>Connexion</Text>
          {successMessage ? <Text style={{ color: "green" }}>{successMessage}</Text> : null}
          {errorMessage ? <Text style={{ color: "red" }}>{errorMessage}</Text> : null}
          <TextInput
            style={{ borderWidth: 1, borderColor: "gray", padding: 10, marginBottom: 10 }}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
          />
          <View style={{ flexDirection: "row", alignItems: "center" }}>
              <TextInput
                style={{ flex: 1, borderWidth: 1, borderColor: "gray", padding: 10 }}
                placeholder="Password"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity onPress={handlePasswordVisibility} style={{ padding: 10 }}>
                  <Text>{showPassword ? "Hide" : "Show"}</Text>
              </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={handleLogin} style={{ backgroundColor: "blue", padding: 10, marginTop: 10 }}>
              <Text style={{ color: "white" }}>{loading ? "Loading..." : "Login"}</Text>
          </TouchableOpacity>
          {/* <TouchableOpacity onPress={handleGoogleLogin} style={{ backgroundColor: "red", padding: 10, marginTop: 10 }}>
                <Text style={{ color: "white" }}>Login with Google</Text>
            </TouchableOpacity> */}
          {/* D'autres éléments d'interface utilisateur, comme les liens vers la page d'inscription et de récupération de mot de passe, peuvent être ajoutés ici */}
      </View>
    );
}
