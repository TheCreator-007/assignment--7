import React from "react";

function SummaryCard({ title, value, accent }) {
  return (
    <div className="summary-card">
      <p className="summary-title">{title}</p>
      <p className={`summary-value ${accent || ""}`}>{value}</p>
    </div>
  );
}

export default SummaryCard;
