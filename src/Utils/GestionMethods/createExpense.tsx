import { fetchExpenses } from "./fetchExpenses.tsx";

// Définir la fonction logFormData avant son utilisation
const logFormData = (formData) => {
  for (const pair of formData._parts) {
    console.log(`${pair[0]}: ${pair[1]}`);
  }
};

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

  // Log de la requête
  console.log('Requête POST envoyée vers:', `Expenses/team/${group.id}/expense`);
  logFormData(formData);

  // Convertir FormData en chaîne JSON pour le corps de la requête CURL
  const curlFormData = {};
  for (const pair of formData._parts) {
    curlFormData[pair[0]] = pair[1];
  }

  // Construire la commande CURL équivalente
  const curlCommand = `curl -X 'POST' \
  'https://api.splitlynp.com/api/Expenses/team/${group.id}/expense' \
  -H 'accept: */*' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6ImRlNjIwMjlmLTJmZGEtNDY3My1iNTdhLTkyZjVlODNjNmY2NyIsImp0aSI6WyJkZTYyMDI5Zi0yZmRhLTQ2NzMtYjU3YS05MmY1ZTgzYzZmNjciLCI0NWU4MmZlOS1iZjA2LTQxNDEtYjRmNy1lMzM3Nzc3ZTIzZWUiXSwiZW1haWwiOiJ1c2VyQGV4YW1wbGUuY29tIiwibmJmIjoxNzE2MTAzOTk4LCJleHAiOjE3MTYxMjU1OTgsImlhdCI6MTcxNjEwMzk5OH0.C4z2IpQUfFojz-f0NRD1D0Sa5IFTGJkhYuPV0JfbGGU' \
  -H 'Content-Type: multipart/form-data' \
  ${Object.entries(curlFormData).map(([key, value]) => `-F '${key}=${value}'`).join(' \\\n  ')}`;

  console.log("Commande CURL équivalente:", curlCommand);

  ApiPostCustom(`Expenses/team/${group.id}/expense`, formData)
      .then(response => {
        console.log('Expense created:', response.data);
        toggleCreateExpenseModal(); // Close the modal after success
        setFormError(''); // Clear any previous errors
        fetchExpenses(ApiGet, group.id, setHistory); // Reload the expense list
      })
      .catch(error => {
        console.error('Error creating expense:', error);
        const errorMsg = error.response?.data?.message || 'Error creating expense.'; // Default error message
        setFormError(errorMsg); // Set the error message from the API response
      });
};
