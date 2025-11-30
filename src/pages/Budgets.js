import React, { useMemo, useState } from "react";
import { useFinance } from "../context/FinanceContext";

function Budgets() {
  const { budgets, categorySpend, setBudget, profile } = useFinance();
  const currency = profile.defaultCurrency || "₹";

  const [category, setCategory] = useState("Groceries");
  const [limit, setLimit] = useState("");

  const budgetsWithSpend = useMemo(
    () =>
      budgets.map((b) => {
        const spent = categorySpend[b.category] || 0;
        const percent =
          b.limit === 0 ? 0 : Math.min(150, Math.round((spent / b.limit) * 100));
        return { ...b, spent, percent };
      }),
    [budgets, categorySpend]
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!category || !limit) return;
    setBudget(category, Number(limit));
    setLimit("");
  };

  return (
    <section className="page page-budgets">
      <div className="page-header">
        <h1 className="page-title">Budgets</h1>
        <p className="page-subtitle">
          Set monthly budgets per category and track how much you&apos;ve spent.
        </p>
      </div>

      {/* Add / update budget */}
      <div className="table-card">
        <h3>Set Budget</h3>
        <form className="budget-form" onSubmit={handleSubmit}>
          <label>
            Category
            <input
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="e.g. Groceries"
            />
          </label>
          <label>
            Monthly Limit
            <input
              value={limit}
              onChange={(e) =>
                setLimit(e.target.value.replace(/[^\d]/g, ""))
              }
              placeholder="10000"
            />
          </label>
          <button type="submit" className="btn primary">
            Save Budget
          </button>
        </form>
      </div>

      {/* Budget progress */}
      <div className="table-card">
        <h3>Budget Overview</h3>
        {budgetsWithSpend.length === 0 ? (
          <p className="empty-text">No budgets set yet.</p>
        ) : (
          <ul className="budget-list">
            {budgetsWithSpend.map((b) => {
              const over = b.spent > b.limit;
              return (
                <li key={b.id} className="budget-item">
                  <div className="budget-header">
                    <div>
                      <p className="budget-category">{b.category}</p>
                      <p className="budget-meta">
                        Limit: {currency} {b.limit.toLocaleString()} · Spent:{" "}
                        {currency} {b.spent.toLocaleString()}
                      </p>
                    </div>
                    <span className={`budget-percent ${over ? "over" : ""}`}>
                      {b.percent}%
                    </span>
                  </div>
                  <div className="budget-bar">
                    <div
                      className={`budget-bar-fill ${over ? "over" : ""}`}
                      style={{ width: `${Math.min(b.percent, 150)}%` }}
                    />
                  </div>
                  {over && (
                    <p className="budget-alert">
                      You&apos;ve exceeded the budget for {b.category}!
                    </p>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}

export default Budgets;
