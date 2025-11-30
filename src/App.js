import React from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Budgets from "./pages/Budgets";
import Profile from "./pages/Profile";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <div className="app-root">
      <Header />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/budgets" element={<Budgets />} />
          <Route path="/profile" element={<Profile />} />
          <Route
            path="*"
            element={
              <div className="page">
                <h1 className="page-title">Page Not Found</h1>
                <p className="page-subtitle">
                  The page you are looking for does not exist.
                </p>
              </div>
            }
          />
        </Routes>
      </main>
      <Footer />
      <ToastContainer position="top-right" theme="dark" />
    </div>
  );
}

export default App;
