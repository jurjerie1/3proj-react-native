import { fetchExpenses } from "./fetchExpenses";

export const updateExpense = async (ApiPut, ApiGet, expenseId, updatedExpense, allParticipants, toggleModifyExpenseModal, setFormError, setHistory, group) => {
    try {
        const formData = new FormData();
        formData.append('Date', new Date().toISOString()); // Utilisez la date actuelle
        formData.append('Title', updatedExpense.title);
        formData.append('Category', updatedExpense.category);
        formData.append('Amount', updatedExpense.amount.toString());

        // Si un fichier justificatif est présent, l'ajouter
        if (updatedExpense.justificatif) {
            formData.append('Justificatif', updatedExpense.justificatif);
        }

        // Création d'une nouvelle liste de participants avec des montants ajustés
        const formattedParticipants = allParticipants.map(p => ({
            UserId: p.UserId,
            Amount: p.amount > 0 ? p.amount : null
        }));
        formData.append('participants', JSON.stringify(formattedParticipants));
        console.log(formData);

        const response = await ApiPut(`Expenses/${expenseId}`, formData);
        console.log('Dépense mise à jour :', response.data);
        toggleModifyExpenseModal(expenseId); // Fermer le modal après le succès
        setFormError(''); // Effacer les éventuelles erreurs précédentes
        fetchExpenses(ApiGet, group.id, setHistory); // Recharger la liste des dépenses
    } catch (error) {
        console.error('Erreur lors de la mise à jour de la dépense :', error);
        const errorMsg = error.response?.data?.message || 'Erreur lors de la mise à jour de la dépense.'; // Message d'erreur par défaut
        setFormError(errorMsg); // Définir le message d'erreur à partir de la réponse de l'API
    }
};
