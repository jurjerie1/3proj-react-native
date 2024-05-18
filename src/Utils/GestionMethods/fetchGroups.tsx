export const fetchGroups = (ApiGet, setGroups) => {
    ApiGet('Teams')
        .then((response) => {
            setGroups(response.data);
        })
        .catch((error) => {
            console.error("Erreur lors de la recherche:", error);
        });
}