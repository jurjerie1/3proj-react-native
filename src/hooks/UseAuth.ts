import { useEffect } from "react";
import axios from 'axios';
import { API_URL } from "../../config";
import { useAccountStore } from "./UseAccountStore.ts";
import { useNavigation } from "@react-navigation/native";

export enum AuthStatus {
    UNKNOWN,
    AUTHENTICATED,
    GUEST,
}

export const UseAuth = () => {
    const { account, setAccount } = useAccountStore();
    const navigation = useNavigation();

    useEffect(() => {
        const checkAuthentication = async () => {
            try {
                const response = await axios.get(`${API_URL}/checkAuthentication`);
                if (response.data.success) {
                    setAccount(response.data.user);
                } else {
                    setAccount(null);
                }
            } catch (error) {
                console.error("Error checking authentication:", error);
                setAccount(null);
            }
        };
        checkAuthentication();
    }, [setAccount]);

    const login = async (email: string, password: string) => {
        console.log("Logging in with email:", email);
        try {
            const response = await axios.post(`https://api.splitlynp.com/api/Users/login`, {
                email,
                password,
            });
            console.log("Login response:", response.data);
            if (response.data) {
                console.log("Login successful:", response.data);
                setAccount(response.data.user);
                navigation.navigate("Home");
            } else {
                console.error("Login failed:", response.data.message);
            }
        } catch (error) {
            console.error("Login error:", error);
        }
    };

    const logout = () => {
        setAccount(null);
        navigation.navigate("Login");
    };

    return {
        account,
        login,
        logout,
    };
};
