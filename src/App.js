// App.jsx
import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";

const categories = ["Food", "Transport", "Entertainment", "Utilities", "Other"];

const App = () => {
  const [expenses, setExpenses] = useState(() => {
    const savedExpenses = localStorage.getItem("expenses");
    return savedExpenses ? JSON.parse(savedExpenses) : [];
  });

  const [newExpense, setNewExpense] = useState({
    amount: "",
    category: "",
    date: "",
  });

  const [filters, setFilters] = useState({
    category: "",
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    localStorage.setItem("expenses", JSON.stringify(expenses));
  }, [expenses]);

  const handleAddExpense = () => {
    const { amount, category, date } = newExpense;
    if (!amount || amount <= 0 || !category || !date) {
      alert("Please enter valid details.");
      return;
    }
    setExpenses([...expenses, { amount: parseFloat(amount), category, date }]);
    setNewExpense({ amount: "", category: "", date: "" });
  };

  const filteredExpenses = expenses.filter((expense) => {
    const matchesCategory =
      filters.category === "" || expense.category === filters.category;
  
    const matchesStartDate =
      filters.startDate === "" || new Date(expense.date) >= new Date(filters.startDate);
  
    const matchesEndDate =
      filters.endDate === "" || new Date(expense.date) <= new Date(filters.endDate);
  
    return matchesCategory && matchesStartDate && matchesEndDate;
  });

  const spendingByCategory = categories.map((category) => {
    const total = expenses
      .filter((expense) => expense.category === category)
      .reduce((sum, expense) => sum + expense.amount, 0);
    return { category, total };
  });

  const chartData = {
    labels: spendingByCategory.map((item) => item.category),
    datasets: [
      {
        label: "Spending by Category",
        data: spendingByCategory.map((item) => item.total),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
    ],
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Personal Budget Tracker</h1>
      <div style={{ marginBottom: "20px" }}>
        <h2>Add Expense</h2>
        <input
          type="number"
          placeholder="Amount"
          value={newExpense.amount}
          onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
          style={{ marginRight: "10px", padding: "5px" }}
        />
        <select
          value={newExpense.category}
          onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
          style={{ marginRight: "10px", padding: "5px" }}
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        <input
          type="date"
          value={newExpense.date}
          onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
          style={{ marginRight: "10px", padding: "5px" }}
        />
        <button onClick={handleAddExpense} style={{ padding: "5px 10px" }}>
          Add
        </button>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <h2>Filter Expenses</h2>
        <select
          value={filters.category}
          onChange={(e) => setFilters({ ...filters, category: e.target.value })}
          style={{ marginRight: "10px", padding: "5px" }}
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        <input
          type="date"
          value={filters.startDate}
          onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
          style={{ marginRight: "10px", padding: "5px" }}
        />
        <input
          type="date"
          value={filters.endDate}
          onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
          style={{ marginRight: "10px", padding: "5px" }}
        />
      </div>

      <div style={{ marginBottom: "20px" }}>
        <h2>Expenses</h2>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>Amount</th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>Category</th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>Date</th>
            </tr>
          </thead>
          <tbody>
            {filteredExpenses.map((expense, index) => (
              <tr key={index}>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>${expense.amount.toFixed(2)}</td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>{expense.category}</td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>{expense.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div>
        <h2>Spending Visualization</h2>
        <Bar data={chartData} />
      </div>
    </div>
  );
};

export default App;