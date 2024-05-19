import {fetchExpenses} from './fetchExpenses';

export const updateExpense = async (
  ApiPut,
  ApiGet,
  expenseId,
  updatedExpense,
  allParticipants,
  toggleModifyExpenseModal,
  setFormError,
  setHistory,
  group,
) => {
  try {
    const formData = new FormData();
    formData.append('Date', new Date().toISOString());
    formData.append('Title', updatedExpense.title);
    formData.append('Category', updatedExpense.category);
    formData.append('Amount', updatedExpense.amount.toString());

    if (updatedExpense.justificatif) {
      formData.append('Justificatif', updatedExpense.justificatif);
    }

    const formattedParticipants = allParticipants.map(p => ({
      UserId: p.UserId,
      Amount: p.amount > 0 ? p.amount : null,
    }));
    formData.append('participants', JSON.stringify(formattedParticipants));

    const response = await ApiPut(`Expenses/${expenseId}`, formData);
    toggleModifyExpenseModal(expenseId);
    setFormError('');
    fetchExpenses(ApiGet, group.id, setHistory);
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la dépense :', error);
    const errorMsg =
      error.response?.data?.message ||
      'Erreur lors de la mise à jour de la dépense.';
    setFormError(errorMsg);
  }
};
