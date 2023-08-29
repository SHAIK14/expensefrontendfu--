import React from "react";
import Signup from "./components/signup";
import Login from "./components/login";
import ExpenseForm from "./components/Expense";
import { BrowserRouter, Routes, Route } from "react-router-dom";
const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Signup />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/addexpenses" element={<ExpenseForm />}></Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
