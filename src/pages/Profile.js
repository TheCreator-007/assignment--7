import React, { useState } from "react";
import { useFinance } from "../context/FinanceContext";

const currencies = ["₹", "$", "€", "£"];

function Profile() {
  const { profile, totals, updateProfile } = useFinance();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(profile);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSave = () => {
    updateProfile(form);
    setEditing(false);
  };

  return (
    <section className="page page-profile">
      <div className="page-header">
        <h1 className="page-title">Profile</h1>
        <p className="page-subtitle">
          Manage your personal details, default currency and see your lifetime
          stats.
        </p>
      </div>

      <div className="profile-grid">
        <div className="table-card">
          <h3>User Info</h3>
          <div className="profile-fields">
            <label>
              Name
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                disabled={!editing}
              />
            </label>
            <label>
              Email
              <input
                name="email"
                value={form.email}
                onChange={handleChange}
                disabled={!editing}
              />
            </label>
            <label>
              Default Currency
              <select
                name="defaultCurrency"
                value={form.defaultCurrency}
                onChange={handleChange}
                disabled={!editing}
              >
                {currencies.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="form-actions">
            {!editing ? (
              <button
                className="btn primary"
                type="button"
                onClick={() => setEditing(true)}
              >
                Edit Profile
              </button>
            ) : (
              <>
                <button
                  className="btn primary"
                  type="button"
                  onClick={handleSave}
                >
                  Save
                </button>
                <button
                  className="btn ghost"
                  type="button"
                  onClick={() => {
                    setForm(profile);
                    setEditing(false);
                  }}
                >
                  Cancel
                </button>
              </>
            )}
          </div>
        </div>

        <div className="table-card">
          <h3>Lifetime Stats</h3>
          <ul className="stats-list">
            <li>
              <span>Total Income:</span>
              <strong>
                {profile.defaultCurrency}{" "}
                {totals.totalIncome.toLocaleString()}
              </strong>
            </li>
            <li>
              <span>Total Expenses:</span>
              <strong>
                {profile.defaultCurrency}{" "}
                {totals.totalExpenses.toLocaleString()}
              </strong>
            </li>
            <li>
              <span>Total Savings:</span>
              <strong>
                {profile.defaultCurrency} {totals.savings.toLocaleString()}
              </strong>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}

export default Profile;
