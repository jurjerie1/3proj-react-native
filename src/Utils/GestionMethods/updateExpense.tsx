// updateExpense.tsx
import { fetchExpenses } from "./fetchExpenses";

export const updateExpense = (ApiPut, ApiGet, expenseId, event, allParticipants, toggleModifyExpenseModal, setFormError, setHistory, group) => {
    event.preventDefault();  // Empêcher le formulaire de soumettre normalement

    const formData = new FormData();
    formData.append('Date', new Date().toISOString()); // Utilisez la date actuelle
    formData.append('Title', event.target.title.value);
    formData.append('Category', event.target.category.value);
    formData.append('Amount', event.target.amount.value);
    formData.append('Justificatif', event.target.justificatif.files[0]);

    // Création d'une nouvelle liste de participants avec des montants ajustés
    const formattedParticipants = allParticipants.map(p => ({
        UserId: p.UserId,
        Amount: p.amount > 0 ? p.amount : null
    }));
    formData.append('participants', JSON.stringify(formattedParticipants));

    ApiPut(`Expenses/${expenseId}`, formData)
        .then((response) => {
            console.log('Expense updated:', response.data);
            toggleModifyExpenseModal(expenseId); // Fermer le modal après le succès
            setFormError(''); // Clear any previous errors
            fetchExpenses(ApiGet, group.id, setHistory); // Recharger la liste des dépenses
        })
        .catch((error) => {
            console.error('Erreur lors de la mise à jour de la dépense:', error);
            const errorMsg = error.response?.data?.message || 'Erreur lors de la mise à jour de la dépense.'; // Default error message
            setFormError(errorMsg); // Set the error message from the API response
        });
};
