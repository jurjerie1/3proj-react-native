// fetchHistory.tsx
export const fetchHistory = (ApiGet, setHistory) => {
    ApiGet(`Expenses/user`)
        .then((response) => {
            setHistory(response.data);
            console.log("Historique des dépenses: ", response.data);
        })
        .catch((error) => {
            console.error("Erreur lors de la recherche:", error);
        });
};