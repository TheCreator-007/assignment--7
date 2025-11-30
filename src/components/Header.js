import React from "react";
import { NavLink } from "react-router-dom";
import { useFinance } from "../context/FinanceContext";

function Header() {
  const { profile } = useFinance();

  return (
    <header className="header">
      <div className="header-inner">
        <div className="logo">
          <span className="logo-mark">PF</span>
          <span className="logo-text">Personal Finance</span>
        </div>
        <nav className="nav">
          <NavLink to="/" end className="nav-link">
            Dashboard
          </NavLink>
          <NavLink to="/transactions" className="nav-link">
            Transactions
          </NavLink>
          <NavLink to="/budgets" className="nav-link">
            Budgets
          </NavLink>
          <NavLink to="/profile" className="nav-link">
            Profile
          </NavLink>
        </nav>
        <div className="header-user">
          <span className="user-name">{profile.name}</span>
        </div>
      </div>
    </header>
  );
}

export default Header;
