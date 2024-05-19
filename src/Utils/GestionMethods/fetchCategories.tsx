export const fetchCategories = async (ApiGet, setCategories) => {
  try {
    const response = await ApiGet('Expenses/categories');

    if (response.status !== 200) {
      throw new Error(`Unexpected response status: ${response.status}`);
    }

    const contentType = response.headers['content-type'];
    if (contentType && contentType.includes('application/json')) {
      setCategories(response.data);
    } else {
      console.error('Unexpected response format:', response);
      setFormError('Unexpected response format.');
    }
  } catch (error) {
    console.error('Erreur lors de la recherche:', error);
    setFormError(
      `Erreur lors de la récupération des catégories: ${error.message}`,
    );
  }
};
