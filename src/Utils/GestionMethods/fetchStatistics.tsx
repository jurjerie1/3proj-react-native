import {axiosUtils} from '../axiosUtils.ts';

export const fetchStatistics = (
  ApiGet,
  setStatistic,
  filters = {},
  setFormError,
) => {
  const queryParams = new URLSearchParams();
  if (filters.startDate) {
    queryParams.append('startDate', filters.startDate);
  }
  if (filters.endDate) {
    queryParams.append('endDate', filters.endDate);
  }
  if (filters.category) {
    queryParams.append('category', filters.category);
  }

  const url = `Expenses/user/statistics${queryParams.toString()}`;

  ApiGet(url)
    .then(response => {
      setStatistic(response.data);
      console.log('Statistiques: ', response.data);
    })
    .catch(error => {
      console.error('Erreur lors de la recherche:', error);
      const errorMsg =
        error.response?.data?.message || 'Filtres invalides ou inexistants'; // Message d'erreur par défaut
      setFormError(errorMsg); // Définir le message d'erreur à partir de la réponse de l'API
    });
};
