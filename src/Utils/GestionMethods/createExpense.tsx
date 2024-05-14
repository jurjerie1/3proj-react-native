import {fetchExpenses} from './fetchExpenses';

export const createExpense = (
  ApiPost,
  ApiGet,
  group,
  event,
  participants,
  toggleCreateExpenseModal,
  setFormError,
  setHistory,
) => {
  event.preventDefault(); // Empêcher le formulaire de soumettre normalement

  const formData = new FormData();
  formData.append('Date', new Date().toISOString()); // Utilisez la date actuelle
  formData.append('Title', event.target.title.value);
  formData.append('Amount', event.target.amount.value);
  formData.append('Category', event.target.category.value);
  formData.append('Justificatif', event.target.justificatif.files[0]);
  formData.append('TeamId', group.id); // Utilisez l'ID de votre groupe

  // Création d'une nouvelle liste de participants avec des montants ajustés
  const formattedParticipants = participants.map(p => ({
    UserId: p.UserId,
    Amount: p.Amount > 0 ? p.Amount : null,
  }));

  formData.append('participants', JSON.stringify(formattedParticipants));

  ApiPost(`Expenses/team/${group.id}/expense`, formData)
    .then(response => {
      console.log('Expense created:', response.data);
      toggleCreateExpenseModal(); // Fermer le modal après le succès
      setFormError(''); // Clear any previous errors
      fetchExpenses(ApiGet, group.id, setHistory); // Recharger la liste des dépenses
    })
    .catch(error => {
      console.error('Erreur lors de la création de la dépense:', error);
      const errorMsg =
        error.response?.data?.message ||
        'Erreur lors de la création de la dépense.'; // Default error message
      setFormError(errorMsg); // Set the error message from the API response
    });
};
