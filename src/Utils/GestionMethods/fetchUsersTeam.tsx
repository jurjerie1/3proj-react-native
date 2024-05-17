// fetchUsersTeam.tsx
export const fetchUsersTeam = (ApiGet, groupId, setShowUsers) => {
    ApiGet(`Teams/${groupId}/users`)
        .then((response) => {
            console.log("Fetched users: ", response.data); // Log the fetched users
            setShowUsers(response.data);
        })
        .catch((error) => {
            if (error.response && error.response.status === 404) {
                console.error("No users found for this group:", error);
                setShowUsers([]);
            } else {
                console.error("Erreur lors de la recherche des Users:", error);
            }
        });
};
