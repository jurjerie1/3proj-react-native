export const fetchCategories = (ApiGet, setCategories) => {
    ApiGet(`Expenses/categories`)
        .then((response) => {
            setCategories(response.data);
            console.log("Liste des catégories de dépenses: ", response.data);
        })
        .catch((error) => {
            console.error("Erreur lors de la recherche:", error);
        });
    };