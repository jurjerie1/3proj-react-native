export const fetchHistory = (ApiGet, setHistory) => {
  ApiGet(`Expenses/user`)
    .then(response => {
      setHistory(response.data);
    })
    .catch(error => {
      console.error('Erreur lors de la recherche:', error);
    });
};
