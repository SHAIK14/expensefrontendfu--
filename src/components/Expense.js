import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import "./Epense.css";
import PremiumPurchase from "./PremiumPurchase";
import NavigationBar from "./NavigationBar";

const ExpenseForm = () => {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [expenses, setExpenses] = useState([]);
  const token = localStorage.getItem("token");
  console.log(token);

  const handleAddExpense = async () => {
    try {
      const response = await axios.post(
        "http://localhost:4000/api/expense/addexpense",
        {
          expenseamount: amount,
          description,
          category,
        },
        { headers: { Authorization: token } }
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
        `http://localhost:4000/api/expense/delete/${id}`,
        { headers: { Authorization: token } }
      );

      if (response.status === 200) {
        console.log("Expense deleted successfully");

        fetchExpenses();
      }
    } catch (error) {
      console.error("Error deleting expense:", error);
    }
  };

  const fetchExpenses = useCallback(async () => {
    try {
      const response = await axios.get(
        "http://localhost:4000/api/expense/getexpenses",
        { headers: { Authorization: token } }
      );

      if (response.status === 200) {
        setExpenses(response.data.expenses);
      }
    } catch (error) {
      console.error("Error fetching expenses:", error);
    }
  }, [token]);

  useEffect(() => {
    fetchExpenses();
  }, [token, fetchExpenses]);
  return (
    <div className="whole">
      <div className="nav">
        <NavigationBar />
      </div>
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
          <div className="purchase">
            <PremiumPurchase />
          </div>
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
    </div>
  );
};

export default ExpenseForm;
