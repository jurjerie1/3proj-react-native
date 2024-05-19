import { fetchExpenses } from "./fetchExpenses";

export const deleteExpense = (ApiDelete, ApiGet, expenseId, toggleDetailsModal, setHistory) => {
    ApiDelete(`Expenses/${expenseId}`)
        .then(() => {
            toggleDetailsModal(expenseId);
            fetchExpenses(ApiGet, expenseId, setHistory);
        })
        .catch((error) => {
            console.error('Erreur lors de la suppression de la dépense:', error);
        });
};
