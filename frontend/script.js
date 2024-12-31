const API_URL = 'http://localhost:3000/expenses'; // Backend API URL

// Fetch and display all expenses on page load
async function fetchExpenses() {
  const response = await fetch(API_URL);
  const expenses = await response.json(); // Parse JSON data from the response
  displayExpenses(expenses);
}

// Add a new expense
async function addExpense() {
  const date = document.getElementById('date').value;
  const amount = parseFloat(document.getElementById('amount').value);
  const category = document.getElementById('category').value;
  const description = document.getElementById('description').value;

  // Validate inputs
  if (!date || !amount || !category || !description) {
    alert('Please fill in all fields!');
    return;
  }

  const newExpense = { date, amount, category, description };

  // POST request to add a new expense
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newExpense),
  });

  if (response.ok) {
    fetchExpenses(); // Refresh the expenses list after adding
    clearForm(); // Clear the form inputs
  } else {
    alert('Error adding expense. Please try again.');
  }
}

// Clear form inputs
function clearForm() {
  document.getElementById('date').value = '';
  document.getElementById('amount').value = '';
  document.getElementById('category').value = '';
  document.getElementById('description').value = '';
}

// Display expenses dynamically
function displayExpenses(expenses) {
  const expenseList = document.getElementById('expenses-list');
  expenseList.innerHTML = ''; // Clear existing content

  if (expenses.length === 0) {
    expenseList.innerHTML = '<p>No expenses found. Add some!</p>';
    return;
  }

  expenses.forEach((expense, index) => {
    // Create a card for each expense
    const expenseCard = document.createElement('div');
    expenseCard.className = 'expense-card';

    expenseCard.innerHTML = `
      <div>
        <p><strong>Date:</strong> ${expense.date}</p>
        <p><strong>Amount:</strong> ₹${expense.amount}</p>
        <p><strong>Category:</strong> ${expense.category}</p>
        <p><strong>Description:</strong> ${expense.description}</p>
      </div>
      <button onclick="deleteExpense(${index})">Delete</button>
    `;

    expenseList.appendChild(expenseCard); // Add the card to the list
  });
}

// Delete an expense
async function deleteExpense(index) {
  const response = await fetch(`${API_URL}/${index}`, { method: 'DELETE' });

  if (response.ok) {
    fetchExpenses(); // Refresh the list after deletion
  } else {
    alert('Error deleting expense. Please try again.');
  }
}

// Fetch and display expenses on page load
fetchExpenses();
