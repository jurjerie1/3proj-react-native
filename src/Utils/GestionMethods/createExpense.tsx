import {fetchExpenses} from './fetchExpenses.tsx';

export const createExpense = (
  ApiPostCustom,
  ApiGet,
  group,
  date,
  title,
  amount,
  category,
  justificatif,
  participants,
  toggleCreateExpenseModal,
  setFormError,
  setHistory,
) => {
  const formData = new FormData();
  formData.append('Date', date);
  formData.append('Title', title);
  formData.append('Amount', amount);
  formData.append('Category', category);

  if (justificatif) {
    formData.append('Justificatif', {
      uri: justificatif.uri,
      type: justificatif.type,
      name: justificatif.name,
    });
  } else {
    formData.append('Justificatif', '');
  }

  const formattedParticipants = participants.map(p => ({
    UserId: p.UserId,
    Amount: p.Amount > 0 ? p.Amount : null,
  }));

  formData.append('participants', JSON.stringify(formattedParticipants));


  const curlFormData = {};
  for (const pair of formData._parts) {
    curlFormData[pair[0]] = pair[1];
  }

  ApiPostCustom(`Expenses/team/${group.id}/expense`, formData)
    .then(response => {
      toggleCreateExpenseModal();
      setFormError('');
      fetchExpenses(ApiGet, group.id, setHistory);
    })
    .catch(error => {
      console.error('Error creating expense:', error);
      const errorMsg =
        error.response?.data?.message || 'Error creating expense.';
      setFormError(errorMsg);
    });
};
