import React, { useState, useEffect } from "react";
import axios from "axios";

const ExpenseForm = () => {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [expenses, setExpenses] = useState([]);

  const handleAddExpense = async () => {
    try {
      const response = await axios.post(
        "http://localhost:4000/api/expense/addexpense",
        {
          expenseamount: amount,
          description,
          category,
        }
      );

      if (response.status === 201) {
        console.log("Expense added successfully");
        setAmount("");
        setDescription("");
        setCategory("");
        fetchExpenses();
      }
    } catch (error) {
      console.error("Error adding expense:", error);
    }
  };

  const handleDeleteExpense = async (id) => {
    try {
      const response = await axios.delete(
        `http://localhost:4000/api/expense/delete/${id}`
      );

      if (response.status === 200) {
        console.log("Expense deleted successfully");

        fetchExpenses();
      }
    } catch (error) {
      console.error("Error deleting expense:", error);
    }
  };

  const fetchExpenses = async () => {
    try {
      const response = await axios.get(
        "http://localhost:4000/api/expense/getexpenses"
      );

      if (response.status === 200) {
        setExpenses(response.data.expenses);
      }
    } catch (error) {
      console.error("Error fetching expenses:", error);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  return (
    <div className="expense-form">
      <h2>Add Expense</h2>
      <label>
        Amount:
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </label>
      <label>
        Description:
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </label>
      <label>
        Category:
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">Select Category</option>
          <option value="Groceries">Groceries</option>
          <option value="Transportation">Transportation</option>
          <option value="Utilities">Utilities</option>
          <option value="Entertainment">Entertainment</option>
          <option value="Dining">Dining</option>
          <option value="Shopping">Shopping</option>
          <option value="Food">Food</option>
        </select>
      </label>
      <button onClick={handleAddExpense}>Add Expense</button>

      <h2>Expenses</h2>
      <ul>
        {expenses.map((expense) => (
          <li key={expense.id}>
            {expense.description} - {expense.expenseamount} - {expense.category}
            <button onClick={() => handleDeleteExpense(expense.id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ExpenseForm;
