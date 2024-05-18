import { fetchExpenses } from "./fetchExpenses.tsx";

export const createExpense = (
    ApiPost,
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
  formData.append('Date', date); // Use the provided date
  formData.append('Title', title);
  formData.append('Amount', amount);
  formData.append('Category', category);

  // Check if justificatif is null and handle accordingly
  if (justificatif) {
    formData.append('Justificatif', {
      uri: justificatif.uri,
      type: justificatif.type,
      name: justificatif.name,
    }); // Use the provided justificatif file
  } else {
    formData.append('Justificatif', ""); // Send an empty string if justificatif is null
  }


  // Create a new list of participants with adjusted amounts
  const formattedParticipants = participants.map(p => ({
    UserId: p.UserId,
    Amount: p.Amount > 0 ? p.Amount : null,
  }));

  formData.append('participants', JSON.stringify(formattedParticipants));

  // Utility function to log FormData content
  const logFormData = (formData) => {
    for (const pair of formData._parts) {
      console.log(`${pair[0]}: ${pair[1]}`);
    }
  };

  // Log FormData content
  logFormData(formData);
  ApiPost(`Expenses/team/${group.id}/expense`, formData)
      .then(response => {
        console.log('Expense created:', response.data);
        toggleCreateExpenseModal(); // Close the modal after success
        setFormError(''); // Clear any previous errors
        fetchExpenses(ApiGet, group.id, setHistory); // Reload the expense list
      })
      .catch(error => {
        console.error('Error creating expense:', error);
        const errorMsg =
            error.response?.data?.message || 'Error creating expense.'; // Default error message
        setFormError(errorMsg); // Set the error message from the API response
      });
};
