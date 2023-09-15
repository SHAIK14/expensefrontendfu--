import React from "react";
import Signup from "./components/signup";
import Login from "./components/login";
import ExpenseForm from "./components/Expense";
import PasswordReset from "./components/PasswordReset";
import { BrowserRouter, Routes, Route } from "react-router-dom";
const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Signup />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/addexpenses" element={<ExpenseForm />}></Route>
        <Route path="/resetpassword" element={<PasswordReset />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
