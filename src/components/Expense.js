import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Epense.css";
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
      <div className="formexpense">
        <h2 className="header">Add Expense</h2>
        <label className="labels">
          Amount:
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="Amount"
          />
        </label>
        <label className="labels">
          Description:
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="description"
          />
        </label>
        <label className="labels">
          Category:
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="items"
          >
            <option value="" className="item">
              Select Category
            </option>
            <option value="Groceries" className="item">
              Groceries
            </option>
            <option value="Transportation" className="item">
              Transportation
            </option>
            <option value="Utilities" className="item">
              Utilities
            </option>
            <option value="Entertainment" className="item">
              Entertainment
            </option>
            <option value="Dining" className="item">
              Dining
            </option>
            <option value="Shopping" className="item">
              Shopping
            </option>
            <option value="Food" className="item">
              Food
            </option>
          </select>
        </label>
        <button className="btn-addexpense" onClick={handleAddExpense}>
          Add Expense
        </button>
      </div>
      <div>
        <h2 className="expense list">Expenses</h2>
      </div>
      <div className="expensedatas">
        {expenses.map((expense) => (
          <div className="expensedata" key={expense.id}>
            <ul>
              <li>
                {expense.description} - {expense.expenseamount} -{" "}
                {expense.category}
                <button
                  className="delete-btn"
                  onClick={() => handleDeleteExpense(expense.id)}
                >
                  Delete
                </button>
              </li>
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExpenseForm;
