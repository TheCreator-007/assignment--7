import React, { useMemo, useState } from "react";
import { useFinance } from "../context/FinanceContext";
import SummaryCard from "../components/SummaryCard";
import {
 LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const COLORS = ["#6366f1", "#22c55e", "#f97316", "#e11d48", "#06b6d4"];

function Dashboard() {
  const { transactions, totals, categorySpend, profile } = useFinance();
  const [dateFilter, setDateFilter] = useState({
    from: "",
    to: "",
  });

  const currency = profile.defaultCurrency || "₹";

  const filteredTransactions = useMemo(() => {
    const { from, to } = dateFilter;
    return transactions.filter((t) => {
      const d = t.date;
      if (from && d < from) return false;
      if (to && d > to) return false;
      return true;
    });
  }, [transactions, dateFilter]);

  const todayStr = new Date().toISOString().slice(0, 10);
  const todaysExpenses = filteredTransactions.filter(
    (t) => t.type === "expense" && t.date === todayStr
  );

  // Monthly spend trend
  const monthlyData = useMemo(() => {
    const map = {};
    filteredTransactions
      .filter((t) => t.type === "expense")
      .forEach((t) => {
        const key = t.date.slice(0, 7); // YYYY-MM
        map[key] = (map[key] || 0) + t.amount;
      });

    return Object.entries(map)
      .sort(([a], [b]) => (a > b ? 1 : -1))
      .map(([month, amount]) => ({ month, amount }));
  }, [filteredTransactions]);

  // Category pie chart
  const categoryData = useMemo(
    () =>
      Object.entries(categorySpend).map(([name, value]) => ({
        name,
        value,
      })),
    [categorySpend]
  );

  return (
    <section className="page page-dashboard">
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">
          Get a quick overview of your income, expenses, budgets and savings.
        </p>
      </div>

      {/* Summary cards */}
      <div className="summary-grid">
        <SummaryCard
          title="Total Income"
          value={`${currency} ${totals.totalIncome.toLocaleString()}`}
          accent="positive"
        />
        <SummaryCard
          title="Total Expenses"
          value={`${currency} ${totals.totalExpenses.toLocaleString()}`}
          accent="negative"
        />
        <SummaryCard
          title="Remaining Budget"
          value={`${currency} ${totals.remainingBudget.toLocaleString()}`}
          accent={totals.remainingBudget >= 0 ? "positive" : "negative"}
        />
        <SummaryCard
          title="Savings"
          value={`${currency} ${totals.savings.toLocaleString()}`}
          accent={totals.savings >= 0 ? "positive" : "negative"}
        />
      </div>

      {/* Date filter */}
      <div className="filter-row">
        <div>
          <label className="filter-label">From</label>
          <input
            type="date"
            value={dateFilter.from}
            onChange={(e) =>
              setDateFilter((f) => ({ ...f, from: e.target.value }))
            }
          />
        </div>
        <div>
          <label className="filter-label">To</label>
          <input
            type="date"
            value={dateFilter.to}
            onChange={(e) =>
              setDateFilter((f) => ({ ...f, to: e.target.value }))
            }
          />
        </div>
      </div>

      {/* Charts */}
      <div className="charts-grid">
        <div className="chart-card">
          <h3>Monthly Spending Trend</h3>
          {monthlyData.length === 0 ? (
            <p className="empty-text">No expense data in this range.</p>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={monthlyData}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="amount" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="chart-card">
          <h3>Expense by Category</h3>
          {categoryData.length === 0 ? (
            <p className="empty-text">No expense data to display.</p>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={categoryData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={90}
                  label
                >
                  {categoryData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Today’s expenses */}
      <div className="table-card">
        <h3>Today's Expenses ({todayStr})</h3>
        {todaysExpenses.length === 0 ? (
          <p className="empty-text">No expenses recorded for today.</p>
        ) : (
          <table className="simple-table">
            <thead>
              <tr>
                <th>Amount</th>
                <th>Category</th>
                <th>Note</th>
              </tr>
            </thead>
            <tbody>
              {todaysExpenses.map((t) => (
                <tr key={t.id}>
                  <td>
                    {currency} {t.amount.toLocaleString()}
                  </td>
                  <td>{t.category}</td>
                  <td>{t.description || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}

export default Dashboard;
