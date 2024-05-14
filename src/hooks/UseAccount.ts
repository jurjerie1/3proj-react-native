import { useEffect } from "react";
import { useAccountStore } from "./UseAccountStore"; // Assurez-vous d'importer useAccountStore depuis le bon chemin
import { useNavigation } from "@react-navigation/native"; // Importez useNavigation depuis @react-navigation/native

export const UseAccount = () => {
    const { account } = useAccountStore();
    const navigation = useNavigation();

    useEffect(() => {
        if (!account) {
            // Rediriger vers l'écran d'accueil ou toute autre page d'authentification si l'utilisateur n'est pas authentifié
            navigation.navigate("Home"); // Remplacez "Home" par le nom de l'écran d'accueil ou d'authentification approprié
            // Vous pouvez également utiliser navigation.reset() pour réinitialiser la pile de navigation
            throw new Error("User is not authenticated");
        }
    }, [account, navigation]);

    return {
        account,
    };
};
