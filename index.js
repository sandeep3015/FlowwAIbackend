const express = require('express');
const db = require('./database');
const app = express();

app.use(express.json()); 


app.post('/transactions', (req, res) => {
  const { type, category, amount, date, description } = req.body;
  
  const sql = `INSERT INTO transactions (type, category, amount, date, description) VALUES (?, ?, ?, ?, ?)`;
  db.run(sql, [type, category, amount, date, description], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ id: this.lastID });
  });
});


app.get('/transactions', (req, res) => {
  const sql = `SELECT * FROM transactions`;
  db.all(sql, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});


app.get('/transactions/:id', (req, res) => {
  const sql = `SELECT * FROM transactions WHERE id = ?`;
  db.get(sql, [req.params.id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    res.json(row);
  });
});


app.put('/transactions/:id', (req, res) => {
  const { type, category, amount, date, description } = req.body;
  const sql = `UPDATE transactions SET type = ?, category = ?, amount = ?, date = ?, description = ? WHERE id = ?`;
  db.run(sql, [type, category, amount, date, description, req.params.id], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    res.json({ updated: this.changes });
  });
});


app.delete('/transactions/:id', (req, res) => {
  const sql = `DELETE FROM transactions WHERE id = ?`;
  db.run(sql, [req.params.id], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    res.json({ deleted: this.changes });
  });
});


app.get('/summary', (req, res) => {
  const sqlIncome = `SELECT SUM(amount) as totalIncome FROM transactions WHERE type = 'income'`;
  const sqlExpense = `SELECT SUM(amount) as totalExpense FROM transactions WHERE type = 'expense'`;
  
  db.get(sqlIncome, [], (err, incomeRow) => {
    if (err) return res.status(500).json({ error: err.message });

    db.get(sqlExpense, [], (err, expenseRow) => {
      if (err) return res.status(500).json({ error: err.message });

      const totalIncome = incomeRow.totalIncome || 0;
      const totalExpense = expenseRow.totalExpense || 0;
      const balance = totalIncome - totalExpense;

      res.json({
        totalIncome,
        totalExpense,
        balance,
      });
    });
  });
});


app.listen(4000, () => {
  console.log('Server running on http://localhost:4000');
});
