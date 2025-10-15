import React from "react";
import { ProgressBar } from "react-bootstrap";

export default function ResultsList({ options, total }) {
  return (
    <div>
      <div className="text-muted mb-2">Total votes: {total}</div>
      {options.map((o) => (
        <div key={o.id} className="mb-3">
          <div className="d-flex justify-content-between align-items-center mb-1">
            <strong>{o.text}</strong>
            <span>
              {o.votes} ({o.percentage}%)
            </span>
          </div>
          <ProgressBar now={o.percentage} />
        </div>
      ))}
    </div>
  );
}
