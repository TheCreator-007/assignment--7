# Assignment-7 Personal Finance Tracker (React + Context + LocalStorage + Charts)

This project is a complete **Personal Finance Management** application built using **React**, **Context API**, **LocalStorage**, **Recharts**, and **React Toastify**.  
It provides a full financial dashboard with income, expenses, budgets, transactions, profile settings, and data visualizations — all in a modern and responsive UI.

---

## 🌍 Live Demo

Visit the deployed project:  
👉 **https://finance-assignment-7.netlify.app/**

---


## ✨ Features

### 🏠 Global Layout
- Global **Header** and **Footer** across the app
- Responsive design for **mobile, tablet, and desktop**

---

## 📊 Dashboard Page
- Four summary cards:
  - **Total Income**
  - **Total Expenses**
  - **Remaining Budget**
  - **Savings**
- Interactive charts:
  - **Monthly spending trend** (Bar chart)
  - **Category-wise expense distribution** (Pie chart)
- **Today's Expenses** table (Amount, Category, Note)
- Date Filter:
  - Filter all dashboard data by **date** or **date range**

---

## 💰 Transactions Page
- Full transaction list with a sortable table:
  - Type (Income / Expense)
  - Amount
  - Category
  - Date
  - Description
- Add Transaction:
  - Type, Amount, Category, Date, Description
- Edit Transaction (auto-fill form)
- Delete Transaction (with toast feedback)
- All transactions stored in **localStorage**

---

## 📦 Budgets Page
- Set monthly budgets per category (e.g., ₹10,000 Groceries)
- Dynamic progress bars showing:
  - Current spend vs. budget
- Overspend Alert:
  - Toast + visual highlight when spending exceeds limit

---

## 👤 Profile Page
- View and edit user details (Name, Email)
- Change default currency (₹, $, €, £)
- Lifetime stats:
  - Total Income
  - Total Expenses
  - Total Savings

---

## 🔔 Notifications (React Toastify)
- Toast alerts for:
  - Adding transactions
  - Editing transactions
  - Deleting transactions
  - Adding/updating budgets
  - Overspending alerts
  - Profile updates

---
