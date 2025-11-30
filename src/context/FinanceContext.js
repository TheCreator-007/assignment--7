import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

const FinanceContext = createContext();

const LS_KEY = "assignment7-finance-data";

const defaultData = {
  transactions: [
    {
      id: "t1",
      type: "income",
      amount: 30000,
      category: "Salary",
      date: "2025-11-01",
      description: "Monthly salary",
    },
    {
      id: "t2",
      type: "expense",
      amount: 4000,
      category: "Groceries",
      date: "2025-11-02",
      description: "Monthly groceries",
    },
    {
      id: "t3",
      type: "expense",
      amount: 1200,
      category: "Transport",
      date: "2025-11-02",
      description: "Cab rides",
    },
    {
      id: "t4",
      type: "income",
      amount: 5000,
      category: "Freelance",
      date: "2025-11-05",
      description: "Design project",
    },
  ],
  budgets: [
    { id: "b1", category: "Groceries", limit: 10000 },
    { id: "b2", category: "Transport", limit: 3000 },
    { id: "b3", category: "Entertainment", limit: 5000 },
  ],
  profile: {
    name: "Aarav Mehta",
    email: "aarav.mehta@example.com",
    defaultCurrency: "₹",
  },
};

export function FinanceProvider({ children }) {
  const [data, setData] = useState(() => {
    const saved = localStorage.getItem(LS_KEY);
    return saved ? JSON.parse(saved) : defaultData;
  });

  const { transactions, budgets, profile } = data;

  useEffect(() => {
    localStorage.setItem(LS_KEY, JSON.stringify(data));
  }, [data]);

  // Derived totals
  const totals = useMemo(() => {
    const totalIncome = transactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = transactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    const totalBudget = budgets.reduce((sum, b) => sum + b.limit, 0);

    const remainingBudget = totalBudget - totalExpenses;
    const savings = totalIncome - totalExpenses;

    return { totalIncome, totalExpenses, totalBudget, remainingBudget, savings };
  }, [transactions, budgets]);

  // Spend per category
  const categorySpend = useMemo(() => {
    const map = {};
    transactions
      .filter((t) => t.type === "expense")
      .forEach((t) => {
        map[t.category] = (map[t.category] || 0) + t.amount;
      });
    return map;
  }, [transactions]);

  const addTransaction = (tx) => {
    setData((prev) => ({
      ...prev,
      transactions: [{ ...tx, id: crypto.randomUUID() }, ...prev.transactions],
    }));
    toast.success("Transaction added");
  };

  const updateTransaction = (id, updates) => {
    setData((prev) => ({
      ...prev,
      transactions: prev.transactions.map((t) =>
        t.id === id ? { ...t, ...updates } : t
      ),
    }));
    toast.success("Transaction updated");
  };

  const deleteTransaction = (id) => {
    setData((prev) => ({
      ...prev,
      transactions: prev.transactions.filter((t) => t.id !== id),
    }));
    toast.info("Transaction deleted");
  };

  const setBudget = (category, limit) => {
    setData((prev) => {
      const existing = prev.budgets.find((b) => b.category === category);
      let newBudgets;
      if (existing) {
        newBudgets = prev.budgets.map((b) =>
          b.category === category ? { ...b, limit } : b
        );
        toast.success("Budget updated");
      } else {
        newBudgets = [
          ...prev.budgets,
          { id: crypto.randomUUID(), category, limit },
        ];
        toast.success("Budget added");
      }
      return { ...prev, budgets: newBudgets };
    });
  };

  const updateProfile = (updates) => {
    setData((prev) => ({
      ...prev,
      profile: { ...prev.profile, ...updates },
    }));
    toast.success("Profile updated");
  };

  // Overspend warning – check whenever transactions/budgets change
  useEffect(() => {
    budgets.forEach((b) => {
      const spent = categorySpend[b.category] || 0;
      if (spent > b.limit) {
        toast.error(`Budget exceeded for ${b.category}`, { toastId: b.id });
      }
    });
  }, [budgets, categorySpend]);

  return (
    <FinanceContext.Provider
      value={{
        transactions,
        budgets,
        profile,
        totals,
        categorySpend,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        setBudget,
        updateProfile,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
}

export const useFinance = () => useContext(FinanceContext);
