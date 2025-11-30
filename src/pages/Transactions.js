import React, { useMemo, useState } from "react";
import { useFinance } from "../context/FinanceContext";

const categories = ["Salary", "Freelance", "Groceries", "Transport", "Rent", "Entertainment", "Other"];

function Transactions() {
  const { transactions, addTransaction, updateTransaction, deleteTransaction, profile } =
    useFinance();

  const currency = profile.defaultCurrency || "₹";

  const [form, setForm] = useState({
    type: "expense",
    amount: "",
    category: "Groceries",
    date: new Date().toISOString().slice(0, 10),
    description: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [sortField, setSortField] = useState("date");
  const [sortDir, setSortDir] = useState("desc");

  const sortedTransactions = useMemo(() => {
    const tx = [...transactions];
    tx.sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];
      if (sortField === "amount") {
        return sortDir === "asc" ? valA - valB : valB - valA;
      } else {
        valA = String(valA);
        valB = String(valB);
        if (valA < valB) return sortDir === "asc" ? -1 : 1;
        if (valA > valB) return sortDir === "asc" ? 1 : -1;
        return 0;
      }
    });
    return tx;
  }, [transactions, sortField, sortDir]);

  const handleSort = (field) => {
    if (field === sortField) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("asc");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: name === "amount" ? value.replace(/[^\d]/g, "") : value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.amount || !form.category || !form.date) {
      return;
    }
    const payload = {
      ...form,
      amount: Number(form.amount),
    };
    if (editingId) {
      updateTransaction(editingId, payload);
    } else {
      addTransaction(payload);
    }
    setForm({
      type: "expense",
      amount: "",
      category: "Groceries",
      date: new Date().toISOString().slice(0, 10),
      description: "",
    });
    setEditingId(null);
  };

  const handleEdit = (t) => {
    setEditingId(t.id);
    setForm({
      type: t.type,
      amount: String(t.amount),
      category: t.category,
      date: t.date,
      description: t.description || "",
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setForm({
      type: "expense",
      amount: "",
      category: "Groceries",
      date: new Date().toISOString().slice(0, 10),
      description: "",
    });
  };

  return (
    <section className="page page-transactions">
      <div className="page-header">
        <h1 className="page-title">Transactions</h1>
        <p className="page-subtitle">
          View, add, edit and delete all your income and expense transactions.
        </p>
      </div>

      {/* Add / Edit form */}
      <div className="table-card">
        <h3>{editingId ? "Edit Transaction" : "Add Transaction"}</h3>
        <form className="transaction-form" onSubmit={handleSubmit}>
          <label>
            Type
            <select name="type" value={form.type} onChange={handleChange}>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </label>
          <label>
            Amount
            <input
              name="amount"
              value={form.amount}
              onChange={handleChange}
              placeholder="0"
            />
          </label>
          <label>
            Category
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>
          <label>
            Date
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
            />
          </label>
          <label className="description-field">
            Description (optional)
            <input
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="e.g. Zomato order, Ola ride..."
            />
          </label>
          <div className="form-actions">
            <button type="submit" className="btn primary">
              {editingId ? "Update" : "Add"}
            </button>
            {editingId && (
              <button
                type="button"
                className="btn ghost"
                onClick={handleCancelEdit}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Transactions table */}
      <div className="table-card">
        <h3>All Transactions</h3>
        {sortedTransactions.length === 0 ? (
          <p className="empty-text">No transactions available.</p>
        ) : (
          <table className="simple-table">
            <thead>
              <tr>
                <th onClick={() => handleSort("type")}>Type</th>
                <th onClick={() => handleSort("amount")}>Amount</th>
                <th onClick={() => handleSort("category")}>Category</th>
                <th onClick={() => handleSort("date")}>Date</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedTransactions.map((t) => (
                <tr key={t.id}>
                  <td className={t.type === "income" ? "text-income" : "text-expense"}>
                    {t.type === "income" ? "Income" : "Expense"}
                  </td>
                  <td>
                    {currency} {t.amount.toLocaleString()}
                  </td>
                  <td>{t.category}</td>
                  <td>{t.date}</td>
                  <td>{t.description || "-"}</td>
                  <td>
                    <button className="btn small" onClick={() => handleEdit(t)}>
                      Edit
                    </button>
                    <button
                      className="btn small danger"
                      onClick={() => deleteTransaction(t.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}

export default Transactions;
