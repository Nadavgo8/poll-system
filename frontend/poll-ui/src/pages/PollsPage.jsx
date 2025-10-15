import React, { useEffect, useState } from "react";
import { Card, Button, Alert, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import { api } from "../services/api";

export default function PollsPage() {
  const [rows, setRows] = useState(null);
  const [err, setErr] = useState("");

  async function load() {
    setErr("");
    try {
      const j = await api.listPolls({ limit: 100 });
      setRows(j);
    } catch (e) {
      setErr(e.message);
      setRows([]);
    }
  }

  useEffect(() => {
    load();
  }, []);

  if (!rows) return <Spinner animation="border" role="status" />;

  return (
    <Card body>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="mb-0">Polls</h4>
        <Button variant="outline-secondary" size="sm" onClick={load}>
          Refresh
        </Button>
      </div>
      {err && (
        <Alert variant="danger" className="mb-3">
          {err}
        </Alert>
      )}
      {rows.length === 0 ? (
        <div className="text-muted">
          No polls yet. <Link to="/new">Create one</Link>.
        </div>
      ) : (
        <div className="list-group">
          {rows.map((p) => (
            <Link
              key={p.id}
              to={`/p/${p.id}`}
              className="list-group-item list-group-item-action d-flex justify-content-between"
            >
              <div>
                <div className="fw-semibold">{p.title}</div>
                <small className="text-muted">
                  By {p.creator} · {new Date(p.createdAt).toLocaleString()}
                </small>
              </div>
              <div className="text-muted">
                Votes: <b>{p.totalVotes ?? 0}</b>
              </div>
            </Link>
          ))}
        </div>
      )}
    </Card>
  );
}
