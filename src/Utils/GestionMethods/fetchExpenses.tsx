export const fetchExpenses = async (
  ApiGet,
  groupId,
  setHistory,
  filters = {},
  setFormError,
) => {
  try {
    const queryParameters = [];
    if (filters.title) {
      queryParameters.push(`title=${encodeURIComponent(filters.title)}`);
    }
    if (filters.category) {
      queryParameters.push(`category=${encodeURIComponent(filters.category)}`);
    }
    if (filters.minAmount) {
      queryParameters.push(
        `minAmount=${encodeURIComponent(filters.minAmount)}`,
      );
    }
    if (filters.maxAmount) {
      queryParameters.push(
        `maxAmount=${encodeURIComponent(filters.maxAmount)}`,
      );
    }

    const queryString = queryParameters.length
      ? `?${queryParameters.join('&')}`
      : '';
    const response = await ApiGet(`Expenses/team/${groupId}${queryString}`);

    if (response.headers['content-type'].includes('application/json')) {
      setHistory(response.data);
    } else {
      throw new Error('Unexpected response format');
    }
  } catch (error) {
    console.error('Erreur lors de la recherche:', error);
    setFormError('Erreur lors de la récupération des dépenses.');
  }
};
