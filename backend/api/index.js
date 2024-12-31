const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const cors = require('cors');

// Initialize the Express app
const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Path to the data file
const dataFile = './data.json';

// Route: Get all expenses
app.get('/expenses', (req, res) => {
  fs.readFile(dataFile, (err, data) => {
    if (err) {
      console.error('Error reading file:', err);
      return res.status(500).send('Error reading data.');
    }
    res.json(JSON.parse(data));
  });
});

// Route: Add a new expense
app.post('/expenses', (req, res) => {
  const newExpense = req.body;

  fs.readFile(dataFile, (err, data) => {
    if (err) {
      console.error('Error reading file:', err);
      return res.status(500).send('Error reading data.');
    }

    let expenses = [];
    try {
      expenses = JSON.parse(data);
    } catch (parseError) {
      console.error('Error parsing data:', parseError);
    }

    expenses.push(newExpense);

    fs.writeFile(dataFile, JSON.stringify(expenses, null, 2), (err) => {
      if (err) {
        console.error('Error writing file:', err);
        return res.status(500).send('Error writing data.');
      }
      res.status(201).send('Expense added successfully.');
    });
  });
});

// Route: Delete an expense by index
app.delete('/expenses/:id', (req, res) => {
  const expenseId = parseInt(req.params.id, 10);

  fs.readFile(dataFile, (err, data) => {
    if (err) {
      console.error('Error reading file:', err);
      return res.status(500).send('Error reading data.');
    }

    let expenses = JSON.parse(data);
    expenses = expenses.filter((_, index) => index !== expenseId);

    fs.writeFile(dataFile, JSON.stringify(expenses, null, 2), (err) => {
      if (err) {
        console.error('Error writing file:', err);
        return res.status(500).send('Error writing data.');
      }
      res.status(200).send('Expense deleted successfully.');
    });
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
