// deleteExpense.tsx
import { fetchExpenses } from "./fetchExpenses";

export const deleteExpense = (ApiDelete, ApiGet, expenseId, toggleDetailsModal, setHistory) => {
    ApiDelete(`Expenses/${expenseId}`)
        .then(() => {
            console.log('Dépense supprimée avec succès');
            toggleDetailsModal(expenseId); // Fermer la modal
            fetchExpenses(ApiGet, expenseId, setHistory); // Recharger la liste des dépenses
        })
        .catch((error) => {
            console.error('Erreur lors de la suppression de la dépense:', error);
        });
};
