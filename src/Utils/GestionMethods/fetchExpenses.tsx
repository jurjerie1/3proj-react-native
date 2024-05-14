// fetchExpenses.tsx
export const fetchExpenses = (ApiGet, groupId, setHistory) => {
    ApiGet(`Expenses/team/${groupId}`)
        .then((response) => {
            setHistory(response.data);
            console.log("Historique des dépenses du groupe: ", response.data);
        })
        .catch((error) => {
            console.error("Erreur lors de la recherche:", error);
        });
};
